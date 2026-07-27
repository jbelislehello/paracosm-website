import type { Season, SeasonId } from "./types";
import pollens from "@/data/readiness/pollens.json";
import noems from "@/data/readiness/noems.json";
import poems from "@/data/readiness/poems.json";
import totems from "@/data/readiness/totems.json";
import anthems from "@/data/readiness/anthems.json";

export const SEASONS: Season[] = [
  pollens as unknown as Season,
  noems as unknown as Season,
  poems as unknown as Season,
  totems as unknown as Season,
  anthems as unknown as Season,
];

export const SEASON_BY_ID: Record<SeasonId, Season> = {
  pollens: pollens as unknown as Season,
  noems: noems as unknown as Season,
  poems: poems as unknown as Season,
  totems: totems as unknown as Season,
  anthems: anthems as unknown as Season,
};

export const SEASON_ORDER: SeasonId[] = ["pollens", "noems", "poems", "totems", "anthems"];
