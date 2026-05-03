
# Persist Resonance answers across sections & pages

When a visitor maps their question on the homepage, that result currently dies on navigation. Plan: persist it in `sessionStorage` and surface a personalized "Why it works for you" recap on the key destination pages.

## What gets built

### New utility — `src/lib/resonanceStorage.ts`
- `saveLastResonance(data)` — writes `{ question, axes, savedAt }` to `sessionStorage` under key `paracosm:lastResonance` and dispatches a `resonance:updated` window event so subscribers re-read without a page reload.
- `loadLastResonance()` — safe parse, returns `null` on missing/malformed.
- `clearLastResonance()` — removes + emits event.

### New hook — `src/hooks/useLastResonance.ts`
- Returns `{ data, clear }`, subscribes to `resonance:updated` and the native `storage` event so cross-tab updates work.

### Edit — `src/components/resonance/QuestionResonancePanel.tsx`
- After a successful map, call `saveLastResonance(mapped)` (in addition to the existing `onMapped?.()` callback).

### New component — `src/components/resonance/WhyItWorksRecap.tsx`
A compact card shown only when a recent resonance exists:
- Echoes the question ("You asked: …")
- Shows the top 2 axes as colored chips with their scores and rationales
- Explains in one sentence how the current page addresses those axes (page-specific `lens` prop: `"method" | "board" | "leadership" | "coaching" | "design-system"`)
- "Ask a different question" button → clears storage and scrolls back to the homepage hero (or opens the inline panel where present)

### Wire-in points
- `src/pages/LandingPage.tsx` — render `<WhyItWorksRecap lens="method" />` between `MethodSteps` and `ThreePaths`, so as the visitor scrolls past the method, they see their own question reframed.
- `src/pages/DesignSystemShowcase.tsx` — render `<WhyItWorksRecap lens="design-system" />` at the top of the page, above the existing Resonance section.
- `src/pages/CalmMagicDemo.tsx` — render `<WhyItWorksRecap lens="board" />` at the top so the demo board is contextualized by the visitor's question.
- `src/pages/Index.tsx` (the `/agentic-ux` AI Leadership page) — render `<WhyItWorksRecap lens="leadership" />` near the top.
- `src/pages/RelationalHealing.tsx` (the `/calm-magic-assistant` page) — render `<WhyItWorksRecap lens="coaching" />` near the top.

### Lens copy (one sentence each)
- `method`: "Here's how Ask → Map → Invent → Ship turns this exact question into shipped software."
- `board`: "The board below is the same one your question landed on. Open the dominant axis to see why."
- `leadership`: "AI Leadership maps to your question through the {top-axis} axis — governance and intentional architecture."
- `coaching`: "Relational coaching meets your question on the {top-axis} axis — the human stakes underneath."
- `design-system`: "The mental models and journey below are organized by the same five axes that scored your question."

## What does NOT change

- No DB writes, no edge function changes, no auth required — pure client-side persistence (session-scoped, cleared on tab close).
- No new dependencies.
- The Resonance edge function and its hardening stay as-is.

## Privacy & safety

- `sessionStorage` only — never persisted across sessions, never sent to a server.
- The recap renders only when fresh data exists; auto-disappears when the user clears it or closes the tab.

## Files

**New (3):**
- `src/lib/resonanceStorage.ts`
- `src/hooks/useLastResonance.ts`
- `src/components/resonance/WhyItWorksRecap.tsx`

**Edited (6):**
- `src/components/resonance/QuestionResonancePanel.tsx`
- `src/pages/LandingPage.tsx`
- `src/pages/DesignSystemShowcase.tsx`
- `src/pages/CalmMagicDemo.tsx`
- `src/pages/Index.tsx`
- `src/pages/RelationalHealing.tsx`

Approve to implement.
