/**
 * Mode-aware terminology for cosmological features
 * Personal Mode: Uses mystical/spiritual naming (Tzolkin, Hexagram, Portal Days)
 * Professional Mode: Uses business-friendly naming (Sync Days, Wild Guess)
 */

export type ModeType = 'personal' | 'professional';

interface CosmologicalTerminology {
  // Tzolkin terminology
  tzolkin: string;
  tzolkinKin: string;
  tzolkinResonance: string;
  portalDay: string;
  portalDays: string;
  galacticActivationPortal: string;
  solarSeal: string;
  galacticTone: string;
  galacticAffirmation: string;
  
  // Hexagram terminology
  hexagram: string;
  hexagramOracle: string;
  iChing: string;
  castTheOracle: string;
  consultingTheOracle: string;
  
  // Wavespell & Castle
  wavespell: string;
  castle: string;
  
  // Cosmological features
  cosmologicalMapping: string;
  cosmologicalContext: string;
  resonanceDetection: string;
  diagonalPaths: string;
  
  // Torus/Manifold - same for both modes
  torusManifold: string;
  manifoldView: string;
  
  // Resonance panel terminology
  detectResonance: string;
  resonatingTiles: string;
  resonanceLabel: string;
  clickToPlayTone: string;
  patternArchetype: string;
}

const PERSONAL_TERMINOLOGY: CosmologicalTerminology = {
  // Tzolkin
  tzolkin: 'Tzolkin',
  tzolkinKin: 'Tzolkin Kin',
  tzolkinResonance: 'Tzolkin Resonance Detection',
  portalDay: 'Portal Day',
  portalDays: 'Portal Days',
  galacticActivationPortal: 'Galactic Activation Portal',
  solarSeal: 'Solar Seal',
  galacticTone: 'Galactic Tone',
  galacticAffirmation: 'Galactic Affirmation',
  
  // Hexagram
  hexagram: 'Hexagram',
  hexagramOracle: 'Hexagram Oracle',
  iChing: 'I Ching',
  castTheOracle: 'Cast the Oracle',
  consultingTheOracle: 'Consulting the Oracle...',
  
  // Wavespell & Castle
  wavespell: 'Wavespell',
  castle: 'Castle',
  
  // Cosmological
  cosmologicalMapping: 'Cosmological Mapping',
  cosmologicalContext: 'Cosmological Context',
  resonanceDetection: 'Resonance Detection',
  diagonalPaths: 'Portal Day Diagonal Paths',
  
  // Manifold
  torusManifold: 'Torus Manifold',
  manifoldView: 'Manifold View',
  
  // Resonance panel
  detectResonance: 'Detect Resonance',
  resonatingTiles: 'Resonating Tiles',
  resonanceLabel: 'resonance',
  clickToPlayTone: '(click to play tone)',
  patternArchetype: '',
};

const PROFESSIONAL_TERMINOLOGY: CosmologicalTerminology = {
  // Tzolkin → Sync
  tzolkin: 'Sync Calendar',
  tzolkinKin: 'Sync Day',
  tzolkinResonance: 'Pattern Sync Detection',
  portalDay: 'Sync Day',
  portalDays: 'Sync Days',
  galacticActivationPortal: 'Cross-Team Sync Point',
  solarSeal: 'Pattern Archetype',
  galacticTone: 'Iteration Rhythm',
  galacticAffirmation: 'Team Alignment Statement',
  
  // Hexagram → Wild Guess
  hexagram: 'Wild Guess',
  hexagramOracle: 'Wild Guess Generator',
  iChing: 'Pattern Library',
  castTheOracle: 'Generate Wild Guess',
  consultingTheOracle: 'Generating insights...',
  
  // Wavespell & Castle
  wavespell: 'Sprint Wave',
  castle: 'Quarter',
  
  // Cosmological → Pattern
  cosmologicalMapping: 'Pattern Mapping',
  cosmologicalContext: 'Pattern Context',
  resonanceDetection: 'Pattern Match Detection',
  diagonalPaths: 'Cross-Functional Paths',
  
  // Manifold - same
  torusManifold: 'Insight Manifold',
  manifoldView: 'Manifold View',
  
  // Resonance panel
  detectResonance: 'Detect Pattern Match',
  resonatingTiles: 'Matching Patterns',
  resonanceLabel: 'match',
  clickToPlayTone: '(click to preview)',
  patternArchetype: ' Pattern',
};

export const getTerminology = (mode: ModeType): CosmologicalTerminology => {
  return mode === 'professional' ? PROFESSIONAL_TERMINOLOGY : PERSONAL_TERMINOLOGY;
};

// Hook-friendly accessor
export const useModeTerminology = (mode: ModeType) => {
  return getTerminology(mode);
};

// Helper for common term lookups
export const getTerm = (mode: ModeType, key: keyof CosmologicalTerminology): string => {
  return getTerminology(mode)[key];
};
