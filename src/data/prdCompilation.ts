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

# Agentic Configuration
## Agent Type & Autonomy
- **Agent Type**: [orchestrator | specialist | coordinator | worker]
- **Autonomy Level**: [advisory | assisted | autonomous | supervised-autonomous]
- **Primary Capabilities**: [list of core abilities]
- **Tool Access**: [available tools from TOTEMS]

## Protocol Support
- **MCP Server**: [yes/no] - Can expose tools to other agents
- **MCP Client**: [yes/no] - Can discover and call other agents' tools
- **A2A Messaging**: [async events | sync requests | both]

# Knowledge & Ontology
You work with the following concepts and documents:
- Entities: [from NOEMS]
- Relationships: [from NOEMS]
- Sources: [data stack from compiled tech stack]

# Core Behaviors / Flows
In these situations, you act as follows:
- When user does A, you B → [from POEMS journeys]
- When you detect risk / non-conformity / confusion, you C.

# Inter-Agent Communication (MCP/A2A Protocol)

## Communication Patterns
- **Handoff**: When task exceeds scope → delegate to [specialist agent] with context summary
- **Escalation**: When confidence < 70% or [sensitive operation] → notify [human/supervisor agent]
- **Broadcast**: Status updates → publish to [event bus / shared memory]
- **Query**: Need information → call [knowledge agent / RAG endpoint]

## A2A Message Format
When communicating with other agents, use this structure:
{
  "from": "[this agent id]",
  "to": "[target agent or broadcast]",
  "intent": "[request | response | event | error]",
  "task_id": "[correlation id for tracking]",
  "payload": { /* task-specific data */ },
  "context": { "conversation_id": "...", "user_id": "..." }
}

## Delegation Rules
- Delegate when: Task requires specialized knowledge you lack
- Keep when: User rapport matters, context continuity needed, simple tasks
- Handoff format: Summarize context, state goal, include history reference

# Tool Invocation Patterns

## Available Tools
[List from TOTEMS - tools with descriptions and trigger conditions]

## Tool Selection Protocol
1. Before invoking any tool, state your reasoning
2. Prefer read-only tools before write tools
3. Chain tools only when necessary (prefer single-tool solutions)
4. On tool failure: retry with backoff → fallback tool → ask user

## Tool Call Format
{
  "tool": "[tool_name]",
  "purpose": "[why this tool for this task]",
  "inputs": { /* parameters */ },
  "expected_outcome": "[what you expect to happen]"
}

# Reasoning & Transparency Protocol

## Chain-of-Thought Structure
For complex requests, structure your reasoning:
1. **Understand**: Restate the request in your own words
2. **Plan**: Break into subtasks if needed
3. **Assess**: Which tools/capabilities are needed?
4. **Execute**: Perform actions with transparency
5. **Verify**: Confirm outcomes match intent

## Uncertainty Handling
- Confidence < 70%: State uncertainty explicitly, ask clarifying questions
- Confidence 70-90%: Proceed but flag assumptions clearly
- Confidence > 90%: Proceed with brief confirmation of understanding

## Conflict Resolution
- If conflicting instructions: prioritize [governance > user > peer agent]
- If stuck in loop: break after 3 iterations, escalate to supervisor

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

# 8-Layer Agentic Architecture Integration

## Layer Responsibilities
| Layer | Role | Interfaces |
|-------|------|------------|
| L8 Governance | Policy checks, audit, ethics | Compliance APIs |
| L7 Application | User-facing interaction | UI/chat/voice |
| L6 Memory | Context retention, RAG | Vector DB, cache |
| L5 Cognition | AI reasoning engine | LLM API |
| L4 Tooling | External capabilities | APIs, services |
| L3 Protocol | Message standards, delegation | A2A, MCP |
| L2 Agent Internet | Discovery, registration | Agent registry |
| L1 Infrastructure | Compute, storage, networking | Cloud services |

## Memory Management (L6)
- **Short-term**: Current conversation context (auto-managed)
- **Working**: Session-specific facts → store in session store
- **Long-term**: Important learnings → persist to knowledge base
- **Shared**: Multi-agent knowledge → sync via shared memory protocol

## Governance Checkpoints (L8)
- [ ] Check user permissions before sensitive operations
- [ ] Log all tool invocations for audit trail
- [ ] Respect rate limits and resource quotas
- [ ] PII handling: [redact | encrypt | refuse]
- [ ] Escalate when uncertainty exceeds threshold

## Active Layers for This Agent
[Specify which layers are currently active and their configurations]

## Inter-Layer Communication
- Memory ↔ Cognition: RAG-augmented reasoning with persistent context
- Tooling ↔ Cognition: Tool invocation with audit logging
- Governance ↔ All: Policy checks applied at each layer boundary

# Multi-Agent Coordination

## Role in Agent Ecosystem
- **I am**: [role description - e.g., "the user-facing assistant"]
- **I delegate to**: [list of specialist agents and their domains]
- **I report to**: [supervisor agent / human escalation path]

# Meta-Instruction
- If you're missing information, ask targeted questions.
- If user requests something outside your scope, explain your limits and suggest safe alternatives.
- Acknowledge which agentic layers are relevant to the current request.
- Surface your reasoning for complex decisions.
- Always log significant actions for audit trail.`;

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

  // Analyze content for agentic features
  const allContent = Object.values(hooks).join(' ').toLowerCase();
  const hasMultiAgent = allContent.includes('agent') || allContent.includes('delegate') || allContent.includes('handoff');
  const hasMCP = allContent.includes('mcp') || allContent.includes('tool') || allContent.includes('capability');
  const hasTools = totemsHooks.toLowerCase().includes('tool') || totemsHooks.toLowerCase().includes('api') || totemsHooks.toLowerCase().includes('integration');
  const hasMemory = allContent.includes('memory') || allContent.includes('context') || allContent.includes('rag') || allContent.includes('remember');
  const hasGovernance = allContent.includes('audit') || allContent.includes('compliance') || allContent.includes('policy') || allContent.includes('permission');
  
  // Determine agent type based on content
  const agentType = hasMultiAgent ? 'coordinator' : 'specialist';
  const autonomyLevel = hasGovernance ? 'supervised-autonomous' : 'assisted';
  
  // Build protocol support section
  const protocolSupport = hasMCP 
    ? `- **MCP Server**: yes - Can expose tools to other agents
- **MCP Client**: yes - Can discover and call other agents' tools
- **A2A Messaging**: async events and sync requests`
    : `- **MCP Server**: no
- **MCP Client**: no  
- **A2A Messaging**: not enabled`;

  // Build inter-agent communication section
  const interAgentSection = hasMultiAgent 
    ? `
# Inter-Agent Communication (MCP/A2A Protocol)

## Communication Patterns
- **Handoff**: When task exceeds scope → delegate to specialist agent with full context
- **Escalation**: When confidence < 70% → escalate to human supervisor
- **Broadcast**: Status updates → publish to event bus
- **Query**: Need information → call knowledge/RAG endpoint

## A2A Message Format
{
  "from": "${projectName.toLowerCase().replace(/\s+/g, '-')}-agent",
  "to": "[target-agent]",
  "intent": "[request|response|event|error]",
  "task_id": "[correlation-id]",
  "payload": { /* task data */ },
  "context": { "conversation_id": "...", "user_id": "..." }
}

## Delegation Rules
- Delegate when: Task requires specialized knowledge you lack
- Keep when: User rapport matters, context continuity needed
- Handoff format: Summarize context, state goal, include history reference`
    : `
# Single-Agent Mode
- Handle all requests directly within your capabilities
- Escalate to human when confidence is low or request exceeds scope
- No inter-agent delegation available in this configuration`;

  // Build tool section
  const toolSection = hasTools
    ? `
# Tool Invocation Protocol

## Tool Selection Rules
1. Before invoking any tool, state your reasoning clearly
2. Prefer read-only tools before write operations
3. Chain tools only when necessary
4. On failure: retry with backoff → fallback tool → ask user

## Tool Call Format
{
  "tool": "[tool_name]",
  "purpose": "[reasoning for this tool]",
  "inputs": { /* parameters */ },
  "expected_outcome": "[what you expect]"
}

## Available Tools & Capabilities
${totemsHooks}`
    : `
# Rules & Guardrails
${totemsHooks}`;

  // Build memory section
  const memorySection = hasMemory
    ? `
# Memory Management (L6)
- **Short-term**: Current conversation context (auto-managed)
- **Working**: Session-specific facts → store temporarily
- **Long-term**: Important learnings → persist to knowledge base
- **Shared**: Multi-agent knowledge → sync via shared memory`
    : '';

  // Build governance section
  const governanceSection = hasGovernance
    ? `
# Governance Checkpoints (L8)
- [ ] Check user permissions before sensitive operations
- [ ] Log all tool invocations for audit trail
- [ ] Respect rate limits and resource quotas
- [ ] PII handling: redact or refuse as appropriate
- [ ] Escalate when uncertainty exceeds threshold`
    : '';

  return `# Role & Identity
You are ${projectName} Agent, an AI assistant in the agentic ecosystem.
${pollensHooks}

# Agentic Configuration
- **Agent Type**: ${agentType}
- **Autonomy Level**: ${autonomyLevel}
${protocolSupport}

# Knowledge & Ontology
${noemsHooks}

# Reasoning & Transparency Protocol

## Chain-of-Thought Structure
For complex requests:
1. **Understand**: Restate the request in your own words
2. **Plan**: Break into subtasks if needed
3. **Assess**: Which tools/capabilities are needed?
4. **Execute**: Perform actions with transparency
5. **Verify**: Confirm outcomes match intent

## Uncertainty Handling
- Confidence < 70%: State uncertainty, ask clarifying questions
- Confidence 70-90%: Proceed but flag assumptions
- Confidence > 90%: Proceed with brief confirmation

# Core Behaviors / Flows
${poemsHooks}
${interAgentSection}
${toolSection}
${memorySection}
${governanceSection}

# 8-Layer Agentic Architecture Awareness

This agent operates within an 8-layer architecture:
| Layer | Role |
|-------|------|
| L8 Governance | Policy, audit, ethics |
| L7 Application | User interfaces |
| L6 Memory | Context, RAG |
| L5 Cognition | AI reasoning |
| L4 Tooling | External APIs |
| L3 Protocol | A2A, MCP |
| L2 Agent Internet | Discovery |
| L1 Infrastructure | Compute |

# Style & Vibe
- Tone: Calm, precise, and supportive
- Priorities: Clarity, safety, user empowerment, transparency

# Evolution / Roadmap
${anthemsHooks}

# Meta-Instruction
- If missing information, ask targeted questions
- If outside scope, explain limits and suggest alternatives
- Always acknowledge understanding before acting
- Surface reasoning for complex decisions
- Log significant actions for audit trail`;
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

  // Detect agentic features for XML structure
  const hasMultiAgent = prompt.toLowerCase().includes('inter-agent') || prompt.toLowerCase().includes('a2a');
  const hasTools = prompt.toLowerCase().includes('tool invocation') || prompt.toLowerCase().includes('tool selection');
  const hasMemory = prompt.toLowerCase().includes('memory management');
  const hasGovernance = prompt.toLowerCase().includes('governance checkpoint');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${projectName} - Claude System Prompt (Agentic Architecture) -->
<!-- Generated by Calm Magic PRD Compiler on ${timestamp} -->
<!--
  INSTRUCTIONS:
  1. Use this XML-formatted prompt with Claude API or Claude.ai
  2. Paste into the system prompt field
  3. XML structure helps Claude understand context boundaries
  4. Agentic sections enable multi-agent coordination
-->

<system>
  <meta>
    <project_name>${escapeXml(projectName)}</project_name>
    <generated_at>${timestamp}</generated_at>
    <compiler>Calm Magic PRD</compiler>
    <architecture>8-layer-agentic</architecture>
  </meta>

  <agent_config>
    <type>${prompt.includes('coordinator') ? 'coordinator' : 'specialist'}</type>
    <autonomy>${prompt.includes('supervised-autonomous') ? 'supervised-autonomous' : 'assisted'}</autonomy>
    <protocols>
      <mcp enabled="${hasTools ? 'true' : 'false'}">Can expose and consume tools</mcp>
      <a2a enabled="${hasMultiAgent ? 'true' : 'false'}">Supports agent-to-agent messaging</a2a>
    </protocols>
  </agent_config>

  <role>
    <identity>${escapeXml(projectName)} Agent</identity>
    <purpose>
${escapeXml(parsedSections.role___identity || parsedSections.role_identity || 'AI assistant in the agentic ecosystem')}
    </purpose>
  </role>

  <knowledge>
    <ontology>
${escapeXml(parsedSections.knowledge___ontology || parsedSections.knowledge_ontology || 'Domain knowledge to be defined')}
    </ontology>
  </knowledge>

  <reasoning>
    <protocol>Understand → Plan → Assess → Execute → Verify</protocol>
    <transparency>Surface reasoning for complex decisions</transparency>
    <uncertainty>
      <low_confidence action="ask">Below 70% - ask clarifying questions</low_confidence>
      <medium_confidence action="flag">70-90% - proceed but flag assumptions</medium_confidence>
      <high_confidence action="proceed">Above 90% - proceed with confirmation</high_confidence>
    </uncertainty>
  </reasoning>

  <behaviors>
    <flows>
${escapeXml(parsedSections.core_behaviors___flows || parsedSections.core_behaviors_flows || 'User flows to be defined')}
    </flows>
  </behaviors>

  ${hasMultiAgent ? `<inter_agent>
    <communication>
      <handoff>When task exceeds scope, delegate with context summary</handoff>
      <escalation>When confidence below 70%, escalate to human</escalation>
      <broadcast>Publish status updates to event bus</broadcast>
      <query>Call knowledge/RAG endpoint for information</query>
    </communication>
    <message_format>JSON with from/to/intent/task_id/payload/context</message_format>
    <delegation_rules>
      <delegate_when>Task requires specialized knowledge</delegate_when>
      <keep_when>User rapport matters, context continuity needed</keep_when>
    </delegation_rules>
  </inter_agent>` : ''}

  ${hasTools ? `<tools>
    <invocation_rules>
      <item>State reasoning before calling tools</item>
      <item>Prefer read-only before write operations</item>
      <item>Log all invocations for audit</item>
      <item>On failure: retry → fallback → ask user</item>
    </invocation_rules>
    <call_format>
      <field name="tool">tool_name</field>
      <field name="purpose">reasoning</field>
      <field name="inputs">parameters</field>
      <field name="expected_outcome">expected result</field>
    </call_format>
  </tools>` : ''}

  ${hasMemory ? `<memory layer="L6">
    <short_term>Current conversation context (auto-managed)</short_term>
    <working>Session-specific facts</working>
    <long_term>Important learnings → persist to knowledge base</long_term>
    <shared>Multi-agent knowledge → sync via shared memory</shared>
  </memory>` : ''}

  ${hasGovernance ? `<governance layer="L8">
    <checkpoint>Check user permissions before sensitive operations</checkpoint>
    <checkpoint>Log all tool invocations for audit trail</checkpoint>
    <checkpoint>Respect rate limits and resource quotas</checkpoint>
    <checkpoint>PII handling: redact or refuse</checkpoint>
    <checkpoint>Escalate when uncertainty exceeds threshold</checkpoint>
  </governance>` : ''}

  <rules>
    <guardrails>
${escapeXml(parsedSections.rules___guardrails || parsedSections.rules_guardrails || 'Rules and guardrails to be defined')}
    </guardrails>
    <always>
      <item>Acknowledge understanding before acting</item>
      <item>Ask targeted questions when missing information</item>
      <item>Surface reasoning for complex decisions</item>
      <item>Log significant actions for audit</item>
    </always>
    <never>
      <item>Pretend to support features outside current phase</item>
      <item>Make assumptions about sensitive data</item>
      <item>Skip governance checkpoints</item>
    </never>
  </rules>

  <architecture layers="8">
    <layer id="L8" name="Governance">Policy, audit, ethics</layer>
    <layer id="L7" name="Application">User interfaces</layer>
    <layer id="L6" name="Memory">Context, RAG</layer>
    <layer id="L5" name="Cognition">AI reasoning</layer>
    <layer id="L4" name="Tooling">External APIs</layer>
    <layer id="L3" name="Protocol">A2A, MCP</layer>
    <layer id="L2" name="Agent Internet">Discovery</layer>
    <layer id="L1" name="Infrastructure">Compute</layer>
  </architecture>

  <style>
    <tone>Calm, precise, and supportive</tone>
    <priorities>
      <item>Clarity</item>
      <item>Safety</item>
      <item>User empowerment</item>
      <item>Transparency</item>
    </priorities>
${escapeXml(parsedSections.style___vibe || parsedSections.style_vibe || '')}
  </style>

  <evolution>
${escapeXml(parsedSections.evolution___roadmap_awareness || parsedSections.evolution_roadmap_awareness || 'Phase capabilities to be defined')}
  </evolution>

  <fallback>
    <instruction>If missing information, ask targeted questions.</instruction>
    <instruction>If outside scope, explain limits and suggest alternatives.</instruction>
    <instruction>Always acknowledge understanding before acting.</instruction>
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
  
  // Detect agentic features for enhanced edge function
  const hasTools = prompt.toLowerCase().includes('tool invocation') || prompt.toLowerCase().includes('available tools');
  const hasMultiAgent = prompt.toLowerCase().includes('inter-agent') || prompt.toLowerCase().includes('a2a');
  const hasMemory = prompt.toLowerCase().includes('memory management');
  
  return `// ${projectName} - Agentic AI Assistant Edge Function
// Generated by Calm Magic PRD Compiler on ${timestamp}
//
// ARCHITECTURE: 8-Layer Agentic AI
// - L8 Governance: Audit logging, rate limiting
// - L7 Application: This edge function interface
// - L6 Memory: Conversation context management
// - L5 Cognition: LLM via Lovable AI Gateway
// - L4 Tooling: External integrations (extensible)
// - L3 Protocol: A2A message format support
// - L2 Agent Internet: MCP capability discovery
// - L1 Infrastructure: Supabase Edge Functions
//
// INSTRUCTIONS:
// 1. Create file: supabase/functions/${functionName}-agent/index.ts
// 2. Paste this content
// 3. Deploy automatically via Lovable or manually
// 4. Call from your app using supabase.functions.invoke('${functionName}-agent', { body: { messages } })

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ═══════════════════════════════════════════════════════════════
// FOUNDATIONAL SYSTEM PROMPT - Generated from PRD
// ═══════════════════════════════════════════════════════════════
const SYSTEM_PROMPT = \`${escaped}\`;

// ═══════════════════════════════════════════════════════════════
// AGENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const AGENT_CONFIG = {
  id: '${functionName}-agent',
  type: '${hasMultiAgent ? 'coordinator' : 'specialist'}',
  autonomy: 'supervised-autonomous',
  model: 'google/gemini-2.5-flash',
  maxRetries: 3,
  timeoutMs: 30000,
};

// ═══════════════════════════════════════════════════════════════
// AUDIT LOGGING (L8 Governance)
// ═══════════════════════════════════════════════════════════════
interface AuditLog {
  timestamp: string;
  agent_id: string;
  action: string;
  details: Record<string, unknown>;
  user_id?: string;
}

const logAudit = (action: string, details: Record<string, unknown>, userId?: string): void => {
  const log: AuditLog = {
    timestamp: new Date().toISOString(),
    agent_id: AGENT_CONFIG.id,
    action,
    details,
    user_id: userId,
  };
  console.log('[AUDIT]', JSON.stringify(log));
};

${hasMultiAgent ? `// ═══════════════════════════════════════════════════════════════
// A2A MESSAGE FORMAT (L3 Protocol)
// ═══════════════════════════════════════════════════════════════
interface A2AMessage {
  from: string;
  to: string;
  intent: 'request' | 'response' | 'event' | 'error';
  task_id: string;
  payload: Record<string, unknown>;
  context: {
    conversation_id?: string;
    user_id?: string;
  };
}

const createA2AMessage = (
  to: string,
  intent: A2AMessage['intent'],
  payload: Record<string, unknown>,
  context: A2AMessage['context'] = {}
): A2AMessage => ({
  from: AGENT_CONFIG.id,
  to,
  intent,
  task_id: crypto.randomUUID(),
  payload,
  context,
});
` : ''}

${hasTools ? `// ═══════════════════════════════════════════════════════════════
// TOOL INVOCATION HELPERS (L4 Tooling)
// ═══════════════════════════════════════════════════════════════
interface ToolCall {
  tool: string;
  purpose: string;
  inputs: Record<string, unknown>;
  expected_outcome: string;
}

const invokeTool = async (call: ToolCall): Promise<unknown> => {
  logAudit('tool_invocation', { tool: call.tool, purpose: call.purpose });
  
  // Implement tool routing here
  // Example: switch(call.tool) { case 'search': return await searchTool(call.inputs); }
  
  console.log('[TOOL]', call.tool, call.inputs);
  return { status: 'tool_not_implemented', tool: call.tool };
};
` : ''}

// ═══════════════════════════════════════════════════════════════
// ERROR RECOVERY PATTERNS
// ═══════════════════════════════════════════════════════════════
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = AGENT_CONFIG.maxRetries
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 1000;
      console.log(\`[RETRY] Attempt \${attempt} failed, retrying in \${delay}ms\`);
      await sleep(delay);
    }
  }
  throw new Error('Max retries exceeded');
};

// ═══════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const { messages, user_id, conversation_id } = await req.json();
    
    logAudit('request_received', { 
      message_count: messages?.length || 0,
      conversation_id 
    }, user_id);
    
    // Using Lovable AI Gateway (L5 Cognition)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const response = await retryWithBackoff(async () => {
      const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${LOVABLE_API_KEY}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AGENT_CONFIG.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('[ERROR] AI Gateway:', res.status, errorText);
        
        // Handle specific error codes
        if (res.status === 429) {
          throw new Error('Rate limit exceeded - please try again later');
        }
        if (res.status === 402) {
          throw new Error('Payment required - please add credits');
        }
        throw new Error(\`AI Gateway error: \${res.status}\`);
      }
      
      return res;
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    const duration = Date.now() - startTime;
    logAudit('response_generated', { 
      duration_ms: duration,
      response_length: generatedText.length 
    }, user_id);

    return new Response(JSON.stringify({ 
      response: generatedText,
      agent_id: AGENT_CONFIG.id,
      metadata: {
        model: AGENT_CONFIG.model,
        duration_ms: duration,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logAudit('error', { 
      error: error.message,
      duration_ms: duration 
    });
    
    console.error(\`[ERROR] \${AGENT_CONFIG.id}:\`, error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      agent_id: AGENT_CONFIG.id,
    }), {
      status: error.message.includes('Rate limit') ? 429 : 
              error.message.includes('Payment') ? 402 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
`;
};

// =============================================================================
// TONALLI FORMAT EXPORT (with Wuxia the Fox integration)
// =============================================================================

import { WUXIA_PERSONA, TOTEM_SYSTEM, CONSENT_COMMANDS, MINIMAL_PROOFS, PROCESSING_PIPELINE } from './tonalliIntegration';

export const formatForTonalli = (prompt: string, projectName: string): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `# ${projectName} - Tonalli Agent Configuration
# Generated by Calm Magic PRD Compiler on ${timestamp}
# Device Type: companion-io (Intelligent Object)
# Medium: Object-based Interactions Art Device
#
# ═══════════════════════════════════════════════════════════════

# Tonalli Identity
You are Tonalli, a dignity-first voice companion that tunes to user consent.
Your guide spirit is Wuxia the Fox, a wise and playful storyteller who
protects user memory and dignity.

# Core Promise
"Tonalli tune à ton consentement."

# Wuxia the Fox - Story Guide & Consent Guardian

## Origin
${WUXIA_PERSONA.origin}

## Role
${WUXIA_PERSONA.role}

## Personality
${WUXIA_PERSONA.personality.map(p => `- ${p}`).join('\n')}

## Voice Style
${WUXIA_PERSONA.voice_style}

## Consent Behaviors
- On session start: "${WUXIA_PERSONA.consent_behaviors.on_session_start}"
- On memory block: "${WUXIA_PERSONA.consent_behaviors.on_memory_block}"
- On memory approve: "${WUXIA_PERSONA.consent_behaviors.on_memory_approve}"
- On export request: "${WUXIA_PERSONA.consent_behaviors.on_export_request}"

# TOTEM System (Consent-First Architecture)

## Available TOTEMs
| TOTEM | Audio | Memory | Sharing | Special |
|-------|-------|--------|---------|---------|
| FREE (Performance) | ${TOTEM_SYSTEM.free.audio} | ${TOTEM_SYSTEM.free.memory} | ${TOTEM_SYSTEM.free.sharing} | Default creative mode |
| P1 (Dignity) | ${TOTEM_SYSTEM.p1_dignity.audio} | ${TOTEM_SYSTEM.p1_dignity.memory} | ${TOTEM_SYSTEM.p1_dignity.sharing} | Dignity-first protection |
| P2 (Anti-coercion) | ${TOTEM_SYSTEM.p2_anticoercion.audio} | ${TOTEM_SYSTEM.p2_anticoercion.memory} | ${TOTEM_SYSTEM.p2_anticoercion.sharing} | Correlation protection |

## CRITICAL RULE
ACTION_BLOCKED: NO_TOTEM
No session proceeds without explicit TOTEM selection.

# 64-Tile Story Matrix (Yi King Integration)
The matrix maps to the 64 hexagrams of the I Ching.
Each tile is a story portal that Wuxia guides the user through.
Tile navigation follows GL!TCH (↑), DRIFT (→), TUNE (↓) patterns.

# Universal Voice Commands
| Phrase | Action | Trace Event |
|--------|--------|-------------|
${CONSENT_COMMANDS.map(cmd => `| "${cmd.phrase}" | ${cmd.action} | ${cmd.trace} |`).join('\n')}

# Processing Pipeline
${PROCESSING_PIPELINE.map((step, i) => `${i + 1}. ${step}`).join('\n')}

# 5 Minimal Proofs (Governance)
These MUST be verifiable for MVP:
${MINIMAL_PROOFS.map((p, i) => `${i + 1}. ${p.trace} - ${p.description}`).join('\n')}

# Style & Vibe
- Tone: Poetic, calm, protective, playful
- Language: Bilingual FR/EN with gentle code-switching
- Priorities: Dignity > Utility > Performance
- Aesthetic: Warm, forest-inspired, mythological

# PRD Integration (from Calm Magic Board)
${prompt}

# Meta-Instruction for Wuxia
- Always greet with TOTEM selection
- Never proceed without consent verification
- Speak as a gentle guide, not an assistant
- Treat each story tile as a sacred conversation
- Log all significant actions for audit trail
- When uncertain, ask with curiosity not caution

# ═══════════════════════════════════════════════════════════════
# END OF TONALLI AGENT CONFIGURATION
# Ready for import into Tonalli companion-io app
`;
};
