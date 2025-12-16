// Pattern Detection Utility for Calm Magic Board
// Detects trigrams, hexagrams, and geometric patterns from visited tiles

import { TRIGRAMS, Trigram, HEXAGRAMS, Hexagram, getTrigramByLines } from '@/data/cosmologicalMapping';

export type PatternType = 'trigram' | 'hexagram' | 'geometric' | 'sequence';

export interface DetectedPattern {
  id: string;
  type: PatternType;
  name: string;
  icon: string;
  tiles: string[]; // tile keys forming the pattern (e.g., "0-0", "1-0")
  timestamp: Date;
  
  // Trigram-specific
  trigramData?: {
    trigram: Trigram;
    formation: 'vertical' | 'horizontal' | 'diagonal';
    position: { startRow: number; startCol: number };
  };
  
  // Hexagram-specific
  hexagramData?: {
    hexagram: Hexagram;
    formationType: 'column' | 'echo' | 'transformation';
    resonanceStrength: number;
  };
  
  meaning: string;
  keywords: string[];
  insight: string;
  howToCreate?: string;
}

export interface PatternHistoryEntry {
  pattern: DetectedPattern;
  discoveredAt: Date;
  tilesAtDiscovery: number;
  seasonAtDiscovery: string;
  userReflection?: string;
}

// Trigram detection - vertical (3 consecutive rows, same column)
export const detectVerticalTrigrams = (visitedTiles: Set<string>): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];
  
  for (let col = 0; col < 8; col++) {
    for (let startRow = 0; startRow <= 5; startRow++) {
      const lines: [boolean, boolean, boolean] = [
        visitedTiles.has(`${startRow}-${col}`),
        visitedTiles.has(`${startRow + 1}-${col}`),
        visitedTiles.has(`${startRow + 2}-${col}`),
      ];
      
      const trigram = getTrigramByLines(lines);
      if (trigram) {
        patterns.push({
          id: `trigram-v-${col}-${startRow}-${trigram.name}`,
          type: 'trigram',
          name: `${trigram.name} Trigram`,
          icon: trigram.symbol,
          tiles: [`${startRow}-${col}`, `${startRow + 1}-${col}`, `${startRow + 2}-${col}`],
          timestamp: new Date(),
          trigramData: {
            trigram,
            formation: 'vertical',
            position: { startRow, startCol: col }
          },
          meaning: `${trigram.quality} energy emerging through ${trigram.element}`,
          keywords: [trigram.quality, trigram.element, trigram.direction, trigram.family],
          insight: `The ${trigram.name} (${trigram.chinese}) emerges vertically - ${trigram.quality} force ascending through the ${trigram.element} element. Associated with ${trigram.family} and the ${trigram.bodyPart}.`,
          howToCreate: `Visit 3 consecutive tiles in a column with pattern: ${lines.map(l => l ? '▬' : '- -').join(', ')} (bottom to top)`
        });
      }
    }
  }
  return patterns;
};

// Trigram detection - horizontal (3 consecutive columns, same row)
export const detectHorizontalTrigrams = (visitedTiles: Set<string>): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let startCol = 0; startCol <= 5; startCol++) {
      const lines: [boolean, boolean, boolean] = [
        visitedTiles.has(`${row}-${startCol}`),
        visitedTiles.has(`${row}-${startCol + 1}`),
        visitedTiles.has(`${row}-${startCol + 2}`),
      ];
      
      const trigram = getTrigramByLines(lines);
      if (trigram) {
        patterns.push({
          id: `trigram-h-${row}-${startCol}-${trigram.name}`,
          type: 'trigram',
          name: `${trigram.name} Trigram`,
          icon: trigram.symbol,
          tiles: [`${row}-${startCol}`, `${row}-${startCol + 1}`, `${row}-${startCol + 2}`],
          timestamp: new Date(),
          trigramData: {
            trigram,
            formation: 'horizontal',
            position: { startRow: row, startCol }
          },
          meaning: `${trigram.quality} energy flowing horizontally through ${trigram.element}`,
          keywords: [trigram.quality, trigram.element, trigram.season],
          insight: `The ${trigram.name} (${trigram.chinese}) manifests horizontally - ${trigram.quality} force expanding across the ${trigram.direction} direction.`,
          howToCreate: `Visit 3 consecutive tiles in a row with pattern: ${lines.map(l => l ? '▬' : '- -').join(', ')} (left to right)`
        });
      }
    }
  }
  return patterns;
};

// Trigram detection - diagonal
export const detectDiagonalTrigrams = (visitedTiles: Set<string>): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];
  
  // Diagonal down-right
  for (let startRow = 0; startRow <= 5; startRow++) {
    for (let startCol = 0; startCol <= 5; startCol++) {
      const lines: [boolean, boolean, boolean] = [
        visitedTiles.has(`${startRow}-${startCol}`),
        visitedTiles.has(`${startRow + 1}-${startCol + 1}`),
        visitedTiles.has(`${startRow + 2}-${startCol + 2}`),
      ];
      
      const trigram = getTrigramByLines(lines);
      if (trigram) {
        patterns.push({
          id: `trigram-d-${startRow}-${startCol}-${trigram.name}`,
          type: 'trigram',
          name: `${trigram.name} Trigram`,
          icon: trigram.symbol,
          tiles: [`${startRow}-${startCol}`, `${startRow + 1}-${startCol + 1}`, `${startRow + 2}-${startCol + 2}`],
          timestamp: new Date(),
          trigramData: {
            trigram,
            formation: 'diagonal',
            position: { startRow, startCol }
          },
          meaning: `${trigram.quality} energy spiraling through ${trigram.element}`,
          keywords: [trigram.quality, trigram.element, 'diagonal', 'transformation'],
          insight: `The ${trigram.name} (${trigram.chinese}) spirals diagonally - a transformative ${trigram.quality} movement bridging dimensions.`,
          howToCreate: `Visit 3 diagonal tiles (↘) with pattern: ${lines.map(l => l ? '▬' : '- -').join(', ')}`
        });
      }
    }
  }
  
  return patterns;
};

// Hexagram detection - column pattern (6 tiles read as hexagram lines)
export const detectColumnHexagram = (visitedTiles: Set<string>, column: number): DetectedPattern | null => {
  const lines: boolean[] = [];
  const tiles: string[] = [];
  
  for (let row = 0; row < 6; row++) {
    const key = `${row}-${column}`;
    lines.push(visitedTiles.has(key));
    tiles.push(key);
  }
  
  // Find matching hexagram
  const hexagram = HEXAGRAMS.find(h => 
    h.lines.length === 6 && h.lines.every((line, i) => line === lines[i])
  );
  
  if (hexagram) {
    return {
      id: `hexagram-col-${column}-${hexagram.number}`,
      type: 'hexagram',
      name: `${hexagram.name} (${hexagram.chineseName})`,
      icon: '䷀',
      tiles,
      timestamp: new Date(),
      hexagramData: {
        hexagram,
        formationType: 'column',
        resonanceStrength: 1.0,
      },
      meaning: hexagram.meaning,
      keywords: hexagram.keywords,
      insight: `Hexagram ${hexagram.number} - ${hexagram.name} (${hexagram.chineseName}) emerges from column ${column + 1}. ${hexagram.meaning}. Upper: ${hexagram.upperTrigram}, Lower: ${hexagram.lowerTrigram}.`,
      howToCreate: `Visit tiles in column ${column + 1} matching pattern: ${lines.map(l => l ? '▬' : '- -').join(', ')} (bottom to top)`
    };
  }
  return null;
};

// Hexagram echo detection (complementary pairs)
export const detectHexagramEcho = (visitedTiles: Set<string>): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];
  
  // Get hexagram numbers from visited tiles
  const visitedArray = Array.from(visitedTiles);
  const hexagramNumbers = visitedArray.map(t => {
    const [row, col] = t.split('-').map(Number);
    const tileId = row * 8 + col + 1;
    return tileId <= 64 ? tileId : null;
  }).filter((n): n is number => n !== null);
  
  // Complementary pairs in I Ching
  const complementaryPairs: [number, number, string][] = [
    [1, 2, 'Creative/Receptive'],
    [11, 12, 'Peace/Standstill'],
    [29, 30, 'Water/Fire'],
    [31, 32, 'Influence/Duration'],
    [41, 42, 'Decrease/Increase'],
    [63, 64, 'Completion/Before Completion'],
  ];
  
  for (const [a, b, name] of complementaryPairs) {
    if (hexagramNumbers.includes(a) && hexagramNumbers.includes(b)) {
      const hexA = HEXAGRAMS.find(h => h.number === a);
      const hexB = HEXAGRAMS.find(h => h.number === b);
      
      if (hexA && hexB) {
        patterns.push({
          id: `hexagram-echo-${a}-${b}`,
          type: 'hexagram',
          name: `Hexagram Echo: ${name}`,
          icon: '☯',
          tiles: visitedArray.filter(t => {
            const [row, col] = t.split('-').map(Number);
            const tileId = row * 8 + col + 1;
            return tileId === a || tileId === b;
          }),
          timestamp: new Date(),
          hexagramData: {
            hexagram: hexA,
            formationType: 'echo',
            resonanceStrength: 0.9,
          },
          meaning: `The ${hexA.name} and ${hexB.name} form a complementary pair, representing polarity and balance.`,
          keywords: ['duality', 'balance', 'complementary', ...hexA.keywords, ...hexB.keywords],
          insight: `${hexA.name} (${hexA.chineseName}) and ${hexB.name} (${hexB.chineseName}) resonate together, creating a harmonious echo of opposites.`,
          howToCreate: `Visit tiles ${a} and ${b} during your journey`
        });
      }
    }
  }
  
  return patterns;
};

// Geometric pattern definitions
interface GeometricPatternDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  howToCreate: string;
  minTiles: number;
  detect: (visitedTiles: Set<string>) => string[] | null;
  meaning: string;
  keywords: string[];
}

const GEOMETRIC_PATTERNS: GeometricPatternDef[] = [
  {
    id: 'cross',
    name: 'The Cross',
    icon: '✚',
    description: 'A complete row AND column intersection',
    howToCreate: 'Complete all 8 tiles in any row, plus all 8 tiles in any column',
    minTiles: 15,
    detect: (visitedTiles) => {
      // Check if any row is complete
      for (let row = 0; row < 8; row++) {
        const rowComplete = Array.from({ length: 8 }).every((_, col) => visitedTiles.has(`${row}-${col}`));
        if (rowComplete) {
          // Check if any column is complete
          for (let col = 0; col < 8; col++) {
            const colComplete = Array.from({ length: 8 }).every((_, r) => visitedTiles.has(`${r}-${col}`));
            if (colComplete) {
              const tiles = [
                ...Array.from({ length: 8 }, (_, c) => `${row}-${c}`),
                ...Array.from({ length: 8 }, (_, r) => `${r}-${col}`).filter(t => !t.startsWith(`${row}-`))
              ];
              return tiles;
            }
          }
        }
      }
      return null;
    },
    meaning: 'Integration of horizontal (time/longevity) and vertical (depth/velocity) dimensions',
    keywords: ['integration', 'crossroads', 'axis', 'meeting point']
  },
  {
    id: 'tower',
    name: 'The Tower',
    icon: '│',
    description: '6+ tiles in a single column forming a hexagram',
    howToCreate: 'Focus exploration on one column, visiting at least 6 of its 8 tiles',
    minTiles: 6,
    detect: (visitedTiles) => {
      for (let col = 0; col < 8; col++) {
        const colTiles = Array.from({ length: 8 }, (_, row) => `${row}-${col}`)
          .filter(t => visitedTiles.has(t));
        if (colTiles.length >= 6) {
          return colTiles;
        }
      }
      return null;
    },
    meaning: 'Depth of understanding in one domain - vertical mastery',
    keywords: ['depth', 'mastery', 'vertical', 'tower']
  },
  {
    id: 'bridge',
    name: 'The Bridge',
    icon: '─',
    description: '6+ tiles in a single row',
    howToCreate: 'Focus exploration on one row, visiting at least 6 tiles',
    minTiles: 6,
    detect: (visitedTiles) => {
      for (let row = 0; row < 8; row++) {
        const rowTiles = Array.from({ length: 8 }, (_, col) => `${row}-${col}`)
          .filter(t => visitedTiles.has(t));
        if (rowTiles.length >= 6) {
          return rowTiles;
        }
      }
      return null;
    },
    meaning: 'Breadth of exploration across perspectives - horizontal connection',
    keywords: ['breadth', 'connection', 'horizontal', 'bridge']
  },
  {
    id: 'garden',
    name: 'The Garden',
    icon: '◻',
    description: '80%+ of a quadrant filled (16+ tiles in one quarter)',
    howToCreate: 'Focus on one quadrant (top-left, top-right, bottom-left, or bottom-right)',
    minTiles: 13,
    detect: (visitedTiles) => {
      const quadrants = [
        { startRow: 0, startCol: 0 }, // top-left
        { startRow: 0, startCol: 4 }, // top-right
        { startRow: 4, startCol: 0 }, // bottom-left
        { startRow: 4, startCol: 4 }, // bottom-right
      ];
      
      for (const { startRow, startCol } of quadrants) {
        const tiles: string[] = [];
        for (let r = startRow; r < startRow + 4; r++) {
          for (let c = startCol; c < startCol + 4; c++) {
            if (visitedTiles.has(`${r}-${c}`)) {
              tiles.push(`${r}-${c}`);
            }
          }
        }
        if (tiles.length >= 13) { // 80% of 16
          return tiles;
        }
      }
      return null;
    },
    meaning: 'Cultivated space for growth - concentrated attention',
    keywords: ['cultivation', 'concentration', 'growth', 'garden']
  },
  {
    id: 'spiral',
    name: 'The Spiral',
    icon: '🌀',
    description: 'Expansion rings filled in order (center outward)',
    howToCreate: 'Start from center tiles, expand outward in rings',
    minTiles: 20,
    detect: (visitedTiles) => {
      // Check if inner tiles are visited and expansion is outward
      const center = ['3-3', '3-4', '4-3', '4-4'];
      const ring1 = ['2-2', '2-3', '2-4', '2-5', '3-2', '3-5', '4-2', '4-5', '5-2', '5-3', '5-4', '5-5'];
      
      const centerCount = center.filter(t => visitedTiles.has(t)).length;
      const ring1Count = ring1.filter(t => visitedTiles.has(t)).length;
      
      if (centerCount >= 3 && ring1Count >= 8) {
        return [...center.filter(t => visitedTiles.has(t)), ...ring1.filter(t => visitedTiles.has(t))];
      }
      return null;
    },
    meaning: 'Organic expansion from core - spiral growth pattern',
    keywords: ['expansion', 'organic', 'spiral', 'growth']
  },
  {
    id: 'diamond',
    name: 'The Diamond',
    icon: '◇',
    description: 'Diamond shape formed by diagonal coverage',
    howToCreate: 'Visit tiles forming a diamond pattern from center outward',
    minTiles: 12,
    detect: (visitedTiles) => {
      // Diamond pattern centered on board
      const diamondTiles = [
        '0-3', '0-4',
        '1-2', '1-3', '1-4', '1-5',
        '2-1', '2-2', '2-3', '2-4', '2-5', '2-6',
        '3-0', '3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-7',
        '4-0', '4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7',
        '5-1', '5-2', '5-3', '5-4', '5-5', '5-6',
        '6-2', '6-3', '6-4', '6-5',
        '7-3', '7-4',
      ];
      
      const visited = diamondTiles.filter(t => visitedTiles.has(t));
      if (visited.length >= 12) {
        return visited;
      }
      return null;
    },
    meaning: 'Crystalline clarity emerging from exploration',
    keywords: ['clarity', 'crystalline', 'diamond', 'precision']
  },
  {
    id: 'scatter',
    name: 'The Scatter',
    icon: '✦',
    description: 'Low adjacency with high coverage - spread exploration',
    howToCreate: 'Visit tiles across the matrix without clustering',
    minTiles: 25,
    detect: (visitedTiles) => {
      if (visitedTiles.size < 25) return null;
      
      // Calculate adjacency score
      let adjacentPairs = 0;
      const tiles = Array.from(visitedTiles);
      
      for (const tile of tiles) {
        const [row, col] = tile.split('-').map(Number);
        const neighbors = [
          `${row-1}-${col}`, `${row+1}-${col}`,
          `${row}-${col-1}`, `${row}-${col+1}`
        ];
        for (const n of neighbors) {
          if (visitedTiles.has(n)) adjacentPairs++;
        }
      }
      
      const avgAdjacency = adjacentPairs / tiles.length;
      if (avgAdjacency < 1.5) { // Low adjacency = scattered
        return tiles;
      }
      return null;
    },
    meaning: 'Wide exploration without attachment - diverse sampling',
    keywords: ['diversity', 'exploration', 'scattered', 'sampling']
  },
  {
    id: 'web',
    name: 'The Web',
    icon: '🕸',
    description: 'High connectivity - many adjacent tile pairs',
    howToCreate: 'Visit tiles that form connected clusters',
    minTiles: 20,
    detect: (visitedTiles) => {
      if (visitedTiles.size < 20) return null;
      
      // Calculate adjacency score
      let adjacentPairs = 0;
      const tiles = Array.from(visitedTiles);
      
      for (const tile of tiles) {
        const [row, col] = tile.split('-').map(Number);
        const neighbors = [
          `${row-1}-${col}`, `${row+1}-${col}`,
          `${row}-${col-1}`, `${row}-${col+1}`
        ];
        for (const n of neighbors) {
          if (visitedTiles.has(n)) adjacentPairs++;
        }
      }
      
      const avgAdjacency = adjacentPairs / tiles.length;
      if (avgAdjacency >= 2.5) { // High adjacency = web
        return tiles;
      }
      return null;
    },
    meaning: 'Interconnected understanding - network thinking',
    keywords: ['connection', 'network', 'web', 'interconnection']
  },
  {
    id: 'frame',
    name: 'The Frame',
    icon: '▢',
    description: 'Boundary tiles complete - the edge of the matrix',
    howToCreate: 'Visit all tiles on the outer edge of the matrix',
    minTiles: 28,
    detect: (visitedTiles) => {
      const edgeTiles = [
        ...Array.from({ length: 8 }, (_, i) => `0-${i}`), // top row
        ...Array.from({ length: 8 }, (_, i) => `7-${i}`), // bottom row
        ...Array.from({ length: 6 }, (_, i) => `${i + 1}-0`), // left column (excluding corners)
        ...Array.from({ length: 6 }, (_, i) => `${i + 1}-7`), // right column (excluding corners)
      ];
      
      const visited = edgeTiles.filter(t => visitedTiles.has(t));
      if (visited.length >= 24) { // ~85% of edge
        return visited;
      }
      return null;
    },
    meaning: 'Boundary awareness - understanding limits and edges',
    keywords: ['boundary', 'frame', 'edge', 'limits']
  },
];

// Detect geometric patterns
export const detectGeometricPatterns = (visitedTiles: Set<string>): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];
  
  for (const def of GEOMETRIC_PATTERNS) {
    if (visitedTiles.size >= def.minTiles) {
      const tiles = def.detect(visitedTiles);
      if (tiles) {
        patterns.push({
          id: `geometric-${def.id}`,
          type: 'geometric',
          name: def.name,
          icon: def.icon,
          tiles,
          timestamp: new Date(),
          meaning: def.meaning,
          keywords: def.keywords,
          insight: `${def.name} pattern detected: ${def.description}. ${def.meaning}`,
          howToCreate: def.howToCreate
        });
      }
    }
  }
  
  return patterns;
};

// Main detection function
export const detectPatterns = (
  visitedTiles: Set<string>,
  minTilesThreshold: number = 40
): DetectedPattern[] => {
  if (visitedTiles.size < minTilesThreshold) return [];
  
  const allPatterns: DetectedPattern[] = [];
  
  // Trigram patterns
  allPatterns.push(...detectVerticalTrigrams(visitedTiles));
  allPatterns.push(...detectHorizontalTrigrams(visitedTiles));
  allPatterns.push(...detectDiagonalTrigrams(visitedTiles));
  
  // Hexagram patterns
  for (let col = 0; col < 8; col++) {
    const hexPattern = detectColumnHexagram(visitedTiles, col);
    if (hexPattern) allPatterns.push(hexPattern);
  }
  allPatterns.push(...detectHexagramEcho(visitedTiles));
  
  // Geometric patterns
  allPatterns.push(...detectGeometricPatterns(visitedTiles));
  
  // Sort by significance (trigrams/hexagrams first, then geometric)
  return allPatterns.sort((a, b) => {
    const typeOrder: Record<PatternType, number> = { hexagram: 0, trigram: 1, sequence: 2, geometric: 3 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
};

// Get pattern color based on type
export const getPatternColor = (type: PatternType): string => {
  switch (type) {
    case 'trigram': return 'hsl(258 90% 66%)'; // Purple
    case 'hexagram': return 'hsl(38 92% 50%)'; // Gold
    case 'geometric': return 'hsl(217 91% 60%)'; // Blue
    case 'sequence': return 'hsl(142 71% 45%)'; // Green
    default: return 'hsl(215 16% 47%)';
  }
};

// Get all pattern definitions for encyclopedia
export const getAllPatternDefinitions = () => ({
  trigrams: TRIGRAMS,
  geometric: GEOMETRIC_PATTERNS.map(p => ({
    id: p.id,
    name: p.name,
    icon: p.icon,
    description: p.description,
    howToCreate: p.howToCreate,
    minTiles: p.minTiles,
    meaning: p.meaning,
    keywords: p.keywords,
  })),
});
