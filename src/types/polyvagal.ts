// Polyvagal Theory Integration Types

export type PolyvagalState = 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal';

export interface PolyvagalStory {
  state: PolyvagalState;
  label: string;
  story: string;
  description: string;
  color: string;
  icon: string;
  qualities: string[];
}

export const POLYVAGAL_STORIES: Record<PolyvagalState, PolyvagalStory> = {
  ventral_vagal: {
    state: 'ventral_vagal',
    label: 'Presence',
    story: 'Story of Presence',
    description: 'Safety, social engagement, co-regulation. The nervous system feels safe enough to connect, create, and explore.',
    color: 'hsl(142 71% 45%)',
    icon: '🌿',
    qualities: ['safety', 'connection', 'curiosity', 'playfulness', 'creativity', 'collaboration'],
  },
  sympathetic: {
    state: 'sympathetic',
    label: 'Protection',
    story: 'Story of Protection',
    description: 'Mobilization, fight/flight, activation. The nervous system detects threat and prepares for action.',
    color: 'hsl(45 93% 47%)',
    icon: '⚡',
    qualities: ['urgency', 'intensity', 'alertness', 'restlessness', 'anxiety', 'determination'],
  },
  dorsal_vagal: {
    state: 'dorsal_vagal',
    label: 'Dissociation',
    story: 'Story of Dissociation',
    description: 'Shutdown, freeze, collapse. The nervous system has overwhelmed its capacity and withdraws.',
    color: 'hsl(210 70% 50%)',
    icon: '🌊',
    qualities: ['numbness', 'withdrawal', 'fatigue', 'disconnection', 'foggy', 'stillness'],
  },
};

// Map FeltState to PolyvagalState
export function feltStateToPolyvagal(feltState: 'stuck' | 'flowing' | 'breakthrough' | null): PolyvagalState {
  switch (feltState) {
    case 'stuck': return 'dorsal_vagal';
    case 'flowing': return 'ventral_vagal';
    case 'breakthrough': return 'sympathetic'; // transitioning to ventral
    default: return 'ventral_vagal';
  }
}

// Infer polyvagal state from emotional axes
export function inferPolyvagalState(axes: {
  love: number; magic: number; calm: number; open: number; free: number;
}): PolyvagalState {
  const avg = (axes.love + axes.magic + axes.calm + axes.open + axes.free) / 5;

  // Dorsal vagal: low across all
  if (avg < 30) return 'dorsal_vagal';

  // Sympathetic: high magic/free but low calm
  if (axes.magic > 60 && axes.calm < 40) return 'sympathetic';
  if (axes.free > 70 && axes.calm < 35) return 'sympathetic';

  // Ventral vagal: high calm + open
  if (axes.calm > 50 && axes.open > 50) return 'ventral_vagal';

  // Default based on average
  if (avg > 55) return 'ventral_vagal';
  if (avg > 35) return 'sympathetic';
  return 'dorsal_vagal';
}
