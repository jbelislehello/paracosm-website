// Voice Computing Service - SOA Architecture with PIP Pattern

// Types
export type {
  VoiceComputingConfig,
  TotemType,
  LanguageMode,
  ProcessingStage,
  TotemConfig,
  ConsentState,
  TraceEntry,
  VoiceMessage,
  VoiceMessageMetadata,
  TileContext,
  PIP,
  ConsentCommand,
  ConsentDetectionResult,
  WuxiaGreeting,
  WuxiaResponse,
  WuxiaFarewell,
  VoiceProcessingResult,
  VoiceGatewayState,
  VoiceProvider,
  RedactionResult,
  SanitizedExport
} from './types';

// Constants and utilities
export {
  TOTEM_CONFIGS,
  initialConsentState,
  TotemRequiredError,
  ConsentBlockedError
} from './types';

// PIPs
export { totemEnforcementPIP, TotemEnforcementPIP } from './pips';
export { consentDetectionPIP, ConsentDetectionPIP } from './pips';

// Agents
export { WuxiaVoiceAgent, createWuxiaAgent } from './agents';

// Gateway
export { VoiceGateway, createVoiceGateway } from './VoiceGateway';
