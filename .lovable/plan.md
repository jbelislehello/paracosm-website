## Goal

Track conversion from the hero "Generate a deck" CTA → arrival on the deck wizard, so you can measure click-through and drop-off.

## Approach

No third-party analytics is wired into this project today (no GA, Plausible, PostHog, or `dataLayer` in `index.html`). Rather than introducing a vendor, store events in a new lightweight Supabase table you fully own and can query from the dashboard or SQL editor.

## Changes

### 1. New table `public.analytics_events` (migration)

```sql
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  session_id text,
  user_id uuid,
  path text,
  referrer text,
  created_at timestamptz not null default now()
);

create index analytics_events_event_name_created_at_idx
  on public.analytics_events (event_name, created_at desc);

alter table public.analytics_events enable row level security;

-- Anyone (including anon visitors) may insert events
create policy "anyone can insert analytics events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

-- Only admins may read
create policy "admins can read analytics events"
  on public.analytics_events for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));
```

No update/delete policies — events are append-only.

### 2. `src/lib/analytics.ts` (new)

Tiny client util:
- `trackEvent(name, properties?)` — fire-and-forget insert into `analytics_events`.
- Generates a per-browser `session_id` stored in `sessionStorage` (`anon-session-id`) so we can stitch click → arrival.
- Captures `path` (`window.location.pathname`) and `referrer` automatically.
- Includes the current `auth.uid()` if a Supabase session exists.
- Swallows errors silently — analytics must never break UX.
- Also pushes to `window.dataLayer` if present, so a future GA4/GTM install Just Works.

### 3. Wire the events

**`src/components/AgenticEcosystemHero.tsx`**
- In `handleGenerateDeck`, call `trackEvent("hero_generate_deck_clicked", { source: "primary_button" })` for the main button, and `{ source: "text_link" }` for the underlined link variant (split into two thin handlers).

**`src/pages/AgenticEcosystemDeck.tsx`**
- On mount, call `trackEvent("deck_wizard_viewed", { prefill: searchParams.get("prefill") ?? null })`.
- When the user reaches step 4 (slide editor), call `trackEvent("deck_wizard_outline_generated", { slideCount: outline.slides.length })`.
- On successful pptx export, call `trackEvent("deck_exported", { slideCount, audience, tone, length })`.

This gives you the full funnel:
```
hero_generate_deck_clicked
  → deck_wizard_viewed (prefill=hero)
    → deck_wizard_outline_generated
      → deck_exported
```

### 4. Querying conversion

You can run this from the SQL editor any time:

```sql
with clicks as (
  select count(*) as n from analytics_events
  where event_name = 'hero_generate_deck_clicked'
    and created_at > now() - interval '30 days'
),
views as (
  select count(*) as n from analytics_events
  where event_name = 'deck_wizard_viewed'
    and properties->>'prefill' = 'hero'
    and created_at > now() - interval '30 days'
)
select clicks.n as hero_clicks, views.n as wizard_arrivals,
       round(100.0 * views.n / nullif(clicks.n, 0), 1) as conversion_pct
from clicks, views;
```

## Notes

- No PII collected — only session id, path, referrer, and event-specific properties.
- Append-only with admin-gated reads keeps the table safe even though anon can write.
- Future-proof: if you later add GA4/PostHog, the same `trackEvent` call can fan out to it without touching components.
