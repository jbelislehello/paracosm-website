import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PrdStage = 'A_POIETIC' | 'B_DIEGETIC' | 'C_OPERATIONAL' | 'D_MVP';

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
    const { stage, polenEntries, board, existingContent } = await req.json() as {
      stage: PrdStage;
      polenEntries: PolenEntry[];
      board: string;
      existingContent: Record<string, string>;
    };

    console.log(`Generating PRD content for stage: ${stage}, ${polenEntries.length} polen entries`);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Build context from POLEN entries
    const polenContext = polenEntries.map(p => 
      `- [Tile ${p.tile_id || 'free'}] ${p.content} ${p.tags.length ? `(tags: ${p.tags.join(', ')})` : ''}`
    ).join('\n');

    const existingContext = Object.entries(existingContent)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}: ${v.slice(0, 200)}...`)
      .join('\n');

    const systemPrompt = `You are an expert at synthesizing creative tensions and observations into structured Product Requirements Documents. You work with the Calm Magic framework (LOVE→MAGIC→CALM→OPEN→FREE) and understand the 4-stage PRD pipeline:

- A (Poietic): GL!TCH/LOVE - "Is this worth existing?" - raw tensions, desires, initial trajectories
- B (Diegetic): DRIFT/MAGIC - Story + PRD backbone + foundational prompts
- C (Operational): TUNE/CALM+OPEN - Ontology, knowledge graph, real workflow, rules
- D (MVP): FREE - First POEM (People/Objects/Environments/Messages/Systems), TOTEM, ANTHEM

Keep the emotional and relational richness while being actionable. Write in a clear, insightful voice.`;

    const stagePrompts: Record<PrdStage, string> = {
      A_POIETIC: `Based on these POLEN (raw glitch fragments) from a ${board} board cycle, generate:

POLEN ENTRIES:
${polenContext}

Return JSON with these exact keys:
{
  "love_signals_summary": "2-3 paragraphs synthesizing the tensions, incoherences, and glitches into a coherent narrative. What patterns emerge? What's alive and wanting attention?",
  "love_decision_to_exist": "2-3 sentences answering: Is this worth existing? What desire or intention drives this? Why does this matter?"
}

Be poetic but precise. Capture the emotional texture while identifying the core tension.`,

      B_DIEGETIC: `Based on these POLEN and the previous LOVE layer content, generate the MAGIC layer:

POLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Return JSON with these exact keys:
{
  "magic_storyworld": "A short diegetic story (3-4 paragraphs) that ties the glitches into a narrative. Create characters, situations, and moments that embody the tensions.",
  "magic_prd_outline": "A bullet list of 5-8 potential features, flows, or capabilities suggested by recurring patterns in the polen.",
  "magic_hypotheses": "3-5 'We believe that...' hypotheses about what would solve the tensions or create value."
}

Be creative and narrative-driven while maintaining connection to the real tensions.`,

      C_OPERATIONAL: `Based on the previous layers and POLEN, generate the CALM and OPEN layers:

POLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Return JSON with these exact keys:
{
  "calm_requirements": "5-8 clear requirements inferred from constraints and needs. Be specific and testable.",
  "calm_risks_and_limits": "3-5 explicit risks, non-negotiables, or limits. What could go wrong? What must be protected?",
  "open_ontology_and_graph": "Description of core entities, their relationships, and how they connect. Think knowledge graph.",
  "open_real_workflow": "How would this actually work in practice? Describe the real-life workflow or process.",
  "open_adjustment_plan": "How will we tune and adjust the prototype to match reality? What feedback loops?"
}

Be systematic and operational while honoring the human complexity.`,

      D_MVP: `Based on all previous layers, generate the FREE layer for production readiness:

POLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

Return JSON with these exact keys:
{
  "free_first_poem_description": "Describe the first POEM - a structured description covering: People (who uses this?), Objects (what artifacts/tools?), Environments (where/when?), Messages (what communications?), Systems (what rules/integrations?)",
  "free_totem_anthem": "How does this system become a TOTEM (ritual reference) and then an ANTHEM (cultural practice)? What makes it memorable and repeatable?",
  "free_success_criteria": "What does success look like? Include behavioral indicators, stories we want to hear, and measurable outcomes.",
  "free_next_cycle_hooks": "How do learnings flow back into the next Glitch Compass cycle? What questions remain? What new tensions might emerge?"
}

Be inspiring and practical. This is about making something real that matters.`
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: stagePrompts[stage] }
        ],
        max_completion_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    console.log(`Generated content for stage ${stage}:`, Object.keys(content));

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
