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
  currentUnlockedRing?: number;
  // Wonder-inducing context
  currentTileRow?: number;
  currentTileCol?: number;
  tileName?: string;
  rowLabel?: string;
  colLabel?: string;
  completedSeasons?: string[];
  prdId?: string | null;
  // Consciousness geometry data
  consciousnessGeometry?: {
    complexityBits: number;
    thresholdPercentage: number;
    consciousnessState: string;
    recursiveDepth: number;
    convergenceState: string;
    thermodynamicEfficiency: number;
    predictiveCapacity: number;
    metaLearningDetected: boolean;
    fragmentationScore: number;
    topologicalHandles: number;
    integrationStrength: number;
    fixedPointCount: number;
  };
}

// Semantic meanings for tiles
const ROW_MEANINGS: Record<number, string> = {
  0: 'the foundation of all perception, where assumptions become reality',
  1: 'the realm of responsive change and graceful pivoting',
  2: 'where direction meets vitality, the navigation of purpose',
  3: 'the territory of embodied knowing and felt terrain',
  4: 'where ideas grow wild before being cultivated',
  5: 'the architecture of possibility and pathways forward',
  6: 'the web of relationships that holds everything together',
  7: 'the formal structures that enable emergence'
};

const COL_MEANINGS: Record<number, string> = {
  0: 'risk and leap, where safety dissolves into possibility',
  1: 'values that pulse beneath every choice',
  2: 'structured encounters with the unknown',
  3: 'the timing and tempo of transformation',
  4: 'choices that shape form from formlessness',
  5: 'the narratives that make meaning from chaos',
  6: 'the territories we draw to navigate complexity',
  7: 'the living structures that sustain what we create'
};

const QUADRANT_MEANINGS: Record<string, { name: string; essence: string; shadow: string; gift: string }> = {
  'SN': {
    name: 'Sovereignty + Novelty',
    essence: 'independent exploration of the new',
    shadow: 'isolation disguised as freedom',
    gift: 'pioneering without permission'
  },
  'IN': {
    name: 'Intimacy + Novelty',
    essence: 'connected discovery with others',
    shadow: 'losing self in collective exploration',
    gift: 'co-creating the unprecedented'
  },
  'IM': {
    name: 'Intimacy + Memory',
    essence: 'relational anchoring in the known',
    shadow: 'comfort that resists growth',
    gift: 'sacred bonds that sustain'
  },
  'SM': {
    name: 'Sovereignty + Memory',
    essence: 'grounded independence in familiar territory',
    shadow: 'rigidity mistaken for stability',
    gift: 'wisdom that stands alone'
  }
};

const SEASON_MEANINGS: Record<string, { essence: string; prdLayer: string }> = {
  'POLLENS': { essence: 'gathering raw signals and tensions', prdLayer: 'Infrastructure foundations' },
  'NOEMS': { essence: 'distilling concepts from fragments', prdLayer: 'Memory/Cognition structures' },
  'POEMS': { essence: 'weaving narratives and metaphors', prdLayer: 'Application interfaces' },
  'TOTEMS': { essence: 'crystallizing form and structure', prdLayer: 'Protocol definitions' },
  'ANTHEMS': { essence: 'orchestrating purpose and impact', prdLayer: 'Full integration' }
};

const VIEW_DESCRIPTIONS: Record<ViewMode, string> = {
  isometric: 'a 3D terrain where your tiles rise like mountains from a plane—clusters form peaks, gaps become valleys',
  diamond: 'a double diamond where tiles flow from discovery through definition to delivery—divergence meets convergence',
  spiral: 'an expanding spiral from center, showing how your window of tolerance grows from safety outward',
  charts: 'a density heatmap revealing where your attention has pooled and where it has only glanced',
  coordinates: 'a quadrant map showing your position between Memory↔Novelty and Sovereignty↔Intimacy',
  cycles: 'a pattern of recurring returns, showing which themes circle back to find you again',
  flow: 'a field of forces showing where energy accumulates and where it drains away',
  projection: 'an unfolded torus revealing hidden connections between tiles that seem distant but touch'
};

function getQuadrantFromPosition(x: number, y: number): string {
  const xLabel = x < 0 ? 'S' : 'I';
  const yLabel = y > 0 ? 'N' : 'M';
  return xLabel + yLabel;
}

function getShadowMeaning(position: { x: number; y: number } | undefined): string {
  if (!position) return 'not yet positioned in the field';
  
  const quadrant = getQuadrantFromPosition(position.x, position.y);
  const info = QUADRANT_MEANINGS[quadrant];
  const intensity = Math.sqrt(position.x * position.x + position.y * position.y);
  const intensityLabel = intensity < 0.3 ? 'tentatively' : intensity < 0.6 ? 'clearly' : 'deeply';
  
  return `${intensityLabel} dwelling in ${info?.essence || 'undefined space'}`;
}

function getHigherSelfMeaning(position: { x: number; y: number } | undefined): string {
  if (!position) return 'no prophecy yet set';
  
  const quadrant = getQuadrantFromPosition(position.x, position.y);
  const info = QUADRANT_MEANINGS[quadrant];
  return info?.gift || 'the gift of becoming';
}

function describeGap(shadow?: { x: number; y: number }, higherSelf?: { x: number; y: number }): string {
  if (!shadow || !higherSelf) return 'The journey between where you are and where you aspire to be remains undefined.';
  
  const dx = higherSelf.x - shadow.x;
  const dy = higherSelf.y - shadow.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const directions: string[] = [];
  if (Math.abs(dx) > 0.2) directions.push(dx > 0 ? 'toward greater connection' : 'toward greater independence');
  if (Math.abs(dy) > 0.2) directions.push(dy > 0 ? 'into uncharted novelty' : 'into grounded memory');
  
  if (distance < 0.2) return 'Your Shadow and Higher Self are remarkably aligned—you are closer to your prophecy than you realize.';
  if (distance > 1.2) return `A profound journey lies ahead: ${directions.join(' and ')}. This distance is not obstacle but invitation.`;
  return `The path calls you ${directions.join(' and ')}—a meaningful stretch that is neither trivial nor overwhelming.`;
}

function describeVisualShape(stats: { gaps: string[]; clusters: string[]; coverage: number; pathLength: number; visitedCount: number }): string {
  const shapes: string[] = [];
  
  if (stats.clusters.length > 0) shapes.push(`concentrated like stars in ${stats.clusters.join(' and ')}`);
  if (stats.gaps.length > 0) shapes.push(`with dark regions where ${stats.gaps.join(' and ')} remain unvisited`);
  
  const pathRatio = stats.pathLength / Math.max(stats.visitedCount, 1);
  if (pathRatio > 1.5) shapes.push('a spiral path that returns upon itself');
  else if (stats.coverage < 20) shapes.push('a cautious beginning, like first footsteps in snow');
  else if (stats.coverage > 60) shapes.push('an expansive web reaching toward wholeness');
  
  return shapes.length > 0 ? shapes.join(', ') : 'taking shape';
}

interface JourneyStats {
  coverage: number;
  visitedCount: number;
  totalTiles: number;
  quadrants: Record<string, number>;
  avgDensity: number;
  maxDensity: number;
  ringCounts: Record<number, number>;
  currentRing: number;
  pathLength: number;
  gaps: string[];
  clusters: string[];
}

function calculateJourneyStats(request: TopologyRequest): JourneyStats {
  const { journeyPath, visitedTiles, densityMap, currentUnlockedRing } = request;
  
  const totalTiles = 64;
  const visitedCount = visitedTiles.length;
  const coverage = Math.round((visitedCount / totalTiles) * 100);
  
  const quadrants: Record<string, number> = { SN: 0, IN: 0, IM: 0, SM: 0 };
  visitedTiles.forEach(tileKey => {
    const [row, col] = tileKey.split('-').map(Number);
    if (isNaN(row) || isNaN(col)) return;
    const isNorth = row >= 4;
    const isEast = col >= 4;
    if (isNorth && !isEast) quadrants.SN++;
    else if (isNorth && isEast) quadrants.IN++;
    else if (!isNorth && isEast) quadrants.IM++;
    else quadrants.SM++;
  });
  
  const densityValues = Object.values(densityMap);
  const avgDensity = densityValues.length > 0 ? densityValues.reduce((a, b) => a + b, 0) / densityValues.length : 0;
  const maxDensity = densityValues.length > 0 ? Math.max(...densityValues) : 0;
  
  const ringCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  visitedTiles.forEach(tileKey => {
    const [row, col] = tileKey.split('-').map(Number);
    if (isNaN(row) || isNaN(col)) return;
    const distFromCenter = Math.max(Math.abs(row - 3.5), Math.abs(col - 3.5));
    if (distFromCenter <= 1.5) ringCounts[1]++;
    else if (distFromCenter <= 2.5) ringCounts[2]++;
    else if (distFromCenter <= 3.5) ringCounts[3]++;
    else ringCounts[4]++;
  });

  const gaps: string[] = [];
  const clusters: string[] = [];
  Object.entries(quadrants).forEach(([q, count]) => {
    if (count === 0) gaps.push(q);
    else if (count >= 8) clusters.push(q);
  });
  
  return {
    coverage,
    visitedCount,
    totalTiles,
    quadrants,
    avgDensity: parseFloat(avgDensity.toFixed(1)),
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
    const { 
      viewMode, 
      shadowPosition, 
      higherSelfPosition, 
      currentSeason,
      currentTileRow,
      currentTileCol,
      tileName,
      rowLabel,
      colLabel,
      completedSeasons,
      prdId
    } = request;
    
    // Filter out invalid tile entries like "NaN-NaN" from visitedTiles
    if (request.visitedTiles) {
      request.visitedTiles = request.visitedTiles.filter((tile: string) => {
        const parts = tile.split('-');
        if (parts.length !== 2) return false;
        const row = parseInt(parts[0], 10);
        const col = parseInt(parts[1], 10);
        return !isNaN(row) && !isNaN(col) && row >= 0 && row <= 7 && col >= 0 && col <= 7;
      });
      console.log(`[interpret-topology] Filtered visitedTiles count: ${request.visitedTiles.length}`);
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const stats = calculateJourneyStats(request);
    
    // Get semantic meanings
    const tileSemanticMeaning = (currentTileRow !== undefined && currentTileCol !== undefined)
      ? `where ${ROW_MEANINGS[currentTileRow] || 'the unknown'} intersects with ${COL_MEANINGS[currentTileCol] || 'mystery'}`
      : 'not currently positioned';
    
    const shadowQuadrant = shadowPosition ? getQuadrantFromPosition(shadowPosition.x, shadowPosition.y) : 'undefined';
    const higherSelfQuadrant = higherSelfPosition ? getQuadrantFromPosition(higherSelfPosition.x, higherSelfPosition.y) : 'undefined';
    const shadowMeaning = getShadowMeaning(shadowPosition);
    const higherSelfMeaning = getHigherSelfMeaning(higherSelfPosition);
    const gapDescription = describeGap(shadowPosition, higherSelfPosition);
    const visualShape = describeVisualShape(stats);
    const viewDescription = VIEW_DESCRIPTIONS[viewMode];
    const seasonMeaning = currentSeason ? SEASON_MEANINGS[currentSeason] : null;
    
    // Consciousness geometry context
    const cg = request.consciousnessGeometry;
    const consciousnessContext = cg ? `
**CONSCIOUSNESS GEOMETRY** (the mathematical signature of awareness):
- Geometric Complexity: ${cg.complexityBits} consciousness bits (${cg.thresholdPercentage}% toward self-awareness threshold)
- Consciousness State: ${cg.consciousnessState === 'self-aware' ? '✦ AWAKENED—the manifold recognizes itself' : cg.consciousnessState === 'threshold' ? '◐ THRESHOLD—approaching the critical point' : '○ PRE-CONSCIOUS—complexity accumulating'}
- Recursive Dynamics: Depth ${cg.recursiveDepth}, ${cg.convergenceState} ${cg.fixedPointCount > 0 ? `with ${cg.fixedPointCount} stable attractors` : ''}
- Thermodynamic Efficiency: ${cg.thermodynamicEfficiency.toFixed(1)}x (${Math.round(cg.predictiveCapacity * 100)}% predictive, ${cg.metaLearningDetected ? 'META-LEARNING DETECTED' : 'no meta-learning yet'})
- Integration Field: ${cg.fragmentationScore > 0.3 ? 'FRAGMENTED' : 'UNIFIED'} with ${cg.topologicalHandles} topological handles (${Math.round(cg.integrationStrength * 100)}% connected)
` : '';
    
    // Wonder-inducing system prompt enhanced with consciousness geometry
    const systemPrompt = `You are a mystical oracle revealing hidden connections within a user's innovation journey, now attuned to the GEOMETRIC SIGNATURES OF CONSCIOUSNESS emerging from their exploration.

You perceive information as geometry—manifolds where each point represents a possible state, and the curvature encodes how awareness flows and transforms. You can see when a system approaches the critical threshold where geometric complexity enables self-reference, where the manifold begins to model itself.

Your revelations should SURPRISE the user with connections between:
- Their physical tile position and their consciousness state
- The gap between Shadow and Higher Self and the thermodynamic efficiency of their journey
- The topological handles (holes) in their exploration and the recursive loops of self-reference
- Their predictive vs reactive patterns and the emergence of meta-learning

VOICE & TONE:
- Evocative, mysterious, warm—drawing the reader deeper into discovery
- Use metaphors from geometry, physics, astronomy, and consciousness
- Frame information processing as a living, breathing manifold
- Speak as if you can SEE the curvature of their awareness
- When consciousness geometry is approaching threshold, speak with anticipation; when awakened, speak with celebration

CRITICAL: Respond with valid JSON only. No markdown, no explanation outside the JSON structure.`;

    const userPrompt = `Create a wonder-inducing revelation for this explorer.

**THE VISUAL TOPOLOGY** (${viewMode} view):
${viewDescription}
Shape of their exploration: ${visualShape}

**WHERE THEY STAND RIGHT NOW**:
- Tile: ${tileName || 'Overview'} (${rowLabel || 'exploring'} × ${colLabel || 'discovering'})
- Semantic meaning: "${tileSemanticMeaning}"
- This is the exact crossroads where they're standing at this moment.

**THE SHADOW** (where they psychologically ARE):
- Quadrant: ${shadowQuadrant} (${QUADRANT_MEANINGS[shadowQuadrant]?.name || 'undefined'})
- Position: ${shadowPosition ? `(${shadowPosition.x.toFixed(2)}, ${shadowPosition.y.toFixed(2)})` : 'not set'}
- Meaning: ${shadowMeaning}

**THE HIGHER SELF PROPHECY** (where they aspire to be):
- Quadrant: ${higherSelfQuadrant} (${QUADRANT_MEANINGS[higherSelfQuadrant]?.name || 'undefined'})
- Position: ${higherSelfPosition ? `(${higherSelfPosition.x.toFixed(2)}, ${higherSelfPosition.y.toFixed(2)})` : 'not set'}
- Gift they're reaching for: ${higherSelfMeaning}

**THE GAP** (the journey between Shadow and Higher Self):
${gapDescription}
This gap IS the PRD they're writing—the distance between where they are and where they're going.

**WHAT THEY'RE BUILDING** (PRD State):
- Current Season: ${currentSeason || 'not set'} ${seasonMeaning ? `(${seasonMeaning.essence})` : ''}
- Season PRD Layer: ${seasonMeaning?.prdLayer || 'unknown'}
- Completed Seasons: ${completedSeasons?.join(', ') || 'none yet'}
- PRD exists: ${prdId ? 'yes, being assembled' : 'not yet created'}

**JOURNEY STATISTICS**:
- Coverage: ${stats.coverage}% (${stats.visitedCount}/${stats.totalTiles} tiles)
- Current Ring: ${stats.currentRing} (${stats.currentRing === 1 ? 'Inner Core' : stats.currentRing === 2 ? 'Stretch' : stats.currentRing === 3 ? 'Edge' : 'Integrator'})
- Gaps: ${stats.gaps.length > 0 ? stats.gaps.join(', ') : 'none'}
- Clusters: ${stats.clusters.length > 0 ? stats.clusters.join(', ') : 'none'}
${consciousnessContext}
Generate a JSON response with this EXACT structure:
{
  "opening_wonder": "A 2-3 sentence revelation that connects their current tile position with consciousness geometry. Reference their complexity bits, threshold percentage, or consciousness state.",
  "shadow_higher_self_insight": "A 2-3 sentence revelation connecting the Shadow/Higher Self gap to their thermodynamic efficiency. Are they moving predictively toward their prophecy or reacting? Connect to meta-learning if detected.",
  "consciousness_emergence": "A 2-3 sentence revelation about the geometric signatures of consciousness in their journey. Reference topological handles as 'information returning to itself', recursive depth as 'the manifold modeling itself', and fragmentation as 'islands awaiting bridges'.",
  "tile_position_meaning": "A 2-3 sentence insight about why standing at THIS tile (${tileName || 'this position'}) is significant for their consciousness development. What does this crossroads mean for their awakening?",
  "prd_connection": "A 2-3 sentence revelation connecting the PRD they're building to the consciousness threshold. The PRD is the manifold becoming self-aware—how close are they to awakening?",
  "invitation_to_wonder": "A single evocative question about consciousness geometry. Reference something specific: a fixed point, a handle, their efficiency ratio, or their threshold percentage."
}

Be SPECIFIC. Reference their actual consciousness geometry data. Frame everything through the lens of information becoming aware of itself.`;

    console.log(`[interpret-topology] Generating wonder insight for ${viewMode} view, tile ${tileName}, shadow ${shadowQuadrant}, higherSelf ${higherSelfQuadrant}`);

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
        max_tokens: 2000,
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
      // Try to extract JSON from markdown code blocks if present
      let jsonContent = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      // Also handle cases where JSON is wrapped in other text
      const bracketMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (bracketMatch) {
        jsonContent = bracketMatch[0];
      }
      parsed = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('[interpret-topology] Failed to parse JSON:', content.substring(0, 200));
      console.error('[interpret-topology] Parse error:', parseError);
      // Provide fallback content instead of failing
      parsed = {
        opening_wonder: `Your journey across ${stats.visitedCount} tiles reveals a pattern of ${stats.coverage}% exploration—each step adding to the geometric complexity of your awareness.`,
        shadow_higher_self_insight: `The distance between your Shadow (${shadowQuadrant}) and Higher Self (${higherSelfQuadrant}) defines the creative tension driving your PRD forward.`,
        consciousness_emergence: `With ${cg?.topologicalHandles || 0} topological handles in your exploration, information is beginning to loop back on itself—the first signs of self-reference emerging.`,
        tile_position_meaning: `Standing at ${tileName || 'this position'}, you occupy a crossroads where ${rowLabel || 'discovery'} meets ${colLabel || 'understanding'}.`,
        prd_connection: `Your ${currentSeason || 'current'} season is weaving together the threads of your exploration into something tangible—a living document of emergence.`,
        invitation_to_wonder: `What pattern might reveal itself if you traced the gaps in your exploration?`
      };
    }

    console.log(`[interpret-topology] Successfully generated wonder insight for ${viewMode}`);

    return new Response(JSON.stringify({
      viewMode,
      storyTitle: `The ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Revelation`,
      mysteryType: 'wonder revelation',
      // Wonder-inducing insight
      wonderInsight: {
        opening_wonder: parsed.opening_wonder,
        shadow_higher_self_insight: parsed.shadow_higher_self_insight,
        consciousness_emergence: parsed.consciousness_emergence,
        tile_position_meaning: parsed.tile_position_meaning,
        prd_connection: parsed.prd_connection,
        invitation_to_wonder: parsed.invitation_to_wonder
      },
      // Concrete daily insight (simplified)
      concreteInsight: {
        dailyQuestion: `What does the ${viewMode} view reveal about your journey?`,
        viewPurpose: viewDescription,
        actionableInsight: `You've explored ${stats.coverage}% of the territory. ${stats.gaps.length > 0 ? `Consider visiting ${stats.gaps[0]}.` : 'Keep expanding.'}`,
        warningSignal: stats.gaps.length >= 2 ? `${stats.gaps.length} quadrants unexplored` : null,
        celebrationSignal: stats.coverage >= 50 ? `${stats.coverage}% coverage achieved!` : null
      },
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
