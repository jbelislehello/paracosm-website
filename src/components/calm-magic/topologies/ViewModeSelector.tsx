import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Box, Diamond, Orbit, Grid3X3, Compass, Wind, Layers, RotateCw, Atom } from 'lucide-react';

export type TopologyViewMode = 'isometric' | 'diamond' | 'spiral' | 'charts' | 'coordinates' | 'cycles' | 'flow' | 'projection' | 'gravity';

interface ViewConfig {
  icon: typeof Box;
  label: string;
  tooltip: string;
}

const VIEW_CONFIGS: Record<TopologyViewMode, ViewConfig> = {
  isometric: {
    icon: Box,
    label: 'Journey Grid',
    tooltip: 'Where have I explored? See your path through 3D space.'
  },
  diamond: {
    icon: Diamond,
    label: 'Design Rhythm',
    tooltip: 'Am I diverging or converging? Map tiles to design phases.'
  },
  spiral: {
    icon: Orbit,
    label: 'Expansion Path',
    tooltip: 'How has my capacity grown? Track ring-by-ring expansion.'
  },
  charts: {
    icon: Grid3X3,
    label: 'Atlas View',
    tooltip: 'Which charts have I mapped? See your exploration as an atlas.'
  },
  coordinates: {
    icon: Compass,
    label: 'Position Map',
    tooltip: 'Where exactly am I? Precise coordinates on the surface.'
  },
  gravity: {
    icon: Atom,
    label: 'Gravity Well',
    tooltip: 'What forces shape your journey? See gravitational fields between Shadow and Higher Self.'
  },
  cycles: {
    icon: RotateCw,
    label: 'Pattern Loops',
    tooltip: 'What keeps recurring? Find completed and broken cycles.'
  },
  flow: {
    icon: Wind,
    label: 'Energy Field',
    tooltip: 'Where is momentum pulling? See attractors and flow.'
  },
  projection: {
    icon: Layers,
    label: 'Hidden Structure',
    tooltip: 'What connections hide? Unfold the torus to see neighbors.'
  }
};

interface ViewModeSelectorProps {
  value: TopologyViewMode;
  onChange: (mode: TopologyViewMode) => void;
}

export function ViewModeSelector({ value, onChange }: ViewModeSelectorProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(v) => v && onChange(v as TopologyViewMode)}
        className="justify-start flex-wrap"
      >
        {(Object.entries(VIEW_CONFIGS) as [TopologyViewMode, ViewConfig][]).map(([mode, config]) => {
          const Icon = config.icon;
          return (
            <Tooltip key={mode}>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value={mode} 
                  aria-label={config.tooltip} 
                  className="gap-1.5 text-xs"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <p className="text-xs">{config.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </ToggleGroup>
    </TooltipProvider>
  );
}
