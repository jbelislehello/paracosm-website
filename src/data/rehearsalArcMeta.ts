/**
 * Rehearsal Arc — ontological dictionaries.
 *
 * Every offering in the Rehearsal Arc (Foreplay / Foresight / Forecast) is
 * scored through the same two coordinates:
 *
 *   • 5 cognitive states — LOVE · MAGIC · CALM · OPEN · FREE
 *   • 3 simultaneous journeys — Narrative · Cognitive · Identity
 *
 * These dictionaries are the single source of truth. Site pages, the
 * facilitator PPTX and the DOCX workbook all read from here so the
 * language stays coherent across surfaces.
 */

export type CalmMagicState = "LOVE" | "MAGIC" | "CALM" | "OPEN" | "FREE";
export type JourneyTrack = "narrative" | "cognitive" | "identity";
export type ArcTier = "foreplay" | "foresight" | "forecast";

export const STATE_ORDER: CalmMagicState[] = ["LOVE", "MAGIC", "CALM", "OPEN", "FREE"];

export const STATE_META: Record<
  CalmMagicState,
  {
    label: string;
    role: string;
    intent: string;
    facilitatorMove: string;
    accent: string; // hex, used in PPTX/mermaid; site uses tone tokens
  }
> = {
  LOVE: {
    label: "Love",
    role: "Why this matters",
    intent: "Anchor emotional resonance and the meaningful future.",
    facilitatorMove: "Open a door — never a slide deck.",
    accent: "#B85042",
  },
  MAGIC: {
    label: "Magic",
    role: "The reframe",
    intent: "Surprise the pattern. Break the default lens.",
    facilitatorMove: "Show the thing they didn't know was there.",
    accent: "#6D2E46",
  },
  CALM: {
    label: "Calm",
    role: "Organize complexity",
    intent: "Introduce the framework. Reduce uncertainty.",
    facilitatorMove: "Draw the map slowly. Name each region once.",
    accent: "#065A82",
  },
  OPEN: {
    label: "Open",
    role: "Pattern discovery",
    intent: "Interactive exercise. Reflection made legible.",
    facilitatorMove: "Get out of the way. Notice, don't teach.",
    accent: "#2C5F2D",
  },
  FREE: {
    label: "Free",
    role: "Commitment",
    intent: "Clear next step. One thing to try on Monday.",
    facilitatorMove: "Ask for the smallest brave promise.",
    accent: "#B8860B",
  },
};

export const JOURNEY_META: Record<
  JourneyTrack,
  { label: string; question: string; artefact: string }
> = {
  narrative: {
    label: "Narrative",
    question: "What is the story people will tell tomorrow?",
    artefact: "A quotable line.",
  },
  cognitive: {
    label: "Cognitive",
    question: "What is the model they now hold in their hands?",
    artefact: "A diagram they can redraw from memory.",
  },
  identity: {
    label: "Identity",
    question: "Who do they now see themselves becoming?",
    artefact: "A first-person sentence starting with 'I am someone who…'",
  },
};

export const TIER_META: Record<
  ArcTier,
  { label: string; phase: string; kicker: string; blurb: string; tone: "warm" | "night" | "clay" }
> = {
  foreplay: {
    label: "Foreplay",
    phase: "Trainings",
    kicker: "Rehearse the moves",
    blurb: "Build the muscle before the stakes get real.",
    tone: "warm",
  },
  foresight: {
    label: "Foresight",
    phase: "Retreats",
    kicker: "Sense what wants to happen",
    blurb: "Slow down long enough to see the shape of the next decade.",
    tone: "night",
  },
  forecast: {
    label: "Forecast",
    phase: "Residencies",
    kicker: "Ship the evidence",
    blurb: "Turn the vision into measurable, working proof.",
    tone: "clay",
  },
};
