import React, { useState } from 'react';
import { BookOpen, Plus, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type ProverbialAbility = 'thinking' | 'doing' | 'seeing' | 'feeling';

export interface DesignDecision {
  id: string;
  description: string;
  ability: ProverbialAbility;
  proverb: string;
  timestamp: string;
  quadrant: 'SN' | 'IN' | 'IM' | 'SM';
}

const ABILITY_MAP: Record<ProverbialAbility, {
  label: string;
  quadrant: 'SN' | 'IN' | 'IM' | 'SM';
  color: string;
  icon: string;
  prompt: string;
}> = {
  thinking: {
    label: 'New way of Thinking',
    quadrant: 'SN',
    color: 'hsl(270 60% 50%)',
    icon: '🧠',
    prompt: 'What new mental model did this decision reveal?',
  },
  doing: {
    label: 'New way of Doing',
    quadrant: 'SN',
    color: 'hsl(45 93% 47%)',
    icon: '⚡',
    prompt: 'What new practice or method emerged from this choice?',
  },
  seeing: {
    label: 'New way of Seeing',
    quadrant: 'SM',
    color: 'hsl(210 70% 50%)',
    icon: '👁️',
    prompt: 'What pattern did you re-see or discover through this decision?',
  },
  feeling: {
    label: 'New way of Feeling',
    quadrant: 'IN',
    color: 'hsl(346 77% 49%)',
    icon: '❤️',
    prompt: 'What new emotional understanding did this decision create?',
  },
};

interface DesignDecisionLogProps {
  decisions?: DesignDecision[];
  onAddDecision?: (decision: DesignDecision) => void;
}

const DesignDecisionLog: React.FC<DesignDecisionLogProps> = ({
  decisions = [],
  onAddDecision,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [description, setDescription] = useState('');
  const [ability, setAbility] = useState<ProverbialAbility>('thinking');
  const [proverb, setProverb] = useState('');

  const handleAdd = () => {
    if (!description.trim()) return;
    const decision: DesignDecision = {
      id: crypto.randomUUID(),
      description: description.trim(),
      ability,
      proverb: proverb.trim() || `Through ${ability}, we learned: ${description.trim().slice(0, 50)}...`,
      timestamp: new Date().toISOString(),
      quadrant: ABILITY_MAP[ability].quadrant,
    };
    onAddDecision?.(decision);
    setDescription('');
    setProverb('');
    setIsAdding(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Design Decision Log</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Each decision develops a proverbial ability — a new way of thinking, doing, seeing, or feeling.
      </p>

      {isAdding && (
        <div className="bg-muted/30 rounded-lg p-3 space-y-3 border border-border">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the design decision..."
            className="text-sm min-h-[50px] resize-none"
          />

          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(ABILITY_MAP) as [ProverbialAbility, typeof ABILITY_MAP[ProverbialAbility]][]).map(
              ([key, info]) => (
                <button
                  key={key}
                  onClick={() => setAbility(key)}
                  className={`p-2 rounded-lg text-xs text-left transition-colors ${
                    ability === key
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-background border border-transparent hover:bg-muted/50'
                  }`}
                >
                  <span className="mr-1">{info.icon}</span>
                  {info.label}
                </button>
              )
            )}
          </div>

          <p className="text-[10px] italic text-muted-foreground">
            {ABILITY_MAP[ability].prompt}
          </p>

          <div className="flex items-center gap-2">
            <Lightbulb className="w-3 h-3 text-primary flex-shrink-0" />
            <input
              value={proverb}
              onChange={(e) => setProverb(e.target.value)}
              placeholder="Distill into a proverb..."
              className="flex-1 text-xs bg-background border rounded-lg px-3 py-2"
            />
          </div>

          <Button size="sm" onClick={handleAdd} disabled={!description.trim()} className="w-full">
            Log Decision
          </Button>
        </div>
      )}

      {/* Decision list */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {decisions.map(d => {
          const info = ABILITY_MAP[d.ability];
          return (
            <div key={d.id} className="rounded-lg bg-muted/20 p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span>{info.icon}</span>
                <span className="font-medium" style={{ color: info.color }}>{info.label}</span>
                <span className="text-muted-foreground ml-auto text-[10px]">
                  {new Date(d.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-foreground/80">{d.description}</p>
              <p className="text-[10px] italic text-primary/70 border-l-2 border-primary/20 pl-2 mt-1">
                "{d.proverb}"
              </p>
            </div>
          );
        })}
        {decisions.length === 0 && !isAdding && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No decisions logged yet. Each decision builds wisdom.
          </p>
        )}
      </div>
    </div>
  );
};

export default DesignDecisionLog;
