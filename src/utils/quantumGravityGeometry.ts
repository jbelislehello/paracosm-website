/**
 * Quantum Gravity Geometry for Tile Boundary Analysis
 * 
 * Implements micro-domain spacetime properties, curvature singularities,
 * and geodesic flow analysis at tile boundaries.
 * 
 * Based on: "Mathematical Manifolds and Mind Matter Models" - SSRN 4997735
 * Quantum gravity geometry markers and Planck-scale structures
 */

// ============ TYPES ============

export interface CurvatureSingularity {
  position: { x: number; y: number; z: number };
  type: 'conical' | 'cusp' | 'fold' | 'saddle';
  strength: number; // 0-1
  radius: number; // Influence radius
  tileKey: string;
}

export interface GeodesicFlow {
  points: Array<{ x: number; y: number; z: number }>;
  tangentVectors: Array<{ x: number; y: number; z: number }>;
  energy: number;
  length: number;
  curvatureIntegral: number;
}

export interface MicroDomainProperties {
  tileKey: string;
  planckCells: number; // Discretized spacetime cells
  quantumFoam: number; // Spacetime fluctuation measure
  causalStructure: 'timelike' | 'spacelike' | 'null';
  holonomyDefect: number; // Parallel transport defect angle
  weylTensor: number; // Conformal curvature
}

export interface QuantumGravityOverlay {
  singularities: CurvatureSingularity[];
  geodesics: GeodesicFlow[];
  microDomains: MicroDomainProperties[];
  globalCurvature: number;
  topologicalCharge: number;
}

export interface TileBoundaryData {
  fromTile: string;
  toTile: string;
  connectionStrength: number;
  curvatureJump: number;
  geodesicDeviation: number;
}

// ============ CONSTANTS ============

const PLANCK_DISCRETIZATION = 8; // Grid resolution per tile
const GEODESIC_STEPS = 50;
const SINGULARITY_THRESHOLD = 0.7;

// ============ SINGULARITY DETECTION ============

/**
 * Detect curvature singularities at tile boundaries
 */
export function detectCurvatureSingularities(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  torusProjection: (row: number, col: number) => [number, number, number]
): CurvatureSingularity[] {
  const singularities: CurvatureSingularity[] = [];
  
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    if (isNaN(row) || isNaN(col)) return;
    
    const density = densityMap.get(tile) || 1;
    
    // Check neighbors for curvature discontinuities
    const neighbors = [
      { dr: 0, dc: 1, key: `${row}-${col + 1}` },
      { dr: 1, dc: 0, key: `${row + 1}-${col}` },
      { dr: 0, dc: -1, key: `${row}-${col - 1}` },
      { dr: -1, dc: 0, key: `${row - 1}-${col}` }
    ];
    
    let maxCurvatureJump = 0;
    let singularityDirection = { dr: 0, dc: 0 };
    
    neighbors.forEach(({ dr, dc, key }) => {
      if (visitedTiles.has(key)) {
        const neighborDensity = densityMap.get(key) || 1;
        const curvatureJump = Math.abs(density - neighborDensity) / Math.max(density, neighborDensity);
        
        if (curvatureJump > maxCurvatureJump) {
          maxCurvatureJump = curvatureJump;
          singularityDirection = { dr, dc };
        }
      }
    });
    
    if (maxCurvatureJump > SINGULARITY_THRESHOLD) {
      const [x, y, z] = torusProjection(row, col);
      
      // Classify singularity type
      const cornerNeighbors = [
        `${row - 1}-${col - 1}`, `${row - 1}-${col + 1}`,
        `${row + 1}-${col - 1}`, `${row + 1}-${col + 1}`
      ];
      const visitedCorners = cornerNeighbors.filter(k => visitedTiles.has(k)).length;
      
      let type: CurvatureSingularity['type'];
      if (visitedCorners === 0) type = 'conical';
      else if (visitedCorners === 1) type = 'cusp';
      else if (visitedCorners <= 2) type = 'fold';
      else type = 'saddle';
      
      singularities.push({
        position: { x, y, z },
        type,
        strength: maxCurvatureJump,
        radius: 0.1 + maxCurvatureJump * 0.3,
        tileKey: tile
      });
    }
  });
  
  return singularities;
}

/**
 * Calculate holonomy defect (parallel transport around loop)
 */
function calculateHolonomyDefect(
  tiles: string[],
  densityMap: Map<string, number>
): number {
  if (tiles.length < 3) return 0;
  
  // Sum curvature contributions around loop
  let totalAngle = 0;
  
  for (let i = 0; i < tiles.length; i++) {
    const curr = tiles[i];
    const next = tiles[(i + 1) % tiles.length];
    
    const [r1, c1] = curr.split('-').map(Number);
    const [r2, c2] = next.split('-').map(Number);
    
    const d1 = densityMap.get(curr) || 1;
    const d2 = densityMap.get(next) || 1;
    
    // Connection 1-form contribution
    const dr = r2 - r1;
    const dc = c2 - c1;
    const connectionAngle = Math.atan2(dc, dr);
    const curvatureWeight = (d1 + d2) / 2;
    
    totalAngle += connectionAngle * curvatureWeight;
  }
  
  // Holonomy defect = deviation from 2π
  return Math.abs(totalAngle - 2 * Math.PI);
}

// ============ GEODESIC FLOW CALCULATION ============

/**
 * Calculate geodesic flow between two tiles
 */
export function calculateGeodesicFlow(
  startTile: string,
  endTile: string,
  densityMap: Map<string, number>,
  torusProjection: (row: number, col: number) => [number, number, number]
): GeodesicFlow {
  const [r1, c1] = startTile.split('-').map(Number);
  const [r2, c2] = endTile.split('-').map(Number);
  
  const points: Array<{ x: number; y: number; z: number }> = [];
  const tangentVectors: Array<{ x: number; y: number; z: number }> = [];
  let curvatureIntegral = 0;
  let length = 0;
  
  // Interpolate along geodesic with density-weighted metric
  for (let i = 0; i <= GEODESIC_STEPS; i++) {
    const t = i / GEODESIC_STEPS;
    
    // Interpolate in tile space
    const row = r1 + (r2 - r1) * t;
    const col = c1 + (c2 - c1) * t;
    
    // Get density at this point (interpolated)
    const tileKey = `${Math.round(row)}-${Math.round(col)}`;
    const density = densityMap.get(tileKey) || 1;
    
    // Apply density to metric (geodesic deviation)
    const metricFactor = 1 / (1 + density * 0.1);
    
    const [x, y, z] = torusProjection(row * metricFactor, col * metricFactor);
    points.push({ x, y, z });
    
    // Calculate tangent vector
    if (i > 0) {
      const prev = points[i - 1];
      const tangent = {
        x: x - prev.x,
        y: y - prev.y,
        z: z - prev.z
      };
      const tangentLen = Math.sqrt(tangent.x ** 2 + tangent.y ** 2 + tangent.z ** 2);
      
      tangentVectors.push({
        x: tangent.x / (tangentLen || 1),
        y: tangent.y / (tangentLen || 1),
        z: tangent.z / (tangentLen || 1)
      });
      
      length += tangentLen;
      
      // Curvature from tangent deviation
      if (tangentVectors.length >= 2) {
        const prevTangent = tangentVectors[tangentVectors.length - 2];
        const curvature = Math.sqrt(
          (tangentVectors[tangentVectors.length - 1].x - prevTangent.x) ** 2 +
          (tangentVectors[tangentVectors.length - 1].y - prevTangent.y) ** 2 +
          (tangentVectors[tangentVectors.length - 1].z - prevTangent.z) ** 2
        );
        curvatureIntegral += curvature;
      }
    } else {
      tangentVectors.push({ x: 0, y: 0, z: 0 });
    }
  }
  
  // Geodesic energy = integral of velocity squared
  const energy = (length ** 2) / GEODESIC_STEPS;
  
  return {
    points,
    tangentVectors,
    energy,
    length,
    curvatureIntegral
  };
}

/**
 * Generate geodesic field across visited tiles
 */
export function generateGeodesicField(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  torusProjection: (row: number, col: number) => [number, number, number]
): GeodesicFlow[] {
  const geodesics: GeodesicFlow[] = [];
  const tileArray = Array.from(visitedTiles);
  
  // Connect adjacent tiles with geodesics
  tileArray.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    if (isNaN(row) || isNaN(col)) return;
    
    // Right neighbor
    const rightKey = `${row}-${col + 1}`;
    if (visitedTiles.has(rightKey)) {
      geodesics.push(calculateGeodesicFlow(tile, rightKey, densityMap, torusProjection));
    }
    
    // Down neighbor
    const downKey = `${row + 1}-${col}`;
    if (visitedTiles.has(downKey)) {
      geodesics.push(calculateGeodesicFlow(tile, downKey, densityMap, torusProjection));
    }
  });
  
  return geodesics;
}

// ============ MICRO-DOMAIN ANALYSIS ============

/**
 * Calculate micro-domain spacetime properties for a tile
 */
export function calculateMicroDomainProperties(
  tileKey: string,
  densityMap: Map<string, number>,
  visitedTiles: Set<string>
): MicroDomainProperties {
  const [row, col] = tileKey.split('-').map(Number);
  const density = densityMap.get(tileKey) || 1;
  
  // Planck cells - discretized spacetime volume
  const planckCells = Math.ceil(PLANCK_DISCRETIZATION * PLANCK_DISCRETIZATION * (1 + density * 0.5));
  
  // Quantum foam - fluctuation measure from neighborhood variance
  let foam = 0;
  let neighborCount = 0;
  [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
    const neighborKey = `${row + dr}-${col + dc}`;
    if (visitedTiles.has(neighborKey)) {
      const neighborDensity = densityMap.get(neighborKey) || 1;
      foam += (density - neighborDensity) ** 2;
      neighborCount++;
    }
  });
  foam = neighborCount > 0 ? Math.sqrt(foam / neighborCount) : 0;
  
  // Causal structure from position on manifold
  const isEdge = row === 0 || row === 7 || col === 0 || col === 7;
  const causalStructure: MicroDomainProperties['causalStructure'] = 
    isEdge ? 'null' : (density > 2 ? 'timelike' : 'spacelike');
  
  // Holonomy defect from local loop
  const localLoop = [
    tileKey,
    `${row}-${col + 1}`,
    `${row + 1}-${col + 1}`,
    `${row + 1}-${col}`
  ].filter(k => visitedTiles.has(k));
  const holonomyDefect = calculateHolonomyDefect(localLoop, densityMap);
  
  // Weyl tensor (conformal curvature) - deviation from conformally flat
  const avgNeighborDensity = neighborCount > 0 ? 
    Array.from([[0, 1], [0, -1], [1, 0], [-1, 0]])
      .map(([dr, dc]) => densityMap.get(`${row + dr}-${col + dc}`) || 1)
      .reduce((s, d) => s + d, 0) / neighborCount : density;
  const weylTensor = Math.abs(density - avgNeighborDensity) / Math.max(density, 1);
  
  return {
    tileKey,
    planckCells,
    quantumFoam: foam,
    causalStructure,
    holonomyDefect,
    weylTensor
  };
}

/**
 * Generate micro-domain analysis for all visited tiles
 */
export function analyzeMicroDomains(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>
): MicroDomainProperties[] {
  return Array.from(visitedTiles).map(tile =>
    calculateMicroDomainProperties(tile, densityMap, visitedTiles)
  );
}

// ============ FULL OVERLAY GENERATION ============

/**
 * Generate complete quantum gravity overlay
 */
export function generateQuantumGravityOverlay(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  torusProjection: (row: number, col: number) => [number, number, number]
): QuantumGravityOverlay {
  // Detect singularities
  const singularities = detectCurvatureSingularities(visitedTiles, densityMap, torusProjection);
  
  // Calculate geodesic flows
  const geodesics = generateGeodesicField(visitedTiles, densityMap, torusProjection);
  
  // Analyze micro-domains
  const microDomains = analyzeMicroDomains(visitedTiles, densityMap);
  
  // Global curvature (average of local curvatures)
  const globalCurvature = geodesics.length > 0 ?
    geodesics.reduce((sum, g) => sum + g.curvatureIntegral, 0) / geodesics.length : 0;
  
  // Topological charge (sum of singularity strengths)
  const topologicalCharge = singularities.reduce((sum, s) => {
    const sign = s.type === 'conical' || s.type === 'cusp' ? 1 : -1;
    return sum + s.strength * sign;
  }, 0);
  
  return {
    singularities,
    geodesics,
    microDomains,
    globalCurvature,
    topologicalCharge
  };
}

/**
 * Analyze tile boundary transitions
 */
export function analyzeTileBoundaries(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  torusProjection: (row: number, col: number) => [number, number, number]
): TileBoundaryData[] {
  const boundaries: TileBoundaryData[] = [];
  
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    if (isNaN(row) || isNaN(col)) return;
    
    const density = densityMap.get(tile) || 1;
    const [x1, y1, z1] = torusProjection(row, col);
    
    // Check each neighbor
    [[0, 1], [1, 0]].forEach(([dr, dc]) => {
      const neighborKey = `${row + dr}-${col + dc}`;
      if (visitedTiles.has(neighborKey)) {
        const neighborDensity = densityMap.get(neighborKey) || 1;
        const [x2, y2, z2] = torusProjection(row + dr, col + dc);
        
        // Connection strength
        const connectionStrength = 2 / (1 / density + 1 / neighborDensity); // Harmonic mean
        
        // Curvature jump
        const curvatureJump = Math.abs(density - neighborDensity) / Math.max(density, neighborDensity);
        
        // Geodesic deviation (difference from straight line in 3D)
        const euclideanDist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
        const expectedDist = 0.2; // Expected tile spacing
        const geodesicDeviation = Math.abs(euclideanDist - expectedDist) / expectedDist;
        
        boundaries.push({
          fromTile: tile,
          toTile: neighborKey,
          connectionStrength,
          curvatureJump,
          geodesicDeviation
        });
      }
    });
  });
  
  return boundaries;
}
