
export type GardenType = 'intelligence' | 'systems' | 'prototypes';
export type EnergeticAxis = 'love' | 'magic' | 'calm' | 'open' | 'free';

export interface EmotionalState {
  id?: string;
  user_id: string;
  garden: GardenType;
  love_level: number;
  magic_level: number;
  calm_level: number;
  open_level: number;
  free_level: number;
  shadow_self_notes?: string;
  higher_self_notes?: string;
  created_at?: string;
}

export interface JournalEntry {
  id?: string;
  user_id: string;
  emotional_state_id?: string;
  garden: GardenType;
  title: string;
  content: string;
  situation_context?: string;
  rising_question?: string;
  insights?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Garden {
  type: GardenType;
  name: string;
  description: string;
  color: string;
  icon: string;
}
