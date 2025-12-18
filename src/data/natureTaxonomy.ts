/**
 * Nature-Based Cognitive Taxonomy for Calm Magic Board
 * Five cognitive modes inspired by natural phenomena
 */

export type NatureCognitiveMode = 'river' | 'mountain' | 'lake' | 'forest' | 'tree';

export interface ParticleConfig {
  type: 'droplet' | 'mist' | 'firefly' | 'leaf' | 'seed' | 'ripple' | 'snow';
  count: number;
  speed: number;
  color: { h: number; s: number; b: number };
  behavior: 'flow' | 'rise' | 'wander' | 'fall' | 'spiral' | 'pulse';
  size: { min: number; max: number };
  glow?: boolean;
}

export interface NatureMode {
  id: NatureCognitiveMode;
  name: string;
  axis: 'MAGIC' | 'FREE' | 'CALM' | 'OPEN' | 'LOVE';
  essence: string;
  thinking: string;
  antiPattern: string;
  color: string;
  icon: string;
  vegetation: VegetationType[];
  terrain: TerrainType;
  particles: ParticleConfig[];
}

export type VegetationType = 
  | 'dense_canopy'    // Rich forest - high fragment density
  | 'grassland'       // Meadow - medium density
  | 'wildflowers'     // Scattered blooms - varied content
  | 'moss_lichen'     // Ground cover - early exploration
  | 'ferns'           // Shade plants - depth work
  | 'mushrooms'       // Decomposers - transformation tiles
  | 'vines'           // Connectors - tiles with many links
  | 'succulents'      // Resilient - tiles revisited often
  | 'bamboo'          // Rapid growth - recent activity
  | 'ancient_trees';  // Deep roots - foundational tiles

export type TerrainType = 
  | 'fertile_soil'    // Ready for growth
  | 'rocky_outcrop'   // Blunt quotes as geological features
  | 'water_feature'   // Streams, pools - MAGIC alignment
  | 'sandy_clearing'  // Unvisited, awaiting cultivation
  | 'mossy_ground'    // Established, mature tiles
  | 'volcanic_soil';  // Transformative, high-energy tiles

export type RockFormation = 
  | 'boulder'         // Large, foundational quotes
  | 'standing_stone'  // Pivotal insights
  | 'pebbles'         // Small observations
  | 'cairn'           // Stacked wisdom
  | 'monolith';       // Defining statements

export const NATURE_COGNITIVE_MODES: Record<NatureCognitiveMode, NatureMode> = {
  river: {
    id: 'river',
    name: 'Think like a River',
    axis: 'MAGIC',
    essence: 'Flow, emergence, spaciousness',
    thinking: 'Where can I flow around obstacles? What wants to emerge?',
    antiPattern: 'Forcing direct paths, fighting the current',
    color: 'hsl(200, 70%, 50%)',
    icon: '🌊',
    vegetation: ['bamboo', 'ferns', 'moss_lichen'],
    terrain: 'water_feature',
    particles: [
      { type: 'droplet', count: 40, speed: 1.2, color: { h: 200, s: 70, b: 70 }, behavior: 'flow', size: { min: 2, max: 5 } },
      { type: 'mist', count: 15, speed: 0.3, color: { h: 200, s: 30, b: 90 }, behavior: 'flow', size: { min: 8, max: 15 } }
    ]
  },
  mountain: {
    id: 'mountain',
    name: 'Think like a Mountain',
    axis: 'FREE',
    essence: 'Integration, vision, transcendence',
    thinking: 'What is the view from above? What integrates everything?',
    antiPattern: 'Rushing to peak without foundation',
    color: 'hsl(45, 80%, 55%)',
    icon: '⛰️',
    vegetation: ['succulents', 'ancient_trees', 'moss_lichen'],
    terrain: 'rocky_outcrop',
    particles: [
      { type: 'snow', count: 30, speed: 0.5, color: { h: 0, s: 0, b: 95 }, behavior: 'fall', size: { min: 2, max: 4 } },
      { type: 'mist', count: 20, speed: 0.2, color: { h: 220, s: 15, b: 85 }, behavior: 'rise', size: { min: 10, max: 20 } }
    ]
  },
  lake: {
    id: 'lake',
    name: 'Think like a Lake',
    axis: 'CALM',
    essence: 'Reflection, coherence, depth',
    thinking: 'What reflection reveals? What lies beneath the surface?',
    antiPattern: 'Constant disturbance, no settling',
    color: 'hsl(210, 60%, 60%)',
    icon: '🏞️',
    vegetation: ['ferns', 'wildflowers', 'moss_lichen'],
    terrain: 'water_feature',
    particles: [
      { type: 'ripple', count: 8, speed: 0.1, color: { h: 210, s: 50, b: 70 }, behavior: 'pulse', size: { min: 5, max: 25 } },
      { type: 'mist', count: 12, speed: 0.15, color: { h: 210, s: 20, b: 90 }, behavior: 'rise', size: { min: 12, max: 25 } }
    ]
  },
  forest: {
    id: 'forest',
    name: 'Think like a Forest',
    axis: 'OPEN',
    essence: 'Ecosystem, play, interconnection',
    thinking: 'How does this connect to everything? What emerges from diversity?',
    antiPattern: 'Monoculture thinking, isolation',
    color: 'hsl(142, 60%, 45%)',
    icon: '🌳',
    vegetation: ['dense_canopy', 'mushrooms', 'vines', 'ferns'],
    terrain: 'fertile_soil',
    particles: [
      { type: 'firefly', count: 25, speed: 0.4, color: { h: 60, s: 90, b: 85 }, behavior: 'wander', size: { min: 3, max: 6 }, glow: true },
      { type: 'leaf', count: 15, speed: 0.6, color: { h: 100, s: 50, b: 60 }, behavior: 'fall', size: { min: 4, max: 8 } }
    ]
  },
  tree: {
    id: 'tree',
    name: 'Think like a Tree',
    axis: 'LOVE',
    essence: 'Growth, roots, vitality',
    thinking: 'What are my roots? What nourishes authentic growth?',
    antiPattern: 'Growth without foundation, disconnected from source',
    color: 'hsl(340, 65%, 55%)',
    icon: '🌱',
    vegetation: ['ancient_trees', 'vines', 'wildflowers'],
    terrain: 'fertile_soil',
    particles: [
      { type: 'seed', count: 20, speed: 0.3, color: { h: 45, s: 70, b: 75 }, behavior: 'spiral', size: { min: 3, max: 5 } },
      { type: 'leaf', count: 10, speed: 0.5, color: { h: 340, s: 40, b: 70 }, behavior: 'fall', size: { min: 4, max: 7 } }
    ]
  }
};

// Mapping seasons to nature modes
export const SEASON_TO_NATURE: Record<string, NatureCognitiveMode> = {
  'POLLENS': 'tree',     // Seeds, beginnings, vitality
  'NOEMS': 'lake',       // Reflection, depth, coherence
  'POEMS': 'river',      // Flow, emergence, creativity
  'TOTEMS': 'mountain',  // Structure, integration, vision
  'ANTHEMS': 'forest'    // Ecosystem, interconnection, maturity
};

// Board to nature mapping for water features
export const BOARD_TO_WATER: Record<string, boolean> = {
  'MAGIC': true,
  'CALM': true,
  'LOVE': false,
  'OPEN': false,
  'FREE': false
};

// Vegetation density thresholds
export const VEGETATION_DENSITY: Record<VegetationType, { minFragments: number; maxFragments: number }> = {
  'dense_canopy': { minFragments: 8, maxFragments: Infinity },
  'ancient_trees': { minFragments: 6, maxFragments: Infinity },
  'bamboo': { minFragments: 4, maxFragments: 8 },
  'vines': { minFragments: 3, maxFragments: 7 },
  'ferns': { minFragments: 2, maxFragments: 5 },
  'wildflowers': { minFragments: 1, maxFragments: 4 },
  'mushrooms': { minFragments: 1, maxFragments: 3 },
  'succulents': { minFragments: 1, maxFragments: 3 },
  'moss_lichen': { minFragments: 0, maxFragments: 2 },
  'grassland': { minFragments: 0, maxFragments: 1 }
};

/**
 * Determine vegetation type based on fragment count and tile characteristics
 */
export function getVegetationType(
  fragmentCount: number,
  hasQuotes: boolean,
  connectionCount: number,
  seasonAlignment: NatureCognitiveMode | null
): VegetationType {
  // Special cases
  if (hasQuotes && fragmentCount > 4) return 'ancient_trees';
  if (connectionCount > 3) return 'vines';
  
  // Density-based selection
  if (fragmentCount >= 8) return 'dense_canopy';
  if (fragmentCount >= 6) return 'ancient_trees';
  if (fragmentCount >= 4) return 'bamboo';
  if (fragmentCount >= 2) return seasonAlignment === 'river' ? 'ferns' : 'wildflowers';
  if (fragmentCount >= 1) return 'moss_lichen';
  
  return 'grassland';
}

/**
 * Determine terrain type based on tile content
 */
export function getTerrainType(
  fragmentCount: number,
  hasQuotes: boolean,
  seasonAxis: string
): TerrainType {
  if (hasQuotes) return 'rocky_outcrop';
  if (seasonAxis === 'MAGIC' || seasonAxis === 'CALM') return 'water_feature';
  if (fragmentCount === 0) return 'sandy_clearing';
  if (fragmentCount >= 5) return 'mossy_ground';
  return 'fertile_soil';
}

/**
 * Check if a tile should have water features based on board/season
 */
export function shouldHaveWater(
  row: number, 
  col: number, 
  currentNatureMode: NatureCognitiveMode | null
): boolean {
  // Water modes always have water
  if (currentNatureMode === 'river' || currentNatureMode === 'lake') {
    return true;
  }
  // Specific tiles based on position (MAGIC/CALM alignment)
  // MAGIC tiles are typically in rows 2-3, CALM in rows 4-5
  const isMagicArea = row >= 2 && row <= 3;
  const isCalmArea = row >= 4 && row <= 5;
  return isMagicArea || isCalmArea;
}
