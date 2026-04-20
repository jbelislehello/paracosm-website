

## Fix: Share links showing `paracosm.life`

The `index.html` hardcodes `paracosm.life` in 6 places: the `<link rel="canonical">`, `og:url` (missing but implied), and all JSON-LD `url` fields. Social platforms read these and display `paracosm.life` regardless of which domain the visitor is on.

**Fix:** Replace all `paracosm.life` references with `paracosm.helloarchitekt.com`. Add an explicit `og:url` meta tag pointing to `https://paracosm.helloarchitekt.com/`.

Files changed: `index.html` only.

---

## Make the landing page more lively

Currently the page is mostly static cards and text blocks. The plan adds motion and energy without changing content or layout.

### 1. Scroll-triggered fade-in reveals
Add a small `useScrollReveal` hook using `IntersectionObserver`. Apply it to each major section (`#ai-leadership`, contact, events, etc.) so content fades + slides up as users scroll into view. CSS-only transitions, no library needed.

### 2. Hero headline word rotator
Cycle a keyword in the hero headline (e.g., "Build Your Agentic Ecosystem" → "Design… / Deploy… / Scale…") with a smooth vertical slide transition every 3 seconds.

### 3. Subtle CTA pulse
Add a soft `animate-pulse-glow` keyframe to the primary "Explore Coaching" and "Agentic Framework" buttons — a gentle box-shadow breathe effect, not distracting.

### 4. Card hover lift
Add `hover:-translate-y-1 hover:shadow-xl transition-all duration-300` to the Phase 1 / Phase 2 cards and feature cards for tactile depth on desktop.

### 5. Animated gradient section dividers
Between major sections, add a thin (`h-1`) animated gradient bar (blue → purple → pink) that slowly shifts, acting as a visual rhythm marker.

---

### Technical detail

- **No new dependencies.** All animations use CSS keyframes + Tailwind utilities + one small React hook.
- **Files touched:** `index.html`, `src/pages/Index.tsx`, `src/components/HeroSection.tsx`, `src/index.css` (keyframes), possibly a new `src/hooks/useScrollReveal.ts`.
- **Performance:** `IntersectionObserver` is passive; CSS animations are GPU-composited (`transform`, `opacity`). No layout thrashing.

