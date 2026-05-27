// Ingests calm-magic.com pages into book_sources, mapped to chapter phase via keyword heuristic.
// Admin-only. POST { url?: string, limit?: number, dryRun?: boolean }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIRECRAWL = "https://api.firecrawl.dev/v2";

type Phase = "GLITCH" | "DRIFT" | "TUNE" | "LOVE" | "MAGIC" | "CALM" | "OPEN" | "FREE";

const PHASE_KEYWORDS: Record<Phase, string[]> = {
  GLITCH: ["glitch", "friction", "rupture", "naming", "tension", "stuck", "block", "shadow"],
  DRIFT: ["drift", "pattern", "explor", "discovery", "wander", "library", "resource", "archive"],
  TUNE: ["tune", "commit", "intention", "align", "focus", "decision", "choose"],
  LOVE: ["love", "relation", "team", "trust", "empath", "care", "community", "together", "healing"],
  MAGIC: ["magic", "imagin", "creativ", "poet", "story", "narrative", "wonder", "dream", "vision"],
  CALM: ["calm", "system", "design", "framework", "structure", "compass", "board", "architecture", "prd"],
  OPEN: ["open", "ontolog", "futur", "preferable", "living", "emerge", "consciousness", "manifold"],
  FREE: ["free", "flow", "operat", "agility", "ship", "deploy", "execution", "agentic", "automation"],
};

function classify(text: string): Phase {
  const t = text.toLowerCase();
  let best: Phase = "CALM";
  let bestScore = -1;
  for (const phase of Object.keys(PHASE_KEYWORDS) as Phase[]) {
    const score = PHASE_KEYWORDS[phase].reduce(
      (s, kw) => s + (t.split(kw).length - 1),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = phase;
    }
  }
  return best;
}

function chunk(s: string, max = 3500): string {
  return s.length <= max ? s : s.slice(0, max);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const fcKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!fcKey) throw new Error("FIRECRAWL_API_KEY missing");

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: corsHeaders });

    const admin = createClient(url, service);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: corsHeaders });

    const body = await req.json().catch(() => ({}));
    const target = body.url ?? "https://calm-magic.com";
    const limit = Math.min(body.limit ?? 60, 120);
    const dryRun = !!body.dryRun;

    // 1. Map site
    const mapRes = await fetch(`${FIRECRAWL}/map`, {
      method: "POST",
      headers: { Authorization: `Bearer ${fcKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url: target, limit, includeSubdomains: false }),
    });
    const mapJson = await mapRes.json();
    const links: string[] = (mapJson.links ?? mapJson.data?.links ?? []).slice(0, limit);

    // 2. Load chapters by phase
    const { data: chapters } = await admin.from("book_chapters").select("id, phase, title");
    const phaseToChapter = new Map<string, { id: string; title: string }>();
    for (const c of chapters ?? []) phaseToChapter.set(c.phase, { id: c.id, title: c.title });

    const results: any[] = [];
    let inserted = 0;

    // 3. Scrape with concurrency 4
    async function process(link: string) {
      try {
        const sr = await fetch(`${FIRECRAWL}/scrape`, {
          method: "POST",
          headers: { Authorization: `Bearer ${fcKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ url: link, formats: ["markdown"], onlyMainContent: true }),
        });
        const sj = await sr.json();
        const md: string = sj.data?.markdown ?? sj.markdown ?? "";
        const title: string = sj.data?.metadata?.title ?? sj.metadata?.title ?? link;
        if (!md || md.length < 300) return { link, skipped: "too-short" };
        const phase = classify(`${title}\n${md}\n${link}`);
        const target = phaseToChapter.get(phase);
        if (!target) return { link, skipped: `no-chapter-for-${phase}` };
        const excerpt = chunk(md);
        if (!dryRun) {
          const { error } = await admin.from("book_sources").insert({
            chapter_id: target.id,
            kind: "site_page",
            title: title.slice(0, 240),
            ref: link,
            excerpt,
            included: true,
            weight: 1,
            notes: `auto-ingested from ${new URL(link).hostname}`,
          });
          if (error) return { link, error: error.message };
          inserted++;
        }
        return { link, phase, chapter: target.title, chars: excerpt.length };
      } catch (e) {
        return { link, error: String(e) };
      }
    }

    const pool = 4;
    for (let i = 0; i < links.length; i += pool) {
      const batch = links.slice(i, i + pool);
      const settled = await Promise.all(batch.map(process));
      results.push(...settled);
    }

    return new Response(JSON.stringify({ ok: true, mapped: links.length, inserted, dryRun, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
