import { useState, useEffect, useCallback } from 'react';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface SeasonPersistenceState {
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  completedSeasons: Season[];
  prdId: string | null;
  journeyStarted: boolean;
  journeyPath: Array<{ row: number; col: number }>;
}

interface StoredState {
  currentSeason: Season;
  seasonProgress: Record<Season, string[]>;
  completedSeasons: Season[];
  prdId: string | null;
  journeyStarted: boolean;
  journeyPath: Array<{ row: number; col: number }>;
  lastUpdated: string;
}

const STORAGE_KEY = 'calmMagicBoardProgress';

const defaultState: SeasonPersistenceState = {
  currentSeason: 'POLLENS',
  seasonProgress: {
    POLLENS: new Set(),
    NOEMS: new Set(),
    POEMS: new Set(),
    TOTEMS: new Set(),
    ANTHEMS: new Set(),
  },
  completedSeasons: [],
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
          POLLENS: new Set(parsed.seasonProgress?.POLLENS || []),
          NOEMS: new Set(parsed.seasonProgress?.NOEMS || []),
          POEMS: new Set(parsed.seasonProgress?.POEMS || []),
          TOTEMS: new Set(parsed.seasonProgress?.TOTEMS || []),
          ANTHEMS: new Set(parsed.seasonProgress?.ANTHEMS || []),
        };
        
        setState({
          currentSeason: parsed.currentSeason || 'POLLENS',
          seasonProgress,
          completedSeasons: parsed.completedSeasons || [],
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
          POLLENS: Array.from(newState.seasonProgress.POLLENS),
          NOEMS: Array.from(newState.seasonProgress.NOEMS),
          POEMS: Array.from(newState.seasonProgress.POEMS),
          TOTEMS: Array.from(newState.seasonProgress.TOTEMS),
          ANTHEMS: Array.from(newState.seasonProgress.ANTHEMS),
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
