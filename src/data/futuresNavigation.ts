// Futures Navigation - Possible, Probable, Preferable framework

export interface FutureType {
  id: 'possible' | 'probable' | 'preferable';
  name: string;
  description: string;
  phase: string;
  icon: string;
  question: string;
  color: string;
}

export const FUTURES_TYPES: FutureType[] = [
  {
    id: 'possible',
    name: 'Possible Futures',
    description: 'What COULD happen — the widest horizon of potential outcomes',
    phase: 'GL!TCH',
    icon: '🌫️',
    question: 'What tensions and possibilities exist in this space?',
    color: 'chart-1'
  },
  {
    id: 'probable',
    name: 'Probable Futures',
    description: 'What LIKELY will happen — extrapolating current trajectories',
    phase: 'DRIFT',
    icon: '📊',
    question: 'What patterns are we already on track toward?',
    color: 'chart-3'
  },
  {
    id: 'preferable',
    name: 'Preferable Futures',
    description: 'What SHOULD happen — intentional direction toward desired outcomes',
    phase: 'TUNE',
    icon: '⭐',
    question: 'What future do we choose to commit toward?',
    color: 'chart-5'
  }
];

export const VELOCITY_CONCEPT = {
  definition: "Velocity = Speed + Direction",
  
  insight: "The Calm Magic Board helps focus exploration toward Preferable Futures, not just Possible or Probable ones. Speed without direction is noise. Direction without speed is stagnation.",
  
  axes: {
    speed: {
      name: "Speed",
      description: "Rate of learning, iteration, and adaptation",
      indicators: ["Tiles visited per session", "POLEN entries density", "Cycle completion rate"]
    },
    direction: {
      name: "Direction",
      description: "Alignment toward preferable outcomes and values",
      indicators: ["Dimensional coverage", "C-Suite alignment", "Ethical/Ecological scores"]
    }
  },

  formula: "True Velocity = Learning Speed × Directional Alignment × Relational Intelligence"
};

export const FUTURES_NAVIGATION_FLOW = [
  {
    from: 'possible',
    to: 'probable',
    transition: 'Pattern Recognition',
    description: 'Surface patterns from possibilities to identify likely trajectories',
    layer: 'POLLEN → NOEM'
  },
  {
    from: 'probable',
    to: 'preferable',
    transition: 'Intentional Selection',
    description: 'Choose which probable futures to amplify or redirect',
    layer: 'NOEM → POEM'
  },
  {
    from: 'preferable',
    to: 'manifest',
    transition: 'Commitment & Structure',
    description: 'Build the ontology and systems to manifest chosen futures',
    layer: 'POEM → TOTEM → ANTHEM'
  }
];

export const LEARNING_ORGANIZATION_GOAL = {
  title: "Creating Learning Organizations",
  subtitle: "Relational Intelligence in Humans in the AI Era",
  
  principles: [
    {
      name: "Personal Mastery",
      calmMagicMapping: "Individual journey through the 260-tile matrix",
      dimension: "ontological"
    },
    {
      name: "Mental Models",
      calmMagicMapping: "Surfacing biases and shadows through GL!TCH",
      dimension: "semantic"
    },
    {
      name: "Shared Vision",
      calmMagicMapping: "Higher Self prophecy and team alignment",
      dimension: "relational"
    },
    {
      name: "Team Learning",
      calmMagicMapping: "Collaborative DRIFT exploration",
      dimension: "temporal"
    },
    {
      name: "Systems Thinking",
      calmMagicMapping: "6 dimensions and ecological awareness",
      dimension: "ecological"
    }
  ],

  outcome: "Organizations that can sense, learn, and adapt together — where humans and AI systems co-evolve through structured dialogue."
};
