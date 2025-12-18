import { cn } from '@/lib/utils';

interface SeasonData {
  name: string;
  label: string;
  count: number;
  description: string;
}

interface SeasonFlowVisualizationProps {
  seasons: SeasonData[];
  className?: string;
}

const SEASON_COLORS = [
  { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-600 dark:text-rose-400', glow: 'shadow-rose-500/20' },
  { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-600 dark:text-violet-400', glow: 'shadow-violet-500/20' },
  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-600 dark:text-indigo-400', glow: 'shadow-indigo-500/20' },
  { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-600 dark:text-cyan-400', glow: 'shadow-cyan-500/20' },
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', glow: 'shadow-emerald-500/20' },
];

const SeasonFlowVisualization = ({ seasons, className }: SeasonFlowVisualizationProps) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: Horizontal Flow */}
      <div className="hidden md:flex items-center justify-center gap-2 lg:gap-4">
        {seasons.map((season, index) => (
          <div key={season.name} className="flex items-center">
            {/* Season Card */}
            <div 
              className={cn(
                "relative flex flex-col items-center p-4 lg:p-6 rounded-2xl border backdrop-blur-sm",
                "transition-all duration-500 hover:scale-105",
                SEASON_COLORS[index].bg,
                SEASON_COLORS[index].border,
                "shadow-lg",
                SEASON_COLORS[index].glow
              )}
            >
              {/* Season Number */}
              <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2",
                "w-6 h-6 rounded-full flex items-center justify-center",
                "text-xs font-bold text-white",
                index === 0 && "bg-rose-500",
                index === 1 && "bg-violet-500",
                index === 2 && "bg-indigo-500",
                index === 3 && "bg-cyan-500",
                index === 4 && "bg-emerald-500",
              )}>
                {index + 1}
              </div>
              
              {/* Season Name */}
              <span className={cn(
                "text-sm lg:text-base font-semibold tracking-wide",
                SEASON_COLORS[index].text
              )}>
                {season.name}
              </span>
              
              {/* Count */}
              <span className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
                {season.count}
              </span>
              
              {/* Label */}
              <span className="text-xs text-muted-foreground mt-1">
                {season.label}
              </span>
            </div>
            
            {/* Arrow Connector */}
            {index < seasons.length - 1 && (
              <div className="flex items-center mx-1 lg:mx-2">
                <div className="w-6 lg:w-10 h-px bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/20" />
                <svg className="w-3 h-3 text-muted-foreground/40" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2 6L8 6M8 6L5 3M8 6L5 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Vertical Flow */}
      <div className="md:hidden space-y-3">
        {seasons.map((season, index) => (
          <div key={season.name} className="flex items-center gap-4">
            {/* Season Number */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              "text-sm font-bold text-white",
              index === 0 && "bg-rose-500",
              index === 1 && "bg-violet-500",
              index === 2 && "bg-indigo-500",
              index === 3 && "bg-cyan-500",
              index === 4 && "bg-emerald-500",
            )}>
              {index + 1}
            </div>
            
            {/* Season Info */}
            <div className={cn(
              "flex-1 flex items-center justify-between p-3 rounded-xl border",
              SEASON_COLORS[index].bg,
              SEASON_COLORS[index].border,
            )}>
              <div>
                <span className={cn("text-sm font-semibold", SEASON_COLORS[index].text)}>
                  {season.name}
                </span>
                <span className="text-xs text-muted-foreground ml-2">{season.label}</span>
              </div>
              <span className="text-xl font-bold">{season.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonFlowVisualization;
