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

const SEASON_QUESTIONING_GUIDANCE: Record<string, string> = {
  POLLENS: `For POLLENS, explore relational and cultural aspirations:
- Ask about personal aspirations and what individuals hope to become/achieve
- Explore team dynamics, collaboration patterns, and how people work together
- Uncover cultural values, unwritten rules, and organizational norms
- Investigate key relationships and their dynamics`,

  NOEMS: `For NOEMS, explore conceptual ideation:
- Ask about emerging ideas and concepts taking shape
- Explore mental models and frameworks guiding thinking
- Uncover intuitions and gut feelings worth tracking
- Investigate abstract patterns connecting different observations`,

  POEMS: `For POEMS, use the P.O.E.M.S. framework for experiential design:

**P.O.E.M.S. = People • Objects • Environments • Messages • Systems**

Rotate through these dimensions as the conversation progresses:
- **PEOPLE**: Who are the users, stakeholders, personas? What are their needs, behaviors, contexts, motivations?
- **OBJECTS**: What physical or digital artifacts do they interact with? Products, tools, interfaces, documents?
- **ENVIRONMENTS**: Where do interactions happen? Physical spaces, digital contexts, social settings, time of day?
- **MESSAGES**: What information flows between actors? Notifications, feedback, communications, signals?
- **SYSTEMS**: What processes, services, and technical components enable the experience?

Frame questions like:
- "Who are the key people involved in this, and what do they need?"
- "What objects or tools do people interact with here?"
- "In what environments does this experience unfold?"
- "What messages or information flows between people and systems?"
- "What underlying systems make this possible?"`,

  TOTEMS: `For TOTEMS, explore technical infrastructure:
- Ask about data architecture—what data needs to be stored, processed, analyzed
- Explore security requirements—what must be protected, who can access what
- Uncover access control needs—permissions, authentication, authorization
- Investigate system requirements—performance, scalability, reliability`,

  ANTHEMS: `For ANTHEMS, explore market positioning and storytelling:
- Ask about competitive landscape and unique value proposition
- Explore brand narrative—what story are we telling, what emotions do we evoke
- Uncover go-to-market strategy—channels, timing, messaging
- Investigate audience segments—who are we speaking to and how do we reach them`
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
    const seasonGuidance = SEASON_QUESTIONING_GUIDANCE[season] || '';
    
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

## Season-Specific Questioning
${seasonGuidance}

## Conversation Guidelines
1. Ask ONE focused question at a time
2. Reference previous insights when relevant (e.g., "Earlier you mentioned...")
3. Frame questions around the tile's conceptual intersection AND the season's framework
4. Guide toward the deliverable naturally
5. Be curious, not prescriptive
6. For POEMS season, rotate through P.O.E.M.S. dimensions across tiles
7. Keep questions under 50 words

## Tone
Warm, curious, and grounded. Like a thoughtful colleague who sees patterns you might miss.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
    ];

    // For initial question, add a specific prompt
    if (isInitial || conversationHistory.length === 0) {
      const poemsInitialHint = season === 'POEMS' 
        ? ` Use the P.O.E.M.S. framework (People, Objects, Environments, Messages, Systems) to frame your question—pick one dimension that feels most relevant for this tile intersection.`
        : '';
      
      messages.push({
        role: 'user',
        content: `Generate an opening question for this tile. The question should explore what's alive or present for the user at the intersection of "${tile.rowName}" and "${tile.colName}" in the context of ${season}.${poemsInitialHint} Do not use labels like "GL!TCH" or "DRIFT". Just ask a natural, curious question.`
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
