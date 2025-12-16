import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Box, Diamond, Orbit, Grid3X3, Compass, Wind, Layers } from 'lucide-react';

export type TopologyViewMode = 'isometric' | 'diamond' | 'spiral' | 'charts' | 'coordinates' | 'cycles' | 'flow' | 'projection';

interface ViewModeSelectorProps {
  value: TopologyViewMode;
  onChange: (mode: TopologyViewMode) => void;
}

export function ViewModeSelector({ value, onChange }: ViewModeSelectorProps) {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(v) => v && onChange(v as TopologyViewMode)}
      className="justify-start flex-wrap"
    >
      <ToggleGroupItem value="isometric" aria-label="Isometric view" className="gap-1.5 text-xs">
        <Box className="w-3.5 h-3.5" />
        Isometric
      </ToggleGroupItem>
      <ToggleGroupItem value="diamond" aria-label="Double Diamond view" className="gap-1.5 text-xs">
        <Diamond className="w-3.5 h-3.5" />
        Diamond
      </ToggleGroupItem>
      <ToggleGroupItem value="spiral" aria-label="Spiral view" className="gap-1.5 text-xs">
        <Orbit className="w-3.5 h-3.5" />
        Spiral
      </ToggleGroupItem>
      <ToggleGroupItem value="charts" aria-label="Chart atlas view" className="gap-1.5 text-xs">
        <Grid3X3 className="w-3.5 h-3.5" />
        Charts
      </ToggleGroupItem>
      <ToggleGroupItem value="coordinates" aria-label="Coordinate reference" className="gap-1.5 text-xs">
        <Compass className="w-3.5 h-3.5" />
        Coords
      </ToggleGroupItem>
      <ToggleGroupItem value="cycles" aria-label="Fundamental cycles" className="gap-1.5 text-xs">
        <Orbit className="w-3.5 h-3.5" />
        Cycles
      </ToggleGroupItem>
      <ToggleGroupItem value="flow" aria-label="Flow field" className="gap-1.5 text-xs">
        <Wind className="w-3.5 h-3.5" />
        Flow
      </ToggleGroupItem>
      <ToggleGroupItem value="projection" aria-label="Unfolded projection" className="gap-1.5 text-xs">
        <Layers className="w-3.5 h-3.5" />
        Unfold
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
