import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClusterSuggestion {
  id: string;
  theme: string;
  insight: string;
  confidence: number;
  fragmentIds: string[];
  keywords: string[];
}

export interface Fragment {
  id: string;
  content: string;
  tags: string[] | null;
  season_context: string | null;
  created_at: string;
}

interface UseSemanticClusteringResult {
  clusters: ClusterSuggestion[];
  fragments: Fragment[];
  isAnalyzing: boolean;
  error: string | null;
  analyzeClusters: () => Promise<void>;
  crystallizeNoem: (cluster: ClusterSuggestion) => Promise<boolean>;
  crystallizedIds: Set<string>;
}

export function useSemanticClustering(userId: string | null): UseSemanticClusteringResult {
  const [clusters, setClusters] = useState<ClusterSuggestion[]>([]);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crystallizedIds, setCrystallizedIds] = useState<Set<string>>(new Set());

  const analyzeClusters = useCallback(async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Fetch user's POLEN entries
      const { data: polenData, error: fetchError } = await supabase
        .from('polen_entries')
        .select('id, content, tags, season_context, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      if (!polenData || polenData.length < 3) {
        setError('Need at least 3 fragments for clustering analysis');
        setIsAnalyzing(false);
        return;
      }

      setFragments(polenData);

      // Call edge function for AI analysis
      const { data, error: fnError } = await supabase.functions.invoke('analyze-clusters', {
        body: { fragments: polenData }
      });

      if (fnError) throw fnError;

      if (data.error) {
        throw new Error(data.error);
      }

      setClusters(data.clusters || []);
      
      if (data.clusters?.length === 0) {
        toast.info('No distinct clusters found. Try adding more fragments.');
      } else {
        toast.success(`Found ${data.clusters.length} semantic clusters`);
      }
    } catch (err) {
      console.error('Clustering analysis error:', err);
      const message = err instanceof Error ? err.message : 'Failed to analyze clusters';
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId]);

  const crystallizeNoem = useCallback(async (cluster: ClusterSuggestion): Promise<boolean> => {
    if (!userId) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      // Create NOEM in database
      const { data: noem, error: insertError } = await supabase
        .from('noems')
        .insert({
          user_id: userId,
          title: cluster.theme,
          insight: cluster.insight,
          connected_polen_ids: cluster.fragmentIds,
          maturity: 'seed'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Mark cluster as crystallized
      setCrystallizedIds(prev => new Set([...prev, cluster.id]));
      
      toast.success(`Crystallized "${cluster.theme}" as NOEM ✨`);
      return true;
    } catch (err) {
      console.error('Crystallization error:', err);
      const message = err instanceof Error ? err.message : 'Failed to crystallize NOEM';
      toast.error(message);
      return false;
    }
  }, [userId]);

  return {
    clusters,
    fragments,
    isAnalyzing,
    error,
    analyzeClusters,
    crystallizeNoem,
    crystallizedIds
  };
}
