import { Lock, Check, Loader2 } from 'lucide-react';
import { 
  RING_DEFINITIONS, 
  RingState, 
  calculateRingStates,
  RingLevel 
} from '@/utils/ringToleranceSystem';
import { cn } from '@/lib/utils';

interface RingStateIndicatorProps {
  visitedTiles: Set<string>;
  currentUnlockedRing: RingLevel;
  compact?: boolean;
  className?: string;
}

export function RingStateIndicator({
  visitedTiles,
  currentUnlockedRing,
  compact = false,
  className
}: RingStateIndicatorProps) {
  const ringStates = calculateRingStates(visitedTiles, currentUnlockedRing);

  const getStatusIcon = (state: RingState) => {
    if (state.patternDetected || state.status === 'unlocked') {
      return <Check className="w-3 h-3 text-primary" />;
    }
    if (state.status === 'in-progress') {
      return <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />;
    }
    return <Lock className="w-3 h-3 text-muted-foreground/50" />;
  };

  const getStatusText = (state: RingState) => {
    if (state.patternDetected) return 'Pattern Detected';
    if (state.status === 'unlocked') return 'Unlocked';
    if (state.status === 'in-progress') return `${state.progress}%`;
    return 'Locked';
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {ringStates.map((state) => {
          const ringDef = RING_DEFINITIONS.find(d => d.ring === state.ring);
          if (!ringDef) return null;
          
          return (
            <div
              key={state.ring}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                state.patternDetected || state.status === 'unlocked'
                  ? "border-transparent"
                  : state.status === 'in-progress'
                    ? "border-dashed animate-pulse"
                    : "border-muted-foreground/30 opacity-50"
              )}
              style={{ 
                backgroundColor: state.patternDetected || state.status === 'unlocked' 
                  ? ringDef.color 
                  : 'transparent',
                color: state.patternDetected || state.status === 'unlocked'
                  ? 'white'
                  : undefined,
                borderColor: state.status === 'in-progress' ? ringDef.color : undefined
              }}
              title={`Ring ${state.ring}: ${ringDef.name} - ${getStatusText(state)}`}
            >
              {state.ring}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border/50 p-3 space-y-2 bg-card/50", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Window of Tolerance
        </h4>
      </div>
      
      <div className="space-y-1.5">
        {ringStates.map((state) => {
          const ringDef = RING_DEFINITIONS.find(d => d.ring === state.ring);
          if (!ringDef) return null;
          
          return (
            <div key={state.ring} className="flex items-center gap-2">
              {/* Ring indicator dot */}
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: ringDef.color }}
              />
              
              {/* Ring info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-medium truncate">
                    {ringDef.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({ringDef.patternType})
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-1 bg-muted rounded-full mt-0.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${state.progress}%`,
                      backgroundColor: ringDef.color
                    }}
                  />
                </div>
              </div>
              
              {/* Status */}
              <div className="shrink-0">
                {getStatusIcon(state)}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Wisdom quote */}
      <div className="pt-2 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground italic text-center">
          "Tolerance without wisdom hinders innovation"
        </p>
      </div>
    </div>
  );
}

export default RingStateIndicator;
