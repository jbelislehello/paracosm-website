import { ManifoldSeason } from '@/utils/torusManifoldMath';
import { EnhancedManifoldView } from './EnhancedManifoldView';
import { RingLevel } from '@/utils/ringToleranceSystem';

interface TopologiesTabProps {
  row: number;
  col: number;
  season: ManifoldSeason;
  tileName: string;
  rowLabel: string;
  colLabel: string;
  journeyPath?: Array<{ row: number; col: number }>;
  polenDensity?: number;
  visitedTiles?: Set<string>;
  currentUnlockedRing?: RingLevel;
  onTileSelect?: (row: number, col: number) => void;
  densityMap?: Map<string, number>;
}

export function TopologiesTab({
  row,
  col,
  season,
  tileName,
  rowLabel,
  colLabel,
  journeyPath = [],
  polenDensity = 0,
  visitedTiles = new Set(),
  currentUnlockedRing = 1,
  onTileSelect,
  densityMap = new Map()
}: TopologiesTabProps) {
  // Convert journey path to include seasons
  const journeyWithSeasons = journeyPath.map(p => ({
    ...p,
    season // For now, assume same season - can be enhanced
  }));
  
  return (
    <div className="w-full h-full min-h-[500px]">
      <EnhancedManifoldView
        selectedTile={{ row, col }}
        season={season}
        visitedTiles={visitedTiles}
        journeyPath={journeyWithSeasons}
        currentUnlockedRing={currentUnlockedRing}
        onTileClick={onTileSelect}
        densityMap={densityMap}
      />
    </div>
  );
}