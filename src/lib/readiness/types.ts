export type SeasonId = "pollens" | "noems" | "poems" | "totems" | "anthems";
export type Zone = "inner" | "stretch" | "edge";
export type QuestionType = "threePoint" | "likert5";
export type Axis = "personal" | "organizational";

export interface QuestionBlock {
  type: QuestionType;
  question: string;
  labels: string[];
}

export interface OpenBlock {
  type: "text";
  question: string;
}

export interface Tile {
  id: string;
  tileCode: string;
  row: { code: string; full: string; vel: number; module: string };
  col: { code: string; full: string; lon: number };
  zone: Zone;
  personal: QuestionBlock;
  organizational: QuestionBlock;
  open: OpenBlock | null;
}

export interface Season {
  season: string;
  seasonId: SeasonId;
  axis: string;
  color: string;
  description: string;
  tiles: Tile[];
}

export interface TileAnswer {
  personal: number; // 0-based index, -1 = unanswered
  organizational: number;
  openText?: string;
}

export type AnswersMap = Record<SeasonId, Record<string, TileAnswer>>;

export interface SeasonScore {
  personal: number; // 0..100
  organizational: number;
  gap: number; // org - personal
  composite: number;
  interpretation: GapInterpretation;
  zones?: { personal: Record<Zone, number>; organizational: Record<Zone, number> };
}

export interface GapInterpretation {
  label: string;
  signal: string;
  aiReadiness: "low" | "medium" | "high";
}

export interface OverallScore {
  personal: number;
  organizational: number;
  gap: number;
  composite: number;
}
