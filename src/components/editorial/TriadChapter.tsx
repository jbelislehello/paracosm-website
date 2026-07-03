import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface TriadChapterProps {
  numeral: string;
  kicker: string; // Foreplay / Foresight / Forecast
  offering: string; // Trainings / Vision Retreats / Prototype Residencies
  headline: string;
  pullQuote: string;
  body: string[];
  woven?: { title: string; points: string[] };
  image: string;
  imageAlt: string;
  cta: { label: string; href: string; eventName: string };
  reverse?: boolean;
  tone: "warm" | "night" | "clay";
}

const toneStyles: Record<TriadChapterProps["tone"], string> = {
  warm: "bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)] text-foreground",
  night: "bg-[hsl(230_35%_10%)] text-[hsl(35_20%_92%)]",
  clay: "bg-[hsl(15_35%_92%)] dark:bg-[hsl(15_15%_14%)] text-foreground",
};

const numeralTone: Record<TriadChapterProps["tone"], string> = {
  warm: "text-[hsl(15_75%_55%)]",
  night: "text-[hsl(45_90%_65%)]",
  clay: "text-[hsl(345_65%_45%)]",
};

export default function TriadChapter({
  numeral,
  kicker,
  offering,
  headline,
  pullQuote,
  body,
  woven,
  image,
  imageAlt,
  cta,
  reverse = false,
  tone,
}: TriadChapterProps) {
  return (
    <section className={cn("py-20 md:py-32 px-6 relative", toneStyles[tone])}>
      <div className="container max-w-7xl mx-auto">
        {/* Chapter header */}
        <div className="flex items-baseline gap-6 mb-12 md:mb-16 border-b border-current/10 pb-6">
          <span className={cn("font-serif text-6xl md:text-8xl leading-none", numeralTone[tone])}>
            {numeral}
          </span>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-60">
              Chapter {numeral} · {offering}
            </p>
            <p className="mt-1 font-serif italic text-2xl md:text-3xl">{kicker}</p>
          </div>
        </div>

        {/* Spread */}
        <div className={cn("grid md:grid-cols-12 gap-10 md:gap-16 items-start", reverse && "md:[&>*:first-child]:order-2")}>
          <div className="md:col-span-7 space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              {headline}
            </h2>

            <blockquote className={cn("border-l-4 pl-5 py-2 font-serif italic text-xl md:text-2xl leading-snug", tone === "night" ? "border-[hsl(45_90%_65%)]" : "border-current/40")}>
              “{pullQuote}”
            </blockquote>

            <div className="grid sm:grid-cols-2 gap-6 text-[15px] leading-relaxed opacity-90">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {woven && (
              <div className={cn("mt-4 rounded-2xl p-6 border", tone === "night" ? "border-white/15 bg-white/5" : "border-current/15 bg-current/5")}>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 mb-2">
                  Calm Magic woven in
                </p>
                <p className="font-serif text-lg mb-3">{woven.title}</p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm opacity-90">
                  {woven.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <span className="opacity-50">→</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              to={cta.href}
              onClick={() => trackEvent(cta.eventName, { chapter: numeral, offering })}
              className={cn(
                "inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5",
                tone === "night"
                  ? "bg-[hsl(45_90%_65%)] text-[hsl(230_35%_10%)]"
                  : "bg-foreground text-background",
              )}
            >
              {cta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <figure className="md:col-span-5 md:sticky md:top-24">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">Plate {numeral}</p>
                <p className="text-white text-sm">{imageAlt}</p>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
