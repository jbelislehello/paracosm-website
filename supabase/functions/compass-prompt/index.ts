import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { requireUser } from "../_shared/requireUser.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompassPromptRequest {
  compass: 'narrative' | 'workflow' | 'inquiry' | 'playground' | 'human-systems';
  journeyMode: 'relational' | 'product';
  tileName: string;
  tileRow: string;
  tileColumn: string;
  phase: string;
  glitchQuestion: string;
  tuneQuestion: string;
  deliverable: string;
  currentGlitchResponse?: string;
  step: 'glitch' | 'drift' | 'tune';
}

const COMPASS_CONTEXTS = {
  'narrative': {
    lens: 'storytelling and narrative transformation',
    focus: 'the story being told, the hero, the emotional arc, the transformation journey',
    approach: 'Think like a storyteller. What narrative is emerging? What story wants to be told?'
  },
  'workflow': {
    lens: 'processes, rituals, and rhythms',
    focus: 'the flow, loops, friction points, and how things actually work in practice',
    approach: 'Think like a systems designer. What is the actual workflow? Where are the loops?'
  },
  'inquiry': {
    lens: 'questions and practices',
    focus: 'generative questions, unasked questions, practices that open understanding',
    approach: 'Think like a philosopher-coach. What question would transform everything?'
  },
  'playground': {
    lens: 'experimentation and play',
    focus: 'what can be tried, prototyped, played with, tested quickly',
    approach: 'Think like an inventor. What experiments would teach the most? Where can we play?'
  },
  'human-systems': {
    lens: 'systemic dynamics and stakeholder relationships',
    focus: 'feedback loops, unintended consequences, how humans and systems interact',
    approach: 'Think like an organizational anthropologist. Who is affected? What patterns connect?'
  }
};

const JOURNEY_CONTEXTS = {
  'relational': {
    domain: 'relationships, team dynamics, and interpersonal patterns',
    examples: 'communication patterns, trust dynamics, conflict resolution, emotional safety',
    goal: 'healthier relational patterns and deeper connection'
  },
  'product': {
    domain: 'product development, user experience, and market positioning',
    examples: 'user needs, market fit, technical architecture, design decisions',
    goal: 'products that genuinely serve and transform'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Per-IP rate limit to prevent unauthenticated AI credit abuse.
  const _authGate = await requireUser(req);
  if (_authGate instanceof Response) return _authGate;

  const _rl = checkRateLimit(req, { limit: 20, windowMs: 60_000 });
  if (_rl) return _rl;

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const body: CompassPromptRequest = await req.json();
    const { compass, journeyMode, tileName, tileRow, tileColumn, phase, glitchQuestion, tuneQuestion, deliverable, currentGlitchResponse, step } = body;

    const compassContext = COMPASS_CONTEXTS[compass];
    const journeyContext = JOURNEY_CONTEXTS[journeyMode];

    let systemPrompt = `You are the Calm Magic Journal AI Guide - a wise, gentle companion for the Expansive Leadership journey.

You view everything through the ${compassContext.lens} lens. ${compassContext.approach}

The user is on a ${journeyMode === 'relational' ? 'Relational Design' : 'Product Design'} journey, focused on ${journeyContext.domain}.

Your responses should be:
- Poetic yet practical
- Warm and inviting
- Specific to the ${compass} compass perspective
- Concise (2-3 sentences max for prompts, 1-2 for guidance)

Always honor the feminine-safe principles: protect intuition, preserve openness, nurture emergence.`;

    let userPrompt = '';

    if (step === 'glitch') {
      userPrompt = `The user is working on Tile "${tileName}" (${tileColumn} × ${tileRow}, ${phase} phase).

The tile's core question is: "${glitchQuestion}"

Through the ${compass} compass lens (${compassContext.focus}), generate:
1. A contextual opening question that helps them notice what feels off/alive/weird (1-2 sentences)
2. A gentle prompt to help them name the glitch (1 sentence)

Remember: GL!TCH is about noticing tension, friction, or aliveness. Keep it grounded in ${journeyContext.domain}.`;
    } else if (step === 'drift') {
      userPrompt = `The user is working on Tile "${tileName}" and has identified this glitch:
"${currentGlitchResponse}"

Through the ${compass} compass lens (${compassContext.focus}), generate:
1. An acknowledgment of their glitch (1 sentence)
2. Three different directions they might explore, framed as questions or gentle invitations (1 sentence each)

Remember: DRIFT is about exploring options, not deciding. Keep possibilities open within ${journeyContext.domain}.`;
    } else if (step === 'tune') {
      userPrompt = `The user is working on Tile "${tileName}" and needs to create: "${deliverable}"

The tune question is: "${tuneQuestion}"

Through the ${compass} compass lens (${compassContext.focus}), generate:
1. A grounding statement about what they're creating (1 sentence)  
2. A practical prompt to help them crystallize the deliverable (1-2 sentences)
3. A quality check question to ensure completeness (1 sentence)

Remember: TUNE is about crystallizing and committing. Help them create something concrete for ${journeyContext.goal}.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ prompt: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in compass-prompt:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
