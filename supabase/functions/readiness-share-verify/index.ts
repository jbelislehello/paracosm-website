import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const shareId = String(body?.shareId ?? "").trim();
    const emailRaw = String(body?.email ?? "").trim().toLowerCase();
    const code = String(body?.code ?? "").trim();
    if (!shareId || !emailRaw || !/^\d{6}$/.test(code)) {
      return new Response(JSON.stringify({ error: "invalid_input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: share } = await supabase
      .from("readiness_shares")
      .select("id, recipient_emails, expires_at, revoked_at, snapshot, note, created_at")
      .eq("id", shareId)
      .maybeSingle();
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

    // Latest active code for (share, email)
    const { data: rows } = await supabase
      .from("readiness_share_codes")
      .select("id, code_hash, expires_at, consumed_at, attempts")
      .eq("share_id", shareId)
      .ilike("email", emailRaw)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1);
    const row = rows?.[0];
    if (!row) {
      return new Response(JSON.stringify({ error: "no_code" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (row.attempts >= 5) {
      return new Response(JSON.stringify({ error: "too_many_attempts" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: "code_expired" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expectHash = await sha256(`${shareId}:${emailRaw}:${code}`);
    if (expectHash !== row.code_hash) {
      await supabase
        .from("readiness_share_codes")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
      return new Response(JSON.stringify({ error: "invalid_code" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("readiness_share_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", row.id);

    return new Response(
      JSON.stringify({
        ok: true,
        snapshot: share.snapshot,
        note: share.note,
        expiresAt: share.expires_at,
        createdAt: share.created_at,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("verify error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
