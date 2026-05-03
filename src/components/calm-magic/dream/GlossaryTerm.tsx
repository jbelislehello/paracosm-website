import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Calm Magic ontology glossary.
 * Hover any term to get a 1-line definition tied to the
 * Pollen → Noem → Poem → Totem → Anthem progression.
 */
export const ONTOLOGY_GLOSSARY: Record<string, { label: string; def: string }> = {
  pollen: {
    label: 'Pollen',
    def: 'A raw fragment of context — a quote, image, feeling, or signal that lands in the field before it becomes an idea.',
  },
  noem: {
    label: 'Noem',
    def: 'A shared idea or mental model — the moment a Pollen becomes thinkable across people.',
  },
  poem: {
    label: 'Poem',
    def: 'A narrative prototype — a story, scene, or system that shows the idea in motion.',
  },
  totem: {
    label: 'Totem',
    def: 'The technical & ethical scaffolding — data, access, security, integrations that hold the Poem.',
  },
  anthem: {
    label: 'Anthem',
    def: 'The market-facing expression — positioning, narrative, and signals that carry it outward.',
  },
  love: {
    label: 'LOVE',
    def: 'Receptivity & care. Why the work deserves to exist, and who is held by it.',
  },
  magic: {
    label: 'MAGIC',
    def: 'Pattern, hypothesis, story-world. The leap that makes the invention surprising.',
  },
  calm: {
    label: 'CALM',
    def: 'Constraints, requirements, risks. What keeps the dream regulated and sustainable.',
  },
  open: {
    label: 'OPEN',
    def: 'Ontology, workflow, and adjustment. How the system stays porous to reality.',
  },
  free: {
    label: 'FREE',
    def: 'Success criteria, totems, and what gets released into the next cycle.',
  },
};

interface GlossaryTermProps {
  term: keyof typeof ONTOLOGY_GLOSSARY | string;
  children?: React.ReactNode;
  className?: string;
}

const GlossaryTerm: React.FC<GlossaryTermProps> = ({ term, children, className }) => {
  const entry = ONTOLOGY_GLOSSARY[term.toLowerCase()];
  if (!entry) return <>{children ?? term}</>;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={
              className ??
              'underline decoration-dotted decoration-muted-foreground/50 underline-offset-4 cursor-help'
            }
            tabIndex={0}
          >
            {children ?? entry.label}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs leading-relaxed">
          <strong className="block mb-0.5">{entry.label}</strong>
          {entry.def}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GlossaryTerm;
