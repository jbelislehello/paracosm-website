import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpiralQuadrant, NoemEntry } from '@/types/journal-expansion';

interface SpiralQuadrantVisualizerProps {
  entries?: NoemEntry[];
  currentQuadrant?: SpiralQuadrant;
  onQuadrantClick?: (quadrant: SpiralQuadrant) => void;
}

const QUADRANT_CONFIG: Record<SpiralQuadrant, {
  label: string;
  color: string;
  position: { x: string; y: string };
  description: string;
}> = {
  sovereignty: {
    label: 'Sovereignty',
    color: 'hsl(var(--chart-1))',
    position: { x: '75%', y: '25%' },
    description: 'Self-direction & autonomy'
  },
  memory: {
    label: 'Memory',
    color: 'hsl(var(--chart-2))',
    position: { x: '25%', y: '25%' },
    description: 'Heritage & continuity'
  },
  intimacy: {
    label: 'Intimacy',
    color: 'hsl(var(--chart-3))',
    position: { x: '25%', y: '75%' },
    description: 'Deep connection & vulnerability'
  },
  novelty: {
    label: 'Novelty',
    color: 'hsl(var(--chart-4))',
    position: { x: '75%', y: '75%' },
    description: 'Exploration & new territories'
  }
};

export const SpiralQuadrantVisualizer: React.FC<SpiralQuadrantVisualizerProps> = ({
  entries = [],
  currentQuadrant,
  onQuadrantClick
}) => {
  // Group entries by quadrant
  const entriesByQuadrant = entries.reduce((acc, entry) => {
    if (entry.spiral_quadrant) {
      if (!acc[entry.spiral_quadrant]) acc[entry.spiral_quadrant] = [];
      acc[entry.spiral_quadrant].push(entry);
    }
    return acc;
  }, {} as Record<SpiralQuadrant, NoemEntry[]>);

  return (
    <Card className="bg-background/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Spiral Quadrants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square max-w-[200px] mx-auto">
          {/* Background gradient areas */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {/* Quadrant backgrounds */}
            <rect x="50" y="0" width="50" height="50" fill="hsl(var(--chart-1) / 0.1)" />
            <rect x="0" y="0" width="50" height="50" fill="hsl(var(--chart-2) / 0.1)" />
            <rect x="0" y="50" width="50" height="50" fill="hsl(var(--chart-3) / 0.1)" />
            <rect x="50" y="50" width="50" height="50" fill="hsl(var(--chart-4) / 0.1)" />
            
            {/* Axis lines */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="hsl(var(--border))" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(var(--border))" strokeWidth="0.5" />
            
            {/* Spiral path */}
            <path
              d="M 50 50 Q 60 40 70 50 Q 80 60 70 70 Q 60 80 50 70 Q 40 60 50 50"
              fill="none"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            
            {/* Center point */}
            <circle cx="50" cy="50" r="3" fill="hsl(var(--primary))" />
            
            {/* Entry dots */}
            {entries.map((entry, idx) => {
              const pos = entry.topology_position || { x: 0, y: 0 };
              const cx = 50 + (pos.x * 40);
              const cy = 50 - (pos.y * 40);
              return (
                <circle
                  key={entry.id || idx}
                  cx={cx}
                  cy={cy}
                  r="2"
                  fill="hsl(var(--foreground))"
                  opacity={0.6}
                />
              );
            })}
          </svg>

          {/* Quadrant Labels */}
          {(Object.keys(QUADRANT_CONFIG) as SpiralQuadrant[]).map((quadrant) => {
            const config = QUADRANT_CONFIG[quadrant];
            const isActive = currentQuadrant === quadrant;
            const count = entriesByQuadrant[quadrant]?.length || 0;

            return (
              <button
                key={quadrant}
                onClick={() => onQuadrantClick?.(quadrant)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1 rounded text-center transition-all ${
                  isActive ? 'scale-110' : 'hover:scale-105'
                }`}
                style={{ left: config.position.x, top: config.position.y }}
              >
                <span className={`text-[10px] font-medium block ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {config.label}
                </span>
                {count > 0 && (
                  <span className="text-[8px] text-muted-foreground">
                    ({count})
                  </span>
                )}
              </button>
            );
          })}

          {/* Axis Labels */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground">
            ↑ Sovereignty
          </span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground">
            ↓ Intimacy
          </span>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground rotate-[-90deg]">
            ← Memory
          </span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground rotate-90">
            Novelty →
          </span>
        </div>

        {/* Current Quadrant Info */}
        {currentQuadrant && (
          <div className="mt-3 p-2 rounded bg-primary/5 text-center">
            <p className="text-xs font-medium">{QUADRANT_CONFIG[currentQuadrant].label}</p>
            <p className="text-[10px] text-muted-foreground">
              {QUADRANT_CONFIG[currentQuadrant].description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpiralQuadrantVisualizer;
