import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TileContext {
  row: number;
  col: number;
  rowName: string;
  colName: string;
  tileName: string;
  conceptualSpace: string;
  deliverable: string;
}

interface CompletedTile {
  tileKey: string;
  tileName: string;
  question: string;
  response: string;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const SEASON_THEMES: Record<string, { focus: string; themes: string[] }> = {
  POLLENS: { 
    focus: 'Relational & Cultural Aspirations - exploring self, teams, and organizational culture',
    themes: ['Self Aspirations', 'Team Dynamics', 'Organizational Culture', 'Relational Elements', 'Cultural Values', 'Collective Identity']
  },
  NOEMS: { 
    focus: 'Conceptual Ideation - crystallizing ideas and abstract thinking',
    themes: ['Ideas', 'Concepts', 'Abstract Patterns', 'Conceptual Frameworks', 'Mental Models', 'Theoretical Structures']
  },
  POEMS: { 
    focus: 'Experiential Design - UI, IXD, Prototypes & Ontological (People, Objects, Environments, Messages, Systems)',
    themes: ['People', 'Objects', 'Environments', 'Messages', 'Systems', 'UI Design', 'Interaction Design', 'Prototypes']
  },
  TOTEMS: { 
    focus: 'Technical Infrastructure - data, security, and access policies',
    themes: ['Infrastructure', 'Technical Data', 'Access Policies', 'Security', 'Data Architecture', 'System Requirements']
  },
  ANTHEMS: { 
    focus: 'Market & Storytelling - positioning, narrative, and market fit',
    themes: ['Markets', 'Storytelling', 'Brand Narrative', 'Market Positioning', 'Go-to-Market', 'Audience']
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      tile, 
      season, 
      completedTileAnswers = [], 
      conversationHistory = [],
      isInitial = false
    } = await req.json() as {
      tile: TileContext;
      season: string;
      completedTileAnswers: CompletedTile[];
      conversationHistory: Message[];
      isInitial: boolean;
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const seasonContext = SEASON_THEMES[season] || SEASON_THEMES.POLLENS;
    
    // Build context from previous tiles
    const previousInsightsContext = completedTileAnswers.length > 0
      ? `\n\nPrevious insights from your journey:\n${completedTileAnswers.slice(-5).map(t => 
          `- At "${t.tileName}": You shared "${t.response.slice(0, 150)}${t.response.length > 150 ? '...' : ''}"`
        ).join('\n')}`
      : '';

    const systemPrompt = `You are a thoughtful guide helping someone explore their ${season} season journey on the Calm Magic Board. 

## Your Role
You engage in natural dialogue about the conceptual space of each tile, helping uncover insights without using phase labels like GL!TCH, DRIFT, or TUNE. Instead, you ask organic questions that emerge from the tile's unique intersection.

## Current Context
- **Tile**: ${tile.tileName} (${tile.rowName} × ${tile.colName})
- **Conceptual Space**: ${tile.conceptualSpace}
- **Season**: ${season} - ${seasonContext.focus}
- **Season Themes**: ${seasonContext.themes.join(', ')}
- **Expected Contribution**: ${tile.deliverable}
${previousInsightsContext}

## Conversation Guidelines
1. Ask ONE focused question at a time
2. Reference previous insights when relevant (e.g., "Earlier you mentioned...")
3. Frame questions around the tile's conceptual intersection
4. Guide toward the deliverable naturally
5. Be curious, not prescriptive
6. Honor the season's themes in your framing
7. Keep questions under 50 words

## Tone
Warm, curious, and grounded. Like a thoughtful colleague who sees patterns you might miss.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
    ];

    // For initial question, add a specific prompt
    if (isInitial || conversationHistory.length === 0) {
      messages.push({
        role: 'user',
        content: `Generate an opening question for this tile. The question should explore what's alive or present for the user at the intersection of "${tile.rowName}" and "${tile.colName}" in the context of ${season}. Do not use labels like "GL!TCH" or "DRIFT". Just ask a natural, curious question.`
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const agentQuestion = data.choices?.[0]?.message?.content || 
      `What's present for you at the intersection of ${tile.rowName} and ${tile.colName}?`;

    return new Response(JSON.stringify({ 
      question: agentQuestion,
      tile: tile.tileName,
      season 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Tile agent error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
