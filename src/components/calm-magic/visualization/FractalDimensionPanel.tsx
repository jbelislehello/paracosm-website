/**
 * Fractal Dimension Analysis Panel
 * 
 * Displays box-counting results, self-similarity patterns,
 * and multifractal spectrum charts.
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  performFractalAnalysis,
  calculateNavigationStats,
  FractalAnalysis,
  NavigationSequenceStats
} from '@/utils/fractalDimensionAnalysis';

interface FractalDimensionPanelProps {
  journeyPath: Array<{ row: number; col: number }>;
  densityMap: Map<string, number>;
  visible: boolean;
}

// Box-counting dimension visualization
function BoxCountingCard({ analysis }: { analysis: FractalAnalysis }) {
  const { dimension, confidence, regressionR2 } = analysis.boxCountingDimension;
  
  // Dimension interpretation
  const interpretation = useMemo(() => {
    if (dimension < 1.2) return { label: 'Linear Path', color: 'bg-blue-500' };
    if (dimension < 1.5) return { label: 'Moderate Complexity', color: 'bg-green-500' };
    if (dimension < 1.8) return { label: 'High Complexity', color: 'bg-yellow-500' };
    return { label: 'Space-Filling', color: 'bg-red-500' };
  }, [dimension]);

  return (
    <Card className="bg-background/80 backdrop-blur border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Box-Counting Dimension
          <Badge variant="outline" className={interpretation.color + ' text-white'}>
            {interpretation.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">
            D = {dimension.toFixed(3)}
          </span>
          <div className="text-right text-xs text-muted-foreground">
            <div>Confidence: {(confidence * 100).toFixed(1)}%</div>
            <div>R²: {regressionR2.toFixed(3)}</div>
          </div>
        </div>
        
        {/* Scaling data visualization */}
        <div className="h-16 flex items-end gap-1">
          {analysis.boxCountingDimension.scalingData.map((point, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/60 rounded-t transition-all hover:bg-primary"
              style={{ height: `${(Math.log(point.count + 1) / Math.log(65)) * 100}%` }}
              title={`ε=${point.epsilon.toFixed(3)}, N=${point.count}`}
            />
          ))}
        </div>
        <div className="text-xs text-center text-muted-foreground">
          Scale vs Box Count (log-log)
        </div>
      </CardContent>
    </Card>
  );
}

// Self-similarity patterns display
function SelfSimilarityCard({ analysis }: { analysis: FractalAnalysis }) {
  const topPatterns = analysis.selfSimilarityPatterns.slice(0, 5);

  return (
    <Card className="bg-background/80 backdrop-blur border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Self-Similarity Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topPatterns.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No significant patterns detected yet
          </p>
        ) : (
          <div className="space-y-2">
            {topPatterns.map((pattern, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-primary">
                    {pattern.basePattern.join(' → ')}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    ×{pattern.repetitionCount}
                  </Badge>
                </div>
                <Progress 
                  value={pattern.similarity * 100} 
                  className="h-1"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Multifractal spectrum chart
function MultifractalSpectrumCard({ analysis }: { analysis: FractalAnalysis }) {
  const { fAlpha, singularityStrength } = analysis.multifractalSpectrum;

  return (
    <Card className="bg-background/80 backdrop-blur border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Multifractal Spectrum
          <span className="text-xs text-muted-foreground font-normal">
            Δα = {singularityStrength.toFixed(3)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fAlpha.length < 2 ? (
          <p className="text-sm text-muted-foreground italic">
            Insufficient data for spectrum
          </p>
        ) : (
          <div className="relative h-24 border border-border/30 rounded">
            {/* f(α) curve */}
            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                points={fAlpha.map((p, i) => {
                  const x = ((p.alpha + 2) / 4) * 100;
                  const y = 50 - ((p.f + 1) / 2) * 50;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {fAlpha.map((p, i) => {
                const x = ((p.alpha + 2) / 4) * 100;
                const y = 50 - ((p.f + 1) / 2) * 50;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="hsl(var(--primary))"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-muted-foreground">
              α (Hölder exponent)
            </div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-muted-foreground -rotate-90 origin-left">
              f(α)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Additional metrics card
function FractalMetricsCard({ 
  analysis, 
  stats 
}: { 
  analysis: FractalAnalysis; 
  stats: NavigationSequenceStats;
}) {
  return (
    <Card className="bg-background/80 backdrop-blur border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Fractal Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Hausdorff Est.</div>
            <div className="font-mono text-primary">{analysis.hausdorffEstimate.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Correlation Dim</div>
            <div className="font-mono text-primary">{analysis.correlationDimension.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Lacunarity</div>
            <div className="font-mono text-primary">{analysis.lacunarity.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Path Efficiency</div>
            <div className="font-mono text-primary">{(stats.pathEfficiency * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Revisit Ratio</div>
            <div className="font-mono text-primary">{(stats.revisitRatio * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Turning Freq</div>
            <div className="font-mono text-primary">{(stats.turningFrequency * 100).toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FractalDimensionPanel({
  journeyPath,
  densityMap,
  visible
}: FractalDimensionPanelProps) {
  const { analysis, stats } = useMemo(() => {
    if (journeyPath.length < 3) {
      return { analysis: null, stats: null };
    }
    
    const analysis = performFractalAnalysis(journeyPath, densityMap);
    const stats = calculateNavigationStats(journeyPath);
    
    return { analysis, stats };
  }, [journeyPath, densityMap]);

  if (!visible) return null;

  if (!analysis || !stats) {
    return (
      <div className="absolute right-4 top-20 w-72 p-4">
        <Card className="bg-background/80 backdrop-blur border-border/50">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground italic text-center">
              Navigate more tiles to enable fractal analysis
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-20 w-72 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
      <BoxCountingCard analysis={analysis} />
      <SelfSimilarityCard analysis={analysis} />
      <MultifractalSpectrumCard analysis={analysis} />
      <FractalMetricsCard analysis={analysis} stats={stats} />
    </div>
  );
}

export default FractalDimensionPanel;
