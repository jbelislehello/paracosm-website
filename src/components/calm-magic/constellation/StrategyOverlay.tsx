import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  ShieldAlert, 
  Users, 
  Gauge, 
  Heart,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ManifoldEntry } from '@/hooks/useManifoldData';

interface ProjectedEntry extends ManifoldEntry {
  projectedX: number;
  projectedY: number;
  projectedZ: number;
  spiralStop?: number;
  kpiLabel?: string;
}

interface StrategyOverlayProps {
  entries: ProjectedEntry[];
}

// KPI definitions with icons and colors
const KPIS = [
  { 
    id: 'clarity', 
    label: 'Clarity', 
    season: 'POLLENS',
    icon: Lightbulb, 
    color: 'hsl(var(--chart-1))',
    description: 'Vision alignment'
  },
  { 
    id: 'risk', 
    label: 'Risk', 
    season: 'NOEMS',
    icon: ShieldAlert, 
    color: 'hsl(var(--chart-2))',
    description: 'Threat awareness'
  },
  { 
    id: 'adoption', 
    label: 'Adoption', 
    season: 'POEMS',
    icon: Users, 
    color: 'hsl(var(--chart-3))',
    description: 'User engagement'
  },
  { 
    id: 'throughput', 
    label: 'Throughput', 
    season: 'TOTEMS',
    icon: Gauge, 
    color: 'hsl(var(--chart-4))',
    description: 'Delivery velocity'
  },
  { 
    id: 'trust', 
    label: 'Trust', 
    season: 'ANTHEMS',
    icon: Heart, 
    color: 'hsl(var(--chart-5))',
    description: 'Team confidence'
  },
];

// Calculate KPI scores based on entries
function calculateKPIScores(entries: ProjectedEntry[]) {
  const scores: Record<string, { value: number; trend: 'up' | 'down' | 'stable'; count: number }> = {};
  
  KPIS.forEach(kpi => {
    const seasonEntries = entries.filter(e => e.season === kpi.season);
    const count = seasonEntries.length;
    
    // Calculate score based on entry count and recency
    const recentEntries = seasonEntries.filter(e => {
      const age = Date.now() - new Date(e.createdAt).getTime();
      return age < 7 * 24 * 60 * 60 * 1000; // Last 7 days
    }).length;
    
    const value = Math.min(100, Math.round((count * 10) + (recentEntries * 15)));
    
    // Trend based on recent activity
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentEntries > count / 3) trend = 'up';
    else if (recentEntries === 0 && count > 0) trend = 'down';
    
    scores[kpi.id] = { value, trend, count };
  });
  
  return scores;
}

export function StrategyOverlay({ entries }: StrategyOverlayProps) {
  const scores = calculateKPIScores(entries);
  
  // Determine current position in spiral (based on most active KPI)
  const sortedByActivity = Object.entries(scores).sort((a, b) => b[1].count - a[1].count);
  const currentStop = sortedByActivity[0]?.[0] || 'clarity';
  const nextStop = KPIS[Math.min(KPIS.findIndex(k => k.id === currentStop) + 1, KPIS.length - 1)]?.id || 'trust';
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Spiral Path Visualization */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="spiral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.3" />
            <stop offset="25%" stopColor="hsl(var(--chart-2))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--chart-3))" stopOpacity="0.3" />
            <stop offset="75%" stopColor="hsl(var(--chart-4))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Spiral path */}
        <path
          d="M 50 50 
             Q 55 45, 60 50 
             Q 65 55, 60 60 
             Q 55 65, 50 60 
             Q 40 55, 42 45 
             Q 44 35, 55 35 
             Q 70 35, 72 50"
          fill="none"
          stroke="url(#spiral-gradient)"
          strokeWidth="0.5"
          strokeDasharray="2 1"
          className="opacity-60"
        />
      </svg>

      {/* KPI Chips - Positioned in spiral formation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-md max-h-md">
          {KPIS.map((kpi, index) => {
            const Icon = kpi.icon;
            const score = scores[kpi.id];
            const isCurrent = kpi.id === currentStop;
            const isNext = kpi.id === nextStop;
            
            // Position in a spiral-like arrangement
            const angle = (index / KPIS.length) * Math.PI * 1.5 - Math.PI / 2;
            const radius = 30 + index * 5;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            
            return (
              <div
                key={kpi.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto",
                  "transition-all duration-300",
                  isCurrent && "scale-110 z-10"
                )}
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`
                }}
              >
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-full",
                    "bg-background/80 backdrop-blur-sm border shadow-sm",
                    isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                    isNext && "border-dashed"
                  )}
                  style={{ borderColor: kpi.color }}
                >
                  <Icon 
                    className="w-3 h-3" 
                    style={{ color: kpi.color }} 
                  />
                  <span className="text-[10px] font-medium">{kpi.label}</span>
                  <span 
                    className="text-[10px] font-bold tabular-nums"
                    style={{ color: kpi.color }}
                  >
                    {score.value}
                  </span>
                  {score.trend === 'up' && <TrendingUp className="w-2.5 h-2.5 text-green-500" />}
                  {score.trend === 'down' && <TrendingDown className="w-2.5 h-2.5 text-destructive" />}
                  {score.trend === 'stable' && <Minus className="w-2.5 h-2.5 text-muted-foreground" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Position Indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <Badge variant="outline" className="text-[10px] gap-1 pointer-events-auto">
          <span className="text-muted-foreground">Current:</span>
          <span className="font-medium">{KPIS.find(k => k.id === currentStop)?.label}</span>
        </Badge>
        <span className="text-muted-foreground">→</span>
        <Badge variant="secondary" className="text-[10px] gap-1 pointer-events-auto">
          <span className="text-muted-foreground">Next:</span>
          <span className="font-medium">{KPIS.find(k => k.id === nextStop)?.label}</span>
        </Badge>
      </div>

      {/* Summary Bar */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="flex items-center gap-1 p-2 rounded-lg bg-background/60 backdrop-blur-sm border">
          {KPIS.map((kpi, index) => {
            const score = scores[kpi.id];
            return (
              <React.Fragment key={kpi.id}>
                <div 
                  className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"
                  title={`${kpi.label}: ${score.value}%`}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${score.value}%`,
                      backgroundColor: kpi.color
                    }}
                  />
                </div>
                {index < KPIS.length - 1 && (
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
