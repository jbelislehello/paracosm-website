/**
 * Holographic Entropy Calculations
 * 
 * Implements Bekenstein-like bounds, information density limits,
 * and entropy gradients across the manifold.
 * 
 * Based on: "Mathematical Manifolds and Mind Matter Models" - SSRN 4997735
 * Holographic Universe Model and entropic implications
 */

// ============ TYPES ============

export interface BekensteinBound {
  tileKey: string;
  maxEntropy: number; // bits
  currentEntropy: number; // bits
  utilizationRatio: number; // 0-1
  isSaturated: boolean;
}

export interface EntropyGradient {
  fromTile: string;
  toTile: string;
  gradient: number; // bits per unit distance
  direction: { row: number; col: number };
  flowStrength: number;
}

export interface HolographicMetrics {
  totalEntropy: number;
  averageEntropyDensity: number;
  maxLocalEntropy: number;
  entropyVariance: number;
  informationHorizon: number; // radius of causal information access
  holographicCapacity: number; // total bits available
}

export interface TileEntropyProfile {
  tileKey: string;
  shannonEntropy: number;
  vonNeumannEntropy: number;
  relativeEntropy: number;
  mutualInformation: number;
  bekensteinBound: BekensteinBound;
}

export interface EntropyFieldVisualization {
  positions: Float32Array;
  colors: Float32Array;
  intensities: Float32Array;
  gradientVectors: Float32Array;
}

// ============ CONSTANTS ============

// Scaled Bekenstein constant for our tile system
// Real: S_max ≤ 2πRE/(ℏc) where R is radius, E is energy
// Scaled for 8x8 grid with arbitrary units
const BEKENSTEIN_SCALE = 100; // Base entropy capacity per tile
const PLANCK_ENTROPY = 1; // Minimum distinguishable entropy quantum
const INFORMATION_SPEED = 1; // Tiles per unit time for horizon calculation

// ============ BEKENSTEIN BOUND CALCULATIONS ============

/**
 * Calculate Bekenstein bound for a tile
 * Maximum entropy is proportional to the "area" (boundary) not "volume"
 */
export function calculateBekensteinBound(
  tileKey: string,
  densityMap: Map<string, number>,
  visitedTiles: Set<string>
): BekensteinBound {
  const [row, col] = tileKey.split('-').map(Number);
  const density = densityMap.get(tileKey) || 1;
  
  // Calculate effective "area" (perimeter connectivity)
  let boundaryLength = 0;
  let connectedNeighbors = 0;
  [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
    const neighborKey = `${row + dr}-${col + dc}`;
    if (visitedTiles.has(neighborKey)) {
      connectedNeighbors++;
    }
    boundaryLength++;
  });
  
  // Bekenstein bound: S_max ∝ A (area/boundary)
  // For tiles, effective area is perimeter * effective radius
  const effectiveRadius = Math.sqrt(density); // Radius scales with sqrt of density
  const effectiveArea = boundaryLength * effectiveRadius;
  const maxEntropy = BEKENSTEIN_SCALE * effectiveArea;
  
  // Current entropy based on information content
  // Higher density = more information = higher entropy
  const currentEntropy = density * Math.log2(1 + density) * connectedNeighbors;
  
  const utilizationRatio = maxEntropy > 0 ? Math.min(1, currentEntropy / maxEntropy) : 0;
  const isSaturated = utilizationRatio >= 0.95;
  
  return {
    tileKey,
    maxEntropy,
    currentEntropy,
    utilizationRatio,
    isSaturated
  };
}

/**
 * Calculate all Bekenstein bounds for visited tiles
 */
export function calculateAllBekensteinBounds(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>
): Map<string, BekensteinBound> {
  const bounds = new Map<string, BekensteinBound>();
  
  visitedTiles.forEach(tile => {
    bounds.set(tile, calculateBekensteinBound(tile, densityMap, visitedTiles));
  });
  
  return bounds;
}

// ============ ENTROPY CALCULATIONS ============

/**
 * Calculate Shannon entropy for a tile based on visit probability
 */
export function calculateShannonEntropy(
  tileKey: string,
  journeyPath: Array<{ row: number; col: number }>
): number {
  if (journeyPath.length === 0) return 0;
  
  // Probability of visiting this tile
  const visits = journeyPath.filter(p => `${p.row}-${p.col}` === tileKey).length;
  const probability = visits / journeyPath.length;
  
  if (probability <= 0 || probability >= 1) return 0;
  
  // Shannon entropy contribution: -p * log2(p)
  return -probability * Math.log2(probability);
}

/**
 * Calculate von Neumann-like entropy (quantum analog)
 * Using density matrix approximation from local neighborhood
 */
export function calculateVonNeumannEntropy(
  tileKey: string,
  densityMap: Map<string, number>,
  visitedTiles: Set<string>
): number {
  const [row, col] = tileKey.split('-').map(Number);
  const density = densityMap.get(tileKey) || 1;
  
  // Build local "density matrix" from neighborhood
  const eigenvalues: number[] = [density];
  
  [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
    const neighborKey = `${row + dr}-${col + dc}`;
    if (visitedTiles.has(neighborKey)) {
      eigenvalues.push(densityMap.get(neighborKey) || 1);
    }
  });
  
  // Normalize to get probabilities (eigenvalues of density matrix)
  const total = eigenvalues.reduce((s, e) => s + e, 0);
  const probabilities = eigenvalues.map(e => e / total);
  
  // von Neumann entropy: S = -Tr(ρ log ρ) = -Σ λ_i log λ_i
  return probabilities.reduce((s, p) => {
    if (p > 0) s -= p * Math.log2(p);
    return s;
  }, 0);
}

/**
 * Calculate relative entropy (Kullback-Leibler divergence)
 * Between tile distribution and uniform distribution
 */
export function calculateRelativeEntropy(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>
): number {
  const n = visitedTiles.size;
  if (n === 0) return 0;
  
  const uniformProb = 1 / n;
  let totalDensity = 0;
  visitedTiles.forEach(tile => {
    totalDensity += densityMap.get(tile) || 1;
  });
  
  let kl = 0;
  visitedTiles.forEach(tile => {
    const density = densityMap.get(tile) || 1;
    const prob = density / totalDensity;
    if (prob > 0) {
      kl += prob * Math.log2(prob / uniformProb);
    }
  });
  
  return kl;
}

/**
 * Calculate mutual information between two tiles
 */
export function calculateMutualInformation(
  tile1: string,
  tile2: string,
  journeyPath: Array<{ row: number; col: number }>
): number {
  if (journeyPath.length < 2) return 0;
  
  // Count joint and marginal probabilities
  let visits1 = 0;
  let visits2 = 0;
  let jointVisits = 0;
  
  for (let i = 0; i < journeyPath.length - 1; i++) {
    const curr = `${journeyPath[i].row}-${journeyPath[i].col}`;
    const next = `${journeyPath[i + 1].row}-${journeyPath[i + 1].col}`;
    
    if (curr === tile1) visits1++;
    if (curr === tile2) visits2++;
    
    if ((curr === tile1 && next === tile2) || (curr === tile2 && next === tile1)) {
      jointVisits++;
    }
  }
  
  const p1 = visits1 / journeyPath.length;
  const p2 = visits2 / journeyPath.length;
  const pJoint = jointVisits / (journeyPath.length - 1);
  
  if (p1 === 0 || p2 === 0 || pJoint === 0) return 0;
  
  // I(X;Y) = log(P(X,Y) / (P(X)P(Y)))
  return Math.log2(pJoint / (p1 * p2));
}

// ============ ENTROPY GRADIENTS ============

/**
 * Calculate entropy gradient between adjacent tiles
 */
export function calculateEntropyGradient(
  fromTile: string,
  toTile: string,
  densityMap: Map<string, number>,
  visitedTiles: Set<string>
): EntropyGradient {
  const [r1, c1] = fromTile.split('-').map(Number);
  const [r2, c2] = toTile.split('-').map(Number);
  
  // Calculate entropies
  const entropy1 = calculateVonNeumannEntropy(fromTile, densityMap, visitedTiles);
  const entropy2 = calculateVonNeumannEntropy(toTile, densityMap, visitedTiles);
  
  // Distance between tiles
  const distance = Math.sqrt((r2 - r1) ** 2 + (c2 - c1) ** 2);
  
  // Gradient = ΔS / Δr
  const gradient = distance > 0 ? (entropy2 - entropy1) / distance : 0;
  
  // Direction of gradient
  const direction = {
    row: r2 - r1,
    col: c2 - c1
  };
  
  // Flow strength (magnitude of gradient)
  const flowStrength = Math.abs(gradient);
  
  return {
    fromTile,
    toTile,
    gradient,
    direction,
    flowStrength
  };
}

/**
 * Generate entropy gradient field across all visited tiles
 */
export function generateEntropyGradientField(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>
): EntropyGradient[] {
  const gradients: EntropyGradient[] = [];
  
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    
    // Check neighbors
    [[0, 1], [1, 0]].forEach(([dr, dc]) => {
      const neighborKey = `${row + dr}-${col + dc}`;
      if (visitedTiles.has(neighborKey)) {
        gradients.push(calculateEntropyGradient(tile, neighborKey, densityMap, visitedTiles));
      }
    });
  });
  
  return gradients;
}

// ============ HOLOGRAPHIC METRICS ============

/**
 * Calculate comprehensive holographic metrics
 */
export function calculateHolographicMetrics(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  journeyPath: Array<{ row: number; col: number }>
): HolographicMetrics {
  const bekensteinBounds = calculateAllBekensteinBounds(visitedTiles, densityMap);
  
  // Total entropy
  let totalEntropy = 0;
  let maxLocalEntropy = 0;
  const entropies: number[] = [];
  
  visitedTiles.forEach(tile => {
    const bound = bekensteinBounds.get(tile)!;
    totalEntropy += bound.currentEntropy;
    maxLocalEntropy = Math.max(maxLocalEntropy, bound.currentEntropy);
    entropies.push(bound.currentEntropy);
  });
  
  // Average entropy density
  const averageEntropyDensity = visitedTiles.size > 0 ? totalEntropy / visitedTiles.size : 0;
  
  // Entropy variance
  const entropyVariance = entropies.length > 0 ?
    entropies.reduce((s, e) => s + (e - averageEntropyDensity) ** 2, 0) / entropies.length : 0;
  
  // Information horizon (based on journey path length and connectivity)
  const pathLength = journeyPath.length;
  const informationHorizon = Math.sqrt(pathLength) * INFORMATION_SPEED;
  
  // Holographic capacity (sum of all Bekenstein bounds)
  let holographicCapacity = 0;
  bekensteinBounds.forEach(bound => {
    holographicCapacity += bound.maxEntropy;
  });
  
  return {
    totalEntropy,
    averageEntropyDensity,
    maxLocalEntropy,
    entropyVariance,
    informationHorizon,
    holographicCapacity
  };
}

// ============ TILE ENTROPY PROFILE ============

/**
 * Generate complete entropy profile for a tile
 */
export function generateTileEntropyProfile(
  tileKey: string,
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  journeyPath: Array<{ row: number; col: number }>
): TileEntropyProfile {
  const shannonEntropy = calculateShannonEntropy(tileKey, journeyPath);
  const vonNeumannEntropy = calculateVonNeumannEntropy(tileKey, densityMap, visitedTiles);
  const relativeEntropy = calculateRelativeEntropy(visitedTiles, densityMap);
  const bekensteinBound = calculateBekensteinBound(tileKey, densityMap, visitedTiles);
  
  // Calculate average mutual information with neighbors
  const [row, col] = tileKey.split('-').map(Number);
  let totalMI = 0;
  let neighborCount = 0;
  
  [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
    const neighborKey = `${row + dr}-${col + dc}`;
    if (visitedTiles.has(neighborKey)) {
      totalMI += calculateMutualInformation(tileKey, neighborKey, journeyPath);
      neighborCount++;
    }
  });
  
  const mutualInformation = neighborCount > 0 ? totalMI / neighborCount : 0;
  
  return {
    tileKey,
    shannonEntropy,
    vonNeumannEntropy,
    relativeEntropy,
    mutualInformation,
    bekensteinBound
  };
}

// ============ VISUALIZATION DATA ============

/**
 * Generate entropy field visualization data
 */
export function generateEntropyFieldVisualization(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  journeyPath: Array<{ row: number; col: number }>,
  torusProjection: (row: number, col: number) => [number, number, number]
): EntropyFieldVisualization {
  const positions: number[] = [];
  const colors: number[] = [];
  const intensities: number[] = [];
  const gradientVectors: number[] = [];
  
  // Get all entropy profiles
  const profiles = new Map<string, TileEntropyProfile>();
  visitedTiles.forEach(tile => {
    profiles.set(tile, generateTileEntropyProfile(tile, visitedTiles, densityMap, journeyPath));
  });
  
  // Find max entropy for normalization
  let maxEntropy = 0;
  profiles.forEach(p => {
    maxEntropy = Math.max(maxEntropy, p.vonNeumannEntropy);
  });
  
  // Generate gradient field
  const gradients = generateEntropyGradientField(visitedTiles, densityMap);
  const gradientMap = new Map<string, EntropyGradient[]>();
  gradients.forEach(g => {
    if (!gradientMap.has(g.fromTile)) gradientMap.set(g.fromTile, []);
    gradientMap.get(g.fromTile)!.push(g);
  });
  
  // Generate visualization data for each tile
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    const [x, y, z] = torusProjection(row, col);
    
    positions.push(x, y, z);
    
    const profile = profiles.get(tile)!;
    const normalizedEntropy = maxEntropy > 0 ? profile.vonNeumannEntropy / maxEntropy : 0;
    
    // Color based on entropy (blue = low, red = high)
    const r = normalizedEntropy;
    const g = 0.3 * (1 - normalizedEntropy);
    const b = 1 - normalizedEntropy;
    colors.push(r, g, b);
    
    // Intensity based on Bekenstein utilization
    intensities.push(profile.bekensteinBound.utilizationRatio);
    
    // Gradient vector (average of outgoing gradients)
    const tileGradients = gradientMap.get(tile) || [];
    let gx = 0, gy = 0, gz = 0;
    
    tileGradients.forEach(g => {
      const [nx, ny, nz] = torusProjection(row + g.direction.row, col + g.direction.col);
      const dx = nx - x;
      const dy = ny - y;
      const dz = nz - z;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      
      gx += (dx / len) * g.flowStrength;
      gy += (dy / len) * g.flowStrength;
      gz += (dz / len) * g.flowStrength;
    });
    
    gradientVectors.push(gx, gy, gz);
  });
  
  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    intensities: new Float32Array(intensities),
    gradientVectors: new Float32Array(gradientVectors)
  };
}

// ============ HOLOGRAPHIC PRINCIPLE CHECKS ============

/**
 * Check if region satisfies holographic principle
 * (boundary entropy bounds bulk entropy)
 */
export function checkHolographicPrinciple(
  regionTiles: Set<string>,
  densityMap: Map<string, number>
): {
  satisfied: boolean;
  boundaryEntropy: number;
  bulkEntropy: number;
  ratio: number;
} {
  // Find boundary tiles (tiles with neighbors outside region)
  const boundaryTiles = new Set<string>();
  const interiorTiles = new Set<string>();
  
  regionTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    let isBoundary = false;
    
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
      const neighborKey = `${row + dr}-${col + dc}`;
      if (!regionTiles.has(neighborKey)) {
        isBoundary = true;
      }
    });
    
    if (isBoundary) {
      boundaryTiles.add(tile);
    } else {
      interiorTiles.add(tile);
    }
  });
  
  // Calculate boundary entropy (proportional to boundary area)
  let boundaryEntropy = 0;
  boundaryTiles.forEach(tile => {
    const density = densityMap.get(tile) || 1;
    boundaryEntropy += BEKENSTEIN_SCALE * Math.sqrt(density);
  });
  
  // Calculate bulk entropy
  let bulkEntropy = 0;
  regionTiles.forEach(tile => {
    const density = densityMap.get(tile) || 1;
    bulkEntropy += density * Math.log2(1 + density);
  });
  
  const ratio = boundaryEntropy > 0 ? bulkEntropy / boundaryEntropy : 0;
  const satisfied = bulkEntropy <= boundaryEntropy;
  
  return {
    satisfied,
    boundaryEntropy,
    bulkEntropy,
    ratio
  };
}
