import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  type CompiledPrdContent, 
  type OECDAnalysisResult,
  flattenPrdContent,
  quickMatchPrinciples
} from '@/utils/frameworkMatcher';

interface UseOECDAnalysisReturn {
  isAnalyzing: boolean;
  results: OECDAnalysisResult | null;
  error: string | null;
  analyzeWithAI: (content: CompiledPrdContent, prdTitle?: string) => Promise<void>;
  analyzeQuick: (content: CompiledPrdContent) => void;
  clearResults: () => void;
  analysisMode: 'quick' | 'ai' | null;
}

export function useOECDAnalysis(): UseOECDAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<OECDAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'quick' | 'ai' | null>(null);
  const { toast } = useToast();

  const analyzeQuick = useCallback((content: CompiledPrdContent) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisMode('quick');
    
    try {
      const quickResults = quickMatchPrinciples(content);
      setResults(quickResults);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Quick analysis failed';
      setError(message);
      toast({
        title: 'Analysis Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const analyzeWithAI = useCallback(async (content: CompiledPrdContent, prdTitle?: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisMode('ai');

    try {
      const prdContent = flattenPrdContent(content);
      
      if (!prdContent.trim()) {
        throw new Error('No PRD content to analyze. Please add content to your PRD layers.');
      }

      const { data, error: fnError } = await supabase.functions.invoke('analyze-oecd-principles', {
        body: { prdContent, prdTitle }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        // Handle specific error codes
        if (data.error.includes('Rate limit')) {
          toast({
            title: 'Rate Limited',
            description: 'Too many requests. Please wait a moment and try again.',
            variant: 'destructive'
          });
        } else if (data.error.includes('credits')) {
          toast({
            title: 'Credits Exhausted',
            description: 'Please add AI credits to your workspace to continue.',
            variant: 'destructive'
          });
        }
        throw new Error(data.error);
      }

      setResults(data as OECDAnalysisResult);
      
      toast({
        title: 'Analysis Complete',
        description: `Overall OECD alignment: ${data.overallScore}%`
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI analysis failed';
      setError(message);
      
      // Only show toast if not already shown for specific errors
      if (!message.includes('Rate limit') && !message.includes('credits')) {
        toast({
          title: 'Analysis Error',
          description: message,
          variant: 'destructive'
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setAnalysisMode(null);
  }, []);

  return {
    isAnalyzing,
    results,
    error,
    analyzeWithAI,
    analyzeQuick,
    clearResults,
    analysisMode
  };
}
