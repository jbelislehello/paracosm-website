import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Box, Diamond, Orbit } from 'lucide-react';

export type TopologyViewMode = 'isometric' | 'diamond' | 'spiral';

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
      className="justify-start"
    >
      <ToggleGroupItem value="isometric" aria-label="Isometric view" className="gap-1.5 text-xs">
        <Box className="w-3.5 h-3.5" />
        Isometric
      </ToggleGroupItem>
      <ToggleGroupItem value="diamond" aria-label="Double Diamond view" className="gap-1.5 text-xs">
        <Diamond className="w-3.5 h-3.5" />
        Double Diamond
      </ToggleGroupItem>
      <ToggleGroupItem value="spiral" aria-label="Spiral view" className="gap-1.5 text-xs">
        <Orbit className="w-3.5 h-3.5" />
        Spiral
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
