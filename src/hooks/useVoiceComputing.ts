// useVoiceComputing - React hook for Voice Computing SOA integration

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  VoiceGateway, 
  createVoiceGateway,
  TotemType,
  LanguageMode,
  ConsentState,
  TraceEntry,
  TileContext,
  WuxiaResponse,
  initialConsentState
} from '@/services/voice-computing';

interface UseVoiceComputingOptions {
  projectId: string;
  foundationalPrompt?: string;
  language?: LanguageMode;
  onWuxiaResponse?: (response: WuxiaResponse) => void;
  onTraceUpdate?: (traces: TraceEntry[]) => void;
}

interface UseVoiceComputingReturn {
  // TOTEM selection
  selectTotem: (type: TotemType) => void;
  totemSelected: boolean;
  currentTotem: TotemType | null;
  
  // Voice interaction
  processInput: (text: string, tileContext?: TileContext) => Promise<WuxiaResponse | null>;
  isProcessing: boolean;
  
  // Session management
  startSession: () => Promise<string>;
  endSession: () => Promise<string>;
  purgeSession: () => Promise<void>;
  sessionActive: boolean;
  
  // Wuxia responses
  lastResponse: WuxiaResponse | null;
  
  // Consent controls
  consentState: ConsentState;
  
  // Navigation
  navigateTile: (direction: 'glitch' | 'drift' | 'tune') => Promise<WuxiaResponse | null>;
  narrateTile: (tile: TileContext) => Promise<WuxiaResponse | null>;
  
  // Export
  exportSession: () => Promise<string>;
  
  // Trace log for governance
  traceLog: TraceEntry[];
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useVoiceComputing = (options: UseVoiceComputingOptions): UseVoiceComputingReturn => {
  const { 
    projectId, 
    foundationalPrompt = '', 
    language = 'bilingual',
    onWuxiaResponse,
    onTraceUpdate
  } = options;

  // Gateway instance
  const gatewayRef = useRef<VoiceGateway | null>(null);

  // State
  const [totemSelected, setTotemSelected] = useState(false);
  const [currentTotem, setCurrentTotem] = useState<TotemType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [lastResponse, setLastResponse] = useState<WuxiaResponse | null>(null);
  const [consentState, setConsentState] = useState<ConsentState>(initialConsentState);
  const [traceLog, setTraceLog] = useState<TraceEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize gateway when foundationalPrompt changes
  useEffect(() => {
    if (currentTotem && foundationalPrompt) {
      gatewayRef.current = createVoiceGateway({
        totem: currentTotem,
        language,
        projectId,
        foundationalPrompt
      });
    }
  }, [currentTotem, foundationalPrompt, language, projectId]);

  // TOTEM selection
  const selectTotem = useCallback((type: TotemType) => {
    // Create gateway with selected TOTEM
    gatewayRef.current = createVoiceGateway({
      totem: type,
      language,
      projectId,
      foundationalPrompt
    });
    
    gatewayRef.current.selectTotem(type);
    setCurrentTotem(type);
    setTotemSelected(true);
    setConsentState(gatewayRef.current.state.consentState);
    setTraceLog(gatewayRef.current.traces);
    
    onTraceUpdate?.(gatewayRef.current.traces);
  }, [language, projectId, foundationalPrompt, onTraceUpdate]);

  // Process voice/text input
  const processInput = useCallback(async (
    text: string, 
    tileContext?: TileContext
  ): Promise<WuxiaResponse | null> => {
    if (!gatewayRef.current) {
      setError('TOTEM not selected. Please select a TOTEM first.');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await gatewayRef.current.processVoiceInput(text, tileContext);
      
      setTraceLog(result.trace);
      setConsentState(gatewayRef.current.state.consentState);
      onTraceUpdate?.(result.trace);

      if (result.success && result.response) {
        setLastResponse(result.response);
        onWuxiaResponse?.(result.response);
        return result.response;
      } else {
        setError(result.error || 'Processing failed');
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [onWuxiaResponse, onTraceUpdate]);

  // Session management
  const startSession = useCallback(async (): Promise<string> => {
    if (!gatewayRef.current) {
      setError('TOTEM not selected');
      return '';
    }

    try {
      const result = await gatewayRef.current.startSession();
      setSessionActive(true);
      setTraceLog(gatewayRef.current.traces);
      return result.text;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      return '';
    }
  }, []);

  const endSession = useCallback(async (): Promise<string> => {
    if (!gatewayRef.current) return '';

    try {
      const result = await gatewayRef.current.endSession();
      setSessionActive(false);
      setTraceLog(gatewayRef.current.traces);
      return result.text;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
      return '';
    }
  }, []);

  const purgeSession = useCallback(async (): Promise<void> => {
    if (!gatewayRef.current) return;

    await gatewayRef.current.purgeSession();
    setConsentState(initialConsentState);
    setTraceLog([]);
    setLastResponse(null);
    setSessionActive(false);
  }, []);

  // Navigation
  const navigateTile = useCallback(async (
    direction: 'glitch' | 'drift' | 'tune'
  ): Promise<WuxiaResponse | null> => {
    if (!gatewayRef.current) return null;

    try {
      const response = await gatewayRef.current.navigateTile(direction);
      setLastResponse(response);
      onWuxiaResponse?.(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Navigation failed');
      return null;
    }
  }, [onWuxiaResponse]);

  const narrateTile = useCallback(async (tile: TileContext): Promise<WuxiaResponse | null> => {
    if (!gatewayRef.current) return null;

    try {
      const response = await gatewayRef.current.narrateTile(tile);
      setLastResponse(response);
      onWuxiaResponse?.(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Narration failed');
      return null;
    }
  }, [onWuxiaResponse]);

  // Export
  const exportSession = useCallback(async (): Promise<string> => {
    if (!gatewayRef.current) return '';

    try {
      return await gatewayRef.current.exportSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
      return '';
    }
  }, []);

  // Error handling
  const clearError = useCallback(() => setError(null), []);

  return {
    // TOTEM
    selectTotem,
    totemSelected,
    currentTotem,
    
    // Processing
    processInput,
    isProcessing,
    
    // Session
    startSession,
    endSession,
    purgeSession,
    sessionActive,
    
    // Response
    lastResponse,
    
    // Consent
    consentState,
    
    // Navigation
    navigateTile,
    narrateTile,
    
    // Export
    exportSession,
    
    // Traces
    traceLog,
    
    // Error
    error,
    clearError
  };
};
