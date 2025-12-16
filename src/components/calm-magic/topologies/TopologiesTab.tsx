import { useState, useEffect, useCallback } from 'react';
import { ManifoldSeason } from '@/utils/torusManifoldMath';
import { IsometricCubeMatrix } from './IsometricCubeMatrix';
import { DoubleDiamondLayout } from './DoubleDiamondLayout';
import { SpiralLayout } from './SpiralLayout';
import { ManifoldChartView } from './ManifoldChartView';
import { TorusCoordinateReference } from './TorusCoordinateReference';
import { FundamentalCyclesOverlay } from './FundamentalCyclesOverlay';
import { ToroidalFlowField } from './ToroidalFlowField';
import { UnfoldedChartProjection } from './UnfoldedChartProjection';
import { ViewModeSelector, TopologyViewMode } from './ViewModeSelector';
import { TopologyStoryExplorer } from './TopologyStoryExplorer';
import { useTopologyInsight } from '@/hooks/useTopologyInsight';
import { RingLevel } from '@/utils/ringToleranceSystem';
import { TopologicalSignature, QuadrantPosition } from '@/types/trajectory';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  RotateCcw, 
  Maximize,
  Minimize,
  Sparkles,
  Loader2
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
  shadowPosition?: { x: number; y: number };
  higherSelfPosition?: { x: number; y: number };
  currentSeason?: string;
  // Wonder-inducing context props
  completedSeasons?: string[];
  prdId?: string | null;
  // Topological insights props
  topologicalSignature?: TopologicalSignature | null;
  isAnalyzingTopology?: boolean;
  onAnalyzeTopology?: () => void;
  onApplyInsightToShadow?: (position: QuadrantPosition, insightNote: string) => void;
}

export function TopologiesTab({
  row,
  col,
  season,
  tileName,
  rowLabel,
  colLabel,
  journeyPath = [],
  visitedTiles = new Set(),
  currentUnlockedRing = 1,
  onTileSelect,
  densityMap = new Map(),
  shadowPosition,
  higherSelfPosition,
  currentSeason,
  completedSeasons = [],
  prdId,
  topologicalSignature,
  isAnalyzingTopology,
  onAnalyzeTopology,
  onApplyInsightToShadow
}: TopologiesTabProps) {
  const [viewMode, setViewMode] = useState<TopologyViewMode>('isometric');
  const [cubeSize, setCubeSize] = useState(32);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [secretsRevealed, setSecretsRevealed] = useState(false);

  const { story, isLoading, error, fetchStory, clearStory } = useTopologyInsight();

  // Fetch story when view mode changes - now with wonder-inducing context
  const handleFetchStory = useCallback(() => {
    fetchStory({
      viewMode,
      journeyPath,
      visitedTiles,
      densityMap,
      shadowPosition,
      higherSelfPosition,
      currentSeason,
      currentUnlockedRing,
      // Wonder-inducing context
      currentTileRow: row,
      currentTileCol: col,
      tileName,
      rowLabel,
      colLabel,
      completedSeasons,
      prdId
    });
  }, [viewMode, journeyPath, visitedTiles, densityMap, shadowPosition, higherSelfPosition, currentSeason, currentUnlockedRing, row, col, tileName, rowLabel, colLabel, completedSeasons, prdId, fetchStory]);

  // Fetch story on mount and when view mode changes (but don't auto-reveal)
  useEffect(() => {
    if (visitedTiles.size > 0) {
      handleFetchStory();
    } else {
      clearStory();
    }
    // Close secrets when view mode changes
    setSecretsRevealed(false);
  }, [viewMode, visitedTiles.size]);

  // Handler for revealing secrets
  const handleRevealSecrets = useCallback(() => {
    if (visitedTiles.size === 0) return;
    
    // Expand accordion first, then fetch (so loading appears inside expanded accordion)
    setSecretsRevealed(true);
    handleFetchStory();
  }, [handleFetchStory, visitedTiles.size]);

  const handleReset = () => {
    setViewMode('isometric');
    setCubeSize(32);
  };

  const handleSaveToJournal = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Story copied to clipboard', {
      description: 'You can paste this into your journal or notes'
    });
  };


  // Shared props for all layouts
  const layoutProps = {
    selectedTile: { row, col },
    season,
    visitedTiles,
    journeyPath,
    currentUnlockedRing,
    onTileClick: onTileSelect,
    densityMap
  };

  const renderLayout = () => {
    switch (viewMode) {
      case 'diamond':
        return <DoubleDiamondLayout {...layoutProps} />;
      case 'spiral':
        return <SpiralLayout {...layoutProps} />;
      case 'charts':
        return <ManifoldChartView selectedTile={{ row, col }} season={season} visitedTiles={visitedTiles} densityMap={densityMap} onTileClick={onTileSelect} />;
      case 'coordinates':
        return <TorusCoordinateReference selectedTile={{ row, col }} season={season} densityMap={densityMap} />;
      case 'cycles':
        return <FundamentalCyclesOverlay selectedTile={{ row, col }} season={season} journeyPath={journeyPath} visitedTiles={visitedTiles} />;
      case 'flow':
        return <ToroidalFlowField selectedTile={{ row, col }} season={season} journeyPath={journeyPath} visitedTiles={visitedTiles} densityMap={densityMap} onTileClick={onTileSelect} />;
      case 'projection':
        return <UnfoldedChartProjection selectedTile={{ row, col }} season={season} journeyPath={journeyPath} visitedTiles={visitedTiles} densityMap={densityMap} onTileClick={onTileSelect} />;
      case 'isometric':
      default:
        return (
          <IsometricCubeMatrix
            {...layoutProps}
            showDepthFog={false}
            cubeSize={cubeSize}
          />
        );
    }
  };

  const getLegendItems = () => {
    if (viewMode === 'diamond') {
      return [
        { color: 'bg-violet-500/80', label: 'Discover' },
        { color: 'bg-blue-500/80', label: 'Define' },
        { color: 'bg-emerald-500/80', label: 'Develop' },
        { color: 'bg-amber-500/80', label: 'Deliver' }
      ];
    }
    if (viewMode === 'spiral') {
      return [
        { color: 'bg-violet-500/80', label: 'Ring 1: Inner' },
        { color: 'bg-blue-500/80', label: 'Ring 2: Stretch' },
        { color: 'bg-emerald-500/80', label: 'Ring 3: Edge' },
        { color: 'bg-amber-500/80', label: 'Ring 4: Full' }
      ];
    }
    return [
      { color: 'bg-[hsl(142_71%_45%)]', label: 'Ring 1: Inner Core' },
      { color: 'bg-[hsl(217_91%_60%)]', label: 'Ring 2: Stretch' },
      { color: 'bg-[hsl(38_92%_50%)]', label: 'Ring 3: Edge' },
      { color: 'bg-[hsl(280_70%_50%)]', label: 'Ring 4: Integrator' },
      { color: 'bg-primary/70', label: 'Visited (path shown)' }
    ];
  };

  

  return (
    <div className={`flex flex-col gap-3 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4 px-2 flex-wrap">
        {/* View Mode Selector */}
        <ViewModeSelector value={viewMode} onChange={setViewMode} />

        {/* Visual Options (only for isometric view) */}
        {viewMode === 'isometric' && (
          <div className="flex items-center gap-4">
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
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleRevealSecrets}
            disabled={isLoading || visitedTiles.size === 0}
            className="h-8 gap-1.5 bg-gradient-to-r from-violet-600 to-primary hover:from-violet-500 hover:to-primary/90"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? 'Revealing...' : '✨ Reveal Secrets'}
            </span>
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

      {/* Main Visualization - no overlay */}
      <div 
        className={`relative rounded-lg overflow-hidden border border-border bg-background ${isFullscreen ? 'flex-1' : 'h-[calc(100vh-280px)] min-h-[450px]'}`}
      >
        {renderLayout()}
      </div>

      {/* Journey Insights & Story Explorer */}
      <TopologyStoryExplorer
        story={story}
        isLoading={isLoading}
        error={error}
        onRegenerate={handleFetchStory}
        onSaveToJournal={handleSaveToJournal}
        viewMode={viewMode}
        visitedTiles={visitedTiles}
        currentUnlockedRing={currentUnlockedRing}
        journeyPath={journeyPath}
        topologicalSignature={topologicalSignature}
        isAnalyzingTopology={isAnalyzingTopology}
        onAnalyzeTopology={onAnalyzeTopology}
        onApplyInsightToShadow={onApplyInsightToShadow}
        secretsRevealed={secretsRevealed}
        onToggleSecrets={() => setSecretsRevealed(!secretsRevealed)}
      />

      {/* Legend */}
      <div className="flex items-center gap-6 px-2 text-xs text-muted-foreground flex-wrap">
        {getLegendItems().map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${item.color}`} />
            <span>{item.label}</span>
          </div>
        ))}
        <span className="ml-auto">
          {viewMode === 'diamond' ? 'Design thinking phases • Click to navigate' :
           viewMode === 'spiral' ? 'Spiral from center outward • Click to select' :
           'Drag to rotate • Click accessible tiles'}
        </span>
      </div>

    </div>
  );
}
