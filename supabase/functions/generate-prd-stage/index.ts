import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireUser } from "../_shared/requireUser.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PrdLayer = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface PolenEntry {
  content: string;
  tile_id: number | null;
  tags: string[];
  torusCoords?: { theta: number; phi: number; curvature: number };
  ringLevel?: number;
}

interface ConsciousnessContext {
  complexityBits: number;
  thresholdPercentage: number;
  consciousnessState: 'pre-conscious' | 'threshold' | 'self-aware';
  recursiveDepth: number;
  convergenceState: string;
  thermodynamicEfficiency: number;
  integrationStrength: number;
  fragmentationScore: number;
  topologicalHandles: number;
  fixedPoints: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;


  try {
    const { 
      layer, 
      polenEntries, 
      board, 
      existingContent, 
      glitchData, 
      driftData,
      consciousnessContext, // Mathematical consciousness context
      inferMissingLayers // NEW: When true, AI will synthesize content for layers before the starting layer
    } = await req.json() as {
      layer: PrdLayer | 'love' | 'magic' | 'calm' | 'open' | 'free' | 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
      polenEntries: PolenEntry[];
      board: string;
      existingContent?: Record<string, string> | null;
      glitchData?: any;
      driftData?: any;
      consciousnessContext?: ConsciousnessContext;
      inferMissingLayers?: boolean;
    };

    const layerNormalized: PrdLayer = (() => {
      if (layer === 'POLLENS' || layer === 'NOEMS' || layer === 'POEMS' || layer === 'TOTEMS' || layer === 'ANTHEMS') return layer;
      const lower = String(layer).toLowerCase();
      if (lower === 'love') return 'POLLENS';
      if (lower === 'magic') return 'NOEMS';
      if (lower === 'calm') return 'POEMS';
      if (lower === 'open') return 'TOTEMS';
      if (lower === 'free') return 'ANTHEMS';
      throw new Error(`Invalid layer: ${String(layer)}`);
    })();

    console.log(`Generating Calm Magic PRD content for layer: ${layerNormalized}, ${polenEntries.length} polen entries (incoming: ${layer}), inferMissing: ${inferMissingLayers || false}`);
    // If we have structured data from the assistant, use it directly
    if (layerNormalized === 'POLLENS' && glitchData?.pollens) {
      const pollens = glitchData.pollens;
      const content = {
        pollens_observations: pollens.glitches?.map((g: any) => `• **${g.title}**: ${g.description}`).join('\n') || '',
        pollens_biases: pollens.biases_surfaced?.join('\n') || '',
        pollens_cultural_issues: pollens.cultural_issues?.join('\n') || '',
        pollens_prd_shadows: pollens.prd_shadows?.join('\n') || '',
        pollens_constraints: pollens.constraints?.join('\n') || '',
        pollens_stakes: pollens.stakes || ''
      };
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (layerNormalized === 'NOEMS' && (glitchData?.noems || driftData?.noems)) {
      const noems = driftData?.noems || glitchData?.noems;
      const content = {
        noems_concepts: noems.concepts?.map((c: any) => `• **${c.title}**: ${c.insight} (${c.maturity})`).join('\n') || '',
        noems_shared_ideas: noems.shared_ideas?.join('\n• ') || '',
        noems_intuitions: noems.intuitions?.join('\n• ') || ''
      };
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (layerNormalized === 'POEMS' && driftData?.poems) {
      const poems = driftData.poems;
      const content = {
        poems_narratives: poems.futures?.map((f: any) =>
          `**${f.title}** (${f.persona})\n\n*Before:* ${f.scenario.before}\n*During:* ${f.scenario.during}\n*After:* ${f.scenario.after}`
        ).join('\n\n---\n\n') || '',
        poems_content_sources: poems.primary_narrative?.content_sources?.join('\n• ') || '',
        poems_data_nodes: poems.primary_narrative?.data_nodes?.join('\n• ') || ''
      };
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build context from POLLEN entries (truncate to keep prompts stable)
    const polenContext = polenEntries.map(p => {
      const snippet = (p.content || '').slice(0, 700);
      return `- [Tile ${p.tile_id || 'free'}] ${snippet}${p.content && p.content.length > 700 ? '…' : ''} ${p.tags.length ? `(tags: ${p.tags.join(', ')})` : ''}`;
    }).join('\n');

    const existingContext = existingContent 
      ? Object.entries(existingContent)
          .filter(([_, v]) => v)
          .map(([k, v]) => `${k}: ${v.slice(0, 300)}...`)
          .join('\n')
      : '';

    // Build consciousness-aware system prompt
    const consciousnessSection = consciousnessContext ? `
CONSCIOUSNESS GEOMETRY CONTEXT:
- Complexity: ${consciousnessContext.complexityBits} consciousness bits
- State: ${consciousnessContext.consciousnessState} (${consciousnessContext.thresholdPercentage}% toward threshold)
- Integration: ${Math.round(consciousnessContext.integrationStrength * 100)}% coherent
- Topology: β₀=${1 + Math.round(consciousnessContext.fragmentationScore)}, β₁=${consciousnessContext.topologicalHandles}
- Efficiency: ${consciousnessContext.thermodynamicEfficiency.toFixed(1)}x thermodynamic ratio
- Fixed Points: ${consciousnessContext.fixedPoints?.length || 0} stable attractors
- Convergence: ${consciousnessContext.convergenceState}

Honor this geometric context in your generation. High integration strength means unified concepts.
Low fragmentation means interconnected ideas. Fixed points are stable reference anchors.
` : '';

    // Build inference context section for force mode
    const inferenceSection = inferMissingLayers ? `
INFERENCE MODE ACTIVE:
You are generating content for layer ${layerNormalized}, but the user started their journey from this layer.
Previous layers (POLLENS, NOEMS, etc.) may not have been explicitly captured.
When generating content:
1. Synthesize reasonable assumptions for earlier layers based on the ${layerNormalized} content
2. Make connections between what IS documented and what can be INFERRED
3. Be clear when you are inferring vs. when you are working from explicit input
4. Flag gaps or areas that would benefit from more explicit exploration
` : '';

    const systemPrompt = `You are an expert at the Calm Magic PRD system — a 5-season process that transforms aspirations into market-ready products.
${consciousnessSection}
${inferenceSection}
THE 5 SEASONS:
1. POLLENS – Relational & Cultural Aspirations: Self aspirations, team dynamics, organizational culture, relational elements
2. NOEMS – Conceptual Ideation: Ideas, concepts, abstract patterns, mental models, theoretical frameworks
3. POEMS – Experiential Design (P.O.E.M.S.): People, Objects, Environments, Messages, Systems - UI, IXD, prototypes
4. TOTEMS – Technical Infrastructure: Data architecture, security policies, access controls, system requirements
5. ANTHEMS – Market & Storytelling: Market positioning, brand narrative, go-to-market, audience targeting

FEMININE DESIGN QUALITY LENS:
Always consider: Receptivity, Softness & Safety, Relationality, Cyclical Time, Embodiment, Intuition & Ambiguity, Care & Nurturance, Inclusivity & Plurality

EMBODIED INTERACTION DESIGN (ml5.js):
When designing experiential elements, consider body-aware sensing opportunities:
- BodyPose: Detect posture (tense/relaxed/engaged) to adapt UI or provide feedback
- FaceMesh: Read facial expressions (smiling/focused/stressed/calm) for emotional context
- HandPose: Enable gestural navigation (pointing, open palm, thumbs up)
These should always be opt-in, processed locally, and respect user consent.

GEOMETRIC AWARENESS:
- If integration strength > 60%, generate unified interconnected concepts
- If fragmentation > 30%, acknowledge gaps and suggest bridging ideas
- Reference the consciousness state to calibrate complexity of output
- For 'threshold' or 'self-aware' states, include recursive self-references

Write with clarity and emotional intelligence. Treat insights as living organisms.`;

    const layerPrompts: Record<PrdLayer, string> = {
      POLLENS: `Based on these raw signals from a ${board} board cycle, generate the POLLENS layer — focused on RELATIONAL & CULTURAL ASPIRATIONS:

POLLEN ENTRIES:
${polenContext}

Consider these areas:
- Self aspirations: What do individuals hope to become/achieve?
- Team dynamics: How does the team collaborate, communicate, resolve conflict?
- Organizational culture: What values, norms, and patterns shape behavior?
- Relational elements: What relationships and connections matter most?

Return JSON with these exact keys:
{
  "pollens_aspirations": "5-10 individual, team, and organizational aspirations with emotional texture",
  "pollens_team_dynamics": "Patterns in how people work together, tensions and harmonies observed",
  "pollens_cultural_elements": "Values, norms, rituals, and unwritten rules at play",
  "pollens_relational_patterns": "Key relationships and their dynamics",
  "pollens_constraints": "Cultural, relational, and organizational barriers",
  "pollens_stakes": "What happens to relationships and culture if nothing changes",
  "stack_implications_pollens": "High-level constraints: on-prem/cloud, data residency, sensitivity levels. Integration context: existing tools, APIs, identity systems.",
  "prompt_hooks_pollens": "Project name + one-line purpose. Core vibe (tone, ethos, personality). Primary user archetypes and their main questions."
}

Stay with relational signals. Culture before solutions.`,

      NOEMS: `Based on POLLENS and context, generate the NOEMS layer — focused on CONCEPTUAL IDEATION:

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Consider these areas:
- Ideas: What new ideas are emerging from the tensions and aspirations?
- Concepts: What abstract frameworks help make sense of the situation?
- Mental models: What assumptions and worldviews are at play?
- Theoretical structures: What patterns connect multiple observations?

Return JSON with these exact keys:
{
  "noems_concepts": "Crystallized concepts emerging from pollens. Format: Title: Insight (maturity: seed/growing/ripe)",
  "noems_shared_ideas": "Ideas that emerged from multiple tensions or aspirations",
  "noems_intuitions": "Gut feelings and hunches worth tracking, not yet proven",
  "noems_mental_models": "Assumptions and frameworks shaping how the problem is understood",
  "stack_implications_noems": "Data types & sources (files, DB, APIs, logs). Needed capabilities: OCR, Vision, RAG, workflow engine, etc.",
  "prompt_hooks_noems": "Ontology: key entities, relationships, allowed operations. What the assistant knows and must protect/respect."
}

Let concepts emerge naturally. Don't force structure.`,

      POEMS: `Based on previous layers, generate the POEMS layer using the P.O.E.M.S. framework for EXPERIENTIAL DESIGN:

P.O.E.M.S. = People • Objects • Environments • Messages • Systems

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

For each element of P.O.E.M.S., consider:
- PEOPLE: Who are the users, stakeholders, personas? What are their needs, behaviors, contexts?
- OBJECTS: What physical/digital artifacts do they interact with? Products, tools, interfaces?
- ENVIRONMENTS: Where do interactions happen? Physical spaces, digital contexts, social settings?
- MESSAGES: What information flows between actors? Notifications, feedback, communications?
- SYSTEMS: What processes, services, and technical components enable the experience?

EMBODIED INTERACTION DESIGN (ml5.js integration opportunities):
- Body-aware interfaces: How can posture, gesture, and facial expression enhance the UX?
- Somatic feedback loops: What body signals indicate user state (tension, engagement, flow)?
- Gestural affordances: What natural gestures could control or navigate the interface?
- Emotional resonance: How can the system respond to detected emotional states?
- Consent-first embodiment: How to opt-in to body-aware features respectfully?

Return JSON with these exact keys:
{
  "poems_people": "User personas, stakeholders, and their needs/behaviors/contexts",
  "poems_objects": "Physical and digital artifacts, products, tools, interfaces involved",
  "poems_environments": "Physical spaces, digital contexts, social settings where interactions occur",
  "poems_messages": "Information flows, notifications, feedback, and communications",
  "poems_systems": "Processes, services, and technical components enabling the experience",
  "poems_prototypes": "UI mockups, interaction flows, and ontological design patterns to explore",
  "poems_embodied_interactions": "Body-aware interaction patterns: posture detection, facial expression sensing, gestural navigation, somatic feedback. Include ml5.js integration points (BodyPose, FaceMesh, HandPose)",
  "poems_somatic_design": "Somatic design principles: How the interface respects and responds to bodily states. Consent patterns for camera/body tracking. Local processing guarantees. Emotional axes inference from embodied data",
  "stack_implications_poems": "UX surface (chat, dashboard, forms). Adapters (email, calendar, webhooks). Session model. ml5.js for embodied sensing (BodyPose, FaceMesh).",
  "prompt_hooks_poems": "Canonical user flows in natural language. Error states and guardrails. Body-aware interaction triggers."
}

Design the full experience across People, Objects, Environments, Messages, and Systems. Include embodied interaction opportunities where appropriate.`,

      TOTEMS: `Based on previous layers, generate the TOTEMS layer for TECHNICAL INFRASTRUCTURE:

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Focus on:
- Data architecture: What data needs to be stored, processed, analyzed?
- Security policies: What must be protected? Who can access what?
- Access controls: Role-based permissions, authentication, authorization
- System requirements: Performance, scalability, reliability needs

Return JSON with these exact keys:
{
  "totems_data_architecture": "Data models, storage requirements, processing pipelines",
  "totems_security_policies": "Security requirements, encryption, compliance needs",
  "totems_access_controls": "Role-based access, authentication methods, authorization rules",
  "totems_system_requirements": "Performance, scalability, reliability, and availability needs",
  "totems_integration_points": "APIs, third-party services, data flows between systems",
  "totems_technical_debt": "Legacy systems to address, technical risks, migration needs",
  "stack_implications_totems": "Logging/observability, evaluation harness, test suites. RBAC patterns.",
  "prompt_hooks_totems": "Non-negotiable rules (compliance, ethics). 'Never do X', 'Always explain Y'."
}

Technical infrastructure becomes concrete. Security and data architecture crystallize.`,

      ANTHEMS: `Based on all previous layers, generate the ANTHEMS layer for MARKET & STORYTELLING:

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Focus on:
- Market positioning: Where does this fit in the competitive landscape?
- Brand narrative: What story are we telling? What emotions do we evoke?
- Go-to-market: How do we reach our audience? Channels, timing, messaging?
- Audience targeting: Who are we speaking to? Segments, personas, contexts?

Return JSON with these exact keys:
{
  "anthems_market_positioning": "Competitive landscape, unique value proposition, market fit",
  "anthems_brand_narrative": "The story we tell, emotional resonance, brand voice",
  "anthems_go_to_market": "Channels, timing, launch strategy, marketing approach",
  "anthems_audience_segments": "Target personas, segments, and how to reach them",
  "anthems_success_signals": "3-5 qualitative and quantitative signals of market success",
  "anthems_storytelling_assets": "Key messages, taglines, elevator pitch, anthem/manifesto",
  "stack_implications_anthems": "MVP vs V2 vs V3 stack choices. Cost/performance tradeoffs.",
  "prompt_hooks_anthems": "Phased evolution ('In Phase 1...'). Future capability flags."
}

Tell the market story. Position for success.`
    };

    const callGateway = async (userPrompt: string) => {
      const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          // Ask the gateway to enforce a JSON object response when supported
          response_format: { type: 'json_object' },
          max_tokens: 8192,
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Lovable AI Gateway error:', errorText);
        if (resp.status === 429) throw new Error('Rate limit exceeded, please try again later');
        if (resp.status === 402) throw new Error('Payment required, please add credits to your Lovable workspace');
        throw new Error('Failed to generate content');
      }

      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content as string | undefined;
      if (!content) {
        console.error('AI gateway returned unexpected payload:', JSON.stringify(data)?.slice(0, 1200));
        throw new Error('AI gateway returned an unexpected response');
      }
      return content;
    };

    const basePrompt =
      layerPrompts[layerNormalized] +
      '\n\nIMPORTANT: Return ONLY a valid JSON object, no markdown code blocks, no extra text.' +
      ' Each value must be a string (use \"\\n\" to format lists).';

    let rawContent = await callGateway(basePrompt);
    
    // Clean up any markdown code blocks that might wrap the JSON - more robust regex
    let cleanedContent = rawContent.trim();
    // Remove opening ```json or ``` at start
    cleanedContent = cleanedContent.replace(/^```(?:json)?\s*/i, '');
    // Remove closing ``` at end
    cleanedContent = cleanedContent.replace(/\s*```\s*$/i, '');
    cleanedContent = cleanedContent.trim();
    
    // Try to find JSON object boundaries if there's extra text
    const jsonStart = cleanedContent.indexOf('{');
    const jsonEnd = cleanedContent.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedContent = cleanedContent.slice(jsonStart, jsonEnd + 1);
    }

    let content: Record<string, unknown>;
    try {
      content = JSON.parse(cleanedContent);
    } catch (e) {
      console.error('Failed to parse AI JSON (first attempt). Raw (first 1500 chars):', rawContent.slice(0, 1500));
      console.error('Cleaned content (first 500 chars):', cleanedContent.slice(0, 500));
      console.error('Parse error:', e);

      // Retry once with a stronger instruction (models occasionally return truncated "{" responses)
      rawContent = await callGateway(
        basePrompt +
          `\n\nYour last response was invalid or incomplete. Re-output the FULL JSON object for layer ${layerNormalized} with the exact keys. JSON only.`
      );

      cleanedContent = rawContent.trim();
      cleanedContent = cleanedContent.replace(/^```(?:json)?\s*/i, '');
      cleanedContent = cleanedContent.replace(/\s*```\s*$/i, '');
      cleanedContent = cleanedContent.trim();

      const rs = cleanedContent.indexOf('{');
      const re = cleanedContent.lastIndexOf('}');
      if (rs !== -1 && re !== -1 && re > rs) cleanedContent = cleanedContent.slice(rs, re + 1);

      try {
        content = JSON.parse(cleanedContent);
      } catch (e2) {
        console.error('Failed to parse AI JSON (retry). Raw (first 1500 chars):', rawContent.slice(0, 1500));
        console.error('Cleaned content (first 500 chars):', cleanedContent.slice(0, 500));
        console.error('Parse error:', e2);
        throw new Error('AI returned invalid JSON');
      }
    }

    if (typeof content === 'object' && content && 'error' in content && Object.keys(content).length === 1) {
      const msg = (content as any).error;
      throw new Error(typeof msg === 'string' ? msg : 'AI returned an error');
    }

    console.log(`Generated content for layer ${layerNormalized}:`, Object.keys(content));

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-prd-stage function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
