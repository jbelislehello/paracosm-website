import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Grid3X3,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Link,
  Circle,
  Eye,
  Layers,
  Box,
  LayoutGrid,
  CircleDot,
  Maximize
} from 'lucide-react';
import { ManifoldSeason, SEASON_HEX_COLORS, getTileAcronym } from '@/utils/torusManifoldMath';
import { ViewMode } from './EnhancedManifoldView';

interface ManifoldControlsSidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showCurvature: boolean;
  setShowCurvature: (show: boolean) => void;
  showSeasonColors: boolean;
  setShowSeasonColors: (show: boolean) => void;
  showWireframe: boolean;
  setShowWireframe: (show: boolean) => void;
  showTileMarkers: boolean;
  setShowTileMarkers: (show: boolean) => void;
  showConnections: boolean;
  setShowConnections: (show: boolean) => void;
  showRingZones: boolean;
  setShowRingZones: (show: boolean) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  currentSeason: ManifoldSeason;
  selectedTile: { row: number; col: number };
  seasonBreakdown: Record<ManifoldSeason, number>;
  totalEntries: number;
  onReset: () => void;
}

const VIEW_MODES: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
  { value: 'torus', label: 'Torus', icon: <Circle className="h-3.5 w-3.5" /> },
  { value: 'flat-overlay', label: 'Matrix', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { value: 'cross-section', label: 'Section', icon: <CircleDot className="h-3.5 w-3.5" /> },
  { value: 'unfolded', label: 'Unfold', icon: <Maximize className="h-3.5 w-3.5" /> }
];

const SEASONS: ManifoldSeason[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

export function ManifoldControlsSidebar({
  viewMode,
  setViewMode,
  showCurvature,
  setShowCurvature,
  showSeasonColors,
  setShowSeasonColors,
  showWireframe,
  setShowWireframe,
  showTileMarkers,
  setShowTileMarkers,
  showConnections,
  setShowConnections,
  showRingZones,
  setShowRingZones,
  isAnimating,
  setIsAnimating,
  opacity,
  setOpacity,
  currentSeason,
  selectedTile,
  seasonBreakdown,
  totalEntries,
  onReset
}: ManifoldControlsSidebarProps) {
  return (
    <div className="w-60 bg-background/95 backdrop-blur-sm border-l border-border p-4 overflow-y-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Manifold Controls</h3>
      </div>

      {/* View Mode Selector */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">View Mode</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {VIEW_MODES.map((mode) => (
            <Button
              key={mode.value}
              variant={viewMode === mode.value ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => setViewMode(mode.value)}
            >
              {mode.icon}
              {mode.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Position */}
      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Selected Tile</span>
          <span className="font-medium">{getTileAcronym(selectedTile.row, selectedTile.col)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Position</span>
          <span className="font-mono text-[10px]">R{selectedTile.row} C{selectedTile.col}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: `#${SEASON_HEX_COLORS[currentSeason].toString(16).padStart(6, '0')}` }}
          />
          <span className="text-xs">{currentSeason}</span>
        </div>
      </div>

      {/* Visualization Toggles */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground">Visualization</Label>
        
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="curvature" className="flex items-center gap-2 text-xs cursor-pointer">
              <Palette className="h-3.5 w-3.5 text-muted-foreground" />
              Curvature Heatmap
            </Label>
            <Switch
              id="curvature"
              checked={showCurvature}
              onCheckedChange={setShowCurvature}
              className="scale-90"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="seasons" className="flex items-center gap-2 text-xs cursor-pointer">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              Season Colors
            </Label>
            <Switch
              id="seasons"
              checked={showSeasonColors}
              onCheckedChange={setShowSeasonColors}
              className="scale-90"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="wireframe" className="flex items-center gap-2 text-xs cursor-pointer">
              <Grid3X3 className="h-3.5 w-3.5 text-muted-foreground" />
              Wireframe Grid
            </Label>
            <Switch
              id="wireframe"
              checked={showWireframe}
              onCheckedChange={setShowWireframe}
              className="scale-90"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="markers" className="flex items-center gap-2 text-xs cursor-pointer">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              Tile Markers
            </Label>
            <Switch
              id="markers"
              checked={showTileMarkers}
              onCheckedChange={setShowTileMarkers}
              className="scale-90"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="connections" className="flex items-center gap-2 text-xs cursor-pointer">
              <Link className="h-3.5 w-3.5 text-muted-foreground" />
              Tile Connections
            </Label>
            <Switch
              id="connections"
              checked={showConnections}
              onCheckedChange={setShowConnections}
              className="scale-90"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ringzones" className="flex items-center gap-2 text-xs cursor-pointer">
              <Box className="h-3.5 w-3.5 text-muted-foreground" />
              Ring Zones
            </Label>
            <Switch
              id="ringzones"
              checked={showRingZones}
              onCheckedChange={setShowRingZones}
              className="scale-90"
            />
          </div>
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Surface Opacity</Label>
          <span className="text-xs font-mono">{Math.round(opacity * 100)}%</span>
        </div>
        <Slider
          value={[opacity * 100]}
          onValueChange={(v) => setOpacity(v[0] / 100)}
          max={100}
          min={10}
          step={5}
          className="w-full"
        />
      </div>

      {/* Animation Controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex-1 h-8 text-xs"
        >
          {isAnimating ? (
            <>
              <Pause className="h-3.5 w-3.5 mr-1" /> Pause
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 mr-1" /> Rotate
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Season Progress */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Season Progress</Label>
        <div className="space-y-1.5">
          {SEASONS.map((s) => (
            <div key={s} className="flex items-center gap-2 text-xs">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: `#${SEASON_HEX_COLORS[s].toString(16).padStart(6, '0')}` }}
              />
              <span className={`flex-1 ${currentSeason === s ? 'font-medium' : 'text-muted-foreground'}`}>
                {s}
              </span>
              <span className="text-muted-foreground font-mono text-[10px]">
                {seasonBreakdown[s] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30 space-y-2 mt-auto">
        <p className="text-[10px] font-medium text-muted-foreground">Curvature Legend</p>
        <div className="flex items-center gap-2 text-[10px]">
          <div className="w-3 h-3 rounded bg-blue-500/80" />
          <span className="text-muted-foreground">Convex (outer)</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <div className="w-3 h-3 rounded bg-red-500/80" />
          <span className="text-muted-foreground">Saddle (inner)</span>
        </div>
        <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/30">
          Bulges show high insight density
        </p>
      </div>
    </div>
  );
}
