import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flower2, BookOpen, Mountain, Music, Sun, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Season = 'POLLEN' | 'POEM' | 'TOTEM' | 'ANTHEM';

interface SeasonProgressBarProps {
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  completedSeasons: Season[];
  freeTilesUnlocked: boolean;
}

const SEASONS: { 
  id: Season; 
  label: string; 
  description: string;
  icon: typeof Flower2;
  color: string;
  bgColor: string;
}[] = [
  { id: 'POLLEN', label: 'POLLEN', description: 'Signals & Context', icon: Flower2, color: 'text-rose-500', bgColor: 'bg-rose-500' },
  { id: 'POEM', label: 'POEM', description: 'Narrative & Meaning', icon: BookOpen, color: 'text-purple-500', bgColor: 'bg-purple-500' },
  { id: 'TOTEM', label: 'TOTEM', description: 'Form & Interfaces', icon: Mountain, color: 'text-blue-500', bgColor: 'bg-blue-500' },
  { id: 'ANTHEM', label: 'ANTHEM', description: 'Alignment & Impact', icon: Music, color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
];

const SeasonProgressBar = ({
  currentSeason,
  seasonProgress,
  completedSeasons,
  freeTilesUnlocked
}: SeasonProgressBarProps) => {
  const currentProgress = seasonProgress[currentSeason]?.size || 0;
  const progressPercent = (currentProgress / 64) * 100;

  return (
    <div className="flex items-center gap-4">
      {/* Season segments */}
      <div className="flex items-center gap-1">
        {SEASONS.map((season, idx) => {
          const Icon = season.icon;
          const isActive = currentSeason === season.id;
          const isCompleted = completedSeasons.includes(season.id);
          const tilesVisited = seasonProgress[season.id]?.size || 0;
          
          return (
            <div key={season.id} className="flex items-center">
              {/* Season indicator */}
              <div 
                className={cn(
                  "relative flex items-center gap-1.5 px-2 py-1 rounded-md transition-all",
                  isActive && "ring-2 ring-offset-1 ring-offset-background ring-primary",
                  isCompleted && "opacity-80"
                )}
              >
                {isCompleted ? (
                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", season.bgColor)}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <Icon className={cn("w-4 h-4", isActive ? season.color : "text-muted-foreground")} />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {season.label}
                </span>
                
                {/* Progress indicator for active season */}
                {isActive && !isCompleted && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {tilesVisited}/64
                  </Badge>
                )}
              </div>
              
              {/* Arrow separator */}
              {idx < SEASONS.length - 1 && (
                <span className="text-muted-foreground/50 mx-1">→</span>
              )}
            </div>
          );
        })}
        
        {/* FREE indicator */}
        <div className="flex items-center ml-1">
          <span className="text-muted-foreground/50 mx-1">→</span>
          <div 
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md",
              freeTilesUnlocked 
                ? "bg-amber-500/10 ring-2 ring-amber-500 ring-offset-1 ring-offset-background" 
                : "opacity-50"
            )}
          >
            {freeTilesUnlocked ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
            <span className={cn(
              "text-xs font-medium",
              freeTilesUnlocked ? "text-amber-600" : "text-muted-foreground"
            )}>
              FREE
            </span>
          </div>
        </div>
      </div>

      {/* Current season progress bar */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <Progress value={progressPercent} className="h-2 w-20" />
        <span className="text-xs text-muted-foreground">
          {Math.round(progressPercent)}%
        </span>
      </div>
    </div>
  );
};

export default SeasonProgressBar;
