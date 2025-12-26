import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type EdgeType = 'resonance' | 'causality' | 'echo';

export interface ManifoldEdge {
  id: string;
  fromEntryId: string;
  toEntryId: string;
  edgeType: EdgeType;
  weight: number;
  createdAt: string;
}

interface UseManifoldEdgesReturn {
  edges: ManifoldEdge[];
  isLoading: boolean;
  isCreating: boolean;
  createEdge: (fromId: string, toId: string, edgeType: EdgeType, weight?: number) => Promise<boolean>;
  deleteEdge: (edgeId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useManifoldEdges(projectId?: string | null): UseManifoldEdgesReturn {
  const [edges, setEdges] = useState<ManifoldEdge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchEdges = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('manifold_edges')
        .select('*')
        .eq('user_id', userData.user.id);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching manifold edges:', error);
        return;
      }

      const transformedEdges: ManifoldEdge[] = (data || []).map(edge => ({
        id: edge.id,
        fromEntryId: edge.from_entry_id,
        toEntryId: edge.to_entry_id,
        edgeType: edge.edge_type as EdgeType,
        weight: typeof edge.weight === 'string' ? parseFloat(edge.weight) : (edge.weight || 0.5),
        createdAt: edge.created_at
      }));

      setEdges(transformedEdges);
    } catch (err) {
      console.error('Error in useManifoldEdges:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const createEdge = useCallback(async (
    fromId: string, 
    toId: string, 
    edgeType: EdgeType, 
    weight: number = 0.5
  ): Promise<boolean> => {
    setIsCreating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        toast.error('You must be logged in to create connections');
        return false;
      }

      // Check if edge already exists
      const { data: existing } = await supabase
        .from('manifold_edges')
        .select('id')
        .eq('user_id', userData.user.id)
        .or(`and(from_entry_id.eq.${fromId},to_entry_id.eq.${toId}),and(from_entry_id.eq.${toId},to_entry_id.eq.${fromId})`)
        .maybeSingle();

      if (existing) {
        toast.error('A connection already exists between these entries');
        return false;
      }

      const { data, error } = await supabase
        .from('manifold_edges')
        .insert({
          from_entry_id: fromId,
          to_entry_id: toId,
          edge_type: edgeType,
          weight,
          user_id: userData.user.id,
          project_id: projectId || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating edge:', error);
        toast.error('Failed to create connection');
        return false;
      }

      // Add to local state
      setEdges(prev => [{
        id: data.id,
        fromEntryId: data.from_entry_id,
        toEntryId: data.to_entry_id,
        edgeType: data.edge_type as EdgeType,
        weight: typeof data.weight === 'string' ? parseFloat(data.weight) : (data.weight || 0.5),
        createdAt: data.created_at
      }, ...prev]);

      const edgeLabels: Record<EdgeType, string> = {
        resonance: 'Resonance',
        causality: 'Causality', 
        echo: 'Echo'
      };
      
      toast.success(`${edgeLabels[edgeType]} connection created`);
      return true;
    } catch (err) {
      console.error('Error creating edge:', err);
      toast.error('Failed to create connection');
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [projectId]);

  const deleteEdge = useCallback(async (edgeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('manifold_edges')
        .delete()
        .eq('id', edgeId);

      if (error) {
        console.error('Error deleting edge:', error);
        toast.error('Failed to delete connection');
        return false;
      }

      setEdges(prev => prev.filter(e => e.id !== edgeId));
      toast.success('Connection deleted');
      return true;
    } catch (err) {
      console.error('Error deleting edge:', err);
      toast.error('Failed to delete connection');
      return false;
    }
  }, []);

  return {
    edges,
    isLoading,
    isCreating,
    createEdge,
    deleteEdge,
    refetch: fetchEdges
  };
}
