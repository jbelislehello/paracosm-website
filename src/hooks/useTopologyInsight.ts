import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TopologyViewMode } from '@/components/calm-magic/topologies/ViewModeSelector';

export interface TopologyInsight {
  viewMode: TopologyViewMode;
  metaphor: string;
  insight: string;
  question: string;
  recommendation: string | null;
  stats: {
    coverage: number;
    visitedCount: number;
    totalTiles: number;
    currentRing: number;
    pathLength: number;
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
  const [insight, setInsight] = useState<TopologyInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = useCallback(async (props: UseTopologyInsightProps) => {
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
      setInsight(null);
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

      setInsight(data as TopologyInsight);
    } catch (err) {
      console.error('[useTopologyInsight] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate insight');
      setInsight(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearInsight = useCallback(() => {
    setInsight(null);
    setError(null);
  }, []);

  return {
    insight,
    isLoading,
    error,
    fetchInsight,
    clearInsight
  };
}
