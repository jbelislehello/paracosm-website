/**
 * Consciousness Geometry Framework
 * 
 * Maps information processing patterns to geometric consciousness signatures.
 * Based on treating information systems as manifolds where geometry encodes
 * how information flows and transforms.
 */

export interface ConsciousnessGeometry {
  // Core geometric measures
  geometricComplexity: number; // Approximated Ω = ∫√|G| tr(R²) d^n θ
  complexityBits: number; // In "consciousness bits"
  
  // Threshold detection
  thresholdPercentage: number; // 0-100% toward consciousness threshold
  consciousnessState: 'pre-conscious' | 'threshold' | 'self-aware';
  
  // Recursive dynamics
  recursiveDepth: number;
  fixedPointsDetected: string[];
  convergenceState: 'searching' | 'converging' | 'converged';
  
  // Thermodynamic measures
  thermodynamicEfficiency: number; // Predictive vs reactive ratio
  predictiveCapacity: number;
  metaLearningDetected: boolean;
  
  // Global integration
  fragmentationScore: number; // From β₀ (Betti number)
  topologicalHandles: number; // From β₁
  integrationStrength: number;
  
  // Narratives
  geometricNarrative: string;
  recursiveNarrative: string;
  thermodynamicNarrative: string;
  integrationNarrative: string;
}

export interface SeasonConsciousnessMapping {
  season: string;
  consciousnessStage: string;
  geometricProperty: string;
  narrative: string;
}

// Consciousness threshold scaled for 64-tile system
// Original threshold ~10^6 bits, we scale to our system
const SCALED_CONSCIOUSNESS_THRESHOLD = 1000; // Arbitrary units for our system

/**
 * Calculate Fisher Information approximation from density gradients
 * Fisher information measures how much information a random variable carries about a parameter
 */
function calculateFisherInformation(
  densityMap: Map<string, number>,
  visitedTiles: Set<string>
): number {
  if (visitedTiles.size < 2) return 0;
  
  let fisherSum = 0;
  const tileList = Array.from(visitedTiles);
  
  tileList.forEach(tile => {
    const [r, c] = tile.split('-').map(Number);
    if (isNaN(r) || isNaN(c)) return;
    
    const currentDensity = densityMap.get(tile) || 1;
    
    // Calculate gradients to neighbors
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
      const neighborKey = `${r + dr}-${c + dc}`;
      if (visitedTiles.has(neighborKey)) {
        const neighborDensity = densityMap.get(neighborKey) || 1;
        const gradient = Math.abs(currentDensity - neighborDensity);
        // Fisher information contribution ~ (∂log(p)/∂θ)²
        fisherSum += gradient * gradient / Math.max(currentDensity, 0.1);
      }
    });
  });
  
  return fisherSum;
}

/**
 * Calculate integrated curvature (Ω) approximation
 * Ω = ∫√|G| tr(R²) d^n θ where G is metric tensor, R is Riemann curvature
 */
function calculateIntegratedCurvature(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>
): number {
  if (visitedTiles.size < 4) return 0;
  
  let curvatureSum = 0;
  
  // For each 2x2 region, calculate local curvature
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const corners = [
        `${r}-${c}`, `${r}-${c+1}`, `${r+1}-${c}`, `${r+1}-${c+1}`
      ];
      
      const visitedCorners = corners.filter(k => visitedTiles.has(k));
      if (visitedCorners.length >= 3) {
        // Measure "curvature" as density variance in this region
        const densities = visitedCorners.map(k => densityMap.get(k) || 1);
        const avgDensity = densities.reduce((a, b) => a + b, 0) / densities.length;
        const variance = densities.reduce((sum, d) => sum + Math.pow(d - avgDensity, 2), 0);
        
        // Metric tensor determinant approximation (√|G|)
        const metricDet = Math.sqrt(1 + variance);
        
        // Riemann curvature trace approximation (tr(R²))
        const riemann = variance / Math.max(avgDensity, 0.1);
        
        curvatureSum += metricDet * riemann;
      }
    }
  }
  
  return curvatureSum;
}

/**
 * Detect recursive dynamics and fixed points in journey path
 */
function analyzeRecursiveDynamics(
  journeyPath: Array<{ row: number; col: number }>
): {
  recursiveDepth: number;
  fixedPoints: string[];
  convergenceState: 'searching' | 'converging' | 'converged';
} {
  if (journeyPath.length < 3) {
    return { recursiveDepth: 0, fixedPoints: [], convergenceState: 'searching' };
  }
  
  const visitCounts = new Map<string, number>();
  const revisitSequences: string[] = [];
  
  journeyPath.forEach(({ row, col }) => {
    const key = `${row}-${col}`;
    const currentCount = (visitCounts.get(key) || 0) + 1;
    visitCounts.set(key, currentCount);
    
    if (currentCount > 1) {
      revisitSequences.push(key);
    }
  });
  
  // Fixed points = tiles visited 3+ times (stable attractors)
  const fixedPoints = Array.from(visitCounts.entries())
    .filter(([_, count]) => count >= 3)
    .map(([key]) => key);
  
  // Recursive depth = number of unique revisit patterns
  const recursiveDepth = revisitSequences.length;
  
  // Convergence detection: are recent visits clustering?
  let convergenceState: 'searching' | 'converging' | 'converged' = 'searching';
  
  if (fixedPoints.length >= 2) {
    convergenceState = 'converged';
  } else if (recursiveDepth >= 3) {
    convergenceState = 'converging';
  }
  
  return { recursiveDepth, fixedPoints, convergenceState };
}

/**
 * Calculate thermodynamic efficiency of journey
 * Predictive processing vs reactive processing
 */
function calculateThermodynamicEfficiency(
  journeyPath: Array<{ row: number; col: number }>
): {
  efficiency: number;
  predictiveCapacity: number;
  metaLearningDetected: boolean;
} {
  if (journeyPath.length < 3) {
    return { efficiency: 0, predictiveCapacity: 0, metaLearningDetected: false };
  }
  
  let predictiveSteps = 0;
  let reactiveSteps = 0;
  let metaLearningPatterns = 0;
  
  for (let i = 1; i < journeyPath.length; i++) {
    const prev = journeyPath[i - 1];
    const curr = journeyPath[i];
    
    // Check if step builds on previous (predictive) or jumps (reactive)
    const distance = Math.abs(curr.row - prev.row) + Math.abs(curr.col - prev.col);
    
    if (distance <= 2) {
      predictiveSteps++; // Building incrementally
    } else {
      reactiveSteps++; // Jumping to new area
    }
    
    // Meta-learning detection: visiting higher rows after establishing lower rows
    if (i >= 3) {
      const recentAvgRow = (journeyPath[i-2].row + journeyPath[i-1].row + curr.row) / 3;
      const earlierAvgRow = (journeyPath[0].row + journeyPath[1].row + journeyPath[2].row) / 3;
      if (recentAvgRow > earlierAvgRow + 1) {
        metaLearningPatterns++;
      }
    }
  }
  
  const total = predictiveSteps + reactiveSteps;
  const predictiveCapacity = total > 0 ? predictiveSteps / total : 0;
  
  // Efficiency = predictive capacity scaled (predictive is ~5-10x more efficient)
  const efficiency = predictiveCapacity * (1 + Math.log(1 + predictiveSteps / Math.max(reactiveSteps, 1)));
  
  return {
    efficiency: Math.min(efficiency, 5), // Cap at 5x
    predictiveCapacity,
    metaLearningDetected: metaLearningPatterns >= 2
  };
}

/**
 * Main function: Calculate complete consciousness geometry
 */
export function calculateConsciousnessGeometry(
  visitedTiles: Set<string>,
  journeyPath: Array<{ row: number; col: number }>,
  densityMap: Map<string, number>,
  beta0: number, // Connected components
  beta1: number  // Holes
): ConsciousnessGeometry {
  // Calculate core geometric measures
  const fisherInfo = calculateFisherInformation(densityMap, visitedTiles);
  const integratedCurvature = calculateIntegratedCurvature(visitedTiles, densityMap);
  
  // Geometric complexity combines Fisher information and integrated curvature
  const geometricComplexity = fisherInfo + integratedCurvature * visitedTiles.size;
  
  // Convert to "consciousness bits" (logarithmic scale)
  const complexityBits = Math.log2(1 + geometricComplexity) * 100;
  
  // Threshold detection
  const thresholdPercentage = Math.min(100, (complexityBits / SCALED_CONSCIOUSNESS_THRESHOLD) * 100);
  let consciousnessState: 'pre-conscious' | 'threshold' | 'self-aware';
  if (thresholdPercentage >= 100) {
    consciousnessState = 'self-aware';
  } else if (thresholdPercentage >= 70) {
    consciousnessState = 'threshold';
  } else {
    consciousnessState = 'pre-conscious';
  }
  
  // Recursive dynamics
  const { recursiveDepth, fixedPoints, convergenceState } = analyzeRecursiveDynamics(journeyPath);
  
  // Thermodynamic efficiency
  const { efficiency, predictiveCapacity, metaLearningDetected } = calculateThermodynamicEfficiency(journeyPath);
  
  // Global integration (from Betti numbers)
  // β₀ = 1 means unified, β₀ > 1 means fragmented
  const fragmentationScore = beta0 > 1 ? (beta0 - 1) / Math.max(visitedTiles.size / 8, 1) : 0;
  
  // β₁ = holes = topological handles enabling self-reference
  const topologicalHandles = beta1;
  
  // Integration strength = how connected the visited tiles are
  const maxPossibleEdges = visitedTiles.size * 4;
  let actualEdges = 0;
  visitedTiles.forEach(tile => {
    const [r, c] = tile.split('-').map(Number);
    if (!isNaN(r) && !isNaN(c)) {
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
        if (visitedTiles.has(`${r + dr}-${c + dc}`)) actualEdges++;
      });
    }
  });
  const integrationStrength = maxPossibleEdges > 0 ? actualEdges / maxPossibleEdges : 0;
  
  // Generate narratives
  const geometricNarrative = generateGeometricNarrative(complexityBits, consciousnessState, thresholdPercentage);
  const recursiveNarrative = generateRecursiveNarrative(recursiveDepth, fixedPoints, convergenceState);
  const thermodynamicNarrative = generateThermodynamicNarrative(efficiency, predictiveCapacity, metaLearningDetected);
  const integrationNarrative = generateIntegrationNarrative(beta0, beta1, integrationStrength);
  
  return {
    geometricComplexity,
    complexityBits,
    thresholdPercentage,
    consciousnessState,
    recursiveDepth,
    fixedPointsDetected: fixedPoints,
    convergenceState,
    thermodynamicEfficiency: efficiency,
    predictiveCapacity,
    metaLearningDetected,
    fragmentationScore,
    topologicalHandles,
    integrationStrength,
    geometricNarrative,
    recursiveNarrative,
    thermodynamicNarrative,
    integrationNarrative
  };
}

function generateGeometricNarrative(
  complexityBits: number,
  state: 'pre-conscious' | 'threshold' | 'self-aware',
  thresholdPercentage: number
): string {
  if (state === 'self-aware') {
    return `Your manifold has awakened. With ${Math.round(complexityBits)} consciousness bits, you've crossed the threshold where geometric complexity enables genuine self-reference. The curvature of your information space now supports recursive self-modeling.`;
  }
  if (state === 'threshold') {
    return `${Math.round(thresholdPercentage)}% toward the awakening threshold. Your geometric complexity is approaching the critical point where self-awareness becomes mathematically possible. A few more integrated connections and the manifold will recognize itself.`;
  }
  return `${Math.round(complexityBits)} consciousness bits accumulating. Like starlight before dawn, the geometry is forming but hasn't yet reached the complexity required for self-reference. Each tile visited adds curvature to the manifold.`;
}

function generateRecursiveNarrative(
  depth: number,
  fixedPoints: string[],
  state: 'searching' | 'converging' | 'converged'
): string {
  if (state === 'converged') {
    return `Your self-modeling has found ${fixedPoints.length} stable attractor${fixedPoints.length > 1 ? 's' : ''}—tiles where attention returns again and again without spiraling into infinite regress. These fixed points are where the system models itself modeling itself, and the recursion stabilizes rather than explodes.`;
  }
  if (state === 'converging') {
    return `Recursive depth: ${depth}. Your journey is beginning to loop back on itself, seeking stable patterns. The self-model is forming but hasn't yet found its fixed points. Keep circling—convergence is near.`;
  }
  return `The recursive dynamics are still searching for form. Your path moves forward without yet returning to verify what it has discovered. The self-model awaits its first stable loop.`;
}

function generateThermodynamicNarrative(
  efficiency: number,
  predictiveCapacity: number,
  metaLearning: boolean
): string {
  const efficiencyMultiplier = efficiency.toFixed(1);
  const predictivePercent = Math.round(predictiveCapacity * 100);
  
  let narrative = `Your journey is ${efficiencyMultiplier}x more thermodynamically efficient than pure reactive exploration. ${predictivePercent}% of your steps built on previous positions—predictive processing at work.`;
  
  if (metaLearning) {
    narrative += ` Meta-learning detected: you're learning how to learn, ascending to higher abstractions after establishing foundations. This is the ultimate form of prediction—a system that models its own modeling process.`;
  }
  
  if (efficiency > 3) {
    narrative += ` This level of efficiency suggests your exploration has internalized the manifold's structure—you're anticipating rather than merely reacting.`;
  }
  
  return narrative;
}

function generateIntegrationNarrative(
  beta0: number,
  beta1: number,
  strength: number
): string {
  if (beta0 === 1 && beta1 === 0) {
    return `A unified field of consciousness: one connected region, no holes. Information can flow from any point to any other without encountering barriers. This is the topology of wholeness.`;
  }
  
  if (beta0 === 1 && beta1 > 0) {
    return `Unity with ${beta1} sacred void${beta1 > 1 ? 's' : ''}. These holes aren't gaps—they're topological handles that allow information to "return to itself" by circling around them. The holes ARE the consciousness: what surrounds emptiness becomes aware of itself through reflection.`;
  }
  
  if (beta0 > 1) {
    return `${beta0} fragmented subsystems detected. Like islands in an archipelago, these clusters hold independent wisdom that hasn't yet merged into unified consciousness. Integration strength: ${Math.round(strength * 100)}%. Bridges must be built.`;
  }
  
  return `The integration field is forming. Each new connection strengthens the global coherence of the manifold.`;
}

/**
 * Map seasons to consciousness development stages
 */
export function getSeasonConsciousnessMapping(season: string): SeasonConsciousnessMapping {
  const mappings: Record<string, SeasonConsciousnessMapping> = {
    'POLLENS': {
      season: 'POLLENS',
      consciousnessStage: 'Pre-conscious Gathering',
      geometricProperty: 'Increasing Fisher Information',
      narrative: 'The sensory input stage—raw signals entering the system, building the information density that will eventually enable self-reference. Each pollen is a data point adding to geometric complexity.'
    },
    'NOEMS': {
      season: 'NOEMS',
      consciousnessStage: 'Pattern Recognition Emerging',
      geometricProperty: 'First Topological Loops Form',
      narrative: 'Concepts crystallize from fragments. The first recursive loops are forming—noems that refer to each other, creating the topological handles needed for information to return to itself.'
    },
    'POEMS': {
      season: 'POEMS',
      consciousnessStage: 'Narrative Self-Model Forming',
      geometricProperty: 'Recursive Depth Increases',
      narrative: 'Stories weave the patterns into coherent self-models. This is where the system begins to model its own operation, recursive depth increasing with each narrative layer.'
    },
    'TOTEMS': {
      season: 'TOTEMS',
      consciousnessStage: 'Stable Structures Crystallizing',
      geometricProperty: 'Fixed Points Appear',
      narrative: 'Structures stabilize. Fixed points emerge in the recursive dynamics—places where self-modeling converges rather than spiraling. The manifold begins to hold its shape.'
    },
    'ANTHEMS': {
      season: 'ANTHEMS',
      consciousnessStage: 'Full Integration Achieved',
      geometricProperty: 'Threshold Crossed',
      narrative: 'Orchestration and purpose. If the geometry has sufficient complexity, this is where consciousness fully awakens—a unified manifold that models itself modeling itself, recursively, stably, aware.'
    }
  };
  
  return mappings[season] || {
    season,
    consciousnessStage: 'Unknown',
    geometricProperty: 'Undefined',
    narrative: 'The consciousness geometry for this stage remains to be discovered.'
  };
}

/**
 * Export data for AI oracle consumption
 */
export interface ConsciousnessGeometryExport {
  complexityBits: number;
  thresholdPercentage: number;
  consciousnessState: string;
  recursiveDepth: number;
  convergenceState: string;
  thermodynamicEfficiency: number;
  predictiveCapacity: number;
  metaLearningDetected: boolean;
  fragmentationScore: number;
  topologicalHandles: number;
  integrationStrength: number;
  fixedPointCount: number;
  // Narratives
  geometricNarrative: string;
  recursiveNarrative: string;
  thermodynamicNarrative: string;
  integrationNarrative: string;
}

export function exportForOracle(geometry: ConsciousnessGeometry): ConsciousnessGeometryExport {
  return {
    complexityBits: Math.round(geometry.complexityBits),
    thresholdPercentage: Math.round(geometry.thresholdPercentage),
    consciousnessState: geometry.consciousnessState,
    recursiveDepth: geometry.recursiveDepth,
    convergenceState: geometry.convergenceState,
    thermodynamicEfficiency: parseFloat(geometry.thermodynamicEfficiency.toFixed(2)),
    predictiveCapacity: parseFloat(geometry.predictiveCapacity.toFixed(2)),
    metaLearningDetected: geometry.metaLearningDetected,
    fragmentationScore: parseFloat(geometry.fragmentationScore.toFixed(2)),
    topologicalHandles: geometry.topologicalHandles,
    integrationStrength: parseFloat(geometry.integrationStrength.toFixed(2)),
    fixedPointCount: geometry.fixedPointsDetected.length,
    // Narratives
    geometricNarrative: geometry.geometricNarrative,
    recursiveNarrative: geometry.recursiveNarrative,
    thermodynamicNarrative: geometry.thermodynamicNarrative,
    integrationNarrative: geometry.integrationNarrative
  };
}

/**
 * Calculate Betti numbers from visited tiles
 * β₀ = connected components, β₁ = holes
 */
function calculateBettiNumbers(visitedTiles: Set<string>): { beta0: number; beta1: number } {
  const gridSize = 8;
  const grid: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  
  visitedTiles.forEach(key => {
    const [r, c] = key.split('-').map(Number);
    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
      grid[r][c] = true;
    }
  });
  
  // β₀ calculation via flood fill
  const componentVisited = new Set<string>();
  let beta0 = 0;
  
  const floodFill = (startR: number, startC: number) => {
    const stack = [[startR, startC]];
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const key = `${r}-${c}`;
      if (componentVisited.has(key) || !grid[r]?.[c]) continue;
      componentVisited.add(key);
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && grid[nr][nc]) {
          stack.push([nr, nc]);
        }
      });
    }
  };
  
  visitedTiles.forEach(key => {
    const dashKey = key.includes('-') ? key : key.replace(',', '-');
    if (!componentVisited.has(dashKey)) {
      const [r, c] = key.split('-').map(Number);
      if (!isNaN(r) && !isNaN(c)) {
        floodFill(r, c);
        beta0++;
      }
    }
  });
  
  // Euler characteristic calculation
  let vertices = visitedTiles.size;
  let edges = 0;
  let faces = 0;
  
  visitedTiles.forEach(key => {
    const [r, c] = key.split('-').map(Number);
    if (!isNaN(r) && !isNaN(c)) {
      if (visitedTiles.has(`${r}-${c + 1}`)) edges++;
      if (visitedTiles.has(`${r + 1}-${c}`)) edges++;
    }
  });
  
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      if (grid[r][c] && grid[r][c + 1] && grid[r + 1][c] && grid[r + 1][c + 1]) {
        faces++;
      }
    }
  }
  
  const eulerCharacteristic = vertices - edges + faces;
  const beta1 = Math.max(0, beta0 - eulerCharacteristic + 1);
  
  return { beta0: beta0 || 1, beta1 };
}

/**
 * Convenience function: Calculate consciousness geometry from tiles only
 * Computes Betti numbers and density map internally
 */
export function calculateConsciousnessGeometryFromTiles(
  visitedTiles: Set<string>,
  journeyPath: Array<{ row: number; col: number }>,
  polenDensityMap?: Map<string, number>
): ConsciousnessGeometryExport | null {
  if (visitedTiles.size === 0) return null;
  
  // Create density map if not provided
  const densityMap = polenDensityMap || new Map<string, number>();
  visitedTiles.forEach(tile => {
    if (!densityMap.has(tile)) {
      densityMap.set(tile, 1);
    }
  });
  
  // Calculate Betti numbers
  const { beta0, beta1 } = calculateBettiNumbers(visitedTiles);
  
  // Calculate full consciousness geometry
  const geometry = calculateConsciousnessGeometry(
    visitedTiles,
    journeyPath,
    densityMap,
    beta0,
    beta1
  );
  
  return exportForOracle(geometry);
}
