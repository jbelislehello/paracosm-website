import React from 'react';
import { Flower2, Lightbulb, BookOpen, Landmark, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProjectSeasonProgress, Season } from '@/hooks/useSeasonPersistence';

interface SeasonProgressIndicatorProps {
  projectId: string;
  compact?: boolean;
}

const SEASONS: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const SEASON_CONFIG: Record<Season, { 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
  label: string;
}> = {
  POLLENS: { 
    icon: Flower2, 
    color: 'text-rose-500',
    bgColor: 'bg-rose-500',
    label: 'P'
  },
  NOEMS: { 
    icon: Lightbulb, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    label: 'N'
  },
  POEMS: { 
    icon: BookOpen, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    label: 'Po'
  },
  TOTEMS: { 
    icon: Landmark, 
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    label: 'T'
  },
  ANTHEMS: { 
    icon: Music, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    label: 'A'
  },
};

const TILES_PER_SEASON = 64;

export const SeasonProgressIndicator: React.FC<SeasonProgressIndicatorProps> = ({ 
  projectId,
  compact = false 
}) => {
  const progress = getProjectSeasonProgress(projectId);
  
  if (!progress) {
    // No progress yet - show empty state
    return (
      <div className="flex items-center gap-1">
        {SEASONS.map((season, idx) => (
          <React.Fragment key={season}>
            <div 
              className={cn(
                "rounded-full bg-muted",
                compact ? "w-2 h-2" : "w-3 h-3"
              )}
            />
            {idx < SEASONS.length - 1 && (
              <div className="w-2 h-px bg-muted" />
            )}
          </React.Fragment>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">Not started</span>
      </div>
    );
  }

  const { currentSeason, completedSeasons, seasonProgress } = progress;
  
  // Calculate overall progress
  const totalTiles = SEASONS.reduce((acc, season) => {
    return acc + (seasonProgress[season]?.size || 0);
  }, 0);
  const totalPossible = SEASONS.length * TILES_PER_SEASON;
  const overallPercentage = Math.round((totalTiles / totalPossible) * 100);

  const getSeasonStatus = (season: Season): 'complete' | 'current' | 'not-started' => {
    if (completedSeasons.includes(season)) return 'complete';
    if (season === currentSeason) return 'current';
    return 'not-started';
  };

  const getSeasonTileCount = (season: Season): number => {
    return seasonProgress[season]?.size || 0;
  };

  return (
    <div className="flex items-center gap-1">
      {SEASONS.map((season, idx) => {
        const status = getSeasonStatus(season);
        const config = SEASON_CONFIG[season];
        const tileCount = getSeasonTileCount(season);
        const Icon = config.icon;
        
        return (
          <React.Fragment key={season}>
            <div 
              className={cn(
                "relative rounded-full flex items-center justify-center transition-all",
                compact ? "w-3 h-3" : "w-4 h-4",
                status === 'complete' && config.bgColor,
                status === 'current' && `ring-2 ring-offset-1 ring-offset-background ${config.bgColor.replace('bg-', 'ring-')}`,
                status === 'not-started' && "bg-muted"
              )}
              title={`${season}: ${tileCount}/${TILES_PER_SEASON} tiles`}
            >
              {status === 'complete' && (
                <Icon className="w-2 h-2 text-white" />
              )}
              {status === 'current' && tileCount > 0 && (
                <div 
                  className={cn("absolute inset-0 rounded-full", config.bgColor)}
                  style={{ 
                    clipPath: `inset(${100 - (tileCount / TILES_PER_SEASON) * 100}% 0 0 0)` 
                  }}
                />
              )}
            </div>
            {idx < SEASONS.length - 1 && (
              <div className={cn(
                "h-px",
                compact ? "w-1" : "w-2",
                status === 'complete' || (status === 'current' && SEASONS.indexOf(currentSeason) > idx)
                  ? "bg-primary/50"
                  : "bg-muted"
              )} />
            )}
          </React.Fragment>
        );
      })}
      <span className="ml-2 text-xs text-muted-foreground">
        {completedSeasons.length}/{SEASONS.length} • {overallPercentage}%
      </span>
    </div>
  );
};

export default SeasonProgressIndicator;
