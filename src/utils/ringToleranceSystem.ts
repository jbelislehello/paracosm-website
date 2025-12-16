// Ring-Tolerance System for Calm Magic Board
// Maps 4 expansion rings to pattern types and navigation constraints
// Philosophy: "Tolerance without wisdom hinders innovation"

import { PatternType, DetectedPattern, detectPatterns } from './patternDetection';
import { ToleranceZone } from '@/types/journal-expansion';

export type RingLevel = 1 | 2 | 3 | 4;

export interface RingDefinition {
  ring: RingLevel;
  name: string;
  patternType: PatternType;
  tiles: string[]; // Tile keys for this ring
  color: string;
  icon: string;
  unlockThreshold: number; // Percentage of ring tiles needed to detect pattern
  wisdom: string;
  zone: ToleranceZone | 'integrator';
}

// Define the 4 expansion rings with their tile mappings
export const RING_DEFINITIONS: RingDefinition[] = [
  {
    ring: 1,
    name: 'Inner Core',
    patternType: 'trigram',
    tiles: generateRingTiles(1), // Central 4×4 (16 tiles)
    color: 'hsl(142 71% 45%)', // Green
    icon: '☰',
    unlockThreshold: 0.75,
    wisdom: 'Ground your tolerance in triangular wisdom',
    zone: 'inner'
  },
  {
    ring: 2,
    name: 'Stretch Zone',
    patternType: 'hexagram',
    tiles: generateRingTiles(2), // 6×6 ring (20 tiles)
    color: 'hsl(217 91% 60%)', // Blue
    icon: '☯',
    unlockThreshold: 0.6,
    wisdom: 'Hexagram echoes require stretch capacity',
    zone: 'stretch'
  },
  {
    ring: 3,
    name: 'Edge Zone',
    patternType: 'geometric',
    tiles: generateRingTiles(3), // 8×8 outer (24 tiles excluding corners)
    color: 'hsl(38 92% 50%)', // Amber
    icon: '◇',
    unlockThreshold: 0.5,
    wisdom: 'Geometric patterns emerge at boundaries',
    zone: 'outer'
  },
  {
    ring: 4,
    name: 'Integrator',
    patternType: 'sequence',
    tiles: ['0-0', '0-7', '7-0', '7-7'], // 4 corner anchors
    color: 'hsl(280 70% 50%)', // Purple
    icon: '✧',
    unlockThreshold: 1.0, // All 4 corners required
    wisdom: 'The corners anchor infinite patterns',
    zone: 'integrator'
  }
];

// Generate tiles for each ring
function generateRingTiles(ring: RingLevel): string[] {
  const tiles: string[] = [];
  
  switch (ring) {
    case 1: // Inner Core: central 4×4 (rows 2-5, cols 2-5)
      for (let row = 2; row <= 5; row++) {
        for (let col = 2; col <= 5; col++) {
          tiles.push(`${row}-${col}`);
        }
      }
      break;
      
    case 2: // Stretch Zone: 6×6 ring around center (rows 1-6, cols 1-6, excluding inner)
      for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= 6; col++) {
          // Exclude inner 4×4
          if (row < 2 || row > 5 || col < 2 || col > 5) {
            tiles.push(`${row}-${col}`);
          }
        }
      }
      break;
      
    case 3: // Edge Zone: outer ring (full 8×8 minus inner rings, excluding corners)
      // Top and bottom rows (excluding corners)
      for (let col = 1; col <= 6; col++) {
        tiles.push(`0-${col}`);
        tiles.push(`7-${col}`);
      }
      // Left and right columns (excluding corners and already counted rows)
      for (let row = 1; row <= 6; row++) {
        tiles.push(`${row}-0`);
        tiles.push(`${row}-7`);
      }
      break;
      
    case 4: // Integrator: 4 corners
      tiles.push('0-0', '0-7', '7-0', '7-7');
      break;
  }
  
  return tiles;
}

// Get ring level for a specific tile
export function getTileRing(row: number, col: number): RingLevel {
  const key = `${row}-${col}`;
  
  // Check corners first (Ring 4)
  if (['0-0', '0-7', '7-0', '7-7'].includes(key)) {
    return 4;
  }
  
  // Check if in inner core (Ring 1)
  if (row >= 2 && row <= 5 && col >= 2 && col <= 5) {
    return 1;
  }
  
  // Check if in stretch zone (Ring 2)
  if (row >= 1 && row <= 6 && col >= 1 && col <= 6) {
    return 2;
  }
  
  // Otherwise edge zone (Ring 3)
  return 3;
}

// Check if a tile is accessible based on current unlocked ring
export function canAccessTile(row: number, col: number, currentRing: RingLevel): boolean {
  const tileRing = getTileRing(row, col);
  return tileRing <= currentRing;
}

// Get ring status (unlocked/in-progress/locked)
export type RingStatus = 'unlocked' | 'in-progress' | 'locked';

export interface RingState {
  ring: RingLevel;
  status: RingStatus;
  tilesVisited: number;
  tilesTotal: number;
  progress: number; // 0-100
  patternDetected: boolean;
}

// Calculate ring states based on visited tiles
export function calculateRingStates(visitedTiles: Set<string>, unlockedRing: RingLevel): RingState[] {
  return RING_DEFINITIONS.map(def => {
    const tilesVisited = def.tiles.filter(t => visitedTiles.has(t)).length;
    const tilesTotal = def.tiles.length;
    const progress = Math.round((tilesVisited / tilesTotal) * 100);
    
    let status: RingStatus;
    if (def.ring <= unlockedRing) {
      status = progress >= def.unlockThreshold * 100 ? 'unlocked' : 'in-progress';
    } else if (def.ring === unlockedRing + 1) {
      status = 'in-progress';
    } else {
      status = 'locked';
    }
    
    // Check if pattern is detected for this ring
    const patternDetected = detectRingPattern(visitedTiles, def.ring) !== null;
    
    return {
      ring: def.ring,
      status: patternDetected ? 'unlocked' : status,
      tilesVisited,
      tilesTotal,
      progress,
      patternDetected
    };
  });
}

// Detect pattern specific to a ring
export function detectRingPattern(visitedTiles: Set<string>, ring: RingLevel): DetectedPattern | null {
  const ringDef = RING_DEFINITIONS.find(d => d.ring === ring);
  if (!ringDef) return null;
  
  // Get tiles in this ring that are visited
  const ringVisited = new Set(ringDef.tiles.filter(t => visitedTiles.has(t)));
  
  // Check threshold
  if (ringVisited.size < ringDef.tiles.length * ringDef.unlockThreshold) {
    return null;
  }
  
  // Detect patterns specific to this ring's type
  const allPatterns = detectPatterns(visitedTiles, 0); // No threshold for ring-specific detection
  return allPatterns.find(p => p.type === ringDef.patternType) || null;
}

// Get current unlocked ring based on detected patterns
export function getCurrentUnlockedRing(visitedTiles: Set<string>): RingLevel {
  let unlockedRing: RingLevel = 1; // Always start with Ring 1 accessible
  
  for (let ring = 1; ring <= 4; ring++) {
    const pattern = detectRingPattern(visitedTiles, ring as RingLevel);
    if (pattern) {
      unlockedRing = Math.min(ring + 1, 4) as RingLevel;
    } else {
      break; // Stop at first ring without pattern
    }
  }
  
  return unlockedRing;
}

// Map ring to tolerance zone
export function ringToToleranceZone(ring: RingLevel): ToleranceZone {
  switch (ring) {
    case 1: return 'inner';
    case 2: return 'stretch';
    case 3:
    case 4: return 'outer';
    default: return 'inner';
  }
}

// Export ring visual config for MinimalistTileMatrix
export const RING_VISUAL_CONFIG = RING_DEFINITIONS.map(def => ({
  ring: def.ring,
  name: def.name,
  color: def.color,
  icon: def.icon,
  wisdom: def.wisdom,
  patternType: def.patternType
}));
