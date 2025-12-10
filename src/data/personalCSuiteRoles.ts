export interface PersonalCSuiteRole {
  id: string;
  title: string;
  fullTitle: string;
  emoji: string;
  theme: string;
  role: string;
  questions: string[];
  morningQuestion: string;
  eveningQuestion: string;
}

export const PERSONAL_C_SUITE_ROLES: PersonalCSuiteRole[] = [
  {
    id: 'ceo',
    title: 'CEO',
    fullTitle: 'Chief Embodiment Officer',
    emoji: '🫀',
    theme: 'Direction + truth in the body',
    role: 'Holds the why of your life. Listens to your body as the main source of truth (tension, ease, excitement, dread). Aligns choices with values, not just performance.',
    questions: [
      'What does my body say yes/no to right now?',
      'Does this direction feel expansive or contracting?',
      'If I led from integrity instead of fear, what would I do next?'
    ],
    morningQuestion: 'What matters most today?',
    eveningQuestion: 'Did I stay aligned with what matters?'
  },
  {
    id: 'cfo',
    title: 'CFO',
    fullTitle: 'Chief Flow Officer',
    emoji: '🌊',
    theme: 'Resources + emotional budget',
    role: 'Manages your energy, time, attention, and emotional capacity like precious resources. Tracks where you leak energy (people, habits, patterns). Ensures you\'re "funded" enough to show up in relationships and projects.',
    questions: [
      'Where is my energy actually going today?',
      'What drains me that I need to renegotiate or let go of?',
      'What small adjustment today would restore some flow (rest, boundary, movement, play)?'
    ],
    morningQuestion: "What's my real energy budget?",
    eveningQuestion: 'Where did I overspend or under-invest my attention?'
  },
  {
    id: 'cto',
    title: 'CTO',
    fullTitle: 'Chief Transformation Officer',
    emoji: '🔬',
    theme: 'Experiments + learning + tools',
    role: 'Designs experiments in how you relate, work, rest, and create. Chooses and tunes the tools (routines, practices, tech, supports) that help you grow. Turns breakdowns into prototypes: "OK, that hurt — what can we try differently?"',
    questions: [
      'What tiny experiment could I run this week in how I relate or lead myself?',
      'What tool or ritual would make this easier instead of heavier?',
      "What did I learn from today that I don't want to waste?"
    ],
    morningQuestion: 'What one experiment or intention am I trying?',
    eveningQuestion: 'What did I learn that I want to bring into tomorrow?'
  }
];

export const getPersonalRoleById = (id: string): PersonalCSuiteRole | undefined => {
  return PERSONAL_C_SUITE_ROLES.find(role => role.id === id);
};
