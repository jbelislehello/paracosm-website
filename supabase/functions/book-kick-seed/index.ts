// One-shot internal kick that invokes book-seed-from-corpus with service-role auth.
// Builds tarot + drift payloads server-side from the calm-magic corpus is not possible
// here (no client data tables yet); this kick only triggers the site + board pass.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const body = await req.text().catch(() => "");
    const payload = body && body.length > 2 ? body : JSON.stringify({ scrapeSite: true, siteLimit: 200, tarot: [], drift: [] });
    const r = await fetch(`${URL}/functions/v1/book-seed-from-corpus`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE}`,
        apikey: SERVICE,
        "Content-Type": "application/json",
      },
      body: payload,
    });
    const text = await r.text();
    return new Response(text, { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
