export type Lang = "en" | "fr";
export type Lens = "self" | "team";

export interface LocalizedText {
  en: string;
  fr: string;
}

export interface RelationalQuestion {
  id: string;
  self: LocalizedText;
  team: LocalizedText;
}

export interface RelationalDimension {
  id: string;
  color: string;
  name: LocalizedText;
  blurb: LocalizedText;
  openPrompt: LocalizedText;
  practices: { en: string[]; fr: string[] };
  questions: RelationalQuestion[];
}

export interface RelationalDataFile {
  version: number;
  scale: { en: string[]; fr: string[] };
  dimensions: RelationalDimension[];
}

/** -1 means unanswered. */
export interface RelationalAnswer {
  self: number;
  team: number;
  openText?: string;
}

/** dimensionId -> questionId -> answer */
export type RelationalAnswersMap = Record<string, Record<string, RelationalAnswer>>;

export interface GapReading {
  label: LocalizedText;
  signal: LocalizedText;
}

export interface DimensionScore {
  self: number; // 0..100
  team: number; // 0..100
  gap: number; // team - self
  composite: number;
  answered: number;
  total: number;
  complete: boolean;
  reading: GapReading;
}

export interface RelationalOverall {
  self: number;
  team: number;
  gap: number;
  composite: number;
}

export interface RelationalSnapshot {
  kind: "relational";
  version: 1;
  ownerEmail?: string | null;
  overall: RelationalOverall;
  dimensionScores: Record<string, DimensionScore>;
  answers: RelationalAnswersMap;
  builtAt: string;
}
