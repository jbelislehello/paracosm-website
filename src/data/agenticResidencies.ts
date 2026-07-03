/**
 * Agentic UX Residencies — three ways to work with Paracosm on
 * multi-agent surfaces. Distinct from the seven elemental residencies
 * (`src/data/residencies.ts`).
 */

export interface AgenticResidency {
  slug: string;
  numeral: string;
  title: string;
  duration: string;
  tagline: string;
  summary: string; // single-line, used on /agentic-ux card
  overview: string[]; // 2–3 paragraphs
  outcomes: string[]; // "What you leave with"
  arc: { label: string; body: string }[];
  whoItsFor: string[];
  whatWeNeed: string[];
  investment: string;
  next: { slug: string; title: string };
}

export const agenticResidencies: AgenticResidency[] = [
  {
    slug: "diagnostic-sprint",
    numeral: "01",
    title: "Diagnostic Sprint",
    duration: "2 weeks",
    tagline: "Map the terrain before you build the road.",
    summary:
      "Map the current agentic surface, biases, consent gaps and one high-leverage prototype opportunity.",
    overview: [
      "Most teams reach for agents before they've named what an agent should be responsible for. The Diagnostic Sprint slows that reflex down for two weeks so we can look at the terrain honestly — the workflows, the decisions, the biases the current system quietly encodes.",
      "We work with your leadership and the people closest to the work. By the end you have a shared map of where agents belong, where they don't, and where consent is currently missing. You leave with one prototype opportunity worth ten more.",
    ],
    outcomes: [
      "A written map of your current agentic surface and the biases it encodes",
      "A TOTEM consent audit — where authority is unclear, unrevocable or invisible",
      "One high-leverage prototype thesis, sized and scoped",
      "A shortlist of surfaces to leave alone (and why)",
    ],
    arc: [
      {
        label: "Week 1 · Listening",
        body: "Interviews with 6–10 operators and stakeholders. Walkthrough of every surface where an AI already touches a decision. We name what's actually happening before we name what should.",
      },
      {
        label: "Week 2 · Naming",
        body: "Synthesis workshop with your team. We draft the map together, stress-test the consent architecture, and pick the one prototype thesis that would teach the organization the most.",
      },
    ],
    whoItsFor: [
      "Leadership teams considering their first agentic surface",
      "Product orgs with 2+ AI features already live and no shared language",
      "Governance and design leads who need evidence before committing roadmap",
    ],
    whatWeNeed: [
      "A sponsor with authority to open doors and act on the map",
      "Access to 6–10 operators and one working session with leadership",
      "Read-only access to current AI features, prompts, and telemetry",
    ],
    investment:
      "Two weeks, one Paracosm lead, delivered as living documents your team can keep working.",
    next: { slug: "prototype-residency", title: "Prototype Residency" },
  },
  {
    slug: "prototype-residency",
    numeral: "02",
    title: "Prototype Residency",
    duration: "6–8 weeks",
    tagline: "Ship one honest agentic surface end-to-end.",
    summary:
      "Embed with your team to ship one agentic surface end-to-end — wired to real data, real users, a real ROI thesis.",
    overview: [
      "The Prototype Residency is where the map becomes evidence. We embed with your team for six to eight weeks to ship one agentic surface — wired to real data, in the hands of real users, with a real hypothesis about the value it moves.",
      "This isn't a demo. It's a working surface with consent, handoffs and bias compensation designed in, and a rehearsal room where your team learns to steer it. When we leave, the code, the reasoning traces and the operating practice all stay with you.",
    ],
    outcomes: [
      "One agentic surface in the hands of real users, with instrumentation",
      "Consent architecture designed against the TOTEM framework",
      "A rehearsal room your team can re-use for the next surface",
      "A ROI read grounded in observed behaviour, not projected slides",
    ],
    arc: [
      {
        label: "Weeks 1–2 · Frame",
        body: "Confirm the thesis from the Diagnostic Sprint (or run a compressed diagnostic). Draft the consent model, the handoff choreography, and the biases each agent will compensate for.",
      },
      {
        label: "Weeks 3–5 · Build",
        body: "Embed with your engineering and design team. Ship the surface in short cycles, narrating handoffs and surfacing disagreements between agents as first-class UI.",
      },
      {
        label: "Weeks 6–8 · Rehearse",
        body: "Put the surface in front of real operators. Instrument what agents defer on, disagree on, and hand off. Tune the consent model against observed behaviour before wider rollout.",
      },
    ],
    whoItsFor: [
      "Teams with a validated thesis and a real user population to test with",
      "Product + engineering leaders who want to learn by shipping, not by deck",
      "Organizations that already treat consent and governance as design surface",
    ],
    whatWeNeed: [
      "One embedded product manager and 1–2 engineers from your side",
      "Access to production-grade data (with consent) or a realistic staging set",
      "A committed user population willing to be observed for two rounds",
    ],
    investment:
      "6–8 weeks, a small Paracosm pod embedded with your team, shipping in your repo.",
    next: { slug: "ecosystem-build", title: "Ecosystem Build" },
  },
  {
    slug: "ecosystem-build",
    numeral: "03",
    title: "Ecosystem Build",
    duration: "3–6 months",
    tagline: "A multi-agent ecosystem your team owns after we leave.",
    summary:
      "Design and hand off a multi-agent ecosystem with the governance, consent architecture and handoff practices your team owns after we leave.",
    overview: [
      "One agentic surface teaches you the shape. An ecosystem is where that shape becomes an operating system — agents that coordinate through a shared ontology, narrated handoffs, and a governance practice the organization actually maintains.",
      "The Ecosystem Build is a three-to-six month engagement to design that surface with you, wire it into your existing systems, and — most importantly — hand off the practice. When we leave, the ontology, the consent architecture, the rehearsal habits and the audit surface all belong to your team.",
    ],
    outcomes: [
      "A shared ontology across agents, teams and downstream systems",
      "Governance and consent architecture wired into day-to-day workflow",
      "Handoff choreography your team can extend without us",
      "An audit surface leadership and regulators can actually read",
    ],
    arc: [
      {
        label: "Month 1 · Ontology",
        body: "Design the shared vocabulary agents will coordinate through. Map it against your existing data model, org chart and regulatory surface. Nothing gets built before the ontology holds.",
      },
      {
        label: "Months 2–3 · Ecosystem",
        body: "Build the first cluster of agents against the ontology. Design the handoff patterns, the disagreement surface, and the consent flows. Rehearse with real operators from week one.",
      },
      {
        label: "Months 4–5 · Governance",
        body: "Stand up the audit surface, the escalation paths and the review cadence. Train the internal group that will own the practice after we leave.",
      },
      {
        label: "Month 6 · Handoff",
        body: "Progressive withdrawal of the Paracosm pod. Your team runs the last two rehearsals. We stay on-call for one quarter, then step out entirely.",
      },
    ],
    whoItsFor: [
      "Organizations committing agents to a core operating workflow",
      "Leadership teams that want an owned practice, not a permanent vendor",
      "Regulated environments where audit surface and consent are non-negotiable",
    ],
    whatWeNeed: [
      "An executive sponsor and a named internal group who will own the practice",
      "Engineering and design capacity to embed with the Paracosm pod",
      "Willingness to slow down at the ontology stage — the entire ecosystem depends on it",
    ],
    investment:
      "3–6 months, a Paracosm pod alongside your internal group, structured around handoff from day one.",
    next: { slug: "diagnostic-sprint", title: "Diagnostic Sprint" },
  },
];

export const agenticResidencyBySlug = (slug: string) =>
  agenticResidencies.find((r) => r.slug === slug);
