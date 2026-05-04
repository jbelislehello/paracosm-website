
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

// All previously curated partner tools are now grouped under the
// April 2026 Drift edition ("Relationship Model"), organized by axis.
export const driftTools: DriftTool[] = [
  // LOVE — Voice & Affective Computing
  { name: "Tonalli", description: "Dignity-first voice companion with Wuxia the Fox — 64-tile story matrix", startingPrice: "Custom", axis: "love", month: 4, year: 2026, url: "https://paracosm.it/tonalli" },
  { name: "Muse", description: "Brain-sensing headband for meditation and neurofeedback", startingPrice: "$249", axis: "love", month: 4, year: 2026, url: "https://choosemuse.com" },
  { name: "Hume AI", description: "Empathic AI that understands emotional expression in voice", startingPrice: "Free tier", axis: "love", month: 4, year: 2026, url: "https://hume.ai" },
  { name: "Sesame", description: "AI voice model for natural and expressive speech synthesis", startingPrice: "Free", axis: "love", month: 4, year: 2026, url: "https://www.sesame.com" },
  { name: "ElevenLabs", description: "AI voice synthesis, text-to-speech, and voice cloning", startingPrice: "Free tier", axis: "love", month: 4, year: 2026, url: "https://elevenlabs.io" },
  { name: "Adobe Firefly", description: "Generative AI for images, vectors, and creative design", startingPrice: "Free tier", axis: "love", month: 4, year: 2026, url: "https://firefly.adobe.com" },

  // MAGIC — AI & Sense-Making
  { name: "GPT Trainer", description: "AI training and fine-tuning services API", startingPrice: "$19/mo", axis: "magic", month: 4, year: 2026, url: "https://gpttrainer.com" },
  { name: "OpenAI APIs", description: "Powerful AI models and services for building intelligent apps", startingPrice: "Pay-as-you-go", axis: "magic", month: 4, year: 2026, url: "https://openai.com/api" },
  { name: "CmapTools", description: "Concept mapping software for organizing and sharing knowledge", startingPrice: "Free", axis: "magic", month: 4, year: 2026, url: "https://cmap.ihmc.us" },
  { name: "NotebookLM", description: "AI-powered research notebook that synthesizes your sources", startingPrice: "Free", axis: "magic", month: 4, year: 2026, url: "https://notebooklm.google.com" },

  // CALM — Workflows & Productivity
  { name: "Lovable", description: "AI editor for creating and modifying web applications", startingPrice: "Free tier", axis: "calm", month: 4, year: 2026, url: "https://lovable.dev" },
  { name: "GumLoop", description: "AI automation framework for building intelligent workflows", startingPrice: "Free tier", axis: "calm", month: 4, year: 2026, url: "https://www.gumloop.com" },
  { name: "Base44", description: "AI-powered no-code platform for building web apps", startingPrice: "Free tier", axis: "calm", month: 4, year: 2026, url: "https://base44.com" },
  { name: "Read.ai", description: "AI meeting intelligence — summaries, transcripts, and action items", startingPrice: "Free tier", axis: "calm", month: 4, year: 2026, url: "https://read.ai" },
  { name: "ActiveInbox", description: "Gmail workflow tool — turn emails into tasks with GTD principles", startingPrice: "$4.16/mo", axis: "calm", month: 4, year: 2026, url: "https://activeinboxhq.com" },
  { name: "ClickUp", description: "All-in-one project management with docs, goals, and automation", startingPrice: "Free tier", axis: "calm", month: 4, year: 2026, url: "https://clickup.com" },
  { name: "Calm Magic Synthesis", description: "Interactive synthesis app for the Calm Magic methodology and learning organization frameworks", startingPrice: "Free", axis: "calm", month: 4, year: 2026, url: "https://calm-magic-synthesis.lovable.app" },

  // OPEN — Systems & Knowledge
  { name: "n8n", description: "Workflow automation platform with MCP integration", startingPrice: "Free (self-host)", axis: "open", month: 4, year: 2026, url: "https://n8n.io" },
  { name: "LangChain", description: "Building applications with LLMs through composability", startingPrice: "Free (open source)", axis: "open", month: 4, year: 2026, url: "https://langchain.com" },
  { name: "Supabase", description: "Open source Firebase alternative with auth and database", startingPrice: "Free tier", axis: "open", month: 4, year: 2026, url: "https://supabase.com" },
  { name: "SharePoint", description: "Microsoft's collaborative platform for document management", startingPrice: "$5/user/mo", axis: "open", month: 4, year: 2026, url: "https://microsoft.com/sharepoint" },
  { name: "Teams", description: "Microsoft's communication and collaboration platform", startingPrice: "Free tier", axis: "open", month: 4, year: 2026, url: "https://microsoft.com/teams" },
  { name: "Wolfram Alpha", description: "Computational knowledge engine for math, science, and data", startingPrice: "Free tier", axis: "open", month: 4, year: 2026, url: "https://wolframalpha.com" },

  // FREE — Creative & Worldbuilding
  { name: "Axure", description: "Advanced prototyping and wireframing for UX professionals", startingPrice: "$29/mo", axis: "free", month: 4, year: 2026, url: "https://axure.com" },
  { name: "Antigravity", description: "Creative tool for exploring ideas beyond conventional constraints", startingPrice: "Free", axis: "free", month: 4, year: 2026, url: "https://antigravity.dev" },
  { name: "Paracosm Platform", description: "Creative ecosystem platform for applied poetry, transmedia storytelling, and experience architecture", startingPrice: "Free", axis: "free", month: 4, year: 2026, url: "https://paracosm.helloarchitekt.com" },

  // === May 2026 — Tensor Topologies & The Practice of Not Thinking ===
  // CALM — Non-thinking practice grounds
  { name: "Calm Magic Board", description: "The 64-tile board as a rank-3 tensor (8 × 8 × time) — index the field without collapsing it into a single thought", startingPrice: "Free", axis: "calm", month: 5, year: 2026, url: "https://calm-magic.com/calm-magic-board" },
  { name: "Insight Timer", description: "Free meditation library — noting, body scan, and open awareness practices that train invariance", startingPrice: "Free", axis: "calm", month: 5, year: 2026, url: "https://insighttimer.com" },

  // MAGIC — Tensor sense-making
  { name: "PyTorch", description: "The reference tensor library — operate on rank-N fields with autograd; the math behind 'a thought is a basis collapse'", startingPrice: "Free (open source)", axis: "magic", month: 5, year: 2026, url: "https://pytorch.org" },
  { name: "JAX", description: "Composable transformations of tensor functions — vmap, grad, jit. Coordinate-change as a first-class operation", startingPrice: "Free (open source)", axis: "magic", month: 5, year: 2026, url: "https://jax.readthedocs.io" },
  { name: "TensorBoard", description: "Visualize tensor flows, embeddings, and high-dimensional manifolds as you train them", startingPrice: "Free", axis: "magic", month: 5, year: 2026, url: "https://www.tensorflow.org/tensorboard" },

  // LOVE — Embodied invariance
  { name: "Tonalli", description: "Voice as scalar→vector projection — Wuxia the Fox holds the field while components reorganize", startingPrice: "Custom", axis: "love", month: 5, year: 2026, url: "https://paracosm.it/tonalli" },
  { name: "Feldenkrais Project", description: "Open library of Awareness Through Movement lessons — somatic training in coordinate-invariant ease", startingPrice: "Free", axis: "love", month: 5, year: 2026, url: "https://feldenkraisproject.com" },

  // OPEN — Manifold & diagram tools
  { name: "Obsidian Canvas", description: "Lay the manifold out by hand — nodes, edges, and the tensor diagrams of your own thinking", startingPrice: "Free", axis: "open", month: 5, year: 2026, url: "https://obsidian.md/canvas" },
  { name: "Quiver", description: "Modern editor for commutative and tensor diagrams — make the invariance visible", startingPrice: "Free", axis: "open", month: 5, year: 2026, url: "https://q.uiver.app" },

  // FREE — Generative tensor fields
  { name: "TouchDesigner", description: "Node-based environment for live tensor fields, generative geometry, and reactive visuals", startingPrice: "Free (non-commercial)", axis: "free", month: 5, year: 2026, url: "https://derivative.ca" },
  { name: "Hydra", description: "Live-coded video synth — tensor compositions you can rewrite in real time", startingPrice: "Free (open source)", axis: "free", month: 5, year: 2026, url: "https://hydra.ojack.xyz" },
];
