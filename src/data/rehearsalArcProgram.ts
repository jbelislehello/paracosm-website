/**
 * Rehearsal Arc — the full program.
 *
 * 9 offerings across 3 tiers, each scored through the 5-state Calm Magic
 * ontology (LOVE → MAGIC → CALM → OPEN → FREE) and the 3 simultaneous
 * journeys (Narrative · Cognitive · Identity).
 *
 * Content voice on the site is editorial (this file). The PPTX deck and
 * DOCX workbook re-render the same data in facilitator voice.
 *
 * Ontological integrity: every state, journey and exercise is a distinct
 * field — never concatenate them.
 */

import type { ArcTier, CalmMagicState, JourneyTrack } from "./rehearsalArcMeta";

export interface Exercise {
  name: string;
  intent: string;
  prompt: string;
  timingMin: number;
  materials: string;
  debrief: string;
}

export interface StateChapter {
  intent: string;
  promptQuestion: string;
  exercises: [Exercise, Exercise, Exercise];
  journeys: Record<JourneyTrack, string>;
  artifact: string;
}

export interface RoadmapStep {
  label: string;
  when: string;
  focus: CalmMagicState;
  outcome: string;
}

export interface RehearsalOffering {
  id: string;
  slug: string;
  tier: ArcTier;
  title: string;
  tagline: string;
  duration: string;
  narrativePremise: string;
  cognitiveModel: string;
  identityShift: string;
  states: Record<CalmMagicState, StateChapter>;
  roadmap: RoadmapStep[];
  commitmentContract: {
    prompt: string;
    template: string;
    witness: string;
  };
}

/* ------------------------------------------------------------------ */
/* Helper — keeps exercises visually compact per offering              */
/* ------------------------------------------------------------------ */

const ex = (
  name: string,
  intent: string,
  prompt: string,
  timingMin: number,
  materials: string,
  debrief: string,
): Exercise => ({ name, intent, prompt, timingMin, materials, debrief });

/* ================================================================== */
/* FOREPLAY — TRAININGS                                                */
/* ================================================================== */

const GLITCH: RehearsalOffering = {
  id: "training-glitch",
  slug: "glitch",
  tier: "foreplay",
  title: "GL!TCH — Clarity Reset",
  tagline:
    "The official 65-hour Crewdle AI Formation. Rehearse the reframe until the team can do it without you in the room.",
  duration: "65 hours over 8 weeks",
  narrativePremise:
    "You walked in with a stack of AI tools and no clarity. You walk out with one shared reframe of what the org is actually being asked to become.",
  cognitiveModel:
    "The 5-state Calm Magic ontology applied to AI adoption. Every meeting becomes a legible arc from resonance to commitment.",
  identityShift:
    "From tool-picker to intention-designer. You stop asking 'which AI?' and start asking 'which future?'",
  states: {
    LOVE: {
      intent: "Anchor why this shift matters before any tool is named.",
      promptQuestion: "What are you afraid AI will take from you — and what are you afraid it will ask of you?",
      exercises: [
        ex(
          "The Two Fears",
          "Surface the loss AND the demand.",
          "Write two sentences on one card: 'I'm afraid AI will take ___' and 'I'm afraid AI will ask me to ___'.",
          15,
          "Index cards, one felt pen per person.",
          "Read only the second sentence around the circle. No commentary. Let the silence do the work.",
        ),
        ex(
          "Meaningful Future Postcard",
          "Move from fear to a concrete 3-year image.",
          "Draw or describe the day-in-the-life of your role three years from now if this shift went well.",
          20,
          "Blank postcards, colored markers.",
          "Pair-share for 5 minutes. Ask: 'What surprised you about your own postcard?'",
        ),
        ex(
          "The Resonance Line",
          "Physically map how the team relates to the shift.",
          "Stand on a line from 'this excites me' to 'this exhausts me'. Move once someone else speaks.",
          10,
          "Masking tape line on the floor.",
          "Notice who moved and when. Ask: 'What did you hear that moved you?'",
        ),
      ],
      journeys: {
        narrative: "The story: I was allowed to name what I was afraid of.",
        cognitive: "The model: emotion is data, not noise before the real work.",
        identity: "I am someone whose fear can be spoken and stay welcome.",
      },
      artifact: "A wall of postcards representing the room's 3-year horizon.",
    },
    MAGIC: {
      intent: "Break the default lens: AI adoption is not tool selection.",
      promptQuestion: "What if the AI isn't the product — what if the reframe is?",
      exercises: [
        ex(
          "Tool-Free Fridge Test",
          "Prove the reframe by forbidding tools.",
          "Redesign one broken workflow without naming a single tool. Only verbs and outcomes.",
          25,
          "Whiteboard, sticky notes with only verbs written.",
          "Compare with the group's tool-first draft. Ask: 'What did removing tools reveal?'",
        ),
        ex(
          "Reverse Demo",
          "Show the future by demoing the failure it prevents.",
          "In pairs, act out the meeting this workflow will replace. Play it straight.",
          15,
          "None.",
          "Debrief: 'What did the old meeting cost us that we had normalized?'",
        ),
        ex(
          "The Ontology Swap",
          "Introduce Calm Magic states as the new lens.",
          "Re-tell one recent project through LOVE→MAGIC→CALM→OPEN→FREE, one sentence per state.",
          20,
          "The 5-state cheat card (provided).",
          "Ask: 'Which state was under-invested? Which was skipped entirely?'",
        ),
      ],
      journeys: {
        narrative: "The story: the day we stopped naming tools.",
        cognitive: "The model: verbs before nouns. States before stacks.",
        identity: "I am someone who leads with intention before selection.",
      },
      artifact: "One workflow redrawn twice — with tools, then without. Kept side by side.",
    },
    CALM: {
      intent: "Introduce the framework with enough rigor to be trusted.",
      promptQuestion: "Where is the uncertainty actually living in this org?",
      exercises: [
        ex(
          "The Uncertainty Map",
          "Locate the fog before choosing the flashlight.",
          "Plot every open decision on a 2×2: reversible/irreversible × known/unknown.",
          25,
          "Large printed 2×2, dot stickers.",
          "Focus on the irreversible-unknown quadrant. Ask: 'Which of these should NOT be decided this quarter?'",
        ),
        ex(
          "Five Seasons Walkthrough",
          "Teach the PRD ontology (POLLENS→ANTHEMS) with a live case.",
          "Take one initiative and place it in each season. Note what's missing.",
          30,
          "Five-season poster, markers.",
          "Ask: 'Which season did we jump over? What did that cost?'",
        ),
        ex(
          "The Legibility Test",
          "Framework only helps if someone can redraw it from memory.",
          "Close the poster. Redraw the 5 seasons and 5 states from memory on a napkin.",
          10,
          "Napkin per person, pen.",
          "Post the napkins on the wall. Nobody's is perfect — that's the point.",
        ),
      ],
      journeys: {
        narrative: "The story: the day the fog got a map.",
        cognitive: "The model: 5 seasons × 5 states = 25 places to look.",
        identity: "I am someone who can name where uncertainty lives.",
      },
      artifact: "A 2×2 of live decisions and a wall of imperfect memory-drawn frameworks.",
    },
    OPEN: {
      intent: "Discovery through interaction — the room becomes the teacher.",
      promptQuestion: "What pattern is repeating that nobody has named yet?",
      exercises: [
        ex(
          "Silent Wall",
          "Let patterns emerge without a facilitator's voice.",
          "In silence, cluster all week's sticky notes. Only movement, no talking.",
          20,
          "Every sticky from the week, one blank wall.",
          "Only after silence ends: 'What cluster names itself?'",
        ),
        ex(
          "The Missing Voice",
          "Notice which stakeholder never gets quoted.",
          "List every role mentioned this week. Circle the ones nobody quoted verbatim.",
          15,
          "Flipchart, colored circles.",
          "Ask: 'Who has to be in the room next week?'",
        ),
        ex(
          "Reflection Triads",
          "Turn insight into shareable language.",
          "In triads: speaker (5 min uninterrupted) → mirror (2 min reflect back) → scribe (2 min write it down).",
          30,
          "Timer, notebook.",
          "Read the scribed lines aloud. Which ones want to become the team's next question?",
        ),
      ],
      journeys: {
        narrative: "The story: the silence when we finally saw the pattern.",
        cognitive: "The model: patterns emerge from arrangement, not argument.",
        identity: "I am someone who can hold a room in productive silence.",
      },
      artifact: "The named clusters and the list of missing voices.",
    },
    FREE: {
      intent: "One clear commitment per person. No more.",
      promptQuestion: "What is the smallest brave thing you will do by Monday?",
      exercises: [
        ex(
          "Smallest Brave Promise",
          "Force scoping down to a real action.",
          "One sentence: 'By Monday I will ___. My witness is ___.'",
          10,
          "Promise cards.",
          "Read all cards aloud. Nothing else needs to be said.",
        ),
        ex(
          "The 30-Day Undo Clause",
          "Make commitment feel safe by making retreat legible.",
          "Add a sentence: 'If by day 30 ___ is true, I will stop and re-open the question.'",
          10,
          "Same card.",
          "Notice how commitment loosens when retreat is pre-authorized.",
        ),
        ex(
          "Ritual Handoff",
          "Anchor the promise to a shared object.",
          "Pass a stone / totem to each speaker. They hold it while making their promise, then place it in a shared bowl.",
          15,
          "One small object per participant, one bowl.",
          "The bowl travels with the team to the next session.",
        ),
      ],
      journeys: {
        narrative: "The story: the day we all held the same stone.",
        cognitive: "The model: commitment = smallest action + witness + undo clause.",
        identity: "I am someone who ships a promise, not a plan.",
      },
      artifact: "A bowl of commitment stones. A shared spreadsheet of Monday actions.",
    },
  },
  roadmap: [
    { label: "Week 1 — Landing", when: "Live · 6h", focus: "LOVE", outcome: "Fears named, futures postcarded." },
    { label: "Week 2 — Reframe", when: "Live · 6h + async · 4h", focus: "MAGIC", outcome: "Tool-free workflow drawn." },
    { label: "Week 3-4 — Ontology", when: "Live · 12h + async · 8h", focus: "CALM", outcome: "Uncertainty map + season walkthrough." },
    { label: "Week 5-6 — Discovery", when: "Live · 10h + async · 8h", focus: "OPEN", outcome: "Named patterns + missing voices list." },
    { label: "Week 7 — Commit", when: "Live · 6h", focus: "FREE", outcome: "Promise stones + Monday actions." },
    { label: "Week 8 — Witness", when: "Async · 5h", focus: "FREE", outcome: "First check-in with witness." },
  ],
  commitmentContract: {
    prompt: "What is the smallest brave thing you will do by Monday?",
    template: "By Monday I will __________. My witness is __________. If by day 30 __________ is true, I will stop and re-open the question.",
    witness: "One peer from the cohort, named before leaving the room.",
  },
};

const DRIFT: RehearsalOffering = {
  id: "training-drift",
  slug: "drift",
  tier: "foreplay",
  title: "Drift — Decision Sprint",
  tagline: "60 hours of co-assisted development. Learn to think out loud with the machine without losing your own voice.",
  duration: "60 hours over 6 weeks",
  narrativePremise: "You stopped drafting alone. The machine became a thinking partner — one you could interrupt, correct and disagree with.",
  cognitiveModel: "Drift = axis-aware co-thinking. Every prompt starts from one of the 5 Calm Magic axes (MAGIC/LOVE/CALM/OPEN/FREE) and stays legibly on it.",
  identityShift: "From prompt-hoarder to axis-holder. You know which axis you're on and when to switch.",
  states: {
    LOVE: {
      intent: "Reconnect to why you're outsourcing thinking in the first place.",
      promptQuestion: "What kind of thinking do you not want to hand over?",
      exercises: [
        ex("Non-Delegable List", "Name what must stay yours.", "List 5 kinds of thinking you refuse to outsource to a machine. One line each.", 10, "Notebook.", "Trade lists with a partner. Ask: 'Would you defend theirs?'"),
        ex("Voice Print", "Establish your own baseline before drift.", "Write 200 words on a topic you love. Do not edit.", 15, "Blank page.", "Save it. You'll compare against machine-assisted drafts later."),
        ex("Companion Contract", "Set the terms of the relationship.", "Fill in: 'When I work with the machine I promise to ___ and I refuse to ___.'", 10, "Card.", "Read aloud. Pin above your desk."),
      ],
      journeys: {
        narrative: "The story: I named what stays mine before I let anything in.",
        cognitive: "The model: co-thinking starts with sovereignty.",
        identity: "I am someone with a voice-print I recognize.",
      },
      artifact: "A signed Companion Contract on the wall.",
    },
    MAGIC: {
      intent: "See the machine as a mirror, not an oracle.",
      promptQuestion: "What did the machine reflect back that you couldn't say yourself?",
      exercises: [
        ex("Mirror Prompt", "Use the machine to reflect, not answer.", "Feed a rough idea; ask the machine to say back only what it heard, in your voice. Iterate 3 rounds.", 20, "AI chat.", "Ask: 'On which round did it start sounding like you?'"),
        ex("Cognitive Handoff", "Practice giving one clear cognitive task.", "Assign the machine ONE bounded task ('list contradictions in this doc'). Nothing else.", 15, "AI chat, one doc.", "Ask: 'Where did you resist giving up more? Why?'"),
        ex("Disagreement Drill", "Learn to say no to a confident machine.", "Pick a plausible-but-wrong output. Push back with evidence in 3 sentences.", 15, "AI output, notes.", "Ask: 'When did the machine concede? When should it have?'"),
      ],
      journeys: {
        narrative: "The story: the day the machine started sounding like me.",
        cognitive: "The model: mirror > oracle. Bounded task > open request.",
        identity: "I am someone who can disagree with a confident machine.",
      },
      artifact: "A screenshot of the round when the mirror clicked.",
    },
    CALM: {
      intent: "Introduce the 5 Drift axes as a legible orientation system.",
      promptQuestion: "Which axis is this conversation actually on?",
      exercises: [
        ex("Axis Tagging", "Learn to name the axis of every prompt.", "Take 10 prompts you've written this week. Tag each with MAGIC/LOVE/CALM/OPEN/FREE.", 20, "Prompt history export.", "Ask: 'Which axis is over-represented? Which is missing?'"),
        ex("Single-Axis Run", "Stay on one axis end-to-end.", "Do one 30-min work session staying strictly on OPEN (workflow/ontology).", 30, "AI chat, timer.", "Ask: 'What tempted you to switch? What did you gain by staying?'"),
        ex("Axis Handoff", "Practice explicit axis switching.", "Move a conversation from MAGIC to CALM by announcing the switch out loud to the machine.", 15, "AI chat.", "Ask: 'Did the machine follow? Did YOU follow?'"),
      ],
      journeys: {
        narrative: "The story: I learned to name the axis before I hit send.",
        cognitive: "The model: 5 axes = 5 kinds of thinking. Name it or drift.",
        identity: "I am someone who navigates axes, not prompts.",
      },
      artifact: "A tagged prompt history. Wall chart of axis distribution.",
    },
    OPEN: {
      intent: "Discover your own drift patterns by looking at your history.",
      promptQuestion: "What does my week of prompts say I actually believe?",
      exercises: [
        ex("The Prompt Autopsy", "Read your own history as an anthropologist.", "In pairs, read a partner's prompt history. Report back what you think they care about.", 25, "Prompt exports (redacted if needed).", "Ask: 'What did they see that you couldn't?'"),
        ex("Missing Axis Sprint", "Fill the axis you avoid.", "Do a 20-min session on the axis you've avoided this month.", 20, "AI chat.", "Ask: 'What made that axis feel forbidden?'"),
        ex("Silent Co-Draft", "Draft with the machine without speaking to anyone else.", "45 min silent co-drafting. Timer. No Slack, no email.", 45, "Timer, AI chat.", "Group debrief on cadence, not content."),
      ],
      journeys: {
        narrative: "The story: the day I read my prompts like a diary.",
        cognitive: "The model: your prompt history IS your working ontology.",
        identity: "I am someone who is legible to myself.",
      },
      artifact: "An axis distribution chart. A silent co-draft artifact.",
    },
    FREE: {
      intent: "Ship one decision. Not one deck.",
      promptQuestion: "What decision will you make this week that Drift helped shape?",
      exercises: [
        ex("The One-Decision Memo", "Compress the sprint into one page.", "Write a 1-page memo: context, options, decision, undo clause. Machine helps only with structure.", 30, "Template.", "Circulate. Get one 'agree' and one 'push-back' before shipping."),
        ex("Machine-Free Sign-Off", "The final commitment happens without the machine.", "Read your memo aloud without the machine present. Change what feels borrowed.", 15, "Printed memo.", "Ask: 'What phrase did you cut?'"),
        ex("Cadence Contract", "Set your co-thinking rhythm.", "Decide: which days do you drift with the machine? Which days do you draft alone?", 10, "Calendar.", "Post the calendar to the team."),
      ],
      journeys: {
        narrative: "The story: I shipped a decision the machine helped shape but did not sign.",
        cognitive: "The model: co-thinking has a cadence. Solo thinking has a place.",
        identity: "I am someone who ships decisions, not drafts.",
      },
      artifact: "A one-page decision memo. A published co-thinking calendar.",
    },
  },
  roadmap: [
    { label: "Week 1 — Sovereignty", when: "Live · 8h + async · 6h", focus: "LOVE", outcome: "Companion Contract signed." },
    { label: "Week 2 — Mirror", when: "Live · 6h + async · 6h", focus: "MAGIC", outcome: "First mirror-click screenshot." },
    { label: "Week 3 — Axes", when: "Live · 6h + async · 6h", focus: "CALM", outcome: "Tagged prompt history." },
    { label: "Week 4 — Patterns", when: "Live · 6h + async · 6h", focus: "OPEN", outcome: "Prompt autopsy report." },
    { label: "Week 5 — Ship", when: "Live · 6h + async · 4h", focus: "FREE", outcome: "One-decision memo shipped." },
    { label: "Week 6 — Cadence", when: "Async · 6h", focus: "FREE", outcome: "Co-thinking calendar published." },
  ],
  commitmentContract: {
    prompt: "Which decision will you let Drift help you shape this month — and which will you keep entirely your own?",
    template: "This month I will drift with the machine on __________. I will keep __________ entirely my own. My co-thinking cadence is __________.",
    witness: "A colleague who reads your first memo before it ships.",
  },
};

const TUNE: RehearsalOffering = {
  id: "training-tune",
  slug: "tune",
  tier: "foreplay",
  title: "Tune — Founder Companion",
  tagline: "60 hours of orchestrated autonomy. Move from co-assisted drafting to running a small ensemble of agents on your behalf.",
  duration: "60 hours over 6 weeks",
  narrativePremise: "You stopped being the bottleneck. The ensemble drafts while you conduct.",
  cognitiveModel: "Tune = orchestration ontology. Each agent has a role (voice, verifier, scribe, skeptic) and a bounded axis.",
  identityShift: "From soloist to conductor. From doing every note to shaping every phrase.",
  states: {
    LOVE: {
      intent: "Reclaim the part of the work that must stay conducted, not delegated.",
      promptQuestion: "What is the taste that only you can hold?",
      exercises: [
        ex("Taste Inventory", "Name your non-negotiable aesthetic.", "List 7 things that must be true of anything shipped in your name.", 15, "Card.", "Read aloud. Notice which items surprise you."),
        ex("The Conductor's Chair", "Physically claim the role.", "Sit in one designated chair. Only from this chair do you make orchestration decisions.", 5, "One chair.", "Debrief the felt difference between conducting and doing."),
        ex("Ensemble Manifesto", "Declare what the ensemble is for.", "Draft a 3-line manifesto: purpose, boundary, promise.", 15, "Card.", "Post above the conductor's chair."),
      ],
      journeys: {
        narrative: "The story: the day I sat in the conductor's chair for the first time.",
        cognitive: "The model: taste is data. Delegate everything except taste.",
        identity: "I am someone who conducts, not performs.",
      },
      artifact: "A conductor's chair with the manifesto posted above.",
    },
    MAGIC: {
      intent: "See orchestration as composition, not automation.",
      promptQuestion: "What ensemble arrangement did you not know was possible?",
      exercises: [
        ex("Role Casting", "Assign specific roles to specific agents.", "Cast 4 agents: voice, verifier, scribe, skeptic. One-sentence job description each.", 20, "Agent config sheet.", "Debate the skeptic's brief hardest. That's where quality lives."),
        ex("Score Reading", "Read a completed multi-agent run like a score.", "Take a past transcript. Color-code each turn by which role should have spoken.", 25, "Transcript, 4 colors.", "Ask: 'Which role was silent when it should have played?'"),
        ex("Cadenza", "Let one agent solo on purpose.", "Run one 15-min segment where only the skeptic speaks.", 15, "AI orchestrator.", "Notice what the ensemble learns when one voice is centered."),
      ],
      journeys: {
        narrative: "The story: I heard my ensemble as music, not automation.",
        cognitive: "The model: 4 roles. Each with a brief. Each with a right to silence.",
        identity: "I am someone who composes with agents.",
      },
      artifact: "A cast-list of your ensemble. A color-coded transcript.",
    },
    CALM: {
      intent: "Introduce orchestration ontology — the score itself.",
      promptQuestion: "What is the shape of the piece you're conducting?",
      exercises: [
        ex("The Score", "Draw your workflow as a musical score.", "Bars = phases. Staves = roles. Notes = handoffs. Draw one project.", 40, "Large paper, ruler.", "Ask: 'Where does the score have rests? Should it?'"),
        ex("Handoff Protocol", "Formalize inter-agent handoffs.", "Write 3 handoff templates: voice→verifier, scribe→skeptic, skeptic→voice.", 25, "Templates.", "Test one live. Ask: 'What broke? What held?'"),
        ex("Governance Line", "Draw the line the ensemble cannot cross.", "List 5 decisions only the conductor can make. Publish to the ensemble config.", 15, "Config file.", "Ask: 'Which of these could you delegate in 6 months?'"),
      ],
      journeys: {
        narrative: "The story: I saw the score of my own workflow.",
        cognitive: "The model: bars/staves/notes/rests. Handoffs are the melody.",
        identity: "I am someone who reads and writes scores.",
      },
      artifact: "A hand-drawn score. A governance-line document.",
    },
    OPEN: {
      intent: "Discover where the ensemble surprises you — good and bad.",
      promptQuestion: "What emerged that no single agent — and no single you — could have made alone?",
      exercises: [
        ex("Surprise Log", "Track ensemble emergent behavior.", "For one week, log every output that surprised you (good or bad). One line each.", 60, "Log template.", "In group: cluster the surprises. Ask: 'Which want to become features?'"),
        ex("The Silent Skeptic", "Rest the skeptic and see what fails.", "Run 3 days with the skeptic silenced. Track quality shift.", 180, "Config toggle.", "Debrief: 'What did the skeptic protect that you didn't notice?'"),
        ex("Ensemble Retrospective", "Let the ensemble evaluate itself.", "Ask each role to write a 3-line self-assessment. Read them aloud.", 20, "AI orchestrator.", "Ask: 'Which self-assessment did you disagree with?'"),
      ],
      journeys: {
        narrative: "The story: the week I turned off the skeptic and watched quality drift.",
        cognitive: "The model: emergence is measurable. Silence is a diagnostic.",
        identity: "I am someone who studies my ensemble like a live system.",
      },
      artifact: "A surprise log. A retrospective document per role.",
    },
    FREE: {
      intent: "Ship one thing the ensemble ran end-to-end. Under your baton.",
      promptQuestion: "What did the ensemble ship this month that you only conducted?",
      exercises: [
        ex("The Baton Test", "Run one full project by conducting only.", "Pick one small deliverable. You may only prompt, tune roles, and approve. No drafting.", 240, "Full ensemble config.", "Publish the deliverable with a byline: 'Conducted by ___. Performed by ensemble.'"),
        ex("Cost of Conducting", "Measure what conducting actually took.", "Log your minutes: prompting, tuning, approving. Nothing else.", 30, "Time-tracking log.", "Ask: 'Did the ensemble save time — or shift what your time was worth?'"),
        ex("Second-Chair Handoff", "Prepare someone else to conduct.", "Write a 1-page onboarding for the next conductor of your ensemble.", 30, "Template.", "Have them run one segment under your baton.", ),
      ],
      journeys: {
        narrative: "The story: the week I published something I only conducted.",
        cognitive: "The model: conducting is a measurable role. It has minutes and outputs.",
        identity: "I am someone who can hand my baton to someone else.",
      },
      artifact: "A conducted-only deliverable. A second-chair onboarding doc.",
    },
  },
  roadmap: [
    { label: "Week 1 — Chair", when: "Live · 8h + async · 4h", focus: "LOVE", outcome: "Manifesto and chair claimed." },
    { label: "Week 2 — Cast", when: "Live · 6h + async · 6h", focus: "MAGIC", outcome: "4-role cast list published." },
    { label: "Week 3 — Score", when: "Live · 8h + async · 6h", focus: "CALM", outcome: "Hand-drawn score of one workflow." },
    { label: "Week 4 — Surprise", when: "Live · 4h + async · 10h", focus: "OPEN", outcome: "One-week surprise log." },
    { label: "Week 5 — Baton", when: "Live · 4h + async · 8h", focus: "FREE", outcome: "Conducted-only deliverable shipped." },
    { label: "Week 6 — Handoff", when: "Async · 6h", focus: "FREE", outcome: "Second-chair onboarding doc." },
  ],
  commitmentContract: {
    prompt: "What will your ensemble ship this month that you will only conduct?",
    template: "This month my ensemble will ship __________. I will only __________ (prompt / tune / approve). The second chair I am preparing is __________.",
    witness: "The person named as your second chair.",
  },
};

/* ================================================================== */
/* FORESIGHT — RETREATS                                                */
/* ================================================================== */

const FOREST: RehearsalOffering = {
  id: "retreat-forest",
  slug: "think-like-a-forest",
  tier: "foresight",
  title: "Think Like a Forest",
  tagline: "A 3-day forest retreat that teaches leadership teams to sense in canopies, roots and mycelium instead of orgcharts.",
  duration: "3 days on land",
  narrativePremise: "You walked into a forest expecting a metaphor and left with a decision system.",
  cognitiveModel: "Forest ontology: canopy (vision), trunk (structure), roots (values), mycelium (relational intelligence).",
  identityShift: "From org-chart holder to canopy-reader.",
  states: {
    LOVE: {
      intent: "Slow the body enough for slower thoughts to arrive.",
      promptQuestion: "What did you already know before you walked in?",
      exercises: [
        ex("The Long Arrival", "Land through the body.", "Walk 40 minutes in silence to the site. No phones.", 40, "A path.", "Circle-check: 'What did the walk do to your first sentence?'"),
        ex("Root Introduction", "Introduce yourself through what holds you.", "One-line intro: 'What holds me is ___.' No job titles.", 20, "Circle.", "Notice what is not said."),
        ex("The Fire Question", "Ask the question you brought.", "Speak the one question you carried into the forest. Then place a stick on the fire.", 25, "Fire, sticks.", "No responses. The question stays."),
      ],
      journeys: {
        narrative: "The story: the day I walked in and no one asked my title.",
        cognitive: "The model: arrival takes time. Speed is a lens.",
        identity: "I am someone who arrives slowly.",
      },
      artifact: "A fire of unanswered questions.",
    },
    MAGIC: {
      intent: "Break the org-chart lens with a living-system lens.",
      promptQuestion: "What if your team is a canopy, not a hierarchy?",
      exercises: [
        ex("Canopy Mapping", "Look up. Really look up.", "Spend 30 min in one spot studying the canopy above. Sketch what you see.", 30, "Sketchbook.", "Ask: 'What role does your team play in your org's canopy?'"),
        ex("Mycelium Walk", "Follow the invisible connections.", "Walk with a guide who points out the mycelial network of one hectare.", 60, "Guide.", "Ask: 'Where are the mycelial channels in your org?'"),
        ex("Deadwood Inventory", "Honor what's decaying productively.", "Find deadwood in the forest. List what it feeds.", 30, "Notebook.", "Ask: 'What in your org is decaying productively?'"),
      ],
      journeys: {
        narrative: "The story: the day I saw my team as a canopy.",
        cognitive: "The model: canopy / trunk / roots / mycelium / deadwood.",
        identity: "I am someone who reads living systems.",
      },
      artifact: "A canopy sketch, a mycelium map, a deadwood inventory.",
    },
    CALM: {
      intent: "Turn the forest lens into an org-legible framework.",
      promptQuestion: "What is the shape of your organizational forest?",
      exercises: [
        ex("The Forest Blueprint", "Draw your org as a forest.", "Draw: canopy (vision), trunks (functions), roots (values), mycelium (relational intelligence), deadwood (legacy).", 60, "Large paper.", "Present to the group. Take questions."),
        ex("Season Overlay", "Assign a forest season to each initiative.", "Every current initiative gets a season: seed / growth / flower / harvest / decay.", 30, "Initiative list.", "Ask: 'Are we planting when we should be harvesting?'"),
        ex("Keystone Species", "Identify who cannot leave without collapse.", "Name 3 keystone people. Name 3 keystone practices.", 20, "Notebook.", "Ask: 'How do we protect the keystones without freezing the forest?'"),
      ],
      journeys: {
        narrative: "The story: the day my org became a forest on paper.",
        cognitive: "The model: canopy/trunk/roots/mycelium/deadwood × seasons × keystones.",
        identity: "I am someone who can draw my org as a living system.",
      },
      artifact: "A forest blueprint of the organization.",
    },
    OPEN: {
      intent: "Sit still long enough for the forest to speak back.",
      promptQuestion: "What has the forest been telling you that you weren't hearing?",
      exercises: [
        ex("Sit Spot", "One hour, one place, no output.", "Choose a spot. Sit for 60 min. Do not journal until the hour is up.", 60, "A cushion.", "Only after: write one paragraph."),
        ex("Council of Trees", "Let others speak as parts of the forest.", "In circle, each person speaks as a tree, root, animal, or stream about the org.", 45, "Circle.", "Notice which voice keeps returning."),
        ex("Weather Read", "Track the emotional weather of the group.", "Hourly: one word for the group's weather. Post to a shared board.", 240, "Board.", "End of day: read the weather pattern."),
      ],
      journeys: {
        narrative: "The story: the hour I sat and the forest changed my mind.",
        cognitive: "The model: sensing is a discipline, not a mood.",
        identity: "I am someone who lets the system speak first.",
      },
      artifact: "A day of weather reads. A council transcript.",
    },
    FREE: {
      intent: "Return with one decision the forest helped shape.",
      promptQuestion: "What decision are you carrying back down the mountain?",
      exercises: [
        ex("The Descent Letter", "Write yourself a letter to open Monday.", "Handwritten letter to open at 9am Monday. Seal it.", 30, "Paper, envelope.", "Trust the forest self more than the Monday self."),
        ex("Keystone Commitment", "Commit to protecting one keystone.", "Name the keystone and the protection. State it in circle.", 15, "Circle.", "Witness assigned by the group."),
        ex("Seed Package", "Take one physical seed home.", "Take one physical seed. Plant it within 7 days. Photo when it sprouts.", 5, "Seed packet.", "The sprout is your first status report."),
      ],
      journeys: {
        narrative: "The story: I came home with a letter I hadn't yet read.",
        cognitive: "The model: descent needs ritual. Seeds are metrics too.",
        identity: "I am someone who honors what the forest told me.",
      },
      artifact: "A sealed letter. A planted seed. A named keystone commitment.",
    },
  },
  roadmap: [
    { label: "Day 1 — Arrival", when: "6h", focus: "LOVE", outcome: "Fire of questions lit." },
    { label: "Day 1 evening — Reframe", when: "3h", focus: "MAGIC", outcome: "Canopy sketch begun." },
    { label: "Day 2 morning — Framework", when: "4h", focus: "CALM", outcome: "Forest blueprint drawn." },
    { label: "Day 2 afternoon — Sensing", when: "5h", focus: "OPEN", outcome: "Sit spot + council held." },
    { label: "Day 3 — Descent", when: "5h", focus: "FREE", outcome: "Descent letter sealed. Seed taken." },
  ],
  commitmentContract: {
    prompt: "Which keystone will you protect between now and the next equinox?",
    template: "Between now and __________ I will protect the keystone of __________ by __________. My witness in the circle is __________.",
    witness: "One person from the retreat circle.",
  },
};

const STORIES: RehearsalOffering = {
  id: "retreat-stories",
  slug: "stories-of-a-near-future",
  tier: "foresight",
  title: "Stories of a Near Future",
  tagline: "A 4-day writing retreat where leadership teams draft the 2030 they would rather have — and stress-test it against evidence.",
  duration: "4 days",
  narrativePremise: "You stopped forecasting and started writing. The 2030 you wrote is now a document your team can argue with.",
  cognitiveModel: "Preferable-futures ontology: writing → evidence → back-cast → decision. Fiction as due diligence.",
  identityShift: "From strategist to storyteller-with-receipts.",
  states: {
    LOVE: {
      intent: "Establish the emotional stakes of the future being written.",
      promptQuestion: "Whose 2030 are you writing? Whose are you not?",
      exercises: [
        ex("The Beneficiary List", "Name who benefits and who doesn't.", "List 10 beneficiaries of your imagined 2030. Then 10 non-beneficiaries.", 20, "Notebook.", "Ask: 'Which list did you write faster?'"),
        ex("First-Person Dispatch", "Write as someone living in 2030.", "First-person 1-page dispatch from 2030, as a stakeholder — not you.", 45, "Blank page.", "Read aloud. Only listen."),
        ex("The Cost Question", "Name what this future costs.", "Every good future costs something. Write one paragraph: 'This future cost us ___'.", 15, "Card.", "Debate as a group: 'Is that cost bearable?'"),
      ],
      journeys: {
        narrative: "The story: I wrote 2030 as someone other than myself.",
        cognitive: "The model: futures have beneficiaries. Beneficiaries have opposites.",
        identity: "I am someone who writes futures with receipts.",
      },
      artifact: "A pile of dispatches from 2030.",
    },
    MAGIC: {
      intent: "Break linear extrapolation with a discontinuity exercise.",
      promptQuestion: "What breaks between now and 2030 that you're not modelling?",
      exercises: [
        ex("Discontinuity Cards", "Force a break in the timeline.", "Draw a random discontinuity card. Rewrite your dispatch integrating it.", 30, "Prepared card deck.", "Ask: 'Which cards did the group refuse to draw twice?'"),
        ex("The Weird Signal", "Bring evidence of the discontinuity happening now.", "Each person shares one weak signal from the last 6 months.", 30, "Signal notes.", "Cluster signals. Vote on which are most under-priced."),
        ex("Time Slice", "Rewrite the dispatch from a different year.", "Rewrite the same scene as 2027, then 2033. Compare.", 45, "Blank pages.", "Ask: 'Which version scared you more?'"),
      ],
      journeys: {
        narrative: "The story: the card that forced my future to break.",
        cognitive: "The model: discontinuities compound. Linear futures are the fantasy.",
        identity: "I am someone who plans for weird.",
      },
      artifact: "A wall of discontinuity cards and cluster of weak signals.",
    },
    CALM: {
      intent: "Introduce back-casting as the framework linking story to decision.",
      promptQuestion: "What would have to be true in 2027 for your 2030 to be true?",
      exercises: [
        ex("The Back-Cast", "Fill the middle.", "Given your 2030 dispatch, list the 5 milestones of 2028, 2027, 2026.", 40, "Timeline sheet.", "Ask: 'Which milestone is missing from your current roadmap?'"),
        ex("Evidence Column", "Every milestone needs a source.", "Add one column: what evidence today makes each milestone plausible?", 30, "Sheet.", "Circle the milestones with no evidence. Those are your bets."),
        ex("The Cost Column", "What must you sacrifice at each milestone?", "Add one column: what must be stopped or shrunk?", 20, "Sheet.", "Ask: 'Are you willing?'"),
      ],
      journeys: {
        narrative: "The story: the day I saw 2026 in my 2030.",
        cognitive: "The model: back-cast = milestones × evidence × cost.",
        identity: "I am someone who back-casts before they forecast.",
      },
      artifact: "A back-cast sheet per team.",
    },
    OPEN: {
      intent: "Peer critique. Fiction as due diligence.",
      promptQuestion: "What holes did other people find in your future?",
      exercises: [
        ex("Story Court", "Present a dispatch. Get cross-examined.", "One team presents. Two teams cross-examine. One team defends.", 60, "Court setup.", "Change roles every 30 min."),
        ex("The Skeptic's Read", "Read one dispatch as a skeptical journalist.", "Write a 1-paragraph skeptical review of another team's dispatch.", 20, "Card.", "Give it to the author. Silent read."),
        ex("Insurance Question", "What would you insure this future against?", "List 5 risks and the price of insuring against each.", 25, "Notebook.", "Ask: 'Which insurance can't you afford to skip?'"),
      ],
      journeys: {
        narrative: "The story: the story that survived the court.",
        cognitive: "The model: peer critique is a due-diligence protocol.",
        identity: "I am someone who submits my future for cross-examination.",
      },
      artifact: "A court transcript. A skeptical-review binder.",
    },
    FREE: {
      intent: "Turn the surviving story into a decision.",
      promptQuestion: "What one decision does this story now require?",
      exercises: [
        ex("The Story-to-Decision Bridge", "Compress story into a decision.", "Write: 'If our 2030 is true, then before ___ we must decide ___.'", 30, "Card.", "Read aloud. Notice repetition."),
        ex("Bet Sizing", "Size the bet against the evidence.", "For each decision: what's the smallest bet that would test it?", 25, "Bet card.", "Publish the bet sizes."),
        ex("Story Handoff", "Give your story to someone outside the room.", "Name one person who needs this story before the quarter ends.", 10, "Handoff card.", "Schedule the handoff before leaving."),
      ],
      journeys: {
        narrative: "The story: I brought a story home that made one decision obvious.",
        cognitive: "The model: story → decision → smallest test → handoff.",
        identity: "I am someone whose stories become decisions.",
      },
      artifact: "A decision card. A bet-sizing sheet. A handoff appointment.",
    },
  },
  roadmap: [
    { label: "Day 1 — Stakes", when: "6h", focus: "LOVE", outcome: "First dispatches read." },
    { label: "Day 2 — Break", when: "6h", focus: "MAGIC", outcome: "Discontinuity integrated." },
    { label: "Day 3 morning — Back-cast", when: "4h", focus: "CALM", outcome: "Milestones + evidence + cost." },
    { label: "Day 3 afternoon — Court", when: "4h", focus: "OPEN", outcome: "Story survives court." },
    { label: "Day 4 — Decide", when: "5h", focus: "FREE", outcome: "Decision cards + handoffs." },
  ],
  commitmentContract: {
    prompt: "What is the one decision your near-future story now requires?",
    template: "If our 2030 is __________, then before __________ we must decide __________. The smallest bet that tests this is __________. The person who needs this story is __________.",
    witness: "The person you named for handoff.",
  },
};

const RIS: RehearsalOffering = {
  id: "retreat-ris",
  slug: "relational-intelligence-summit",
  tier: "foresight",
  title: "Relational Intelligence Summit",
  tagline: "A 2-day summit where senior teams practice the muscle their org uses least — reading and repairing the relational field.",
  duration: "2 days",
  narrativePremise: "You realized the org's real bottleneck was relational, not technical.",
  cognitiveModel: "Relational intelligence: field-reading, rupture-and-repair, brave dissent, boundary as clarity.",
  identityShift: "From performance manager to field reader.",
  states: {
    LOVE: {
      intent: "Establish felt safety before any hard truth is spoken.",
      promptQuestion: "What would need to be true for you to speak the truth here?",
      exercises: [
        ex("Safety Signals", "Name what safety looks and sounds like.", "Each person: 3 signals of safety and 3 signals of danger in a room.", 15, "Cards.", "Post on the wall as a shared field guide."),
        ex("Speed of Trust Line", "Physically map trust.", "Line: 'trust is fast here' to 'trust is slow here'. Move. Speak.", 15, "Tape line.", "Ask: 'What would move you two steps up?'"),
        ex("Repair Story", "Share one repair you're proud of.", "Tell a 3-min story of a repair — personal or professional.", 30, "Pairs.", "Notice which repairs the room already knows how to do."),
      ],
      journeys: {
        narrative: "The story: the day I named what safety costs.",
        cognitive: "The model: safety = signal literacy + repair history.",
        identity: "I am someone who names safety before I demand truth.",
      },
      artifact: "A wall of safety signals. A shared repair story.",
    },
    MAGIC: {
      intent: "Show that the field is legible — and you're already reading it.",
      promptQuestion: "What did you already know that no one had named?",
      exercises: [
        ex("Field Read", "Practice narrating the room out loud.", "One volunteer narrates the room's felt sense for 3 min. Others correct.", 20, "Timer.", "Rotate. Notice the corrections."),
        ex("The Unspoken", "Name the thing everyone knows and no one says.", "In pairs: 'What does everyone in your team know but no one names?'", 20, "Pairs.", "Group harvest — only volunteered items."),
        ex("Micro-Rupture Study", "Rewind a small rupture in slow motion.", "Recall a 5-minute rupture. Map: trigger → escalation → recovery.", 30, "Timeline sheet.", "Ask: 'Where could repair have happened one step earlier?'"),
      ],
      journeys: {
        narrative: "The story: the day I said what I always knew.",
        cognitive: "The model: fields are readable. Reading is a practice.",
        identity: "I am someone who reads before I react.",
      },
      artifact: "A field-read transcript. A rupture-in-slow-motion map.",
    },
    CALM: {
      intent: "Introduce the relational intelligence framework.",
      promptQuestion: "What are the moves in the relational playbook?",
      exercises: [
        ex("The Four Moves", "Teach: name, own, ask, offer.", "Practice each move in scripted pairs.", 45, "Script sheet.", "Debrief: 'Which move is hardest for you?'"),
        ex("Boundary as Clarity", "Distinguish boundaries from walls.", "Rewrite 3 org rules as boundaries (offers), not walls (restrictions).", 30, "Rule list.", "Ask: 'Which felt easier to say aloud?'"),
        ex("The Brave Dissent Protocol", "Teach the protocol.", "Practice dissenting inside the protocol on a low-stakes topic.", 30, "Protocol card.", "Debrief cadence, not content."),
      ],
      journeys: {
        narrative: "The story: I learned the four moves.",
        cognitive: "The model: name, own, ask, offer. Boundaries = offers.",
        identity: "I am someone who uses the four moves in real meetings.",
      },
      artifact: "A four-moves cheat card. A rewritten rule set.",
    },
    OPEN: {
      intent: "Practice on a real, unresolved organizational tension.",
      promptQuestion: "Which real tension are you willing to bring into this room?",
      exercises: [
        ex("Tension Bring-Along", "Bring a live tension.", "Volunteer one team brings a real tension. Others hold field.", 45, "Circle.", "Reflect only. Do not solve."),
        ex("Amplification Round", "Amplify what wasn't heard.", "Each observer amplifies one thing they heard but wasn't received.", 20, "Circle.", "Ask the bringing team: 'What changed by hearing this?'"),
        ex("The Repair Rehearsal", "Rehearse the repair conversation you owe.", "In pairs: rehearse the actual conversation you've been avoiding.", 30, "Pairs.", "Ask: 'What made it easier to say here?'"),
      ],
      journeys: {
        narrative: "The story: the tension I said out loud without dying.",
        cognitive: "The model: bringing + amplification + rehearsal = actionable repair.",
        identity: "I am someone who brings tensions into rooms.",
      },
      artifact: "A rehearsed repair script per participant.",
    },
    FREE: {
      intent: "Commit to one real repair on the calendar.",
      promptQuestion: "Which repair will happen on your calendar this week?",
      exercises: [
        ex("The Repair Appointment", "Put it on the calendar in the room.", "Send the calendar invite before you leave the room.", 10, "Phone.", "Show the invite to your witness."),
        ex("The After-Card", "Design what you'll do after.", "Write 3 lines: opening, hardest sentence, what you'll offer.", 15, "Card.", "Read to your witness. Adjust the hardest sentence."),
        ex("Community Practice Pact", "Meet the group again in 30 days.", "Set a 30-min group check-in date now.", 5, "Calendar.", "Assign a host."),
      ],
      journeys: {
        narrative: "The story: I put the repair on the calendar in the room.",
        cognitive: "The model: commitment = invite + script + follow-up.",
        identity: "I am someone who schedules the repair I owe.",
      },
      artifact: "A calendar invite. An after-card. A 30-day check-in date.",
    },
  },
  roadmap: [
    { label: "Day 1 morning — Safety", when: "4h", focus: "LOVE", outcome: "Safety signals posted." },
    { label: "Day 1 afternoon — Field", when: "4h", focus: "MAGIC", outcome: "Field-read practiced." },
    { label: "Day 2 morning — Moves", when: "4h", focus: "CALM", outcome: "Four moves rehearsed." },
    { label: "Day 2 afternoon — Real", when: "3h", focus: "OPEN", outcome: "One real tension worked." },
    { label: "Day 2 closing — Commit", when: "1h", focus: "FREE", outcome: "Repair appointment scheduled." },
  ],
  commitmentContract: {
    prompt: "Which repair will you schedule on your calendar before leaving this room?",
    template: "This week I will have the repair conversation with __________ on __________. My opening line is __________. My witness is __________.",
    witness: "One peer from the summit circle.",
  },
};

/* ================================================================== */
/* FORECAST — RESIDENCIES                                              */
/* ================================================================== */

const DIAGNOSTIC: RehearsalOffering = {
  id: "residency-diagnostic",
  slug: "diagnostic-sprint",
  tier: "forecast",
  title: "GL!TCH — Diagnostic Sprint",
  tagline: "A 3-week embedded residency to diagnose where the real bottleneck lives before anyone writes code.",
  duration: "3 weeks embedded",
  narrativePremise: "You stopped building the wrong thing. The three weeks of diagnosis saved six months of shipping.",
  cognitiveModel: "Diagnosis > prototype > production. Every symptom is mapped to a root before any solution is drawn.",
  identityShift: "From feature-shipper to root-cause diagnostician.",
  states: {
    LOVE: {
      intent: "Establish shared understanding of what the org is protecting.",
      promptQuestion: "What is this org afraid the diagnosis will find?",
      exercises: [
        ex("Stakeholder Fears", "Interview 5 stakeholders for their fear.", "One 30-min interview each. Only question: 'What are you afraid we'll find?'", 150, "Interview kit.", "Cluster fears. Publish the fear map."),
        ex("The No-Blame Contract", "Set the diagnostic frame.", "Draft and co-sign a 1-page no-blame diagnostic contract.", 45, "Template.", "Read aloud in the kickoff. Post to Slack."),
        ex("Success Definition", "Define success for the sprint.", "Facilitated session: 'A successful diagnosis is one that ___.'", 60, "Whiteboard.", "Convert to 5 measurable success criteria."),
      ],
      journeys: {
        narrative: "The story: the org signed a no-blame contract before we started looking.",
        cognitive: "The model: diagnosis before treatment. Fears before findings.",
        identity: "I am someone who names fear before I fix.",
      },
      artifact: "A signed no-blame contract. A fear map. Success criteria.",
    },
    MAGIC: {
      intent: "Show that symptoms are almost never the problem.",
      promptQuestion: "Which symptom has been hiding the actual problem?",
      exercises: [
        ex("Symptom Wall", "Post every complaint as a symptom.", "One week of Slack, tickets, meeting notes. Every complaint → sticky note.", 240, "Wall.", "Cluster. Ask: 'Which cluster surprises you?'"),
        ex("Root Trace", "Trace 3 symptoms to root.", "Pick 3 symptoms. Ask 'why' 5 times each.", 90, "Trace sheet.", "Present to leadership. Note their reaction."),
        ex("The False-Problem List", "Name the problems that aren't problems.", "List 3 things everyone treats as problems that aren't.", 30, "Card.", "Circulate to leadership. Ask for pushback."),
      ],
      journeys: {
        narrative: "The story: the day we named the symptom that was hiding the problem.",
        cognitive: "The model: symptoms cluster. Roots reveal.",
        identity: "I am someone who resists solving the wrong problem.",
      },
      artifact: "A clustered symptom wall. A root-trace document. A false-problem list.",
    },
    CALM: {
      intent: "Introduce the diagnostic framework: 5-season × 5-state grid.",
      promptQuestion: "In which season and which state does this org break?",
      exercises: [
        ex("The Grid Score", "Score the org on the 25-cell grid.", "For each cell: 1-5 score with 1-line evidence.", 180, "Grid template.", "Present to leadership as diagnostic."),
        ex("Missing Cell Interview", "Interview the cell with lowest score.", "Book 3 more interviews around that cell.", 240, "Interview kit.", "Ask: 'What does this cell need to become a 3?'"),
        ex("The Diagnostic Report", "Write a 5-page diagnostic.", "One page per season. State score per cell. Root cause per season.", 480, "Report template.", "Circulate. Get one leader signature per season."),
      ],
      journeys: {
        narrative: "The story: the day the whole org fit on one grid.",
        cognitive: "The model: 5 seasons × 5 states = 25 diagnostic cells.",
        identity: "I am someone who diagnoses on a grid.",
      },
      artifact: "A scored grid. A 5-page diagnostic report.",
    },
    OPEN: {
      intent: "Present findings and let the org argue with them.",
      promptQuestion: "What did we get wrong in our diagnosis?",
      exercises: [
        ex("The Findings Read-Out", "Live present findings to leadership.", "90-min read-out. 30 min findings, 60 min pushback.", 90, "Presentation.", "Log every pushback verbatim."),
        ex("Pushback Integration", "Rewrite the diagnostic based on pushback.", "Integrate top 5 pushbacks. Publish v2.", 240, "v2 doc.", "Ask: 'Which pushback changed the diagnosis?'"),
        ex("The Public Wall", "Post the diagnostic where anyone can see.", "Print. Post in the largest common space.", 60, "Print + tape.", "Note who stops to read. Talk to them."),
      ],
      journeys: {
        narrative: "The story: the day leadership pushed back and we listened.",
        cognitive: "The model: diagnosis is a draft. Pushback is signal.",
        identity: "I am someone who publishes a diagnostic in public.",
      },
      artifact: "A pushback log. A v2 diagnostic. A public-wall photo.",
    },
    FREE: {
      intent: "Recommend one — and only one — thing.",
      promptQuestion: "What is the smallest thing that would unblock everything else?",
      exercises: [
        ex("The One Recommendation", "One page. One recommendation.", "One page: recommendation, rationale, cost, undo condition.", 90, "One-pager.", "Present to leadership. No slides."),
        ex("The Bet Contract", "Formalize the bet.", "Sign a 1-page bet: recommendation → success metric → 90-day check.", 45, "Bet template.", "Post the bet to the team."),
        ex("Handoff to Prototype", "Prepare the prototype residency brief.", "Draft the 1-page brief for the next residency.", 90, "Brief template.", "Handoff meeting with the next team."),
      ],
      journeys: {
        narrative: "The story: we shipped one page that saved six months.",
        cognitive: "The model: one recommendation. One bet. One handoff.",
        identity: "I am someone who ships one page, not fifty.",
      },
      artifact: "A one-page recommendation. A signed bet. A prototype brief.",
    },
  },
  roadmap: [
    { label: "Week 1 — Landing", when: "40h", focus: "LOVE", outcome: "No-blame contract signed." },
    { label: "Week 1-2 — Symptom map", when: "30h", focus: "MAGIC", outcome: "Symptom wall + roots." },
    { label: "Week 2 — Grid score", when: "20h", focus: "CALM", outcome: "5-page diagnostic v1." },
    { label: "Week 3 — Read-out", when: "20h", focus: "OPEN", outcome: "Public v2 diagnostic." },
    { label: "Week 3 — Bet", when: "10h", focus: "FREE", outcome: "One-page bet signed." },
  ],
  commitmentContract: {
    prompt: "What one thing will this org bet on based on this diagnostic?",
    template: "Based on this diagnostic, __________ will bet on __________ by __________. The success metric is __________. The undo condition is __________.",
    witness: "One member of the executive team.",
  },
};

const PROTOTYPE: RehearsalOffering = {
  id: "residency-prototype",
  slug: "prototype-residency",
  tier: "forecast",
  title: "Drift — Prototype Residency",
  tagline: "An 8-week embedded residency to build the working prototype that proves — or breaks — the diagnostic bet.",
  duration: "8 weeks embedded",
  narrativePremise: "You stopped debating the roadmap. The prototype settled the argument in six weeks.",
  cognitiveModel: "Prototypes Garden: structured foresight scenarios wired to real data, real users, real ROI.",
  identityShift: "From meeting-holder to prototype-holder.",
  states: {
    LOVE: {
      intent: "Anchor the residency on the diagnostic bet's why.",
      promptQuestion: "Why did this org bet on this?",
      exercises: [
        ex("Bet Recital", "Read the bet aloud.", "Kickoff opens by reading the diagnostic bet verbatim.", 15, "Bet doc.", "No commentary. Just witnessed."),
        ex("User Story from the Bet", "One user story per beneficiary.", "Draft one user story per beneficiary of the bet.", 90, "Story template.", "Post to the residency room wall."),
        ex("The Fear Refresh", "Re-run stakeholder fears.", "Ask 5 stakeholders: 'What are you afraid the prototype will show?'", 150, "Interview kit.", "Compare to diagnostic fear map."),
      ],
      journeys: {
        narrative: "The story: we opened by reading the bet aloud.",
        cognitive: "The model: the bet is the north star, not the backlog.",
        identity: "I am someone who reads the why before the how.",
      },
      artifact: "A wall of user stories. Refreshed fear map.",
    },
    MAGIC: {
      intent: "Break the default 'MVP' lens with 'evidence prototype'.",
      promptQuestion: "What is the smallest thing that would count as evidence?",
      exercises: [
        ex("Evidence Sketch", "Sketch the evidence before the product.", "Draw what a proof-image would look like. What screen? What chart? What quote?", 60, "Sketchbook.", "Ask: 'What's the smallest thing that would move the room?'"),
        ex("The Fake-Screen Test", "Test with a fake screenshot.", "Show one hand-drawn screen to 5 real users. Log reactions.", 240, "Sketches, 5 users.", "Ask: 'Did the sketch move them more than a real product would have?'"),
        ex("Wizard-of-Oz Round", "Fake the backend with a human.", "Run one full user interaction with a human in the loop.", 180, "One human, one form.", "Log every question the human couldn't answer."),
      ],
      journeys: {
        narrative: "The story: the sketch that moved the room before we built anything.",
        cognitive: "The model: evidence > MVP. Fake first, code second.",
        identity: "I am someone who ships evidence before product.",
      },
      artifact: "A sketchbook of evidence. Fake-screen test logs.",
    },
    CALM: {
      intent: "Introduce the Prototypes Garden framework.",
      promptQuestion: "Which garden bed does this prototype belong in?",
      exercises: [
        ex("Garden Bed Assignment", "Assign to a bed.", "Pick: signal-testing, workflow, ontology, business-model, ecosystem. Justify.", 60, "Framework poster.", "Ask: 'Which bed did we default to? Was it right?'"),
        ex("Bed-Specific Success Criteria", "Each bed has its own metrics.", "Write the 3 success criteria specific to this bed.", 45, "Template.", "Circulate. Signal criteria differ from workflow criteria."),
        ex("Cross-Bed Risk", "Name the risk of being in this bed.", "Every bed has a failure mode. Name yours.", 30, "Risk card.", "Post next to the prototype wall."),
      ],
      journeys: {
        narrative: "The story: we chose one bed. On purpose.",
        cognitive: "The model: 5 garden beds. Each with its own metrics.",
        identity: "I am someone who plants prototypes in named beds.",
      },
      artifact: "A bed assignment. Bed-specific criteria. Risk card.",
    },
    OPEN: {
      intent: "Build, test, learn — publicly.",
      promptQuestion: "What is the prototype telling us that we didn't expect?",
      exercises: [
        ex("The Weekly Demo", "One 45-min demo every week. Public.", "Anyone in the org can attend. Log surprises.", 45, "Recurring meeting.", "Post the demo recording each week."),
        ex("Failure Log", "Publish every failure.", "Weekly note: what didn't work and why. Public channel.", 60, "Slack channel.", "Ask: 'Which failure taught the most?'"),
        ex("The Skeptic's Session", "Invite the loudest skeptic.", "Book a 60-min session with the person most likely to reject the prototype.", 60, "Skeptic.", "Log every objection. Address 3 next week."),
      ],
      journeys: {
        narrative: "The story: the week we published every failure.",
        cognitive: "The model: public build > private polish.",
        identity: "I am someone who demos in public and logs failure.",
      },
      artifact: "8 weekly demo recordings. A failure log. Skeptic session notes.",
    },
    FREE: {
      intent: "Decide: kill, extend, or productionize.",
      promptQuestion: "Did the prototype prove or break the bet?",
      exercises: [
        ex("The Verdict Meeting", "One meeting. One verdict.", "90-min meeting. Verdict: kill / extend / productionize. In writing.", 90, "Verdict template.", "Read the verdict to the team same day."),
        ex("Post-Mortem or Pre-Mortem", "Write one, no matter the verdict.", "Kill → post-mortem. Productionize → pre-mortem for launch.", 180, "Templates.", "Both circulated to the org."),
        ex("The Handoff Package", "Everything needed for the next team.", "Bundle: prototype, evidence, verdict, post/pre-mortem, next-30-days plan.", 240, "Handoff doc.", "Deliver to next team. Sign off."),
      ],
      journeys: {
        narrative: "The story: we shipped a verdict, not a demo.",
        cognitive: "The model: kill / extend / productionize. All are shipping.",
        identity: "I am someone who ships verdicts.",
      },
      artifact: "A written verdict. A post- or pre-mortem. A handoff package.",
    },
  },
  roadmap: [
    { label: "Week 1 — Bet recital", when: "40h", focus: "LOVE", outcome: "User stories wall built." },
    { label: "Week 2 — Fake first", when: "40h", focus: "MAGIC", outcome: "Fake-screen tests logged." },
    { label: "Week 3 — Bed choice", when: "40h", focus: "CALM", outcome: "Bed + criteria + risk posted." },
    { label: "Weeks 4-7 — Public build", when: "160h", focus: "OPEN", outcome: "4 weekly demos + failure log." },
    { label: "Week 8 — Verdict", when: "40h", focus: "FREE", outcome: "Verdict + handoff package." },
  ],
  commitmentContract: {
    prompt: "What is the verdict on the diagnostic bet?",
    template: "The prototype verdict is __________. The evidence is __________. The next 30 days will __________. The receiving team is __________.",
    witness: "The executive sponsor of the bet.",
  },
};

const ECOSYSTEM: RehearsalOffering = {
  id: "residency-ecosystem",
  slug: "ecosystem-build",
  tier: "forecast",
  title: "Tune — Ecosystem Build",
  tagline: "A 12-week embedded residency to move from a validated prototype to an orchestrated ecosystem the org can run without us.",
  duration: "12 weeks embedded",
  narrativePremise: "You stopped needing us. The ecosystem now runs on your team's baton.",
  cognitiveModel: "Ecosystem = product + governance + rituals + second-chair. Every piece has an owner and a retirement date.",
  identityShift: "From project team to system stewards.",
  states: {
    LOVE: {
      intent: "Anchor on the humans who will run the ecosystem after us.",
      promptQuestion: "Who is the person who will own this in 12 weeks?",
      exercises: [
        ex("Owner Naming", "Name owners on day one.", "Assign owner + backup for every piece of the ecosystem.", 90, "Owner grid.", "Post to residency wall."),
        ex("The Owner's Fear", "Interview each owner.", "30-min interview per owner: 'What are you afraid you'll be left holding?'", 240, "Interview kit.", "Cluster fears. Address top 3 in week 2."),
        ex("The Handoff Contract", "Design the handoff before starting.", "Co-draft: what will be handed off, in what shape, on what date.", 120, "Contract.", "Every owner signs."),
      ],
      journeys: {
        narrative: "The story: we named the humans before we shipped the system.",
        cognitive: "The model: handoff is designed, not improvised.",
        identity: "I am someone who names owners before I build.",
      },
      artifact: "An owner grid. A signed handoff contract per piece.",
    },
    MAGIC: {
      intent: "Reframe: an ecosystem is a set of rituals, not a set of features.",
      promptQuestion: "Which rituals will keep this ecosystem alive after we leave?",
      exercises: [
        ex("Ritual Inventory", "Name every needed ritual.", "List: cadence, purpose, host, artifact, participants for each ritual.", 120, "Ritual template.", "Present to leadership. Get pushback."),
        ex("Ritual Cost", "Cost each ritual in hours per month.", "For each ritual: total hours consumed per month.", 45, "Cost sheet.", "Sum. Ask: 'Can the org afford this?'"),
        ex("The Rituals Retirement", "Kill 30% of them.", "Kill 30% of rituals. Justify each kill.", 60, "Retirement doc.", "Publish. Notice the relief."),
      ],
      journeys: {
        narrative: "The story: we killed 30% of the rituals and no one noticed.",
        cognitive: "The model: ecosystem = rituals × owners × artifacts. Retire ruthlessly.",
        identity: "I am someone who costs rituals in hours.",
      },
      artifact: "A ritual inventory. A cost sheet. A retirement document.",
    },
    CALM: {
      intent: "Introduce the governance ontology.",
      promptQuestion: "Who decides what, on what cadence, with what evidence?",
      exercises: [
        ex("RACI-lite", "Simplest possible governance grid.", "For each decision type: responsible, accountable, informed. No consultation column.", 90, "Grid.", "Publish. Get exec sign-off."),
        ex("Cadence Map", "Draw the org's decision cadence.", "Which decisions weekly, monthly, quarterly? On what evidence?", 120, "Cadence map.", "Post next to RACI-lite."),
        ex("The Constitution", "1-page constitution for the ecosystem.", "Draft: purpose, boundary, decision protocol, retirement clause.", 240, "Template.", "All owners co-sign."),
      ],
      journeys: {
        narrative: "The story: we shipped a 1-page constitution.",
        cognitive: "The model: RACI-lite × cadence map × constitution = governance.",
        identity: "I am someone who governs on one page.",
      },
      artifact: "RACI-lite grid. Cadence map. 1-page constitution.",
    },
    OPEN: {
      intent: "Let the ecosystem run — with us in the room but silent.",
      promptQuestion: "What broke when we stayed silent?",
      exercises: [
        ex("Silent Weeks", "Weeks 8-10, we don't speak in meetings.", "Attend. Take notes. Do not speak. Log what broke.", 900, "Notebook.", "Weekly retro with the team — using notes only."),
        ex("The Break-Fix Log", "Log every break, every fix.", "Public log. Owner names the fix.", 60, "Log.", "Notice which breaks the team fixed themselves."),
        ex("The First Retro Without Us", "Attend but don't speak.", "Facilitator: internal team lead. We only take notes.", 90, "Retro template.", "Debrief privately with the lead."),
      ],
      journeys: {
        narrative: "The story: the week we stayed silent and the team held.",
        cognitive: "The model: silence is a diagnostic. Fixes are the metric.",
        identity: "I am someone who leaves before I'm asked to.",
      },
      artifact: "A break-fix log. A team-led retro record.",
    },
    FREE: {
      intent: "Exit. Cleanly. On the date.",
      promptQuestion: "What did we hand over and what did we take with us?",
      exercises: [
        ex("The Exit Ceremony", "Formal, public, on the calendar.", "90-min ceremony. Handoff of every piece. Public celebration.", 90, "Room + refreshments.", "Video the ceremony. Post."),
        ex("The 30/60/90 Check-in", "Book 3 lightweight check-ins.", "30-min video call at 30, 60, 90 days post-exit. Optional attendance for us.", 90, "Calendar.", "Log what changed."),
        ex("The Second-Chair Certificate", "Every owner gets one.", "Signed certificate: role, ecosystem, dates, handoff artifact.", 30, "Template + print.", "Ceremony includes handing them out."),
      ],
      journeys: {
        narrative: "The story: we left on the date we promised.",
        cognitive: "The model: exit = ceremony + check-ins + certification.",
        identity: "I am someone who leaves cleanly.",
      },
      artifact: "An exit ceremony recording. 30/60/90 check-in schedule. Certificates.",
    },
  },
  roadmap: [
    { label: "Week 1 — Owners", when: "40h", focus: "LOVE", outcome: "Handoff contracts signed." },
    { label: "Weeks 2-3 — Rituals", when: "80h", focus: "MAGIC", outcome: "Ritual retirement doc." },
    { label: "Weeks 4-5 — Governance", when: "80h", focus: "CALM", outcome: "Constitution shipped." },
    { label: "Weeks 6-10 — Silent build", when: "200h", focus: "OPEN", outcome: "Break-fix log + team-led retro." },
    { label: "Weeks 11-12 — Exit", when: "80h", focus: "FREE", outcome: "Exit ceremony + certificates." },
  ],
  commitmentContract: {
    prompt: "What does the ecosystem look like when we're gone?",
    template: "On __________ the ecosystem will be owned by __________. Its constitution is __________. The 30/60/90 check-ins are booked for __________. The retirement clause triggers when __________.",
    witness: "The named steward of the ecosystem.",
  },
};

/* ================================================================== */
/* Export                                                              */
/* ================================================================== */

export const REHEARSAL_ARC_PROGRAM: RehearsalOffering[] = [
  GLITCH,
  DRIFT,
  TUNE,
  FOREST,
  STORIES,
  RIS,
  DIAGNOSTIC,
  PROTOTYPE,
  ECOSYSTEM,
];

export const rehearsalOfferingBySlug = (slug: string): RehearsalOffering | undefined =>
  REHEARSAL_ARC_PROGRAM.find((o) => o.slug === slug);

export const rehearsalOfferingsByTier = (tier: ArcTier): RehearsalOffering[] =>
  REHEARSAL_ARC_PROGRAM.filter((o) => o.tier === tier);
