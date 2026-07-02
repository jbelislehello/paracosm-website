import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";

const RESEND_API_URL = "https://api.resend.com";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(200).optional().default(""),
  project_idea: z.string().trim().min(1).max(2000),
  language: z.enum(["en", "fr"]).optional().default("en"),
  source: z.string().max(100).optional().default("landing_summer_deal"),
  website: z.string().max(0).optional().or(z.literal("")).optional(),
  elapsedMs: z.number().int().nonnegative().optional(),
});

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 2;
const recentRequests = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (recentRequests.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) {
    recentRequests.set(key, arr);
    return true;
  }
  arr.push(now);
  recentRequests.set(key, arr);
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { name, email, company, project_idea, language, source, website, elapsedMs } = parsed.data;

    // Honeypot
    if (website && website.length > 0) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Time-trap
    if (typeof elapsedMs === "number" && elapsedMs < 2000) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "unknown";
    if (isRateLimited(ip) || isRateLimited(`${ip}:${email.toLowerCase()}`)) {
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests. Please try again in a minute." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Insert into DB with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { error: insertError } = await supabase.from("summer_deal_leads").insert({
      name,
      email,
      company: company || null,
      project_idea,
      language,
      source,
    });
    if (insertError) console.error("summer_deal_leads insert error:", insertError);

    // Send email
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const html = `
        <h2>New Summer Deal lead ($8,500 MVP in 2 weeks)</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "—")}</p>
        <p><strong>Language:</strong> ${escapeHtml(language)}</p>
        <p><strong>Source:</strong> ${escapeHtml(source)}</p>
        <p><strong>Project idea:</strong></p>
        <p>${escapeHtml(project_idea).replace(/\n/g, "<br/>")}</p>
      `;
      const res = await fetch(`${RESEND_API_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Paracosm <onboarding@resend.dev>",
          to: ["jbelisle@helloarchitekt.com"],
          reply_to: email,
          subject: `Summer Deal lead — ${name}${company ? ` (${company})` : ""}`,
          html,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Resend failed", res.status, data);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("send-summer-deal-lead error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
