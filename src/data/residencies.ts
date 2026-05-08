export type ResidencyArchetype =
  | "forest"
  | "river"
  | "lake"
  | "mountain"
  | "ocean"
  | "storm"
  | "sun";

export interface ResidencyPractice {
  name: string;
  description: string;
}

export interface ResidencyExample {
  context: string;
  shift: string;
}

export interface Residency {
  id: ResidencyArchetype;
  name: string;
  shortName: string;
  glyph: string;
  invitation: string;
  gesture: string;
  forLeaders: string;
  /** HSL color tokens for gradient backdrop */
  hueFrom: string;
  hueTo: string;

  // Extended detail-page content
  tagline: string;
  manifesto: string[];
  teacher: string;
  duration: string;
  format: string;
  practices: ResidencyPractice[];
  examples: ResidencyExample[];
  threshold: string;
  artifact: string;
  pairsWith: ResidencyArchetype[];
}

export const residencies: Residency[] = [
  {
    id: "forest",
    name: "Think like a Forest",
    shortName: "Forest",
    glyph: "🌲",
    invitation: "Lead through canopies, mycelial trust, and slow seasons.",
    gesture: "Patient interdependence — sensing the whole stand, not the single tree.",
    forLeaders: "Stewards of complex ecosystems and long strategies.",
    hueFrom: "150 35% 32%",
    hueTo: "100 28% 55%",
    tagline: "Strategy at the speed of mycelium.",
    manifesto: [
      "A forest does not optimize. It composts, layers, and waits for light.",
      "Decisions made in canopy time outlast decisions made in calendar time.",
      "Your team is a stand of trees connected underground. Lead the soil, not the silhouette.",
    ],
    teacher: "An old-growth forest you visit weekly across one full season.",
    duration: "13 weeks (one season)",
    format: "Bi-weekly 1:1 sessions + four solo forest immersions + one cohort weekend.",
    practices: [
      { name: "Canopy mapping", description: "Diagram your org as a forest stand: emergent layer, canopy, understory, litter. Find what you've been mistaking for trunks." },
      { name: "Mycelial inventory", description: "List the underground exchanges that actually carry your culture — favors, side-channels, mentorships. Make them visible without colonizing them." },
      { name: "Composting failures", description: "Take three failures from the last 18 months and metabolize them, in writing, into soil for what's next." },
    ],
    examples: [
      { context: "A 200-person climate-tech company with three competing strategy decks.", shift: "Replaced quarterly OKR theatre with seasonal stewardship rounds; retention rose, decision velocity actually increased." },
      { context: "A founding team in year seven, exhausted and unable to delegate.", shift: "Mapped their canopy and discovered the founder was the only nutrient pathway. Built three new mycelial channels in six weeks." },
    ],
    threshold: "You stop asking 'how do we move faster?' and start asking 'what is this season for?'",
    artifact: "A hand-drawn ecological map of your organization, annotated with what to plant, prune, and protect this season.",
    pairsWith: ["lake", "mountain"],
  },
  {
    id: "river",
    name: "Think like a River",
    shortName: "River",
    glyph: "🌊",
    invitation: "Move continuously, find the path of least resistance, carve with time.",
    gesture: "Flow — staying in motion without losing direction.",
    forLeaders: "Teams stuck in change fatigue, bottlenecks, and stop-start cycles.",
    hueFrom: "200 60% 38%",
    hueTo: "190 70% 62%",
    tagline: "Direction without forcing.",
    manifesto: [
      "Water doesn't push obstacles. It finds them, tests them, and over time, dissolves them.",
      "A river is the only thing that gets stronger by going around.",
      "If your strategy requires no obstacles, it isn't a strategy — it's a wish.",
    ],
    teacher: "A specific river you walk the length of, in segments, across the residency.",
    duration: "10 weeks",
    format: "Weekly 1:1 sessions + three river-walk fieldworks + one team-flow workshop.",
    practices: [
      { name: "Path-of-least-resistance audit", description: "List the five hardest decisions of your quarter. Find the path the water would take. Notice what you were defending instead." },
      { name: "Flow journaling", description: "Each evening, name the thing that moved through you that day, and the thing that pooled. Track for 30 days." },
      { name: "Bottleneck dissolution", description: "Pick one bottleneck. Stop reinforcing the banks. Spend two weeks removing instead of adding." },
    ],
    examples: [
      { context: "A product org running 14 parallel initiatives.", shift: "Halted nine, accelerated three, killed two. Cycle time dropped 40%; team energy returned within one quarter." },
      { context: "A leader who couldn't say no.", shift: "Discovered every yes was a dam. Built a saying-no practice; their calendar became a current instead of a swamp." },
    ],
    threshold: "You stop strategizing against gravity.",
    artifact: "A flow chart of your real decision-river — where you carve, where you pool, where you spill.",
    pairsWith: ["lake", "ocean"],
  },
  {
    id: "lake",
    name: "Think like a Lake",
    shortName: "Lake",
    glyph: "💧",
    invitation: "Hold stillness as a form of intelligence; let the surface reflect.",
    gesture: "Stillness — receptive depth before response.",
    forLeaders: "Reactive cultures, decision overload, untrusted intuition.",
    hueFrom: "210 45% 30%",
    hueTo: "200 30% 70%",
    tagline: "The surface that thinks.",
    manifesto: [
      "A lake doesn't react to every thrown stone. It absorbs, ripples, and returns to mirror.",
      "Stillness is not absence of action — it is the medium that makes accurate action possible.",
      "What you call indecision is often a lake refusing to be a river.",
    ],
    teacher: "A lake you sit beside, in silence, for one hour each week.",
    duration: "8 weeks",
    format: "Weekly 1:1 sessions + 8 silent lake-sits + a meditation on the practice of not-deciding.",
    practices: [
      { name: "The 24-hour pond", description: "For one month, no decision under €10k or non-urgent gets answered same-day. Watch what surfaces." },
      { name: "Mirror practice", description: "Each morning, write what you see when you stop thinking. Treat it as data, not noise." },
      { name: "Depth questions", description: "When asked something hard, learn to say 'let me sit with that' as a power move, not a stall." },
    ],
    examples: [
      { context: "A CEO known for instant Slack replies, draining their decision quality.", shift: "Built a 'lake hour' before every leadership meeting. Decisions slowed by hours, improved by orders of magnitude." },
      { context: "A board chair drowning in stakeholder input.", shift: "Adopted a quarterly silent retreat day. Six months later, three persistent strategic knots had quietly untied themselves." },
    ],
    threshold: "You trust silence to be productive.",
    artifact: "A personal stillness protocol — when, where, how long, and what's protected.",
    pairsWith: ["forest", "mountain"],
  },
  {
    id: "mountain",
    name: "Think like a Mountain",
    shortName: "Mountain",
    glyph: "🏔️",
    invitation: "Stand on long-horizon time. Be visible, structural, unhurried.",
    gesture: "Presence — structural integrity under exposure.",
    forLeaders: "Identity shifts, public roles, leaders carrying weight alone.",
    hueFrom: "220 15% 28%",
    hueTo: "30 12% 70%",
    tagline: "Geological time, executive body.",
    manifesto: [
      "A mountain is not motivated. It is constituted.",
      "What you call presence, the mountain calls Tuesday.",
      "Leaders are not made by intensity. They are made by the patient rearrangement of plates.",
    ],
    teacher: "A mountain you climb once at the start, sit on once at the middle, return to once at the end.",
    duration: "12 weeks",
    format: "Bi-weekly 1:1 sessions + three mountain ascents + one solo bivouac.",
    practices: [
      { name: "Hundred-year letter", description: "Write a letter from your future self, 100 years out, to your current self. Edit it weekly. Let it edit you." },
      { name: "Posture as policy", description: "Twice daily, hold mountain posture for five minutes. Notice what your body teaches your strategy." },
      { name: "Visible without explaining", description: "For 30 days, take one stance per week without justifying it. Learn what survives." },
    ],
    examples: [
      { context: "A founder transitioning to chair, hemorrhaging authority by over-explaining.", shift: "Stopped justifying. Held two unpopular positions in silence; both became consensus within a quarter." },
      { context: "A first-time CEO who shrunk in board meetings.", shift: "Trained mountain posture. Their body found the role before their words did." },
    ],
    threshold: "You stop seeking permission to occupy your role.",
    artifact: "A one-page constitution: the three things you will hold, regardless of weather.",
    pairsWith: ["forest", "sun"],
  },
  {
    id: "ocean",
    name: "Think like an Ocean",
    shortName: "Ocean",
    glyph: "🐋",
    invitation: "Hold multitudes. Move on tides, not deadlines.",
    gesture: "Capacity — pacing through cycles instead of sprints.",
    forLeaders: "Scaling organisations and multi-stakeholder choreographies.",
    hueFrom: "215 55% 22%",
    hueTo: "180 60% 50%",
    tagline: "Capacity at the scale of cycles.",
    manifesto: [
      "An ocean does not negotiate with the moon.",
      "Scale is not size. Scale is the ability to hold contradictions without leaking.",
      "What looks like patience in an ocean is the simple math of volume.",
    ],
    teacher: "An ocean shore, visited at three tide cycles across the residency.",
    duration: "16 weeks",
    format: "Weekly 1:1 sessions + three coastal immersions + one full-tide observation cycle (24h).",
    practices: [
      { name: "Tide-mapping", description: "Identify your organization's actual cycles — financial, emotional, creative. Stop scheduling against them." },
      { name: "Multitude rehearsal", description: "Hold three opposing stakeholder views in your body, simultaneously, for 20 minutes daily. Build the muscle." },
      { name: "Volume over velocity", description: "For one month, measure progress by capacity built, not output shipped." },
    ],
    examples: [
      { context: "A scale-up at 400 people, founders still operating at 30-person speed.", shift: "Re-architected the leadership cadence to tidal — slower, deeper, more synchronized. Burnout dropped, retention rose." },
      { context: "A coalition of 12 NGOs unable to find consensus.", shift: "Replaced consensus-seeking with tide-holding. Decisions emerged from cycles instead of meetings." },
    ],
    threshold: "You stop confusing speed with scale.",
    artifact: "Your organization's tide chart — the cycles you'll honor, the cycles you'll resist together.",
    pairsWith: ["river", "storm"],
  },
  {
    id: "storm",
    name: "Think like a Storm",
    shortName: "Storm",
    glyph: "⚡",
    invitation: "Work with intensity. Let disruption become generative.",
    gesture: "Discharge — channeling charge instead of avoiding it.",
    forLeaders: "Crisis, conflict, GL!TCH moments, inherited turbulence.",
    hueFrom: "260 40% 30%",
    hueTo: "280 70% 65%",
    tagline: "Productive turbulence.",
    manifesto: [
      "A storm is not a disaster. It is the planet redistributing energy.",
      "Suppression of charge is what makes storms catastrophic.",
      "Your team's conflict is not a problem to manage. It is intelligence trying to discharge.",
    ],
    teacher: "Real storms — observed, walked into, weathered with intention.",
    duration: "6 weeks (intensive)",
    format: "Twice-weekly 1:1 sessions + GL!TCH session integration + one storm-walk.",
    practices: [
      { name: "Charge mapping", description: "Identify where the unspoken voltage lives in your team. Stop earthing it through yourself." },
      { name: "Generative conflict", description: "Run one conflict per week toward, not away. Learn the difference between heat and combustion." },
      { name: "Lightning protocol", description: "When a flash decision is needed, follow the storm's procedure: see, ground, strike, release." },
    ],
    examples: [
      { context: "A leadership team avoiding a co-founder rupture for two years.", shift: "Held one structured storm in a GL!TCH session. The rupture happened, then resolved. The org reorganized around honest current." },
      { context: "A manager triangulating every team conflict through 1:1s.", shift: "Stopped insulating. Taught the team to hold their own weather. Manager workload dropped 30%." },
    ],
    threshold: "You stop fearing intensity and start composing with it.",
    artifact: "A weather log of your team's charge — what builds it, what discharges it, what you'll stop suppressing.",
    pairsWith: ["river", "ocean"],
  },
  {
    id: "sun",
    name: "Think like a Sun",
    shortName: "Sun",
    glyph: "☀️",
    invitation: "Radiate clarity. Be the climate, not the weather.",
    gesture: "Sustained generativity — giving without depleting.",
    forLeaders: "Burnout recovery, vision-setting, founders re-finding their light.",
    hueFrom: "35 85% 45%",
    hueTo: "50 95% 70%",
    tagline: "Generosity at the scale of climate.",
    manifesto: [
      "The sun does not perform. It burns at the rate that sustains a solar system.",
      "Charisma is weather. Climate is what your nervous system actually projects, every day, for years.",
      "If your generosity depletes you, it isn't sunlight — it's a flare.",
    ],
    teacher: "The sun itself, observed at sunrise across the full residency.",
    duration: "9 weeks",
    format: "Weekly 1:1 sessions + daily 10-minute sunrise practice + one solo silent day.",
    practices: [
      { name: "Sustainable burn", description: "Calibrate your output to a rate you could maintain for 20 years. Cut 30% of what you give. Watch what blooms." },
      { name: "Climate audit", description: "Ask five people what your steady-state presence feels like, not your peak. Believe the answers." },
      { name: "Photosynthesis protocol", description: "Identify what feeds you, what you metabolize, what you radiate. Close the loop." },
    ],
    examples: [
      { context: "A founder five years post-exit, dimmed and unsure why.", shift: "Discovered they'd been performing brightness instead of being warm. Recalibrated to climate; new ventures emerged unforced." },
      { context: "A creative director whose team only thrived in their presence.", shift: "Built the climate to outlast their attention. Team output stayed high during a three-month sabbatical — for the first time." },
    ],
    threshold: "You stop performing your gift and start being its source.",
    artifact: "Your personal climate brief — the steady-state you commit to, and what you'll no longer perform.",
    pairsWith: ["mountain", "lake"],
  },
];

export const getResidency = (id: string): Residency | undefined =>
  residencies.find((r) => r.id === id);
