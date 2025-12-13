/**
 * Mathematical utilities for mapping tiles to a 3D torus manifold
 * 
 * Coordinate System:
 * - θ (theta): Toroidal angle - maps columns (0-7) around the center hole
 * - φ (phi): Poloidal angle - maps seasons × rows (0-39) around the tube
 * 
 * The torus equation with variable minor radius:
 * x = (R + r(tile) × cos(φ)) × cos(θ)
 * y = (R + r(tile) × cos(φ)) × sin(θ)
 * z = r(tile) × sin(φ)
 */

// Torus constants
export const TORUS_MAJOR_RADIUS = 3.0;  // R - distance from center of torus to center of tube
export const TORUS_BASE_MINOR_RADIUS = 1.0;  // r₀ - base radius of the tube
export const CURVATURE_SENSITIVITY = 0.3;  // α - how much density affects curvature

// Season mapping
export type ManifoldSeason = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

export const SEASON_INDEX: Record<ManifoldSeason, number> = {
  POLLENS: 0,
  NOEMS: 1,
  POEMS: 2,
  TOTEMS: 3,
  ANTHEMS: 4
};

export const SEASON_COLORS: Record<ManifoldSeason, string> = {
  POLLENS: 'hsl(350, 80%, 60%)',  // Rose
  NOEMS: 'hsl(280, 70%, 60%)',   // Purple
  POEMS: 'hsl(220, 70%, 60%)',   // Blue
  TOTEMS: 'hsl(140, 60%, 50%)',  // Green
  ANTHEMS: 'hsl(45, 90%, 55%)'   // Amber
};

export const SEASON_HEX_COLORS: Record<ManifoldSeason, number> = {
  POLLENS: 0xf43f5e,  // Rose
  NOEMS: 0xa855f7,    // Purple
  POEMS: 0x3b82f6,    // Blue
  TOTEMS: 0x22c55e,   // Green
  ANTHEMS: 0xf59e0b   // Amber
};

/**
 * Calculate theta (toroidal angle) from column
 * Maps 8 columns to 0-2π
 */
export function columnToTheta(col: number): number {
  return (2 * Math.PI * (col + 0.5)) / 8;
}

/**
 * Calculate phi (poloidal angle) from row and season
 * Maps 5 seasons × 8 rows = 40 positions to 0-2π
 */
export function rowSeasonToPhi(row: number, season: ManifoldSeason): number {
  const seasonIndex = SEASON_INDEX[season];
  const position = seasonIndex * 8 + row;
  return (2 * Math.PI * (position + 0.5)) / 40;
}

/**
 * Calculate local minor radius based on POLEN density
 * Higher density = outward bulge
 */
export function calculateLocalRadius(polenDensity: number): number {
  return TORUS_BASE_MINOR_RADIUS * (1 + CURVATURE_SENSITIVITY * Math.log(1 + polenDensity));
}

/**
 * Convert tile coordinates to 3D torus point
 */
export function tileToTorusPoint(
  row: number,
  col: number,
  season: ManifoldSeason,
  polenDensity: number = 0
): [number, number, number] {
  const theta = columnToTheta(col);
  const phi = rowSeasonToPhi(row, season);
  const r = calculateLocalRadius(polenDensity);
  const R = TORUS_MAJOR_RADIUS;

  const x = (R + r * Math.cos(phi)) * Math.cos(theta);
  const y = (R + r * Math.cos(phi)) * Math.sin(theta);
  const z = r * Math.sin(phi);

  return [x, y, z];
}

/**
 * Calculate Gaussian curvature at a point on the torus
 * K = cos(φ) / (r × (R + r × cos(φ)))
 * 
 * Positive K = locally convex (outer edge)
 * Negative K = saddle point (inner edge)
 */
export function gaussianCurvature(phi: number, localRadius: number): number {
  const R = TORUS_MAJOR_RADIUS;
  const r = localRadius;
  const cosPhi = Math.cos(phi);
  
  return cosPhi / (r * (R + r * cosPhi));
}

/**
 * Map curvature to a color gradient
 * Positive (convex) = warm colors
 * Negative (saddle) = cool colors
 */
export function curvatureToColor(curvature: number): [number, number, number] {
  // Normalize curvature to [-1, 1] range
  const maxK = 1 / (TORUS_BASE_MINOR_RADIUS * (TORUS_MAJOR_RADIUS - TORUS_BASE_MINOR_RADIUS));
  const normalized = Math.max(-1, Math.min(1, curvature / maxK));
  
  if (normalized > 0) {
    // Positive: blue to white
    return [normalized, normalized, 1];
  } else {
    // Negative: red to white
    const abs = Math.abs(normalized);
    return [1, abs, abs];
  }
}

/**
 * Generate vertices for a distorted torus mesh
 */
export function generateDistortedTorusMesh(
  polenDensityMap: Map<string, number>,
  thetaSegments: number = 64,
  phiSegments: number = 32
): {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
  colors: Float32Array;
} {
  const vertexCount = (thetaSegments + 1) * (phiSegments + 1);
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const colors = new Float32Array(vertexCount * 3);
  
  const R = TORUS_MAJOR_RADIUS;
  
  let vertexIndex = 0;
  
  for (let i = 0; i <= phiSegments; i++) {
    const phi = (i / phiSegments) * 2 * Math.PI;
    
    // Determine which season/row this phi corresponds to
    const phiNormalized = phi / (2 * Math.PI);
    const position = phiNormalized * 40;
    const seasonIndex = Math.floor(position / 8);
    const row = Math.floor(position % 8);
    
    for (let j = 0; j <= thetaSegments; j++) {
      const theta = (j / thetaSegments) * 2 * Math.PI;
      
      // Determine which column this theta corresponds to
      const thetaNormalized = theta / (2 * Math.PI);
      const col = Math.floor(thetaNormalized * 8) % 8;
      
      // Get density for this tile
      const tileKey = `${seasonIndex}-${row}-${col}`;
      const density = polenDensityMap.get(tileKey) || 0;
      const r = calculateLocalRadius(density);
      
      // Calculate position
      const x = (R + r * Math.cos(phi)) * Math.cos(theta);
      const y = (R + r * Math.cos(phi)) * Math.sin(theta);
      const z = r * Math.sin(phi);
      
      positions[vertexIndex * 3] = x;
      positions[vertexIndex * 3 + 1] = y;
      positions[vertexIndex * 3 + 2] = z;
      
      // Calculate normal (pointing outward from tube center)
      const nx = Math.cos(phi) * Math.cos(theta);
      const ny = Math.cos(phi) * Math.sin(theta);
      const nz = Math.sin(phi);
      
      normals[vertexIndex * 3] = nx;
      normals[vertexIndex * 3 + 1] = ny;
      normals[vertexIndex * 3 + 2] = nz;
      
      // UV coordinates
      uvs[vertexIndex * 2] = j / thetaSegments;
      uvs[vertexIndex * 2 + 1] = i / phiSegments;
      
      // Color based on curvature
      const K = gaussianCurvature(phi, r);
      const [cr, cg, cb] = curvatureToColor(K);
      colors[vertexIndex * 3] = cr;
      colors[vertexIndex * 3 + 1] = cg;
      colors[vertexIndex * 3 + 2] = cb;
      
      vertexIndex++;
    }
  }
  
  // Generate indices for triangles
  const indexCount = thetaSegments * phiSegments * 6;
  const indices = new Uint32Array(indexCount);
  let indexIndex = 0;
  
  for (let i = 0; i < phiSegments; i++) {
    for (let j = 0; j < thetaSegments; j++) {
      const a = i * (thetaSegments + 1) + j;
      const b = a + thetaSegments + 1;
      const c = a + 1;
      const d = b + 1;
      
      // First triangle
      indices[indexIndex++] = a;
      indices[indexIndex++] = b;
      indices[indexIndex++] = c;
      
      // Second triangle
      indices[indexIndex++] = c;
      indices[indexIndex++] = b;
      indices[indexIndex++] = d;
    }
  }
  
  return { positions, normals, uvs, indices, colors };
}

/**
 * Calculate the tile key from angular coordinates
 */
export function angularToTileKey(theta: number, phi: number): string {
  const col = Math.floor((theta / (2 * Math.PI)) * 8) % 8;
  const position = (phi / (2 * Math.PI)) * 40;
  const seasonIndex = Math.floor(position / 8) % 5;
  const row = Math.floor(position % 8);
  
  return `${seasonIndex}-${row}-${col}`;
}

/**
 * Get season from phi angle
 */
export function phiToSeason(phi: number): ManifoldSeason {
  const position = (phi / (2 * Math.PI)) * 40;
  const seasonIndex = Math.floor(position / 8) % 5;
  const seasons: ManifoldSeason[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
  return seasons[seasonIndex];
}

/**
 * Generate a smooth camera path along the torus for fly-through
 */
export function generateFlyThroughPath(
  numPoints: number = 200,
  orbitDistance: number = 6
): Array<[number, number, number]> {
  const path: Array<[number, number, number]> = [];
  
  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    const theta = t * 2 * Math.PI * 2; // Go around twice
    const phi = t * 2 * Math.PI;
    
    // Camera follows a path around the torus
    const x = orbitDistance * Math.cos(theta) * Math.cos(phi * 0.5);
    const y = orbitDistance * Math.sin(theta) * Math.cos(phi * 0.5);
    const z = orbitDistance * 0.5 * Math.sin(phi);
    
    path.push([x, y, z]);
  }
  
  return path;
}
