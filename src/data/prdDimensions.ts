// PRD Dimensional Framework - 6 Living Dimensions + Quality Lenses

export interface PrdDimension {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  question: string;
  description: string;
  ctoView: string;
  cfoView: string;
  ceoView: string;
  relatedLayers: string[];
  mappedPhase: string;
  qualityLenses: string[];
}

export const PRD_DIMENSIONS: PrdDimension[] = [
  {
    id: 'ontological',
    name: 'Ontologique',
    nameEn: 'Ontological',
    emoji: '🔮',
    question: 'What the system IS',
    description: 'The PRD no longer describes what the product does, but what it IS in its ecosystem. It captures relationships between agents, data, and environments. A clear ontology is traceable collective intelligence.',
    ctoView: "The technical and semantic structure of the living system",
    cfoView: "Investment guarantee in an evolutionary architecture",
    ceoView: "Foundation of coherence between vision and reality",
    relatedLayers: ['POLLEN', 'TOTEM'],
    mappedPhase: 'LOVE',
    qualityLenses: ['Positionality', 'Compositionality', 'Ontological Shift']
  },
  {
    id: 'relational',
    name: 'Relationnelle',
    nameEn: 'Relational',
    emoji: '🤝',
    question: 'What the system LISTENS to',
    description: 'Learning organizations observe their relationships, not just results. The relational PRD maps flows of attention, emotion, and decision — a map of interdependencies between humans, AI, processes, clients, and values.',
    ctoView: "The architecture of listening",
    cfoView: "Visibility into the real value of interactions",
    ceoView: "The compass of a living culture",
    relatedLayers: ['POLLEN', 'NOEM'],
    mappedPhase: 'MAGIC',
    qualityLenses: ['Empathy', 'Sympathy', 'Social Skills', 'Emotional Intelligence', 'Expressivity']
  },
  {
    id: 'temporal',
    name: 'Temporelle',
    nameEn: 'Temporal',
    emoji: '⏳',
    question: 'What the system BECOMES',
    description: 'An agentic PRD integrates the dimension of time. It is not a snapshot but a trajectory — a series of Glitch, Drift, and Tune. The product emerges, adjusts, learns. Each version is a mirror of comprehension.',
    ctoView: "Orchestrating cycles of reflexive improvement",
    cfoView: "Anticipating value flows through time",
    ceoView: "An organization capable of transforming without losing itself",
    relatedLayers: ['POEM', 'ANTHEM'],
    mappedPhase: 'CALM',
    qualityLenses: ['NeuroPlasticity', 'Elasticity', 'Spontaneity']
  },
  {
    id: 'semantic',
    name: 'Sémantique',
    nameEn: 'Semantic',
    emoji: '📚',
    question: 'What the system UNDERSTANDS',
    description: 'AI no longer just executes — it interprets. A semantic PRD defines not only features but also language, definitions, and metaphors. Governance of meaning. A shared metalanguage between technology, strategy, and culture.',
    ctoView: "Building on coherent language models",
    cfoView: "Evaluating with meaningful metrics",
    ceoView: "Aligning strategy with comprehension",
    relatedLayers: ['TOTEM'],
    mappedPhase: 'OPEN',
    qualityLenses: ['Inference Rules', 'Business Logic', 'Mathematical Creativity', 'Vectors']
  },
  {
    id: 'ethical',
    name: 'Éthique',
    nameEn: 'Ethical',
    emoji: '⚖️',
    question: 'What the system REFLECTS',
    description: 'Every system is a mirror. The PRD must make visible implicit values, potential biases, and governance principles. In Calm Magic, ethics is not a checkbox — it is a regulatory principle of design, data, and decision. Ethical leadership becomes an infrastructure of trust.',
    ctoView: "Ethical constraints as design parameters",
    cfoView: "Trust infrastructure with measurable impact",
    ceoView: "Leadership legitimacy through embodied values",
    relatedLayers: ['ANTHEM'],
    mappedPhase: 'FREE',
    qualityLenses: ['Self Awareness', 'Self Regulation', 'Noetic Sciences']
  },
  {
    id: 'ecological',
    name: 'Écologique',
    nameEn: 'Ecological',
    emoji: '🌍',
    question: 'What the system AFFECTS',
    description: 'Every product is an agent of transformation — of attention, time, and life itself. The ecological PRD recognizes energetic, cognitive, and emotional impact. Sustainability is built into the design itself.',
    ctoView: "Responsibility for usage models and footprint",
    cfoView: "Balance between yield and regeneration",
    ceoView: "Leadership founded on vitality, not just growth",
    relatedLayers: ['ANTHEM'],
    mappedPhase: 'FREE',
    qualityLenses: ['Ecology', 'Somatic Creativity', 'Manifestation']
  }
];

export interface QualityLensCategory {
  id: string;
  name: string;
  icon: string;
  lenses: string[];
  description: string;
  relatedLayers: string[];
}

export const QUALITY_LENS_CATEGORIES: QualityLensCategory[] = [
  {
    id: 'cognitive',
    name: 'Cognitive Lenses',
    icon: '🧠',
    lenses: ['Positionality', 'Compositionality', 'Inference Rules', 'Business Logic', 'Mathematical Creativity', 'Apriori', 'PreMortem'],
    description: 'How we think, reason, and structure knowledge',
    relatedLayers: ['NOEM', 'TOTEM']
  },
  {
    id: 'somatic',
    name: 'Somatic Lenses',
    icon: '🫀',
    lenses: ['Neurodivergence', 'NeuroPlasticity', 'Somatic Creativity', 'Self Regulation'],
    description: 'How bodies and nervous systems participate in design',
    relatedLayers: ['POLLEN', 'POEM']
  },
  {
    id: 'relational',
    name: 'Relational Lenses',
    icon: '🤝',
    lenses: ['Empathy', 'Sympathy', 'Social Skills', 'Emotional Intelligence', 'Expressivity', 'Elasticity'],
    description: 'How we connect, communicate, and care',
    relatedLayers: ['POEM', 'ANTHEM']
  },
  {
    id: 'aesthetic',
    name: 'Aesthetic Lenses',
    icon: '🎨',
    lenses: ['Aesthetics', 'Poetic Engineering', 'Spontaneity', 'Manifestation'],
    description: 'How beauty, craft, and emergence shape design',
    relatedLayers: ['NOEM', 'ANTHEM']
  },
  {
    id: 'systems',
    name: 'Systems Lenses',
    icon: '🌐',
    lenses: ['Ecology', 'Noetic Sciences', 'Self Awareness', 'Vectors', 'Ontological Shift'],
    description: 'How systems think, adapt, and evolve',
    relatedLayers: ['TOTEM', 'ANTHEM']
  }
];

// Map dimensions to Calm Magic phases
export const PHASE_DIMENSION_MAP: Record<string, string[]> = {
  'LOVE': ['ontological'],
  'MAGIC': ['relational'],
  'CALM': ['temporal'],
  'OPEN': ['semantic'],
  'FREE': ['ethical', 'ecological']
};

// Get dimensions by layer
export const getDimensionsByLayer = (layer: string): PrdDimension[] => {
  return PRD_DIMENSIONS.filter(d => d.relatedLayers.includes(layer));
};

// Get quality lenses by layer
export const getLensesByLayer = (layer: string): string[] => {
  const categories = QUALITY_LENS_CATEGORIES.filter(c => c.relatedLayers.includes(layer));
  return categories.flatMap(c => c.lenses);
};
