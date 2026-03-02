

# Update Calm Magic Section with Intention Design Philosophy

## Overview

Rewrite the Calm Magic Board section on the landing page (lines 180-459 of `src/pages/LandingPage.tsx`) to reflect the new work philosophy: moving from tool selection to intention design, with the Paracosm > Calm Magic > UX Engineering > Crewdle pipeline.

## What Changes

### Restructure the Calm Magic section into 3 parts:

**Part 1 -- New Philosophy Header**
Replace the current "Choose your transformation pathway" subtitle with the core thesis:
- Title: "From Tool Selection to Intention Design"
- Subtitle: "Organizations don't need more tools. They need to design their collective intelligence."
- Brief paragraph about how AI agents make the "which software?" question obsolete

**Part 2 -- Replace the 2-tab layout with a 5-step pipeline flow**
Instead of Professional/Personal tabs, show the structural relationship as a vertical flow with cards:

1. **Paracosm** -- Defines collective intention (cultural transformation, learning organizations, CEO coaching)
2. **Calm Magic Living PRD** -- Transforms intention into living infrastructure (structured conversation to PRD, the 5-layer POLLENS-to-ANTHEMS engine)
3. **UX Engineering** -- Designs human-agent behaviors (agent roles, cognitive mapping, trust architecture)
4. **Orchestration** -- Executes via agent coordination (task routing, secure workflows, progressive automation)
5. **Learning Organization** -- Organization learns and evolves (quarterly reviews, cognitive elevation, self-evolving teams)

Each step card includes: icon, title, 1-sentence description, and 2-3 bullet points

**Part 3 -- The Transformation Trap callout**
A warning card at the bottom highlighting the common mistake: organizations that say they want to transform but immediately start comparing platforms, running technical POCs, and selecting tools -- resulting in "automation of existing chaos."

Followed by the existing CTA buttons (Start Free Journey / View Pricing) linking to auth and pricing pages.

### Keep the 8x8 matrix visualization
Retain one instance of the 64-tile matrix grid (the blue/purple professional version) as a visual element beside the Living PRD step, showing it as the conversational engine.

## Technical Details

### File: `src/pages/LandingPage.tsx`

**Lines 180-459** will be rewritten to contain:
- A new section header with the philosophy framing
- A 5-step vertical pipeline using existing Card components
- Icons from lucide-react: `Brain`, `FileText`, `Users`, `Zap`, `Lightbulb`, `AlertTriangle`, `ArrowDown`
- The 8x8 matrix visualization moved inline next to step 2
- A warning/callout card for the transformation trap
- Existing CTA buttons preserved

No new files needed. No new dependencies. All content is static -- no translation keys added (content is in English matching the landing page language).

### Content for each pipeline step

| Step | Title | Description | Bullets |
|------|-------|-------------|---------|
| 1. Paracosm | Define Collective Intention | Coaching CEOs and teams to become learning organizations that reconfigure themselves | Identify organizational tensions; Map cognitive load; Shift from task execution to system design |
| 2. Calm Magic Living PRD | Transform Intention into Living Infrastructure | Structured conversation becomes operational infrastructure through the 5-layer PRD engine | Collective dialogue surfaces real tensions; Intentions emerge as living requirements; PRD becomes an organism linking strategy, experience, operations, and learning |
| 3. UX Engineering | Design Human-Agent Behaviors | Define agent roles as virtual employees before any technology is deployed | Mission, authority, inputs, outputs for each agent; Trust, responsibility, and human-AI collaboration; Agent Opportunity Map from cognitive friction points |
| 4. Orchestration | Execute via Agent Coordination | Progressive automation: human executes > agent assists > agent executes > human supervises > human designs | Observational agents first, then assistance, then execution; Secure information routing and task delegation; Never automate before understanding |
| 5. Learning Organization | Learn and Evolve Continuously | Every quarter: What agent is no longer useful? What decision can disappear? What human time was freed? | Managers become organizational UX Engineers; Teams design the systems that execute; Organization becomes self-evolving |

### Transformation Trap callout content

Title: "The Major Transformation Trap"
Body: "Every organization makes the same mistake: they say they want to transform, then immediately start comparing platforms, running technical POCs, and selecting tools. Result: automation of existing chaos. Our first rule: no tool is selected during the initial phase."

