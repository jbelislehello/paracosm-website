import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Entry {
  content: string;
  tags: string[] | null;
  tile_id: number | null;
  created_at: string;
}

interface HexagramCorrelation {
  number: number;
  name: string;
  chineseName: string;
  meaning: string;
  upperTrigram: string;
  lowerTrigram: string;
  tileCount: number;
  keywords: string[];
}

interface HexagramData {
  dominant: HexagramCorrelation[];
  trigramNarrative: string;
  cosmicPattern: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries, currentSeason, hexagramData } = await req.json() as { 
      entries: Entry[];
      currentSeason: string;
      hexagramData?: HexagramData;
    };

    if (!entries || entries.length === 0) {
      return new Response(
        JSON.stringify({ 
          themes: [], 
          keyInsights: [], 
          nextAreas: [], 
          connections: [],
          hexagramInterpretation: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const entriesText = entries.map((e, i) => 
      `Entry ${i + 1} (Tile ${e.tile_id || 'unknown'}, ${e.created_at}):\n${e.content}\nTags: ${e.tags?.join(', ') || 'none'}`
    ).join('\n\n');

    // Build hexagram context if available
    let hexagramContext = '';
    if (hexagramData && hexagramData.dominant.length > 0) {
      hexagramContext = `

I CHING HEXAGRAM CORRELATIONS:
${hexagramData.dominant.map((h, i) => 
  `${i + 1}. Hexagram ${h.number} - ${h.name} (${h.chineseName}): "${h.meaning}"
   Trigrams: ${h.upperTrigram} over ${h.lowerTrigram}
   Keywords: ${h.keywords.join(', ')}
   Appears in ${h.tileCount} tile(s)`
).join('\n')}

${hexagramData.trigramNarrative ? `Trigram Dynamic: ${hexagramData.trigramNarrative}` : ''}
${hexagramData.cosmicPattern ? `Cosmic Pattern Detected: ${hexagramData.cosmicPattern}` : ''}

When analyzing, weave the I Ching hexagram meanings into your interpretation. 
Look for how the hexagram energies (creative/receptive, fire/water, etc.) 
reflect or illuminate patterns in the user's journey entries.
Connect the trigram dynamics to the emotional or creative states expressed.`;
    }

    const systemPrompt = `You are an insight synthesizer for the Calm Magic Board journey system.
Analyze the user's journey entries and extract meaningful patterns.

Current Season: ${currentSeason}
${hexagramContext}

Respond with a JSON object containing:
- themes: array of 3-5 key themes across entries
- keyInsights: array of objects with { text: string, importance: number (0-1) }
- nextAreas: array of 2-3 suggested exploration areas
- connections: array of { from: string, to: string, relationship: string } showing cross-tile connections
${hexagramData ? '- hexagramInterpretation: object with { narrative: string (2-3 sentences weaving hexagram meanings into journey patterns), resonantHexagram: number (which hexagram most illuminates this journey), guidance: string (I Ching inspired guidance for next steps) }' : ''}

Be specific and reference actual content from the entries.
${hexagramData ? 'Integrate I Ching wisdom naturally - the hexagrams are not random, they emerged from which tiles the user explored.' : ''}`;

    const properties: Record<string, unknown> = {
      themes: { 
        type: 'array', 
        items: { type: 'string' } 
      },
      keyInsights: { 
        type: 'array',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            importance: { type: 'number' }
          },
          required: ['text', 'importance']
        }
      },
      nextAreas: { 
        type: 'array', 
        items: { type: 'string' } 
      },
      connections: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
            relationship: { type: 'string' }
          },
          required: ['from', 'to', 'relationship']
        }
      }
    };

    const required = ['themes', 'keyInsights', 'nextAreas', 'connections'];

    // Add hexagram interpretation if data provided
    if (hexagramData) {
      properties.hexagramInterpretation = {
        type: 'object',
        properties: {
          narrative: { type: 'string' },
          resonantHexagram: { type: 'number' },
          guidance: { type: 'string' }
        },
        required: ['narrative', 'resonantHexagram', 'guidance']
      };
      required.push('hexagramInterpretation');
    }

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
          { role: 'user', content: `Analyze these journey entries:\n\n${entriesText}` }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_summary',
            description: 'Return the journey summary analysis with I Ching integration',
            parameters: {
              type: 'object',
              properties,
              required
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'return_summary' } }
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
      const summary = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(summary), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Journey summary error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
