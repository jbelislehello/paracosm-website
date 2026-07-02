import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { residencies } from "@/data/residencies";
import { retreatImages, formatCredit } from "@/assets/retreats";
import { useImageCredits } from "@/hooks/useImageCredits";
import { trackEvent } from "@/lib/analytics";

const ResidenciesSection: React.FC = () => {
  const { getCredit } = useImageCredits();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || trackedRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !trackedRef.current) {
            trackedRef.current = true;
            trackEvent("residencies_section_view", {
              intersection_ratio: Number(entry.intersectionRatio.toFixed(2)),
              count: residencies.length,
            });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="residencies"
      className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-background via-background to-muted/30"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="max-w-3xl mb-10 md:mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Expansive Leadership Residencies
          </p>
          <h2 className="text-3xl md:text-5xl font-light leading-tight mb-5 text-foreground">
            Seven elemental ways<br />
            <span className="italic text-muted-foreground">to think, feel, and lead.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-4">
            Each residency is an embodied apprenticeship with a non-human teacher. You don't
            study the forest — you let it reorganize how you make decisions. Choose the element
            that matches the season you're in.
          </p>
          <p className="text-sm md:text-base text-muted-foreground/85 italic max-w-2xl leading-relaxed">
            Each archetype is a doorway into Calm Magic's relational intelligence —
            a way of leading the nervous system can actually sustain.
          </p>
        </div>

        {/* Ambient photo strip */}
        <figure className="relative mb-14 md:mb-16 overflow-hidden rounded-2xl shadow-[0_30px_70px_-40px_hsl(220_30%_15%/0.4)]">
          <div className="aspect-[21/9] w-full">
            <img
              src={retreatImages.mountainSummit}
              alt="A cohort sitting in summit light — long-horizon time, executive body."
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-tr from-background/85 via-background/10 to-transparent"
          />
          <figcaption className="absolute bottom-5 md:bottom-8 left-5 md:left-10 max-w-md">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/70 mb-2">
              From the field
            </p>
            <p className="text-lg md:text-2xl font-light leading-snug text-foreground">
              Cohorts already thinking like mountains, rivers, and forests.
            </p>
            <p className="mt-2 text-[10px] tracking-wide text-foreground/55">
              {formatCredit(getCredit("mountainSummit"))}
            </p>
          </figcaption>
        </figure>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {residencies.map((r, i) => (
            <Link
              key={r.id}
              to={`/residencies/${r.id}`}
              id={`residency-${r.id}`}
              onClick={() =>
                trackEvent("residency_card_click", {
                  residency_id: r.id,
                  residency_name: r.name,
                  position: i,
                  source: "residencies_section",
                })
              }
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
            </Link>
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
