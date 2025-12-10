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
