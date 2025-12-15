import React, { useEffect, useState } from 'react';
import { Flower2, Lightbulb, BookOpen, Landmark, Music, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProjectSeasonProgressAsync, SeasonPersistenceState, Season } from '@/hooks/useSeasonPersistence';
import { supabase } from '@/integrations/supabase/client';

interface SeasonProgressIndicatorProps {
  projectId: string;
  compact?: boolean;
  showRecoveryHint?: boolean;
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
  compact = false,
  showRecoveryHint = false
}) => {
  const [progress, setProgress] = useState<SeasonPersistenceState | null>(null);
  const [polenCount, setPolenCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const loadedProgress = await getProjectSeasonProgressAsync(projectId, user?.id);
      setProgress(loadedProgress);
      
      // Also get POLEN count for this user
      if (user?.id) {
        const { count } = await supabase
          .from('polen_entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        setPolenCount(count || 0);
      }
      
      setIsLoading(false);
    };
    loadProgress();
  }, [projectId]);
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }
  
  // Calculate total tiles from progress
  const totalTiles = progress 
    ? SEASONS.reduce((acc, season) => acc + (progress.seasonProgress[season]?.size || 0), 0)
    : 0;
  
  if (!progress || totalTiles === 0) {
    // No progress yet - show empty state with POLEN hint
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
        <span className="ml-2 text-xs text-muted-foreground">
          {showRecoveryHint && polenCount > 0 
            ? `${polenCount} fragments saved`
            : 'Not started'
          }
        </span>
      </div>
    );
  }

  const { currentSeason, completedSeasons, seasonProgress } = progress;
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
