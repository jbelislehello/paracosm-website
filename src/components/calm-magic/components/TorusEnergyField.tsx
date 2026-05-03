import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ModeType } from '../context/ModeContext';
import { GraphPaperDefs } from '../geometry/GraphPaper';
import { Annotation } from '../geometry/Annotation';
import { FrenetFrame, FrenetMarkers } from '../geometry/FrenetFrame';
import { GeometryHotspot } from '../geometry/GeometryHotspot';
import { useBreathingPulse } from '@/hooks/useBreathingPulse';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface TorusEnergyFieldProps {
  mode: ModeType;
}

type AnatomyRegion = 'skin' | 'flow' | 'throat' | 'frame' | null;

/**
 * Anatomy of a Learning Organization — rendered as a torus cross-section
 * on graph paper, with textbook-style callouts and a Frenet frame riding
 * the outer skin to show "where attention is right now."
 */
const TorusEnergyField: React.FC<TorusEnergyFieldProps> = ({ mode }) => {
  const [coherence, setCoherence] = useState(60);
  const [activeRings, setActiveRings] = useState(4);
  const [activeRegion, setActiveRegion] = useState<AnatomyRegion>(null);
  const reduced = usePrefersReducedMotion();
  const breath = useBreathingPulse(); // 0..1

  const cx = 200;
  const cy = 160;
  const R = 90; // major radius
  const r = 34; // minor radius

  // Ring "skins" radiating outward through the torus tube.
  const rings = Array.from({ length: activeRings }).map((_, i) => {
    const t = i / Math.max(1, activeRings - 1);
    const radius = R + (r * 0.85) * (t - 0.5) * 2; // -r..+r around R
    return {
      id: i,
      radius,
      opacity: 0.25 + 0.55 * (1 - Math.abs(t - 0.5) * 2),
      sw: 0.8 + 1.6 * (1 - Math.abs(t - 0.5) * 2),
    };
  });

  // Frenet point traveling around the outer skin
  const angle = (performance.now() / 4500) % (Math.PI * 2);
  const fx = cx + Math.cos(angle) * (R + r * 0.6);
  const fy = cy + Math.sin(angle) * (R + r * 0.25); // squashed to suggest 3D
  const tangent = angle + Math.PI / 2;

  // Breath-driven scale on the throat (center) and outer skin
  const breathScale = 0.96 + breath * 0.08;
  const breathOpacity = 0.35 + breath * 0.5;

  const ink = 'hsl(var(--ink-indigo))';
  const red = 'hsl(var(--ink-red))';
  const green = 'hsl(var(--ink-green))';

  const levels = ['Self', 'Pair', 'Team', 'Org', 'Network', 'Ecosystem'];
  const coherenceLabel =
    coherence < 35
      ? 'Fragmented — the field is still searching for itself'
      : coherence < 70
      ? 'Emerging — collective intelligence is forming'
      : 'Integrated — a learning & inventive organism';

  return (
    <div className="space-y-6">
      <Card className="border-[hsl(var(--ink-indigo)/0.2)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif italic tracking-tight">
            Anatomy of a Learning Organization
            <Badge variant="outline" className="ml-auto font-sans not-italic">
              {mode === 'professional' ? 'Professional' : 'Personal'}
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground italic font-serif">
            A torus cross-section: where attention flows, where invention bends.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Field Coherence
              </label>
              <Slider
                value={[coherence]}
                onValueChange={([v]) => setCoherence(v)}
                max={100}
                step={1}
              />
              <div className="text-xs italic font-serif text-muted-foreground">
                {coherenceLabel}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nested Skins
              </label>
              <Slider
                value={[activeRings]}
                onValueChange={([v]) => setActiveRings(v)}
                min={2}
                max={6}
                step={1}
              />
              <div className="text-xs italic font-serif text-muted-foreground">
                {levels.slice(0, activeRings).join(' → ')}
              </div>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-[hsl(var(--ink-indigo)/0.15)]">
            <svg
              viewBox="0 0 400 320"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <GraphPaperDefs id="torus-gp" />
              <FrenetMarkers />
              <rect width="100%" height="100%" fill="hsl(var(--paper))" />
              <rect width="100%" height="100%" fill="url(#torus-gp-grid-bold)" />

              {/* Throat — the place where invention happens */}
              <g
                style={{
                  transform: `scale(${breathScale})`,
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: 'transform 200ms ease-out',
                }}
              >
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={R - r * 0.2}
                  ry={(R - r * 0.2) * 0.42}
                  fill="none"
                  stroke={ink}
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                  opacity="0.55"
                  filter="url(#torus-gp-ink)"
                />

                {/* Nested skins (the torus tube projected) */}
                {rings.map((ring) => (
                  <g key={ring.id}>
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={ring.radius}
                      ry={ring.radius * 0.42}
                      fill="none"
                      stroke={ink}
                      strokeWidth={ring.sw}
                      opacity={ring.opacity * (0.7 + breath * 0.3)}
                      filter="url(#torus-gp-ink)"
                    />
                  </g>
                ))}

                {/* Outer skin — collective coherence */}
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={R + r * 0.6}
                  ry={(R + r * 0.6) * 0.42}
                  fill="none"
                  stroke={ink}
                  strokeWidth="1.2"
                  opacity={breathOpacity}
                  filter="url(#torus-gp-ink)"
                />

                {/* Inner flow — individual learning */}
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={R - r * 0.7}
                  ry={(R - r * 0.7) * 0.42}
                  fill="none"
                  stroke={red}
                  strokeWidth="1"
                  opacity={0.55 + breath * 0.35}
                  filter="url(#torus-gp-ink)"
                />

                {/* Throat dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={4 + breath * 2}
                  fill={red}
                  opacity={0.7}
                />
              </g>

              {/* Frenet frame riding the outer skin */}
              <FrenetFrame x={fx} y={fy} angle={tangent} scale={20} />

              {/* Annotations — textbook anatomy */}
              <Annotation
                x={cx + R + r * 0.6}
                y={cy + 4}
                lx={cx + R + r * 0.6 + 18}
                ly={cy + 4}
                label="Outer skin"
                sub="collective coherence"
                color={ink}
              />
              <Annotation
                x={cx - R + r * 0.7}
                y={cy + 4}
                lx={20}
                ly={cy + 4}
                label="Inner flow"
                sub="individual learning"
                color={red}
              />
              <Annotation
                x={cx}
                y={cy}
                lx={cx + 12}
                ly={cy - 28}
                label="Throat κ(s)"
                sub="where invention happens"
                color={red}
              />
              <Annotation
                x={fx}
                y={fy}
                lx={fx + 18}
                ly={fy - 22}
                label="Attention frame"
                sub="T tangent · N normal"
                color={green}
              />

              {/* Title strip */}
              <text
                x={20}
                y={26}
                fontSize="11"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fill={ink}
                opacity="0.8"
              >
                Fig. 1 — Torus of Organizational Learning
              </text>
              <text
                x={380}
                y={26}
                fontSize="9"
                fontFamily="Georgia, serif"
                fill={ink}
                opacity="0.55"
                textAnchor="end"
              >
                breath · {Math.round(breath * 100)}%
              </text>
            </svg>

            {/* Hover/tap hotspots — plain-language explanations */}
            <GeometryHotspot
              style={{ left: '77.6%', top: '50%', width: 36, height: 36, transform: 'translate(-50%, -50%)' }}
              symbol="◯"
              label="Outer skin"
              body="The collective edge — how the whole group is holding together right now. Watch it breathe to feel coherence rise and fall."
              side="left"
            />
            <GeometryHotspot
              style={{ left: '33.4%', top: '50%', width: 36, height: 36, transform: 'translate(-50%, -50%)' }}
              symbol="∿"
              label="Inner flow"
              body="The personal current — what each individual is quietly learning underneath the group's surface."
              side="right"
            />
            <GeometryHotspot
              style={{ left: '50%', top: '50%', width: 28, height: 28, transform: 'translate(-50%, -50%)' }}
              symbol="κ"
              label="Throat — where invention happens"
              body="The narrow place where attention concentrates and new ideas get born. Curvature κ measures how sharply the field is bending here."
              side="top"
            />
            <GeometryHotspot
              style={{ left: '50%', top: '18%', width: 80, height: 26, transform: 'translate(-50%, -50%)', borderRadius: 4 }}
              shape="rect"
              symbol="T·N"
              label="Attention frame"
              body="The little arrow set riding the outer skin shows where the group's focus is moving (T, tangent) and the direction it's quietly bending toward (N, normal)."
              side="bottom"
            />
          </div>

          {/* Anatomy legend — hover/tap each card for plain language */}
          <TooltipProvider delayDuration={150}>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {[
                {
                  border: 'hsl(var(--ink-indigo)/0.2)',
                  color: 'hsl(var(--ink-indigo))',
                  title: 'Tangent — T',
                  short: 'Where the organization is moving right now.',
                  long: "T points along the direction the group is heading at this exact moment — the 'velocity' of attention. If T is steady, work feels aligned; if T wobbles, focus is searching.",
                },
                {
                  border: 'hsl(var(--ink-red)/0.25)',
                  color: 'hsl(var(--ink-red))',
                  title: 'Normal — N',
                  short: 'Where attention is bending. The direction of learning.',
                  long: 'N is perpendicular to T — it shows the direction the group is quietly bending toward. New insight arrives along N before anyone names it.',
                },
                {
                  border: 'hsl(var(--ink-green)/0.25)',
                  color: 'hsl(var(--ink-green))',
                  title: 'Curvature — κ',
                  short: 'How sharply the org is changing shape — the rate of invention.',
                  long: 'κ measures how tightly the path bends. Low κ = straight, predictable execution. High κ = sharp re-orientation, the moment invention happens.',
                },
              ].map((c) => (
                <Tooltip key={c.title}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-left rounded-md border bg-[hsl(var(--paper))/50] p-3 cursor-help transition-colors hover:bg-[hsl(var(--paper))/70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ink-indigo)/0.4)]"
                      style={{ borderColor: c.border }}
                    >
                      <div className="font-serif italic" style={{ color: c.color }}>
                        {c.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{c.short}</div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[260px] bg-[hsl(var(--paper))] border shadow-md"
                    style={{ borderColor: c.border, color: c.color }}
                  >
                    <p className="text-xs leading-snug">{c.long}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default TorusEnergyField;
