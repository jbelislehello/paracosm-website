import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PrdLayer = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';

interface PolenEntry {
  content: string;
  tile_id: number | null;
  tags: string[];
}

interface MasterLens {
  lens?: { landscape?: string; energy?: string; norms?: string; synergies?: string };
  maps?: { methods?: string; architecture?: string; protocols?: string; systems?: string };
  agendas?: { analysis?: string; guidelines?: string; elaboration?: string; normalization?: string; development?: string; adaptation?: string; secrets?: string };
  chords?: { chances?: string; heart?: string; observer?: string; reversal?: string; design?: string; seeds?: string };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { layer, polenEntries, board, existingContent, masterLens } = await req.json() as {
      layer: PrdLayer;
      polenEntries: PolenEntry[];
      board: string;
      existingContent: Record<string, string>;
      masterLens?: MasterLens;
    };

    console.log(`Generating Calm Magic PRD content for layer: ${layer}, ${polenEntries.length} polen entries`);

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

    const masterLensContext = masterLens ? `
MASTER LENS EVALUATION:
- LENS (Landscape/Energy/Norms/Synergies): ${JSON.stringify(masterLens.lens || {})}
- MAPS (Methods/Architecture/Protocols/Systems): ${JSON.stringify(masterLens.maps || {})}
- AGENDAS: ${JSON.stringify(masterLens.agendas || {})}
- CHORDS (Chances/Heart/Observer/Reversal/Design/Seeds): ${JSON.stringify(masterLens.chords || {})}
` : '';

    const systemPrompt = `You are an expert at the Calm Magic PRD system — a 5-layer process engine that transforms ideas, signals, and intentions into structured designs.

The 5 layers correspond to an inner breath cycle:
1. LOVE (inhale) — Aliveness: Detect vital charge. Does it have Longevity, Oscillations, Velocity, Elasticity?
2. MAGIC (widen ribs) — Spaciousness: Expand cognitive playfield through 5 compasses (Narratives, Workflows, Inquiry/Practices, Playgrounds, Human Dynamics)
3. CALM (hold exhale) — Wholeness: Bridge intuition & structure through LENS, MAPS, AGENDAS
4. OPEN (dissolve) — Poiesis: Allow creative transformation, break symmetry, prototype rapidly
5. FREE (expand) — Neurogenesis: Integrate, stabilize, elevate. Flourish, Release, Expand, Elevate.

Each layer is evaluated through:
- LENS: Landscape / Energy / Norms / Synergies
- MAPS: Methods / Architecture / Protocols / Systems  
- AGENDAS: Analysis / Guidelines / Elaboration / Normalization / Development / Adaptation / Secrets
- CHORDS: Chances / Heart / Observer / Reversal / Design / Seeds

Keep emotional and relational richness while being actionable. Write with clarity and insight.`;

    const layerPrompts: Record<PrdLayer, string> = {
      LOVE: `Based on these POLEN (raw glitch fragments) from a ${board} board cycle, generate the LOVE layer:

POLEN ENTRIES:
${polenContext}

${masterLensContext}

Return JSON with these exact keys:
{
  "love_vitality_map": "2-3 paragraphs mapping the energy, life force, and vital charge of this idea. What's alive? What has momentum?",
  "love_resonance_notes": "What resonates deeply? What emotional and intuitive signals are strongest?",
  "love_score": "Evaluate on four dimensions: Longevity (will this last?), Oscillations (is there dynamic tension?), Velocity (is there momentum?), Elasticity (can it adapt?)"
}

Be poetic but precise. Capture the emotional texture while identifying the vital core.`,

      MAGIC: `Based on the POLEN and LOVE layer, generate the MAGIC layer:

POLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

${masterLensContext}

Return JSON with these exact keys:
{
  "magic_compass_map": "Map across 5 compasses: Narratives (what stories emerge?), Workflows (what processes?), Inquiry/Practices (what contemplative aspects?), Playgrounds (what experimentation?), Human Dynamics (what relational patterns?)",
  "magic_pattern_geometry": "Identify pattern geometry: Seasons (cycles), Constellations (clusters), Transitions, Translations, Transformations",
  "magic_contradictions": "What early contradictions or tensions appear? What paradoxes must be held?"
}

Be expansive and creative. Open cognitive space.`,

      CALM: `Based on previous layers and POLEN, generate the CALM layer:

POLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

${masterLensContext}

Return JSON with these exact keys:
{
  "calm_lens_evaluation": "Evaluate through LENS - Landscape (context/terrain), Energy (vital force), Norms (established patterns), Synergies (connections)",
  "calm_maps_diagram": "Structure through MAPS - Methods (ways of doing), Architecture (ways of structuring), Protocols (social agreements), Systems (technical integrations)",
  "calm_governance": "Define governance protocol: Window of Tolerance framework (Gl!tch → Drift → Tune), decision processes, feedback loops",
  "masterLens": {
    "lens": { "landscape": "...", "energy": "...", "norms": "...", "synergies": "..." },
    "maps": { "methods": "...", "architecture": "...", "protocols": "...", "systems": "..." }
  }
}

Be systematic while honoring complexity. Bridge intuition and structure.`,

      OPEN: `Based on previous layers, generate the OPEN layer (Poiesis):

POLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContext}` : ''}

${masterLensContext}

Return JSON with these exact keys:
{
  "open_emergence_map": "What wants to be born that wasn't visible before? Map the emergent possibilities.",
  "open_prototype_notes": "First rapid prototype insights: What's the minimal viable expression? What can we build now?",
  "open_ontology_tuning": "How do categories, relationships, and structures need to adjust? What ontological shifts?"
}

Allow surprise. Let the idea mutate and contradict its earlier shape.`,

      FREE: `Based on all previous layers, generate the FREE layer for integration:

POLEN ENTRIES:
${polenContext}

${existingContext ? `EXISTING CONTENT:\n${existingContent}` : ''}

${masterLensContext}

Return JSON with these exact keys:
{
  "free_insight_synthesis": "What has been realized? What did this process teach about the system?",
  "free_expanded_ontology": "The expanded understanding structure. New categories, relationships, patterns.",
  "free_integration_blueprint": "How to embed this in the organizational OS. What changes to practice?",
  "poem": {
    "people": "Who is involved, affected, served?",
    "objects": "What artifacts, tools, deliverables?",
    "environments": "What spaces, contexts, channels?",
    "messages": "What communications, signals, feedback?",
    "systems": "What rules, workflows, integrations?"
  }
}

Flourish, Release, Expand, Elevate. This is neurogenesis — new awareness arriving.`
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
