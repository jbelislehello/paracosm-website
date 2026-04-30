import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const RESEND_API_URL = "https://api.resend.com";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(2000),
  // Honeypot: bots auto-fill hidden fields. Real users leave it empty.
  website: z.string().max(0).optional().or(z.literal("")).optional(),
  // Time-trap: form must take at least 2 seconds to fill
  elapsedMs: z.number().int().nonnegative().optional(),
});

// Best-effort in-memory rate limit (per edge function instance).
// NOT a strong guarantee — instances are ephemeral and not shared across regions.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 1;
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
  // Opportunistic cleanup
  if (recentRequests.size > 500) {
    for (const [k, v] of recentRequests) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) recentRequests.delete(k);
    }
  }
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { name, email, company, message, website, elapsedMs } = parsed.data;

    // Honeypot tripped — silently accept to avoid signaling bots.
    if (website && website.length > 0) {
      console.warn("send-demo-request: honeypot tripped", { email });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Time-trap: instant submissions are almost certainly bots.
    if (typeof elapsedMs === "number" && elapsedMs < 2000) {
      console.warn("send-demo-request: time-trap tripped", { elapsedMs, email });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit per IP + email (best effort)
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "unknown";
    const rlKey = `${ip}:${email.toLowerCase()}`;
    if (isRateLimited(ip) || isRateLimited(rlKey)) {
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests. Please try again in a minute." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const html = `
      <h2>New Agentic Ecosystems demo request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company || "—")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
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
        subject: `Demo request — ${name}${company ? ` (${company})` : ""}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Resend failed [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("send-demo-request error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
