export type CalmMagicAxis = "MAGIC" | "LOVE" | "CALM" | "OPEN" | "FREE";

export interface AxisResonance {
  axis: CalmMagicAxis;
  score: number;
  rationale: string;
  tile_hints: string[];
  tiles: { id: number; prompt: string }[];
}

export interface ResonanceMapData {
  question: string;
  axes: AxisResonance[];
}

export const AXIS_ORDER: CalmMagicAxis[] = [
  "MAGIC",
  "LOVE",
  "CALM",
  "OPEN",
  "FREE",
];

export const AXIS_LABEL: Record<CalmMagicAxis, string> = {
  MAGIC: "Magic",
  LOVE: "Love",
  CALM: "Calm",
  OPEN: "Open",
  FREE: "Free",
};

export const AXIS_BLURB: Record<CalmMagicAxis, string> = {
  MAGIC: "Imagination & speculative futures",
  LOVE: "Care & relationships",
  CALM: "Rigor, evidence & governance",
  OPEN: "Workflow, ontology & integration",
  FREE: "Outcomes & sovereignty",
};
