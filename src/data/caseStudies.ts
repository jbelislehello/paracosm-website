
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
    id: 'wuxia-the-fox',
    title: 'Wuxia the Fox',
    subtitle: 'Interactive Children\'s Book & AR Platform',
    year: '2015',
    category: 'interactive-storytelling',
    image: 'photo-1581091226825-a6a2a5aee158',
    description: 'Transmedia educational project launched in Quebec, co-produced with SAGA and public broadcaster TFO. The work takes the form of an illustrated tale associated with an interactive iPad application, combining traditional mythology and modern technologies.',
    role: 'Creator and director of the project, developing augmented narration that mobilizes oral reading and voice recognition.',
    methods: ['Calm/CodeMagic methodology', 'Multisensory interactivity', 'Voice recognition technology', 'Augmented reality'],
    results: 'A 200-page illustrated book with physical modules (masks, wooden blocks to scan) and an iPad app in augmented reality. The device camera recognizes images and symbols from the book to trigger complementary audiovisual animations.',
    impact: 'Funded via successful Kickstarter campaign and published in French and English. Won special mention at Grand Prix Numix 2015 for innovation.',
    awards: ['Grand Prix Numix 2015 - Special Mention'],
    technologies: ['iPad AR', 'Voice Recognition', 'Computer Vision', 'Audio Synthesis'],
    relatedProjects: ['naissance-du-monde', 'calmr-spatial']
  },
  {
    id: 'calmr-spatial-io-theatre',
    title: 'Io Theatre',
    subtitle: 'Intelligent Stage Space Prototype',
    year: '2014',
    category: 'spatial-installations',
    image: 'photo-1605810230434-7631ac76ec81',
    description: 'Prototype of intelligent scenic space funded by the Canada Media Fund, allowing synchronization of narrative content with sensors and physical objects in real time.',
    role: 'Creative director and developer of the first "Experience Design Management System" platform.',
    methods: ['IoT integration', 'Real-time synchronization', 'Physical computing', 'Sensor networks'],
    results: 'Users become directors of their wandering, with set elements and media reacting to their presence.',
    impact: 'First platform for real-time narrative experience management, laying groundwork for future spatial installations.',
    technologies: ['IoT Sensors', 'Real-time Sync', 'Physical Computing'],
    relatedProjects: ['simulateur-genial', 'lachine-passages']
  },
  {
    id: 'simulateur-genial',
    title: 'Simulateur Génial!',
    subtitle: 'Interactive Science Installation',
    year: '2016',
    category: 'educational-tech',
    image: 'photo-1518770660439-4636190af475',
    description: 'Playful installation at the Musée de la civilisation in Quebec City, recreating the universe of the scientific television show Génial! in a museum context.',
    role: 'Interactive designer and technical director for IoT implementation.',
    methods: ['Connected objects', 'Scientific experimentation', 'Museum integration', 'Collective play'],
    results: 'Young participants trigger spectacular natural phenomena using connected objects, reproducing the show\'s experiments.',
    impact: 'Won Prix Gémeaux 2016 (best derivative digital production) for its ingenuity. Increased youth engagement at the museum.',
    awards: ['Prix Gémeaux 2016 - Best Derivative Digital Production'],
    technologies: ['IoT', 'Interactive Exhibits', 'Museum Tech'],
    relatedProjects: ['io-theatre', 'musee-residence']
  },
  {
    id: 'naissance-du-monde',
    title: 'La Naissance du monde',
    subtitle: 'Interactive Oral Storytelling',
    year: '2015',
    category: 'public-art',
    image: 'photo-1500673922987-e212871fec22',
    description: 'Interactive tale presented as part of Loto-Québec events. The public was invited to read aloud a physical grimoire to trigger, through voice, a projected animation telling an Amerindian creation legend.',
    role: 'Creator and director, adapting voice recognition for offline and noisy environments.',
    methods: ['Offline voice recognition', 'Projection mapping', 'Oral tradition revival', 'Collective storytelling'],
    results: 'Thousands of participants engaged in summer events at Old Port, Lafontaine Park, etc.',
    impact: 'Won Grand Prix Créa 2016 (online advertising category) and Prix Boomerang 2015 for interactive experience.',
    awards: ['Grand Prix Créa 2016', 'Prix Boomerang 2015'],
    technologies: ['Voice Recognition', 'Projection Mapping', 'Offline Processing'],
    relatedProjects: ['wuxia-the-fox', 'machine-bienveillance']
  },
  {
    id: 'lachine-passages',
    title: 'Lachine Passages',
    subtitle: 'Urban Narrative Experience',
    year: '2017',
    category: 'spatial-installations',
    image: 'photo-1506744038136-46273834b3fb',
    description: 'Experimental route in Montreal\'s Innovation Quarter, combining urban design and interactive storytelling. Installations along the Lachine Canal projected local stories when visitors lingered.',
    role: 'Creative advisor for integrating narrative dimension into urban development.',
    methods: ['Geolocation', 'Motion sensors', 'Urban storytelling', 'Heritage integration'],
    results: 'Audio stations and motion sensors triggering sound stories as visitors pass, creating poetic link between industrial past and technological future.',
    impact: 'Pilot experience mixing urbanism and storytelling, serving as showcase for Innovation Quarter.',
    technologies: ['Geolocation', 'Motion Sensors', 'Urban Computing'],
    relatedProjects: ['io-theatre', 'calmr-spatial']
  },
  {
    id: 'machine-bienveillance',
    title: 'La Machine à bienveillance',
    subtitle: 'Interactive Public Art Installation',
    year: '2017',
    category: 'public-art',
    image: 'photo-1527576539890-dfa815648363',
    description: 'Interactive public art piece deployed in Montreal (Saint-Laurent station) as part of KM³ for the city\'s 375th anniversary. A giant futuristic camera that measures the "disposition to kindness" of passersby.',
    role: 'Co-designer (UX scriptwriter and interactive director) with Ensemble Ensemble collective.',
    methods: ['Facial recognition', 'Algorithmic scoring', 'Public visualization', 'Positive feedback loops'],
    results: 'Large eye-catching urban art installation that scans volunteers and displays a real-time collective kindness index.',
    impact: 'Successful subversion of surveillance technology for celebrating altruism, creating social reflection on empathy and trust.',
    technologies: ['Computer Vision', 'Facial Recognition', 'Public Displays'],
    relatedProjects: ['naissance-du-monde', 'calmr-spatial']
  },
  {
    id: 'banff-residence',
    title: 'Banff Emergence Lab',
    subtitle: 'Creative Direction & Innovation Residency',
    year: '2014',
    category: 'educational-tech',
    image: 'photo-1501854140801-50d01698950b',
    description: 'Director of the first edition of the Banff Emergence Lab, a Franco-Canadian interactive writing laboratory bringing together traditional authors and digital professionals.',
    role: 'Expedition director, orchestrating intensive workshop reuniting Canadian and European creators.',
    methods: ['Design fiction', 'Participatory storytelling', 'Rapid prototyping', 'Interdisciplinary collaboration'],
    results: 'Several innovative concepts born (interactive web-series sketches, hybrid installations) and lasting network between creators.',
    impact: 'Created sustainable bridge between traditional and digital creators, spreading new interactive writing practices internationally.',
    technologies: ['Workshop Design', 'Prototyping', 'Creative Methodology'],
    relatedProjects: ['musee-residence', 'codemagic-methodology']
  },
  {
    id: 'tedx-montreal',
    title: 'TEDx Montréal',
    subtitle: 'Transmedia Reading: Let\'s read with all 5 senses!',
    year: '2014',
    category: 'speaking',
    image: 'photo-1461749280684-dccba630e2f6',
    description: 'TEDx talk addressing multisensory transmedia reading, demonstrating how reading with voice, gestures and all senses can reinvent the children\'s book experience.',
    role: 'Keynote speaker, demonstrating Wuxia technology and vision for conscious technology use.',
    methods: ['Live demonstration', 'Educational advocacy', 'Technology criticism', 'Family engagement'],
    results: 'Influential talk sensitizing public to dangers of passive technology and proposing creative, conscious screen use in family rituals.',
    impact: 'Significant impact raising awareness about digital addiction in children and promoting active, creative technology use.',
    technologies: ['Public Speaking', 'Live Demo', 'Educational Outreach'],
    relatedProjects: ['wuxia-the-fox', 'sxsw-talk']
  },
  {
    id: 'sxsw-talk',
    title: 'SXSW Interactive',
    subtitle: 'Storytelling Engines for Smart Environments',
    year: '2015',
    category: 'speaking',
    image: 'photo-1487058792275-0ad4aaf24ca7',
    description: 'Conference panel at South by Southwest where Jonathan presented his vision of narrative engines for connected environments, discussing how IoT can awaken the "relational poetry" of the physical world.',
    role: 'Panelist and thought leader on smart cities and narrative computing.',
    methods: ['Thought leadership', 'Smart city vision', 'IoT storytelling', 'Future scenarios'],
    results: 'Reinforced Jonathan\'s international reputation in creative smart cities domain.',
    impact: 'Positioned physical world as narrative platform, influencing discourse on human-centered smart environments.',
    technologies: ['Smart Cities', 'IoT', 'Narrative Computing'],
    relatedProjects: ['calmr-spatial', 'lachine-passages']
  },
  {
    id: 'codemagic-methodology',
    title: 'CodeMagic Methodology',
    subtitle: 'Technopoetic Design Framework',
    year: '2014-Present',
    category: 'methodology',
    image: 'photo-1526374965328-7f61d4dc18c5',
    description: 'Original conceptual framework developed by Jonathan Bélisle to fuse poetry, experience design, and systems thinking in projects. A "technopoetic" approach aimed at creating transformational digital experiences.',
    role: 'Creator and evangelist of the methodology, applying it across all Paracosm projects.',
    methods: ['Poetic approach', 'Relational systems', 'Transformational UX', 'Holistic design'],
    results: 'Comprehensive methodology implemented across all major projects, distinguishing Paracosm\'s approach in the interactive media landscape.',
    impact: 'Influenced design thinking in Quebec\'s creative technology sector, providing framework for human-centered innovation.',
    technologies: ['Design Methodology', 'Systems Thinking', 'UX Strategy'],
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
