import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Loader2, Save } from "lucide-react";
import { exportReadinessPdf } from "@/lib/readiness/exportPdf";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import Footer from "@/components/Footer";
import TileQuestionCard from "@/components/readiness/TileQuestionCard";
import SeasonResultCard from "@/components/readiness/SeasonResultCard";
import ShareReadinessDialog from "@/components/readiness/ShareReadinessDialog";
import { buildSnapshot } from "@/lib/readiness/shares";

import { SEASONS, SEASON_BY_ID, SEASON_ORDER } from "@/lib/readiness/data";
import {
  computeOverallScore,
  computeSeasonScore,
  countAnswered,
  isSeasonComplete,
} from "@/lib/readiness/scoring";
import type { AnswersMap, SeasonId, TileAnswer } from "@/lib/readiness/types";

const emptyAnswers: AnswersMap = {
  pollens: {},
  noems: {},
  poems: {},
  totems: {},
  anthems: {},
};

const TILES_PER_PAGE = 4;

export default function ReadinessAssessment() {
  usePageSeo({
    title: "Calm Magic Readiness Assessment | Paracosm",
    description:
      "A 5-season, 320-tile diagnostic mapping personal readiness against organizational maturity for relational AI adoption.",
    path: "/readiness",
  });

  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeSeason, setActiveSeason] = useState<SeasonId>("pollens");
  const [pageByseason, setPageBySeason] = useState<Record<SeasonId, number>>({
    pollens: 0,
    noems: 0,
    poems: 0,
    totems: 0,
    anthems: 0,
  });
  const [answers, setAnswers] = useState<AnswersMap>(emptyAnswers);

  // -----------------------------------------------------
  // Auth + load-or-create current session
  // -----------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data?.user?.id ?? null;
      if (cancelled) return;
      if (!uid) {
        toast.info("Sign in to save your readiness assessment.");
        navigate("/auth?redirect=/readiness");
        return;
      }
      setUserId(uid);
      setUserEmail(data?.user?.email ?? null);

      // Find most recent incomplete session, or create one
      const { data: sessions } = await supabase
        .from("readiness_sessions")
        .select("id, season_scores")
        .eq("user_id", uid)
        .is("completed_at", null)
        .order("created_at", { ascending: false })
        .limit(1);

      let sid = sessions?.[0]?.id as string | undefined;
      if (!sid) {
        const { data: created, error } = await supabase
          .from("readiness_sessions")
          .insert({ user_id: uid })
          .select("id")
          .single();
        if (error || !created) {
          toast.error("Could not start assessment.");
          return;
        }
        sid = created.id;
      }
      setSessionId(sid);

      // Load answers for this session
      const { data: rows } = await supabase
        .from("readiness_answers")
        .select("season_id, tile_id, personal_answer_index, organizational_answer_index, open_text")
        .eq("session_id", sid);

      if (rows && !cancelled) {
        const next: AnswersMap = { pollens: {}, noems: {}, poems: {}, totems: {}, anthems: {} };
        for (const r of rows) {
          const sid = r.season_id as SeasonId;
          next[sid][r.tile_id] = {
            personal: r.personal_answer_index,
            organizational: r.organizational_answer_index,
            openText: r.open_text ?? undefined,
          };
        }
        setAnswers(next);
      }
      setLoadingSession(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const season = SEASON_BY_ID[activeSeason];
  const page = pageByseason[activeSeason];
  const pageCount = Math.ceil(season.tiles.length / TILES_PER_PAGE);
  const pageTiles = season.tiles.slice(page * TILES_PER_PAGE, (page + 1) * TILES_PER_PAGE);

  const seasonScores = useMemo(() => {
    return SEASONS.map((s) => ({
      seasonId: s.seasonId,
      complete: isSeasonComplete(s, answers[s.seasonId]),
      score: computeSeasonScore(s, answers[s.seasonId]),
      answered: countAnswered(s, answers[s.seasonId]),
    }));
  }, [answers]);

  const overall = useMemo(
    () => computeOverallScore(seasonScores.filter((s) => s.complete).map((s) => s.score)),
    [seasonScores],
  );

  // -----------------------------------------------------
  // Answer mutation with debounced upsert
  // -----------------------------------------------------
  const persistAnswer = useCallback(
    async (seasonId: SeasonId, tileId: string, next: TileAnswer) => {
      if (!sessionId || !userId) return;
      const tile = SEASON_BY_ID[seasonId].tiles.find((t) => t.id === tileId);
      if (!tile) return;
      if (next.personal < 0 && next.organizational < 0 && !next.openText) return;
      const { error } = await supabase.from("readiness_answers").upsert(
        {
          session_id: sessionId,
          user_id: userId,
          season_id: seasonId,
          tile_id: tileId,
          zone: tile.zone,
          personal_answer_index: next.personal,
          organizational_answer_index: next.organizational,
          open_text: next.openText ?? null,
        },
        { onConflict: "session_id,season_id,tile_id" },
      );
      if (error) console.warn("readiness_answers upsert failed", error);
    },
    [sessionId, userId],
  );

  const updateAnswer = (tileId: string, next: TileAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [activeSeason]: { ...prev[activeSeason], [tileId]: next },
    }));
    void persistAnswer(activeSeason, tileId, next);
  };

  // -----------------------------------------------------
  // Finalize / recompute stored aggregate scores
  // -----------------------------------------------------
  const saveScores = async () => {
    if (!sessionId) return;
    setSaving(true);
    try {
      const seasonScoreMap: Record<string, unknown> = {};
      const completed: string[] = [];
      for (const s of seasonScores) {
        seasonScoreMap[s.seasonId] = s.score;
        if (s.complete) completed.push(s.seasonId);
      }
      const allDone = completed.length === SEASON_ORDER.length;
      await supabase
        .from("readiness_sessions")
        .update({
          season_scores: seasonScoreMap as never,
          overall_score: overall as never,
          seasons_completed: completed,
          completed_at: allDone ? new Date().toISOString() : null,
        })
        .eq("id", sessionId);
      toast.success(allDone ? "Assessment complete — snapshot saved." : "Progress saved.");
    } catch (e) {
      toast.error("Could not save scores.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <EditorialSiteHeader />
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const activeSummary = seasonScores.find((s) => s.seasonId === activeSeason)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to portfolio
          </Link>
          <h1 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
            Calm Magic Readiness Assessment
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Five seasons · 320 tiles · dual-axis diagnostic. Each tile measures both your personal
            readiness and your organization&apos;s maturity. The gap between them is the signal
            before introducing relational AI.
          </p>
        </header>

        {/* Season selector */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {SEASONS.map((s) => {
            const summary = seasonScores.find((x) => x.seasonId === s.seasonId)!;
            const isActive = activeSeason === s.seasonId;
            return (
              <button
                key={s.seasonId}
                onClick={() => setActiveSeason(s.seasonId)}
                className="rounded-xl border p-3 text-left transition-all"
                style={{
                  borderColor: isActive ? s.color : undefined,
                  backgroundColor: isActive ? `${s.color}12` : undefined,
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: s.color }}
                >
                  {s.season}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.axis}</div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-mono">
                    {summary.answered}/{s.tiles.length}
                  </span>
                  {summary.complete && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Season header */}
        <div
          className="mb-6 rounded-2xl border border-border p-5"
          style={{ backgroundColor: `${season.color}0A` }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: season.color }}
          >
            {season.season} · {season.axis}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{season.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>
              Page {page + 1} / {pageCount}
            </span>
            <span className="opacity-40">·</span>
            <span>
              {activeSummary.answered}/{season.tiles.length} answered
            </span>
            {activeSummary.complete && (
              <span className="ml-auto font-mono text-foreground">
                P {activeSummary.score.personal} · O {activeSummary.score.organizational} · Gap{" "}
                {activeSummary.score.gap > 0 ? "+" : ""}
                {activeSummary.score.gap}
              </span>
            )}
          </div>
        </div>

        {/* Tile grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {pageTiles.map((tile, i) => (
            <TileQuestionCard
              key={tile.id}
              tile={tile}
              index={page * TILES_PER_PAGE + i}
              total={season.tiles.length}
              answer={answers[activeSeason][tile.id]}
              onChange={(next) => updateAnswer(tile.id, next)}
              seasonColor={season.color}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setPageBySeason((p) => ({ ...p, [activeSeason]: Math.max(0, p[activeSeason] - 1) }))
            }
            disabled={page === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Page {page + 1} / {pageCount}
          </div>
          {page < pageCount - 1 ? (
            <Button
              onClick={() =>
                setPageBySeason((p) => ({
                  ...p,
                  [activeSeason]: Math.min(pageCount - 1, p[activeSeason] + 1),
                }))
              }
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                const idx = SEASON_ORDER.indexOf(activeSeason);
                if (idx < SEASON_ORDER.length - 1) {
                  setActiveSeason(SEASON_ORDER[idx + 1]);
                  setPageBySeason((p) => ({ ...p, [SEASON_ORDER[idx + 1]]: 0 }));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={SEASON_ORDER.indexOf(activeSeason) === SEASON_ORDER.length - 1}
            >
              Next season <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Results panel */}
        <section className="mt-14">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-2xl">Live snapshot</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() =>
                  exportReadinessPdf({ answers, seasonScores, overall, userEmail })
                }
                size="sm"
                variant="outline"
                disabled={seasonScores.every((s) => s.answered === 0)}
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <ShareReadinessDialog
                sessionId={sessionId}
                ownerId={userId}
                buildSnapshot={() =>
                  buildSnapshot({ ownerEmail: userEmail, overall, seasonScores, answers })
                }
              />
              <Button onClick={saveScores} disabled={saving} size="sm" variant="secondary">
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save progress
              </Button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card/60 p-5 sm:grid-cols-4">
            <Stat label="Personal (overall)" value={overall.personal} />
            <Stat label="Organizational (overall)" value={overall.organizational} />
            <Stat
              label="Gap"
              value={`${overall.gap > 0 ? "+" : ""}${overall.gap}`}
            />
            <Stat label="Composite" value={overall.composite} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {SEASONS.map((s) => {
              const summary = seasonScores.find((x) => x.seasonId === s.seasonId)!;
              if (summary.answered === 0) return null;
              return <SeasonResultCard key={s.seasonId} season={s} score={summary.score} />;
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl">{value}</div>
    </div>
  );
}
