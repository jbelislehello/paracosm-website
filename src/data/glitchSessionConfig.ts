
export interface SessionPhase {
  id: 'glitch' | 'drift' | 'tune';
  name: string;
  duration: number; // seconds
  colorFrom: string;
  colorTo: string;
  icon: 'Search' | 'Waves' | 'Sparkles';
  facilitatorPrompts: string[];
  amplificationTechniques: {
    name: string;
    description: string;
    minGroupSize: number;
  }[];
}

export type SessionStatus = 'idle' | 'running' | 'paused' | 'complete';
export type GroupSize = 'small' | 'medium' | 'large';

export const GROUP_SIZE_RANGES: Record<GroupSize, { min: number; max: number; label: string }> = {
  small: { min: 5, max: 9, label: '5-9 participants' },
  medium: { min: 10, max: 15, label: '10-15 participants' },
  large: { min: 16, max: 50, label: '16+ participants' }
};

export const SESSION_PHASES: SessionPhase[] = [
  {
    id: 'glitch',
    name: 'GL!TCH',
    duration: 7 * 60, // 7 minutes
    colorFrom: 'hsl(0 84% 60%)',
    colorTo: 'hsl(350 89% 60%)',
    icon: 'Search',
    facilitatorPrompts: [
      "What tensions or frictions are present in the room?",
      "What patterns are you noticing?",
      "Where is energy blocked or stuck?",
      "What's alive that wants attention?",
      "What glitches are surfacing right now?",
      "What's trying to emerge that hasn't been named?"
    ],
    amplificationTechniques: [
      {
        name: 'Roving Mic Harvest',
        description: 'Pass the mic to capture 3-5 glitches from the crowd',
        minGroupSize: 10
      },
      {
        name: 'Sticky Note Storm',
        description: 'Everyone writes one glitch, post on wall, cluster similar ones',
        minGroupSize: 8
      },
      {
        name: 'Pair Share',
        description: 'Turn to neighbor, share one friction each',
        minGroupSize: 6
      }
    ]
  },
  {
    id: 'drift',
    name: 'DRIFT',
    duration: 10 * 60, // 10 minutes
    colorFrom: 'hsl(270 91% 65%)',
    colorTo: 'hsl(240 100% 65%)',
    icon: 'Waves',
    facilitatorPrompts: [
      "What wild guesses emerge?",
      "How might we approach this differently?",
      "What does your body sense about this?",
      "What connections are forming?",
      "What would happen if we let go of the obvious solution?",
      "What's the strangest possibility here?"
    ],
    amplificationTechniques: [
      {
        name: 'Fishbowl Drift',
        description: 'Inner circle explores while outer circle witnesses silently',
        minGroupSize: 12
      },
      {
        name: 'Small Group Brainstorm',
        description: 'Break into groups of 3-4 to explore possibilities',
        minGroupSize: 9
      },
      {
        name: 'Somatic Check-in',
        description: 'Everyone stands, moves to show where energy is flowing',
        minGroupSize: 6
      }
    ]
  },
  {
    id: 'tune',
    name: 'TUNE',
    duration: 6 * 60, // 6 minutes
    colorFrom: 'hsl(160 84% 39%)',
    colorTo: 'hsl(175 84% 32%)',
    icon: 'Sparkles',
    facilitatorPrompts: [
      "What's ready to commit to form?",
      "What's one concrete next step?",
      "How do we weave these threads together?",
      "What wants to be named?",
      "What are you willing to try before next session?",
      "What pattern crystallized for you?"
    ],
    amplificationTechniques: [
      {
        name: 'Popcorn Commitments',
        description: 'Random participants share one commitment each',
        minGroupSize: 10
      },
      {
        name: 'Resonance Check',
        description: 'Quick hand-raise to signal agreement or energy',
        minGroupSize: 8
      },
      {
        name: 'Closing Round',
        description: 'One word or phrase from each person',
        minGroupSize: 5
      }
    ]
  }
];

export const TOTAL_SESSION_DURATION = SESSION_PHASES.reduce((sum, phase) => sum + phase.duration, 0);

export const PROMPT_ROTATION_INTERVAL = 90; // seconds between prompt changes
