// 8-Layer Agentic AI Architecture
// Based on the emerging agentic systems framework

export type AgenticLayerKey = 
  | 'infrastructure'
  | 'agent_internet'
  | 'protocol'
  | 'tooling'
  | 'cognition'
  | 'memory'
  | 'application'
  | 'governance';

export interface AgenticLayer {
  id: AgenticLayerKey;
  layer: number;
  name: string;
  shortName: string;
  description: string;
  purpose: string;
  examples: string[];
  calmMagicMapping: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  prdQuestions: string[];
  stackComponents: string[];
  promptHooks: string[];
  color: string;
}

export const AGENTIC_LAYERS: Record<AgenticLayerKey, AgenticLayer> = {
  infrastructure: {
    id: 'infrastructure',
    layer: 1,
    name: 'Infrastructure Layer',
    shortName: 'Infra',
    description: 'Cloud, hardware, foundational services that power the agentic system',
    purpose: 'Provide the compute, storage, and networking foundation for all agent operations',
    examples: ['AWS', 'GCP', 'Azure', 'Cloudflare', 'Supabase', 'Vercel', 'Railway'],
    calmMagicMapping: 'POLLENS',
    prdQuestions: [
      'What infrastructure constraints exist (on-prem vs cloud vs hybrid)?',
      'What are the latency and uptime requirements?',
      'What regions/data residency requirements apply?',
      'What scale is expected (users, requests, data volume)?'
    ],
    stackComponents: ['Cloud provider', 'CDN', 'Database hosting', 'Edge compute'],
    promptHooks: ['deployment_context', 'scale_parameters', 'regional_constraints'],
    color: 'hsl(var(--chart-1))'
  },
  
  agent_internet: {
    id: 'agent_internet',
    layer: 2,
    name: 'Agent Internet Layer',
    shortName: 'A2A Net',
    description: 'Inter-agent communication, discovery, and coordination infrastructure',
    purpose: 'Enable agents to find, authenticate, and communicate with each other',
    examples: ['MCP (Model Context Protocol)', 'A2A Protocol', 'Agent Registry', 'Capability Discovery'],
    calmMagicMapping: 'NOEMS',
    prdQuestions: [
      'Will agents need to communicate with external agents?',
      'What agent discovery mechanisms are needed?',
      'How will agent identity and trust be established?',
      'What inter-agent message formats will be used?'
    ],
    stackComponents: ['MCP Server', 'Agent Registry', 'Capability Broker', 'Trust Network'],
    promptHooks: ['peer_agents', 'discovery_protocol', 'inter_agent_auth'],
    color: 'hsl(var(--chart-2))'
  },
  
  protocol: {
    id: 'protocol',
    layer: 3,
    name: 'Protocol Layer',
    shortName: 'Protocol',
    description: 'Communication standards and message formats for agent-to-agent interaction',
    purpose: 'Standardize how agents exchange information, capabilities, and requests',
    examples: ['A2A', 'Agent Card', 'Capability Schemas', 'Task Protocols', 'Negotiation Patterns'],
    calmMagicMapping: 'TOTEMS',
    prdQuestions: [
      'What communication protocols will agents use?',
      'How will task delegation and handoffs work?',
      'What capability negotiation patterns are needed?',
      'How will agents handle protocol version mismatches?'
    ],
    stackComponents: ['Protocol Handler', 'Message Router', 'Capability Schema', 'Task Queue'],
    promptHooks: ['communication_style', 'handoff_behavior', 'negotiation_rules'],
    color: 'hsl(var(--chart-3))'
  },
  
  tooling: {
    id: 'tooling',
    layer: 4,
    name: 'Tooling Layer',
    shortName: 'Tools',
    description: 'External integrations, APIs, and capabilities that agents can invoke',
    purpose: 'Extend agent capabilities through external tools, APIs, and services',
    examples: ['Web Search', 'Code Execution', 'File I/O', 'Database Access', 'Email', 'Calendar', 'Slack'],
    calmMagicMapping: 'POEMS',
    prdQuestions: [
      'What external tools/APIs do agents need access to?',
      'What permissions and rate limits apply to each tool?',
      'How will tool invocation be logged and audited?',
      'What fallback behaviors exist when tools fail?'
    ],
    stackComponents: ['Tool Registry', 'API Gateways', 'OAuth Handlers', 'Rate Limiters'],
    promptHooks: ['available_tools', 'tool_usage_rules', 'api_permissions'],
    color: 'hsl(var(--chart-4))'
  },
  
  cognition: {
    id: 'cognition',
    layer: 5,
    name: 'Cognition Layer',
    shortName: 'AI/ML',
    description: 'AI models, reasoning engines, and intelligence that power agent decision-making',
    purpose: 'Provide the intelligence substrate for understanding, reasoning, and generating',
    examples: ['GPT-5', 'Claude', 'Gemini', 'Llama', 'Embedding Models', 'Vision Models', 'Reasoning Engines'],
    calmMagicMapping: 'NOEMS',
    prdQuestions: [
      'What AI models will power agent reasoning?',
      'What specialized capabilities are needed (vision, code, reasoning)?',
      'How will model selection/routing work?',
      'What cost/latency tradeoffs are acceptable?'
    ],
    stackComponents: ['LLM Provider', 'Embedding Service', 'Reasoning Engine', 'Model Router'],
    promptHooks: ['reasoning_approach', 'model_capabilities', 'intelligence_boundaries'],
    color: 'hsl(var(--chart-5))'
  },
  
  memory: {
    id: 'memory',
    layer: 6,
    name: 'Memory Layer',
    shortName: 'Memory',
    description: 'Short-term and long-term persistence for agent state, context, and learning',
    purpose: 'Enable agents to remember, learn, and maintain context across interactions',
    examples: ['Vector DB', 'Conversation History', 'User Preferences', 'Knowledge Base', 'RAG Pipeline'],
    calmMagicMapping: 'POEMS',
    prdQuestions: [
      'What needs to be remembered short-term vs long-term?',
      'How will context window limitations be handled?',
      'What knowledge bases will agents access?',
      'How will memory be updated and garbage collected?'
    ],
    stackComponents: ['Vector Database', 'Session Store', 'Knowledge Graph', 'RAG Pipeline'],
    promptHooks: ['memory_strategy', 'context_management', 'knowledge_sources'],
    color: 'hsl(var(--primary))'
  },
  
  application: {
    id: 'application',
    layer: 7,
    name: 'Application Layer',
    shortName: 'App',
    description: 'User-facing interfaces, experiences, and interaction surfaces',
    purpose: 'Present agent capabilities through intuitive, accessible interfaces',
    examples: ['Chat UI', 'Dashboard', 'CLI', 'API', 'Mobile App', 'Voice Interface', 'Embedded Widget'],
    calmMagicMapping: 'ANTHEMS',
    prdQuestions: [
      'What interfaces will users interact through?',
      'How will agent responses be presented?',
      'What feedback mechanisms exist for users?',
      'How will accessibility be ensured?'
    ],
    stackComponents: ['Web Frontend', 'Mobile App', 'API Gateway', 'WebSocket Server'],
    promptHooks: ['presentation_style', 'user_interaction_patterns', 'accessibility_rules'],
    color: 'hsl(var(--secondary))'
  },
  
  governance: {
    id: 'governance',
    layer: 8,
    name: 'Governance Layer',
    shortName: 'Gov',
    description: 'Policies, ethics, auditing, and oversight for agent behavior',
    purpose: 'Ensure agents operate within defined ethical, legal, and organizational boundaries',
    examples: ['Policy Engine', 'Audit Logs', 'Compliance Checks', 'Human-in-Loop', 'Rate Limits', 'Content Filters'],
    calmMagicMapping: 'TOTEMS',
    prdQuestions: [
      'What ethical guardrails must agents respect?',
      'What compliance requirements apply (GDPR, HIPAA, etc.)?',
      'When is human oversight required?',
      'How will agent decisions be audited and explained?'
    ],
    stackComponents: ['Policy Engine', 'Audit Service', 'Compliance Checker', 'Override Controls'],
    promptHooks: ['ethical_constraints', 'compliance_rules', 'human_oversight_triggers'],
    color: 'hsl(var(--destructive))'
  }
};

export const LAYER_ORDER: AgenticLayerKey[] = [
  'infrastructure',
  'agent_internet', 
  'protocol',
  'tooling',
  'cognition',
  'memory',
  'application',
  'governance'
];

// Mapping from PRD layers to agentic layers
export const PRD_TO_AGENTIC_MAPPING: Record<string, AgenticLayerKey[]> = {
  POLLENS: ['infrastructure', 'governance'],
  NOEMS: ['cognition', 'agent_internet'],
  POEMS: ['tooling', 'memory'],
  TOTEMS: ['protocol', 'governance'],
  ANTHEMS: ['application', 'infrastructure']
};

// Get agentic layers for a given PRD layer
export const getAgenticLayersForPrd = (prdLayer: string): AgenticLayer[] => {
  const layerKeys = PRD_TO_AGENTIC_MAPPING[prdLayer] || [];
  return layerKeys.map(key => AGENTIC_LAYERS[key]);
};

// Get all layers as ordered array
export const getOrderedAgenticLayers = (): AgenticLayer[] => {
  return LAYER_ORDER.map(key => AGENTIC_LAYERS[key]);
};

// Generate agentic architecture prompt section
export const generateAgenticArchitecturePrompt = (
  activeLayerIds: AgenticLayerKey[],
  constraints: Record<string, string>
): string => {
  const activeLayers = activeLayerIds.map(id => AGENTIC_LAYERS[id]);
  
  let prompt = `# Agentic Architecture Awareness

## Active Layers (${activeLayers.length}/8)
${activeLayers.map(l => `- **Layer ${l.layer} - ${l.name}**: ${l.purpose}`).join('\n')}

## Layer Communication Patterns
`;

  // Add communication hints based on which layers are active
  if (activeLayerIds.includes('agent_internet') && activeLayerIds.includes('protocol')) {
    prompt += `- Multi-agent coordination enabled via MCP/A2A protocols\n`;
  }
  if (activeLayerIds.includes('memory') && activeLayerIds.includes('cognition')) {
    prompt += `- RAG-augmented reasoning with persistent memory\n`;
  }
  if (activeLayerIds.includes('tooling')) {
    prompt += `- External tool invocation available with audit logging\n`;
  }
  if (activeLayerIds.includes('governance')) {
    prompt += `- All actions subject to governance policy checks\n`;
  }

  prompt += `
## Memory Strategy
${activeLayerIds.includes('memory') ? 
  '- Short-term: Conversation context (last N messages)\n- Long-term: Vector-indexed knowledge base\n- Session: User preferences and recent decisions' : 
  '- Stateless operation (no persistent memory configured)'}

## Governance Constraints
${constraints.ethical_guardrails || '- To be defined based on domain requirements'}
${constraints.compliance_rules || ''}
${constraints.human_oversight || ''}
`;

  return prompt;
};

// Tech stack structure with 8 layers
export interface AgenticTechStack {
  name: string;
  core_use_cases: string[];
  constraints: {
    data_residency?: string;
    sensitivity?: 'low' | 'medium' | 'high';
    hosting?: 'cloud' | 'on-prem' | 'hybrid';
    latency?: string;
  };
  layers: {
    infrastructure: string[];
    agent_internet: string[];
    protocol: string[];
    tooling: string[];
    cognition: string[];
    memory: string[];
    application: string[];
    governance: string[];
  };
  phase_plan: {
    mvp: string[];
    phase_2: string[];
    phase_3: string[];
  };
  maturity: {
    documentation: 'manual' | 'auto-generated' | 'context-aware' | 'living';
    automation: 'manual' | 'triggered' | 'predictive' | 'self-healing';
    orchestration: 'siloed' | 'connected' | 'coordinated' | 'emergent';
  };
}

export const AGENTIC_TECH_STACK_TEMPLATE: AgenticTechStack = {
  name: "",
  core_use_cases: [],
  constraints: {
    data_residency: "CA",
    sensitivity: "medium",
    hosting: "cloud"
  },
  layers: {
    infrastructure: ["Supabase", "Vercel Edge"],
    agent_internet: [],
    protocol: [],
    tooling: ["Web search", "File I/O"],
    cognition: ["Gemini 2.5 Flash", "Embedding model"],
    memory: ["Postgres", "Vector DB"],
    application: ["Web app", "Chat interface"],
    governance: ["Audit logs", "Rate limiting"]
  },
  phase_plan: {
    mvp: [],
    phase_2: [],
    phase_3: []
  },
  maturity: {
    documentation: 'manual',
    automation: 'manual',
    orchestration: 'siloed'
  }
};
