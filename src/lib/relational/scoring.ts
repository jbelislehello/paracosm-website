import {
  DIMENSIONS,
  DIMENSION_BY_ID,
} from "./data";
import type {
  DimensionScore,
  GapReading,
  RelationalAnswer,
  RelationalAnswersMap,
  RelationalOverall,
} from "./types";

const MAX = 5;

/** 0-based answer index -> 1..5. */
export function normalize(index: number): number {
  if (index < 0) return 0;
  return Math.min(MAX, Math.max(1, index + 1));
}

export function interpretGap(gap: number): GapReading {
  if (gap >= 20)
    return {
      label: { en: "Your team is ahead of you here", fr: "Votre équipe vous devance ici" },
      signal: {
        en: "The group holds this better than you do right now. That's an opportunity: let them set the standard and follow it rather than leading from the front.",
        fr: "Le groupe tient mieux cela que vous en ce moment. C'est une occasion : laissez-le établir la norme et suivez-la plutôt que de mener de l'avant.",
      },
    };
  if (gap >= 8)
    return {
      label: { en: "The group is slightly stronger", fr: "Le groupe est légèrement plus solide" },
      signal: {
        en: "Healthy tension. Your team is pulling you forward on this one — name it out loud so it keeps happening.",
        fr: "Tension saine. Votre équipe vous tire vers l'avant sur ce point — nommez-le à voix haute pour que cela continue.",
      },
    };
  if (gap >= -7)
    return {
      label: { en: "You and your team are in step", fr: "Vous et votre équipe êtes au même rythme" },
      signal: {
        en: "What you practise and what the group practises match. This is your most reliable ground to build on.",
        fr: "Ce que vous pratiquez et ce que le groupe pratique concordent. C'est votre terrain le plus fiable.",
      },
    };
  if (gap >= -19)
    return {
      label: { en: "You're slightly ahead of the group", fr: "Vous devancez légèrement le groupe" },
      signal: {
        en: "You hold this more than the group does. Make it visible and teachable, or it stays a personal habit rather than a team norm.",
        fr: "Vous tenez cela plus que le groupe. Rendez-le visible et transmissible, sinon cela reste une habitude personnelle.",
      },
    };
  return {
    label: { en: "You're carrying this alone", fr: "Vous portez cela seul" },
    signal: {
      en: "You're well ahead of the group here — which usually means you're absorbing the cost. Build shared agreements before this quietly burns you out.",
      fr: "Vous devancez nettement le groupe ici — ce qui signifie souvent que vous en absorbez le coût. Établissez des accords partagés avant que cela ne vous épuise.",
    },
  };
}

function axisScore(
  answers: Record<string, RelationalAnswer>,
  questionIds: string[],
  axis: "self" | "team",
): number {
  let sum = 0;
  let counted = 0;
  for (const qid of questionIds) {
    const a = answers[qid];
    if (!a) continue;
    const idx = a[axis];
    if (idx < 0) continue;
    sum += normalize(idx);
    counted += 1;
  }
  if (counted === 0) return 0;
  return Math.round((sum / (counted * MAX)) * 100);
}

export function countAnswered(
  answers: Record<string, RelationalAnswer> | undefined,
  questionIds: string[],
): number {
  if (!answers) return 0;
  return questionIds.filter((qid) => {
    const a = answers[qid];
    return a && a.self >= 0 && a.team >= 0;
  }).length;
}

export function computeDimensionScore(
  dimensionId: string,
  answersMap: RelationalAnswersMap,
): DimensionScore {
  const dim = DIMENSION_BY_ID[dimensionId];
  const qids = dim.questions.map((q) => q.id);
  const answers = answersMap[dimensionId] ?? {};
  const self = axisScore(answers, qids, "self");
  const team = axisScore(answers, qids, "team");
  const gap = team - self;
  const answered = countAnswered(answers, qids);
  return {
    self,
    team,
    gap,
    composite: Math.round((self + team) / 2),
    answered,
    total: qids.length,
    complete: answered === qids.length,
    reading: interpretGap(gap),
  };
}

export function computeAllDimensionScores(
  answersMap: RelationalAnswersMap,
): Record<string, DimensionScore> {
  return Object.fromEntries(
    DIMENSIONS.map((d) => [d.id, computeDimensionScore(d.id, answersMap)]),
  );
}

export function computeRelationalOverall(
  scores: Record<string, DimensionScore>,
): RelationalOverall {
  const answered = Object.values(scores).filter((s) => s.answered > 0);
  if (!answered.length) return { self: 0, team: 0, gap: 0, composite: 0 };
  const avg = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
  const self = avg(answered.map((s) => s.self));
  const team = avg(answered.map((s) => s.team));
  return { self, team, gap: team - self, composite: Math.round((self + team) / 2) };
}

/** Highest and lowest scored dimensions among those with answers. */
export function strongestAndWeakest(scores: Record<string, DimensionScore>) {
  const entries = Object.entries(scores).filter(([, s]) => s.answered > 0);
  if (!entries.length) return { strongest: null, weakest: null };
  const sorted = [...entries].sort((a, b) => b[1].composite - a[1].composite);
  return {
    strongest: sorted[0][0],
    weakest: sorted[sorted.length - 1][0],
  };
}
