import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { itemListSchema } from "@/lib/structuredData";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import EditorialCTA from "@/components/editorial/EditorialCTA";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import { editorialTone, editorialType, type EditorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

type Training = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  hours: number;
  crewdle_focus: string | null;
  hero_quote: string | null;
  cta_label: string;
  order_index: number;
};

const slugTone: Record<string, EditorialTone> = {
  glitch: "warm",
  drift: "night",
  tune: "clay",
};

export default function TrainingsIndex() {
  const [trainings, setTrainings] = useState<Training[]>([]);

  const jsonLd = useMemo(() => {
    if (!trainings.length) return undefined;
    return itemListSchema({
      url: "/trainings",
      name: "Paracosm Trainings",
      items: trainings.map((t) => ({
        name: t.title,
        url: `/trainings/${t.slug}`,
        description: t.tagline ?? undefined,
      })),
    });
  }, [trainings]);

  usePageSeo({
    title: "Trainings — GL!TCH, Drift & Tune | Paracosm × Crewdle",
    description:
      "Three Crewdle-bound trainings by Paracosm: GL!TCH (official 65h Crewdle AI Formation), Drift (60h co-assisted development) and Tune (60h orchestrated autonomy).",
    path: "/trainings",
    jsonLd,
  });

  useEffect(() => {
    supabase
      .from("trainings")
      .select("id,slug,title,tagline,hours,crewdle_focus,hero_quote,cta_label,order_index")
      .eq("status", "published")
      .order("order_index")
      .then(({ data }) => setTrainings((data as Training[]) ?? []));
  }, []);

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      {/* Masthead + hero — warm opening chapter */}
      <EditorialSection tone="warm" className="pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="flex items-center justify-between mb-14 pb-6 border-b border-current/15">
          <Link to="/" className={cn(editorialType.cta, "opacity-70 hover:opacity-100")}>
            ← Paracosm
          </Link>
          <Link to="/about-us" className={cn(editorialType.cta, "opacity-70 hover:opacity-100")}>
            About
          </Link>
        </div>

        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8 space-y-6">
            <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>
              Volume I · Chapter 01 — Foreplay
            </p>
            <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight")}>
              Three trainings to <em className="italic font-light">rehearse</em> the AI shift.
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed">
              GL!TCH is the official Crewdle AI Formation. Drift and Tune extend the journey from
              co-assisted exploration into orchestrated autonomy.
            </p>
          </div>
          <aside className="md:col-span-4 border-l border-current/20 pl-6 space-y-3">
            <p className={editorialType.caption}>In this issue</p>
            <ol className="space-y-2 text-sm">
              {trainings.map((t, i) => (
                <li key={t.id} className="flex gap-3">
                  <span className={cn(editorialType.serif, editorialTone.warm.numeral)}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{t.title}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </EditorialSection>

      {/* One chapter per training */}
      {trainings.map((t, i) => {
        const tone = slugTone[t.slug] ?? (["warm", "night", "clay"][i % 3] as EditorialTone);
        const numeral = String(i + 1).padStart(2, "0");
        const styles = editorialTone[tone];
        return (
          <section
            key={t.id}
            className={cn("py-20 md:py-28 px-6 relative", styles.section)}
          >
            <div className="container max-w-7xl mx-auto">
              <EditorialChapterHeader
                numeral={numeral}
                kicker={t.crewdle_focus ?? "Training"}
                subtitle={t.tagline ?? undefined}
                tone={tone}
              />
              <div className="grid md:grid-cols-12 gap-10">
                <div className="md:col-span-8 space-y-6">
                  <h2 className={cn(editorialType.serif, "text-4xl md:text-5xl leading-[1.05] tracking-tight")}>
                    {t.title}
                  </h2>
                  {t.hero_quote && (
                    <blockquote
                      className={cn(
                        editorialType.serif,
                        "border-l-4 pl-5 py-2 italic text-xl md:text-2xl leading-snug",
                        styles.quoteBorder,
                      )}
                    >
                      “{t.hero_quote}”
                    </blockquote>
                  )}
                  <div className="pt-2">
                    <EditorialCTA to={`/trainings/${t.slug}`} tone={tone}>
                      {t.cta_label || "Read the chapter"}
                    </EditorialCTA>
                  </div>
                </div>
                <aside className="md:col-span-4 space-y-4">
                  <div className={cn("rounded-2xl border p-6", styles.calloutBox)}>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4" />
                      <span className={editorialType.caption}>Duration</span>
                    </div>
                    <p className={cn(editorialType.serif, "text-3xl")}>{t.hours}h</p>
                    <p className="text-xs opacity-70 mt-1">Total contact + self-paced</p>
                  </div>
                  <Link
                    to={`/trainings/${t.slug}`}
                    className="group inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> See full syllabus
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </aside>
              </div>
            </div>
          </section>
        );
      })}

      <Footer />
    </main>
  );
}
