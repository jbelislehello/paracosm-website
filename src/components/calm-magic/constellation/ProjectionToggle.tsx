import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlignLeft, Target, Orbit, GitBranch } from 'lucide-react';
import { ProjectionMode } from '@/hooks/useProjectionEngine';
import { cn } from '@/lib/utils';

interface ProjectionToggleProps {
  value: ProjectionMode;
  onChange: (mode: ProjectionMode) => void;
  className?: string;
}

const PROJECTION_CONFIGS: Record<ProjectionMode, {
  icon: typeof AlignLeft;
  label: string;
  tooltip: string;
}> = {
  chronos: {
    icon: AlignLeft,
    label: 'Timeline',
    tooltip: 'Chronos: Events arranged by time sequence'
  },
  kairos: {
    icon: Target,
    label: 'Now-Gravity',
    tooltip: 'Kairos: Recent & relevant events pulled to center'
  },
  mythos: {
    icon: Orbit,
    label: 'Spiral',
    tooltip: 'Mythos: Recurring patterns form a spiral'
  },
  causality: {
    icon: GitBranch,
    label: 'Graph',
    tooltip: 'Causality: Connected events cluster together'
  }
};

export function ProjectionToggle({ value, onChange, className }: ProjectionToggleProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(v) => v && onChange(v as ProjectionMode)}
        className={cn("bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-1", className)}
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
                    "px-3 py-2 gap-1.5 text-xs font-medium transition-all",
                    "data-[state=on]:bg-primary/20 data-[state=on]:text-primary",
                    "hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>{config.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </ToggleGroup>
    </TooltipProvider>
  );
}
