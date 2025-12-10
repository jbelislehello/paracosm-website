import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  SeasonQualities, 
  QuadrantPosition, 
  TrajectoryEvent, 
  TrajectoryState,
  TrajectoryEventType,
  Season,
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
  const noveltyWeight = (qualities.spaciousness + qualities.openness + qualities.expansion) / 3;
  const memoryWeight = (qualities.vitality + qualities.wholeness) / 2;
  const x = ((noveltyWeight - memoryWeight) / 100) * 2;
  
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
  if (pos.x >= 0 && pos.y >= 0) return 'SN';
  if (pos.x < 0 && pos.y >= 0) return 'SM';
  if (pos.x < 0 && pos.y < 0) return 'IM';
  return 'IN';
}

export function useQuadrantDynamics(
  seasonProgress: Record<Season, Set<string>>,
  currentSeason: Season
) {
  const [trajectoryState, setTrajectoryState] = useState<TrajectoryState>(defaultTrajectoryState);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Get user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Load from Supabase (with localStorage fallback)
  useEffect(() => {
    const loadTrajectoryState = async () => {
      try {
        // First, try localStorage for immediate display
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setTrajectoryState(parsed);
        }

        // If user is authenticated, fetch from Supabase
        if (userId) {
          // Use type assertion since trajectory_states table is new
          const { data, error } = await (supabase
            .from('trajectory_states' as any) as any)
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching trajectory state:', error);
          } else if (data) {
            const supabaseState: TrajectoryState = {
              higher_self_position: data.higher_self_position as unknown as QuadrantPosition | null,
              higher_self_quadrant: data.higher_self_quadrant as 'SN' | 'IN' | 'IM' | 'SM' | null,
              prophecy_reflection: data.prophecy_reflection,
              prophecy_set_at: data.prophecy_set_at,
              trajectory_log: (data.trajectory_log as unknown as TrajectoryEvent[]) || [],
              last_shadow_position: (data.last_shadow_position as unknown as QuadrantPosition) || { x: 0, y: 0 },
            };
            setTrajectoryState(supabaseState);
            // Update localStorage with Supabase data
            localStorage.setItem(STORAGE_KEY, JSON.stringify(supabaseState));
          }
        }
      } catch (e) {
        console.error('Failed to load trajectory state:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrajectoryState();
  }, [userId]);

  // Save to both localStorage and Supabase
  const saveState = useCallback(async (state: TrajectoryState) => {
    // Always save to localStorage immediately
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // Sync to Supabase if authenticated
    if (userId && !isSyncing) {
      setIsSyncing(true);
      try {
        // Use type assertion since trajectory_states table is new
        const { error } = await (supabase
          .from('trajectory_states' as any) as any)
          .upsert({
            user_id: userId,
            higher_self_position: state.higher_self_position,
            higher_self_quadrant: state.higher_self_quadrant,
            prophecy_reflection: state.prophecy_reflection,
            prophecy_set_at: state.prophecy_set_at,
            trajectory_log: state.trajectory_log,
            last_shadow_position: state.last_shadow_position,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
          });

        if (error) {
          console.error('Failed to sync trajectory to Supabase:', error);
        }
      } catch (e) {
        console.error('Failed to sync trajectory:', e);
      } finally {
        setIsSyncing(false);
      }
    }
  }, [userId, isSyncing]);

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
    saveState(newState);
  }, [trajectoryState, shadowPosition, currentSeason, seasonQualities, saveState]);

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
    saveState(newState);
  }, [trajectoryState, shadowPosition, currentSeason, seasonQualities, saveState]);

  // Reset trajectory
  const resetTrajectory = useCallback(async () => {
    setTrajectoryState(defaultTrajectoryState);
    localStorage.removeItem(STORAGE_KEY);
    
    // Delete from Supabase if authenticated
    if (userId) {
      try {
        // Use type assertion since trajectory_states table is new
        await (supabase
          .from('trajectory_states' as any) as any)
          .delete()
          .eq('user_id', userId);
      } catch (e) {
        console.error('Failed to delete trajectory from Supabase:', e);
      }
    }
  }, [userId]);

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
    isSyncing,
    
    // Actions
    setProphecy,
    logTrajectoryEvent,
    resetTrajectory,
  };
}
