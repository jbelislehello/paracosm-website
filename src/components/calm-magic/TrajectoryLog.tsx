import React from 'react';
import { TrajectoryEvent, QUADRANT_LABELS } from '@/types/trajectory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getQuadrantFromPosition } from '@/hooks/useQuadrantDynamics';
import { Play, Check, Sparkles, FileText, Target, Sliders } from 'lucide-react';

interface TrajectoryLogProps {
  events: TrajectoryEvent[];
  maxHeight?: string;
}

const EVENT_CONFIG: Record<TrajectoryEvent['event_type'], {
  icon: React.ReactNode;
  label: string;
  color: string;
}> = {
  season_start: {
    icon: <Play className="w-3 h-3" />,
    label: 'Season Started',
    color: 'bg-green-500/10 text-green-600',
  },
  tune_complete: {
    icon: <Check className="w-3 h-3" />,
    label: 'Tune Complete',
    color: 'bg-blue-500/10 text-blue-600',
  },
  season_end: {
    icon: <Sparkles className="w-3 h-3" />,
    label: 'Season Complete',
    color: 'bg-purple-500/10 text-purple-600',
  },
  prd_generated: {
    icon: <FileText className="w-3 h-3" />,
    label: 'PRD Generated',
    color: 'bg-amber-500/10 text-amber-600',
  },
  prophecy_set: {
    icon: <Target className="w-3 h-3" />,
    label: 'Prophecy Set',
    color: 'bg-primary/10 text-primary',
  },
  shadow_nudge: {
    icon: <Sliders className="w-3 h-3" />,
    label: 'Shadow Nudged',
    color: 'bg-orange-500/10 text-orange-600',
  },
};

export const TrajectoryLog: React.FC<TrajectoryLogProps> = ({ 
  events,
  maxHeight = '200px'
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No trajectory events yet. Start your journey to begin tracking.
      </div>
    );
  }

  // Sort events newest first
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <ScrollArea style={{ maxHeight }}>
      <div className="space-y-2 pr-3">
        {sortedEvents.map((event) => {
          const config = EVENT_CONFIG[event.event_type];
          const quadrant = getQuadrantFromPosition(event.shadow_position);
          
          return (
            <div 
              key={event.id}
              className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={`p-1.5 rounded-full ${config.color}`}>
                {config.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium">{config.label}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {event.season}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    → {quadrant}
                  </span>
                </div>
                
                {event.note && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {event.note}
                  </p>
                )}
                
                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default TrajectoryLog;
