import { useMemo } from 'react';
import { QuadrantPosition } from '@/types/trajectory';

export interface GravitationalMass {
  position: { x: number; y: number };
  mass: number;
  type: 'shadow' | 'higherSelf' | 'visited' | 'current';
  label?: string;
}

export interface ForceVector {
  x: number;
  y: number;
  magnitude: number;
}

export interface GravityFieldPoint {
  x: number;
  y: number;
  potential: number;
  force: ForceVector;
}

export interface ConsciousnessContour {
  threshold: number;
  points: Array<{ x: number; y: number }>;
  isThresholdLine: boolean;
}

// Gravitational constant (adjustable for visual effect)
const G = 0.15;

// Calculate gravitational force from one mass to a point
function calculateForce(
  point: { x: number; y: number },
  mass: GravitationalMass
): ForceVector {
  const dx = mass.position.x - point.x;
  const dy = mass.position.y - point.y;
  const distSq = Math.max(0.01, dx * dx + dy * dy);
  const dist = Math.sqrt(distSq);
  
  const forceMag = (G * mass.mass) / distSq;
  
  return {
    x: (dx / dist) * forceMag,
    y: (dy / dist) * forceMag,
    magnitude: forceMag,
  };
}

// Calculate gravitational potential at a point
function calculatePotential(
  point: { x: number; y: number },
  masses: GravitationalMass[]
): number {
  return masses.reduce((sum, mass) => {
    const dx = mass.position.x - point.x;
    const dy = mass.position.y - point.y;
    const dist = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));
    return sum - (G * mass.mass) / dist;
  }, 0);
}

// Generate consciousness gradient contours
function generateContours(
  masses: GravitationalMass[],
  resolution: number,
  thresholdValue: number
): ConsciousnessContour[] {
  const contours: ConsciousnessContour[] = [];
  const levels = [0.3, 0.5, 0.7, thresholdValue, 0.9];
  
  levels.forEach(level => {
    const points: Array<{ x: number; y: number }> = [];
    
    // Sample points in a circular pattern around each significant mass
    masses.forEach(mass => {
      if (mass.mass > 0.3) {
        const baseRadius = mass.mass * (1 - level) * 0.8;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
          points.push({
            x: mass.position.x + Math.cos(angle) * baseRadius,
            y: mass.position.y + Math.sin(angle) * baseRadius,
          });
        }
      }
    });
    
    if (points.length > 0) {
      contours.push({
        threshold: level,
        points,
        isThresholdLine: Math.abs(level - thresholdValue) < 0.05,
      });
    }
  });
  
  return contours;
}

export interface EntanglementLine {
  from: { row: number; col: number; x: number; y: number };
  to: { row: number; col: number; x: number; y: number };
  strength: number;
  pulsePhase: number;
}

export function useGravitationalField(
  currentPosition: { row: number; col: number } | null,
  shadowPosition: QuadrantPosition | null,
  higherSelfPosition: QuadrantPosition | null,
  visitedTiles: Set<string>,
  polenDensity: Map<string, number>,
  weavingConnections: Array<{
    sourceRow: number;
    sourceCol: number;
    targetRow: number;
    targetCol: number;
    strength: number;
  }>,
  consciousnessThreshold: number = 0.7
) {
  // Convert tile position to normalized coordinates (-1 to 1)
  const tileToCoord = (row: number, col: number): { x: number; y: number } => ({
    x: (col / 7) * 2 - 1,
    y: (row / 7) * 2 - 1,
  });

  // Build gravitational masses from all sources
  const masses = useMemo((): GravitationalMass[] => {
    const result: GravitationalMass[] = [];
    
    // Shadow as primary attractor (vortex)
    if (shadowPosition) {
      result.push({
        position: shadowPosition,
        mass: 1.5, // Strongest gravitational pull
        type: 'shadow',
        label: 'Shadow Self',
      });
    }
    
    // Higher Self as beacon (repulsive at close range, attractive at distance)
    if (higherSelfPosition) {
      result.push({
        position: higherSelfPosition,
        mass: 1.2,
        type: 'higherSelf',
        label: 'Higher Self',
      });
    }
    
    // Current position
    if (currentPosition) {
      const coord = tileToCoord(currentPosition.row, currentPosition.col);
      result.push({
        position: coord,
        mass: 0.8,
        type: 'current',
        label: 'You Are Here',
      });
    }
    
    // Visited tiles as smaller masses (scaled by polen density)
    visitedTiles.forEach(key => {
      const [row, col] = key.split('-').map(Number);
      const density = polenDensity.get(key) || 1;
      const coord = tileToCoord(row, col);
      
      // Skip if it's the current position
      if (currentPosition && row === currentPosition.row && col === currentPosition.col) {
        return;
      }
      
      result.push({
        position: coord,
        mass: 0.2 + density * 0.15, // Scale mass by fragment density
        type: 'visited',
      });
    });
    
    return result;
  }, [currentPosition, shadowPosition, higherSelfPosition, visitedTiles, polenDensity]);

  // Generate field grid for visualization
  const fieldGrid = useMemo((): GravityFieldPoint[][] => {
    const resolution = 20;
    const grid: GravityFieldPoint[][] = [];
    
    for (let i = 0; i <= resolution; i++) {
      const row: GravityFieldPoint[] = [];
      for (let j = 0; j <= resolution; j++) {
        const x = (j / resolution) * 2 - 1;
        const y = (i / resolution) * 2 - 1;
        const point = { x, y };
        
        // Calculate combined force from all masses
        const totalForce = masses.reduce(
          (acc, mass) => {
            const f = calculateForce(point, mass);
            return {
              x: acc.x + f.x,
              y: acc.y + f.y,
              magnitude: acc.magnitude + f.magnitude,
            };
          },
          { x: 0, y: 0, magnitude: 0 }
        );
        
        const potential = calculatePotential(point, masses);
        
        row.push({
          x,
          y,
          potential,
          force: totalForce,
        });
      }
      grid.push(row);
    }
    
    return grid;
  }, [masses]);

  // Generate consciousness contours
  const contours = useMemo((): ConsciousnessContour[] => {
    return generateContours(masses, 20, consciousnessThreshold);
  }, [masses, consciousnessThreshold]);

  // Calculate entanglement lines from weaving connections
  const entanglementLines = useMemo((): EntanglementLine[] => {
    return weavingConnections.map((conn, idx) => {
      const from = tileToCoord(conn.sourceRow, conn.sourceCol);
      const to = tileToCoord(conn.targetRow, conn.targetCol);
      
      return {
        from: { row: conn.sourceRow, col: conn.sourceCol, ...from },
        to: { row: conn.targetRow, col: conn.targetCol, ...to },
        strength: conn.strength,
        pulsePhase: idx * 0.3, // Stagger pulse animations
      };
    });
  }, [weavingConnections]);

  // Calculate distance and direction from shadow to higher self
  const prophesyGap = useMemo(() => {
    if (!shadowPosition || !higherSelfPosition) return null;
    
    const dx = higherSelfPosition.x - shadowPosition.x;
    const dy = higherSelfPosition.y - shadowPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    return { dx, dy, distance, angle };
  }, [shadowPosition, higherSelfPosition]);

  // Get force at specific point
  const getForceAt = (x: number, y: number): ForceVector => {
    const point = { x, y };
    return masses.reduce(
      (acc, mass) => {
        const f = calculateForce(point, mass);
        return {
          x: acc.x + f.x,
          y: acc.y + f.y,
          magnitude: acc.magnitude + f.magnitude,
        };
      },
      { x: 0, y: 0, magnitude: 0 }
    );
  };

  return {
    masses,
    fieldGrid,
    contours,
    entanglementLines,
    prophesyGap,
    getForceAt,
    tileToCoord,
  };
}
