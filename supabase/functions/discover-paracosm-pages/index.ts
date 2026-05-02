import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "https://esm.sh/zod@3.23.8";
import { ALLOWED_HOST, BLOCKED_HOSTS } from "../_shared/sourceGuard.ts";

const BodySchema = z.object({
  search: z.string().trim().max(200).optional(),
  limit: z.number().int().min(1).max(200).optional().default(80),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY is not configured");

    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { search, limit } = parsed.data;

    const fcRes = await fetch("https://api.firecrawl.dev/v2/map", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://${ALLOWED_HOST}`,
        search: search || "agentic ecosystem orchestrator calm magic",
        limit,
        includeSubdomains: false,
      }),
    });

    const data = await fcRes.json();
    if (!fcRes.ok) {
      return new Response(
        JSON.stringify({ error: data?.error || `Firecrawl map failed (${fcRes.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const rawLinks: string[] = Array.isArray(data?.links)
      ? data.links.map((l: unknown) => (typeof l === "string" ? l : (l as { url?: string })?.url)).filter(Boolean)
      : [];

    const urls = Array.from(
      new Set(
        rawLinks.filter((l) => {
          try {
            const u = new URL(l);
            return u.host === ALLOWED_HOST && !BLOCKED_HOSTS.has(u.host);
          } catch {
            return false;
          }
        }),
      ),
    );

    return new Response(JSON.stringify({ urls }), {
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
