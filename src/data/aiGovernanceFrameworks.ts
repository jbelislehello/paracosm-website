// Trending AI Governance Frameworks 2024/2025
// Cross-referenced with OECD AI Principles

export interface FrameworkPrinciple {
  id: string;
  name: string;
  description: string;
  oecdPrincipleIds: string[]; // Maps to OECD principle IDs
}

export interface AIGovernanceFramework {
  id: string;
  name: string;
  shortName: string;
  organization: string;
  region: 'global' | 'eu' | 'us' | 'asia' | 'international';
  type: 'regulation' | 'standard' | 'framework' | 'principles';
  status: 'enforced' | 'adopted' | 'draft' | 'voluntary';
  effectiveDate?: string;
  version: string;
  url: string;
  emoji: string;
  principles: FrameworkPrinciple[];
  riskCategories?: string[];
  governanceLayerMapping: Record<'A' | 'B' | 'C', string[]>;
}

export const AI_GOVERNANCE_FRAMEWORKS: AIGovernanceFramework[] = [
  {
    id: 'eu-ai-act',
    name: 'EU Artificial Intelligence Act',
    shortName: 'EU AI Act',
    organization: 'European Union',
    region: 'eu',
    type: 'regulation',
    status: 'enforced',
    effectiveDate: '2024-08-01',
    version: '2024',
    url: 'https://artificialintelligenceact.eu/',
    emoji: '🇪🇺',
    principles: [
      {
        id: 'eu-art-5',
        name: 'Prohibited AI Practices',
        description: 'Bans AI systems that manipulate behavior, exploit vulnerabilities, or enable social scoring',
        oecdPrincipleIds: ['human-centered', 'fairness']
      },
      {
        id: 'eu-art-6',
        name: 'High-Risk AI Classification',
        description: 'Defines AI systems in critical areas as high-risk requiring strict compliance',
        oecdPrincipleIds: ['safety', 'accountability']
      },
      {
        id: 'eu-art-9',
        name: 'Risk Management System',
        description: 'Requires continuous risk assessment and mitigation throughout AI lifecycle',
        oecdPrincipleIds: ['safety', 'accountability']
      },
      {
        id: 'eu-art-10',
        name: 'Data Governance',
        description: 'Mandates high-quality training data with appropriate governance measures',
        oecdPrincipleIds: ['transparency', 'fairness']
      },
      {
        id: 'eu-art-13',
        name: 'Transparency Requirements',
        description: 'Users must be informed when interacting with AI systems',
        oecdPrincipleIds: ['transparency', 'human-centered']
      },
      {
        id: 'eu-art-14',
        name: 'Human Oversight',
        description: 'High-risk AI must enable human oversight and intervention',
        oecdPrincipleIds: ['human-centered', 'accountability']
      }
    ],
    riskCategories: ['unacceptable', 'high', 'limited', 'minimal'],
    governanceLayerMapping: {
      'A': ['eu-art-5', 'eu-art-14'],
      'B': ['eu-art-9', 'eu-art-10', 'eu-art-13'],
      'C': ['eu-art-6', 'eu-art-9']
    }
  },
  {
    id: 'nist-ai-rmf',
    name: 'NIST AI Risk Management Framework',
    shortName: 'NIST AI RMF',
    organization: 'National Institute of Standards and Technology',
    region: 'us',
    type: 'framework',
    status: 'adopted',
    effectiveDate: '2023-01-26',
    version: '1.0',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    emoji: '🇺🇸',
    principles: [
      {
        id: 'nist-govern',
        name: 'GOVERN',
        description: 'Cultivate a culture of risk management with policies and accountability structures',
        oecdPrincipleIds: ['accountability', 'innovation']
      },
      {
        id: 'nist-map',
        name: 'MAP',
        description: 'Context and risk identification across the AI lifecycle',
        oecdPrincipleIds: ['transparency', 'safety']
      },
      {
        id: 'nist-measure',
        name: 'MEASURE',
        description: 'Employ quantitative and qualitative methods to analyze AI risks',
        oecdPrincipleIds: ['accountability', 'safety']
      },
      {
        id: 'nist-manage',
        name: 'MANAGE',
        description: 'Prioritize and act upon risks based on projected impact',
        oecdPrincipleIds: ['safety', 'accountability']
      }
    ],
    governanceLayerMapping: {
      'A': ['nist-govern'],
      'B': ['nist-map', 'nist-measure'],
      'C': ['nist-manage', 'nist-measure']
    }
  },
  {
    id: 'iso-42001',
    name: 'ISO/IEC 42001:2023 AI Management System',
    shortName: 'ISO 42001',
    organization: 'International Organization for Standardization',
    region: 'international',
    type: 'standard',
    status: 'adopted',
    effectiveDate: '2023-12-18',
    version: '2023',
    url: 'https://www.iso.org/standard/81230.html',
    emoji: '📋',
    principles: [
      {
        id: 'iso-clause4',
        name: 'Context of the Organization',
        description: 'Understanding organizational context and stakeholder needs for AI',
        oecdPrincipleIds: ['inclusive-growth', 'accountability']
      },
      {
        id: 'iso-clause5',
        name: 'Leadership',
        description: 'Top management commitment to AI management system',
        oecdPrincipleIds: ['accountability', 'innovation']
      },
      {
        id: 'iso-clause6',
        name: 'Planning',
        description: 'Risk assessment and treatment planning for AI systems',
        oecdPrincipleIds: ['safety', 'accountability']
      },
      {
        id: 'iso-clause7',
        name: 'Support',
        description: 'Resources, competence, and documented information for AI',
        oecdPrincipleIds: ['innovation', 'transparency']
      },
      {
        id: 'iso-clause8',
        name: 'Operation',
        description: 'Operational planning and control of AI processes',
        oecdPrincipleIds: ['safety', 'transparency']
      },
      {
        id: 'iso-clause9',
        name: 'Performance Evaluation',
        description: 'Monitoring, measurement, analysis and evaluation of AI',
        oecdPrincipleIds: ['accountability', 'transparency']
      }
    ],
    governanceLayerMapping: {
      'A': ['iso-clause4', 'iso-clause5'],
      'B': ['iso-clause6', 'iso-clause7', 'iso-clause8'],
      'C': ['iso-clause8', 'iso-clause9']
    }
  },
  {
    id: 'singapore-mf',
    name: 'Singapore Model AI Governance Framework',
    shortName: 'Singapore AIGF',
    organization: 'Infocomm Media Development Authority',
    region: 'asia',
    type: 'framework',
    status: 'adopted',
    effectiveDate: '2024-01-01',
    version: '2.0',
    url: 'https://www.imda.gov.sg/AI',
    emoji: '🇸🇬',
    principles: [
      {
        id: 'sg-explainability',
        name: 'Explainability',
        description: 'AI decisions should be explainable to affected individuals',
        oecdPrincipleIds: ['transparency', 'human-centered']
      },
      {
        id: 'sg-fairness',
        name: 'Fairness',
        description: 'Prevent and mitigate discriminatory outcomes',
        oecdPrincipleIds: ['fairness', 'human-centered']
      },
      {
        id: 'sg-safety',
        name: 'Human-Centric Safety',
        description: 'AI systems should prioritize human safety and wellbeing',
        oecdPrincipleIds: ['safety', 'human-centered']
      },
      {
        id: 'sg-accountability',
        name: 'Accountability',
        description: 'Clear lines of responsibility for AI decisions',
        oecdPrincipleIds: ['accountability']
      }
    ],
    governanceLayerMapping: {
      'A': ['sg-explainability', 'sg-fairness'],
      'B': ['sg-safety', 'sg-accountability'],
      'C': ['sg-safety']
    }
  },
  {
    id: 'ieee-7000',
    name: 'IEEE 7000 Series',
    shortName: 'IEEE 7000',
    organization: 'Institute of Electrical and Electronics Engineers',
    region: 'international',
    type: 'standard',
    status: 'adopted',
    version: '2021',
    url: 'https://ethicsinaction.ieee.org/',
    emoji: '⚡',
    principles: [
      {
        id: 'ieee-7000',
        name: 'Ethical Design Process',
        description: 'Model process for addressing ethical concerns during system design',
        oecdPrincipleIds: ['human-centered', 'fairness']
      },
      {
        id: 'ieee-7001',
        name: 'Transparency of Autonomous Systems',
        description: 'Measuring and certifying transparency of autonomous systems',
        oecdPrincipleIds: ['transparency']
      },
      {
        id: 'ieee-7010',
        name: 'Wellbeing Assessment',
        description: 'Recommended practice for assessing impact on human wellbeing',
        oecdPrincipleIds: ['human-centered', 'inclusive-growth']
      }
    ],
    governanceLayerMapping: {
      'A': ['ieee-7000', 'ieee-7010'],
      'B': ['ieee-7001'],
      'C': ['ieee-7000']
    }
  },
  {
    id: 'google-saif',
    name: 'Google Secure AI Framework',
    shortName: 'Google SAIF',
    organization: 'Google',
    region: 'global',
    type: 'framework',
    status: 'voluntary',
    effectiveDate: '2023-06-08',
    version: '1.0',
    url: 'https://safety.google/cybersecurity-advancements/saif/',
    emoji: '🔒',
    principles: [
      {
        id: 'saif-foundation',
        name: 'Strong Security Foundations',
        description: 'Expand security foundations to the AI ecosystem',
        oecdPrincipleIds: ['safety', 'security']
      },
      {
        id: 'saif-detection',
        name: 'Detection & Response',
        description: 'Extend detection and response to AI-related threats',
        oecdPrincipleIds: ['safety', 'accountability']
      },
      {
        id: 'saif-automation',
        name: 'Automate Defenses',
        description: 'Use AI to automate and scale security defenses',
        oecdPrincipleIds: ['innovation', 'safety']
      },
      {
        id: 'saif-controls',
        name: 'Harmonize Controls',
        description: 'Harmonize platform-level controls across the AI stack',
        oecdPrincipleIds: ['accountability', 'transparency']
      }
    ],
    governanceLayerMapping: {
      'A': ['saif-controls'],
      'B': ['saif-foundation', 'saif-detection'],
      'C': ['saif-foundation', 'saif-automation']
    }
  }
];

// Helper to get framework by ID
export function getFrameworkById(id: string): AIGovernanceFramework | undefined {
  return AI_GOVERNANCE_FRAMEWORKS.find(f => f.id === id);
}

// Get all frameworks that map to a specific OECD principle
export function getFrameworksByOECDPrinciple(principleId: string): AIGovernanceFramework[] {
  return AI_GOVERNANCE_FRAMEWORKS.filter(f => 
    f.principles.some(p => p.oecdPrincipleIds.includes(principleId))
  );
}

// Get framework principles that map to a governance layer
export function getFrameworkPrinciplesByLayer(
  frameworkId: string, 
  layer: 'A' | 'B' | 'C'
): FrameworkPrinciple[] {
  const framework = getFrameworkById(frameworkId);
  if (!framework) return [];
  
  const principleIds = framework.governanceLayerMapping[layer] || [];
  return framework.principles.filter(p => principleIds.includes(p.id));
}

// Get status badge color
export function getFrameworkStatusColor(status: AIGovernanceFramework['status']): string {
  const colors: Record<typeof status, string> = {
    enforced: 'bg-red-500/20 text-red-400 border-red-500/30',
    adopted: 'bg-green-500/20 text-green-400 border-green-500/30',
    draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    voluntary: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };
  return colors[status];
}
