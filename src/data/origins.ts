import smallThinking from "@/assets/origins/small-thinking-2013.jpg";
import appliedPoetry from "@/assets/origins/applied-poetry-2016.jpg";
import smplFr from "@/assets/origins/smpl-fr-2017.jpg";
import interactionPatterns from "@/assets/origins/interaction-patterns-2017.jpg";
import uxProcess from "@/assets/origins/ux-process-2018.jpg";
import fluxNoetical from "@/assets/origins/flux-noetical-2018.jpg";
import relationalIntelligence from "@/assets/origins/relational-intelligence-2018.jpg";
import dtSdSa from "@/assets/origins/dt-sd-sa-2018.jpg";
import concentricMethods from "@/assets/origins/concentric-methods-2018.jpg";
import zenFlowRetreats from "@/assets/origins/zen-flow-retreats-2018.jpg";

export type OriginLanguage = "EN" | "FR";

export interface OriginBecame {
  label: string;
  to: string;
}

export interface OriginMethod {
  slug: string;
  title: string;
  subtitle?: string;
  year: string;
  language: OriginLanguage;
  image: string;
  blurb: string;
  vocabulary: string[];
  became: OriginBecame[];
}

export const ORIGIN_METHODS: OriginMethod[] = [
  {
    slug: "small-thinking-2013",
    title: "#Small Thinking Framework",
    subtitle: "Concentric layers of how we make worlds",
    year: "2013",
    language: "EN",
    image: smallThinking,
    blurb:
      "A 14-layer concentric ontology — from Practices and Tools all the way to Knowledge Bases — used to keep small interventions in conversation with the largest cultural and technological strata.",
    vocabulary: [
      "Practices",
      "Ecologies",
      "Technologies",
      "Behaviors",
      "Markets",
      "Culture",
      "Tekhne",
      "Intelligences",
      "Tools",
      "Dialogues",
      "Imagination",
      "Reason",
      "Knowledge Bases",
    ],
    became: [
      { label: "Calm Magic Board — 5 PRD seasons", to: "/calm-magic-board" },
      { label: "Ontological Data Integrity (1:1 columns)", to: "/lineage" },
    ],
  },
  {
    slug: "applied-poetry-2016",
    title: "Applied Poetry",
    subtitle: "Promoting a calmer future without helmets and less screens",
    year: "2016",
    language: "EN",
    image: appliedPoetry,
    blurb:
      "A manifesto-sketch for calm computing, tangible interfaces, and multisensory environments — explicitly arguing against an ocularcentric future and naming \"applied poetry\" as a design discipline.",
    vocabulary: [
      "Calm Computing",
      "Tangible Computing",
      "Sensor Fusion",
      "Programmable Environment",
      "Natural Interfaces",
      "Voice Interface",
      "Haptics",
      "Multisensory",
      "Not Ocularcentric",
      "Applied Poetry",
    ],
    became: [
      { label: "The name — Calm Magic", to: "/calm-magic-demo" },
      { label: "Tonalli (Voice & Spatial)", to: "/tonalli" },
    ],
  },
  {
    slug: "smpl-fr-2017",
    title: "SMPL — Cycle d'expérience",
    subtitle: "Divergence ↔ Exploration ↔ Convergence",
    year: "2017",
    language: "FR",
    image: smplFr,
    blurb:
      "Un cadre de facilitation en cinq mouvements — JOUER, RACONTER, CRÉER DU SENS, MODÉLISER, INSPIRER — articulé autour d'une boucle Divergence/Exploration/Convergence et de questions de cadrage.",
    vocabulary: [
      "JOUER",
      "RACONTER",
      "CRÉER DU SENS",
      "MODÉLISER",
      "INSPIRER",
      "Idéation & Médiation",
      "Investigation & Détection",
      "Architecture & Design",
      "Vision & Logistique",
    ],
    became: [
      { label: "GL!TCH → DRIFT → TUNE descent", to: "/glitch-methodology" },
      { label: "Calm Magic Board verbs", to: "/calm-magic-board" },
    ],
  },
  {
    slug: "interaction-patterns-2017",
    title: "Architecture d'expériences — 12 patterns d'interaction",
    subtitle: "Programmable environments before the phrase was common",
    year: "2017",
    language: "FR",
    image: interactionPatterns,
    blurb:
      "Douze patterns d'entrée pour environnements programmables : capteurs de proximité, vision par caméra, gyroscope, météo, gestes, sonographie — esquissés pour penser l'espace comme interface.",
    vocabulary: [
      "Proximity Sensor",
      "Camera Vision",
      "Movement Detector",
      "Gyroscope",
      "Weather Data",
      "Gesture Recognition",
      "Sonography",
      "Mobile URL",
    ],
    became: [
      { label: "Tonalli Spatial branch", to: "/tonalli" },
      { label: "Pattern Encyclopedia", to: "/pattern-encyclopedia" },
    ],
  },
  {
    slug: "ux-process-2018",
    title: "Activités et livrables du processus UX",
    subtitle: "A full-pipeline UX activity map",
    year: "2018",
    language: "FR",
    image: uxProcess,
    blurb:
      "Cartographie complète des activités et livrables d'un processus UX — utilisée comme socle pour relier la recherche, la stratégie, la conception et la production.",
    vocabulary: [
      "Recherche",
      "Cadrage",
      "Stratégie",
      "Conception",
      "Production",
      "Livrables",
    ],
    became: [
      { label: "Service Blueprint integration", to: "/lineage" },
      { label: "AI Observatory tiers", to: "/agentic-ecosystem-deck" },
    ],
  },
  {
    slug: "flux-noetical-2018",
    title: "Noetical · Perma · Bio/Psy/Geo Flux",
    subtitle: "Trois flux qui traversent toute conception",
    year: "2018",
    language: "FR",
    image: fluxNoetical,
    blurb:
      "Une cosmologie de design en trois flux — noétique (mythes, cultures, religions), perma (écosystèmes, dialogues, IA, immersion) et bio/psy/géo (écologie, biologie, psychologie) — pour situer toute intervention dans ses courants de fond.",
    vocabulary: [
      "Noetical Flux",
      "Perma Flux",
      "Bio/Psy/Geo Flux",
      "Courants de fond",
      "Design narratif",
      "Design de démarche",
      "Capteurs",
      "Espaces réels",
    ],
    became: [
      { label: "Consciousness Manifold (4 Time Lenses)", to: "/calm-magic-board" },
      { label: "Drift — 5 axes (MAGIC · LOVE · CALM · OPEN · FREE)", to: "/drift" },
    ],
  },
  {
    slug: "relational-intelligence-2018",
    title: "Proxémie · Noétique · Praxis · Poiesis",
    subtitle: "The most direct ancestor of Calm Magic",
    year: "2018",
    language: "FR",
    image: relationalIntelligence,
    blurb:
      "Une carte des intelligences relationnelles — Voix Intérieure, Neuroleadership, Sérendipité — reliées par des vecteurs : Guiding, Dialogue, Listening, Playing, Touching, Empathy, Intuition, Non-verbal, Relational intelligence. La grammaire d'origine de Calm Magic.",
    vocabulary: [
      "Proxémie",
      "Noétique",
      "Voix Intérieure",
      "Praxis",
      "Poiesis",
      "Neuroleadership",
      "Sérendipité",
      "Relational intelligence",
    ],
    became: [
      { label: "Calm Magic — Relational Intelligence core", to: "/calm-magic-assistant" },
      { label: "GL!TCH facilitation methodology", to: "/glitch-methodology" },
    ],
  },
  {
    slug: "dt-sd-sa-2018",
    title: "Design Thinking → Service Design → System Architecture",
    subtitle: "From idea to release as one continuous workflow",
    year: "2018",
    language: "EN",
    image: dtSdSa,
    blurb:
      "A workflow sketch braiding three layers — Design Thinking (framing), Service Design (journey), System Architecture (build & release) — around daily scrums, build-to-think prototypes, and a single backlog.",
    vocabulary: [
      "Framing Content",
      "User Mental Model",
      "Build-to-Think Prototyping",
      "Journey Mapping",
      "Task Model",
      "Mental Model",
      "Versioning",
      "Release",
    ],
    became: [
      { label: "Foundational Prompt Compiler", to: "/calm-magic-board" },
      { label: "PRD → tech stack → agentic prompts", to: "/calm-magic-board/prds" },
    ],
  },
  {
    slug: "concentric-methods-2018",
    title: "Concentric Methods Map",
    subtitle: "Companion to #Small Thinking",
    year: "2018",
    language: "FR",
    image: concentricMethods,
    blurb:
      "Une carte concentrique des méthodes — pensée systémique, ethnographie appliquée, architecture d'expériences, sensemaking, gamestorming, story making, poésie appliquée, computational design — comme un palette unifiée de praticien.",
    vocabulary: [
      "Pensée systémique",
      "Design de services",
      "Ethnographie appliquée",
      "Architecture d'expériences",
      "Sensemaking",
      "Story Making",
      "Poésie appliquée",
      "Computational Design",
      "Poiesis",
      "Praxis",
    ],
    became: [
      { label: "6 Constellation visualization modes", to: "/calm-magic-board" },
      { label: "Pattern Encyclopedia", to: "/pattern-encyclopedia" },
    ],
  },
  {
    slug: "zen-flow-retreats-2018",
    title: "Zen · Flow · Encounters · Retreats",
    subtitle: "The retreat structure, drawn early",
    year: "2018",
    language: "EN",
    image: zenFlowRetreats,
    blurb:
      "A hand-drawn diagram braiding Zen, Flow, Results, Encounters and Retreats — the earliest articulation of what would later become the Paracosm Retreat container.",
    vocabulary: ["Zen", "Flow", "Results", "Encounters", "Retreats"],
    became: [
      { label: "Paracosm Retreat (Azores 2026)", to: "/paracosm-retreat" },
      { label: "Residencies", to: "/residencies" },
    ],
  },
];
