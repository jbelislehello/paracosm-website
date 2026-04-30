## Tighten rate limit on `send-demo-request`

### Change (1 line, 1 file)

In `supabase/functions/send-demo-request/index.ts`:

```diff
 const RATE_WINDOW_MS = 60_000;
-const RATE_MAX = 3;
+const RATE_MAX = 1;
```

### Effect
- Per-IP cap: **1 request / 60s** (was 3)
- Per-IP+email cap: **1 request / 60s** (was 3) — already enforced via the same `isRateLimited` helper with key `${ip}:${email}`
- Over-limit responses already return HTTP 429 with `"Too many requests. Please try again in a minute."`

### Caveats (worth knowing)
- The limiter is **in-memory per edge function instance**. Supabase Edge Functions run multiple isolates across regions, so a determined attacker could get a few extra requests through by hitting different instances. For a stricter guarantee we'd need a shared store (Upstash Redis, a Postgres `rate_limits` table with a unique index + TTL cleanup, etc.). Say the word if you want that — it's ~30 min of work.
- Legitimate users almost never need to retry within 60s, so 1/min is safe UX-wise. If a real user fat-fingers their email and resubmits within a minute they'll get the 429 and need to wait — acceptable trade-off.

### Files touched
- `supabase/functions/send-demo-request/index.ts` (one constant)

No DB changes, no new secrets, auto-deploys after edit.
