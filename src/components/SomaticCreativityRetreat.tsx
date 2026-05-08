import React from "react";
import { Link } from "react-router-dom";
import { retreatImages, retreatImageCredits, formatCredit } from "@/assets/retreats";

const movements = [
  {
    label: "Listen",
    body: "Three days of silence with the body — somatic listening practices, breath-mapping, and field attunement. Strategy is suspended; sensation is recovered.",
    image: retreatImages.lakePortrait,
    caption: "Field attunement — listening before language.",
    credit: formatCredit(retreatImageCredits.lakePortrait),
  },
  {
    label: "Move",
    body: "Movement scores, contact improvisation, and ritual choreography. The questions you carry get danced before they get spoken.",
    image: retreatImages.forestCircle,
    caption: "Cohort circle in motion, outdoor council.",
    credit: formatCredit(retreatImageCredits.forestCircle),
  },
  {
    label: "Make",
    body: "A small, irreducible artifact: a poem, a gesture, a diagram, a sound piece. Something the organization couldn't have designed in a meeting.",
    image: retreatImages.atelierCircle,
    caption: "An atelier table — making one true thing together.",
    credit: formatCredit(retreatImageCredits.atelierCircle),
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
      <div className="container max-w-6xl mx-auto relative">
        {/* Hero — text + portrait photo */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center mb-20 md:mb-28">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/60 mb-4">
              Somatic Creativity Retreat
            </p>
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
              A retreat where the body composes the strategy.
            </h2>
            <p className="text-sm md:text-base text-foreground/65 italic leading-relaxed mb-5 max-w-xl">
              The somatic root of <span className="not-italic font-medium text-foreground/80">Calm Magic</span> —
              a relational intelligence practice for leaders whose nervous system is the instrument.
            </p>
            <p className="text-base md:text-lg text-foreground/75 leading-relaxed mb-8 max-w-xl">
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

          <figure className="md:col-span-5 relative">
            <div className="relative overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_hsl(15_40%_25%/0.45)] aspect-[4/5]">
              <img
                src={retreatImages.atelierCircle}
                alt="A facilitated atelier circle around a working table — the relational intelligence practice at the heart of Calm Magic."
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-multiply opacity-25"
                style={{ background: "linear-gradient(135deg, hsl(15 40% 50%), transparent 60%)" }}
              />
            </div>
            <figcaption className="mt-3 text-[11px] uppercase tracking-[0.2em] text-foreground/55">
              Atelier — where strategy is composed by the room.
              <span className="ml-2 normal-case tracking-normal opacity-70">— {formatCredit(retreatImageCredits.atelierCircle)}</span>
            </figcaption>
          </figure>
        </div>

        {/* Three movements — alternating editorial layout */}
        <div className="space-y-16 md:space-y-24">
          {movements.map((m, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={m.label}
                className="grid md:grid-cols-12 gap-8 md:gap-14 items-center"
              >
                <figure
                  className={`md:col-span-7 relative ${reversed ? "md:order-2" : ""}`}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-[0_25px_50px_-25px_hsl(15_40%_25%/0.4)] aspect-[3/2]">
                    <img
                      src={m.image}
                      alt={m.caption}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-[11px] uppercase tracking-[0.2em] text-foreground/50">
                    {m.caption}
                    {m.credit && (
                      <span className="ml-2 normal-case tracking-normal opacity-70">— {m.credit}</span>
                    )}
                  </figcaption>
                </figure>

                <div className={`md:col-span-5 ${reversed ? "md:order-1 md:text-right" : ""}`}>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-3">
                    Movement {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-light text-foreground mb-4">
                    {m.label}
                  </h3>
                  <p className="text-base text-foreground/75 leading-relaxed">
                    {m.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SomaticCreativityRetreat;
