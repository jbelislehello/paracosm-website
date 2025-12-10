export type ModeType = 'personal' | 'professional';

export interface ModeContent {
  boardTitle: string;
  boardDescription: string;
  journeyPrompt: string;
  language: {
    glitch: string;
    drift: string;
    tune: string;
  };
  ctaText: string;
  entryDescription: string;
}

export const MODE_CONTENT: Record<ModeType, ModeContent> = {
  personal: {
    boardTitle: "Calm Magic Expansion Journal",
    boardDescription: "A sacred space for poiesis and expressivity — where your inner landscape meets creative emergence",
    journeyPrompt: "What feels alive or off in your inner landscape?",
    language: {
      glitch: "What tension is arising in you?",
      drift: "How might you dance with this emergence?",
      tune: "What wants to crystallize into form?"
    },
    ctaText: "Begin Your Inner Journey",
    entryDescription: "Explore relational intelligence, embodiment, and somatic creativity through the Calm Magic framework"
  },
  professional: {
    boardTitle: "Calm Magic PRD Engine",
    boardDescription: "Transform organizational glitches into actionable requirements through living documentation",
    journeyPrompt: "What friction exists in your product, team, or system?",
    language: {
      glitch: "What problem needs attention?",
      drift: "What solutions are worth exploring?",
      tune: "What specifications should we commit to?"
    },
    ctaText: "Generate Living PRD",
    entryDescription: "Bridge the gap between creative vision and technical implementation with our comprehensive PRD framework"
  }
};

export const MODE_THEMES = {
  personal: {
    primary: 'rose',
    secondary: 'purple',
    gradient: 'from-rose-500 to-purple-600',
    bgGradient: 'from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20'
  },
  professional: {
    primary: 'blue',
    secondary: 'purple',
    gradient: 'from-blue-500 to-purple-600',
    bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20'
  }
};

export const CALM_MAGIC_PHASES_BY_MODE = {
  personal: {
    glitch: { name: "Sensing", description: "What's arising in your field?" },
    drift: { name: "Exploring", description: "Dancing with possibilities" },
    tune: { name: "Embodying", description: "Giving form to emergence" }
  },
  professional: {
    glitch: { name: "Problem Discovery", description: "Identifying frictions and tensions" },
    drift: { name: "Solution Exploration", description: "Mapping the possibility space" },
    tune: { name: "Specification", description: "Committing to requirements" }
  }
};

export const JOURNEY_MODES_DESCRIPTION = {
  personal: {
    title: "Relational Design Journey",
    subtitle: "Inner work & interpersonal dynamics",
    focus: ["Self-awareness", "Emotional intelligence", "Relational patterns", "Embodied knowing"],
    outcome: "Expanded window of tolerance and relational coherence"
  },
  professional: {
    title: "Product Design Journey", 
    subtitle: "Vision to implementation",
    focus: ["Problem definition", "Stakeholder alignment", "Technical requirements", "Living PRD"],
    outcome: "Actionable PRD with preserved creative vision"
  }
};
