// Admin-only: fan out parallel chapter drafting across multiple audiences.
// Invokes book-synthesize-chapter once per (chapter_id, audience) pair with
// bounded concurrency, forwarding the caller's auth header.

import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AudienceSchema = z.enum(["general", "practitioner", "executive", "pragmatic"]);

const BodySchema = z.object({
  chapter_ids: z.array(z.string().uuid()).min(1).max(20),
  audiences: z.array(AudienceSchema).min(1).max(4),
  model: z.string().optional(),
  guidance: z.string().max(4000).optional(),
  concurrency: z.number().int().min(1).max(6).optional(),
});

type Job = {
  chapter_id: string;
  audience: z.infer<typeof AudienceSchema>;
};

type JobResult = Job & {
  ok: boolean;
  draft_id?: string;
  error?: string;
};

async function runPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const idx = next++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx]);
    }
  });
  await Promise.all(runners);
  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: userData } = await supabaseUser.auth.getUser();
    const user = userData.user;
    if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: roleCheck } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!roleCheck) {
      return new Response("Forbidden", { status: 403, headers: corsHeaders });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { chapter_ids, audiences, model, guidance, concurrency } = parsed.data;

    const jobs: Job[] = [];
    for (const chapter_id of chapter_ids) {
      for (const audience of audiences) {
        jobs.push({ chapter_id, audience });
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const workerUrl = `${supabaseUrl}/functions/v1/book-synthesize-chapter`;

    const results: JobResult[] = await runPool(jobs, concurrency ?? 3, async (job) => {
      try {
        const workerHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          apikey: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        };
        if (bypassToken === BYPASS) {
          workerHeaders["x-admin-bypass-token"] = BYPASS;
        } else if (auth) {
          workerHeaders["Authorization"] = auth;
        }
        const res = await fetch(workerUrl, {
          method: "POST",
          headers: workerHeaders,
          body: JSON.stringify({
            chapter_id: job.chapter_id,
            audience: job.audience,
            model,
            guidance,
          }),
        });
        const text = await res.text();
        if (!res.ok) {
          return { ...job, ok: false, error: `HTTP ${res.status}: ${text.slice(0, 500)}` };
        }
        let parsedBody: { draft_id?: string; error?: string } = {};
        try {
          parsedBody = JSON.parse(text);
        } catch {
          return { ...job, ok: false, error: "Invalid JSON response from worker" };
        }
        if (parsedBody.error) {
          return { ...job, ok: false, error: parsedBody.error };
        }
        return { ...job, ok: true, draft_id: parsedBody.draft_id };
      } catch (err) {
        return { ...job, ok: false, error: (err as Error).message };
      }
    });

    const summary = {
      total: results.length,
      succeeded: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
    };

    return new Response(
      JSON.stringify({ ok: true, summary, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
