import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { usePageSeo } from "@/hooks/usePageSeo";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import Footer from "@/components/Footer";

const FUNNEL_STEPS: { key: string; label: string; description: string }[] = [
  {
    key: "home_readiness_cta_click",
    label: "Homepage CTA clicked",
    description: "Clicks on the hero “Take the Readiness Assessment” button.",
  },
  {
    key: "readiness_assessment_viewed",
    label: "Assessment page viewed",
    description: "Users who reached /readiness (auth-gated).",
  },
  {
    key: "readiness_assessment_started",
    label: "Assessment started",
    description: "A new readiness_sessions row was created.",
  },
  {
    key: "readiness_assessment_progress_saved",
    label: "Progress saved",
    description: "At least one season complete, snapshot persisted.",
  },
  {
    key: "readiness_assessment_completed",
    label: "Assessment completed",
    description: "All five seasons complete and snapshot saved.",
  },
];

const RANGES = [
  { key: "7d", label: "Last 7 days", days: 7 },
  { key: "30d", label: "Last 30 days", days: 30 },
  { key: "90d", label: "Last 90 days", days: 90 },
  { key: "all", label: "All time", days: null as number | null },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

type Counts = Record<string, { total: number; unique: number }>;

export default function AdminReadinessFunnel() {
  usePageSeo({
    title: "Readiness funnel · Admin | Paracosm",
    description: "Conversion funnel from homepage CTA to completed readiness assessments.",
    path: "/admin/readiness-funnel",
  });

  const { isAdmin, isLoading: adminLoading } = useAdminStatus();
  const [range, setRange] = useState<RangeKey>("30d");
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState<Counts>({});
  const [error, setError] = useState<string | null>(null);

  const sinceIso = useMemo(() => {
    const cfg = RANGES.find((r) => r.key === range);
    if (!cfg || cfg.days === null) return null;
    return new Date(Date.now() - cfg.days * 24 * 60 * 60 * 1000).toISOString();
  }, [range]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("analytics_events")
        .select("event_name, session_id")
        .in(
          "event_name",
          FUNNEL_STEPS.map((s) => s.key),
        )
        .limit(50000);
      if (sinceIso) query = query.gte("created_at", sinceIso);
      const { data, error } = await query;
      if (error) throw error;

      const next: Counts = {};
      const seen: Record<string, Set<string>> = {};
      for (const step of FUNNEL_STEPS) {
        next[step.key] = { total: 0, unique: 0 };
        seen[step.key] = new Set();
      }
      for (const row of data ?? []) {
        const bucket = next[row.event_name as string];
        if (!bucket) continue;
        bucket.total += 1;
        if (row.session_id) seen[row.event_name as string].add(row.session_id as string);
      }
      for (const step of FUNNEL_STEPS) next[step.key].unique = seen[step.key].size;
      setCounts(next);
    } catch (e) {
      setError((e as Error).message ?? "Could not load funnel data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, sinceIso]);

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <EditorialSiteHeader />
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <EditorialSiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-serif text-3xl">Admin only</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This funnel report is restricted to administrators.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const first = counts[FUNNEL_STEPS[0].key]?.unique ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8">
          <Link
            to="/admin/subscriptions"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Admin
          </Link>
          <h1 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
            Readiness conversion funnel
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Homepage CTA → assessment view → started → progress saved → completed. Unique counts
            are per anonymous session; totals are raw event counts.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                range === r.key
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => void load()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {FUNNEL_STEPS.map((step, i) => {
            const c = counts[step.key] ?? { total: 0, unique: 0 };
            const prev =
              i === 0 ? c.unique : counts[FUNNEL_STEPS[i - 1].key]?.unique ?? 0;
            const stepRate = prev > 0 ? Math.round((c.unique / prev) * 100) : 0;
            const overallRate =
              first > 0 ? Math.round((c.unique / first) * 100) : i === 0 ? 100 : 0;
            const barPct = first > 0 ? Math.max(4, (c.unique / first) * 100) : 4;
            return (
              <div
                key={step.key}
                className="rounded-2xl border border-border bg-card/60 p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Step {i + 1}
                    </div>
                    <h2 className="mt-1 font-serif text-xl">{step.label}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                    <code className="mt-1 inline-block text-[10px] text-muted-foreground/80">
                      {step.key}
                    </code>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-3xl">{c.unique}</div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      unique · {c.total} events
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>Step conversion: {stepRate}%</span>
                  <span>vs. step 1: {overallRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
