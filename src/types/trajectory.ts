// Trajectory Assessment Types for Quadrant Dynamics

export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

// Quadrant theme scores from semantic analysis (0-1 each)
export interface QuadrantThemes {
  intimacy: number;    // Connection, vulnerability, closeness, relationship
  sovereignty: number; // Independence, self-direction, boundaries, autonomy
  memory: number;      // Continuity, heritage, patterns, anchoring
  novelty: number;     // Exploration, innovation, risk, newness
}

// Individual POLEN entry sentiment result
export interface PolenSentiment {
  polenId: string;
  themes: QuadrantThemes;
  dominantTheme: keyof QuadrantThemes;
  emotionalValence: 'positive' | 'negative' | 'neutral' | 'ambivalent';
  keywords: string[];
}

// Dissonance between behavior and prophecy
export type DissonanceType = 'aligned' | 'divergent' | 'contradictory' | null;

// Full topological signature combining structural + semantic analysis
export interface TopologicalSignature {
  // Structural factors (from coherence analysis)
  structural: ShadowFactors;
  
  // Semantic factors (from AI analysis of POLEN content)
  semantic: QuadrantThemes;
  
  // Combined inference
  inferredPosition: QuadrantPosition;
  inferredQuadrant: 'SN' | 'IN' | 'IM' | 'SM';
  confidence: number; // 0-1
  
  // Dissonance detection (the "trap" detector)
  dissonanceFromProphecy: number; // 0-1, gap between behavior and stated goal
  dissonanceType: DissonanceType;
  
  // AI-generated nudge suggestion
  aiNudge?: string;
  
  // Individual entry sentiments (from AI analysis)
  sentiments?: PolenSentiment[];
  
  // AI-generated pattern insight
  patternInsight?: string;
  
  // Overall valence summary
  overallValence?: 'positive' | 'negative' | 'neutral' | 'ambivalent';
  
  // Analysis metadata
  analyzedAt: string;
  polenCount: number;
}

export interface SeasonQualities {
  vitality: number;      // LOVE/POLLENS - 0-100 (foundational)
  calmness: number;      // Ring 1: Inner Core - 0-100
  spaciousness: number;  // Ring 2: Stretch Zone - 0-100
  openness: number;      // Ring 3: Edge Zone - 0-100
  freedom: number;       // Ring 4: Integrator - 0-100
}

export interface QuadrantPosition {
  x: number; // -1 (Memory) to +1 (Novelty)
  y: number; // -1 (Intimacy) to +1 (Sovereignty)
}

export type TrajectoryEventType = 
  | 'season_start' 
  | 'tune_complete' 
  | 'season_end' 
  | 'prd_generated'
  | 'prophecy_set'
  | 'shadow_nudge'
  | 'emotional_checkin'
  | 'pattern_discovery';

// Emotional check-in types
export interface EmotionalAxes {
  love: number;    // 0-100
  magic: number;   // 0-100
  calm: number;    // 0-100
  open: number;    // 0-100
  free: number;    // 0-100
}

export interface EmotionalCheckInData {
  id: string;
  tile_id: number;
  timestamp: string;
  felt_state: FeltState;
  axes: EmotionalAxes;
  note?: string;
}

export interface TrajectoryEvent {
  id: string;
  timestamp: string;
  event_type: TrajectoryEventType;
  shadow_position: QuadrantPosition;
  season: Season;
  tile_id?: number;
  quality_snapshot: SeasonQualities;
  note?: string;
}

export interface ShadowFactors {
  completeness: number; // 0-1, tiles visited / total
  coherence: number;    // 0-1, pattern clustering
  depth: number;        // 0-1, engagement per tile
  flow: number;         // 0-1, movement validity
}

export type FeltState = 'stuck' | 'flowing' | 'breakthrough' | null;

export interface ShadowNudge {
  position: QuadrantPosition;
  felt_state: FeltState;
  note: string | null;
  applied_at: string;
}

export interface TrajectoryState {
  higher_self_position: QuadrantPosition | null;
  higher_self_quadrant: 'SN' | 'IN' | 'IM' | 'SM' | null;
  prophecy_reflection: string | null;
  prophecy_set_at: string | null;
  trajectory_log: TrajectoryEvent[];
  last_shadow_position: QuadrantPosition;
  shadow_nudge: ShadowNudge | null;
  shadow_factors: ShadowFactors;
}

export const QUADRANT_LABELS = {
  SN: { name: 'Sovereignty + Novelty', description: 'Self-direction through exploration' },
  SM: { name: 'Sovereignty + Memory', description: 'Self-direction through heritage' },
  IN: { name: 'Intimacy + Novelty', description: 'Deep connection through new experiences' },
  IM: { name: 'Intimacy + Memory', description: 'Deep connection through continuity' },
} as const;

export const SEASON_QUALITY_MAP: Record<Season, keyof SeasonQualities> = {
  POLLENS: 'vitality',
  NOEMS: 'spaciousness',
  POEMS: 'calmness',
  TOTEMS: 'openness',
  ANTHEMS: 'freedom',
};

export const QUALITY_LABELS: Record<keyof SeasonQualities, { 
  label: string; 
  icon: string; 
  color: string;
  season: Season;
  ring?: 1 | 2 | 3 | 4;
}> = {
  vitality: { label: 'Vitality', icon: '❤️', color: 'hsl(var(--chart-1))', season: 'POLLENS' },
  calmness: { label: 'Calmness', icon: '🧘', color: 'hsl(210 70% 50%)', season: 'POEMS', ring: 1 },
  spaciousness: { label: 'Spaciousness', icon: '✨', color: 'hsl(270 60% 50%)', season: 'NOEMS', ring: 2 },
  openness: { label: 'Openness', icon: '🌿', color: 'hsl(142 71% 45%)', season: 'TOTEMS', ring: 3 },
  freedom: { label: 'Freedom', icon: '🦅', color: 'hsl(45 93% 47%)', season: 'ANTHEMS', ring: 4 },
};
