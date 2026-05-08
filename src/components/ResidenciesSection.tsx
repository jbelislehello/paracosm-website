import React from "react";
import { residencies } from "@/data/residencies";

const ResidenciesSection: React.FC = () => {
  return (
    <section
      id="residencies"
      className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-background via-background to-muted/30"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Expansive Leadership Residencies
          </p>
          <h2 className="text-3xl md:text-5xl font-light leading-tight mb-5 text-foreground">
            Seven elemental ways<br />
            <span className="italic text-muted-foreground">to think, feel, and lead.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Each residency is an embodied apprenticeship with a non-human teacher. You don't
            study the forest — you let it reorganize how you make decisions. Choose the element
            that matches the season you're in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {residencies.map((r, i) => (
            <a
              key={r.id}
              href={`#residency-${r.id}`}
              id={`residency-${r.id}`}
              className={`group relative overflow-hidden rounded-2xl p-6 md:p-7 border border-border/40 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                i === 0 ? "lg:col-span-2 lg:row-span-1" : ""
              } ${i === 6 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{
                background: `linear-gradient(135deg, hsl(${r.hueFrom} / 0.08), hsl(${r.hueTo} / 0.04))`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 30% 20%, hsl(${r.hueTo} / 0.18), transparent 60%)`,
                }}
              />
              <div className="relative flex flex-col h-full">
                <div className="flex items-start justify-between mb-5">
                  <span className="text-3xl md:text-4xl" aria-hidden>
                    {r.glyph}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-border/50 text-muted-foreground"
                    style={{ color: `hsl(${r.hueFrom})`, borderColor: `hsl(${r.hueFrom} / 0.4)` }}
                  >
                    Residency
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-medium mb-3 text-foreground">
                  {r.name}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5 italic">
                  {r.invitation}
                </p>

                <dl className="space-y-3 mt-auto pt-4 border-t border-border/40 text-sm">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Gesture trained
                    </dt>
                    <dd className="text-foreground/90">{r.gesture}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      For leaders facing
                    </dt>
                    <dd className="text-foreground/90">{r.forLeaders}</dd>
                  </div>
                </dl>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-14 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-w-3xl">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Residencies run as 1:1 or small-cohort apprenticeships across a season.
            Each one weaves somatic practice, relational fieldwork, and one creative artifact you
            carry back into your organization.
          </p>
          <a
            href="#contact"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-full bg-foreground text-background hover:bg-foreground/85 transition-colors"
          >
            Begin a residency →
          </a>
        </div>
      </div>
    </section>
  );
};

export default ResidenciesSection;
