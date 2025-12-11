import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SeasonProgressIndicator } from '@/components/calm-magic/SeasonProgressIndicator';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  Pencil,
  FolderOpen,
  Sparkles,
  Cloud,
  Rocket
} from 'lucide-react';
import { useProjects, Project } from '@/context/ProjectsContext';
import { useUserSession } from '@/hooks/useUserSession';
import { useSubscription } from '@/hooks/useSubscription';
import { getGardenByType, gardens } from '@/data/gardens';
import { GardenType } from '@/types/journal';
import { 
  canCreateProject, 
  getProjectLimit, 
  getProjectLimitDisplay,
  getTierDisplayName 
} from '@/data/subscriptionTiers';
import BoardEntryGate from '@/components/calm-magic/BoardEntryGate';
import UserProfileMenu from '@/components/UserProfileMenu';
import SignupPromptModal from '@/components/SignupPromptModal';
import UpgradePromptModal from '@/components/UpgradePromptModal';

const ProjectsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserSession();
  const { tier } = useSubscription();
  const { 
    projects, 
    setActiveProject, 
    deleteProject, 
    updateProject,
    isLoading 
  } = useProjects();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [gardenFilter, setGardenFilter] = useState<GardenType | 'all'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'personal' | 'professional'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  // Check if we should show guest banner
  const isGuest = !user;
  const hasProjects = projects.length > 0;
  const projectCount = projects.length;
  const canCreate = canCreateProject(tier, projectCount);
  const projectLimit = getProjectLimit(tier);
  const limitDisplay = getProjectLimitDisplay(tier, projectCount);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGarden = gardenFilter === 'all' || project.garden === gardenFilter;
    const matchesMode = modeFilter === 'all' || project.mode === modeFilter;
    return matchesSearch && matchesGarden && matchesMode;
  });

  // Sort by most recently updated
  const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleOpenProject = (project: Project) => {
    setActiveProject(project.id);
    navigate('/calm-magic-board');
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditValue(project.projectName);
  };

  const handleSaveEdit = (projectId: string) => {
    if (editValue.trim().length >= 3) {
      updateProject(projectId, { projectName: editValue.trim() });
    }
    setEditingProject(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-pulse text-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  My Projects
                </h1>
                <p className="text-sm text-muted-foreground">
                  {limitDisplay}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <UserProfileMenu />
              {canCreate ? (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              ) : (
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Upgrade to Create More
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={gardenFilter} onValueChange={(v) => setGardenFilter(v as GardenType | 'all')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Gardens" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gardens</SelectItem>
              {gardens.map((garden) => (
                <SelectItem key={garden.type} value={garden.type}>
                  <span className="flex items-center gap-2">
                    <span>{garden.icon}</span>
                    {garden.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={modeFilter} onValueChange={(v) => setModeFilter(v as 'all' | 'personal' | 'professional')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {sortedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {projects.length === 0 ? (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Create your first Calm Magic Board project to start your innovation journey
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-primary to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </>
            ) : (
              <>
                <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No matching projects</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProjects.map((project) => {
              const garden = getGardenByType(project.garden);
              const isEditing = editingProject === project.id;
              
              return (
                <Card 
                  key={project.id} 
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50 hover:border-primary/30"
                  onClick={() => !isEditing && handleOpenProject(project)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                        style={{ backgroundColor: `${garden?.color}20` }}
                      >
                        {garden?.icon}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProject(project);
                          }}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(project);
                          }}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToDelete(project);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {isEditing ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(project.id);
                            if (e.key === 'Escape') setEditingProject(null);
                          }}
                          onBlur={() => handleSaveEdit(project.id)}
                          autoFocus
                          className="font-semibold"
                        />
                      </div>
                    ) : (
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {project.projectName}
                      </h3>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: garden?.color, color: garden?.color }}
                      >
                        {garden?.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {project.mode}
                      </Badge>
                    </div>
                    
                    {/* Season Progress */}
                    <div className="pt-2 border-t border-border/50">
                      <SeasonProgressIndicator projectId={project.id} compact />
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Created {formatDate(project.createdAt)}</span>
                        <span>Updated {formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Guest Mode Banner */}
      {isGuest && hasProjects && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary/10 to-purple-500/10 border-t border-primary/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-primary" />
              <span className="text-sm">
                <strong>Guest Mode</strong> — Your projects are saved locally.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSignupPrompt(true)}
              className="border-primary/30 hover:border-primary/50"
            >
              Sign in to sync
            </Button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <BoardEntryGate
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        sourceContext="direct"
      />

      {/* Signup Prompt Modal */}
      <SignupPromptModal
        open={showSignupPrompt}
        onOpenChange={setShowSignupPrompt}
        context="save-progress"
      />

      {/* Upgrade Prompt Modal */}
      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentProjectCount={projectCount}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectToDelete?.projectName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsDashboard;
