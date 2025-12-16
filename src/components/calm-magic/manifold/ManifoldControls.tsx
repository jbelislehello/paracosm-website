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
  Link,
  Route,
  Network,
  FastForward,
  Rewind
} from 'lucide-react';
import { ManifoldSeason, SEASON_COLORS } from '@/utils/torusManifoldMath';
import { ConnectionLegend } from './SemanticConnectionLines';

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
  showSemanticConnections: boolean;
  setShowSemanticConnections: (show: boolean) => void;
  showJourneyPath: boolean;
  setShowJourneyPath: (show: boolean) => void;
  isJourneyPlaying: boolean;
  setIsJourneyPlaying: (playing: boolean) => void;
  journeySpeed: number;
  setJourneySpeed: (speed: number) => void;
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
  showSemanticConnections,
  setShowSemanticConnections,
  showJourneyPath,
  setShowJourneyPath,
  isJourneyPlaying,
  setIsJourneyPlaying,
  journeySpeed,
  setJourneySpeed,
  isAnimating,
  setIsAnimating,
  opacity,
  setOpacity,
  seasonBreakdown,
  totalEntries,
  onReset
}: ManifoldControlsProps) {
  return (
    <div className="absolute left-4 top-20 bottom-4 w-72 bg-background/90 backdrop-blur-sm rounded-lg border border-border p-4 overflow-y-auto">
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

      {/* Journey Fly-Through Controls */}
      <div className="mb-6 p-3 bg-primary/10 rounded-lg">
        <p className="text-sm font-medium mb-3 flex items-center gap-2">
          <Route className="h-4 w-4" />
          Journey Fly-Through
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <Label htmlFor="journeyPath" className="text-sm">Show Path</Label>
          <Switch
            id="journeyPath"
            checked={showJourneyPath}
            onCheckedChange={setShowJourneyPath}
          />
        </div>

        <div className="flex gap-2 mb-3">
          <Button
            variant={isJourneyPlaying ? "default" : "outline"}
            size="sm"
            onClick={() => setIsJourneyPlaying(!isJourneyPlaying)}
            className="flex-1"
            disabled={totalEntries < 2}
          >
            {isJourneyPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-1" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" /> Play Journey
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Speed: {journeySpeed.toFixed(1)}x</Label>
          <div className="flex items-center gap-2">
            <Rewind className="h-3 w-3 text-muted-foreground" />
            <Slider
              value={[journeySpeed]}
              onValueChange={(v) => setJourneySpeed(v[0])}
              max={3}
              min={0.25}
              step={0.25}
              className="flex-1"
            />
            <FastForward className="h-3 w-3 text-muted-foreground" />
          </div>
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

        <div className="flex items-center justify-between">
          <Label htmlFor="semanticConnections" className="flex items-center gap-2 text-sm">
            <Network className="h-4 w-4" />
            Semantic Links
          </Label>
          <Switch
            id="semanticConnections"
            checked={showSemanticConnections}
            onCheckedChange={setShowSemanticConnections}
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
              <Pause className="h-4 w-4 mr-1" /> Pause Orbit
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" /> Orbit
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

      {/* Legends */}
      <div className="mt-6 space-y-4">
        <div className="p-3 bg-muted/50 rounded-lg">
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

        {showSemanticConnections && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <ConnectionLegend />
          </div>
        )}
      </div>
    </div>
  );
}
