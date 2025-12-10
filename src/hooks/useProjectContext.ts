import { useState, useEffect, useCallback } from 'react';
import { GardenType } from '@/types/journal';
import { ModeType } from '@/data/modeAwareContent';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  projectName: string;
  garden: GardenType;
  mode: ModeType;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsState {
  projects: Project[];
  activeProjectId: string | null;
}

const STORAGE_KEY = 'calm-magic-projects';
const LEGACY_KEY = 'calm-magic-project-context';

// Generate a simple UUID
const generateId = (): string => {
  return crypto.randomUUID?.() || 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Convert DB row to Project
const dbToProject = (row: any): Project => ({
  id: row.id,
  projectName: row.project_name,
  garden: row.garden as GardenType,
  mode: row.mode as ModeType,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Convert Project to DB row
const projectToDb = (project: Project, userId: string) => ({
  id: project.id,
  user_id: userId,
  project_name: project.projectName,
  garden: project.garden,
  mode: project.mode,
  created_at: project.createdAt,
  updated_at: project.updatedAt,
});

export function useProjectContext(userId?: string | null) {
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    activeProjectId: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  // Load from Supabase when logged in, localStorage when not
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      
      if (userId) {
        // Logged in - fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

          if (error) throw error;

          if (data && data.length > 0) {
            // User has Supabase projects
            const projects = data.map(dbToProject);
            const activeId = localStorage.getItem(`${STORAGE_KEY}-active-${userId}`) || projects[0]?.id || null;
            setState({ projects, activeProjectId: activeId });
            setIsSynced(true);
          } else {
            // Check for localStorage projects to migrate
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
              const parsed = JSON.parse(stored) as ProjectsState;
              if (parsed.projects.length > 0) {
                // Migrate localStorage projects to Supabase
                await migrateLocalToSupabase(parsed.projects, userId);
                setState(parsed);
                setIsSynced(true);
              } else {
                setState({ projects: [], activeProjectId: null });
              }
            } else {
              setState({ projects: [], activeProjectId: null });
            }
          }
        } catch (error) {
          console.error('Error loading projects from Supabase:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        }
      } else {
        // Not logged in - use localStorage
        loadFromLocalStorage();
      }
      
      setIsLoading(false);
    };

    const loadFromLocalStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (stored) {
          const parsed = JSON.parse(stored) as ProjectsState;
          setState(parsed);
        } else {
          // Check for legacy single-project format and migrate
          const legacy = localStorage.getItem(LEGACY_KEY);
          if (legacy) {
            const legacyProject = JSON.parse(legacy);
            const migratedProject: Project = {
              id: generateId(),
              projectName: legacyProject.projectName,
              garden: legacyProject.garden,
              mode: legacyProject.mode,
              createdAt: legacyProject.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            const newState: ProjectsState = {
              projects: [migratedProject],
              activeProjectId: migratedProject.id,
            };
            setState(newState);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            localStorage.removeItem(LEGACY_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
      }
    };

    const migrateLocalToSupabase = async (projects: Project[], uid: string) => {
      try {
        const rows = projects.map(p => projectToDb(p, uid));
        const { error } = await supabase.from('projects').insert(rows);
        if (error) throw error;
        // Clear localStorage after successful migration
        localStorage.removeItem(STORAGE_KEY);
        console.log('Migrated localStorage projects to Supabase');
      } catch (error) {
        console.error('Error migrating projects to Supabase:', error);
      }
    };

    loadProjects();
  }, [userId]);

  // Set up real-time subscription when logged in
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          // Refetch projects on any change
          const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });
          
          if (data) {
            const projects = data.map(dbToProject);
            setState(prev => ({
              ...prev,
              projects,
              activeProjectId: prev.activeProjectId && projects.some(p => p.id === prev.activeProjectId)
                ? prev.activeProjectId
                : projects[0]?.id || null,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Save to localStorage (for offline/guest mode)
  const saveLocalState = useCallback((newState: ProjectsState) => {
    setState(newState);
    if (!userId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
  }, [userId]);

  // Create a new project
  const createProject = useCallback(async (
    projectName: string,
    garden: GardenType,
    mode: ModeType
  ): Promise<Project> => {
    const now = new Date().toISOString();
    const newProject: Project = {
      id: generateId(),
      projectName,
      garden,
      mode,
      createdAt: now,
      updatedAt: now,
    };
    
    if (userId) {
      // Save to Supabase
      try {
        const { error } = await supabase
          .from('projects')
          .insert(projectToDb(newProject, userId));
        if (error) throw error;
      } catch (error) {
        console.error('Error creating project in Supabase:', error);
      }
    }
    
    const newState: ProjectsState = {
      projects: [...state.projects, newProject],
      activeProjectId: newProject.id,
    };
    saveLocalState(newState);
    
    if (userId) {
      localStorage.setItem(`${STORAGE_KEY}-active-${userId}`, newProject.id);
    }
    
    return newProject;
  }, [state.projects, saveLocalState, userId]);

  // Update an existing project
  const updateProject = useCallback(async (
    id: string,
    updates: Partial<Omit<Project, 'id' | 'createdAt'>>
  ) => {
    const updatedAt = new Date().toISOString();
    
    if (userId) {
      // Update in Supabase
      try {
        const dbUpdates: any = { updated_at: updatedAt };
        if (updates.projectName !== undefined) dbUpdates.project_name = updates.projectName;
        if (updates.garden !== undefined) dbUpdates.garden = updates.garden;
        if (updates.mode !== undefined) dbUpdates.mode = updates.mode;
        
        const { error } = await supabase
          .from('projects')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', userId);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating project in Supabase:', error);
      }
    }
    
    const newProjects = state.projects.map((p) =>
      p.id === id
        ? { ...p, ...updates, updatedAt }
        : p
    );
    saveLocalState({ ...state, projects: newProjects });
  }, [state, saveLocalState, userId]);

  // Delete a project
  const deleteProject = useCallback(async (id: string) => {
    if (userId) {
      // Delete from Supabase
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting project from Supabase:', error);
      }
    }
    
    const newProjects = state.projects.filter((p) => p.id !== id);
    const newActiveId = state.activeProjectId === id
      ? newProjects[0]?.id || null
      : state.activeProjectId;
    saveLocalState({ projects: newProjects, activeProjectId: newActiveId });
    
    if (userId && newActiveId) {
      localStorage.setItem(`${STORAGE_KEY}-active-${userId}`, newActiveId);
    }
  }, [state, saveLocalState, userId]);

  // Set active project
  const setActiveProject = useCallback((id: string | null) => {
    saveLocalState({ ...state, activeProjectId: id });
    if (userId && id) {
      localStorage.setItem(`${STORAGE_KEY}-active-${userId}`, id);
    }
  }, [state, saveLocalState, userId]);

  // Get active project
  const getActiveProject = useCallback((): Project | null => {
    if (!state.activeProjectId) return null;
    return state.projects.find((p) => p.id === state.activeProjectId) || null;
  }, [state]);

  // Get all projects
  const getAllProjects = useCallback((): Project[] => {
    return state.projects;
  }, [state.projects]);

  // Get project by ID
  const getProjectById = useCallback((id: string): Project | null => {
    return state.projects.find((p) => p.id === id) || null;
  }, [state.projects]);

  // Legacy compatibility: get/set single project context
  const projectContext = getActiveProject();
  
  const setProjectContext = useCallback((context: {
    projectName: string;
    garden: GardenType;
    mode: ModeType;
    createdAt: string;
  } | null) => {
    if (!context) {
      if (state.activeProjectId) {
        deleteProject(state.activeProjectId);
      }
      return;
    }
    
    // Check if there's already an active project to update
    if (state.activeProjectId) {
      updateProject(state.activeProjectId, {
        projectName: context.projectName,
        garden: context.garden,
        mode: context.mode,
      });
    } else {
      createProject(context.projectName, context.garden, context.mode);
    }
  }, [state.activeProjectId, createProject, updateProject, deleteProject]);

  return {
    // Multi-project API
    projects: state.projects,
    activeProjectId: state.activeProjectId,
    createProject,
    updateProject,
    deleteProject,
    setActiveProject,
    getActiveProject,
    getAllProjects,
    getProjectById,
    
    // Legacy single-project compatibility
    projectContext,
    setProjectContext,
    updateProjectContext: (updates: Partial<Project>) => {
      if (state.activeProjectId) {
        updateProject(state.activeProjectId, updates);
      }
    },
    clearProjectContext: () => {
      if (state.activeProjectId) {
        deleteProject(state.activeProjectId);
      }
    },
    
    isLoading,
    isSynced,
  };
}
