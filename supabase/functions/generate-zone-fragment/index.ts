import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { requireUser } from "../_shared/requireUser.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Zone type descriptions for prompting
const ZONE_TYPE_CONTEXT: Record<string, string> = {
  gap: "an unexplored or empty region, representing potential waiting to be discovered",
  cluster: "a dense area of activity or insights, where attention has concentrated",
  boundary: "a threshold between states, marking a transition or expansion point",
  attractor: "a gravitational center where energy and attention naturally flow",
  connection: "a hidden link between seemingly separate areas",
  transition: "a pivotal moment of transformation between phases"
};

// View mode context for generating relevant fragments
const VIEW_MODE_CONTEXT: Record<string, string> = {
  isometric: "a 3D grid showing the innovation landscape as a traversable terrain",
  spiral: "an expanding spiral representing the window of tolerance growth from center outward",
  diamond: "the double-diamond design thinking phases (Discover, Define, Develop, Deliver)",
  flow: "a flow field showing where attention and energy naturally gather and disperse",
  projection: "an unfolded view revealing hidden connections between tiles",
  cycles: "fundamental cycles showing loops of learning and iteration",
  coordinates: "a coordinate system mapping sovereignty/intimacy against memory/novelty",
  charts: "manifold charts showing the topology of understanding"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Per-IP rate limit to prevent unauthenticated AI credit abuse.
  const _authGate = await requireUser(req);
  if (_authGate instanceof Response) return _authGate;

  const _rl = checkRateLimit(req, { limit: 20, windowMs: 60_000 });
  if (_rl) return _rl;

  try {
    const { zoneId, zoneType, zoneLabel, viewMode, coverage, journeyLength } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const zoneContext = ZONE_TYPE_CONTEXT[zoneType] || "a mysterious region";
    const viewContext = VIEW_MODE_CONTEXT[viewMode] || "the innovation journey";
    
    const coveragePercent = Math.round(coverage * 100);
    
    const prompt = `You are revealing a mystery about a specific region in someone's innovation journey.

Context:
- Zone: "${zoneLabel}" (${zoneContext})
- View: ${viewContext}
- Journey Progress: ${coveragePercent}% coverage, ${journeyLength} steps taken

Generate a single evocative sentence (20-35 words) that:
- Speaks mysteriously about what this specific region holds or means
- References the zone's nature (${zoneType}) metaphorically
- Offers an insight or invitation without judgment
- Uses poetic but accessible language
- Feels like discovering a hidden truth

Examples of good fragments:
- "The northwest corner lies untouched—not forgotten, but perhaps protected. What wisdom waits where you haven't yet walked?"
- "Here, your attention pools like water finding its level. The depth suggests something worth returning to."
- "This threshold marks where comfort ends and possibility begins. You've circled it three times already."

Respond with ONLY the fragment text, no quotes or explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const fragment = data.choices?.[0]?.message?.content?.trim() || 
      "A mystery awaits discovery here...";

    console.log(`Generated fragment for zone ${zoneId}:`, fragment);

    return new Response(
      JSON.stringify({ fragment }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating zone fragment:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        fragment: "The mist clears, revealing a truth yet to be understood..." 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
