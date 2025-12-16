export const SEASON_DEFINITIONS = {
  POLLENS: {
    id: 'POLLENS',
    label: 'Pollens',
    shortDescription: 'Relational & Cultural Aspirations',
    fullDescription: 'Self aspirations, team dynamics, organizational culture, relational elements, collective values',
    focus: ['Self Aspirations', 'Team Dynamics', 'Organizational Culture', 'Relational Elements'],
  },
  NOEMS: {
    id: 'NOEMS',
    label: 'Noems',
    shortDescription: 'Conceptual Ideation',
    fullDescription: 'Ideas, concepts, abstract patterns, mental models, theoretical frameworks',
    focus: ['Ideas', 'Concepts', 'Mental Models', 'Theoretical Frameworks'],
  },
  POEMS: {
    id: 'POEMS',
    label: 'Poems',
    shortDescription: 'Experiential Design (P.O.E.M.S.)',
    fullDescription: 'People • Objects • Environments • Messages • Systems — UI, IXD, prototypes, ontological design',
    acronym: {
      P: 'People',
      O: 'Objects',
      E: 'Environments',
      M: 'Messages',
      S: 'Systems'
    },
    focus: ['People', 'Objects', 'Environments', 'Messages', 'Systems', 'UI/IXD', 'Prototypes'],
  },
  TOTEMS: {
    id: 'TOTEMS',
    label: 'Totems',
    shortDescription: 'Technical Infrastructure',
    fullDescription: 'Data architecture, security policies, access controls, system requirements',
    focus: ['Infrastructure', 'Technical Data', 'Access Policies', 'Security'],
  },
  ANTHEMS: {
    id: 'ANTHEMS',
    label: 'Anthems',
    shortDescription: 'Market & Storytelling',
    fullDescription: 'Market positioning, brand narrative, go-to-market strategy, audience targeting',
    focus: ['Markets', 'Storytelling', 'Brand Narrative', 'Positioning'],
  },
} as const;

export type SeasonId = keyof typeof SEASON_DEFINITIONS;

export const POEMS_ACRONYM = {
  P: 'People',
  O: 'Objects',
  E: 'Environments',
  M: 'Messages',
  S: 'Systems'
} as const;
