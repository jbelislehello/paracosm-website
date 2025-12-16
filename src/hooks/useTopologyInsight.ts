import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TopologyViewMode } from '@/components/calm-magic/topologies/ViewModeSelector';
import { ConsciousnessGeometryExport } from '@/utils/consciousnessGeometry';

export interface StoryChapter {
  title: string;
  content: string;
  discovery_type: 'pattern' | 'strength' | 'shadow' | 'gap';
}

export interface ConcreteInsight {
  dailyQuestion: string;
  viewPurpose: string;
  actionableInsight: string;
  warningSignal: string | null;
  celebrationSignal: string | null;
}

// Wonder-inducing insight structure
export interface WonderInsight {
  opening_wonder: string;
  shadow_higher_self_insight: string;
  tile_position_meaning: string;
  prd_connection: string;
  invitation_to_wonder: string;
  consciousness_emergence?: string;
}

export interface TopologyStory {
  viewMode: TopologyViewMode;
  storyTitle: string;
  mysteryType: string;
  concreteInsight: ConcreteInsight;
  // Wonder-inducing fields
  wonderInsight?: WonderInsight;
  // Legacy fields (still supported)
  opening_mystery?: string;
  chapters?: StoryChapter[];
  key_revelation?: string;
  invitation?: string;
  stats: {
    coverage: number;
    visitedCount: number;
    totalTiles: number;
    currentRing: number;
    pathLength: number;
    gaps?: string[];
    clusters?: string[];
  };
}

interface UseTopologyInsightProps {
  viewMode: TopologyViewMode;
  journeyPath: Array<{ row: number; col: number }>;
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  shadowPosition?: { x: number; y: number };
  higherSelfPosition?: { x: number; y: number };
  currentSeason?: string;
  currentUnlockedRing?: number;
  // Wonder-inducing context
  currentTileRow?: number;
  currentTileCol?: number;
  tileName?: string;
  rowLabel?: string;
  colLabel?: string;
  completedSeasons?: string[];
  prdId?: string | null;
  // Consciousness geometry data
  consciousnessGeometry?: ConsciousnessGeometryExport | null;
}

export function useTopologyInsight() {
  const [story, setStory] = useState<TopologyStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = useCallback(async (props: UseTopologyInsightProps) => {
    const { 
      viewMode, 
      journeyPath, 
      visitedTiles, 
      densityMap, 
      shadowPosition, 
      higherSelfPosition,
      currentSeason,
      currentUnlockedRing,
      // Wonder-inducing context
      currentTileRow,
      currentTileCol,
      tileName,
      rowLabel,
      colLabel,
      completedSeasons,
      prdId
    } = props;

    // Don't fetch if no tiles visited
    if (visitedTiles.size === 0) {
      setStory(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert Set and Map to serializable formats, filtering invalid entries
      const visitedArray = Array.from(visitedTiles).filter(tile => {
        // Validate tile format: should be "row-col" where both are 0-7
        const parts = tile.split('-');
        if (parts.length !== 2) return false;
        const row = parseInt(parts[0], 10);
        const col = parseInt(parts[1], 10);
        return !isNaN(row) && !isNaN(col) && row >= 0 && row <= 7 && col >= 0 && col <= 7;
      });
      
      const densityObj: Record<string, number> = {};
      densityMap.forEach((value, key) => {
        // Also filter density map keys
        const parts = key.split('-');
        if (parts.length === 2) {
          const row = parseInt(parts[0], 10);
          const col = parseInt(parts[1], 10);
          if (!isNaN(row) && !isNaN(col) && row >= 0 && row <= 7 && col >= 0 && col <= 7) {
            densityObj[key] = value;
          }
        }
      });

      const { data, error: fnError } = await supabase.functions.invoke('interpret-topology', {
        body: {
          viewMode,
          journeyPath,
          visitedTiles: visitedArray,
          densityMap: densityObj,
          shadowPosition,
          higherSelfPosition,
          currentSeason,
          currentUnlockedRing,
          // Wonder-inducing context
          currentTileRow,
          currentTileCol,
          tileName,
          rowLabel,
          colLabel,
          completedSeasons,
          prdId,
          // Consciousness geometry data
          consciousnessGeometry: props.consciousnessGeometry
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setStory(data as TopologyStory);
    } catch (err) {
      console.error('[useTopologyInsight] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate story');
      setStory(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearStory = useCallback(() => {
    setStory(null);
    setError(null);
  }, []);

  return {
    story,
    isLoading,
    error,
    fetchStory,
    clearStory
  };
}
