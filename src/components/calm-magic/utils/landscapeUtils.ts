
import { EmotionalState } from '@/types/journal';

export const createRippleEffect = (x: number, y: number) => ({
  id: Date.now(),
  x,
  y,
  radius: 0,
  opacity: 1
});

export const updateEmotionalLevel = (
  currentState: Partial<EmotionalState>,
  key: keyof EmotionalState,
  increment: number
): Partial<EmotionalState> => {
  const currentLevel = currentState[key] || 50;
  const newLevel = Math.max(0, Math.min(100, currentLevel + increment));
  return { ...currentState, [key]: newLevel };
};

export const getPoiesisStatus = (emotionalState: Partial<EmotionalState>) => {
  const levels = Object.values(emotionalState);
  const activeLevels = levels.filter(level => (level || 0) > 75);
  return {
    isActive: activeLevels.length > 0,
    intensity: Math.max(...levels.map(l => l || 0)) / 100
  };
};

export const calculateLandscapeHealth = (level: number) => {
  if (level > 80) return 'thriving';
  if (level > 60) return 'healthy';
  if (level > 40) return 'growing';
  if (level > 20) return 'emerging';
  return 'dormant';
};
