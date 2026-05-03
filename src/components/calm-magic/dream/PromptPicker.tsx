import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { pickThree, type DreamPrompt } from '@/data/dreamPrompts';

interface PromptPickerProps {
  onChoose: (prompt: DreamPrompt) => void;
}

const PromptPicker: React.FC<PromptPickerProps> = ({ onChoose }) => {
  const [seed, setSeed] = useState(() => Date.now());
  const prompts = useMemo(() => pickThree(seed), [seed]);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-light tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          What is the board listening for?
        </h2>
        <p className="text-sm text-muted-foreground">Pick one question. Your PRD will answer it back through the board.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {prompts.map((p) => (
          <Card
            key={p.id}
            role="button"
            tabIndex={0}
            onClick={() => onChoose(p)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChoose(p); } }}
            className="cursor-pointer p-4 hover:shadow-md hover:scale-[1.01] transition-all border-primary/20 hover:border-primary/60 bg-gradient-to-br from-background to-muted/20"
          >
            <div className="text-base font-medium mb-2 leading-snug">{p.text}</div>
            <div className="text-xs text-muted-foreground italic">{p.hint}</div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={() => setSeed(Date.now())}>
          Shuffle questions
        </Button>
      </div>
    </div>
  );
};

export default PromptPicker;
