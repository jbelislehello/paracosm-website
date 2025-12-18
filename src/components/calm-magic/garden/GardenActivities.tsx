import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sprout, Droplets, Scissors, TreeDeciduous, Sparkles } from 'lucide-react';
import { GARDEN_ACTIVITIES, GardenActivity } from '@/data/gardenConnections';
import { cn } from '@/lib/utils';

interface GardenActivitiesProps {
  onActivitySelect: (activity: GardenActivity) => void;
  activeActivity?: string | null;
}

const ACTIVITY_ICONS: Record<string, typeof Sprout> = {
  seed: Sprout,
  water: Droplets,
  prune: Scissors,
  grow: TreeDeciduous,
};

const GardenActivities = ({ onActivitySelect, activeActivity }: GardenActivitiesProps) => {
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-4 gap-3">
        {GARDEN_ACTIVITIES.map((activity) => {
          const Icon = ACTIVITY_ICONS[activity.id] || Sparkles;
          const isActive = activeActivity === activity.id;
          const isHovered = hoveredActivity === activity.id;
          
          return (
            <Tooltip key={activity.id}>
              <TooltipTrigger asChild>
                <Card
                  className={cn(
                    "relative p-4 cursor-pointer transition-all duration-300 group overflow-hidden",
                    "hover:scale-105 hover:shadow-lg",
                    isActive && "ring-2 ring-primary shadow-lg",
                    isHovered && "shadow-md"
                  )}
                  onMouseEnter={() => setHoveredActivity(activity.id)}
                  onMouseLeave={() => setHoveredActivity(null)}
                  onClick={() => onActivitySelect(activity)}
                >
                  {/* Background gradient on hover */}
                  <div 
                    className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-300",
                      "bg-gradient-to-br",
                      activity.gradient,
                      (isHovered || isActive) && "opacity-10"
                    )}
                  />
                  
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                    {/* Icon with emoji */}
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      "bg-gradient-to-br",
                      activity.gradient,
                      "text-white shadow-md",
                      "transition-transform duration-300",
                      isHovered && "scale-110 animate-pulse"
                    )}>
                      <span className="text-2xl">{activity.icon}</span>
                    </div>
                    
                    {/* Activity name */}
                    <h4 className="font-semibold text-sm">{activity.name}</h4>
                    
                    {/* L.O.V.E. axis badge */}
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full",
                      "bg-muted text-muted-foreground",
                      activity.color
                    )}>
                      {activity.loveAxis.split(' ')[0]}
                    </span>
                  </div>
                  
                  {/* Sparkle effect on active */}
                  {isActive && (
                    <Sparkles className="absolute top-2 right-2 w-4 h-4 text-primary animate-pulse" />
                  )}
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs opacity-70">{activity.loveAxis}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default GardenActivities;
