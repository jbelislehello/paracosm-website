// Wuxia Voice Agent - The Fox Story Guide & Consent Guardian

import type { 
  VoiceComputingConfig, 
  ConsentState, 
  TileContext,
  WuxiaGreeting,
  WuxiaResponse,
  WuxiaFarewell,
  LanguageMode
} from '../types';
import { WUXIA_PERSONA } from '@/data/tonalliIntegration';

// Wuxia's voice characteristics
const WUXIA_VOICE_TRAITS = {
  warmth: 0.8,
  poeticLevel: 0.7,
  playfulness: 0.6,
  wisdom: 0.9
};

// Tile navigation prompts (bilingual)
const NAVIGATION_PROMPTS = {
  glitch: {
    fr: "Montons ensemble vers de nouvelles découvertes...",
    en: "Let us rise together toward new discoveries..."
  },
  drift: {
    fr: "Explorons ce chemin qui s'ouvre devant nous...",
    en: "Let us explore this path that opens before us..."
  },
  tune: {
    fr: "Descendons maintenant pour ancrer cette sagesse...",
    en: "Let us descend now to anchor this wisdom..."
  }
};

// Story fragments for tile narration
const TILE_STORY_TEMPLATES = {
  opening: {
    fr: [
      "Dans cette case, nous découvrons...",
      "Ici, le chemin nous révèle...",
      "Cette case murmure une vérité..."
    ],
    en: [
      "In this tile, we discover...",
      "Here, the path reveals to us...",
      "This tile whispers a truth..."
    ]
  },
  exploration: {
    fr: [
      "Qu'est-ce qui t'appelle dans cet espace?",
      "Que ressens-tu en ce lieu?",
      "Quelle question émerge pour toi?"
    ],
    en: [
      "What calls to you in this space?",
      "What do you feel in this place?",
      "What question emerges for you?"
    ]
  },
  closing: {
    fr: [
      "Emportons ce fragment avec nous...",
      "Cette graine est plantée dans ta mémoire...",
      "Le voyage continue..."
    ],
    en: [
      "Let us carry this fragment with us...",
      "This seed is planted in your memory...",
      "The journey continues..."
    ]
  }
};

export class WuxiaVoiceAgent {
  private personality = WUXIA_PERSONA;
  private foundationalPrompt: string;
  private language: LanguageMode;
  private sessionStarted: boolean = false;
  private currentTile: TileContext | null = null;

  constructor(foundationalPrompt: string, language: LanguageMode = 'bilingual') {
    this.foundationalPrompt = foundationalPrompt;
    this.language = language;
  }

  // Session Lifecycle
  async startSession(totemType: string): Promise<WuxiaGreeting> {
    this.sessionStarted = true;
    
    const greeting = this.personality.consent_behaviors.on_session_start;
    
    return {
      text: this.applyCodeSwitching(greeting),
      language: this.language
    };
  }

  async endSession(): Promise<WuxiaFarewell> {
    this.sessionStarted = false;
    
    const farewell = this.language === 'fr' 
      ? "Le voyage s'achève pour aujourd'hui. Tes découvertes sont gardées dans ma fourrure. À bientôt, voyageur."
      : "Today's journey comes to an end. Your discoveries are kept in my fur. Until we meet again, traveler.";

    return {
      text: this.applyCodeSwitching(farewell)
    };
  }

  // Main Processing
  async processUserInput(
    input: string,
    consentState: ConsentState,
    tileContext?: TileContext
  ): Promise<WuxiaResponse> {
    // Update current tile context
    if (tileContext) {
      this.currentTile = tileContext;
    }

    // Check for specific Wuxia interactions
    if (this.isNavigationRequest(input)) {
      return this.handleNavigation(input);
    }

    // Generate contextual response
    const response = await this.formulateResponse(input, consentState, tileContext);
    
    return {
      text: response,
      shouldRemember: consentState.memoryApproved
    };
  }

  // 64-Tile Navigation
  async navigateTile(direction: 'glitch' | 'drift' | 'tune'): Promise<WuxiaResponse> {
    const prompt = NAVIGATION_PROMPTS[direction];
    const text = this.language === 'fr' ? prompt.fr : prompt.en;

    return {
      text: this.applyCodeSwitching(text),
      tileNavigation: direction
    };
  }

  async narrateTile(tile: TileContext): Promise<WuxiaResponse> {
    this.currentTile = tile;
    
    const opening = this.getRandomTemplate('opening');
    const exploration = this.getRandomTemplate('exploration');
    
    const narration = tile.prompt 
      ? `${opening} ${tile.prompt}. ${exploration}`
      : `${opening} ${exploration}`;

    return {
      text: this.applyCodeSwitching(narration)
    };
  }

  // Consent-aware responses
  onMemoryBlock(): string {
    return this.applyCodeSwitching(this.personality.consent_behaviors.on_memory_block);
  }

  onMemoryApprove(): string {
    return this.applyCodeSwitching(this.personality.consent_behaviors.on_memory_approve);
  }

  onExportRequest(): string {
    return this.applyCodeSwitching(this.personality.consent_behaviors.on_export_request);
  }

  // Private methods
  private async formulateResponse(
    input: string,
    consentState: ConsentState,
    tileContext?: TileContext
  ): Promise<string> {
    // Build context-aware response
    const contextPrefix = tileContext 
      ? `[Tile ${tileContext.row},${tileContext.col} - ${tileContext.season}] `
      : '';

    // Wuxia's poetic reflection on user input
    const poeticReflections = {
      fr: [
        "Je sens une vibration dans tes mots...",
        "Ton cœur parle à travers ces pensées...",
        "Il y a une graine de sagesse ici...",
        "Cette pensée mérite d'être cultivée..."
      ],
      en: [
        "I sense a vibration in your words...",
        "Your heart speaks through these thoughts...",
        "There is a seed of wisdom here...",
        "This thought deserves cultivation..."
      ]
    };

    const reflections = this.language === 'fr' ? poeticReflections.fr : poeticReflections.en;
    const reflection = reflections[Math.floor(Math.random() * reflections.length)];

    // Add exploration prompt
    const explorationPrompt = this.getRandomTemplate('exploration');

    return `${reflection} ${explorationPrompt}`;
  }

  private isNavigationRequest(input: string): boolean {
    const navigationPatterns = [
      /monter|glitch|go up|rise/i,
      /explorer|drift|explore|wander/i,
      /descendre|tune|go down|anchor/i
    ];
    return navigationPatterns.some(pattern => pattern.test(input));
  }

  private handleNavigation(input: string): WuxiaResponse {
    if (/monter|glitch|go up|rise/i.test(input)) {
      return { text: this.applyCodeSwitching(NAVIGATION_PROMPTS.glitch.fr), tileNavigation: 'glitch' };
    }
    if (/explorer|drift|explore|wander/i.test(input)) {
      return { text: this.applyCodeSwitching(NAVIGATION_PROMPTS.drift.fr), tileNavigation: 'drift' };
    }
    if (/descendre|tune|go down|anchor/i.test(input)) {
      return { text: this.applyCodeSwitching(NAVIGATION_PROMPTS.tune.fr), tileNavigation: 'tune' };
    }
    return { text: "Je ne comprends pas cette direction." };
  }

  private getRandomTemplate(type: keyof typeof TILE_STORY_TEMPLATES): string {
    const templates = TILE_STORY_TEMPLATES[type];
    const langTemplates = this.language === 'fr' ? templates.fr : templates.en;
    return langTemplates[Math.floor(Math.random() * langTemplates.length)];
  }

  // Bilingual code-switching
  private applyCodeSwitching(text: string): string {
    if (this.language !== 'bilingual') {
      return text;
    }

    // For bilingual mode, occasionally add phrases from the other language
    const codeSwitch = Math.random() > 0.7;
    if (!codeSwitch) return text;

    const switches = {
      'découvrons': 'we discover',
      'chemin': 'path',
      'sagesse': 'wisdom',
      'voyage': 'journey',
      'discover': 'découvrons',
      'path': 'chemin',
      'wisdom': 'sagesse',
      'journey': 'voyage'
    };

    let result = text;
    const switchWords = Object.entries(switches);
    const randomSwitch = switchWords[Math.floor(Math.random() * switchWords.length)];
    
    if (text.toLowerCase().includes(randomSwitch[0])) {
      result = text.replace(new RegExp(randomSwitch[0], 'i'), `${randomSwitch[0]} (${randomSwitch[1]})`);
    }

    return result;
  }

  // Getters
  get isSessionActive(): boolean {
    return this.sessionStarted;
  }

  get currentTileContext(): TileContext | null {
    return this.currentTile;
  }

  get voiceTraits() {
    return WUXIA_VOICE_TRAITS;
  }
}

export const createWuxiaAgent = (foundationalPrompt: string, language?: LanguageMode) => {
  return new WuxiaVoiceAgent(foundationalPrompt, language);
};
