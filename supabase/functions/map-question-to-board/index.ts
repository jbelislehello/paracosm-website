// Maps a user's question onto the Calm Magic board (5 axes), using
// Lovable AI Gateway with tool-calling for structured output, then
// enriches with matching `tiles` rows from the public tiles table.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AXES = ["MAGIC", "LOVE", "CALM", "OPEN", "FREE"] as const;
type Axis = typeof AXES[number];

const AXIS_GUIDE: Record<Axis, string> = {
  MAGIC:
    "Imagination, vision, speculative futures, mythopoetic framing, divergent invention, storyworld, what could be.",
  LOVE:
    "Care, relationships, attention, who is served, ethics-of-care, intimate practice, the human stakes.",
  CALM:
    "Regulation, rigor, evidence, observability, governance, methodological discipline, convergent integration.",
  OPEN:
    "Workflow, ontology, real systems, integration with existing tools/processes, openness to adjustment, orchestration.",
  FREE:
    "Outcomes, sovereignty, success criteria, what gets shipped, autonomy, what becomes free of force.",
};

const SYSTEM_PROMPT = `You map a user's question onto the Calm Magic board, which has five axes.
For each axis, return a 0-100 resonance score (how much the question lives on that axis) and 1-3 short tile_hints — single-sentence prompts (under 12 words, ending with "?") that capture how this axis shows up in the question.
Do NOT invent tile IDs. Be discerning: most questions resonate strongly with 1-2 axes and weakly with the rest. Scores should NOT all be similar.

Axis guide:
${AXES.map((a) => `- ${a}: ${AXIS_GUIDE[a]}`).join("\n")}`;

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 3);
}

function scoreOverlap(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const setB = new Set(b);
  let n = 0;
  for (const t of a) if (setB.has(t)) n++;
  return n / Math.max(a.length, b.length);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    if (typeof question !== "string" || question.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Provide a question (3+ chars)." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiRes = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Question: """${question.trim()}"""` },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "map_resonance",
                description:
                  "Return resonance scores and tile hints for each Calm Magic axis.",
                parameters: {
                  type: "object",
                  properties: {
                    axes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          axis: { type: "string", enum: [...AXES] },
                          score: { type: "integer", minimum: 0, maximum: 100 },
                          rationale: { type: "string" },
                          tile_hints: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1,
                            maxItems: 3,
                          },
                        },
                        required: ["axis", "score", "rationale", "tile_hints"],
                        additionalProperties: false,
                      },
                      minItems: 5,
                      maxItems: 5,
                    },
                  },
                  required: ["axes"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "map_resonance" },
          },
        }),
      },
    );

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "Lovable AI credits exhausted. Add funds in Settings → Workspace → Usage.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const text = await aiRes.text();
      console.error("AI gateway error", aiRes.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("AI returned no structured mapping.");
    }
    const parsed = JSON.parse(toolCall.function.arguments) as {
      axes: Array<{
        axis: Axis;
        score: number;
        rationale: string;
        tile_hints: string[];
      }>;
    };

    const byAxis = new Map(parsed.axes.map((a) => [a.axis, a]));
    const normalized = AXES.map(
      (axis) =>
        byAxis.get(axis) ?? {
          axis,
          score: 0,
          rationale: "",
          tile_hints: [],
        },
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: tilesRows } = await supabase
      .from("tiles")
      .select("id, board, short_prompt");
    const tilesByBoard = new Map<
      string,
      Array<{ id: number; prompt: string; tokens: string[] }>
    >();
    for (const t of tilesRows ?? []) {
      const arr = tilesByBoard.get(t.board) ?? [];
      arr.push({
        id: t.id,
        prompt: t.short_prompt,
        tokens: tokenize(t.short_prompt),
      });
      tilesByBoard.set(t.board, arr);
    }

    const enriched = normalized.map((a) => {
      const pool = tilesByBoard.get(a.axis) ?? [];
      const matched: Array<{ id: number; prompt: string }> = [];
      const seen = new Set<number>();
      for (const hint of a.tile_hints) {
        const hintTokens = tokenize(hint);
        let best = { id: -1, prompt: "", score: 0 };
        for (const tile of pool) {
          const s = scoreOverlap(hintTokens, tile.tokens);
          if (s > best.score) {
            best = { id: tile.id, prompt: tile.prompt, score: s };
          }
        }
        if (best.id !== -1 && !seen.has(best.id)) {
          matched.push({ id: best.id, prompt: best.prompt });
          seen.add(best.id);
        }
      }
      return {
        axis: a.axis,
        score: a.score,
        rationale: a.rationale,
        tile_hints: a.tile_hints,
        tiles: matched,
      };
    });

    return new Response(
      JSON.stringify({ question: question.trim(), axes: enriched }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("map-question-to-board error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
