import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Fragment {
  id: string;
  content: string;
  tags: string[] | null;
  season_context: string | null;
  created_at: string;
}

interface ClusterSuggestion {
  id: string;
  theme: string;
  insight: string;
  confidence: number;
  fragmentIds: string[];
  keywords: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Per-IP rate limit to prevent unauthenticated AI credit abuse.
  const _rl = checkRateLimit(req, { limit: 20, windowMs: 60_000 });
  if (_rl) return _rl;

  try {
    const { fragments } = await req.json() as { fragments: Fragment[] };

    if (!fragments || fragments.length < 3) {
      return new Response(
        JSON.stringify({ 
          clusters: [],
          message: 'Need at least 3 fragments for clustering analysis'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare fragment summaries for AI analysis
    const fragmentSummaries = fragments.slice(0, 100).map((f, i) => 
      `[${f.id}] (${f.season_context || 'unknown'}): ${f.content.slice(0, 300)}${f.tags?.length ? ` [tags: ${f.tags.join(', ')}]` : ''}`
    ).join('\n\n');

    const systemPrompt = `You are a semantic clustering expert analyzing fragments of thought and insight.

Your task is to identify 3-8 meaningful clusters from the provided fragments. Each cluster should:
1. Group semantically related fragments that share themes, concepts, or patterns
2. Have a clear, evocative theme name (2-4 words)
3. Generate a crystallized insight (1-2 sentences) that synthesizes the cluster's core meaning
4. Identify 3-5 keywords that characterize the cluster
5. Assess confidence (0.5-1.0) based on how coherent the cluster is

Focus on finding deep conceptual connections, not just surface-level keyword matches.
Prioritize clusters that could become meaningful NOEMS (conceptual atoms, insight-nuggets).`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze these ${fragments.length} fragments and identify semantic clusters:\n\n${fragmentSummaries}` }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_clusters',
            description: 'Return identified semantic clusters with NOEM suggestions',
            parameters: {
              type: 'object',
              properties: {
                clusters: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', description: 'Unique cluster ID (e.g., cluster_1)' },
                      theme: { type: 'string', description: 'Evocative theme name (2-4 words)' },
                      insight: { type: 'string', description: 'Crystallized insight synthesizing the cluster' },
                      confidence: { type: 'number', description: 'Confidence score 0.5-1.0' },
                      fragmentIds: { type: 'array', items: { type: 'string' }, description: 'IDs of fragments in this cluster' },
                      keywords: { type: 'array', items: { type: 'string' }, description: '3-5 characterizing keywords' }
                    },
                    required: ['id', 'theme', 'insight', 'confidence', 'fragmentIds', 'keywords']
                  }
                }
              },
              required: ['clusters']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'return_clusters' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      
      // Validate and enrich clusters
      const validatedClusters = result.clusters
        .filter((c: ClusterSuggestion) => c.fragmentIds?.length >= 2)
        .map((c: ClusterSuggestion) => ({
          ...c,
          fragmentIds: c.fragmentIds.filter(id => fragments.some(f => f.id === id)),
          confidence: Math.min(1, Math.max(0.5, c.confidence || 0.7))
        }))
        .filter((c: ClusterSuggestion) => c.fragmentIds.length >= 2);

      console.log(`Identified ${validatedClusters.length} valid clusters from ${fragments.length} fragments`);
      
      return new Response(JSON.stringify({ clusters: validatedClusters }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Analyze clusters error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
