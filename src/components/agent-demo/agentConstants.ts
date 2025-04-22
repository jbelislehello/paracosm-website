
import { Agent } from "./ActiveAgentsDisplay";

// Define the agent ID as undefined initially
export const OPENAI_ASSISTANT_ID = "";

// Define agents available in the system
export const AGENTS: Agent[] = [
  {
    name: "Coordinator",
    color: "#2563eb",
    description: "Orchestrates tasks between agents",
    thinking: false,
  },
  {
    name: "OpenAI Agent",
    color: "#10b981",
    description: "Provides AI responses via OpenAI",
    thinking: false,
  },
];
