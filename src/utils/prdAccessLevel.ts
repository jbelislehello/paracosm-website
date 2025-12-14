// PRD Access Level utility for experience-driven PRD visibility

export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
export type PrdAccessLevel = 'hidden' | 'preview' | 'draft' | 'ready' | 'complete';

interface PrdAccessInput {
  completedSeasons: Season[];
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  polenCountBySeason: Record<Season, number>;
  prdId: string | null;
}

export const SEASON_ORDER: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

export const SEASON_LABELS: Record<Season, string> = {
  POLLENS: 'Pollens',
  NOEMS: 'Noems',
  POEMS: 'Poems',
  TOTEMS: 'Totems',
  ANTHEMS: 'Anthems',
};

export const SEASON_PRD_LAYER: Record<Season, string> = {
  POLLENS: 'POLLEN',
  NOEMS: 'NOEM',
  POEMS: 'POEM',
  TOTEMS: 'TOTEM',
  ANTHEMS: 'ANTHEM',
};

export const PRD_LAYER_FIELDS: Record<string, string[]> = {
  POLLEN: ['love_signals_summary', 'love_decision_to_exist'],
  NOEM: ['magic_storyworld', 'magic_prd_outline', 'magic_hypotheses', 'magic_patterns'],
  POEM: ['calm_requirements', 'calm_risks_and_limits'],
  TOTEM: ['open_ontology_and_graph', 'open_real_workflow', 'open_adjustment_plan'],
  ANTHEM: ['free_first_poem_description', 'free_totem_anthem', 'free_success_criteria', 'free_next_cycle_hooks'],
};

/**
 * Calculate PRD access level based on journey progress
 */
export function getPrdAccessLevel(input: PrdAccessInput): PrdAccessLevel {
  const { completedSeasons, currentSeason, seasonProgress, polenCountBySeason, prdId } = input;
  
  // All seasons complete = complete access
  if (completedSeasons.length >= 5) {
    return 'complete';
  }
  
  // Has PRD and at least 2 seasons complete = ready
  if (prdId && completedSeasons.length >= 2) {
    return 'ready';
  }
  
  // Has PRD or 1+ season complete = draft
  if (prdId || completedSeasons.length >= 1) {
    return 'draft';
  }
  
  // Calculate current season progress
  const currentProgress = seasonProgress[currentSeason]?.size || 0;
  const currentPolen = polenCountBySeason[currentSeason] || 0;
  
  // At least 8 tiles visited AND 3+ fragments = preview
  if (currentProgress >= 8 && currentPolen >= 3) {
    return 'preview';
  }
  
  // At least 4 tiles visited OR 2+ fragments = preview
  if (currentProgress >= 4 || currentPolen >= 2) {
    return 'preview';
  }
  
  return 'hidden';
}

/**
 * Get readiness percentage for a specific PRD layer
 */
export function getLayerReadiness(
  season: Season,
  tilesVisited: number,
  polenCount: number,
  isComplete: boolean
): number {
  if (isComplete) return 100;
  
  // Weighted calculation: 60% tiles, 40% fragments
  const tileProgress = Math.min((tilesVisited / 64) * 100, 100);
  const fragmentProgress = Math.min((polenCount / 10) * 100, 100); // 10 fragments = 100%
  
  return Math.round(tileProgress * 0.6 + fragmentProgress * 0.4);
}

/**
 * Check if PRD generation should be triggered
 */
export function shouldTriggerPrdGeneration(
  season: Season,
  tilesVisited: number,
  polenCount: number
): boolean {
  // Trigger when season is complete (64 tiles) OR 
  // early access (32+ tiles) with enough material (5+ fragments)
  return tilesVisited >= 64 || (tilesVisited >= 32 && polenCount >= 5);
}
