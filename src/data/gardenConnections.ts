export interface GardenConnection {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'voice' | 'mcp' | 'knowledge' | 'export';
  color: string;
  gradient: string;
  url?: string;
  action?: string;
}

export const GARDEN_CONNECTIONS: GardenConnection[] = [
  {
    id: 'tonalli',
    name: 'Tonalli',
    icon: '🦊',
    description: 'Connect to Wuxia the Fox & 64-Tile Story Matrix',
    category: 'voice',
    color: 'text-amber-500',
    gradient: 'from-amber-500 to-orange-500',
    url: 'https://paracosm.it/tonalli',
    action: 'formatForTonalli',
  },
  {
    id: 'n8n',
    name: 'n8n Workflows',
    icon: '⚡',
    description: 'Automate PRD with workflow triggers',
    category: 'mcp',
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-green-500',
    action: 'connectMcp',
  },
  {
    id: 'owl-rdf',
    name: 'OWL/RDF Export',
    icon: '🦉',
    description: 'Export as semantic web ontology',
    category: 'knowledge',
    color: 'text-violet-500',
    gradient: 'from-violet-500 to-purple-500',
    action: 'exportToOWL',
  },
  {
    id: 'notion',
    name: 'Notion Sync',
    icon: '📝',
    description: 'Sync garden fragments to Notion pages',
    category: 'mcp',
    color: 'text-gray-600',
    gradient: 'from-gray-500 to-slate-500',
    action: 'connectMcp',
  },
  {
    id: 'lovable',
    name: 'Lovable',
    icon: '💖',
    description: 'Generate app with Foundational Prompt',
    category: 'mcp',
    color: 'text-rose-500',
    gradient: 'from-rose-500 to-pink-500',
    action: 'copyForLovable',
  },
];

export interface GardenActivity {
  id: string;
  name: string;
  icon: string;
  description: string;
  loveAxis: string;
  color: string;
  gradient: string;
  action: string;
}

export const GARDEN_ACTIVITIES: GardenActivity[] = [
  {
    id: 'seed',
    name: 'Seed',
    icon: '🌱',
    description: 'Plant new project branches from your ANTHEM',
    loveAxis: 'LOVE (Aliveness)',
    color: 'text-rose-500',
    gradient: 'from-rose-500 to-pink-500',
    action: 'createBranch',
  },
  {
    id: 'water',
    name: 'Water',
    icon: '💧',
    description: 'Nurture MCP connections',
    loveAxis: 'MAGIC (Spaciousness)',
    color: 'text-violet-500',
    gradient: 'from-violet-500 to-purple-500',
    action: 'nurtureMcp',
  },
  {
    id: 'prune',
    name: 'Prune',
    icon: '✂️',
    description: 'Refine your Foundational Prompt',
    loveAxis: 'CALM (Wholeness)',
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    action: 'refinePrompt',
  },
  {
    id: 'grow',
    name: 'Grow',
    icon: '🌳',
    description: 'Extend to new systems (OWL/RDF)',
    loveAxis: 'OPEN (Transformation)',
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-teal-500',
    action: 'extendSystems',
  },
];

export interface GardenTheme {
  id: 'intelligence' | 'systems' | 'prototypes';
  name: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  treeStyle: 'oak' | 'circuit' | 'sapling';
  backgroundType: 'neural' | 'mechanical' | 'greenhouse';
}

export const GARDEN_THEMES: Record<string, GardenTheme> = {
  intelligence: {
    id: 'intelligence',
    name: 'Garden of Intelligence',
    icon: '🧠',
    primaryColor: '#2563eb',
    secondaryColor: '#06b6d4',
    gradient: 'from-blue-500 to-cyan-500',
    treeStyle: 'oak',
    backgroundType: 'neural',
  },
  systems: {
    id: 'systems',
    name: 'Garden of Systems',
    icon: '⚙️',
    primaryColor: '#7c3aed',
    secondaryColor: '#a1a1aa',
    gradient: 'from-violet-500 to-slate-500',
    treeStyle: 'circuit',
    backgroundType: 'mechanical',
  },
  prototypes: {
    id: 'prototypes',
    name: 'Garden of Prototypes',
    icon: '🌱',
    primaryColor: '#db2777',
    secondaryColor: '#10b981',
    gradient: 'from-pink-500 to-emerald-500',
    treeStyle: 'sapling',
    backgroundType: 'greenhouse',
  },
};
