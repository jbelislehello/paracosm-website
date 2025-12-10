import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GlitchItem {
  id: string;
  title: string;
  description: string;
  emotions: string[];
}

export interface GlitchCluster {
  id: string;
  label: string;
  pattern_sentence: string;
  glitch_ids: string[];
}

export interface GlitchOutput {
  mode: 'glitch';
  pollen: {
    glitches: GlitchItem[];
    clusters: GlitchCluster[];
    anchor_glitches: string[];
    constraints: string[];
    stakes: string;
  };
  notes_for_next_drift_session?: string;
}

export interface FutureVignette {
  id: string;
  title: string;
  persona: string;
  scenario: {
    before: string;
    during: string;
    after: string;
  };
  emotions: {
    before: string[];
    during: string[];
    after: string[];
  };
}

export interface DriftOutput {
  mode: 'drift';
  poem: {
    futures: FutureVignette[];
    primary_narrative: {
      id: string;
      summary: string;
      why_it_matters: string;
    };
  };
  totem: {
    key_journeys: Array<{
      id: string;
      related_future_id: string;
      steps: Array<{
        name: string;
        description: string;
        user_state: string;
        opportunity: string;
      }>;
      high_leverage_moments: Array<{
        step_name: string;
        reason: string;
      }>;
    }>;
    candidate_forms: string[];
  };
  anthem: {
    early_alignment_notes: string[];
  };
  execution_layer: {
    candidate_slices: string[];
    open_questions: string[];
  };
}

export type AssistantOutput = GlitchOutput | DriftOutput;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parsedOutput?: AssistantOutput;
  timestamp: Date;
}

export type AssistantMode = 'glitch' | 'drift' | 'idle';

interface UseAssistantChatOptions {
  currentSeason?: string;
  selectedTile?: { row: number; col: number } | null;
  onSaveAsPolen?: (content: string) => void;
}

export function useAssistantChat(options: UseAssistantChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<AssistantMode>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentGlitchData, setCurrentGlitchData] = useState<GlitchOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const parseAssistantOutput = (content: string): AssistantOutput | null => {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.mode === 'glitch' || parsed.mode === 'drift') {
          return parsed as AssistantOutput;
        }
      }
    } catch (e) {
      console.log('Could not parse assistant output as JSON:', e);
    }
    return null;
  };

  const sendMessage = useCallback(async (content: string, explicitMode?: 'glitch' | 'drift') => {
    if (!content.trim()) return;

    setError(null);
    setIsProcessing(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Determine mode from content if not explicit
    const inferredMode = explicitMode || 
      (content.toLowerCase().includes('what if') || 
       content.toLowerCase().includes('imagine') || 
       content.toLowerCase().includes('could be')
        ? 'drift' 
        : 'glitch');

    setMode(inferredMode);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calm-magic-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...chatHistory, { role: 'user', content }],
            mode: explicitMode || 'auto',
            previousGlitchData: currentGlitchData,
            currentSeason: options.currentSeason,
            selectedTile: options.selectedTile,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';
      const assistantId = `assistant-${Date.now()}`;

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        // Process line by line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => prev.map(m => 
                m.id === assistantId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch {
            // Partial JSON, wait for more
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Parse the final output
      const parsedOutput = parseAssistantOutput(assistantContent);
      
      if (parsedOutput) {
        setMessages(prev => prev.map(m => 
          m.id === assistantId 
            ? { ...m, parsedOutput }
            : m
        ));

        // Store glitch data for drift sessions
        if (parsedOutput.mode === 'glitch') {
          setCurrentGlitchData(parsedOutput);
        }
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      
      console.error('Assistant chat error:', err);
      setError(err.message || 'Failed to get response');
      
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(m => m.role === 'user' || m.content));
    } finally {
      setIsProcessing(false);
    }
  }, [messages, currentGlitchData, options.currentSeason, options.selectedTile]);

  const switchMode = useCallback((newMode: AssistantMode) => {
    setMode(newMode);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setMode('idle');
    setCurrentGlitchData(null);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
    }
  }, []);

  const saveGlitchAsPolen = useCallback((glitch: GlitchItem) => {
    if (options.onSaveAsPolen) {
      const content = `**${glitch.title}**\n\n${glitch.description}\n\nEmotions: ${glitch.emotions.join(', ')}`;
      options.onSaveAsPolen(content);
    }
  }, [options.onSaveAsPolen]);

  const saveFutureAsPolen = useCallback((future: FutureVignette) => {
    if (options.onSaveAsPolen) {
      const content = `**${future.title}** (${future.persona})\n\n**Before:** ${future.scenario.before}\n**During:** ${future.scenario.during}\n**After:** ${future.scenario.after}`;
      options.onSaveAsPolen(content);
    }
  }, [options.onSaveAsPolen]);

  return {
    messages,
    mode,
    isProcessing,
    currentGlitchData,
    error,
    sendMessage,
    switchMode,
    clearChat,
    cancelRequest,
    saveGlitchAsPolen,
    saveFutureAsPolen,
  };
}
