/**
 * Nature-Based Cognitive Taxonomy for Calm Magic Board
 * Five cognitive modes inspired by natural phenomena
 */

export type NatureCognitiveMode = 'river' | 'mountain' | 'lake' | 'forest' | 'tree';

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
    terrain: 'water_feature'
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
    terrain: 'rocky_outcrop'
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
    terrain: 'water_feature'
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
    terrain: 'fertile_soil'
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
    terrain: 'fertile_soil'
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
