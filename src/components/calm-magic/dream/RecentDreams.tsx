import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface RecentDream {
  id: string;
  share_slug: string;
  question: string;
  summary: string | null;
  created_at: string;
  overall_maturity: Record<string, number> | null;
}

const AXIS_KEYS = ['love', 'magic', 'calm', 'open', 'free'] as const;
const AXIS_LABELS: Record<string, string> = {
  love: 'LOVE', magic: 'MAGIC', calm: 'CALM', open: 'OPEN', free: 'FREE',
};

interface RecentDreamsProps {
  limit?: number;
}

const RecentDreams: React.FC<RecentDreamsProps> = ({ limit = 6 }) => {
  const [dreams, setDreams] = useState<RecentDream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const fetchDreams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('dream_runs')
        .select('id, share_slug, question, summary, created_at, overall_maturity')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (cancelledRef.current) return;
      if (sbError) throw sbError;
      setDreams((data ?? []) as unknown as RecentDream[]);
    } catch (err) {
      console.error('[RecentDreams] Failed to load dreams:', err);
      if (!cancelledRef.current) {
        setError("We couldn't load recent dreams right now.");
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    cancelledRef.current = false;
    fetchDreams();
    return () => { cancelledRef.current = true; };
  }, [fetchDreams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading recent dreams…</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center bg-muted/20 border-dashed">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchDreams}>
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Try again
        </Button>
      </Card>
    );
  }

  if (dreams.length === 0) {
    return (
      <Card className="p-8 text-center bg-muted/20 border-dashed">
        <Sparkles className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No public dreams yet. Be the first to dream a PRD.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dreams.map((d) => {
        const m = d.overall_maturity ?? {};
        return (
          <Link
            key={d.id}
            to={`/dream/${d.share_slug}`}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          >
            <Card className="h-full border-border/60 hover:border-primary/40 transition-colors bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>{new Date(d.created_at).toLocaleDateString()}</span>
                </div>
                <CardTitle className="text-base leading-snug line-clamp-3 italic font-medium">
                  "{d.question}"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {d.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {d.summary}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {AXIS_KEYS.map((k) => {
                    const v = typeof m[k] === 'number' ? Math.round(m[k] * 100) : null;
                    if (v === null || v <= 0) return null;
                    return (
                      <Badge
                        key={k}
                        variant="outline"
                        className="text-[9px] font-mono tabular-nums px-1.5 py-0"
                      >
                        {AXIS_LABELS[k]} {v}%
                      </Badge>
                    );
                  })}
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-primary group-hover:underline underline-offset-4">
                  Open dream <ArrowRight className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default RecentDreams;
