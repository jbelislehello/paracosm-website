import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Maximize2, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles,
  TreeDeciduous,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GardenFloatingControlsProps {
  onToggleFullscreen?: () => void;
  onToggleAudio?: (enabled: boolean) => void;
  onToggleParticles?: (enabled: boolean) => void;
  onResetView?: () => void;
  audioEnabled?: boolean;
  particlesEnabled?: boolean;
  className?: string;
}

const GardenFloatingControls = ({
  onToggleFullscreen,
  onToggleAudio,
  onToggleParticles,
  onResetView,
  audioEnabled = false,
  particlesEnabled = true,
  className,
}: GardenFloatingControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "transition-all duration-300",
          className
        )}
      >
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
              
              {/* Audio toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={audioEnabled}
                    onPressedChange={onToggleAudio}
                    className={cn(
                      "h-9 w-9 rounded-full data-[state=on]:bg-primary/20",
                      "hover:bg-white/10"
                    )}
                  >
                    {audioEnabled ? (
                      <Volume2 className="h-4 w-4 text-primary" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {audioEnabled ? 'Mute Ambient Sounds' : 'Enable Ambient Sounds'}
                </TooltipContent>
              </Tooltip>
              
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
