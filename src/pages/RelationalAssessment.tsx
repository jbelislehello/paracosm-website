import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, HelpCircle, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import Footer from "@/components/Footer";

import RelationalQuestionCard from "@/components/relational/RelationalQuestionCard";
import DimensionResultCard from "@/components/relational/DimensionResultCard";
import RelationalOnboardingModal, {
  hasSeenRelationalOnboarding,
} from "@/components/relational/RelationalOnboardingModal";
import ShareReadinessDialog from "@/components/readiness/ShareReadinessDialog";

import { DIMENSIONS, DIMENSION_BY_ID, TOTAL_QUESTIONS, emptyRelationalAnswers } from "@/lib/relational/data";
import {
  computeAllDimensionScores,
  computeRelationalOverall,
  countAnswered,
  strongestAndWeakest,
} from "@/lib/relational/scoring";
import { exportRelationalPdf } from "@/lib/relational/exportPdf";
import { buildRelationalSnapshot, createRelationalShare } from "@/lib/relational/shares";
import type { Lang, RelationalAnswer, RelationalAnswersMap } from "@/lib/relational/types";

export default function RelationalAssessment() {
  const { language } = useLanguage();
  const lang = (language === "fr" ? "fr" : "en") as Lang;
  const fr = lang === "fr";

  usePageSeo({
    title: fr
      ? "Évaluation d'intelligence relationnelle | Paracosm"
      : "Relational Intelligence Assessment | Paracosm",
    description: fr
      ? "Une évaluation de 12 minutes pour les leaders d'équipe et les coachs : cartographiez la conscience de soi, l'attunement, la co-régulation, la réparation et les limites — pour vous et votre équipe."
      : "A 12-minute assessment for team leaders and coaches: map self-awareness, attunement, co-regulation, repair, and boundaries — for you and your team.",
    path: "/readiness/relational",
  });

  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [activeDim, setActiveDim] = useState<string>(DIMENSIONS[0].id);
  const [answers, setAnswers] = useState<RelationalAnswersMap>(emptyRelationalAnswers());

  useEffect(() => {
    void trackEvent("relational_assessment_viewed", {});
    if (!hasSeenRelationalOnboarding()) setShowOnboarding(true);
  }, []);

  // ---------------- Auth + session ----------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data?.user?.id ?? null;
      if (cancelled) return;
      if (!uid) {
        toast.info(
          fr ? "Connectez-vous pour enregistrer vos réponses." : "Sign in to save your answers.",
        );
        navigate("/auth?redirect=/readiness/relational");
        return;
      }
      setUserId(uid);
      setUserEmail(data?.user?.email ?? null);

      const { data: sessions } = await supabase
        .from("relational_sessions")
        .select("id")
        .eq("user_id", uid)
        .is("completed_at", null)
        .order("created_at", { ascending: false })
        .limit(1);

      let sid = sessions?.[0]?.id as string | undefined;
      if (!sid) {
        const { data: created, error } = await supabase
          .from("relational_sessions")
          .insert({ user_id: uid })
          .select("id")
          .single();
        if (error || !created) {
          toast.error(fr ? "Impossible de démarrer." : "Could not start assessment.");
          setLoading(false);
          return;
        }
        sid = created.id;
        void trackEvent("relational_assessment_started", { session_id: sid });
      }
      if (cancelled) return;
      setSessionId(sid);

      const { data: rows } = await supabase
        .from("relational_answers")
        .select("dimension_id, question_id, self_answer_index, team_answer_index, open_text")
        .eq("session_id", sid);

      if (rows && !cancelled) {
        const next = emptyRelationalAnswers() as RelationalAnswersMap;
        for (const r of rows) {
          if (!next[r.dimension_id]) next[r.dimension_id] = {};
          next[r.dimension_id][r.question_id] = {
            self: r.self_answer_index,
            team: r.team_answer_index,
            openText: r.open_text ?? undefined,
          };
        }
        setAnswers(next);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, fr]);

  const dimension = DIMENSION_BY_ID[activeDim];
  const dimensionScores = useMemo(() => computeAllDimensionScores(answers), [answers]);
  const overall = useMemo(() => computeRelationalOverall(dimensionScores), [dimensionScores]);

  const totalAnswered = useMemo(
    () =>
      DIMENSIONS.reduce(
        (n, d) => n + countAnswered(answers[d.id], d.questions.map((q) => q.id)),
        0,
      ),
    [answers],
  );
  const allDone = totalAnswered === TOTAL_QUESTIONS;
  const progress = Math.round((totalAnswered / TOTAL_QUESTIONS) * 100);

  // ---------------- Persist ----------------
  const persist = useCallback(
    async (dimensionId: string, questionId: string, answer: RelationalAnswer) => {
      if (!sessionId || !userId) return;
      if (answer.self < 0 || answer.team < 0) return;
      const { error } = await supabase.from("relational_answers").upsert(
        {
          session_id: sessionId,
          user_id: userId,
          dimension_id: dimensionId,
          question_id: questionId,
          self_answer_index: answer.self,
          team_answer_index: answer.team,
          open_text: answer.openText ?? null,
        },
        { onConflict: "session_id,question_id" },
      );
      if (error) console.warn("relational upsert failed", error);
    },
    [sessionId, userId],
  );

  const setAnswer = (questionId: string, answer: RelationalAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [activeDim]: { ...(prev[activeDim] ?? {}), [questionId]: answer },
    }));
    void persist(activeDim, questionId, answer);
  };

  const saveScores = async () => {
    if (!sessionId) return;
    setSaving(true);
    try {
      const completedDims = DIMENSIONS.filter((d) => dimensionScores[d.id]?.complete).map(
        (d) => d.id,
      );
      const { error } = await supabase
        .from("relational_sessions")
        .update({
          dimension_scores: dimensionScores as never,
          overall_score: overall as never,
          dimensions_completed: completedDims,
          completed_at: allDone ? new Date().toISOString() : null,
        })
        .eq("id", sessionId);
      if (error) throw error;
      if (allDone) {
        setCompleted(true);
        void trackEvent("relational_assessment_completed", { session_id: sessionId });
      }
      toast.success(fr ? "Progression enregistrée." : "Progress saved.");
    } catch (e) {
      console.error(e);
      toast.error(fr ? "Enregistrement impossible." : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const { strongest, weakest } = strongestAndWeakest(dimensionScores);
  const dimIndex = DIMENSIONS.findIndex((d) => d.id === activeDim);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <EditorialSiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EditorialSiteHeader />

      <RelationalOnboardingModal
        lang={lang}
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onDone={() => setShowOnboarding(false)}
      />

      <main className="mx-auto max-w-5xl px-6 py-14">
        <Link
          to="/readiness"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {fr ? "Toutes les évaluations" : "All assessments"}
        </Link>

        <header className="mt-6">
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            {fr ? "Intelligence relationnelle" : "Relational Intelligence"}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {fr
              ? "Cinq dimensions, 30 énoncés. Répondez deux fois à chacun : pour vous, puis pour votre équipe. Environ 12 minutes."
              : "Five dimensions, 30 statements. Answer each one twice: for you, then for your team. About 12 minutes."}
          </p>
          <button
            type="button"
            onClick={() => setShowOnboarding(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {fr ? "Revoir l'introduction" : "Review the introduction"}
          </button>
        </header>

        {/* Progress */}
        <div className="mt-8 rounded-2xl border border-border bg-card/40 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {totalAnswered}/{TOTAL_QUESTIONS} {fr ? "répondu" : "answered"}
            </span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dimension tabs */}
        <nav className="mt-8 flex flex-wrap gap-2">
          {DIMENSIONS.map((d) => {
            const s = dimensionScores[d.id];
            const active = d.id === activeDim;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDim(d.id)}
                className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                  active
                    ? "border-transparent text-background"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
                style={active ? { backgroundColor: d.color } : undefined}
              >
                {d.name[lang]}
                <span className="ml-2 font-mono opacity-70">
                  {s.answered}/{s.total}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Questions */}
        <section className="mt-8">
          <h2 className="font-serif text-2xl" style={{ color: dimension.color }}>
            {dimension.name[lang]}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{dimension.blurb[lang]}</p>

          <div className="mt-6 space-y-4">
            {dimension.questions.map((q, i) => (
              <RelationalQuestionCard
                key={q.id}
                question={q}
                index={i}
                total={dimension.questions.length}
                answer={answers[activeDim]?.[q.id]}
                onChange={(next) => setAnswer(q.id, next)}
                color={dimension.color}
                lang={lang}
                openPrompt={dimension.openPrompt[lang]}
                showOpen={i === dimension.questions.length - 1}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={dimIndex === 0}
              onClick={() => setActiveDim(DIMENSIONS[Math.max(0, dimIndex - 1)].id)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {fr ? "Dimension précédente" : "Previous dimension"}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={saveScores} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {fr ? "Enregistrer" : "Save"}
              </Button>
              {dimIndex < DIMENSIONS.length - 1 && (
                <Button
                  size="sm"
                  onClick={() => setActiveDim(DIMENSIONS[dimIndex + 1].id)}
                  style={{ backgroundColor: dimension.color }}
                >
                  {fr ? "Dimension suivante" : "Next dimension"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mt-16 border-t border-border pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl">{fr ? "Votre carte" : "Your map"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {allDone
                  ? fr
                    ? "Toutes les dimensions sont complètes."
                    : "All dimensions complete."
                  : fr
                    ? "Les résultats se mettent à jour au fil de vos réponses."
                    : "Results update as you answer."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={totalAnswered === 0}
                onClick={() => {
                  exportRelationalPdf({
                    answers,
                    dimensionScores,
                    overall,
                    userEmail,
                    lang,
                  });
                  void trackEvent("relational_pdf_exported", { session_id: sessionId });
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                {fr ? "Exporter en PDF" : "Export PDF"}
              </Button>
              {totalAnswered > 0 && (
                <ShareReadinessDialog
                  sessionId={null}
                  ownerId={userId}
                  buildSnapshot={() =>
                    buildRelationalSnapshot({
                      ownerEmail: userEmail,
                      overall,
                      dimensionScores,
                      answers,
                    })
                  }
                  createOverride={async (args) =>
                    createRelationalShare({
                      ownerId: args.ownerId,
                      recipients: args.recipients,
                      note: args.note,
                      snapshot: args.snapshot as ReturnType<typeof buildRelationalSnapshot>,
                      expiresInDays: args.expiresInDays,
                    })
                  }
                />
              )}
            </div>
          </div>

          {/* Overall */}
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              [fr ? "Moi" : "Me", overall.self],
              [fr ? "Mon équipe" : "My team", overall.team],
              [fr ? "Écart" : "Gap", overall.gap],
              [fr ? "Global" : "Composite", overall.composite],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-border p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </div>
                <div className="mt-2 font-mono text-3xl">
                  {label === (fr ? "Écart" : "Gap") && Number(value) > 0 ? "+" : ""}
                  {value}
                </div>
              </div>
            ))}
          </div>

          {(strongest || weakest) && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {strongest && (
                <div className="rounded-2xl border border-border bg-card/40 p-4 text-sm">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {fr ? "Terrain le plus solide" : "Strongest ground"}
                  </span>
                  <div className="mt-1 font-serif text-lg">
                    {DIMENSION_BY_ID[strongest].name[lang]}
                  </div>
                </div>
              )}
              {weakest && weakest !== strongest && (
                <div className="rounded-2xl border border-border bg-card/40 p-4 text-sm">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {fr ? "Plus grand levier" : "Biggest lever"}
                  </span>
                  <div className="mt-1 font-serif text-lg">
                    {DIMENSION_BY_ID[weakest].name[lang]}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {DIMENSIONS.map((d) => (
              <DimensionResultCard
                key={d.id}
                dimension={d}
                score={dimensionScores[d.id]}
                lang={lang}
              />
            ))}
          </div>

          {completed && (
            <div className="mt-8 flex items-center gap-2 rounded-2xl border border-border bg-card/40 p-4 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {fr
                ? "Évaluation terminée et enregistrée."
                : "Assessment complete and saved."}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
