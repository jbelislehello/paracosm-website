import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Eye,
  EyeOff,
  Palette,
  Grid3X3,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Sparkles,
  Link
} from 'lucide-react';
import { ManifoldSeason, SEASON_COLORS } from '@/utils/torusManifoldMath';

interface ManifoldControlsProps {
  showCurvature: boolean;
  setShowCurvature: (show: boolean) => void;
  showSeasonColors: boolean;
  setShowSeasonColors: (show: boolean) => void;
  showWireframe: boolean;
  setShowWireframe: (show: boolean) => void;
  showParticles: boolean;
  setShowParticles: (show: boolean) => void;
  showConnections: boolean;
  setShowConnections: (show: boolean) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  seasonBreakdown: Record<ManifoldSeason, number>;
  totalEntries: number;
  onReset: () => void;
}

export function ManifoldControls({
  showCurvature,
  setShowCurvature,
  showSeasonColors,
  setShowSeasonColors,
  showWireframe,
  setShowWireframe,
  showParticles,
  setShowParticles,
  showConnections,
  setShowConnections,
  isAnimating,
  setIsAnimating,
  opacity,
  setOpacity,
  seasonBreakdown,
  totalEntries,
  onReset
}: ManifoldControlsProps) {
  return (
    <div className="absolute left-4 top-20 bottom-4 w-64 bg-background/90 backdrop-blur-sm rounded-lg border border-border p-4 overflow-y-auto">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Layers className="h-5 w-5" />
        Manifold Controls
      </h3>

      {/* Stats */}
      <div className="mb-6 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          Total Insights: <span className="font-semibold text-foreground">{totalEntries}</span>
        </p>
        <div className="space-y-1">
          {(Object.keys(seasonBreakdown) as ManifoldSeason[]).map(season => (
            <div key={season} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: SEASON_COLORS[season] }}
                />
                {season}
              </span>
              <span className="text-muted-foreground">{seasonBreakdown[season]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visualization toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="curvature" className="flex items-center gap-2 text-sm">
            <Palette className="h-4 w-4" />
            Curvature Heatmap
          </Label>
          <Switch
            id="curvature"
            checked={showCurvature}
            onCheckedChange={setShowCurvature}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="seasons" className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            Season Colors
          </Label>
          <Switch
            id="seasons"
            checked={showSeasonColors}
            onCheckedChange={setShowSeasonColors}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="wireframe" className="flex items-center gap-2 text-sm">
            <Grid3X3 className="h-4 w-4" />
            Wireframe
          </Label>
          <Switch
            id="wireframe"
            checked={showWireframe}
            onCheckedChange={setShowWireframe}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="particles" className="flex items-center gap-2 text-sm">
            {showParticles ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Insight Particles
          </Label>
          <Switch
            id="particles"
            checked={showParticles}
            onCheckedChange={setShowParticles}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="connections" className="flex items-center gap-2 text-sm">
            <Link className="h-4 w-4" />
            Tag Connections
          </Label>
          <Switch
            id="connections"
            checked={showConnections}
            onCheckedChange={setShowConnections}
          />
        </div>
      </div>

      {/* Opacity slider */}
      <div className="mt-6">
        <Label className="text-sm mb-2 block">Surface Opacity</Label>
        <Slider
          value={[opacity * 100]}
          onValueChange={(v) => setOpacity(v[0] / 100)}
          max={100}
          min={10}
          step={5}
        />
      </div>

      {/* Animation controls */}
      <div className="mt-6 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex-1"
        >
          {isAnimating ? (
            <>
              <Pause className="h-4 w-4 mr-1" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" /> Animate
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs font-medium mb-2">Surface Curvature</p>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span>Convex (outer edge)</span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-1">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>Saddle (inner edge)</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Bulges indicate high insight density
        </p>
      </div>
    </div>
  );
}
