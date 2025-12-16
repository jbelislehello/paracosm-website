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

// Story themes and mysteries for each view
const VIEW_STORY_CONFIG: Record<ViewMode, { 
  storyTitle: string;
  mysteryType: string;
  openingPrompt: string;
  chapterThemes: string[];
}> = {
  isometric: {
    storyTitle: "The Map of Your Exploration",
    mysteryType: "spatial mystery",
    openingPrompt: "What territories have you claimed? What lands remain in shadow?",
    chapterThemes: ["The Territory Claimed", "The Boundaries You Set", "The Unknown Beyond"]
  },
  diamond: {
    storyTitle: "The Dance of Opening and Closing",
    mysteryType: "creative rhythm mystery", 
    openingPrompt: "Are you expanding possibilities or narrowing to clarity?",
    chapterThemes: ["The Breath of Discovery", "The Moment of Definition", "The Pulse of Creation"]
  },
  spiral: {
    storyTitle: "The Growing Circle of What You Can Hold",
    mysteryType: "capacity mystery",
    openingPrompt: "How much more can you embrace than when you began?",
    chapterThemes: ["The Seed of Calm", "The Expansion of Spaciousness", "The Edge of New Freedom"]
  },
  charts: {
    storyTitle: "The Atlas You Are Drawing",
    mysteryType: "cartography mystery",
    openingPrompt: "What charts have you drawn? What remains uncharted?",
    chapterThemes: ["The Charts You've Drawn", "The Patterns in Your Maps", "The Territory Calling"]
  },
  coordinates: {
    storyTitle: "Where You Stand Right Now",
    mysteryType: "location mystery",
    openingPrompt: "This precise point—why here? Why now?",
    chapterThemes: ["The Crossroads You've Reached", "The Meaning of This Place", "The Direction You Face"]
  },
  cycles: {
    storyTitle: "What Keeps Coming Back",
    mysteryType: "recurrence mystery",
    openingPrompt: "What patterns circle back to find you?",
    chapterThemes: ["The Loops You've Traced", "The Incomplete Circles", "The Cycle Seeking Closure"]
  },
  flow: {
    storyTitle: "Where Your Attention Flows",
    mysteryType: "momentum mystery",
    openingPrompt: "What pulls you? What releases you?",
    chapterThemes: ["The Attractors in Your Field", "The Currents of Your Journey", "The Flow Awaiting You"]
  },
  projection: {
    storyTitle: "The Connections You Cannot See",
    mysteryType: "hidden structure mystery",
    openingPrompt: "What neighbors hide when the surface unfolds?",
    chapterThemes: ["The Hidden Proximities", "The Structure Beneath", "The Connections Emerging"]
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

  // Detect gaps and clustering
  const gaps: string[] = [];
  const clusters: string[] = [];
  
  // Simple gap detection - quadrants with 0 or very few tiles
  Object.entries(quadrants).forEach(([q, count]) => {
    if (count === 0) gaps.push(q);
    else if (count >= 8) clusters.push(q);
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
    pathLength: journeyPath.length,
    gaps,
    clusters
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
    
    const viewConfig = VIEW_STORY_CONFIG[viewMode];
    const stats = calculateJourneyStats(request);
    
    const systemPrompt = `You are a mystical guide revealing hidden stories within a user's innovation journey. The journey takes place on a 64-tile matrix (8 rows × 8 columns) mapped onto a torus—a donut-shaped surface where edges connect.

The journey is about expanding one's Window of Tolerance—building capacity to hold paradox, complexity, and emotion without collapse. There are 4 concentric rings:
- Ring 1 (Inner Core): Calmness, safety, familiar territory
- Ring 2 (Stretch): Spaciousness, gentle expansion  
- Ring 3 (Edge): Openness, productive discomfort
- Ring 4 (Integrator): Freedom, full integration

You speak like an ancient storyteller revealing secrets. Your tone is evocative, mysterious, and warm—drawing the reader deeper into discovery. Use metaphors and imagery. Never use jargon.

CRITICAL: You must respond with valid JSON only. No markdown, no explanation outside JSON.`;

    const userPrompt = `Create an interactive story for the "${viewMode}" topology view.

**Story Type**: ${viewConfig.storyTitle}
**Mystery Theme**: ${viewConfig.mysteryType}
**Opening Question**: ${viewConfig.openingPrompt}
**Chapter Themes**: ${viewConfig.chapterThemes.join(', ')}

**Journey Data**:
- Coverage: ${stats.coverage}% (${stats.visitedCount}/${stats.totalTiles} tiles)
- Current Ring: ${stats.currentRing}
- Path Length: ${stats.pathLength} steps
- Ring Distribution: Inner=${stats.ringCounts[1]}, Stretch=${stats.ringCounts[2]}, Edge=${stats.ringCounts[3]}, Integrator=${stats.ringCounts[4]}
- Quadrant Distribution: SN=${stats.quadrants.SN}, IN=${stats.quadrants.IN}, IM=${stats.quadrants.IM}, SM=${stats.quadrants.SM}
- Gaps (unexplored quadrants): ${stats.gaps.length > 0 ? stats.gaps.join(', ') : 'none detected'}
- Clusters (high activity): ${stats.clusters.length > 0 ? stats.clusters.join(', ') : 'none detected'}
- Avg POLEN Density: ${stats.avgDensity}
${shadowPosition ? `- Shadow Position: (${shadowPosition.x.toFixed(2)}, ${shadowPosition.y.toFixed(2)})` : ''}
${higherSelfPosition ? `- Higher Self Prophecy: (${higherSelfPosition.x.toFixed(2)}, ${higherSelfPosition.y.toFixed(2)})` : ''}
${currentSeason ? `- Current Season: ${currentSeason}` : ''}

Generate a JSON response with this EXACT structure:
{
  "opening_mystery": "An intriguing 1-2 sentence question that draws the user in (reference their data)",
  "chapters": [
    {
      "title": "${viewConfig.chapterThemes[0]}",
      "content": "A 2-3 sentence revelation about what their data shows. Be specific to their actual numbers.",
      "discovery_type": "pattern"
    },
    {
      "title": "${viewConfig.chapterThemes[1]}",
      "content": "A 2-3 sentence deeper insight revealing something unexpected or hidden.",
      "discovery_type": "strength"
    },
    {
      "title": "${viewConfig.chapterThemes[2]}",
      "content": "A 2-3 sentence revelation pointing to what's emerging or what lies ahead.",
      "discovery_type": "shadow"
    }
  ],
  "key_revelation": "A powerful 1-2 sentence synthesis that ties everything together",
  "invitation": "A single question inviting the user to take action based on this insight"
}

Be specific. Reference their actual coverage (${stats.coverage}%), ring level (${stats.currentRing}), gaps, or clusters.`;

    console.log(`[interpret-topology] Generating story for ${viewMode} view with ${stats.visitedCount} visited tiles`);

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

    console.log(`[interpret-topology] Successfully generated story for ${viewMode}`);

    return new Response(JSON.stringify({
      viewMode,
      storyTitle: viewConfig.storyTitle,
      mysteryType: viewConfig.mysteryType,
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
