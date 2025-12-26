/**
 * Kähler Manifold Mathematics
 * 
 * Implements complex structure and symplectic form visualization
 * on the torus manifold with geometric prequantization states.
 * 
 * Based on: "Mathematical Manifolds and Mind Matter Models" - SSRN 4997735
 * Kähler Topologies and geometric prequantization
 */

// ============ TYPES ============

export interface ComplexCoordinate {
  z: { real: number; imag: number }; // Complex coordinate z = x + iy
  w: { real: number; imag: number }; // Second complex coordinate (for torus: z, w)
}

export interface KahlerMetric {
  gzz: number; // Metric component g_{z\bar{z}}
  gww: number; // Metric component g_{w\bar{w}}
  gzw: number; // Off-diagonal g_{z\bar{w}}
  curvature: number; // Kähler curvature (Ricci form)
}

export interface SymplecticForm {
  omega: number; // ω = ig_{i\bar{j}} dz^i ∧ d\bar{z}^j
  area: number; // Symplectic area element
  flux: number; // Magnetic flux through surface
}

export interface PrequantizationState {
  tileKey: string;
  phase: number; // Connection 1-form phase
  amplitude: number; // Wave function amplitude
  quantumNumber: number; // Discrete quantum level
  holonomyPhase: number; // Parallel transport phase
}

export interface KahlerVisualization {
  complexCoordinates: ComplexCoordinate[];
  metricField: KahlerMetric[];
  symplecticFlow: SymplecticForm[];
  prequantizationStates: PrequantizationState[];
  chernNumber: number; // Topological invariant
}

// ============ CONSTANTS ============

const PLANCK_CONSTANT = 1; // Scaled ℏ for our system
const TORUS_COMPLEX_MODULUS = { real: 0, imag: 1 }; // τ for complex torus structure

// ============ COMPLEX STRUCTURE ============

/**
 * Convert tile coordinates to complex coordinates on the torus
 * z = (col + i*row) / 8, w = e^{2πiτ} * z
 */
export function tileToComplexCoordinates(
  row: number,
  col: number
): ComplexCoordinate {
  // Primary complex coordinate
  const z = {
    real: col / 7,
    imag: row / 7
  };
  
  // Secondary coordinate via complex modulus τ
  // w = e^{2πiτ} * z for torus complex structure
  const tau = TORUS_COMPLEX_MODULUS;
  const expTau = {
    real: Math.cos(2 * Math.PI * tau.imag) * Math.exp(-2 * Math.PI * tau.real),
    imag: Math.sin(2 * Math.PI * tau.imag) * Math.exp(-2 * Math.PI * tau.real)
  };
  
  const w = {
    real: expTau.real * z.real - expTau.imag * z.imag,
    imag: expTau.real * z.imag + expTau.imag * z.real
  };
  
  return { z, w };
}

/**
 * Calculate complex modulus |z|² for a complex number
 */
function complexModulusSq(z: { real: number; imag: number }): number {
  return z.real * z.real + z.imag * z.imag;
}

/**
 * Complex multiplication
 */
function complexMultiply(
  a: { real: number; imag: number },
  b: { real: number; imag: number }
): { real: number; imag: number } {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real
  };
}

// ============ KÄHLER METRIC ============

/**
 * Calculate Kähler metric at a point
 * For flat torus: g_{z\bar{z}} = 1, g_{w\bar{w}} = |τ|²
 * With density-based deformation
 */
export function calculateKahlerMetric(
  coord: ComplexCoordinate,
  density: number = 1
): KahlerMetric {
  const tauModSq = complexModulusSq(TORUS_COMPLEX_MODULUS);
  
  // Base metric components (flat torus)
  const baseGzz = 1;
  const baseGww = tauModSq > 0 ? tauModSq : 1;
  
  // Density-based deformation (conformally flat)
  const deformationFactor = 1 + 0.3 * Math.log(1 + density);
  
  const gzz = baseGzz * deformationFactor;
  const gww = baseGww * deformationFactor;
  const gzw = 0.1 * density * Math.sin(coord.z.real * Math.PI); // Small off-diagonal
  
  // Kähler curvature (Ricci scalar for Kähler manifolds)
  // For flat torus it's 0, deformation introduces curvature
  const curvature = -Math.log(deformationFactor) / (gzz * gww - gzw * gzw);
  
  return { gzz, gww, gzw, curvature };
}

/**
 * Generate Kähler metric field across all tiles
 */
export function generateKahlerMetricField(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>
): Map<string, KahlerMetric> {
  const field = new Map<string, KahlerMetric>();
  
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    const coord = tileToComplexCoordinates(row, col);
    const density = densityMap.get(tile) || 1;
    field.set(tile, calculateKahlerMetric(coord, density));
  });
  
  return field;
}

// ============ SYMPLECTIC STRUCTURE ============

/**
 * Calculate symplectic form ω at a point
 * ω = (i/2) g_{i\bar{j}} dz^i ∧ d\bar{z}^j
 */
export function calculateSymplecticForm(
  metric: KahlerMetric,
  coord: ComplexCoordinate
): SymplecticForm {
  // Symplectic 2-form magnitude
  // ω = i(g_{zz̄} dz∧dz̄ + g_{ww̄} dw∧dw̄)
  const omega = metric.gzz + metric.gww;
  
  // Symplectic area element
  const area = omega / (2 * Math.PI);
  
  // Magnetic flux (integral of ω over unit cell)
  const flux = 2 * Math.PI * (metric.gzz * metric.gww - metric.gzw * metric.gzw);
  
  return { omega, area, flux };
}

/**
 * Generate symplectic flow field
 */
export function generateSymplecticFlow(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>
): Map<string, SymplecticForm> {
  const flow = new Map<string, SymplecticForm>();
  const metricField = generateKahlerMetricField(visitedTiles, densityMap);
  
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    const coord = tileToComplexCoordinates(row, col);
    const metric = metricField.get(tile)!;
    flow.set(tile, calculateSymplecticForm(metric, coord));
  });
  
  return flow;
}

// ============ GEOMETRIC PREQUANTIZATION ============

/**
 * Calculate prequantization line bundle connection
 * A = (i/2)(z d\bar{z} - \bar{z} dz) + density correction
 */
export function calculateConnection(
  coord: ComplexCoordinate,
  density: number = 1
): { az: number; aw: number } {
  // Connection 1-form components
  // A_z = (i/2) ∂K/∂z where K is Kähler potential
  const az = (coord.z.imag) / 2 + 0.1 * density * coord.z.real;
  const aw = (coord.w.imag) / 2 + 0.1 * density * coord.w.real;
  
  return { az, aw };
}

/**
 * Calculate prequantization state for a tile
 */
export function calculatePrequantizationState(
  tileKey: string,
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  journeyPath: Array<{ row: number; col: number }>
): PrequantizationState {
  const [row, col] = tileKey.split('-').map(Number);
  const coord = tileToComplexCoordinates(row, col);
  const density = densityMap.get(tileKey) || 1;
  
  // Connection phase from local geometry
  const connection = calculateConnection(coord, density);
  const phase = Math.atan2(connection.aw, connection.az);
  
  // Amplitude from visit frequency
  const visits = journeyPath.filter(p => `${p.row}-${p.col}` === tileKey).length;
  const amplitude = Math.sqrt(visits / Math.max(1, journeyPath.length));
  
  // Quantum number from Bohr-Sommerfeld quantization
  // n = (1/2π) ∮ A · dl
  const areaElement = density / (8 * 8); // Normalized area
  const quantumNumber = Math.round(areaElement * 2 * Math.PI / PLANCK_CONSTANT);
  
  // Holonomy phase from parallel transport around tile
  let holonomyPhase = 0;
  const neighbors = [
    [row, col + 1], [row + 1, col + 1], [row + 1, col], [row, col]
  ];
  neighbors.forEach(([r, c], idx) => {
    const nextIdx = (idx + 1) % 4;
    const [nr, nc] = neighbors[nextIdx];
    
    const currCoord = tileToComplexCoordinates(r, c);
    const nextCoord = tileToComplexCoordinates(nr, nc);
    
    // Connection contribution along edge
    const dz = { real: nextCoord.z.real - currCoord.z.real, imag: nextCoord.z.imag - currCoord.z.imag };
    const connCurr = calculateConnection(currCoord, density);
    holonomyPhase += connCurr.az * dz.real + connCurr.aw * dz.imag;
  });
  
  return {
    tileKey,
    phase: phase % (2 * Math.PI),
    amplitude,
    quantumNumber,
    holonomyPhase: holonomyPhase % (2 * Math.PI)
  };
}

/**
 * Generate prequantization states for all tiles
 */
export function generatePrequantizationStates(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  journeyPath: Array<{ row: number; col: number }>
): Map<string, PrequantizationState> {
  const states = new Map<string, PrequantizationState>();
  
  visitedTiles.forEach(tile => {
    states.set(tile, calculatePrequantizationState(tile, visitedTiles, densityMap, journeyPath));
  });
  
  return states;
}

// ============ CHERN NUMBER ============

/**
 * Calculate first Chern number (topological invariant)
 * c₁ = (1/2π) ∫ R where R is Ricci form
 */
export function calculateChernNumber(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>
): number {
  let chernIntegral = 0;
  
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    const coord = tileToComplexCoordinates(row, col);
    const density = densityMap.get(tile) || 1;
    const metric = calculateKahlerMetric(coord, density);
    
    // Ricci curvature contribution
    chernIntegral += metric.curvature / (64); // Normalized by grid size
  });
  
  // Chern number is integer (for proper manifolds)
  return Math.round(chernIntegral / (2 * Math.PI));
}

// ============ COMPLETE VISUALIZATION ============

/**
 * Generate complete Kähler visualization data
 */
export function generateKahlerVisualization(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  journeyPath: Array<{ row: number; col: number }>
): KahlerVisualization {
  const complexCoordinates: ComplexCoordinate[] = [];
  const metricField: KahlerMetric[] = [];
  const symplecticFlow: SymplecticForm[] = [];
  
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    const coord = tileToComplexCoordinates(row, col);
    const density = densityMap.get(tile) || 1;
    const metric = calculateKahlerMetric(coord, density);
    const symplectic = calculateSymplecticForm(metric, coord);
    
    complexCoordinates.push(coord);
    metricField.push(metric);
    symplecticFlow.push(symplectic);
  });
  
  const prequantizationStates = Array.from(
    generatePrequantizationStates(visitedTiles, densityMap, journeyPath).values()
  );
  
  const chernNumber = calculateChernNumber(visitedTiles, densityMap);
  
  return {
    complexCoordinates,
    metricField,
    symplecticFlow,
    prequantizationStates,
    chernNumber
  };
}

// ============ VISUALIZATION HELPERS ============

/**
 * Map Kähler curvature to color
 */
export function curvatureToColor(curvature: number): [number, number, number] {
  // Positive curvature (sphere-like): blue
  // Negative curvature (hyperbolic-like): red
  // Zero (flat): green
  
  const normalized = Math.tanh(curvature * 2); // Map to [-1, 1]
  
  if (normalized > 0) {
    return [0, 0.3 * (1 - normalized), normalized];
  } else {
    return [-normalized, 0.3 * (1 + normalized), 0];
  }
}

/**
 * Map prequantization phase to color
 */
export function phaseToColor(phase: number): [number, number, number] {
  // Use HSL-like mapping: phase → hue
  const hue = phase / (2 * Math.PI);
  
  const h = hue * 6;
  const i = Math.floor(h);
  const f = h - i;
  
  switch (i % 6) {
    case 0: return [1, f, 0];
    case 1: return [1 - f, 1, 0];
    case 2: return [0, 1, f];
    case 3: return [0, 1 - f, 1];
    case 4: return [f, 0, 1];
    default: return [1, 0, 1 - f];
  }
}

/**
 * Generate gradient vectors for symplectic flow visualization
 */
export function generateSymplecticVectors(
  visitedTiles: Set<string>,
  densityMap: Map<string, number>,
  torusProjection: (row: number, col: number) => [number, number, number]
): Array<{ start: [number, number, number]; end: [number, number, number]; magnitude: number }> {
  const vectors: Array<{ start: [number, number, number]; end: [number, number, number]; magnitude: number }> = [];
  const symplecticField = generateSymplecticFlow(visitedTiles, densityMap);
  
  visitedTiles.forEach(tile => {
    const [row, col] = tile.split('-').map(Number);
    const [x, y, z] = torusProjection(row, col);
    const symplectic = symplecticField.get(tile)!;
    
    // Symplectic gradient (Hamiltonian vector field direction)
    // J∇H where J is the complex structure
    const coord = tileToComplexCoordinates(row, col);
    const gradX = -coord.z.imag * symplectic.omega;
    const gradY = coord.z.real * symplectic.omega;
    const gradZ = 0.1 * symplectic.flux;
    
    const magnitude = Math.sqrt(gradX * gradX + gradY * gradY + gradZ * gradZ);
    const scale = 0.1 / (magnitude || 1);
    
    vectors.push({
      start: [x, y, z],
      end: [x + gradX * scale, y + gradY * scale, z + gradZ * scale],
      magnitude: symplectic.omega
    });
  });
  
  return vectors;
}

/**
 * Generate quantum level surfaces for prequantization visualization
 */
export function generateQuantumLevelSurfaces(
  prequantizationStates: PrequantizationState[],
  torusProjection: (row: number, col: number) => [number, number, number]
): Map<number, Array<{ position: [number, number, number]; amplitude: number; phase: number }>> {
  const levelSurfaces = new Map<number, Array<{ position: [number, number, number]; amplitude: number; phase: number }>>();
  
  prequantizationStates.forEach(state => {
    const [row, col] = state.tileKey.split('-').map(Number);
    const position = torusProjection(row, col);
    
    if (!levelSurfaces.has(state.quantumNumber)) {
      levelSurfaces.set(state.quantumNumber, []);
    }
    
    levelSurfaces.get(state.quantumNumber)!.push({
      position,
      amplitude: state.amplitude,
      phase: state.phase
    });
  });
  
  return levelSurfaces;
}
