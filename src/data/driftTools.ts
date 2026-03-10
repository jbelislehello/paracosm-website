
export type DriftToolAxis = 'love' | 'magic' | 'calm' | 'open' | 'free';

export interface DriftTool {
  name: string;
  description: string;
  startingPrice: string;
  axis: DriftToolAxis;
  month: number;
  year: number;
  url: string;
}

export const driftTools: DriftTool[] = [
  // LOVE — Voice & Affective Computing
  { name: "Tonalli", description: "Dignity-first voice companion with Wuxia the Fox — 64-tile story matrix", startingPrice: "Custom", axis: "love", month: 1, year: 2025, url: "https://paracosm.it/tonalli" },
  { name: "Muse", description: "Brain-sensing headband for meditation and neurofeedback", startingPrice: "$249", axis: "love", month: 3, year: 2024, url: "https://choosemuse.com" },
  { name: "Hume AI", description: "Empathic AI that understands emotional expression in voice", startingPrice: "Free tier", axis: "love", month: 6, year: 2024, url: "https://hume.ai" },
  { name: "Sesame", description: "AI voice model for natural and expressive speech synthesis", startingPrice: "Free", axis: "love", month: 9, year: 2024, url: "https://www.sesame.com" },
  { name: "ElevenLabs", description: "AI voice synthesis, text-to-speech, and voice cloning", startingPrice: "Free tier", axis: "love", month: 2, year: 2024, url: "https://elevenlabs.io" },
  { name: "Adobe Firefly", description: "Generative AI for images, vectors, and creative design", startingPrice: "Free tier", axis: "love", month: 10, year: 2024, url: "https://firefly.adobe.com" },

  // MAGIC — AI & Sense-Making
  { name: "GPT Trainer", description: "AI training and fine-tuning services API", startingPrice: "$19/mo", axis: "magic", month: 4, year: 2024, url: "https://gpttrainer.com" },
  { name: "OpenAI APIs", description: "Powerful AI models and services for building intelligent apps", startingPrice: "Pay-as-you-go", axis: "magic", month: 1, year: 2024, url: "https://openai.com/api" },
  { name: "CmapTools", description: "Concept mapping software for organizing and sharing knowledge", startingPrice: "Free", axis: "magic", month: 5, year: 2024, url: "https://cmap.ihmc.us" },
  { name: "NotebookLM", description: "AI-powered research notebook that synthesizes your sources", startingPrice: "Free", axis: "magic", month: 11, year: 2024, url: "https://notebooklm.google.com" },

  // CALM — Workflows & Productivity
  { name: "Lovable", description: "AI editor for creating and modifying web applications", startingPrice: "Free tier", axis: "calm", month: 12, year: 2024, url: "https://lovable.dev" },
  { name: "GumLoop", description: "AI automation framework for building intelligent workflows", startingPrice: "Free tier", axis: "calm", month: 7, year: 2024, url: "https://www.gumloop.com" },
  { name: "Base44", description: "AI-powered no-code platform for building web apps", startingPrice: "Free tier", axis: "calm", month: 8, year: 2024, url: "https://base44.com" },
  { name: "Read.ai", description: "AI meeting intelligence — summaries, transcripts, and action items", startingPrice: "Free tier", axis: "calm", month: 1, year: 2025, url: "https://read.ai" },
  { name: "ActiveInbox", description: "Gmail workflow tool — turn emails into tasks with GTD principles", startingPrice: "$4.16/mo", axis: "calm", month: 3, year: 2025, url: "https://activeinboxhq.com" },
  { name: "ClickUp", description: "All-in-one project management with docs, goals, and automation", startingPrice: "Free tier", axis: "calm", month: 2, year: 2025, url: "https://clickup.com" },

  // OPEN — Systems & Knowledge
  { name: "n8n", description: "Workflow automation platform with MCP integration", startingPrice: "Free (self-host)", axis: "open", month: 5, year: 2024, url: "https://n8n.io" },
  { name: "LangChain", description: "Building applications with LLMs through composability", startingPrice: "Free (open source)", axis: "open", month: 3, year: 2024, url: "https://langchain.com" },
  { name: "Supabase", description: "Open source Firebase alternative with auth and database", startingPrice: "Free tier", axis: "open", month: 1, year: 2024, url: "https://supabase.com" },
  { name: "SharePoint", description: "Microsoft's collaborative platform for document management", startingPrice: "$5/user/mo", axis: "open", month: 6, year: 2024, url: "https://microsoft.com/sharepoint" },
  { name: "Teams", description: "Microsoft's communication and collaboration platform", startingPrice: "Free tier", axis: "open", month: 6, year: 2024, url: "https://microsoft.com/teams" },
  { name: "Wolfram Alpha", description: "Computational knowledge engine for math, science, and data", startingPrice: "Free tier", axis: "open", month: 9, year: 2024, url: "https://wolframalpha.com" },

  // FREE — Creative & Worldbuilding
  { name: "Axure", description: "Advanced prototyping and wireframing for UX professionals", startingPrice: "$29/mo", axis: "free", month: 4, year: 2024, url: "https://axure.com" },
  { name: "Antigravity", description: "Creative tool for exploring ideas beyond conventional constraints", startingPrice: "Free", axis: "free", month: 12, year: 2024, url: "https://antigravity.dev" },
  { name: "Calm Magic Synthesis", description: "Interactive synthesis app for the Calm Magic methodology and learning organization frameworks", startingPrice: "Free", axis: "calm", month: 3, year: 2026, url: "https://calm-magic-synthesis.lovable.app" },
  { name: "Paracosm Platform", description: "Creative ecosystem platform for applied poetry, transmedia storytelling, and experience architecture", startingPrice: "Free", axis: "free", month: 3, year: 2026, url: "https://paracosm.helloarchitekt.com" },
];
