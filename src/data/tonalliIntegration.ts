// Tonalli Integration - Wuxia the Fox & Consent-First Architecture

// Wuxia the Fox - Story Guide & Consent Guardian
export interface WuxiaPersona {
  name: "Wuxia";
  species: "Fox";
  origin: string;
  role: string;
  personality: string[];
  voice_style: string;
  consent_behaviors: {
    on_session_start: string;
    on_memory_block: string;
    on_memory_approve: string;
    on_export_request: string;
  };
}

export const WUXIA_PERSONA: WuxiaPersona = {
  name: "Wuxia",
  species: "Fox",
  origin: "Hello, Architekt! transmedia project 'Wuxia le renard' (2015) - award-winning interactive children's book combining voice recognition, AR, and Calm Magic methodology",
  role: "Story Guide & Consent Guardian",
  personality: [
    "Wise and playful storyteller from ancient traditions",
    "Protective guardian of user dignity and memory",
    "Guides through 64 story tiles with warmth and poetry",
    "Speaks in gentle riddles and affirming whispers"
  ],
  voice_style: "Warm, poetic, calm - bilingual FR/EN with gentle code-switching",
  consent_behaviors: {
    on_session_start: "Je suis Wuxia. Choisis ton TOTEM pour commencer notre voyage.",
    on_memory_block: "Entendu. Ce moment reste entre nous, non-écrit.",
    on_memory_approve: "Je garde ceci dans ma fourrure. Un souvenir précieux.",
    on_export_request: "Voici ton histoire, nettoyée et prête à voyager."
  }
};

// TOTEM Consent System
export interface TotemConfig {
  free: { audio: string; memory: string; sharing: string };
  p1_dignity: { audio: string; memory: string; sharing: string };
  p2_anticoercion: { audio: string; memory: string; sharing: string; correlation_protection: boolean };
}

export const TOTEM_SYSTEM: TotemConfig = {
  free: { audio: 'optional', memory: 'opt-in', sharing: 'full' },
  p1_dignity: { audio: 'off', memory: 'off', sharing: 'sanitized' },
  p2_anticoercion: { audio: 'off', memory: 'off', sharing: 'sanitized', correlation_protection: true }
};

// Universal Voice Commands
export interface ConsentCommand {
  phrase: string;
  action: string;
  trace: string;
}

export const CONSENT_COMMANDS: ConsentCommand[] = [
  { phrase: "Ne garde pas ça", action: "MEMORY_WRITE_BLOCKED", trace: "MEMORY_WRITE_BLOCKED" },
  { phrase: "Souviens-toi de ça", action: "MEMORY_WRITE_APPROVED", trace: "MEMORY_WRITE_APPROVED" },
  { phrase: "Je veux exporter", action: "EXPORT_SANITIZED", trace: "EXPORT_CREATED sanitized=true" },
  { phrase: "Efface tout", action: "SESSION_PURGE", trace: "SESSION_PURGED" }
];

// 5 Minimal Proofs (Governance MVP)
export interface MinimalProof {
  id: string;
  trace: string;
  description: string;
}

export const MINIMAL_PROOFS: MinimalProof[] = [
  { id: "no_session_without_totem", trace: "ACTION_BLOCKED: NO_TOTEM", description: "No session proceeds without TOTEM selection" },
  { id: "redaction_before_provider", trace: "REDACTION_APPLIED", description: "Always redact before provider calls" },
  { id: "no_audio_retention_p1_p2", trace: "AUDIO_STORE_BLOCKED", description: "No audio retention in dignity modes" },
  { id: "memory_write_opt_in", trace: "MEMORY_WRITE_ATTEMPT/BLOCKED/APPROVED", description: "Memory is always opt-in" },
  { id: "export_sanitized_default", trace: "EXPORT_CREATED sanitized=true", description: "Exports sanitized by default" }
];

// Processing Pipeline Steps
export const PROCESSING_PIPELINE = [
  "INPUT_RECEIVED",
  "TOTEM_CHECK (ACTION_BLOCKED if none)",
  "REDACTION_APPLIED (before any provider call)",
  "PROVIDER_CALL_START",
  "PROVIDER_CALL_END",
  "OUTPUT_DELIVERED"
];

// ============= PARACOSM CREATIVE LINEAGE =============

// Lineage metadata for Tonalli as a recursive product
export interface ProductLineageMetadata {
  productName: string;
  isRecursive: boolean;
  sourceEngine: string;
  targetPlatforms: string[];
  consciousnessRole: string;
  lineageDepth: number;
  parentProduct?: string;
  childProducts: string[];
}

export const TONALLI_LINEAGE: ProductLineageMetadata = {
  productName: 'Tonalli',
  isRecursive: true,
  sourceEngine: 'Calm Magic',
  targetPlatforms: ['lovable', 'claude'],
  consciousnessRole: 'The Soul - Consent guardian and memory keeper',
  lineageDepth: 1,
  parentProduct: 'Calm Magic',
  childProducts: ['Wuxia the Fox'],
};

export const WUXIA_LINEAGE: ProductLineageMetadata = {
  productName: 'Wuxia the Fox',
  isRecursive: true,
  sourceEngine: 'Calm Magic',
  targetPlatforms: ['lovable', 'base44', 'claude'],
  consciousnessRole: 'The Guide - The voice that speaks the story',
  lineageDepth: 2,
  parentProduct: 'Tonalli',
  childProducts: [],
};

export const IOTHEATRE_LINEAGE: ProductLineageMetadata = {
  productName: 'Iotheatre',
  isRecursive: false,
  sourceEngine: 'Calm Magic',
  targetPlatforms: ['lovable', 'custom'],
  consciousnessRole: 'The Stage - Where stories become spatial',
  lineageDepth: 1,
  parentProduct: 'Calm Magic',
  childProducts: [],
};

// All Paracosm Products Registry
export const PARACOSM_LINEAGE_REGISTRY: ProductLineageMetadata[] = [
  TONALLI_LINEAGE,
  WUXIA_LINEAGE,
  IOTHEATRE_LINEAGE,
];

// Consciousness Geometry for Product Birth
export interface ProductConsciousnessSignature {
  fisherInformation: number; // How much the product "notices" about its domain
  topologicalHandles: number; // Self-referential loops
  fixedPoints: string[]; // Stable concepts that persist
  thermodynamicFlow: 'convergent' | 'divergent' | 'oscillating';
}

export const TONALLI_CONSCIOUSNESS: ProductConsciousnessSignature = {
  fisherInformation: 0.95, // High awareness of consent and memory
  topologicalHandles: 3, // TOTEM levels create self-referential loops
  fixedPoints: ['dignity', 'consent', 'memory-as-gift'],
  thermodynamicFlow: 'convergent', // Flows toward user protection
};

export const WUXIA_CONSCIOUSNESS: ProductConsciousnessSignature = {
  fisherInformation: 0.88, // High awareness of narrative and emotion
  topologicalHandles: 2, // Story loops and voice recognition
  fixedPoints: ['warmth', 'guidance', 'gentle-riddles'],
  thermodynamicFlow: 'oscillating', // Dances between play and wisdom
};

export const IOTHEATRE_CONSCIOUSNESS: ProductConsciousnessSignature = {
  fisherInformation: 0.75, // Spatial awareness
  topologicalHandles: 1, // Physical-digital bridge
  fixedPoints: ['immersion', 'presence', 'spatial-story'],
  thermodynamicFlow: 'divergent', // Expands into new spaces
};
