import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePageSeo } from "@/hooks/usePageSeo";
import { OPERATOR_SYMPTOMS } from "@/data/operatorSymptoms";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { EditorialPageHero } from "@/components/editorial";
import { useLanguage } from "@/contexts/LanguageContext";

const PHASE_LABEL: Record<string, string> = {
  GLITCH: "GL!TCH",
  DRIFT: "Drift",
  TUNE: "Tune",
  LOVE: "Love",
  MAGIC: "Magic",
  CALM: "Calm",
  OPEN: "Open",
  FREE: "Free",
};

export default function BookOperatorsIndex() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  usePageSeo({
    title: isFr ? "Index des opérateur·rice·s — Calm Magic" : "Operator's Index — Calm Magic",
    description: isFr
      ? "Un index par symptôme pour Calm Magic à l'intention des fondateur·rice·s, COO et responsables de transformation. Choisissez la friction que vous ressentez — lisez le chapitre dont vous avez vraiment besoin."
      : "A symptom-first index into Calm Magic for founders, COOs, and transformation leads. Pick the friction you're feeling — read the chapter you actually need.",
    path: "/book/operators-index",
  });

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(230_35%_10%)] text-[hsl(35_20%_92%)]">
      <header className="fixed z-50 w-full border-b border-white/10 bg-[hsl(230_35%_10%)]/85 backdrop-blur-md">
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
        numeral="09"
        kicker={isFr ? "Édition Opérateur · Index des symptômes" : "Operator's Cut · Symptom Index"}
        title={isFr
          ? (<>Choisissez la friction. Lisez le chapitre dont vous avez <em className="italic font-light">vraiment</em> besoin.</>)
          : (<>Pick the friction. Read the chapter you <em className="italic font-light">actually</em> need.</>)}
        subtitle={isFr
          ? "L'Édition Opérateur est la version terrain de 90 minutes de Calm Magic — pour la fondation, le·la COO ou le·la responsable de transformation qui a besoin de vocabulaire pour ce qu'iel ressent, d'un geste pour la semaine prochaine, et d'un diagnostic à faire tourner avec son équipe lundi."
          : "The Operator's Cut is the 90-minute field edition of Calm Magic — for the founder, COO, or transformation lead who needs vocabulary for what they're feeling, one move for next week, and a diagnostic to run with their team Monday."}
        tone="night"
      />

      <main className="flex-1">
        <section className="container mx-auto max-w-3xl px-6 py-16">


          <ul className="mt-10 space-y-3">
            {OPERATOR_SYMPTOMS.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/book/chapter/${s.chapterSlug}?edition=pragmatic`}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-white/15 bg-white/5 text-[10px] uppercase tracking-wider">
                          {PHASE_LABEL[s.phase] ?? s.phase}
                        </Badge>
                        <span className="font-vhs text-[10px] uppercase tracking-widest text-white/40">
                          {s.tileHint}
                        </span>
                      </div>
                      <p className="text-base font-medium leading-snug text-white group-hover:text-[hsl(var(--bloom-cream))]">
                        "{s.symptom}"
                      </p>
                      <p className="mt-2 text-sm text-white/60">
                        <span className="text-white/40">{isFr ? 'Geste de lundi · ' : 'Monday move · '}</span>{s.monday}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-500/10 to-rose-500/5 p-6 text-sm text-white/75">
            <p className="font-semibold text-white">{isFr ? 'Vous ne voyez pas votre friction ?' : "Don't see your friction?"}</p>
            <p className="mt-2">
              {isFr
                ? (<>Le Guide de terrain (l'édition visionnaire) explore des phases adjacentes en prose plus profonde. Commencez au début du livre ou écrivez à{" "}<a href="mailto:jbelisle@helloarchitekt.com" className="underline">jbelisle@helloarchitekt.com</a>{" "}et nous vous orienterons.</>)
                : (<>The Field Guide (the visionary edition) explores adjacent phases in deeper prose. Start at the front of the book or write to{" "}<a href="mailto:jbelisle@helloarchitekt.com" className="underline">jbelisle@helloarchitekt.com</a>{" "}and we'll route you.</>)}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
