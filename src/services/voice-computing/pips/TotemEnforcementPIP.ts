// TOTEM Enforcement PIP - Implements 5 Minimal Proofs from tonalliIntegration.ts

import type { 
  PIP, 
  VoiceComputingConfig, 
  ConsentState, 
  TotemType,
  RedactionResult,
  SanitizedExport,
  TraceEntry
} from '../types';
import { TOTEM_CONFIGS, TotemRequiredError, ConsentBlockedError } from '../types';
import { MINIMAL_PROOFS } from '@/data/tonalliIntegration';

export interface TotemEnforcementInput {
  text?: string;
  action: 'check_totem' | 'redact' | 'check_audio' | 'check_memory' | 'sanitize_export';
  consentState: ConsentState;
  data?: any;
}

export interface TotemEnforcementOutput {
  allowed: boolean;
  result?: RedactionResult | SanitizedExport | boolean;
  trace: TraceEntry;
}

// Sensitive patterns to redact in P1/P2 modes
const SENSITIVE_PATTERNS = [
  /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Full names
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
  /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g, // Dates
  /\b\d+\s*(rue|street|avenue|av|blvd|boulevard)\b/gi, // Addresses
];

export class TotemEnforcementPIP implements PIP<TotemEnforcementInput, TotemEnforcementOutput> {
  name = 'TotemEnforcementPIP';

  canProcess(input: TotemEnforcementInput): boolean {
    return input.action !== undefined;
  }

  async process(
    input: TotemEnforcementInput, 
    config: VoiceComputingConfig
  ): Promise<TotemEnforcementOutput> {
    const { action, consentState, text, data } = input;

    switch (action) {
      case 'check_totem':
        return this.enforceTotemSelection(consentState);
      
      case 'redact':
        return this.applyRedaction(text || '', config.totem);
      
      case 'check_audio':
        return this.shouldRetainAudio(config.totem, consentState);
      
      case 'check_memory':
        return this.isMemoryWriteAllowed(consentState);
      
      case 'sanitize_export':
        return this.sanitizeExport(data, config.totem);
      
      default:
        return {
          allowed: false,
          trace: { stage: 'TOTEM_CHECK', timestamp: new Date(), details: 'Unknown action' }
        };
    }
  }

  // Proof 1: No session without TOTEM
  private enforceTotemSelection(state: ConsentState): TotemEnforcementOutput {
    const trace: TraceEntry = {
      stage: 'TOTEM_CHECK',
      timestamp: new Date(),
      details: state.totemSelected 
        ? `TOTEM_SELECTED: ${state.totemType}`
        : MINIMAL_PROOFS[0].trace // "ACTION_BLOCKED: NO_TOTEM"
    };

    return {
      allowed: state.totemSelected,
      trace
    };
  }

  // Proof 2: Redaction before provider
  private applyRedaction(text: string, totem: TotemType): TotemEnforcementOutput {
    const totemConfig = TOTEM_CONFIGS[totem];
    let redactedText = text;
    const redactedPhrases: string[] = [];

    // Only apply redaction in dignity modes
    if (totemConfig.sharing === 'sanitized') {
      SENSITIVE_PATTERNS.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            redactedPhrases.push(match);
            redactedText = redactedText.replace(match, '[REDACTED]');
          });
        }
      });
    }

    const result: RedactionResult = {
      originalText: text,
      redactedText,
      redactedPhrases,
      totemApplied: totem
    };

    return {
      allowed: true,
      result,
      trace: {
        stage: 'REDACTION_APPLIED',
        timestamp: new Date(),
        details: `Redacted ${redactedPhrases.length} sensitive phrases`
      }
    };
  }

  // Proof 3: No audio retention in P1/P2
  private shouldRetainAudio(totem: TotemType, state: ConsentState): TotemEnforcementOutput {
    const totemConfig = TOTEM_CONFIGS[totem];
    const allowed = totemConfig.audio === 'optional' && state.audioRetentionAllowed;

    return {
      allowed,
      result: allowed,
      trace: {
        stage: allowed ? 'AUDIO_STORE_ALLOWED' : 'AUDIO_STORE_BLOCKED',
        timestamp: new Date(),
        details: MINIMAL_PROOFS[2].trace
      }
    };
  }

  // Proof 4: Memory write is opt-in
  private isMemoryWriteAllowed(state: ConsentState): TotemEnforcementOutput {
    const allowed = state.memoryApproved;

    return {
      allowed,
      result: allowed,
      trace: {
        stage: allowed ? 'MEMORY_WRITE_APPROVED' : 'MEMORY_WRITE_BLOCKED',
        timestamp: new Date(),
        details: MINIMAL_PROOFS[3].trace
      }
    };
  }

  // Proof 5: Export sanitized by default
  private sanitizeExport(data: any, totem: TotemType): TotemEnforcementOutput {
    const totemConfig = TOTEM_CONFIGS[totem];
    const excludedFields: string[] = [];

    let sanitizedContent = data;

    if (totemConfig.sharing === 'sanitized') {
      // Remove sensitive fields
      if (typeof data === 'object') {
        const sensitiveKeys = ['email', 'phone', 'address', 'name', 'userId', 'ip'];
        sanitizedContent = { ...data };
        sensitiveKeys.forEach(key => {
          if (key in sanitizedContent) {
            excludedFields.push(key);
            delete sanitizedContent[key];
          }
        });
      }

      // Apply text redaction if string
      if (typeof data === 'string') {
        SENSITIVE_PATTERNS.forEach(pattern => {
          sanitizedContent = sanitizedContent.replace(pattern, '[REDACTED]');
        });
      }
    }

    const result: SanitizedExport = {
      content: typeof sanitizedContent === 'string' 
        ? sanitizedContent 
        : JSON.stringify(sanitizedContent, null, 2),
      metadata: {
        exportedAt: new Date(),
        sanitized: totemConfig.sharing === 'sanitized',
        totemType: totem
      },
      excludedFields
    };

    return {
      allowed: true,
      result,
      trace: {
        stage: 'EXPORT_CREATED',
        timestamp: new Date(),
        details: `sanitized=${totemConfig.sharing === 'sanitized'}`
      }
    };
  }
}

export const totemEnforcementPIP = new TotemEnforcementPIP();
