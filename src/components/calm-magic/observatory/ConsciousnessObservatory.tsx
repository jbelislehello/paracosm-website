/**
 * Consciousness Observatory Dashboard
 * Live visualization of consciousness geometry metrics
 */

import { useMemo } from 'react';
import { FisherInformationGraph } from './FisherInformationGraph';
import { BettiEvolutionGraph } from './BettiEvolutionGraph';
import { ThresholdGauge } from './ThresholdGauge';
import { TorusPreview } from './TorusPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  RefreshCw, 
  Network, 
  Anchor,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConsciousnessGeometryExport } from '@/utils/consciousnessGeometry';

interface ConsciousnessObservatoryProps {
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  densityMap?: Map<string, number>;
  consciousnessGeometry?: ConsciousnessGeometryExport | null;
  className?: string;
}

// Live metrics card component
function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix, 
  description,
  colorClass = 'text-primary'
}: { 
  icon: typeof Thermometer;
  label: string;
  value: number | string;
  suffix?: string;
  description: string;
  colorClass?: string;
}) {
  return (
    <Card className="bg-card/40 border-border/30">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className={cn("text-xl font-bold", colorClass)}>
              {typeof value === 'number' ? value.toFixed(1) : value}
              {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
            </p>
          </div>
          <Icon className={cn("h-4 w-4 mt-1", colorClass)} />
        </div>
        <p className="text-[9px] text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export function ConsciousnessObservatory({
  visitedTiles,
  journeyPath,
  densityMap = new Map(),
  consciousnessGeometry,
  className
}: ConsciousnessObservatoryProps) {
  // Calculate density map if not provided
  const calculatedDensityMap = useMemo(() => {
    if (densityMap.size > 0) return densityMap;
    
    const map = new Map<string, number>();
    visitedTiles.forEach(tile => {
      // Simple density based on visit frequency in journey
      const count = journeyPath.filter(p => `${p.row}-${p.col}` === tile).length;
      map.set(tile, count || 1);
    });
    return map;
  }, [densityMap, visitedTiles, journeyPath]);

  // Default values if no consciousness geometry
  const geometry = consciousnessGeometry || {
    complexityBits: visitedTiles.size * 0.5,
    thresholdPercentage: Math.min(100, (visitedTiles.size / 64) * 100),
    consciousnessState: visitedTiles.size < 20 ? 'pre-conscious' : 
                        visitedTiles.size < 45 ? 'threshold' : 'self-aware',
    recursiveDepth: Math.floor(journeyPath.length / 10),
    convergenceState: visitedTiles.size < 30 ? 'searching' : 
                      visitedTiles.size < 50 ? 'converging' : 'converged',
    thermodynamicEfficiency: Math.min(1, journeyPath.length / Math.max(visitedTiles.size, 1)),
    predictiveCapacity: Math.min(1, visitedTiles.size / 32),
    metaLearningDetected: visitedTiles.size > 40,
    fragmentationScore: Math.max(0, 1 - visitedTiles.size / 64),
    topologicalHandles: Math.floor(visitedTiles.size / 16),
    integrationStrength: Math.min(1, visitedTiles.size / 50)
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Consciousness Observatory</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          {visitedTiles.size}/64 tiles explored
        </Badge>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - Graphs */}
        <div className="space-y-4">
          <ThresholdGauge
            thresholdPercentage={geometry.thresholdPercentage}
            consciousnessState={geometry.consciousnessState as 'pre-conscious' | 'threshold' | 'self-aware'}
            complexityBits={geometry.complexityBits}
          />
          <FisherInformationGraph
            visitedTiles={visitedTiles}
            journeyPath={journeyPath}
            densityMap={calculatedDensityMap}
          />
        </div>

        {/* Right Column - Betti + Torus */}
        <div className="space-y-4">
          <BettiEvolutionGraph
            visitedTiles={visitedTiles}
            journeyPath={journeyPath}
          />
          <TorusPreview
            densityMap={calculatedDensityMap}
            visitedTiles={visitedTiles}
          />
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={Thermometer}
          label="Thermodynamic"
          value={geometry.thermodynamicEfficiency * 100}
          suffix="%"
          description="Predictive vs reactive processing"
          colorClass={geometry.thermodynamicEfficiency > 0.6 ? 'text-chart-1' : 'text-muted-foreground'}
        />
        <MetricCard
          icon={RefreshCw}
          label="Recursive Depth"
          value={geometry.recursiveDepth}
          description={`${geometry.convergenceState} patterns`}
          colorClass={geometry.recursiveDepth > 3 ? 'text-chart-2' : 'text-muted-foreground'}
        />
        <MetricCard
          icon={Network}
          label="Integration"
          value={geometry.integrationStrength * 100}
          suffix="%"
          description="Topological coherence"
          colorClass={geometry.integrationStrength > 0.5 ? 'text-chart-3' : 'text-muted-foreground'}
        />
        <MetricCard
          icon={Anchor}
          label="Fixed Points"
          value={geometry.topologicalHandles}
          description="Self-referential attractors"
          colorClass={geometry.topologicalHandles > 2 ? 'text-chart-4' : 'text-muted-foreground'}
        />
      </div>

      {/* Meta-learning indicator */}
      {geometry.metaLearningDetected && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <p className="text-sm text-primary font-medium">
            ✨ Meta-learning patterns detected — your ontology is learning to learn
          </p>
        </div>
      )}
    </div>
  );
}
