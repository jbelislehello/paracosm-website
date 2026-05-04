import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, AlertCircle, RefreshCw, Search, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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

const STALE_TIME = 5 * 60 * 1000; // 5 min
const GC_TIME = 30 * 60 * 1000; // 30 min
const cacheKey = (limit: number) => `recent-dreams:v1:${limit}`;

interface CachedPayload {
  data: RecentDream[];
  updatedAt: number;
}

function readCache(limit: number): CachedPayload | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(limit));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (!Array.isArray(parsed?.data) || typeof parsed?.updatedAt !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(limit: number, data: RecentDream[]) {
  try {
    sessionStorage.setItem(
      cacheKey(limit),
      JSON.stringify({ data, updatedAt: Date.now() } satisfies CachedPayload),
    );
  } catch {
    // quota or unavailable — ignore
  }
}

function formatRelative(ts: number): string {
  if (!ts) return 'just now';
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString();
}

interface RecentDreamsProps {
  limit?: number;
}

const RecentDreams: React.FC<RecentDreamsProps> = ({ limit = 6 }) => {
  const cached = React.useMemo(() => readCache(limit), [limit]);
  const [query, setQuery] = React.useState('');

  const { data: dreams, isPending, isError, refetch, isFetching, dataUpdatedAt } = useQuery<RecentDream[]>({
    queryKey: ['recent-dreams', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dream_runs')
        .select('id, share_slug, question, summary, created_at, overall_maturity')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      const rows = (data ?? []) as unknown as RecentDream[];
      writeCache(limit, rows);
      return rows;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.updatedAt,
  });

  // Toast on error, but only when we have nothing to show (otherwise stay silent and keep cached data visible).
  const errorToastedRef = React.useRef(false);
  React.useEffect(() => {
    if (isError && !errorToastedRef.current) {
      errorToastedRef.current = true;
      toast.error("Couldn't load recent dreams", {
        description: "Check your connection and try again.",
        action: { label: 'Retry', onClick: () => { errorToastedRef.current = false; refetch(); } },
      });
    }
    if (!isError) errorToastedRef.current = false;
  }, [isError, refetch]);

  // Skeleton only on first-ever load (no cache, no data yet).
  if (isPending && !dreams) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-busy="true"
        aria-label="Loading recent dreams"
      >
        {Array.from({ length: limit }).map((_, i) => (
          <Card key={i} className="h-full border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="skeleton-shimmer h-3 w-24 mb-3" />
              <Skeleton className="skeleton-shimmer h-4 w-full mb-2" />
              <Skeleton className="skeleton-shimmer h-4 w-4/5" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="skeleton-shimmer h-3 w-full" />
              <Skeleton className="skeleton-shimmer h-3 w-11/12" />
              <Skeleton className="skeleton-shimmer h-3 w-3/4" />
              <div className="flex flex-wrap gap-1 pt-1">
                <Skeleton className="skeleton-shimmer h-4 w-12 rounded-full" />
                <Skeleton className="skeleton-shimmer h-4 w-14 rounded-full" />
                <Skeleton className="skeleton-shimmer h-4 w-10 rounded-full" />
              </div>
              <Skeleton className="skeleton-shimmer h-3 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Only block the UI with error card when there's no cached/previous data to show.
  if (isError && !dreams) {
    return (
      <Card className="p-8 text-center bg-muted/20 border-dashed">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">
          We couldn't load recent dreams right now.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Try again
        </Button>
      </Card>
    );
  }

  const filteredDreams = React.useMemo(() => {
    if (!dreams) return [];
    const q = query.trim().toLowerCase();
    if (!q) return dreams;
    return dreams.filter(
      (d) =>
        d.question.toLowerCase().includes(q) ||
        (d.summary ?? '').toLowerCase().includes(q),
    );
  }, [dreams, query]);

  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between mb-3">
      <div className="relative w-full sm:max-w-xs">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gardens of dreams…"
          aria-label="Search recent dreams"
          className="h-9 pl-8 pr-8 text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {dreams && dreams.length > 0 ? `Updated ${formatRelative(dataUpdatedAt)}` : ''}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Refresh recent dreams"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );

  if (!dreams || dreams.length === 0) {
    return (
      <div>
        {toolbar}
        <Card className="p-8 text-center bg-muted/20 border-dashed">
          <Sparkles className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No public gardens of dreams yet. Be the first to plant one.
          </p>
        </Card>
      </div>
    );
  }

  if (filteredDreams.length === 0) {
    return (
      <div>
        {toolbar}
        <Card className="p-8 text-center bg-muted/20 border-dashed">
          <Search className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            No dreams match "{query}".
          </p>
          <Button variant="ghost" size="sm" onClick={() => setQuery('')}>
            Clear search
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {toolbar}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDreams.map((d) => {
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
    </div>
  );
};

export default RecentDreams;
