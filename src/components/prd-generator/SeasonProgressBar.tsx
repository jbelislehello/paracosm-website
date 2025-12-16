import { Flower2, Lightbulb, BookOpen, Mountain, Music, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { SEASON_DEFINITIONS } from '@/data/seasonDefinitions';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface SeasonProgressBarProps {
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  completedSeasons: Season[];
}

const SEASONS: { 
  id: Season; 
  label: string; 
  icon: typeof Flower2;
  color: string;
  bgColor: string;
  gradient: string;
  description: string;
}[] = [
  { id: 'POLLENS', label: 'Pollens', icon: Flower2, color: 'text-rose-500', bgColor: 'bg-rose-500', gradient: 'from-rose-500 to-pink-500', description: SEASON_DEFINITIONS.POLLENS.shortDescription },
  { id: 'NOEMS', label: 'Noems', icon: Lightbulb, color: 'text-violet-500', bgColor: 'bg-violet-500', gradient: 'from-violet-500 to-purple-500', description: SEASON_DEFINITIONS.NOEMS.shortDescription },
  { id: 'POEMS', label: 'Poems', icon: BookOpen, color: 'text-purple-500', bgColor: 'bg-purple-500', gradient: 'from-purple-500 to-indigo-500', description: SEASON_DEFINITIONS.POEMS.shortDescription },
  { id: 'TOTEMS', label: 'Totems', icon: Mountain, color: 'text-blue-500', bgColor: 'bg-blue-500', gradient: 'from-blue-500 to-cyan-500', description: SEASON_DEFINITIONS.TOTEMS.shortDescription },
  { id: 'ANTHEMS', label: 'Anthems', icon: Music, color: 'text-emerald-500', bgColor: 'bg-emerald-500', gradient: 'from-emerald-500 to-green-500', description: SEASON_DEFINITIONS.ANTHEMS.shortDescription },
];

const SeasonProgressBar = ({
  currentSeason,
  seasonProgress,
  completedSeasons,
}: SeasonProgressBarProps) => {
  return (
    <TooltipProvider>
      <nav className="flex items-center gap-1">
        {SEASONS.map((season, idx) => {
          const Icon = season.icon;
          const isActive = currentSeason === season.id;
          const isCompleted = completedSeasons.includes(season.id);
          const tilesVisited = seasonProgress[season.id]?.size || 0;
          
          return (
            <div key={season.id} className="flex items-center">
              {/* Season pill with tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-default",
                      isActive && `bg-gradient-to-r ${season.gradient} text-white shadow-md`,
                      !isActive && !isCompleted && "text-muted-foreground hover:bg-muted/50",
                      isCompleted && "bg-muted text-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", season.bgColor)}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    ) : (
                      <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : season.color)} />
                    )}
                    <span className="text-xs font-medium">
                      {season.label}
                    </span>
                    
                    {/* Progress counter for active season */}
                    {isActive && !isCompleted && (
                      <span className="text-[10px] opacity-80 ml-0.5">
                        {tilesVisited}/64
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-medium">{season.description}</p>
                  {season.id === 'POEMS' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-bold">P</span>eople • <span className="font-bold">O</span>bjects • <span className="font-bold">E</span>nvironments • <span className="font-bold">M</span>essages • <span className="font-bold">S</span>ystems
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
              
              {/* Arrow separator */}
              {idx < SEASONS.length - 1 && (
                <span className="text-muted-foreground/40 mx-0.5 text-xs">›</span>
              )}
            </div>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};

export default SeasonProgressBar;
