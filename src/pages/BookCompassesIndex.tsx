import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import ChromaText from "@/components/aesthetic/ChromaText";

interface CompassRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  quote: string | null;
  quote_attribution: string | null;
  phase_affinity: string[];
}

const PHASES = ["GLITCH", "DRIFT", "TUNE", "LOVE", "MAGIC", "CALM", "OPEN", "FREE"];

export default function BookCompassesIndex() {
  const [items, setItems] = useState<CompassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  usePageSeo({
    title: "Compasses — Calm Magic",
    description: "Visual maps and decision-making lenses for thriving with imagination in the 21st century.",
    path: "/book/compasses",
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("book_compasses")
        .select("*")
        .eq("status", "published")
        .order("order_index");
      if (!alive) return;
      setItems((data as CompassRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(
    () => (filter ? items.filter((i) => i.phase_affinity.includes(filter)) : items),
    [items, filter]
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="fixed z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="h-8 w-8 rounded-lg bg-white p-1 object-contain" />
            <span className="font-display text-sm">Paracosm</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/book" className="flex items-center gap-1 text-xs uppercase tracking-widest text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to book
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        <section className="container mx-auto max-w-5xl px-6 py-12">
          <div className="mb-3 flex items-center gap-2 text-cyan-300">
            <Compass className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest">Part 1 — The Compasses</span>
          </div>
          <ChromaText as="h1" animated={false} className="font-display text-4xl leading-[0.95] md:text-6xl">
            The Compasses
          </ChromaText>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            An ensemble of visual maps exposing the bodies of knowledge and decision-making
            skills required to thrive with imagination in the 21st century.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                filter === null
                  ? "border-cyan-300 bg-cyan-300/10 text-cyan-200"
                  : "border-white/15 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              All
            </button>
            {PHASES.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                  filter === p
                    ? "border-cyan-300 bg-cyan-300/10 text-cyan-200"
                    : "border-white/15 bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-white/40" />
              </div>
            ) : visible.length === 0 ? (
              <p className="py-20 text-center text-white/60">
                No published compasses for this phase yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((c) => (
                  <Link
                    key={c.id}
                    to={`/book/compasses/${c.slug}`}
                    className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyan-300/40 hover:bg-white/[0.06]"
                  >
                    <h2 className="text-base font-semibold text-white group-hover:text-cyan-200">
                      {c.name}
                    </h2>
                    {c.description && (
                      <p className="mt-2 text-sm text-white/65">{c.description}</p>
                    )}
                    {c.quote && (
                      <p className="mt-3 text-xs italic text-white/50">
                        "{c.quote}"
                        {c.quote_attribution && (
                          <span className="not-italic"> — {c.quote_attribution}</span>
                        )}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {c.phase_affinity.map((p) => (
                        <Badge
                          key={p}
                          variant="outline"
                          className="border-white/15 bg-white/5 text-[10px] uppercase tracking-wider"
                        >
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
