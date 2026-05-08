import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PolenEntry {
  id: string;
  content: string;
  tile_id?: number;
  season_context?: string;
  tags?: string[];
}

interface QuadrantThemes {
  intimacy: number;
  sovereignty: number;
  memory: number;
  novelty: number;
}

interface QuadrantPosition {
  x: number;
  y: number;
}

interface PolenSentiment {
  polenId: string;
  themes: QuadrantThemes;
  dominantTheme: keyof QuadrantThemes;
  emotionalValence: 'positive' | 'negative' | 'neutral' | 'ambivalent';
  keywords: string[];
}

const SENTIMENT_SYSTEM_PROMPT = `You analyze journal entries to detect themes related to four quadrants of human experience. For each entry, score each theme 0-1 based on how strongly present it is.

INTIMACY (y negative): Connection, vulnerability, closeness, relationship, care, bonding, togetherness, we-space, collaboration, heart-centered, empathy, trust, belonging.

SOVEREIGNTY (y positive): Independence, self-direction, boundaries, autonomy, individual agency, self-reliance, personal power, clarity, discernment, leadership, assertiveness, self-governance.

MEMORY (x negative): Continuity, heritage, tradition, anchoring, foundations, what has been, patterns from the past, stability, roots, preservation, lessons learned, grounding, familiarity.

NOVELTY (x positive): Exploration, innovation, risk-taking, newness, experimentation, emergence, what could be, change, creativity, discovery, curiosity, pioneering, transformation.

Also detect:
- Emotional valence: positive, negative, neutral, or ambivalent
- Key thematic keywords (3-5 words)

Respond ONLY with valid JSON matching the required schema.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Per-IP rate limit to prevent unauthenticated AI credit abuse.
  const _rl = checkRateLimit(req, { limit: 20, windowMs: 60_000 });
  if (_rl) return _rl;

  try {
    const { entries, prophecy, structuralFactors } = await req.json() as {
      entries: PolenEntry[];
      prophecy: QuadrantPosition | null;
      structuralFactors?: { completeness: number; coherence: number; depth: number; flow: number };
    };

    console.log('[ANALYZE-TOPOLOGY] Analyzing', entries.length, 'POLEN entries');

    if (!entries || entries.length === 0) {
      return new Response(JSON.stringify({
        signature: {
          structural: structuralFactors || { completeness: 0, coherence: 0, depth: 0, flow: 0 },
          semantic: { intimacy: 0, sovereignty: 0, memory: 0, novelty: 0 },
          inferredPosition: { x: 0, y: 0 },
          inferredQuadrant: 'IM',
          confidence: 0,
          dissonanceFromProphecy: 0,
          dissonanceType: null,
          analyzedAt: new Date().toISOString(),
          polenCount: 0
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare content for analysis (batch entries for efficiency)
    const entriesText = entries.map((e, i) => 
      `[Entry ${i + 1}] (ID: ${e.id})\n${e.content}`
    ).join('\n\n---\n\n');

    const userPrompt = `Analyze these ${entries.length} journal entries and extract quadrant themes for each.

${entriesText}

Return JSON with this exact structure:
{
  "sentiments": [
    {
      "polenId": "entry-id",
      "themes": { "intimacy": 0.0-1.0, "sovereignty": 0.0-1.0, "memory": 0.0-1.0, "novelty": 0.0-1.0 },
      "dominantTheme": "intimacy|sovereignty|memory|novelty",
      "emotionalValence": "positive|negative|neutral|ambivalent",
      "keywords": ["word1", "word2", "word3"]
    }
  ],
  "aggregateProfile": { "intimacy": 0.0-1.0, "sovereignty": 0.0-1.0, "memory": 0.0-1.0, "novelty": 0.0-1.0 },
  "inferredQuadrant": "SN|SM|IN|IM",
  "overallValence": "positive|negative|neutral|ambivalent",
  "patternInsight": "One sentence describing the dominant pattern"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SENTIMENT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ANALYZE-TOPOLOGY] AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';
    
    console.log('[ANALYZE-TOPOLOGY] AI response received');

    // Parse AI response
    let analysisResult;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[ANALYZE-TOPOLOGY] Failed to parse AI response:', parseError);
      // Return default values on parse failure
      analysisResult = {
        sentiments: [],
        aggregateProfile: { intimacy: 0.25, sovereignty: 0.25, memory: 0.25, novelty: 0.25 },
        inferredQuadrant: 'IM',
        patternInsight: 'Unable to analyze content patterns'
      };
    }

    const semantic: QuadrantThemes = analysisResult.aggregateProfile || {
      intimacy: 0.25, sovereignty: 0.25, memory: 0.25, novelty: 0.25
    };

    // Calculate semantic position from themes
    // X-axis: Memory ← → Novelty
    // Y-axis: Intimacy ← → Sovereignty
    const semanticX = semantic.novelty - semantic.memory;
    const semanticY = semantic.sovereignty - semantic.intimacy;

    // Blend structural and semantic for final inference
    const structural = structuralFactors || { completeness: 0, coherence: 0, depth: 0, flow: 0 };
    const structuralX = (structural.completeness * 0.5 + structural.coherence * 0.5) * 2 - 1;
    const structuralY = (structural.depth * 0.5 + structural.flow * 0.5) * 2 - 1;

    // Weighted blend: 50% structural, 50% semantic
    const inferredX = Math.max(-1, Math.min(1, structuralX * 0.5 + semanticX * 0.5));
    const inferredY = Math.max(-1, Math.min(1, structuralY * 0.5 + semanticY * 0.5));

    const inferredPosition: QuadrantPosition = { x: inferredX, y: inferredY };

    // Determine quadrant
    let inferredQuadrant: 'SN' | 'IN' | 'IM' | 'SM';
    if (inferredX >= 0 && inferredY >= 0) inferredQuadrant = 'SN';
    else if (inferredX < 0 && inferredY >= 0) inferredQuadrant = 'SM';
    else if (inferredX < 0 && inferredY < 0) inferredQuadrant = 'IM';
    else inferredQuadrant = 'IN';

    // Calculate confidence based on theme clarity
    const themeValues = Object.values(semantic);
    const maxTheme = Math.max(...themeValues);
    const minTheme = Math.min(...themeValues);
    const confidence = Math.min(1, (maxTheme - minTheme) * 2 + 0.3);

    // Detect dissonance with prophecy
    let dissonanceFromProphecy = 0;
    let dissonanceType: 'aligned' | 'divergent' | 'contradictory' | null = null;
    let aiNudge: string | undefined;

    if (prophecy) {
      // Euclidean distance in quadrant space, normalized to 0-1
      dissonanceFromProphecy = Math.sqrt(
        Math.pow(inferredX - prophecy.x, 2) + 
        Math.pow(inferredY - prophecy.y, 2)
      ) / 2.83; // Max distance is √8 ≈ 2.83

      if (dissonanceFromProphecy < 0.2) {
        dissonanceType = 'aligned';
      } else if (dissonanceFromProphecy < 0.5) {
        dissonanceType = 'divergent';
        aiNudge = `Your actions suggest ${inferredQuadrant} tendencies, while your prophecy points elsewhere. Consider if this is intentional exploration or drift.`;
      } else {
        dissonanceType = 'contradictory';
        aiNudge = `⚠️ High dissonance detected: Your POLEN content strongly suggests ${inferredQuadrant} patterns, contradicting your Higher Self prophecy. This could be a trap—or a call to revise your destination.`;
      }
    }

    const signature = {
      structural,
      semantic,
      inferredPosition,
      inferredQuadrant,
      confidence,
      dissonanceFromProphecy,
      dissonanceType,
      aiNudge,
      analyzedAt: new Date().toISOString(),
      polenCount: entries.length,
      sentiments: analysisResult.sentiments || [],
      patternInsight: analysisResult.patternInsight
    };

    console.log('[ANALYZE-TOPOLOGY] Analysis complete:', {
      inferredQuadrant,
      confidence: confidence.toFixed(2),
      dissonanceType
    });

    return new Response(JSON.stringify({ signature }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[ANALYZE-TOPOLOGY] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
