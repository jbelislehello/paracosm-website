// Trajectory Assessment Types for Quadrant Dynamics

export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

export interface SeasonQualities {
  vitality: number;      // LOVE/POLLENS - 0-100
  spaciousness: number;  // MAGIC/NOEMS - 0-100
  wholeness: number;     // CALM/POEMS - 0-100
  openness: number;      // OPEN/TOTEMS - 0-100
  expansion: number;     // FREE/ANTHEMS - 0-100
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
  | 'prophecy_set';

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

export interface TrajectoryState {
  higher_self_position: QuadrantPosition | null;
  higher_self_quadrant: 'SN' | 'IN' | 'IM' | 'SM' | null;
  prophecy_reflection: string | null;
  prophecy_set_at: string | null;
  trajectory_log: TrajectoryEvent[];
  last_shadow_position: QuadrantPosition;
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
  POEMS: 'wholeness',
  TOTEMS: 'openness',
  ANTHEMS: 'expansion',
};

export const QUALITY_LABELS: Record<keyof SeasonQualities, { 
  label: string; 
  icon: string; 
  color: string;
  season: Season;
}> = {
  vitality: { label: 'Vitality', icon: '❤️', color: 'hsl(var(--chart-1))', season: 'POLLENS' },
  spaciousness: { label: 'Spaciousness', icon: '✨', color: 'hsl(var(--chart-2))', season: 'NOEMS' },
  wholeness: { label: 'Wholeness', icon: '🧘', color: 'hsl(var(--chart-3))', season: 'POEMS' },
  openness: { label: 'Openness', icon: '🌿', color: 'hsl(var(--chart-4))', season: 'TOTEMS' },
  expansion: { label: 'Expansion', icon: '🧠', color: 'hsl(var(--chart-5))', season: 'ANTHEMS' },
};
