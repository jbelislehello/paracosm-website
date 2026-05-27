import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { ALLOWED_HOST, BLOCKED_HOSTS } from "../_shared/sourceGuard.ts";

const PHASES = ["GLITCH", "DRIFT", "TUNE", "LOVE", "MAGIC", "CALM", "FREE"] as const;
type Phase = typeof PHASES[number];

const PHASE_PATTERNS: Array<[Phase, RegExp]> = [
  ["GLITCH", /\b(glitch|friction|rupture|break|stuck|crisis)\b/i],
  ["DRIFT",  /\b(drift|pattern|explore|wander|library|discover)\b/i],
  ["TUNE",   /\b(tune|commit|intention|align|focus|decide)\b/i],
  ["LOVE",   /\b(love|relation|trust|care|empath|voice|tonalli)\b/i],
  ["MAGIC",  /\b(magic|imagin|story|narrative|wuxia|tarot|paracosm|dream)\b/i],
  ["CALM",   /\b(calm|system|design|workflow|prd|architect|ontolog)\b/i],
  ["FREE",   /\b(free|flow|operate|launch|publish|ship|liberate)\b/i],
];

function classify(text: string): Phase {
  for (const [p, re] of PHASE_PATTERNS) if (re.test(text)) return p;
  return "GLITCH";
}

const InputItem = z.object({
  ref: z.string().min(1),
  title: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  hint: z.string().optional().nullable(),
});
const Body = z.object({
  scrapeSite: z.boolean().optional().default(true),
  siteLimit: z.number().int().min(1).max(300).optional().default(200),
  tarot: z.array(InputItem).optional().default([]),
  drift: z.array(InputItem).optional().default([]),
});

type Row = { chapter_id: string; kind: string; ref: string; title: string | null; excerpt: string | null; weight: number; included: boolean };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const FIRECRAWL = Deno.env.get("FIRECRAWL_API_KEY");

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes } = await userClient.auth.getUser();
    if (!userRes?.user) return json({ error: "Not authenticated" }, 401);
    const admin = createClient(SUPABASE_URL, SERVICE);
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", userRes.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) return json({ error: "Admin only" }, 403);

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
    const { scrapeSite, siteLimit, tarot, drift } = parsed.data;

    // Load chapters → phase → id
    const { data: chapters, error: chErr } = await admin.from("book_chapters").select("id, phase").order("order_index");
    if (chErr || !chapters) return json({ error: chErr?.message ?? "no chapters" }, 500);
    const phaseToChapter = new Map<string, string>();
    for (const c of chapters) phaseToChapter.set(c.phase, c.id);
    const fallback = phaseToChapter.get("GLITCH")!;

    // Existing refs by chapter for dedupe
    const { data: existingSources } = await admin.from("book_sources").select("chapter_id, ref");
    const existing = new Set((existingSources ?? []).map((r) => `${r.chapter_id}::${r.ref}`));

    const queue: Row[] = [];
    const counts = { web: 0, tile: 0, tarot: 0, drift: 0 };

    const enqueue = (kind: string, ref: string, title: string | null, excerpt: string | null, hint?: string) => {
      const phase = classify(`${title ?? ""} ${excerpt ?? ""} ${hint ?? ""}`);
      const chapter_id = phaseToChapter.get(phase) ?? fallback;
      const key = `${chapter_id}::${ref}`;
      if (existing.has(key)) return false;
      existing.add(key);
      queue.push({ chapter_id, kind, ref, title: title?.slice(0, 240) ?? null, excerpt: excerpt?.slice(0, 6000) ?? null, weight: 3, included: true });
      return true;
    };

    // 1. Site scrape
    if (scrapeSite && FIRECRAWL) {
      try {
        const mapRes = await fetch("https://api.firecrawl.dev/v2/map", {
          method: "POST",
          headers: { Authorization: `Bearer ${FIRECRAWL}`, "Content-Type": "application/json" },
          body: JSON.stringify({ url: `https://${ALLOWED_HOST}`, limit: siteLimit, includeSubdomains: false }),
        });
        const mapData = await mapRes.json();
        const rawLinks: string[] = Array.isArray(mapData?.links)
          ? mapData.links.map((l: unknown) => (typeof l === "string" ? l : (l as { url?: string })?.url)).filter(Boolean)
          : [];
        const urls = Array.from(new Set(rawLinks.filter((l) => {
          try { const u = new URL(l); return u.host === ALLOWED_HOST && !BLOCKED_HOSTS.has(u.host); } catch { return false; }
        }))).slice(0, siteLimit);

        // Concurrency pool
        let i = 0;
        const worker = async () => {
          while (i < urls.length) {
            const url = urls[i++];
            try {
              const ctrl = new AbortController();
              const t = setTimeout(() => ctrl.abort(), 25000);
              const r = await fetch("https://api.firecrawl.dev/v2/scrape", {
                method: "POST",
                headers: { Authorization: `Bearer ${FIRECRAWL}`, "Content-Type": "application/json" },
                body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
                signal: ctrl.signal,
              });
              clearTimeout(t);
              const d = await r.json();
              const md: string = d?.markdown ?? d?.data?.markdown ?? "";
              const title: string = d?.metadata?.title ?? d?.data?.metadata?.title ?? url;
              if (md && enqueue("web", url, title, md.slice(0, 1200))) counts.web++;
            } catch { /* skip */ }
          }
        };
        await Promise.all([worker(), worker(), worker(), worker()]);
      } catch (e) {
        console.error("site pass failed", e);
      }
    }

    // 2. Board (tiles)
    const { data: tiles } = await admin.from("tiles").select("id, board, calm_magic_phase, short_prompt").limit(200);
    for (const t of tiles ?? []) {
      const ref = `tile:${t.id}`;
      const title = `${t.board ?? ""} · tile #${t.id}`;
      const hint = `${t.calm_magic_phase ?? ""} ${t.board ?? ""}`;
      if (enqueue("tile", ref, title, t.short_prompt ?? "", hint)) counts.tile++;
    }

    // 3. Tarot (passed inline)
    for (const c of tarot) {
      if (enqueue("tarot", c.ref, c.title ?? null, c.excerpt ?? null, c.hint ?? "")) counts.tarot++;
    }

    // 4. Drift (passed inline)
    for (const d of drift) {
      if (enqueue("drift", d.ref, d.title ?? null, d.excerpt ?? null, d.hint ?? "")) counts.drift++;
    }

    // Batch insert
    for (let k = 0; k < queue.length; k += 50) {
      const batch = queue.slice(k, k + 50);
      const { error } = await admin.from("book_sources").insert(batch);
      if (error) console.error("insert batch err", error.message);
    }

    // Per-chapter counts
    const byChapter: Record<string, number> = {};
    for (const r of queue) byChapter[r.chapter_id] = (byChapter[r.chapter_id] ?? 0) + 1;

    return json({ ok: true, inserted: queue.length, counts, byChapter });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
