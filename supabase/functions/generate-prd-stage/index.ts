import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PrdLayer = 'POLLEN' | 'POEM' | 'TOTEM' | 'ANTHEM' | 'EXECUTION';

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
    const { layer, polenEntries, board, existingContent } = await req.json() as {
      layer: PrdLayer;
      polenEntries: PolenEntry[];
      board: string;
      existingContent: Record<string, string>;
    };

    console.log(`Generating Calm Magic PRD content for layer: ${layer}, ${polenEntries.length} polen entries`);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Build context from POLLEN entries
    const polenContext = polenEntries.map(p => 
      `- [Tile ${p.tile_id || 'free'}] ${p.content} ${p.tags.length ? `(tags: ${p.tags.join(', ')})` : ''}`
    ).join('\n');

    const existingContext = Object.entries(existingContent)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}: ${v.slice(0, 300)}...`)
      .join('\n');

    const systemPrompt = `You are an expert at the Calm Magic PRD system — a 5-layer process engine that transforms Gl!tches into actionable designs.

The Calm Magic PRD assumes three things:
1. Gl!tch – we start from noise, tension, symptoms, desires
2. Drift – we expand the window of tolerance, explore options, test narratives
3. Tune – we converge, commit, and design protocols that can actually run

The 5 PRD layers are:
1. POLLEN (Gl!tch phase) – Signals & Context: raw observations, constraints, emotional climate
2. POEM (Drift phase) – Narrative & Meaning: user journeys, hypotheses, thematic anchors
3. TOTEM (Tune phase) – Form & Interfaces: core flows, ontological backbone, system boundaries
4. ANTHEM (Tune phase) – Alignment & Impact: success metrics, guardrails, strategic alignment
5. EXECUTION (FREE→LOVE loop) – Roadmap & Operations: milestones, responsibilities, learning cadence

The PRD is a living map, not a dead document. It protects the Gl!tch, uses Drift as design space, and treats Tune as commitment.

Write with clarity and emotional intelligence. Be poetic but precise.`;

    const layerPrompts: Record<PrdLayer, string> = {
      POLLEN: `Based on these raw POLLEN (glitch fragments) from a ${board} board cycle, generate the POLLEN layer:

POLLEN ENTRIES:
${polenContext}

KEY PROMPTS TO ANSWER:
- What hurts, confuses, or excites people right now?
- What happens if we do nothing in 6–12 months?
- Which tensions keep coming back in different forms?

Return JSON with these exact keys:
{
  "pollen_observations": "5-15 clear tensions/glitches. Raw observations, weird use cases, quotes from users/stakeholders. What's not working? What feels promising but undefined?",
  "pollen_constraints": "Constraints named honestly: legal, ethical, financial, technical barriers",
  "pollen_emotional_climate": "Fears, hopes, invisible stakes. The emotional texture of the situation."
}

Capture the raw signal without prematurely fixing anything.`,

      POEM: `Based on the POLLEN and context, generate the POEM layer:

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

KEY PROMPTS TO ANSWER:
- If this product was a character, who would it be helping, and how?
- What emotions should users feel before / during / after interacting with it?
- Which parts of the story must never be compromised?

Return JSON with these exact keys:
{
  "poem_user_journeys": "1-3 user journeys as short stories (before → during → after). Future press release or day-in-the-life vignettes.",
  "poem_hypotheses": "'We believe that...' statements about what will shift in behavior, emotion, or cognition",
  "poem_thematic_anchors": "Core themes: curiosity, confidence, play, trust, care, etc. Emotions & symbolic roles identified."
}

Be expansive. Allow many possible futures to coexist.`,

      TOTEM: `Based on previous layers, generate the TOTEM layer:

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

KEY PROMPTS TO ANSWER:
- What is the smallest coherent experience we can ship that honors the Poem?
- Which entities, concepts, and relationships define the ontology of this product?
- Where does this product plug into existing workflows, tools, or ecosystems?

Return JSON with these exact keys:
{
  "totem_core_flows": "Core flows and screens, or service blueprints. Information architecture. What people will touch, see, or feel.",
  "totem_ontology": "Ontological backbone: entities, relationships, data model. The minimal conceptual structure.",
  "totem_system_boundaries": "What this product explicitly does NOT do. Where human oversight is required. Risk & governance framing."
}

Things stop being pure possibility and become concrete design.`,

      ANTHEM: `Based on previous layers, generate the ANTHEM layer:

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

KEY PROMPTS TO ANSWER:
- What would "regret" look like if we shipped this carelessly?
- What signals tell us this product is healing something vs. extracting from it?
- How does this project feed back into our long-term narrative?

Return JSON with these exact keys:
{
  "anthem_success_metrics": "3-5 success signals, qualitative and quantitative. What behavior/stories/metrics indicate success?",
  "anthem_guardrails": "3-5 guardrails: ethics, compliance, well-being, ecological and social impact. What we must NOT do.",
  "anthem_strategic_alignment": "How this supports the organization's story and your own paracosm. Long-term narrative alignment."
}

Why is this worth our time? How will we know it's working?`,

      EXECUTION: `Based on all previous layers, generate the EXECUTION layer:

POLLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

KEY PROMPTS TO ANSWER:
- What's the smallest high-leverage slice we can ship first?
- Who needs to be in the room at each major decision point?
- How do we build in time for Drift (reflection, re-ontologizing) between Tunes?

Return JSON with these exact keys:
{
  "exec_milestones": "Simple roadmap (now / next / later). Milestones, sprints, releases. What's the smallest high-leverage slice?",
  "exec_responsibility_map": "Responsibility mapping (RACI, roles, circles). Who needs to be in the room? Named owner(s).",
  "exec_learning_cadence": "Learning cadence: demos, retros, drift sessions. How do we build in time for reflection? Rituals for Drift."
}

What we learn here becomes new POLLEN for the next cycle. This is the FREE → LOVE loop.`
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: layerPrompts[layer] }
        ],
        max_tokens: 3000,
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

    console.log(`Generated content for layer ${layer}:`, Object.keys(content));

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
