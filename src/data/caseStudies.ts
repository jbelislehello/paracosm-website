
export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  category: 'interactive-storytelling' | 'educational-tech' | 'methodology' | 'spatial-installations' | 'public-art' | 'creative-technology' | 'speaking';
  image: string;
  description: string;
  role: string;
  methods: string[];
  results: string;
  impact: string;
  awards?: string[];
  technologies?: string[];
  links?: { title: string; url: string }[];
  videos?: { provider: 'vimeo' | 'youtube'; id: string; title: string; thumbnail?: string }[];
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
    image: '/__l5e/assets-v1/ac739c0b-e0cb-4717-bf07-b2697f2ecb01/wuxia-cover.jpg',
    description: 'case_studies.projects.wuxia_the_fox.description',
    role: 'case_studies.projects.wuxia_the_fox.role',
    methods: ['case_studies.projects.wuxia_the_fox.methods.0', 'case_studies.projects.wuxia_the_fox.methods.1', 'case_studies.projects.wuxia_the_fox.methods.2', 'case_studies.projects.wuxia_the_fox.methods.3'],
    results: 'case_studies.projects.wuxia_the_fox.results',
    impact: 'case_studies.projects.wuxia_the_fox.impact',
    awards: ['case_studies.projects.wuxia_the_fox.awards.0', 'case_studies.projects.wuxia_the_fox.awards.1', 'case_studies.projects.wuxia_the_fox.awards.2'],
    technologies: ['case_studies.projects.wuxia_the_fox.technologies.0', 'case_studies.projects.wuxia_the_fox.technologies.1', 'case_studies.projects.wuxia_the_fox.technologies.2', 'case_studies.projects.wuxia_the_fox.technologies.3', 'case_studies.projects.wuxia_the_fox.technologies.4'],
    videos: [
      { provider: 'youtube', id: 'dd8DISjnSfQ', title: 'Wuxia le renard — trailer' },
      { provider: 'youtube', id: 'AXmwf5Fo-84', title: 'Wuxia le renard — captation' }
    ],
    links: [
      { title: 'École branchée — livre papier & app numérique', url: 'https://ecolebranchee.com/wuxia-le-renard-quand-le-livre-papier-et-lapplication-numerique-se-rencontrent/' },
      { title: 'Le Soleil — la magie de la technologie appliquée à la lecture', url: 'https://www.lesoleil.com/2015/12/15/la-magie-de-la-technologie-appliquee-a-la-lecture-36b66d742fd8ee8f40d97518f68d5a92/' },
      { title: 'Baron Mag — portrait Jonathan Bélisle / Hello Architekt', url: 'https://baronmag.com/2017/02/jonathan-belisle-hello-architekt/' },
      { title: 'Lien Multimédia', url: 'https://lienmultimedia.com/spip.php?article22075' },
      { title: 'Mémoire UQAM (Archipel D4233)', url: 'https://archipel.uqam.ca/15812/1/D4233.pdf' },
      { title: 'Colin / Ex-Situ — archives', url: 'https://colin.ex-situ.info/s/colin/item/997' },
      { title: 'Livre papier — Blurb', url: 'https://www.blurb.ca/b/8735793-wuxia-le-renard' },
      { title: 'Édition française — Renaud-Bray', url: 'https://www.renaud-bray.com/Livres_Produit.aspx?id=1798750&def=Wuxia+le+renard+%3a+%c3%a0+la+recherche+des+r%c3%aaves+perdus%2cB%c3%89LISLE%2c+JONATHAN%2c9780993973604' },
      { title: 'Campagne Kickstarter (2014)', url: 'https://www.kickstarter.com/projects/jonathanbelisle/wuxia-the-fox-augmented-book-and-ipad-app' }
    ],
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
  },
  {
    id: 'io-theatre',
    title: 'case_studies.projects.io_theatre.title',
    subtitle: 'case_studies.projects.io_theatre.subtitle',
    year: '2018',
    category: 'spatial-installations',
    image: 'photo-1516715094483-75da06c182fe',
    description: 'case_studies.projects.io_theatre.description',
    role: 'case_studies.projects.io_theatre.role',
    methods: ['case_studies.projects.io_theatre.methods.0', 'case_studies.projects.io_theatre.methods.1', 'case_studies.projects.io_theatre.methods.2', 'case_studies.projects.io_theatre.methods.3'],
    results: 'case_studies.projects.io_theatre.results',
    impact: 'case_studies.projects.io_theatre.impact',
    technologies: ['case_studies.projects.io_theatre.technologies.0', 'case_studies.projects.io_theatre.technologies.1', 'case_studies.projects.io_theatre.technologies.2'],
    relatedProjects: ['lachine-passages', 'machine-bienveillance']
  },
  {
    id: 'simulateur-genial',
    title: 'case_studies.projects.simulateur_genial.title',
    subtitle: 'case_studies.projects.simulateur_genial.subtitle',
    year: '2019',
    category: 'educational-tech',
    image: 'photo-1517077304055-6e89abbf09b0',
    description: 'case_studies.projects.simulateur_genial.description',
    role: 'case_studies.projects.simulateur_genial.role',
    methods: ['case_studies.projects.simulateur_genial.methods.0', 'case_studies.projects.simulateur_genial.methods.1', 'case_studies.projects.simulateur_genial.methods.2', 'case_studies.projects.simulateur_genial.methods.3'],
    results: 'case_studies.projects.simulateur_genial.results',
    impact: 'case_studies.projects.simulateur_genial.impact',
    technologies: ['case_studies.projects.simulateur_genial.technologies.0', 'case_studies.projects.simulateur_genial.technologies.1', 'case_studies.projects.simulateur_genial.technologies.2', 'case_studies.projects.simulateur_genial.technologies.3'],
    relatedProjects: ['oaciq-elise', 'banff-residence']
  },
  {
    id: 'naissance-du-monde',
    title: 'case_studies.projects.naissance_du_monde.title',
    subtitle: 'case_studies.projects.naissance_du_monde.subtitle',
    year: '2015',
    category: 'interactive-storytelling',
    image: '/__l5e/assets-v1/1b1091e5-b2be-46f2-9e4a-0b38f4e8ac18/naissance-du-monde-cover.jpg',
    description: 'case_studies.projects.naissance_du_monde.description',
    role: 'case_studies.projects.naissance_du_monde.role',
    methods: ['case_studies.projects.naissance_du_monde.methods.0', 'case_studies.projects.naissance_du_monde.methods.1', 'case_studies.projects.naissance_du_monde.methods.2', 'case_studies.projects.naissance_du_monde.methods.3'],
    results: 'case_studies.projects.naissance_du_monde.results',
    impact: 'case_studies.projects.naissance_du_monde.impact',
    technologies: ['case_studies.projects.naissance_du_monde.technologies.0', 'case_studies.projects.naissance_du_monde.technologies.1', 'case_studies.projects.naissance_du_monde.technologies.2'],
    videos: [
      { provider: 'vimeo', id: '148532449', title: 'La Naissance du Monde — captation', thumbnail: 'https://i.vimeocdn.com/video/547498526-b1811c16ff9fab209ed2c7c17b7e9d3ef2fcd97a5385539774d64cd5f86c4673-d_640' },
      { provider: 'youtube', id: 'bNR2VXOer6A', title: 'Queen Ka & Ivy — La Naissance du Monde' }
    ],
    links: [
      { title: 'Vimeo — captation', url: 'https://vimeo.com/148532449' },
      { title: 'La Bible Urbaine — article', url: 'https://labibleurbaine.com/litterature/queen-ka-et-ivy-se-pretent-au-jeu-la-naissance-du-monde-de-lesdivertisseurs-de-loto-quebec/' },
      { title: 'YouTube — Queen Ka & Ivy', url: 'https://www.youtube.com/watch?v=bNR2VXOer6A' }
    ],
    relatedProjects: ['machine-bienveillance', 'io-theatre']
  },
  {
    id: 'lachine-passages',
    title: 'case_studies.projects.lachine_passages.title',
    subtitle: 'case_studies.projects.lachine_passages.subtitle',
    year: '2017',
    category: 'spatial-installations',
    image: 'photo-1558618666-fcd25c85cd64',
    description: 'case_studies.projects.lachine_passages.description',
    role: 'case_studies.projects.lachine_passages.role',
    methods: ['case_studies.projects.lachine_passages.methods.0', 'case_studies.projects.lachine_passages.methods.1', 'case_studies.projects.lachine_passages.methods.2', 'case_studies.projects.lachine_passages.methods.3'],
    results: 'case_studies.projects.lachine_passages.results',
    impact: 'case_studies.projects.lachine_passages.impact',
    technologies: ['case_studies.projects.lachine_passages.technologies.0', 'case_studies.projects.lachine_passages.technologies.1', 'case_studies.projects.lachine_passages.technologies.2'],
    relatedProjects: ['io-theatre', 'naissance-du-monde']
  },
  {
    id: 'machine-bienveillance',
    title: 'case_studies.projects.machine_bienveillance.title',
    subtitle: 'case_studies.projects.machine_bienveillance.subtitle',
    year: '2017',
    category: 'public-art',
    image: '/__l5e/assets-v1/086e6815-955f-456a-bb7d-df4dde5253b3/machine-bienveillance.jpg',
    description: 'case_studies.projects.machine_bienveillance.description',
    role: 'case_studies.projects.machine_bienveillance.role',
    methods: ['case_studies.projects.machine_bienveillance.methods.0', 'case_studies.projects.machine_bienveillance.methods.1', 'case_studies.projects.machine_bienveillance.methods.2', 'case_studies.projects.machine_bienveillance.methods.3'],
    results: 'case_studies.projects.machine_bienveillance.results',
    impact: 'case_studies.projects.machine_bienveillance.impact',
    awards: ['case_studies.projects.machine_bienveillance.awards.0', 'case_studies.projects.machine_bienveillance.awards.1'],
    technologies: ['case_studies.projects.machine_bienveillance.technologies.0', 'case_studies.projects.machine_bienveillance.technologies.1', 'case_studies.projects.machine_bienveillance.technologies.2', 'case_studies.projects.machine_bienveillance.technologies.3'],
    links: [
      { title: 'Blogue ONF/NFB', url: 'https://blogue.onf.ca/blogue/2017/09/25/machine-a-bienveillance/' },
      { title: 'Vidéo YouTube', url: 'https://www.youtube.com/watch?v=OkHQg18SF24' },
      { title: 'Facebook ONF', url: 'https://www.facebook.com/onf.ca/videos/la-machine-%C3%A0-bienveillance/10155970233169728/' },
      { title: 'Le Soir — Brux\'ils Brux\'elles', url: 'https://www.lesoir.be/267241/article/2019-12-16/brux-ils-brux-elles-la-civilite-pour-lutter-contre-lincivilite' },
      { title: 'Revue Communication (OpenEdition)', url: 'https://journals.openedition.org/communication/21234' }
    ],
    relatedProjects: ['naissance-du-monde', 'io-theatre']
  },
  {
    id: 'banff-residence',
    title: 'case_studies.projects.banff_residence.title',
    subtitle: 'case_studies.projects.banff_residence.subtitle',
    year: '2019',
    category: 'creative-technology',
    image: 'photo-1506905925346-21bda4d32df4',
    description: 'case_studies.projects.banff_residence.description',
    role: 'case_studies.projects.banff_residence.role',
    methods: ['case_studies.projects.banff_residence.methods.0', 'case_studies.projects.banff_residence.methods.1', 'case_studies.projects.banff_residence.methods.2', 'case_studies.projects.banff_residence.methods.3'],
    results: 'case_studies.projects.banff_residence.results',
    impact: 'case_studies.projects.banff_residence.impact',
    technologies: ['case_studies.projects.banff_residence.technologies.0', 'case_studies.projects.banff_residence.technologies.1', 'case_studies.projects.banff_residence.technologies.2'],
    relatedProjects: ['simulateur-genial', 'tedx-montreal']
  },
  {
    id: 'tedx-montreal',
    title: 'case_studies.projects.tedx_montreal.title',
    subtitle: 'case_studies.projects.tedx_montreal.subtitle',
    year: '2021',
    category: 'speaking',
    image: 'photo-1475721027785-f74eccf877e2',
    description: 'case_studies.projects.tedx_montreal.description',
    role: 'case_studies.projects.tedx_montreal.role',
    methods: ['case_studies.projects.tedx_montreal.methods.0', 'case_studies.projects.tedx_montreal.methods.1', 'case_studies.projects.tedx_montreal.methods.2', 'case_studies.projects.tedx_montreal.methods.3'],
    results: 'case_studies.projects.tedx_montreal.results',
    impact: 'case_studies.projects.tedx_montreal.impact',
    technologies: ['case_studies.projects.tedx_montreal.technologies.0', 'case_studies.projects.tedx_montreal.technologies.1', 'case_studies.projects.tedx_montreal.technologies.2'],
    relatedProjects: ['banff-residence', 'calm-magic-methodology']
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
  },
  'spatial-installations': {
    name: 'Spatial Installations',
    color: 'from-purple-500 to-purple-700',
    icon: '🏛️'
  },
  'public-art': {
    name: 'Public Art',
    color: 'from-orange-500 to-orange-700',
    icon: '🎨'
  },
  'creative-technology': {
    name: 'Creative Technology',
    color: 'from-cyan-500 to-cyan-700',
    icon: '⚡'
  },
  'speaking': {
    name: 'Speaking & Conferences',
    color: 'from-red-500 to-red-700',
    icon: '🎤'
  }
};
