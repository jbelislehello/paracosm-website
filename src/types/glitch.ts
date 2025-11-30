export type UserMode = 'solo' | 'team';
export type TeamRole = 'owner' | 'member';
export type Board = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
export type ProcessState = 'GLITCH' | 'DRIFT' | 'TUNE' | 'FREE';
export type APAspect = 'F' | 'E' | 'L' | 'V';
export type Positionality = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
export type CuriosityLevel = 'C1' | 'C2' | 'C3';
export type AdversityLevel = 'A1' | 'A2' | 'A3';
export type WuWeiMode = 'ALLOW_FIRST' | 'MINIMAL_INTERVENTION' | 'NO_FORCE';
export type SengeDiscipline = 'PersonalMastery' | 'MentalModels' | 'SharedVision' | 'TeamLearning' | 'SystemsThinking';
export type Quadrant = 'SN' | 'IN' | 'IM' | 'SM';
export type OscillationState = 'shadow' | 'mixed' | 'higher_self';
export type WuWeiIntensity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Tile {
  id: number;
  board: Board;
  row: number | null;
  col: number | null;
  hexagram: number;
  tzolkin_index: number;
  calm_magic_phase: Board;
  vl_path_index: number | null;
  default_process_state: ProcessState;
  mindfulness_focus: any; // JSON type from database
  senge_discipline: SengeDiscipline;
  wu_wei_intensity: WuWeiIntensity;
  short_prompt: string;
  created_at?: string;
  updated_at?: string;
}

export interface GlitchEvent {
  id?: string;
  user_id: string;
  team_id?: string | null;
  tile_id: number;
  timestamp?: string;
  title: string;
  description: string;
  process_state: ProcessState;
  ap_aspect: APAspect;
  positionality: Positionality;
  curiosity_level: CuriosityLevel;
  adversity_level: AdversityLevel;
  wu_wei_mode: WuWeiMode;
  senge_focus: SengeDiscipline;
  quadrant: Quadrant;
  oscillation_state: OscillationState;
  reflection?: string | null;
  next_step?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMembership {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  created_at?: string;
}
