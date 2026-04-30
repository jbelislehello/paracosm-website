/**
 * Scenario configs for the Agentic Ecosystem Demo.
 *
 * Each scenario provides:
 *  - a label for the dropdown
 *  - a weighted transition table: from agent id -> array of { to, weight, payload }
 *  - a starting agent (typically the orchestrator)
 *
 * The simulation tick picks an outgoing edge from the current "active" agent
 * using the weights, emits a message along it, and moves the active pointer.
 * This is intentionally lightweight (Markov-style) — enough to feel alive
 * without modelling real LLM routing.
 */

export type AgentMode = "orchestrator" | "context" | "dream" | "learn";

export interface AgentDef {
  id: string;
  label: string;
  mode: AgentMode;
  /** Short verb-led description shown in tooltip / log. */
  role: string;
}

export const AGENTS: AgentDef[] = [
  { id: "orchestrator", label: "Orchestrator", mode: "orchestrator", role: "routes attention" },
  { id: "context", label: "Shared Context", mode: "context", role: "holds the brief" },

  // Dream half — divergent / inventive
  { id: "vision", label: "Vision", mode: "dream", role: "imagines preferable futures" },
  { id: "storyteller", label: "Storyteller", mode: "dream", role: "frames the narrative" },
  { id: "speculator", label: "Speculator", mode: "dream", role: "explores what-ifs" },
  { id: "mythographer", label: "Mythographer", mode: "dream", role: "weaves symbols" },
  { id: "composer", label: "Composer", mode: "dream", role: "arranges the form" },

  // Learn half — convergent / integrative
  { id: "researcher", label: "Researcher", mode: "learn", role: "gathers evidence" },
  { id: "pattern", label: "Pattern", mode: "learn", role: "detects structure" },
  { id: "critic", label: "Critic", mode: "learn", role: "stress-tests claims" },
  { id: "curator", label: "Curator", mode: "learn", role: "selects what stays" },
  { id: "tutor", label: "Tutor", mode: "learn", role: "teaches the team" },
];

export interface Transition {
  to: string;
  weight: number;
  payload: string;
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  start: string;
  table: Record<string, Transition[]>;
}

const dreamAgents = ["vision", "storyteller", "speculator", "mythographer", "composer"];
const learnAgents = ["researcher", "pattern", "critic", "curator", "tutor"];

/** Helper: even-weighted fan-out from a node to a list of targets. */
const fan = (targets: string[], payload: string, weight = 1): Transition[] =>
  targets.map((to) => ({ to, weight, payload }));

export const SCENARIOS: Scenario[] = [
  {
    id: "speculative",
    label: "Generate a speculative scenario",
    description: "Dream-leaning. Vision and Storyteller dominate; Critic keeps it honest.",
    start: "orchestrator",
    table: {
      orchestrator: [
        { to: "context", weight: 2, payload: "load brief" },
        ...fan(dreamAgents, "open the field", 1.5),
        ...fan(learnAgents, "prep evidence", 0.6),
      ],
      context: [...fan(dreamAgents, "share frame", 1.2), ...fan(learnAgents, "share frame", 0.7)],
      vision: [
        { to: "storyteller", weight: 2, payload: "draft scene" },
        { to: "mythographer", weight: 1.4, payload: "find symbol" },
        { to: "orchestrator", weight: 0.6, payload: "report" },
      ],
      storyteller: [
        { to: "composer", weight: 1.8, payload: "shape arc" },
        { to: "critic", weight: 1.2, payload: "test claim" },
        { to: "context", weight: 0.6, payload: "save draft" },
      ],
      speculator: [
        { to: "researcher", weight: 1.4, payload: "verify trend" },
        { to: "vision", weight: 1.2, payload: "extend hypothesis" },
      ],
      mythographer: [
        { to: "composer", weight: 1.4, payload: "align motif" },
        { to: "curator", weight: 0.8, payload: "tag artifact" },
      ],
      composer: [
        { to: "tutor", weight: 1.2, payload: "publish piece" },
        { to: "orchestrator", weight: 1, payload: "loop closed" },
      ],
      researcher: [
        { to: "pattern", weight: 1.6, payload: "send signal" },
        { to: "critic", weight: 1, payload: "submit finding" },
      ],
      pattern: [{ to: "vision", weight: 1.4, payload: "feed insight" }, { to: "curator", weight: 1, payload: "archive" }],
      critic: [{ to: "storyteller", weight: 1.4, payload: "challenge" }, { to: "orchestrator", weight: 0.8, payload: "flag risk" }],
      curator: [{ to: "tutor", weight: 1, payload: "hand off" }, { to: "context", weight: 1, payload: "commit" }],
      tutor: [{ to: "orchestrator", weight: 1.4, payload: "ready to ship" }],
    },
  },
  {
    id: "policy",
    label: "Audit an AI policy",
    description: "Learn-leaning. Researcher and Critic carry the load; Vision contributes futures framing.",
    start: "orchestrator",
    table: {
      orchestrator: [
        { to: "context", weight: 2, payload: "load policy" },
        ...fan(learnAgents, "investigate", 1.6),
        ...fan(dreamAgents, "imagine impact", 0.5),
      ],
      context: [...fan(learnAgents, "share doc", 1.4), { to: "vision", weight: 0.7, payload: "share doc" }],
      researcher: [
        { to: "pattern", weight: 1.8, payload: "feed corpus" },
        { to: "critic", weight: 1.4, payload: "submit finding" },
      ],
      pattern: [
        { to: "critic", weight: 1.6, payload: "show cluster" },
        { to: "curator", weight: 1, payload: "store" },
      ],
      critic: [
        { to: "tutor", weight: 1.4, payload: "explain risk" },
        { to: "orchestrator", weight: 1.2, payload: "escalate" },
      ],
      curator: [{ to: "tutor", weight: 1.2, payload: "package" }, { to: "context", weight: 1, payload: "commit" }],
      tutor: [{ to: "orchestrator", weight: 1.4, payload: "deliver brief" }],
      vision: [{ to: "speculator", weight: 1.2, payload: "what if" }, { to: "critic", weight: 0.8, payload: "stress" }],
      speculator: [{ to: "researcher", weight: 1.4, payload: "verify" }],
      storyteller: [{ to: "tutor", weight: 1, payload: "narrate" }],
      mythographer: [{ to: "curator", weight: 0.8, payload: "tag" }],
      composer: [{ to: "tutor", weight: 0.8, payload: "format" }],
    },
  },
  {
    id: "onboarding",
    label: "Onboard a new client",
    description: "Balanced. Orchestrator alternates between Dream framing and Learn diligence.",
    start: "orchestrator",
    table: {
      orchestrator: [
        { to: "context", weight: 2.5, payload: "open dossier" },
        { to: "researcher", weight: 1.4, payload: "scan landscape" },
        { to: "vision", weight: 1.4, payload: "frame ambition" },
        { to: "storyteller", weight: 1, payload: "draft narrative" },
        { to: "critic", weight: 0.8, payload: "guardrail" },
      ],
      context: [
        { to: "researcher", weight: 1.4, payload: "share files" },
        { to: "vision", weight: 1.4, payload: "share files" },
        { to: "pattern", weight: 1, payload: "share files" },
      ],
      vision: [{ to: "storyteller", weight: 1.6, payload: "frame" }, { to: "composer", weight: 1, payload: "compose" }],
      storyteller: [{ to: "tutor", weight: 1.2, payload: "rehearse" }, { to: "critic", weight: 1, payload: "challenge" }],
      researcher: [{ to: "pattern", weight: 1.6, payload: "feed" }, { to: "critic", weight: 1, payload: "submit" }],
      pattern: [{ to: "vision", weight: 1.2, payload: "insight" }, { to: "curator", weight: 1, payload: "archive" }],
      critic: [{ to: "orchestrator", weight: 1.2, payload: "report" }, { to: "tutor", weight: 1, payload: "explain" }],
      curator: [{ to: "tutor", weight: 1.2, payload: "package" }],
      tutor: [{ to: "orchestrator", weight: 1.4, payload: "ready" }],
      speculator: [{ to: "vision", weight: 1, payload: "extend" }],
      mythographer: [{ to: "composer", weight: 1, payload: "motif" }],
      composer: [{ to: "tutor", weight: 1.2, payload: "deliver" }],
    },
  },
  {
    id: "glitch",
    label: "Run a Glitch session",
    description: "Rapid cycles between Dream sparks and Learn integration — the 25-min facilitation loop.",
    start: "orchestrator",
    table: {
      orchestrator: [
        { to: "context", weight: 2, payload: "open session" },
        { to: "speculator", weight: 1.6, payload: "spark" },
        { to: "vision", weight: 1.4, payload: "frame" },
        { to: "pattern", weight: 1.2, payload: "scan room" },
      ],
      context: [...fan([...dreamAgents, ...learnAgents], "share field", 1)],
      speculator: [{ to: "mythographer", weight: 1.4, payload: "image" }, { to: "storyteller", weight: 1.4, payload: "tell" }],
      mythographer: [{ to: "composer", weight: 1.4, payload: "shape" }, { to: "curator", weight: 1, payload: "tag" }],
      vision: [{ to: "storyteller", weight: 1.4, payload: "frame" }, { to: "speculator", weight: 1.2, payload: "extend" }],
      storyteller: [{ to: "critic", weight: 1.2, payload: "test" }, { to: "tutor", weight: 1, payload: "share" }],
      composer: [{ to: "tutor", weight: 1.2, payload: "deliver" }, { to: "orchestrator", weight: 1, payload: "loop" }],
      researcher: [{ to: "pattern", weight: 1.4, payload: "feed" }],
      pattern: [{ to: "vision", weight: 1.4, payload: "insight" }, { to: "critic", weight: 1, payload: "compare" }],
      critic: [{ to: "orchestrator", weight: 1.4, payload: "anchor" }],
      curator: [{ to: "context", weight: 1.4, payload: "commit" }],
      tutor: [{ to: "orchestrator", weight: 1.4, payload: "close cycle" }],
    },
  },
];

/**
 * Bias the transition table by mode.
 *  - "dream"   : multiply weights to dream agents by 2x, learn by 0.4
 *  - "learn"   : inverse
 *  - "balanced": untouched
 */
export type ModeBias = "dream" | "learn" | "balanced";

export const biasTable = (
  table: Record<string, Transition[]>,
  bias: ModeBias,
  disabled: Set<string>,
): Record<string, Transition[]> => {
  const isDream = (id: string) => AGENTS.find((a) => a.id === id)?.mode === "dream";
  const isLearn = (id: string) => AGENTS.find((a) => a.id === id)?.mode === "learn";
  const out: Record<string, Transition[]> = {};
  for (const [from, transitions] of Object.entries(table)) {
    out[from] = transitions
      .filter((t) => !disabled.has(t.to))
      .map((t) => {
        let w = t.weight;
        if (bias === "dream") {
          if (isDream(t.to)) w *= 2;
          else if (isLearn(t.to)) w *= 0.4;
        } else if (bias === "learn") {
          if (isLearn(t.to)) w *= 2;
          else if (isDream(t.to)) w *= 0.4;
        }
        return { ...t, weight: w };
      });
  }
  return out;
};

/** Pick a transition using weighted random selection. */
export const pickTransition = (transitions: Transition[]): Transition | null => {
  if (!transitions.length) return null;
  const total = transitions.reduce((s, t) => s + t.weight, 0);
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const t of transitions) {
    r -= t.weight;
    if (r <= 0) return t;
  }
  return transitions[transitions.length - 1];
};
