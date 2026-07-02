import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  RingLevel, 
  getCurrentUnlockedRing, 
  detectRingPattern,
  RING_DEFINITIONS,
  canAccessTile as checkTileAccess
} from '@/utils/ringToleranceSystem';
import { DetectedPattern } from '@/utils/patternDetection';
import { useToast } from '@/hooks/use-toast';

interface UseRingToleranceProps {
  userId?: string;
  cycleId?: string;
  visitedTiles: Set<string>;
}

interface RingUnlockEvent {
  ring: RingLevel;
  pattern: DetectedPattern;
  timestamp: Date;
}

export function useRingTolerance({ userId, cycleId, visitedTiles }: UseRingToleranceProps) {
  const [unlockedRing, setUnlockedRing] = useState<RingLevel>(1);
  const [unlockEvents, setUnlockEvents] = useState<RingUnlockEvent[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  // Check for ring unlocks whenever visited tiles change
  useEffect(() => {
    const newUnlockedRing = getCurrentUnlockedRing(visitedTiles);
    
    if (newUnlockedRing > unlockedRing) {
      // A new ring has been unlocked!
      const pattern = detectRingPattern(visitedTiles, unlockedRing);
      if (pattern) {
        handleRingUnlock(newUnlockedRing, pattern);
      }
    }
    
    setUnlockedRing(newUnlockedRing);
  }, [visitedTiles]);

  // Handle ring unlock - log event and update database
  const handleRingUnlock = useCallback(async (ring: RingLevel, pattern: DetectedPattern) => {
    const ringDef = RING_DEFINITIONS.find(d => d.ring === ring - 1); // Get the ring that was just completed
    
    // Add to local events
    const event: RingUnlockEvent = {
      ring: ring - 1 as RingLevel,
      pattern,
      timestamp: new Date()
    };
    setUnlockEvents(prev => [...prev, event]);

    // Show toast notification
    toast({
      title: `🎉 Ring ${ring - 1} Unlocked!`,
      description: ringDef 
        ? `${pattern.name} pattern detected. ${ringDef.wisdom}`
        : `Pattern detected: ${pattern.name}`,
    });

    // Persist to database if user is logged in
    if (userId && cycleId) {
      try {
        await supabase.from('tolerance_expansion_events').insert({
          user_id: userId,
          cycle_id: cycleId,
          previous_inner: ring - 1,
          new_inner: ring,
          trigger_tile_id: pattern.tiles[0] ? parseInt(pattern.tiles[0].replace('-', '')) : null,
          reflection: `${pattern.type} pattern "${pattern.name}" unlocked Ring ${ring}. ${pattern.meaning}`
        });

        // Update journal_cycles with new zone
        const newZone = ring >= 3 ? 'outer' : ring >= 2 ? 'stretch' : 'inner';
        await supabase
          .from('journal_cycles')
          .update({
            current_zone: newZone,
            inner_radius: ring,
            stretch_radius: Math.min(ring + 1, 4)
          })
          .eq('id', cycleId);
      } catch (error) {
        console.error('Failed to persist ring unlock:', error);
      }
    }
  }, [userId, cycleId, toast]);

  // Check if a specific tile can be accessed
  const canAccessTile = useCallback((row: number, col: number): boolean => {
    return checkTileAccess(row, col, unlockedRing);
  }, [unlockedRing]);

  // Get current ring progress
  const getRingProgress = useCallback((ring: RingLevel): number => {
    const ringDef = RING_DEFINITIONS.find(d => d.ring === ring);
    if (!ringDef) return 0;
    
    const visited = ringDef.tiles.filter(t => visitedTiles.has(t)).length;
    return Math.round((visited / ringDef.tiles.length) * 100);
  }, [visitedTiles]);

  // Check if pattern is detected for a ring
  const isPatternDetected = useCallback((ring: RingLevel): boolean => {
    return detectRingPattern(visitedTiles, ring) !== null;
  }, [visitedTiles]);

  return {
    unlockedRing,
    unlockEvents,
    isChecking,
    canAccessTile,
    getRingProgress,
    isPatternDetected,
    handleRingUnlock
  };
}

export default useRingTolerance;
