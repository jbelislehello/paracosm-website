import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventIds, teamId } = await req.json();
    
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch events with tiles
    const { data: events, error: eventsError } = await supabaseClient
      .from('events')
      .select(`
        *,
        tiles:tile_id (
          board,
          senge_discipline,
          mindfulness_focus
        )
      `)
      .in('id', eventIds);

    if (eventsError || !events) {
      throw new Error('Failed to fetch events');
    }

    // Filter events: prefer DRIFT/TUNE, allow GLITCH if no others
    let filteredEvents = events.filter(e => e.process_state === 'DRIFT' || e.process_state === 'TUNE');
    if (filteredEvents.length === 0) {
      filteredEvents = events;
    }

    // Compute dominant patterns
    const computeDominant = (field: string) => {
      const counts: Record<string, number> = {};
      filteredEvents.forEach(e => {
        const val = e[field];
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || null;
    };

    const computeDominantTileField = (field: string) => {
      const counts: Record<string, number> = {};
      filteredEvents.forEach(e => {
        const val = e.tiles?.[field];
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || null;
    };

    const mainDimension = computeDominant('ap_aspect');
    const mainQuadrant = computeDominant('quadrant');
    const mainSengeFocus = computeDominant('senge_focus') || computeDominantTileField('senge_discipline');
    const mainBoard = computeDominantTileField('board');
    const mainOscillation = computeDominant('oscillation_state');

    // Use OpenAI to generate intelligent summaries
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const eventsContext = filteredEvents.map(e => 
      `Event: ${e.title}\nDescription: ${e.description}\nF/E/L/V: ${e.ap_aspect}, Positionality: ${e.positionality}, Quadrant: ${e.quadrant}, Oscillation: ${e.oscillation_state}`
    ).join('\n\n');

    const systemPrompt = `You are an expert at synthesizing complex relational and organizational tensions into structured Product Requirements Documents. You work with the Calm Magic framework (LOVE→MAGIC→CALM→OPEN→FREE) and understand F/E/L/V dimensions (Feeling, Emotion, Logic, Values), positionality (P1-P5: self, pair, team, org, environment), quadrants (SN, IN, IM, SM), and Senge's learning disciplines.`;

    const prompt = `Based on these glitch events, generate a structured PRD with these sections:

EVENTS:
${eventsContext}

DOMINANT PATTERNS:
- Main Dimension: ${mainDimension}
- Main Quadrant: ${mainQuadrant}
- Main Senge Focus: ${mainSengeFocus}
- Main Board: ${mainBoard}
- Main Oscillation: ${mainOscillation}

Generate:
1. LOVE_SUMMARY: A 2-3 paragraph narrative summarizing the raw tensions and human experiences
2. LOVE_KEY_EVENTS: Bullet list of 3-5 most representative events with their F/E/L/V and positionality
3. MAGIC_PATTERNS: 2-3 paragraphs describing recurring patterns across dimensions, quadrants, and oscillation states
4. MAGIC_HYPOTHESES: 3-4 hypotheses about why these patterns are occurring
5. CALM_REQUIREMENTS: List of 5-7 requirements derived from the patterns
6. CALM_CONSTRAINTS: List of 3-5 constraints, risks, or non-negotiables
7. CALM_IMPACTED_ACTORS: Describe who is affected using human language (self, pairs, teams, organization, environment)
8. OPEN_EXPERIMENTS: 5-7 small wu-wei-style experiments to try
9. OPEN_FLOWS: 2-3 high-level flows or scenarios these experiments address
10. FREE_SUCCESS_CRITERIA: How we'll know it worked (behavioral signals, oscillation shifts)
11. FREE_LEARNING_QUESTIONS: 3-5 questions we want answered
12. FREE_INTEGRATION_PLAN: How to log future glitches back into the system

Return as JSON with these exact keys: love_summary, love_key_events_overview, magic_patterns, magic_hypotheses, calm_requirements, calm_constraints, calm_impacted_actors, open_experiments, open_flows_or_scenarios, free_success_criteria, free_learning_questions, free_integration_plan`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to generate PRD content');
    }

    const aiData = await aiResponse.json();
    const generatedContent = JSON.parse(aiData.choices[0].message.content);

    // Create PRD
    const { data: prd, error: prdError } = await supabaseClient
      .from('prds')
      .insert({
        owner_id: user.id,
        team_id: teamId || null,
        title: `PRD from ${filteredEvents.length} glitches - ${new Date().toLocaleDateString()}`,
        status: 'draft',
        main_dimension: mainDimension,
        main_quadrant: mainQuadrant,
        main_senge_focus: mainSengeFocus,
        main_board: mainBoard,
        main_oscillation: mainOscillation,
        ...generatedContent
      })
      .select()
      .single();

    if (prdError || !prd) {
      console.error('PRD creation error:', prdError);
      throw new Error('Failed to create PRD');
    }

    // Create links
    const links = eventIds.map((eventId: string) => ({
      prd_id: prd.id,
      event_id: eventId
    }));

    const { error: linksError } = await supabaseClient
      .from('prd_links')
      .insert(links);

    if (linksError) {
      console.error('Links creation error:', linksError);
      throw new Error('Failed to create PRD links');
    }

    return new Response(JSON.stringify({ prd }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-prd function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});