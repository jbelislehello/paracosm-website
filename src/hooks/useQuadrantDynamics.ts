import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  SeasonQualities, 
  QuadrantPosition, 
  TrajectoryEvent, 
  TrajectoryState,
  TrajectoryEventType,
  Season,
  ShadowFactors,
  ShadowNudge,
  FeltState,
  TopologicalSignature,
  QuadrantThemes,
} from '@/types/trajectory';
import { analyzeCoherence, GapInfo } from '@/utils/coherenceAnalysis';

const STORAGE_KEY = 'calmMagicTrajectory';

const defaultQualities: SeasonQualities = {
  vitality: 0,
  spaciousness: 0,
  wholeness: 0,
  openness: 0,
  expansion: 0,
};

const defaultShadowFactors: ShadowFactors = {
  completeness: 0,
  coherence: 0,
  depth: 0,
  flow: 0,
};

const defaultTrajectoryState: TrajectoryState = {
  higher_self_position: null,
  higher_self_quadrant: null,
  prophecy_reflection: null,
  prophecy_set_at: null,
  trajectory_log: [],
  last_shadow_position: { x: 0, y: 0 },
  shadow_nudge: null,
  shadow_factors: defaultShadowFactors,
};

// Calculate base shadow position from season qualities
function calculateBasePosition(qualities: SeasonQualities): QuadrantPosition {
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

// Calculate enhanced shadow position from multiple factors
export function calculateEnhancedShadowPosition(
  factors: ShadowFactors,
  userNudge: ShadowNudge | null
): QuadrantPosition {
  // Map factors to position:
  // - High completeness + coherence → Novelty (explored broadly, connected)
  // - High depth + flow → Sovereignty (engaged deeply, moving well)
  const x = (factors.completeness * 0.5 + factors.coherence * 0.5) * 2 - 1;
  const y = (factors.depth * 0.5 + factors.flow * 0.5) * 2 - 1;
  
  let position = { x, y };
  
  // Apply user nudge (70% system, 30% nudge)
  if (userNudge) {
    position.x = position.x * 0.7 + userNudge.position.x * 0.3;
    position.y = position.y * 0.7 + userNudge.position.y * 0.3;
  }
  
  return {
    x: Math.max(-1, Math.min(1, position.x)),
    y: Math.max(-1, Math.min(1, position.y)),
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
  currentSeason: Season,
  polenCounts: Record<string, number> = {},
  journeyPath: Array<{ row: number; col: number }> = []
) {
  const [trajectoryState, setTrajectoryState] = useState<TrajectoryState>(defaultTrajectoryState);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // New: Topological signature from AI analysis
  const [topologicalSignature, setTopologicalSignature] = useState<TopologicalSignature | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setTrajectoryState({ ...defaultTrajectoryState, ...parsed });
        }

        if (userId) {
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
              shadow_nudge: (data.shadow_nudge as unknown as ShadowNudge) || null,
              shadow_factors: (data.shadow_factors as unknown as ShadowFactors) || defaultShadowFactors,
            };
            setTrajectoryState(supabaseState);
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    if (userId && !isSyncing) {
      setIsSyncing(true);
      try {
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
            shadow_nudge: state.shadow_nudge,
            shadow_factors: state.shadow_factors,
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

  // Calculate shadow factors and gaps from multiple sources
  const { shadowFactors, gaps } = useMemo((): { shadowFactors: ShadowFactors; gaps: GapInfo[] } => {
    const currentSeasonTiles = seasonProgress[currentSeason] || new Set<string>();
    const analysis = analyzeCoherence(currentSeasonTiles, polenCounts, journeyPath);
    
    return {
      shadowFactors: {
        completeness: currentSeasonTiles.size / 64,
        coherence: analysis.score,
        depth: analysis.depth,
        flow: analysis.flow,
      },
      gaps: analysis.gaps,
    };
  }, [seasonProgress, currentSeason, polenCounts, journeyPath]);

  // Calculate current shadow position with factors and nudge
  const shadowPosition = useMemo(() => {
    return calculateEnhancedShadowPosition(shadowFactors, trajectoryState.shadow_nudge);
  }, [shadowFactors, trajectoryState.shadow_nudge]);

  // Get current shadow quadrant
  const shadowQuadrant = useMemo(() => {
    return getQuadrantFromPosition(shadowPosition);
  }, [shadowPosition]);

  // Apply shadow nudge
  const applyShadowNudge = useCallback((
    position: QuadrantPosition,
    feltState: FeltState,
    note: string | null
  ) => {
    const nudge: ShadowNudge = {
      position,
      felt_state: feltState,
      note,
      applied_at: new Date().toISOString(),
    };
    
    const event: TrajectoryEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event_type: 'shadow_nudge',
      shadow_position: calculateEnhancedShadowPosition(shadowFactors, nudge),
      season: currentSeason,
      quality_snapshot: { ...seasonQualities },
      note: note || `Felt state: ${feltState || 'neutral'}`,
    };
    
    const newState: TrajectoryState = {
      ...trajectoryState,
      shadow_nudge: nudge,
      shadow_factors: shadowFactors,
      trajectory_log: [...trajectoryState.trajectory_log, event],
    };
    
    setTrajectoryState(newState);
    saveState(newState);
  }, [trajectoryState, shadowFactors, currentSeason, seasonQualities, saveState]);

  // Reset shadow nudge
  const resetShadowNudge = useCallback(() => {
    const newState: TrajectoryState = {
      ...trajectoryState,
      shadow_nudge: null,
    };
    setTrajectoryState(newState);
    saveState(newState);
  }, [trajectoryState, saveState]);

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
      shadow_factors: shadowFactors,
    };
    
    setTrajectoryState(newState);
    saveState(newState);
  }, [trajectoryState, shadowPosition, currentSeason, seasonQualities, shadowFactors, saveState]);

  // Reset trajectory
  const resetTrajectory = useCallback(async () => {
    setTrajectoryState(defaultTrajectoryState);
    setTopologicalSignature(null);
    localStorage.removeItem(STORAGE_KEY);
    
    if (userId) {
      try {
        await (supabase
          .from('trajectory_states' as any) as any)
          .delete()
          .eq('user_id', userId);
      } catch (e) {
        console.error('Failed to delete trajectory from Supabase:', e);
      }
    }
  }, [userId]);

  // Analyze topology using AI sentiment analysis on POLEN entries
  const analyzeTopology = useCallback(async (polenEntries: Array<{ id: string; content: string; tile_id?: number; season_context?: string; tags?: string[] }>) => {
    if (polenEntries.length === 0) {
      console.log('[useQuadrantDynamics] No POLEN entries to analyze');
      return null;
    }
    
    setIsAnalyzing(true);
    try {
      console.log('[useQuadrantDynamics] Analyzing', polenEntries.length, 'POLEN entries');
      
      const { data, error } = await supabase.functions.invoke('analyze-topology', {
        body: { 
          entries: polenEntries,
          prophecy: trajectoryState.higher_self_position,
          structuralFactors: shadowFactors
        }
      });
      
      if (error) {
        console.error('[useQuadrantDynamics] Analysis error:', error);
        return null;
      }
      
      const signature = data?.signature as TopologicalSignature;
      setTopologicalSignature(signature);
      
      // Auto-log if significant dissonance detected
      if (signature?.dissonanceType === 'contradictory') {
        logTrajectoryEvent('pattern_discovery', undefined, 
          signature.aiNudge || `Dissonance detected: patterns suggest ${signature.inferredQuadrant} while prophecy points to ${trajectoryState.higher_self_quadrant}`
        );
      }
      
      console.log('[useQuadrantDynamics] Analysis complete:', {
        inferredQuadrant: signature?.inferredQuadrant,
        confidence: signature?.confidence,
        dissonanceType: signature?.dissonanceType
      });
      
      return signature;
    } catch (e) {
      console.error('[useQuadrantDynamics] Failed to analyze topology:', e);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [trajectoryState.higher_self_position, trajectoryState.higher_self_quadrant, shadowFactors, logTrajectoryEvent]);

  return {
    // State
    trajectoryState,
    seasonQualities,
    shadowPosition,
    shadowQuadrant,
    shadowFactors,
    gaps,
    higherSelfPosition: trajectoryState.higher_self_position,
    higherSelfQuadrant: trajectoryState.higher_self_quadrant,
    prophecyReflection: trajectoryState.prophecy_reflection,
    shadowNudge: trajectoryState.shadow_nudge,
    trajectoryLog: trajectoryState.trajectory_log,
    isLoading,
    isSyncing,
    
    // New: Topological signature
    topologicalSignature,
    isAnalyzing,
    inferredShadowPosition: topologicalSignature?.inferredPosition || null,
    inferredQuadrant: topologicalSignature?.inferredQuadrant || null,
    dissonanceType: topologicalSignature?.dissonanceType || null,
    dissonanceGap: topologicalSignature?.dissonanceFromProphecy || 0,
    aiNudge: topologicalSignature?.aiNudge || null,
    
    // Actions
    setProphecy,
    applyShadowNudge,
    resetShadowNudge,
    logTrajectoryEvent,
    resetTrajectory,
    analyzeTopology,
  };
}
