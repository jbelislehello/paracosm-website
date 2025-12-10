// Feminine-Safe PRD Design Principles & Anti-Patterns
// 8 Practical UX Quality Principles based on the Calm Magic framework

import { FemininePrinciple, FeminineAntiPattern, PrdStage } from '@/types/journal-expansion';

// 8 Practical UX Quality Principles for Feminine-Safe Product Development
export const FEMININE_PRINCIPLES: FemininePrinciple[] = [
  {
    id: 'receptivity',
    name: 'Receptivity',
    description: 'Design interfaces that listen before they speak. Create space for input before demanding output.',
    practices: [
      'Begin interactions with open questions, not instructions',
      'Allow silence and empty states to feel comfortable',
      'Design for receiving before requiring action'
    ],
    essence: 'The interface receives before it demands',
    designCue: 'Does this screen listen before it speaks?',
    reviewQuestion: 'Have we created genuine space for user input before requiring output?',
    icon: '👂',
    stage: 'real-intelligence'
  },
  {
    id: 'softness-safety',
    name: 'Softness & Safety',
    description: 'Create environments where vulnerability is protected and mistakes are recoverable.',
    practices: [
      'Make undo/redo obvious and accessible',
      'Use soft language for errors (invitation, not blame)',
      'Protect draft and incomplete states from loss'
    ],
    essence: 'Mistakes are recoverable, vulnerability is protected',
    designCue: 'Can users feel safe being uncertain here?',
    reviewQuestion: 'Does this feel like a safe space to make mistakes and explore?',
    icon: '🛡️',
    stage: 'real-intelligence'
  },
  {
    id: 'relationality',
    name: 'Relationality',
    description: 'Center connection and relationship over individual productivity. We-space before me-space.',
    practices: [
      'Show how actions affect others in the system',
      'Design for collaboration as default, solo as option',
      'Make invisible labor and contributions visible'
    ],
    essence: 'Connection is centered, not afterthought',
    designCue: 'Does this strengthen or weaken relationships?',
    reviewQuestion: 'Have we prioritized relational health alongside task completion?',
    icon: '🤝',
    stage: 'knowledge-objects'
  },
  {
    id: 'cyclical-time',
    name: 'Cyclical Time',
    description: 'Honor natural rhythms and seasons. Allow for ebb and flow, not just constant forward motion.',
    practices: [
      'Build in rest states and pause points',
      'Track energy patterns, not just task completion',
      'Allow work to breathe across sessions'
    ],
    essence: 'Rhythms are honored, not overridden',
    designCue: 'Does this allow for natural pauses and cycles?',
    reviewQuestion: 'Have we designed for sustainability across time, not just immediate output?',
    icon: '🌙',
    stage: 'knowledge-objects'
  },
  {
    id: 'embodiment-sensation',
    name: 'Embodiment & Sensation',
    description: 'Integrate somatic intelligence. The body knows things the mind doesn\'t.',
    practices: [
      'Include body check-ins before major decisions',
      'Design micro-pauses for physical awareness',
      'Honor nervous system capacity limits'
    ],
    essence: 'The body is included in the design',
    designCue: 'Does this interface acknowledge users have bodies?',
    reviewQuestion: 'Have we considered physical sensation and comfort in this flow?',
    icon: '🫀',
    stage: 'understanding'
  },
  {
    id: 'intuition-ambiguity',
    name: 'Intuition & Gentle Ambiguity',
    description: 'Allow ambiguity to exist without forcing resolution. Trust intuitive knowing.',
    practices: [
      'Resist forcing premature choices',
      'Keep multiple paths visible, not just optimal',
      'Include "I don\'t know yet" as valid state'
    ],
    essence: 'Ambiguity is allowed, intuition is trusted',
    designCue: 'Can users stay uncertain here without penalty?',
    reviewQuestion: 'Have we made space for intuitive knowing alongside analytical paths?',
    icon: '✨',
    stage: 'understanding'
  },
  {
    id: 'care-nurturance',
    name: 'Care & Nurturance',
    description: 'Build care into system architecture, not just culture. Make protection and nourishment visible.',
    practices: [
      'Design explicit care protocols and check-ins',
      'Include recovery and aftercare in processes',
      'Create escalation paths for overwhelm'
    ],
    essence: 'Care is structural, not optional',
    designCue: 'Is care built into the system, or just expected?',
    reviewQuestion: 'Have we made care and recovery explicit parts of this workflow?',
    icon: '💚',
    stage: 'understanding'
  },
  {
    id: 'inclusivity-plurality',
    name: 'Inclusivity & Plurality',
    description: 'Hold paradox and multiple truths. Design for collective benefit, not zero-sum outcomes.',
    practices: [
      'Allow multiple valid interpretations to coexist',
      'Design for "both/and" rather than "either/or"',
      'Share power rather than hoard it'
    ],
    essence: 'Multiple truths can coexist',
    designCue: 'Does this create more life or less?',
    reviewQuestion: 'Have we designed for plurality and collective benefit?',
    icon: '🌈',
    stage: 'understanding'
  }
];

// 8 Anti-Patterns matching the 8 principles
export const FEMININE_ANTI_PATTERNS: FeminineAntiPattern[] = [
  {
    id: 'demand-first',
    name: 'Demand-First Design',
    description: 'When interfaces require before they receive, demanding input before creating space for it.',
    signs: [
      'Mandatory fields before context is established',
      'No listening phase in onboarding',
      'Rushing to capture data before trust is built'
    ],
    counterPrinciple: 'receptivity'
  },
  {
    id: 'brittle-states',
    name: 'Brittle & Punishing States',
    description: 'When mistakes are costly and vulnerability is exposed rather than protected.',
    signs: [
      'No undo/redo for important actions',
      'Blaming error messages',
      'Draft work easily lost'
    ],
    counterPrinciple: 'softness-safety'
  },
  {
    id: 'atomization',
    name: 'Relational Atomization',
    description: 'When efficiency optimization destroys relational tissue and invisible labor stays invisible.',
    signs: [
      'Solo workflows without collaboration options',
      'No visibility into how work affects others',
      'Connection time seen as waste'
    ],
    counterPrinciple: 'relationality'
  },
  {
    id: 'forced-linearity',
    name: 'Forced Linearity',
    description: 'When natural rhythms are overridden by constant forward motion and no rest states exist.',
    signs: [
      'No pause points or rest states',
      'Guilt around slowness',
      'Only measuring output, not sustainability'
    ],
    counterPrinciple: 'cyclical-time'
  },
  {
    id: 'disembodiment',
    name: 'Disembodiment',
    description: 'When physical signals are ignored and interfaces are designed for minds without bodies.',
    signs: [
      'Pushing through exhaustion normalized',
      'No micro-breaks designed in',
      'Stress signals ignored in design'
    ],
    counterPrinciple: 'embodiment-sensation'
  },
  {
    id: 'premature-closure',
    name: 'Premature Closure',
    description: 'When ambiguity is rushed to resolution and intuitive knowing is dismissed.',
    signs: [
      'Must decide before ready',
      '"I don\'t know" is invalid',
      'Only one path visible'
    ],
    counterPrinciple: 'intuition-ambiguity'
  },
  {
    id: 'care-as-culture',
    name: 'Care as Culture Only',
    description: 'When care is expected but not built into systems, invisible and uncompensated.',
    signs: [
      'Emotional labor expected but unseen',
      'No recovery built into workflows',
      'Overwhelm has no escalation path'
    ],
    counterPrinciple: 'care-nurturance'
  },
  {
    id: 'zero-sum-design',
    name: 'Zero-Sum Design',
    description: 'When design forces either/or choices and hoards rather than shares power.',
    signs: [
      'Binary choices when spectrum exists',
      'Winner/loser dynamics',
      'One truth must dominate'
    ],
    counterPrinciple: 'inclusivity-plurality'
  }
];

// Helper to get principles by stage
export function getPrinciplesByStage(stage: PrdStage): FemininePrinciple[] {
  return FEMININE_PRINCIPLES.filter(p => p.stage === stage);
}

// Helper to check if a design decision aligns with principles
export function checkPrincipleAlignment(decisionDescription: string): {
  aligned: string[];
  threatened: string[];
  suggestions: string[];
} {
  // This could be enhanced with AI analysis
  return {
    aligned: [],
    threatened: [],
    suggestions: ['Run this through each principle\'s review question as a lens']
  };
}

// Get principle by ID
export function getPrincipleById(id: string): FemininePrinciple | undefined {
  return FEMININE_PRINCIPLES.find(p => p.id === id);
}

// Get anti-pattern by ID
export function getAntiPatternById(id: string): FeminineAntiPattern | undefined {
  return FEMININE_ANTI_PATTERNS.find(a => a.id === id);
}

// Get anti-pattern for a principle
export function getCounterPattern(principleId: string): FeminineAntiPattern | undefined {
  return FEMININE_ANTI_PATTERNS.find(a => a.counterPrinciple === principleId);
}

// Legacy export for backward compatibility
export const FEMININE_THREATS = FEMININE_ANTI_PATTERNS.map(ap => ({
  id: ap.id,
  name: ap.name,
  description: ap.description,
  signs: ap.signs
}));
