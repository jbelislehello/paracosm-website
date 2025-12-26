import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, ShieldCheck, GitBranch, Calendar, RefreshCw, Sparkles } from 'lucide-react';
import { ProjectionMode } from '@/hooks/useProjectionEngine';
import { cn } from '@/lib/utils';

interface ProjectionToggleProps {
  value: ProjectionMode;
  onChange: (mode: ProjectionMode) => void;
  className?: string;
}

const PROJECTION_CONFIGS: Record<ProjectionMode, {
  icon: typeof TrendingUp;
  label: string;
  tooltip: string;
  shortLabel: string;
}> = {
  strategy: {
    icon: TrendingUp,
    label: 'Strategy',
    shortLabel: 'Strat',
    tooltip: 'Spiral Ladder: Track progress through LOVE→MAGIC→CALM→OPEN→FREE'
  },
  governance: {
    icon: ShieldCheck,
    label: 'Governance',
    shortLabel: 'Gov',
    tooltip: 'Gate Map: Visualize approval flow through policy gates'
  },
  operations: {
    icon: GitBranch,
    label: 'Operations',
    shortLabel: 'Ops',
    tooltip: 'Dependency Graph: Show critical path and blockers'
  },
  delivery: {
    icon: Calendar,
    label: 'Delivery',
    shortLabel: 'Ship',
    tooltip: 'Roadmap: Timeline with milestones and next steps'
  },
  adoption: {
    icon: RefreshCw,
    label: 'Adoption',
    shortLabel: 'Adopt',
    tooltip: 'Cycle Ring: Track training, comms, reinforcement, measurement'
  },
  sensemaking: {
    icon: Sparkles,
    label: 'Sensemaking',
    shortLabel: 'Sense',
    tooltip: 'Constellation: Current decision with evidence and signals'
  }
};

export function ProjectionToggle({ value, onChange, className }: ProjectionToggleProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(v) => v && onChange(v as ProjectionMode)}
        className={cn("bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-1 flex-wrap", className)}
      >
        {(Object.entries(PROJECTION_CONFIGS) as [ProjectionMode, typeof PROJECTION_CONFIGS[ProjectionMode]][]).map(([mode, config]) => {
          const Icon = config.icon;
          return (
            <Tooltip key={mode}>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={mode}
                  aria-label={config.label}
                  className={cn(
                    "px-2 py-1.5 gap-1 text-xs font-medium transition-all",
                    "data-[state=on]:bg-primary/20 data-[state=on]:text-primary",
                    "hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{config.shortLabel}</span>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="font-medium">{config.label}</p>
                <p className="text-xs text-muted-foreground">{config.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </ToggleGroup>
    </TooltipProvider>
  );
}
