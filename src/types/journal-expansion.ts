// Calm Magic Expansion Journal Types

export type JournalPhase = 'glitch' | 'drift' | 'tune';
export type ToleranceZone = 'inner' | 'stretch' | 'outer';
export type CycleNumber = 1 | 2 | 3 | 4;

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

// AGENDAS - Y-axis positions (Velocity)
export type AgendasLevel = 'mindsets' | 'agilities' | 'goals' | 'intuition' | 'landscape' | 'energy' | 'strategy' | 'architecture';
export const AGENDAS_LABELS: Record<AgendasLevel, string> = {
  'mindsets': 'Mindsets',
  'agilities': 'Agilities',
  'goals': 'Goals',
  'intuition': 'Intuition',
  'landscape': 'Landscape',
  'energy': 'Energy',
  'strategy': 'Strategy',
  'architecture': 'Architecture'
};

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
  started_at?: string;
  completed_at?: string;
  tiles_visited: number[];
  current_tile_id?: number;
  window_of_tolerance: WindowOfTolerance;
  phase: JournalPhase;
  integrator_tiles_unlocked: number; // 0-4
}

// Window of Tolerance tracking
export interface WindowOfTolerance {
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
  const levels: AgendasLevel[] = ['mindsets', 'agilities', 'goals', 'intuition', 'landscape', 'energy', 'strategy', 'architecture'];
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

export function generateContextualQuestion(chords: ChordsPosition, agendas: AgendasLevel): string {
  const chordsLabel = CHORDS_LABELS[chords];
  const agendasLabel = AGENDAS_LABELS[agendas];
  
  return `Given my ${agendasLabel.toLowerCase()} level, and through the lens of ${chordsLabel.toLowerCase()}, what am I really seeing, needing, or committing to?`;
}
