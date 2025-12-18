import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  JournalPhase, 
  CycleNumber, 
  ToleranceZone,
  PolenEntry,
  NoemEntry,
  PoemEntry
} from '@/types/journal-expansion';

interface JournalCycleData {
  id: string;
  user_id: string;
  cycle_number: number;
  board: string;
  phase: JournalPhase;
  tiles_visited: number[];
  current_tile_id: number | null;
  inner_radius: number;
  stretch_radius: number;
  current_zone: ToleranceZone;
  integrator_tiles_unlocked: number;
}

export const useExpansionJournal = (projectId?: string | null) => {
  const [currentCycle, setCurrentCycle] = useState<JournalCycleData | null>(null);
  const [polenEntries, setPolenEntries] = useState<any[]>([]);
  const [noems, setNoems] = useState<any[]>([]);
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCurrentCycle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('journal_cycles')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setCurrentCycle(data as JournalCycleData | null);
      return data;
    } catch (error) {
      console.error('Error fetching current cycle:', error);
      return null;
    }
  };

  const startNewCycle = async (board: string = 'LOVE') => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Determine cycle number
      const { count } = await supabase
        .from('journal_cycles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const cycleNumber = Math.min((count || 0) + 1, 4);

      const { data, error } = await supabase
        .from('journal_cycles')
        .insert([{
          user_id: user.id,
          cycle_number: cycleNumber,
          board: board as 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE',
          phase: 'glitch' as const,
          tiles_visited: [],
          inner_radius: cycleNumber,
          stretch_radius: cycleNumber + 1,
          current_distance: 0,
          current_zone: 'inner' as const,
          integrator_tiles_unlocked: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setCurrentCycle(data as JournalCycleData);
      toast({
        title: `Cycle ${cycleNumber} Started`,
        description: `Beginning your journey on the ${board} board.`,
      });

      return data;
    } catch (error) {
      console.error('Error starting cycle:', error);
      toast({
        title: 'Error',
        description: 'Failed to start new cycle.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const visitTile = async (tileId: number) => {
    if (!currentCycle) return;

    try {
      const updatedTiles = [...(currentCycle.tiles_visited || [])];
      if (!updatedTiles.includes(tileId)) {
        updatedTiles.push(tileId);
      }

      const { error } = await supabase
        .from('journal_cycles')
        .update({
          tiles_visited: updatedTiles,
          current_tile_id: tileId
        })
        .eq('id', currentCycle.id);

      if (error) throw error;

      setCurrentCycle(prev => prev ? {
        ...prev,
        tiles_visited: updatedTiles,
        current_tile_id: tileId
      } : null);

    } catch (error) {
      console.error('Error visiting tile:', error);
    }
  };

  const updatePhase = async (phase: JournalPhase) => {
    if (!currentCycle) return;

    try {
      const { error } = await supabase
        .from('journal_cycles')
        .update({ phase })
        .eq('id', currentCycle.id);

      if (error) throw error;

      setCurrentCycle(prev => prev ? { ...prev, phase } : null);

      toast({
        title: `Entered ${phase.toUpperCase()} Phase`,
        description: phase === 'glitch' 
          ? 'Capture anomalies and fragments.'
          : phase === 'drift'
          ? 'Let patterns emerge and connect.'
          : 'Shape narratives and commit.',
      });
    } catch (error) {
      console.error('Error updating phase:', error);
    }
  };

  const savePolenEntry = async (entry: Omit<PolenEntry, 'id' | 'user_id' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('polen_entries')
        .insert({
          user_id: user.id,
          cycle_id: currentCycle?.id,
          project_id: projectId || null,
          ...entry
        })
        .select()
        .single();

      if (error) throw error;

      setPolenEntries(prev => [data, ...prev]);
      toast({
        title: 'Polen Captured',
        description: 'Fragment saved to your constellation.',
      });

      return data;
    } catch (error) {
      console.error('Error saving polen:', error);
      toast({
        title: 'Error',
        description: 'Failed to save fragment.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNoem = async (noem: Omit<NoemEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('noems')
        .insert({
          user_id: user.id,
          cycle_id: currentCycle?.id,
          ...noem,
          topology_x: noem.topology_position?.x,
          topology_y: noem.topology_position?.y
        })
        .select()
        .single();

      if (error) throw error;

      setNoems(prev => [data, ...prev]);
      toast({
        title: 'Noem Crystallized',
        description: 'Insight added to your topology.',
      });

      return data;
    } catch (error) {
      console.error('Error saving noem:', error);
      toast({
        title: 'Error',
        description: 'Failed to save insight.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePoem = async (poem: Omit<PoemEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('poems')
        .insert({
          user_id: user.id,
          cycle_id: currentCycle?.id,
          ...poem
        })
        .select()
        .single();

      if (error) throw error;

      setPoems(prev => [data, ...prev]);
      toast({
        title: 'Poem Composed',
        description: 'Narrative artifact created.',
      });

      return data;
    } catch (error) {
      console.error('Error saving poem:', error);
      toast({
        title: 'Error',
        description: 'Failed to save narrative.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPolenEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPolenEntries(data || []);
    } catch (error) {
      console.error('Error fetching polen:', error);
    }
  };

  const fetchNoems = async () => {
    try {
      let query = supabase
        .from('noems')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Note: noems table doesn't have project_id yet, but filtering by cycle which is project-scoped
      const { data, error } = await query;

      if (error) throw error;
      setNoems(data || []);
    } catch (error) {
      console.error('Error fetching noems:', error);
    }
  };

  const fetchPoems = async () => {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPoems(data || []);
    } catch (error) {
      console.error('Error fetching poems:', error);
    }
  };

  useEffect(() => {
    fetchCurrentCycle();
    fetchPolenEntries();
    fetchNoems();
    fetchPoems();
  }, [projectId]);

  return {
    currentCycle,
    polenEntries,
    noems,
    poems,
    loading,
    startNewCycle,
    visitTile,
    updatePhase,
    savePolenEntry,
    saveNoem,
    savePoem,
    fetchCurrentCycle,
    fetchPolenEntries,
    fetchNoems,
    fetchPoems
  };
};

export default useExpansionJournal;
