import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GardenMetrics {
  polenCount: number;
  noemsCount: number;
  completedSeasons: number;
  tilesVisited: number;
  coherence: number;
  connections: number;
}

interface StatItemProps {
  icon: string;
  label: string;
  value: number;
  maxValue?: number;
  color: string;
  delay?: number;
}

const StatItem = ({ icon, label, value, maxValue, color, delay = 0 }: StatItemProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const percentage = maxValue ? (value / maxValue) * 100 : value;
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Animate count up
      const duration = 1500;
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div 
      className={cn(
        "relative p-4 rounded-xl transition-all duration-500",
        "bg-gradient-to-br from-background/80 to-muted/40",
        "backdrop-blur-md border border-white/10",
        "hover:scale-[1.02] hover:shadow-lg",
        "group",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* Glow effect on hover */}
      <div 
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          color.replace('text-', 'bg-').replace('500', '500/10')
        )}
      />
      
      <div className="relative z-10 flex items-center gap-3">
        {/* Progress ring */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            {/* Background ring */}
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted/30"
            />
            {/* Progress ring */}
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className={cn(color, "transition-all duration-1000")}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: isVisible ? strokeDashoffset : circumference,
              }}
            />
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            {icon}
          </div>
        </div>
        
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className={cn("text-2xl font-bold tabular-nums", color)}>
            {displayValue}
            {maxValue && <span className="text-muted-foreground text-sm">/{maxValue}</span>}
            {!maxValue && label.includes('Coherence') && <span className="text-sm">%</span>}
          </div>
          <div className="text-xs text-muted-foreground truncate">{label}</div>
        </div>
        
        {/* Percentage badge */}
        <div className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          "bg-muted/50",
          color
        )}>
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  );
};

interface GardenStatsPanelProps {
  metrics: GardenMetrics;
}

const GardenStatsPanel = ({ metrics }: GardenStatsPanelProps) => {
  const stats = [
    { icon: '🍃', label: 'Polen Leaves', value: metrics.polenCount, maxValue: 150, color: 'text-rose-500', delay: 0 },
    { icon: '🌸', label: 'Noems Flowers', value: metrics.noemsCount, maxValue: 50, color: 'text-violet-500', delay: 100 },
    { icon: '🍎', label: 'Season Fruits', value: metrics.completedSeasons, maxValue: 5, color: 'text-emerald-500', delay: 200 },
    { icon: '🗺️', label: 'Tiles Explored', value: metrics.tilesVisited, maxValue: 64, color: 'text-blue-500', delay: 300 },
    { icon: '💫', label: 'Coherence', value: metrics.coherence, maxValue: 100, color: 'text-amber-500', delay: 400 },
    { icon: '🌿', label: 'Root Connections', value: metrics.connections, maxValue: 5, color: 'text-cyan-500', delay: 500 },
  ];

  return (
    <Card className="p-5 bg-gradient-to-br from-background/60 to-muted/20 backdrop-blur-xl border-white/10">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🌾</span>
        Journey Harvest
      </h3>
      
      <div className="space-y-3">
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </Card>
  );
};

export default GardenStatsPanel;
