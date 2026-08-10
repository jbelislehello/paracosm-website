import raw from "@/data/relational/dimensions.json";
import type { RelationalDataFile, RelationalDimension } from "./types";

const data = raw as unknown as RelationalDataFile;

export const RELATIONAL_SCALE = data.scale;
export const DIMENSIONS: RelationalDimension[] = data.dimensions;
export const DIMENSION_ORDER: string[] = DIMENSIONS.map((d) => d.id);
export const DIMENSION_BY_ID: Record<string, RelationalDimension> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.id, d]),
);
export const TOTAL_QUESTIONS = DIMENSIONS.reduce((n, d) => n + d.questions.length, 0);

export function emptyRelationalAnswers() {
  return Object.fromEntries(DIMENSIONS.map((d) => [d.id, {}])) as Record<
    string,
    Record<string, never>
  >;
}
