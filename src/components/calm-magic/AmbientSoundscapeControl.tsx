import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface AmbientSoundscapeControlProps {
  isPlaying: boolean;
  volume: number;
  currentSeason: Season;
  seasonCharacter: string;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export const AmbientSoundscapeControl: React.FC<AmbientSoundscapeControlProps> = ({
  isPlaying,
  volume,
  currentSeason,
  seasonCharacter,
  onToggle,
  onVolumeChange,
  className
}) => {
  const seasonColors: Record<Season, string> = {
    POLLENS: 'text-amber-500',
    NOEMS: 'text-purple-500',
    POEMS: 'text-blue-500',
    TOTEMS: 'text-emerald-500',
    ANTHEMS: 'text-rose-500'
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative transition-all duration-300",
            isPlaying && "text-primary",
            className
          )}
          title={isPlaying ? "Ambient soundscape playing" : "Start ambient soundscape"}
        >
          {isPlaying ? (
            <>
              <Volume2 className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-ambient-pulse" />
            </>
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className={cn("h-4 w-4", isPlaying && seasonColors[currentSeason])} />
              <span className="text-sm font-medium">Ambient Soundscape</span>
            </div>
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={onToggle}
              className="h-7 px-2 text-xs"
            >
              {isPlaying ? 'Stop' : 'Play'}
            </Button>
          </div>

          {isPlaying && (
            <>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full", seasonColors[currentSeason].replace('text-', 'bg-'))} />
                {seasonCharacter}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="text-muted-foreground">{Math.round(volume * 100)}%</span>
                </div>
                <Slider
                  value={[volume * 100]}
                  onValueChange={([val]) => onVolumeChange(val / 100)}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}

          {!isPlaying && (
            <p className="text-xs text-muted-foreground">
              Gentle harmonic drones that shift with each season. 
              Enhances focus and creates a meditative atmosphere.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
