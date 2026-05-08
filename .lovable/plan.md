## Goal

Make the security-memory entries for the two already-fixed findings (`custom_agent_unauth`, `SUPA_rls_policy_always_true`) describe the shipped code and policy verbatim, so future scans/agents don't drift from reality.

## What I verified

- `supabase/functions/custom-agent/index.ts` — JWT required via `supabase.auth.getClaims(token)` (anon-key client, Authorization header forwarded); rate limit is **in-memory, per Supabase user UID (`claims.sub`), 10 requests / 60s sliding window** (not per-IP, not persisted across cold starts); message validation = non-empty array, ≤30 messages, each `{role ∈ {user,assistant,system}, content: string ≤ 4000 chars}`; reuses `OPENAI_ASSISTANT_ID` env when neither `agent_id` body field nor an existing assistant is provided, otherwise still falls back to creating one.
- `public.analytics_events` policies (live DB):
  - INSERT `"Insert analytics events with own or anon user_id"` — `WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()))`, no USING.
  - SELECT `"admins can read analytics events"` — `USING (has_role(auth.uid(), 'admin'::app_role))`.
  - No UPDATE/DELETE policies (writes are append-only by design).

## Proposed updated `mem://security-memory` content

```
# Security Memory

## Edge functions
- `custom-agent` (deployed with `verify_jwt = false`, auth enforced in code):
  - Requires a valid Supabase JWT — verified via `supabase.auth.getClaims(token)` using the anon-key client with the caller's `Authorization` header forwarded. Returns 401 on missing/invalid token.
  - In-memory, per-user (keyed on `claims.sub`) sliding-window rate limit: 10 requests / 60s. Returns 429 when exceeded. Note: in-memory only — does not survive cold starts and is per-instance.
  - Input validation: `messages` must be a non-empty array, ≤30 entries; each entry `{ role ∈ {"user","assistant","system"}, content: string ≤ 4000 chars }`. Anything else → 400-style thrown error.
  - Assistant reuse: if the request omits `agent_id`, falls back to `OPENAI_ASSISTANT_ID` env var; only creates a new OpenAI Assistant when neither is set. Do not regress to per-request Assistant creation.

## RLS — public.analytics_events
- INSERT policy MUST be `WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()))` (policy name: `"Insert analytics events with own or anon user_id"`). Never restore `WITH CHECK (true)` — it allows authenticated users to spoof another user's `user_id`.
- SELECT is admin-only via `has_role(auth.uid(), 'admin'::app_role)`. Do not add a public SELECT policy.
- No UPDATE or DELETE policies exist; analytics are append-only. Do not add write policies without an explicit request.

## General RLS rule
- Never use `USING (true)` or `WITH CHECK (true)` on INSERT/UPDATE/DELETE policies. The only acceptable use of `USING (true)` is on SELECT policies that are intentionally public.
```

## Out of scope

- The new error-level finding `seed_demo_data_unauth` is **not** addressed here — the user asked only to align memory for the two previously fixed findings. Happy to plan that fix in a follow-up.
