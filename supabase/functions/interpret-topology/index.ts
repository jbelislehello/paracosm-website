import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ViewMode = 'isometric' | 'diamond' | 'spiral' | 'charts' | 'coordinates' | 'cycles' | 'flow' | 'projection';

interface TopologyRequest {
  viewMode: ViewMode;
  journeyPath: Array<{ row: number; col: number }>;
  visitedTiles: string[];
  densityMap: Record<string, number>;
  shadowPosition?: { x: number; y: number };
  higherSelfPosition?: { x: number; y: number };
  currentSeason?: string;
  seasonProgress?: Record<string, number>;
  currentUnlockedRing?: number;
}

const VIEW_PROMPTS: Record<ViewMode, { theme: string; focus: string }> = {
  isometric: {
    theme: "spatial exploration and territory mapping",
    focus: "Where the user has explored vs. unexplored regions, clustering patterns, gaps in the landscape, and how their path carves through the 3D space. Consider how Ring levels (1=Inner Core/Calmness, 2=Stretch/Spaciousness, 3=Edge/Openness, 4=Integrator/Freedom) create layers of depth."
  },
  diamond: {
    theme: "creative rhythm between divergence and convergence",
    focus: "How tiles map to Design Thinking phases: Discover (opening possibilities), Define (narrowing focus), Develop (building solutions), Deliver (completing work). Is the user spending time opening or closing? Is there balance or imbalance?"
  },
  spiral: {
    theme: "window of tolerance expansion and capacity growth",
    focus: "How the user has moved from center (Ring 1 Inner Core) outward through Rings. Each ring represents expanded capacity to hold complexity. How much have they grown? Where is their edge?"
  },
  charts: {
    theme: "local navigation charts and atlas mapping",
    focus: "How many of the 64 local charts have been explored. Where are the dense clusters? Which regions remain unmapped? Think of each tile as a chart in an atlas—what story does the collection tell?"
  },
  coordinates: {
    theme: "precise positioning on the toroidal surface",
    focus: "The exact angular position (θ, φ) on the torus. Where horizontal (CHORDS) meets vertical (AGENDAS). Is this a crossroads, an edge, a center? What does this position signify?"
  },
  cycles: {
    theme: "recurring patterns and loop completion",
    focus: "Winding numbers on the torus—how many times has the path wrapped around horizontally (toroidal) vs vertically (poloidal)? Are there completed cycles or broken loops? What keeps recurring?"
  },
  flow: {
    theme: "energy dynamics and momentum attraction",
    focus: "Where energy flows and pools. Look for attractors (tiles visited repeatedly), sinks (where attention gets stuck), sources (where new exploration begins). What's pulling the user forward?"
  },
  projection: {
    theme: "hidden structural connections when flattened",
    focus: "What the journey looks like when unfolded from torus to plane. Tiles that seem far apart may be neighbors when edges connect. What hidden proximities emerge? What structure underlies the path?"
  }
};

function calculateJourneyStats(request: TopologyRequest) {
  const { journeyPath, visitedTiles, densityMap, currentUnlockedRing } = request;
  
  const totalTiles = 64;
  const visitedCount = visitedTiles.length;
  const coverage = Math.round((visitedCount / totalTiles) * 100);
  
  // Calculate quadrant distribution
  const quadrants = { SN: 0, IN: 0, IM: 0, SM: 0 };
  visitedTiles.forEach(tileKey => {
    const [row, col] = tileKey.split('-').map(Number);
    const isNorth = row >= 4;
    const isEast = col >= 4;
    if (isNorth && !isEast) quadrants.SN++;
    else if (isNorth && isEast) quadrants.IN++;
    else if (!isNorth && isEast) quadrants.IM++;
    else quadrants.SM++;
  });
  
  // Calculate density stats
  const densityValues = Object.values(densityMap);
  const avgDensity = densityValues.length > 0 
    ? densityValues.reduce((a, b) => a + b, 0) / densityValues.length 
    : 0;
  const maxDensity = densityValues.length > 0 ? Math.max(...densityValues) : 0;
  
  // Calculate ring distribution
  const ringCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  visitedTiles.forEach(tileKey => {
    const [row, col] = tileKey.split('-').map(Number);
    const distFromCenter = Math.max(Math.abs(row - 3.5), Math.abs(col - 3.5));
    if (distFromCenter <= 1.5) ringCounts[1]++;
    else if (distFromCenter <= 2.5) ringCounts[2]++;
    else if (distFromCenter <= 3.5) ringCounts[3]++;
    else ringCounts[4]++;
  });
  
  return {
    coverage,
    visitedCount,
    totalTiles,
    quadrants,
    avgDensity: avgDensity.toFixed(1),
    maxDensity,
    ringCounts,
    currentRing: currentUnlockedRing || 1,
    pathLength: journeyPath.length
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: TopologyRequest = await req.json();
    const { viewMode, shadowPosition, higherSelfPosition, currentSeason } = request;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const viewConfig = VIEW_PROMPTS[viewMode];
    const stats = calculateJourneyStats(request);
    
    const systemPrompt = `You are an insightful guide interpreting a user's journey through a 64-tile matrix mapped onto a torus surface. The matrix has 8 rows (AGENDAS: Mindsets → Protocols & Architectures) and 8 columns (CHORDS: Chances → Systems).

The journey is about expanding one's Window of Tolerance—building capacity to hold paradox, complexity, and emotion without collapse. There are 4 concentric rings:
- Ring 1 (Inner Core): Calmness, safety, familiar territory
- Ring 2 (Stretch): Spaciousness, gentle expansion
- Ring 3 (Edge): Openness, productive discomfort  
- Ring 4 (Integrator): Freedom, full integration

You speak in metaphors and imagery. Your tone is warm, curious, and evocative—like a wise companion noticing patterns. Avoid jargon. Speak to the heart.`;

    const userPrompt = `Interpret this journey through the "${viewMode}" view.

**View Theme**: ${viewConfig.theme}
**Focus**: ${viewConfig.focus}

**Journey Statistics**:
- Coverage: ${stats.coverage}% (${stats.visitedCount} of ${stats.totalTiles} tiles)
- Current Ring: ${stats.currentRing}
- Path Length: ${stats.pathLength} steps
- Ring Distribution: Inner=${stats.ringCounts[1]}, Stretch=${stats.ringCounts[2]}, Edge=${stats.ringCounts[3]}, Integrator=${stats.ringCounts[4]}
- Quadrant Distribution: SN=${stats.quadrants.SN}, IN=${stats.quadrants.IN}, IM=${stats.quadrants.IM}, SM=${stats.quadrants.SM}
- Average POLEN Density: ${stats.avgDensity} entries/tile
- Max Density: ${stats.maxDensity} entries on one tile
${shadowPosition ? `- Shadow Position: (${shadowPosition.x.toFixed(2)}, ${shadowPosition.y.toFixed(2)})` : ''}
${higherSelfPosition ? `- Higher Self Prophecy: (${higherSelfPosition.x.toFixed(2)}, ${higherSelfPosition.y.toFixed(2)})` : ''}
${currentSeason ? `- Current Season: ${currentSeason}` : ''}

Generate a JSON response with exactly these fields:
{
  "metaphor": "A poetic 1-2 sentence metaphor about what this view reveals about their journey",
  "insight": "A clear 1 sentence insight about what the pattern suggests",
  "question": "A reflective question (1 sentence) for the user to ponder",
  "recommendation": "An optional brief suggestion for what to explore next (1 sentence, or null if not applicable)"
}

Be specific to their actual data. Reference their coverage, ring level, or patterns you notice.`;

    console.log(`[interpret-topology] Generating insight for ${viewMode} view with ${stats.visitedCount} visited tiles`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[interpret-topology] AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error('[interpret-topology] Failed to parse JSON:', content);
      throw new Error('Invalid JSON response from AI');
    }

    console.log(`[interpret-topology] Successfully generated insight for ${viewMode}`);

    return new Response(JSON.stringify({
      viewMode,
      ...parsed,
      stats
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[interpret-topology] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
