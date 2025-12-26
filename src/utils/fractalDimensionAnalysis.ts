/**
 * Fractal Dimension Analysis for Journey Paths
 * 
 * Implements box-counting dimension calculation and self-similarity
 * pattern detection for navigation sequences.
 * 
 * Based on: "Mathematical Manifolds and Mind Matter Models" - SSRN 4997735
 * Fractal tube representations and holographic structure analysis
 */

// ============ TYPES ============

export interface BoxCountingResult {
  dimension: number;
  confidence: number;
  scalingData: Array<{ epsilon: number; count: number }>;
  regressionR2: number;
}

export interface SelfSimilarityPattern {
  scale: number;
  repetitionCount: number;
  basePattern: string[];
  similarity: number;
  startIndices: number[];
}

export interface FractalAnalysis {
  boxCountingDimension: BoxCountingResult;
  selfSimilarityPatterns: SelfSimilarityPattern[];
  hausdorffEstimate: number;
  lacunarity: number; // Gap distribution measure
  multifractalSpectrum: MultifractalSpectrum;
  correlationDimension: number;
}

export interface MultifractalSpectrum {
  qValues: number[];
  tauQ: number[];
  fAlpha: Array<{ alpha: number; f: number }>;
  singularityStrength: number;
}

export interface NavigationSequenceStats {
  totalSteps: number;
  uniqueTiles: number;
  revisitRatio: number;
  pathEfficiency: number;
  turningFrequency: number;
}

// ============ CONSTANTS ============

const BOX_SCALES = [1, 2, 4, 8, 16, 32]; // Powers of 2 for scale
const GRID_SIZE = 64; // Maximum grid resolution (8x8 tiles)
const MIN_PATTERN_LENGTH = 3;
const MAX_PATTERN_LENGTH = 12;

// ============ BOX-COUNTING DIMENSION ============

/**
 * Calculate box-counting (Minkowski-Bouligand) dimension
 */
export function calculateBoxCountingDimension(
  journeyPath: Array<{ row: number; col: number }>
): BoxCountingResult {
  if (journeyPath.length < 3) {
    return {
      dimension: 1,
      confidence: 0,
      scalingData: [],
      regressionR2: 0
    };
  }
  
  const scalingData: Array<{ epsilon: number; count: number }> = [];
  
  // For each box size (epsilon), count how many boxes contain path points
  BOX_SCALES.forEach(scale => {
    const epsilon = 1 / scale;
    const boxesPerDim = scale;
    
    // Track which boxes are occupied
    const occupiedBoxes = new Set<string>();
    
    journeyPath.forEach(({ row, col }) => {
      // Normalize to [0,1] range
      const normRow = row / 7;
      const normCol = col / 7;
      
      // Determine which box this point falls into
      const boxRow = Math.min(boxesPerDim - 1, Math.floor(normRow * boxesPerDim));
      const boxCol = Math.min(boxesPerDim - 1, Math.floor(normCol * boxesPerDim));
      
      occupiedBoxes.add(`${boxRow}-${boxCol}`);
    });
    
    scalingData.push({
      epsilon,
      count: occupiedBoxes.size
    });
  });
  
  // Linear regression on log-log plot to find dimension
  // N(ε) ∝ ε^(-D) → log(N) = -D * log(ε) + C
  const logData = scalingData.map(({ epsilon, count }) => ({
    x: Math.log(epsilon),
    y: Math.log(count)
  }));
  
  const { slope, r2 } = linearRegression(logData);
  
  // Dimension is negative of slope
  const dimension = Math.max(0, Math.min(2, -slope));
  
  // Confidence based on R² and sample size
  const confidence = r2 * Math.min(1, journeyPath.length / 20);
  
  return {
    dimension,
    confidence,
    scalingData,
    regressionR2: r2
  };
}

/**
 * Linear regression helper
 */
function linearRegression(
  data: Array<{ x: number; y: number }>
): { slope: number; intercept: number; r2: number } {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };
  
  const sumX = data.reduce((s, d) => s + d.x, 0);
  const sumY = data.reduce((s, d) => s + d.y, 0);
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
  const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0);
  const sumY2 = data.reduce((s, d) => s + d.y * d.y, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // R² calculation
  const yMean = sumY / n;
  const ssTotal = data.reduce((s, d) => s + (d.y - yMean) ** 2, 0);
  const ssResidual = data.reduce((s, d) => s + (d.y - (slope * d.x + intercept)) ** 2, 0);
  const r2 = ssTotal > 0 ? 1 - ssResidual / ssTotal : 0;
  
  return { slope, intercept, r2 };
}

// ============ SELF-SIMILARITY DETECTION ============

/**
 * Convert journey path to direction sequence for pattern matching
 */
function pathToDirections(
  journeyPath: Array<{ row: number; col: number }>
): string[] {
  const directions: string[] = [];
  
  for (let i = 1; i < journeyPath.length; i++) {
    const dr = journeyPath[i].row - journeyPath[i - 1].row;
    const dc = journeyPath[i].col - journeyPath[i - 1].col;
    
    if (dr === 0 && dc === 0) directions.push('S'); // Stay
    else if (dr === 0 && dc > 0) directions.push('E'); // East
    else if (dr === 0 && dc < 0) directions.push('W'); // West
    else if (dr > 0 && dc === 0) directions.push('S'); // South
    else if (dr < 0 && dc === 0) directions.push('N'); // North
    else if (dr > 0 && dc > 0) directions.push('SE');
    else if (dr > 0 && dc < 0) directions.push('SW');
    else if (dr < 0 && dc > 0) directions.push('NE');
    else directions.push('NW');
  }
  
  return directions;
}

/**
 * Calculate similarity between two direction patterns
 */
function patternSimilarity(p1: string[], p2: string[]): number {
  if (p1.length !== p2.length) return 0;
  
  let matches = 0;
  for (let i = 0; i < p1.length; i++) {
    if (p1[i] === p2[i]) matches++;
    // Partial match for similar directions
    else if (
      (p1[i].includes('N') && p2[i].includes('N')) ||
      (p1[i].includes('S') && p2[i].includes('S')) ||
      (p1[i].includes('E') && p2[i].includes('E')) ||
      (p1[i].includes('W') && p2[i].includes('W'))
    ) {
      matches += 0.5;
    }
  }
  
  return matches / p1.length;
}

/**
 * Detect self-similar patterns in journey path
 */
export function detectSelfSimilarityPatterns(
  journeyPath: Array<{ row: number; col: number }>
): SelfSimilarityPattern[] {
  const directions = pathToDirections(journeyPath);
  if (directions.length < MIN_PATTERN_LENGTH * 2) return [];
  
  const patterns: SelfSimilarityPattern[] = [];
  const seenPatterns = new Set<string>();
  
  // Search for repeating patterns of different lengths
  for (let len = MIN_PATTERN_LENGTH; len <= Math.min(MAX_PATTERN_LENGTH, Math.floor(directions.length / 2)); len++) {
    // Slide window to find base pattern
    for (let start = 0; start <= directions.length - len * 2; start++) {
      const basePattern = directions.slice(start, start + len);
      const patternKey = basePattern.join('-');
      
      if (seenPatterns.has(patternKey)) continue;
      
      // Look for repetitions
      const startIndices: number[] = [start];
      let totalSimilarity = 0;
      let matchCount = 0;
      
      for (let searchStart = start + len; searchStart <= directions.length - len; searchStart++) {
        const candidate = directions.slice(searchStart, searchStart + len);
        const sim = patternSimilarity(basePattern, candidate);
        
        if (sim >= 0.7) { // 70% similarity threshold
          startIndices.push(searchStart);
          totalSimilarity += sim;
          matchCount++;
        }
      }
      
      if (matchCount >= 1) { // At least one repetition found
        const avgSimilarity = totalSimilarity / matchCount;
        
        patterns.push({
          scale: len / directions.length,
          repetitionCount: startIndices.length,
          basePattern,
          similarity: avgSimilarity,
          startIndices
        });
        
        seenPatterns.add(patternKey);
      }
    }
  }
  
  // Sort by significance (repetition * similarity)
  patterns.sort((a, b) => 
    (b.repetitionCount * b.similarity) - (a.repetitionCount * a.similarity)
  );
  
  return patterns.slice(0, 10); // Top 10 patterns
}

// ============ MULTIFRACTAL ANALYSIS ============

/**
 * Calculate multifractal spectrum
 */
export function calculateMultifractalSpectrum(
  journeyPath: Array<{ row: number; col: number }>,
  densityMap: Map<string, number>
): MultifractalSpectrum {
  const qValues = [-5, -3, -1, 0, 1, 3, 5]; // Range of q for generalized dimensions
  const tauQ: number[] = [];
  
  // Calculate partition function for each q
  qValues.forEach(q => {
    let Zq = 0;
    const uniqueTiles = new Set(journeyPath.map(p => `${p.row}-${p.col}`));
    
    uniqueTiles.forEach(tile => {
      const visitCount = journeyPath.filter(p => `${p.row}-${p.col}` === tile).length;
      const probability = visitCount / journeyPath.length;
      
      if (probability > 0) {
        Zq += Math.pow(probability, q);
      }
    });
    
    // τ(q) = log(Zq) / log(ε) - we use a fixed ε approximation
    const tau = q === 1 ? 0 : Math.log(Zq) / Math.log(uniqueTiles.size || 1);
    tauQ.push(tau);
  });
  
  // Calculate f(α) spectrum via Legendre transform
  const fAlpha: Array<{ alpha: number; f: number }> = [];
  
  for (let i = 0; i < qValues.length - 1; i++) {
    const q = qValues[i];
    const dTau = (tauQ[i + 1] - tauQ[i]) / (qValues[i + 1] - qValues[i]);
    const alpha = -dTau;
    const f = q * alpha - tauQ[i];
    
    if (isFinite(alpha) && isFinite(f)) {
      fAlpha.push({ alpha, f });
    }
  }
  
  // Singularity strength (width of spectrum)
  const alphaMin = Math.min(...fAlpha.map(p => p.alpha));
  const alphaMax = Math.max(...fAlpha.map(p => p.alpha));
  const singularityStrength = alphaMax - alphaMin;
  
  return {
    qValues,
    tauQ,
    fAlpha,
    singularityStrength
  };
}

// ============ LACUNARITY ============

/**
 * Calculate lacunarity (gap distribution measure)
 */
export function calculateLacunarity(
  journeyPath: Array<{ row: number; col: number }>
): number {
  if (journeyPath.length < 3) return 0;
  
  // Create occupancy grid
  const grid: boolean[][] = Array(8).fill(null).map(() => Array(8).fill(false));
  journeyPath.forEach(({ row, col }) => {
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      grid[row][col] = true;
    }
  });
  
  // Calculate box mass distribution for different box sizes
  const boxSizes = [1, 2, 4];
  let totalLacunarity = 0;
  
  boxSizes.forEach(size => {
    const masses: number[] = [];
    
    for (let r = 0; r <= 8 - size; r++) {
      for (let c = 0; c <= 8 - size; c++) {
        let mass = 0;
        for (let dr = 0; dr < size; dr++) {
          for (let dc = 0; dc < size; dc++) {
            if (grid[r + dr][c + dc]) mass++;
          }
        }
        masses.push(mass);
      }
    }
    
    // Lacunarity = variance / mean²
    if (masses.length > 0) {
      const mean = masses.reduce((s, m) => s + m, 0) / masses.length;
      const variance = masses.reduce((s, m) => s + (m - mean) ** 2, 0) / masses.length;
      const L = mean > 0 ? variance / (mean * mean) : 0;
      totalLacunarity += L;
    }
  });
  
  return totalLacunarity / boxSizes.length;
}

// ============ CORRELATION DIMENSION ============

/**
 * Estimate correlation dimension using Grassberger-Procaccia algorithm
 */
export function calculateCorrelationDimension(
  journeyPath: Array<{ row: number; col: number }>
): number {
  if (journeyPath.length < 10) return 1;
  
  // Calculate pairwise distances
  const distances: number[] = [];
  for (let i = 0; i < journeyPath.length; i++) {
    for (let j = i + 1; j < journeyPath.length; j++) {
      const d = Math.sqrt(
        (journeyPath[i].row - journeyPath[j].row) ** 2 +
        (journeyPath[i].col - journeyPath[j].col) ** 2
      );
      distances.push(d);
    }
  }
  
  distances.sort((a, b) => a - b);
  const N = journeyPath.length;
  const numPairs = distances.length;
  
  // Calculate correlation sum for different radii
  const radii = [0.5, 1, 2, 3, 4, 5, 6];
  const correlationSums: Array<{ r: number; C: number }> = [];
  
  radii.forEach(r => {
    const count = distances.filter(d => d < r).length;
    const C = count / numPairs;
    if (C > 0) {
      correlationSums.push({ r, C });
    }
  });
  
  // Linear regression on log-log plot
  const logData = correlationSums.map(({ r, C }) => ({
    x: Math.log(r),
    y: Math.log(C)
  }));
  
  const { slope } = linearRegression(logData);
  
  return Math.max(0, Math.min(2, slope));
}

// ============ HAUSDORFF DIMENSION ESTIMATE ============

/**
 * Estimate Hausdorff dimension from box-counting with error correction
 */
export function estimateHausdorffDimension(
  boxCounting: BoxCountingResult,
  correlationDim: number
): number {
  // Hausdorff dimension is bounded by box-counting from above
  // and correlation dimension from below
  const boxDim = boxCounting.dimension;
  const corrDim = correlationDim;
  
  // Use weighted average based on confidence
  const weight = boxCounting.confidence;
  const hausdorff = boxDim * weight + corrDim * (1 - weight) * 0.5 + boxDim * (1 - weight) * 0.5;
  
  return Math.max(corrDim, Math.min(boxDim, hausdorff));
}

// ============ NAVIGATION SEQUENCE STATS ============

/**
 * Calculate navigation sequence statistics
 */
export function calculateNavigationStats(
  journeyPath: Array<{ row: number; col: number }>
): NavigationSequenceStats {
  const totalSteps = journeyPath.length;
  const uniqueTiles = new Set(journeyPath.map(p => `${p.row}-${p.col}`)).size;
  const revisitRatio = totalSteps > 0 ? 1 - (uniqueTiles / totalSteps) : 0;
  
  // Path efficiency (direct distance vs actual steps)
  let totalDistance = 0;
  for (let i = 1; i < journeyPath.length; i++) {
    const d = Math.sqrt(
      (journeyPath[i].row - journeyPath[i - 1].row) ** 2 +
      (journeyPath[i].col - journeyPath[i - 1].col) ** 2
    );
    totalDistance += d;
  }
  
  const directDistance = totalSteps > 1 ? Math.sqrt(
    (journeyPath[journeyPath.length - 1].row - journeyPath[0].row) ** 2 +
    (journeyPath[journeyPath.length - 1].col - journeyPath[0].col) ** 2
  ) : 0;
  
  const pathEfficiency = totalDistance > 0 ? directDistance / totalDistance : 1;
  
  // Turning frequency
  const directions = pathToDirections(journeyPath);
  let turns = 0;
  for (let i = 1; i < directions.length; i++) {
    if (directions[i] !== directions[i - 1]) turns++;
  }
  const turningFrequency = directions.length > 0 ? turns / directions.length : 0;
  
  return {
    totalSteps,
    uniqueTiles,
    revisitRatio,
    pathEfficiency,
    turningFrequency
  };
}

// ============ COMPLETE FRACTAL ANALYSIS ============

/**
 * Perform complete fractal dimension analysis
 */
export function performFractalAnalysis(
  journeyPath: Array<{ row: number; col: number }>,
  densityMap: Map<string, number>
): FractalAnalysis {
  const boxCountingDimension = calculateBoxCountingDimension(journeyPath);
  const selfSimilarityPatterns = detectSelfSimilarityPatterns(journeyPath);
  const lacunarity = calculateLacunarity(journeyPath);
  const multifractalSpectrum = calculateMultifractalSpectrum(journeyPath, densityMap);
  const correlationDimension = calculateCorrelationDimension(journeyPath);
  const hausdorffEstimate = estimateHausdorffDimension(boxCountingDimension, correlationDimension);
  
  return {
    boxCountingDimension,
    selfSimilarityPatterns,
    hausdorffEstimate,
    lacunarity,
    multifractalSpectrum,
    correlationDimension
  };
}
