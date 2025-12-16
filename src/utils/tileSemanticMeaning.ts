// Semantic meaning utilities for wonder-inducing topology insights

export const ROW_MEANINGS: Record<number, { short: string; deep: string }> = {
  0: { short: 'Mindsets & Beliefs', deep: 'the foundation of all perception, where assumptions become reality' },
  1: { short: 'Adaptive Agility', deep: 'the realm of responsive change and graceful pivoting' },
  2: { short: 'Compasses & Energies', deep: 'where direction meets vitality, the navigation of purpose' },
  3: { short: 'Intuitions & Landscapes', deep: 'the territory of embodied knowing and felt terrain' },
  4: { short: 'Garden of Intelligence', deep: 'where ideas grow wild before being cultivated' },
  5: { short: 'Strategies & Scenarios', deep: 'the architecture of possibility and pathways forward' },
  6: { short: 'Networks & Connections', deep: 'the web of relationships that holds everything together' },
  7: { short: 'Architectures & Protocols', deep: 'the formal structures that enable emergence' }
};

export const COL_MEANINGS: Record<number, { short: string; deep: string }> = {
  0: { short: 'Chances Taken', deep: 'risk and leap, where safety dissolves into possibility' },
  1: { short: 'Heart-Based Principles', deep: 'values that pulse beneath every choice' },
  2: { short: 'Organized Experiences', deep: 'structured encounters with the unknown' },
  3: { short: 'Rhythms of Process', deep: 'the timing and tempo of transformation' },
  4: { short: 'Design Decisions', deep: 'choices that shape form from formlessness' },
  5: { short: 'Stories We Tell', deep: 'the narratives that make meaning from chaos' },
  6: { short: 'Maps We Create', deep: 'the territories we draw to navigate complexity' },
  7: { short: 'Systems We Build', deep: 'the living structures that sustain what we create' }
};

export const QUADRANT_MEANINGS: Record<string, { name: string; essence: string; shadow: string; gift: string }> = {
  'SN': {
    name: 'Sovereignty + Novelty',
    essence: 'independent exploration of the new',
    shadow: 'isolation disguised as freedom',
    gift: 'pioneering without permission'
  },
  'IN': {
    name: 'Intimacy + Novelty',
    essence: 'connected discovery with others',
    shadow: 'losing self in collective exploration',
    gift: 'co-creating the unprecedented'
  },
  'IM': {
    name: 'Intimacy + Memory',
    essence: 'relational anchoring in the known',
    shadow: 'comfort that resists growth',
    gift: 'sacred bonds that sustain'
  },
  'SM': {
    name: 'Sovereignty + Memory',
    essence: 'grounded independence in familiar territory',
    shadow: 'rigidity mistaken for stability',
    gift: 'wisdom that stands alone'
  }
};

export function getSemanticMeaning(row: number, col: number): string {
  const rowMeaning = ROW_MEANINGS[row]?.deep || 'the unknown';
  const colMeaning = COL_MEANINGS[col]?.deep || 'mystery';
  return `where ${rowMeaning} intersects with ${colMeaning}`;
}

export function getTileLabel(row: number, col: number): string {
  const rowLabel = ROW_MEANINGS[row]?.short || `Row ${row}`;
  const colLabel = COL_MEANINGS[col]?.short || `Col ${col}`;
  return `${rowLabel} × ${colLabel}`;
}

export function getQuadrantFromPosition(x: number, y: number): string {
  // x-axis: -1 = Sovereignty, +1 = Intimacy
  // y-axis: -1 = Memory, +1 = Novelty
  const xLabel = x < 0 ? 'S' : 'I';
  const yLabel = y > 0 ? 'N' : 'M';
  return xLabel + yLabel;
}

export function getShadowMeaning(position: { x: number; y: number } | undefined): string {
  if (!position) return 'not yet positioned';
  
  const quadrant = getQuadrantFromPosition(position.x, position.y);
  const quadrantInfo = QUADRANT_MEANINGS[quadrant];
  
  // Intensity based on distance from center
  const intensity = Math.sqrt(position.x * position.x + position.y * position.y);
  const intensityLabel = intensity < 0.3 ? 'tentatively' : intensity < 0.6 ? 'clearly' : 'deeply';
  
  return `${intensityLabel} dwelling in ${quadrantInfo?.essence || 'undefined space'}`;
}

export function getHigherSelfMeaning(position: { x: number; y: number } | undefined): string {
  if (!position) return 'no prophecy set';
  
  const quadrant = getQuadrantFromPosition(position.x, position.y);
  const quadrantInfo = QUADRANT_MEANINGS[quadrant];
  
  return quadrantInfo?.gift || 'the gift of becoming';
}

export function describeGap(
  shadow: { x: number; y: number } | undefined,
  higherSelf: { x: number; y: number } | undefined
): string {
  if (!shadow || !higherSelf) return 'The gap between where you are and where you aspire to be remains undefined.';
  
  const dx = higherSelf.x - shadow.x;
  const dy = higherSelf.y - shadow.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Describe the direction of movement needed
  const directions: string[] = [];
  if (Math.abs(dx) > 0.2) {
    directions.push(dx > 0 ? 'toward greater connection' : 'toward greater independence');
  }
  if (Math.abs(dy) > 0.2) {
    directions.push(dy > 0 ? 'into uncharted novelty' : 'into grounded memory');
  }
  
  if (distance < 0.2) {
    return 'Your Shadow and Higher Self are remarkably aligned—you are closer to your prophecy than you realize.';
  }
  
  if (distance > 1.2) {
    return `A profound journey lies ahead: ${directions.join(' and ')}. This distance is not obstacle but invitation.`;
  }
  
  return `The path calls you ${directions.join(' and ')}—a meaningful stretch that is neither trivial nor overwhelming.`;
}

export function describeVisualShape(stats: {
  gaps: string[];
  clusters: string[];
  coverage: number;
  pathLength: number;
  visitedCount: number;
}): string {
  const shapes: string[] = [];
  
  // Density pattern
  if (stats.clusters.length > 0) {
    shapes.push(`concentrated like stars in ${stats.clusters.join(' and ')}`);
  }
  if (stats.gaps.length > 0) {
    shapes.push(`with dark regions where ${stats.gaps.join(' and ')} remain unvisited`);
  }
  
  // Path characteristic
  const pathRatio = stats.pathLength / Math.max(stats.visitedCount, 1);
  if (pathRatio > 1.5) {
    shapes.push('a spiral path that returns upon itself');
  } else if (stats.coverage < 20) {
    shapes.push('a cautious beginning, like first footsteps in snow');
  } else if (stats.coverage > 60) {
    shapes.push('an expansive web reaching toward wholeness');
  }
  
  return shapes.length > 0 ? shapes.join(', ') : 'taking shape';
}

export const SEASON_MEANINGS: Record<string, { essence: string; prdLayer: string; question: string }> = {
  'POLLENS': {
    essence: 'exploring relational aspirations and cultural elements',
    prdLayer: 'Relational/Cultural foundations',
    question: 'What aspirations exist for self, team, and culture?'
  },
  'NOEMS': {
    essence: 'crystallizing concepts and ideas',
    prdLayer: 'Conceptual structures',
    question: 'What concepts and ideas are emerging?'
  },
  'POEMS': {
    essence: 'designing experiences (People, Objects, Environments, Messages, Systems)',
    prdLayer: 'Experiential design & prototypes',
    question: 'How do people, objects, environments, messages, and systems interact?'
  },
  'TOTEMS': {
    essence: 'defining infrastructure and security',
    prdLayer: 'Technical & data architecture',
    question: 'What technical infrastructure and policies are needed?'
  },
  'ANTHEMS': {
    essence: 'crafting market narrative and positioning',
    prdLayer: 'Market & storytelling',
    question: 'What story are we telling to the market?'
  }
};

export function getSeasonMeaning(season: string | undefined): string {
  if (!season) return 'no season active';
  const meaning = SEASON_MEANINGS[season];
  return meaning ? meaning.essence : 'unknown season';
}
