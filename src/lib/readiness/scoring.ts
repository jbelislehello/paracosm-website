import type {
  Axis,
  GapInterpretation,
  OverallScore,
  Season,
  SeasonScore,
  Tile,
  TileAnswer,
  Zone,
} from "./types";

const ZONE_WEIGHTS: Record<Zone, number> = { inner: 3, stretch: 2, edge: 1 };
const MAX_SCALE = 5;

/** Convert 0-based answer index to 1..5 normalized value. */
export function normalize(answerIndex: number, type: "threePoint" | "likert5"): number {
  if (answerIndex < 0) return 0;
  if (type === "threePoint") return [1, 3, 5][Math.min(2, Math.max(0, answerIndex))];
  return Math.min(5, Math.max(1, answerIndex + 1));
}

function maxScoreFor(tiles: Tile[]): number {
  return tiles.reduce((s, t) => s + ZONE_WEIGHTS[t.zone] * MAX_SCALE, 0);
}

function rawAxisScore(
  tiles: Tile[],
  axis: Axis,
  answers: Record<string, TileAnswer>,
): number {
  return tiles.reduce((sum, tile) => {
    const a = answers[tile.id];
    if (!a) return sum;
    const idx = a[axis];
    if (idx < 0) return sum;
    const w = ZONE_WEIGHTS[tile.zone];
    return sum + w * normalize(idx, tile[axis].type);
  }, 0);
}

export function interpretGap(gap: number): GapInterpretation {
  if (gap >= 30)
    return {
      label: "Org Ahead of Person",
      signal:
        "Infrastructure exists but hasn't been internalized. Risk: ghost systems. Recommend personal integration before AI deployment.",
      aiReadiness: "low",
    };
  if (gap >= 10)
    return {
      label: "Slight Org Lead",
      signal:
        "Healthy tension — the organization is pulling the person forward. Good conditions for structured co-creation.",
      aiReadiness: "medium",
    };
  if (gap >= -9)
    return {
      label: "Aligned",
      signal:
        "Personal readiness and organizational maturity are in sync. Ideal entry point for relational AI systems.",
      aiReadiness: "high",
    };
  if (gap >= -29)
    return {
      label: "Slight Personal Lead",
      signal:
        "The person is ahead of the organization. Risk: visionary isolation. Culture seeding needed.",
      aiReadiness: "medium",
    };
  return {
    label: "Person Far Ahead of Org",
    signal:
      "Strong personal clarity but the container can't hold it yet. Build the org foundation before AI amplifies the gap.",
    aiReadiness: "low",
  };
}

export function computeSeasonScore(
  season: Season,
  answers: Record<string, TileAnswer>,
): SeasonScore {
  const tiles = season.tiles;
  const max = maxScoreFor(tiles);
  const p = rawAxisScore(tiles, "personal", answers);
  const o = rawAxisScore(tiles, "organizational", answers);
  const personal = Math.round((p / max) * 100);
  const organizational = Math.round((o / max) * 100);
  const gap = organizational - personal;

  const zones: SeasonScore["zones"] = { personal: {} as any, organizational: {} as any };
  (["inner", "stretch", "edge"] as Zone[]).forEach((zone) => {
    const zt = tiles.filter((t) => t.zone === zone);
    const zm = maxScoreFor(zt) || 1;
    zones!.personal[zone] = Math.round((rawAxisScore(zt, "personal", answers) / zm) * 100);
    zones!.organizational[zone] = Math.round(
      (rawAxisScore(zt, "organizational", answers) / zm) * 100,
    );
  });

  return {
    personal,
    organizational,
    gap,
    composite: Math.round((personal + organizational) / 2),
    interpretation: interpretGap(gap),
    zones,
  };
}

export function computeOverallScore(seasonScores: SeasonScore[]): OverallScore {
  if (!seasonScores.length) return { personal: 0, organizational: 0, gap: 0, composite: 0 };
  const avg = (xs: number[]) => Math.round(xs.reduce((s, v) => s + v, 0) / xs.length);
  return {
    personal: avg(seasonScores.map((s) => s.personal)),
    organizational: avg(seasonScores.map((s) => s.organizational)),
    gap: avg(seasonScores.map((s) => s.gap)),
    composite: avg(seasonScores.map((s) => s.composite)),
  };
}

/** Number of tiles fully answered on both axes. */
export function countAnswered(
  season: Season,
  answers: Record<string, TileAnswer>,
): number {
  return season.tiles.filter((t) => {
    const a = answers[t.id];
    return a && a.personal >= 0 && a.organizational >= 0;
  }).length;
}

export function isSeasonComplete(
  season: Season,
  answers: Record<string, TileAnswer>,
): boolean {
  return countAnswered(season, answers) === season.tiles.length;
}
