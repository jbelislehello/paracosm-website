
export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  category: 'interactive-storytelling' | 'spatial-installations' | 'educational-tech' | 'public-art' | 'speaking' | 'methodology';
  image: string;
  description: string;
  role: string;
  methods: string[];
  results: string;
  impact: string;
  awards?: string[];
  technologies?: string[];
  links?: { title: string; url: string }[];
  relatedProjects?: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'oaciq-elise',
    title: 'case_studies.projects.oaciq_elise.title',
    subtitle: 'case_studies.projects.oaciq_elise.subtitle',
    year: '2020',
    category: 'educational-tech',
    image: 'photo-1488590528505-98d2b5aba04b',
    description: 'case_studies.projects.oaciq_elise.description',
    role: 'case_studies.projects.oaciq_elise.role',
    methods: ['case_studies.projects.oaciq_elise.methods.0', 'case_studies.projects.oaciq_elise.methods.1', 'case_studies.projects.oaciq_elise.methods.2', 'case_studies.projects.oaciq_elise.methods.3'],
    results: 'case_studies.projects.oaciq_elise.results',
    impact: 'case_studies.projects.oaciq_elise.impact',
    technologies: ['case_studies.projects.oaciq_elise.technologies.0', 'case_studies.projects.oaciq_elise.technologies.1', 'case_studies.projects.oaciq_elise.technologies.2', 'case_studies.projects.oaciq_elise.technologies.3'],
    relatedProjects: ['simulateur-genial', 'banff-residence']
  },
  {
    id: 'wuxia-the-fox',
    title: 'case_studies.projects.wuxia_the_fox.title',
    subtitle: 'case_studies.projects.wuxia_the_fox.subtitle',
    year: '2015',
    category: 'interactive-storytelling',
    image: 'photo-1581091226825-a6a2a5aee158',
    description: 'case_studies.projects.wuxia_the_fox.description',
    role: 'case_studies.projects.wuxia_the_fox.role',
    methods: ['case_studies.projects.wuxia_the_fox.methods.0', 'case_studies.projects.wuxia_the_fox.methods.1', 'case_studies.projects.wuxia_the_fox.methods.2', 'case_studies.projects.wuxia_the_fox.methods.3'],
    results: 'case_studies.projects.wuxia_the_fox.results',
    impact: 'case_studies.projects.wuxia_the_fox.impact',
    awards: ['case_studies.projects.wuxia_the_fox.awards.0'],
    technologies: ['case_studies.projects.wuxia_the_fox.technologies.0', 'case_studies.projects.wuxia_the_fox.technologies.1', 'case_studies.projects.wuxia_the_fox.technologies.2', 'case_studies.projects.wuxia_the_fox.technologies.3'],
    relatedProjects: ['naissance-du-monde', 'calmr-spatial']
  },
  {
    id: 'calmr-spatial-io-theatre',
    title: 'case_studies.projects.io_theatre.title',
    subtitle: 'case_studies.projects.io_theatre.subtitle',
    year: '2014',
    category: 'spatial-installations',
    image: 'photo-1605810230434-7631ac76ec81',
    description: 'case_studies.projects.io_theatre.description',
    role: 'case_studies.projects.io_theatre.role',
    methods: ['case_studies.projects.io_theatre.methods.0', 'case_studies.projects.io_theatre.methods.1', 'case_studies.projects.io_theatre.methods.2', 'case_studies.projects.io_theatre.methods.3'],
    results: 'case_studies.projects.io_theatre.results',
    impact: 'case_studies.projects.io_theatre.impact',
    technologies: ['case_studies.projects.io_theatre.technologies.0', 'case_studies.projects.io_theatre.technologies.1', 'case_studies.projects.io_theatre.technologies.2'],
    relatedProjects: ['simulateur-genial', 'lachine-passages']
  },
  {
    id: 'simulateur-genial',
    title: 'case_studies.projects.simulateur_genial.title',
    subtitle: 'case_studies.projects.simulateur_genial.subtitle',
    year: '2016',
    category: 'educational-tech',
    image: 'photo-1518770660439-4636190af475',
    description: 'case_studies.projects.simulateur_genial.description',
    role: 'case_studies.projects.simulateur_genial.role',
    methods: ['case_studies.projects.simulateur_genial.methods.0', 'case_studies.projects.simulateur_genial.methods.1', 'case_studies.projects.simulateur_genial.methods.2', 'case_studies.projects.simulateur_genial.methods.3'],
    results: 'case_studies.projects.simulateur_genial.results',
    impact: 'case_studies.projects.simulateur_genial.impact',
    awards: ['case_studies.projects.simulateur_genial.awards.0'],
    technologies: ['case_studies.projects.simulateur_genial.technologies.0', 'case_studies.projects.simulateur_genial.technologies.1', 'case_studies.projects.simulateur_genial.technologies.2'],
    relatedProjects: ['io-theatre', 'musee-residence']
  },
  {
    id: 'naissance-du-monde',
    title: 'case_studies.projects.naissance_du_monde.title',
    subtitle: 'case_studies.projects.naissance_du_monde.subtitle',
    year: '2015',
    category: 'public-art',
    image: 'photo-1500673922987-e212871fec22',
    description: 'case_studies.projects.naissance_du_monde.description',
    role: 'case_studies.projects.naissance_du_monde.role',
    methods: ['case_studies.projects.naissance_du_monde.methods.0', 'case_studies.projects.naissance_du_monde.methods.1', 'case_studies.projects.naissance_du_monde.methods.2', 'case_studies.projects.naissance_du_monde.methods.3'],
    results: 'case_studies.projects.naissance_du_monde.results',
    impact: 'case_studies.projects.naissance_du_monde.impact',
    awards: ['case_studies.projects.naissance_du_monde.awards.0', 'case_studies.projects.naissance_du_monde.awards.1'],
    technologies: ['case_studies.projects.naissance_du_monde.technologies.0', 'case_studies.projects.naissance_du_monde.technologies.1', 'case_studies.projects.naissance_du_monde.technologies.2'],
    relatedProjects: ['wuxia-the-fox', 'machine-bienveillance']
  },
  {
    id: 'lachine-passages',
    title: 'case_studies.projects.lachine_passages.title',
    subtitle: 'case_studies.projects.lachine_passages.subtitle',
    year: '2017',
    category: 'spatial-installations',
    image: 'photo-1506744038136-46273834b3fb',
    description: 'case_studies.projects.lachine_passages.description',
    role: 'case_studies.projects.lachine_passages.role',
    methods: ['case_studies.projects.lachine_passages.methods.0', 'case_studies.projects.lachine_passages.methods.1', 'case_studies.projects.lachine_passages.methods.2', 'case_studies.projects.lachine_passages.methods.3'],
    results: 'case_studies.projects.lachine_passages.results',
    impact: 'case_studies.projects.lachine_passages.impact',
    technologies: ['case_studies.projects.lachine_passages.technologies.0', 'case_studies.projects.lachine_passages.technologies.1', 'case_studies.projects.lachine_passages.technologies.2'],
    relatedProjects: ['io-theatre', 'calmr-spatial']
  },
  {
    id: 'machine-bienveillance',
    title: 'case_studies.projects.machine_bienveillance.title',
    subtitle: 'case_studies.projects.machine_bienveillance.subtitle',
    year: '2017',
    category: 'public-art',
    image: 'photo-1527576539890-dfa815648363',
    description: 'case_studies.projects.machine_bienveillance.description',
    role: 'case_studies.projects.machine_bienveillance.role',
    methods: ['case_studies.projects.machine_bienveillance.methods.0', 'case_studies.projects.machine_bienveillance.methods.1', 'case_studies.projects.machine_bienveillance.methods.2', 'case_studies.projects.machine_bienveillance.methods.3'],
    results: 'case_studies.projects.machine_bienveillance.results',
    impact: 'case_studies.projects.machine_bienveillance.impact',
    technologies: ['case_studies.projects.machine_bienveillance.technologies.0', 'case_studies.projects.machine_bienveillance.technologies.1', 'case_studies.projects.machine_bienveillance.technologies.2'],
    relatedProjects: ['naissance-du-monde', 'calmr-spatial']
  },
  {
    id: 'banff-residence',
    title: 'case_studies.projects.banff_residence.title',
    subtitle: 'case_studies.projects.banff_residence.subtitle',
    year: '2014',
    category: 'educational-tech',
    image: 'photo-1501854140801-50d01698950b',
    description: 'case_studies.projects.banff_residence.description',
    role: 'case_studies.projects.banff_residence.role',
    methods: ['case_studies.projects.banff_residence.methods.0', 'case_studies.projects.banff_residence.methods.1', 'case_studies.projects.banff_residence.methods.2', 'case_studies.projects.banff_residence.methods.3'],
    results: 'case_studies.projects.banff_residence.results',
    impact: 'case_studies.projects.banff_residence.impact',
    technologies: ['case_studies.projects.banff_residence.technologies.0', 'case_studies.projects.banff_residence.technologies.1', 'case_studies.projects.banff_residence.technologies.2'],
    relatedProjects: ['musee-residence', 'calm-magic-methodology']
  },
  {
    id: 'tedx-montreal',
    title: 'case_studies.projects.tedx_montreal.title',
    subtitle: 'case_studies.projects.tedx_montreal.subtitle',
    year: '2014',
    category: 'speaking',
    image: 'photo-1461749280684-dccba630e2f6',
    description: 'case_studies.projects.tedx_montreal.description',
    role: 'case_studies.projects.tedx_montreal.role',
    methods: ['case_studies.projects.tedx_montreal.methods.0', 'case_studies.projects.tedx_montreal.methods.1', 'case_studies.projects.tedx_montreal.methods.2', 'case_studies.projects.tedx_montreal.methods.3'],
    results: 'case_studies.projects.tedx_montreal.results',
    impact: 'case_studies.projects.tedx_montreal.impact',
    technologies: ['case_studies.projects.tedx_montreal.technologies.0', 'case_studies.projects.tedx_montreal.technologies.1', 'case_studies.projects.tedx_montreal.technologies.2'],
    relatedProjects: ['wuxia-the-fox', 'sxsw-talk']
  },
  {
    id: 'sxsw-talk',
    title: 'case_studies.projects.sxsw_talk.title',
    subtitle: 'case_studies.projects.sxsw_talk.subtitle',
    year: '2015',
    category: 'speaking',
    image: 'photo-1487058792275-0ad4aaf24ca7',
    description: 'case_studies.projects.sxsw_talk.description',
    role: 'case_studies.projects.sxsw_talk.role',
    methods: ['case_studies.projects.sxsw_talk.methods.0', 'case_studies.projects.sxsw_talk.methods.1', 'case_studies.projects.sxsw_talk.methods.2', 'case_studies.projects.sxsw_talk.methods.3'],
    results: 'case_studies.projects.sxsw_talk.results',
    impact: 'case_studies.projects.sxsw_talk.impact',
    technologies: ['case_studies.projects.sxsw_talk.technologies.0', 'case_studies.projects.sxsw_talk.technologies.1', 'case_studies.projects.sxsw_talk.technologies.2'],
    relatedProjects: ['calmr-spatial', 'lachine-passages']
  },
  {
    id: 'calm-magic-methodology',
    title: 'case_studies.projects.calm_magic_methodology.title',
    subtitle: 'case_studies.projects.calm_magic_methodology.subtitle',
    year: '2014-Present',
    category: 'methodology',
    image: 'photo-1526374965328-7f61d4dc18c5',
    description: 'case_studies.projects.calm_magic_methodology.description',
    role: 'case_studies.projects.calm_magic_methodology.role',
    methods: ['case_studies.projects.calm_magic_methodology.methods.0', 'case_studies.projects.calm_magic_methodology.methods.1', 'case_studies.projects.calm_magic_methodology.methods.2', 'case_studies.projects.calm_magic_methodology.methods.3'],
    results: 'case_studies.projects.calm_magic_methodology.results',
    impact: 'case_studies.projects.calm_magic_methodology.impact',
    technologies: ['case_studies.projects.calm_magic_methodology.technologies.0', 'case_studies.projects.calm_magic_methodology.technologies.1', 'case_studies.projects.calm_magic_methodology.technologies.2'],
    relatedProjects: ['wuxia-the-fox', 'banff-residence', 'machine-bienveillance']
  }
];

export const categories = {
  'interactive-storytelling': {
    name: 'Interactive Storytelling',
    color: 'from-blue-500 to-blue-700',
    icon: '📚'
  },
  'spatial-installations': {
    name: 'Spatial Installations',
    color: 'from-purple-500 to-purple-700',
    icon: '🏛️'
  },
  'educational-tech': {
    name: 'Educational Technology',
    color: 'from-green-500 to-green-700',
    icon: '🎓'
  },
  'public-art': {
    name: 'Public Art',
    color: 'from-orange-500 to-orange-700',
    icon: '🎨'
  },
  'speaking': {
    name: 'Speaking & Conferences',
    color: 'from-cyan-500 to-cyan-700',
    icon: '🎤'
  },
  'methodology': {
    name: 'Methodology & Framework',
    color: 'from-pink-500 to-pink-700',
    icon: '🧠'
  }
};
