// Calm Magic Expansion Journal Types

export type JournalPhase = 'glitch' | 'drift' | 'tune';
export type ToleranceZone = 'inner' | 'stretch' | 'outer';
export type CycleNumber = 1 | 2 | 3 | 4;
export type JourneyMode = 'relational' | 'product';
export type SpiralQuadrant = 'sovereignty' | 'memory' | 'intimacy' | 'novelty';

// PRD Layer types - 5 pluralized layers
export type PrdLayer = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

// PRD Meta-stages - 3 stages grouping the 5 layers
export type PrdStage = 'real-intelligence' | 'knowledge-objects' | 'understanding';

export interface PrdStageDefinition {
  id: PrdStage;
  name: string;
  description: string;
  themes: string[];
  layers: PrdLayer[];
  icon: string;
  color: string;
}

export const PRD_STAGES: PrdStageDefinition[] = [
  {
    id: 'real-intelligence',
    name: 'Real Intelligence',
    description: 'Surfacing what actually matters through intuition and relational feedback',
    themes: ['Intuitions', 'Shared Ideas', 'PRD Shadows', 'Cultural Issues', 'RI Feedback', 'Biases'],
    layers: ['POLLENS', 'NOEMS'],
    icon: '🧠',
    color: 'from-rose-500 to-amber-500'
  },
  {
    id: 'knowledge-objects',
    name: 'Knowledge Objects',
    description: 'Crystallizing insights into structured, reusable knowledge',
    themes: ['Content Sources', 'Data Nodes', 'API'],
    layers: ['POEMS'],
    icon: '💎',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'understanding',
    name: 'Understanding',
    description: 'Mapping processes and relationships through semantic structures',
    themes: ['Processes', 'Maps', 'Three Graph Model', 'Subject Graph', 'Lexical Graph', 'Domain Graph', 'RDF', 'OWL'],
    layers: ['TOTEMS', 'ANTHEMS'],
    icon: '🗺️',
    color: 'from-blue-500 to-emerald-500'
  }
];

// 5 Compasses from MAGIC system
export type CompassType = 
  | 'narrative'          // Storytelling lens
  | 'workflow'           // Process/operations lens
  | 'inquiry'            // Questions & practices lens
  | 'playground'         // Experimentation lens
  | 'human-systems';     // Human dynamics & systems thinking lens

// CHORDSM(S) - X-axis positions (Longevity)
export type ChordsPosition = 'C' | 'H' | 'O' | 'R' | 'D' | 'S1' | 'M' | 'S2';
export const CHORDS_LABELS: Record<ChordsPosition, string> = {
  'C': 'Chances taken',
  'H': 'Heart-based principles',
  'O': 'Observer consciousness',
  'R': 'Reversal & Renewal',
  'D': 'Design',
  'S1': 'Seeds',
  'M': 'Methods',
  'S2': 'Systems'
};

// AGENDAS - Y-axis positions (Velocity) - Updated to match sketch
export type AgendasLevel = 
  | 'mindsets'      // Row 1 - M
  | 'agilities'     // Row 2 - A
  | 'goals'         // Row 3 - G
  | 'intuition'     // Row 4 - I (start of LENS)
  | 'landscape'     // Row 5 - L
  | 'energy'        // Row 6 - E
  | 'norms'         // Row 7 - N (was strategy)
  | 'synergies';    // Row 8 - S (Protocols & Architectures)

export const AGENDAS_LABELS: Record<AgendasLevel, string> = {
  'mindsets': 'Mindsets',
  'agilities': 'Agilities',
  'goals': 'Goals',
  'intuition': 'Intuition',
  'landscape': 'Landscape',
  'energy': 'Energy',
  'norms': 'Norms',
  'synergies': 'Synergies (Protocols & Architectures)'
};

// MAGIC acronym for compass navigation
export const MAGIC_ACRONYM = {
  M: 'Mindset',
  A: 'Agilities',
  G: 'Goal',
  I: 'Intuition',
  C: 'Compasses'
};

// Feminine-Safe PRD Design Principles - Enhanced with practical UX qualities
export interface FemininePrinciple {
  id: string;
  name: string;
  description: string;
  practices: string[];
  essence: string;
  designCue: string;
  reviewQuestion: string;
  icon: string;
  stage: PrdStage;
}

// Feminine-Safe PRD Anti-patterns (replacing threats)
export interface FeminineAntiPattern {
  id: string;
  name: string;
  description: string;
  signs: string[];
  counterPrinciple: string;
}

// Stack emergence tracking
export interface StackComponent {
  id: 'ontology' | 'backend' | 'frontend' | 'database' | 'api';
  name: string;
  description: string;
  maturityLevel: number; // 0-100
  emergencePhase: PrdLayer | null;
}

export interface MaturityMetric {
  id: 'documentation' | 'automation' | 'orchestration';
  name: string;
  description: string;
  level: number; // 0-100
  indicators: string[];
}

// Polen Entry - Raw fragments (GLITCH phase)
export interface PolenEntry {
  id?: string;
  user_id: string;
  tile_id?: number;
  event_id?: string;
  cycle_id?: string;
  content: string;
  fragment_type: 'text' | 'quote' | 'image' | 'voice' | 'screenshot' | 'link';
  source_reference?: string;
  hexagram_number?: number;
  tzolkin_kin?: number;
  tags?: string[];
  intensity?: number; // 0-100, importance/significance level
  charge?: 'expanding' | 'contracting' | 'neutral'; // emotional/energetic direction
  created_at?: string;
}

// Noem Entry - Conceptual atoms (DRIFT phase)
export interface NoemEntry {
  id?: string;
  user_id: string;
  cycle_id?: string;
  title: string;
  insight: string;
  connected_polen_ids: string[];
  topology_position?: { x: number; y: number };
  connections?: string[]; // IDs of connected noems
  maturity: 'seed' | 'growing' | 'ripe';
  spiral_quadrant?: SpiralQuadrant;
  created_at?: string;
  updated_at?: string;
}

// Poem Entry - Narrative artifacts (TUNE phase)
export interface PoemEntry {
  id?: string;
  user_id: string;
  cycle_id?: string;
  prd_id?: string;
  title: string;
  narrative: string;
  connected_noem_ids: string[];
  poem_type: 'story' | 'metaphor' | 'anthem' | 'manifold';
  market_fit?: string;
  tech_stack_hints?: string[];
  created_at?: string;
  updated_at?: string;
}

// Journal Cycle - Tracking the 4-pass journey
export interface JournalCycle {
  id?: string;
  user_id: string;
  team_id?: string;
  cycle_number: CycleNumber;
  board: 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
  journey_mode: JourneyMode;
  started_at?: string;
  completed_at?: string;
  tiles_visited: number[];
  current_tile_id?: number;
  window_of_tolerance: WindowOfTolerance;
  phase: JournalPhase;
  active_compass?: CompassType;
  integrator_tiles_unlocked: number; // 0-4
}

// Window of Tolerance tracking - 4 cycles expansion
export interface WindowOfTolerance {
  cycle_expansion: CycleNumber; // 1-4, each cycle expands the window
  inner_radius: number; // 1-3 (tiles from center)
  stretch_radius: number; // 2-4 (tiles from center)
  current_distance: number; // current distance from center
  zone: ToleranceZone;
  expansion_events: ToleranceExpansionEvent[];
}

export interface ToleranceExpansionEvent {
  timestamp: string;
  previous_inner: number;
  new_inner: number;
  trigger_tile_id: number;
  reflection?: string;
}

// Tile with contextual question
export interface TileContextualQuestion {
  tile_id: number;
  chords_position: ChordsPosition;
  agendas_level: AgendasLevel;
  question_template: string;
  generated_question: string;
}

// Cosmological mappings
export interface CosmologicalMapping {
  tile_id: number;
  hexagram_number: number; // 1-64 I Ching
  hexagram_name: string;
  tzolkin_kin: number; // 1-260
  tzolkin_seal: string;
  tzolkin_tone: number; // 1-13
}

// Torus Relationnel phases
export type TorusPhase = 'approche' | 'ouverture' | 'intensite' | 'retrait';

export const TORUS_PHASES: Record<TorusPhase, { label: string; description: string }> = {
  'approche': { label: 'Approche', description: 'Moving toward connection' },
  'ouverture': { label: 'Ouverture', description: 'Opening to possibility' },
  'intensite': { label: 'Intensité', description: 'Full engagement' },
  'retrait': { label: 'Retrait', description: 'Withdrawing to integrate' }
};

// Helper functions
export function getTilePosition(tileId: number): { row: number; col: number } {
  const row = Math.floor((tileId - 1) / 8) + 1;
  const col = ((tileId - 1) % 8) + 1;
  return { row, col };
}

export function getChordsPosition(col: number): ChordsPosition {
  const positions: ChordsPosition[] = ['C', 'H', 'O', 'R', 'D', 'S1', 'M', 'S2'];
  return positions[col - 1] || 'C';
}

export function getAgendasLevel(row: number): AgendasLevel {
  const levels: AgendasLevel[] = ['mindsets', 'agilities', 'goals', 'intuition', 'landscape', 'energy', 'norms', 'synergies'];
  return levels[row - 1] || 'mindsets';
}

export function getToleranceZone(row: number, col: number): ToleranceZone {
  // Center is (4.5, 4.5), calculate distance
  const centerRow = 4.5;
  const centerCol = 4.5;
  const distance = Math.max(Math.abs(row - centerRow), Math.abs(col - centerCol));
  
  if (distance <= 1.5) return 'inner';
  if (distance <= 2.5) return 'stretch';
  return 'outer';
}

// Get cycle-based expansion zone
export function getCycleExpansionZone(row: number, col: number, cycleNumber: CycleNumber): 'safe' | 'stretch' | 'edge' | 'unexplored' {
  const centerRow = 4.5;
  const centerCol = 4.5;
  const distance = Math.max(Math.abs(row - centerRow), Math.abs(col - centerCol));
  
  // Each cycle expands the safe zone
  const safeRadius = cycleNumber; // 1, 2, 3, or 4
  const stretchRadius = safeRadius + 1;
  
  if (distance <= safeRadius) return 'safe';
  if (distance <= stretchRadius) return 'stretch';
  if (distance <= 3.5) return 'edge';
  return 'unexplored';
}

export function generateContextualQuestion(chords: ChordsPosition, agendas: AgendasLevel): string {
  const chordsLabel = CHORDS_LABELS[chords];
  const agendasLabel = AGENDAS_LABELS[agendas];
  
  return `Given my ${agendasLabel.toLowerCase()} level, and through the lens of ${chordsLabel.toLowerCase()}, what am I really seeing, needing, or committing to?`;
}

// Get spiral quadrant from entry position
export function getSpiralQuadrant(x: number, y: number): SpiralQuadrant {
  // x: -1 to 1 (Memory to Novelty)
  // y: -1 to 1 (Intimacy to Sovereignty)
  if (x >= 0 && y >= 0) return 'sovereignty'; // top-right: novelty + sovereignty
  if (x < 0 && y >= 0) return 'memory';       // top-left: memory + sovereignty
  if (x < 0 && y < 0) return 'intimacy';      // bottom-left: memory + intimacy
  return 'novelty';                            // bottom-right: novelty + intimacy
}

// Get PRD stage for a tile based on row position
export function getTileStage(row: number): PrdStage {
  if (row <= 2) return 'real-intelligence';   // Rows 0-2: Mindsets, Agilities, Goals
  if (row <= 4) return 'knowledge-objects';   // Rows 3-4: Intuition, Landscape
  return 'understanding';                      // Rows 5-7: Energy, Norms, Synergies
}

// Get stage definition by ID
export function getStageById(stageId: PrdStage): PrdStageDefinition | undefined {
  return PRD_STAGES.find(s => s.id === stageId);
}
