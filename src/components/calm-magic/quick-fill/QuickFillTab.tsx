import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Play, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { QuickFillBoard } from './QuickFillBoard';
import { QUICK_FILL_TILES } from './quickFillTiles';

interface Props {
  prdId: string;
  initial?: {
    questions?: string[];
    answers?: Record<number, string>;
    generated_at?: string;
  } | null;
}

export const QuickFillTab = ({ prdId, initial }: Props) => {
  const [questionsText, setQuestionsText] = useState((initial?.questions ?? []).join('\n'));
  const [answers, setAnswers] = useState<Record<number, string>>(initial?.answers ?? {});
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const [running, setRunning] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | undefined>(initial?.generated_at);

  const run = async () => {
    const questions = questionsText
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    setRunning(true);
    setAnswers({});
    setLoadingIds(new Set(QUICK_FILL_TILES.map((t) => t.id)));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in');
        return;
      }
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prd-quick-fill`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ prd_id: prdId, questions }),
      });
      if (!resp.ok || !resp.body) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let currentEvent = '';
      let done = false;
      while (!done) {
        const { value, done: rdDone } = await reader.read();
        if (rdDone) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf('\n')) !== -1) {
          const line = buf.slice(0, idx).replace(/\r$/, '');
          buf = buf.slice(idx + 1);
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const json = line.slice(6).trim();
            if (!json) continue;
            try {
              const parsed = JSON.parse(json);
              if (currentEvent === 'tile') {
                setAnswers((prev) => ({ ...prev, [parsed.tile_id]: parsed.answer }));
                setLoadingIds((prev) => {
                  const next = new Set(prev);
                  next.delete(parsed.tile_id);
                  return next;
                });
              } else if (currentEvent === 'done') {
                setGeneratedAt(parsed.generated_at);
                done = true;
              } else if (currentEvent === 'error') {
                toast.error(parsed.message || 'AI error');
                if (parsed.code === 429 || parsed.code === 402) done = true;
              }
            } catch {
              /* swallow partial */
            }
          } else if (line === '') {
            currentEvent = '';
          }
        }
      }
      toast.success('Quick Fill complete & saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Quick Fill failed');
    } finally {
      setRunning(false);
      setLoadingIds(new Set());
    }
  };

  const exportMarkdown = () => {
    const lines: string[] = [`# Quick Fill Board\n`];
    if (generatedAt) lines.push(`_Generated: ${new Date(generatedAt).toLocaleString()}_\n`);
    for (const t of QUICK_FILL_TILES) {
      lines.push(`## #${t.id} ${t.name} — ${t.rowName} × ${t.colName} (${t.phase})`);
      lines.push(answers[t.id] || '_(empty)_');
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quick-fill-${prdId.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setAnswers({});
    setGeneratedAt(undefined);
  };

  const filledCount = Object.values(answers).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Quick Fill Board</h3>
          <p className="text-sm text-muted-foreground">
            Paste your questions (one per line). The PRD context above + your questions are sent through every Calm Magic tile to produce a first-chapter analysis across all 64 cells.
          </p>
        </div>
        <Textarea
          value={questionsText}
          onChange={(e) => setQuestionsText(e.target.value)}
          placeholder={`What is the riskiest assumption?\nWho really benefits if this works?\nWhat would we stop doing?`}
          rows={5}
          disabled={running}
        />
        <div className="flex flex-wrap gap-2 items-center">
          <Button onClick={run} disabled={running}>
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            {running ? 'Filling…' : 'Run Quick Fill'}
          </Button>
          <Button variant="outline" onClick={exportMarkdown} disabled={filledCount === 0 || running}>
            <Download className="mr-2 h-4 w-4" /> Export Markdown
          </Button>
          <Button variant="ghost" onClick={clear} disabled={filledCount === 0 || running}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
          <span className="text-xs text-muted-foreground ml-auto">
            {filledCount}/64 filled{generatedAt ? ` · ${new Date(generatedAt).toLocaleString()}` : ''}
          </span>
        </div>
      </Card>

      <QuickFillBoard answers={answers} loadingTileIds={loadingIds} />
    </div>
  );
};
