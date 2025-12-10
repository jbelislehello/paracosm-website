import { QuadrantPosition } from '@/types/trajectory';
import { GardenType } from '@/types/journal';

export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
export type ToleranceZone = 'inner' | 'stretch' | 'outer';

export interface BoardEntryParams {
  mode: 'personal' | 'professional' | null;
  shadowPosition: QuadrantPosition | null;
  higherSelfPosition: QuadrantPosition | null;
  startingSeason: Season | null;
  compass: string | null;
  toleranceZone: ToleranceZone | null;
  dominantAxis: string | null;
  garden: GardenType | null;
  projectName: string | null;
  hasAssessmentContext: boolean;
}

/**
 * Parse URL search params from BoardEntryGate navigation
 */
export function parseBoardEntryParams(searchParams: URLSearchParams): BoardEntryParams {
  // Parse mode
  const modeParam = searchParams.get('mode');
  const mode = modeParam === 'personal' || modeParam === 'professional' ? modeParam : null;

  // Parse shadow position
  const shadowX = parseFloat(searchParams.get('shadowX') || '');
  const shadowY = parseFloat(searchParams.get('shadowY') || '');
  const shadowPosition: QuadrantPosition | null = 
    !isNaN(shadowX) && !isNaN(shadowY) 
      ? { x: clamp(shadowX, -1, 1), y: clamp(shadowY, -1, 1) }
      : null;

  // Parse higher self position
  const higherX = parseFloat(searchParams.get('higherX') || '');
  const higherY = parseFloat(searchParams.get('higherY') || '');
  const higherSelfPosition: QuadrantPosition | null = 
    !isNaN(higherX) && !isNaN(higherY)
      ? { x: clamp(higherX, -1, 1), y: clamp(higherY, -1, 1) }
      : null;

  // Parse starting season
  const seasonParam = searchParams.get('season');
  const validSeasons: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
  const startingSeason = validSeasons.includes(seasonParam as Season) 
    ? seasonParam as Season 
    : null;

  // Parse compass
  const compass = searchParams.get('compass');

  // Parse tolerance zone
  const zoneParam = searchParams.get('zone');
  const validZones: ToleranceZone[] = ['inner', 'stretch', 'outer'];
  const toleranceZone = validZones.includes(zoneParam as ToleranceZone)
    ? zoneParam as ToleranceZone
    : null;

  // Parse assessment context
  const dominantAxis = searchParams.get('dominantAxis');
  
  // Parse garden
  const gardenParam = searchParams.get('garden');
  const validGardens: GardenType[] = ['intelligence', 'systems', 'prototypes'];
  const garden = validGardens.includes(gardenParam as GardenType)
    ? gardenParam as GardenType
    : null;

  // Parse project name
  const projectNameParam = searchParams.get('projectName');
  const projectName = projectNameParam ? decodeURIComponent(projectNameParam) : null;

  // Determine if we have meaningful assessment context
  const hasAssessmentContext = !!(
    shadowPosition || 
    higherSelfPosition || 
    startingSeason || 
    dominantAxis || 
    garden ||
    projectName
  );

  return {
    mode,
    shadowPosition,
    higherSelfPosition,
    startingSeason,
    compass,
    toleranceZone,
    dominantAxis,
    garden,
    projectName,
    hasAssessmentContext,
  };
}

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get a friendly description of the assessment context
 */
export function getAssessmentContextDescription(params: BoardEntryParams): string {
  const parts: string[] = [];
  
  if (params.dominantAxis) {
    parts.push(`${params.dominantAxis} focus`);
  }
  
  if (params.garden) {
    parts.push(`${params.garden} garden`);
  }
  
  if (params.startingSeason) {
    parts.push(`starting at ${params.startingSeason}`);
  }
  
  return parts.length > 0 
    ? `Personalized for ${parts.join(', ')}`
    : 'Assessment context applied';
}
