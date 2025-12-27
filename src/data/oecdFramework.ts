// OECD Framework for Classification of AI Systems
// Reference: OECD.AI Policy Observatory

export interface OECDDimension {
  id: string;
  name: string;
  description: string;
  subDimensions: string[];
  governanceLayers: ('A' | 'B' | 'C')[];
  prdSeasons: string[];
}

export interface OECDPrinciple {
  id: string;
  name: string;
  category: 'values' | 'policy';
  description: string;
  governanceLayers: ('A' | 'B' | 'C')[];
}

export interface GovernanceLayer {
  id: 'A' | 'B' | 'C';
  name: string;
  description: string;
  focus: string[];
}

// The 5 OECD Dimensions for AI System Classification
export const OECD_DIMENSIONS: OECDDimension[] = [
  {
    id: 'data-input',
    name: 'Data & Input',
    description: 'Data used for training, sources, collection methods, and input mechanisms',
    subDimensions: ['Training data', 'Input data', 'Data collection', 'Data provenance'],
    governanceLayers: ['B', 'C'],
    prdSeasons: ['POLLENS', 'NOEMS']
  },
  {
    id: 'economic-context',
    name: 'Economic Context',
    description: 'Economic sector, business function, and deployment context',
    subDimensions: ['Sector', 'Business function', 'Critical infrastructure', 'Economic impact'],
    governanceLayers: ['A'],
    prdSeasons: ['ANTHEMS']
  },
  {
    id: 'people-planet',
    name: 'People & Planet',
    description: 'Human oversight, affected stakeholders, and environmental considerations',
    subDimensions: ['Users', 'Affected individuals', 'Human oversight', 'Environmental impact'],
    governanceLayers: ['A', 'B'],
    prdSeasons: ['POLLENS', 'POEMS']
  },
  {
    id: 'ai-model',
    name: 'AI Model',
    description: 'Technical characteristics, model type, and system architecture',
    subDimensions: ['Model type', 'Technical approach', 'Capabilities', 'Limitations'],
    governanceLayers: ['C'],
    prdSeasons: ['TOTEMS']
  },
  {
    id: 'task-output',
    name: 'Task & Output',
    description: 'Functions performed, outputs generated, and level of autonomy',
    subDimensions: ['Task type', 'Autonomy level', 'Output type', 'Decision scope'],
    governanceLayers: ['B', 'C'],
    prdSeasons: ['POEMS', 'TOTEMS']
  }
];

// The 10 OECD AI Principles
export const OECD_PRINCIPLES: OECDPrinciple[] = [
  // Values-based principles (5)
  {
    id: 'inclusive-growth',
    name: 'Inclusive Growth & Sustainable Development',
    category: 'values',
    description: 'AI should benefit people and the planet, driving inclusive growth and sustainable development',
    governanceLayers: ['A']
  },
  {
    id: 'human-values',
    name: 'Human-Centered Values & Fairness',
    category: 'values',
    description: 'AI systems should respect human rights, democratic values, diversity, and fairness',
    governanceLayers: ['A', 'B']
  },
  {
    id: 'transparency',
    name: 'Transparency & Explainability',
    category: 'values',
    description: 'There should be transparency about AI systems to foster understanding and enable challenges',
    governanceLayers: ['B', 'C']
  },
  {
    id: 'robustness',
    name: 'Robustness, Security & Safety',
    category: 'values',
    description: 'AI systems should function appropriately, be secure, and not pose unreasonable safety risks',
    governanceLayers: ['C']
  },
  {
    id: 'accountability',
    name: 'Accountability',
    category: 'values',
    description: 'Organizations and individuals should be accountable for AI systems they develop and operate',
    governanceLayers: ['A', 'B']
  },
  // Policy recommendations (5)
  {
    id: 'investment-rd',
    name: 'Investment in AI R&D',
    category: 'policy',
    description: 'Governments should consider long-term public investment in AI research and development',
    governanceLayers: ['A']
  },
  {
    id: 'digital-ecosystem',
    name: 'Digital Ecosystem for AI',
    category: 'policy',
    description: 'Foster accessible digital ecosystems with infrastructure and technologies for AI',
    governanceLayers: ['B', 'C']
  },
  {
    id: 'policy-environment',
    name: 'Policy Environment for AI',
    category: 'policy',
    description: 'Create policy environments that enable transition to AI and responsible deployment',
    governanceLayers: ['A', 'B']
  },
  {
    id: 'capacity-building',
    name: 'Human Capacity & Labor Transition',
    category: 'policy',
    description: 'Support human capacity building and labor market transitions affected by AI',
    governanceLayers: ['A']
  },
  {
    id: 'international-cooperation',
    name: 'International Cooperation',
    category: 'policy',
    description: 'Promote international cooperation for trustworthy AI development and use',
    governanceLayers: ['A']
  }
];

// Governance Layers (A, B, C)
export const GOVERNANCE_LAYERS: GovernanceLayer[] = [
  {
    id: 'A',
    name: 'Environmental Layer',
    description: 'Societal context, regulations, ethical frameworks, and stakeholder impact',
    focus: ['Policy', 'Ethics', 'Society', 'Environment', 'Stakeholders']
  },
  {
    id: 'B',
    name: 'Governance Layer',
    description: 'Organizational processes, oversight mechanisms, and operational controls',
    focus: ['Processes', 'Oversight', 'Controls', 'Documentation', 'Compliance']
  },
  {
    id: 'C',
    name: 'AI Systems Layer',
    description: 'Technical implementation, model architecture, and data infrastructure',
    focus: ['Models', 'Data', 'Infrastructure', 'Security', 'Performance']
  }
];

// Mapping between OECD dimensions and PRD seasons
export const OECD_TO_PRD_MAPPING: Record<string, string[]> = {
  'data-input': ['POLLENS', 'NOEMS'],
  'economic-context': ['ANTHEMS'],
  'people-planet': ['POLLENS', 'POEMS'],
  'ai-model': ['TOTEMS'],
  'task-output': ['POEMS', 'TOTEMS']
};

// Mapping between Governance Layers and PRD seasons
export const GOVERNANCE_TO_PRD_MAPPING: Record<'A' | 'B' | 'C', string[]> = {
  'A': ['POLLENS', 'ANTHEMS'],
  'B': ['NOEMS', 'POEMS'],
  'C': ['TOTEMS']
};

// Gardens that support framework validation
export const FRAMEWORK_ELIGIBLE_GARDENS = ['systems'] as const;
export type FrameworkEligibleGarden = typeof FRAMEWORK_ELIGIBLE_GARDENS[number];

export function isFrameworkEligibleGarden(garden: string): garden is FrameworkEligibleGarden {
  return FRAMEWORK_ELIGIBLE_GARDENS.includes(garden as FrameworkEligibleGarden);
}
