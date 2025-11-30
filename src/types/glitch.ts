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

export type PrdStatus = 'draft' | 'in_review' | 'active' | 'archived';

export interface Prd {
  id: string;
  team_id?: string | null;
  owner_id: string;
  title: string;
  status: PrdStatus;
  
  // Dominant patterns
  main_dimension?: APAspect | null;
  main_quadrant?: Quadrant | null;
  main_senge_focus?: SengeDiscipline | null;
  main_board?: Board | null;
  main_oscillation?: OscillationState | null;
  
  // LAYER 1 – LOVE (Signals)
  love_summary?: string | null;
  love_key_events_overview?: string | null;
  
  // LAYER 2 – MAGIC (Patterns & Hypotheses)
  magic_patterns?: string | null;
  magic_hypotheses?: string | null;
  
  // LAYER 3 – CALM (Requirements & Constraints)
  calm_requirements?: string | null;
  calm_constraints?: string | null;
  calm_impacted_actors?: string | null;
  
  // LAYER 4 – OPEN (Experiments & Prototypes)
  open_experiments?: string | null;
  open_flows_or_scenarios?: string | null;
  
  // LAYER 5 – FREE (Learning & Integration)
  free_success_criteria?: string | null;
  free_learning_questions?: string | null;
  free_integration_plan?: string | null;
  
  created_at?: string;
  updated_at?: string;
}

export interface PrdLink {
  id: string;
  prd_id: string;
  event_id: string;
  created_at?: string;
}
