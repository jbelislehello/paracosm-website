import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Season, Tier } from '@/utils/serviceBlueprintMapping';

export interface BlueprintTask {
  id: string;
  title: string;
  status: string;
  priority: string | null;
  category: string;
  notes: string | null;
  goal: string | null;
  due_date: string | null;
  created_at: string;
}

export function useBlueprintTasks(projectId: string | null | undefined) {
  const [tasks, setTasks] = useState<BlueprintTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, status, priority, category, notes, goal, due_date, created_at')
      .eq('user_id', user.user.id)
      .like('category', '%-magic')
      .or('category.like.%-calm,category.like.%-free,category.like.%-magic')
      .order('created_at', { ascending: false });

    // Filter to only blueprint-generated tasks (category pattern: season-tier)
    const blueprintTasks = (data || []).filter(t => 
      /^(pollens|noems|poems|totems|anthems)-(magic|calm|free)$/.test(t.category)
    );

    setTasks(blueprintTasks as BlueprintTask[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, projectId]);

  const saveTask = useCallback(async (task: {
    title: string;
    category: string;
    priority: string;
    notes?: string;
    goal?: string;
  }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      toast.error('You must be logged in to save tasks');
      return null;
    }

    // Check if task with same title+category already exists
    const existing = tasks.find(t => t.title === task.title && t.category === task.category);
    if (existing) {
      return existing;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.user.id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        notes: task.notes || null,
        goal: task.goal || null,
        status: 'todo',
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to save task');
      return null;
    }

    toast.success('Task saved');
    await fetchTasks();
    return data;
  }, [tasks, fetchTasks]);

  const saveBulkTasks = useCallback(async (taskItems: {
    title: string;
    category: string;
    priority: string;
    notes?: string;
    goal?: string;
  }[]) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      toast.error('You must be logged in to save tasks');
      return;
    }

    // Filter out tasks that already exist
    const existingTitles = new Set(tasks.map(t => `${t.title}|${t.category}`));
    const newTasks = taskItems.filter(t => !existingTitles.has(`${t.title}|${t.category}`));

    if (newTasks.length === 0) {
      toast.info('All tasks already exist');
      return;
    }

    const rows = newTasks.map(t => ({
      user_id: user.user.id,
      title: t.title,
      category: t.category,
      priority: t.priority,
      notes: t.notes || null,
      goal: t.goal || null,
      status: 'todo',
    }));

    const { error } = await supabase.from('tasks').insert(rows);

    if (error) {
      toast.error('Failed to save tasks');
      return;
    }

    toast.success(`${newTasks.length} task${newTasks.length > 1 ? 's' : ''} saved`);
    await fetchTasks();
  }, [tasks, fetchTasks]);

  const updateTaskStatus = useCallback(async (taskId: string, status: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) {
      toast.error('Failed to update task');
      return;
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  }, []);

  const getTasksForCell = useCallback((season: Season, tier: Tier): BlueprintTask[] => {
    const category = `${season.toLowerCase()}-${tier}`;
    return tasks.filter(t => t.category === category);
  }, [tasks]);

  return {
    tasks,
    isLoading,
    saveTask,
    saveBulkTasks,
    updateTaskStatus,
    getTasksForCell,
    refetch: fetchTasks,
  };
}
