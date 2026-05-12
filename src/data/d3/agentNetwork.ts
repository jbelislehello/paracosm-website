export type AgentRole = "voice" | "knowledge" | "regulation" | "product";

export interface AgentNode {
  id: string;
  label: string;
  role: AgentRole;
  axis: "MAGIC" | "LOVE" | "CALM" | "OPEN" | "FREE";
  description: string;
}

export interface AgentLink {
  source: string;
  target: string;
  kind: "handoff" | "feedback" | "compile";
}

export const agentNodes: AgentNode[] = [
  { id: "wuxia", label: "Wuxia", role: "voice", axis: "MAGIC", description: "Story guide and transmedia narrator across the Paracosm universe." },
  { id: "calm-magic", label: "Calm Magic Assistant", role: "regulation", axis: "CALM", description: "Window-of-tolerance coach. Maps a question onto the 5-axis board." },
  { id: "glitch", label: "GL!TCH Facilitator", role: "regulation", axis: "OPEN", description: "Runs the 25-minute live cycle and surfaces regulation script layers." },
  { id: "prd", label: "PRD Compiler", role: "product", axis: "FREE", description: "Compiles the 5-season PRD into tech stack JSON and agentic prompts." },
  { id: "drift", label: "Drift Librarian", role: "knowledge", axis: "OPEN", description: "Multi-layered semantic search across the 5 Calm Magic axes." },
  { id: "tonalli", label: "Tonalli Voice", role: "voice", axis: "LOVE", description: "Voice and spatial branch of the Creative OS." },
  { id: "tarot", label: "Tarot Oracle", role: "knowledge", axis: "MAGIC", description: "64-card matrix deck linked to the Calm Magic board." },
  { id: "ontology", label: "Ontology Mapper", role: "knowledge", axis: "FREE", description: "Maintains 1:1 semantic node mapping across the system." },
];

export const agentLinks: AgentLink[] = [
  { source: "wuxia", target: "tarot", kind: "handoff" },
  { source: "wuxia", target: "calm-magic", kind: "handoff" },
  { source: "calm-magic", target: "glitch", kind: "handoff" },
  { source: "calm-magic", target: "drift", kind: "feedback" },
  { source: "glitch", target: "prd", kind: "compile" },
  { source: "drift", target: "ontology", kind: "feedback" },
  { source: "ontology", target: "prd", kind: "compile" },
  { source: "tarot", target: "drift", kind: "handoff" },
  { source: "tonalli", target: "wuxia", kind: "feedback" },
  { source: "tonalli", target: "calm-magic", kind: "handoff" },
  { source: "prd", target: "ontology", kind: "feedback" },
];
