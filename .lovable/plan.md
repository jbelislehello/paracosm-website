

## Two things to fix

### 1. Why shares show `paracosm.life`
`index.html` hardcodes `https://paracosm.life` in:
- `<link rel="canonical" href="https://paracosm.life/" />` (line 21)
- 4 separate JSON-LD blocks (`url`, `sameAs`, organizer URLs)

When LinkedIn / iMessage / Slack scrape `paracosm.helloarchitekt.com`, they read the canonical and `Organization.url`, so they display `paracosm.life` as the "official" link and brand title attribution. The OG tags themselves don't include a URL, but canonical wins for most platforms.

**Fix options — I need to know which domain is canonical:**

This is the one decision I need from you before changing it. Both URLs currently serve the same site, so I have to pick a "primary" one for SEO and shares.

### 2. Make the page more lively

Looking at `/index`, the hero already has `HeroCanvas` (animated background) and a gradient headline, but below the fold the page goes flat fast: long static blocks of cards, no motion, no rhythm. Proposed liveliness pass (low-risk, additive):

**Motion & rhythm**
- Add scroll-reveal fade/slide-up on section headings and card grids (Framer Motion `whileInView`) — already a dep in most Lovable projects; I'll confirm before adding.
- Subtle hover lift + gradient shimmer on the Phase 1 / Phase 2 cards and FeatureCards.
- Animate the Hero CTA "Agentic Framework" pill with a gentle pulse/glow so the entry point reads.

**Visual energy**
- Replace the flat slate gradient page background with a soft animated aurora (very low opacity) behind sections — gives life without distracting from content.
- Add a thin animated gradient divider between major sections instead of hard color blocks.
- Numbered/animated counters on the "Why This Framework Prevents Project Failure" stats area (if we add stats), or animated icons (Sparkles, Brain, ArrowRight) on enter.

**Interaction warmth**
- Hero: cycle a small rotating word inside the headline ("agentic / relational / poetic / learning") every ~3s.
- Add a live "now" strip near the hero — e.g. "Next: AI & Municipalités · April 22" pulled from the existing events JSON-LD — so the page feels current.

**Scope guardrails**
- No new pages, no router changes.
- Touches: `index.html` (metadata), `src/pages/Index.tsx`, `src/components/HeroSection.tsx`, possibly one new `src/components/AnimatedBackdrop.tsx`.
- Honors the "feminine design / receptivity" memory: motion stays soft, never jittery; respects `prefers-reduced-motion`.

### Questions before I implement
<lov-tool-use id="toolu_vrtx_013jwmmcEnxrfh3iV1tXxbDJ" name="questions--ask_questions" requires-approval="true" integration-id="questions" data="{\"questions\": [{\"header\":\"Canonical domain\",\"question\":\"Which domain should be the official one for SEO and link previews?\",\"options\":[{\"label\":\"paracosm.helloarchitekt.com\",\"description\":\"Use the helloarchitekt subdomain everywhere. Updates canonical + JSON-LD. paracosm.life stays as a redirect/alt.\"},{\"label\":\"paracosm.life\",\"description\":\"Keep paracosm.life as the official URL. We'll add a 301 redirect plan from helloarchitekt subdomain.\"},{\"label\":\"Make it dynamic\",\"description\":\"Inject canonical/og:url at runtime based on window.location, so whichever domain the visitor uses is what gets shared. Simplest, no preference required.\"}],\"multiSelect\":false,\"allowOther\":false},{\"header\":\"Liveliness scope\",\"question\":\"How far should the liveliness pass go?\",\"options\":[{\"label\":\"Light polish\",\"description\":\"Scroll reveals + hover lifts + animated headline word rotator. ~30 min, very low risk.\"},{\"label\":\"Full pass\",\"description\":\"Everything in Light + animated aurora backdrop + 'next event' live strip + animated section dividers.\"},{\"label\":\"Hero only\",\"description\":\"Focus all energy on the hero (headline rotator, pulsing CTA, richer canvas) and leave the rest as-is.\"}],\"multiSelect\":false,\"allowOther\":true}]}">
</lov-tool-use>
The plan tool failed and questions were interrupted. Let me retry just the questions properly — that was a bad parallel call (plan tool doesn't accept that schema, and asking questions in parallel with planning is wrong anyway). Let me ask the questions cleanly.
<lov-tool-use id="toolu_vrtx_01CWvtqQwXxkFEV93aVaawE7" name="questions--ask_questions" requires-approval="true" integration-id="questions" data="{\"questions\": [{\"question\":\"Which domain should be the official one for SEO and link previews?\",\"header\":\"Canonical domain\",\"multiSelect\":false,\"allowOther\":false,\"options\":[{\"label\":\"paracosm.helloarchitekt.com\",\"description\":\"Use this subdomain everywhere. Updates canonical + JSON-LD. paracosm.life becomes secondary.\"},{\"label\":\"paracosm.life\",\"description\":\"Keep paracosm.life as the official URL. Shares from the helloarchitekt subdomain will still display paracosm.life — that's intended.\"},{\"label\":\"Make it dynamic\",\"description\":\"Inject canonical/og:url at runtime from window.location, so whichever domain the visitor uses is what gets shared.\"}]},{\"question\":\"How far should the liveliness pass go on the landing page?\",\"header\":\"Liveliness scope\",\"multiSelect\":false,\"allowOther\":true,\"options\":[{\"label\":\"Light polish\",\"description\":\"Scroll reveals, hover lifts, subtle hero CTA pulse, animated headline word rotator. Low risk, ~30 min.\"},{\"label\":\"Full pass\",\"description\":\"Light polish + soft animated aurora backdrop + animated section dividers + 'next event' live strip near hero.\"},{\"label\":\"Hero only\",\"description\":\"Concentrate energy on hero (richer canvas, headline rotator, pulsing CTA). Leave rest as-is.\"}]}]}">
</lov-tool-use>
