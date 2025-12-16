import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PrdLayer = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface PolenEntry {
  content: string;
  tile_id: number | null;
  tags: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { layer, polenEntries, board, existingContent, glitchData, driftData } = await req.json() as {
      layer: PrdLayer | 'love' | 'magic' | 'calm' | 'open' | 'free' | 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
      polenEntries: PolenEntry[];
      board: string;
      existingContent?: Record<string, string> | null;
      glitchData?: any;
      driftData?: any;
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

    console.log(`Generating Calm Magic PRD content for layer: ${layerNormalized}, ${polenEntries.length} polen entries (incoming: ${layer})`);
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

    const systemPrompt = `You are an expert at the Calm Magic PRD system — a 5-season process that transforms aspirations into market-ready products.

THE 5 SEASONS:
1. POLLENS – Relational & Cultural Aspirations: Self aspirations, team dynamics, organizational culture, relational elements
2. NOEMS – Conceptual Ideation: Ideas, concepts, abstract patterns, mental models, theoretical frameworks
3. POEMS – Experiential Design (P.O.E.M.S.): People, Objects, Environments, Messages, Systems - UI, IXD, prototypes
4. TOTEMS – Technical Infrastructure: Data architecture, security policies, access controls, system requirements
5. ANTHEMS – Market & Storytelling: Market positioning, brand narrative, go-to-market, audience targeting

FEMININE DESIGN QUALITY LENS:
Always consider: Receptivity, Softness & Safety, Relationality, Cyclical Time, Embodiment, Intuition & Ambiguity, Care & Nurturance, Inclusivity & Plurality

Write with clarity and emotional intelligence. Treat insights as living organisms.`;

    const layerPrompts: Record<PrdLayer, string> = {
      POLLENS: `Based on these raw signals from a ${board} board cycle, generate the POLLENS layer:

POLLEN ENTRIES:
${polenContext}

Return JSON with these exact keys:
{
  "pollens_observations": "5-15 clear tensions/glitches with emotional texture",
  "pollens_biases": "Biases surfaced in the conversation (cognitive, cultural, institutional)",
  "pollens_cultural_issues": "Systemic and cultural patterns noticed",
  "pollens_prd_shadows": "What the PRD might be hiding or avoiding",
  "pollens_constraints": "Legal, ethical, financial, technical barriers named honestly",
  "pollens_stakes": "What happens if nothing changes (emotional and practical)",
  "stack_implications_pollens": "High-level constraints: on-prem/cloud, data residency, sensitivity levels. Integration context: existing tools, APIs, identity systems. Latency/robustness expectations.",
  "prompt_hooks_pollens": "Project name + one-line purpose. Core vibe (tone, ethos, personality). Primary user archetypes and their main questions."
}

Stay with the raw signal. No premature solutions.`,

      NOEMS: `Based on POLLENS and context, generate the NOEMS layer (conceptual atoms):

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Return JSON with these exact keys:
{
  "noems_concepts": "Crystallized concepts emerging from pollens. Format: Title: Insight (maturity: seed/growing/ripe)",
  "noems_shared_ideas": "Ideas that emerged from multiple glitches or tensions",
  "noems_intuitions": "Gut feelings and hunches worth tracking, not yet proven",
  "stack_implications_noems": "Data types & sources (files, DB, APIs, logs). Needed capabilities: OCR, Vision, RAG, workflow engine, etc. Candidate components: Supabase, vector DB, orchestration tools.",
  "prompt_hooks_noems": "Ontology: key entities, relationships, allowed operations. What the assistant knows and must protect/respect."
}

Let concepts emerge naturally. Don't force structure.`,

      POEMS: `Based on previous layers, generate the POEMS layer (narratives & knowledge objects):

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Return JSON with these exact keys:
{
  "poems_narratives": "1-3 user journeys as stories (before → during → after) with emotional texture",
  "poems_content_sources": "What content, data, and information powers these narratives",
  "poems_data_nodes": "Key data entities and relationships that the system needs to track",
  "stack_implications_poems": "UX surface: chat, dashboard, form assistant, background agent. Needed adapters: email, calendar, file upload, webhooks, etc. Session + memory model (short-term vs long-term).",
  "prompt_hooks_poems": "Canonical flows in natural language ('When user does X, the assistant must...'). Error states, guardrails, escalation behavior."
}

Stories first, then structure. Allow many possible futures.`,

      TOTEMS: `Based on previous layers, generate the TOTEMS layer (semantic structures):

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Return JSON with these exact keys:
{
  "totems_processes": "Core flows, service blueprints, what people will touch/see/feel",
  "totems_maps": "Relationship maps, conceptual architecture, system boundaries",
  "totems_three_graph": "Three Graph Model hints: Subject Graph (who/what), Lexical Graph (vocabulary), Domain Graph (concepts)",
  "totems_semantic_notes": "RDF/OWL patterns emerging, ontological commitments being made",
  "stack_implications_totems": "Logging/observability, evaluation harness, test suites. Role-based access, multi-tenant patterns, privacy layers. Monitoring tools (dashboards, alerts, feedback capture).",
  "prompt_hooks_totems": "Non-negotiable rules (compliance, ethics, tone). 'Never do X', 'Always explain Y', 'Ask for clarification when Z'. Evaluation criteria the assistant should self-check against."
}

Things become concrete here. Semantic structures crystallize.`,

      ANTHEMS: `Based on all previous layers, generate the ANTHEMS layer (integration & alignment):

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Return JSON with these exact keys:
{
  "anthems_alignment": "How this supports the organization's story and long-term narrative",
  "anthems_success_signals": "3-5 qualitative and quantitative signals of success",
  "anthems_guardrails": "3-5 guardrails: ethics, compliance, ecological and social impact",
  "anthems_roadmap": "Simple now/next/later roadmap with named owners",
  "anthems_feminine_quality": "Which of the 8 principles this honors, and which need attention",
  "anthems_learning_cadence": "How we build in time for Drift between Tunes",
  "stack_implications_anthems": "MVP vs V2 vs V3 stack choices (start simple, grow complexity). Cost/performance tradeoffs, multi-tenant vs single-tenant. Licensing/deployment model (SaaS, self-host, hybrid).",
  "prompt_hooks_anthems": "Phased evolution of the assistant ('In Phase 1, assistant can only do... In Phase 2...'). Flags for features that are future capabilities vs current."
}

Integration time. What we learn flows back into POLLENS for the next cycle.`
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
          max_tokens: 4096,
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
