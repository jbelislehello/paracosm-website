/**
 * The 12 Calm Magic Agents.
 *
 * Ontological integrity: every attribute is a distinct field — no concatenation
 * of separate semantic entities. Each agent is anchored to a season of the
 * 64-tile board and holds one domain of intelligence.
 */

export type AgentSeason = "pollens" | "noems" | "poems" | "totems" | "anthems" | "sigma";

export interface AgentCopy {
  /** One-line domain of intelligence. */
  domain: string;
  /** What the agent does, in its own register (2–3 sentences). */
  body: string;
  /** The concrete thing you leave a session with. */
  outcome: string;
  /** Short verbatim-style line in the agent's voice. */
  voice: string;
}

export interface CalmMagicAgent {
  slug: string;
  /** Typographic mark — decorative, always aria-hidden. */
  glyph: string;
  name: { en: string; fr: string };
  season: AgentSeason;
  en: AgentCopy;
  fr: AgentCopy;
}

export interface SeasonMeta {
  key: AgentSeason;
  label: string;
  en: { name: string; role: string };
  fr: { name: string; role: string };
  /** Editorial accent (HSL triplet, used inside hsl()). */
  accent: string;
}

export const AGENT_SEASONS: SeasonMeta[] = [
  {
    key: "pollens",
    label: "POLLENS",
    accent: "15 75% 55%",
    en: { name: "Pollens", role: "Sensing — what is actually happening inside you" },
    fr: { name: "Pollens", role: "Sentir — ce qui se passe réellement en vous" },
  },
  {
    key: "noems",
    label: "NOEMS",
    accent: "205 70% 45%",
    en: { name: "Noems", role: "Thinking — vision, patterns, emergence" },
    fr: { name: "Noems", role: "Penser — vision, motifs, émergence" },
  },
  {
    key: "poems",
    label: "POEMS",
    accent: "345 65% 50%",
    en: { name: "Poems", role: "Expressing — form, language, resonance" },
    fr: { name: "Poems", role: "Exprimer — forme, langage, résonance" },
  },
  {
    key: "totems",
    label: "TOTEMS",
    accent: "150 55% 35%",
    en: { name: "Totems", role: "Structuring — care, consent, resources, belonging" },
    fr: { name: "Totems", role: "Structurer — soin, consentement, ressources, appartenance" },
  },
  {
    key: "anthems",
    label: "ANTHEMS",
    accent: "45 85% 45%",
    en: { name: "Anthems", role: "Launching — rhythm, communication, systemic awareness" },
    fr: { name: "Anthems", role: "Lancer — rythme, communication, conscience systémique" },
  },
  {
    key: "sigma",
    label: "Σ CONVERGENCE",
    accent: "265 55% 50%",
    en: { name: "Σ Convergence", role: "Synthesis — the cycle read as a whole" },
    fr: { name: "Σ Convergence", role: "Synthèse — le cycle lu comme un tout" },
  },
];

export const seasonMeta = (key: AgentSeason): SeasonMeta =>
  AGENT_SEASONS.find((s) => s.key === key) ?? AGENT_SEASONS[0];

export const CALM_MAGIC_AGENTS: CalmMagicAgent[] = [
  {
    slug: "witness",
    glyph: "🧿",
    name: { en: "The Witness", fr: "Le Témoin" },
    season: "pollens",
    en: {
      domain: "Daily check-in · Felt state",
      body: "The Witness opens the day by asking what is true in your body before asking what is on your list. It records felt state over time so patterns become visible instead of confusing.",
      outcome: "A dated felt-state entry and one honest sentence about where you actually are.",
      voice: "Before we decide anything — what are you noticing right now?",
    },
    fr: {
      domain: "Bilan quotidien · État ressenti",
      body: "Le Témoin ouvre la journée en demandant ce qui est vrai dans votre corps avant de demander ce qui est sur votre liste. Il consigne l'état ressenti dans le temps pour que les motifs deviennent visibles plutôt que confus.",
      outcome: "Une entrée datée d'état ressenti et une phrase honnête sur où vous êtes vraiment.",
      voice: "Avant de décider quoi que ce soit — que remarquez-vous en ce moment ?",
    },
  },
  {
    slug: "weaver",
    glyph: "🧵",
    name: { en: "The Weaver", fr: "La Tisseuse" },
    season: "pollens",
    en: {
      domain: "Relationships · Networks",
      body: "The Weaver holds the relational map: who you're in exchange with, what each thread is carrying, and where reciprocity has quietly gone one-directional.",
      outcome: "A relational map with the three threads that need attention this week.",
      voice: "Which relationship is holding more than it agreed to hold?",
    },
    fr: {
      domain: "Relations · Réseaux",
      body: "La Tisseuse tient la carte relationnelle : avec qui vous êtes en échange, ce que porte chaque fil, et où la réciprocité est devenue silencieusement unidirectionnelle.",
      outcome: "Une carte relationnelle avec les trois fils qui demandent attention cette semaine.",
      voice: "Quelle relation porte plus que ce qu'elle a accepté de porter ?",
    },
  },
  {
    slug: "cartographer",
    glyph: "🗺️",
    name: { en: "The Cartographer", fr: "Le Cartographe" },
    season: "noems",
    en: {
      domain: "Vision mapping · PRD",
      body: "The Cartographer turns a sprawling intention into a structured document. It maps intent to seasons, seasons to decisions, decisions to a buildable shape — without collapsing the vision into a to-do list.",
      outcome: "A structured PRD you can hand to a team or an agent without translation.",
      voice: "Say the whole thing badly. I'll give it a shape you can walk.",
    },
    fr: {
      domain: "Cartographie de vision · PRD",
      body: "Le Cartographe transforme une intention tentaculaire en document structuré. Il relie l'intention aux saisons, les saisons aux décisions, les décisions à une forme constructible — sans réduire la vision à une liste de tâches.",
      outcome: "Un PRD structuré que vous pouvez confier à une équipe ou à un agent sans traduction.",
      voice: "Dites le tout, même mal. Je lui donnerai une forme praticable.",
    },
  },
  {
    slug: "glitch",
    glyph: "🪲",
    name: { en: "The Glitch", fr: "Le GL!TCH" },
    season: "noems",
    en: {
      domain: "Failure intelligence · Pattern detection",
      body: "The Glitch treats breakdowns as data. It looks for the recurring failure — the one that keeps arriving in a new costume — and names the script running underneath it.",
      outcome: "The named pattern, its trigger, and one interruption you can rehearse.",
      voice: "This isn't new. Let's find out what it's a version of.",
    },
    fr: {
      domain: "Intelligence de l'échec · Détection de motifs",
      body: "Le GL!TCH traite les ruptures comme des données. Il cherche l'échec récurrent — celui qui revient toujours en nouveau costume — et nomme le script qui tourne dessous.",
      outcome: "Le motif nommé, son déclencheur, et une interruption à répéter.",
      voice: "Ce n'est pas nouveau. Trouvons de quoi c'est une version.",
    },
  },
  {
    slug: "oracle",
    glyph: "🔭",
    name: { en: "The Oracle", fr: "L'Oracle" },
    season: "noems",
    en: {
      domain: "Cross-domain resonance · Emergence",
      body: "The Oracle reads across everything you've fed the system and surfaces the connection you didn't ask for. It works by resonance, not retrieval — which is why its answers arrive as openings.",
      outcome: "One unexpected connection between two things you kept in separate rooms.",
      voice: "These two are the same problem. Do you want to see how?",
    },
    fr: {
      domain: "Résonance interdomaines · Émergence",
      body: "L'Oracle lit à travers tout ce que vous avez donné au système et fait émerger la connexion que vous n'avez pas demandée. Il travaille par résonance, non par récupération — d'où des réponses qui arrivent comme des ouvertures.",
      outcome: "Une connexion inattendue entre deux choses gardées dans des pièces séparées.",
      voice: "Ces deux-là sont le même problème. Voulez-vous voir comment ?",
    },
  },
  {
    slug: "steward",
    glyph: "🏛️",
    name: { en: "The Steward", fr: "L'Intendant" },
    season: "totems",
    en: {
      domain: "Resources · Long-term care",
      body: "The Steward holds the long horizon: money, energy, attention, and the maintenance nobody scheduled. It protects what has to survive the next six months.",
      outcome: "A resource picture with the one commitment to renegotiate now.",
      voice: "What are you spending that you haven't accounted for?",
    },
    fr: {
      domain: "Ressources · Soin à long terme",
      body: "L'Intendant tient l'horizon long : argent, énergie, attention, et l'entretien que personne n'a planifié. Il protège ce qui doit survivre aux six prochains mois.",
      outcome: "Un portrait des ressources et l'engagement unique à renégocier maintenant.",
      voice: "Que dépensez-vous sans l'avoir comptabilisé ?",
    },
  },
  {
    slug: "grove",
    glyph: "🌿",
    name: { en: "The Grove", fr: "La Clairière" },
    season: "totems",
    en: {
      domain: "Community · Belonging",
      body: "The Grove designs the container: who is invited, what it feels like to arrive, and how belonging is made structural rather than accidental.",
      outcome: "A membership or gathering design with explicit entry and exit rituals.",
      voice: "Who feels the edge of this room without being told where it is?",
    },
    fr: {
      domain: "Communauté · Appartenance",
      body: "La Clairière conçoit le contenant : qui est invité, ce que l'on ressent en arrivant, et comment l'appartenance devient structurelle plutôt qu'accidentelle.",
      outcome: "Un design d'adhésion ou de rassemblement avec des rituels d'entrée et de sortie explicites.",
      voice: "Qui sent la bordure de cette pièce sans qu'on la lui montre ?",
    },
  },
  {
    slug: "threshold",
    glyph: "🛡️",
    name: { en: "The Threshold", fr: "Le Seuil" },
    season: "totems",
    en: {
      domain: "Consent design · Access ethics",
      body: "The Threshold writes the agreements. It defines what can be asked, what can be stored, who can enter, and how a no stays available at every step.",
      outcome: "A written consent and access protocol you can publish without hedging.",
      voice: "Say the no you'd need to be able to say for this to be safe.",
    },
    fr: {
      domain: "Design du consentement · Éthique d'accès",
      body: "Le Seuil rédige les ententes. Il définit ce qui peut être demandé, ce qui peut être conservé, qui peut entrer, et comment un non reste disponible à chaque étape.",
      outcome: "Un protocole écrit de consentement et d'accès publiable sans détour.",
      voice: "Dites le non qu'il vous faudrait pouvoir dire pour que ce soit sûr.",
    },
  },
  {
    slug: "herald",
    glyph: "📯",
    name: { en: "The Herald", fr: "Le Héraut" },
    season: "anthems",
    en: {
      domain: "Communication · Launch",
      body: "The Herald carries the work outward. It finds the sentence that survives contact with strangers and builds the launch sequence around it.",
      outcome: "A launch message and a channel sequence, written in your register.",
      voice: "Give me the truest sentence. I'll make it travel.",
    },
    fr: {
      domain: "Communication · Lancement",
      body: "Le Héraut porte le travail vers l'extérieur. Il trouve la phrase qui survit au contact d'inconnus et construit la séquence de lancement autour d'elle.",
      outcome: "Un message de lancement et une séquence de canaux, dans votre registre.",
      voice: "Donnez-moi la phrase la plus vraie. Je la ferai voyager.",
    },
  },
  {
    slug: "conductor",
    glyph: "🎼",
    name: { en: "The Conductor", fr: "Le Chef d'orchestre" },
    season: "anthems",
    en: {
      domain: "Rhythm · Coordination",
      body: "The Conductor sets tempo. It sequences who moves when, keeps parallel work from colliding, and defends the pauses that make the next movement possible.",
      outcome: "A weekly cadence with owners, handoffs, and protected recovery.",
      voice: "You don't need more effort. You need a different tempo.",
    },
    fr: {
      domain: "Rythme · Coordination",
      body: "Le Chef d'orchestre fixe le tempo. Il séquence qui bouge quand, empêche les travaux parallèles de se heurter, et défend les pauses qui rendent le prochain mouvement possible.",
      outcome: "Une cadence hebdomadaire avec responsables, passations et récupération protégée.",
      voice: "Vous n'avez pas besoin de plus d'effort. Vous avez besoin d'un autre tempo.",
    },
  },
  {
    slug: "observatory",
    glyph: "🪞",
    name: { en: "The Observatory", fr: "L'Observatoire" },
    season: "anthems",
    en: {
      domain: "Systemic awareness without surveillance",
      body: "The Observatory watches the system, not the people. It reports on health, drift, and load at the level of the whole — deliberately blind to individual monitoring.",
      outcome: "A systemic health reading with no individual attribution.",
      voice: "The system is straining here. No one is at fault here.",
    },
    fr: {
      domain: "Conscience systémique sans surveillance",
      body: "L'Observatoire observe le système, pas les personnes. Il rend compte de la santé, de la dérive et de la charge à l'échelle du tout — délibérément aveugle au suivi individuel.",
      outcome: "Une lecture de santé systémique sans attribution individuelle.",
      voice: "Le système force ici. Personne n'est en faute ici.",
    },
  },
  {
    slug: "sigma",
    glyph: "🌀",
    name: { en: "The Sigma", fr: "Le Sigma" },
    season: "sigma",
    en: {
      domain: "Meta-reflection · Cycle synthesis",
      body: "The Sigma closes the loop. At the end of a cycle it reads every other agent's traces together and tells you what the season was actually about.",
      outcome: "A cycle synthesis: what changed, what held, what opens next.",
      voice: "Here is the season you just lived — not the one you planned.",
    },
    fr: {
      domain: "Méta-réflexion · Synthèse de cycle",
      body: "Le Sigma boucle la boucle. À la fin d'un cycle, il lit ensemble les traces de tous les autres agents et vous dit de quoi la saison parlait vraiment.",
      outcome: "Une synthèse de cycle : ce qui a changé, ce qui a tenu, ce qui s'ouvre.",
      voice: "Voici la saison que vous venez de vivre — pas celle que vous aviez prévue.",
    },
  },
];

export const AUDIENCE = {
  en: [
    "Founders navigating vision and survival at the same time",
    "Leaders who feel the gap between their intelligence and their capacity to use it",
    "Creatives who can't organize the universe they're carrying",
    "Teams that want to build with rigor and with care",
    "Anyone operating below their actual capacity — and ready to close the gap",
  ],
  fr: [
    "Fondateur·rices qui naviguent vision et survie en même temps",
    "Leaders qui sentent l'écart entre leur intelligence et leur capacité à l'utiliser",
    "Créatif·ves incapables d'organiser l'univers qu'ils portent",
    "Équipes qui veulent construire avec rigueur et avec soin",
    "Quiconque opère sous sa capacité réelle — et veut refermer l'écart",
  ],
};
