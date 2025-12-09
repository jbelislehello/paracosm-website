// Feminine-Safe PRD Design Principles & Threats
// Based on the Calm Magic ontological safety framework

import { FemininePrinciple, FeminineThreat } from '@/types/journal-expansion';

// 9 Design Principles for Feminine-Safe Product Development
export const FEMININE_PRINCIPLES: FemininePrinciple[] = [
  {
    id: 'protect-intuition',
    name: 'Protect Intuition',
    description: 'Design spaces that honor and amplify intuitive knowing rather than override it with logic-only pathways.',
    practices: [
      'Include "felt sense" check-ins before major decisions',
      'Allow ambiguity to exist without forcing resolution',
      'Create pauses for body-based knowing'
    ]
  },
  {
    id: 'preserve-openness',
    name: 'Preserve Openness',
    description: 'Maintain possibility space even as structure emerges. Resist premature closure.',
    practices: [
      'Design reversible commitments where possible',
      'Keep multiple paths visible, not just the "optimal" one',
      'Build in divergence phases before convergence'
    ]
  },
  {
    id: 'honor-cycles',
    name: 'Honor Cycles',
    description: 'Recognize that energy, creativity, and capacity move in waves, not straight lines.',
    practices: [
      'Build rest into workflows, not just productivity',
      'Allow for seasonal/cyclical rhythms in planning',
      'Track energy patterns alongside task completion'
    ]
  },
  {
    id: 'relational-primacy',
    name: 'Relational Primacy',
    description: 'Center relationships and connection as the foundation, not an afterthought.',
    practices: [
      'Check impact on relationships before optimizing for efficiency',
      'Design for we-space before me-space',
      'Include relational health metrics'
    ]
  },
  {
    id: 'embodied-knowing',
    name: 'Embodied Knowing',
    description: 'Integrate somatic intelligence—the body knows things the mind doesn\'t.',
    practices: [
      'Include body check-ins in decision frameworks',
      'Design for physical space awareness',
      'Honor nervous system capacity limits'
    ]
  },
  {
    id: 'emergence-welcome',
    name: 'Welcome Emergence',
    description: 'Allow what wants to happen to happen, rather than forcing predetermined outcomes.',
    practices: [
      'Build in emergence windows (unplanned time)',
      'Track what\'s trying to emerge, not just goals',
      'Celebrate unexpected outcomes'
    ]
  },
  {
    id: 'care-infrastructure',
    name: 'Care Infrastructure',
    description: 'Build care into the system architecture, not just the culture.',
    practices: [
      'Design explicit care protocols and check-ins',
      'Create escalation paths for overwhelm',
      'Include recovery and aftercare in all processes'
    ]
  },
  {
    id: 'membrane-boundaries',
    name: 'Membrane Boundaries',
    description: 'Create semi-permeable boundaries that protect while allowing flow.',
    practices: [
      'Design boundaries that can flex based on context',
      'Allow information in/out without flooding',
      'Create safe containers for vulnerability'
    ]
  },
  {
    id: 'generative-power',
    name: 'Generative Power',
    description: 'Channel power toward creation and life, not domination or extraction.',
    practices: [
      'Ask: does this create more life or less?',
      'Share power rather than hoard it',
      'Design for collective benefit, not zero-sum'
    ]
  }
];

// 6 Threats to Feminine-Safe Design
export const FEMININE_THREATS: FeminineThreat[] = [
  {
    id: 'intuition-suppression',
    name: 'Suppression of Intuition',
    description: 'When systems demand only rational justification, intuitive knowing gets dismissed or hidden.',
    signs: [
      'Pressure to "prove" every decision with data',
      'Dismissing gut feelings as unprofessional',
      'Over-reliance on metrics and dashboards'
    ]
  },
  {
    id: 'emotional-extraction',
    name: 'Emotional Extraction',
    description: 'When emotional labor is expected but uncompensated, or emotions are mined for insight without consent.',
    signs: [
      'Emotional labor expected but invisible',
      'Sentiment analysis without consent',
      'Vulnerability required but not protected'
    ]
  },
  {
    id: 'forced-productivity',
    name: 'Forced Productivity',
    description: 'When natural rhythms are overridden by constant output demands.',
    signs: [
      'No space for rest or recovery',
      'Guilt around slowness or pauses',
      'Metrics that only measure output, not sustainability'
    ]
  },
  {
    id: 'premature-closure',
    name: 'Premature Closure',
    description: 'When ambiguity is rushed to resolution before understanding emerges.',
    signs: [
      'Pressure to decide before ready',
      'Intolerance for "I don\'t know yet"',
      'Solutions before problems are understood'
    ]
  },
  {
    id: 'relational-erasure',
    name: 'Relational Erasure',
    description: 'When efficiency optimization destroys relational tissue.',
    signs: [
      'Relationships sacrificed for speed',
      'Atomized work replacing collaborative flow',
      'Connection time seen as waste'
    ]
  },
  {
    id: 'body-disregard',
    name: 'Body Disregard',
    description: 'When physical and somatic signals are ignored or overridden.',
    signs: [
      'Pushing through exhaustion',
      'Ignoring stress signals',
      'Designing for minds without bodies'
    ]
  }
];

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
    suggestions: ['Consider running this through each principle as a lens']
  };
}

// Get principle by ID
export function getPrincipleById(id: string): FemininePrinciple | undefined {
  return FEMININE_PRINCIPLES.find(p => p.id === id);
}

// Get threat by ID
export function getThreatById(id: string): FeminineThreat | undefined {
  return FEMININE_THREATS.find(t => t.id === id);
}
