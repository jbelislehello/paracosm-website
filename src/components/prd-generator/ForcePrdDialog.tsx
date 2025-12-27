import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Rocket, Sprout, Gem, BookOpen, Landmark, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PrdLayer } from './PrdStageProgress';

interface Project {
  id: string;
  project_name: string;
  garden: string;
}

interface PolenEntry {
  id: string;
  content: string;
  tile_id: number | null;
  tags: string[];
  created_at: string;
  season_context: string | null;
}

interface ForcePrdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGeneration: (projectId: string, startLayer: PrdLayer, polenEntries: PolenEntry[], inferMissing: boolean) => void;
  defaultProjectId?: string | null;
}

// Export PolenEntry type for use in parent components
export type { PolenEntry };

const LAYERS: PrdLayer[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const LAYER_ICONS: Record<PrdLayer, React.ElementType> = {
  POLLENS: Sprout,
  NOEMS: Gem,
  POEMS: BookOpen,
  TOTEMS: Landmark,
  ANTHEMS: Music
};

const LAYER_DESCRIPTIONS: Record<PrdLayer, string> = {
  POLLENS: 'Relational & cultural aspirations',
  NOEMS: 'Conceptual ideation & mental models',
  POEMS: 'P.O.E.M.S. experiential design',
  TOTEMS: 'Technical infrastructure',
  ANTHEMS: 'Market & storytelling'
};

const ForcePrdDialog = ({ isOpen, onClose, onStartGeneration, defaultProjectId }: ForcePrdDialogProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(defaultProjectId || null);
  const [selectedLayer, setSelectedLayer] = useState<PrdLayer>('POEMS');
  const [inferMissingLayers, setInferMissingLayers] = useState(true);
  const [polenEntries, setPolenEntries] = useState<PolenEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPolens, setLoadingPolens] = useState(false);

  // Load projects on open
  useEffect(() => {
    if (isOpen) {
      loadProjects();
      if (defaultProjectId) {
        setSelectedProjectId(defaultProjectId);
      }
    }
  }, [isOpen, defaultProjectId]);

  // Load polen entries when project changes
  useEffect(() => {
    if (selectedProjectId) {
      loadPolenEntries(selectedProjectId);
    } else {
      setPolenEntries([]);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, garden')
        .eq('user_id', user.id)
        .order('project_name');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadPolenEntries = async (projectId: string) => {
    setLoadingPolens(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('polen_entries')
        .select('id, content, tile_id, tags, created_at, season_context')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolenEntries(data || []);
    } catch (error) {
      console.error('Error loading polen entries:', error);
    } finally {
      setLoadingPolens(false);
    }
  };

  // Count fragments per season
  const fragmentsByLayer = useMemo(() => {
    const counts: Record<PrdLayer, number> = {
      POLLENS: 0, NOEMS: 0, POEMS: 0, TOTEMS: 0, ANTHEMS: 0
    };
    polenEntries.forEach(entry => {
      const season = entry.season_context as PrdLayer | null;
      if (season && counts[season] !== undefined) {
        counts[season]++;
      }
    });
    return counts;
  }, [polenEntries]);

  // Get fragments for selected layer
  const selectedLayerFragments = useMemo(() => {
    return polenEntries.filter(entry => entry.season_context === selectedLayer);
  }, [polenEntries, selectedLayer]);

  // Calculate which layers have enough data
  const layerReadiness = useMemo(() => {
    return LAYERS.map(layer => ({
      layer,
      count: fragmentsByLayer[layer],
      ready: fragmentsByLayer[layer] >= 3
    }));
  }, [fragmentsByLayer]);

  const handleStartGeneration = () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    // Get all fragments for generation (filter by selected layer or all if inferring)
    const relevantEntries = inferMissingLayers 
      ? polenEntries 
      : selectedLayerFragments;

    if (relevantEntries.length === 0) {
      toast.error('No fragments available for generation');
      return;
    }

    onStartGeneration(selectedProjectId, selectedLayer, relevantEntries, inferMissingLayers);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-violet-500" />
            Force PRD Generation
          </DialogTitle>
          <DialogDescription>
            Generate a PRD starting from any layer, bypassing the normal journey requirements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project</label>
            <Select 
              value={selectedProjectId || ''} 
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <span>{project.project_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {project.garden}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Layer Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Start from layer</label>
            <div className="grid grid-cols-5 gap-2">
              {LAYERS.map(layer => {
                const Icon = LAYER_ICONS[layer];
                const count = fragmentsByLayer[layer];
                const isSelected = selectedLayer === layer;
                
                return (
                  <button
                    key={layer}
                    onClick={() => setSelectedLayer(layer)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-xs font-medium">{layer}</p>
                    <Badge 
                      variant={count > 0 ? 'default' : 'outline'} 
                      className={`mt-1 text-[10px] ${count >= 3 ? 'bg-emerald-500' : count > 0 ? 'bg-amber-500' : ''}`}
                    >
                      {count}
                    </Badge>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {LAYER_DESCRIPTIONS[selectedLayer]}
            </p>
          </div>

          {/* Fragments Preview */}
          {selectedProjectId && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                <span>Available fragments for {selectedLayer}</span>
                {loadingPolens && <Loader2 className="w-4 h-4 animate-spin" />}
              </label>
              
              {selectedLayerFragments.length > 0 ? (
                <ScrollArea className="h-32 rounded-lg border bg-muted/30 p-3">
                  <div className="space-y-2">
                    {selectedLayerFragments.slice(0, 5).map(entry => (
                      <div key={entry.id} className="text-xs p-2 bg-background rounded border">
                        {entry.content.slice(0, 120)}...
                      </div>
                    ))}
                    {selectedLayerFragments.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{selectedLayerFragments.length - 5} more fragments
                      </p>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <Card className="p-4 bg-amber-500/10 border-amber-500/30">
                  <p className="text-sm text-amber-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No fragments for this layer. The AI will infer content from other layers.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Force PRD Warning */}
          <Card className="p-4 bg-amber-500/10 border-amber-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-700">Force-Generated PRD Limitations</p>
                <p className="text-xs text-amber-600/80">
                  PRDs created via force generation will not be eligible for OECD Framework validation 
                  or governance playbook generation. Complete the journey organically for full access.
                </p>
              </div>
            </div>
          </Card>

          {/* Options */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
            <Checkbox 
              id="infer-missing"
              checked={inferMissingLayers}
              onCheckedChange={(checked) => setInferMissingLayers(checked as boolean)}
            />
            <label htmlFor="infer-missing" className="text-sm cursor-pointer flex-1">
              <span className="font-medium">Auto-infer missing layers</span>
              <p className="text-xs text-muted-foreground">
                The AI will synthesize POLLENS, NOEMS from your {selectedLayer} content
              </p>
            </label>
          </div>

          {/* Layer Readiness Summary */}
          <div className="flex items-center gap-2 flex-wrap">
            {layerReadiness.map(({ layer, count, ready }) => (
              <Badge 
                key={layer} 
                variant="outline"
                className={ready ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : ''}
              >
                {ready ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                {layer}: {count}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleStartGeneration}
            disabled={!selectedProjectId || loading}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4 mr-2" />
            )}
            Generate PRD from {selectedLayer}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForcePrdDialog;
