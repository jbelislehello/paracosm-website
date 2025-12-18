// Voice Computing Service Contracts
// Based on Tonalli Foundational Prompt architecture

export type TotemType = 'free' | 'p1_dignity' | 'p2_anticoercion';
export type LanguageMode = 'fr' | 'en' | 'bilingual';
export type ProcessingStage = 
  | 'INPUT_RECEIVED'
  | 'TOTEM_CHECK'
  | 'REDACTION_APPLIED'
  | 'PROVIDER_CALL_START'
  | 'PROVIDER_CALL_END'
  | 'OUTPUT_DELIVERED';

export interface VoiceComputingConfig {
  totem: TotemType;
  language: LanguageMode;
  projectId: string;
  foundationalPrompt: string;
  userId?: string;
}

export interface TotemConfig {
  audio: 'optional' | 'off';
  memory: 'opt-in' | 'off';
  sharing: 'full' | 'sanitized';
  correlationProtection?: boolean;
}

export const TOTEM_CONFIGS: Record<TotemType, TotemConfig> = {
  free: { audio: 'optional', memory: 'opt-in', sharing: 'full' },
  p1_dignity: { audio: 'off', memory: 'off', sharing: 'sanitized' },
  p2_anticoercion: { audio: 'off', memory: 'off', sharing: 'sanitized', correlationProtection: true }
};

export interface ConsentState {
  totemSelected: boolean;
  totemType: TotemType | null;
  memoryApproved: boolean;
  audioRetentionAllowed: boolean;
  trace: TraceEntry[];
}

export interface TraceEntry {
  stage: ProcessingStage | string;
  timestamp: Date;
  details?: string;
}

export interface VoiceMessage {
  id: string;
  type: 'user' | 'wuxia';
  content: string;
  audioBlob?: Blob;
  timestamp: Date;
  consentState: ConsentState;
  metadata?: VoiceMessageMetadata;
}

export interface VoiceMessageMetadata {
  emotion?: string;
  confidence?: number;
  tileContext?: TileContext;
  language?: LanguageMode;
}

export interface TileContext {
  row: number;
  col: number;
  season: string;
  prompt?: string;
}

// PIP Interface - Pluggable Intelligent Processor
export interface PIP<TInput, TOutput> {
  name: string;
  process(input: TInput, config: VoiceComputingConfig): Promise<TOutput>;
  canProcess(input: TInput): boolean;
}

// Consent Command Detection
export interface ConsentCommand {
  type: 'memory_block' | 'memory_approve' | 'export_request' | 'session_purge';
  phrase: string;
  action: string;
  trace: string;
}

export interface ConsentDetectionResult {
  commandDetected: boolean;
  command?: ConsentCommand;
  cleanedText: string;
}

// Wuxia Agent Types
export interface WuxiaGreeting {
  text: string;
  audioUrl?: string;
  language: LanguageMode;
}

export interface WuxiaResponse {
  text: string;
  audioBlob?: Blob;
  emotion?: string;
  shouldRemember?: boolean;
  tileNavigation?: 'glitch' | 'drift' | 'tune';
}

export interface WuxiaFarewell {
  text: string;
  audioUrl?: string;
  sessionSummary?: string;
}

// Voice Gateway Types
export interface VoiceProcessingResult {
  success: boolean;
  response?: WuxiaResponse;
  error?: string;
  trace: TraceEntry[];
}

export interface VoiceGatewayState {
  isProcessing: boolean;
  currentStage: ProcessingStage | null;
  consentState: ConsentState;
  sessionActive: boolean;
}

// Provider Types
export interface VoiceProvider {
  name: string;
  speechToText(audio: Blob): Promise<string>;
  textToSpeech(text: string, voice?: string): Promise<Blob>;
  isAvailable(): boolean;
}

// Redaction Types
export interface RedactionResult {
  originalText: string;
  redactedText: string;
  redactedPhrases: string[];
  totemApplied: TotemType;
}

// Export Types
export interface SanitizedExport {
  content: string;
  metadata: {
    exportedAt: Date;
    sanitized: boolean;
    totemType: TotemType;
  };
  excludedFields: string[];
}

// Error Types
export class TotemRequiredError extends Error {
  constructor() {
    super('TOTEM selection required before voice session');
    this.name = 'TotemRequiredError';
  }
}

export class ConsentBlockedError extends Error {
  constructor(action: string) {
    super(`Action blocked by consent: ${action}`);
    this.name = 'ConsentBlockedError';
  }
}

// Initial States
export const initialConsentState: ConsentState = {
  totemSelected: false,
  totemType: null,
  memoryApproved: false,
  audioRetentionAllowed: false,
  trace: []
};
