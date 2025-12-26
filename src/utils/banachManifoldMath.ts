/**
 * Banach Manifold Mathematics for Higher-Dimensional Consciousness States
 * 
 * Implements infinite-dimensional Banach space projections for modeling
 * mystical experience trajectories and consciousness superspace.
 * 
 * Based on: "Mathematical Manifolds and Mind Matter Models" - SSRN 4997735
 * Section on Banach Manifold Models for "mystical experience superspace"
 */

// ============ BANACH SPACE TYPES ============

export interface BanachCoordinate {
  // Finite dimensional projection of infinite-dimensional point
  primaryComponents: number[]; // First n principal components
  residualNorm: number; // ||x - Π_n(x)|| - approximation error
  hilbertNorm: number; // Full Hilbert space norm estimate
}

export interface MysticalTrajectoryPoint {
  position: BanachCoordinate;
  velocity: BanachCoordinate;
  consciousnessLevel: number; // 0-1 scale
  experienceType: 'ordinary' | 'liminal' | 'peak' | 'unity' | 'void';
  timestamp: number;
}

export interface BanachProjectionConfig {
  dimensions: number; // Number of principal components to keep (3-12)
  normType: 'l2' | 'supremum' | 'weighted';
  curvatureWeight: number; // How much curvature affects projection
  temporalSmoothing: number; // Smoothing factor for trajectory
}

export interface ProjectedManifoldPoint {
  x: number;
  y: number;
  z: number;
  w: number; // 4th dimension (color/size encoded)
  norm: number;
  curvature: number;
  experienceIntensity: number;
}

// ============ CONSTANTS ============

const DEFAULT_DIMENSIONS = 8;
const CONSCIOUSNESS_EIGENVALUES = [
  1.0, 0.618, 0.382, 0.236, 0.146, 0.090, 0.056, 0.034, 0.021, 0.013, 0.008, 0.005
]; // Fibonacci-like decay

// Experience type thresholds on the consciousness manifold
const EXPERIENCE_THRESHOLDS = {
  ordinary: 0.2,
  liminal: 0.4,
  peak: 0.6,
  unity: 0.8,
  void: 0.95
};

// ============ CORE BANACH SPACE OPERATIONS ============

/**
 * Project journey tiles onto Banach space principal components
 * Uses consciousness-weighted inner product
 */
export function projectToBanachSpace(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  dimensions: number = DEFAULT_DIMENSIONS
): BanachCoordinate {
  const components: number[] = [];
  let totalWeight = 0;
  let weightedSum = 0;
  
  // Create weighted coordinate representation
  const tileArray = Array.from(visitedTiles);
  const tileCoords = tileArray.map(tile => {
    const [r, c] = tile.split('-').map(Number);
    const density = densityMap.get(tile) || 1;
    return { r, c, density, weight: density };
  });
  
  // Calculate principal components using consciousness eigenvalues
  for (let d = 0; d < dimensions; d++) {
    let component = 0;
    const eigenvalue = CONSCIOUSNESS_EIGENVALUES[d] || Math.pow(0.618, d);
    
    tileCoords.forEach(({ r, c, weight }, idx) => {
      // Chebyshev polynomial basis for orthogonality
      const chebyshev = Math.cos(d * Math.acos(2 * ((r * 8 + c) / 64) - 1));
      component += chebyshev * weight * eigenvalue;
      totalWeight += weight;
    });
    
    components.push(component / Math.max(1, tileCoords.length));
  }
  
  // Calculate residual norm (approximation error)
  const primaryNormSq = components.reduce((sum, c) => sum + c * c, 0);
  const estimatedFullNorm = primaryNormSq / (1 - Math.pow(0.618, dimensions));
  const residualNorm = Math.sqrt(Math.max(0, estimatedFullNorm - primaryNormSq));
  
  return {
    primaryComponents: components,
    residualNorm,
    hilbertNorm: Math.sqrt(estimatedFullNorm)
  };
}

/**
 * Calculate geodesic distance in Banach manifold
 * Uses weighted norm respecting consciousness metric
 */
export function banachGeodesicDistance(
  p1: BanachCoordinate,
  p2: BanachCoordinate,
  normType: 'l2' | 'supremum' | 'weighted' = 'weighted'
): number {
  const diff = p1.primaryComponents.map((c, i) => c - p2.primaryComponents[i]);
  
  switch (normType) {
    case 'supremum':
      return Math.max(...diff.map(Math.abs));
    
    case 'weighted':
      return Math.sqrt(
        diff.reduce((sum, d, i) => {
          const eigenWeight = CONSCIOUSNESS_EIGENVALUES[i] || 0.01;
          return sum + d * d / eigenWeight;
        }, 0)
      );
    
    default: // l2
      return Math.sqrt(diff.reduce((sum, d) => sum + d * d, 0));
  }
}

/**
 * Project Banach coordinate to 3D visualization space
 * Uses nonlinear dimensionality reduction
 */
export function projectTo3D(
  coord: BanachCoordinate,
  time: number = 0
): ProjectedManifoldPoint {
  const { primaryComponents, hilbertNorm } = coord;
  
  // Use first 3 components with rotation
  const rotationSpeed = 0.0003;
  const angle = time * rotationSpeed;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  // Get base coordinates (or zeros if not enough components)
  const c0 = primaryComponents[0] || 0;
  const c1 = primaryComponents[1] || 0;
  const c2 = primaryComponents[2] || 0;
  const c3 = primaryComponents[3] || 0;
  
  // Apply rotation in higher dimensional space
  const x = c0 * cos - c1 * sin;
  const y = c0 * sin + c1 * cos;
  const z = c2 * cos - c3 * sin;
  const w = c2 * sin + c3 * cos;
  
  // Calculate local curvature from component gradients
  let curvature = 0;
  for (let i = 0; i < primaryComponents.length - 1; i++) {
    curvature += Math.abs(primaryComponents[i] - primaryComponents[i + 1]);
  }
  curvature /= Math.max(1, primaryComponents.length - 1);
  
  // Experience intensity from norm
  const experienceIntensity = 1 - Math.exp(-hilbertNorm * 0.5);
  
  return {
    x: x * 2,
    y: y * 2,
    z: z * 2,
    w,
    norm: hilbertNorm,
    curvature,
    experienceIntensity
  };
}

/**
 * Classify experience type from Banach coordinate
 */
export function classifyExperienceType(
  coord: BanachCoordinate
): 'ordinary' | 'liminal' | 'peak' | 'unity' | 'void' {
  const intensity = coord.hilbertNorm / (1 + coord.hilbertNorm);
  
  if (intensity >= EXPERIENCE_THRESHOLDS.void) return 'void';
  if (intensity >= EXPERIENCE_THRESHOLDS.unity) return 'unity';
  if (intensity >= EXPERIENCE_THRESHOLDS.peak) return 'peak';
  if (intensity >= EXPERIENCE_THRESHOLDS.liminal) return 'liminal';
  return 'ordinary';
}

// ============ TRAJECTORY ANALYSIS ============

/**
 * Generate mystical trajectory from journey path
 */
export function generateMysticalTrajectory(
  journeyPath: Array<{ row: number; col: number; timestamp?: number }>,
  densityMap: Map<string, number>,
  config: Partial<BanachProjectionConfig> = {}
): MysticalTrajectoryPoint[] {
  const dimensions = config.dimensions || DEFAULT_DIMENSIONS;
  const smoothing = config.temporalSmoothing || 0.3;
  
  const trajectory: MysticalTrajectoryPoint[] = [];
  let previousVelocity: number[] | null = null;
  
  for (let i = 0; i < journeyPath.length; i++) {
    // Build visited tiles up to this point
    const visitedTiles = new Set<string>();
    for (let j = 0; j <= i; j++) {
      visitedTiles.add(`${journeyPath[j].row}-${journeyPath[j].col}`);
    }
    
    // Project current state to Banach space
    const position = projectToBanachSpace(visitedTiles, densityMap, dimensions);
    
    // Calculate velocity (change in Banach coordinates)
    let velocityComponents: number[];
    if (i === 0) {
      velocityComponents = new Array(dimensions).fill(0);
    } else {
      const prevPoint = trajectory[i - 1];
      velocityComponents = position.primaryComponents.map((c, d) => 
        c - prevPoint.position.primaryComponents[d]
      );
    }
    
    // Apply temporal smoothing
    if (previousVelocity) {
      velocityComponents = velocityComponents.map((v, d) =>
        v * (1 - smoothing) + previousVelocity![d] * smoothing
      );
    }
    previousVelocity = velocityComponents;
    
    const velocity: BanachCoordinate = {
      primaryComponents: velocityComponents,
      residualNorm: position.residualNorm * 0.1, // Velocity residual smaller
      hilbertNorm: Math.sqrt(velocityComponents.reduce((s, v) => s + v * v, 0))
    };
    
    // Calculate consciousness level from trajectory properties
    const totalNorm = position.hilbertNorm;
    const velocityNorm = velocity.hilbertNorm;
    const consciousnessLevel = Math.tanh(totalNorm * 0.5 + velocityNorm * 0.3);
    
    trajectory.push({
      position,
      velocity,
      consciousnessLevel,
      experienceType: classifyExperienceType(position),
      timestamp: journeyPath[i].timestamp || i * 1000
    });
  }
  
  return trajectory;
}

/**
 * Calculate trajectory curvature in Banach space (geodesic deviation)
 */
export function calculateTrajectoryCurvature(
  trajectory: MysticalTrajectoryPoint[]
): number[] {
  if (trajectory.length < 3) return [];
  
  const curvatures: number[] = [];
  
  for (let i = 1; i < trajectory.length - 1; i++) {
    const prev = trajectory[i - 1].position.primaryComponents;
    const curr = trajectory[i].position.primaryComponents;
    const next = trajectory[i + 1].position.primaryComponents;
    
    // Second derivative approximation
    const secondDerivative = prev.map((p, d) => 
      prev[d] - 2 * curr[d] + next[d]
    );
    
    // First derivative magnitude
    const firstDerivative = curr.map((c, d) => 
      (next[d] - prev[d]) / 2
    );
    const firstMag = Math.sqrt(firstDerivative.reduce((s, v) => s + v * v, 0));
    
    // Curvature = |acceleration| / |velocity|²
    const secondMag = Math.sqrt(secondDerivative.reduce((s, v) => s + v * v, 0));
    const curvature = firstMag > 0.001 ? secondMag / (firstMag * firstMag) : 0;
    
    curvatures.push(Math.min(curvature, 10)); // Cap extreme curvatures
  }
  
  return curvatures;
}

/**
 * Detect consciousness state transitions in trajectory
 */
export function detectStateTransitions(
  trajectory: MysticalTrajectoryPoint[]
): Array<{
  index: number;
  fromState: string;
  toState: string;
  intensity: number;
}> {
  const transitions: Array<{
    index: number;
    fromState: string;
    toState: string;
    intensity: number;
  }> = [];
  
  for (let i = 1; i < trajectory.length; i++) {
    const prevType = trajectory[i - 1].experienceType;
    const currType = trajectory[i].experienceType;
    
    if (prevType !== currType) {
      const intensityChange = Math.abs(
        trajectory[i].consciousnessLevel - trajectory[i - 1].consciousnessLevel
      );
      
      transitions.push({
        index: i,
        fromState: prevType,
        toState: currType,
        intensity: intensityChange
      });
    }
  }
  
  return transitions;
}

// ============ MANIFOLD STRUCTURE ============

/**
 * Calculate Banach manifold sectional curvature
 */
export function calculateSectionalCurvature(
  p1: BanachCoordinate,
  p2: BanachCoordinate,
  p3: BanachCoordinate
): number {
  // Sectional curvature from three points defining a 2-plane
  const v1 = p2.primaryComponents.map((c, i) => c - p1.primaryComponents[i]);
  const v2 = p3.primaryComponents.map((c, i) => c - p1.primaryComponents[i]);
  
  // Cross product magnitude (area of parallelogram)
  let crossMagSq = 0;
  for (let i = 0; i < v1.length; i++) {
    for (let j = i + 1; j < v1.length; j++) {
      const cross = v1[i] * v2[j] - v1[j] * v2[i];
      crossMagSq += cross * cross;
    }
  }
  const area = Math.sqrt(crossMagSq);
  
  // Edge lengths
  const d12 = banachGeodesicDistance(p1, p2);
  const d23 = banachGeodesicDistance(p2, p3);
  const d13 = banachGeodesicDistance(p1, p3);
  
  // Gaussian curvature from Gauss-Bonnet (simplified)
  const s = (d12 + d23 + d13) / 2;
  const heronArea = Math.sqrt(Math.max(0, s * (s - d12) * (s - d23) * (s - d13)));
  
  // Curvature deficit
  if (heronArea > 0.001 && area > 0.001) {
    return (area - heronArea) / (area * heronArea);
  }
  return 0;
}

/**
 * Generate Banach manifold mesh for 3D visualization
 */
export function generateBanachManifoldMesh(
  trajectory: MysticalTrajectoryPoint[],
  resolution: number = 20,
  time: number = 0
): {
  positions: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
} {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  
  // Create mesh around trajectory
  trajectory.forEach((point, i) => {
    const projected = projectTo3D(point.position, time);
    const t = i / Math.max(1, trajectory.length - 1);
    
    // Create ring of vertices around each trajectory point
    for (let j = 0; j < resolution; j++) {
      const angle = (j / resolution) * Math.PI * 2;
      const radius = 0.1 + projected.curvature * 0.5;
      
      // Local frame from velocity
      const vx = point.velocity.primaryComponents[0] || 0;
      const vy = point.velocity.primaryComponents[1] || 0;
      const vz = point.velocity.primaryComponents[2] || 0;
      const vLen = Math.sqrt(vx * vx + vy * vy + vz * vz) + 0.001;
      
      // Perpendicular vectors
      const nx = -vy / vLen;
      const ny = vx / vLen;
      const nz = 0;
      const bx = vy * nz - vz * ny;
      const by = vz * nx - vx * nz;
      const bz = vx * ny - vy * nx;
      
      // Position on ring
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      positions.push(
        projected.x + (nx * cos + bx * sin) * radius,
        projected.y + (ny * cos + by * sin) * radius,
        projected.z + (nz * cos + bz * sin) * radius
      );
      
      // Color based on experience type
      const colorMap: Record<string, [number, number, number]> = {
        ordinary: [0.3, 0.3, 0.6],
        liminal: [0.5, 0.3, 0.7],
        peak: [0.8, 0.5, 0.2],
        unity: [0.9, 0.9, 0.5],
        void: [0.1, 0.1, 0.2]
      };
      const [r, g, b] = colorMap[point.experienceType] || [0.5, 0.5, 0.5];
      colors.push(r, g, b);
    }
    
    // Generate indices (connect rings)
    if (i > 0) {
      const prevStart = (i - 1) * resolution;
      const currStart = i * resolution;
      for (let j = 0; j < resolution; j++) {
        const nextJ = (j + 1) % resolution;
        indices.push(
          prevStart + j, currStart + j, currStart + nextJ,
          prevStart + j, currStart + nextJ, prevStart + nextJ
        );
      }
    }
  });
  
  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    indices: new Uint32Array(indices)
  };
}

// ============ EXPERIENCE SPACE ANALYSIS ============

/**
 * Calculate experience space density
 */
export function calculateExperienceSpaceDensity(
  trajectory: MysticalTrajectoryPoint[],
  gridResolution: number = 10
): Map<string, number> {
  const density = new Map<string, number>();
  
  trajectory.forEach(point => {
    const projected = projectTo3D(point.position, 0);
    
    // Quantize to grid
    const gx = Math.floor((projected.x + 5) / 10 * gridResolution);
    const gy = Math.floor((projected.y + 5) / 10 * gridResolution);
    const gz = Math.floor((projected.z + 5) / 10 * gridResolution);
    
    const key = `${gx}-${gy}-${gz}`;
    density.set(key, (density.get(key) || 0) + point.consciousnessLevel);
  });
  
  return density;
}

/**
 * Find attractor basins in experience space
 */
export function findExperienceAttractors(
  trajectory: MysticalTrajectoryPoint[]
): Array<{
  center: ProjectedManifoldPoint;
  strength: number;
  type: string;
  radius: number;
}> {
  const attractors: Array<{
    center: ProjectedManifoldPoint;
    strength: number;
    type: string;
    radius: number;
  }> = [];
  
  // Group by experience type
  const typeGroups = new Map<string, ProjectedManifoldPoint[]>();
  
  trajectory.forEach(point => {
    const projected = projectTo3D(point.position, 0);
    const type = point.experienceType;
    
    if (!typeGroups.has(type)) {
      typeGroups.set(type, []);
    }
    typeGroups.get(type)!.push(projected);
  });
  
  // Find centroid of each group
  typeGroups.forEach((points, type) => {
    if (points.length < 2) return;
    
    const centroid: ProjectedManifoldPoint = {
      x: points.reduce((s, p) => s + p.x, 0) / points.length,
      y: points.reduce((s, p) => s + p.y, 0) / points.length,
      z: points.reduce((s, p) => s + p.z, 0) / points.length,
      w: points.reduce((s, p) => s + p.w, 0) / points.length,
      norm: points.reduce((s, p) => s + p.norm, 0) / points.length,
      curvature: points.reduce((s, p) => s + p.curvature, 0) / points.length,
      experienceIntensity: points.reduce((s, p) => s + p.experienceIntensity, 0) / points.length
    };
    
    // Calculate radius (spread)
    const distances = points.map(p => 
      Math.sqrt((p.x - centroid.x) ** 2 + (p.y - centroid.y) ** 2 + (p.z - centroid.z) ** 2)
    );
    const avgDist = distances.reduce((s, d) => s + d, 0) / distances.length;
    
    attractors.push({
      center: centroid,
      strength: points.length / trajectory.length,
      type,
      radius: avgDist + 0.1
    });
  });
  
  return attractors;
}
