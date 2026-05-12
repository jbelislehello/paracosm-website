// Single-entry lead capture for the Calm Magic book funnel.
// Inserts into book_preorders, emails jbelisle@helloarchitekt.com via Resend.

import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOTIFY_TO = "jbelisle@helloarchitekt.com";
const FROM = "Paracosm Book <book@calm-magic.com>";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  role: z.string().trim().max(120).optional().nullable(),
  tier: z.enum(["reader", "practitioner", "org"]).default("reader"),
  interest: z.enum(["sample", "waitlist", "cohort", "org"]).default("waitlist"),
  chapter_slug: z.string().trim().max(120).optional().nullable(),
  language: z.enum(["en", "fr"]).default("en"),
  source: z.string().trim().max(200).optional().nullable(),
  utm: z.record(z.string()).optional().nullable(),
  // honeypot
  website: z.string().max(0).optional(),
});

async function notify(payload: z.infer<typeof BodySchema>) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.warn("RESEND_API_KEY missing; skipping notification email.");
    return;
  }
  const subject = `[Calm Magic Book] New ${payload.interest} — ${payload.name}`;
  const html = `
    <h2>New book funnel lead</h2>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Interest:</strong> ${payload.interest}</p>
    <p><strong>Tier:</strong> ${payload.tier}</p>
    ${payload.role ? `<p><strong>Role:</strong> ${payload.role}</p>` : ""}
    ${payload.chapter_slug ? `<p><strong>Chapter:</strong> ${payload.chapter_slug}</p>` : ""}
    <p><strong>Language:</strong> ${payload.language}</p>
    <p><strong>Source:</strong> ${payload.source ?? "n/a"}</p>
    ${payload.utm ? `<pre>${JSON.stringify(payload.utm, null, 2)}</pre>` : ""}
  `;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [NOTIFY_TO], subject, html }),
    });
  } catch (err) {
    console.error("Resend notify failed", err);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (parsed.data.website) {
      // honeypot triggered; pretend success
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabase.from("book_preorders").insert({
      name: data.name,
      email: data.email,
      role: data.role ?? null,
      tier: data.tier,
      language: data.language,
      source: data.source ?? "book_funnel",
      interest: data.interest,
      chapter_slug: data.chapter_slug ?? null,
      utm: data.utm ?? null,
    });

    if (error) {
      console.error("Insert lead failed", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await notify(data);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
