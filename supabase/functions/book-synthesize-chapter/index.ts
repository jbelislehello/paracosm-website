// Admin-only: synthesize a chapter draft from its mapped book_sources + uploads
// using Lovable AI Gateway. Saves to book_chapter_drafts.

import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";
import { callLovableAi, type ChatMessage } from "../_shared/ai-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AudienceSchema = z.enum(["general", "practitioner", "executive"]);
type Audience = z.infer<typeof AudienceSchema>;

const BodySchema = z.object({
  chapter_id: z.string().uuid(),
  model: z.string().optional(),
  guidance: z.string().max(4000).optional(),
  audience: AudienceSchema.optional(),
});

const BASE_PROMPT = `You are the ghostwriter for "Calm Magic", a book by Jonathan Belisle on the four capabilities of the agentic era: Relational Intelligence, Pragmatic Imagination, Creative Ideation, and Existential Design.

Constraints:
- Stay strictly within the chapter's phase (GLITCH, DRIFT, TUNE, LOVE, MAGIC, CALM, FREE) and its summary.
- Synthesize from the provided source excerpts. Quote sparingly; never fabricate sources or names.
- Write in markdown. Open with a 2-3 sentence cold-open scene or claim. Then 4-7 short sections with H2 headings. End with a "Field Note" callout.
- Aim for 1500-2200 words.`;

const AUDIENCE_VOICE: Record<Audience, string> = {
  general: `Audience: curious general reader, no prior background assumed.
Voice: plain-language, warm, accessible. Literary but jargon-free. Define any term that isn't everyday English on first use. Prefer concrete scenes and everyday metaphors over abstractions. Use second person sparingly. No corporate cliches, no hype, no listicle vibes.`,
  practitioner: `Audience: facilitators, coaches, designers, and operators already inside the Calm Magic world.
Voice: lucid, generous, slightly literary. Sentences earn their weight. Assume fluency with the seven phases, the board, polyvagal regulation, and the Paracosm vocabulary. No corporate cliches, no hype, no listicle vibes. Use second person sparingly. Favor flowing prose with occasional structural beats.`,
  executive: `Audience: executives and decision-makers in organizations adopting agentic systems.
Voice: strategic, calm, precise. Translate the phase into operating implications: risk, capability, governance, velocity, preferable futures. Keep the literary spine, but lead each section with a clear claim a leader can act on. No hype. No listicle soup. Use crisp prose with occasional decision-oriented beats.`,
};

function systemPromptFor(audience: Audience): string {
  return `${BASE_PROMPT}\n\n${AUDIENCE_VOICE[audience]}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: userData } = await supabaseUser.auth.getUser();
    const user = userData.user;
    if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify admin
    const { data: roleCheck } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!roleCheck) {
      return new Response("Forbidden", { status: 403, headers: corsHeaders });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { chapter_id, guidance } = parsed.data;
    const audience: Audience = parsed.data.audience ?? "practitioner";
    const model = parsed.data.model ?? "google/gemini-3-flash-preview";

    // Load chapter + sources + uploads
    const { data: chapter, error: chErr } = await supabase
      .from("book_chapters")
      .select("*")
      .eq("id", chapter_id)
      .maybeSingle();
    if (chErr || !chapter) {
      return new Response(JSON.stringify({ error: "Chapter not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: sources } = await supabase
      .from("book_sources")
      .select("kind, ref, title, excerpt, weight")
      .eq("chapter_id", chapter_id)
      .eq("included", true)
      .order("weight", { ascending: false });

    const { data: uploads } = await supabase
      .from("book_uploads")
      .select("original_name, extracted_text")
      .eq("chapter_id", chapter_id);

    const sourceBlock = (sources ?? [])
      .map((s, i) =>
        `### Source ${i + 1} — ${s.kind} (weight ${s.weight})
Title: ${s.title ?? s.ref}
Ref: ${s.ref}
${s.excerpt ? `Excerpt:\n${s.excerpt}` : ""}`
      )
      .join("\n\n");

    const uploadBlock = (uploads ?? [])
      .filter((u) => u.extracted_text)
      .map((u, i) =>
        `### Manuscript ${i + 1} — ${u.original_name ?? "untitled"}
${(u.extracted_text ?? "").slice(0, 8000)}`
      )
      .join("\n\n");

    const userPrompt = `Chapter: ${chapter.title}
Phase: ${chapter.phase}
Summary: ${chapter.summary ?? "(none)"}

${guidance ? `Author guidance for this draft:\n${guidance}\n\n` : ""}---

# Mapped sources
${sourceBlock || "(no sources mapped)"}

# Uploaded manuscript material
${uploadBlock || "(no uploads attached)"}

---

Write the full chapter draft now in markdown.`;

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    const draft = await callLovableAi(messages, { model, maxTokens: 6000 });

    // Mark previous drafts non-current, insert new as current
    await supabase
      .from("book_chapter_drafts")
      .update({ is_current: false })
      .eq("chapter_id", chapter_id);

    const { data: inserted, error: insErr } = await supabase
      .from("book_chapter_drafts")
      .insert({
        chapter_id,
        model,
        prompt_snapshot: userPrompt.slice(0, 20000),
        draft_md: draft,
        is_current: true,
        created_by: user.id,
      })
      .select("id")
      .maybeSingle();

    if (insErr) {
      return new Response(JSON.stringify({ error: insErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Bump chapter status to drafting if still outline
    if (chapter.status === "outline") {
      await supabase
        .from("book_chapters")
        .update({ status: "drafting" })
        .eq("id", chapter_id);
    }

    return new Response(
      JSON.stringify({ ok: true, draft_id: inserted?.id, draft_md: draft }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
