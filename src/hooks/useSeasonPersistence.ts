import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

// Old season names for migration
type OldSeason = 'POLLEN' | 'POEM' | 'TOTEM' | 'ANTHEM';
const OLD_TO_NEW_SEASON: Record<OldSeason, Season> = {
  'POLLEN': 'POLLENS',
  'POEM': 'POEMS',
  'TOTEM': 'TOTEMS',
  'ANTHEM': 'ANTHEMS',
};

export interface SeasonPersistenceState {
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  completedSeasons: Season[];
  prdId: string | null;
  journeyStarted: boolean;
  journeyPath: Array<{ row: number; col: number }>;
}

interface StoredState {
  currentSeason: string;
  seasonProgress: Record<string, string[]>;
  completedSeasons: string[];
  prdId: string | null;
  journeyStarted: boolean;
  journeyPath: Array<{ row: number; col: number }>;
  lastUpdated: string;
}

const LEGACY_STORAGE_KEY = 'calmMagicBoardProgress';
const getStorageKey = (projectId: string | null) => 
  projectId ? `calmMagicBoardProgress-${projectId}` : LEGACY_STORAGE_KEY;

const createEmptyProgress = (): Record<Season, Set<string>> => ({
  POLLENS: new Set(),
  NOEMS: new Set(),
  POEMS: new Set(),
  TOTEMS: new Set(),
  ANTHEMS: new Set(),
});

const defaultState: SeasonPersistenceState = {
  currentSeason: 'POLLENS',
  seasonProgress: createEmptyProgress(),
  completedSeasons: [],
  prdId: null,
  journeyStarted: false,
  journeyPath: [],
};

// Migrate old season name to new
const migrateSeason = (season: string): Season => {
  if (season in OLD_TO_NEW_SEASON) {
    return OLD_TO_NEW_SEASON[season as OldSeason];
  }
  if (['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'].includes(season)) {
    return season as Season;
  }
  return 'POLLENS';
};

// Season context mapping for POLEN entries
const SEASON_CONTEXT_MAP: Record<string, Season> = {
  'LOVE': 'POLLENS',
  'MAGIC': 'NOEMS', 
  'CALM': 'POEMS',
  'OPEN': 'TOTEMS',
  'FREE': 'ANTHEMS',
  'POLLENS': 'POLLENS',
  'NOEMS': 'NOEMS',
  'POEMS': 'POEMS',
  'TOTEMS': 'TOTEMS',
  'ANTHEMS': 'ANTHEMS',
};

// Convert state to DB format
const stateToDb = (state: SeasonPersistenceState) => ({
  current_season: state.currentSeason,
  season_progress: {
    POLLENS: Array.from(state.seasonProgress.POLLENS || []),
    NOEMS: Array.from(state.seasonProgress.NOEMS || []),
    POEMS: Array.from(state.seasonProgress.POEMS || []),
    TOTEMS: Array.from(state.seasonProgress.TOTEMS || []),
    ANTHEMS: Array.from(state.seasonProgress.ANTHEMS || []),
  },
  completed_seasons: state.completedSeasons,
  prd_id: state.prdId,
  journey_started: state.journeyStarted,
  journey_path: state.journeyPath,
});

// Convert DB row to state
const dbToState = (row: any): SeasonPersistenceState => {
  const seasonProgress = createEmptyProgress();
  const dbProgress = row.season_progress || {};
  
  Object.entries(dbProgress).forEach(([key, tiles]) => {
    const season = migrateSeason(key);
    if (tiles && Array.isArray(tiles)) {
      seasonProgress[season] = new Set(tiles as string[]);
    }
  });

  return {
    currentSeason: migrateSeason(row.current_season || 'POLLENS'),
    seasonProgress,
    completedSeasons: (row.completed_seasons || []).map((s: string) => migrateSeason(s)),
    prdId: row.prd_id || null,
    journeyStarted: row.journey_started || false,
    journeyPath: row.journey_path || [],
  };
};

// Recovery result type
interface RecoveryResult {
  progress: Record<Season, Set<string>>;
  journeyPath: Array<{ row: number; col: number }>;
}

// Recover progress from POLEN entries
async function recoverProgressFromPolen(userId: string, projectId: string): Promise<RecoveryResult> {
  const progress = createEmptyProgress();
  const journeyPath: Array<{ row: number; col: number }> = [];
  const seenTiles = new Set<string>();
  
  try {
    // Fetch all POLEN entries for the user, ordered by creation date
    const { data: polenEntries, error } = await supabase
      .from('polen_entries')
      .select('tile_id, season_context, created_at')
      .eq('user_id', userId)
      .not('tile_id', 'is', null)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch POLEN entries for recovery:', error);
      return { progress, journeyPath };
    }

    if (!polenEntries || polenEntries.length === 0) {
      return { progress, journeyPath };
    }

    // Group tiles by season and build journey path
    polenEntries.forEach(entry => {
      if (entry.tile_id) {
        // Convert tile_id to row-col format (tile_id is 1-indexed, 8x8 grid)
        const tileId = Number(entry.tile_id);
        
        // Validate tileId is a valid number between 1-64
        if (isNaN(tileId) || tileId < 1 || tileId > 64) {
          console.warn('Invalid tile_id in POLEN entry, skipping:', entry.tile_id);
          return; // Skip this entry
        }
        
        const row = Math.floor((tileId - 1) / 8);
        const col = (tileId - 1) % 8;
        
        // Extra validation for row/col bounds
        if (row < 0 || row > 7 || col < 0 || col > 7) {
          console.warn('Calculated row/col out of bounds, skipping:', { tileId, row, col });
          return;
        }
        
        const tileKey = `${row}-${col}`; // FIX: Use row-col format to match MinimalistTileMatrix
        
        const seasonContext = entry.season_context?.toUpperCase() || 'POLLENS';
        const season = SEASON_CONTEXT_MAP[seasonContext] || 'POLLENS';
        progress[season].add(tileKey);
        
        // Build journey path - only add each tile once, in order of first visit
        if (!seenTiles.has(tileKey)) {
          seenTiles.add(tileKey);
          journeyPath.push({ row, col });
        }
      }
    });

    console.log('Recovered progress from POLEN entries:', {
      POLLENS: progress.POLLENS.size,
      NOEMS: progress.NOEMS.size,
      POEMS: progress.POEMS.size,
      TOTEMS: progress.TOTEMS.size,
      ANTHEMS: progress.ANTHEMS.size,
      journeyPathLength: journeyPath.length,
    });

  } catch (e) {
    console.error('Error recovering progress from POLEN:', e);
  }

  return { progress, journeyPath };
}

// Helper to get progress for a specific project (for dashboard)
export const getProjectSeasonProgress = (projectId: string): SeasonPersistenceState | null => {
  try {
    const stored = localStorage.getItem(getStorageKey(projectId));
    if (!stored) return null;
    
    const parsed: StoredState = JSON.parse(stored);
    const seasonProgress = createEmptyProgress();
    
    if (parsed.seasonProgress) {
      Object.entries(parsed.seasonProgress).forEach(([key, tiles]) => {
        const newKey = migrateSeason(key);
        if (tiles && Array.isArray(tiles)) {
          seasonProgress[newKey] = new Set(tiles);
        }
      });
    }
    
    return {
      currentSeason: migrateSeason(parsed.currentSeason || 'POLLENS'),
      seasonProgress,
      completedSeasons: (parsed.completedSeasons || []).map(s => migrateSeason(s)),
      prdId: parsed.prdId || null,
      journeyStarted: parsed.journeyStarted || false,
      journeyPath: parsed.journeyPath || [],
    };
  } catch {
    return null;
  }
};

// Async version that checks Supabase first
export const getProjectSeasonProgressAsync = async (projectId: string, userId?: string): Promise<SeasonPersistenceState | null> => {
  // Try Supabase first if user is logged in
  if (userId) {
    try {
      const { data, error } = await supabase
        .from('project_season_progress')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        return dbToState(data);
      }
    } catch (e) {
      console.error('Error fetching from Supabase:', e);
    }
  }

  // Fallback to localStorage
  return getProjectSeasonProgress(projectId);
};

export const useSeasonPersistence = (projectId: string | null = null) => {
  const STORAGE_KEY = getStorageKey(projectId);
  const [state, setState] = useState<SeasonPersistenceState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Load from Supabase or localStorage on mount
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const loadProgress = async () => {
      setIsLoading(true);
      
      // Try Supabase first if logged in
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('project_season_progress')
            .select('*')
            .eq('project_id', projectId)
            .eq('user_id', userId)
            .maybeSingle();

          if (!error && data) {
            const loadedState = dbToState(data);
            
            // Check if we should recover from POLEN entries
            const totalTiles = Object.values(loadedState.seasonProgress)
              .reduce((sum, set) => sum + set.size, 0);
            const hasJourneyPath = loadedState.journeyPath.length > 0;
            
            // Distinguish between fresh season start vs corrupted/missing data
            // Fresh season start: journeyStarted is false AND journeyPath is empty (intentional)
            // Corrupted data: has some progress but missing journey path
            const isFreshSeasonStart = !loadedState.journeyStarted && loadedState.journeyPath.length === 0;
            const hasExistingProgress = totalTiles > 0;
            
            // Only recover if data seems corrupted (has progress but missing path)
            // NOT when it's a fresh season start
            const shouldRecover = !isFreshSeasonStart && (totalTiles === 0 || (!hasJourneyPath && hasExistingProgress));
            
            if (shouldRecover) {
              // No progress saved or missing journey path, try to recover from POLEN entries
              const recovered = await recoverProgressFromPolen(userId, projectId);
              const recoveredTotal = Object.values(recovered.progress)
                .reduce((sum, set) => sum + set.size, 0);
              
              if (recoveredTotal > 0) {
                loadedState.seasonProgress = recovered.progress;
                if (!hasJourneyPath && recovered.journeyPath.length > 0) {
                  loadedState.journeyPath = recovered.journeyPath;
                  loadedState.journeyStarted = true;
                }
                // Save recovered progress
                await supabase
                  .from('project_season_progress')
                  .update(stateToDb(loadedState))
                  .eq('project_id', projectId)
                  .eq('user_id', userId);
              }
            }
            
            setState(loadedState);
            // Also update localStorage as cache
            saveToLocalStorage(loadedState);
            setIsLoading(false);
            return;
          }

          // No record in DB, check localStorage and migrate
          const localState = getProjectSeasonProgress(projectId);
          
          // Also try to recover from POLEN entries
          const recovered = await recoverProgressFromPolen(userId, projectId);
          const recoveredTotal = Object.values(recovered.progress)
            .reduce((sum, set) => sum + set.size, 0);
          
          // Merge local state with recovered progress
          const mergedState: SeasonPersistenceState = localState || { ...defaultState };
          if (recoveredTotal > 0) {
            Object.keys(recovered.progress).forEach(key => {
              const season = key as Season;
              recovered.progress[season].forEach(tile => {
                mergedState.seasonProgress[season].add(tile);
              });
            });
            // Use recovered journey path if local doesn't have one
            if (mergedState.journeyPath.length === 0 && recovered.journeyPath.length > 0) {
              mergedState.journeyPath = recovered.journeyPath;
              mergedState.journeyStarted = true;
            }
          }
          
          // Create record in Supabase
          const { error: insertError } = await supabase
            .from('project_season_progress')
            .insert({
              project_id: projectId,
              user_id: userId,
              ...stateToDb(mergedState),
            });

          if (!insertError) {
            setState(mergedState);
            saveToLocalStorage(mergedState);
          }
          
        } catch (e) {
          console.error('Error loading from Supabase:', e);
          // Fallback to localStorage
          const localState = getProjectSeasonProgress(projectId);
          if (localState) {
            setState(localState);
          }
        }
      } else {
        // Not logged in, use localStorage only
        const localState = getProjectSeasonProgress(projectId);
        if (localState) {
          setState(localState);
        }
      }
      
      setIsLoading(false);
    };

    loadProgress();
  }, [projectId, userId, STORAGE_KEY]);

  // Save to localStorage
  const saveToLocalStorage = useCallback((newState: SeasonPersistenceState) => {
    if (!projectId) return;
    
    try {
      const toStore: StoredState = {
        currentSeason: newState.currentSeason,
        seasonProgress: {
          POLLENS: Array.from(newState.seasonProgress.POLLENS || []),
          NOEMS: Array.from(newState.seasonProgress.NOEMS || []),
          POEMS: Array.from(newState.seasonProgress.POEMS || []),
          TOTEMS: Array.from(newState.seasonProgress.TOTEMS || []),
          ANTHEMS: Array.from(newState.seasonProgress.ANTHEMS || []),
        },
        completedSeasons: newState.completedSeasons,
        prdId: newState.prdId,
        journeyStarted: newState.journeyStarted,
        journeyPath: newState.journeyPath,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [projectId, STORAGE_KEY]);

  // Save to Supabase
  const saveToSupabase = useCallback(async (newState: SeasonPersistenceState) => {
    if (!projectId || !userId) return;

    try {
      const { error } = await supabase
        .from('project_season_progress')
        .upsert({
          project_id: projectId,
          user_id: userId,
          ...stateToDb(newState),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'project_id,user_id',
        });

      if (error) {
        console.error('Failed to save to Supabase:', error);
      }
    } catch (e) {
      console.error('Error saving to Supabase:', e);
    }
  }, [projectId, userId]);

  // Update state and persist
  const updateProgress = useCallback((updates: Partial<SeasonPersistenceState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      saveToLocalStorage(newState);
      saveToSupabase(newState);
      return newState;
    });
  }, [saveToLocalStorage, saveToSupabase]);

  // Reset all progress
  const resetProgress = useCallback(async () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    
    if (projectId && userId) {
      try {
        await supabase
          .from('project_season_progress')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', userId);
      } catch (e) {
        console.error('Error deleting from Supabase:', e);
      }
    }
  }, [projectId, userId, STORAGE_KEY]);

  // Force recovery from POLEN entries
  const recoverFromPolen = useCallback(async () => {
    if (!projectId || !userId) return;
    
    setIsLoading(true);
    const recovered = await recoverProgressFromPolen(userId, projectId);
    
    setState(prev => {
      const mergedProgress = { ...prev.seasonProgress };
      Object.keys(recovered.progress).forEach(key => {
        const season = key as Season;
        recovered.progress[season].forEach(tile => {
          mergedProgress[season].add(tile);
        });
      });
      
      const newState = { 
        ...prev, 
        seasonProgress: mergedProgress,
        // Use recovered journey path if current is empty
        journeyPath: prev.journeyPath.length > 0 ? prev.journeyPath : recovered.journeyPath,
        journeyStarted: prev.journeyStarted || recovered.journeyPath.length > 0,
      };
      saveToLocalStorage(newState);
      saveToSupabase(newState);
      return newState;
    });
    
    setIsLoading(false);
  }, [projectId, userId, saveToLocalStorage, saveToSupabase]);

  return {
    ...state,
    updateProgress,
    resetProgress,
    recoverFromPolen,
    isLoading,
  };
};
