
/**
 * Agent gardens configuration and utilities
 */

import { Garden } from './ForceDynamics';

export const createInitialGardens = (): Garden[] => [
  { 
    key: 'intelligence', 
    name: 'COGNITIVE AGENTS', 
    color: '#2563eb', 
    icon: '🧠',
    x: window.innerWidth * 0.25,
    y: window.innerHeight * 0.35,
    baseRadius: 60,
    currentRadius: 60,
    pulsePhase: 0,
    attractionRadius: 150,
    velocityX: 0.3,
    velocityY: 0.2,
    connectionCount: 0,
    glowIntensity: 1,
    state: 'dormant' as 'dormant' | 'active' | 'resonating' | 'expanding',
    lastExpansionTime: 0,
    activityLevel: 0
  },
  { 
    key: 'systems', 
    name: 'ORCHESTRATION', 
    color: '#7c3aed', 
    icon: '⚙️',
    x: window.innerWidth * 0.75,
    y: window.innerHeight * 0.35,
    baseRadius: 60,
    currentRadius: 60,
    pulsePhase: Math.PI / 3,
    attractionRadius: 150,
    velocityX: -0.25,
    velocityY: 0.3,
    connectionCount: 0,
    glowIntensity: 1,
    state: 'dormant' as 'dormant' | 'active' | 'resonating' | 'expanding',
    lastExpansionTime: 0,
    activityLevel: 0
  },
  { 
    key: 'prototypes', 
    name: 'BEHAVIORAL MODELS', 
    color: '#db2777', 
    icon: '🌱',
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.65,
    baseRadius: 60,
    currentRadius: 60,
    pulsePhase: Math.PI * 2 / 3,
    attractionRadius: 150,
    velocityX: 0.2,
    velocityY: -0.25,
    connectionCount: 0,
    glowIntensity: 1,
    state: 'dormant' as 'dormant' | 'active' | 'resonating' | 'expanding',
    lastExpansionTime: 0,
    activityLevel: 0
  }
];

export const forces = [
  { key: 'love', name: 'EMPATHY', color: '#ef4444' },
  { key: 'magic', name: 'EMERGENCE', color: '#8b5cf6' },
  { key: 'calm', name: 'STABILITY', color: '#06b6d4' },
  { key: 'open', name: 'TRANSPARENCY', color: '#10b981' },
  { key: 'free', name: 'AUTONOMY', color: '#f59e0b' }
];

export const gardenPhrases = {
  intelligence: [
    'AGENT REASONING ACTIVE',
    'NEURAL PATTERNS FORMING',
    'COGNITIVE LOOPS ENGAGED',
    'LEARNING ALGORITHMS ACTIVE',
    'DECISION TREES GROWING',
    'INTELLIGENCE EMERGING'
  ],
  systems: [
    'ORCHESTRATION LAYER ACTIVE',
    'AGENT COORDINATION ONLINE',
    'WORKFLOW AUTOMATION ACTIVE',
    'SYSTEM INTEGRATION FLOWING',
    'AGENT MESH FORMING',
    'COORDINATION PROTOCOLS ACTIVE'
  ],
  prototypes: [
    'BEHAVIORAL MODELS EVOLVING',
    'AGENT PERSONAS FORMING',
    'INTERACTION PATTERNS EMERGING',
    'USER EXPERIENCE ADAPTING',
    'BEHAVIOR TREES GROWING',
    'AGENT PERSONALITIES EMERGING'
  ]
};

export const multiGardenPhrases = [
  'AGENTIC ECOSYSTEM ONLINE',
  'COLLECTIVE INTELLIGENCE ACTIVE',
  'SWARM BEHAVIOR EMERGING',
  'AGENT NETWORK RESONATING',
  'ECOSYSTEM HARMONY ACHIEVED',
  'MULTI-AGENT SYNERGY'
];

export const newGardenColors = ['#14b8a6', '#f97316', '#84cc16', '#06b6d4', '#8b5cf6'];
export const newGardenIcons = ['🤖', '🔮', '⭐', '💫', '🌟'];

export const createNewGarden = (x: number, y: number, gardenCounter: number): Garden => {
  const colorIndex = gardenCounter % newGardenColors.length;
  return {
    key: `agent_${Date.now()}`,
    name: `AGENT ${gardenCounter + 1}`,
    color: newGardenColors[colorIndex],
    icon: newGardenIcons[colorIndex],
    x: x,
    y: y,
    baseRadius: 50,
    currentRadius: 50,
    pulsePhase: Math.random() * Math.PI * 2,
    attractionRadius: 130,
    velocityX: (Math.random() - 0.5) * 0.4,
    velocityY: (Math.random() - 0.5) * 0.4,
    connectionCount: 0,
    glowIntensity: 1,
    state: 'active' as 'dormant' | 'active' | 'resonating' | 'expanding',
    lastExpansionTime: Date.now(),
    activityLevel: 5
  };
};

export const drawGardenInternalLogic = (ctx: CanvasRenderingContext2D, garden: Garden) => {
  if (garden.state === 'dormant') return;

  const time = Date.now() * 0.001;
  ctx.globalAlpha = 0.6;
  
  if (garden.key === 'intelligence') {
    // Neural network pattern
    for (let i = 0; i < 3; i++) {
      const angle = time + (i * Math.PI * 2 / 3);
      const x = garden.x + Math.cos(angle) * (garden.currentRadius * 0.3);
      const y = garden.y + Math.sin(angle) * (garden.currentRadius * 0.3);
      ctx.fillStyle = garden.color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (garden.key === 'systems') {
    // Orchestration pattern
    ctx.strokeStyle = garden.color;
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(garden.x, garden.y);
    ctx.rotate(time);
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, -garden.currentRadius * 0.2);
      ctx.lineTo(0, -garden.currentRadius * 0.4);
      ctx.stroke();
      ctx.rotate(Math.PI / 3);
    }
    ctx.restore();
  } else if (garden.key === 'prototypes') {
    // Behavioral modeling pattern
    for (let i = 0; i < 5; i++) {
      const size = (Math.sin(time + i) + 1) * 2;
      ctx.fillStyle = garden.color;
      ctx.beginPath();
      ctx.arc(
        garden.x + Math.cos(i * 1.26) * (garden.currentRadius * 0.3),
        garden.y + Math.sin(i * 1.26) * (garden.currentRadius * 0.3),
        size,
        0, Math.PI * 2
      );
      ctx.fill();
    }
  } else {
    // Generic agent pattern for new agents
    for (let i = 0; i < 4; i++) {
      const angle = time + (i * Math.PI / 2);
      const x = garden.x + Math.cos(angle) * (garden.currentRadius * 0.25);
      const y = garden.y + Math.sin(angle) * (garden.currentRadius * 0.25);
      ctx.fillStyle = garden.color;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.globalAlpha = 1;
};
