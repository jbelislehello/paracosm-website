import { useState, useEffect, useCallback } from 'react';
import { GardenType } from '@/types/journal';
import { ModeType } from '@/data/modeAwareContent';

export interface ProjectContext {
  projectName: string;
  garden: GardenType;
  mode: ModeType;
  createdAt: string;
}

const STORAGE_KEY = 'calm-magic-project-context';

export function useProjectContext() {
  const [projectContext, setProjectContextState] = useState<ProjectContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ProjectContext;
        setProjectContextState(parsed);
      }
    } catch (error) {
      console.error('Error loading project context:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever context changes
  const setProjectContext = useCallback((context: ProjectContext | null) => {
    setProjectContextState(context);
    if (context) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateProjectContext = useCallback((updates: Partial<ProjectContext>) => {
    setProjectContextState((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearProjectContext = useCallback(() => {
    setProjectContextState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    projectContext,
    setProjectContext,
    updateProjectContext,
    clearProjectContext,
    isLoading,
  };
}
