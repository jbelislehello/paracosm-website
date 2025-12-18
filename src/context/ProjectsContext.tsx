import React, { createContext, useContext, ReactNode } from 'react';
import { useProjectContext, Project } from '@/hooks/useProjectContext';
import { useUserSession } from '@/hooks/useUserSession';
import { GardenType } from '@/types/journal';
import { ModeType } from '@/data/modeAwareContent';

// Re-export Project type for convenience
export type { Project } from '@/hooks/useProjectContext';

interface ProjectsContextValue {
  projects: Project[];
  activeProjectId: string | null;
  createProject: (projectName: string, garden: GardenType, mode: ModeType) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setActiveProject: (id: string | null) => void;
  getActiveProject: () => Project | null;
  getAllProjects: () => Project[];
  getProjectById: (id: string) => Project | null;
  projectContext: Project | null;
  isLoading: boolean;
  isSynced: boolean;
  // Recovery API
  recoverProjects: () => Promise<{ recovered: number; error?: string; localProjects: Project[]; backupProjects: Project[] }>;
  clearBackup: () => void;
  localStorageCount: number;
  backupCount: number;
  migrationStatus: 'idle' | 'pending' | 'success' | 'error';
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

interface ProjectsProviderProps {
  children: ReactNode;
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const { user } = useUserSession();
  const projectsState = useProjectContext(user?.id);

  return (
    <ProjectsContext.Provider value={projectsState}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextValue => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

export default ProjectsContext;
