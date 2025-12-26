import { ProjectionMode, GardenType } from '@/hooks/useProjectionEngine';

// Playbook represents a contextual agenda with action sequences
export interface Playbook {
  id: string;
  name: string;
  description: string;
  garden: GardenType;
  mode: ProjectionMode;
  // Sequence of tile IDs that form this playbook journey
  tileSequence: number[];
  // Actions for each step
  actions: PlaybookAction[];
  // Suggested when conditions
  triggerConditions: PlaybookTrigger[];
  // Estimated time
  estimatedMinutes: number;
  // Category for grouping
  category: PlaybookCategory;
}

export type PlaybookCategory = 
  | 'decision'      // For decision-making
  | 'governance'    // For compliance/approvals
  | 'delivery'      // For shipping
  | 'change'        // For change management
  | 'integration';  // For synthesis

export interface PlaybookAction {
  id: string;
  tileId: number;
  label: string;
  description: string;
  actionType: 'reflect' | 'document' | 'decide' | 'communicate' | 'measure';
  prompts: string[];
  // Whether this step is completed
  completed?: boolean;
  // Output from this step
  output?: string;
}

export interface PlaybookTrigger {
  type: 'kpi_low' | 'kpi_high' | 'blocked' | 'milestone' | 'cycle_complete' | 'manual';
  value?: string;
  threshold?: number;
}

export interface PlaybookProgress {
  playbook_id: string;
  user_id: string;
  project_id?: string;
  started_at: string;
  completed_steps: string[];
  current_step_index: number;
  step_outputs: Record<string, string>;
  completed_at?: string;
}

// Get playbooks for a given garden and mode
export function getPlaybooksForContext(garden: GardenType, mode: ProjectionMode): Playbook[] {
  return PLAYBOOK_TEMPLATES.filter(p => 
    p.garden === garden || p.mode === mode
  );
}

// Get suggested playbook based on current landscape
export function getSuggestedPlaybook(
  garden: GardenType, 
  mode: ProjectionMode,
  kpiScores?: Record<string, number>
): Playbook | null {
  const contextPlaybooks = getPlaybooksForContext(garden, mode);
  
  if (contextPlaybooks.length === 0) return null;
  
  // Check for trigger conditions
  for (const playbook of contextPlaybooks) {
    for (const trigger of playbook.triggerConditions) {
      if (trigger.type === 'kpi_low' && kpiScores) {
        const kpiValue = kpiScores[trigger.value || ''];
        if (kpiValue !== undefined && kpiValue < (trigger.threshold || 30)) {
          return playbook;
        }
      }
    }
  }
  
  // Return first matching playbook
  return contextPlaybooks[0];
}

// Playbook Templates - linked to 64 tiles
export const PLAYBOOK_TEMPLATES: Playbook[] = [
  // Strategy Playbooks
  {
    id: 'strategy-clarity',
    name: 'Clarity Sprint',
    description: 'Rapidly align on vision and direction when clarity is low',
    garden: 'intelligence',
    mode: 'strategy',
    category: 'decision',
    estimatedMinutes: 45,
    tileSequence: [1, 5, 9, 13, 17], // Example tile IDs
    triggerConditions: [
      { type: 'kpi_low', value: 'clarity', threshold: 30 }
    ],
    actions: [
      {
        id: 'clarity-1',
        tileId: 1,
        label: 'Surface Assumptions',
        description: 'Document current assumptions about direction',
        actionType: 'reflect',
        prompts: [
          'What do we believe is true about our current path?',
          'What are we assuming about user needs?',
          'What would invalidate our current approach?'
        ]
      },
      {
        id: 'clarity-2',
        tileId: 5,
        label: 'Gather Signals',
        description: 'Collect evidence from the field',
        actionType: 'document',
        prompts: [
          'What data supports our direction?',
          'What signals are we ignoring?',
          'Who disagrees and why?'
        ]
      },
      {
        id: 'clarity-3',
        tileId: 9,
        label: 'Synthesize Direction',
        description: 'Formulate clear next steps',
        actionType: 'decide',
        prompts: [
          'Given the evidence, what is the clearest path forward?',
          'What will we stop doing?',
          'What is our one priority?'
        ]
      },
      {
        id: 'clarity-4',
        tileId: 13,
        label: 'Communicate Decision',
        description: 'Share the direction with stakeholders',
        actionType: 'communicate',
        prompts: [
          'Who needs to know about this decision?',
          'What context do they need?',
          'How will we handle disagreement?'
        ]
      },
      {
        id: 'clarity-5',
        tileId: 17,
        label: 'Set Clarity Metrics',
        description: 'Define how we will measure alignment',
        actionType: 'measure',
        prompts: [
          'How will we know if the team is aligned?',
          'What signals indicate confusion?',
          'When will we check in again?'
        ]
      }
    ]
  },
  
  // Governance Playbooks
  {
    id: 'governance-approval',
    name: 'Approval Flow',
    description: 'Navigate a decision through required gates',
    garden: 'systems',
    mode: 'governance',
    category: 'governance',
    estimatedMinutes: 60,
    tileSequence: [2, 6, 10, 14, 18],
    triggerConditions: [
      { type: 'blocked', value: 'approval' }
    ],
    actions: [
      {
        id: 'approval-1',
        tileId: 2,
        label: 'Draft Policy Alignment',
        description: 'Ensure proposal aligns with existing policies',
        actionType: 'document',
        prompts: [
          'Which policies does this decision touch?',
          'Are there any compliance requirements?',
          'What precedents exist?'
        ]
      },
      {
        id: 'approval-2',
        tileId: 6,
        label: 'Prepare Review Materials',
        description: 'Create the decision package for review',
        actionType: 'document',
        prompts: [
          'What evidence supports this decision?',
          'What are the risks and mitigations?',
          'Who are the stakeholders?'
        ]
      },
      {
        id: 'approval-3',
        tileId: 10,
        label: 'Request Approval',
        description: 'Submit for formal approval',
        actionType: 'communicate',
        prompts: [
          'Who has final authority?',
          'What is the escalation path if blocked?',
          'What is the timeline?'
        ]
      },
      {
        id: 'approval-4',
        tileId: 14,
        label: 'Address Audit Requirements',
        description: 'Document for audit trail',
        actionType: 'document',
        prompts: [
          'What needs to be recorded for audit?',
          'How will this be tracked?',
          'What retention requirements apply?'
        ]
      },
      {
        id: 'approval-5',
        tileId: 18,
        label: 'Release & Communicate',
        description: 'Announce the approved decision',
        actionType: 'communicate',
        prompts: [
          'Who needs to be informed?',
          'What is the effective date?',
          'How will we handle questions?'
        ]
      }
    ]
  },
  
  // Operations Playbooks
  {
    id: 'operations-unblock',
    name: 'Unblock Critical Path',
    description: 'Identify and resolve blockers on the critical path',
    garden: 'systems',
    mode: 'operations',
    category: 'delivery',
    estimatedMinutes: 30,
    tileSequence: [3, 7, 11, 15],
    triggerConditions: [
      { type: 'blocked', value: 'dependency' }
    ],
    actions: [
      {
        id: 'unblock-1',
        tileId: 3,
        label: 'Map Dependencies',
        description: 'Identify all blockers and dependencies',
        actionType: 'reflect',
        prompts: [
          'What is currently blocking progress?',
          'Who owns the blocker?',
          'What is the impact of delay?'
        ]
      },
      {
        id: 'unblock-2',
        tileId: 7,
        label: 'Prioritize Resolution',
        description: 'Determine which blocker to address first',
        actionType: 'decide',
        prompts: [
          'Which blocker has the highest impact?',
          'Which can be resolved fastest?',
          'Can any blockers be worked around?'
        ]
      },
      {
        id: 'unblock-3',
        tileId: 11,
        label: 'Execute Resolution',
        description: 'Take action to remove the blocker',
        actionType: 'communicate',
        prompts: [
          'What specific action will unblock this?',
          'Who needs to be involved?',
          'What is the deadline?'
        ]
      },
      {
        id: 'unblock-4',
        tileId: 15,
        label: 'Verify & Learn',
        description: 'Confirm resolution and capture learnings',
        actionType: 'measure',
        prompts: [
          'Is the blocker fully resolved?',
          'What pattern created this blocker?',
          'How can we prevent similar blockers?'
        ]
      }
    ]
  },
  
  // Delivery Playbooks
  {
    id: 'delivery-milestone',
    name: 'Milestone Review',
    description: 'Assess progress and adjust roadmap at milestones',
    garden: 'prototypes',
    mode: 'delivery',
    category: 'delivery',
    estimatedMinutes: 45,
    tileSequence: [4, 8, 12, 16, 20],
    triggerConditions: [
      { type: 'milestone', value: 'reached' }
    ],
    actions: [
      {
        id: 'milestone-1',
        tileId: 4,
        label: 'Assess Completion',
        description: 'Review what was actually delivered',
        actionType: 'measure',
        prompts: [
          'What was planned vs. delivered?',
          'What quality level was achieved?',
          'What was learned?'
        ]
      },
      {
        id: 'milestone-2',
        tileId: 8,
        label: 'Gather Feedback',
        description: 'Collect stakeholder feedback',
        actionType: 'document',
        prompts: [
          'What do users think?',
          'What do stakeholders think?',
          'What surprised us?'
        ]
      },
      {
        id: 'milestone-3',
        tileId: 12,
        label: 'Identify Risks',
        description: 'Surface risks for the next phase',
        actionType: 'reflect',
        prompts: [
          'What risks emerged?',
          'What risks remain?',
          'What new risks appeared?'
        ]
      },
      {
        id: 'milestone-4',
        tileId: 16,
        label: 'Adjust Roadmap',
        description: 'Update the plan based on learnings',
        actionType: 'decide',
        prompts: [
          'What needs to change in the plan?',
          'What should be cut or added?',
          'What is the new priority?'
        ]
      },
      {
        id: 'milestone-5',
        tileId: 20,
        label: 'Communicate Updates',
        description: 'Share the updated plan',
        actionType: 'communicate',
        prompts: [
          'Who needs to know about changes?',
          'How will we communicate?',
          'What is the new timeline?'
        ]
      }
    ]
  },
  
  // Adoption/Change Playbooks
  {
    id: 'adoption-cycle',
    name: 'Change Cycle',
    description: 'Execute a full adoption cycle to prevent launch-and-forget',
    garden: 'intelligence',
    mode: 'adoption',
    category: 'change',
    estimatedMinutes: 60,
    tileSequence: [21, 25, 29, 33],
    triggerConditions: [
      { type: 'cycle_complete', value: 'launch' }
    ],
    actions: [
      {
        id: 'cycle-1',
        tileId: 21,
        label: 'Training',
        description: 'Ensure users know how to use the change',
        actionType: 'communicate',
        prompts: [
          'Who needs to be trained?',
          'What training format works best?',
          'How will we verify understanding?'
        ]
      },
      {
        id: 'cycle-2',
        tileId: 25,
        label: 'Communications',
        description: 'Broadcast the change and its benefits',
        actionType: 'communicate',
        prompts: [
          'What is the key message?',
          'Which channels will we use?',
          'How often will we communicate?'
        ]
      },
      {
        id: 'cycle-3',
        tileId: 29,
        label: 'Reinforcement',
        description: 'Support ongoing adoption',
        actionType: 'measure',
        prompts: [
          'How will we support strugglers?',
          'What incentives encourage adoption?',
          'Who are the champions?'
        ]
      },
      {
        id: 'cycle-4',
        tileId: 33,
        label: 'Measurement',
        description: 'Track adoption metrics',
        actionType: 'measure',
        prompts: [
          'What metrics indicate success?',
          'How will we collect data?',
          'What is the target?'
        ]
      }
    ]
  },
  
  // Sensemaking Playbooks
  {
    id: 'sensemaking-decision',
    name: 'Decision Synthesis',
    description: 'Synthesize evidence into a clear decision',
    garden: 'intelligence',
    mode: 'sensemaking',
    category: 'decision',
    estimatedMinutes: 30,
    tileSequence: [37, 41, 45],
    triggerConditions: [
      { type: 'manual' }
    ],
    actions: [
      {
        id: 'sense-1',
        tileId: 37,
        label: 'Gather Evidence',
        description: 'Collect all relevant signals and data',
        actionType: 'document',
        prompts: [
          'What evidence do we have?',
          'What is missing?',
          'What contradictions exist?'
        ]
      },
      {
        id: 'sense-2',
        tileId: 41,
        label: 'Identify Patterns',
        description: 'Find the strongest connections',
        actionType: 'reflect',
        prompts: [
          'What patterns emerge?',
          'What are the 3 strongest signals?',
          'What story does the data tell?'
        ]
      },
      {
        id: 'sense-3',
        tileId: 45,
        label: 'Decide & Document',
        description: 'Make and record the decision',
        actionType: 'decide',
        prompts: [
          'What is the decision?',
          'Why is this the right choice?',
          'What will we do next?'
        ]
      }
    ]
  }
];
