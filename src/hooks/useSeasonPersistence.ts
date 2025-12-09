import { useState, useEffect, useCallback } from 'react';

type Season = 'POLLEN' | 'POEM' | 'TOTEM' | 'ANTHEM';

interface SeasonPersistenceState {
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  completedSeasons: Season[];
  freeTilesUnlocked: boolean;
  prdId: string | null;
  journeyStarted: boolean;
  journeyPath: Array<{ row: number; col: number }>;
}

interface StoredState {
  currentSeason: Season;
  seasonProgress: Record<Season, string[]>;
  completedSeasons: Season[];
  freeTilesUnlocked: boolean;
  prdId: string | null;
  journeyStarted: boolean;
  journeyPath: Array<{ row: number; col: number }>;
  lastUpdated: string;
}

const STORAGE_KEY = 'calmMagicBoardProgress';

const defaultState: SeasonPersistenceState = {
  currentSeason: 'POLLEN',
  seasonProgress: {
    POLLEN: new Set(),
    POEM: new Set(),
    TOTEM: new Set(),
    ANTHEM: new Set(),
  },
  completedSeasons: [],
  freeTilesUnlocked: false,
  prdId: null,
  journeyStarted: false,
  journeyPath: [],
};

export const useSeasonPersistence = () => {
  const [state, setState] = useState<SeasonPersistenceState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredState = JSON.parse(stored);
        
        // Convert arrays back to Sets
        const seasonProgress: Record<Season, Set<string>> = {
          POLLEN: new Set(parsed.seasonProgress?.POLLEN || []),
          POEM: new Set(parsed.seasonProgress?.POEM || []),
          TOTEM: new Set(parsed.seasonProgress?.TOTEM || []),
          ANTHEM: new Set(parsed.seasonProgress?.ANTHEM || []),
        };
        
        setState({
          currentSeason: parsed.currentSeason || 'POLLEN',
          seasonProgress,
          completedSeasons: parsed.completedSeasons || [],
          freeTilesUnlocked: parsed.freeTilesUnlocked || false,
          prdId: parsed.prdId || null,
          journeyStarted: parsed.journeyStarted || false,
          journeyPath: parsed.journeyPath || [],
        });
      }
    } catch (e) {
      console.error('Failed to load season progress:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((newState: SeasonPersistenceState) => {
    try {
      const toStore: StoredState = {
        currentSeason: newState.currentSeason,
        seasonProgress: {
          POLLEN: Array.from(newState.seasonProgress.POLLEN),
          POEM: Array.from(newState.seasonProgress.POEM),
          TOTEM: Array.from(newState.seasonProgress.TOTEM),
          ANTHEM: Array.from(newState.seasonProgress.ANTHEM),
        },
        completedSeasons: newState.completedSeasons,
        freeTilesUnlocked: newState.freeTilesUnlocked,
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
