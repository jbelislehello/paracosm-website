import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/hooks/usePageSeo";
import { itemListSchema } from "@/lib/structuredData";
import { ArrowRight, Clock, GraduationCap, Sparkles } from "lucide-react";

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

const slugAccent: Record<string, string> = {
  glitch: "from-rose-500/30 to-amber-500/20 border-rose-400/30",
  drift: "from-sky-500/30 to-violet-500/20 border-sky-400/30",
  tune: "from-emerald-500/30 to-teal-500/20 border-emerald-400/30",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="container mx-auto px-6 py-8 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Paracosm <span className="text-white/40">/</span> Trainings
        </Link>
        <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <Link to="/about-us">About</Link>
        </Button>
      </header>

      <section className="container mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <GraduationCap className="h-4 w-4 text-amber-300" />
          <span className="text-sm text-white/70">Crewdle-bound formations by Paracosm</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
          Three trainings to <span className="text-rose-300">name</span>,{" "}
          <span className="text-sky-300">explore</span> and{" "}
          <span className="text-emerald-300">orchestrate</span> the AI shift.
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          GL!TCH is the official Crewdle AI Formation. Drift and Tune extend the journey from
          co-assisted exploration into orchestrated autonomy.
        </p>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trainings.map((t) => (
            <Link
              key={t.id}
              to={`/trainings/${t.slug}`}
              className={`relative group rounded-3xl border bg-gradient-to-br ${
                slugAccent[t.slug] ?? "from-white/10 to-white/5 border-white/10"
              } p-8 hover:translate-y-[-2px] transition-all`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t.crewdle_focus}
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-white/60">
                  <Clock className="h-3.5 w-3.5" />
                  {t.hours}h
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">{t.title}</h2>
              <p className="text-white/70 mb-6">{t.tagline}</p>
              {t.hero_quote && (
                <blockquote className="border-l-2 border-white/30 pl-4 italic text-white/60 mb-6 text-sm">
                  "{t.hero_quote}"
                </blockquote>
              )}
              <div className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all">
                {t.cta_label} <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
