import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompassType, JourneyMode } from '@/types/journal-expansion';
import { TileContent } from '@/data/tileContents';
import { useToast } from '@/hooks/use-toast';

interface UseCompassPromptOptions {
  compass: CompassType;
  journeyMode: JourneyMode;
  tile: TileContent;
}

interface CompassPromptResult {
  prompt: string | null;
  isLoading: boolean;
  error: string | null;
  generatePrompt: (step: 'glitch' | 'drift' | 'tune', currentGlitchResponse?: string) => Promise<void>;
}

export function useCompassPrompt({ compass, journeyMode, tile }: UseCompassPromptOptions): CompassPromptResult {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePrompt = useCallback(async (step: 'glitch' | 'drift' | 'tune', currentGlitchResponse?: string) => {
    setIsLoading(true);
    setError(null);
    setPrompt(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('compass-prompt', {
        body: {
          compass,
          journeyMode,
          tileName: tile.name,
          tileRow: tile.rowKey,
          tileColumn: tile.colKey,
          phase: tile.phase,
          glitchQuestion: tile.glitchQuestion,
          tuneQuestion: tile.tuneQuestion,
          deliverable: tile.deliverable,
          currentGlitchResponse,
          step,
        },
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setPrompt(data.prompt);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate AI prompt';
      setError(message);
      toast({
        title: "AI Prompt Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [compass, journeyMode, tile, toast]);

  return { prompt, isLoading, error, generatePrompt };
}
