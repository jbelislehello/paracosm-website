import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePageSeo } from "@/hooks/usePageSeo";
import { OPERATOR_SYMPTOMS } from "@/data/operatorSymptoms";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import ScanlineOverlay from "@/components/aesthetic/ScanlineOverlay";
import logoParacosm from "@/assets/logo-paracosm.jpeg";

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
  usePageSeo({
    title: "Operator's Index — Calm Magic",
    description:
      "A symptom-first index into Calm Magic for founders, COOs, and transformation leads. Pick the friction you're feeling — read the chapter you actually need.",
    path: "/book/operators-index",
  });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="fixed z-50 w-full overflow-hidden border-b border-[hsl(var(--bloom-magenta)/0.25)] bg-[hsl(var(--bloom-ink)/0.85)] backdrop-blur-md">
        <ScanlineOverlay />
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="h-8 w-8 rounded-lg bg-white p-1 object-contain" />
            <span className="font-display text-sm text-[hsl(var(--bloom-cream))]">Paracosm</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/book" className="flex items-center gap-1 font-vhs text-xs uppercase tracking-widest text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to book
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24">
        <section className="container mx-auto max-w-3xl px-6 py-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-wider text-white/70">
            <Briefcase className="h-3 w-3" /> Operator's Cut · Symptom Index
          </div>
          <h1 className="font-display text-4xl leading-[1.02] tracking-tight text-[hsl(var(--bloom-cream))] md:text-5xl">
            Pick the friction. Read the chapter you actually need.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/70">
            The Operator's Cut is the 90-minute field edition of Calm Magic — for the founder,
            COO, or transformation lead who needs vocabulary for what they're feeling, one move
            for next week, and a diagnostic to run with their team Monday. Start with the
            symptom that sounds most like your week.
          </p>

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
                        <span className="text-white/40">Monday move · </span>{s.monday}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-500/10 to-rose-500/5 p-6 text-sm text-white/75">
            <p className="font-semibold text-white">Don't see your friction?</p>
            <p className="mt-2">
              The Field Guide (the visionary edition) explores adjacent phases in deeper prose.
              Start at the front of the book or write to{" "}
              <a href="mailto:jbelisle@helloarchitekt.com" className="underline">jbelisle@helloarchitekt.com</a>{" "}
              and we'll route you.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
