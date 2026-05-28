import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/hooks/usePageSeo";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type Training = { id: string; slug: string; title: string };
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
};
type Question = {
  id: string;
  order_index: number;
  prompt: string;
  options: string[];
  correct_answer: number;
  explanation_md: string | null;
};

export default function TrainingModule() {
  const { slug = "", order = "1" } = useParams();
  const nav = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const moduleOrder = Number(order);
  const current = useMemo(
    () => modules.find((m) => m.order_index === moduleOrder),
    [modules, moduleOrder],
  );
  const prev = modules.find((m) => m.order_index === moduleOrder - 1);
  const next = modules.find((m) => m.order_index === moduleOrder + 1);

  usePageSeo({
    title: current ? `${current.title} — ${training?.title ?? "Training"} | Paracosm` : "Module",
    description: current?.summary ?? "",
    path: `/trainings/${slug}/modules/${order}`,
  });

  useEffect(() => {
    (async () => {
      const { data: t } = await supabase
        .from("trainings")
        .select("id,slug,title")
        .eq("slug", slug)
        .maybeSingle();
      if (!t) return;
      setTraining(t as Training);
      const { data: ms } = await supabase
        .from("training_modules")
        .select("*")
        .eq("training_id", (t as Training).id)
        .order("order_index");
      setModules((ms as ModuleRow[]) ?? []);
    })();
  }, [slug]);

  useEffect(() => {
    if (!current) return;
    setSubmitted(false);
    setAnswers({});
    supabase
      .from("training_questions")
      .select("id,order_index,prompt,options,correct_answer,explanation_md")
      .eq("module_id", current.id)
      .order("order_index")
      .then(({ data }) => setQuestions((data as unknown as Question[]) ?? []));
  }, [current]);

  const score = useMemo(() => {
    if (!questions.length) return 0;
    const correct = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions]);

  const submitQuiz = async () => {
    setSubmitted(true);
    const passed = score >= 66;
    const { data: { user } } = await supabase.auth.getUser();
    if (user && current) {
      await supabase.from("training_attempts").insert({
        user_id: user.id,
        module_id: current.id,
        answers,
        score,
        passed,
      });
    }
    if (passed) toast.success(`Passed — ${score}%`);
    else toast.error(`Keep going — ${score}%`);
  };

  if (!training || !current) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-white/60">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="container mx-auto px-6 py-8 flex items-center justify-between">
        <Link to={`/trainings/${slug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {training.title}
        </Link>
        <div className="text-sm text-white/50">
          Module {current.order_index} / {modules.length}
        </div>
      </header>

      <section className="container mx-auto px-6 max-w-3xl pb-12">
        <div className="text-xs uppercase tracking-widest text-white/50 mb-2">
          {current.video_theme}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{current.title}</h1>
        {current.summary && <p className="text-lg text-white/70 mb-8">{current.summary}</p>}

        {/* Video placeholder */}
        <div className="aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] flex flex-col items-center justify-center text-center p-8 mb-10">
          <PlayCircle className="h-12 w-12 text-white/40 mb-3" />
          <div className="font-semibold mb-1">{current.video_title}</div>
          <div className="text-xs text-white/50">
            {current.video_duration_min ? `${current.video_duration_min} min` : ""} · placeholder —
            full video shipping with the cohort
          </div>
        </div>

        {current.content_md && (
          <div className="prose prose-invert max-w-none mb-10">
            <ReactMarkdown>{current.content_md}</ReactMarkdown>
          </div>
        )}
        {current.hands_on_md && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 mb-10">
            <div className="text-xs uppercase tracking-widest text-amber-300/80 mb-2">Hands-on</div>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{current.hands_on_md}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Quiz */}
        {questions.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-10">
            <h2 className="text-xl font-semibold mb-1">Knowledge check</h2>
            <p className="text-sm text-white/60 mb-6">
              {questions.length} multiple-choice questions. 66% to pass.
            </p>
            <div className="space-y-6">
              {questions.map((q, qi) => (
                <div key={q.id}>
                  <div className="font-medium mb-3">
                    {qi + 1}. {q.prompt}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, i) => {
                      const isSelected = answers[q.id] === i;
                      const isCorrect = q.correct_answer === i;
                      let cls =
                        "w-full text-left px-4 py-2 rounded-lg border transition-colors text-sm ";
                      if (submitted) {
                        if (isCorrect) cls += "border-emerald-400/50 bg-emerald-400/10";
                        else if (isSelected) cls += "border-rose-400/50 bg-rose-400/10";
                        else cls += "border-white/10 bg-white/[0.02]";
                      } else {
                        cls += isSelected
                          ? "border-white/40 bg-white/10"
                          : "border-white/10 hover:bg-white/5";
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
                            {submitted && isCorrect && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                            )}
                            {submitted && isSelected && !isCorrect && (
                              <XCircle className="h-4 w-4 text-rose-300" />
                            )}
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {submitted && q.explanation_md && (
                    <div className="mt-2 text-xs text-white/60 italic">{q.explanation_md}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-white/60">
                {submitted ? `Score: ${score}%` : `${Object.keys(answers).length}/${questions.length} answered`}
              </div>
              {!submitted ? (
                <Button
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length < questions.length}
                >
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
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={!prev}
            onClick={() => prev && nav(`/trainings/${slug}/modules/${prev.order_index}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button
            disabled={!next}
            onClick={() => next && nav(`/trainings/${slug}/modules/${next.order_index}`)}
          >
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
