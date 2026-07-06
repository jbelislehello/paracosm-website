import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { EditorialPageHero } from "@/components/editorial";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language } = useLanguage();
  const isFr = language === 'fr';

  usePageSeo({
    title: isFr ? "Boussoles — Calm Magic" : "Compasses — Calm Magic",
    description: isFr
      ? "Cartes visuelles et lentilles de prise de décision pour prospérer avec l'imagination au 21e siècle."
      : "Visual maps and decision-making lenses for thriving with imagination in the 21st century.",
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
    return () => { alive = false; };
  }, []);

  const visible = useMemo(
    () => (filter ? items.filter((i) => i.phase_affinity.includes(filter)) : items),
    [items, filter]
  );

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(15_35%_92%)] dark:bg-[hsl(15_15%_14%)] text-foreground">
      <header className="fixed z-50 w-full border-b border-current/10 bg-[hsl(15_35%_92%)]/85 dark:bg-[hsl(15_15%_14%)]/85 backdrop-blur-md">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="h-8 w-8 rounded-lg bg-white p-1 object-contain" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">Paracosm</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/book" className="flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] opacity-70 hover:opacity-100">
              <ArrowLeft className="h-3 w-3" /> {isFr ? 'Livre' : 'Book'}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <EditorialPageHero
        numeral="08"
        kicker={isFr ? "Partie I · Les boussoles" : "Part I · The Compasses"}
        title={isFr
          ? (<>Les <em className="italic font-light">boussoles</em>.</>)
          : (<>The <em className="italic font-light">Compasses</em>.</>)}
        subtitle={isFr
          ? "Un ensemble de cartes visuelles exposant les corps de connaissance et les compétences décisionnelles nécessaires pour prospérer avec l'imagination au 21e siècle."
          : "An ensemble of visual maps exposing the bodies of knowledge and decision-making skills required to thrive with imagination in the 21st century."}
        tone="clay"
      />

      <main className="flex-1">
        <section className="container mx-auto max-w-5xl px-6 py-16">
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                filter === null
                  ? "border-[hsl(345_65%_45%)] bg-[hsl(345_65%_45%)]/10 text-[hsl(345_65%_38%)]"
                  : "border-current/20 bg-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {isFr ? 'Tous' : 'All'}
            </button>
            {PHASES.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  filter === p
                    ? "border-[hsl(345_65%_45%)] bg-[hsl(345_65%_45%)]/10 text-[hsl(345_65%_38%)]"
                    : "border-current/20 bg-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin opacity-50" />
              </div>
            ) : visible.length === 0 ? (
              <p className="py-20 text-center opacity-60">
                {isFr ? 'Aucune boussole publiée pour cette phase.' : 'No published compasses for this phase yet.'}
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((c) => (
                  <Link
                    key={c.id}
                    to={`/book/compasses/${c.slug}`}
                    className="group flex flex-col rounded-sm border border-current/15 bg-background/40 p-5 transition-colors hover:border-[hsl(345_65%_45%)]/50 hover:-translate-y-0.5"
                  >
                    <h2 className="font-serif text-xl leading-tight group-hover:text-[hsl(345_65%_38%)]">
                      {c.name}
                    </h2>
                    {c.description && (
                      <p className="mt-2 text-sm opacity-70">{c.description}</p>
                    )}
                    {c.quote && (
                      <p className="mt-3 text-xs italic opacity-60">
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
                          className="border-current/20 bg-transparent text-[10px] uppercase tracking-[0.2em]"
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
