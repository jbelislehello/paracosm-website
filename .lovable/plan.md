## Goal

Save every DreamSequence run with its question, axis narrations, summary, and the **maturity-assessed tiles** that lit up — then expose a public, shareable URL that restores the final view (and replays progress visually).

## 1. Database — new `dream_runs` table

Migration:

```sql
create table public.dream_runs (
  id uuid primary key default gen_random_uuid(),
  share_slug text unique not null default encode(gen_random_bytes(9), 'base64'),
  user_id uuid,                      -- nullable: anonymous dreams allowed
  question text not null,
  filename text,
  axes jsonb not null,               -- [{key, narration, tile_keys, tile_ids[], maturity}]
  summary text,
  overall_maturity jsonb,            -- {love:0-1, magic:0-1, calm:0-1, open:0-1, free:0-1}
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.dream_runs enable row level security;

create policy "owners read own"   on public.dream_runs for select using (auth.uid() = user_id);
create policy "public read shared" on public.dream_runs for select using (is_public = true);
create policy "anyone insert"     on public.dream_runs for insert with check (true);
create policy "owners update"     on public.dream_runs for update using (auth.uid() = user_id);
create policy "owners delete"     on public.dream_runs for delete using (auth.uid() = user_id);
```

`share_slug` is URL-safe-ish; we'll strip `/+=` client-side or use a trigger to normalize. (Acceptable simplification: keep as-is and URL-encode.)

## 2. Edge function — maturity assessment + persistence

Update `supabase/functions/dream-prd-analysis/index.ts`:

- **Extend the AI tool schema** so each axis returns `maturity: number` in `[0,1]` (how developed that axis is in the PRD) alongside `narration` and `tile_keys`.
- Add prompt guidance: "Assess maturity 0–1 per axis. 0 = unaddressed/silent. 1 = fully realized. Use this to indicate how many tiles to light up."
- **Map maturity → tile count**: per axis, lit tile count = `1 + round(maturity * 4)` → 1–5 tiles per axis (cap at axis size).
- **Pick tile IDs deterministically** from the axis range using the PRD text hash so the same PRD lights the same tiles:
  - LOVE: ids 1–64, MAGIC: 65–128, CALM: 129–192, OPEN: 193–256, FREE: 257–260.
  - Use `crypto.subtle.digest('SHA-256', prdText)` → derive offsets, pick `n` ids spread across the band.
- Stream a new event `axis_tiles` (or extend `axis_begin` payload) with `tile_ids: number[]` and `maturity: number`.
- After streaming completes, **insert one row** into `dream_runs` using the service-role key (anonymous OK) and emit a final event:
  ```
  event: saved
  data: {"id":"...", "share_slug":"..."}
  ```

Maturity is server-derived (LLM) — never trust the client.

## 3. Client — DreamSequence updates

`src/components/calm-magic/dream/DreamSequence.tsx`:

- Track new state: `tileIdsByAxis`, `maturityByAxis`, `shareSlug`.
- Handle `axis_tiles` and `saved` events.
- When a run is saved, render a **Share** block:
  - Read-only input with `https://<host>/dream/<slug>`
  - "Copy link" button (uses `navigator.clipboard`)
  - "Open in new tab" link
- Show maturity per axis as a small ring/percentage next to the axis card; render the lit tile IDs as chips inside each axis card (replacing or augmenting `tile_keys`).

## 4. New shareable view route

- Route: `/dream/:slug` → new page `src/pages/DreamShare.tsx`.
- On mount, query `dream_runs` by `share_slug` (anon key works via RLS public policy).
- Render a **read-only DreamSequence-like view** that:
  1. Shows the question, filename, created date, summary.
  2. Renders the same five-axis board with lit tiles + maturity bars.
  3. Optionally **replays** the narration progressively (same staggered animation as live runs) — toggle "Replay" button; default = static final view with full narration shown.
- Add the route in `src/App.tsx`.

## 5. Wiring & small UX

- After save, also pass the slug back to `DreamMode` so the user can restart while keeping a link to the previous dream.
- Add a "My dreams" affordance later (out of scope here).

## Technical Notes

- **Tile selection function** (server, deterministic):
  ```ts
  function pickTiles(prdHash: Uint8Array, band: [number, number], count: number) {
    const [lo, hi] = band; const size = hi - lo + 1;
    const out = new Set<number>();
    let i = 0;
    while (out.size < Math.min(count, size)) {
      const byte = prdHash[i % prdHash.length];
      out.add(lo + ((byte + i * 17) % size));
      i++;
    }
    return [...out].sort((a, b) => a - b);
  }
  ```
- **Anonymous saves**: edge function inserts with `user_id` set from a verified JWT if present, otherwise `null`. This requires reading the `Authorization` header and decoding the supabase JWT (or using the anon supabase client's `auth.getUser()`).
- **Slug safety**: base64 may contain `+/=`. Replace at insert with `replace(replace(replace(..., '+', '-'), '/', '_'), '=', '')` via a generated column or do it in the edge function before insert.
- **No file storage**: only the extracted-and-truncated text outcome is persisted (axes/narration/tiles). The original PRD file is **not** stored.

## Files

- New migration (dream_runs table + RLS)
- Edit: `supabase/functions/dream-prd-analysis/index.ts`
- Edit: `src/components/calm-magic/dream/DreamSequence.tsx`
- Edit: `src/components/calm-magic/dream/DreamMode.tsx` (surface share link after save)
- New: `src/pages/DreamShare.tsx`
- Edit: `src/App.tsx` (add `/dream/:slug` route)
