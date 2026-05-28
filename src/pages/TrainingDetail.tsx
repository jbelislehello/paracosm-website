import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/hooks/usePageSeo";
import { ArrowLeft, ArrowRight, Clock, PlayCircle, Sparkles } from "lucide-react";
import EnrollDialog from "@/components/trainings/EnrollDialog";

type Training = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  hours: number;
  crewdle_focus: string | null;
  big_picture_md: string | null;
  outcomes: string[];
  audience_md: string | null;
  hero_quote: string | null;
  cta_label: string;
  delivery_breakdown: Record<string, unknown> | null;
  og_image_url: string | null;
};

type ModuleRow = {
  id: string;
  order_index: number;
  title: string;
  summary: string | null;
  hours: number | null;
  video_title: string | null;
  video_duration_min: number | null;
};

export default function TrainingDetail() {
  const { slug = "" } = useParams();
  const [training, setTraining] = useState<Training | null>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);

  usePageSeo({
    title: training ? `${training.title} | Paracosm Trainings` : "Training | Paracosm",
    description: training?.tagline ?? "Paracosm Crewdle-bound training.",
    path: `/trainings/${slug}`,
    image:
      training?.og_image_url?.trim() ||
      (slug ? `https://calm-magic.com/og/trainings-${slug}.svg` : undefined),
    ogType: "article",
  });


  useEffect(() => {
    (async () => {
      const { data: t } = await supabase
        .from("trainings")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (t) {
        setTraining(t as unknown as Training);
        const { data: ms } = await supabase
          .from("training_modules")
          .select("id,order_index,title,summary,hours,video_title,video_duration_min")
          .eq("training_id", (t as { id: string }).id)
          .order("order_index");
        setModules((ms as ModuleRow[]) ?? []);
      }
    })();
  }, [slug]);

  if (!training) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-white/60">Loading…</p>
      </div>
    );
  }

  const breakdown = training.delivery_breakdown as Record<string, string | number> | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="container mx-auto px-6 py-8 flex items-center justify-between">
        <Link to="/trainings" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> All trainings
        </Link>
        <EnrollDialog
          trainingSlug={training.slug}
          trainingTitle={training.title}
          triggerLabel={training.cta_label}
        />
      </header>

      <section className="container mx-auto px-6 pt-10 pb-16 max-w-4xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 mb-4">
          <Sparkles className="h-3.5 w-3.5" /> {training.crewdle_focus}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{training.title}</h1>
        <p className="text-xl text-white/70 mb-6">{training.tagline}</p>
        <div className="inline-flex items-center gap-2 text-sm text-white/60">
          <Clock className="h-4 w-4" /> {training.hours} hours total
        </div>
        {training.hero_quote && (
          <blockquote className="mt-10 border-l-2 border-white/30 pl-5 italic text-white/70 text-lg">
            "{training.hero_quote}"
          </blockquote>
        )}
      </section>

      {training.big_picture_md && (
        <section className="container mx-auto px-6 pb-16 max-w-3xl">
          <h2 className="text-sm uppercase tracking-widest text-white/50 mb-4">The big picture</h2>
          <div className="prose prose-invert max-w-none text-white/80">
            <ReactMarkdown>{training.big_picture_md}</ReactMarkdown>
          </div>
        </section>
      )}

      {training.outcomes?.length > 0 && (
        <section className="container mx-auto px-6 pb-16 max-w-3xl">
          <h2 className="text-sm uppercase tracking-widest text-white/50 mb-4">What you'll walk away with</h2>
          <ul className="space-y-3">
            {training.outcomes.map((o, i) => (
              <li key={i} className="flex gap-3 text-white/80">
                <span className="text-emerald-300">→</span>
                {o}
              </li>
            ))}
          </ul>
        </section>
      )}

      {breakdown && (
        <section className="container mx-auto px-6 pb-16 max-w-3xl">
          <h2 className="text-sm uppercase tracking-widest text-white/50 mb-4">Delivery breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(breakdown).map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-widest text-white/50">{k.replace(/_/g, " ")}</div>
                <div className="mt-1 text-lg font-semibold">{String(v)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-6 pb-24 max-w-4xl">
        <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Curriculum</h2>
        <ol className="space-y-3">
          {modules.map((m) => (
            <li key={m.id}>
              <Link
                to={`/trainings/${slug}/modules/${m.order_index}`}
                className="group flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl font-bold text-white/40 w-10 shrink-0">
                  {String(m.order_index).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                    {m.hours && <span>{m.hours}h</span>}
                    {m.video_title && (
                      <span className="inline-flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" /> {m.video_title}
                        {m.video_duration_min ? ` · ${m.video_duration_min} min` : ""}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold mb-1">{m.title}</div>
                  {m.summary && <p className="text-sm text-white/60">{m.summary}</p>}
                </div>
                <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center">
          <EnrollDialog
            trainingSlug={training.slug}
            trainingTitle={training.title}
            triggerLabel={training.cta_label}
          />
        </div>
      </section>
    </div>
  );
}
