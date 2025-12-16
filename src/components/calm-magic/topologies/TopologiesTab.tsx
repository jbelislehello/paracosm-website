import { useState } from 'react';
import { ManifoldSeason } from '@/utils/torusManifoldMath';
import { IsometricCubeMatrix, IsometricViewMode } from './IsometricCubeMatrix';
import { RingLevel } from '@/utils/ringToleranceSystem';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Box, 
  Circle, 
  RotateCcw, 
  Play, 
  Pause, 
  Grid3X3, 
  CloudFog,
  Maximize,
  Minimize
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<IsometricViewMode>('isometric');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHorizonGrid, setShowHorizonGrid] = useState(true);
  const [showDepthFog, setShowDepthFog] = useState(true);
  const [cubeSize, setCubeSize] = useState(32);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Convert journey path to include seasons
  const journeyWithSeasons = journeyPath.map(p => ({
    ...p,
    season
  }));

  const handleFoldToggle = () => {
    if (viewMode === 'isometric') {
      setViewMode('transitioning');
      setTimeout(() => setViewMode('torus'), 100);
    } else if (viewMode === 'torus') {
      setViewMode('transitioning');
      setTimeout(() => setViewMode('isometric'), 100);
    }
  };

  const handleReset = () => {
    setViewMode('isometric');
    setIsAnimating(false);
    setCubeSize(32);
  };

  return (
    <div className={`flex flex-col gap-3 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4 px-2">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'isometric' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('isometric')}
            className="h-8 text-xs gap-1.5"
          >
            <Box className="w-3.5 h-3.5" />
            Isometric
          </Button>
          <Button
            variant={viewMode === 'torus' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('torus')}
            className="h-8 text-xs gap-1.5"
          >
            <Circle className="w-3.5 h-3.5" />
            Torus
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFoldToggle}
            disabled={viewMode === 'transitioning'}
            className="h-8 text-xs gap-1.5"
          >
            {viewMode === 'torus' ? 'Unfold' : 'Fold to Torus'}
          </Button>
        </div>

        {/* Visual Options */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="horizon"
              checked={showHorizonGrid}
              onCheckedChange={setShowHorizonGrid}
              className="scale-75"
            />
            <Label htmlFor="horizon" className="text-xs cursor-pointer flex items-center gap-1">
              <Grid3X3 className="w-3 h-3" />
              Grid
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="fog"
              checked={showDepthFog}
              onCheckedChange={setShowDepthFog}
              className="scale-75"
            />
            <Label htmlFor="fog" className="text-xs cursor-pointer flex items-center gap-1">
              <CloudFog className="w-3 h-3" />
              Fog
            </Label>
          </div>

          {/* Cube Size Slider */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Size</Label>
            <Slider
              value={[cubeSize]}
              onValueChange={(v) => setCubeSize(v[0])}
              min={20}
              max={50}
              step={2}
              className="w-16"
            />
          </div>
        </div>

        {/* Animation Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className="h-8 text-xs gap-1"
            disabled={viewMode !== 'torus'}
          >
            {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isAnimating ? 'Pause' : 'Rotate'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8"
          >
            {isFullscreen ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Main Visualization */}
      <div className={`rounded-lg overflow-hidden border border-border bg-background ${isFullscreen ? 'flex-1' : 'h-[calc(100vh-280px)] min-h-[450px]'}`}>
        <IsometricCubeMatrix
          selectedTile={{ row, col }}
          season={season}
          visitedTiles={visitedTiles}
          journeyPath={journeyWithSeasons}
          currentUnlockedRing={currentUnlockedRing}
          onTileClick={onTileSelect}
          densityMap={densityMap}
          viewMode={viewMode}
          showHorizonGrid={showHorizonGrid}
          showDepthFog={showDepthFog}
          cubeSize={cubeSize}
          isAnimating={isAnimating}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary/80" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-muted-foreground/40 bg-muted/40" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-muted-foreground/20 bg-muted/20" />
          <span>Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-primary bg-primary/20" />
          <span>Selected</span>
        </div>
        <span className="ml-auto">Drag to rotate • Click accessible tiles to navigate</span>
      </div>
    </div>
  );
}
