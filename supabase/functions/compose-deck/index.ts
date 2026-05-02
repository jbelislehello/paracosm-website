import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const SlideTypeSchema = z.enum([
  "title",
  "bullets",
  "two-column",
  "quote",
  "stat",
  "closing-cta",
]);

const SlideSchema = z.object({
  id: z.string(),
  type: SlideTypeSchema,
  title: z.string(),
  subtitle: z.string().optional().default(""),
  bullets: z.array(z.string()).optional().default([]),
  body: z.string().optional().default(""),
  speakerNotes: z.string().optional().default(""),
  sourceUrls: z.array(z.string()).optional().default([]),
});

const OutlineSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  slides: z.array(SlideSchema).min(3).max(24),
});

const BodySchema = z.object({
  stage: z.enum(["outline", "slides"]),
  audience: z.string().min(1).max(40),
  tone: z.string().min(1).max(40),
  length: z.enum(["short", "standard", "deep"]).default("standard"),
  intent: z.string().max(500).optional().default(""),
  pages: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        markdown: z.string(),
      }),
    )
    .min(1)
    .max(12),
  outline: OutlineSchema.optional(),
});

const LENGTH_TO_COUNT: Record<string, number> = { short: 8, standard: 12, deep: 18 };

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
    `Output JSON only. Schema:`,
    `{"title": string, "subtitle": string, "slides": [{"id": string, "type": "title"|"bullets"|"two-column"|"quote"|"stat"|"closing-cta", "title": string, "subtitle": string, "bullets": string[], "body": string, "speakerNotes": string, "sourceUrls": string[]}]}`,
    `Rules:`,
    `- Slide 1 must be type "title".`,
    `- Last slide must be type "closing-cta" and route to a conversation with jbelisle@helloarchitekt.com.`,
    `- Mix slide types. At least one "stat" and one "quote" if material supports it.`,
    `- Bullets: max 5 per slide, max 14 words each. No markdown.`,
    `- speakerNotes: 2-4 sentences, conversational.`,
    `- sourceUrls: list the URLs whose content informed the slide.`,
    `\n=== SOURCES ===\n${sources}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildSlidesPrompt(input: z.infer<typeof BodySchema>) {
  const sources = input.pages
    .map((p, i) => `[#${i + 1}] ${p.title}\nURL: ${p.url}\n---\n${p.markdown}`)
    .join("\n\n========\n\n");
  return [
    `You are refining the body content for an existing slide outline. Audience: ${input.audience}. Tone: ${input.tone}.`,
    `Return the SAME JSON outline shape but with richer "bullets", "body", and "speakerNotes" populated for every slide.`,
    `Do NOT change slide order, type, or count. Keep titles unless they are clearly weak.`,
    `Use ONLY the source material below.`,
    `\n=== EXISTING OUTLINE ===\n${JSON.stringify(input.outline)}`,
    `\n=== SOURCES ===\n${sources}`,
  ].join("\n\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You output strict JSON only. No prose, no code fences." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
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
      throw new Error(`AI gateway failed [${aiRes.status}]: ${txt.slice(0, 300)}`);
    }

    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    let outline: unknown;
    try {
      outline = JSON.parse(content);
    } catch {
      throw new Error("AI returned non-JSON content");
    }

    const validated = OutlineSchema.safeParse(outline);
    if (!validated.success) {
      return new Response(
        JSON.stringify({
          error: "AI output failed validation",
          issues: validated.error.flatten(),
          raw: outline,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ outline: validated.data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
