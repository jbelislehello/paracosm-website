export type DriftAxis = 'love' | 'magic' | 'calm' | 'open' | 'free';

export interface DriftBook {
  title: string;
  author: string;
  description: string;
  category: string;
  axis: DriftAxis;
  amazonUrl: string;
}

export interface DriftMonthEntry {
  year: number;
  month: number;
  books: DriftBook[];
}

export const driftMonthlyDiscoveries: DriftMonthEntry[] = [
  {
    year: 2025, month: 1,
    books: [
      { title: "Nietzsche", author: "Michel Onfray & Maximilien Le Roy", description: "Intro/overview book on Nietzsche's life and philosophy.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Onfray+Le+Roy+Nietzsche" },
      { title: "L'intelligence érotique", author: "Esther Perel", description: "Desire, long-term relationships, and erotic intelligence.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=Esther+Perel+L%27intelligence+%C3%A9rotique" },
    ],
  },
  {
    year: 2025, month: 2,
    books: [
      { title: "Petit dictionnaire de mots rares", author: "Thierry Prellier", description: "A handy dictionary of uncommon/rare French words.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Thierry+Prellier+Petit+dictionnaire+de+mots+rares" },
      { title: "The Inner Work", author: "Mat & Ash", description: "Shadow work and healing practices for emotional growth.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=The+Inner+Work+Mat+%26+Ash" },
    ],
  },
  {
    year: 2025, month: 3,
    books: [
      { title: "Médecine traditionnelle chinoise", author: "Marabout", description: "Practical intro/reference on Traditional Chinese Medicine.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=Marabout+M%C3%A9decine+traditionnelle+chinoise" },
      { title: "L'Architecture du bonheur", author: "Alain de Botton", description: "How buildings and spaces shape our feelings and values.", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Alain+de+Botton+L%27architecture+du+bonheur" },
    ],
  },
  {
    year: 2025, month: 4,
    books: [
      { title: "Communicating the New", author: "Kim Erwin", description: "Communication methods to help innovation land and spread.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.ca/Communicating-New-Methods-Accelerate-Innovation-ebook/dp/B00EVQ9FUA" },
      { title: "The Eight Mountains", author: "Paolo Cognetti", description: "Literary novel about friendship, mountains, and meaning.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Paolo+Cognetti+The+Eight+Mountains" },
    ],
  },
  {
    year: 2025, month: 5,
    books: [
      { title: "Pathogenesis", author: "Jonathan Kennedy", description: "How inequality and politics shape disease outcomes.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Jonathan+Kennedy+Pathogenesis" },
      { title: "Jonathan Livingston Seagull", author: "Richard Bach", description: "Short fable about freedom, mastery, and self-transcendence.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.ca/s?k=Richard+Bach+Jonathan+Livingston+Seagull" },
    ],
  },
  {
    year: 2025, month: 6,
    books: [
      { title: "The Way of the Tarot", author: "Alejandro Jodorowsky & Marianne Costa", description: "Tarot as a tool for insight, symbolism, and self-knowledge.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Jodorowsky+Costa+The+Way+of+the+Tarot" },
      { title: "Becoming Supernatural", author: "Dr. Joe Dispenza", description: "Meditation/neuroscience framework for changing habits and states.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=Joe+Dispenza+Becoming+Supernatural" },
    ],
  },
  {
    year: 2025, month: 7,
    books: [
      { title: "Bliss Club", author: "June Pla", description: "Creativity and wellness themed exploration of pleasure and joy.", category: "Tangible Play", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=June+Pia+Bliss+Club" },
      { title: "De l'arbre au labyrinthe", author: "Umberto Eco", description: "Essays on signs, interpretation, and knowledge structures.", category: "Telling Stories", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Umberto+Eco+De+l%27arbre+au+labyrinthe" },
    ],
  },
  {
    year: 2025, month: 8,
    books: [
      { title: "Strategy Safari", author: "Henry Mintzberg et al.", description: "Classic survey of strategy schools and how strategy really forms.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Mintzberg+Strategy+Safari" },
      { title: "Phantasmal Media", author: "D. Fox Harrell", description: "How computation and imagination shape identity, culture, and meaning.", category: "Post-Broadcast", axis: "free", amazonUrl: "https://www.amazon.ca/s?k=D.+Fox+Harrell+Phantasmal+Media" },
    ],
  },
  {
    year: 2025, month: 9,
    books: [
      { title: "The Self-Aware Universe", author: "Amit Goswami", description: "Consciousness-first take on physics and mind.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.ca/s?k=Amit+Goswami+The+Self-Aware+Universe" },
      { title: "The Third Teacher", author: "OWP/P Architects + VS Furniture + Bruce Mau Design", description: "Design-of-learning spaces case studies — school architecture meets pedagogy.", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=The+Third+Teacher+book" },
    ],
  },
  {
    year: 2025, month: 10,
    books: [
      { title: "Game Design Workshop", author: "Tracy Fullerton", description: "Practical, project-based guide to designing games.", category: "Playgrounds", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Tracy+Fullerton+Game+Design+Workshop" },
      { title: "Taming the Tiger", author: "Witold Rybczynski", description: "History and critique of society trying to steer technology.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.ca/Taming-Tiger-Struggle-Control-Technology/dp/014007564X" },
    ],
  },
  {
    year: 2025, month: 11,
    books: [
      { title: "Atlas of the Heart", author: "Brené Brown", description: "Vocabulary and maps for emotions and human experience.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.ca/s?k=Bren%C3%A9+Brown+Atlas+of+the+Heart" },
      { title: "A Whole New Mind", author: "Daniel H. Pink", description: "Why right-brain skills — design, empathy, story — matter in modern work.", category: "Playgrounds", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Daniel+H.+Pink+A+Whole+New+Mind" },
    ],
  },
  {
    year: 2025, month: 12,
    books: [
      { title: "Living in Information", author: "Jorge Arango", description: "Information architecture for everyday modern life and teams.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Jorge+Arango+Living+in+Information" },
      { title: "Want", author: "Gillian Anderson", description: "Anthology themed around desire.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Gillian+Anderson+Want" },
    ],
  },
  {
    year: 2026, month: 1,
    books: [
      { title: "Making It All Work", author: "David Allen", description: "GTD-style productivity: implementation, review, and control loops.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=David+Allen+Making+It+All+Work" },
      { title: "A New Earth", author: "Eckhart Tolle", description: "Presence and ego teachings for psychological and spiritual shift.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.ca/s?k=Eckhart+Tolle+A+New+Earth" },
    ],
  },
  {
    year: 2026, month: 2,
    books: [
      { title: "Minimalist Parenting", author: "Christine Koh & Asha Dornfest", description: "Simplify family life: less stuff, calmer systems, clearer priorities.", category: "21c Parenting", axis: "magic", amazonUrl: "https://www.amazon.ca/s?k=Christine+Koh+Asha+Dornfest+Minimalist+Parenting" },
      { title: "Hyperobjects", author: "Timothy Morton", description: "Philosophy of massive, distributed phenomena like climate change.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/s?k=Timothy+Morton+Hyperobjects" },
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
