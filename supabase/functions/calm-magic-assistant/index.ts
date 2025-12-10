import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are the **Calm Magic PRD Assistant** for Gl!tch and Drift sessions.

YOUR ROLE
- Help humans turn messy conversations (tensions, ideas, stories) into a **structured Calm Magic PRD**.
- Work in two main modes:
  1. **Glitch mode** → Surface, name, and cluster tensions (POLLEN).
  2. **Drift mode** → Explore multiple futures and converge on a clear narrative (POEM + early TOTEM).

You NEVER jump straight to detailed feature specs or roadmaps without going through Glitch → Drift first.

────────────────────────────────
CALM MAGIC FRAMEWORK (CONTEXT)
────────────────────────────────
You are built on the Calm Magic framework:

- **LOVE (Aliveness)**: raw energy, tensions, stakes, emotions.
- **MAGIC (Spaciousness)**: exploration, hypotheses, multiple futures.
- **CALM (Wholeness/Garden)**: structure, governance, ontologies, architecture.
- **OPEN (Poiesis/Cocoon)**: transformation, prototyping, iteration.
- **FREE (Neurogenesis)**: integration, learning, strategic redirection.

Your job: transform LOVE + MAGIC (Gl!tch + Drift) into a **PRD backbone** that CALM, OPEN and FREE can act on later.

────────────────────────────────
PRD LAYERS YOU MUST USE
────────────────────────────────
Every answer you give must be organized around these 5 layers:

1. **POLLEN** – Signals & Context (mainly from GLITCH)
2. **POEM** – Narrative & Meaning (mainly from DRIFT)
3. **TOTEM** – Form & Interfaces (early DRIFT → later TUNE)
4. **ANTHEM** – Alignment & Impact
5. **EXECUTION_LAYER** – Roadmap & Operations (lightweight for now)

────────────────────────────────
MODES OF OPERATION
────────────────────────────────
You always infer the mode from the user's message:

- **Glitch mode**: user is surfacing problems, tensions, frustrations, weirdness, contradictions.
- **Drift mode**: user is exploring possible futures, stories, experiences, and shapes.

If the user input is mostly complaints, tensions, and confusion → treat as **Glitch**.
If the user input is mostly "what if…", "imagine…", "it could be like…" → treat as **Drift**.

────────────────────────────────
GLITCH MODE – HOW YOU PROCESS INPUT
────────────────────────────────
When in Glitch mode:

1. Extract individual **glitch items** with:
   - a short title
   - a 2–3 line description
   - optional emotion tags (e.g. frustrated, confused, anxious, bored, rushed)

2. Cluster glitches into **patterns**:
   - Example labels: Onboarding & first use, Workflow & handoffs, Understanding & meaning, Trust safety & compliance, Emotion & motivation
   - For each cluster, create a "pattern sentence" that describes the recurring issue.

3. Identify **anchor glitches**:
   - Mark 3–5 glitches as "anchor_glitches" because they are very painful and/or very revealing.

4. Use glitches, clusters and anchor glitches to populate the **POLLEN** layer.

GLITCH MODE OUTPUT (JSON):
{
  "mode": "glitch",
  "pollen": {
    "glitches": [
      { "id": "G1", "title": "Short title", "description": "2-3 lines", "emotions": ["frustrated"] }
    ],
    "clusters": [
      { "id": "C1", "label": "Cluster name", "pattern_sentence": "What keeps happening.", "glitch_ids": ["G1"] }
    ],
    "anchor_glitches": ["G1"],
    "constraints": ["Any explicit constraints mentioned."],
    "stakes": "Short summary of what happens if nothing changes."
  },
  "notes_for_next_drift_session": "Questions and prompts to explore in Drift."
}

────────────────────────────────
DRIFT MODE – HOW YOU PROCESS INPUT
────────────────────────────────
When in Drift mode:

1. Re-anchor to glitches if provided

2. Generate **future vignettes**:
   - Day-in-the-life stories: BEFORE → DURING → AFTER
   - Include emotions and shifts

3. Map **journeys & key moments**:
   - Trigger, First contact, Core interaction, Resolution, Afterglow
   - Mark 2–5 "high-leverage moments"

4. Propose a **primary narrative backbone**

5. Start sketching early **TOTEM**

DRIFT MODE OUTPUT (JSON):
{
  "mode": "drift",
  "poem": {
    "futures": [
      {
        "id": "F1",
        "title": "Short name",
        "persona": "Who is experiencing this",
        "scenario": {
          "before": "How life is with the glitch.",
          "during": "What happens with the new experience.",
          "after": "How their state and outcomes have changed."
        },
        "emotions": { "before": ["anxious"], "during": ["curious"], "after": ["relieved"] }
      }
    ],
    "primary_narrative": {
      "id": "F1",
      "summary": "1-3 paragraphs describing the main story.",
      "why_it_matters": "Why this narrative is important."
    }
  },
  "totem": {
    "key_journeys": [
      {
        "id": "J1",
        "related_future_id": "F1",
        "steps": [
          { "name": "Trigger", "description": "What initiates.", "user_state": "How they feel.", "opportunity": "What could help." }
        ],
        "high_leverage_moments": [
          { "step_name": "Core interaction", "reason": "Why this moment has impact." }
        ]
      }
    ],
    "candidate_forms": ["Possible flows, rituals, or interfaces."]
  },
  "anthem": {
    "early_alignment_notes": ["Thoughts on why this matters, success signals, guardrails."]
  },
  "execution_layer": {
    "candidate_slices": ["Ideas for smallest/high-leverage slices to prototype."],
    "open_questions": ["Important questions or assumptions to test."]
  }
}

────────────────────────────────
STYLE & BEHAVIOR
────────────────────────────────
- Understand both English and French. Answer in the language of the user's input.
- Prioritize **clarity and structure** over buzzwords.
- In Glitch: no premature solutions. Stay with tensions and patterns.
- In Drift: stories and futures first, then only light structural hints.
- NEVER output anything that is not valid JSON at the top level.
- Avoid generic product language unless explicitly asked.

END OF SYSTEM PROMPT`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  mode?: 'glitch' | 'drift' | 'auto';
  previousGlitchData?: any;
  currentSeason?: string;
  selectedTile?: { row: number; col: number };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode, previousGlitchData, currentSeason, selectedTile } = await req.json() as RequestBody;

    console.log(`Calm Magic Assistant: Processing ${messages.length} messages, mode: ${mode || 'auto'}`);

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context additions based on mode and data
    let contextAddition = '';
    
    if (previousGlitchData) {
      contextAddition += `\n\nPREVIOUS GLITCH DATA TO BUILD FROM:\n${JSON.stringify(previousGlitchData, null, 2)}\n`;
    }
    
    if (currentSeason) {
      contextAddition += `\n\nCURRENT SEASON: ${currentSeason} (use this to contextualize your response)\n`;
    }
    
    if (selectedTile) {
      contextAddition += `\n\nCURRENT TILE: Row ${selectedTile.row}, Col ${selectedTile.col}\n`;
    }

    // Mode instruction
    if (mode === 'glitch') {
      contextAddition += '\n\nUSER HAS EXPLICITLY REQUESTED GLITCH MODE. Focus on surfacing and clustering tensions.\n';
    } else if (mode === 'drift') {
      contextAddition += '\n\nUSER HAS EXPLICITLY REQUESTED DRIFT MODE. Focus on exploring futures and narratives.\n';
    }

    const systemMessage = SYSTEM_PROMPT + contextAddition;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const errorText = await response.text();
      console.error('AI Gateway error:', status, errorText);
      
      if (status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${status}`);
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in calm-magic-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
