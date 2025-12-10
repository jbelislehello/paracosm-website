import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SeasonQualities, 
  QuadrantPosition, 
  TrajectoryEvent, 
  TrajectoryState,
  TrajectoryEventType,
  Season,
  SEASON_QUALITY_MAP
} from '@/types/trajectory';

const STORAGE_KEY = 'calmMagicTrajectory';

const defaultQualities: SeasonQualities = {
  vitality: 0,
  spaciousness: 0,
  wholeness: 0,
  openness: 0,
  expansion: 0,
};

const defaultTrajectoryState: TrajectoryState = {
  higher_self_position: null,
  higher_self_quadrant: null,
  prophecy_reflection: null,
  prophecy_set_at: null,
  trajectory_log: [],
  last_shadow_position: { x: 0, y: 0 },
};

// Calculate shadow position from season qualities
export function calculateShadowPosition(qualities: SeasonQualities): QuadrantPosition {
  // X-axis: Memory (-1) to Novelty (+1)
  // Higher MAGIC/OPEN/FREE → Novelty
  // Higher LOVE/CALM → Memory
  const noveltyWeight = (qualities.spaciousness + qualities.openness + qualities.expansion) / 3;
  const memoryWeight = (qualities.vitality + qualities.wholeness) / 2;
  const x = ((noveltyWeight - memoryWeight) / 100) * 2; // Scale to -1 to +1
  
  // Y-axis: Intimacy (-1) to Sovereignty (+1)
  // Higher CALM/OPEN → Sovereignty
  // Higher LOVE/MAGIC → Intimacy
  const sovereigntyWeight = (qualities.wholeness + qualities.openness) / 2;
  const intimacyWeight = (qualities.vitality + qualities.spaciousness) / 2;
  const y = ((sovereigntyWeight - intimacyWeight) / 100) * 2;
  
  return { 
    x: Math.max(-1, Math.min(1, x)), 
    y: Math.max(-1, Math.min(1, y)) 
  };
}

// Get quadrant from position
export function getQuadrantFromPosition(pos: QuadrantPosition): 'SN' | 'IN' | 'IM' | 'SM' {
  if (pos.x >= 0 && pos.y >= 0) return 'SN'; // Sovereignty + Novelty
  if (pos.x < 0 && pos.y >= 0) return 'SM';  // Sovereignty + Memory
  if (pos.x < 0 && pos.y < 0) return 'IM';   // Intimacy + Memory
  return 'IN'; // Intimacy + Novelty
}

export function useQuadrantDynamics(
  seasonProgress: Record<Season, Set<string>>,
  currentSeason: Season
) {
  const [trajectoryState, setTrajectoryState] = useState<TrajectoryState>(defaultTrajectoryState);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTrajectoryState(parsed);
      }
    } catch (e) {
      console.error('Failed to load trajectory state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((state: TrajectoryState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save trajectory state:', e);
    }
  }, []);

  // Calculate season qualities from progress
  const seasonQualities = useMemo((): SeasonQualities => {
    return {
      vitality: Math.round((seasonProgress.POLLENS?.size || 0) / 64 * 100),
      spaciousness: Math.round((seasonProgress.NOEMS?.size || 0) / 64 * 100),
      wholeness: Math.round((seasonProgress.POEMS?.size || 0) / 64 * 100),
      openness: Math.round((seasonProgress.TOTEMS?.size || 0) / 64 * 100),
      expansion: Math.round((seasonProgress.ANTHEMS?.size || 0) / 64 * 100),
    };
  }, [seasonProgress]);

  // Calculate current shadow position
  const shadowPosition = useMemo(() => {
    return calculateShadowPosition(seasonQualities);
  }, [seasonQualities]);

  // Get current shadow quadrant
  const shadowQuadrant = useMemo(() => {
    return getQuadrantFromPosition(shadowPosition);
  }, [shadowPosition]);

  // Set higher self prophecy
  const setProphecy = useCallback((
    position: QuadrantPosition, 
    reflection?: string
  ) => {
    const quadrant = getQuadrantFromPosition(position);
    const newState: TrajectoryState = {
      ...trajectoryState,
      higher_self_position: position,
      higher_self_quadrant: quadrant,
      prophecy_reflection: reflection || null,
      prophecy_set_at: new Date().toISOString(),
    };
    
    // Add prophecy event to log
    const event: TrajectoryEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event_type: 'prophecy_set',
      shadow_position: shadowPosition,
      season: currentSeason,
      quality_snapshot: { ...seasonQualities },
      note: reflection,
    };
    newState.trajectory_log = [...newState.trajectory_log, event];
    
    setTrajectoryState(newState);
    saveToStorage(newState);
  }, [trajectoryState, shadowPosition, currentSeason, seasonQualities, saveToStorage]);

  // Log trajectory event
  const logTrajectoryEvent = useCallback((
    eventType: TrajectoryEventType,
    tileId?: number,
    note?: string
  ) => {
    const event: TrajectoryEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event_type: eventType,
      shadow_position: shadowPosition,
      season: currentSeason,
      tile_id: tileId,
      quality_snapshot: { ...seasonQualities },
      note,
    };
    
    const newState: TrajectoryState = {
      ...trajectoryState,
      trajectory_log: [...trajectoryState.trajectory_log, event],
      last_shadow_position: shadowPosition,
    };
    
    setTrajectoryState(newState);
    saveToStorage(newState);
  }, [trajectoryState, shadowPosition, currentSeason, seasonQualities, saveToStorage]);

  // Reset trajectory
  const resetTrajectory = useCallback(() => {
    setTrajectoryState(defaultTrajectoryState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // State
    trajectoryState,
    seasonQualities,
    shadowPosition,
    shadowQuadrant,
    higherSelfPosition: trajectoryState.higher_self_position,
    higherSelfQuadrant: trajectoryState.higher_self_quadrant,
    prophecyReflection: trajectoryState.prophecy_reflection,
    trajectoryLog: trajectoryState.trajectory_log,
    isLoading,
    
    // Actions
    setProphecy,
    logTrajectoryEvent,
    resetTrajectory,
  };
}
