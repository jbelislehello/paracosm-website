import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const SLIDE_TYPES = ["title", "bullets", "two-column", "quote", "stat", "closing-cta"] as const;
type SlideType = typeof SLIDE_TYPES[number];

const BodySchema = z.object({
  stage: z.enum(["outline", "slides"]),
  audience: z.string().min(1).max(40),
  tone: z.string().min(1).max(40),
  length: z.enum(["short", "standard", "deep"]).default("standard"),
  intent: z.string().max(500).optional().default(""),
  pages: z
    .array(z.object({ url: z.string(), title: z.string(), markdown: z.string() }))
    .min(1)
    .max(12),
  outline: z.any().optional(),
});

const LENGTH_TO_COUNT: Record<string, number> = { short: 7, standard: 10, deep: 16 };

interface NormalizedSlide {
  id: string;
  type: SlideType;
  title: string;
  subtitle: string;
  bullets: string[];
  body: string;
  speakerNotes: string;
  sourceUrls: string[];
}

interface NormalizedOutline {
  title: string;
  subtitle: string;
  slides: NormalizedSlide[];
}

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (v == null) return fallback;
  return String(v);
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => asString(x)).filter(Boolean);
  if (typeof v === "string" && v.trim()) return [v];
  return [];
}

function repairOutline(raw: unknown): { outline: NormalizedOutline | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!raw || typeof raw !== "object") {
    return { outline: null, warnings: ["AI returned non-object response"] };
  }
  const r = raw as Record<string, unknown>;
  let slidesRaw = r.slides;
  // Some models wrap in { outline: {...} }
  if (!Array.isArray(slidesRaw) && r.outline && typeof r.outline === "object") {
    const inner = r.outline as Record<string, unknown>;
    slidesRaw = inner.slides;
    r.title = r.title ?? inner.title;
    r.subtitle = r.subtitle ?? inner.subtitle;
  }
  if (!Array.isArray(slidesRaw) || slidesRaw.length === 0) {
    return { outline: null, warnings: ["AI returned no slides array"] };
  }

  const slides: NormalizedSlide[] = slidesRaw.map((s: unknown, i: number) => {
    const obj = (s && typeof s === "object" ? (s as Record<string, unknown>) : {});
    let type = asString(obj.type, "bullets") as SlideType;
    if (!SLIDE_TYPES.includes(type)) {
      warnings.push(`Slide ${i + 1} had unknown type "${type}", coerced to bullets`);
      type = "bullets";
    }
    return {
      id: asString(obj.id, `slide-${i + 1}`),
      type,
      title: asString(obj.title, `Slide ${i + 1}`),
      subtitle: asString(obj.subtitle, ""),
      bullets: asStringArray(obj.bullets).slice(0, 6),
      body: asString(obj.body, ""),
      speakerNotes: asString(obj.speakerNotes ?? obj.speaker_notes, ""),
      sourceUrls: asStringArray(obj.sourceUrls ?? obj.source_urls),
    };
  });

  // Ensure first/last slide types
  if (slides[0] && slides[0].type !== "title") {
    warnings.push("First slide was not 'title', repaired");
    slides[0].type = "title";
  }
  const last = slides[slides.length - 1];
  if (last && last.type !== "closing-cta") {
    warnings.push("Last slide was not 'closing-cta', repaired");
    last.type = "closing-cta";
  }

  return {
    outline: {
      title: asString(r.title, "Untitled deck"),
      subtitle: asString(r.subtitle, ""),
      slides,
    },
    warnings,
  };
}

function buildOutlinePrompt(input: z.infer<typeof BodySchema>) {
  const slideCount = LENGTH_TO_COUNT[input.length];
  const sources = input.pages
    .map((p, i) => `[#${i + 1}] ${p.title}\nURL: ${p.url}\n---\n${p.markdown}`)
    .join("\n\n========\n\n");

  return [
    `You are a senior strategy designer building a presentation about Paracosm's "Agentic Ecosystem" service offering.`,
    `Audience: ${input.audience}. Tone: ${input.tone}. Slide count: ~${slideCount}.`,
    input.intent ? `Specific intent for this deck: ${input.intent}` : "",
    `Use ONLY the source material below (from paracosm.helloarchitekt.com). Do not invent facts.`,
    `Output JSON only. Required shape:`,
    `{"title": string, "subtitle": string, "slides": [{"id": string, "type": "title"|"bullets"|"two-column"|"quote"|"stat"|"closing-cta", "title": string, "subtitle": string, "bullets": string[], "body": string, "speakerNotes": string, "sourceUrls": string[]}]}`,
    `EVERY slide MUST include all fields. Use empty string "" or empty array [] when not applicable.`,
    `Rules:`,
    `- Slide 1 must be type "title".`,
    `- Last slide must be type "closing-cta" routing to a conversation with jbelisle@helloarchitekt.com.`,
    `- Mix slide types. At least one "stat" and one "quote" if material supports it.`,
    `- Bullets: max 5 per slide, max 14 words each. No markdown.`,
    `- speakerNotes: 2-4 sentences, conversational.`,
    `- sourceUrls: list the URLs whose content informed the slide.`,
    `\n=== SOURCES ===\n${sources}`,
  ].filter(Boolean).join("\n\n");
}

function buildSlidesPrompt(input: z.infer<typeof BodySchema>) {
  const sources = input.pages
    .map((p, i) => `[#${i + 1}] ${p.title}\nURL: ${p.url}\n---\n${p.markdown}`)
    .join("\n\n========\n\n");
  return [
    `You are refining the body content for an existing slide outline. Audience: ${input.audience}. Tone: ${input.tone}.`,
    `Return the SAME JSON outline shape but with richer "bullets", "body", and "speakerNotes" populated for every slide.`,
    `EVERY slide MUST include all fields (id, type, title, subtitle, bullets, body, speakerNotes, sourceUrls). Use "" or [] when empty.`,
    `Do NOT change slide order, type, or count. Keep titles unless they are clearly weak.`,
    `Use ONLY the source material below.`,
    `\n=== EXISTING OUTLINE ===\n${JSON.stringify(input.outline)}`,
    `\n=== SOURCES ===\n${sources}`,
  ].join("\n\n");
}

async function callAI(prompt: string, model: string, signal: AbortSignal) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You output strict JSON only. No prose, no code fences." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  return aiRes;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const input = parsed.data;
    if (input.stage === "slides" && !input.outline) {
      return new Response(JSON.stringify({ error: "outline required for stage=slides" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = input.stage === "outline" ? buildOutlinePrompt(input) : buildSlidesPrompt(input);

    // Try primary model with 60s timeout; on parse/validation failure, retry with stricter model.
    const models = ["google/gemini-2.5-flash", "google/gemini-2.5-pro"];
    let lastError = "Unknown error";
    let allWarnings: string[] = [];

    for (let attempt = 0; attempt < models.length; attempt++) {
      const model = models[attempt];
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);
      let aiRes: Response;
      try {
        aiRes = await callAI(prompt, model, controller.signal);
      } catch (err) {
        clearTimeout(timeout);
        lastError = err instanceof Error ? err.message : String(err);
        console.error(`[compose-deck] model ${model} fetch failed:`, lastError);
        continue;
      }
      clearTimeout(timeout);

      if (!aiRes.ok) {
        const txt = await aiRes.text();
        console.error(`[compose-deck] model ${model} HTTP ${aiRes.status}: ${txt.slice(0, 300)}`);
        if (aiRes.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited. Try again in a moment." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiRes.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        lastError = `AI gateway ${aiRes.status}: ${txt.slice(0, 200)}`;
        continue;
      }

      const aiJson = await aiRes.json();
      const content = aiJson?.choices?.[0]?.message?.content;
      if (!content) {
        lastError = "Empty AI response";
        console.error(`[compose-deck] model ${model} returned empty content`);
        continue;
      }

      let rawOutline: unknown;
      try {
        rawOutline = JSON.parse(content);
      } catch {
        lastError = "AI returned non-JSON content";
        console.error(`[compose-deck] model ${model} non-JSON content (first 500 chars):`, content.slice(0, 500));
        continue;
      }

      const { outline, warnings } = repairOutline(rawOutline);
      allWarnings = warnings;
      if (!outline || outline.slides.length < 2) {
        lastError = "AI output could not be repaired into a usable outline";
        console.error(`[compose-deck] model ${model} unusable outline:`, JSON.stringify(rawOutline).slice(0, 500));
        continue;
      }

      return new Response(
        JSON.stringify({ outline, warnings: warnings.length ? warnings : undefined }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: lastError, warnings: allWarnings }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[compose-deck] unhandled:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
