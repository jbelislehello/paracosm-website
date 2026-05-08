import React from "react";
import { Link } from "react-router-dom";

const movements = [
  {
    label: "Listen",
    body: "Three days of silence with the body — somatic listening practices, breath-mapping, and field attunement. Strategy is suspended; sensation is recovered.",
  },
  {
    label: "Move",
    body: "Movement scores, contact improvisation, and ritual choreography. The questions you carry get danced before they get spoken.",
  },
  {
    label: "Make",
    body: "A small, irreducible artifact: a poem, a gesture, a diagram, a sound piece. Something the organization couldn't have designed in a meeting.",
  },
];

const SomaticCreativityRetreat: React.FC = () => {
  return (
    <section
      id="somatic-retreat"
      className="relative py-20 md:py-28 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, hsl(35 30% 96%), hsl(15 35% 92%) 60%, hsl(355 25% 90%))",
      }}
    >
      <div className="container max-w-5xl mx-auto relative">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/60 mb-4">
              Somatic Creativity Retreat
            </p>
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
              A retreat where the body composes the strategy.
            </h2>
            <p className="text-base md:text-lg text-foreground/75 leading-relaxed mb-8">
              For founders, executives, and artists who lead through their nervous system
              and want to remember how. Five days off-grid, in a small circle, guided through
              listening, movement, and the making of one true thing.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-full bg-foreground text-background hover:bg-foreground/85 transition-colors"
              >
                Request an invitation →
              </a>
              <Link
                to="/paracosm-retreat"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-full border border-foreground/20 text-foreground hover:bg-foreground/5 transition-colors"
              >
                Flagship: Azores 2026
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 space-y-5">
            {movements.map((m, i) => (
              <div
                key={m.label}
                className="group relative pl-8 md:pl-12 py-4 border-l border-foreground/15"
              >
                <span className="absolute -left-[7px] top-5 w-3 h-3 rounded-full bg-foreground/70" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-1">
                  Movement {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-2xl md:text-3xl font-light text-foreground mb-2">
                  {m.label}
                </h3>
                <p className="text-sm md:text-base text-foreground/75 leading-relaxed max-w-xl">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SomaticCreativityRetreat;
