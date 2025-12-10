import { QuadrantPosition } from '@/types/trajectory';

export interface AssessmentResult {
  dominantAxis: string;
  primaryGarden: string;
  connectorMagnesorType: string;
  vitalityScore: number;
  stabilityScore: number;
  integrationLevel: number;
}

export interface ToleranceMapping {
  initialShadowPosition: QuadrantPosition;
  suggestedHigherSelfPosition: QuadrantPosition;
  startingSeason: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  suggestedCompass: string;
  toleranceZone: 'inner' | 'stretch' | 'outer';
}

/**
 * Maps a dominant axis to an initial quadrant position
 */
const axisToPosition: Record<string, QuadrantPosition> = {
  love: { x: -0.3, y: 0.4 },    // Intimacy-Memory quadrant
  magic: { x: 0.3, y: 0.4 },    // Intimacy-Novelty quadrant  
  calm: { x: -0.3, y: -0.4 },   // Sovereignty-Memory quadrant
  open: { x: 0.3, y: -0.4 },    // Sovereignty-Novelty quadrant
  free: { x: 0, y: 0 }          // Center (integrated)
};

/**
 * Maps garden type to suggested compass
 */
const gardenToCompass: Record<string, string> = {
  intelligence: 'Human Dynamics & Systems',
  systems: 'Workflow',
  prototypes: 'Narrative'
};

/**
 * Maps connector/magnesor type to starting season
 */
const connectorTypeToSeason: Record<string, 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS'> = {
  'Connector': 'POLLENS',
  'Magnesor': 'NOEMS',
  'Transformer': 'POEMS',
  'Integrator': 'TOTEMS',
  'Catalyst': 'ANTHEMS'
};

/**
 * Calculate tolerance zone from integration level
 */
const calculateToleranceZone = (integrationLevel: number): 'inner' | 'stretch' | 'outer' => {
  if (integrationLevel >= 70) return 'outer';
  if (integrationLevel >= 40) return 'stretch';
  return 'inner';
};

/**
 * Calculate suggested Higher Self position based on assessment
 */
const calculateHigherSelfPosition = (
  assessment: AssessmentResult
): QuadrantPosition => {
  // Higher self is typically in the opposite or complementary quadrant
  const basePosition = axisToPosition[assessment.dominantAxis] || { x: 0, y: 0 };
  
  // Suggest movement toward integration (center) but with some stretch
  const stretchFactor = Math.min(assessment.integrationLevel / 100 + 0.3, 0.8);
  
  return {
    x: -basePosition.x * stretchFactor,
    y: basePosition.y * 0.5 // Keep some vertical preference
  };
};

/**
 * Convert ClientNeedsAssessment results to Window of Tolerance initial state
 */
export const convertAssessmentToTolerance = (
  assessment: AssessmentResult
): ToleranceMapping => {
  const initialShadowPosition = axisToPosition[assessment.dominantAxis] || { x: 0, y: 0 };
  
  // Adjust shadow position based on scores
  const vitalityOffset = (assessment.vitalityScore - 50) / 200; // -0.25 to 0.25
  const stabilityOffset = (assessment.stabilityScore - 50) / 200;
  
  const adjustedShadowPosition: QuadrantPosition = {
    x: Math.max(-1, Math.min(1, initialShadowPosition.x + vitalityOffset)),
    y: Math.max(-1, Math.min(1, initialShadowPosition.y + stabilityOffset))
  };

  return {
    initialShadowPosition: adjustedShadowPosition,
    suggestedHigherSelfPosition: calculateHigherSelfPosition(assessment),
    startingSeason: connectorTypeToSeason[assessment.connectorMagnesorType] || 'POLLENS',
    suggestedCompass: gardenToCompass[assessment.primaryGarden] || 'Narrative',
    toleranceZone: calculateToleranceZone(assessment.integrationLevel)
  };
};

/**
 * Generate URL params for Board entry with assessment context
 */
export const generateBoardEntryParams = (
  assessment: AssessmentResult,
  mode: 'personal' | 'professional'
): string => {
  const mapping = convertAssessmentToTolerance(assessment);
  
  const params = new URLSearchParams({
    mode,
    shadowX: mapping.initialShadowPosition.x.toFixed(2),
    shadowY: mapping.initialShadowPosition.y.toFixed(2),
    higherX: mapping.suggestedHigherSelfPosition.x.toFixed(2),
    higherY: mapping.suggestedHigherSelfPosition.y.toFixed(2),
    season: mapping.startingSeason,
    compass: mapping.suggestedCompass,
    zone: mapping.toleranceZone,
    dominantAxis: assessment.dominantAxis,
    garden: assessment.primaryGarden
  });
  
  return params.toString();
};
