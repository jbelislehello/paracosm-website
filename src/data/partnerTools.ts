
export interface PartnerTool {
  name: string;
  description: string;
  url: string;
  category: 'voice' | 'mcp' | 'ai' | 'database' | 'development' | 'integration' | 'collaboration';
  logo?: string;
}

export const partnerTools: PartnerTool[] = [
  // ═══════════════════════════════════════════════════════════════
  // VOICE COMPUTING & AFFECTIVE COMPUTING
  // ═══════════════════════════════════════════════════════════════
  {
    name: "Tonalli",
    description: "Dignity-first voice companion with Wuxia the Fox - 64-tile story matrix",
    url: "https://paracosm.it/tonalli",
    category: "voice",
  },
  {
    name: "Muse",
    description: "Brain-sensing headband for meditation and neurofeedback",
    url: "https://choosemuse.com",
    category: "voice",
  },
  {
    name: "Hume AI",
    description: "Empathic AI that understands emotional expression in voice",
    url: "https://hume.ai",
    category: "voice",
  },
  {
    name: "Sesame",
    description: "AI voice model for natural and expressive speech synthesis",
    url: "https://www.sesame.com",
    category: "voice",
  },
  {
    name: "ElevenLabs",
    description: "AI voice synthesis, text-to-speech, and voice cloning",
    url: "https://elevenlabs.io",
    category: "voice",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // MCP (Model Context Protocol)
  // ═══════════════════════════════════════════════════════════════
  {
    name: "Lovable",
    description: "AI editor for creating and modifying web applications",
    url: "https://lovable.dev",
    category: "mcp",
  },
  {
    name: "GumLoop",
    description: "AI automation framework for building intelligent workflows",
    url: "https://www.gumloop.com",
    category: "mcp",
  },
  {
    name: "Base44",
    description: "AI-powered no-code platform for building web apps",
    url: "https://base44.com",
    category: "mcp",
  },
  {
    name: "n8n",
    description: "Workflow automation platform with MCP integration",
    url: "https://n8n.io",
    category: "mcp",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // AI
  // ═══════════════════════════════════════════════════════════════
  {
    name: "GPT Trainer",
    description: "AI training and fine-tuning services API",
    url: "https://gpttrainer.com",
    category: "ai",
  },
  {
    name: "OpenAI APIs",
    description: "Powerful AI models and services",
    url: "https://openai.com/api",
    category: "ai",
  },
  {
    name: "Python AI",
    description: "Python libraries and frameworks for AI development",
    url: "https://python.org",
    category: "ai",
  },
  {
    name: "LangChain",
    description: "Building applications with LLMs through composability",
    url: "https://langchain.com",
    category: "ai",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // DATABASE
  // ═══════════════════════════════════════════════════════════════
  {
    name: "Supabase",
    description: "Open source Firebase alternative with authentication and database tools",
    url: "https://supabase.com",
    category: "database",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // COLLABORATION
  // ═══════════════════════════════════════════════════════════════
  {
    name: "SharePoint",
    description: "Microsoft's collaborative platform for document management",
    url: "https://microsoft.com/sharepoint",
    category: "collaboration",
  },
  {
    name: "Teams",
    description: "Microsoft's communication and collaboration platform",
    url: "https://microsoft.com/teams",
    category: "collaboration",
  }
];
