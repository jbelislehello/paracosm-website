/**
 * Wild Cookie thematic compasses (from "Calm Magic Compasses by Wild Cookie", 20 entries).
 *
 * These are *thematic* compasses (vs. the historical "origin" sketches in
 * src/data/origins.ts). Each one routes to its closest executable surface on
 * the Calm Magic Board — a topology view mode, a board tab, or an adjacent
 * tool — and declares which origin compasses it shares ontological grammar
 * with, so the Ancestry view can draw the cross-family connection.
 */
import type { TopologyViewMode } from "@/components/calm-magic/topologies/ViewModeSelector";
import type { BoardTabSlug } from "@/data/originsToTopology";

/** Lifecycle stage taxonomy distilled from the PDF's vision-definition timeline. */
export type CompassStage =
  | "explore"
  | "frame"
  | "ideate"
  | "vision"
  | "design"
  | "ship";

export const STAGE_LABELS: Record<CompassStage, string> = {
  explore: "Explore",
  frame: "Frame",
  ideate: "Ideate",
  vision: "Vision",
  design: "Design",
  ship: "Ship",
};

export type RouteTarget =
  | { kind: "topology"; mode: TopologyViewMode; label: string }
  | { kind: "board"; tab: BoardTabSlug; label: string }
  | { kind: "external"; to: string; label: string };

export interface WildCookieCompass {
  slug: string;
  name: string;
  /** Lucide icon name */
  icon: string;
  description: string;
  quote: string;
  attribution: string;
  timing: string;
  tools: string[];
  practices: string[];
  stage: CompassStage;
  routesTo: RouteTarget;
  relatesToOriginSlugs: string[];
}

export const WILD_COOKIE_COMPASSES: WildCookieCompass[] = [
  {
    slug: "ux-consciousness",
    name: "The UX Consciousness",
    icon: "Eye",
    description: "Guiding principle for user-centric design.",
    quote: "The goal of life is living in agreement with nature.",
    attribution: "Zeno of Citium",
    timing: "Throughout the design process",
    tools: ["User-centered frameworks", "Empathy mapping", "VR/AR"],
    practices: ["Design thinking", "User interviews", "Usability testing"],
    stage: "frame",
    routesTo: { kind: "board", tab: "prd-assembly", label: "PRD Assembly" },
    relatesToOriginSlugs: ["dt-sd-sa-2018", "ux-process-2018"],
  },
  {
    slug: "body-maps",
    name: "Body Maps",
    icon: "PersonStanding",
    description: "Personalized learning through bodily awareness.",
    quote: "In every walk with nature, one receives far more than he seeks.",
    attribution: "John Muir",
    timing: "Tailored to individual needs",
    tools: ["Wearable tech", "Biometric sensors", "3D modeling"],
    practices: ["Yoga", "Meditation", "Kinesthetic learning"],
    stage: "design",
    routesTo: { kind: "board", tab: "window-of-tolerance", label: "Window of Tolerance" },
    relatesToOriginSlugs: ["relational-intelligence-2018"],
  },
  {
    slug: "iot-bodies",
    name: "Internet of Things & Bodies",
    icon: "Wifi",
    description: "Enhanced learning in a connected world.",
    quote:
      "We have paleolithic emotions, medieval institutions, and godlike technology.",
    attribution: "E.O. Wilson",
    timing: "Leveraging connectivity",
    tools: ["Smart sensors", "Health trackers", "Remote labs"],
    practices: ["Hands-on experiments", "Field trips", "Remote collaboration"],
    stage: "design",
    routesTo: { kind: "topology", mode: "coordinates", label: "Topology · Position Map" },
    relatesToOriginSlugs: ["interaction-patterns-2017"],
  },
  {
    slug: "cognitive-maps",
    name: "Cognitive Maps",
    icon: "Brain",
    description: "Understanding and optimizing learning processes.",
    quote: "The only real valuable thing is intuition.",
    attribution: "Albert Einstein",
    timing: "Continuous monitoring",
    tools: ["Data analytics", "Neural networks", "BCIs"],
    practices: ["Mind mapping", "Reflective journaling", "Metacognition"],
    stage: "design",
    routesTo: { kind: "topology", mode: "projection", label: "Topology · Hidden Structure" },
    relatesToOriginSlugs: ["small-thinking-2013"],
  },
  {
    slug: "ubiquitous-computing",
    name: "Ubiquitous Computing",
    icon: "Cloud",
    description: "Integration of technology in daily life.",
    quote: "You are not a drop in the ocean. You are the entire ocean in a drop.",
    attribution: "Rumi",
    timing: "In an increasingly digital world",
    tools: ["Cloud / edge computing", "Ambient intelligence"],
    practices: ["Digital detox", "Mindfulness", "Screen-free time"],
    stage: "design",
    routesTo: { kind: "external", to: "/tonalli", label: "Tonalli (Spatial)" },
    relatesToOriginSlugs: ["applied-poetry-2016", "interaction-patterns-2017"],
  },
  {
    slug: "prediction-engines",
    name: "Prediction Engines",
    icon: "TrendingUp",
    description: "Proactive adaptation to individual learning needs.",
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    attribution: "Eleanor Roosevelt",
    timing: "Ongoing data analysis",
    tools: ["Machine learning", "Recommender systems"],
    practices: ["Goal setting", "Adaptive learning", "Feedback loops"],
    stage: "ship",
    routesTo: { kind: "topology", mode: "flow", label: "Topology · Energy Field" },
    relatesToOriginSlugs: ["flux-noetical-2018"],
  },
  {
    slug: "worldbuilding-narratives",
    name: "Worldbuilding Narratives",
    icon: "BookOpen",
    description: "Shaping the learning environment through story.",
    quote:
      "The only limits to the possibilities in your life tomorrow are the 'buts' you use today.",
    attribution: "Les Brown",
    timing: "Throughout curriculum design",
    tools: ["Storytelling platforms", "Virtual worlds", "Scenario planning"],
    practices: ["Storytelling workshops", "Role-playing", "Scenario analysis"],
    stage: "vision",
    routesTo: { kind: "board", tab: "expressivity", label: "Expressivity" },
    relatesToOriginSlugs: ["applied-poetry-2016"],
  },
  {
    slug: "dialogic-imagination",
    name: "Dialogic Imagination",
    icon: "MessagesSquare",
    description: "Fostering conversation as a way of thinking.",
    quote: "Dialogue is the most effective way of resolving conflict.",
    attribution: "Dalai Lama",
    timing: "In group discussions",
    tools: ["Debate platforms", "Collaborative tools"],
    practices: ["Socratic questioning", "Perspective-taking", "Critical discourse"],
    stage: "ideate",
    routesTo: { kind: "external", to: "/glitch-methodology", label: "GL!TCH Methodology" },
    relatesToOriginSlugs: ["smpl-fr-2017"],
  },
  {
    slug: "futurogram",
    name: "Futurogram",
    icon: "Radar",
    description: "Transitioning to the Sensor Age.",
    quote: "The future is already here — it's just not evenly distributed.",
    attribution: "William Gibson",
    timing: "In technological transitions",
    tools: ["Sensor networks", "Data viz", "Predictive analytics"],
    practices: ["Tech impact assessment", "Ethical adoption"],
    stage: "ship",
    routesTo: { kind: "topology", mode: "cycles", label: "Topology · Pattern Loops" },
    relatesToOriginSlugs: ["flux-noetical-2018"],
  },
  {
    slug: "purpose-meaning",
    name: "Purpose & Meaning at Work",
    icon: "Compass",
    description: "Enhancing fulfillment in professional settings.",
    quote:
      "Your work fills a large part of your life — the only way to be satisfied is to do what you believe is great work.",
    attribution: "Steve Jobs",
    timing: "In career development",
    tools: ["Engagement surveys", "Coaching platforms"],
    practices: ["Career counseling", "Values exploration", "Job crafting"],
    stage: "vision",
    routesTo: { kind: "board", tab: "constellation", label: "Constellation" },
    relatesToOriginSlugs: ["concentric-methods-2018"],
  },
  {
    slug: "noetic-functions",
    name: "The Noetic Functions",
    icon: "Lightbulb",
    description: "Exploring the cognitive aspects of learning.",
    quote: "The mind is not a vessel to be filled, but a fire to be kindled.",
    attribution: "Plutarch",
    timing: "During cognitive development",
    tools: ["Cognitive psychology", "Mind-mapping tools"],
    practices: ["Metacognition", "Critical thinking exercises"],
    stage: "design",
    routesTo: { kind: "topology", mode: "flow", label: "Topology · Energy Field" },
    relatesToOriginSlugs: ["flux-noetical-2018", "relational-intelligence-2018"],
  },
  {
    slug: "human-animal",
    name: "The Human Animal",
    icon: "Footprints",
    description: "Understanding human behavior and evolution.",
    quote: "The greatest mystery of existence is existence itself.",
    attribution: "Deepak Chopra",
    timing: "Throughout the educational journey",
    tools: ["Anthropology", "Behavioral economics", "Simulations"],
    practices: ["Ethnography", "Behavioral experiments"],
    stage: "frame",
    routesTo: { kind: "topology", mode: "coordinates", label: "Topology · Position Map" },
    relatesToOriginSlugs: ["relational-intelligence-2018"],
  },
  {
    slug: "ecological-truth",
    name: "Ecological Truth & Eco Anxiety",
    icon: "Leaf",
    description: "Addressing environmental concerns.",
    quote: "We won't have a society if we destroy the environment.",
    attribution: "Margaret Mead",
    timing: "In ecological education",
    tools: ["Sustainability education", "Eco-awareness campaigns"],
    practices: ["Eco-friendly practices", "Conservation initiatives"],
    stage: "vision",
    routesTo: { kind: "external", to: "/drift", label: "Drift" },
    relatesToOriginSlugs: ["flux-noetical-2018"],
  },
  {
    slug: "reinventing-education",
    name: "Reinventing Education",
    icon: "GraduationCap",
    description: "Innovating education for future needs.",
    quote: "Education is the most powerful weapon you can use to change the world.",
    attribution: "Nelson Mandela",
    timing: "In educational reform",
    tools: ["EdTech platforms", "Experiential learning"],
    practices: ["Curriculum redesign", "Project-based learning", "Peer mentoring"],
    stage: "ship",
    routesTo: { kind: "external", to: "/pattern-encyclopedia", label: "Pattern Encyclopedia" },
    relatesToOriginSlugs: ["concentric-methods-2018"],
  },
  {
    slug: "calmness",
    name: "The Calmness",
    icon: "Wind",
    description: "Promoting mindfulness and well-being.",
    quote: "The present moment is the only moment available to us.",
    attribution: "Thich Nhat Hanh",
    timing: "During stress management",
    tools: ["Meditation apps", "Wellness programs"],
    practices: ["Mindfulness", "Deep breathing"],
    stage: "design",
    routesTo: { kind: "board", tab: "window-of-tolerance", label: "Window of Tolerance" },
    relatesToOriginSlugs: ["applied-poetry-2016"],
  },
  {
    slug: "meaningfulness",
    name: "Seeking Meaningfulness",
    icon: "Heart",
    description: "Living with purpose, not just existing.",
    quote:
      "To live is the rarest thing in the world. Most people exist, that is all.",
    attribution: "Oscar Wilde",
    timing: "In self-discovery",
    tools: ["Existential philosophy", "Self-discovery journeys"],
    practices: ["Journaling", "Life-purpose workshops"],
    stage: "vision",
    routesTo: { kind: "board", tab: "prd-assembly", label: "PRD Assembly" },
    relatesToOriginSlugs: ["dt-sd-sa-2018"],
  },
  {
    slug: "playfulness",
    name: "Encouraging Playfulness",
    icon: "Sparkles",
    description: "Creativity and exploration through play.",
    quote: "We don't stop playing because we grow old; we grow old because we stop playing.",
    attribution: "George Bernard Shaw",
    timing: "In ideation and brainstorming",
    tools: ["Gamification", "Creative ideation"],
    practices: ["Playful learning", "Game-based learning", "Artistic expression"],
    stage: "ideate",
    routesTo: { kind: "board", tab: "expressivity", label: "Expressivity" },
    relatesToOriginSlugs: ["applied-poetry-2016"],
  },
  {
    slug: "calm-computing",
    name: "Calm Computing",
    icon: "Moon",
    description: "Tech that respects attention.",
    quote:
      "Calm mind brings inner strength and self-confidence — important for good health.",
    attribution: "Dalai Lama",
    timing: "In interface design",
    tools: ["Serene interfaces", "Mindful tech usage"],
    practices: ["Digital detox", "Technology curfews", "Digital boundaries"],
    stage: "design",
    routesTo: { kind: "external", to: "/tonalli", label: "Tonalli (Voice & Spatial)" },
    relatesToOriginSlugs: ["applied-poetry-2016"],
  },
  {
    slug: "usefulness",
    name: "Usefulness",
    icon: "CheckCircle2",
    description: "Ensuring practicality and value.",
    quote: "The only way to do great work is to love what you do.",
    attribution: "Steve Jobs",
    timing: "During project planning",
    tools: ["Utility assessments", "User feedback", "Task-oriented design"],
    practices: ["Lean methods", "Value proposition canvas", "Usability studies"],
    stage: "ship",
    routesTo: { kind: "board", tab: "prd-assembly", label: "PRD Assembly" },
    relatesToOriginSlugs: ["dt-sd-sa-2018"],
  },
  {
    slug: "serendipity",
    name: "Serendipity",
    icon: "Shuffle",
    description: "Embracing unexpected discoveries and insights.",
    quote:
      "Serendipity. Look for something, find something else, and realize it's more suited to your needs than what you sought.",
    attribution: "Lawrence Block",
    timing: "Initial exploration",
    tools: ["Wandering", "Open browsing"],
    practices: ["Loose attention", "Curiosity walks"],
    stage: "explore",
    routesTo: { kind: "topology", mode: "ancestry", label: "Browse the lineage" },
    relatesToOriginSlugs: ["concentric-methods-2018"],
  },
];
