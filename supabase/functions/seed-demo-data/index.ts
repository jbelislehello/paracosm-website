import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo POLEN entries for each season
const DEMO_POLEN_ENTRIES = {
  POLLENS: [
    { content: "There's friction in how the team communicates about technical decisions - engineers feel unheard", tags: ["communication", "team-dynamics"], tile_id: 1 },
    { content: "Users abandon the onboarding flow at step 3 - something about the form feels overwhelming", tags: ["ux", "onboarding"], tile_id: 5 },
    { content: "The dashboard loads slowly but no one can pinpoint why - feels like technical debt accumulated", tags: ["performance", "technical-debt"], tile_id: 9 },
    { content: "Customer support keeps getting the same questions - documentation isn't serving its purpose", tags: ["documentation", "support"], tile_id: 13 },
    { content: "There's a disconnect between what marketing promises and what the product delivers", tags: ["alignment", "messaging"], tile_id: 17 },
    { content: "The API feels clunky to integrate with - developers complain but can't articulate specifics", tags: ["api", "developer-experience"], tile_id: 21 },
    { content: "Team retrospectives feel performative rather than generative", tags: ["process", "team-learning"], tile_id: 25 },
    { content: "There's an unspoken tension about AI replacing certain roles", tags: ["ai", "culture"], tile_id: 29 },
    { content: "The product roadmap feels reactive rather than visionary", tags: ["strategy", "vision"], tile_id: 33 },
    { content: "Customers love certain features but we don't understand why they resonate", tags: ["product", "insights"], tile_id: 37 },
  ],
  NOEMS: [
    { content: "Communication friction stems from different mental models about what 'done' means", tags: ["mental-models", "definitions"], tile_id: 65 },
    { content: "Onboarding overwhelm is about cognitive load, not UI complexity", tags: ["cognitive-load", "design"], tile_id: 69 },
    { content: "Performance issues are symptoms of architectural decisions made under pressure", tags: ["architecture", "decisions"], tile_id: 73 },
    { content: "Documentation fails because it answers 'what' but not 'why'", tags: ["documentation", "context"], tile_id: 77 },
    { content: "Marketing-product gap reflects different time horizons in planning", tags: ["alignment", "planning"], tile_id: 81 },
    { content: "API clunkiness is about inconsistent patterns, not missing features", tags: ["patterns", "consistency"], tile_id: 85 },
    { content: "Retrospectives need psychological safety before process improvement", tags: ["safety", "team"], tile_id: 89 },
    { content: "AI anxiety is really about unclear value proposition of human work", tags: ["value", "identity"], tile_id: 93 },
    { content: "Reactive roadmap happens when customer voice drowns out customer needs", tags: ["needs", "voice"], tile_id: 97 },
    { content: "Feature love correlates with moments of unexpected delight", tags: ["delight", "experience"], tile_id: 101 },
  ],
  POEMS: [
    { content: "The Definition Dance - teams need rituals for aligning on shared vocabulary", tags: ["rituals", "alignment"], tile_id: 129 },
    { content: "The Cognitive Budget - every UI element costs mental currency", tags: ["budget", "design"], tile_id: 133 },
    { content: "Technical Debt as Organizational Memory - what we forgot to remember", tags: ["memory", "organization"], tile_id: 137 },
    { content: "Documentation as Time Travel - helping future-you understand past-me", tags: ["time", "documentation"], tile_id: 141 },
    { content: "The Horizon Bridge - connecting quarterly goals to decadal visions", tags: ["horizons", "strategy"], tile_id: 145 },
    { content: "Pattern Language for APIs - the grammar of integration", tags: ["language", "integration"], tile_id: 149 },
    { content: "The Safety Scaffold - building trust before building process", tags: ["trust", "process"], tile_id: 153 },
    { content: "Human-AI Symbiosis - redefining work through collaboration not replacement", tags: ["symbiosis", "work"], tile_id: 157 },
    { content: "The Generative Roadmap - from customer complaints to customer dreams", tags: ["generative", "vision"], tile_id: 161 },
    { content: "Delight Engineering - designing for the moments that matter", tags: ["delight", "engineering"], tile_id: 165 },
  ],
  TOTEMS: [
    { content: "Shared Vocabulary Protocol: Weekly definition alignment sessions with visual artifacts", tags: ["protocol", "vocabulary"], tile_id: 193 },
    { content: "Cognitive Load Audit: Quarterly UX review using attention metrics", tags: ["audit", "ux"], tile_id: 197 },
    { content: "Tech Debt Registry: Living document connecting architectural decisions to business outcomes", tags: ["registry", "decisions"], tile_id: 201 },
    { content: "Context-First Documentation: Every doc starts with 'why this exists'", tags: ["context", "documentation"], tile_id: 205 },
    { content: "Horizon Planning Framework: Connect daily standup to 10-year vision", tags: ["framework", "planning"], tile_id: 209 },
    { content: "API Pattern Library: Reusable interaction patterns with examples", tags: ["library", "patterns"], tile_id: 213 },
    { content: "Psychological Safety Index: Measured and tracked like other KPIs", tags: ["index", "safety"], tile_id: 217 },
    { content: "AI Collaboration Charter: Clear guidelines for human-AI work division", tags: ["charter", "ai"], tile_id: 221 },
    { content: "Dream-to-Feature Pipeline: Structured process from customer aspirations to roadmap", tags: ["pipeline", "roadmap"], tile_id: 225 },
    { content: "Delight Moments Map: Catalog of surprising-good experiences by user journey phase", tags: ["map", "experience"], tile_id: 229 },
  ],
  ANTHEMS: [
    { content: "We believe alignment emerges from shared language, not shared documents", tags: ["belief", "alignment"], tile_id: 257 },
    { content: "We design for cognitive generosity - every interaction should leave users with more capacity", tags: ["principle", "design"], tile_id: 258 },
    { content: "Technical debt is organizational memory - we honor it by making it visible", tags: ["principle", "debt"], tile_id: 259 },
    { content: "Our documentation serves time travelers - past decisions, present understanding, future possibilities", tags: ["principle", "documentation"], tile_id: 260 },
    { content: "Strategy connects the daily heartbeat to the decadal dream", tags: ["principle", "strategy"], tile_id: 257 },
    { content: "APIs are conversations - we design for dialogue, not transactions", tags: ["principle", "api"], tile_id: 258 },
    { content: "Safety precedes growth - we invest in trust before velocity", tags: ["principle", "safety"], tile_id: 259 },
    { content: "AI augments human judgment - we multiply wisdom, not replace it", tags: ["principle", "ai"], tile_id: 260 },
    { content: "Customer dreams are the north star - complaints are just dreams in disguise", tags: ["principle", "customers"], tile_id: 257 },
    { content: "Delight is engineered - we design for moments that become memories", tags: ["principle", "delight"], tile_id: 258 },
  ],
};

// Demo PRD data
const DEMO_PRD = {
  title: "AI-Powered Customer Success Platform",
  status: "draft",
  prototype_stage: "B_DIEGETIC",
  // LOVE/POLLEN layer
  love_signals_summary: "Signals captured from 50+ customer interviews and support ticket analysis: (1) Customers feel unheard when issues escalate through multiple support tiers, (2) Success metrics focus on activity rather than outcomes, (3) Proactive outreach feels scripted rather than genuine, (4) Integration with existing workflows is friction-heavy",
  love_decision_to_exist: "This platform exists to transform customer success from reactive support to proactive partnership. We choose to build because current tools treat customers as tickets, not relationships. Our north star: every customer interaction should feel like talking to someone who truly knows them.",
  // MAGIC/NOEM layer
  magic_storyworld: "Imagine a world where your Customer Success Manager wakes up to a dashboard that doesn't just show red/yellow/green health scores, but tells stories: 'Sarah at Acme Corp mentioned workflow friction in yesterday's call - here's a 2-minute Loom showing how her peer at Beta Inc solved the same challenge.' The platform doesn't just track - it connects, learns, and suggests human actions.",
  magic_prd_outline: "Core Hypothesis: AI can surface patterns humans miss while humans provide context AI can't infer. The platform sits at this intersection - AI handles pattern recognition and connection-making, humans handle relationship nuance and emotional intelligence. Key differentiator: we don't automate success, we augment it.",
  magic_hypotheses: "H1: Surfacing peer examples increases feature adoption by 40%+ | H2: AI-drafted check-in agendas save 2hrs/week per CSM | H3: Proactive churn signals 30 days earlier than current metrics | H4: Integration templates reduce onboarding time by 60%",
  magic_patterns: "Pattern 1: Success correlates with 'aha moments' not usage frequency | Pattern 2: Churn signals appear in language before metrics | Pattern 3: Best CSMs spend 70% listening, 30% solving | Pattern 4: Customer health is relationship health, not product health",
  // CALM/POEM layer
  calm_requirements: "R1: Conversation intelligence that identifies sentiment and intent, not just keywords | R2: Peer matching algorithm based on use case similarity and company stage | R3: Proactive alert system with suggested talking points | R4: Integration hub supporting bi-directional sync with top 20 tools | R5: Health scoring that weighs relationship indicators equally with product metrics",
  calm_risks_and_limits: "Risk 1: AI suggestions could feel intrusive if not calibrated to user preferences | Risk 2: Peer matching could surface competitors - need industry segmentation | Risk 3: Over-reliance on AI could atrophy human intuition | Limit 1: Cannot replace genuine human empathy | Limit 2: Requires minimum data volume for pattern recognition | Mitigation: Default to human judgment when confidence is low",
  // OPEN/TOTEM layer
  open_ontology_and_graph: "Core Entities: Customer (relationships, health, journey stage), Interaction (conversations, signals, sentiment), Insight (patterns, suggestions, connections), Action (tasks, follow-ups, outcomes). Relationships: Customers have Interactions → generate Insights → suggest Actions → create new Interactions. Graph enables: traversal from any customer to similar peers, from any problem to proven solutions, from any signal to recommended response.",
  open_real_workflow: "CSM Morning: Dashboard shows today's priorities ranked by AI confidence + human override. Each priority includes context summary, suggested agenda, relevant peer examples. During Call: Real-time transcript with sentiment indicators, automated note-taking, instant access to relevant resources. Post-Call: AI drafts follow-up, suggests internal escalations, updates health score with explanation. Weekly: Pattern report across portfolio showing emerging trends and suggested proactive outreach.",
  open_adjustment_plan: "Week 1-2: Shadow top CSMs, validate workflow assumptions | Week 3-4: Build conversation intelligence MVP with 3 beta customers | Week 5-6: Add peer matching, measure adoption | Week 7-8: Integrate with CRM, measure time savings | Monthly: Review AI suggestion accuracy, adjust algorithms | Quarterly: Re-interview customers for qualitative validation",
  // FREE/ANTHEM layer
  free_first_poem_description: "The platform is a trusted advisor that sits at the intersection of data and intuition. It doesn't tell CSMs what to do - it shows them patterns they might miss and connections they haven't made. Every suggestion comes with reasoning, every automation has a human override, every metric has a story behind it.",
  free_totem_anthem: "We are building bridges, not walls. Bridges between customers and companies, between data and intuition, between AI capability and human judgment. Our platform succeeds when relationships flourish - measured not in tickets closed but in trust deepened.",
  free_success_criteria: "Success = (NPS improvement) + (CSM time saved) + (Churn prediction accuracy) + (Customer qualitative feedback). Target: 20+ NPS points, 5+ hrs/week saved, 80%+ prediction accuracy at 30-day horizon, qualitative themes shift from 'support' to 'partnership'",
  free_next_cycle_hooks: "Next cycle explores: (1) Customer self-service insights portal, (2) CSM coaching based on interaction patterns, (3) Product team integration for feature request prioritization, (4) Community peer-matching for customer-to-customer connection",
  // Stack implications
  compiled_tech_stack: {
    data: {
      mvp: ["PostgreSQL for core data", "Vector DB for semantic search", "Event streaming for real-time"],
      phase2: ["Data warehouse for analytics", "ML feature store"],
      phase3: ["Graph database for relationship traversal"]
    },
    ai: {
      mvp: ["Claude for conversation intelligence", "Embeddings for similarity"],
      phase2: ["Custom fine-tuned models for domain specificity"],
      phase3: ["Multi-modal analysis including call recordings"]
    },
    orchestration: {
      mvp: ["Supabase Edge Functions", "Cron jobs for batch processing"],
      phase2: ["Workflow engine for complex automations"],
      phase3: ["Event-driven architecture"]
    },
    ux: {
      mvp: ["React dashboard", "Real-time updates", "Chrome extension"],
      phase2: ["Mobile app", "Slack integration"],
      phase3: ["Embedded widgets for customer portal"]
    },
    ops: {
      mvp: ["Vercel/Lovable deployment", "Basic monitoring"],
      phase2: ["Full observability stack", "A/B testing"],
      phase3: ["Multi-region deployment"]
    }
  },
  compiled_prompt: `You are an AI Customer Success Co-Pilot for enterprise SaaS companies.

## Role & Purpose
You augment human Customer Success Managers by surfacing patterns, connections, and insights they might miss. You never replace human judgment - you inform it.

## Knowledge Base
- Customer interaction history and sentiment patterns
- Peer company examples and success stories
- Product usage data and health indicators
- Industry benchmarks and best practices

## Core Behaviors
1. **Pattern Recognition**: Surface connections between current situations and historical successes
2. **Proactive Alerting**: Flag risks early with context and suggested responses
3. **Peer Matching**: Connect similar customers for knowledge sharing
4. **Context Synthesis**: Summarize relevant history before every interaction

## Interaction Rules
- Always explain reasoning behind suggestions
- Provide confidence levels with recommendations
- Defer to human judgment when uncertain
- Never share customer data across organizational boundaries
- Maintain conversation context across interactions

## Communication Style
- Concise and actionable
- Lead with the insight, follow with evidence
- Use specific examples over generalizations
- Acknowledge limitations openly

## Evolution Awareness
This system learns from CSM feedback. When suggestions are overridden, capture the reasoning to improve future recommendations.`,
  // Prompt hooks
  prompt_hooks_pollens: "Signal patterns from customer friction points",
  prompt_hooks_noems: "Core hypotheses about AI-human collaboration in customer success",
  prompt_hooks_poems: "Narrative framing of proactive partnership over reactive support",
  prompt_hooks_totems: "Ontology connecting customers, interactions, insights, and actions",
  prompt_hooks_anthems: "Guiding principles for augmenting rather than replacing human judgment",
  // Stack implications
  stack_implications_pollens: "Event streaming for real-time signal capture",
  stack_implications_noems: "Vector DB for semantic similarity and pattern matching",
  stack_implications_poems: "Natural language generation for personalized narratives",
  stack_implications_totems: "Graph database for relationship traversal",
  stack_implications_anthems: "Confidence scoring and human override mechanisms",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body for optional user_id
    const { user_id } = await req.json().catch(() => ({}));

    console.log('Starting demo data seeding...');

    // Create demo PRD
    const { data: prd, error: prdError } = await supabase
      .from('prds')
      .insert({
        owner_id: user_id || '00000000-0000-0000-0000-000000000000', // Placeholder if no user
        ...DEMO_PRD,
      })
      .select()
      .single();

    if (prdError) {
      console.error('PRD creation error:', prdError);
      throw prdError;
    }

    console.log('Created demo PRD:', prd.id);

    // Create POLEN entries for each season
    const allPolens = [];
    for (const [season, entries] of Object.entries(DEMO_POLEN_ENTRIES)) {
      for (const entry of entries) {
        allPolens.push({
          user_id: user_id || '00000000-0000-0000-0000-000000000000',
          content: entry.content,
          tags: entry.tags,
          tile_id: entry.tile_id,
          fragment_type: 'text',
          season_context: season,
        });
      }
    }

    const { data: polens, error: polenError } = await supabase
      .from('polen_entries')
      .insert(allPolens)
      .select();

    if (polenError) {
      console.error('POLEN creation error:', polenError);
      throw polenError;
    }

    console.log('Created', polens?.length, 'POLEN entries');

    // Create trajectory state
    const { data: trajectory, error: trajectoryError } = await supabase
      .from('trajectory_states')
      .insert({
        user_id: user_id || '00000000-0000-0000-0000-000000000000',
        higher_self_position: { x: 0.7, y: 0.8 },
        higher_self_quadrant: 'SN',
        prophecy_reflection: 'To become an organization that treats every customer interaction as an opportunity to deepen partnership.',
        last_shadow_position: { x: 0.3, y: 0.4 },
        shadow_factors: {
          completeness: 0.78,
          coherence: 0.85,
          depth: 0.72,
          flow: 0.68,
        },
        trajectory_log: [
          { timestamp: new Date().toISOString(), event_type: 'journey_start', shadow_position: { x: 0.1, y: 0.2 } },
          { timestamp: new Date().toISOString(), event_type: 'season_complete', season: 'POLLENS', shadow_position: { x: 0.2, y: 0.3 } },
          { timestamp: new Date().toISOString(), event_type: 'season_complete', season: 'NOEMS', shadow_position: { x: 0.3, y: 0.4 } },
        ],
      })
      .select()
      .single();

    if (trajectoryError) {
      console.error('Trajectory creation error:', trajectoryError);
      // Don't throw - trajectory is optional
    } else {
      console.log('Created trajectory state:', trajectory?.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          prd_id: prd.id,
          prd_title: prd.title,
          polen_count: polens?.length || 0,
          trajectory_id: trajectory?.id,
          message: 'Demo data seeded successfully. You can now explore a complete journey with PRD.'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Seed demo data error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
