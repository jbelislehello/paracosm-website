import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpiralQuadrant, NoemEntry } from '@/types/journal-expansion';
import { useBreathingPulse } from '@/hooks/useBreathingPulse';
import { GraphPaperDefs } from '@/components/calm-magic/geometry/GraphPaper';

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
  /** angle on the spiral path (radians) where this quadrant lives */
  spiralAngle: number;
}> = {
  sovereignty: {
    label: 'Sovereignty',
    color: 'hsl(var(--chart-1))',
    position: { x: '75%', y: '25%' },
    description: 'Self-direction & autonomy',
    spiralAngle: -Math.PI / 4,
  },
  memory: {
    label: 'Memory',
    color: 'hsl(var(--chart-2))',
    position: { x: '25%', y: '25%' },
    description: 'Heritage & continuity',
    spiralAngle: -3 * Math.PI / 4,
  },
  intimacy: {
    label: 'Intimacy',
    color: 'hsl(var(--chart-3))',
    position: { x: '25%', y: '75%' },
    description: 'Deep connection & vulnerability',
    spiralAngle: 3 * Math.PI / 4,
  },
  novelty: {
    label: 'Novelty',
    color: 'hsl(var(--chart-4))',
    position: { x: '75%', y: '75%' },
    description: 'Exploration & new territories',
    spiralAngle: Math.PI / 4,
  },
};

export const SpiralQuadrantVisualizer: React.FC<SpiralQuadrantVisualizerProps> = ({
  entries = [],
  currentQuadrant,
  onQuadrantClick
}) => {
  const breath = useBreathingPulse();

  const entriesByQuadrant = entries.reduce((acc, entry) => {
    if (entry.spiral_quadrant) {
      if (!acc[entry.spiral_quadrant]) acc[entry.spiral_quadrant] = [];
      acc[entry.spiral_quadrant].push(entry);
    }
    return acc;
  }, {} as Record<SpiralQuadrant, NoemEntry[]>);

  // Frenet on active quadrant
  const activeAngle = currentQuadrant
    ? QUADRANT_CONFIG[currentQuadrant].spiralAngle
    : null;
  const fx = activeAngle !== null ? 50 + Math.cos(activeAngle) * 18 : 0;
  const fy = activeAngle !== null ? 50 + Math.sin(activeAngle) * 18 : 0;
  const tx = activeAngle !== null ? fx + Math.cos(activeAngle + Math.PI / 2) * 10 : 0;
  const ty = activeAngle !== null ? fy + Math.sin(activeAngle + Math.PI / 2) * 10 : 0;
  const nx = activeAngle !== null ? fx + Math.cos(activeAngle) * 8 : 0;
  const ny = activeAngle !== null ? fy + Math.sin(activeAngle) * 8 : 0;

  return (
    <Card className="bg-background/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-serif italic">
          Spiral Quadrants — fundamental forms
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Axis overlines */}
        <div className="text-[8px] text-center font-serif italic text-muted-foreground mb-1">
          first form · stretching
        </div>

        <div className="relative w-full aspect-square max-w-[200px] mx-auto">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <GraphPaperDefs id="sq-gp" />
            <rect width="100" height="100" fill="hsl(var(--paper))" opacity="0.4" />
            <rect width="100" height="100" fill="url(#sq-gp-grid-bold)" />

            {/* Quadrant tints (kept very faint to let paper show) */}
            <rect x="50" y="0" width="50" height="50" fill="hsl(var(--chart-1) / 0.06)" />
            <rect x="0" y="0" width="50" height="50" fill="hsl(var(--chart-2) / 0.06)" />
            <rect x="0" y="50" width="50" height="50" fill="hsl(var(--chart-3) / 0.06)" />
            <rect x="50" y="50" width="50" height="50" fill="hsl(var(--chart-4) / 0.06)" />

            {/* Axis lines */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="hsl(var(--ink-indigo) / 0.4)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(var(--ink-indigo) / 0.4)" strokeWidth="0.5" />

            {/* Spiral path — hand-inked */}
            <path
              d="M 50 50 Q 60 40 70 50 Q 80 60 70 70 Q 60 80 50 70 Q 40 60 50 50"
              fill="none"
              stroke="hsl(var(--ink-indigo) / 0.5)"
              strokeWidth="1"
              strokeDasharray="2,2"
              filter="url(#sq-gp-ink)"
            />

            {/* Center point — breathing */}
            <circle
              cx="50"
              cy="50"
              r={2.4 + breath * 1.2}
              fill="hsl(var(--ink-red))"
              opacity={0.6 + breath * 0.4}
            />

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
                  fill="hsl(var(--ink-indigo))"
                  opacity={0.4 + breath * 0.4}
                />
              );
            })}

            {/* Frenet frame on active quadrant */}
            {activeAngle !== null && (
              <g style={{ pointerEvents: 'none' }}>
                <line x1={fx} y1={fy} x2={tx} y2={ty} stroke="hsl(var(--ink-indigo))" strokeWidth="0.8" />
                <line x1={fx} y1={fy} x2={nx} y2={ny} stroke="hsl(var(--ink-red))" strokeWidth="0.8" />
                <text x={tx + 1} y={ty - 1} fontSize="4" fontFamily="Georgia, serif" fontStyle="italic" fill="hsl(var(--ink-indigo))">T</text>
                <text x={nx + 1} y={ny - 1} fontSize="4" fontFamily="Georgia, serif" fontStyle="italic" fill="hsl(var(--ink-red))">N</text>
                <circle cx={fx} cy={fy} r="1" fill="hsl(var(--ink-red))" />
              </g>
            )}
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

        <div className="text-[8px] text-center font-serif italic text-muted-foreground mt-1">
          second form · bending
        </div>

        <p className="mt-3 text-[10px] italic text-muted-foreground text-center font-serif">
          The two ways a life-shape can change — measured at every step.
        </p>

        {/* Current Quadrant Info */}
        {currentQuadrant && (
          <div className="mt-3 p-2 rounded bg-primary/5 text-center">
            <p className="text-xs font-serif italic text-primary">
              {QUADRANT_CONFIG[currentQuadrant].label}
            </p>
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
