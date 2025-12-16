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
  journeyPath = [],
  visitedTiles = new Set(),
  currentUnlockedRing = 1,
  onTileSelect,
  densityMap = new Map()
}: TopologiesTabProps) {
  // Convert journey path to include seasons
  const journeyWithSeasons = journeyPath.map(p => ({
    ...p,
    season
  }));
  
  return (
    <div className="w-full h-[calc(100vh-220px)] min-h-[450px] rounded-lg overflow-hidden border border-border bg-background">
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
