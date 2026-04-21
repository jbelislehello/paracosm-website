import React, { useState } from 'react';
import { Leaf, Mountain, Droplets, Flame, Waves, CloudLightning, Sun, TreePine } from 'lucide-react';
import type { Season } from '@/types/trajectory';
import type { PolyvagalState } from '@/types/polyvagal';

export interface NatureMetaphor {
  id: string;
  name: string;
  icon: React.ReactNode;
  season: Season | null;
  polyvagalState: PolyvagalState | null;
  prompt: string;
  reflection: string;
  color: string;
}

const METAPHORS: NatureMetaphor[] = [
  {
    id: 'forest',
    name: 'Think like a Forest',
    icon: <TreePine className="w-5 h-5" />,
    season: 'POLLENS',
    polyvagalState: 'ventral_vagal',
    prompt: 'Interconnected root systems, mycorrhizal networks, emergent canopy',
    reflection: 'What hidden connections are feeding your project beneath the surface? What small signals from the ecosystem are you not yet seeing?',
    color: 'hsl(142 71% 45%)',
  },
  {
    id: 'river',
    name: 'Think like a River',
    icon: <Droplets className="w-5 h-5" />,
    season: 'NOEMS',
    polyvagalState: 'ventral_vagal',
    prompt: 'Flow, path of least resistance, erosion as creation',
    reflection: 'Where is your energy naturally flowing? What obstacles are you trying to force through that a river would simply flow around?',
    color: 'hsl(210 70% 50%)',
  },
  {
    id: 'mountain',
    name: 'Think like a Mountain',
    icon: <Mountain className="w-5 h-5" />,
    season: 'POEMS',
    polyvagalState: 'ventral_vagal',
    prompt: 'Stillness, deep time, geological patience, presence',
    reflection: 'What would this decision look like from the perspective of a thousand years? What is the bedrock beneath all the noise?',
    color: 'hsl(var(--muted-foreground))',
  },
  {
    id: 'lake',
    name: 'Think like a Lake',
    icon: <Waves className="w-5 h-5" />,
    season: 'TOTEMS',
    polyvagalState: 'ventral_vagal',
    prompt: 'Reflection, depth, clarity, still surface revealing depths',
    reflection: 'What is reflected back to you when you become still? What lives in the depths that the surface doesn\'t show?',
    color: 'hsl(200 60% 50%)',
  },
  {
    id: 'volcano',
    name: 'Think like a Volcano',
    icon: <Flame className="w-5 h-5" />,
    season: 'ANTHEMS',
    polyvagalState: 'sympathetic',
    prompt: 'Transformation, eruption creating new land, pressure becoming creation',
    reflection: 'What pressure has been building that needs release? What new territory could be created by letting this energy move?',
    color: 'hsl(15 90% 55%)',
  },
  {
    id: 'ocean',
    name: 'Think like an Ocean',
    icon: <Waves className="w-5 h-5" />,
    season: null,
    polyvagalState: 'ventral_vagal',
    prompt: 'Vastness, tides, sovereignty over immense depth',
    reflection: 'What tidal patterns govern your creative cycles? What vast, unexplored depth lies beneath your daily work?',
    color: 'hsl(220 70% 45%)',
  },
  {
    id: 'storm',
    name: 'Think like a Storm',
    icon: <CloudLightning className="w-5 h-5" />,
    season: null,
    polyvagalState: 'sympathetic',
    prompt: 'Energy, electrical discharge, clearing the air, necessary disruption',
    reflection: 'What needs to be cleared? What charge has accumulated that wants to become lightning?',
    color: 'hsl(270 60% 50%)',
  },
  {
    id: 'sun',
    name: 'Think like a Sun',
    icon: <Sun className="w-5 h-5" />,
    season: null,
    polyvagalState: 'ventral_vagal',
    prompt: 'Warmth, sustenance, radiance without depletion, fusion',
    reflection: 'What are you radiating outward? What fusion of ideas is generating your creative energy?',
    color: 'hsl(45 93% 47%)',
  },
];

interface PragmaticImaginationPromptsProps {
  season?: Season;
  polyvagalState?: PolyvagalState;
  onMetaphorSelect?: (metaphor: NatureMetaphor) => void;
}

const PragmaticImaginationPrompts: React.FC<PragmaticImaginationPromptsProps> = ({
  season,
  polyvagalState,
  onMetaphorSelect,
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Sort: relevant metaphors first
  const sorted = [...METAPHORS].sort((a, b) => {
    const aRelevance = (a.season === season ? 2 : 0) + (a.polyvagalState === polyvagalState ? 1 : 0);
    const bRelevance = (b.season === season ? 2 : 0) + (b.polyvagalState === polyvagalState ? 1 : 0);
    return bRelevance - aRelevance;
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Leaf className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Pragmatic Imagination</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Nature metaphors for the current moment. Let the intelligence of living systems guide your thinking.
      </p>

      <div className="space-y-2">
        {sorted.map(m => {
          const isRelevant = m.season === season || m.polyvagalState === polyvagalState;
          const isExpanded = expanded === m.id;

          return (
            <button
              key={m.id}
              onClick={() => {
                setExpanded(isExpanded ? null : m.id);
                onMetaphorSelect?.(m);
              }}
              className={`w-full text-left rounded-lg p-3 transition-all duration-200 border ${
                isRelevant
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-transparent bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: m.color }}>{m.icon}</span>
                <span className="text-xs font-medium">{m.name}</span>
                {isRelevant && (
                  <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-auto">
                    suggested
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground italic">{m.prompt}</p>
              
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-foreground/80 leading-relaxed">{m.reflection}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PragmaticImaginationPrompts;
