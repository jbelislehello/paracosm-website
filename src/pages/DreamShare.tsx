import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import DreamBoardView, { type SavedAxis } from '@/components/calm-magic/dream/DreamBoardView';

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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{run ? `Dream: ${run.question.slice(0, 60)}` : 'Dream'}</title>
        <meta name="description" content={run?.summary?.slice(0, 155) || 'A Calm Magic board dreaming through a PRD.'} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>

      <header className="border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Dream Mode</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
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
          <DreamBoardView
            question={run.question}
            filename={run.filename}
            axes={run.axes}
            summary={run.summary}
            createdAt={run.created_at}
          />
        )}
      </main>
    </div>
  );
};

export default DreamShare;
