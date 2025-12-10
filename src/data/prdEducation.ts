// PRD Educational Content - Traditional templates comparison and Calm Magic differentiator

export interface TraditionalPrdTemplate {
  name: string;
  author?: string;
  principles: string[];
  sections: string[];
  strength: string;
  limitation: string;
}

export const TRADITIONAL_PRD_TEMPLATES: TraditionalPrdTemplate[] = [
  {
    name: "Linear",
    author: "Nan Yu",
    principles: [
      "Start with highest level → get more granular",
      "Start with widest audience → get narrower",
      "Start with stable content → end with changing content"
    ],
    sections: ["Context (Why)", "Usage Scenarios", "Milestones"],
    strength: "Clear sequencing and audience awareness. Milestones are the living part.",
    limitation: "Static document structure, no relational intelligence tracking"
  },
  {
    name: "Asana Spec Template",
    author: "Asana",
    principles: [
      "Problem-first thinking",
      "Hypothesis-driven development",
      "Non-goals are explicit"
    ],
    sections: ["Problem Statement", "Hypotheses", "Non-Goals", "Narrative Vision"],
    strength: "Excellent problem definition with structured hypotheses",
    limitation: "Lightweight on solutions and release planning"
  },
  {
    name: "Decision Journal Style",
    author: "Various",
    principles: [
      "Document explored paths",
      "Track decision rationale",
      "Prevent stakeholder rehashing"
    ],
    sections: ["Explored Directions", "Decided Direction", "Decision Journal"],
    strength: "Reduces circular discussions, preserves decision history",
    limitation: "Focused on decisions, not emergence or relationships"
  },
  {
    name: "Amazon",
    author: "Amazon",
    principles: [
      "Working backwards from customer",
      "Press release format",
      "FAQ-driven clarification"
    ],
    sections: ["Press Release", "FAQ", "Visuals", "User Manual"],
    strength: "Forces customer-centric thinking from day one",
    limitation: "Can feel forced, misses iterative discovery"
  },
  {
    name: "Figma",
    author: "Figma",
    principles: [
      "Design-led product thinking",
      "Visual prototyping first",
      "Collaborative iteration"
    ],
    sections: ["Overview", "Goals", "User Stories", "Design Specs"],
    strength: "Tight integration with design process",
    limitation: "Less suited for backend or data-heavy products"
  },
  {
    name: "Intercom",
    author: "Intercom",
    principles: [
      "Job-to-be-done framework",
      "User outcome focused",
      "Switching costs awareness"
    ],
    sections: ["Jobs to be Done", "Success Metrics", "Constraints"],
    strength: "Strong user-outcome orientation",
    limitation: "Can miss systemic or organizational patterns"
  }
];

export const CALM_MAGIC_DIFFERENTIATOR = {
  philosophy: "The PRD is no longer a document: it's an organism",
  subtitle: "Creating Learning Organizations and Relational Intelligence in Humans in the AI Era",
  
  corePromise: `Traditional PRDs ask "What are we building?" 
Calm Magic PRDs ask "What is this system becoming, listening to, reflecting, and affecting?"`,

  principles: [
    {
      name: "Living Organism Principle",
      description: "Insights are seeds that want to grow, not data to be processed"
    },
    {
      name: "Dialogical Cue Cards",
      description: "Questions are invitations to reflection, not forms to fill"
    },
    {
      name: "Preferable Futures",
      description: "Velocity = Speed + Direction toward what SHOULD happen, not just what COULD"
    },
    {
      name: "Relational Intelligence",
      description: "The PRD protects and nurtures relationships between humans, systems, and ideas"
    },
    {
      name: "Breath Cycles",
      description: "The PRD breathes through GL!TCH → DRIFT → TUNE cycles, never 'done'"
    }
  ],

  keyDifferences: [
    {
      traditional: "Static document",
      calmMagic: "Living organism that metabolizes experience"
    },
    {
      traditional: "Feature requirements",
      calmMagic: "6 dimensions: Ontological, Relational, Temporal, Semantic, Ethical, Ecological"
    },
    {
      traditional: "Single stakeholder view",
      calmMagic: "C-Suite alignment (CTO, CFO, CEO perspectives)"
    },
    {
      traditional: "Linear completion",
      calmMagic: "Cyclical growth through 5 seasons (POLLENS → ANTHEMS)"
    },
    {
      traditional: "Problem → Solution",
      calmMagic: "Possible → Probable → Preferable futures navigation"
    }
  ]
};

export const WHAT_IS_A_PRD = {
  definition: "A Product Requirements Document (PRD) is one of the key tools product managers use to communicate what they are building and why — to themselves and stakeholders.",
  
  purpose: [
    "Align teams on what to build",
    "Document the 'why' behind decisions",
    "Track requirements and constraints",
    "Serve as reference throughout development"
  ],

  whyItMatters: "Having a great PRD template saves time and friction. But most templates focus on WHAT to build, missing the relational and emergent nature of modern product development.",

  calmMagicEvolution: "Calm Magic transforms the PRD from a static specification into a living documentation system that tracks not just requirements, but the emergence of understanding itself."
};

// ============================================
// PERSONAL MODE: Relational Design & Poiesis
// ============================================

export const WHAT_IS_RRD = {
  definition: "A Relational Requirements Document (RRD) maps the requirements for transformation — not what to build, but what relationships, patterns, and ways of being want to emerge through your inner work.",
  
  purpose: [
    "Self-understanding & integration",
    "Relational coherence mapping",
    "Window of Tolerance expansion",
    "Embodied knowing cultivation"
  ],

  whyItMatters: "While PRDs focus on product features, RRDs focus on relational features — the qualities of connection, presence, and coherence you're developing within yourself and your relationships.",

  calmMagicEvolution: "The RRD emerges naturally from your journey through the 5 seasons. As you capture fragments and dialogues, the RRD crystallizes your transformation into a living document of relational intelligence.",

  keyDifferences: [
    { prd: "What features to build", rrd: "What qualities of being to cultivate" },
    { prd: "User requirements", rrd: "Relational requirements" },
    { prd: "Product-market fit", rrd: "Self-world coherence" },
    { prd: "Technical specifications", rrd: "Embodied practices" },
    { prd: "Stakeholder alignment", rrd: "Inner parts integration" }
  ]
};

export const WHAT_IS_POIESIS = {
  definition: "Poiesis (Greek: ποίησις) is the act of bringing something into being that did not exist before — creative emergence where inner knowing meets outer expression through the body's wisdom.",
  
  purpose: [
    "Express what's alive in you",
    "Transform tension into creative form",
    "Navigate inner landscapes safely",
    "Build relational coherence"
  ],

  whyItMatters: "Most journaling and inner work tools focus on processing thoughts. But true transformation happens through embodied expression — giving form to what's emerging within.",

  calmMagicEvolution: "The Calm Magic Expansion Journal transforms inner work from journaling into a living navigation system that expands your Window of Tolerance through creative expression."
};

export interface RelationalDesignApproach {
  name: string;
  author?: string;
  principles: string[];
  strength: string;
  limitation: string;
}

export const RELATIONAL_DESIGN_APPROACHES: RelationalDesignApproach[] = [
  {
    name: "Somatic Experiencing",
    author: "Peter Levine",
    principles: [
      "Body-first processing",
      "Pendulation between activation & calm",
      "Titration of overwhelming experiences"
    ],
    strength: "Deep trauma-informed nervous system regulation through felt sense",
    limitation: "Requires trained facilitation for deeper work"
  },
  {
    name: "Internal Family Systems",
    author: "Richard Schwartz",
    principles: [
      "Parts work & inner multiplicity",
      "Self-leadership from the center",
      "Unburdening wounded parts"
    ],
    strength: "Excellent for inner conflict resolution and self-compassion",
    limitation: "Can intellectualize when embodiment is needed"
  },
  {
    name: "Focusing",
    author: "Eugene Gendlin",
    principles: [
      "Felt sense inquiry",
      "Friendly attention to body sensations",
      "Allowing meaning to emerge"
    ],
    strength: "Accessible practice for connecting with body wisdom",
    limitation: "May miss relational and systemic dimensions"
  },
  {
    name: "Polyvagal-Informed Work",
    author: "Stephen Porges",
    principles: [
      "Neuroception of safety",
      "Vagal tone & co-regulation",
      "State-dependent responses"
    ],
    strength: "Scientific grounding for safety-first approaches",
    limitation: "Can become overly technical, losing felt experience"
  }
];

export const CALM_MAGIC_PERSONAL_DIFFERENTIATOR = {
  philosophy: "Your inner landscape is a living ecosystem, not a problem to solve",
  subtitle: "Expanding your Window of Tolerance through creative emergence and embodied expression",
  
  corePromise: `Traditional inner work asks "What's wrong?"
Calm Magic asks "What wants to emerge, and how can I give it form?"`,

  principles: [
    {
      name: "Sacred Space",
      description: "Each tile is a container for what wants to emerge — not a task to complete"
    },
    {
      name: "Somatic Knowing",
      description: "The body knows before the mind understands — we honor felt sense first"
    },
    {
      name: "Relational Field",
      description: "Healing happens in connection — with self, others, and the creative act"
    },
    {
      name: "Cyclical Time",
      description: "We move in spirals, not lines — returning to themes at deeper levels"
    },
    {
      name: "Gentle Ambiguity",
      description: "Not-knowing is welcomed — clarity emerges through the process"
    }
  ],

  keyDifferences: [
    {
      traditional: "Processing trauma/emotions",
      calmMagic: "Expressing what wants to emerge through form"
    },
    {
      traditional: "Individual healing journey",
      calmMagic: "Relational field including inner parts, others, and creative work"
    },
    {
      traditional: "Fixed therapeutic goals",
      calmMagic: "Expanding Window of Tolerance through embodied practice"
    },
    {
      traditional: "Talk-based or cognitive",
      calmMagic: "Multi-modal: voice, sketch, movement, writing, dialogue"
    },
    {
      traditional: "Problem → Solution",
      calmMagic: "Sensing → Exploring → Embodying (poiesis cycle)"
    }
  ]
};

export interface EmergenceStage {
  id: string;
  name: string;
  icon: string;
  description: string;
  bodyQuestion: string;
}

export const EMERGENCE_NAVIGATION: EmergenceStage[] = [
  {
    id: 'sensing',
    name: 'Sensing',
    icon: '👁️',
    description: "What's arising in the field?",
    bodyQuestion: "Where do I feel this in my body?"
  },
  {
    id: 'exploring',
    name: 'Exploring',
    icon: '🌊',
    description: "Dancing with possibility",
    bodyQuestion: "What wants to move or be expressed?"
  },
  {
    id: 'embodying',
    name: 'Embodying',
    icon: '✨',
    description: "Giving form to emergence",
    bodyQuestion: "What form wants to hold this knowing?"
  }
];

export const COHERENCE_CONCEPT = {
  definition: "Coherence = Safety + Presence",
  explanation: "When we feel safe enough to be present with what is, coherence naturally emerges — the parts align, the body settles, and creative expression flows.",
  contrast: "Safety without presence is dissociation. Presence without safety is overwhelm. Coherence is their union."
};
