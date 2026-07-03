import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { courseSchema } from "@/lib/structuredData";
import { ArrowLeft, ArrowRight, Clock, PlayCircle } from "lucide-react";
import EnrollDialog from "@/components/trainings/EnrollDialog";
import Footer from "@/components/Footer";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import EditorialPullQuote from "@/components/editorial/EditorialPullQuote";
import { editorialTone, editorialType, type EditorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

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

const slugTone: Record<string, EditorialTone> = {
  glitch: "warm",
  drift: "night",
  tune: "clay",
};

export default function TrainingDetail() {
  const { slug = "" } = useParams();
  const [training, setTraining] = useState<Training | null>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const tone: EditorialTone = slugTone[slug] ?? "warm";
  const styles = editorialTone[tone];

  const image =
    training?.og_image_url?.trim() ||
    (slug ? `https://calm-magic.com/og/trainings-${slug}.svg` : undefined);

  const jsonLd = useMemo(() => {
    if (!training) return undefined;
    return courseSchema({
      name: training.title,
      description: training.tagline ?? "Paracosm Crewdle-bound training.",
      url: `/trainings/${training.slug}`,
      image,
      hours: training.hours,
      about: training.crewdle_focus ?? undefined,
      syllabus: modules.map((m) => ({
        name: m.title,
        description: m.summary ?? undefined,
      })),
    });
  }, [training, modules, image]);

  usePageSeo({
    title: training ? `${training.title} | Paracosm Trainings` : "Training | Paracosm",
    description: training?.tagline ?? "Paracosm Crewdle-bound training.",
    path: `/trainings/${slug}`,
    image,
    ogType: "article",
    jsonLd,
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
      <div className={cn("min-h-screen flex items-center justify-center", styles.section)}>
        <p className="opacity-60">Loading…</p>
      </div>
    );
  }

  const breakdown = training.delivery_breakdown as Record<string, string | number> | null;

  return (
    <main className="bg-background text-foreground">
      {/* Hero chapter */}
      <section className={cn("relative", styles.section)}>
        <div className="container max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between border-b border-current/10">
          <Link
            to="/trainings"
            className={cn(editorialType.cta, "inline-flex items-center gap-2 opacity-70 hover:opacity-100")}
          >
            <ArrowLeft className="w-4 h-4" /> All trainings
          </Link>
          <EnrollDialog
            trainingSlug={training.slug}
            trainingTitle={training.title}
            triggerLabel={training.cta_label}
          />
        </div>

        <div className="container max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-9 space-y-6">
            <p className={cn(editorialType.eyebrow, styles.kicker)}>
              Foreplay · {training.crewdle_focus}
            </p>
            <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight")}>
              {training.title}
            </h1>
            {training.tagline && (
              <p className="text-xl md:text-2xl opacity-80 max-w-3xl leading-snug">
                {training.tagline}
              </p>
            )}
            <div className="inline-flex items-center gap-2 text-sm opacity-70">
              <Clock className="w-4 h-4" /> {training.hours} hours total
            </div>
          </div>
        </div>
      </section>

      {training.hero_quote && (
        <EditorialSection tone={tone} className="py-16 md:py-24">
          <div className="max-w-3xl">
            <EditorialPullQuote tone={tone}>{training.hero_quote}</EditorialPullQuote>
          </div>
        </EditorialSection>
      )}

      {training.big_picture_md && (
        <EditorialSection tone="paper">
          <EditorialChapterHeader
            numeral="I"
            kicker="The big picture"
            tone="paper"
          />
          <div className="prose prose-lg max-w-3xl dark:prose-invert">
            <ReactMarkdown>{training.big_picture_md}</ReactMarkdown>
          </div>
        </EditorialSection>
      )}

      {training.outcomes?.length > 0 && (
        <EditorialSection tone={tone === "night" ? "warm" : "night"}>
          <EditorialChapterHeader
            numeral="II"
            kicker="What you'll walk away with"
            tone={tone === "night" ? "warm" : "night"}
          />
          <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4 max-w-4xl">
            {training.outcomes.map((o, i) => (
              <li key={i} className="flex gap-3 text-lg leading-relaxed">
                <span className="opacity-50 font-serif">→</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}

      {breakdown && (
        <EditorialSection tone="paper">
          <EditorialChapterHeader numeral="III" kicker="Delivery breakdown" tone="paper" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
            {Object.entries(breakdown).map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-muted/40 p-5">
                <div className={editorialType.caption}>{k.replace(/_/g, " ")}</div>
                <div className={cn(editorialType.serif, "mt-2 text-2xl")}>{String(v)}</div>
              </div>
            ))}
          </div>
        </EditorialSection>
      )}

      <EditorialSection tone={tone}>
        <EditorialChapterHeader numeral="IV" kicker="Curriculum" tone={tone} />
        <ol className="space-y-3 max-w-4xl">
          {modules.map((m) => (
            <li key={m.id}>
              <Link
                to={`/trainings/${slug}/modules/${m.order_index}`}
                className={cn(
                  "group flex items-start gap-6 rounded-2xl border p-6 transition-colors",
                  styles.calloutBox,
                  "hover:bg-current/10",
                )}
              >
                <div className={cn(editorialType.serif, "text-3xl opacity-40 w-12 shrink-0")}>
                  {String(m.order_index).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(editorialType.caption, "flex items-center gap-3 mb-1.5")}>
                    {m.hours && <span>{m.hours}h</span>}
                    {m.video_title && (
                      <span className="inline-flex items-center gap-1 normal-case tracking-normal opacity-80">
                        <PlayCircle className="w-3 h-3" /> {m.video_title}
                        {m.video_duration_min ? ` · ${m.video_duration_min} min` : ""}
                      </span>
                    )}
                  </div>
                  <div className={cn(editorialType.serif, "text-xl mb-1")}>{m.title}</div>
                  {m.summary && <p className="text-sm opacity-70 leading-relaxed">{m.summary}</p>}
                </div>
                <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <EnrollDialog
            trainingSlug={training.slug}
            trainingTitle={training.title}
            triggerLabel={training.cta_label}
          />
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
}
