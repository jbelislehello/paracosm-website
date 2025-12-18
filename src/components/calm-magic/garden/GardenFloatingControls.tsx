import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Maximize2, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GardenFloatingControlsProps {
  onToggleFullscreen?: () => void;
  onToggleAudio?: () => void;
  onToggleParticles?: (enabled: boolean) => void;
  onResetView?: () => void;
  onVolumeChange?: (volume: number) => void;
  audioEnabled?: boolean;
  audioVolume?: number;
  audioProfileName?: string;
  particlesEnabled?: boolean;
  className?: string;
}

const GardenFloatingControls = ({
  onToggleFullscreen,
  onToggleAudio,
  onToggleParticles,
  onResetView,
  onVolumeChange,
  audioEnabled = false,
  audioVolume = 0.5,
  audioProfileName,
  particlesEnabled = true,
  className,
}: GardenFloatingControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "transition-all duration-300",
          className
        )}
      >
        {/* Volume slider popover */}
        {showVolumeSlider && audioEnabled && (
          <div 
            className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-3",
              "p-3 rounded-xl bg-background/80 backdrop-blur-xl",
              "border border-white/10 shadow-xl",
              "min-w-[180px]"
            )}
          >
            <div className="flex items-center gap-3">
              <VolumeX className="w-3 h-3 text-muted-foreground shrink-0" />
              <Slider
                value={[audioVolume * 100]}
                onValueChange={([val]) => onVolumeChange?.(val / 100)}
                max={100}
                step={1}
                className="flex-1"
              />
              <Volume2 className="w-3 h-3 text-muted-foreground shrink-0" />
            </div>
            {audioProfileName && (
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                {audioProfileName}
              </p>
            )}
          </div>
        )}

        <div 
          className={cn(
            "flex items-center gap-2 p-2 rounded-full",
            "bg-background/60 backdrop-blur-xl",
            "border border-white/10 shadow-2xl",
            "transition-all duration-300",
            isExpanded ? "px-4" : "px-2"
          )}
        >
          {/* Expand/Collapse button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-white/10"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isExpanded ? 'Hide Controls' : 'Show Controls'}
            </TooltipContent>
          </Tooltip>
          
          {isExpanded && (
            <>
              {/* Divider */}
              <div className="w-px h-6 bg-white/20" />
              
              {/* Particles toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={particlesEnabled}
                    onPressedChange={onToggleParticles}
                    className={cn(
                      "h-9 w-9 rounded-full data-[state=on]:bg-primary/20",
                      "hover:bg-white/10"
                    )}
                  >
                    <Sparkles className={cn(
                      "h-4 w-4 transition-colors",
                      particlesEnabled && "text-primary"
                    )} />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {particlesEnabled ? 'Hide Ambient Particles' : 'Show Ambient Particles'}
                </TooltipContent>
              </Tooltip>
              
              {/* Audio toggle with volume */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-9 w-9 rounded-full",
                      "hover:bg-white/10",
                      audioEnabled && "bg-primary/20"
                    )}
                    onClick={onToggleAudio}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (audioEnabled) {
                        setShowVolumeSlider(!showVolumeSlider);
                      }
                    }}
                  >
                    {audioEnabled ? (
                      <Volume2 className="h-4 w-4 text-primary" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {audioEnabled 
                    ? `${audioProfileName || 'Ambient Sounds'} (right-click for volume)`
                    : 'Enable Ambient Sounds'}
                </TooltipContent>
              </Tooltip>

              {/* Volume slider inline toggle (when audio is playing) */}
              {audioEnabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-full hover:bg-white/10",
                    showVolumeSlider && "bg-white/10"
                  )}
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                >
                  <div className="h-4 w-4 flex items-end justify-center gap-0.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 bg-current rounded-full transition-all",
                          audioVolume >= i * 0.33 ? "opacity-100" : "opacity-30"
                        )}
                        style={{ height: `${i * 4 + 4}px` }}
                      />
                    ))}
                  </div>
                </Button>
              )}
              
              {/* Reset view */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-white/10"
                    onClick={onResetView}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Reset View</TooltipContent>
              </Tooltip>
              
              {/* Fullscreen tree */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-white/10"
                    onClick={onToggleFullscreen}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Fullscreen Tree</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default GardenFloatingControls;
