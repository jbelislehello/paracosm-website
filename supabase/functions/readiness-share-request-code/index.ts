import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(n).padStart(6, "0");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const shareId = String(body?.shareId ?? "").trim();
    const emailRaw = String(body?.email ?? "").trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shareId || !emailRe.test(emailRaw) || emailRaw.length > 254) {
      return new Response(JSON.stringify({ error: "invalid_input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: share, error: shareErr } = await supabase
      .from("readiness_shares")
      .select("id, recipient_emails, expires_at, revoked_at, note")
      .eq("id", shareId)
      .maybeSingle();
    if (shareErr) throw shareErr;
    if (!share) {
      return new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (share.revoked_at) {
      return new Response(JSON.stringify({ error: "revoked" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (new Date(share.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: "expired" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const allowed = (share.recipient_emails as string[]).map((e) => e.toLowerCase());
    if (!allowed.includes(emailRaw)) {
      // Avoid leaking which emails are on the list
      return new Response(JSON.stringify({ error: "not_authorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit: max 5 unexpired codes issued per email/share in last hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("readiness_share_codes")
      .select("id", { count: "exact", head: true })
      .eq("share_id", shareId)
      .ilike("email", emailRaw)
      .gt("created_at", hourAgo);
    if ((count ?? 0) >= 5) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const code = generateCode();
    const codeHash = await sha256(`${shareId}:${emailRaw}:${code}`);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const { error: insertErr } = await supabase.from("readiness_share_codes").insert({
      share_id: shareId,
      email: emailRaw,
      code_hash: codeHash,
      expires_at: expiresAt,
    });
    if (insertErr) throw insertErr;

    // Send email via Resend
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");
    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a1a">
        <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#777">Paracosm · Calm Magic</div>
        <h1 style="font-size:22px;margin:12px 0 4px">Your access code</h1>
        <p style="font-size:14px;color:#555;margin:0 0 16px">
          Someone shared a Readiness Assessment report with you. Enter this code on the share page to view it.
        </p>
        <div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:28px;letter-spacing:.35em;background:#f5f5f5;border-radius:12px;padding:18px;text-align:center">${code}</div>
        <p style="font-size:12px;color:#888;margin-top:16px">This code expires in 15 minutes. If you didn't request it, you can ignore this email.</p>
      </div>`;
    const emailResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Paracosm <no-reply@helloarchitekt.com>",
        to: [emailRaw],
        subject: "Your Calm Magic readiness access code",
        html,
      }),
    });
    if (!emailResp.ok) {
      const t = await emailResp.text();
      console.error("resend error", emailResp.status, t);
      throw new Error("email_send_failed");
    }
    await emailResp.text();

    return new Response(JSON.stringify({ ok: true, expiresAt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("request-code error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
