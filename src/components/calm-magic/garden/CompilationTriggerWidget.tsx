/**
 * Compilation Trigger Widget
 * 
 * Visual display of auto-compilation trigger statuses
 * with progress indicators toward each threshold.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Link2, 
  Layers,
  CheckCircle2,
  Circle,
  Loader2
} from 'lucide-react';
import { AutoCompilationTrigger, Season } from '@/hooks/useAutoCompilation';
import { cn } from '@/lib/utils';

interface CompilationTriggerWidgetProps {
  triggers: AutoCompilationTrigger[];
  isCompiling: boolean;
  compiledLayers: Season[];
  className?: string;
}

const TRIGGER_ICONS: Record<AutoCompilationTrigger['type'], React.ReactNode> = {
  consciousness: <Brain className="h-4 w-4" />,
  ring: <Target className="h-4 w-4" />,
  coherence: <Link2 className="h-4 w-4" />,
  density: <Layers className="h-4 w-4" />
};

const TRIGGER_LABELS: Record<AutoCompilationTrigger['type'], string> = {
  consciousness: 'Consciousness',
  ring: 'Ring Pattern',
  coherence: 'Coherence',
  density: 'Fragment Density'
};

export function CompilationTriggerWidget({
  triggers,
  isCompiling,
  compiledLayers,
  className
}: CompilationTriggerWidgetProps) {
  const triggeredCount = triggers.filter(t => t.triggered).length;
  const allSeasons: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
  
  return (
    <Card className={cn("bg-card/60 backdrop-blur-sm border-border/50", className)}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCompiling ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : triggeredCount > 0 ? (
              <CheckCircle2 className="h-4 w-4 text-chart-1" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {isCompiling 
                ? 'Crystallizing...' 
                : triggeredCount > 0 
                  ? `${triggeredCount} trigger${triggeredCount > 1 ? 's' : ''} active` 
                  : 'Monitoring thresholds'}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {compiledLayers.length}/5 layers
          </Badge>
        </div>

        {/* Season Compilation Status */}
        <div className="flex gap-1">
          {allSeasons.map((season) => (
            <div
              key={season}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-colors",
                compiledLayers.includes(season)
                  ? "bg-primary"
                  : "bg-muted"
              )}
              title={`${season}: ${compiledLayers.includes(season) ? 'Compiled' : 'Pending'}`}
            />
          ))}
        </div>

        {/* Trigger Indicators */}
        <div className="grid grid-cols-2 gap-2">
          {triggers.map((trigger, idx) => {
            const progress = Math.min(100, (trigger.currentValue / trigger.threshold) * 100);
            
            return (
              <div 
                key={`${trigger.type}-${idx}`}
                className={cn(
                  "p-2 rounded-md border transition-colors",
                  trigger.triggered 
                    ? "border-primary/50 bg-primary/10" 
                    : "border-border/30 bg-muted/20"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn(
                    trigger.triggered ? "text-primary" : "text-muted-foreground"
                  )}>
                    {TRIGGER_ICONS[trigger.type]}
                  </span>
                  <span className="text-xs font-medium truncate">
                    {TRIGGER_LABELS[trigger.type]}
                  </span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-1"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {typeof trigger.currentValue === 'number' 
                      ? trigger.currentValue.toFixed(trigger.type === 'coherence' ? 2 : 0)
                      : trigger.currentValue}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    / {trigger.threshold}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Trigger Message */}
        {triggers.filter(t => t.triggered).slice(0, 1).map((trigger, idx) => (
          <div 
            key={idx}
            className="text-xs text-center text-primary/80 bg-primary/5 rounded-md p-2"
          >
            ✨ {trigger.message}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
