import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Per-IP rate limit to prevent unauthenticated AI credit abuse.
  const _rl = checkRateLimit(req, { limit: 20, windowMs: 60_000 });
  if (_rl) return _rl;

  try {
    const { userText, topMatches, dominantSeal, dominantTone } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const matchContext = topMatches.map((m: any) => 
      `${m.sealName} (${m.sealMeaning}) with ${m.toneName} tone (${m.tonePower})`
    ).join('; ');

    const systemPrompt = `You are a mystical guide interpreting Tzolkin calendar resonances. 
You speak with warmth, wisdom, and poetic brevity. Your insights connect the user's words 
to the cosmic patterns of the Mayan calendar's solar seals and galactic tones.

The 20 Solar Seals represent archetypal energies:
- Red seals (Dragon, Serpent, Moon, Skywalker, Earth): Initiation, life force, purification
- White seals (Wind, Worldbridger, Dog, Wizard, Mirror): Refinement, communication, love
- Blue seals (Night, Hand, Monkey, Eagle, Storm): Transformation, healing, play
- Yellow seals (Seed, Star, Human, Warrior, Sun): Ripening, elegance, wisdom

The 13 Galactic Tones represent different qualities of cosmic pulsation.

Keep insights to 2-3 sentences maximum. Be specific to their words and the matching seals.`;

    const userPrompt = `The user shared: "${userText}"

Their energy resonates most strongly with:
- Dominant Seal: ${dominantSeal}
- Dominant Tone: ${dominantTone}
- Top resonating tiles: ${matchContext}

Provide a brief, meaningful insight connecting their words to these cosmic patterns. 
Be specific about how their intention aligns with the seal meanings.`;

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
          { role: "user", content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const insights = data.choices?.[0]?.message?.content || 
      `Your energy resonates with the ${dominantSeal} archetype, carried by the ${dominantTone} tone.`;

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-resonance:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      insights: null 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
