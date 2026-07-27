import type { Season, SeasonId } from "./types";
import pollens from "@/data/readiness/pollens.json";
import noems from "@/data/readiness/noems.json";
import poems from "@/data/readiness/poems.json";
import totems from "@/data/readiness/totems.json";
import anthems from "@/data/readiness/anthems.json";

export const SEASONS: Season[] = [
  pollens as Season,
  noems as Season,
  poems as Season,
  totems as Season,
  anthems as Season,
];

export const SEASON_BY_ID: Record<SeasonId, Season> = {
  pollens: pollens as Season,
  noems: noems as Season,
  poems: poems as Season,
  totems: totems as Season,
  anthems: anthems as Season,
};

export const SEASON_ORDER: SeasonId[] = ["pollens", "noems", "poems", "totems", "anthems"];
