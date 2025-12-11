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
  layers: {
    data: string[];
    ai: string[];
    orchestration: string[];
    ux: string[];
    ops: string[];
  };
  phase_plan: {
    mvp: string[];
    phase_2: string[];
    phase_3: string[];
  };
}

export interface FoundationalPrompt {
  role_identity: string;
  knowledge_ontology: string;
  core_behaviors: string;
  rules_guardrails: string;
  style_vibe: string;
  evolution_roadmap: string;
  meta_instruction: string;
}

// =============================================================================
// LAYER EXTRACTION GUIDES
// =============================================================================

export const LAYER_EXTRACTION_GUIDES: Record<string, { stack: string; prompt: string }> = {
  POLLENS: {
    stack: `Extract from POLLENS layer:
- High-level constraints (on-prem/cloud, data residency, sensitivity levels)
- Integration context (existing tools, APIs, identity systems)
- Latency/robustness expectations (near-real-time? async ok?)`,
    prompt: `Extract from POLLENS layer:
- Project name + one-line purpose
- Core "vibe" (tone, ethos, personality)
- Primary user archetypes and their main questions`
  },
  NOEMS: {
    stack: `Extract from NOEMS layer:
- Data types & sources (files, DB, APIs, logs)
- Needed capabilities (OCR, Vision, RAG, workflow engine, etc.)
- Candidate components (Supabase, vector DB, orchestration tools)`,
    prompt: `Extract from NOEMS layer:
- Ontology: key entities, relationships, allowed operations
- What the assistant knows and must protect/respect`
  },
  POEMS: {
    stack: `Extract from POEMS layer:
- UX surface (chat, dashboard, form assistant, background agent)
- Needed adapters (email, calendar, file upload, webhooks, etc.)
- Session + memory model (short-term vs long-term)`,
    prompt: `Extract from POEMS layer:
- Canonical flows in natural language ("When user does X, the assistant must...")
- Error states, guardrails, escalation behavior`
  },
  TOTEMS: {
    stack: `Extract from TOTEMS layer:
- Logging/observability, evaluation harness, test suites
- Role-based access, multi-tenant patterns, privacy layers
- Monitoring tools (dashboards, alerts, feedback capture)`,
    prompt: `Extract from TOTEMS layer:
- Non-negotiable rules (compliance, ethics, tone)
- "Never do X", "Always explain Y", "Ask for clarification when Z"
- Evaluation criteria the assistant should self-check against`
  },
  ANTHEMS: {
    stack: `Extract from ANTHEMS layer:
- MVP vs V2 vs V3 stack choices (start simple, grow complexity)
- Cost/performance tradeoffs, multi-tenant vs single-tenant
- Licensing/deployment model (SaaS, self-host, hybrid)`,
    prompt: `Extract from ANTHEMS layer:
- Phased evolution of the assistant ("In Phase 1, assistant can only do... In Phase 2...")
- Flags for features that are future capabilities vs current`
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
  layers: {
    data: ["Supabase Postgres", "Object storage"],
    ai: ["Gemini 2.5 Flash", "Embedding model"],
    orchestration: ["Edge Functions", "Custom agents"],
    ux: ["Web app", "Chat interface"],
    ops: ["Logging", "Monitoring"]
  },
  phase_plan: {
    mvp: [],
    phase_2: [],
    phase_3: []
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

# Meta-Instruction
- If you're missing information, ask targeted questions.
- If user requests something outside your scope, explain your limits and suggest safe alternatives.`;

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
    name: projectName
  };

  // Parse POLLENS for constraints
  const pollensImpl = implications.stack_implications_pollens || '';
  if (pollensImpl.toLowerCase().includes('high')) {
    stack.constraints.sensitivity = 'high';
  }
  if (pollensImpl.toLowerCase().includes('on-prem')) {
    stack.constraints.hosting = 'on-prem';
  }
  if (pollensImpl.toLowerCase().includes('hybrid')) {
    stack.constraints.hosting = 'hybrid';
  }

  // Parse NOEMS for data/AI components
  const noemsImpl = implications.stack_implications_noems || '';
  if (noemsImpl.toLowerCase().includes('vector')) {
    stack.layers.data.push('Vector DB');
  }
  if (noemsImpl.toLowerCase().includes('rag')) {
    stack.layers.ai.push('RAG Pipeline');
  }
  if (noemsImpl.toLowerCase().includes('vision')) {
    stack.layers.ai.push('Vision API');
  }

  // Parse POEMS for UX components
  const poemsImpl = implications.stack_implications_poems || '';
  if (poemsImpl.toLowerCase().includes('chat')) {
    if (!stack.layers.ux.includes('Chat interface')) {
      stack.layers.ux.push('Chat interface');
    }
  }
  if (poemsImpl.toLowerCase().includes('dashboard')) {
    stack.layers.ux.push('Admin dashboard');
  }
  if (poemsImpl.toLowerCase().includes('email')) {
    stack.layers.ux.push('Email hooks');
  }

  // Parse TOTEMS for ops components
  const totemsImpl = implications.stack_implications_totems || '';
  if (totemsImpl.toLowerCase().includes('eval')) {
    stack.layers.ops.push('Eval harness');
  }
  if (totemsImpl.toLowerCase().includes('role')) {
    stack.layers.ops.push('RBAC');
  }

  // Parse ANTHEMS for phasing
  const anthemsImpl = implications.stack_implications_anthems || '';
  // Extract phase information if present
  
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

export interface ValidationIssue {
  layer: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
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

export const validateCompilation = (
  stackImplications: Record<string, string>,
  promptHooks: Record<string, string>
): ValidationResult => {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  
  const layers = ['pollens', 'noems', 'poems', 'totems', 'anthems'];
  let filledFields = 0;
  const totalFields = 10;

  // Validate stack implications
  layers.forEach(layer => {
    const key = `stack_implications_${layer}`;
    const content = stackImplications[key] || '';
    
    if (!content || content.length < 10) {
      errors.push({
        layer: layer.toUpperCase(),
        field: 'stack_implications',
        message: `Missing stack implications for ${layer.toUpperCase()}`,
        severity: 'error'
      });
    } else if (content.length < VALIDATION_RULES.minContentLength) {
      warnings.push({
        layer: layer.toUpperCase(),
        field: 'stack_implications',
        message: `Stack implications for ${layer.toUpperCase()} is too brief (${content.length} chars)`,
        severity: 'warning'
      });
      filledFields += 0.5;
    } else {
      filledFields += 1;
      // Check for technical keywords
      const hasKeyword = VALIDATION_RULES.stackKeywords.some(kw => 
        content.toLowerCase().includes(kw)
      );
      if (!hasKeyword) {
        warnings.push({
          layer: layer.toUpperCase(),
          field: 'stack_implications',
          message: `Consider adding technical details (data, API, cloud, etc.) to ${layer.toUpperCase()}`,
          severity: 'warning'
        });
      }
    }
  });

  // Validate prompt hooks
  layers.forEach(layer => {
    const key = `prompt_hooks_${layer}`;
    const content = promptHooks[key] || '';
    
    if (!content || content.length < 10) {
      errors.push({
        layer: layer.toUpperCase(),
        field: 'prompt_hooks',
        message: `Missing prompt hooks for ${layer.toUpperCase()}`,
        severity: 'error'
      });
    } else if (content.length < VALIDATION_RULES.minContentLength) {
      warnings.push({
        layer: layer.toUpperCase(),
        field: 'prompt_hooks',
        message: `Prompt hooks for ${layer.toUpperCase()} is too brief (${content.length} chars)`,
        severity: 'warning'
      });
      filledFields += 0.5;
    } else {
      filledFields += 1;
      // Check for behavioral keywords
      const hasKeyword = VALIDATION_RULES.promptKeywords.some(kw => 
        content.toLowerCase().includes(kw)
      );
      if (!hasKeyword) {
        warnings.push({
          layer: layer.toUpperCase(),
          field: 'prompt_hooks',
          message: `Consider adding behavioral language (user, when, must) to ${layer.toUpperCase()}`,
          severity: 'warning'
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
