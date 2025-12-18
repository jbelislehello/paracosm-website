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
  isShared?: boolean; // true if user is a collaborator (not owner)
  collaboratorRole?: 'viewer' | 'editor' | 'admin';
}

interface ProjectsState {
  projects: Project[];
  activeProjectId: string | null;
}

const STORAGE_KEY = 'calm-magic-projects';
const LEGACY_KEY = 'calm-magic-project-context';
const MIGRATION_BACKUP_KEY = 'calm-magic-projects-backup';

// Generate a simple UUID
const generateId = (): string => {
  return crypto.randomUUID?.() || 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Convert DB row to Project
const dbToProject = (row: any, isShared = false, collaboratorRole?: string): Project => ({
  id: row.id,
  projectName: row.project_name,
  garden: row.garden as GardenType,
  mode: row.mode as ModeType,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  isShared,
  collaboratorRole: collaboratorRole as 'viewer' | 'editor' | 'admin' | undefined,
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

// Helper to get localStorage projects
export const getLocalStorageProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ProjectsState;
      return parsed.projects || [];
    }
    
    // Check legacy format
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const legacyProject = JSON.parse(legacy);
      return [{
        id: generateId(),
        projectName: legacyProject.projectName,
        garden: legacyProject.garden,
        mode: legacyProject.mode,
        createdAt: legacyProject.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];
    }
    
    return [];
  } catch (error) {
    console.error('[ProjectContext] Error reading localStorage:', error);
    return [];
  }
};

// Helper to get backup projects
export const getBackupProjects = (): Project[] => {
  try {
    const backup = localStorage.getItem(MIGRATION_BACKUP_KEY);
    if (backup) {
      return JSON.parse(backup) as Project[];
    }
    return [];
  } catch (error) {
    console.error('[ProjectContext] Error reading backup:', error);
    return [];
  }
};

export function useProjectContext(userId?: string | null) {
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    activeProjectId: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const [localStorageCount, setLocalStorageCount] = useState(0);
  const [backupCount, setBackupCount] = useState(0);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  // Load from Supabase when logged in, localStorage when not
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      
      // Check localStorage state for debugging
      const localProjects = getLocalStorageProjects();
      const backupProjects = getBackupProjects();
      setLocalStorageCount(localProjects.length);
      setBackupCount(backupProjects.length);
      
      console.log('[ProjectContext] Starting load...', {
        userId: userId ? userId.slice(0, 8) + '...' : 'none',
        localStorageProjects: localProjects.length,
        backupProjects: backupProjects.length,
      });
      
      if (userId) {
        // Logged in - fetch from Supabase (owned + shared projects)
        try {
          console.log('[ProjectContext] Fetching from Supabase...');
          
          // Fetch owned projects
          const { data: ownedData, error: ownedError } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

          if (ownedError) {
            console.error('[ProjectContext] Error fetching owned projects:', ownedError);
            throw ownedError;
          }

          // Fetch shared projects via project_collaborators
          const { data: sharedData, error: sharedError } = await supabase
            .from('project_collaborators')
            .select('project_id, role, projects(*)')
            .eq('user_id', userId);

          if (sharedError) {
            console.error('[ProjectContext] Error fetching shared projects:', sharedError);
            throw sharedError;
          }

          // Combine owned and shared projects
          const ownedProjects = (ownedData || []).map(row => dbToProject(row, false));
          const sharedProjects = (sharedData || [])
            .filter(item => item.projects)
            .map(item => dbToProject(item.projects, true, item.role));

          const supabaseProjects = [...ownedProjects, ...sharedProjects];
          
          console.log('[ProjectContext] Supabase projects:', {
            owned: ownedProjects.length,
            shared: sharedProjects.length,
            total: supabaseProjects.length,
          });

          // Check if we need to merge localStorage projects
          if (localProjects.length > 0) {
            console.log('[ProjectContext] Found localStorage projects to potentially migrate');
            setMigrationStatus('pending');
            
            // Find projects that don't exist in Supabase (by ID or name+createdAt)
            const projectsToMigrate = localProjects.filter(localP => {
              const existsById = supabaseProjects.some(sp => sp.id === localP.id);
              const existsByNameDate = supabaseProjects.some(
                sp => sp.projectName === localP.projectName && sp.createdAt === localP.createdAt
              );
              return !existsById && !existsByNameDate;
            });
            
            console.log('[ProjectContext] Projects to migrate:', projectsToMigrate.length);
            
            if (projectsToMigrate.length > 0) {
              const migrationResult = await migrateLocalToSupabase(projectsToMigrate, userId, supabaseProjects);
              
              if (migrationResult.success) {
                console.log('[ProjectContext] Migration successful, refetching...');
                setMigrationStatus('success');
                
                // Refetch to get the merged list
                const { data: refreshedData } = await supabase
                  .from('projects')
                  .select('*')
                  .eq('user_id', userId)
                  .order('updated_at', { ascending: false });
                
                const refreshedProjects = (refreshedData || []).map(row => dbToProject(row, false));
                const allProjects = [...refreshedProjects, ...sharedProjects];
                
                const activeId = localStorage.getItem(`${STORAGE_KEY}-active-${userId}`) || allProjects[0]?.id || null;
                setState({ projects: allProjects, activeProjectId: activeId });
                setIsSynced(true);
              } else {
                console.error('[ProjectContext] Migration failed:', migrationResult.error);
                setMigrationStatus('error');
                // Still use Supabase projects, don't clear localStorage
                const activeId = localStorage.getItem(`${STORAGE_KEY}-active-${userId}`) || supabaseProjects[0]?.id || null;
                setState({ projects: supabaseProjects, activeProjectId: activeId });
                setIsSynced(true);
              }
            } else {
              console.log('[ProjectContext] All localStorage projects already in Supabase, clearing localStorage');
              // All projects already exist, safe to clear localStorage
              clearLocalStorageAfterVerification(supabaseProjects);
              setMigrationStatus('success');
              
              const activeId = localStorage.getItem(`${STORAGE_KEY}-active-${userId}`) || supabaseProjects[0]?.id || null;
              setState({ projects: supabaseProjects, activeProjectId: activeId });
              setIsSynced(true);
            }
          } else {
            // No localStorage projects, just use Supabase data
            console.log('[ProjectContext] No localStorage projects, using Supabase data');
            const activeId = localStorage.getItem(`${STORAGE_KEY}-active-${userId}`) || supabaseProjects[0]?.id || null;
            setState({ projects: supabaseProjects, activeProjectId: activeId });
            setIsSynced(true);
          }
        } catch (error) {
          console.error('[ProjectContext] Error loading projects from Supabase:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        }
      } else {
        // Not logged in - use localStorage
        console.log('[ProjectContext] Not logged in, using localStorage');
        loadFromLocalStorage();
      }
      
      setIsLoading(false);
    };

    const loadFromLocalStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (stored) {
          const parsed = JSON.parse(stored) as ProjectsState;
          console.log('[ProjectContext] Loaded from localStorage:', parsed.projects.length, 'projects');
          setState(parsed);
        } else {
          // Check for legacy single-project format and migrate
          const legacy = localStorage.getItem(LEGACY_KEY);
          if (legacy) {
            console.log('[ProjectContext] Migrating legacy project format');
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
          } else {
            console.log('[ProjectContext] No projects in localStorage');
          }
        }
      } catch (error) {
        console.error('[ProjectContext] Error loading projects from localStorage:', error);
      }
    };

    const migrateLocalToSupabase = async (
      projectsToMigrate: Project[], 
      uid: string,
      existingSupabaseProjects: Project[]
    ): Promise<{ success: boolean; error?: any }> => {
      console.log('[ProjectContext] Starting migration of', projectsToMigrate.length, 'projects');
      
      try {
        // Create backup before migration
        const allLocalProjects = getLocalStorageProjects();
        localStorage.setItem(MIGRATION_BACKUP_KEY, JSON.stringify(allLocalProjects));
        console.log('[ProjectContext] Created backup of', allLocalProjects.length, 'projects');
        
        // Insert projects to Supabase
        const rows = projectsToMigrate.map(p => projectToDb(p, uid));
        const { data, error } = await supabase.from('projects').insert(rows).select();
        
        if (error) {
          console.error('[ProjectContext] Migration insert error:', error);
          return { success: false, error };
        }
        
        console.log('[ProjectContext] Successfully inserted', data?.length || 0, 'projects');
        
        // Verify the projects exist in Supabase before clearing localStorage
        const { data: verifyData, error: verifyError } = await supabase
          .from('projects')
          .select('id')
          .eq('user_id', uid);
        
        if (verifyError) {
          console.error('[ProjectContext] Verification failed:', verifyError);
          return { success: false, error: verifyError };
        }
        
        const supabaseIds = new Set(verifyData?.map(p => p.id) || []);
        const allMigrated = projectsToMigrate.every(p => supabaseIds.has(p.id));
        
        if (allMigrated) {
          console.log('[ProjectContext] All projects verified in Supabase, clearing localStorage');
          clearLocalStorageAfterVerification([...existingSupabaseProjects, ...projectsToMigrate]);
          return { success: true };
        } else {
          console.warn('[ProjectContext] Not all projects verified, keeping localStorage');
          return { success: false, error: 'Verification failed - not all projects found in Supabase' };
        }
      } catch (error) {
        console.error('[ProjectContext] Migration error:', error);
        return { success: false, error };
      }
    };

    const clearLocalStorageAfterVerification = (verifiedProjects: Project[]) => {
      console.log('[ProjectContext] Clearing localStorage after successful verification');
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_KEY);
      // Keep backup for safety - user can manually clear it
      console.log('[ProjectContext] localStorage cleared, backup retained');
    };

    loadProjects();
  }, [userId]);

  // Manual recovery function
  const recoverProjects = useCallback(async (): Promise<{ 
    recovered: number; 
    error?: string;
    localProjects: Project[];
    backupProjects: Project[];
  }> => {
    console.log('[ProjectContext] Manual recovery triggered');
    
    const localProjects = getLocalStorageProjects();
    const backupProjects = getBackupProjects();
    
    console.log('[ProjectContext] Recovery state:', {
      localStorage: localProjects.length,
      backup: backupProjects.length,
      userId: userId ? 'yes' : 'no',
    });
    
    if (!userId) {
      return { 
        recovered: 0, 
        error: 'Must be logged in to recover projects',
        localProjects,
        backupProjects,
      };
    }
    
    // Combine localStorage and backup, deduplicate by ID
    const allRecoverableProjects = [...localProjects];
    for (const bp of backupProjects) {
      if (!allRecoverableProjects.some(p => p.id === bp.id)) {
        allRecoverableProjects.push(bp);
      }
    }
    
    if (allRecoverableProjects.length === 0) {
      return { 
        recovered: 0, 
        error: 'No projects found in localStorage or backup',
        localProjects,
        backupProjects,
      };
    }
    
    console.log('[ProjectContext] Attempting to recover', allRecoverableProjects.length, 'projects');
    
    try {
      // Fetch current Supabase projects
      const { data: existingData } = await supabase
        .from('projects')
        .select('id, project_name, created_at')
        .eq('user_id', userId);
      
      const existingIds = new Set(existingData?.map(p => p.id) || []);
      const existingNames = new Set(existingData?.map(p => `${p.project_name}|${p.created_at}`) || []);
      
      // Filter to only projects that don't exist
      const projectsToRecover = allRecoverableProjects.filter(p => {
        const existsById = existingIds.has(p.id);
        const existsByName = existingNames.has(`${p.projectName}|${p.createdAt}`);
        return !existsById && !existsByName;
      });
      
      if (projectsToRecover.length === 0) {
        return { 
          recovered: 0, 
          error: 'All recoverable projects already exist in your account',
          localProjects,
          backupProjects,
        };
      }
      
      // Insert the projects
      const rows = projectsToRecover.map(p => projectToDb(p, userId));
      const { data: insertedData, error } = await supabase
        .from('projects')
        .insert(rows)
        .select();
      
      if (error) {
        console.error('[ProjectContext] Recovery insert error:', error);
        return { 
          recovered: 0, 
          error: error.message,
          localProjects,
          backupProjects,
        };
      }
      
      console.log('[ProjectContext] Recovery successful:', insertedData?.length || 0, 'projects');
      
      // Refetch all projects
      const { data: refreshedData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      const refreshedProjects = (refreshedData || []).map(row => dbToProject(row, false));
      setState(prev => ({
        ...prev,
        projects: refreshedProjects,
        activeProjectId: prev.activeProjectId || refreshedProjects[0]?.id || null,
      }));
      
      return { 
        recovered: insertedData?.length || 0,
        localProjects,
        backupProjects,
      };
    } catch (error: any) {
      console.error('[ProjectContext] Recovery error:', error);
      return { 
        recovered: 0, 
        error: error.message || 'Unknown error',
        localProjects,
        backupProjects,
      };
    }
  }, [userId]);

  // Clear backup (call after confirming recovery is complete)
  const clearBackup = useCallback(() => {
    console.log('[ProjectContext] Clearing backup');
    localStorage.removeItem(MIGRATION_BACKUP_KEY);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_KEY);
    setBackupCount(0);
    setLocalStorageCount(0);
  }, []);

  // Set up real-time subscription when logged in
  useEffect(() => {
    if (!userId) return;

    const refetchProjects = async () => {
      // Fetch owned projects
      const { data: ownedData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      // Fetch shared projects
      const { data: sharedData } = await supabase
        .from('project_collaborators')
        .select('project_id, role, projects(*)')
        .eq('user_id', userId);

      const ownedProjects = (ownedData || []).map(row => dbToProject(row, false));
      const sharedProjects = (sharedData || [])
        .filter(item => item.projects)
        .map(item => dbToProject(item.projects, true, item.role));

      const allProjects = [...ownedProjects, ...sharedProjects];

      setState(prev => ({
        ...prev,
        projects: allProjects,
        activeProjectId: prev.activeProjectId && allProjects.some(p => p.id === prev.activeProjectId)
          ? prev.activeProjectId
          : allProjects[0]?.id || null,
      }));
    };

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
        refetchProjects
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_collaborators',
          filter: `user_id=eq.${userId}`,
        },
        refetchProjects
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
    
    // Recovery API
    recoverProjects,
    clearBackup,
    localStorageCount,
    backupCount,
    migrationStatus,
    
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
