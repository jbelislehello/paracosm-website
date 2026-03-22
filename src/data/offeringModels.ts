export interface TaskStep {
  id: string;
  label: string;
  description: string;
  duration?: string;
}

export interface MentalModel {
  stages: string[];
  description: string;
}

export interface OfferingModel {
  id: string;
  name: string;
  tier: 'spring' | 'deep';
  tagline: string;
  mentalModel: MentalModel;
  taskModel: TaskStep[];
  observatoryTiers: {
    magic: string;
    calm: string;
    free: string;
  };
  route?: string;
  price?: string;
}

export const offeringModels: OfferingModel[] = [
  {
    id: 'clarity-reset',
    name: 'Clarity Reset',
    tier: 'spring',
    tagline: '7 days from confusion to clear decision',
    price: '$800 USD',
    route: '/calm-magic-assistant#spring-offer',
    mentalModel: {
      stages: ['Confusion', 'Facts / Assumptions / Emotions', 'Decision'],
      description: 'Strip away noise. Separate facts from assumptions from emotional distortions. Arrive at 1-3 executable decisions.',
    },
    taskModel: [
      { id: 'cr-1', label: 'Diagnostic Call', description: '45-min call to map where you\'re stuck and what decision you\'re avoiding', duration: '45 min' },
      { id: 'cr-2', label: 'Situation Deconstruction', description: 'Break your situation into facts, assumptions, emotional distortions, and system dynamics', duration: '2-3 days' },
      { id: 'cr-3', label: 'Decision Delivery', description: 'Receive 1-3 clear, executable decisions with a reframed narrative', duration: 'Day 5' },
      { id: 'cr-4', label: 'Follow-up Check', description: 'One async follow-up to adjust decisions and prevent drift', duration: 'Day 7' },
    ],
    observatoryTiers: {
      magic: 'Vision alignment — validate strategic intent behind the decision',
      calm: 'Trust baseline — ensure the decision feels safe to execute',
      free: 'No infrastructure required — pure coaching intervention',
    },
  },
  {
    id: 'decision-sprint',
    name: 'Decision Sprint',
    tier: 'spring',
    tagline: '14 days of AI-augmented strategic intervention',
    price: '$1,500 USD',
    route: '/calm-magic-assistant#spring-offer',
    mentalModel: {
      stages: ['Confusion', 'AI Pattern Analysis', 'Facts / Assumptions / Emotions', 'Accountability Loop', 'Decision'],
      description: 'Add AI pattern recognition and scenario generation to the clarity process. Stay accountable through a 14-day execution loop.',
    },
    taskModel: [
      { id: 'ds-1', label: 'Deep Diagnostic', description: '60-min diagnostic call with AI-assisted pattern mapping', duration: '60 min' },
      { id: 'ds-2', label: 'AI Pattern Layer', description: 'AI-augmented analysis surfaces hidden patterns and scenario modeling', duration: 'Days 2-5' },
      { id: 'ds-3', label: 'Decision Architecture', description: 'Co-create 1-3 decisions with clear execution paths', duration: 'Days 6-8' },
      { id: 'ds-4', label: 'Execution Loop', description: '3 follow-up calls to adjust decisions, prevent emotional drift, maintain accountability', duration: 'Days 8-14' },
      { id: 'ds-5', label: 'Closure & Handoff', description: 'Final synthesis and forward-looking roadmap', duration: 'Day 14' },
    ],
    observatoryTiers: {
      magic: 'AI literacy gap assessment — ensure readiness for AI-augmented thinking',
      calm: 'Cognitive load monitoring — track mental model shifts during the sprint',
      free: 'AI tooling setup — configure pattern analysis and scenario generation tools',
    },
  },
  {
    id: 'strategic-intervention',
    name: 'Strategic Intervention',
    tier: 'spring',
    tagline: 'Ongoing retainer for complex organizational decisions',
    price: '$2,800 USD / month',
    route: '/calm-magic-assistant#spring-offer',
    mentalModel: {
      stages: ['Confusion', 'System Mapping', 'AI Analysis', 'PRD Prototyping', 'Narrative Reframing', 'Continuous Decision'],
      description: 'Full Calm Magic Board access. PRD prototyping. Ongoing relational and strategic support for organizations navigating AI transformation.',
    },
    taskModel: [
      { id: 'si-1', label: 'Onboarding & System Map', description: 'Map organizational tensions, cognitive load, and decision bottlenecks', duration: 'Week 1' },
      { id: 'si-2', label: 'Board Access & POLEN Capture', description: 'Access the Calm Magic Board to capture signals across 5 seasons', duration: 'Ongoing' },
      { id: 'si-3', label: 'PRD Generation', description: 'Auto-generate living PRDs from captured signals for AI product initiatives', duration: 'As needed' },
      { id: 'si-4', label: 'Weekly Strategy Calls', description: 'Weekly 45-min calls for decision review and narrative adjustment', duration: 'Weekly' },
      { id: 'si-5', label: 'Observatory Access', description: 'Full 3-tier AI Observatory monitoring for strategic, experiential, and infrastructure readiness', duration: 'Continuous' },
    ],
    observatoryTiers: {
      magic: 'Full strategic alignment — organizational AI maturity assessment and governance',
      calm: 'UX/IXD design systems — ensure human experience intelligence across all initiatives',
      free: 'Infrastructure orchestration — deployment, monitoring, and model evaluation',
    },
  },
  {
    id: 'inner-life',
    name: 'Inner Life Coaching',
    tier: 'deep',
    tagline: 'Deep relational intelligence for personal transformation',
    route: '/calm-magic-assistant',
    mentalModel: {
      stages: ['Self-Awareness', 'Shadow Integration', 'Relational Clarity', 'Aligned Action'],
      description: 'Navigate inner complexity to build authentic leadership capacity. Work with emotional patterns, identity, and relational dynamics.',
    },
    taskModel: [
      { id: 'il-1', label: 'Initial Assessment', description: 'Map emotional landscape and relational patterns', duration: 'Session 1' },
      { id: 'il-2', label: 'Shadow Work', description: 'Identify and integrate shadow patterns blocking growth', duration: 'Sessions 2-4' },
      { id: 'il-3', label: 'Relational Mapping', description: 'Understand system dynamics in key relationships', duration: 'Sessions 5-6' },
      { id: 'il-4', label: 'Integration', description: 'Build sustainable practices for ongoing self-awareness', duration: 'Sessions 7-8' },
    ],
    observatoryTiers: {
      magic: 'Personal vision alignment — connect inner work to strategic purpose',
      calm: 'Trust & vulnerability — build capacity for authentic relating',
      free: 'No infrastructure — relational coaching methodology',
    },
  },
  {
    id: 'creative-relationship',
    name: 'Creative Relationship',
    tier: 'deep',
    tagline: 'Transform team dynamics through creative collaboration',
    route: '/calm-magic-assistant',
    mentalModel: {
      stages: ['Team Mapping', 'Creative Tension', 'Shared Vision', 'Co-Creation'],
      description: 'Use creative processes to unlock team potential. Move from dysfunction to generative collaboration through arts-based methods.',
    },
    taskModel: [
      { id: 'tcr-1', label: 'Team Diagnostic', description: 'Assess team dynamics, communication patterns, and creative blocks', duration: 'Day 1' },
      { id: 'tcr-2', label: 'Creative Workshop', description: 'Facilitated creative exercises to surface tensions and possibilities', duration: 'Days 2-3' },
      { id: 'tcr-3', label: 'Vision Co-Design', description: 'Co-create shared team vision and operating principles', duration: 'Day 4' },
      { id: 'tcr-4', label: 'Integration Plan', description: 'Practical plan for sustaining new team dynamics', duration: 'Day 5' },
    ],
    observatoryTiers: {
      magic: 'Shared vision — align team around collective intention',
      calm: 'Behavioral feedback loops — track how team interactions evolve',
      free: 'Collaboration tooling — set up systems that support new dynamics',
    },
  },
];

export const journeyStages = [
  {
    id: 'discover',
    label: 'Discover',
    tier: 'magic' as const,
    touchpoints: [
      { label: 'Landing Page', route: '/' },
      { label: 'Onboarding Guide', route: '/' },
      { label: 'Need Assessment', route: '/' },
    ],
  },
  {
    id: 'engage',
    label: 'Engage',
    tier: 'magic' as const,
    touchpoints: [
      { label: 'Spring Offer', route: '/calm-magic-assistant#spring-offer' },
      { label: 'Discovery Call', route: 'mailto:jbelisle@helloarchitekt.com?subject=Discovery%20Call' },
      { label: 'Diagnostic Session', route: '/calm-magic-assistant' },
    ],
  },
  {
    id: 'build',
    label: 'Build',
    tier: 'calm' as const,
    touchpoints: [
      { label: 'Calm Magic Board', route: '/calm-magic-board' },
      { label: 'POLEN Capture', route: '/calm-magic-board' },
      { label: 'PRD Generation', route: '/calm-magic-board' },
      { label: 'Service Blueprint', route: '/calm-magic-board' },
    ],
  },
  {
    id: 'observe',
    label: 'Observe',
    tier: 'calm' as const,
    touchpoints: [
      { label: 'AI Observatory', route: '/calm-magic-board' },
      { label: 'Task Tracking', route: '/calm-magic-board' },
      { label: 'De-risking Actions', route: '/calm-magic-board' },
    ],
  },
  {
    id: 'evolve',
    label: 'Evolve',
    tier: 'free' as const,
    touchpoints: [
      { label: 'Drift Journal', route: '/drift' },
      { label: 'Pattern Encyclopedia', route: '/pattern-encyclopedia' },
      { label: 'Learning Loops', route: '/calm-magic-board' },
    ],
  },
];

export const designSystemColors = [
  { name: 'Primary', variable: '--primary', description: 'Main brand color' },
  { name: 'Secondary', variable: '--secondary', description: 'Supporting color' },
  { name: 'Accent', variable: '--accent', description: 'Highlight and emphasis' },
  { name: 'Muted', variable: '--muted', description: 'Subtle backgrounds' },
  { name: 'Destructive', variable: '--destructive', description: 'Error and danger states' },
  { name: 'Card', variable: '--card', description: 'Card surfaces' },
  { name: 'Popover', variable: '--popover', description: 'Floating surfaces' },
  { name: 'Background', variable: '--background', description: 'Page background' },
  { name: 'Foreground', variable: '--foreground', description: 'Primary text' },
  { name: 'Border', variable: '--border', description: 'Borders and dividers' },
];
