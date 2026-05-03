// Quick Fill Board — fills all 64 Calm Magic tiles based on a PRD + custom questions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Minimal tile catalogue (id + name + framing question + phase). Mirrors src/data/tileContents.ts.
const TILES: { id: number; name: string; q: string; row: string; col: string; phase: string }[] = [
  // Row 1 — Mindsets
  { id: 1, name: "Permission to try", q: "What risk feels both scary and alive right now?", row: "Mindsets", col: "Chances", phase: "LOVE" },
  { id: 2, name: "Loving stance", q: "Where is care or compassion being withheld?", row: "Mindsets", col: "Heart", phase: "LOVE" },
  { id: 3, name: "Observer upgrade", q: "What lens might be distorting reality?", row: "Mindsets", col: "Observer", phase: "LOVE" },
  { id: 4, name: "Letting go", q: "What belief is holding things back?", row: "Mindsets", col: "Reversal", phase: "LOVE" },
  { id: 5, name: "Designer mindset", q: "What assumption could be designed instead of fixed?", row: "Mindsets", col: "Design", phase: "LOVE" },
  { id: 6, name: "Gardener mindset", q: "What is being forced instead of nurtured?", row: "Mindsets", col: "Seeds", phase: "LOVE" },
  { id: 7, name: "Method mindset", q: "What method or practice would change everything?", row: "Mindsets", col: "Methods", phase: "LOVE" },
  { id: 8, name: "Systems mindset", q: "What system view is missing?", row: "Mindsets", col: "Systems", phase: "LOVE" },
  // Row 2 — Agilities
  { id: 9, name: "Risk agility", q: "How quickly can risks be sensed and reframed?", row: "Agilities", col: "Chances", phase: "MAGIC" },
  { id: 10, name: "Empathy agility", q: "How fast can we shift to another's perspective?", row: "Agilities", col: "Heart", phase: "MAGIC" },
  { id: 11, name: "Perception agility", q: "How easily do we change frames?", row: "Agilities", col: "Observer", phase: "MAGIC" },
  { id: 12, name: "Reversal agility", q: "How readily do we abandon a path that is wrong?", row: "Agilities", col: "Reversal", phase: "MAGIC" },
  { id: 13, name: "Design agility", q: "How quickly can we prototype an idea?", row: "Agilities", col: "Design", phase: "MAGIC" },
  { id: 14, name: "Seeding agility", q: "How well do we plant small experiments?", row: "Agilities", col: "Seeds", phase: "MAGIC" },
  { id: 15, name: "Method agility", q: "How fluently do we switch methods?", row: "Agilities", col: "Methods", phase: "MAGIC" },
  { id: 16, name: "Systemic agility", q: "How quickly do we see whole-system effects?", row: "Agilities", col: "Systems", phase: "MAGIC" },
  // Row 3 — Goals
  { id: 17, name: "Daring goal", q: "What outcome is worth real risk?", row: "Goals", col: "Chances", phase: "MAGIC" },
  { id: 18, name: "Heart goal", q: "What goal serves love?", row: "Goals", col: "Heart", phase: "MAGIC" },
  { id: 19, name: "Insight goal", q: "What understanding do we want to reach?", row: "Goals", col: "Observer", phase: "MAGIC" },
  { id: 20, name: "Renewal goal", q: "What needs to be undone or renewed?", row: "Goals", col: "Reversal", phase: "MAGIC" },
  { id: 21, name: "Design goal", q: "What artifact do we want to design?", row: "Goals", col: "Design", phase: "MAGIC" },
  { id: 22, name: "Seeding goal", q: "What seed do we want to plant?", row: "Goals", col: "Seeds", phase: "MAGIC" },
  { id: 23, name: "Method goal", q: "What practice do we want to embed?", row: "Goals", col: "Methods", phase: "MAGIC" },
  { id: 24, name: "Systemic goal", q: "What system shift are we aiming for?", row: "Goals", col: "Systems", phase: "MAGIC" },
  // Row 4 — Landscape
  { id: 25, name: "Opportunity landscape", q: "Where do real openings exist?", row: "Landscape", col: "Chances", phase: "CALM" },
  { id: 26, name: "Care landscape", q: "Who and what needs care?", row: "Landscape", col: "Heart", phase: "CALM" },
  { id: 27, name: "Knowledge landscape", q: "What do we already know vs not know?", row: "Landscape", col: "Observer", phase: "CALM" },
  { id: 28, name: "Reversal landscape", q: "What's outdated in the landscape?", row: "Landscape", col: "Reversal", phase: "CALM" },
  { id: 29, name: "Design landscape", q: "What's the field of possible designs?", row: "Landscape", col: "Design", phase: "CALM" },
  { id: 30, name: "Seed landscape", q: "Where could seeds take root?", row: "Landscape", col: "Seeds", phase: "CALM" },
  { id: 31, name: "Method landscape", q: "Which methods are alive in the field?", row: "Landscape", col: "Methods", phase: "CALM" },
  { id: 32, name: "Systems landscape", q: "What systems are in play?", row: "Landscape", col: "Systems", phase: "CALM" },
  // Row 5 — Energy
  { id: 33, name: "Risk energy", q: "Where is courageous energy flowing?", row: "Energy", col: "Chances", phase: "CALM" },
  { id: 34, name: "Heart energy", q: "Where is the love most alive?", row: "Energy", col: "Heart", phase: "CALM" },
  { id: 35, name: "Attention energy", q: "Where does attention naturally land?", row: "Energy", col: "Observer", phase: "CALM" },
  { id: 36, name: "Renewal energy", q: "Where is the desire to renew strongest?", row: "Energy", col: "Reversal", phase: "CALM" },
  { id: 37, name: "Design energy", q: "Where is the urge to make active?", row: "Energy", col: "Design", phase: "CALM" },
  { id: 38, name: "Seeding energy", q: "Where is patient generative energy?", row: "Energy", col: "Seeds", phase: "CALM" },
  { id: 39, name: "Method energy", q: "Which practices have momentum?", row: "Energy", col: "Methods", phase: "CALM" },
  { id: 40, name: "Systems energy", q: "Where do system flows want to move?", row: "Energy", col: "Systems", phase: "CALM" },
  // Row 6 — Norms
  { id: 41, name: "Risk norms", q: "What norms govern risk-taking here?", row: "Norms", col: "Chances", phase: "CALM" },
  { id: 42, name: "Care norms", q: "What care norms exist (or don't)?", row: "Norms", col: "Heart", phase: "CALM" },
  { id: 43, name: "Truth norms", q: "How is truth handled and surfaced?", row: "Norms", col: "Observer", phase: "CALM" },
  { id: 44, name: "Reversal norms", q: "How are mistakes and pivots handled?", row: "Norms", col: "Reversal", phase: "CALM" },
  { id: 45, name: "Design norms", q: "What design conventions are honored?", row: "Norms", col: "Design", phase: "CALM" },
  { id: 46, name: "Seeding norms", q: "How are new ideas planted and protected?", row: "Norms", col: "Seeds", phase: "CALM" },
  { id: 47, name: "Method norms", q: "Which methods are seen as legitimate?", row: "Norms", col: "Methods", phase: "CALM" },
  { id: 48, name: "Systems norms", q: "What systemic norms shape decisions?", row: "Norms", col: "Systems", phase: "CALM" },
  // Row 7 — Synergies
  { id: 49, name: "Risk synergies", q: "What partnerships unlock courage?", row: "Synergies", col: "Chances", phase: "CALM" },
  { id: 50, name: "Care synergies", q: "What relationships sustain care?", row: "Synergies", col: "Heart", phase: "CALM" },
  { id: 51, name: "Insight synergies", q: "Whose perspectives sharpen ours?", row: "Synergies", col: "Observer", phase: "CALM" },
  { id: 52, name: "Renewal synergies", q: "Who helps us let go and renew?", row: "Synergies", col: "Reversal", phase: "CALM" },
  { id: 53, name: "Design synergies", q: "Whose craft amplifies ours?", row: "Synergies", col: "Design", phase: "CALM" },
  { id: 54, name: "Seeding synergies", q: "Who are the natural co-gardeners?", row: "Synergies", col: "Seeds", phase: "CALM" },
  { id: 55, name: "Method synergies", q: "Which methods reinforce one another?", row: "Synergies", col: "Methods", phase: "CALM" },
  { id: 56, name: "Systems synergies", q: "Which systems benefit when joined?", row: "Synergies", col: "Systems", phase: "CALM" },
  // Row 8 — Protocols & Architectures
  { id: 57, name: "Risk protocols", q: "What protocols hold risk safely?", row: "Protocols", col: "Chances", phase: "OPEN" },
  { id: 58, name: "Care protocols", q: "What protocols enact care?", row: "Protocols", col: "Heart", phase: "OPEN" },
  { id: 59, name: "Observer protocols", q: "What protocols sharpen perception?", row: "Protocols", col: "Observer", phase: "OPEN" },
  { id: 60, name: "Reversal protocols", q: "What protocols enable graceful pivots?", row: "Protocols", col: "Reversal", phase: "OPEN" },
  { id: 61, name: "Design protocols", q: "Which design protocols govern us?", row: "Protocols", col: "Design", phase: "OPEN" },
  { id: 62, name: "Seeding protocols", q: "What rituals plant new seeds?", row: "Protocols", col: "Seeds", phase: "OPEN" },
  { id: 63, name: "Method protocols", q: "Which method protocols are codified?", row: "Protocols", col: "Methods", phase: "OPEN" },
  { id: 64, name: "Systems architecture", q: "What systemic architecture binds it all?", row: "Protocols", col: "Systems", phase: "OPEN" },
];

const PRD_FIELDS = [
  "title", "love_signals_summary", "love_decision_to_exist",
  "magic_patterns", "magic_hypotheses", "magic_storyworld", "magic_prd_outline",
  "calm_requirements", "calm_risks_and_limits",
  "open_ontology_and_graph", "open_real_workflow", "open_adjustment_plan",
  "free_success_criteria", "free_next_cycle_hooks", "free_first_poem_description", "free_totem_anthem",
  "pollens_aspirations", "pollens_team_dynamics", "pollens_cultural_elements",
  "pollens_relational_patterns", "pollens_constraints", "pollens_stakes",
  "noems_concepts", "noems_shared_ideas", "noems_intuitions", "noems_mental_models",
  "poems_people", "poems_objects", "poems_environments", "poems_messages", "poems_systems", "poems_prototypes",
  "totems_data_architecture", "totems_security_policies", "totems_access_controls",
  "totems_system_requirements", "totems_integration_points", "totems_technical_debt",
  "anthems_market_positioning", "anthems_go_to_market", "anthems_brand_narrative",
  "anthems_storytelling_assets", "anthems_success_signals", "anthems_audience_segments",
];

function buildPrdContext(prd: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const f of PRD_FIELDS) {
    const v = prd[f];
    if (typeof v === "string" && v.trim().length > 0) {
      lines.push(`### ${f}\n${v.trim()}`);
    }
  }
  return lines.join("\n\n");
}

async function fillBatch(
  prdContext: string,
  questions: string[],
  batch: typeof TILES,
  apiKey: string,
): Promise<Record<number, string>> {
  const tileList = batch.map((t) => `- id ${t.id} | ${t.row} × ${t.col} (${t.phase}) — ${t.name}: ${t.q}`).join("\n");
  const userPrompt = `# PRD CONTEXT
${prdContext || "(empty PRD)"}

# USER QUESTIONS (apply to every tile, but answer through the tile's lens)
${questions.length ? questions.map((q, i) => `${i + 1}. ${q}`).join("\n") : "(no questions provided — answer based on PRD only)"}

# TILES TO FILL
${tileList}

For EACH tile above, write a 1-3 sentence answer that is:
- specifically grounded in the PRD context
- viewed through that tile's framing question + name + axis (LOVE / MAGIC / CALM / OPEN)
- concrete and actionable, not generic
- distinct from sibling tiles

Return one entry per tile id.`;

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a precise strategic analyst filling a Calm Magic board. Be concise, concrete, and PRD-grounded." },
        { role: "user", content: userPrompt },
      ],
      tools: [{
        type: "function",
        function: {
          name: "fill_tiles",
          description: "Return one answer per tile id.",
          parameters: {
            type: "object",
            properties: {
              answers: {
                type: "array",
                items: {
                  type: "object",
                  properties: { tile_id: { type: "number" }, answer: { type: "string" } },
                  required: ["tile_id", "answer"],
                  additionalProperties: false,
                },
              },
            },
            required: ["answers"],
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "fill_tiles" } },
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${txt}`);
  }
  const data = await resp.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  const parsed = call ? JSON.parse(call.function.arguments) : { answers: [] };
  const out: Record<number, string> = {};
  for (const a of parsed.answers ?? []) {
    if (typeof a.tile_id === "number" && typeof a.answer === "string") {
      out[a.tile_id] = a.answer.trim();
    }
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { prd_id, questions } = await req.json();
    if (typeof prd_id !== "string" || !Array.isArray(questions)) {
      return new Response(JSON.stringify({ error: "Invalid body" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const cleanQuestions: string[] = questions
      .filter((q: unknown): q is string => typeof q === "string")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 50);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: prd, error: prdErr } = await supabase
      .from("prds").select("*").eq("id", prd_id).maybeSingle();
    if (prdErr || !prd) {
      return new Response(JSON.stringify({ error: "PRD not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prdContext = buildPrdContext(prd as Record<string, unknown>);

    // Stream results: one batch per row (8 batches × 8 tiles)
    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        const send = (event: string, data: unknown) =>
          controller.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

        const allAnswers: Record<number, string> = {};
        try {
          for (let row = 0; row < 8; row++) {
            const batch = TILES.slice(row * 8, row * 8 + 8);
            send("batch_start", { row: row + 1, tile_ids: batch.map((t) => t.id) });
            try {
              const answers = await fillBatch(prdContext, cleanQuestions, batch, apiKey);
              Object.assign(allAnswers, answers);
              for (const t of batch) {
                send("tile", { tile_id: t.id, answer: answers[t.id] ?? "" });
              }
            } catch (e) {
              const msg = e instanceof Error ? e.message : "batch failed";
              if (msg.includes("429")) {
                send("error", { code: 429, message: "Rate limit reached, please try again shortly." });
                controller.close();
                return;
              }
              if (msg.includes("402")) {
                send("error", { code: 402, message: "AI credits exhausted. Add credits in Lovable Cloud → Usage." });
                controller.close();
                return;
              }
              send("error", { code: 500, message: msg });
            }
          }

          // Persist
          const payload = {
            questions: cleanQuestions,
            answers: allAnswers,
            generated_at: new Date().toISOString(),
            model: "google/gemini-3-flash-preview",
          };
          const { error: upErr } = await supabase
            .from("prds").update({ quick_fill: payload }).eq("id", prd_id);
          if (upErr) send("error", { code: 500, message: `save failed: ${upErr.message}` });
          send("done", payload);
        } catch (e) {
          send("error", { code: 500, message: e instanceof Error ? e.message : "stream failed" });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("prd-quick-fill error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
