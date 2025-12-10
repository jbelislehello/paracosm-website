import { useState, useEffect, useCallback } from 'react';

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
  // Already new format or fallback
  if (['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'].includes(season)) {
    return season as Season;
  }
  return 'POLLENS';
};

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

export const useSeasonPersistence = (projectId: string | null = null) => {
  const STORAGE_KEY = getStorageKey(projectId);
  const [state, setState] = useState<SeasonPersistenceState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount or when projectId changes
  useEffect(() => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredState = JSON.parse(stored);
        
        // Migrate current season
        const migratedCurrentSeason = migrateSeason(parsed.currentSeason || 'POLLENS');
        
        // Create fresh progress with migrated data
        const seasonProgress = createEmptyProgress();
        
        // Migrate old season progress if exists
        if (parsed.seasonProgress) {
          Object.entries(parsed.seasonProgress).forEach(([key, tiles]) => {
            const newKey = migrateSeason(key);
            if (tiles && Array.isArray(tiles)) {
              seasonProgress[newKey] = new Set(tiles);
            }
          });
        }
        
        // Migrate completed seasons
        const migratedCompletedSeasons = (parsed.completedSeasons || [])
          .map(s => migrateSeason(s))
          .filter((s, i, arr) => arr.indexOf(s) === i); // Remove duplicates
        
        setState({
          currentSeason: migratedCurrentSeason,
          seasonProgress,
          completedSeasons: migratedCompletedSeasons,
          prdId: parsed.prdId || null,
          journeyStarted: parsed.journeyStarted || false,
          journeyPath: parsed.journeyPath || [],
        });
      } else {
        // Reset to default state for new project
        setState(defaultState);
      }
    } catch (e) {
      console.error('Failed to load season progress:', e);
      setState(defaultState);
    } finally {
      setIsLoading(false);
    }
  }, [STORAGE_KEY]);

  // Save to localStorage
  const saveToStorage = useCallback((newState: SeasonPersistenceState) => {
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
      console.error('Failed to save season progress:', e);
    }
  }, []);

  // Update state and persist
  const updateProgress = useCallback((updates: Partial<SeasonPersistenceState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    ...state,
    updateProgress,
    resetProgress,
    isLoading,
  };
};
