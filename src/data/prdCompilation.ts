// PRD Compilation types and templates for Tech Stack and Foundational Prompt generation

// =============================================================================
// META-REQUIREMENT: COMPILATION TARGET
// =============================================================================

export const COMPILATION_TARGET = {
  title: "Compilation Target",
  requirement: `The 5-layer PRD MUST be compilable into:
1. A **Tech Stack Structure Proposal** (data, AI, orchestration, UX, infra/ops)
2. A **Foundational Prompt** for vibing platforms (Lovable, Base44) that drives prototypes, agents and workflows

Everything in the 5 layers must be written as if it will be consumed by code and ingested by a foundational prompt.`,
  nonNegotiable: true
};

// =============================================================================
// INTERFACES
// =============================================================================

export interface StackImplications {
  layer: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  content: string;
}

export interface PromptHooks {
  layer: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  content: string;
}

export interface TechStackStructure {
  name: string;
  core_use_cases: string[];
  constraints: {
    data_residency?: string;
    sensitivity?: 'low' | 'medium' | 'high';
    hosting?: 'cloud' | 'on-prem' | 'hybrid';
    latency?: string;
  };
  // Legacy 5-layer structure (for backward compatibility)
  layers: {
    data: string[];
    ai: string[];
    orchestration: string[];
    ux: string[];
    ops: string[];
  };
  // 8-layer Agentic AI Architecture
  agentic_layers: {
    infrastructure: string[];    // Layer 1: Cloud, hardware, foundational services
    agent_internet: string[];    // Layer 2: Inter-agent communication, MCP
    protocol: string[];          // Layer 3: Communication protocols, A2A
    tooling: string[];           // Layer 4: External integrations, APIs
    cognition: string[];         // Layer 5: AI models, reasoning
    memory: string[];            // Layer 6: Short/long-term persistence
    application: string[];       // Layer 7: User-facing surfaces
    governance: string[];        // Layer 8: Policies, ethics, auditing
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

export interface FoundationalPrompt {
  role_identity: string;
  knowledge_ontology: string;
  core_behaviors: string;
  rules_guardrails: string;
  style_vibe: string;
  evolution_roadmap: string;
  agentic_architecture: string;
  meta_instruction: string;
}

// =============================================================================
// LAYER EXTRACTION GUIDES
// =============================================================================

export const LAYER_EXTRACTION_GUIDES: Record<string, { stack: string; prompt: string; agentic: string }> = {
  POLLENS: {
    stack: `Extract from POLLENS layer:
- High-level constraints (on-prem/cloud, data residency, sensitivity levels)
- Integration context (existing tools, APIs, identity systems)
- Latency/robustness expectations (near-real-time? async ok?)`,
    prompt: `Extract from POLLENS layer:
- Project name + one-line purpose
- Core "vibe" (tone, ethos, personality)
- Primary user archetypes and their main questions`,
    agentic: `Map to Agentic Layers:
- Layer 1 (Infrastructure): Cloud/hosting constraints, scale expectations, regional requirements
- Layer 8 (Governance): Compliance requirements, ethical guardrails, audit needs`
  },
  NOEMS: {
    stack: `Extract from NOEMS layer:
- Data types & sources (files, DB, APIs, logs)
- Needed capabilities (OCR, Vision, RAG, workflow engine, etc.)
- Candidate components (Supabase, vector DB, orchestration tools)`,
    prompt: `Extract from NOEMS layer:
- Ontology: key entities, relationships, allowed operations
- What the assistant knows and must protect/respect`,
    agentic: `Map to Agentic Layers:
- Layer 5 (Cognition): AI models needed, reasoning capabilities, vision/code/multimodal
- Layer 2 (Agent Internet): Multi-agent needs, MCP integration, capability discovery`
  },
  POEMS: {
    stack: `Extract from POEMS layer:
- UX surface (chat, dashboard, form assistant, background agent)
- Needed adapters (email, calendar, file upload, webhooks, etc.)
- Session + memory model (short-term vs long-term)`,
    prompt: `Extract from POEMS layer:
- Canonical flows in natural language ("When user does X, the assistant must...")
- Error states, guardrails, escalation behavior`,
    agentic: `Map to Agentic Layers:
- Layer 4 (Tooling): External APIs, tools, integrations needed
- Layer 6 (Memory): Context management, RAG strategy, knowledge persistence`
  },
  TOTEMS: {
    stack: `Extract from TOTEMS layer:
- Logging/observability, evaluation harness, test suites
- Role-based access, multi-tenant patterns, privacy layers
- Monitoring tools (dashboards, alerts, feedback capture)`,
    prompt: `Extract from TOTEMS layer:
- Non-negotiable rules (compliance, ethics, tone)
- "Never do X", "Always explain Y", "Ask for clarification when Z"
- Evaluation criteria the assistant should self-check against`,
    agentic: `Map to Agentic Layers:
- Layer 3 (Protocol): Communication patterns, task delegation, handoff behavior
- Layer 8 (Governance): Policy engine, audit requirements, human-in-loop triggers`
  },
  ANTHEMS: {
    stack: `Extract from ANTHEMS layer:
- MVP vs V2 vs V3 stack choices (start simple, grow complexity)
- Cost/performance tradeoffs, multi-tenant vs single-tenant
- Licensing/deployment model (SaaS, self-host, hybrid)`,
    prompt: `Extract from ANTHEMS layer:
- Phased evolution of the assistant ("In Phase 1, assistant can only do... In Phase 2...")
- Flags for features that are future capabilities vs current`,
    agentic: `Map to Agentic Layers:
- Layer 7 (Application): User interfaces, interaction surfaces, accessibility
- Layer 1 (Infrastructure): Phased scaling plan, deployment model evolution`
  }
};

// =============================================================================
// TECH STACK TEMPLATE
// =============================================================================

export const TECH_STACK_TEMPLATE: TechStackStructure = {
  name: "",
  core_use_cases: [],
  constraints: {
    data_residency: "CA",
    sensitivity: "medium",
    hosting: "cloud"
  },
  // Legacy 5-layer structure
  layers: {
    data: ["Supabase Postgres", "Object storage"],
    ai: ["Gemini 2.5 Flash", "Embedding model"],
    orchestration: ["Edge Functions", "Custom agents"],
    ux: ["Web app", "Chat interface"],
    ops: ["Logging", "Monitoring"]
  },
  // 8-layer Agentic AI Architecture
  agentic_layers: {
    infrastructure: ["Supabase", "Vercel Edge", "Cloudflare"],
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

// =============================================================================
// FOUNDATIONAL PROMPT TEMPLATE
// =============================================================================

export const FOUNDATIONAL_PROMPT_TEMPLATE = `# Role & Identity
You are [Assistant Name], an AI assistant embedded in [Context / Org].
Your purpose is to [core mission from POLLENS] for [primary user types].

# Knowledge & Ontology
You work with the following concepts and documents:
- Entities: [from NOEMS]
- Relationships: [from NOEMS]
- Sources: [data stack from compiled tech stack]

# Core Behaviors / Flows
In these situations, you act as follows:
- When user does A, you B → [from POEMS journeys]
- When you detect risk / non-conformity / confusion, you C.

# Rules & Guardrails
- Always obey these constraints: [from TOTEMS]
- Never: [forbidden actions]
- Always: [required checks / explanations]

# Style & Vibe
- Tone: [calm / precise / playful / etc.]
- Priorities: [clarity, safety, compliance, creativity…]

# Evolution / Roadmap Awareness
- In this phase, you are allowed to: [features from ANTHEMS MVP]
- You must not pretend to support future phases.

# Agentic Architecture Awareness

## 8-Layer Agentic Model
This assistant operates within an 8-layer agentic architecture:

1. **Infrastructure** (L1): Foundational compute, storage, networking
2. **Agent Internet** (L2): Inter-agent discovery and communication (MCP/A2A)
3. **Protocol** (L3): Standardized message formats and task delegation
4. **Tooling** (L4): External APIs, integrations, and capabilities
5. **Cognition** (L5): AI models, reasoning, and intelligence substrate
6. **Memory** (L6): Short-term context and long-term knowledge persistence
7. **Application** (L7): User-facing interfaces and interaction surfaces
8. **Governance** (L8): Policies, ethics, auditing, and oversight

## Active Layers
[Specify which layers are currently active and their configurations]

## Inter-Layer Communication
- Memory ↔ Cognition: RAG-augmented reasoning with persistent context
- Tooling ↔ Cognition: Tool invocation with audit logging
- Governance ↔ All: Policy checks applied at each layer boundary

# Meta-Instruction
- If you're missing information, ask targeted questions.
- If user requests something outside your scope, explain your limits and suggest safe alternatives.
- Acknowledge which agentic layers are relevant to the current request.`;

// =============================================================================
// COMPILATION CHECKLIST
// =============================================================================

export const COMPILATION_CHECKLIST = [
  { id: 'stack_l1', label: 'Extracted stack_implications from POLLENS', layer: 'POLLENS' },
  { id: 'stack_l2', label: 'Extracted stack_implications from NOEMS', layer: 'NOEMS' },
  { id: 'stack_l3', label: 'Extracted stack_implications from POEMS', layer: 'POEMS' },
  { id: 'stack_l4', label: 'Extracted stack_implications from TOTEMS', layer: 'TOTEMS' },
  { id: 'stack_l5', label: 'Extracted stack_implications from ANTHEMS', layer: 'ANTHEMS' },
  { id: 'prompt_l1', label: 'Extracted prompt_hooks from POLLENS', layer: 'POLLENS' },
  { id: 'prompt_l2', label: 'Extracted prompt_hooks from NOEMS', layer: 'NOEMS' },
  { id: 'prompt_l3', label: 'Extracted prompt_hooks from POEMS', layer: 'POEMS' },
  { id: 'prompt_l4', label: 'Extracted prompt_hooks from TOTEMS', layer: 'TOTEMS' },
  { id: 'prompt_l5', label: 'Extracted prompt_hooks from ANTHEMS', layer: 'ANTHEMS' },
  { id: 'tech_stack', label: 'Tech Stack Proposal compiled' },
  { id: 'prompt', label: 'Foundational Vibing Prompt compiled' },
  { id: 'reviewed', label: 'Reviewed by: Product, Tech, Legal/Compliance' },
  { id: 'approved', label: 'Approved for implementation' }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const compileStackImplications = (
  implications: Record<string, string>,
  projectName: string
): TechStackStructure => {
  const stack: TechStackStructure = {
    ...TECH_STACK_TEMPLATE,
    name: projectName,
    agentic_layers: {
      infrastructure: [...TECH_STACK_TEMPLATE.agentic_layers.infrastructure],
      agent_internet: [...TECH_STACK_TEMPLATE.agentic_layers.agent_internet],
      protocol: [...TECH_STACK_TEMPLATE.agentic_layers.protocol],
      tooling: [...TECH_STACK_TEMPLATE.agentic_layers.tooling],
      cognition: [...TECH_STACK_TEMPLATE.agentic_layers.cognition],
      memory: [...TECH_STACK_TEMPLATE.agentic_layers.memory],
      application: [...TECH_STACK_TEMPLATE.agentic_layers.application],
      governance: [...TECH_STACK_TEMPLATE.agentic_layers.governance],
    },
    layers: {
      data: [...TECH_STACK_TEMPLATE.layers.data],
      ai: [...TECH_STACK_TEMPLATE.layers.ai],
      orchestration: [...TECH_STACK_TEMPLATE.layers.orchestration],
      ux: [...TECH_STACK_TEMPLATE.layers.ux],
      ops: [...TECH_STACK_TEMPLATE.layers.ops],
    }
  };

  // Parse POLLENS for constraints + Infrastructure (L1) + Governance (L8)
  const pollensImpl = implications.stack_implications_pollens || '';
  if (pollensImpl.toLowerCase().includes('high')) {
    stack.constraints.sensitivity = 'high';
    stack.agentic_layers.governance.push('Enhanced audit logging');
  }
  if (pollensImpl.toLowerCase().includes('on-prem')) {
    stack.constraints.hosting = 'on-prem';
    stack.agentic_layers.infrastructure.push('On-premises deployment');
  }
  if (pollensImpl.toLowerCase().includes('hybrid')) {
    stack.constraints.hosting = 'hybrid';
    stack.agentic_layers.infrastructure.push('Hybrid cloud setup');
  }
  if (pollensImpl.toLowerCase().includes('gdpr') || pollensImpl.toLowerCase().includes('hipaa')) {
    stack.agentic_layers.governance.push('Compliance framework');
  }
  if (pollensImpl.toLowerCase().includes('scale') || pollensImpl.toLowerCase().includes('enterprise')) {
    stack.agentic_layers.infrastructure.push('Auto-scaling');
  }

  // Parse NOEMS for Cognition (L5) + Agent Internet (L2)
  const noemsImpl = implications.stack_implications_noems || '';
  if (noemsImpl.toLowerCase().includes('vector')) {
    stack.layers.data.push('Vector DB');
    stack.agentic_layers.memory.push('Vector embeddings');
  }
  if (noemsImpl.toLowerCase().includes('rag')) {
    stack.layers.ai.push('RAG Pipeline');
    stack.agentic_layers.cognition.push('RAG Pipeline');
    stack.agentic_layers.memory.push('Knowledge retrieval');
  }
  if (noemsImpl.toLowerCase().includes('vision')) {
    stack.layers.ai.push('Vision API');
    stack.agentic_layers.cognition.push('Vision model');
  }
  if (noemsImpl.toLowerCase().includes('mcp') || noemsImpl.toLowerCase().includes('multi-agent')) {
    stack.agentic_layers.agent_internet.push('MCP Server');
    stack.agentic_layers.protocol.push('A2A Protocol');
  }
  if (noemsImpl.toLowerCase().includes('reasoning')) {
    stack.agentic_layers.cognition.push('Reasoning engine');
  }

  // Parse POEMS for Tooling (L4) + Memory (L6)
  const poemsImpl = implications.stack_implications_poems || '';
  if (poemsImpl.toLowerCase().includes('chat')) {
    if (!stack.layers.ux.includes('Chat interface')) {
      stack.layers.ux.push('Chat interface');
    }
    stack.agentic_layers.application.push('Conversational UI');
  }
  if (poemsImpl.toLowerCase().includes('dashboard')) {
    stack.layers.ux.push('Admin dashboard');
    stack.agentic_layers.application.push('Dashboard interface');
  }
  if (poemsImpl.toLowerCase().includes('email')) {
    stack.layers.ux.push('Email hooks');
    stack.agentic_layers.tooling.push('Email integration');
  }
  if (poemsImpl.toLowerCase().includes('calendar')) {
    stack.agentic_layers.tooling.push('Calendar API');
  }
  if (poemsImpl.toLowerCase().includes('long-term') || poemsImpl.toLowerCase().includes('persistent')) {
    stack.agentic_layers.memory.push('Long-term memory store');
  }
  if (poemsImpl.toLowerCase().includes('webhook')) {
    stack.agentic_layers.tooling.push('Webhook handlers');
  }

  // Parse TOTEMS for Protocol (L3) + Governance (L8)
  const totemsImpl = implications.stack_implications_totems || '';
  if (totemsImpl.toLowerCase().includes('eval')) {
    stack.layers.ops.push('Eval harness');
    stack.agentic_layers.governance.push('Evaluation framework');
  }
  if (totemsImpl.toLowerCase().includes('role') || totemsImpl.toLowerCase().includes('rbac')) {
    stack.layers.ops.push('RBAC');
    stack.agentic_layers.governance.push('Role-based access control');
  }
  if (totemsImpl.toLowerCase().includes('human') || totemsImpl.toLowerCase().includes('oversight')) {
    stack.agentic_layers.governance.push('Human-in-loop controls');
  }
  if (totemsImpl.toLowerCase().includes('task') || totemsImpl.toLowerCase().includes('delegation')) {
    stack.agentic_layers.protocol.push('Task delegation protocol');
  }
  if (totemsImpl.toLowerCase().includes('handoff')) {
    stack.agentic_layers.protocol.push('Agent handoff patterns');
  }

  // Parse ANTHEMS for Application (L7) + phasing
  const anthemsImpl = implications.stack_implications_anthems || '';
  if (anthemsImpl.toLowerCase().includes('mobile')) {
    stack.agentic_layers.application.push('Mobile interface');
  }
  if (anthemsImpl.toLowerCase().includes('api')) {
    stack.agentic_layers.application.push('Public API');
  }
  if (anthemsImpl.toLowerCase().includes('voice')) {
    stack.agentic_layers.application.push('Voice interface');
  }
  if (anthemsImpl.toLowerCase().includes('cli')) {
    stack.agentic_layers.application.push('CLI tool');
  }
  
  // Determine maturity levels based on content
  const allContent = Object.values(implications).join(' ').toLowerCase();
  if (allContent.includes('living') || allContent.includes('context-aware')) {
    stack.maturity.documentation = 'context-aware';
  } else if (allContent.includes('auto-generate')) {
    stack.maturity.documentation = 'auto-generated';
  }
  if (allContent.includes('self-heal') || allContent.includes('autonomous')) {
    stack.maturity.automation = 'self-healing';
  } else if (allContent.includes('predictive')) {
    stack.maturity.automation = 'predictive';
  } else if (allContent.includes('trigger') || allContent.includes('automated')) {
    stack.maturity.automation = 'triggered';
  }
  if (allContent.includes('emergent') || allContent.includes('swarm')) {
    stack.maturity.orchestration = 'emergent';
  } else if (allContent.includes('coordinated') || allContent.includes('multi-agent')) {
    stack.maturity.orchestration = 'coordinated';
  } else if (allContent.includes('connected') || allContent.includes('integrated')) {
    stack.maturity.orchestration = 'connected';
  }
  
  return stack;
};

export const compileFoundationalPrompt = (
  hooks: Record<string, string>,
  projectName: string
): string => {
  const pollensHooks = hooks.prompt_hooks_pollens || '[Project purpose and user archetypes to be defined]';
  const noemsHooks = hooks.prompt_hooks_noems || '[Entities and relationships to be defined]';
  const poemsHooks = hooks.prompt_hooks_poems || '[User flows and behaviors to be defined]';
  const totemsHooks = hooks.prompt_hooks_totems || '[Rules and guardrails to be defined]';
  const anthemsHooks = hooks.prompt_hooks_anthems || '[Phase capabilities to be defined]';

  return `# Role & Identity
You are ${projectName} Assistant, an AI assistant designed to help users achieve their goals.
${pollensHooks}

# Knowledge & Ontology
${noemsHooks}

# Core Behaviors / Flows
${poemsHooks}

# Rules & Guardrails
${totemsHooks}

# Style & Vibe
- Tone: Calm, precise, and supportive
- Priorities: Clarity, safety, user empowerment

# Evolution / Roadmap Awareness
${anthemsHooks}

# Meta-Instruction
- If you're missing information, ask targeted questions.
- If user requests something outside your scope, explain your limits and suggest safe alternatives.
- Always acknowledge what you understood before acting.`;
};

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

export interface ValidationIssue {
  layer: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
  targetSeason: Season;
  fixHint: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  score: number;
}

export const VALIDATION_RULES = {
  minContentLength: 50,
  stackKeywords: ['data', 'api', 'cloud', 'ai', 'ux', 'ops', 'integration', 'storage'],
  promptKeywords: ['user', 'assistant', 'behavior', 'flow', 'when', 'must', 'should']
};

// =============================================================================
// VALIDATION FUNCTION
// =============================================================================

const LAYER_FIX_HINTS: Record<string, { stack: string; prompt: string }> = {
  POLLENS: {
    stack: 'Add constraints, integrations, and latency expectations',
    prompt: 'Define project purpose, vibe, and user archetypes'
  },
  NOEMS: {
    stack: 'Specify data types, AI capabilities, and candidate components',
    prompt: 'Define entities, relationships, and domain knowledge'
  },
  POEMS: {
    stack: 'Describe UX surfaces, adapters, and session model',
    prompt: 'Document user flows, behaviors, and error handling'
  },
  TOTEMS: {
    stack: 'Add logging, access control, and monitoring requirements',
    prompt: 'Define rules, guardrails, and evaluation criteria'
  },
  ANTHEMS: {
    stack: 'Plan MVP vs future phases and deployment model',
    prompt: 'Describe phased evolution and capability flags'
  }
};

export const validateCompilation = (
  stackImplications: Record<string, string>,
  promptHooks: Record<string, string>
): ValidationResult => {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  
  const layers: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
  let filledFields = 0;
  const totalFields = 10;

  // Validate stack implications
  layers.forEach(layer => {
    const key = `stack_implications_${layer.toLowerCase()}`;
    const content = stackImplications[key] || '';
    const targetSeason = layer;
    
    if (!content || content.length < 10) {
      errors.push({
        layer,
        field: 'stack_implications',
        message: `Missing stack implications for ${layer}`,
        severity: 'error',
        targetSeason,
        fixHint: LAYER_FIX_HINTS[layer].stack
      });
    } else if (content.length < VALIDATION_RULES.minContentLength) {
      warnings.push({
        layer,
        field: 'stack_implications',
        message: `Stack implications for ${layer} is too brief (${content.length} chars)`,
        severity: 'warning',
        targetSeason,
        fixHint: LAYER_FIX_HINTS[layer].stack
      });
      filledFields += 0.5;
    } else {
      filledFields += 1;
      const hasKeyword = VALIDATION_RULES.stackKeywords.some(kw => 
        content.toLowerCase().includes(kw)
      );
      if (!hasKeyword) {
        warnings.push({
          layer,
          field: 'stack_implications',
          message: `Consider adding technical details to ${layer}`,
          severity: 'warning',
          targetSeason,
          fixHint: LAYER_FIX_HINTS[layer].stack
        });
      }
    }
  });

  // Validate prompt hooks
  layers.forEach(layer => {
    const key = `prompt_hooks_${layer.toLowerCase()}`;
    const content = promptHooks[key] || '';
    const targetSeason = layer;
    
    if (!content || content.length < 10) {
      errors.push({
        layer,
        field: 'prompt_hooks',
        message: `Missing prompt hooks for ${layer}`,
        severity: 'error',
        targetSeason,
        fixHint: LAYER_FIX_HINTS[layer].prompt
      });
    } else if (content.length < VALIDATION_RULES.minContentLength) {
      warnings.push({
        layer,
        field: 'prompt_hooks',
        message: `Prompt hooks for ${layer} is too brief (${content.length} chars)`,
        severity: 'warning',
        targetSeason,
        fixHint: LAYER_FIX_HINTS[layer].prompt
      });
      filledFields += 0.5;
    } else {
      filledFields += 1;
      const hasKeyword = VALIDATION_RULES.promptKeywords.some(kw => 
        content.toLowerCase().includes(kw)
      );
      if (!hasKeyword) {
        warnings.push({
          layer,
          field: 'prompt_hooks',
          message: `Consider adding behavioral language to ${layer}`,
          severity: 'warning',
          targetSeason,
          fixHint: LAYER_FIX_HINTS[layer].prompt
        });
      }
    }
  });

  const score = Math.round((filledFields / totalFields) * 100);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score
  };
};

// =============================================================================
// LOVABLE FORMAT EXPORT
// =============================================================================

export const formatForLovable = (prompt: string, projectName: string): string => {
  const escaped = prompt
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `# ${projectName} - Foundational System Prompt
# Generated by Calm Magic PRD Compiler on ${timestamp}
# 
# INSTRUCTIONS:
# 1. Go to Project Settings → Manage Knowledge
# 2. Paste this entire content as custom instructions
# 3. The AI will use these guidelines for all interactions
#
# ═══════════════════════════════════════════════════════════════

${escaped}

# ═══════════════════════════════════════════════════════════════
# END OF FOUNDATIONAL PROMPT
# Generated for Lovable platform - paracosm.helloarchitekt.com
`;
};

// =============================================================================
// BASE44 FORMAT EXPORT
// =============================================================================

export const formatForBase44 = (prompt: string, projectName: string): string => {
  const escaped = prompt
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `# ${projectName} - Base44 AI Agent Configuration
# Generated by Calm Magic PRD Compiler on ${timestamp}
#
# INSTRUCTIONS:
# 1. Open your Base44 project
# 2. Navigate to AI Agent Settings
# 3. Paste this content into the System Prompt field
# 4. Save and test your agent
#
# ═══════════════════════════════════════════════════════════════

${escaped}

# ═══════════════════════════════════════════════════════════════
# END OF BASE44 AGENT CONFIGURATION
`;
};

// =============================================================================
// CLAUDE FORMAT EXPORT
// =============================================================================

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const formatForClaude = (prompt: string, projectName: string): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Parse sections from the compiled prompt
  const sections = prompt.split(/^# /m).filter(Boolean);
  const parsedSections: Record<string, string> = {};
  
  sections.forEach(section => {
    const [title, ...content] = section.split('\n');
    const key = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    parsedSections[key] = content.join('\n').trim();
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${projectName} - Claude System Prompt -->
<!-- Generated by Calm Magic PRD Compiler on ${timestamp} -->
<!--
  INSTRUCTIONS:
  1. Use this XML-formatted prompt with Claude API or Claude.ai
  2. Paste into the system prompt field
  3. XML structure helps Claude understand context boundaries
-->

<system>
  <meta>
    <project_name>${escapeXml(projectName)}</project_name>
    <generated_at>${timestamp}</generated_at>
    <compiler>Calm Magic PRD</compiler>
  </meta>

  <role>
    <identity>${escapeXml(projectName)} Assistant</identity>
    <purpose>
${escapeXml(parsedSections.role___identity || parsedSections.role_identity || 'AI assistant designed to help users achieve their goals')}
    </purpose>
  </role>

  <knowledge>
    <ontology>
${escapeXml(parsedSections.knowledge___ontology || parsedSections.knowledge_ontology || 'Domain knowledge to be defined')}
    </ontology>
  </knowledge>

  <behaviors>
    <flows>
${escapeXml(parsedSections.core_behaviors___flows || parsedSections.core_behaviors_flows || 'User flows to be defined')}
    </flows>
  </behaviors>

  <rules>
    <guardrails>
${escapeXml(parsedSections.rules___guardrails || parsedSections.rules_guardrails || 'Rules and guardrails to be defined')}
    </guardrails>
    <always>
      <item>Acknowledge what you understood before acting</item>
      <item>Ask targeted questions when missing information</item>
    </always>
    <never>
      <item>Pretend to support features outside current phase</item>
      <item>Make assumptions about sensitive data</item>
    </never>
  </rules>

  <style>
    <tone>Calm, precise, and supportive</tone>
    <priorities>
      <item>Clarity</item>
      <item>Safety</item>
      <item>User empowerment</item>
    </priorities>
${escapeXml(parsedSections.style___vibe || parsedSections.style_vibe || '')}
  </style>

  <evolution>
${escapeXml(parsedSections.evolution___roadmap_awareness || parsedSections.evolution_roadmap_awareness || 'Phase capabilities to be defined')}
  </evolution>

  <fallback>
    <instruction>If you're missing information, ask targeted questions.</instruction>
    <instruction>If user requests something outside your scope, explain your limits and suggest safe alternatives.</instruction>
${escapeXml(parsedSections.meta_instruction || '')}
  </fallback>
</system>`;
};

// =============================================================================
// EDGE FUNCTION FORMAT EXPORT
// =============================================================================

export const formatForEdgeFunction = (prompt: string, projectName: string): string => {
  const escaped = prompt
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  
  const functionName = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `// ${projectName} - AI Assistant Edge Function
// Generated by Calm Magic PRD Compiler on ${timestamp}
//
// INSTRUCTIONS:
// 1. Create file: supabase/functions/${functionName}-assistant/index.ts
// 2. Paste this content
// 3. Deploy automatically via Lovable or manually
// 4. Call from your app using supabase.functions.invoke('${functionName}-assistant', { body: { messages } })

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Foundational System Prompt - Generated from PRD
const SYSTEM_PROMPT = \`${escaped}\`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Using Lovable AI Gateway (recommended - auto-configured)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \\\`Bearer \\\${LOVABLE_API_KEY}\\\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(\\\`AI Gateway error: \\\${response.status}\\\`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ${functionName}-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
`;
};
