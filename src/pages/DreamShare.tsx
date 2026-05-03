import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Play, Square, Sparkles } from 'lucide-react';
import DreamBoardView, { type SavedAxis } from '@/components/calm-magic/dream/DreamBoardView';
import usePageSeo from '@/hooks/usePageSeo';

interface DreamRun {
  id: string;
  share_slug: string;
  question: string;
  filename: string | null;
  axes: SavedAxis[];
  summary: string | null;
  overall_maturity: Record<string, number> | null;
  created_at: string;
}

const DreamShare: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [run, setRun] = useState<DreamRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replay state: when replaying, axes appear one at a time, staggered.
  const [replaying, setReplaying] = useState(false);
  const [revealedCount, setRevealedCount] = useState<number>(Infinity);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data, error } = await supabase
        .from('dream_runs')
        .select('id, share_slug, question, filename, axes, summary, overall_maturity, created_at')
        .eq('share_slug', slug)
        .maybeSingle();
      if (error) setError(error.message);
      else if (!data) setError('Dream not found');
      else setRun(data as unknown as DreamRun);
      setLoading(false);
    })();
  }, [slug]);

  // Replay: reveal axes one by one every 1.4s.
  useEffect(() => {
    if (!replaying || !run) return;
    setRevealedCount(0);
    const total = run.axes.length;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setRevealedCount(i);
      if (i >= total) {
        window.clearInterval(id);
        // Hold final state, but keep summary visible after a beat.
        window.setTimeout(() => setReplaying(false), 1200);
      }
    }, 1400);
    return () => window.clearInterval(id);
  }, [replaying, run]);

  const visibleAxes = useMemo<SavedAxis[]>(() => {
    if (!run) return [];
    if (!Number.isFinite(revealedCount)) return run.axes;
    return run.axes.slice(0, revealedCount);
  }, [run, revealedCount]);

  const seoTitle = run
    ? `Dream: ${run.question.slice(0, 60)}${run.question.length > 60 ? '…' : ''}`
    : 'Shared Dream — Calm Magic';
  const seoDesc = run?.summary
    ? run.summary.slice(0, 158)
    : run
      ? `A 5-axis Calm Magic dream of: "${run.question}"`.slice(0, 158)
      : 'A shared dream from the Calm Magic board — inventivity & expressivity.';

  usePageSeo({
    title: seoTitle,
    description: seoDesc,
    path: `/dream/${slug ?? ''}`,
    ogType: 'article',
  });

  return (
    <div className="min-h-screen bg-background">

      <header className="border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Dream Mode</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <h1 className="sr-only">Shared dream of the Calm Magic board</h1>
        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-20">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading dream…</span>
          </div>
        )}
        {error && !loading && (
          <Card className="p-6 text-center space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" asChild><Link to="/">Back home</Link></Button>
          </Card>
        )}
        {run && !loading && (
          <>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant={replaying ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setReplaying((r) => !r)}
                className="gap-2"
              >
                {replaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {replaying ? 'Stop replay' : 'Replay dream'}
              </Button>
              <Button asChild size="sm" className="gap-2">
                <Link to="/dream-and-learn">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dream your own
                </Link>
              </Button>
            </div>

            <DreamBoardView
              question={run.question}
              filename={run.filename}
              axes={visibleAxes}
              summary={replaying && revealedCount < run.axes.length ? null : run.summary}
              createdAt={run.created_at}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default DreamShare;
