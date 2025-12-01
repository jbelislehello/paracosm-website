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

    // Compute prototype stage based on most frequent process_state
    const mostFrequentState = computeDominant('process_state');
    let prototypeStage = 'B_DIEGETIC';
    if (mostFrequentState === 'GLITCH') prototypeStage = 'A_POIETIC';
    else if (mostFrequentState === 'DRIFT') prototypeStage = 'B_DIEGETIC';
    else if (mostFrequentState === 'TUNE') prototypeStage = 'C_OPERATIONAL';
    else if (mostFrequentState === 'FREE') prototypeStage = 'D_MVP';

    // Use OpenAI to generate intelligent summaries
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const eventsContext = filteredEvents.map(e => 
      `Event: ${e.title}\nDescription: ${e.description}\nF/E/L/V: ${e.ap_aspect}, Positionality: ${e.positionality}, Quadrant: ${e.quadrant}, Oscillation: ${e.oscillation_state}`
    ).join('\n\n');

    const systemPrompt = `You are an expert at synthesizing complex relational and organizational tensions into structured Product Requirements Documents. You work with the Calm Magic framework (LOVE→MAGIC→CALM→OPEN→FREE) and understand F/E/L/V dimensions (Feeling, Emotion, Logic, Values), positionality (P1-P5: self, pair, team, org, environment), quadrants (SN, IN, IM, SM), and Senge's learning disciplines.

You also understand the 4 prototype stages in the A–D quadrant:
- A (Poietic) → GL!TCH/LOVE → "Is this worth existing?"
- B (Diegetic) → DRIFT/MAGIC → Story & PRD backbone
- C (Operational) → TUNE/CALM+OPEN → Ontology, rules, workflow
- D (MVP) → FREE → Production reality & learning`;

    const stageContext = {
      'A_POIETIC': 'This is a Poietic prototype (GL!TCH/LOVE/desire) - focus on whether this idea is worth existing.',
      'B_DIEGETIC': 'This is a Diegetic prototype (DRIFT/MAGIC/intention) - focus on story and PRD backbone.',
      'C_OPERATIONAL': 'This is an Operational prototype (TUNE/CALM+OPEN) - focus on ontology, rules, and workflow.',
      'D_MVP': 'This is an MVP/Production Ready App (FREE/learning) - focus on production reality and learning cycles.'
    }[prototypeStage];

    const prompt = `Based on these glitch events, generate a structured PRD with these sections:

${stageContext}

EVENTS:
${eventsContext}

DOMINANT PATTERNS:
- Main Dimension: ${mainDimension}
- Main Quadrant: ${mainQuadrant}
- Main Senge Focus: ${mainSengeFocus}
- Main Board: ${mainBoard}
- Main Oscillation: ${mainOscillation}
- Prototype Stage: ${prototypeStage}

Generate:
1. LOVE Layer (Signals - A quadrant / GL!TCH):
   - love_signals_summary: Synthesized narrative of tensions & incoherences (2-3 paragraphs)
   - love_decision_to_exist: 2-3 sentences on "Is this worth existing?" given these tensions

2. MAGIC Layer (Story & PRD backbone - B quadrant / DRIFT):
   - magic_storyworld: Short diegetic story tying glitches into a narrative
   - magic_prd_outline: Bullet list of potential features/flows from recurring patterns
   - magic_hypotheses: List of "We believe that..." hypotheses using F/E/L/V, quadrant, senge_focus

3. CALM Layer (Rules - C quadrant / TUNE):
   - calm_requirements: Requirements inferred from constraints, risks, positionality
   - calm_risks_and_limits: Explicit risks / non-negotiables from adversity_level & oscillation_state

4. OPEN Layer (Operations - C quadrant / TUNE):
   - open_ontology_and_graph: Description of entities, relationships, edges suggested by glitches
   - open_real_workflow: Real-life workflow the app/system must support
   - open_adjustment_plan: How we will tune the prototype to match reality

5. FREE Layer (Production & Learning - D quadrant / MVP):
   - free_first_poem_description: Description of the first POEM in production
   - free_totem_anthem: How this POEM becomes a ritual/totem in the org
   - free_success_criteria: What successful behavior/stories/metrics look like
   - free_next_cycle_hooks: How learnings will flow back into Glitch Compass

Return as JSON with these exact keys. Keep the emotional and relational richness of the events.`;

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
        prototype_stage: prototypeStage,
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