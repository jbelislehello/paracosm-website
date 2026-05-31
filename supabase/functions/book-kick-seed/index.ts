// Internal admin kick that invokes book-seed-from-corpus.
// Requires an authenticated admin caller.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { requireAdmin } from "../_shared/requireAdmin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const gate = await requireAdmin(req);
  if (gate instanceof Response) return gate;

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
