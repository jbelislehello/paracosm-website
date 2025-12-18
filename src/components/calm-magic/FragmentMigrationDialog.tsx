import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertTriangle, Calendar, Search, Wand2, Hand, Loader2, CheckCircle2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrphanFragment {
  id: string;
  content: string;
  created_at: string;
  tags: string[] | null;
  fragment_type: string;
  season_context: string | null;
}

interface Project {
  id: string;
  project_name: string;
  created_at: string;
}

interface FragmentMigrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMigrationComplete?: () => void;
}

type MigrationMode = 'date' | 'keywords' | 'manual';

// Keyword detection rules for auto-assignment
const PROJECT_KEYWORDS: Record<string, string[]> = {
  'prodago': ['prodago', 'ontologie', 'gouvernance ia', 'ia générative', 'cadre', 'organisation'],
  'tonalli': ['tonalli', 'nahuatl', 'maya', 'tzolkin', 'hexagramme', 'calendrier'],
  'wuxia': ['wuxia', 'fox', 'renard', 'kung fu', 'martial'],
  'oaciq': ['oaciq', 'immobilier', 'courtier', 'agent'],
  'glitch': ['glitch', 'nights', 'nuit', 'creative'],
};

export function FragmentMigrationDialog({ 
  isOpen, 
  onClose, 
  onMigrationComplete 
}: FragmentMigrationDialogProps) {
  const [orphanFragments, setOrphanFragments] = useState<OrphanFragment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedFragments, setSelectedFragments] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<MigrationMode>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [autoAssignments, setAutoAssignments] = useState<Map<string, string>>(new Map());

  // Fetch orphan fragments and projects on open
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch orphan fragments (project_id is null)
        const { data: fragments, error: fragError } = await supabase
          .from('polen_entries')
          .select('id, content, created_at, tags, fragment_type, season_context')
          .eq('user_id', user.id)
          .is('project_id', null)
          .order('created_at', { ascending: false });

        if (fragError) throw fragError;
        setOrphanFragments(fragments || []);

        // Fetch user's projects
        const { data: projectsData, error: projError } = await supabase
          .from('projects')
          .select('id, project_name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (projError) throw projError;
        setProjects(projectsData || []);

        // Auto-select first project if available
        if (projectsData && projectsData.length > 0) {
          setSelectedProject(projectsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching migration data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // Auto-detect keywords for fragments
  const detectKeywordMatch = (content: string, tags: string[] | null): string | null => {
    const lowerContent = content.toLowerCase();
    const lowerTags = tags?.map(t => t.toLowerCase()) || [];

    for (const project of projects) {
      const projectNameLower = project.project_name.toLowerCase();
      
      // Check project keywords
      for (const [key, keywords] of Object.entries(PROJECT_KEYWORDS)) {
        if (projectNameLower.includes(key)) {
          for (const keyword of keywords) {
            if (lowerContent.includes(keyword) || lowerTags.some(t => t.includes(keyword))) {
              return project.id;
            }
          }
        }
      }
      
      // Direct project name match
      if (lowerContent.includes(projectNameLower)) {
        return project.id;
      }
    }
    
    return null;
  };

  // Compute auto-assignments based on mode
  useEffect(() => {
    if (mode === 'keywords' && projects.length > 0) {
      const assignments = new Map<string, string>();
      
      orphanFragments.forEach(fragment => {
        const matchedProject = detectKeywordMatch(fragment.content, fragment.tags);
        if (matchedProject) {
          assignments.set(fragment.id, matchedProject);
        }
      });
      
      setAutoAssignments(assignments);
    } else if (mode === 'date' && projects.length > 0 && selectedProject) {
      // For date mode, all fragments go to selected project
      const assignments = new Map<string, string>();
      orphanFragments.forEach(fragment => {
        assignments.set(fragment.id, selectedProject);
      });
      setAutoAssignments(assignments);
    } else {
      setAutoAssignments(new Map());
    }
  }, [mode, orphanFragments, projects, selectedProject]);

  // Filtered fragments based on search
  const filteredFragments = useMemo(() => {
    if (!searchQuery.trim()) return orphanFragments;
    
    const query = searchQuery.toLowerCase();
    return orphanFragments.filter(f => 
      f.content.toLowerCase().includes(query) ||
      f.tags?.some(t => t.toLowerCase().includes(query))
    );
  }, [orphanFragments, searchQuery]);

  // Group fragments by auto-detected project for keywords mode
  const groupedByProject = useMemo(() => {
    const groups = new Map<string | null, OrphanFragment[]>();
    
    orphanFragments.forEach(fragment => {
      const projectId = autoAssignments.get(fragment.id) || null;
      if (!groups.has(projectId)) {
        groups.set(projectId, []);
      }
      groups.get(projectId)!.push(fragment);
    });
    
    return groups;
  }, [orphanFragments, autoAssignments]);

  const handleSelectAll = () => {
    if (mode === 'manual') {
      setSelectedFragments(new Set(filteredFragments.map(f => f.id)));
    } else {
      setSelectedFragments(new Set(orphanFragments.map(f => f.id)));
    }
  };

  const handleDeselectAll = () => {
    setSelectedFragments(new Set());
  };

  const handleToggleFragment = (id: string) => {
    const newSelected = new Set(selectedFragments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFragments(newSelected);
  };

  const handleMigrate = async () => {
    if (!selectedProject && mode !== 'keywords') {
      toast.error('Sélectionnez un projet cible');
      return;
    }

    setIsMigrating(true);
    try {
      let migratedCount = 0;

      if (mode === 'keywords') {
        // Migrate by detected keywords
        const fragmentsByProject = new Map<string, string[]>();
        
        autoAssignments.forEach((projectId, fragmentId) => {
          if (!fragmentsByProject.has(projectId)) {
            fragmentsByProject.set(projectId, []);
          }
          fragmentsByProject.get(projectId)!.push(fragmentId);
        });

        for (const [projectId, fragmentIds] of fragmentsByProject) {
          const { error } = await supabase
            .from('polen_entries')
            .update({ project_id: projectId })
            .in('id', fragmentIds);
          
          if (error) throw error;
          migratedCount += fragmentIds.length;
        }
      } else {
        // Manual or Date mode - migrate selected fragments to selected project
        const fragmentIds = Array.from(selectedFragments);
        
        if (fragmentIds.length === 0) {
          toast.error('Sélectionnez des fragments à migrer');
          setIsMigrating(false);
          return;
        }

        const { error } = await supabase
          .from('polen_entries')
          .update({ project_id: selectedProject })
          .in('id', fragmentIds);

        if (error) throw error;
        migratedCount = fragmentIds.length;
      }

      toast.success(`${migratedCount} fragment(s) migré(s) avec succès`);
      
      // Refresh orphan list
      setOrphanFragments(prev => 
        prev.filter(f => 
          mode === 'keywords' 
            ? !autoAssignments.has(f.id)
            : !selectedFragments.has(f.id)
        )
      );
      setSelectedFragments(new Set());
      
      onMigrationComplete?.();
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Erreur lors de la migration');
    } finally {
      setIsMigrating(false);
    }
  };

  const getProjectName = (id: string | null) => {
    if (!id) return 'Non assigné';
    return projects.find(p => p.id === id)?.project_name || 'Inconnu';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            Migration des Fragments Orphelins
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              {orphanFragments.length} fragments sans projet
            </Badge>
            Assignez ces fragments à leurs projets respectifs
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orphanFragments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
            <p className="text-lg font-medium">Aucun fragment orphelin</p>
            <p className="text-sm text-muted-foreground">
              Tous vos fragments sont assignés à un projet
            </p>
          </div>
        ) : (
          <>
            {/* Mode Selection */}
            <Tabs value={mode} onValueChange={(v) => setMode(v as MigrationMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual" className="flex items-center gap-1.5">
                  <Hand className="h-4 w-4" />
                  Manuel
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex items-center gap-1.5">
                  <Wand2 className="h-4 w-4" />
                  Mots-clés
                </TabsTrigger>
                <TabsTrigger value="date" className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Par date
                </TabsTrigger>
              </TabsList>

              {/* Manual Mode */}
              <TabsContent value="manual" className="space-y-4">
                <div className="flex items-center gap-3">
                  <Select value={selectedProject || ''} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Projet cible" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.project_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans le contenu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedFragments.size} sélectionné(s) sur {filteredFragments.length}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                      Tout sélectionner
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                      Désélectionner
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[300px] border rounded-lg p-2">
                  <div className="space-y-2">
                    {filteredFragments.map(fragment => (
                      <div
                        key={fragment.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                          selectedFragments.has(fragment.id) 
                            ? "bg-primary/5 border-primary/30" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => handleToggleFragment(fragment.id)}
                      >
                        <Checkbox 
                          checked={selectedFragments.has(fragment.id)}
                          onCheckedChange={() => handleToggleFragment(fragment.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-2">{fragment.content}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(fragment.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </span>
                            {fragment.season_context && (
                              <Badge variant="outline" className="text-xs">
                                {fragment.season_context}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Keywords Mode */}
              <TabsContent value="keywords" className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Wand2 className="h-5 w-5 text-violet-500" />
                  <p className="text-sm">
                    Détection automatique basée sur le contenu et les mots-clés des projets
                  </p>
                </div>

                <div className="space-y-4">
                  {Array.from(groupedByProject.entries()).map(([projectId, fragments]) => (
                    <div key={projectId || 'unassigned'} className="border rounded-lg overflow-hidden">
                      <div className={cn(
                        "flex items-center justify-between p-3",
                        projectId ? "bg-emerald-500/10" : "bg-muted"
                      )}>
                        <div className="flex items-center gap-2">
                          {projectId ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                          <span className="font-medium">{getProjectName(projectId)}</span>
                        </div>
                        <Badge variant="secondary">{fragments.length}</Badge>
                      </div>
                      <ScrollArea className="max-h-[120px]">
                        <div className="p-2 space-y-1">
                          {fragments.slice(0, 5).map(f => (
                            <p key={f.id} className="text-xs text-muted-foreground line-clamp-1 px-2">
                              {f.content}
                            </p>
                          ))}
                          {fragments.length > 5 && (
                            <p className="text-xs text-muted-foreground px-2 italic">
                              ... et {fragments.length - 5} autres
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  <strong>{autoAssignments.size}</strong> fragments seront assignés automatiquement, {' '}
                  <strong>{orphanFragments.length - autoAssignments.size}</strong> resteront non assignés
                </div>
              </TabsContent>

              {/* Date Mode */}
              <TabsContent value="date" className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <p className="text-sm">
                    Assigner tous les fragments orphelins au projet sélectionné
                  </p>
                </div>

                <Select value={selectedProject || ''} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le projet cible" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center justify-between gap-4">
                          <span>{project.project_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(project.created_at), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="border rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{orphanFragments.length}</p>
                  <p className="text-sm text-muted-foreground">
                    fragments seront migrés vers <strong>{getProjectName(selectedProject)}</strong>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isMigrating}>
            Annuler
          </Button>
          <Button 
            onClick={handleMigrate} 
            disabled={
              isMigrating || 
              orphanFragments.length === 0 ||
              (mode === 'manual' && selectedFragments.size === 0) ||
              (mode === 'keywords' && autoAssignments.size === 0) ||
              (mode === 'date' && !selectedProject)
            }
          >
            {isMigrating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Migration...
              </>
            ) : (
              <>
                Migrer {mode === 'keywords' ? autoAssignments.size : mode === 'date' ? orphanFragments.length : selectedFragments.size} fragment(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
