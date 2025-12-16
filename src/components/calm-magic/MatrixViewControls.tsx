import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid3X3, Box, RotateCcw, Maximize2, Settings2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type MatrixViewMode = 'flat' | 'isometric';

interface MatrixViewControlsProps {
  viewMode: MatrixViewMode;
  onViewModeChange: (mode: MatrixViewMode) => void;
  showHorizonGrid: boolean;
  onShowHorizonGridChange: (show: boolean) => void;
  showDepthFog: boolean;
  onShowDepthFogChange: (show: boolean) => void;
  cubeSize: number;
  onCubeSizeChange: (size: number) => void;
  onResetView: () => void;
  onFullscreen?: () => void;
}

const MatrixViewControls: React.FC<MatrixViewControlsProps> = ({
  viewMode,
  onViewModeChange,
  showHorizonGrid,
  onShowHorizonGridChange,
  showDepthFog,
  onShowDepthFogChange,
  cubeSize,
  onCubeSizeChange,
  onResetView,
  onFullscreen,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* View Mode Toggle */}
      <ToggleGroup 
        type="single" 
        value={viewMode} 
        onValueChange={(v) => v && onViewModeChange(v as MatrixViewMode)}
        className="bg-muted/50 rounded-md p-0.5"
      >
        <ToggleGroupItem value="flat" size="sm" className="gap-1.5 px-2 h-7">
          <Grid3X3 className="w-3.5 h-3.5" />
          <span className="text-xs hidden sm:inline">2D</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="isometric" size="sm" className="gap-1.5 px-2 h-7">
          <Box className="w-3.5 h-3.5" />
          <span className="text-xs hidden sm:inline">2.5D</span>
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Settings Popover (only for 3D view) */}
      {viewMode === 'isometric' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Settings2 className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">View Settings</h4>
              
              {/* Cube Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Cube Size</Label>
                  <span className="text-xs text-muted-foreground">{cubeSize}px</span>
                </div>
                <Slider
                  value={[cubeSize]}
                  onValueChange={([v]) => onCubeSizeChange(v)}
                  min={25}
                  max={55}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Horizon Grid */}
              <div className="flex items-center justify-between">
                <Label className="text-xs">Horizon Grid</Label>
                <Switch
                  checked={showHorizonGrid}
                  onCheckedChange={onShowHorizonGridChange}
                />
              </div>

              {/* Depth Fog */}
              <div className="flex items-center justify-between">
                <Label className="text-xs">Depth Fog</Label>
                <Switch
                  checked={showDepthFog}
                  onCheckedChange={onShowDepthFogChange}
                />
              </div>

              {/* Reset View */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={onResetView}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                Reset View
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Fullscreen button */}
      {onFullscreen && viewMode === 'isometric' && (
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onFullscreen}>
          <Maximize2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default MatrixViewControls;
