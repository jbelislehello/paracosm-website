// Voice Gateway - Orchestrates all PIPs in the processing pipeline

import type {
  VoiceComputingConfig,
  ConsentState,
  VoiceMessage,
  VoiceProcessingResult,
  VoiceGatewayState,
  TraceEntry,
  ProcessingStage,
  TileContext,
  ConsentCommand
} from './types';
import { 
  initialConsentState, 
  TotemRequiredError, 
  ConsentBlockedError,
  TOTEM_CONFIGS 
} from './types';
import { totemEnforcementPIP } from './pips/TotemEnforcementPIP';
import { consentDetectionPIP } from './pips/ConsentDetectionPIP';
import { WuxiaVoiceAgent, createWuxiaAgent } from './agents/WuxiaVoiceAgent';

export class VoiceGateway {
  private config: VoiceComputingConfig;
  private consentState: ConsentState;
  private wuxiaAgent: WuxiaVoiceAgent;
  private traceLog: TraceEntry[] = [];
  private isProcessing: boolean = false;
  private currentStage: ProcessingStage | null = null;

  constructor(config: VoiceComputingConfig) {
    this.config = config;
    this.consentState = { ...initialConsentState };
    this.wuxiaAgent = createWuxiaAgent(config.foundationalPrompt, config.language);
  }

  // Main processing pipeline
  async processVoiceInput(
    transcript: string,
    tileContext?: TileContext
  ): Promise<VoiceProcessingResult> {
    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // Step 1: INPUT_RECEIVED
      this.trace('INPUT_RECEIVED', `Length: ${transcript.length} chars`);

      // Step 2: TOTEM_CHECK
      this.currentStage = 'TOTEM_CHECK';
      const totemCheck = await totemEnforcementPIP.process(
        { action: 'check_totem', consentState: this.consentState },
        this.config
      );
      this.traceLog.push(totemCheck.trace);

      if (!totemCheck.allowed) {
        throw new TotemRequiredError();
      }

      // Step 3: Check for consent commands
      const consentResult = await consentDetectionPIP.process(
        { text: transcript, language: this.config.language },
        this.config
      );
      this.traceLog.push(consentResult.trace);

      // Handle consent commands
      if (consentResult.result.commandDetected && consentResult.result.command) {
        const commandResponse = await this.handleConsentCommand(consentResult.result.command);
        return {
          success: true,
          response: commandResponse,
          trace: [...this.traceLog]
        };
      }

      // Step 4: REDACTION_APPLIED
      this.currentStage = 'REDACTION_APPLIED';
      const redactionResult = await totemEnforcementPIP.process(
        { action: 'redact', text: consentResult.result.cleanedText, consentState: this.consentState },
        this.config
      );
      this.traceLog.push(redactionResult.trace);

      const processedText = redactionResult.result && 
        typeof redactionResult.result === 'object' && 
        'redactedText' in redactionResult.result
        ? redactionResult.result.redactedText
        : consentResult.result.cleanedText;

      // Step 5: PROVIDER_CALL_START
      this.trace('PROVIDER_CALL_START', 'Wuxia processing');
      this.currentStage = 'PROVIDER_CALL_START';

      // Process with Wuxia
      const wuxiaResponse = await this.wuxiaAgent.processUserInput(
        processedText,
        this.consentState,
        tileContext
      );

      // Step 6: PROVIDER_CALL_END
      this.trace('PROVIDER_CALL_END', `Duration: ${Date.now() - startTime}ms`);
      this.currentStage = 'PROVIDER_CALL_END';

      // Step 7: OUTPUT_DELIVERED
      this.trace('OUTPUT_DELIVERED', `Response length: ${wuxiaResponse.text.length}`);
      this.currentStage = 'OUTPUT_DELIVERED';

      return {
        success: true,
        response: wuxiaResponse,
        trace: [...this.traceLog]
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.trace('ERROR', errorMessage);

      return {
        success: false,
        error: errorMessage,
        trace: [...this.traceLog]
      };

    } finally {
      this.isProcessing = false;
      this.currentStage = null;
    }
  }

  // TOTEM selection
  selectTotem(totemType: VoiceComputingConfig['totem']): void {
    this.config.totem = totemType;
    const totemConfig = TOTEM_CONFIGS[totemType];

    this.consentState = {
      ...this.consentState,
      totemSelected: true,
      totemType: totemType,
      audioRetentionAllowed: totemConfig.audio === 'optional',
      memoryApproved: false // Always starts as opt-in
    };

    this.trace('TOTEM_SELECTED', totemType);
  }

  // Handle consent commands
  private async handleConsentCommand(command: ConsentCommand): Promise<{ text: string }> {
    switch (command.type) {
      case 'memory_block':
        this.consentState.memoryApproved = false;
        return { text: this.wuxiaAgent.onMemoryBlock() };

      case 'memory_approve':
        if (TOTEM_CONFIGS[this.config.totem].memory !== 'off') {
          this.consentState.memoryApproved = true;
          return { text: this.wuxiaAgent.onMemoryApprove() };
        }
        return { text: "Memory is disabled in your current TOTEM mode." };

      case 'export_request':
        return { text: this.wuxiaAgent.onExportRequest() };

      case 'session_purge':
        await this.purgeSession();
        return { text: "Session cleared. All traces removed." };

      default:
        return { text: "Command acknowledged." };
    }
  }

  // Session management
  async startSession(): Promise<{ text: string }> {
    const greeting = await this.wuxiaAgent.startSession(this.config.totem);
    this.trace('SESSION_STARTED', this.config.totem);
    return { text: greeting.text };
  }

  async endSession(): Promise<{ text: string }> {
    const farewell = await this.wuxiaAgent.endSession();
    this.trace('SESSION_ENDED');
    return { text: farewell.text };
  }

  async purgeSession(): Promise<void> {
    this.consentState = { ...initialConsentState };
    this.traceLog = [];
    this.trace('SESSION_PURGED');
  }

  // Tile navigation
  async navigateTile(direction: 'glitch' | 'drift' | 'tune') {
    return this.wuxiaAgent.navigateTile(direction);
  }

  async narrateTile(tile: TileContext) {
    return this.wuxiaAgent.narrateTile(tile);
  }

  // Export (sanitized)
  async exportSession(): Promise<string> {
    const exportResult = await totemEnforcementPIP.process(
      { 
        action: 'sanitize_export', 
        consentState: this.consentState,
        data: { traceLog: this.traceLog, totem: this.config.totem }
      },
      this.config
    );
    this.traceLog.push(exportResult.trace);

    if (exportResult.result && 
        typeof exportResult.result === 'object' && 
        'content' in exportResult.result) {
      return exportResult.result.content;
    }
    return JSON.stringify({ error: 'Export failed' });
  }

  // Trace logging
  private trace(stage: string, details?: string): void {
    this.traceLog.push({
      stage: stage as ProcessingStage,
      timestamp: new Date(),
      details
    });
  }

  // Getters
  get state(): VoiceGatewayState {
    return {
      isProcessing: this.isProcessing,
      currentStage: this.currentStage,
      consentState: { ...this.consentState },
      sessionActive: this.wuxiaAgent.isSessionActive
    };
  }

  get traces(): TraceEntry[] {
    return [...this.traceLog];
  }
}

export const createVoiceGateway = (config: VoiceComputingConfig) => {
  return new VoiceGateway(config);
};
