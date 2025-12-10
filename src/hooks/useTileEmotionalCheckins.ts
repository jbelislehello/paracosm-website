import { useState, useEffect, useCallback } from 'react';
import { EmotionalCheckInData, FeltState, EmotionalAxes } from '@/types/trajectory';

const STORAGE_KEY = 'calmMagicEmotionalCheckins';

export function useTileEmotionalCheckins() {
  const [checkins, setCheckins] = useState<Record<number, EmotionalCheckInData[]>>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCheckins(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load emotional checkins:', e);
    }
  }, []);

  // Save to localStorage
  const saveCheckins = useCallback((newCheckins: Record<number, EmotionalCheckInData[]>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCheckins));
      setCheckins(newCheckins);
    } catch (e) {
      console.error('Failed to save emotional checkins:', e);
    }
  }, []);

  // Add a check-in for a tile
  const addCheckin = useCallback((
    tileId: number,
    feltState: FeltState,
    axes: EmotionalAxes,
    note?: string
  ): EmotionalCheckInData => {
    const checkin: EmotionalCheckInData = {
      id: crypto.randomUUID(),
      tile_id: tileId,
      timestamp: new Date().toISOString(),
      felt_state: feltState,
      axes,
      note,
    };

    const tileCheckins = checkins[tileId] || [];
    const newCheckins = {
      ...checkins,
      [tileId]: [...tileCheckins, checkin],
    };

    saveCheckins(newCheckins);
    return checkin;
  }, [checkins, saveCheckins]);

  // Get check-ins for a specific tile
  const getCheckins = useCallback((tileId: number): EmotionalCheckInData[] => {
    return checkins[tileId] || [];
  }, [checkins]);

  // Check if tile has any check-ins
  const hasCheckin = useCallback((tileId: number): boolean => {
    return (checkins[tileId]?.length || 0) > 0;
  }, [checkins]);

  // Get the most recent check-in for a tile
  const getLatestCheckin = useCallback((tileId: number): EmotionalCheckInData | null => {
    const tileCheckins = checkins[tileId] || [];
    return tileCheckins.length > 0 ? tileCheckins[tileCheckins.length - 1] : null;
  }, [checkins]);

  // Get all check-ins across all tiles
  const getAllCheckins = useCallback((): EmotionalCheckInData[] => {
    return Object.values(checkins).flat().sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [checkins]);

  // Calculate average emotional state across all tiles
  const getAverageAxes = useCallback((): EmotionalAxes | null => {
    const all = getAllCheckins();
    if (all.length === 0) return null;

    const totals = all.reduce(
      (acc, c) => ({
        love: acc.love + c.axes.love,
        magic: acc.magic + c.axes.magic,
        calm: acc.calm + c.axes.calm,
        open: acc.open + c.axes.open,
        free: acc.free + c.axes.free,
      }),
      { love: 0, magic: 0, calm: 0, open: 0, free: 0 }
    );

    return {
      love: Math.round(totals.love / all.length),
      magic: Math.round(totals.magic / all.length),
      calm: Math.round(totals.calm / all.length),
      open: Math.round(totals.open / all.length),
      free: Math.round(totals.free / all.length),
    };
  }, [getAllCheckins]);

  // Clear all check-ins
  const clearAllCheckins = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCheckins({});
  }, []);

  return {
    checkins,
    addCheckin,
    getCheckins,
    hasCheckin,
    getLatestCheckin,
    getAllCheckins,
    getAverageAxes,
    clearAllCheckins,
  };
}
