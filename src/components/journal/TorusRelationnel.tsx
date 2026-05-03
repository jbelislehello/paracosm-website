import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TorusPhase, TORUS_PHASES } from '@/types/journal-expansion';
import { useBreathingPulse } from '@/hooks/useBreathingPulse';
import { GeometryHotspot } from '@/components/calm-magic/geometry/GeometryHotspot';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface TorusRelationnelProps {
  currentPhase: TorusPhase;
  onPhaseChange?: (phase: TorusPhase) => void;
}

const PHASE_ORDER: TorusPhase[] = ['approche', 'ouverture', 'intensite', 'retrait'];

const PHASE_PLAIN: Record<TorusPhase, string> = {
  approche: 'Sensing toward the other before any words — the moment contact begins to form.',
  ouverture: 'The doors open. Curiosity and welcome on both sides; the field becomes shared.',
  intensite: 'Full presence — meaning, feeling and exchange at peak. The encounter does its work here.',
  retrait: 'Honest withdrawal — letting the contact rest so what was exchanged can settle and integrate.',
};

const PHASE_HOTSPOT_POS: Record<TorusPhase, { left: string; top: string }> = {
  approche:  { left: '70%', top: '30%' },
  ouverture: { left: '70%', top: '70%' },
  intensite: { left: '30%', top: '70%' },
  retrait:   { left: '30%', top: '30%' },
};

type ActiveRegion = TorusPhase | 'center' | 'flow' | null;

export const TorusRelationnel: React.FC<TorusRelationnelProps> = ({
  currentPhase,
  onPhaseChange
}) => {
  const breath = useBreathingPulse();
  const reduced = usePrefersReducedMotion();
  const [activeRegion, setActiveRegion] = useState<ActiveRegion>(null);

  const tangentAngle = (performance.now() / 5500) % (Math.PI * 2);
  const tx = 50 + 45 * Math.cos(tangentAngle);
  const ty = 50 + 45 * Math.sin(tangentAngle);

  const flowActive = activeRegion === 'flow';
  const centerActive = activeRegion === 'center';

  return (
    <Card className="bg-background/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-serif italic">Torus Relationnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square max-w-[150px] mx-auto mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              opacity={0.7 + breath * 0.3}
            />

            {PHASE_ORDER.map((phase, idx) => {
              const angle = (idx * 90 - 90) * (Math.PI / 180);
              const nextAngle = ((idx + 1) * 90 - 90) * (Math.PI / 180);
              const isCurrent = phase === currentPhase;
              const isHot = activeRegion === phase;

              const x1 = 50 + 35 * Math.cos(angle);
              const y1 = 50 + 35 * Math.sin(angle);
              const x2 = 50 + 35 * Math.cos(nextAngle);
              const y2 = 50 + 35 * Math.sin(nextAngle);
              const d = `M 50 50 L ${x1} ${y1} A 35 35 0 0 1 ${x2} ${y2} Z`;

              // Quadrant center for transform-origin
              const midA = (angle + nextAngle) / 2;
              const ox = 50 + 18 * Math.cos(midA);
              const oy = 50 + 18 * Math.sin(midA);

              const fill = isHot
                ? 'hsl(var(--primary) / 0.28)'
                : isCurrent ? 'hsl(var(--primary) / 0.2)' : 'transparent';
              const stroke = isHot || isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--border) / 0.5)';
              const sw = isHot ? 1.6 : 1;
              const scale = isHot && !reduced ? 1.04 : 1;

              return (
                <g
                  key={phase}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: `${ox}px ${oy}px`,
                    transition: 'transform 250ms ease-out',
                  }}
                >
                  {isHot && !reduced && (
                    <path
                      d={d}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth={4}
                      opacity={0.35}
                      style={{ filter: 'blur(2px)', pointerEvents: 'none' }}
                    />
                  )}
                  <path
                    d={d}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={sw}
                    className="cursor-pointer"
                    style={{ transition: 'fill 220ms ease-out, stroke 220ms ease-out, stroke-width 220ms ease-out' }}
                    onClick={() => onPhaseChange?.(phase)}
                  />
                  <text
                    x={50 + 25 * Math.cos(angle + 0.785)}
                    y={50 + 25 * Math.sin(angle + 0.785)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="6"
                    fill={isHot || isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                    className="font-medium"
                  >
                    {TORUS_PHASES[phase].label.charAt(0)}
                  </text>
                </g>
              );
            })}

            {/* Center pulse ring when active */}
            {centerActive && !reduced && (
              <circle
                cx="50" cy="50"
                r={12 + breath * 4}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.8"
                opacity={0.4 - breath * 0.25}
                style={{ transition: 'all 220ms ease-out' }}
              />
            )}

            {/* Center point */}
            <circle
              cx="50" cy="50"
              r={(centerActive ? 9 : 6) + breath * 2}
              fill="hsl(var(--background))"
              stroke="hsl(var(--primary))"
              strokeWidth={centerActive ? 2.5 : 2}
              style={{ transition: 'all 220ms ease-out' }}
            />

            {/* Tangent — continuous progression */}
            <line
              x1="50" y1="50" x2={tx} y2={ty}
              stroke="hsl(var(--primary))"
              strokeWidth={flowActive ? 2 : 1.2}
              opacity={flowActive ? 1 : 0.6}
              style={{ transition: 'all 220ms ease-out' }}
            />
            <circle
              cx={tx} cy={ty}
              r={flowActive ? 3 : 2}
              fill="hsl(var(--primary))"
              style={{ transition: 'all 220ms ease-out' }}
            />

            <path
              d="M 50 15 L 85 50 L 50 85 L 15 50 Z"
              fill="none"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="1"
              strokeDasharray="3,3"
              markerEnd="url(#arrowhead)"
            />

            <defs>
              <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <polygon points="0 0, 4 2, 0 4" fill="hsl(var(--primary) / 0.5)" />
              </marker>
            </defs>
          </svg>

          <GeometryHotspot
            style={{ left: '50%', top: '50%', width: 22, height: 22, transform: 'translate(-50%, -50%)' }}
            symbol="•"
            label="You — the still point"
            body="The center the four phases move around. You stay here while contact rises, peaks, and releases."
            side="right"
            onActiveChange={(a) => setActiveRegion(a ? 'center' : (r) => r === 'center' ? null : r as ActiveRegion)}
          />
          <GeometryHotspot
            style={{ left: '50%', top: '50%', width: 90, height: 90, transform: 'translate(-50%, -50%)' }}
            symbol="↻"
            label="Attention flow"
            body="The pulse of attention right now: the rotating line shows where contact is heading next around the cycle."
            side="bottom"
            onActiveChange={(a) => setActiveRegion(a ? 'flow' : (r) => r === 'flow' ? null : r as ActiveRegion)}
          />
          {PHASE_ORDER.map((phase) => (
            <GeometryHotspot
              key={phase}
              style={{
                left: PHASE_HOTSPOT_POS[phase].left,
                top: PHASE_HOTSPOT_POS[phase].top,
                width: 30, height: 30,
                transform: 'translate(-50%, -50%)',
              }}
              shape="rect"
              symbol={TORUS_PHASES[phase].label.charAt(0)}
              label={TORUS_PHASES[phase].label}
              body={PHASE_PLAIN[phase]}
              side="top"
              onActivate={() => onPhaseChange?.(phase)}
              onActiveChange={(a) => setActiveRegion(a ? phase : (r) => r === phase ? null : r as ActiveRegion)}
            />
          ))}
        </div>
        <p className="text-[10px] italic text-muted-foreground text-center -mt-2 mb-2 font-serif">
          Approche → Ouverture → Intensité → Retrait —<br/>the four fundamental forms of contact
        </p>

        <div className="grid grid-cols-2 gap-2 text-center">
          {PHASE_ORDER.map((phase) => {
            const config = TORUS_PHASES[phase];
            const isActive = phase === currentPhase;
            const isHot = activeRegion === phase;

            return (
              <button
                key={phase}
                onClick={() => onPhaseChange?.(phase)}
                onMouseEnter={() => setActiveRegion(phase)}
                onMouseLeave={() => setActiveRegion((r) => r === phase ? null : r)}
                className={`p-2 rounded-lg transition-all ${
                  isActive || isHot
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-muted/50 border border-transparent'
                } ${isHot ? 'ring-1 ring-primary/40' : ''}`}
              >
                <p className={`text-xs font-medium ${
                  isActive || isHot ? 'text-primary' : 'text-muted-foreground'
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
