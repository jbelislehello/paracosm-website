import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TorusPhase, TORUS_PHASES } from '@/types/journal-expansion';

interface TorusRelationnelProps {
  currentPhase: TorusPhase;
  onPhaseChange?: (phase: TorusPhase) => void;
}

const PHASE_ORDER: TorusPhase[] = ['approche', 'ouverture', 'intensite', 'retrait'];

export const TorusRelationnel: React.FC<TorusRelationnelProps> = ({
  currentPhase,
  onPhaseChange
}) => {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  return (
    <Card className="bg-background/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Torus Relationnel</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Torus Visualization */}
        <div className="relative w-full aspect-square max-w-[150px] mx-auto mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            
            {/* Phase segments */}
            {PHASE_ORDER.map((phase, idx) => {
              const angle = (idx * 90 - 90) * (Math.PI / 180);
              const nextAngle = ((idx + 1) * 90 - 90) * (Math.PI / 180);
              const isActive = phase === currentPhase;
              
              const x1 = 50 + 35 * Math.cos(angle);
              const y1 = 50 + 35 * Math.sin(angle);
              const x2 = 50 + 35 * Math.cos(nextAngle);
              const y2 = 50 + 35 * Math.sin(nextAngle);
              
              return (
                <g key={phase}>
                  {/* Arc for each phase */}
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 35 35 0 0 1 ${x2} ${y2} Z`}
                    fill={isActive ? 'hsl(var(--primary) / 0.2)' : 'transparent'}
                    stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--border) / 0.5)'}
                    strokeWidth="1"
                    className="cursor-pointer transition-all hover:fill-primary/10"
                    onClick={() => onPhaseChange?.(phase)}
                  />
                  
                  {/* Phase label */}
                  <text
                    x={50 + 25 * Math.cos(angle + 0.785)}
                    y={50 + 25 * Math.sin(angle + 0.785)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="6"
                    fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                    className="font-medium"
                  >
                    {TORUS_PHASES[phase].label.charAt(0)}
                  </text>
                </g>
              );
            })}
            
            {/* Center point */}
            <circle cx="50" cy="50" r="8" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
            
            {/* Flow arrows */}
            <path
              d="M 50 15 L 85 50 L 50 85 L 15 50 Z"
              fill="none"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="1"
              strokeDasharray="3,3"
              markerEnd="url(#arrowhead)"
            />
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="4"
                markerHeight="4"
                refX="2"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 4 2, 0 4" fill="hsl(var(--primary) / 0.5)" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Phase Labels */}
        <div className="grid grid-cols-2 gap-2 text-center">
          {PHASE_ORDER.map((phase) => {
            const config = TORUS_PHASES[phase];
            const isActive = phase === currentPhase;

            return (
              <button
                key={phase}
                onClick={() => onPhaseChange?.(phase)}
                className={`p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-muted/50'
                }`}
              >
                <p className={`text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {config.label}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  {config.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Current State */}
        <div className="mt-3 pt-3 border-t border-border/50 text-center">
          <p className="text-[10px] text-muted-foreground">
            Current: <span className="text-primary font-medium">{TORUS_PHASES[currentPhase].label}</span>
          </p>
          <p className="text-[10px] text-muted-foreground">
            {TORUS_PHASES[currentPhase].description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TorusRelationnel;
