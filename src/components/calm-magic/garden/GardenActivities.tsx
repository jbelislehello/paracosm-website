import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
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

// Particle burst component
const ParticleBurst = ({ active, color }: { active: boolean; color: string }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);
  
  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 0,
        y: 0,
        angle: (i / 12) * Math.PI * 2,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 600);
      return () => clearTimeout(timer);
    }
  }, [active]);
  
  if (!active || particles.length === 0) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className={cn("absolute w-2 h-2 rounded-full", color)}
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%)`,
            animation: `particle-burst-${p.id} 0.6s ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        ${particles.map((p) => `
          @keyframes particle-burst-${p.id} {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { 
              transform: translate(
                calc(-50% + ${Math.cos(p.angle) * 60}px), 
                calc(-50% + ${Math.sin(p.angle) * 60}px)
              ) scale(0); 
              opacity: 0; 
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

const GardenActivities = ({ onActivitySelect, activeActivity }: GardenActivitiesProps) => {
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);
  const [clickedActivity, setClickedActivity] = useState<string | null>(null);

  const handleClick = (activity: GardenActivity) => {
    setClickedActivity(activity.id);
    onActivitySelect(activity);
    setTimeout(() => setClickedActivity(null), 600);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GARDEN_ACTIVITIES.map((activity, index) => {
          const Icon = ACTIVITY_ICONS[activity.id] || Sparkles;
          const isActive = activeActivity === activity.id;
          const isHovered = hoveredActivity === activity.id;
          const isClicked = clickedActivity === activity.id;
          
          return (
            <Tooltip key={activity.id}>
              <TooltipTrigger asChild>
                <Card
                  className={cn(
                    "relative p-5 cursor-pointer transition-all duration-300 group overflow-hidden",
                    "hover:shadow-xl hover:-translate-y-1",
                    "bg-gradient-to-br from-background/80 to-muted/30",
                    "backdrop-blur-sm border-white/10",
                    isActive && "ring-2 ring-primary shadow-xl -translate-y-1",
                    isHovered && "shadow-lg"
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fade-in 0.5s ease-out forwards',
                    opacity: 0,
                  }}
                  onMouseEnter={() => setHoveredActivity(activity.id)}
                  onMouseLeave={() => setHoveredActivity(null)}
                  onClick={() => handleClick(activity)}
                >
                  {/* Particle burst effect */}
                  <ParticleBurst 
                    active={isClicked} 
                    color={activity.gradient.replace('from-', 'bg-').split(' ')[0]}
                  />
                  
                  {/* Radial glow on hover */}
                  <div 
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      "bg-gradient-radial from-primary/20 via-transparent to-transparent",
                      (isHovered || isActive) ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      background: isHovered || isActive
                        ? `radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.2) 0%, transparent 70%)`
                        : 'none'
                    }}
                  />
                  
                  {/* Background gradient on hover */}
                  <div 
                    className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-300",
                      "bg-gradient-to-br",
                      activity.gradient,
                      (isHovered || isActive) && "opacity-10"
                    )}
                  />
                  
                  <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                    {/* Icon with animated ring */}
                    <div className="relative">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center",
                        "bg-gradient-to-br shadow-lg",
                        activity.gradient,
                        "transition-all duration-300",
                        isHovered && "scale-110 shadow-xl",
                        isActive && "animate-pulse"
                      )}>
                        <span className="text-3xl filter drop-shadow-md">{activity.icon}</span>
                      </div>
                      
                      {/* Animated ring */}
                      {(isHovered || isActive) && (
                        <div 
                          className={cn(
                            "absolute inset-0 rounded-2xl border-2 animate-ping",
                            activity.color.replace('text-', 'border-')
                          )}
                          style={{ animationDuration: '1.5s' }}
                        />
                      )}
                    </div>
                    
                    {/* Activity name */}
                    <h4 className="font-semibold text-sm">{activity.name}</h4>
                    
                    {/* L.O.V.E. axis badge */}
                    <span className={cn(
                      "text-[10px] px-3 py-1 rounded-full font-medium",
                      "bg-muted/50 backdrop-blur-sm",
                      "transition-all duration-300",
                      isHovered && "bg-primary/10",
                      activity.color
                    )}>
                      {activity.loveAxis.split(' ')[0]}
                    </span>
                  </div>
                  
                  {/* Sparkle effect on active */}
                  {isActive && (
                    <>
                      <Sparkles className="absolute top-2 right-2 w-4 h-4 text-primary animate-pulse" />
                      <Sparkles className="absolute bottom-2 left-2 w-3 h-3 text-primary/50 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    </>
                  )}
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs backdrop-blur-xl bg-background/90">
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    <span>{activity.icon}</span>
                    {activity.name}
                  </p>
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
