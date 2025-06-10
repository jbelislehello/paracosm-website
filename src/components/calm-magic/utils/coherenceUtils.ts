
import { EmotionalState } from '@/types/journal';
import { ModeType } from '../context/ModeContext';

// Calculate coherence level based on emotional states and mode
export const calculateCoherenceLevel = (
  emotionalState: Partial<EmotionalState>,
  mode: ModeType
): number => {
  // Get all emotional levels that exist
  const levels = Object.values(emotionalState).filter((level): level is number => 
    typeof level === 'number'
  );
  
  if (levels.length === 0) return 50;
  
  // Base coherence on balance of emotional states
  const average = levels.reduce((sum, level) => sum + level, 0) / levels.length;
  
  // Calculate variance - lower variance means more coherence
  const variance = levels.reduce((sum, level) => sum + Math.pow(level - average, 2), 0) / levels.length;
  const normalizedVariance = Math.min(100, variance / 5);
  
  // Professional mode puts more weight on balance across dimensions
  if (mode === 'professional') {
    // Professional coherence values higher levels in calm and free (mountain and lake)
    const calmLevel = Number(emotionalState.calm_level) || 0;
    const freeLevel = Number(emotionalState.free_level) || 0;
    const proBonus = (calmLevel + freeLevel) / 4; // Max 50 bonus points
    
    // Calculate professional coherence
    return Math.min(100, Math.max(0, 100 - normalizedVariance + proBonus));
  } else {
    // Personal coherence values higher levels in love and magic (tree and river)
    const loveLevel = Number(emotionalState.love_level) || 0;
    const magicLevel = Number(emotionalState.magic_level) || 0;
    const personalBonus = (loveLevel + magicLevel) / 4; // Max 50 bonus points
    
    // Calculate personal coherence
    return Math.min(100, Math.max(0, 100 - normalizedVariance + personalBonus));
  }
};

// Get coherence status based on level
export const getCoherenceStatus = (level: number) => {
  if (level > 80) {
    return { 
      label: 'Integrated', 
      emoji: '✨', 
      description: 'Poiesis Active',
      color: 'green' 
    };
  }
  if (level > 60) {
    return { 
      label: 'Harmonizing', 
      emoji: '🌊', 
      description: 'Flow State',
      color: 'blue' 
    };
  }
  if (level > 40) {
    return { 
      label: 'Balancing', 
      emoji: '⚖️', 
      description: 'Finding Center',
      color: 'yellow' 
    };
  }
  return { 
    label: 'Emerging', 
    emoji: '🌱', 
    description: 'Beginning',
    color: 'red' 
  };
};

// Calculate professional innovation capacity based on emotional state
export const calculateInnovationCapacity = (emotionalState: Partial<EmotionalState>): number => {
  const loveLevel = Number(emotionalState.love_level) || 0;
  const magicLevel = Number(emotionalState.magic_level) || 0;
  const calmLevel = Number(emotionalState.calm_level) || 0;
  const openLevel = Number(emotionalState.open_level) || 0;
  const freeLevel = Number(emotionalState.free_level) || 0;
  
  // Innovation capacity formula weighs open and magic slightly higher
  return (loveLevel * 0.15 + magicLevel * 0.25 + calmLevel * 0.15 + openLevel * 0.25 + freeLevel * 0.2);
};

// Calculate resonance between personal development and professional effectiveness
export const calculateResonance = (
  emotionalState: Partial<EmotionalState>,
  competencyFocus: string | null
): number => {
  if (!competencyFocus) return 50;
  
  // Map competencies to emotional states
  const competencyMap: Record<string, keyof EmotionalState> = {
    authentic: 'love_level',
    creative: 'magic_level',
    systems: 'calm_level',
    collaborative: 'open_level',
    visionary: 'free_level'
  };
  
  const relevantEmotionKey = competencyMap[competencyFocus];
  
  // Add safety check for undefined competencyFocus
  if (!relevantEmotionKey) {
    console.warn(`No emotion mapping found for competency: ${competencyFocus}`);
    return 50;
  }
  
  const relevantEmotionLevel = Number(emotionalState[relevantEmotionKey]) || 0;
  
  // Other emotions still contribute but less directly
  const otherEmotions = Object.entries(emotionalState)
    .filter(([key]) => key !== relevantEmotionKey)
    .map(([, value]) => Number(value) || 0);
  
  const otherEmotionsAvg = otherEmotions.length > 0 
    ? otherEmotions.reduce((sum, val) => sum + val, 0) / otherEmotions.length
    : 0;
  
  // Resonance is primarily determined by the relevant emotion but supported by others
  return Math.min(100, (relevantEmotionLevel * 0.7) + (otherEmotionsAvg * 0.3));
};
