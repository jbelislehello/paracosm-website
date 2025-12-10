// C-Suite Role Definitions for Executive PRD Perspectives

export interface CSuiteRole {
  id: 'ceo' | 'cfo' | 'cto';
  title: string;
  emoji: string;
  color: string;
  keyQuestion: string;
  focus: string;
  description: string;
  relevantDimensions: string[];
  relevantLensCategories: string[];
  relevantLayers: string[];
  healthMetrics: { id: string; name: string; weight: number }[];
  actionVerbs: string[];
}

export const C_SUITE_ROLES: CSuiteRole[] = [
  {
    id: 'ceo',
    title: 'CEO',
    emoji: '👔',
    color: 'purple',
    keyQuestion: "Is the organization learning and transforming without losing itself?",
    focus: "Strategic Alignment & Cultural Coherence",
    description: "The CEO sees the PRD as an infrastructure of cognitive governance — aligning strategy, culture, and transformation toward Preferable Futures.",
    relevantDimensions: ['ontological', 'relational', 'temporal', 'ethical', 'ecological'],
    relevantLensCategories: ['relational', 'systems'],
    relevantLayers: ['POLLENS', 'ANTHEMS'],
    healthMetrics: [
      { id: 'vision_coherence', name: 'Vision-Reality Coherence', weight: 0.35 },
      { id: 'cultural_vitality', name: 'Cultural Vitality', weight: 0.35 },
      { id: 'transformation_capacity', name: 'Transformation Capacity', weight: 0.30 }
    ],
    actionVerbs: ['Align', 'Transform', 'Inspire', 'Govern']
  },
  {
    id: 'cfo',
    title: 'CFO',
    emoji: '💰',
    color: 'green',
    keyQuestion: "Is the investment traceable and the value flow predictable?",
    focus: "Financial Governance & Trust Infrastructure",
    description: "The CFO sees the PRD as a traceability system — ensuring investment clarity, risk visibility, and sustainable value creation.",
    relevantDimensions: ['ontological', 'temporal', 'ethical', 'ecological'],
    relevantLensCategories: ['cognitive', 'systems'],
    relevantLayers: ['TOTEMS', 'ANTHEMS'],
    healthMetrics: [
      { id: 'investment_traceability', name: 'Investment Traceability', weight: 0.40 },
      { id: 'risk_visibility', name: 'Risk Visibility', weight: 0.35 },
      { id: 'value_flow', name: 'Value Flow Clarity', weight: 0.25 }
    ],
    actionVerbs: ['Measure', 'Anticipate', 'Govern', 'Trust']
  },
  {
    id: 'cto',
    title: 'CTO',
    emoji: '🔧',
    color: 'blue',
    keyQuestion: "Is the architecture adaptive and capable of self-regulation?",
    focus: "Technical Coherence & Adaptive Architecture",
    description: "The CTO sees the PRD as a living architecture spec — technical coherence, semantic structure, and adaptive system design.",
    relevantDimensions: ['ontological', 'semantic', 'temporal', 'ecological'],
    relevantLensCategories: ['cognitive', 'aesthetic'],
    relevantLayers: ['NOEMS', 'TOTEMS'],
    healthMetrics: [
      { id: 'architectural_coherence', name: 'Architectural Coherence', weight: 0.40 },
      { id: 'semantic_clarity', name: 'Semantic Clarity', weight: 0.35 },
      { id: 'adaptive_capacity', name: 'Adaptive Capacity', weight: 0.25 }
    ],
    actionVerbs: ['Build', 'Orchestrate', 'Model', 'Evolve']
  }
];

export const getRoleById = (id: string): CSuiteRole | undefined => 
  C_SUITE_ROLES.find(role => role.id === id);

export const ROLE_LAYER_INSIGHTS: Record<string, Record<string, string>> = {
  ceo: {
    POLLENS: "Strategic signals and cultural tensions surfacing from the field",
    NOEMS: "Emerging concepts that could reshape organizational identity",
    POEMS: "Narratives that align teams around shared purpose",
    TOTEMS: "Structural decisions that manifest organizational values",
    ANTHEMS: "Integration patterns that sustain learning culture"
  },
  cfo: {
    POLLENS: "Investment signals and resource allocation tensions",
    NOEMS: "Value hypotheses requiring financial validation",
    POEMS: "Business narratives with measurable outcomes",
    TOTEMS: "Governance structures ensuring accountability",
    ANTHEMS: "Sustainable value creation and risk management"
  },
  cto: {
    POLLENS: "Technical debt signals and architecture tensions",
    NOEMS: "Semantic models and data structure concepts",
    POEMS: "User journey narratives requiring technical support",
    TOTEMS: "System architecture and API design decisions",
    ANTHEMS: "Operational patterns and adaptive infrastructure"
  }
};
