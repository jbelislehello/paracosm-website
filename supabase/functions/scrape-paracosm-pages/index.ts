import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "https://esm.sh/zod@3.23.8";
import { assertAllowedUrl } from "../_shared/sourceGuard.ts";
import { requireAdmin } from "../_shared/requireAdmin.ts";

const BodySchema = z.object({
  urls: z.array(z.string().url()).min(1).max(12),
});

interface ScrapedPage {
  url: string;
  title: string;
  markdown: string;
}

async function scrapeOne(url: string, apiKey: string): Promise<ScrapedPage> {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Firecrawl scrape failed for ${url}`);
  // Firecrawl v2 places fields either at root or under data
  const root = (data?.data ?? data) as { markdown?: string; metadata?: { title?: string } };
  const md = (root.markdown || "").slice(0, 12000); // cap tokens
  return { url, title: root.metadata?.title || url, markdown: md };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const gate = await requireAdmin(req);
  if (gate instanceof Response) return gate;


  try {
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY is not configured");

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { urls } = parsed.data;
    urls.forEach((u) => assertAllowedUrl(u));

    const pages: ScrapedPage[] = [];
    for (const url of urls) {
      try {
        pages.push(await scrapeOne(url, FIRECRAWL_API_KEY));
      } catch (e) {
        console.warn("scrape failed", url, e);
      }
    }

    return new Response(JSON.stringify({ pages }), {
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
