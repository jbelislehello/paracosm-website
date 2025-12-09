// 5 Compasses System for Calm Magic Journal
// Each compass provides a different lens for tile interpretation

import { CompassType, JourneyMode } from '@/types/journal-expansion';

export interface CompassContent {
  id: CompassType;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  magicLetter: string; // M-A-G-I-C
  magicMeaning: string;
  relationalPrompt: string; // For relational design journey
  productPrompt: string; // For product design journey
  practices: string[];
}

export const COMPASS_CONTENT: Record<CompassType, CompassContent> = {
  'narrative': {
    id: 'narrative',
    name: 'Narrative Compass',
    icon: 'BookOpen',
    description: 'The storytelling lens—how does this become a story worth telling?',
    magicLetter: 'M',
    magicMeaning: 'Mindset',
    relationalPrompt: 'What story is this relationship telling? What story does it want to become?',
    productPrompt: 'What story does this product tell? What transformation narrative does it enable?',
    practices: [
      'Identify the hero of this story',
      'Name the transformation being offered',
      'Find the emotional arc',
      'Discover the anthem/tagline'
    ]
  },
  'workflow': {
    id: 'workflow',
    name: 'Workflow Compass',
    icon: 'GitBranch',
    description: 'The process lens—how does this actually work in practice?',
    magicLetter: 'A',
    magicMeaning: 'Agilities',
    relationalPrompt: 'What are the rituals and rhythms that sustain this relationship?',
    productPrompt: 'What is the user journey? What are the key interaction loops?',
    practices: [
      'Map the current state flow',
      'Identify friction points',
      'Design the ideal loop',
      'Build in feedback mechanisms'
    ]
  },
  'inquiry': {
    id: 'inquiry',
    name: 'Inquiry & Practices Compass',
    icon: 'HelpCircle',
    description: 'The questions lens—what practices and questions open new understanding?',
    magicLetter: 'G',
    magicMeaning: 'Goal',
    relationalPrompt: 'What question, if we sat with it together, would transform this relationship?',
    productPrompt: 'What question is this product answering? What practice does it enable?',
    practices: [
      'Surface the unasked questions',
      'Design generative inquiries',
      'Create practice scaffolds',
      'Build reflection rituals'
    ]
  },
  'playground': {
    id: 'playground',
    name: 'Playground Compass',
    icon: 'Sparkles',
    description: 'The experimentation lens—what can we try, play with, prototype?',
    magicLetter: 'I',
    magicMeaning: 'Intuition',
    relationalPrompt: 'What would be fun to try together? Where can we play?',
    productPrompt: 'What can we prototype quickly? What experiments would teach us most?',
    practices: [
      'Lower the stakes for trying',
      'Design small safe experiments',
      'Celebrate learning from failure',
      'Create permission to play'
    ]
  },
  'human-systems': {
    id: 'human-systems',
    name: 'Human Dynamics & Systems Compass',
    icon: 'Users',
    description: 'The systemic lens—how do humans and systems interact here?',
    magicLetter: 'C',
    magicMeaning: 'Compasses',
    relationalPrompt: 'What system dynamics are shaping this relationship? Who else is affected?',
    productPrompt: 'What is the ecosystem? How do stakeholders, incentives, and structures interact?',
    practices: [
      'Map the stakeholder system',
      'Identify feedback loops',
      'Trace unintended consequences',
      'Design for systemic health'
    ]
  }
};

// Get compass prompt based on journey mode
export function getCompassPrompt(compass: CompassType, mode: JourneyMode): string {
  const content = COMPASS_CONTENT[compass];
  return mode === 'relational' ? content.relationalPrompt : content.productPrompt;
}

// Get all compasses as array
export function getAllCompasses(): CompassContent[] {
  return Object.values(COMPASS_CONTENT);
}

// MAGIC acronym order
export const MAGIC_COMPASS_ORDER: CompassType[] = [
  'narrative',    // M - Mindset
  'workflow',     // A - Agilities
  'inquiry',      // G - Goal
  'playground',   // I - Intuition
  'human-systems' // C - Compasses
];
