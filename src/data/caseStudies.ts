
export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  category: 'interactive-storytelling' | 'educational-tech' | 'methodology';
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
    relatedProjects: ['wuxia-the-fox', 'calm-magic-methodology']
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
    relatedProjects: ['oaciq-elise', 'calm-magic-methodology']
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
    relatedProjects: ['wuxia-the-fox', 'oaciq-elise']
  }
];

export const categories = {
  'interactive-storytelling': {
    name: 'Interactive Storytelling',
    color: 'from-blue-500 to-blue-700',
    icon: '📚'
  },
  'educational-tech': {
    name: 'Educational Technology',
    color: 'from-green-500 to-green-700',
    icon: '🎓'
  },
  'methodology': {
    name: 'Methodology & Framework',
    color: 'from-pink-500 to-pink-700',
    icon: '🧠'
  }
};
