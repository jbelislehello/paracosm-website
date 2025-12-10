import { useState, useEffect, useCallback } from 'react';
import { GardenType } from '@/types/journal';
import { ModeType } from '@/data/modeAwareContent';

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

export function useProjectContext() {
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    activeProjectId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount, with migration from legacy format
  useEffect(() => {
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
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever state changes
  const saveState = useCallback((newState: ProjectsState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  // Create a new project
  const createProject = useCallback((
    projectName: string,
    garden: GardenType,
    mode: ModeType
  ): Project => {
    const now = new Date().toISOString();
    const newProject: Project = {
      id: generateId(),
      projectName,
      garden,
      mode,
      createdAt: now,
      updatedAt: now,
    };
    
    const newState: ProjectsState = {
      projects: [...state.projects, newProject],
      activeProjectId: newProject.id,
    };
    saveState(newState);
    
    return newProject;
  }, [state.projects, saveState]);

  // Update an existing project
  const updateProject = useCallback((
    id: string,
    updates: Partial<Omit<Project, 'id' | 'createdAt'>>
  ) => {
    const newProjects = state.projects.map((p) =>
      p.id === id
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    );
    saveState({ ...state, projects: newProjects });
  }, [state, saveState]);

  // Delete a project
  const deleteProject = useCallback((id: string) => {
    const newProjects = state.projects.filter((p) => p.id !== id);
    const newActiveId = state.activeProjectId === id
      ? newProjects[0]?.id || null
      : state.activeProjectId;
    saveState({ projects: newProjects, activeProjectId: newActiveId });
  }, [state, saveState]);

  // Set active project
  const setActiveProject = useCallback((id: string | null) => {
    saveState({ ...state, activeProjectId: id });
  }, [state, saveState]);

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
  };
}
