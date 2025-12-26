import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Playbook, PLAYBOOK_TEMPLATES } from '@/types/playbook';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

export interface PlaybookProgressRecord {
  id: string;
  user_id: string;
  project_id: string | null;
  playbook_id: string;
  garden: string;
  mode: string;
  started_at: string;
  completed_at: string | null;
  current_step_index: number;
  completed_steps: string[];
  step_outputs: Record<string, string>;
  tile_sequence: number[];
  tiles_visited: number[];
  created_at: string;
  updated_at: string;
}

interface UsePlaybookProgressProps {
  projectId?: string | null;
}

export function usePlaybookProgress({ projectId }: UsePlaybookProgressProps = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [activeProgress, setActiveProgress] = useState<PlaybookProgressRecord | null>(null);
  const [allProgress, setAllProgress] = useState<PlaybookProgressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all progress records for the user
  const fetchProgress = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('playbook_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Type assertion since we know the structure
      const typedData = (data || []) as unknown as PlaybookProgressRecord[];
      setAllProgress(typedData);
      
      // Find active (incomplete) progress
      const active = typedData.find(p => !p.completed_at);
      setActiveProgress(active || null);
    } catch (error) {
      console.error('Error fetching playbook progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, projectId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Start a new playbook
  const startPlaybook = useCallback(async (playbook: Playbook): Promise<PlaybookProgressRecord | null> => {
    if (!user) {
      toast.error('Please sign in to track playbook progress');
      return null;
    }

    setIsSaving(true);
    try {
      const newProgress = {
        user_id: user.id,
        project_id: projectId || null,
        playbook_id: playbook.id,
        garden: playbook.garden,
        mode: playbook.mode,
        current_step_index: 0,
        completed_steps: [],
        step_outputs: {},
        tile_sequence: playbook.tileSequence,
        tiles_visited: []
      };

      const { data, error } = await supabase
        .from('playbook_progress')
        .insert(newProgress)
        .select()
        .single();

      if (error) throw error;

      const typedData = data as unknown as PlaybookProgressRecord;
      setActiveProgress(typedData);
      setAllProgress(prev => [typedData, ...prev]);
      toast.success(`Started: ${playbook.name}`);
      return typedData;
    } catch (error) {
      console.error('Error starting playbook:', error);
      toast.error('Failed to start playbook');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user, projectId]);

  // Update progress (complete step, update output, visit tile)
  const updateProgress = useCallback(async (
    progressId: string,
    updates: Partial<Pick<PlaybookProgressRecord, 
      'current_step_index' | 'completed_steps' | 'step_outputs' | 'tiles_visited' | 'completed_at'
    >>
  ): Promise<boolean> => {
    if (!user) return false;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('playbook_progress')
        .update(updates)
        .eq('id', progressId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setActiveProgress(prev => prev?.id === progressId ? { ...prev, ...updates } : prev);
      setAllProgress(prev => prev.map(p => p.id === progressId ? { ...p, ...updates } : p));
      
      return true;
    } catch (error) {
      console.error('Error updating playbook progress:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  // Complete a step
  const completeStep = useCallback(async (
    progressId: string,
    actionId: string,
    output?: string
  ): Promise<boolean> => {
    const progress = allProgress.find(p => p.id === progressId);
    if (!progress) return false;

    const playbook = PLAYBOOK_TEMPLATES.find(p => p.id === progress.playbook_id);
    if (!playbook) return false;

    const newCompletedSteps = [...new Set([...progress.completed_steps, actionId])];
    const action = playbook.actions.find(a => a.id === actionId);
    const newTilesVisited = action?.tileId 
      ? [...new Set([...progress.tiles_visited, action.tileId])]
      : progress.tiles_visited;

    const newStepOutputs = output 
      ? { ...progress.step_outputs, [actionId]: output }
      : progress.step_outputs;

    // Check if playbook is complete
    const isComplete = newCompletedSteps.length >= playbook.actions.length;

    return updateProgress(progressId, {
      completed_steps: newCompletedSteps,
      step_outputs: newStepOutputs,
      tiles_visited: newTilesVisited,
      ...(isComplete ? { completed_at: new Date().toISOString() } : {})
    });
  }, [allProgress, updateProgress]);

  // Navigate to next step
  const goToStep = useCallback(async (
    progressId: string,
    stepIndex: number
  ): Promise<boolean> => {
    return updateProgress(progressId, { current_step_index: stepIndex });
  }, [updateProgress]);

  // Resume an existing playbook
  const resumePlaybook = useCallback((progressId: string) => {
    const progress = allProgress.find(p => p.id === progressId);
    if (progress) {
      setActiveProgress(progress);
    }
  }, [allProgress]);

  // Abandon/delete a playbook progress
  const abandonPlaybook = useCallback(async (progressId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('playbook_progress')
        .delete()
        .eq('id', progressId)
        .eq('user_id', user.id);

      if (error) throw error;

      setAllProgress(prev => prev.filter(p => p.id !== progressId));
      if (activeProgress?.id === progressId) {
        setActiveProgress(null);
      }
      toast.success('Playbook progress removed');
      return true;
    } catch (error) {
      console.error('Error abandoning playbook:', error);
      toast.error('Failed to remove playbook');
      return false;
    }
  }, [user, activeProgress]);

  // Get completed journeys count
  const completedCount = allProgress.filter(p => p.completed_at).length;
  const inProgressCount = allProgress.filter(p => !p.completed_at).length;

  return {
    activeProgress,
    allProgress,
    completedCount,
    inProgressCount,
    isLoading,
    isSaving,
    startPlaybook,
    completeStep,
    goToStep,
    resumePlaybook,
    abandonPlaybook,
    refetch: fetchProgress
  };
}
