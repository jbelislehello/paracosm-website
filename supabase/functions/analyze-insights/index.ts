import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { requireUser } from "../_shared/requireUser.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Entry {
  id: string;
  content: string;
  tags: string[] | null;
  tile_id: number | null;
}

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
    const { entries } = await req.json() as { entries: Entry[] };

    if (!entries || entries.length < 2) {
      return new Response(
        JSON.stringify({ nodes: [], links: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const entriesText = entries.map((e, i) => 
      `[${e.id}] (Tile ${e.tile_id || 'unknown'}): ${e.content.slice(0, 200)}`
    ).join('\n');

    const systemPrompt = `You analyze insight entries and find semantic connections between them.

For each entry, determine:
1. Its conceptual group (0-9 based on theme)
2. Its importance (0-1)

For pairs of entries that share concepts, themes, or ideas, create connections.

Return a JSON object with:
- nodes: array of { id: string, content: string, tile_id: number|null, group: number, importance: number }
- links: array of { source: string (id), target: string (id), strength: number (0-1), relationship: string }

Only create links for genuinely related entries. Be selective.`;

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
          { role: 'user', content: `Analyze these entries for connections:\n\n${entriesText}` }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_graph',
            description: 'Return the insight connection graph',
            parameters: {
              type: 'object',
              properties: {
                nodes: { 
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      content: { type: 'string' },
                      tile_id: { type: 'number' },
                      group: { type: 'number' },
                      importance: { type: 'number' }
                    },
                    required: ['id', 'content', 'group', 'importance']
                  }
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      source: { type: 'string' },
                      target: { type: 'string' },
                      strength: { type: 'number' },
                      relationship: { type: 'string' }
                    },
                    required: ['source', 'target', 'strength', 'relationship']
                  }
                }
              },
              required: ['nodes', 'links']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'return_graph' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const graph = JSON.parse(toolCall.function.arguments);
      
      // Enrich nodes with original content
      graph.nodes = graph.nodes.map((node: any) => {
        const original = entries.find(e => e.id === node.id);
        return {
          ...node,
          content: original?.content || node.content,
          tile_id: original?.tile_id || node.tile_id
        };
      });
      
      return new Response(JSON.stringify(graph), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Analyze insights error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
