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

export interface DriftArtefact {
  title: string;
  author: string;
  description: string;
  category: string;
  axis: DriftAxis;
  imagePath?: string;
  filePath?: string;
}

export interface DriftMonthEntry {
  year: number;
  month: number;
  books: DriftBook[];
  videos?: DriftVideo[];
  songs?: DriftSong[];
  podcasts?: DriftPodcast[];
  articles?: DriftArticle[];
  artefacts?: DriftArtefact[];
}

export const driftMonthlyDiscoveries: DriftMonthEntry[] = [
  // === 2022 ===
  {
    year: 2022, month: 1,
    books: [
      { title: "Skin in the Game", author: "Nassim Nicholas Taleb", description: "Risk, responsibility, symmetry: why credibility requires personal exposure.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Skin+in+the+Game+Nassim+Nicholas+Taleb" },
      { title: "Siddhartha", author: "Hermann Hesse", description: "Spiritual coming-of-age, experience vs doctrine, inner freedom.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Siddhartha+Hermann+Hesse" },
      { title: "Les fous du son", author: "Laurent de Wilde", description: "Histoire/portrait de la musique électronique et de ses pionniers.", category: "Sensory Rooms", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Laurent+de+Wilde+Les+fous+du+son" },
    ],
  },
  {
    year: 2022, month: 2,
    books: [
      { title: "La Bhagavad-Gîtâ", author: "Texte classique", description: "Dialogue philosophique sur devoir, action, conscience (hindouisme).", category: "Inquiry and Practices", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=La+Bhagavad+Gita+livre+francais" },
      { title: "Le Parfum", author: "Patrick Süskind", description: "Roman sur l'obsession olfactive, le génie, et la monstruosité sociale.", category: "Narratives", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Patrick+Suskind+Le+Parfum" },
      { title: "Le sacré et le profane", author: "Mircea Eliade", description: "Comment les humains donnent sens au monde via le religieux/le symbolique.", category: "Inquiry and Practices", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Mircea+Eliade+Le+sacr%C3%A9+et+le+profane" },
    ],
  },
  {
    year: 2022, month: 3,
    books: [
      { title: "Zero to One", author: "Peter Thiel", description: "Startup thinking: créer du 'nouveau' au lieu de copier/optimiser.", category: "Workflows", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Zero+to+One+Peter+Thiel" },
      { title: "Labanotation", author: "Ann Hutchinson Guest", description: "Système de notation du mouvement/danse (référence technique).", category: "Tangible Play", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Labanotation+Ann+Hutchinson+Guest" },
      { title: "Lighter", author: "Yung Pueblo", description: "Poésie/aphorismes sur guérison, détachement, croissance intérieure.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Lighter+Yung+Pueblo" },
    ],
  },
  {
    year: 2022, month: 4,
    books: [
      { title: "Rework", author: "Jason Fried & David Heinemeier Hansson", description: "Construire une entreprise avec simplicité, anti-bullshit, pragmatisme.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Rework+Jason+Fried+David+Heinemeier+Hansson" },
      { title: "Divining a Digital Future", author: "Paul Dourish & Genevieve Bell", description: "Enquête sur l'impact du numérique sur nos vies/cultures.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Divining+a+Digital+Future+book" },
      { title: "The Year of Dreaming Dangerously", author: "Slavoj Žižek", description: "Analyse politico-philo des soulèvements/crises contemporaines.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=The+Year+of+Dreaming+Dangerously+Slavoj+Zizek" },
    ],
  },
  {
    year: 2022, month: 5,
    books: [
      { title: "Antifragile", author: "Nassim Nicholas Taleb", description: "Ce qui gagne avec le désordre: options, stress, évolution, robustesse.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Antifragile+Nassim+Nicholas+Taleb" },
      { title: "Le point de bascule", author: "Malcolm Gladwell", description: "Comment idées/tendances basculent en phénomènes de masse.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Le+point+de+bascule+Malcolm+Gladwell" },
      { title: "Who's Your City?", author: "Richard Florida", description: "Géographie des talents: pourquoi la ville façonne carrière et bonheur.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.com/s?k=Who%27s+Your+City+Richard+Florida" },
    ],
  },
  {
    year: 2022, month: 6,
    books: [
      { title: "Drive", author: "Daniel H. Pink", description: "Motivation: autonomie, maîtrise, sens (au-delà des carottes/bâtons).", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Drive+Daniel+H+Pink" },
      { title: "Spreadable Media", author: "Henry Jenkins, Sam Ford & Joshua Green", description: "Pourquoi/Comment les contenus circulent (culture participative, partage).", category: "Post-Broadcast", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Spreadable+Media+Jenkins+Ford+Green" },
      { title: "Précis de méditations", author: "Collectif", description: "Petit manuel/anthologie de méditations.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Pr%C3%A9cis+de+m%C3%A9ditations+livre" },
    ],
  },
  {
    year: 2022, month: 7,
    books: [
      { title: "Little Bets", author: "Peter Sims", description: "Innover par micro-expériences et itérations rapides.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Little+Bets+Peter+Sims" },
      { title: "Discours sur les sciences et les arts / Discours sur l'inégalité", author: "Jean-Jacques Rousseau", description: "Textes clés sur société, morale, inégalités.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Rousseau+Discours+sur+les+sciences+et+les+arts+Discours+sur+l%27in%C3%A9galit%C3%A9" },
      { title: "Chaos calme", author: "Sandro Veronesi", description: "Roman sur le deuil, le désir, la reconstruction.", category: "Narratives", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Chaos+calme+Sandro+Veronesi" },
    ],
  },
  {
    year: 2022, month: 8,
    books: [
      { title: "Éloge du mariage, de l'engagement et autres folies", author: "Christiane Singer", description: "Essai littéraire sur lien, engagement, sens du couple.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Christiane+Singer+%C3%89loge+du+mariage" },
      { title: "La condition de l'homme moderne", author: "Hannah Arendt", description: "Philosophie politique / modernité / condition humaine.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Hannah+Arendt+La+condition+de+l%27homme+moderne" },
      { title: "Futhark: A Handbook of Rune Magic", author: "Edred Thorsson", description: "Introduction structurée aux runes (symbolique, pratique, tradition).", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Futhark+A+Handbook+of+Rune+Magic+Edred+Thorsson" },
    ],
  },
  {
    year: 2022, month: 9,
    books: [
      { title: "Le Satyricon", author: "Pétrone", description: "Satire romaine: mœurs, excès, société, récit fragmentaire.", category: "Narratives", axis: "free", amazonUrl: "https://www.amazon.com/s?k=P%C3%A9trone+Le+Satyricon" },
      { title: "The Art of Game Design", author: "Jesse Schell", description: "'Lens' de design pour concevoir, tester et équilibrer un jeu.", category: "Playgrounds", axis: "open", amazonUrl: "https://www.amazon.com/s?k=The+Art+of+Game+Design+Jesse+Schell+3rd+Edition" },
      { title: "Cinéma 1: L'image-mouvement", author: "Gilles Deleuze", description: "Philosophie du cinéma via types d'images et de mouvements.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Gilles+Deleuze+Cin%C3%A9ma+1+L%27image-mouvement" },
    ],
  },
  {
    year: 2022, month: 10,
    books: [
      { title: "Cinéma 2: L'image-temps", author: "Gilles Deleuze", description: "Quand le cinéma pense le temps, la mémoire, la perception.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Gilles+Deleuze+Cin%C3%A9ma+2+L%27image-temps" },
      { title: "Cosmos", author: "Carl Sagan", description: "Science + émerveillement: histoire de l'univers et de nos idées.", category: "WorldBuilders", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Cosmos+Carl+Sagan" },
      { title: "Le sentiment même de soi", author: "Antonio R. Damasio", description: "Neurosciences: comment naît la conscience du 'moi' en expérience.", category: "Embodied Cognition", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Antonio+Damasio+Le+sentiment+m%C3%AAme+de+soi" },
    ],
  },
  {
    year: 2022, month: 11,
    books: [
      { title: "hot text: Web Writing That Works", author: "Jonathan & Lisa Price", description: "Écrire pour le web: clarté, structure, UX éditoriale.", category: "Telling Stories", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Hot+Text+Web+Writing+That+Works+Jonathan+Price+Lisa+Price" },
      { title: "The Organism", author: "Kurt Goldstein", description: "Neuro/psycho: vision 'organismique' du vivant et de l'esprit.", category: "Embodied Cognition", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=The+Organism+Kurt+Goldstein" },
      { title: "FUTURETAINMENT", author: "Mike Walsh", description: "Business du futur: comment le divertissement transforme marques/produits.", category: "Post-Broadcast", axis: "open", amazonUrl: "https://www.amazon.com/s?k=FUTURETAINMENT+Mike+Walsh" },
    ],
  },
  {
    year: 2022, month: 12,
    books: [
      { title: "Bubbletecture", author: "Sharon Francis", description: "Architecture/design gonflable (catalogue/essai).", category: "Sensory Rooms", axis: "free", amazonUrl: "https://www.amazon.com/s?k=Bubbletecture+book" },
      { title: "The Seven Arts of Change", author: "David Shaner", description: "Frameworks de transformation/innovation.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=The+Seven+Arts+of+Change+book" },
      { title: "La guerre des yeux", author: "Paul Virilio", description: "Médias/vision: vitesse, images, perception.", category: "Post-Broadcast", axis: "open", amazonUrl: "https://www.amazon.com/s?k=La+guerre+des+yeux+Virilio" },
    ],
  },
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
  {
    year: 2023, month: 6,
    books: [
      { title: "The Ayahuasca Conversations", author: "Various (The Jungle Prescription)", description: "Transcript-style encounters exploring ayahuasca through Western culture and modern medicine.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "" },
      { title: "The Accidental Creative", author: "Todd Henry", description: "Practical methods to stay prolific and creative under real-world deadlines (habits, constraints, routines).", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.ca/Accidental-Creative-Brilliant-Moments-Notice/dp/1591846242" },
    ],
  },
  {
    year: 2023, month: 7,
    books: [
      { title: "Les Mystères du langage", author: "Jay Ingram", description: "A popular-science exploration of language: how it works, how it evolves, and what it reveals about humans and society.", category: "Narratives", axis: "magic", amazonUrl: "" },
      { title: "Designing Voice User Interfaces", author: "Cathy Pearl", description: "Core principles and process for designing effective voice/conversational products (from prompts and flows to testing).", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.ca/Designing-Voice-User-Interfaces-Conversational/dp/1491955414" },
    ],
  },
  {
    year: 2023, month: 8,
    books: [
      { title: "1492", author: "Jacques Attali", description: "A historical deep-dive around the turning point of 1492 and the forces reshaping Europe and the world.", category: "Human Dynamics and System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/1492-JACQUES-ATTALI/dp/2253062340" },
      { title: "The Vagabond's Way", author: "Rolf Potts", description: "366 daily reflections on movement, attention, and how travel changes you.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.ca/Vagabonds-Way-Meditations-Wanderlust-Discovery/dp/0593497457" },
    ],
  },
  {
    year: 2023, month: 9,
    books: [
      { title: "The Zero Marginal Cost Society", author: "Jeremy Rifkin", description: "How networks + the Internet of Things push marginal costs down and shift capitalism toward collaborative commons.", category: "Human Dynamics and System Thinking", axis: "open", amazonUrl: "https://www.amazon.ca/Zero-Marginal-Cost-Society-Collaborative/dp/1137280115" },
      { title: "The Glass Cage", author: "Nicholas Carr", description: "A critique of automation's subtle costs: what we lose in skill, judgment, and meaning when software takes over.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.ca/Glass-Cage-How-Computers-Changing/dp/0393351637" },
    ],
  },
  {
    year: 2023, month: 10,
    books: [
      { title: "Patrimoine mondial de l'UNESCO : Le guide complet des lieux les plus extraordinaires", author: "UNESCO (collectif)", description: "Guide illustré des sites du Patrimoine mondial.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.com/s?k=Patrimoine+mondial+de+l%27UNESCO+%3A+Le+guide+complet+des+lieux+les+plus+extraordinaires+UNESCO+%28collectif%29" },
      { title: "Living in the End Times", author: "Slavoj Žižek", description: "Essai de philosophie politique sur crises et 'fins du monde'.", category: "Human Dynamics and System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Living+in+the+End+Times+Slavoj+%C5%BDi%C5%BEek" },
      { title: "Dark Ecology", author: "Timothy Morton", description: "Écologie philosophique: dépasser la séparation nature/culture.", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Dark+Ecology+Timothy+Morton" },
    ],
  },
  {
    year: 2023, month: 11,
    books: [
      { title: "The Seven Day Circle", author: "Eviatar Zerubavel", description: "Sociologie de la semaine de 7 jours et de l'organisation du temps.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=The+Seven+Day+Circle+Eviatar+Zerubavel" },
      { title: "Damn Good Advice (for People with Talent!)", author: "George Lois", description: "Conseils créatifs/carrière par un directeur artistique mythique.", category: "Telling Stories", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Damn+Good+Advice+%28for+People+with+Talent%21%29+George+Lois" },
      { title: "The 4-Hour Workweek", author: "Tim Ferriss", description: "Design de vie: automatisation, délégation, optimisation du travail.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=The+4-Hour+Workweek+Tim+Ferriss" },
    ],
  },
  {
    year: 2023, month: 12,
    books: [
      { title: "Bicycle Diaries", author: "David Byrne", description: "Carnets de voyage à vélo + réflexions culturelles.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.com/s?k=Bicycle+Diaries+David+Byrne" },
      { title: "World War Z: An Oral History of the Zombie War", author: "Max Brooks", description: "Roman en 'témoignages' sur une guerre mondiale contre les zombies.", category: "Post-Broadcast", axis: "free", amazonUrl: "https://www.amazon.com/s?k=World+War+Z%3A+An+Oral+History+of+the+Zombie+War+Max+Brooks" },
      { title: "Blood, Sweat, and Pixels", author: "Jason Schreier", description: "Enquête sur le développement de jeux vidéo et le crunch.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Blood%2C+Sweat%2C+and+Pixels+Jason+Schreier" },
    ],
  },
  // === 2024 ===
  {
    year: 2024, month: 1,
    books: [
      { title: "The Language Animal", author: "Charles Taylor", description: "Philosophie du langage: comment le symbolique façonne l'humain.", category: "Narratives", axis: "open", amazonUrl: "https://www.amazon.com/s?k=The+Language+Animal+Charles+Taylor" },
      { title: "Out on the Wire", author: "Jessica Abel", description: "BD sur le storytelling radio/podcast et le journalisme narratif.", category: "Post-Broadcast", axis: "free", amazonUrl: "https://www.amazon.com/s?k=Out+on+the+Wire+Jessica+Abel" },
      { title: "Calvinic Magic", author: "Van De Car", description: "Exploration of magical traditions and creative practice.", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Calvinic+Magic+Van+De+Car" },
    ],
  },
  {
    year: 2024, month: 2,
    books: [
      { title: "When: The Scientific Secrets of Perfect Timing", author: "Daniel H. Pink", description: "Science du timing: quand agir, apprendre, décider.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=When%3A+The+Scientific+Secrets+of+Perfect+Timing+Daniel+H.+Pink" },
      { title: "Blink: The Power of Thinking Without Thinking", author: "Malcolm Gladwell", description: "Intuition et jugements rapides (forces + angles morts).", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Blink%3A+The+Power+of+Thinking+Without+Thinking+Malcolm+Gladwell" },
      { title: "Less Than Nothing: Hegel and the Shadow of Dialectical Materialism", author: "Slavoj Žižek", description: "Gros ouvrage sur Hegel/Lacan et matérialisme dialectique.", category: "Human Dynamics and System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Less+Than+Nothing%3A+Hegel+and+the+Shadow+of+Dialectical+Materialism+Slavoj+%C5%BDi%C5%BEek" },
    ],
  },
  {
    year: 2024, month: 3,
    books: [
      { title: "The Fractalist", author: "Benoit B. Mandelbrot", description: "Autobiographie intellectuelle du père des fractales.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=The+Fractalist+Benoit+B.+Mandelbrot" },
      { title: "Cunningham's Encyclopedia of Magical Herbs", author: "Scott Cunningham", description: "Répertoire de plantes + correspondances (traditions/folklore).", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Cunningham%27s+Encyclopedia+of+Magical+Herbs+Scott+Cunningham" },
      { title: "Précis de botanique", author: "Collectif", description: "Manuel de botanique (référence classique).", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Pr%C3%A9cis+de+botanique" },
    ],
  },
  {
    year: 2024, month: 4,
    books: [
      { title: "A Forest of Kings: The Untold Story of the Ancient Maya", author: "Linda Schele & David Freidel", description: "Civilisation maya, épigraphie, histoire et interprétations.", category: "Human Dynamics and System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=A+Forest+of+Kings%3A+The+Untold+Story+of+the+Ancient+Maya+Linda+Schele+David+Freidel" },
      { title: "Révolte consommée: Le mythe de la contre-culture", author: "Joseph Heath & Andrew Potter", description: "Essai critique sur le mythe de la contre-culture et la consommation.", category: "Human Dynamics and System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=R%C3%A9volte+consomm%C3%A9e%3A+Le+mythe+du+grand+br%C3%BBl%C3%A9+Heath+Andrew+Potter" },
      { title: "Tribes: We Need You to Lead Us", author: "Seth Godin", description: "Créer et mener une communauté ('tribu') autour d'une idée.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Tribes%3A+We+Need+You+to+Lead+Us+Seth+Godin" },
    ],
  },
  {
    year: 2024, month: 5,
    books: [
      { title: "L'homme nomade", author: "Jacques Attali", description: "Mobilité, identité, futur des sociétés 'nomades'.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.com/s?k=L%27homme+nomade+Jacques+Attali" },
      { title: "Getting the Love You Want", author: "Harville Hendrix, PhD", description: "Relation (Imago): schémas, blessures, réparation du lien.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Getting+the+Love+You+Want+Harville+Hendrix" },
      { title: "Dialogue and the Art of Thinking Together", author: "William Isaacs", description: "Outils de dialogue collectif pour penser/écouter/décider mieux.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Dialogue+and+the+Art+of+Thinking+Together+William+Isaacs" },
    ],
  },
  {
    year: 2024, month: 6,
    books: [
      { title: "Cibles", author: "Collectif", description: "Exploration thématique sur les objectifs et la direction.", category: "Telling Stories", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Cibles+livre" },
      { title: "No Bad Parts", author: "Richard C. Schwartz", description: "Introduction à l'IFS: comprendre ses 'parts' et guérir.", category: "Inquiry and Practices", axis: "love", amazonUrl: "https://www.amazon.com/s?k=No+Bad+Parts+Richard+C.+Schwartz" },
      { title: "The Creative Habit: Learn It and Use It for Life", author: "Twyla Tharp", description: "Discipline et routines concrètes pour soutenir la créativité.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=The+Creative+Habit%3A+Learn+It+and+Use+It+for+Life+Twyla+Tharp+Mark+Reiter" },
    ],
  },
  {
    year: 2024, month: 7,
    books: [
      { title: "This Is Your Brain on Music", author: "Daniel J. Levitin", description: "Neurosciences de la musique: émotion, mémoire, attention.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.com/s?k=This+Is+Your+Brain+on+Music+Daniel+J.+Levitin" },
      { title: "L'entraînement de l'esprit", author: "Christophe André", description: "Attention, pleine conscience, entraînement mental au quotidien.", category: "Inquiry and Practices", axis: "love", amazonUrl: "https://www.amazon.com/s?k=L%27entra%C3%AEnement+de+l%27esprit+Christophe+Andr%C3%A9" },
    ],
  },
  {
    year: 2024, month: 8,
    books: [
      { title: "Other Minds: The Octopus and the Evolution of Intelligent Life", author: "Peter Godfrey-Smith", description: "Intelligence des pieuvres + évolution de l'esprit (science/philo).", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Other+Minds%3A+The+Octopus+and+the+Evolution+of+Intelligent+Life+Peter+Godfrey-Smith" },
      { title: "The Wisdom of Insecurity", author: "Alan Watts", description: "Apprendre à vivre avec l'incertitude et être présent.", category: "Inquiry and Practices", axis: "free", amazonUrl: "https://www.amazon.com/s?k=The+Wisdom+of+Insecurity+Alan+Watts" },
    ],
  },
  {
    year: 2024, month: 9,
    books: [
      { title: "Ready: How to Know When to Go and When to Stay", author: "David Richo", description: "Discernement relationnel: partir, rester, timing intérieur.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Ready%3A+How+to+Know+When+to+Go+and+When+to+Stay+David+Richo" },
      { title: "L'ennéagramme", author: "Collectif", description: "Introduction à l'ennéagramme et ses 9 types de personnalité.", category: "Inquiry and Practices", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=L%27enn%C3%A9agramme+livre" },
    ],
  },
  {
    year: 2024, month: 10,
    books: [
      { title: "Odyssée", author: "Homère", description: "Épopée fondatrice: le retour d'Ulysse, ruse, épreuves, identité.", category: "WorldBuilders", axis: "free", amazonUrl: "https://www.amazon.com/s?k=Hom%C3%A8re+Odyss%C3%A9e+introduction+Jean" },
      { title: "Histoire de la guerre du Péloponnèse", author: "Thucydide", description: "Récit historique majeur de la guerre Athènes–Sparte, politique et stratégie.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Thucydide+Histoire+de+la+guerre+du+P%C3%A9loponn%C3%A8se" },
      { title: "Emotional Intelligence: Self-Awareness", author: "Harvard Business Review Press", description: "Recueil d'articles HBR sur la conscience de soi au travail (décisions, leadership).", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=HBR+Emotional+Intelligence+Self-Awareness" },
    ],
  },
  {
    year: 2024, month: 11,
    books: [
      { title: "Le singe nu", author: "Desmond Morris", description: "Lecture 'éthologique' de l'humain: comportements, sexualité, société, évolution.", category: "Human Dynamics & System Thinking", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Desmond+Morris+Le+singe+nu" },
      { title: "Le loup des steppes", author: "Hermann Hesse", description: "Roman introspectif sur la dualité, la crise existentielle et la métamorphose.", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Hermann+Hesse+Le+loup+des+steppes" },
      { title: "Design Works: How to Tackle Your Toughest Innovation Challenges Through Business Design", author: "Heather M.A. Fraser", description: "Méthode de business design pour innover, cadrer, prototyper, livrer.", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Design+Works+Heather+M.A.+Fraser" },
    ],
  },
  {
    year: 2024, month: 12,
    books: [
      { title: "Tools of Titans", author: "Tim Ferriss", description: "Tactiques/habitudes d'élite (interviews + routines + frameworks).", category: "Workflows", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=Tools+of+Titans+Tim+" },
      { title: "Les paysages intérieurs", author: "Catherine D'Amours", description: "Essai sociologique: mémoire, territoire et paysages intérieurs.", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Les+paysages+int%C3%A9rieurs+Catherine+D%27Amours" },
      { title: "Information Arts: Intersections of Art, Science, and Technology", author: "Stephen Wilson", description: "Panorama des arts techno-scientifiques et des pratiques hybrides.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Information+Arts+Stephen+Wilson" },
    ],
  },
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

export const driftLibraryExtras: DriftBook[] = [
  { title: "Thierry Kuntzel", author: "Thierry Kuntzel", description: "Ouvrage d'art/théorie — catalogue ou essai sur l'œuvre de Kuntzel.", category: "Sensory Rooms", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Thierry+Kuntzel+livre" },
  { title: "Reinventing the Wheel", author: "Jessica Helfand", description: "Essais sur le design graphique, la culture visuelle et la 'pensée design'.", category: "Telling Stories", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Reinventing+the+Wheel+Jessica+Helfand" },
  { title: "Filthy Ratbag", author: "Celeste Mountjoy", description: "Journal/illustré: humour noir, vulnérabilité, vécu, identité.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Filthy+Ratbag+Celeste+Mountjoy" },
  { title: "The Stack: On Software and Sovereignty", author: "Benjamin H. Bratton", description: "Théorie géopolitique/tech: couches logicielles, plateformes, souveraineté.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.com/s?k=The+Stack+On+Software+and+Sovereignty+Benjamin+Bratton" },
  { title: "A More Beautiful Question", author: "Warren Berger", description: "Art de poser de meilleures questions pour innover et débloquer l'action.", category: "Inquiry and Practices", axis: "calm", amazonUrl: "https://www.amazon.com/s?k=A+More+Beautiful+Question+Warren+Berger" },
  { title: "How to Change Your Mind", author: "Michael Pollan", description: "Histoire/science des psychédéliques et de leurs usages thérapeutiques/culturels.", category: "Inquiry and Practices", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=How+to+Change+Your+Mind+Michael+Pollan" },
  { title: "La magie du Cosmos", author: "Brian Greene", description: "Vulgarisation cosmologie/physique (édition FR de The Fabric of the Cosmos).", category: "Narratives", axis: "magic", amazonUrl: "https://www.amazon.com/s?k=Brian+Greene+La+magie+du+Cosmos" },
  { title: "L'Ensorcellement du monde", author: "Boris Cyrulnik", description: "Psyché, récit, croyances: comment le monde 'enchante' nos esprits et nos liens.", category: "Embodied Cognition", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Boris+Cyrulnik+L%27Ensorcellement+du+monde" },
  { title: "Le Moyen Âge en Occident", author: "Collectif", description: "Synthèse historique sur la société médiévale occidentale.", category: "Human Dynamics & System Thinking", axis: "free", amazonUrl: "https://www.amazon.com/s?k=Le+Moyen+%C3%82ge+en+Occident" },
  { title: "Le feu aux entrailles", author: "Milo Manara & Pedro Almodóvar", description: "Bande dessinée / récit graphique (collab Manara–Almodóvar).", category: "Tangible Play", axis: "love", amazonUrl: "https://www.amazon.com/s?k=Le+feu+aux+entrailles+Manara+Almodovar" },
  { title: "Ubiquitous Computing: Smart Devices, Environments and Interactions", author: "Collectif", description: "Informatique ubiquitaire: environnements intelligents, dispositifs, interactions.", category: "Connected Life", axis: "open", amazonUrl: "https://www.amazon.com/s?k=Ubiquitous+Computing+Smart+Devices+Environments+and+Interactions" },
];

import transmediaMap from '@/assets/drift/transmediamap.jpg';
import gameplanImage from '@/assets/drift/JonathanBelisle-gameplan.jpg';

export const driftLibraryArtefacts: DriftArtefact[] = [
  {
    title: "Transmedia Map",
    author: "Jonathan Bélisle",
    description: "A layered diagram showing Noetical Flux, Perma Flux, Bio/Psy/Geo Flux with layers for mythologies, religions, ecosystems, behaviours, tekhne, and economy.",
    category: "Human Dynamics & System Thinking",
    axis: "open",
    imagePath: transmediaMap,
  },
  {
    title: "Game Plan (2017-2020)",
    author: "Jonathan Bélisle",
    description: "A concentric spiral diagram mapping story-driven innovation, calm magic, publishing, performances, V10 projects, and transformational design.",
    category: "Workflows",
    axis: "calm",
    imagePath: gameplanImage,
  },
  {
    title: "Grille des livrables fidélité v2",
    author: "Jonathan Bélisle",
    description: "Matrice de fidélité des livrables UX — besoins utilisateurs, documents stratégiques, wireframes, prototypes et niveaux de fidélité.",
    category: "Workflows",
    axis: "calm",
    filePath: "/drift/Grille_livrables_fidelite_v2.xls",
  },
  {
    title: "Tableau des transitions architecturales",
    author: "Jonathan Bélisle",
    description: "Ligne du temps de l'évolution architecturale du Web — du Web 1.0 au Web 4.0, couvrant technologies, paradigmes et écosystèmes.",
    category: "Connected Life",
    axis: "open",
    filePath: "/drift/Tableau_des_transitions_architecturales.xls",
  },
  {
    title: "Veille Web 2.0",
    author: "Jonathan Bélisle",
    description: "Grille de veille technologique cartographiant les concepts et plateformes Web 2.0, 3.0 et 4.0 — réseaux sociaux, sémantique, intelligence ambiante.",
    category: "Connected Life",
    axis: "open",
    filePath: "/drift/Veille_Web_2.0.xls",
  },
  {
    title: "Hello Architekt — Cartographie des pratiques",
    author: "Jonathan Bélisle",
    description: "Diagramme concentrique des couches de pratique : du Sensemaking à l'Architecture d'expériences, en passant par le Design de services et le Prototypage rapide.",
    category: "Workflows",
    axis: "calm",
    imagePath: "/drift/Helloarchitekt.png",
  },
  {
    title: "Wuxia le Renard — Le Tonalli",
    author: "Jonathan Bélisle",
    description: "Image du film animé Wuxia le Renard : la scène de remise du tonalli, objet magique guidant le héros dans la forêt de ses rêves.",
    category: "Storyworlds",
    axis: "magic",
    imagePath: "/drift/Wuxia_Tonalli.jpg",
  },
  {
    title: "Wuxia — Scénario de projections augmentées",
    author: "Jonathan Bélisle",
    description: "Storyboard esquissé montrant un parcours utilisateur avec projections, activations spatiales et interactions en réalité augmentée.",
    category: "Storyworlds",
    axis: "magic",
    imagePath: "/drift/Wuxia_Projections.jpg",
  },
  {
    title: "Pistes d'interactions — Capteurs et dispositifs",
    author: "Jonathan Bélisle",
    description: "Grille visuelle de 15 modalités d'interaction : capteurs de proximité, gyroscope, vision par caméra, données météo, reconnaissance gestuelle.",
    category: "Connected Life",
    axis: "open",
    imagePath: "/drift/Pistes_Interactions.jpg",
  },
  {
    title: "Architecture d'expériences — Places, Objects, Archetypes",
    author: "Jonathan Bélisle",
    description: "Diagramme en quadrants croisant lieux, objets, archétypes et rencontres créatives — psycholinguistique et psychogéographie appliquées.",
    category: "Connected Life",
    axis: "open",
    imagePath: "/drift/Experience_Architecture_Diagram.jpg",
  },
  {
    title: "Conférence — Talk en immersion",
    author: "Jonathan Bélisle",
    description: "Photo d'une conférence en format immersif, audience engagée dans un espace industriel reconverti — présentation Applied Poetry.",
    category: "Community",
    axis: "free",
    imagePath: "/drift/Conference_Talk.png",
  },
  {
    title: "Wuxia le Renard — Poster officiel",
    author: "Jonathan Bélisle",
    description: "Affiche officielle du projet transmedia Wuxia le Renard — un monde créé par Jonathan Bélisle, produit par SAGA et TFO.",
    category: "Storyworlds",
    axis: "magic",
    imagePath: "/drift/Poster_Wuxia2.png",
  },
  {
    title: "Atelier de co-création — GameStorming",
    author: "Jonathan Bélisle",
    description: "Photo d'un atelier collaboratif de co-création avec participants engagés autour de sketches, post-its et idéation collective.",
    category: "Facilitation",
    axis: "love",
    imagePath: "/drift/Atelier_3.jpg",
  },
  {
    title: "Applied Poetry — Carte conceptuelle",
    author: "Jonathan Bélisle",
    description: "Sketchnote explorant le concept d'Applied Poetry : Calm Computing, interfaces naturelles, réalités mixtes, haptics et expériences multisensorielles.",
    category: "Applied Poetry",
    axis: "calm",
    imagePath: "/drift/Applied_Poetry.jpeg",
  },
  // --- Batch 3: Wild Child / Calm Computing / IoTheatre universe ---
  {
    title: "Calm Computing V4 — Présentation",
    author: "Jonathan Bélisle",
    description: "Présentation PDF sur la réalité virtuelle, les environnements augmentés, l'IoT et le Calm Computing — vision Applied Poetry.",
    category: "Applied Poetry",
    axis: "calm",
    filePath: "/drift/CalmComputing_V4.pdf",
  },
  {
    title: "IoTheatre — Quartier des spectacles",
    author: "Jonathan Bélisle",
    description: "Illustration du projet IoTheatre au Quartier des spectacles de Montréal — objets connectés et performance urbaine.",
    category: "Connected Life",
    axis: "open",
    imagePath: "/drift/QDS_Iotheatre.jpg",
  },
  {
    title: "Wild Child — Learning about the 5 Senses",
    author: "Jonathan Bélisle",
    description: "Illustration du projet Wild Child — exploration sensorielle et apprentissage par les 5 sens dans un environnement naturel.",
    category: "Community",
    axis: "free",
    imagePath: "/drift/Wild_Child.jpg",
  },
  {
    title: "Spoken Voice — Illustration",
    author: "Jonathan Bélisle",
    description: "Illustration évocatrice de la voix parlée — interface naturelle et communication humaine dans un contexte technologique.",
    category: "Facilitation",
    axis: "love",
    imagePath: "/drift/Spoken_Voice.jpg",
  },
  {
    title: "Interconnectivity — Illustration",
    author: "Jonathan Bélisle",
    description: "Illustration explorant l'interconnectivité entre les systèmes, les personnes et les environnements numériques.",
    category: "Connected Life",
    axis: "open",
    imagePath: "/drift/Interconnectivity.jpg",
  },
  {
    title: "Freakout in a Server Room — Illustration",
    author: "Jonathan Bélisle",
    description: "Illustration humoristique d'un moment de panique dans une salle de serveurs — tension entre calme et chaos technologique.",
    category: "Applied Poetry",
    axis: "calm",
    imagePath: "/drift/Freakout_in_Server_Room.jpg",
  },
  {
    title: "Fighting Inattention — Illustration",
    author: "Jonathan Bélisle",
    description: "Illustration sur le combat contre l'inattention — concentration, présence et design d'interfaces calmes.",
    category: "Applied Poetry",
    axis: "calm",
    imagePath: "/drift/Fighting_Inattention.jpg",
  },
  {
    title: "(Return to) Wild Child — Illustration",
    author: "Jonathan Bélisle",
    description: "Illustration du retour au projet Wild Child — reconnexion avec la nature et les sens dans un monde technologique.",
    category: "Community",
    axis: "free",
    imagePath: "/drift/Return_WildChild.jpg",
  },
  {
    title: "Tale of Loss and Interconnectedness — Mind Map",
    author: "Jonathan Bélisle",
    description: "Carte mentale dessinée à la main explorant les thèmes de perte, d'interconnexion et de narration transmedia.",
    category: "Connected Life",
    axis: "open",
    imagePath: "/drift/Tale_of_Loss.jpg",
  },
  {
    title: "Services Map — Cartographie des services",
    author: "Jonathan Bélisle",
    description: "Tableur détaillant la cartographie des services, workflows et processus opérationnels dans un écosystème créatif.",
    category: "Workflows",
    axis: "calm",
    filePath: "/drift/Services_Map.xls",
  },
  {
    title: "Environments, Behaviors & Organizations — Diagramme",
    author: "Jonathan Bélisle",
    description: "Diagramme dessiné à la main explorant les intersections entre design d'environnements, comportements, organisations et architecture d'expériences.",
    category: "Connected Life",
    axis: "open",
    imagePath: "/drift/Environments_Behaviors_Organizations.jpg",
  },
  {
    title: "Disaster Dialogues — Présentation",
    author: "Jonathan Bélisle",
    description: "Présentation sur les dialogues en situation de crise — résilience collective, narration et transformation communautaire.",
    category: "Community",
    axis: "free",
    filePath: "/drift/Disaster_Dialogues.pdf",
  },
  {
    title: "Story-Driven Enterprise Transformation — Présentation",
    author: "Jonathan Bélisle",
    description: "Présentation sur la transformation d'entreprise guidée par le récit — storyworlds, narration stratégique et changement organisationnel.",
    category: "Storyworlds",
    axis: "magic",
    filePath: "/drift/StoryDrivenEnterpriseTransformation.pdf",
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
