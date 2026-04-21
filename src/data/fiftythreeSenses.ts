// The 53 Senses — Nature's Wisdom
// Based on Michael J. Cohen's research on natural senses

import type { Season } from '@/types/trajectory';

export interface NaturalSense {
  id: number;
  name: string;
  description: string;
  category: SenseCategory;
  season: Season;
  quadrant: 'SN' | 'IN' | 'IM' | 'SM';
  reflectionPrompt: string;
}

export type SenseCategory =
  | 'radiation'
  | 'feeling'
  | 'chemical'
  | 'mental'
  | 'kinesthetic'
  | 'temporal'
  | 'spatial'
  | 'relational'
  | 'electromagnetic'
  | 'atmospheric';

export const SENSE_CATEGORIES: Record<SenseCategory, { label: string; icon: string; color: string }> = {
  radiation: { label: 'Radiation', icon: '☀️', color: 'hsl(45 93% 47%)' },
  feeling: { label: 'Feeling', icon: '🤚', color: 'hsl(346 77% 49%)' },
  chemical: { label: 'Chemical', icon: '🧪', color: 'hsl(142 71% 45%)' },
  mental: { label: 'Mental', icon: '🧠', color: 'hsl(270 60% 50%)' },
  kinesthetic: { label: 'Kinesthetic', icon: '🏃', color: 'hsl(210 70% 50%)' },
  temporal: { label: 'Temporal', icon: '⏳', color: 'hsl(30 90% 50%)' },
  spatial: { label: 'Spatial', icon: '🗺️', color: 'hsl(180 60% 45%)' },
  relational: { label: 'Relational', icon: '🤝', color: 'hsl(330 70% 55%)' },
  electromagnetic: { label: 'Electromagnetic', icon: '⚡', color: 'hsl(60 80% 50%)' },
  atmospheric: { label: 'Atmospheric', icon: '🌤️', color: 'hsl(200 60% 60%)' },
};

export const FIFTY_THREE_SENSES: NaturalSense[] = [
  // Radiation senses (1-6)
  { id: 1, name: 'Light sensitivity', description: 'Awareness of electromagnetic radiation as visible light', category: 'radiation', season: 'POLLENS', quadrant: 'SN', reflectionPrompt: 'What light does your project cast into the world?' },
  { id: 2, name: 'Color perception', description: 'Distinguishing wavelengths within the visible spectrum', category: 'radiation', season: 'POLLENS', quadrant: 'IN', reflectionPrompt: 'What colors does your vision evoke?' },
  { id: 3, name: 'Warmth/heat', description: 'Thermal radiation detection via infrared', category: 'radiation', season: 'POLLENS', quadrant: 'IM', reflectionPrompt: 'What warmth does this decision bring?' },
  { id: 4, name: 'Cold awareness', description: 'Absence of thermal radiation', category: 'radiation', season: 'NOEMS', quadrant: 'SM', reflectionPrompt: 'What feels cold or distant in your process?' },
  { id: 5, name: 'UV sensitivity', description: 'Subtle awareness of ultraviolet radiation effects', category: 'radiation', season: 'ANTHEMS', quadrant: 'SN', reflectionPrompt: 'What invisible energy drives this forward?' },
  { id: 6, name: 'Photoperiodism', description: 'Awareness of day length and seasonal light changes', category: 'radiation', season: 'ANTHEMS', quadrant: 'SM', reflectionPrompt: 'What season is your project in?' },

  // Feeling/touch senses (7-14)
  { id: 7, name: 'Pressure', description: 'Mechanical force against the body', category: 'feeling', season: 'POEMS', quadrant: 'IM', reflectionPrompt: 'Where do you feel pressure in this work?' },
  { id: 8, name: 'Texture', description: 'Surface qualities through touch', category: 'feeling', season: 'POEMS', quadrant: 'IN', reflectionPrompt: 'What texture does this decision have?' },
  { id: 9, name: 'Vibration', description: 'Rhythmic mechanical oscillation', category: 'feeling', season: 'TOTEMS', quadrant: 'SN', reflectionPrompt: 'What vibration does your team resonate with?' },
  { id: 10, name: 'Pain (nociception)', description: 'Awareness of tissue damage or threat', category: 'feeling', season: 'POLLENS', quadrant: 'IM', reflectionPrompt: 'What pain does this project address?' },
  { id: 11, name: 'Pleasure', description: 'Positive somatic sensation', category: 'feeling', season: 'POLLENS', quadrant: 'IN', reflectionPrompt: 'What gives you pleasure in this work?' },
  { id: 12, name: 'Proprioception', description: 'Body position and limb awareness', category: 'kinesthetic', season: 'POEMS', quadrant: 'SM', reflectionPrompt: 'Where do you stand in this landscape?' },
  { id: 13, name: 'Equilibrioception', description: 'Balance and spatial orientation', category: 'kinesthetic', season: 'POEMS', quadrant: 'SM', reflectionPrompt: 'What keeps your project in balance?' },
  { id: 14, name: 'Motion/acceleration', description: 'Kinetic awareness and velocity', category: 'kinesthetic', season: 'NOEMS', quadrant: 'SN', reflectionPrompt: 'What momentum is building?' },

  // Chemical senses (15-22)
  { id: 15, name: 'Smell (olfaction)', description: 'Airborne chemical detection', category: 'chemical', season: 'POLLENS', quadrant: 'IM', reflectionPrompt: 'What does your project smell like?' },
  { id: 16, name: 'Taste (gustation)', description: 'Dissolved chemical sensing', category: 'chemical', season: 'POLLENS', quadrant: 'IN', reflectionPrompt: 'What flavor does this experience leave?' },
  { id: 17, name: 'Appetite/hunger', description: 'Nutritional need awareness', category: 'chemical', season: 'NOEMS', quadrant: 'SN', reflectionPrompt: 'What hunger drives this pursuit?' },
  { id: 18, name: 'Thirst', description: 'Hydration need detection', category: 'chemical', season: 'NOEMS', quadrant: 'IN', reflectionPrompt: 'What does your project thirst for?' },
  { id: 19, name: 'Humidity sensing', description: 'Atmospheric moisture detection', category: 'atmospheric', season: 'TOTEMS', quadrant: 'IM', reflectionPrompt: 'What emotional moisture surrounds this?' },
  { id: 20, name: 'Pheromone detection', description: 'Social chemical signaling', category: 'chemical', season: 'ANTHEMS', quadrant: 'IN', reflectionPrompt: 'What unspoken signals does your team emit?' },
  { id: 21, name: 'pH sensing', description: 'Acidity/alkalinity balance', category: 'chemical', season: 'TOTEMS', quadrant: 'SM', reflectionPrompt: 'What is the pH of your organizational culture?' },
  { id: 22, name: 'Hormonal awareness', description: 'Internal chemical messenger states', category: 'chemical', season: 'POEMS', quadrant: 'IM', reflectionPrompt: 'What internal chemistry is at play?' },

  // Mental/cognitive senses (23-34)
  { id: 23, name: 'Emotional sensitivity', description: 'Awareness of affective states', category: 'mental', season: 'POEMS', quadrant: 'IN', reflectionPrompt: 'What emotion is present right now?' },
  { id: 24, name: 'Intuition', description: 'Pattern recognition below conscious threshold', category: 'mental', season: 'NOEMS', quadrant: 'IM', reflectionPrompt: 'What does your intuition say about this path?' },
  { id: 25, name: 'Aesthetic sense', description: 'Beauty, harmony, proportion awareness', category: 'mental', season: 'POEMS', quadrant: 'SN', reflectionPrompt: 'What is beautiful about this design?' },
  { id: 26, name: 'Wonder/curiosity', description: 'Attraction to novelty and mystery', category: 'mental', season: 'NOEMS', quadrant: 'SN', reflectionPrompt: 'What fills you with wonder here?' },
  { id: 27, name: 'Play', description: 'Exploratory behavior without fixed purpose', category: 'mental', season: 'NOEMS', quadrant: 'SN', reflectionPrompt: 'How could play transform this challenge?' },
  { id: 28, name: 'Nurturing', description: 'Care-giving and protective impulse', category: 'relational', season: 'POLLENS', quadrant: 'IN', reflectionPrompt: 'What needs nurturing in your project?' },
  { id: 29, name: 'Belonging', description: 'Sense of community and home', category: 'relational', season: 'TOTEMS', quadrant: 'IM', reflectionPrompt: 'Where do you feel you belong in this work?' },
  { id: 30, name: 'Trust', description: 'Safety in relationship and collaboration', category: 'relational', season: 'TOTEMS', quadrant: 'IN', reflectionPrompt: 'Where does trust live in your team?' },
  { id: 31, name: 'Language/communication', description: 'Symbolic meaning-making', category: 'mental', season: 'ANTHEMS', quadrant: 'SN', reflectionPrompt: 'What language best expresses your vision?' },
  { id: 32, name: 'Reasoning', description: 'Logical inference and deduction', category: 'mental', season: 'TOTEMS', quadrant: 'SM', reflectionPrompt: 'What logic supports this decision?' },
  { id: 33, name: 'Memory', description: 'Temporal pattern storage and retrieval', category: 'temporal', season: 'POLLENS', quadrant: 'IM', reflectionPrompt: 'What memory informs this moment?' },
  { id: 34, name: 'Imagination', description: 'Constructing non-present realities', category: 'mental', season: 'NOEMS', quadrant: 'SN', reflectionPrompt: 'What can you imagine that does not yet exist?' },

  // Spatial senses (35-40)
  { id: 35, name: 'Direction/navigation', description: 'Orientation in space relative to landmarks', category: 'spatial', season: 'TOTEMS', quadrant: 'SM', reflectionPrompt: 'What direction is your project heading?' },
  { id: 36, name: 'Distance', description: 'Estimation of spatial separation', category: 'spatial', season: 'POEMS', quadrant: 'SM', reflectionPrompt: 'How far are you from your goal?' },
  { id: 37, name: 'Depth perception', description: 'Three-dimensional spatial awareness', category: 'spatial', season: 'NOEMS', quadrant: 'SN', reflectionPrompt: 'What depth does this idea have?' },
  { id: 38, name: 'Gravity', description: 'Awareness of gravitational pull and weight', category: 'spatial', season: 'POEMS', quadrant: 'IM', reflectionPrompt: 'What is the gravity of this decision?' },
  { id: 39, name: 'Magnetoreception', description: 'Sensing Earth\'s magnetic field', category: 'electromagnetic', season: 'TOTEMS', quadrant: 'SM', reflectionPrompt: 'What magnetic pull do you feel toward this path?' },
  { id: 40, name: 'Territory', description: 'Boundary and domain awareness', category: 'spatial', season: 'TOTEMS', quadrant: 'SM', reflectionPrompt: 'What are the boundaries of your project?' },

  // Temporal senses (41-46)
  { id: 41, name: 'Chronoception', description: 'Passage of time awareness', category: 'temporal', season: 'ANTHEMS', quadrant: 'SM', reflectionPrompt: 'How does time feel in this moment of creation?' },
  { id: 42, name: 'Rhythm/entrainment', description: 'Synchronization with temporal patterns', category: 'temporal', season: 'ANTHEMS', quadrant: 'IN', reflectionPrompt: 'What rhythm does your team move to?' },
  { id: 43, name: 'Circadian rhythm', description: 'Daily cycle awareness and phase', category: 'temporal', season: 'POLLENS', quadrant: 'IM', reflectionPrompt: 'Is this a morning or evening idea?' },
  { id: 44, name: 'Seasonal awareness', description: 'Annual cycle phase detection', category: 'temporal', season: 'ANTHEMS', quadrant: 'SM', reflectionPrompt: 'What season of life is this project born in?' },
  { id: 45, name: 'Anticipation', description: 'Future-oriented temporal awareness', category: 'temporal', season: 'NOEMS', quadrant: 'SN', reflectionPrompt: 'What do you anticipate emerging?' },
  { id: 46, name: 'Aging/maturation', description: 'Developmental stage awareness', category: 'temporal', season: 'ANTHEMS', quadrant: 'IM', reflectionPrompt: 'How mature is this idea?' },

  // Atmospheric/environmental (47-50)
  { id: 47, name: 'Barometric pressure', description: 'Atmospheric pressure changes', category: 'atmospheric', season: 'POEMS', quadrant: 'SM', reflectionPrompt: 'What pressure systems are forming around your project?' },
  { id: 48, name: 'Wind/air current', description: 'Moving air detection', category: 'atmospheric', season: 'ANTHEMS', quadrant: 'SN', reflectionPrompt: 'Which way is the wind blowing for your vision?' },
  { id: 49, name: 'Electrical field', description: 'Electrostatic awareness', category: 'electromagnetic', season: 'NOEMS', quadrant: 'SN', reflectionPrompt: 'What electrical charge does this idea carry?' },
  { id: 50, name: 'Sound/vibration', description: 'Acoustic wave detection', category: 'feeling', season: 'POEMS', quadrant: 'IN', reflectionPrompt: 'What sound does your project make?' },

  // Relational/social (51-53)
  { id: 51, name: 'Empathy', description: 'Resonance with others\' emotional states', category: 'relational', season: 'POLLENS', quadrant: 'IN', reflectionPrompt: 'What would your users feel experiencing this?' },
  { id: 52, name: 'Collective intelligence', description: 'Group wisdom and swarm awareness', category: 'relational', season: 'TOTEMS', quadrant: 'IN', reflectionPrompt: 'What does the collective know that individuals don\'t?' },
  { id: 53, name: 'Aliveness (Nahual)', description: 'The attractive quality that draws attention to what is most alive', category: 'relational', season: 'ANTHEMS', quadrant: 'SN', reflectionPrompt: 'What is most alive in your project right now?' },
];

// Get senses by season
export function getSensesBySeason(season: Season): NaturalSense[] {
  return FIFTY_THREE_SENSES.filter(s => s.season === season);
}

// Get senses by category
export function getSensesByCategory(category: SenseCategory): NaturalSense[] {
  return FIFTY_THREE_SENSES.filter(s => s.category === category);
}

// Get a random sense for reflection
export function getRandomSense(): NaturalSense {
  return FIFTY_THREE_SENSES[Math.floor(Math.random() * FIFTY_THREE_SENSES.length)];
}
