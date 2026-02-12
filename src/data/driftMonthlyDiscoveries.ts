export type DriftAxis = 'love' | 'magic' | 'calm' | 'open' | 'free';

export interface DriftBook {
  title: string;
  author: string;
  description: string;
  category: string;
  axis: DriftAxis;
  amazonUrl: string;
}

export interface DriftVideo {
  title: string;
  speaker: string;
  description: string;
  category: string;
  axis: DriftAxis;
  youtubeId: string;
  platform: string;
}

export interface DriftSong {
  title: string;
  artist: string;
  description: string;
  category: string;
  axis: DriftAxis;
  url: string;
  platform: string;
}

export interface DriftPodcast {
  title: string;
  host: string;
  description: string;
  category: string;
  axis: DriftAxis;
  url: string;
  platform: string;
}

export interface DriftArticle {
  title: string;
  author: string;
  description: string;
  category: string;
  axis: DriftAxis;
  url: string;
  source: string;
}

export interface DriftMonthEntry {
  year: number;
  month: number;
  books: DriftBook[];
  videos?: DriftVideo[];
  songs?: DriftSong[];
  podcasts?: DriftPodcast[];
  articles?: DriftArticle[];
}

export const driftMonthlyDiscoveries: DriftMonthEntry[] = [
  // === 2023 ===
  {
    year: 2023, month: 1,
    books: [
      { title: "Dynamic Light and Shade", author: "Burne Hogarth", description: "Figure/illustration-focused guide to rendering light & shadow to create depth, form, and dramatic contrast.", category: "Tangible Play", axis: "love", amazonUrl: "https://www.amazon.com/-/zh_TW/Dynamic-Light-Shade-Burne-Hogarth/dp/0823015815" },
      { title: "Management (Canadian Edition)", author: "Stephen P. Robbins, Mary A. Coulter, Ed Leach, Mary Kilfoil", description: "Comprehensive management textbook connecting core management concepts to real-world applications.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/Management-Eleventh-Canadian-Stephen-Robbins/dp/0133357279" },
    ],
  },
  {
    year: 2023, month: 2,
    books: [
      { title: "Exploring Storyboarding", author: "Wendy Tumminello", description: "Practical how-to for storyboarding skills, covering shot planning, staging/composition, and camera techniques.", category: "Telling Stories", axis: "open", amazonUrl: "https://www.amazon.ca/Exploring-Storyboarding-Wendy-Tumminello/dp/1401827152" },
      { title: "Le Pendule de Foucault", author: "Umberto Eco", description: "A literary/idea-driven novel about three Milanese editors who invent an elaborate esoteric conspiracy that begins to feel dangerously real.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.ca/-/fr/PENDULE-FOUCAULT/dp/2253059498" },
    ],
  },
  {
    year: 2023, month: 3,
    books: [
      { title: "The Innovator's Toolkit", author: "David Silverstein, Philip Samuel, Neil DeCarlo", description: "A structured toolkit of 50+ innovation methods aimed at making innovation more repeatable inside organizations.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.ca/Innovators-Toolkit-Techniques-Predictable-Sustainable/dp/0470345357" },
      { title: "Design Thinking for Strategic Innovation", author: "Idris Mootee", description: "Design thinking applied to strategy/innovation, with frameworks and approaches for solving complex business problems.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.ca/Design-Thinking-Strategic-Innovation-Business/dp/1118620127" },
    ],
  },
  {
    year: 2023, month: 4,
    books: [
      { title: "Designing for Interaction (2nd Edition)", author: "Dan Saffer", description: "Interaction design fundamentals + methods for researching, designing, and evaluating interactive products.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.com/Designing-Interaction-Creating-Innovative-Applications/dp/0321643399" },
      { title: "Journal Sparks", author: "Emily K. Neuburger", description: "60 guided prompts mixing writing + art-making (drawing, collage, etc.) to jumpstart creativity.", category: "Playgrounds", axis: "calm", amazonUrl: "https://www.amazon.ca/Journal-Sparks-Creativity-Spontaneous-Inventive/dp/1612126529" },
    ],
  },
  {
    year: 2023, month: 5,
    books: [
      { title: "Mapping Experiences", author: "Jim Kalbach", description: "How to use alignment diagrams (journey maps, service blueprints, etc.) to turn customer observations into actionable insights.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/Mapping-Experiences-Complete-Creating-Blueprints/dp/1491923539" },
      { title: "Unstuck", author: "Keith Yamashita, Sandra Spataro", description: "Tools for diagnosing stuck situations and getting momentum back (personal + team contexts).", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/Unstuck-Keith-Yamashita/dp/1591840376" },
    ],
  },
  { year: 2023, month: 6, books: [] },
  { year: 2023, month: 7, books: [] },
  { year: 2023, month: 8, books: [] },
  { year: 2023, month: 9, books: [] },
  { year: 2023, month: 10, books: [] },
  { year: 2023, month: 11, books: [] },
  { year: 2023, month: 12, books: [] },
  // === 2024 ===
  { year: 2024, month: 1, books: [] },
  { year: 2024, month: 2, books: [] },
  { year: 2024, month: 3, books: [] },
  { year: 2024, month: 4, books: [] },
  { year: 2024, month: 5, books: [] },
  { year: 2024, month: 6, books: [] },
  { year: 2024, month: 7, books: [] },
  { year: 2024, month: 8, books: [] },
  { year: 2024, month: 9, books: [] },
  { year: 2024, month: 10, books: [] },
  { year: 2024, month: 11, books: [] },
  { year: 2024, month: 12, books: [] },
  // === 2025 ===
  {
    year: 2025, month: 1,
    books: [
      { title: "Nietzsche", author: "Michel Onfray & Maximilien Le Roy", description: "Intro/overview book on Nietzsche's life and philosophy.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Onfray+Le+Roy+Nietzsche" },
      { title: "L'intelligence érotique", author: "Esther Perel", description: "Desire, long-term relationships, and erotic intelligence.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=Esther+Perel+L%27intelligence+%C3%A9rotique" },
    ],
    videos: [
      { title: "Jonathan Bélisle at CreativeMornings Montreal", speaker: "Jonathan Bélisle", description: "A talk on creative practice, worldbuilding, and designing meaningful experiences.", category: "WorldBuilders", axis: "free", youtubeId: "vK5PlnVQUqo", platform: "CreativeMornings" },
    ],
  },
  {
    year: 2025, month: 2,
    books: [
      { title: "Petit dictionnaire de mots rares", author: "Thierry Prellier", description: "A handy dictionary of uncommon/rare French words.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Thierry+Prellier+Petit+dictionnaire+de+mots+rares" },
      { title: "The Inner Work", author: "Mat & Ash", description: "Shadow work and healing practices for emotional growth.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=The+Inner+Work+Mat+%26+Ash" },
    ],
    videos: [
      { title: "TEDxMontréal — Jonathan Bélisle", speaker: "Jonathan Bélisle", description: "A TEDx talk on how technology can transform the way children learn and engage with the world.", category: "21c Parenting", axis: "magic", youtubeId: "swgfAfaEsdw", platform: "TEDx" },
    ],
  },
  {
    year: 2025, month: 3,
    books: [
      { title: "Médecine traditionnelle chinoise", author: "Marabout", description: "Practical intro/reference on Traditional Chinese Medicine.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=Marabout+M%C3%A9decine+traditionnelle+chinoise" },
      { title: "L'Architecture du bonheur", author: "Alain de Botton", description: "How buildings and spaces shape our feelings and values.", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Alain+de+Botton+L%27architecture+du+bonheur" },
    ],
    videos: [
      { title: "Jonathan Bélisle — Stories of a Near Future Collective Talk", speaker: "Jonathan Bélisle", description: "Exploring the intersection of AI and the arts, imagining near-future creative possibilities.", category: "Post-Broadcast", axis: "free", youtubeId: "3uWumNsq7gs", platform: "E-AI" },
    ],
  },
  {
    year: 2025, month: 4,
    books: [
      { title: "Communicating the New", author: "Kim Erwin", description: "Communication methods to help innovation land and spread.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.ca/Communicating-New-Methods-Accelerate-Innovation-ebook/dp/B00EVQ9FUA" },
      { title: "The Eight Mountains", author: "Paolo Cognetti", description: "Literary novel about friendship, mountains, and meaning.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Paolo+Cognetti+The+Eight+Mountains" },
    ],
    videos: [
      { title: "La Machine à bienveillance — Interview Jonathan Bélisle", speaker: "Jonathan Bélisle", description: "A creative exploration of kindness and technology through an interactive installation.", category: "WorldBuilders", axis: "free", youtubeId: "OkHQg18SF24", platform: "TV5MONDE" },
    ],
  },
  {
    year: 2025, month: 5,
    books: [
      { title: "Pathogenesis", author: "Jonathan Kennedy", description: "How inequality and politics shape disease outcomes.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Jonathan+Kennedy+Pathogenesis" },
      { title: "Jonathan Livingston Seagull", author: "Richard Bach", description: "Short fable about freedom, mastery, and self-transcendence.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.ca/s?k=Richard+Bach+Jonathan+Livingston+Seagull" },
    ],
    videos: [
      { title: "Wuxia le renard — Expérience scolaire à l'Externat Saint-Jean-Berchmans", speaker: "Jonathan Bélisle", description: "An interactive reading experience designed for schools, blending play and storytelling.", category: "Playgrounds", axis: "calm", youtubeId: "AXmwf5Fo-84", platform: "Lu Interactive" },
    ],
  },
  {
    year: 2025, month: 6,
    books: [
      { title: "The Way of the Tarot", author: "Alejandro Jodorowsky & Marianne Costa", description: "Tarot as a tool for insight, symbolism, and self-knowledge.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Jodorowsky+Costa+The+Way+of+the+Tarot" },
      { title: "Becoming Supernatural", author: "Dr. Joe Dispenza", description: "Meditation/neuroscience framework for changing habits and states.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=Joe+Dispenza+Becoming+Supernatural" },
    ],
    videos: [
      { title: "DesignOPS avec Jonathan Bélisle", speaker: "Jonathan Bélisle", description: "A conversation on design operations, creative leadership, and scaling design practice.", category: "Workflows", axis: "calm", youtubeId: "NDQFpxl5UqM", platform: "Sprinkler" },
    ],
  },
  {
    year: 2025, month: 7,
    books: [
      { title: "Bliss Club", author: "June Pla", description: "Creativity and wellness themed exploration of pleasure and joy.", category: "Tangible Play", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=June+Pia+Bliss+Club" },
      { title: "De l'arbre au labyrinthe", author: "Umberto Eco", description: "Essays on signs, interpretation, and knowledge structures.", category: "Telling Stories", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Umberto+Eco+De+l%27arbre+au+labyrinthe" },
    ],
    videos: [
      { title: "Le futur de l'édition numérique jeunesse, selon Jonathan Bélisle", speaker: "Jonathan Bélisle", description: "Exploring the future of digital publishing for young audiences.", category: "Post-Broadcast", axis: "free", youtubeId: "CEukKAuEyX4", platform: "FRQSC / UQAM" },
    ],
  },
  {
    year: 2025, month: 8,
    books: [
      { title: "Strategy Safari", author: "Henry Mintzberg et al.", description: "Classic survey of strategy schools and how strategy really forms.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Mintzberg+Strategy+Safari" },
      { title: "Phantasmal Media", author: "D. Fox Harrell", description: "How computation and imagination shape identity, culture, and meaning.", category: "Post-Broadcast", axis: "free", amazonUrl: "https://www.amazon.ca/s?k=D.+Fox+Harrell+Phantasmal+Media" },
    ],
    videos: [
      { title: "Environnements programmables et désirables — Jonathan Bélisle", speaker: "Jonathan Bélisle", description: "Designing programmable and desirable environments at the intersection of technology and space.", category: "Sensory Rooms", axis: "magic", youtubeId: "FEnLGeiNjAc", platform: "Communautique / Mandalab" },
    ],
  },
  {
    year: 2025, month: 9,
    books: [
      { title: "The Self-Aware Universe", author: "Amit Goswami", description: "Consciousness-first take on physics and mind.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.ca/s?k=Amit+Goswami+The+Self-Aware+Universe" },
      { title: "The Third Teacher", author: "OWP/P Architects + VS Furniture + Bruce Mau Design", description: "Design-of-learning spaces case studies — school architecture meets pedagogy.", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=The+Third+Teacher+book" },
    ],
    videos: [
      { title: "Mutations :: Convivialité numérique et futur de la lecture", speaker: "Jonathan Bélisle", description: "On digital conviviality and the future of reading in an interconnected world.", category: "Narratives", axis: "magic", youtubeId: "of1aeUkcRxg", platform: "TOPO" },
    ],
  },
  {
    year: 2025, month: 10,
    books: [
      { title: "Game Design Workshop", author: "Tracy Fullerton", description: "Practical, project-based guide to designing games.", category: "Playgrounds", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Tracy+Fullerton+Game+Design+Workshop" },
      { title: "Taming the Tiger", author: "Witold Rybczynski", description: "History and critique of society trying to steer technology.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.ca/Taming-Tiger-Struggle-Control-Technology/dp/014007564X" },
    ],
    videos: [
      { title: "Entrevue Jonathan Bélisle — IoT Theatre", speaker: "Jonathan Bélisle", description: "Discussing the Internet of Things applied to theatre and live performance experiences.", category: "Connected Life", axis: "open", youtubeId: "S0YgJmnQkZM", platform: "eCOM MTL" },
    ],
  },
  {
    year: 2025, month: 11,
    books: [
      { title: "Atlas of the Heart", author: "Brené Brown", description: "Vocabulary and maps for emotions and human experience.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=Bren%C3%A9+Brown+Atlas+of+the+Heart" },
      { title: "A Whole New Mind", author: "Daniel H. Pink", description: "Why right-brain skills — design, empathy, story — matter in modern work.", category: "Playgrounds", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Daniel+H.+Pink+A+Whole+New+Mind" },
    ],
    videos: [
      { title: "Trouver ton essence pour réussir ta carrière créative", speaker: "Jonathan Bélisle", description: "Finding your creative essence to build a successful and authentic career.", category: "Inquiry and Practices", axis: "calm", youtubeId: "LitZOgUQ3GU", platform: "monExpansion" },
    ],
  },
  {
    year: 2025, month: 12,
    books: [
      { title: "Living in Information", author: "Jorge Arango", description: "Information architecture for everyday modern life and teams.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Jorge+Arango+Living+in+Information" },
      { title: "Want", author: "Gillian Anderson", description: "Anthology themed around desire.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Gillian+Anderson+Want" },
    ],
    videos: [
      { title: "Du burnout à la renaissance — Redesign ta carrière", speaker: "Jonathan Bélisle", description: "From burnout to renaissance: redesigning your creative career path.", category: "Embodied Cognition", axis: "love", youtubeId: "Jx-ZLX0NuIE", platform: "monExpansion" },
      { title: "Conférence de Jonathan Bélisle — Tournée Infopresse à Ottawa", speaker: "Jonathan Bélisle", description: "Conference talk on digital storytelling and creative innovation.", category: "Telling Stories", axis: "open", youtubeId: "6ToFJ8I6z1k", platform: "Infopresse" },
    ],
  },
  // === 2026 ===
  {
    year: 2026, month: 1,
    books: [
      { title: "Making It All Work", author: "David Allen", description: "GTD-style productivity: implementation, review, and control loops.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=David+Allen+Making+It+All+Work" },
      { title: "A New Earth", author: "Eckhart Tolle", description: "Presence and ego teachings for psychological and spiritual shift.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Eckhart+Tolle+A+New+Earth" },
    ],
    videos: [
      { title: "De « clown » à polymathe : raconter le monde quand on ne rentre dans aucune case", speaker: "Jonathan Bélisle", description: "From clown to polymath: telling stories about the world through multiple disciplines.", category: "Human Dynamics & System Thinking", axis: "open", youtubeId: "yM0H3cZMr9k", platform: "The Long And Winding Answer" },
      { title: "Les nouveaux horizons du Transmédia", speaker: "Jonathan Bélisle", description: "Exploring the new horizons of transmedia storytelling and cross-platform narratives.", category: "Post-Broadcast", axis: "free", youtubeId: "GCncJuY8u_4", platform: "Festival Regards" },
    ],
  },
  {
    year: 2026, month: 2,
    books: [
      { title: "Minimalist Parenting", author: "Christine Koh & Asha Dornfest", description: "Simplify family life: less stuff, calmer systems, clearer priorities.", category: "21c Parenting", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Christine+Koh+Asha+Dornfest+Minimalist+Parenting" },
      { title: "Hyperobjects", author: "Timothy Morton", description: "Philosophy of massive, distributed phenomena like climate change.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Timothy+Morton+Hyperobjects" },
    ],
    videos: [
      { title: "Jonathan Bélisle (LienMultimédia, 2009)", speaker: "Jonathan Bélisle", description: "An early look at Jonathan Bélisle's creative practice and storytelling vision.", category: "Telling Stories", axis: "open", youtubeId: "ImsYaGSF1mI", platform: "LienMultimédia" },
      { title: "FNC09 — Psychogéographie et réalité augmentée", speaker: "Jonathan Bélisle", description: "Exploring psychogeography and augmented reality as tools for reimagining urban spaces.", category: "Tangible Play", axis: "love", youtubeId: "7jVV-476Bog", platform: "LienMultimédia" },
    ],
  },
];

export const axisColors: Record<DriftAxis, string> = {
  love: '#ef4444',
  magic: '#8b5cf6',
  calm: '#06b6d4',
  open: '#10b981',
  free: '#f59e0b',
};

export const axisLabels: Record<DriftAxis, string> = {
  love: 'LOVE',
  magic: 'MAGIC',
  calm: 'CALM',
  open: 'OPEN',
  free: 'FREE',
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const getMonthName = (month: number) => monthNames[month - 1] || '';

export const getDiscoveryByYearMonth = (year: number, month: number) =>
  driftMonthlyDiscoveries.find(d => d.year === year && d.month === month);
