export type ProductMaturity = "live" | "in-flight" | "seeded";

export interface ParacosmProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  maturity: ProductMaturity;
  moat: string;
  exitThesis: string;
  href?: string;
  color: string;
}

export const PARACOSM_PRODUCTS: ParacosmProduct[] = [
  {
    slug: "readiness-platform",
    name: "Calm Magic Readiness Platform",
    tagline: "The diagnostic wedge",
    description:
      "A 5-season, 320-tile assessment that measures personal readiness against organizational maturity across LOVE, MAGIC, CALM, OPEN, and FREE — the signal before deploying relational AI.",
    category: "Diagnostic SaaS",
    maturity: "in-flight",
    moat: "Proprietary ontology (Pollens · Noems · Poems · Totems · Anthems) mapped to 320 dual-axis questions. Every completed assessment adds calibration data no competitor can replicate.",
    exitThesis:
      "Strategic acquirer in leadership development, HR-tech, or AI-governance tooling. The corpus of readiness snapshots becomes the training set for the entire ecosystem.",
    href: "/readiness",
    color: "#3080D8",
  },
  {
    slug: "calm-magic-deck",
    name: "Calm Magic Deck",
    tagline: "The physical object",
    description:
      "A 64-card matrix deck (8 rows × 8 columns) that turns the ontology into a facilitation surface. Used solo, in teams, or in Rehearsal Arc sessions to move from felt sense to structured decision.",
    category: "Product · Physical",
    maturity: "in-flight",
    moat: "Card semantics are the same primitives that power the digital board — every physical spread has a canonical digital equivalent.",
    exitThesis: "Licensing to coaching networks, retreat centres, and enterprise L&D partners.",
    href: "/tarot",
    color: "#E05580",
  },
  {
    slug: "calm-magic-book",
    name: "Calm Magic — The Book",
    tagline: "The canonical text",
    description:
      "The public-facing articulation of the framework. Chapter-by-chapter operator's manual for regulating, imagining, structuring, workflowing, and launching.",
    category: "Publishing · IP",
    maturity: "in-flight",
    moat: "First-mover authorship on the vocabulary. Sets terminology the rest of the portfolio inherits.",
    exitThesis: "Trade publishing deal + translation rights. Anchors keynote and consulting pipeline.",
    href: "/book",
    color: "#8055D0",
  },
  {
    slug: "subscription-agents",
    name: "8 Calm Magic Agents",
    tagline: "The recurring engine",
    description:
      "Eight relational AI assistants — one per row of the board — that convert conversations into structured ontology. Each interaction refines the shared corpus.",
    category: "SaaS · Recurring",
    maturity: "in-flight",
    moat: "The corpus of interaction data is the moat. Every session teaches the agents patterns no general-purpose LLM has seen.",
    exitThesis: "Vertical AI acquirer in coaching, org-design, or executive-support platforms.",
    href: "/calm-magic-assistant",
    color: "#20B870",
  },
  {
    slug: "facilitator-certification",
    name: "Facilitator Certification",
    tagline: "The distribution network",
    description:
      "Trained practitioners who deliver the methodology at scale — carrying the Rehearsal Arc into organizations we'd never reach directly.",
    category: "Training · Network",
    maturity: "seeded",
    moat: "Certified operators become channel partners, not competitors. The network compounds with every cohort.",
    exitThesis:
      "Retained as a services layer post-acquisition, or spun off as an independent training body.",
    href: "/programs/rehearsal-arc",
    color: "#E09030",
  },
  {
    slug: "nature-retreats",
    name: "Nature Retreats",
    tagline: "The premium container",
    description:
      "In-person, land-based intensives — Azores flagship, mobile pop-ups elsewhere — where the framework is embodied over multi-day arcs.",
    category: "Experience · Premium",
    maturity: "in-flight",
    moat: "Physical scarcity + brand association. Highest-margin surface for the ecosystem.",
    exitThesis: "Retreats stay founder-led; they anchor brand equity that inflates every other asset.",
    href: "/paracosm-retreat",
    color: "#E05580",
  },
  {
    slug: "satori-kensho-music",
    name: "Satori & Kensho Music",
    tagline: "The zero-marginal-cost layer",
    description:
      "Original scored music tied to the 5-season ontology — used in retreats, agent voice environments, and licensable for sync placement.",
    category: "Music · IP",
    maturity: "seeded",
    moat: "Purpose-composed to the framework's axes. Each track is a proprietary sonic signature.",
    exitThesis:
      "Sync licensing pipeline for wellness, film, and interactive media. Independent revenue stream with no delivery cost.",
    color: "#8055D0",
  },
  {
    slug: "ai-readiness-consulting",
    name: "AI Readiness Consulting",
    tagline: "The high-margin bridge",
    description:
      "Bespoke engagements that translate readiness assessments into deployment roadmaps for organizations preparing to introduce relational AI.",
    category: "Services · Bespoke",
    maturity: "live",
    moat: "Diagnostic → prescription pipeline no consultancy can replicate without the underlying ontology.",
    exitThesis:
      "Cashflow engine funding the productized surfaces. Optional roll-up into a boutique firm at exit.",
    href: "/contact",
    color: "#20B870",
  },
];

export const MATURITY_LABEL: Record<ProductMaturity, string> = {
  live: "Live",
  "in-flight": "In flight",
  seeded: "Seeded",
};
