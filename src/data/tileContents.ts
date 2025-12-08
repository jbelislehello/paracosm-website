// Complete 64-tile content definitions
// Columns: C, H, O, R, D, S, M, Σ (CHORDS + Methods + Systems)
// Rows: Mindsets, Agilities, Goals, Landscape, Energy, Norms, Synergies, Protocols & Architectures

export type ColumnKey = 'C' | 'H' | 'O' | 'R' | 'D' | 'S' | 'M' | 'Σ';
export type RowKey = 'mindsets' | 'agilities' | 'goals' | 'landscape' | 'energy' | 'norms' | 'synergies' | 'protocols';

export interface TileContent {
  id: number;
  row: number;
  col: number;
  rowKey: RowKey;
  colKey: ColumnKey;
  name: string;
  glitchQuestion: string;
  tuneQuestion: string;
  deliverable: string;
  phase: 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN';
}

export const COLUMN_LABELS: Record<ColumnKey, { short: string; full: string }> = {
  'C': { short: 'C', full: 'Chances taken' },
  'H': { short: 'H', full: 'Heart Based Principles' },
  'O': { short: 'O', full: 'Observer consciousness' },
  'R': { short: 'R', full: 'Reversal / Renewal' },
  'D': { short: 'D', full: 'Design' },
  'S': { short: 'S', full: 'Seeds' },
  'M': { short: 'M', full: 'Methods' },
  'Σ': { short: 'Σ', full: 'Systems' }
};

export const ROW_LABELS: Record<RowKey, { short: string; full: string; phase: string }> = {
  'mindsets': { short: '1', full: 'Mindsets', phase: 'LOVE' },
  'agilities': { short: '2', full: 'Agilities', phase: 'MAGIC' },
  'goals': { short: '3', full: 'Goals', phase: 'MAGIC→CALM' },
  'landscape': { short: '4', full: 'Landscape (L)', phase: 'CALM' },
  'energy': { short: '5', full: 'Energy (E)', phase: 'CALM' },
  'norms': { short: '6', full: 'Norms (N)', phase: 'CALM' },
  'synergies': { short: '7', full: 'Synergies (S)', phase: 'CALM' },
  'protocols': { short: '8', full: 'Protocols & Architectures', phase: 'OPEN/FREE' }
};

// Helper to get row/col keys from indices
export const getRowKey = (row: number): RowKey => {
  const keys: RowKey[] = ['mindsets', 'agilities', 'goals', 'landscape', 'energy', 'norms', 'synergies', 'protocols'];
  return keys[row - 1];
};

export const getColKey = (col: number): ColumnKey => {
  const keys: ColumnKey[] = ['C', 'H', 'O', 'R', 'D', 'S', 'M', 'Σ'];
  return keys[col - 1];
};

// Full 64-tile content matrix
export const TILE_CONTENTS: TileContent[] = [
  // ROW 1 – MINDSETS (LOVE)
  {
    id: 1, row: 1, col: 1, rowKey: 'mindsets', colKey: 'C',
    name: 'Permission to try',
    glitchQuestion: 'What risk feels both scary and alive right now?',
    tuneQuestion: 'What risk do I allow myself to imagine?',
    deliverable: 'One "What if I…?" statement you\'re willing to hold as true for a week.',
    phase: 'LOVE'
  },
  {
    id: 2, row: 1, col: 2, rowKey: 'mindsets', colKey: 'H',
    name: 'Loving stance',
    glitchQuestion: 'Where am I withholding care or compassion?',
    tuneQuestion: 'If I fully cared for everyone involved, how would I think?',
    deliverable: 'Short compassion statement ("In this project we assume that…").',
    phase: 'LOVE'
  },
  {
    id: 3, row: 1, col: 3, rowKey: 'mindsets', colKey: 'O',
    name: 'Observer upgrade',
    glitchQuestion: 'What lens am I using that might be distorting reality?',
    tuneQuestion: 'What mental model am I using, and which one would be kinder / truer?',
    deliverable: '2-column sketch – "old lens vs new lens".',
    phase: 'LOVE'
  },
  {
    id: 4, row: 1, col: 4, rowKey: 'mindsets', colKey: 'R',
    name: 'Letting go',
    glitchQuestion: 'What belief is holding me back but feels hard to release?',
    tuneQuestion: 'Which belief is expired but still running in the background?',
    deliverable: 'One belief to retire, written, named, and ceremonially crossed out.',
    phase: 'LOVE'
  },
  {
    id: 5, row: 1, col: 5, rowKey: 'mindsets', colKey: 'D',
    name: 'Designer mindset',
    glitchQuestion: 'What assumption am I treating as fixed that could be designed?',
    tuneQuestion: 'If this were a prototype, what would I be curious to test?',
    deliverable: '3 "prototype questions" (what you want to learn, not prove).',
    phase: 'LOVE'
  },
  {
    id: 6, row: 1, col: 6, rowKey: 'mindsets', colKey: 'S',
    name: 'Gardener mindset',
    glitchQuestion: 'What am I trying to force instead of nurture?',
    tuneQuestion: 'What tiny thing am I willing to plant without knowing the outcome?',
    deliverable: 'One seed sentence: "For the next 30 days, I treat X as a seed, not a finished product."',
    phase: 'LOVE'
  },
  {
    id: 7, row: 1, col: 7, rowKey: 'mindsets', colKey: 'M',
    name: 'Practice attitude',
    glitchQuestion: 'Where am I performing instead of practicing?',
    tuneQuestion: 'How can I treat this as a practice, not a performance?',
    deliverable: 'A tiny rule-of-thumb you can repeat daily (mantra / micro-rule).',
    phase: 'LOVE'
  },
  {
    id: 8, row: 1, col: 8, rowKey: 'mindsets', colKey: 'Σ',
    name: 'Systemic worldview',
    glitchQuestion: 'What larger pattern am I ignoring by focusing too narrowly?',
    tuneQuestion: 'If this were part of a larger ecosystem, how would I think?',
    deliverable: 'Quick sketch of the bigger system and your place in it.',
    phase: 'LOVE'
  },

  // ROW 2 – AGILITIES (MAGIC: how you move inside the field)
  {
    id: 9, row: 2, col: 1, rowKey: 'agilities', colKey: 'C',
    name: 'Chance-taking agility',
    glitchQuestion: 'What small experiment am I avoiding?',
    tuneQuestion: 'What is the smallest safe chance I can take this week?',
    deliverable: '1 concrete experiment scheduled in time.',
    phase: 'MAGIC'
  },
  {
    id: 10, row: 2, col: 2, rowKey: 'agilities', colKey: 'H',
    name: 'Heart-led agility',
    glitchQuestion: 'Who needs to feel my care through action right now?',
    tuneQuestion: 'What move would clearly communicate care right now?',
    deliverable: '1 caring gesture you actually make.',
    phase: 'MAGIC'
  },
  {
    id: 11, row: 2, col: 3, rowKey: 'agilities', colKey: 'O',
    name: 'Observational agility',
    glitchQuestion: 'What am I assuming instead of actually observing?',
    tuneQuestion: 'What can I do that gives me better signal about reality?',
    deliverable: '1 deliberate observation move (interview, shadowing, listening ritual).',
    phase: 'MAGIC'
  },
  {
    id: 12, row: 2, col: 4, rowKey: 'agilities', colKey: 'R',
    name: 'Reversal agility',
    glitchQuestion: 'What habitual response am I stuck in?',
    tuneQuestion: "What's the opposite of my default move here?",
    deliverable: '1 inversion experiment you try once.',
    phase: 'MAGIC'
  },
  {
    id: 13, row: 2, col: 5, rowKey: 'agilities', colKey: 'D',
    name: 'Design agility',
    glitchQuestion: 'What micro-experience could use a quick redesign?',
    tuneQuestion: 'What tiny part of the experience can I quickly redesign?',
    deliverable: '1 sketch / micro-flow you alter.',
    phase: 'MAGIC'
  },
  {
    id: 14, row: 2, col: 6, rowKey: 'agilities', colKey: 'S',
    name: 'Seeding agility',
    glitchQuestion: 'What quick seed could I sow in the next hour?',
    tuneQuestion: "What's the smallest experiment I can sow in under 60 minutes?",
    deliverable: 'A concrete micro-seed scheduled in time (e.g. 1 email, 1 landing page, 1 prototype vignette, 1 new conversation).',
    phase: 'MAGIC'
  },
  {
    id: 15, row: 2, col: 7, rowKey: 'agilities', colKey: 'M',
    name: 'Practice agility',
    glitchQuestion: 'What small repeated action would change everything?',
    tuneQuestion: 'What small move, repeated, would change the game?',
    deliverable: 'Define a 5–10 min repeated micro-practice.',
    phase: 'MAGIC'
  },
  {
    id: 16, row: 2, col: 8, rowKey: 'agilities', colKey: 'Σ',
    name: 'Systemic agility',
    glitchQuestion: 'What agility am I still doing manually that could be encoded?',
    tuneQuestion: 'What agility can I encode into tools / templates / automations?',
    deliverable: 'A checklist, prompt, or automation idea that bakes the agility into the system.',
    phase: 'MAGIC'
  },

  // ROW 3 – GOALS (MAGIC → CALM bridge)
  {
    id: 17, row: 3, col: 1, rowKey: 'goals', colKey: 'C',
    name: 'Chance horizon',
    glitchQuestion: 'What outcome feels too bold to name?',
    tuneQuestion: 'What would be a brave but not insane outcome?',
    deliverable: '1 stretch goal phrased as an experiment, not a guarantee.',
    phase: 'MAGIC'
  },
  {
    id: 18, row: 3, col: 2, rowKey: 'goals', colKey: 'H',
    name: 'Heart-aligned aim',
    glitchQuestion: 'What would success look like if I centered care over metrics?',
    tuneQuestion: 'How do we know this goal preserves dignity & care?',
    deliverable: '2–3 non-negotiable qualitative criteria ("No success if…").',
    phase: 'MAGIC'
  },
  {
    id: 19, row: 3, col: 3, rowKey: 'goals', colKey: 'O',
    name: 'Ontological goal',
    glitchQuestion: 'Who am I becoming through this pursuit?',
    tuneQuestion: 'Who do we become if we reach this?',
    deliverable: '3 words describing the identity shift (for you or the org).',
    phase: 'MAGIC'
  },
  {
    id: 20, row: 3, col: 4, rowKey: 'goals', colKey: 'R',
    name: 'Renewal outcome',
    glitchQuestion: 'What old pattern needs to die for this to work?',
    tuneQuestion: 'What old pattern dies if we succeed?',
    deliverable: 'Statement of one pattern you intend to retire via this goal.',
    phase: 'MAGIC'
  },
  {
    id: 21, row: 3, col: 5, rowKey: 'goals', colKey: 'D',
    name: 'Design target',
    glitchQuestion: 'What experience am I really trying to create?',
    tuneQuestion: 'What experience must exist by the end?',
    deliverable: 'A one-sentence "experience goal" ("Users feel…" / "Partners can…").',
    phase: 'MAGIC'
  },
  {
    id: 22, row: 3, col: 6, rowKey: 'goals', colKey: 'S',
    name: 'Seed-harvest goal',
    glitchQuestion: 'What could actually grow from this if I let it?',
    tuneQuestion: "If this seed actually grows, what will exist that doesn't exist today?",
    deliverable: 'A seed-goal framed as harvest: "If this seed succeeds, in 3 months we have ___."',
    phase: 'MAGIC'
  },
  {
    id: 23, row: 3, col: 7, rowKey: 'goals', colKey: 'M',
    name: 'Practice objective',
    glitchQuestion: 'What skill do I want to make second nature?',
    tuneQuestion: 'What skill / practice do we want to normalize?',
    deliverable: 'Skill statement + rough frequency (daily, weekly, per sprint).',
    phase: 'MAGIC'
  },
  {
    id: 24, row: 3, col: 8, rowKey: 'goals', colKey: 'Σ',
    name: 'System outcome',
    glitchQuestion: 'What should happen automatically without my intervention?',
    tuneQuestion: 'What system should run without us thinking about it?',
    deliverable: 'Phrase the desired system in one sentence ("A, B, C happen whenever X").',
    phase: 'MAGIC'
  },

  // ROW 4 – LANDSCAPE (CALM)
  {
    id: 25, row: 4, col: 1, rowKey: 'landscape', colKey: 'C',
    name: 'Chances in the field',
    glitchQuestion: 'What opportunity am I not seeing because I\'m too close?',
    tuneQuestion: 'Where, in the environment, are the open doors?',
    deliverable: 'Quick map of 3–5 current opportunities.',
    phase: 'CALM'
  },
  {
    id: 26, row: 4, col: 2, rowKey: 'landscape', colKey: 'H',
    name: 'Emotional terrain',
    glitchQuestion: 'Where is there unexpressed emotion in the system?',
    tuneQuestion: 'Where are people excited, scared, numb?',
    deliverable: 'Emotional map of key actors (simple list or diagram).',
    phase: 'CALM'
  },
  {
    id: 27, row: 4, col: 3, rowKey: 'landscape', colKey: 'O',
    name: 'Ontological ecology',
    glitchQuestion: 'What stories are people telling themselves that shape this landscape?',
    tuneQuestion: 'What stories about reality are already present here?',
    deliverable: 'List of dominant narratives / assumptions in the environment.',
    phase: 'CALM'
  },
  {
    id: 28, row: 4, col: 4, rowKey: 'landscape', colKey: 'R',
    name: 'Shifting ground',
    glitchQuestion: 'What just changed that I haven\'t fully registered?',
    tuneQuestion: 'What\'s changing under our feet?',
    deliverable: '3 observed trends or recent changes that matter.',
    phase: 'CALM'
  },
  {
    id: 29, row: 4, col: 5, rowKey: 'landscape', colKey: 'D',
    name: 'Experience topography',
    glitchQuestion: 'What are the pain points in the current journey?',
    tuneQuestion: 'What are the main touchpoints and paths?',
    deliverable: 'Rough journey map or service blueprint.',
    phase: 'CALM'
  },
  {
    id: 30, row: 4, col: 6, rowKey: 'landscape', colKey: 'S',
    name: 'Fertile ground',
    glitchQuestion: 'Where am I planting in rocky soil when fertile ground is nearby?',
    tuneQuestion: 'In this environment, where do seeds have the best chance to take root?',
    deliverable: "A map of 3–5 fertile spots (people, contexts, channels) where you'll drop first versions.",
    phase: 'CALM'
  },
  {
    id: 31, row: 4, col: 7, rowKey: 'landscape', colKey: 'M',
    name: 'Method ecology',
    glitchQuestion: 'What practices are already working that I could learn from?',
    tuneQuestion: 'What practices already exist in this landscape?',
    deliverable: 'Inventory of current methods people use.',
    phase: 'CALM'
  },
  {
    id: 32, row: 4, col: 8, rowKey: 'landscape', colKey: 'Σ',
    name: 'System map',
    glitchQuestion: 'What feedback loops are operating here?',
    tuneQuestion: 'How do all the parts interact over time?',
    deliverable: 'Simple systems diagram (loops, stocks, flows).',
    phase: 'CALM'
  },

  // ROW 5 – ENERGY (CALM)
  {
    id: 33, row: 5, col: 1, rowKey: 'energy', colKey: 'C',
    name: 'Risk bandwidth',
    glitchQuestion: 'Am I pushing too hard or playing too safe?',
    tuneQuestion: 'How much risk/novelty can we actually hold right now?',
    deliverable: 'Choose a "risk level" (low/medium/high) and note why.',
    phase: 'CALM'
  },
  {
    id: 34, row: 5, col: 2, rowKey: 'energy', colKey: 'H',
    name: 'Emotional charge',
    glitchQuestion: 'What emotions are fueling this work, for better or worse?',
    tuneQuestion: 'What feelings are fueling or draining this?',
    deliverable: '2 lists – energising vs exhausting elements.',
    phase: 'CALM'
  },
  {
    id: 35, row: 5, col: 3, rowKey: 'energy', colKey: 'O',
    name: 'Attention ontology',
    glitchQuestion: 'What am I giving attention to that doesn\'t deserve it?',
    tuneQuestion: 'What are we treating as worthy of energy?',
    deliverable: 'List of current top 5 attention sinks & whether they deserve it.',
    phase: 'CALM'
  },
  {
    id: 36, row: 5, col: 4, rowKey: 'energy', colKey: 'R',
    name: 'Release + replenish',
    glitchQuestion: 'What should I stop doing to free up energy?',
    tuneQuestion: 'What can we stop doing to free energy?',
    deliverable: 'One thing to pause for a cycle (sprint/month).',
    phase: 'CALM'
  },
  {
    id: 37, row: 5, col: 5, rowKey: 'energy', colKey: 'D',
    name: 'Energetic UX',
    glitchQuestion: 'Where is the experience unnecessarily draining?',
    tuneQuestion: 'Where does effort spike for users/ourselves?',
    deliverable: 'Mark high-friction moments and one design idea to smooth them.',
    phase: 'CALM'
  },
  {
    id: 38, row: 5, col: 6, rowKey: 'energy', colKey: 'S',
    name: 'Seedable energy',
    glitchQuestion: 'Am I trying to grow too many seeds at once?',
    tuneQuestion: 'How many seeds can we realistically care for right now?',
    deliverable: 'A cap: "We run at most N seeds in parallel," plus a short note on which ones get sunlight first.',
    phase: 'CALM'
  },
  {
    id: 39, row: 5, col: 7, rowKey: 'energy', colKey: 'M',
    name: 'Rest as method',
    glitchQuestion: 'Where is rest missing from my practice?',
    tuneQuestion: 'How is rest built into the practice?',
    deliverable: 'Define one explicit rest/repair ritual linked to the work.',
    phase: 'CALM'
  },
  {
    id: 40, row: 5, col: 8, rowKey: 'energy', colKey: 'Σ',
    name: 'Self-regulating system',
    glitchQuestion: 'How will the system protect itself from burnout?',
    tuneQuestion: 'How will the system protect itself from burnout?',
    deliverable: '2–3 automatic "brakes" or guards (limits, thresholds, alerts).',
    phase: 'CALM'
  },

  // ROW 6 – NORMS (CALM)
  {
    id: 41, row: 6, col: 1, rowKey: 'norms', colKey: 'C',
    name: 'Safe chances',
    glitchQuestion: 'What makes experimentation feel unsafe here?',
    tuneQuestion: 'How do we make risk-taking non-destructive?',
    deliverable: '3 rules for "good experiments" (what\'s allowed / not allowed).',
    phase: 'CALM'
  },
  {
    id: 42, row: 6, col: 2, rowKey: 'norms', colKey: 'H',
    name: 'Heart boundaries',
    glitchQuestion: 'Whose dignity or vulnerability is at risk?',
    tuneQuestion: 'What protects each person\'s dignity & vulnerability?',
    deliverable: 'List of red lines / consent rules.',
    phase: 'CALM'
  },
  {
    id: 43, row: 6, col: 3, rowKey: 'norms', colKey: 'O',
    name: 'Meta-rules',
    glitchQuestion: 'What hidden assumptions are our rules based on?',
    tuneQuestion: 'What assumptions do our current rules encode?',
    deliverable: 'Note 1–2 hidden assumptions behind your norms.',
    phase: 'CALM'
  },
  {
    id: 44, row: 6, col: 4, rowKey: 'norms', colKey: 'R',
    name: 'Norm reset',
    glitchQuestion: 'Which rule is outdated but still enforced?',
    tuneQuestion: 'Which norm do we need to retire or invert?',
    deliverable: 'Rewrite one norm in a more generous / truthful way.',
    phase: 'CALM'
  },
  {
    id: 45, row: 6, col: 5, rowKey: 'norms', colKey: 'D',
    name: 'Norm-by-design',
    glitchQuestion: 'Where is the norm just written, not embedded?',
    tuneQuestion: 'How can the interface / process embody the rule?',
    deliverable: 'Tweak a form, flow, or ritual so the norm is embedded, not just written.',
    phase: 'CALM'
  },
  {
    id: 46, row: 6, col: 6, rowKey: 'norms', colKey: 'S',
    name: 'Ethical seeding',
    glitchQuestion: "Am I planting seeds that respect people's time and boundaries?",
    tuneQuestion: "What makes a seed respectful of people's time, data, and emotions?",
    deliverable: '3 seed norms: opt-out is easy, expectations are clear, no dark patterns, etc.',
    phase: 'CALM'
  },
  {
    id: 47, row: 6, col: 7, rowKey: 'norms', colKey: 'M',
    name: 'Norm practice',
    glitchQuestion: 'How do we practice the norm, not just talk about it?',
    tuneQuestion: 'How do we rehearse the norm, not just talk about it?',
    deliverable: 'One recurring practice that reinforces the new rule.',
    phase: 'CALM'
  },
  {
    id: 48, row: 6, col: 8, rowKey: 'norms', colKey: 'Σ',
    name: 'Policy & compliance',
    glitchQuestion: 'Where do our norms need to become formal policy?',
    tuneQuestion: 'How do these norms show up in contracts, policies, tooling?',
    deliverable: 'List of artifacts that must be updated (docs, templates, checklists, bots).',
    phase: 'CALM'
  },

  // ROW 7 – SYNERGIES (CALM)
  {
    id: 49, row: 7, col: 1, rowKey: 'synergies', colKey: 'C',
    name: 'Chance encounters',
    glitchQuestion: 'What unexpected connection could change everything?',
    tuneQuestion: 'What unexpected connection could change everything?',
    deliverable: 'One introduction / collision you intentionally create.',
    phase: 'CALM'
  },
  {
    id: 50, row: 7, col: 2, rowKey: 'synergies', colKey: 'H',
    name: 'Relational nourishment',
    glitchQuestion: 'Who needs to feel seen for this to flourish?',
    tuneQuestion: 'Who needs to feel seen for this to flourish?',
    deliverable: 'One appreciative message / shout-out.',
    phase: 'CALM'
  },
  {
    id: 51, row: 7, col: 3, rowKey: 'synergies', colKey: 'O',
    name: 'Ecology of perspectives',
    glitchQuestion: 'Whose worldview is missing from the table?',
    tuneQuestion: 'Whose worldview is missing from the table?',
    deliverable: 'List of missing voices + plan to invite at least one.',
    phase: 'CALM'
  },
  {
    id: 52, row: 7, col: 4, rowKey: 'synergies', colKey: 'R',
    name: 'Unlikely alliances',
    glitchQuestion: 'What two things "shouldn\'t" go together but could?',
    tuneQuestion: 'Which two things that "don\'t belong together" should we mix?',
    deliverable: 'Design a small mash-up experiment.',
    phase: 'CALM'
  },
  {
    id: 53, row: 7, col: 5, rowKey: 'synergies', colKey: 'D',
    name: 'Co-designed spaces',
    glitchQuestion: 'Where are we coordinating when we should be collaborating?',
    tuneQuestion: 'Where can we design collaboration, not just coordination?',
    deliverable: 'Agenda or canvas for a co-design session.',
    phase: 'CALM'
  },
  {
    id: 54, row: 7, col: 6, rowKey: 'synergies', colKey: 'S',
    name: 'Cross-pollination',
    glitchQuestion: 'Is this seed growing in isolation when it could be part of a network?',
    tuneQuestion: 'Which other seeds, people, or projects can this one naturally cross-pollinate with?',
    deliverable: "A mini cross-pollination plan: who/what this seed will touch and how you'll invite collaboration.",
    phase: 'CALM'
  },
  {
    id: 55, row: 7, col: 7, rowKey: 'synergies', colKey: 'M',
    name: 'Relational rituals',
    glitchQuestion: 'What recurring practice keeps the network alive?',
    tuneQuestion: 'What recurring practice keeps the network alive?',
    deliverable: 'Define one recurring circle/stand-up/retrospective.',
    phase: 'CALM'
  },
  {
    id: 56, row: 7, col: 8, rowKey: 'synergies', colKey: 'Σ',
    name: 'Networked system',
    glitchQuestion: 'Where can systems connect to systems?',
    tuneQuestion: 'Where can systems connect to systems (API, protocol, shared standards)?',
    deliverable: 'Note specific integrations or shared formats to build.',
    phase: 'CALM'
  },

  // ROW 8 – PROTOCOLS & ARCHITECTURES (OPEN/FREE)
  {
    id: 57, row: 8, col: 1, rowKey: 'protocols', colKey: 'C',
    name: 'Prototype chances',
    glitchQuestion: 'What is the smallest thing I could build that still feels exciting?',
    tuneQuestion: 'What is the smallest prototype that still feels risky/exciting?',
    deliverable: 'One "version 0.1" description (scope, timebox, user).',
    phase: 'OPEN'
  },
  {
    id: 58, row: 8, col: 2, rowKey: 'protocols', colKey: 'H',
    name: 'Felt prototype',
    glitchQuestion: 'How should this prototype feel from the inside?',
    tuneQuestion: 'How should this prototype feel from the inside?',
    deliverable: 'Mood / tone board or a paragraph about the emotional texture.',
    phase: 'OPEN'
  },
  {
    id: 59, row: 8, col: 3, rowKey: 'protocols', colKey: 'O',
    name: 'Model in code',
    glitchQuestion: 'What core concepts must the architecture respect?',
    tuneQuestion: 'What ontology must the architecture respect?',
    deliverable: 'A first pass at core entities / concepts (for prompts, DB, or flows).',
    phase: 'OPEN'
  },
  {
    id: 60, row: 8, col: 4, rowKey: 'protocols', colKey: 'R',
    name: 'Kill-switch & pivots',
    glitchQuestion: 'Under what conditions should we stop or pivot?',
    tuneQuestion: 'Under what conditions do we pivot or sunset this artifact?',
    deliverable: 'List of pivot/sunset criteria.',
    phase: 'OPEN'
  },
  {
    id: 61, row: 8, col: 5, rowKey: 'protocols', colKey: 'D',
    name: 'Interaction blueprint',
    glitchQuestion: 'What is the core loop the user experiences?',
    tuneQuestion: 'What is the core interaction loop?',
    deliverable: 'A simple loop diagram (user → system → feedback).',
    phase: 'OPEN'
  },
  {
    id: 62, row: 8, col: 6, rowKey: 'protocols', colKey: 'S',
    name: 'Living prototype',
    glitchQuestion: "What's the smallest artifact that proves this seed is real?",
    tuneQuestion: 'What is the minimal living artifact that proves this seed is real?',
    deliverable: 'A V0.1 seed spec: audience, format (conversation, canvas, bot, workshop, feature…), success signal for this first grow cycle.',
    phase: 'OPEN'
  },
  {
    id: 63, row: 8, col: 7, rowKey: 'protocols', colKey: 'M',
    name: 'Operational method',
    glitchQuestion: 'How do we actually run and maintain this?',
    tuneQuestion: 'What is the runbook for using / maintaining this?',
    deliverable: 'Outline of a basic runbook: inputs, steps, outputs.',
    phase: 'OPEN'
  },
  {
    id: 64, row: 8, col: 8, rowKey: 'protocols', colKey: 'Σ',
    name: 'Living system',
    glitchQuestion: 'How does this become a self-improving system over time?',
    tuneQuestion: 'How does this become a self-improving system over time?',
    deliverable: 'Notes on metrics, feedback loops, and learning mechanisms (agents, logs, rituals).',
    phase: 'OPEN'
  }
];

// Helper to get tile content by ID or position
export const getTileContent = (id: number): TileContent | undefined => {
  return TILE_CONTENTS.find(t => t.id === id);
};

export const getTileContentByPosition = (row: number, col: number): TileContent | undefined => {
  return TILE_CONTENTS.find(t => t.row === row && t.col === col);
};

// Get phase color
export const getPhaseColor = (phase: TileContent['phase']): string => {
  switch (phase) {
    case 'LOVE': return 'from-rose-500 to-pink-600';
    case 'MAGIC': return 'from-violet-500 to-purple-600';
    case 'CALM': return 'from-cyan-500 to-blue-600';
    case 'OPEN': return 'from-emerald-500 to-green-600';
    default: return 'from-gray-500 to-gray-600';
  }
};
