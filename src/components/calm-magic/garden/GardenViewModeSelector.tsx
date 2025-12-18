import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TreeDeciduous, Grid3X3, FileText, Mountain, Waves, Trees } from 'lucide-react';

export type GardenViewMode = 'ecological' | 'tree' | 'prd';

interface ViewConfig {
  icon: typeof TreeDeciduous;
  label: string;
  tooltip: string;
}

const VIEW_CONFIGS: Record<GardenViewMode, ViewConfig> = {
  ecological: {
    icon: Grid3X3,
    label: 'Ecological Garden',
    tooltip: 'View your journey as a 64-tile living landscape'
  },
  tree: {
    icon: TreeDeciduous,
    label: 'World Tree',
    tooltip: 'The Anthem Tree - your PRD as living organism'
  },
  prd: {
    icon: FileText,
    label: 'PRD Layers',
    tooltip: 'Review all 5 PRD layers in detail'
  }
};

interface GardenViewModeSelectorProps {
  value: GardenViewMode;
  onChange: (mode: GardenViewMode) => void;
}

export function GardenViewModeSelector({ value, onChange }: GardenViewModeSelectorProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(v) => v && onChange(v as GardenViewMode)}
        className="justify-start bg-background/60 backdrop-blur-sm rounded-lg p-1 border border-border/30"
      >
        {(Object.entries(VIEW_CONFIGS) as [GardenViewMode, ViewConfig][]).map(([mode, config]) => {
          const Icon = config.icon;
          return (
            <Tooltip key={mode}>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value={mode} 
                  aria-label={config.tooltip} 
                  className="gap-1.5 text-xs data-[state=on]:bg-primary/20 data-[state=on]:text-primary px-3 py-1.5"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{config.label}</span>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[220px]">
                <p className="text-xs">{config.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </ToggleGroup>
    </TooltipProvider>
  );
}

// Nature cognitive mode selector
export type NatureCognitiveMode = 'river' | 'mountain' | 'lake' | 'forest' | 'tree';

interface NatureModeConfig {
  icon: string;
  label: string;
  essence: string;
  color: string;
}

const NATURE_MODE_CONFIGS: Record<NatureCognitiveMode, NatureModeConfig> = {
  river: {
    icon: '🌊',
    label: 'River',
    essence: 'Flow around obstacles',
    color: 'hsl(200, 70%, 50%)'
  },
  mountain: {
    icon: '⛰️',
    label: 'Mountain',
    essence: 'Integration from above',
    color: 'hsl(45, 80%, 55%)'
  },
  lake: {
    icon: '🏞️',
    label: 'Lake',
    essence: 'Reflection and depth',
    color: 'hsl(210, 60%, 60%)'
  },
  forest: {
    icon: '🌳',
    label: 'Forest',
    essence: 'Ecosystem interconnection',
    color: 'hsl(142, 60%, 45%)'
  },
  tree: {
    icon: '🌱',
    label: 'Tree',
    essence: 'Rooted growth',
    color: 'hsl(340, 65%, 55%)'
  }
};

interface NatureModeSelectorProps {
  value: NatureCognitiveMode | null;
  onChange: (mode: NatureCognitiveMode) => void;
}

export function NatureModeSelector({ value, onChange }: NatureModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.entries(NATURE_MODE_CONFIGS) as [NatureCognitiveMode, NatureModeConfig][]).map(([mode, config]) => (
        <TooltipProvider key={mode} delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onChange(mode)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  border backdrop-blur-sm
                  ${value === mode 
                    ? 'bg-primary/20 border-primary/50 text-primary shadow-sm' 
                    : 'bg-background/40 border-border/30 text-muted-foreground hover:bg-background/60 hover:border-border/50'
                  }
                `}
                style={value === mode ? { borderColor: config.color, color: config.color } : undefined}
              >
                <span className="mr-1.5">{config.icon}</span>
                {config.label}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[180px]">
              <p className="text-xs font-medium">Think like a {config.label}</p>
              <p className="text-xs text-muted-foreground">{config.essence}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
