// Consent Detection PIP - Detects universal voice commands from tonalliIntegration.ts

import type { 
  PIP, 
  VoiceComputingConfig, 
  ConsentCommand,
  ConsentDetectionResult,
  TraceEntry
} from '../types';
import { CONSENT_COMMANDS } from '@/data/tonalliIntegration';

export interface ConsentDetectionInput {
  text: string;
  language?: 'fr' | 'en' | 'bilingual';
}

export interface ConsentDetectionOutput {
  result: ConsentDetectionResult;
  trace: TraceEntry;
}

// Pattern mapping for consent commands (bilingual)
const CONSENT_PATTERNS: Record<ConsentCommand['type'], RegExp[]> = {
  memory_block: [
    /ne garde pas (ça|cela|ce moment)/i,
    /oublie (ça|cela|ce que)/i,
    /don'?t (keep|remember|save|store) (this|that)/i,
    /forget (this|that|what i said)/i,
    /off the record/i,
    /pas dans la mémoire/i
  ],
  memory_approve: [
    /souviens[- ]?toi de (ça|cela|ce moment)/i,
    /garde (ça|cela) en mémoire/i,
    /remember (this|that|what i said)/i,
    /keep (this|that) in memory/i,
    /save (this|that)/i,
    /note (this|that)/i
  ],
  export_request: [
    /je veux exporter/i,
    /exporte (mon|ma|mes|tout)/i,
    /export (my|this|everything)/i,
    /download (my|this)/i,
    /give me (my|the) data/i,
    /télécharge/i
  ],
  session_purge: [
    /efface tout/i,
    /supprime tout/i,
    /delete everything/i,
    /clear (all|session|everything)/i,
    /wipe (my|the) session/i,
    /recommence à zéro/i,
    /start (fresh|over)/i
  ]
};

// Map pattern types to CONSENT_COMMANDS from tonalliIntegration.ts
const COMMAND_MAPPING: Record<string, ConsentCommand> = {
  memory_block: { ...CONSENT_COMMANDS[0], type: 'memory_block' },
  memory_approve: { ...CONSENT_COMMANDS[1], type: 'memory_approve' },
  export_request: { ...CONSENT_COMMANDS[2], type: 'export_request' },
  session_purge: { ...CONSENT_COMMANDS[3], type: 'session_purge' }
};

export class ConsentDetectionPIP implements PIP<ConsentDetectionInput, ConsentDetectionOutput> {
  name = 'ConsentDetectionPIP';

  canProcess(input: ConsentDetectionInput): boolean {
    return typeof input.text === 'string' && input.text.length > 0;
  }

  async process(
    input: ConsentDetectionInput, 
    config: VoiceComputingConfig
  ): Promise<ConsentDetectionOutput> {
    const { text } = input;
    
    // Check all consent patterns
    for (const [commandType, patterns] of Object.entries(CONSENT_PATTERNS)) {
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const command = COMMAND_MAPPING[commandType];
          const cleanedText = text.replace(pattern, '').trim();

          return {
            result: {
              commandDetected: true,
              command: {
                ...command,
                type: commandType as ConsentCommand['type']
              },
              cleanedText
            },
            trace: {
              stage: command.trace,
              timestamp: new Date(),
              details: `Detected: "${match[0]}"`
            }
          };
        }
      }
    }

    // No consent command detected
    return {
      result: {
        commandDetected: false,
        cleanedText: text
      },
      trace: {
        stage: 'CONSENT_CHECK_PASSED',
        timestamp: new Date(),
        details: 'No consent command detected'
      }
    };
  }

  // Helper to check if text contains any consent-related language
  containsConsentLanguage(text: string): boolean {
    const allPatterns = Object.values(CONSENT_PATTERNS).flat();
    return allPatterns.some(pattern => pattern.test(text));
  }

  // Extract multiple commands if present (for complex utterances)
  async extractAllCommands(text: string): Promise<ConsentCommand[]> {
    const commands: ConsentCommand[] = [];

    for (const [commandType, patterns] of Object.entries(CONSENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          commands.push({
            ...COMMAND_MAPPING[commandType],
            type: commandType as ConsentCommand['type']
          });
          break; // Only add each command type once
        }
      }
    }

    return commands;
  }
}

export const consentDetectionPIP = new ConsentDetectionPIP();
