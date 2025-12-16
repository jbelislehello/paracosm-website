import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TopologyViewMode } from '@/components/calm-magic/topologies/ViewModeSelector';

export interface StoryChapter {
  title: string;
  content: string;
  discovery_type: 'pattern' | 'strength' | 'shadow' | 'gap';
}

export interface TopologyStory {
  viewMode: TopologyViewMode;
  storyTitle: string;
  mysteryType: string;
  opening_mystery: string;
  chapters: StoryChapter[];
  key_revelation: string;
  invitation: string;
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
      currentUnlockedRing
    } = props;

    // Don't fetch if no tiles visited
    if (visitedTiles.size === 0) {
      setStory(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert Set and Map to serializable formats
      const visitedArray = Array.from(visitedTiles);
      const densityObj: Record<string, number> = {};
      densityMap.forEach((value, key) => {
        densityObj[key] = value;
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
          currentUnlockedRing
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
