import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { AXIS_META, type DreamAxis } from '@/data/dreamPrompts';
import { Loader2 } from 'lucide-react';

interface DreamSequenceProps {
  question: string;
  file: File;
  onRestart: () => void;
}

interface AxisState {
  key: DreamAxis;
  tile_keys: string[];
  narration: string;
  done: boolean;
}

const DreamSequence: React.FC<DreamSequenceProps> = ({ question, file, onRestart }) => {
  const [axes, setAxes] = useState<AxisState[]>([]);
  const [activeAxis, setActiveAxis] = useState<DreamAxis | null>(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        const form = new FormData();
        form.append('file', file);
        form.append('question', question);

        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dream-prd-analysis`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: form,
        });

        if (!resp.ok || !resp.body) {
          const txt = await resp.text();
          let msg = 'Something went wrong';
          try { msg = JSON.parse(txt).error || msg; } catch { /* */ }
          setError(msg);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';

        while (true) {
          const { done: rd, value } = await reader.read();
          if (rd) break;
          buf += decoder.decode(value, { stream: true });

          let sepIdx: number;
          while ((sepIdx = buf.indexOf('\n\n')) !== -1) {
            const block = buf.slice(0, sepIdx);
            buf = buf.slice(sepIdx + 2);

            const lines = block.split('\n');
            let event = 'message';
            let data = '';
            for (const l of lines) {
              if (l.startsWith('event: ')) event = l.slice(7).trim();
              else if (l.startsWith('data: ')) data += l.slice(6);
            }
            if (!data) continue;
            let payload: any = {};
            try { payload = JSON.parse(data); } catch { continue; }

            if (event === 'axis_begin') {
              setAxes((prev) => [...prev, { key: payload.key, tile_keys: payload.tile_keys || [], narration: '', done: false }]);
              setActiveAxis(payload.key);
            } else if (event === 'narration') {
              setAxes((prev) => prev.map((a) => a.key === payload.key ? { ...a, narration: a.narration + payload.delta } : a));
            } else if (event === 'axis_end') {
              setAxes((prev) => prev.map((a) => a.key === payload.key ? { ...a, done: true } : a));
            } else if (event === 'summary') {
              setSummary(payload.text || '');
            } else if (event === 'done') {
              setDone(true);
              setActiveAxis(null);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Stream failed');
      }
    };

    run();
  }, [file, question]);

  const AXIS_ORDER: DreamAxis[] = ['love', 'magic', 'calm', 'open', 'free'];
  const axisProgress = (key: DreamAxis): number => {
    const a = axes.find(x => x.key === key);
    if (!a) return 0;
    if (a.done) return 1;
    return Math.min(0.9, 0.4 + Math.min(a.narration.length, 200) / 200 * 0.5);
  };
  const overallPct = Math.min(100, Math.round(
    (AXIS_ORDER.reduce((s, k) => s + axisProgress(k), 0) / 5) * 95 + (summary ? 5 : 0)
  ));

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">The board is dreaming</p>
        <p className="text-sm italic">"{question}"</p>
      </div>

      {!error && (
        <div className="space-y-2" role="status" aria-live="polite" aria-label={`Dream progress: ${overallPct}%`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {done ? 'Dream complete' : activeAxis ? `Channeling ${AXIS_META[activeAxis].label.toLowerCase()}…` : 'Reading your PRD…'}
            </span>
            <span className="font-mono tabular-nums text-muted-foreground">{overallPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 via-purple-400 to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="flex gap-2">
            {AXIS_ORDER.map((key) => {
              const meta = AXIS_META[key];
              const p = axisProgress(key);
              const isActive = activeAxis === key;
              const isDone = !!axes.find(a => a.key === key)?.done;
              return (
                <div key={key} className="flex-1 flex items-center gap-1.5 min-w-0">
                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isActive ? 'animate-pulse' : ''}`}
                      style={{ width: `${p * 100}%`, backgroundColor: meta.color }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-bold tracking-wider w-7 text-right tabular-nums shrink-0"
                    style={{ color: isDone || isActive ? meta.color : 'hsl(var(--muted-foreground))' }}
                    title={`${meta.label}: ${Math.round(p * 100)}%`}
                  >
                    {isDone ? '✓' : `${Math.round(p * 100)}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={onRestart}>Start over</Button>
        </Card>
      )}

      {/* The five-axis "board" answering itself */}
      <div className="grid gap-3 md:grid-cols-5">
        {(['love','magic','calm','open','free'] as DreamAxis[]).map((key) => {
          const meta = AXIS_META[key];
          const axisState = axes.find(a => a.key === key);
          const isActive = activeAxis === key;
          const isLit = !!axisState;
          return (
            <Card
              key={key}
              className={`p-3 transition-all duration-700 relative overflow-hidden ${
                isLit ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
              } ${isActive ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
              style={{
                borderColor: isLit ? meta.color : undefined,
                boxShadow: isActive ? `0 0 24px ${meta.color}55` : undefined,
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-10 ${isActive ? 'animate-pulse' : ''}`} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl" style={{ color: meta.color }}>{meta.symbol}</span>
                  <span className="text-xs font-bold tracking-widest" style={{ color: meta.color }}>{meta.label}</span>
                </div>
                <div className="space-y-1 min-h-[3rem]">
                  {axisState?.tile_keys.map((t, i) => (
                    <div
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 inline-block mr-1 mb-1 animate-fade-in"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Streaming narration */}
      <Card className="p-4 min-h-[160px] bg-muted/20">
        {axes.length === 0 && !error ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Reading your PRD…</span>
          </div>
        ) : (
          <div className="space-y-4">
            {axes.map((a) => {
              const meta = AXIS_META[a.key];
              return (
                <div key={a.key} className="space-y-1">
                  <div className="text-xs font-bold tracking-widest" style={{ color: meta.color }}>
                    {meta.symbol} {meta.label}
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                    <ReactMarkdown>{a.narration}</ReactMarkdown>
                    {!a.done && activeAxis === a.key && <span className="inline-block w-2 h-4 bg-foreground/60 animate-pulse align-middle" />}
                  </div>
                </div>
              );
            })}
            {summary && (
              <div className="pt-3 border-t border-border/50 text-sm italic text-muted-foreground">
                {summary}
              </div>
            )}
          </div>
        )}
      </Card>

      {done && (
        <div className="text-center">
          <Button variant="outline" onClick={onRestart}>Dream again</Button>
        </div>
      )}
    </div>
  );
};

export default DreamSequence;
