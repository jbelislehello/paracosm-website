# Inline editing on /credits

Add admin-only inline editing for photographer / location / year / event on every image listed on `/credits`, persisted to Supabase so edits stick across deploys and devices.

## Scope

- Editable fields per image: `photographer`, `location`, `year`, `event`.
- Applies to every image surfaced on `/credits` (8 retreat slugs today; archetype heroes reuse the same slugs).
- Edits persist in Supabase and are read by `/credits` plus the inline figcaption credits on `SomaticCreativityRetreat`, `ResidenciesSection`, and `ResidencyDetail`.

## Access

Admin-only via the existing `useAdminStatus` hook (`user_roles` table, `has_role` function). Public visitors and signed-in non-admins see read-only credits exactly as today.

## Data model

New table `image_credits` keyed by the image slug used in `retreatImages`:

```text
image_credits
  slug         text  primary key   -- e.g. "forestCircle"
  photographer text
  location     text  nullable
  year         text  nullable
  event        text  nullable
  updated_at   timestamptz default now()
  updated_by   uuid  nullable
```

RLS:
- SELECT: public (anyone, anon + authenticated) — credits are public info.
- INSERT / UPDATE / DELETE: only `has_role(auth.uid(), 'admin')`.

Trigger: reuse `public.update_updated_at_column()` for `updated_at`.

The seed values currently hardcoded in `src/assets/retreats/index.ts` stay as the **fallback**: if a slug has no row in `image_credits`, the static record is used. This avoids a one-shot data backfill and keeps the page working before any edit is made.

## Frontend changes

1. **`src/hooks/useImageCredits.ts`** (new)
   - Fetches all rows from `image_credits` once, exposes `creditsBySlug`, `isAdmin`, and an `upsertCredit(slug, patch)` mutation.
   - Merges DB rows over the static `retreatImageCredits` map so consumers always get a complete record.

2. **`src/pages/Credits.tsx`**
   - Use the hook for all displayed credits.
   - When `isAdmin`, each `CreditRow` renders a small "Edit" pencil. Clicking swaps the row into an inline form (4 inputs + Save / Cancel). Save calls `upsertCredit` and optimistically updates local state; toast on success/error.
   - Non-admins see the exact current read-only layout.

3. **Caption consumers** (`SomaticCreativityRetreat.tsx`, `ResidenciesSection.tsx`, `ResidencyDetail.tsx`)
   - Swap the direct `retreatImageCredits[slug]` lookup for the merged map from `useImageCredits` (read-only usage), so edits made on `/credits` show up in the inline figcaptions site-wide.

4. **`src/assets/retreats/index.ts`**
   - No structural change. Continues to export the static fallback map. `formatCredit` stays as-is.

## Out of scope

- Editing alt text, captions (`residencyImageCaption`), filenames, or replacing image files.
- Adding new image slugs from the UI (slugs remain code-defined; only metadata is editable).
- Audit history / multi-version credits.
- i18n of credit fields.

## Files touched

- New: `supabase` migration creating `image_credits` + RLS + trigger.
- New: `src/hooks/useImageCredits.ts`.
- Edited: `src/pages/Credits.tsx` (inline edit UI).
- Edited: `src/components/SomaticCreativityRetreat.tsx`, `src/components/ResidenciesSection.tsx`, `src/pages/ResidencyDetail.tsx` (read merged credits).

## Open assumption

You didn't pick an access tier — I'm defaulting to **admins only** (safest for a public site). Tell me if you'd rather have "anyone signed in" or open editing instead and I'll adjust the RLS + gate before implementing.
