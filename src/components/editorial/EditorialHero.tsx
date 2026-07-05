import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";
import logoParacosm from "@/assets/logo-paracosm.jpeg";

export default function EditorialHero() {
  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/40 overflow-hidden">
      {/* decorative texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-accent blur-3xl" />
      </div>

      {/* Masthead */}
      <div className="relative z-10 container max-w-7xl mx-auto px-6 pt-8 pb-6 flex items-center justify-between border-b border-border/40">
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            An Editorial
          </div>
          <div className="text-sm font-semibold">Vol. I · Imagination as Infrastructure</div>
        </div>
        <Link
          to="/home"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Enter the site <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Spread */}
      <div className="relative z-10 flex-1 container max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-8">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
            Issue 01 · The Imagination Practice
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
            Outiller l'<em className="italic font-light">inventivité</em>
            <span className="block mt-2">
              et l'<span className="underline decoration-primary decoration-4 underline-offset-8">expressivité</span>.
            </span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Paracosm outille l'<b className="text-foreground">inventivité</b> (les Dreams) et
            l'<b className="text-foreground">expressivité</b> (le Learn) des dirigeants, équipes
            créatives et <b className="text-foreground">PME ambitieuses</b> — un même arc de{" "}
            <b className="text-foreground">Foreplay</b>, <b className="text-foreground">Foresight</b>,
            et <b className="text-foreground">Forecast</b> pour transformer les questions IA en
            évidences vécues, testées et livrées.
          </p>

        </div>

        <aside className="md:col-span-4 border-l border-border/60 pl-6 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">In this issue</p>
          <ol className="space-y-3 text-sm">
            {[
              ["01", "Foreplay — Trainings"],
              ["02", "Foresight — Vision Retreats"],
              ["03", "Forecast — Prototype Residencies"],
              ["04", "Innovation plays with partners"],
            ].map(([n, t]) => (
              <li key={n} className="flex gap-3">
                <span className="font-serif text-primary">{n}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-6 pb-10 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <span>Scroll to begin</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">Paracosm × Calm Magic</span>
      </div>
    </section>
  );
}
