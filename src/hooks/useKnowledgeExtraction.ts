import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  KnowledgeExtraction, 
  ProdagoKnowledgeObject,
  KnowledgeExtractionResponse 
} from '@/types/knowledge';
import { 
  mapToProdagoKnowledgeObjects, 
  generatePolenContent,
  generateTagsFromExtraction
} from '@/utils/prodagoOntologyMapper';

interface UseKnowledgeExtractionReturn {
  extracting: boolean;
  extraction: KnowledgeExtraction | null;
  knowledgeObjects: ProdagoKnowledgeObject[] | null;
  error: string | null;
  extractFromImage: (imageFile: File, context?: string) => Promise<KnowledgeExtractionResponse | null>;
  getPolenContent: () => string | null;
  getTags: () => string[];
  reset: () => void;
}

export function useKnowledgeExtraction(): UseKnowledgeExtractionReturn {
  const [extracting, setExtracting] = useState(false);
  const [extraction, setExtraction] = useState<KnowledgeExtraction | null>(null);
  const [knowledgeObjects, setKnowledgeObjects] = useState<ProdagoKnowledgeObject[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const extractFromImage = useCallback(async (
    imageFile: File,
    context?: string
  ): Promise<KnowledgeExtractionResponse | null> => {
    setExtracting(true);
    setError(null);
    
    try {
      // Convert image to base64
      const base64 = await fileToBase64(imageFile);
      
      // Call edge function
      const { data, error: fnError } = await supabase.functions.invoke('extract-knowledge-from-image', {
        body: {
          imageBase64: base64,
          context: context || 'Prodago ontological framework for AI governance'
        }
      });
      
      if (fnError) {
        throw new Error(fnError.message);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Extraction failed');
      }
      
      const extractionResult = data.extraction as KnowledgeExtraction;
      setExtraction(extractionResult);
      
      // Map to Prodago knowledge objects
      const objects = mapToProdagoKnowledgeObjects(extractionResult);
      setKnowledgeObjects(objects);
      
      toast({
        title: "Knowledge Extracted",
        description: `Found ${extractionResult.entities.length} entities and ${extractionResult.playbookSeeds.length} playbook seeds`
      });
      
      return {
        success: true,
        extraction: extractionResult,
        knowledgeObjects: objects
      };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to extract knowledge';
      setError(message);
      toast({
        title: "Extraction Failed",
        description: message,
        variant: "destructive"
      });
      return null;
    } finally {
      setExtracting(false);
    }
  }, [toast]);

  const getPolenContent = useCallback((): string | null => {
    if (!extraction) return null;
    return generatePolenContent(extraction);
  }, [extraction]);

  const getTags = useCallback((): string[] => {
    if (!extraction) return [];
    return generateTagsFromExtraction(extraction);
  }, [extraction]);

  const reset = useCallback(() => {
    setExtraction(null);
    setKnowledgeObjects(null);
    setError(null);
  }, []);

  return {
    extracting,
    extraction,
    knowledgeObjects,
    error,
    extractFromImage,
    getPolenContent,
    getTags,
    reset
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
