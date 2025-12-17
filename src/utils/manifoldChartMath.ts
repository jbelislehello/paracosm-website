// Manifold Chart Mathematics for Position Map
// Provides homeomorphism calculations, chart transitions, and topological metrics

import { QuadrantPosition } from '@/types/trajectory';
import { RingLevel, RING_DEFINITIONS, RING_QUADRANT_TENDENCY } from './ringToleranceSystem';

// ============ COORDINATE SYSTEMS ============

// Chart φ₁: Shadow manifold cone projection → ℝ²
export function shadowChartProjection(
  position: QuadrantPosition,
  deformation: number = 0.5
): { u: number; v: number; curvature: number } {
  // Shadow exists on a cone-like manifold with apex at origin
  // Higher deformation = more "peaked" cone
  const r = Math.sqrt(position.x ** 2 + position.y ** 2);
  const theta = Math.atan2(position.y, position.x);
  
  // Cone projection with deformation
  const coneHeight = 1 - r * deformation;
  const u = r * Math.cos(theta) * coneHeight;
  const v = r * Math.sin(theta) * coneHeight;
  
  // Gaussian curvature at this point (negative for saddle regions)
  const curvature = -deformation / (1 + r * r);
  
  return { u, v, curvature };
}

// Chart φ₂: Higher Self manifold disk projection → ℍ² (half-plane)
export function higherSelfChartProjection(
  position: QuadrantPosition,
  attractionRadius: number = 0.8
): { u: number; v: number; potential: number } {
  // Higher Self exists on a disk manifold with attractor basin
  const r = Math.sqrt(position.x ** 2 + position.y ** 2);
  const theta = Math.atan2(position.y, position.x);
  
  // Disk projection (conformal mapping to half-plane)
  const scale = 2 * attractionRadius / (attractionRadius + r);
  const u = scale * position.x;
  const v = scale * position.y;
  
  // Potential field (gravitational basin)
  const potential = Math.exp(-r / attractionRadius);
  
  return { u, v, potential };
}

// Chart φ₃: Boundary chart for intersection zone → ℝ¹
export function boundaryChartProjection(
  shadowPos: QuadrantPosition,
  higherSelfPos: QuadrantPosition,
  t: number // parameter along boundary [0,1]
): { position: QuadrantPosition; tangent: { x: number; y: number }; normal: { x: number; y: number } } {
  // Interpolate along geodesic between manifolds
  const dx = higherSelfPos.x - shadowPos.x;
  const dy = higherSelfPos.y - shadowPos.y;
  const dist = Math.sqrt(dx ** 2 + dy ** 2);
  
  // Position on boundary curve (with curvature)
  const curveHeight = 0.3 * Math.sin(Math.PI * t); // Arc above straight line
  const tangentX = dx / dist;
  const tangentY = dy / dist;
  const normalX = -tangentY;
  const normalY = tangentX;
  
  const position: QuadrantPosition = {
    x: shadowPos.x + dx * t + normalX * curveHeight,
    y: shadowPos.y + dy * t + normalY * curveHeight
  };
  
  return {
    position,
    tangent: { x: tangentX, y: tangentY },
    normal: { x: normalX, y: normalY }
  };
}

// ============ ELLIPSE GEOMETRY ============

export interface EllipseDefinition {
  ring: RingLevel;
  semiMajor: number;
  semiMinor: number;
  rotation: number; // radians
  center: QuadrantPosition;
  color: string;
  name: string;
}

// Generate nested ellipses for positionality zones
export function generatePositionalityEllipses(
  ringStates: Array<{ ring: RingLevel; progress: number; patternDetected: boolean }>,
  shadowPosition: QuadrantPosition | null,
  higherSelfPosition: QuadrantPosition | null
): EllipseDefinition[] {
  const ellipses: EllipseDefinition[] = [];
  
  // Base sizes for each ring (normalized to -1 to 1 coordinate system)
  const baseSizes: Record<RingLevel, { major: number; minor: number }> = {
    1: { major: 0.4, minor: 0.35 },
    2: { major: 0.65, minor: 0.55 },
    3: { major: 0.85, minor: 0.75 },
    4: { major: 1.0, minor: 0.95 }
  };
  
  RING_DEFINITIONS.forEach((def, idx) => {
    const ringState = ringStates.find(s => s.ring === def.ring);
    const progress = ringState?.progress || 0;
    const isUnlocked = ringState?.patternDetected || ringState?.progress === 100;
    
    // Calculate dynamic size based on progress
    const sizeMultiplier = 0.8 + (progress / 100) * 0.2;
    const baseSize = baseSizes[def.ring];
    
    // Calculate rotation based on quadrant tendency and shadow position
    const tendency = RING_QUADRANT_TENDENCY[def.ring];
    let rotation = Math.atan2(tendency.pull.y, tendency.pull.x);
    
    // Adjust rotation toward shadow if exists
    if (shadowPosition) {
      const shadowAngle = Math.atan2(shadowPosition.y, shadowPosition.x);
      rotation = rotation * 0.7 + shadowAngle * 0.3;
    }
    
    ellipses.push({
      ring: def.ring,
      semiMajor: baseSize.major * sizeMultiplier,
      semiMinor: baseSize.minor * sizeMultiplier,
      rotation,
      center: { x: 0, y: 0 },
      color: def.color,
      name: def.name
    });
  });
  
  return ellipses;
}

// Point on ellipse parametric equation
export function ellipsePoint(
  ellipse: EllipseDefinition,
  t: number // parameter [0, 2π]
): QuadrantPosition {
  const cos = Math.cos(ellipse.rotation);
  const sin = Math.sin(ellipse.rotation);
  const x = ellipse.semiMajor * Math.cos(t);
  const y = ellipse.semiMinor * Math.sin(t);
  
  return {
    x: ellipse.center.x + x * cos - y * sin,
    y: ellipse.center.y + x * sin + y * cos
  };
}

// Check if point is inside ellipse
export function isInsideEllipse(
  point: QuadrantPosition,
  ellipse: EllipseDefinition
): boolean {
  const cos = Math.cos(-ellipse.rotation);
  const sin = Math.sin(-ellipse.rotation);
  const dx = point.x - ellipse.center.x;
  const dy = point.y - ellipse.center.y;
  
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  
  return (localX / ellipse.semiMajor) ** 2 + (localY / ellipse.semiMinor) ** 2 <= 1;
}

// ============ TOPOLOGICAL METRICS ============

export interface ManifoldMetrics {
  genus: number; // topological genus (handles)
  eulerCharacteristic: number;
  gaussianCurvature: number;
  meanCurvature: number;
  isOrientable: boolean;
}

// Calculate manifold metrics from visited tiles and connections
export function calculateManifoldMetrics(
  visitedTiles: Set<string>,
  connections: Array<{ source: string; target: string }>
): ManifoldMetrics {
  const V = visitedTiles.size; // vertices
  const E = connections.length; // edges
  
  // Count faces (cycles in the graph)
  // Simplified: assume each 4-tile square is a face
  let F = 0;
  const tileArray = Array.from(visitedTiles);
  for (let i = 0; i < tileArray.length; i++) {
    const [r1, c1] = tileArray[i].split('-').map(Number);
    // Check if forms a cycle with neighbors
    const hasRight = visitedTiles.has(`${r1}-${c1 + 1}`);
    const hasDown = visitedTiles.has(`${r1 + 1}-${c1}`);
    const hasDiag = visitedTiles.has(`${r1 + 1}-${c1 + 1}`);
    if (hasRight && hasDown && hasDiag) F++;
  }
  
  // Euler characteristic: χ = V - E + F
  const eulerCharacteristic = V - E + F;
  
  // For orientable surfaces: χ = 2 - 2g (genus)
  const genus = Math.max(0, Math.floor((2 - eulerCharacteristic) / 2));
  
  // Approximate curvatures based on structure
  const density = V / 64;
  const connectivity = E > 0 ? E / V : 0;
  
  const gaussianCurvature = (1 - density) * 0.5 - connectivity * 0.3;
  const meanCurvature = (density - 0.5) * 0.4;
  
  return {
    genus,
    eulerCharacteristic,
    gaussianCurvature,
    meanCurvature,
    isOrientable: genus < 2 // Simplification
  };
}

// ============ MANIFOLD TRANSFORMATIONS ============

// Möbius transformation for shadow ↔ higher self connection
export function mobiusTransform(
  z: QuadrantPosition,
  a: QuadrantPosition,
  b: QuadrantPosition,
  c: QuadrantPosition,
  d: QuadrantPosition
): QuadrantPosition {
  // Möbius: f(z) = (az + b) / (cz + d)
  // Using complex number arithmetic
  const numReal = a.x * z.x - a.y * z.y + b.x;
  const numImag = a.x * z.y + a.y * z.x + b.y;
  const denReal = c.x * z.x - c.y * z.y + d.x;
  const denImag = c.x * z.y + c.y * z.x + d.y;
  
  const denMagSq = denReal ** 2 + denImag ** 2;
  if (denMagSq < 0.0001) return z; // Avoid singularity
  
  return {
    x: (numReal * denReal + numImag * denImag) / denMagSq,
    y: (numImag * denReal - numReal * denImag) / denMagSq
  };
}

// Klein bottle self-intersection visualization points
export function kleinBottlePath(t: number): { x: number; y: number; z: number } {
  // Parametric Klein bottle with t ∈ [0, 2π]
  const u = t;
  const v = t * 2;
  
  const r = 0.4;
  const R = 1;
  
  const x = (R + r * Math.cos(u)) * Math.cos(v);
  const y = (R + r * Math.cos(u)) * Math.sin(v);
  const z = r * Math.sin(u) * (1 + Math.cos(v) / 2);
  
  return { x: x * 0.5, y: y * 0.5, z: z * 0.3 };
}

// ============ TRAJECTORY MATHEMATICS ============

export interface TrajectoryVector {
  position: QuadrantPosition;
  velocity: QuadrantPosition;
  acceleration: QuadrantPosition;
}

// Calculate velocity from trajectory history
export function calculateTrajectoryVelocity(
  history: Array<{ position: QuadrantPosition; timestamp: number }>
): QuadrantPosition {
  if (history.length < 2) return { x: 0, y: 0 };
  
  // Use last 5 points for smoothing
  const recent = history.slice(-5);
  let vx = 0, vy = 0;
  
  for (let i = 1; i < recent.length; i++) {
    const dt = Math.max(1, recent[i].timestamp - recent[i - 1].timestamp);
    vx += (recent[i].position.x - recent[i - 1].position.x) / dt;
    vy += (recent[i].position.y - recent[i - 1].position.y) / dt;
  }
  
  const n = recent.length - 1;
  return { x: vx / n, y: vy / n };
}

// Extrapolate future positions
export function extrapolatePath(
  current: QuadrantPosition,
  velocity: QuadrantPosition,
  steps: number,
  damping: number = 0.9
): QuadrantPosition[] {
  const path: QuadrantPosition[] = [current];
  let vx = velocity.x;
  let vy = velocity.y;
  let x = current.x;
  let y = current.y;
  
  for (let i = 0; i < steps; i++) {
    x += vx;
    y += vy;
    vx *= damping;
    vy *= damping;
    
    // Clamp to bounds
    x = Math.max(-1, Math.min(1, x));
    y = Math.max(-1, Math.min(1, y));
    
    path.push({ x, y });
  }
  
  return path;
}

// Find intersection point between trajectory and attractor basin
export function findManifoldIntersection(
  trajectory: QuadrantPosition[],
  attractorCenter: QuadrantPosition,
  attractorRadius: number
): { point: QuadrantPosition; time: number; confidence: number } | null {
  for (let t = 0; t < trajectory.length; t++) {
    const pos = trajectory[t];
    const dx = pos.x - attractorCenter.x;
    const dy = pos.y - attractorCenter.y;
    const dist = Math.sqrt(dx ** 2 + dy ** 2);
    
    if (dist <= attractorRadius) {
      // Calculate confidence based on trajectory momentum
      const remainingMomentum = (trajectory.length - t) / trajectory.length;
      return {
        point: pos,
        time: t,
        confidence: Math.min(1, remainingMomentum + (1 - dist / attractorRadius) * 0.5)
      };
    }
  }
  
  return null;
}

// Generate convergence spiral between two points
export function generateConvergenceSpiralPoints(
  start: QuadrantPosition,
  end: QuadrantPosition,
  turns: number = 2,
  segments: number = 50
): QuadrantPosition[] {
  const points: QuadrantPosition[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * turns * Math.PI * 2;
    const radius = (1 - t) * 0.2; // Spiral inward
    
    // Linear interpolation with spiral offset
    const baseX = start.x + (end.x - start.x) * t;
    const baseY = start.y + (end.y - start.y) * t;
    
    points.push({
      x: baseX + Math.cos(angle) * radius,
      y: baseY + Math.sin(angle) * radius
    });
  }
  
  return points;
}
