
export interface PartnerTool {
  name: string;
  description: string;
  url: string;
  category: 'ai' | 'database' | 'development' | 'integration' | 'collaboration';
  logo?: string;
}

export const partnerTools: PartnerTool[] = [
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
    name: "Lovable.dev",
    description: "AI editor for creating and modifying web applications",
    url: "https://lovable.dev",
    category: "development",
  },
  {
    name: "Supabase",
    description: "Open source Firebase alternative with authentication and database tools",
    url: "https://supabase.com",
    category: "database",
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
  {
    name: "n8n",
    description: "Workflow automation platform",
    url: "https://n8n.io",
    category: "integration",
  },
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
