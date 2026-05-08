
## What we're building

A small, auto-dismissing **"Now viewing"** confirmation overlay that appears on the Compasses page (and anywhere else inside the board) whenever a compass routes the canvas to a new topology view mode or a new board tab. Confirms the switch with the human-readable name of the destination, then fades out after ~2.5s.

```text
                  ┌────────────────────────────────────┐
                  │  ✓  Now viewing                    │
                  │     Topology · Energy Field        │
                  │     ↳ from "Prediction Engines"    │
                  └────────────────────────────────────┘
                        bottom-right · auto-dismiss
```

## How it works

A tiny event bus (`src/lib/boardNavigationEvents.ts`) exposes `emitNowViewing({ surface, label, fromCompass? })`. The `OriginsAncestryView` calls it every time the user clicks a topology / board-tab / external CTA. A new `<NowViewingToast />` component, mounted once at the `CalmMagicBoard` page level, subscribes to the event and renders the overlay using the existing `sonner` toast (already in the project) — so styling, stacking, and reduced-motion handling come for free.

Behavior:
- Topology switch → "Now viewing · Topology · {label}".
- Board-tab switch → "Now viewing · {Tab name}".
- External link → no toast (user navigates to a different route; toast wouldn't survive the route change anyway).
- Auto-dismiss 2.5s; one toast at a time (new switch replaces the old).

## Files

**Create**
- `src/lib/boardNavigationEvents.ts` — typed `emitNowViewing` + `subscribe` helpers (plain `EventTarget`).

**Edit**
- `src/components/calm-magic/topologies/OriginsAncestryView.tsx` — fire the event from the topology/board chip handlers, passing the human label and the originating compass name.
- `src/pages/CalmMagicBoard.tsx` — also fire the event from its own tab-change handler so direct tab clicks get the same confirmation; ensure `<Toaster />` from sonner is mounted (it already is at the app shell, so likely no change needed — verify and skip if present).

No new dependencies, no DB, no business-logic changes — pure presentation.

## Out of scope

- Persistent breadcrumb / history of switches.
- Toast for external `<Link>` navigations (route change kills it).
- Localization (English-only this pass; matches surrounding strings).

---

## Note on the surfaced security finding

The `SUPA_rls_policy_always_true` finding is unrelated to this UI request — it flags a write-side RLS policy (UPDATE/DELETE/INSERT) declared with `USING (true)` or `WITH CHECK (true)` somewhere in the schema. I don't have the table/policy name from the finding payload here, so I haven't included it in this plan. If you'd like, approve this overlay first and I'll open a follow-up plan that runs the Supabase linter, identifies the exact policy, and tightens it to an owner-scoped check (e.g. `auth.uid() = user_id`).
