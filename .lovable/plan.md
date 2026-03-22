

# Onboarding Guide + Spring Offer Homepage + Design System Access

## 1. Spring 2026 Offer — Homepage Prominence

### File: `src/pages/LandingPage.tsx`
- Insert a new **Spring 2026 banner section** immediately after the hero section (before the Intention Design section at line 179)
- Compact card with gradient background featuring: headline "Spring 2026 — From Idea to Software", the one-liner positioning, 3 tier summary (Clarity Reset / Decision Sprint / Strategic Intervention), and a primary CTA linking to `/calm-magic-assistant#spring-offer`
- Badge: "Limited to 5 slots per month"

## 2. Onboarding Guide — Needs-Based Routing

### New File: `src/components/OnboardingGuide.tsx`
A multi-step modal/drawer that appears for first-time visitors (localStorage check). Three assessment steps:

**Step 1 — Declared Need** (single select):
- "I need clarity on a stuck decision" → routes to Spring Offer (Clarity Reset)
- "I want to build a learning organization" → routes to Intention Design pipeline
- "I need AI strategy & governance" → routes to AI Leadership (`/agentic-ux`)
- "I want to develop my team's relational intelligence" → routes to Team Coaching (`/calm-magic-assistant`)

**Step 2 — Knowledge Maturity** (single select):
- Exploring (new to AI/transformation)
- Practicing (some experience, seeking structure)
- Leading (experienced, seeking advanced tools)

**Step 3 — Organizational Capability** (single select):
- Solo practitioner / freelancer
- Small team (2-10)
- Organization (10+)
- Enterprise

Based on the 3 answers, the guide produces a **personalized recommendation card** with:
- Recommended offering (Spring tier or service pathway)
- Suggested starting point (Board, Coaching, AI Leadership)
- Relevant case study link
- Direct CTA (mailto or route)

Results stored in localStorage. Accessible via a "Retake Assessment" button in footer or nav.

### File: `src/pages/LandingPage.tsx`
- Import and render `OnboardingGuide` (auto-shows on first visit, can be re-triggered from nav)
- Add "Find Your Path" button in the hero section CTA area

## 3. Design System & Journey Map Page

### New File: `src/pages/DesignSystemShowcase.tsx`
A new route `/design-system` that exposes the system architecture behind Paracosm and Calm Magic:

**Section A — Design System Overview**:
- Color palette (extracted from existing Tailwind config: agent-blue, agent-purple, agent-pink, rose, teal, amber, etc.)
- Typography scale
- Component library preview (Card, Badge, Button, Progress, Tabs — rendered live)
- Icon system (Lucide icons used across the platform)

**Section B — Mental Models per Offering**:
A grid of cards, one per offering (Spring tiers + deep programs), each showing:
- The mental model diagram (user's conceptual understanding needed)
- Task model (steps the user performs)
- Data sourced from a new `src/data/offeringModels.ts` file

**Section C — Journey Map**:
A horizontal swimlane visualization of all system touchpoints:
- **Discover**: Landing page → Onboarding Guide → Need assessment
- **Engage**: Spring Offer / Coaching page → Discovery call → Diagnostic
- **Build**: Calm Magic Board → POLEN capture → PRD generation → Blueprint
- **Observe**: Observatory → Service Blueprint → Task tracking
- **Evolve**: Drift → Pattern Encyclopedia → Learning loops

Each touchpoint links to its actual route. Swimlanes colored by the 3 Observatory tiers (MAGIC/CALM/FREE).

### New File: `src/data/offeringModels.ts`
Data definitions for mental models and task models per offering:
- Clarity Reset: mental model = "Confusion → Facts/Assumptions/Emotions → Decision"; tasks = diagnostic call, deconstruction worksheet, decision delivery
- Decision Sprint: adds AI pattern layer + accountability loop
- Strategic Intervention: adds Board access + PRD prototyping + narrative reframing
- Deep programs: Inner Life, Creative Relationship, Calm Magic Intensive

### File: `src/App.tsx`
- Add route: `<Route path="/design-system" element={<DesignSystemShowcase />} />`

### File: `src/pages/LandingPage.tsx`
- Add "Design System" link in footer/nav area

## Technical Notes
- Onboarding guide uses `Dialog` from shadcn/ui with step state
- localStorage key: `paracosm-onboarding-completed` + `paracosm-onboarding-profile`
- Journey map rendered with CSS grid swimlanes (no external dep)
- All components use existing UI primitives (Card, Badge, Button, Tabs, Progress)
- No backend changes required — all client-side

