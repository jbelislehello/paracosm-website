import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/hooks/usePageSeo";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import { editorialTone, editorialType, type EditorialTone } from "@/components/editorial/editorialTokens";
import { STATE_META, type CalmMagicState } from "@/data/rehearsalArcMeta";
import { cn } from "@/lib/utils";

type Training = {
  id: string;
  slug: string;
  title: string;
  tier: string | null;
  tone: EditorialTone | null;
};

type Exercise = {
  name: string;
  intent: string;
  prompt: string;
  timingMin: number;
  materials: string;
  debrief: string;
};

type Journeys = { narrative?: string; cognitive?: string; identity?: string };

type ModuleRow = {
  id: string;
  order_index: number;
  title: string;
  summary: string | null;
  hours: number | null;
  video_title: string | null;
  video_duration_min: number | null;
  video_theme: string | null;
  content_md: string | null;
  hands_on_md: string | null;
  focus_state: CalmMagicState | null;
  when_label: string | null;
  outcome: string | null;
  exercises_json: Exercise[] | null;
  journeys_json: Journeys | null;
  artifact: string | null;
};

type Question = { id: string; order_index: number; prompt: string; options: string[] };
type GradedResult = { id: string; correct: boolean; correct_answer: number; explanation_md: string | null };

export default function TrainingModule() {
  const { slug = "", order = "1" } = useParams();
  const nav = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [graded, setGraded] = useState<Record<string, GradedResult>>({});
  const [score, setScore] = useState(0);

  const moduleOrder = Number(order);
  const current = useMemo(
    () => modules.find((m) => m.order_index === moduleOrder),
    [modules, moduleOrder],
  );
  const prev = modules.find((m) => m.order_index === moduleOrder - 1);
  const next = modules.find((m) => m.order_index === moduleOrder + 1);

  const tone: EditorialTone = training?.tone ?? "warm";
  const styles = editorialTone[tone];
  const stateMeta = current?.focus_state ? STATE_META[current.focus_state] : null;

  usePageSeo({
    title: current ? `${current.title} — ${training?.title ?? "Training"} | Paracosm` : "Module",
    description: current?.summary ?? current?.outcome ?? "",
    path: `/trainings/${slug}/modules/${order}`,
  });

  useEffect(() => {
    (async () => {
      const { data: t } = await supabase
        .from("trainings")
        .select("id,slug,title,tier,tone")
        .eq("slug", slug)
        .maybeSingle();
      if (!t) return;
      setTraining(t as Training);
      const { data: ms } = await supabase
        .from("training_modules")
        .select("*")
        .eq("training_id", (t as Training).id)
        .order("order_index");
      setModules((ms as unknown as ModuleRow[]) ?? []);
    })();
  }, [slug]);

  useEffect(() => {
    if (!current) return;
    setSubmitted(false);
    setAnswers({});
    setGraded({});
    setScore(0);
    supabase
      .from("training_questions_public" as never)
      .select("id,order_index,prompt,options")
      .eq("module_id", current.id)
      .order("order_index")
      .then(({ data }) => setQuestions((data as unknown as Question[]) ?? []));
  }, [current]);

  const submitQuiz = async () => {
    if (!current) return;
    const { data, error } = await supabase.rpc("grade_training_attempt" as never, {
      p_module_id: current.id,
      p_answers: answers,
    } as never);
    if (error) return toast.error(error.message);
    const payload = data as unknown as { score: number; passed: boolean; results: GradedResult[] };
    const map: Record<string, GradedResult> = {};
    payload.results.forEach((r) => (map[r.id] = r));
    setGraded(map);
    setScore(payload.score);
    setSubmitted(true);
    if (payload.passed) toast.success(`Passed — ${payload.score}%`);
    else toast.error(`Keep going — ${payload.score}%`);
  };

  if (!training || !current) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", styles.section)}>
        <p className="opacity-60">Loading…</p>
      </div>
    );
  }

  const exercises = current.exercises_json ?? [];
  const journeys = current.journeys_json ?? {};

  return (
    <main className={cn("min-h-screen", styles.section)}>
      <EditorialSiteHeader />

      <header className="container mx-auto max-w-5xl px-6 py-6 flex items-center justify-between border-b border-current/10">
        <Link
          to={`/trainings/${slug}`}
          className={cn(editorialType.cta, "inline-flex items-center gap-2 opacity-70 hover:opacity-100")}
        >
          <ArrowLeft className="h-4 w-4" /> {training.title}
        </Link>
        <div className={cn(editorialType.caption)}>
          Module {current.order_index} / {modules.length}
        </div>
      </header>

      <section className="container mx-auto max-w-5xl px-6 pt-14 pb-16 md:pt-20">
        <div className="flex items-center gap-3 mb-4">
          {stateMeta && (
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
              style={{ background: stateMeta.accent }}
            >
              {stateMeta.label} · {stateMeta.role}
            </span>
          )}
          {current.when_label && (
            <span className={cn(editorialType.caption, "inline-flex items-center gap-1.5")}>
              <Clock className="w-3.5 h-3.5" /> {current.when_label}
            </span>
          )}
        </div>

        <h1 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[1.02] tracking-tight mb-6")}>
          {current.title}
        </h1>
        {current.outcome && (
          <p className="text-xl md:text-2xl opacity-80 leading-snug max-w-3xl mb-10">{current.outcome}</p>
        )}

        {/* Video placeholder */}
        <div className={cn("aspect-video rounded-2xl border p-8 mb-14 flex flex-col items-center justify-center text-center", styles.calloutBox)}>
          <PlayCircle className="h-12 w-12 opacity-40 mb-3" />
          <div className={cn(editorialType.serif, "text-xl mb-1")}>{current.video_title}</div>
          <div className="text-xs opacity-60">
            {current.video_duration_min ? `${current.video_duration_min} min · ` : ""}placeholder — video shipping with the cohort
          </div>
        </div>

        {/* Three simultaneous journeys */}
        {(journeys.narrative || journeys.cognitive || journeys.identity) && (
          <section className="mb-16">
            <p className={cn(editorialType.eyebrow, styles.kicker, "mb-6")}>Three journeys, this module</p>
            <div className="grid md:grid-cols-3 gap-5">
              {(["narrative", "cognitive", "identity"] as const).map((k) =>
                journeys[k] ? (
                  <div key={k} className={cn("rounded-2xl border p-6", styles.calloutBox)}>
                    <p className={editorialType.caption}>{k}</p>
                    <p className={cn(editorialType.serif, "italic text-lg mt-3 leading-snug")}>{journeys[k]}</p>
                  </div>
                ) : null,
              )}
            </div>
          </section>
        )}

        {/* Exercises */}
        {exercises.length > 0 && (
          <section className="mb-16">
            <p className={cn(editorialType.eyebrow, styles.kicker, "mb-6")}>Exercises</p>
            <div className="space-y-4">
              {exercises.map((e, i) => (
                <div key={i} className={cn("rounded-2xl border p-6", styles.calloutBox)}>
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className={cn(editorialType.serif, "text-2xl")}>
                      {String(i + 1).padStart(2, "0")}. {e.name}
                    </h3>
                    <span className="text-xs opacity-60 shrink-0">{e.timingMin} min</span>
                  </div>
                  <p className={cn(editorialType.caption, "mb-1")}>Intent</p>
                  <p className="text-sm mb-4 opacity-90">{e.intent}</p>
                  <p className={cn(editorialType.caption, "mb-1")}>Prompt</p>
                  <p className="text-sm mb-4 italic opacity-90">"{e.prompt}"</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className={editorialType.caption}>Materials</p>
                      <p className="opacity-80 mt-1">{e.materials}</p>
                    </div>
                    <div>
                      <p className={editorialType.caption}>Debrief</p>
                      <p className="opacity-80 mt-1">{e.debrief}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Artifact */}
        {current.artifact && (
          <div className={cn("rounded-2xl border p-6 mb-16", styles.calloutBox)}>
            <p className={editorialType.caption}>Artifact you leave with</p>
            <p className={cn(editorialType.serif, "italic text-lg mt-2")}>{current.artifact}</p>
          </div>
        )}

        {/* Optional freeform content */}
        {current.content_md && (
          <div className="prose max-w-none dark:prose-invert mb-10">
            <ReactMarkdown>{current.content_md}</ReactMarkdown>
          </div>
        )}
        {current.hands_on_md && (
          <div className={cn("rounded-2xl border p-6 mb-10", styles.calloutBox)}>
            <p className={cn(editorialType.caption, "mb-2")}>Hands-on</p>
            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown>{current.hands_on_md}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Quiz */}
        {questions.length > 0 && (
          <div className={cn("rounded-2xl border p-6 mb-10", styles.calloutBox)}>
            <h2 className={cn(editorialType.serif, "text-2xl mb-1")}>Knowledge check</h2>
            <p className="text-sm opacity-60 mb-6">{questions.length} questions. 66% to pass.</p>
            <div className="space-y-6">
              {questions.map((q, qi) => (
                <div key={q.id}>
                  <div className="font-medium mb-3">
                    {qi + 1}. {q.prompt}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, i) => {
                      const isSelected = answers[q.id] === i;
                      const isCorrect = graded[q.id]?.correct_answer === i;
                      let cls =
                        "w-full text-left px-4 py-2 rounded-lg border transition-colors text-sm ";
                      if (submitted) {
                        if (isCorrect) cls += "border-emerald-500/60 bg-emerald-500/10";
                        else if (isSelected) cls += "border-rose-500/60 bg-rose-500/10";
                        else cls += "border-current/15 opacity-70";
                      } else {
                        cls += isSelected
                          ? "border-current/60 bg-current/10"
                          : "border-current/15 hover:bg-current/5";
                      }
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={submitted}
                          className={cls}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                        >
                          <div className="flex items-center gap-2">
                            {submitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            {submitted && isSelected && !isCorrect && (
                              <XCircle className="h-4 w-4 text-rose-500" />
                            )}
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {submitted && graded[q.id]?.explanation_md && (
                    <div className="mt-2 text-xs opacity-70 italic">{graded[q.id]?.explanation_md}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm opacity-60">
                {submitted ? `Score: ${score}%` : `${Object.keys(answers).length}/${questions.length} answered`}
              </div>
              {!submitted ? (
                <Button onClick={submitQuiz} disabled={Object.keys(answers).length < questions.length}>
                  Submit
                </Button>
              ) : (
                <Button variant="outline" onClick={() => { setSubmitted(false); setAnswers({}); }}>
                  Retry
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-current/10">
          <Button
            variant="outline"
            disabled={!prev}
            onClick={() => prev && nav(`/trainings/${slug}/modules/${prev.order_index}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> {prev ? prev.title : "Previous"}
          </Button>
          <Button
            disabled={!next}
            onClick={() => next && nav(`/trainings/${slug}/modules/${next.order_index}`)}
          >
            {next ? next.title : "Next"} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
