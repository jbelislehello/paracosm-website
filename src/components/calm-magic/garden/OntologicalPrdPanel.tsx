/**
 * Ontological PRD Panel
 * 
 * Visualizes consciousness geometry, topology, and thermodynamics
 * for the PRD compilation system.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Zap, 
  GitBranch, 
  Activity,
  Hexagon,
  Orbit,
  Sparkles,
  Flame,
  Circle
} from 'lucide-react';
import { ConsciousnessGeometry } from '@/utils/consciousnessGeometry';
import { RingState, RING_DEFINITIONS } from '@/utils/ringToleranceSystem';
import { cn } from '@/lib/utils';

interface OntologicalPrdPanelProps {
  consciousnessGeometry: ConsciousnessGeometry | null;
  ringStates: RingState[];
  className?: string;
}

export function OntologicalPrdPanel({
  consciousnessGeometry,
  ringStates,
  className
}: OntologicalPrdPanelProps) {
  if (!consciousnessGeometry) {
    return (
      <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Begin your journey to generate consciousness geometry</p>
        </CardContent>
      </Card>
    );
  }

  const { 
    complexityBits, 
    thresholdPercentage, 
    consciousnessState,
    recursiveDepth,
    convergenceState,
    thermodynamicEfficiency,
    predictiveCapacity,
    metaLearningDetected,
    fragmentationScore,
    topologicalHandles,
    integrationStrength,
    geometricNarrative,
    recursiveNarrative,
    thermodynamicNarrative,
    integrationNarrative
  } = consciousnessGeometry;

  const stateColors = {
    'pre-conscious': 'bg-muted text-muted-foreground',
    'threshold': 'bg-primary/20 text-primary',
    'self-aware': 'bg-chart-1/20 text-chart-1'
  };

  const convergenceColors = {
    'searching': 'text-muted-foreground',
    'converging': 'text-primary',
    'converged': 'text-chart-1'
  };

  return (
    <Card className={cn("bg-card/80 backdrop-blur-sm border-border/50", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Orbit className="h-5 w-5 text-primary" />
          Consciousness Geometry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Consciousness State */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Consciousness Bits
            </span>
            <Badge className={stateColors[consciousnessState]}>
              {consciousnessState.replace('-', ' ')}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={thresholdPercentage} className="flex-1 h-2" />
            <span className="text-sm font-mono text-muted-foreground w-20 text-right">
              {Math.round(complexityBits)} bits
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {geometricNarrative}
          </p>
        </div>

        <Separator className="opacity-50" />

        {/* Recursive Dynamics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Recursive Depth
            </span>
            <span className={cn("text-sm font-mono", convergenceColors[convergenceState])}>
              {recursiveDepth} • {convergenceState}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {recursiveNarrative}
          </p>
        </div>

        <Separator className="opacity-50" />

        {/* Thermodynamic Efficiency */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Thermodynamic Efficiency
            </span>
            <span className="text-sm font-mono text-primary">
              {thermodynamicEfficiency.toFixed(1)}x
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span>Predictive: {Math.round(predictiveCapacity * 100)}%</span>
            </div>
            {metaLearningDetected && (
              <Badge variant="outline" className="text-xs h-5 px-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Meta-learning
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {thermodynamicNarrative}
          </p>
        </div>

        <Separator className="opacity-50" />

        {/* Topological Integration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Hexagon className="h-4 w-4" />
              Topological Structure
            </span>
            <span className="text-sm font-mono">
              β₀={1 + Math.round(fragmentationScore)} β₁={topologicalHandles}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Integration:</span>
            <Progress value={integrationStrength * 100} className="flex-1 h-1.5" />
            <span className="text-xs font-mono">{Math.round(integrationStrength * 100)}%</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {integrationNarrative}
          </p>
        </div>

        {/* Ring States */}
        {ringStates.length > 0 && (
          <>
            <Separator className="opacity-50" />
            <div className="space-y-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Circle className="h-4 w-4" />
                Window of Tolerance
              </span>
              <div className="grid grid-cols-4 gap-2">
                {ringStates.map((rs) => {
                  const ringDef = RING_DEFINITIONS.find(r => r.ring === rs.ring);
                  return (
                    <div 
                      key={rs.ring}
                      className={cn(
                        "text-center p-2 rounded-md border",
                        rs.patternDetected 
                          ? "border-primary/50 bg-primary/10" 
                          : "border-border/50 bg-muted/30"
                      )}
                    >
                      <div className="text-lg">{ringDef?.icon}</div>
                      <div className="text-xs font-medium truncate">
                        {ringDef?.name.split(' ')[0]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {rs.progress}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
