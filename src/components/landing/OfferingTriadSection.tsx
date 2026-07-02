import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Eye, Hammer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

type Offering = {
  fWord: string;
  label: string;
  route: string;
  Icon: typeof Flame;
  promise: string;
  bullets: string[];
  cta: string;
  accent: string; // tailwind classes using design tokens
  ring: string;
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
    accent: "from-[hsl(var(--bloom-magenta))] to-[hsl(var(--bloom-amber))]",
    ring: "hover:border-[hsl(var(--bloom-magenta)/0.6)]",
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
    accent: "from-[hsl(var(--bloom-amber))] to-[hsl(var(--bloom-magenta))]",
    ring: "hover:border-[hsl(var(--bloom-amber)/0.6)]",
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
    accent: "from-[hsl(var(--bloom-magenta))] via-[hsl(var(--bloom-amber))] to-[hsl(var(--bloom-magenta))]",
    ring: "hover:border-[hsl(var(--bloom-magenta)/0.6)]",
  },
];

export default function OfferingTriadSection() {
  return (
    <section
      id="offering-triad"
      className="relative py-20 md:py-28 px-4 bg-[hsl(var(--bloom-ink))] text-white overflow-hidden"
    >
      <div className="bloom-scanlines pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[hsl(var(--bloom-magenta)/0.25)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[hsl(var(--bloom-amber)/0.2)] blur-3xl" />

      <div className="container relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <p className="font-vhs uppercase tracking-[0.4em] text-xs text-[hsl(var(--bloom-amber))] mb-4">
            // The Arc
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] bloom-chroma-static text-white">
            One practice,
            <br />
            three intensities.
          </h2>
          <p className="mt-5 font-redacted italic text-base md:text-lg text-white/75 leading-relaxed">
            From warm-up to evidence — the Paracosm path moves teams from{" "}
            <span className="text-[hsl(var(--bloom-amber))]">attunement</span>{" "}
            through{" "}
            <span className="text-[hsl(var(--bloom-amber))]">vision</span> into{" "}
            <span className="text-[hsl(var(--bloom-amber))]">built prototypes</span>.
          </p>
        </div>

        {/* Triad */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {OFFERINGS.map((o, i) => (
            <motion.div
              key={o.fWord}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
              className="group relative"
            >
              {/* Gradient halo */}
              <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${o.accent} opacity-30 blur-md group-hover:opacity-60 transition-opacity`}
              />
              <article
                className={`relative h-full rounded-2xl border border-white/10 bg-[hsl(var(--bloom-ink)/0.85)] backdrop-blur p-7 md:p-8 flex flex-col ${o.ring} transition-colors`}
              >
                {/* Index marker */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-vhs uppercase tracking-[0.3em] text-[10px] text-[hsl(var(--bloom-amber))]">
                    0{i + 1} · {o.label}
                  </span>
                  <span
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${o.accent} flex items-center justify-center text-[hsl(var(--bloom-ink))] shadow-lg`}
                  >
                    <o.Icon className="w-5 h-5" />
                  </span>
                </div>

                <h3 className="font-display text-5xl md:text-6xl leading-none bloom-chroma-static text-white">
                  {o.fWord}
                </h3>

                <p className="mt-5 text-sm md:text-base text-white/80 leading-relaxed">
                  {o.promise}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {o.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm text-white/70"
                    >
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--bloom-amber))]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
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
                  >
                    <Button
                      variant="outline"
                      className="w-full border-white/20 bg-transparent text-white hover:bg-white hover:text-[hsl(var(--bloom-ink))] font-vhs uppercase tracking-widest text-xs gap-2"
                    >
                      {o.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* Connective tissue */}
        <p className="mt-10 text-center text-xs font-vhs uppercase tracking-[0.3em] text-white/50">
          Foreplay → Foresight → Forecast · one continuous arc
        </p>
      </div>
    </section>
  );
}
