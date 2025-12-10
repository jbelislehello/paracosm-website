import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ShadowFactors } from '@/types/trajectory';
import { GapInfo } from '@/utils/coherenceAnalysis';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ShadowFactorsDisplayProps {
  factors: ShadowFactors;
  gaps?: GapInfo[];
  showGaps?: boolean;
}

const FACTOR_CONFIG: { key: keyof ShadowFactors; label: string; description: string; color: string }[] = [
  { key: 'completeness', label: 'Completeness', description: 'Tiles visited', color: 'bg-chart-1' },
  { key: 'coherence', label: 'Coherence', description: 'Pattern clustering', color: 'bg-chart-2' },
  { key: 'depth', label: 'Depth', description: 'Engagement per tile', color: 'bg-chart-3' },
  { key: 'flow', label: 'Flow', description: 'Movement validity', color: 'bg-chart-4' },
];

const getSeverityIcon = (severity: GapInfo['severity']) => {
  switch (severity) {
    case 'high':
      return <XCircle className="w-3 h-3 text-destructive" />;
    case 'medium':
      return <AlertCircle className="w-3 h-3 text-amber-500" />;
    case 'low':
      return <CheckCircle2 className="w-3 h-3 text-muted-foreground" />;
  }
};

export const ShadowFactorsDisplay: React.FC<ShadowFactorsDisplayProps> = ({
  factors,
  gaps = [],
  showGaps = true
}) => {
  const overallScore = (
    factors.completeness * 0.3 +
    factors.coherence * 0.25 +
    factors.depth * 0.25 +
    factors.flow * 0.2
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Shadow Factors</h4>
        <Badge variant="outline" className="text-xs">
          {Math.round(overallScore * 100)}% overall
        </Badge>
      </div>

      <div className="space-y-3">
        {FACTOR_CONFIG.map((config) => {
          const value = factors[config.key];
          
          return (
            <div key={config.key} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{config.label}</span>
                <span className="text-xs font-mono text-foreground">
                  {Math.round(value * 100)}%
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className={`h-full transition-all duration-500 ${config.color}`}
                  style={{ width: `${value * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground/70">{config.description}</span>
            </div>
          );
        })}
      </div>

      {showGaps && gaps.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Detected Gaps</span>
          <div className="space-y-1">
            {gaps.slice(0, 3).map((gap, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {getSeverityIcon(gap.severity)}
                <span className="text-muted-foreground">{gap.description}</span>
              </div>
            ))}
            {gaps.length > 3 && (
              <span className="text-xs text-muted-foreground/70">
                +{gaps.length - 3} more gaps
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
