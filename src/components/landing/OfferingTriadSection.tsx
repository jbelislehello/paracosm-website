import { Link } from "react-router-dom";
import { ArrowUpRight, Flame, Eye, Hammer, Check } from "lucide-react";
import {
  EditorialSection,
  EditorialChapterHeader,
  editorialTone,
  editorialType,
} from "@/components/editorial";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Offering = {
  fWord: string;
  label: string;
  route: string;
  Icon: typeof Flame;
  promise: string;
  bullets: string[];
  cta: string;
};

const OFFERINGS: Offering[] = [
  {
    fWord: "Foreplay",
    label: "Trainings",
    route: "/trainings",
    Icon: Flame,
    promise:
      "Warm up your team's nervous system for AI — attunement, vocabulary, and capability before you touch a roadmap.",
    bullets: [
      "Shared language across roles",
      "Hands-on board literacy",
      "Confidence before commitment",
    ],
    cta: "Browse trainings",
  },
  {
    fWord: "Foresight",
    label: "Vision Retreats",
    route: "/events-and-retreats#events",
    Icon: Eye,
    promise:
      "Step out of the operational fog and sense the preferable future your organization is already trying to become.",
    bullets: [
      "Off-site immersion (Azores 2026)",
      "Living ontology of your questions",
      "A direction worth committing to",
    ],
    cta: "See retreats",
  },
  {
    fWord: "Forecast",
    label: "Prototype Residencies",
    route: "/residencies",
    Icon: Hammer,
    promise:
      "Build evidence of the future you saw — working prototypes, agentic systems, and proof your roadmap can stand on.",
    bullets: [
      "Embedded build cycles",
      "Agentic prototypes, not slides",
      "Evidence for the next decision",
    ],
    cta: "Explore residencies",
  },
];

export default function OfferingTriadSection() {
  const tone = editorialTone.night;

  return (
    <EditorialSection id="offering-triad" tone="night">
      <EditorialChapterHeader
        tone="night"
        numeral="02"
        kicker="The Arc"
        subtitle="One practice, three intensities."
      />

      <p
        className={cn(
          editorialType.serif,
          "italic text-lg md:text-xl max-w-2xl opacity-80 mb-16 md:mb-20 leading-relaxed",
        )}
      >
        From warm-up to evidence — the Paracosm path moves teams from{" "}
        <span className={tone.kicker}>attunement</span> through{" "}
        <span className={tone.kicker}>vision</span> into{" "}
        <span className={tone.kicker}>built prototypes</span>.
      </p>

      <div className="grid gap-px bg-white/10 border border-white/10 md:grid-cols-3">
        {OFFERINGS.map((o, i) => (
          <article
            key={o.fWord}
            className="relative bg-[hsl(230_35%_10%)] p-8 md:p-10 flex flex-col"
          >
            {/* Index row */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <span className={cn(editorialType.caption, tone.kicker)}>
                № 0{i + 1} · {o.label}
              </span>
              <o.Icon className={cn("w-5 h-5", tone.numeral)} strokeWidth={1.25} />
            </div>

            {/* F-word — serif drop headline */}
            <h3
              className={cn(
                editorialType.serif,
                "text-5xl md:text-6xl leading-[0.95] tracking-tight",
              )}
            >
              {o.fWord}
            </h3>

            {/* Promise — italic serif standfirst */}
            <p
              className={cn(
                editorialType.serif,
                "italic text-base md:text-lg mt-5 opacity-85 leading-relaxed",
              )}
            >
              {o.promise}
            </p>

            {/* Bullets */}
            <ul className="mt-8 space-y-3">
              {o.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm opacity-80 border-b border-white/5 pb-3 last:border-b-0"
                >
                  <Check
                    className={cn("w-4 h-4 mt-0.5 flex-shrink-0", tone.numeral)}
                    strokeWidth={1.5}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-auto pt-10">
              <Link
                to={o.route}
                onClick={() =>
                  trackEvent("offering_cta_click", {
                    f_word: o.fWord,
                    label: o.label,
                    route: o.route,
                    cta: o.cta,
                    source: "offering_triad",
                  })
                }
                className={cn(
                  editorialType.cta,
                  "inline-flex items-center gap-2 pb-1 border-b-2 transition-colors",
                  tone.accentBorder,
                  "hover:opacity-70",
                )}
              >
                {o.cta}
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Connective tissue */}
      <div className="mt-14 flex items-center gap-4">
        <span className={cn("h-px flex-1", tone.accentBorder, "border-t")} />
        <p className={cn(editorialType.caption, "opacity-70")}>
          Foreplay → Foresight → Forecast · one continuous arc
        </p>
        <span className={cn("h-px flex-1", tone.accentBorder, "border-t")} />
      </div>
    </EditorialSection>
  );
}
