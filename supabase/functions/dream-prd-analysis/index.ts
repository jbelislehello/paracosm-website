// Dream PRD Analysis edge function
// Parses an uploaded PRD (PDF / DOCX / MD / TXT), assesses per-axis maturity,
// streams an axis-by-axis poetic interpretation, lights tiles deterministically,
// and saves the run to dream_runs for sharing.
import { extractText, getDocumentProxy } from "https://esm.sh/unpdf@0.12.1";
import mammoth from "https://esm.sh/mammoth@1.8.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { checkRateLimit } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_TEXT_CHARS = 30_000;

const AXES = ["love", "magic", "calm", "open", "free"] as const;
type Axis = typeof AXES[number];

// Tile id bands per axis (from tiles table)
const AXIS_BANDS: Record<Axis, [number, number]> = {
  love:  [1, 64],
  magic: [65, 128],
  calm:  [129, 192],
  open:  [193, 256],
  free:  [257, 260],
};

function sse(event: string, data: unknown) {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buf = new Uint8Array(await file.arrayBuffer());
  if (name.endsWith(".pdf")) {
    const pdf = await getDocumentProxy(buf);
    const { text } = await extractText(pdf, { mergePages: true });
    return Array.isArray(text) ? text.join("\n") : text;
  }
  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ arrayBuffer: buf.buffer });
    return result.value || "";
  }
  if (name.endsWith(".md") || name.endsWith(".txt") || name.endsWith(".markdown")) {
    return new TextDecoder().decode(buf);
  }
  throw new Error(`Unsupported file type: ${file.name}`);
}

async function sha256Bytes(s: string): Promise<Uint8Array> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return new Uint8Array(buf);
}

function pickTiles(hash: Uint8Array, axis: Axis, count: number): number[] {
  const [lo, hi] = AXIS_BANDS[axis];
  const size = hi - lo + 1;
  const want = Math.min(Math.max(1, count), size);
  const out = new Set<number>();
  let i = 0;
  while (out.size < want) {
    const byte = hash[i % hash.length];
    out.add(lo + ((byte + i * 17) % size));
    i++;
    if (i > 1000) break;
  }
  return [...out].sort((a, b) => a - b);
}

function maturityToTileCount(axis: Axis, maturity: number): number {
  const [lo, hi] = AXIS_BANDS[axis];
  const max = Math.min(5, hi - lo + 1);
  return Math.max(1, Math.min(max, Math.round(1 + maturity * (max - 1))));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders }

  // Per-IP rate limit to prevent unauthenticated AI credit abuse.
  const _rl = checkRateLimit(req, { limit: 20, windowMs: 60_000 });
  if (_rl) return _rl;);
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const question = String(form.get("question") || "").slice(0, 500);

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "Missing file" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (file.size > MAX_BYTES) {
      return new Response(JSON.stringify({ error: "File exceeds 10MB" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!question || question.length < 3) {
      return new Response(JSON.stringify({ error: "Missing question" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let prdText = "";
    try {
      prdText = await extractTextFromFile(file);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Parse failure" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    prdText = prdText.replace(/\s+/g, " ").trim().slice(0, MAX_TEXT_CHARS);
    if (prdText.length < 50) {
      return new Response(JSON.stringify({ error: "PRD text too short or unreadable" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are the Calm Magic board, a five-axis compass (LOVE, MAGIC, CALM, OPEN, FREE) that reads product documents and reflects them back as a living organism would.

You will be given (1) a question the user is sitting with, and (2) the raw text of a PRD they uploaded. Your job is to let the BOARD answer ITSELF through their PRD — five short, poetic, specific reflections (one per axis), AND assess how MATURE each axis is in this PRD.

Rules:
- Speak from the axis ("Through LOVE I notice…"). Never address the user as "you".
- Each narration: 2-4 sentences. Concrete references to what is ACTUALLY in the PRD.
- Avoid generic platitudes. If the PRD is silent on something an axis cares about, name that silence.
- Each axis returns 2-4 tile_keys: short evocative noun-phrases (lowercase, hyphen-or-space).
- Each axis returns a maturity score in [0,1]: 0 = the PRD is silent or unaware of this axis; 0.5 = present but partial; 1 = deeply realized.
- End with one summary sentence.

Axes:
- LOVE: aliveness, resonance, who is held, the felt sense of care.
- MAGIC: emergence, surprise, generative edges, what is barely possible.
- CALM: regulation, pace, rhythm, what soothes or overwhelms.
- OPEN: spaciousness, optionality, what remains unfixed.
- FREE: sovereignty, agency, what the user/team gets to choose.`;

    const userPrompt = `QUESTION:\n${question}\n\nPRD TEXT:\n${prdText}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "board_self_answer",
            description: "Return the board's five-axis self-reflection.",
            parameters: {
              type: "object",
              properties: {
                axes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: { type: "string", enum: [...AXES] },
                      narration: { type: "string" },
                      tile_keys: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
                      maturity: { type: "number", minimum: 0, maximum: 1 },
                    },
                    required: ["key", "narration", "tile_keys", "maturity"],
                    additionalProperties: false,
                  },
                  minItems: 5, maxItems: 5,
                },
                summary: { type: "string" },
              },
              required: ["axes", "summary"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "board_self_answer" } },
      }),
    });

    if (!aiResp.ok) {
      const status = aiResp.status;
      const text = await aiResp.text();
      console.error("AI gateway error", status, text);
      const msg =
        status === 429 ? "Rate limit reached. Please try again in a moment." :
        status === 402 ? "AI credits exhausted. Add credits in Settings → Workspace → Usage." :
        "AI gateway error";
      return new Response(JSON.stringify({ error: msg }), {
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "AI did not return a structured answer" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const parsed = JSON.parse(toolCall.function.arguments) as {
      axes: { key: Axis; narration: string; tile_keys: string[]; maturity: number }[];
      summary: string;
    };

    // Compute deterministic tile ids per axis based on PRD hash + maturity
    const hash = await sha256Bytes(prdText);
    const enrichedAxes = parsed.axes.map((a) => {
      const count = maturityToTileCount(a.key, a.maturity);
      const tile_ids = pickTiles(hash, a.key, count);
      return { ...a, tile_ids };
    });
    const overallMaturity = Object.fromEntries(
      enrichedAxes.map((a) => [a.key, a.maturity]),
    ) as Record<Axis, number>;

    // Identify caller (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const sb = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } },
        );
        const { data: { user } } = await sb.auth.getUser();
        if (user) userId = user.id;
      } catch (_) { /* anonymous ok */ }
    }

    // Persist with service role
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    let savedSlug: string | null = null;
    let savedId: string | null = null;
    try {
      const { data, error } = await admin
        .from("dream_runs")
        .insert({
          user_id: userId,
          question,
          filename: file.name,
          axes: enrichedAxes,
          summary: parsed.summary,
          overall_maturity: overallMaturity,
          is_public: true,
        })
        .select("id, share_slug")
        .single();
      if (error) console.error("dream_runs insert error", error);
      else { savedSlug = data.share_slug; savedId = data.id; }
    } catch (e) {
      console.error("dream_runs insert exception", e);
    }

    // Stream
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(sse("start", { question, filename: file.name }));
        await new Promise((r) => setTimeout(r, 250));

        for (const axis of enrichedAxes) {
          controller.enqueue(sse("axis_begin", {
            key: axis.key,
            tile_keys: axis.tile_keys,
            tile_ids: axis.tile_ids,
            maturity: axis.maturity,
          }));
          const words = axis.narration.split(/(\s+)/);
          for (const w of words) {
            controller.enqueue(sse("narration", { key: axis.key, delta: w }));
            await new Promise((r) => setTimeout(r, 28));
          }
          controller.enqueue(sse("axis_end", { key: axis.key }));
          await new Promise((r) => setTimeout(r, 300));
        }
        controller.enqueue(sse("summary", { text: parsed.summary }));
        if (savedSlug) controller.enqueue(sse("saved", { id: savedId, share_slug: savedSlug }));
        controller.enqueue(sse("done", {}));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("dream-prd-analysis error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
