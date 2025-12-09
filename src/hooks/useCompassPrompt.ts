import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompassType, JourneyMode } from '@/types/journal-expansion';
import { TileContent } from '@/data/tileContents';
import { useToast } from '@/hooks/use-toast';

interface UseCompassPromptOptions {
  compass: CompassType;
  journeyMode: JourneyMode;
  tile: TileContent;
  cycleId?: string;
  onSaveSuccess?: () => void;
}

interface CompassPromptResult {
  prompt: string | null;
  currentStep: 'glitch' | 'drift' | 'tune' | null;
  isLoading: boolean;
  isSaving: boolean;
  isSaved: boolean;
  error: string | null;
  generatePrompt: (step: 'glitch' | 'drift' | 'tune', currentGlitchResponse?: string) => Promise<void>;
  savePromptAsPolen: () => Promise<void>;
}

export function useCompassPrompt({ compass, journeyMode, tile, cycleId, onSaveSuccess }: UseCompassPromptOptions): CompassPromptResult {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'glitch' | 'drift' | 'tune' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePrompt = useCallback(async (step: 'glitch' | 'drift' | 'tune', currentGlitchResponse?: string) => {
    setIsLoading(true);
    setError(null);
    setPrompt(null);
    setIsSaved(false);
    setCurrentStep(step);

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

  const savePromptAsPolen = useCallback(async () => {
    if (!prompt || !currentStep) return;

    setIsSaving(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const stepLabels = {
        glitch: 'GL!TCH',
        drift: 'DRIFT', 
        tune: 'TUNE'
      };

      const content = `[AI ${compass.toUpperCase()} Compass - ${stepLabels[currentStep]} Phase]\n\nTile: ${tile.name} (${tile.id})\nJourney: ${journeyMode === 'relational' ? 'Relational Design' : 'Product Design'}\n\n---\n\n${prompt}`;

      const { error: insertError } = await supabase
        .from('polen_entries')
        .insert({
          user_id: userData.user.id,
          cycle_id: cycleId || null,
          tile_id: tile.id,
          content,
          fragment_type: 'text',
          tags: ['ai-prompt', compass, currentStep, journeyMode],
          source_reference: `AI Compass Prompt - ${compass}`,
        });

      if (insertError) {
        throw insertError;
      }

      setIsSaved(true);
      toast({
        title: "Polen Saved",
        description: `AI prompt saved for pattern recognition.`,
      });

      onSaveSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save Polen entry';
      toast({
        title: "Save Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [prompt, currentStep, compass, journeyMode, tile, cycleId, toast, onSaveSuccess]);

  return { 
    prompt, 
    currentStep,
    isLoading, 
    isSaving,
    isSaved,
    error, 
    generatePrompt,
    savePromptAsPolen
  };
}
