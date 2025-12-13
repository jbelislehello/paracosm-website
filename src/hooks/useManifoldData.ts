import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  ManifoldSeason,
  SEASON_INDEX,
  tileToTorusPoint,
  calculateLocalRadius,
  rowSeasonToPhi,
  columnToTheta
} from '@/utils/torusManifoldMath';

export interface ManifoldDataPoint {
  tileId: number;
  row: number;
  col: number;
  season: ManifoldSeason;
  polenCount: number;
  avgSentiment?: number;
  tags: string[];
  // Computed torus coordinates
  theta: number;
  phi: number;
  x: number;
  y: number;
  z: number;
  localRadius: number;
}

export interface ManifoldEntry {
  id: string;
  content: string;
  tileId: number;
  row: number;
  col: number;
  season: ManifoldSeason;
  tags: string[];
  createdAt: string;
  // Torus position
  x: number;
  y: number;
  z: number;
}

interface UseManifoldDataReturn {
  dataPoints: ManifoldDataPoint[];
  entries: ManifoldEntry[];
  densityMap: Map<string, number>;
  isLoading: boolean;
  totalEntries: number;
  seasonBreakdown: Record<ManifoldSeason, number>;
  maxDensity: number;
  refetch: () => Promise<void>;
}

// Map database board enum to ManifoldSeason
const BOARD_TO_SEASON: Record<string, ManifoldSeason> = {
  'LOVE': 'POLLENS',
  'MAGIC': 'NOEMS',
  'CALM': 'POEMS',
  'OPEN': 'TOTEMS',
  'FREE': 'ANTHEMS'
};

export function useManifoldData(): UseManifoldDataReturn {
  const [entries, setEntries] = useState<ManifoldEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all POLEN entries with tile info
      const { data: polenData, error } = await supabase
        .from('polen_entries')
        .select(`
          id,
          content,
          tile_id,
          tags,
          created_at,
          season_context,
          tiles (
            row,
            col,
            board
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching manifold data:', error);
        return;
      }

      // Transform to ManifoldEntry format
      const transformedEntries: ManifoldEntry[] = (polenData || [])
        .filter(entry => entry.tiles && entry.tile_id)
        .map(entry => {
          const tile = entry.tiles as { row: number; col: number; board: string };
          const board = tile.board || 'LOVE';
          const season = BOARD_TO_SEASON[board] || 'POLLENS';
          const row = tile.row ?? 0;
          const col = tile.col ?? 0;
          
          const [x, y, z] = tileToTorusPoint(row, col, season, 0);
          
          return {
            id: entry.id,
            content: entry.content,
            tileId: entry.tile_id,
            row,
            col,
            season,
            tags: entry.tags || [],
            createdAt: entry.created_at,
            x,
            y,
            z
          };
        });

      setEntries(transformedEntries);
    } catch (err) {
      console.error('Error in useManifoldData:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate density map and aggregate data points
  const { dataPoints, densityMap, maxDensity } = useMemo(() => {
    const densityMap = new Map<string, number>();
    const tileDataMap = new Map<string, {
      tileId: number;
      row: number;
      col: number;
      season: ManifoldSeason;
      count: number;
      tags: Set<string>;
    }>();

    // Aggregate entries by tile
    entries.forEach(entry => {
      const key = `${SEASON_INDEX[entry.season]}-${entry.row}-${entry.col}`;
      
      if (!tileDataMap.has(key)) {
        tileDataMap.set(key, {
          tileId: entry.tileId,
          row: entry.row,
          col: entry.col,
          season: entry.season,
          count: 0,
          tags: new Set()
        });
      }
      
      const data = tileDataMap.get(key)!;
      data.count++;
      entry.tags.forEach(tag => data.tags.add(tag));
      
      densityMap.set(key, data.count);
    });

    // Find max density for normalization
    let maxDensity = 0;
    densityMap.forEach(count => {
      if (count > maxDensity) maxDensity = count;
    });

    // Convert to data points with torus coordinates
    const dataPoints: ManifoldDataPoint[] = [];
    
    tileDataMap.forEach((data, key) => {
      const theta = columnToTheta(data.col);
      const phi = rowSeasonToPhi(data.row, data.season);
      const localRadius = calculateLocalRadius(data.count);
      const [x, y, z] = tileToTorusPoint(data.row, data.col, data.season, data.count);
      
      dataPoints.push({
        tileId: data.tileId,
        row: data.row,
        col: data.col,
        season: data.season,
        polenCount: data.count,
        tags: Array.from(data.tags),
        theta,
        phi,
        x,
        y,
        z,
        localRadius
      });
    });

    return { dataPoints, densityMap, maxDensity };
  }, [entries]);

  // Season breakdown
  const seasonBreakdown = useMemo(() => {
    const breakdown: Record<ManifoldSeason, number> = {
      POLLENS: 0,
      NOEMS: 0,
      POEMS: 0,
      TOTEMS: 0,
      ANTHEMS: 0
    };

    entries.forEach(entry => {
      breakdown[entry.season]++;
    });

    return breakdown;
  }, [entries]);

  return {
    dataPoints,
    entries,
    densityMap,
    isLoading,
    totalEntries: entries.length,
    seasonBreakdown,
    maxDensity,
    refetch: fetchData
  };
}
