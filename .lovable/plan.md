## Goal

Wire a landing-page CTA so visitors can jump from the Agentic Ecosystem hero straight into `/agentic-ecosystem-deck` with the wizard already prefilled (audience, tone, length, intent) — no blank-form friction.

## Changes

### 1. `src/components/AgenticEcosystemHero.tsx`
Add a third CTA next to "Get a demo" / "See Calm Magic in action":

- Label: **"Generate a deck"** (icon: `Sparkles` / `FileText`).
- Variant: `secondary` so it sits between the gradient primary and the outline secondary.
- On click:
  1. Write a prefilled draft to `localStorage` under the existing `agentic-deck-draft` key:
     ```ts
     {
       selectedUrls: [],            // discover step will auto-populate
       audience: "founder",
       tone: "visionary",
       length: "standard",
       intent: "Introduce our Agentic Ecosystems service: orchestrator + shared context + specialized agents, with observable, human-aligned coordination.",
       outline: null,
       currentSlideIdx: 0,
     }
     ```
  2. Navigate to `/agentic-ecosystem-deck?prefill=hero` via `react-router`'s `useNavigate` (keeps SPA transition; no full reload).

### 2. `src/pages/AgenticEcosystemDeck.tsx`
Honor the prefill cleanly so a returning user with an in-progress draft isn't silently overwritten:

- On mount, read `?prefill=hero` from `useSearchParams`.
- If present **and** the existing draft has no `outline` and no custom `intent`, merge the hero defaults into state and toast `"Prefilled from the Agentic Ecosystem hero"`.
- If the user already has an outline in progress, show a small inline notice with a "Start fresh" button instead of clobbering their work.
- Strip the `prefill` query param after applying (via `setSearchParams({}, { replace: true })`) so refreshes don't re-trigger.

### 3. Optional: secondary entry point
Add the same CTA pattern to the bottom of the hero copy block as a small text link `"Or generate a tailored deck →"` for users who skim past the buttons. Single line, `text-sm`, links to the same route.

## Notes

- No new routes, no schema changes, no new edge functions — purely a UX wiring change on top of the existing wizard.
- The prefill stays inside the existing `agentic-deck-draft` localStorage contract, so the wizard's auto-save and resume behavior keep working unchanged.
- Domain guardrail (`paracosm.helloarchitekt.com` only, `paracosm.life` blocked) is unaffected — discovery still runs server-side via `discover-paracosm-pages`.
