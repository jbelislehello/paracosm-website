// Coherence Analysis for Shadow Position Calculation
// Analyzes tile completion patterns to detect gaps and calculate coherence scores

export interface CoherenceResult {
  score: number; // 0-1, higher = more coherent
  gaps: GapInfo[];
  clusters: number; // number of disconnected regions
}

export interface GapInfo {
  type: 'row' | 'column' | 'quadrant' | 'sequence';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Calculate coherence score based on adjacency of visited tiles
 * Higher adjacency = more coherent (fewer gaps)
 */
export function calculateCoherence(visitedTiles: Set<string>): number {
  if (visitedTiles.size === 0) return 0;
  if (visitedTiles.size === 1) return 1;

  const positions = [...visitedTiles].map(t => {
    const [row, col] = t.split('-').map(Number);
    return { row, col, key: t };
  });

  let adjacentPairs = 0;
  
  for (const pos of positions) {
    const neighbors = [
      `${pos.row - 1}-${pos.col}`,
      `${pos.row + 1}-${pos.col}`,
      `${pos.row}-${pos.col - 1}`,
      `${pos.row}-${pos.col + 1}`,
    ];
    adjacentPairs += neighbors.filter(n => visitedTiles.has(n)).length;
  }

  // Each adjacency is counted twice (A->B and B->A), so divide by 2
  const uniqueAdjacencies = adjacentPairs / 2;
  
  // Maximum possible adjacencies for n tiles in a grid
  const maxPossibleAdjacencies = Math.min(
    positions.length * 2 - Math.sqrt(positions.length), // rough estimate
    positions.length * 4 / 2 // theoretical max
  );

  return Math.min(uniqueAdjacencies / Math.max(maxPossibleAdjacencies, 1), 1);
}

/**
 * Identify specific gap patterns in the visited tiles
 */
export function identifyGaps(visitedTiles: Set<string>, gridSize: number = 8): GapInfo[] {
  const gaps: GapInfo[] = [];
  
  // Count tiles per row
  const rowCounts = new Map<number, number>();
  const colCounts = new Map<number, number>();
  
  [...visitedTiles].forEach(t => {
    const [row, col] = t.split('-').map(Number);
    rowCounts.set(row, (rowCounts.get(row) || 0) + 1);
    colCounts.set(col, (colCounts.get(col) || 0) + 1);
  });

  // Check for row gaps (rows with no tiles between visited rows)
  const visitedRows = [...rowCounts.keys()].sort((a, b) => a - b);
  for (let i = 1; i < visitedRows.length; i++) {
    const gap = visitedRows[i] - visitedRows[i - 1];
    if (gap > 1) {
      gaps.push({
        type: 'row',
        description: `Gap between rows ${visitedRows[i - 1]} and ${visitedRows[i]}`,
        severity: gap > 2 ? 'high' : 'medium'
      });
    }
  }

  // Check for column gaps
  const visitedCols = [...colCounts.keys()].sort((a, b) => a - b);
  for (let i = 1; i < visitedCols.length; i++) {
    const gap = visitedCols[i] - visitedCols[i - 1];
    if (gap > 1) {
      gaps.push({
        type: 'column',
        description: `Gap between columns ${visitedCols[i - 1]} and ${visitedCols[i]}`,
        severity: gap > 2 ? 'high' : 'medium'
      });
    }
  }

  // Check quadrant imbalance
  const quadrantCounts = { TL: 0, TR: 0, BL: 0, BR: 0 };
  const mid = gridSize / 2;
  
  [...visitedTiles].forEach(t => {
    const [row, col] = t.split('-').map(Number);
    if (row < mid && col < mid) quadrantCounts.TL++;
    else if (row < mid && col >= mid) quadrantCounts.TR++;
    else if (row >= mid && col < mid) quadrantCounts.BL++;
    else quadrantCounts.BR++;
  });

  const counts = Object.values(quadrantCounts);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  
  if (maxCount > 0 && minCount === 0 && visitedTiles.size >= 4) {
    const emptyQuadrants = Object.entries(quadrantCounts)
      .filter(([_, c]) => c === 0)
      .map(([q]) => q);
    gaps.push({
      type: 'quadrant',
      description: `Unexplored quadrants: ${emptyQuadrants.join(', ')}`,
      severity: 'medium'
    });
  }

  return gaps;
}

/**
 * Calculate depth score based on POLEN entry counts per tile
 * Higher average entries = deeper engagement
 */
export function calculateDepth(polenCounts: Record<string, number>): number {
  const counts = Object.values(polenCounts);
  if (counts.length === 0) return 0;
  
  const totalEntries = counts.reduce((sum, c) => sum + c, 0);
  const avgPerTile = totalEntries / counts.length;
  
  // Normalize: 3+ entries per tile = max depth
  return Math.min(avgPerTile / 3, 1);
}

/**
 * Calculate flow quality based on journey path sequence
 * Valid GL!TCH/DRIFT/TUNE movements = higher flow
 */
export function calculateFlowQuality(journeyPath: Array<{ row: number; col: number }>): number {
  if (journeyPath.length < 2) return 1; // No movement yet = perfect flow
  
  let validMoves = 0;
  
  for (let i = 1; i < journeyPath.length; i++) {
    const prev = journeyPath[i - 1];
    const curr = journeyPath[i];
    
    const rowDiff = curr.row - prev.row;
    const colDiff = curr.col - prev.col;
    
    // Valid moves: UP (GL!TCH), LEFT/RIGHT (DRIFT), DOWN (TUNE)
    const isValidMove = 
      (rowDiff === 1 && colDiff === 0) ||  // GL!TCH (up)
      (rowDiff === 0 && Math.abs(colDiff) === 1) ||  // DRIFT (left/right)
      (rowDiff === -1 && colDiff === 0);  // TUNE (down)
    
    if (isValidMove) validMoves++;
  }
  
  return validMoves / (journeyPath.length - 1);
}

/**
 * Full coherence analysis combining all factors
 */
export function analyzeCoherence(
  visitedTiles: Set<string>,
  polenCounts: Record<string, number>,
  journeyPath: Array<{ row: number; col: number }>
): CoherenceResult & { depth: number; flow: number } {
  const coherenceScore = calculateCoherence(visitedTiles);
  const gaps = identifyGaps(visitedTiles);
  const depth = calculateDepth(polenCounts);
  const flow = calculateFlowQuality(journeyPath);
  
  // Estimate clusters (simplified - just check if there are large gaps)
  const highSeverityGaps = gaps.filter(g => g.severity === 'high').length;
  const clusters = Math.max(1, highSeverityGaps + 1);

  return {
    score: coherenceScore,
    gaps,
    clusters,
    depth,
    flow
  };
}
