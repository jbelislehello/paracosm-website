// Pragmatic Reader (Operator's Cut) — symptom index.
// Each entry routes a felt friction to the chapter phase and a board tile cue.
// Keep entries operator-facing: name the friction the way a founder/COO/transformation
// lead would describe it out loud, not the way the ontology describes it.

export type OperatorSymptom = {
  id: string;
  symptom: string;          // first-person operator complaint
  phase: "GLITCH" | "DRIFT" | "TUNE" | "LOVE" | "MAGIC" | "CALM" | "OPEN" | "FREE";
  chapterSlug: string;      // matches book_chapters.slug
  tileHint: string;         // short cue for the tile sidebar
  monday: string;           // 1-sentence "do this Monday" pointer
};

export const OPERATOR_SYMPTOMS: OperatorSymptom[] = [
  {
    id: "team-cant-decide",
    symptom: "My team can't make a decision — we keep relitigating the same options.",
    phase: "GLITCH",
    chapterSlug: "naming-the-friction",
    tileHint: "Name the friction before solving it",
    monday: "Run a 20-min Friction Naming round — no proposals allowed.",
  },
  {
    id: "relaunching-same-thing",
    symptom: "We keep relaunching the same product with a new coat of paint.",
    phase: "DRIFT",
    chapterSlug: "pattern-exploration",
    tileHint: "Map the pattern, don't ship the symptom",
    monday: "Pull the last 3 launches into one timeline and circle what repeats.",
  },
  {
    id: "roadmap-not-aligned",
    symptom: "The roadmap doesn't match what the team actually believes.",
    phase: "TUNE",
    chapterSlug: "intentional-commitment",
    tileHint: "Commit to one intention out loud",
    monday: "Have each lead say the one commitment they'd defend in a board meeting.",
  },
  {
    id: "low-trust",
    symptom: "Trust is low — people brief sideways instead of upward.",
    phase: "LOVE",
    chapterSlug: "relational-infrastructure",
    tileHint: "Repair before you restructure",
    monday: "Schedule one 1:1 repair conversation you've been avoiding.",
  },
  {
    id: "no-imagination",
    symptom: "We can't picture the future we're supposedly building.",
    phase: "MAGIC",
    chapterSlug: "pragmatic-imagination",
    tileHint: "Render the preferable future in one image",
    monday: "Spend 30 min drafting the one-paragraph press release from 2 years out.",
  },
  {
    id: "perpetual-firefighting",
    symptom: "We're in perpetual firefighting mode and can't design the system.",
    phase: "CALM",
    chapterSlug: "designing-the-system",
    tileHint: "Calm the nervous system first",
    monday: "Block 90 min on the calendar this week labelled 'System design — no incidents'.",
  },
  {
    id: "ontology-unwritten",
    symptom: "Everyone is operating from a different definition of what we are.",
    phase: "OPEN",
    chapterSlug: "living-the-ontology",
    tileHint: "Write down what you actually believe",
    monday: "Draft a 1-page 'what we are / what we are not' and circulate for redlines.",
  },
  {
    id: "flow-stalls",
    symptom: "We hit flow occasionally but can't operate from it.",
    phase: "FREE",
    chapterSlug: "operating-in-flow",
    tileHint: "Protect the conditions, not the moment",
    monday: "Identify the 2 conditions that preceded your last flow week and defend them.",
  },
  {
    id: "ai-automating-chaos",
    symptom: "We're rushing to add AI but we're just automating our chaos.",
    phase: "GLITCH",
    chapterSlug: "naming-the-friction",
    tileHint: "Forbid tooling decisions in this phase",
    monday: "Postpone every tool/platform decision by 2 weeks. Document the friction instead.",
  },
  {
    id: "founder-burnout",
    symptom: "The founder is the bottleneck and quietly burning out.",
    phase: "CALM",
    chapterSlug: "designing-the-system",
    tileHint: "Move the founder out of the critical path",
    monday: "List 5 decisions only the founder can sign — delegate one of them this week.",
  },
  {
    id: "values-vs-incentives",
    symptom: "Our stated values don't match what we actually reward.",
    phase: "TUNE",
    chapterSlug: "intentional-commitment",
    tileHint: "Align the incentive with the intention",
    monday: "Pick one value and audit the comp/promo signal attached to it.",
  },
  {
    id: "cant-tell-story",
    symptom: "I can't tell our story in one sentence without flinching.",
    phase: "OPEN",
    chapterSlug: "living-the-ontology",
    tileHint: "The conversation IS the ontology",
    monday: "Record yourself answering 'what do you do?' three times. Keep the third take.",
  },
];
