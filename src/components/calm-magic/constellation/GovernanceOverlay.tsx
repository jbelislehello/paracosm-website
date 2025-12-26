import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ManifoldEntry } from '@/hooks/useManifoldData';

interface ProjectedEntry extends ManifoldEntry {
  projectedX: number;
  projectedY: number;
  projectedZ: number;
  gateStage?: number;
  gateStatus?: 'passed' | 'blocked' | 'pending' | 'in-progress';
}

interface GovernanceOverlayProps {
  entries: ProjectedEntry[];
}

const GATE_STAGES = [
  { id: 0, label: 'Policy', color: 'hsl(var(--chart-1))' },
  { id: 1, label: 'Review', color: 'hsl(var(--chart-2))' },
  { id: 2, label: 'Approval', color: 'hsl(var(--chart-3))' },
  { id: 3, label: 'Audit', color: 'hsl(var(--chart-4))' },
  { id: 4, label: 'Release', color: 'hsl(var(--chart-5))' },
];

const StatusIcon = ({ status }: { status?: string }) => {
  switch (status) {
    case 'passed':
      return <CheckCircle2 className="w-3 h-3 text-green-500" />;
    case 'blocked':
      return <AlertTriangle className="w-3 h-3 text-destructive" />;
    case 'in-progress':
      return <Clock className="w-3 h-3 text-yellow-500" />;
    default:
      return <Circle className="w-3 h-3 text-muted-foreground" />;
  }
};

export function GovernanceOverlay({ entries }: GovernanceOverlayProps) {
  // Group entries by gate stage
  const entriesByGate = GATE_STAGES.map(gate => ({
    ...gate,
    entries: entries.filter(e => e.gateStage === gate.id)
  }));

  // Count blocked items
  const blockedCount = entries.filter(e => e.gateStatus === 'blocked').length;
  const inProgressCount = entries.filter(e => e.gateStatus === 'in-progress').length;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Gate Lines - Vertical bars across the view */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-stretch h-[60%]">
        {GATE_STAGES.map((gate, index) => (
          <div 
            key={gate.id}
            className="flex flex-col items-center gap-2"
          >
            {/* Gate Line */}
            <div 
              className="w-1 flex-1 rounded-full opacity-60"
              style={{ backgroundColor: gate.color }}
            />
            
            {/* Gate Label */}
            <Badge 
              variant="outline" 
              className="text-[10px] whitespace-nowrap pointer-events-auto"
              style={{ borderColor: gate.color, color: gate.color }}
            >
              {gate.label}
            </Badge>

            {/* Entry count at this gate */}
            {entriesByGate[index].entries.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>{entriesByGate[index].entries.length}</span>
                {entriesByGate[index].entries.some(e => e.gateStatus === 'blocked') && (
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flow Direction Arrow */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Policy</span>
        <div className="flex items-center gap-0.5">
          <div className="w-16 h-px bg-muted-foreground/50" />
          <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[6px] border-l-muted-foreground/50" />
        </div>
        <span>Release</span>
      </div>

      {/* Summary Stats */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3 pointer-events-auto">
        {blockedCount > 0 && (
          <Badge variant="destructive" className="text-[10px] gap-1">
            <AlertTriangle className="w-3 h-3" />
            {blockedCount} blocked
          </Badge>
        )}
        {inProgressCount > 0 && (
          <Badge variant="secondary" className="text-[10px] gap-1">
            <Clock className="w-3 h-3" />
            {inProgressCount} in progress
          </Badge>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><StatusIcon status="passed" /> Passed</span>
        <span className="flex items-center gap-1"><StatusIcon status="in-progress" /> In Progress</span>
        <span className="flex items-center gap-1"><StatusIcon status="blocked" /> Blocked</span>
      </div>
    </div>
  );
}
