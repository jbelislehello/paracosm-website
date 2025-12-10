import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { QuadrantPosition } from '@/types/trajectory';
import { Lock, Waves, Zap, RotateCcw } from 'lucide-react';

export type FeltState = 'stuck' | 'flowing' | 'breakthrough' | null;

interface ShadowNudgePanelProps {
  currentPosition: QuadrantPosition;
  onApplyNudge: (position: QuadrantPosition, feltState: FeltState, note: string | null) => void;
  onReset: () => void;
  hasExistingNudge: boolean;
}

const FELT_STATES: { value: FeltState; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'stuck', label: 'Stuck', icon: <Lock className="w-4 h-4" />, color: 'bg-destructive/20 text-destructive border-destructive/30' },
  { value: 'flowing', label: 'Flowing', icon: <Waves className="w-4 h-4" />, color: 'bg-primary/20 text-primary border-primary/30' },
  { value: 'breakthrough', label: 'Breakthrough', icon: <Zap className="w-4 h-4" />, color: 'bg-chart-5/20 text-chart-5 border-chart-5/30' },
];

export const ShadowNudgePanel: React.FC<ShadowNudgePanelProps> = ({
  currentPosition,
  onApplyNudge,
  onReset,
  hasExistingNudge
}) => {
  const [nudgeX, setNudgeX] = useState<number>(currentPosition.x * 100);
  const [nudgeY, setNudgeY] = useState<number>(currentPosition.y * 100);
  const [feltState, setFeltState] = useState<FeltState>(null);
  const [note, setNote] = useState<string>('');

  const handleApply = () => {
    onApplyNudge(
      { x: nudgeX / 100, y: nudgeY / 100 },
      feltState,
      note.trim() || null
    );
  };

  const handleReset = () => {
    setNudgeX(currentPosition.x * 100);
    setNudgeY(currentPosition.y * 100);
    setFeltState(null);
    setNote('');
    onReset();
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Nudge Shadow Position</h4>
        {hasExistingNudge && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 px-2">
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Adjust where you feel your shadow truly sits. System inference is weighted 70%, your nudge 30%.
      </p>

      {/* Memory ↔ Novelty (X axis) */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Memory</span>
          <span>Novelty</span>
        </div>
        <Slider
          value={[nudgeX]}
          onValueChange={([v]) => setNudgeX(v)}
          min={-100}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="text-center text-xs text-muted-foreground">
          {nudgeX > 0 ? `+${nudgeX}%` : `${nudgeX}%`}
        </div>
      </div>

      {/* Intimacy ↔ Sovereignty (Y axis) */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Intimacy</span>
          <span>Sovereignty</span>
        </div>
        <Slider
          value={[nudgeY]}
          onValueChange={([v]) => setNudgeY(v)}
          min={-100}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="text-center text-xs text-muted-foreground">
          {nudgeY > 0 ? `+${nudgeY}%` : `${nudgeY}%`}
        </div>
      </div>

      {/* Felt State Buttons */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">How does it feel?</span>
        <div className="flex gap-2">
          {FELT_STATES.map((state) => (
            <Button
              key={state.value}
              variant="outline"
              size="sm"
              className={`flex-1 h-8 text-xs ${
                feltState === state.value 
                  ? state.color + ' border-2' 
                  : 'opacity-60 hover:opacity-100'
              }`}
              onClick={() => setFeltState(feltState === state.value ? null : state.value)}
            >
              {state.icon}
              <span className="ml-1">{state.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Optional Note */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Reflection (optional)</span>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Why does the shadow feel here..."
          className="min-h-[60px] text-xs resize-none"
        />
      </div>

      {/* Apply Button */}
      <Button 
        onClick={handleApply} 
        className="w-full"
        size="sm"
      >
        Apply Nudge
      </Button>
    </div>
  );
};
