import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Waves, GitBranch, Atom, Sparkles } from 'lucide-react';
import { calculateHolographicMetrics } from '@/utils/holographicEntropy';
import { performFractalAnalysis, calculateNavigationStats } from '@/utils/fractalDimensionAnalysis';
import { generateQuantumGravityOverlay } from '@/utils/quantumGravityGeometry';

interface ConsciousnessMetricsDashboardProps {
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  journeyPath: Array<{ row: number; col: number }>;
  torusProjection: (row: number, col: number) => [number, number, number];
}

export function ConsciousnessMetricsDashboard({
  visitedTiles,
  densityMap,
  journeyPath,
  torusProjection
}: ConsciousnessMetricsDashboardProps) {
  const metrics = useMemo(() => {
    const holographic = calculateHolographicMetrics(visitedTiles, densityMap, journeyPath);
    const fractal = performFractalAnalysis(journeyPath, densityMap);
    const navStats = calculateNavigationStats(journeyPath);
    const quantum = generateQuantumGravityOverlay(visitedTiles, densityMap, torusProjection);
    
    return { holographic, fractal, navStats, quantum };
  }, [visitedTiles, densityMap, journeyPath, torusProjection]);

  const { holographic, fractal, navStats, quantum } = metrics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
      {/* Banach/Consciousness Metrics */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-violet-500" />
            Consciousness
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Coherence</span>
            <span>{(navStats.pathEfficiency * 100).toFixed(0)}%</span>
          </div>
          <Progress value={navStats.pathEfficiency * 100} className="h-1.5" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Complexity</span>
            <Badge variant="outline" className="text-[10px] px-1">
              {navStats.uniqueTiles} states
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Holographic Entropy */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-500" />
            Entropy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Total</span>
            <span>{holographic.totalEntropy.toFixed(1)} bits</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Capacity</span>
            <span>{holographic.holographicCapacity.toFixed(0)}</span>
          </div>
          <Progress 
            value={(holographic.totalEntropy / holographic.holographicCapacity) * 100} 
            className="h-1.5" 
          />
        </CardContent>
      </Card>

      {/* Fractal Dimension */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
            Fractal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Dimension</span>
            <Badge variant="secondary" className="text-[10px] px-1">
              D = {fractal.boxCountingDimension.dimension.toFixed(2)}
            </Badge>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Lacunarity</span>
            <span>{fractal.lacunarity.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Patterns</span>
            <span>{fractal.selfSimilarityPatterns.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quantum Gravity */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-amber-500" />
            Quantum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Singularities</span>
            <Badge variant="outline" className="text-[10px] px-1">
              {quantum.singularities.length}
            </Badge>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Curvature</span>
            <span>{quantum.globalCurvature.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Topology</span>
            <span>{quantum.topologicalCharge.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
