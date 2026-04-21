import React from 'react';
import { Cloud, Sparkles } from 'lucide-react';
import type { ShadowFactors, SeasonQualities } from '@/types/trajectory';

interface OneiricAlignmentPanelProps {
  shadowFactors?: ShadowFactors;
  qualities?: SeasonQualities;
}

function computeAlignment(factors?: ShadowFactors, qualities?: SeasonQualities) {
  if (!factors || !qualities) return { coherence: 0, naturalness: 0, touchConcept: 0.5 };

  const coherence = (factors.coherence + factors.flow) / 2;
  const naturalness = factors.flow * 0.6 + (1 - Math.abs(factors.depth - 0.5) * 2) * 0.4;

  // Touch (relational) vs Concept (intellectual)
  const touch = ((qualities.vitality || 0) + (qualities.calmness || 0)) / 200;
  const concept = ((qualities.spaciousness || 0) + (qualities.openness || 0)) / 200;
  const touchConcept = concept > 0 || touch > 0 ? touch / (touch + concept) : 0.5;

  return {
    coherence: Math.min(1, Math.max(0, coherence)),
    naturalness: Math.min(1, Math.max(0, naturalness)),
    touchConcept: Math.min(1, Math.max(0, touchConcept)),
  };
}

const OneiricAlignmentPanel: React.FC<OneiricAlignmentPanelProps> = ({
  shadowFactors,
  qualities,
}) => {
  const alignment = computeAlignment(shadowFactors, qualities);

  const metrics = [
    {
      label: 'Coherence',
      value: alignment.coherence,
      description: 'How well internal states align with each other',
      color: 'hsl(270 60% 50%)',
    },
    {
      label: 'Naturalness',
      value: alignment.naturalness,
      description: 'Does it feel emergent or forced?',
      color: 'hsl(142 71% 45%)',
    },
    {
      label: 'High-Touch ↔ High-Concept',
      value: alignment.touchConcept,
      description: 'Balance of relational warmth and intellectual depth',
      color: 'hsl(210 70% 50%)',
      isBipolar: true,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Cloud className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Oneiric Alignment</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Model-agnostic alignment — measuring how coherently the board's state maps to 
        natural, emergent flow. The oneiric (dream-like) power of finding what feels right.
      </p>

      <div className="space-y-3">
        {metrics.map(m => (
          <div key={m.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{m.label}</span>
              <span className="text-muted-foreground">
                {m.isBipolar
                  ? m.value < 0.4 ? 'High-Concept' : m.value > 0.6 ? 'High-Touch' : 'Balanced'
                  : `${Math.round(m.value * 100)}%`
                }
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${m.value * 100}%`,
                  backgroundColor: m.color,
                  opacity: 0.7 + m.value * 0.3,
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{m.description}</p>
          </div>
        ))}
      </div>

      {/* Overall oneiric score */}
      <div className="bg-primary/5 rounded-lg p-3 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs font-medium">
            Oneiric Power: {Math.round(((alignment.coherence + alignment.naturalness) / 2) * 100)}%
          </p>
          <p className="text-[10px] text-muted-foreground">
            {alignment.coherence > 0.6 && alignment.naturalness > 0.6
              ? 'Strong alignment — the vision feels alive and coherent'
              : alignment.coherence < 0.3
              ? 'Low coherence — the pieces haven\'t found their pattern yet'
              : 'Emerging — keep exploring, the dream is forming'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default OneiricAlignmentPanel;
