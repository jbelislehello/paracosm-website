/**
 * Editorial art-direction tokens — the single source of truth for the
 * magazine-style visual system used across the Paracosm site.
 *
 * Consumed by <EditorialSection>, <EditorialChapterHeader>,
 * <EditorialPullQuote>, <EditorialWovenCallout>, <EditorialPlate>,
 * <EditorialCTA>.
 *
 * Tones alternate down a page to give the publication its cadence:
 *   warm  — cream/paper, ember accent   (default openings)
 *   night — deep indigo, gold accent    (reflection / retreat / closings)
 *   clay  — dusty rose, magenta accent  (residencies, embodied work)
 *   paper — near-white with hairlines   (dense catalogue pages)
 */

export type EditorialTone = "warm" | "night" | "clay" | "paper";

export const editorialTone: Record<
  EditorialTone,
  {
    section: string;
    numeral: string;
    accentBorder: string;
    kicker: string;
    quoteBorder: string;
    calloutBox: string;
    ctaPrimary: string;
    ctaGhost: string;
  }
> = {
  warm: {
    section:
      "bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)] text-foreground",
    numeral: "text-[hsl(15_75%_55%)]",
    accentBorder: "border-[hsl(15_75%_55%)]",
    kicker: "text-[hsl(15_75%_45%)]",
    quoteBorder: "border-current/40",
    calloutBox: "border-current/15 bg-current/5",
    ctaPrimary: "bg-foreground text-background",
    ctaGhost: "border border-current/40 text-current hover:bg-current/10",
  },
  night: {
    section: "bg-[hsl(230_35%_10%)] text-[hsl(35_20%_92%)]",
    numeral: "text-[hsl(45_90%_65%)]",
    accentBorder: "border-[hsl(45_90%_65%)]",
    kicker: "text-[hsl(45_90%_65%)]",
    quoteBorder: "border-[hsl(45_90%_65%)]",
    calloutBox: "border-white/15 bg-white/5",
    ctaPrimary: "bg-[hsl(45_90%_65%)] text-[hsl(230_35%_10%)]",
    ctaGhost: "border border-white/30 text-current hover:bg-white/10",
  },
  clay: {
    section:
      "bg-[hsl(15_35%_92%)] dark:bg-[hsl(15_15%_14%)] text-foreground",
    numeral: "text-[hsl(345_65%_45%)]",
    accentBorder: "border-[hsl(345_65%_45%)]",
    kicker: "text-[hsl(345_65%_38%)]",
    quoteBorder: "border-current/40",
    calloutBox: "border-current/15 bg-current/5",
    ctaPrimary: "bg-foreground text-background",
    ctaGhost: "border border-current/40 text-current hover:bg-current/10",
  },
  paper: {
    section: "bg-background text-foreground",
    numeral: "text-primary",
    accentBorder: "border-primary",
    kicker: "text-primary",
    quoteBorder: "border-current/30",
    calloutBox: "border-border bg-muted/40",
    ctaPrimary: "bg-foreground text-background",
    ctaGhost: "border border-border text-foreground hover:bg-muted",
  },
};

export const editorialType = {
  serif: "font-serif",
  kicker:
    "text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold opacity-70",
  eyebrow: "text-xs font-bold uppercase tracking-[0.4em]",
  caption: "text-[10px] uppercase tracking-[0.3em] opacity-70",
  cta: "text-xs font-semibold uppercase tracking-[0.2em]",
};
