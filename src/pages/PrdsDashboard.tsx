import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/context/ProjectsContext';
import { 
  FileText, Search, Filter, Plus, ArrowLeft, 
  Heart, Wand2, Mountain, DoorOpen, Bird,
  Clock, Trash2, Edit3, Eye, MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
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
} from "@/components/ui/alert-dialog";

type PrdLayer = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
type PrdStatus = 'draft' | 'in_review' | 'active' | 'archived';

interface Prd {
  id: string;
  title: string;
  status: string;
  prototype_stage: string;
  main_board: string | null;
  created_at: string;
  updated_at: string;
  love_signals_summary: string | null;
  magic_storyworld: string | null;
  calm_requirements: string | null;
  open_ontology_and_graph: string | null;
  free_first_poem_description: string | null;
}

const LAYER_ICONS: Record<PrdLayer, React.ElementType> = {
  LOVE: Heart,
  MAGIC: Wand2,
  CALM: Mountain,
  OPEN: DoorOpen,
  FREE: Bird
};

const LAYER_COLORS: Record<PrdLayer, string> = {
  LOVE: 'bg-rose-500',
  MAGIC: 'bg-purple-500',
  CALM: 'bg-blue-500',
  OPEN: 'bg-emerald-500',
  FREE: 'bg-amber-500'
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'bg-muted', text: 'text-muted-foreground' },
  in_review: { bg: 'bg-amber-500/20', text: 'text-amber-600' },
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-600' },
  archived: { bg: 'bg-slate-500/20', text: 'text-slate-500' }
};

const PrdsDashboard = () => {
  const [prds, setPrds] = useState<Prd[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [boardFilter, setBoardFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prdToDelete, setPrdToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeProjectId } = useProjects();

  useEffect(() => {
    fetchPrds();
  }, [activeProjectId]);

  const fetchPrds = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      let query = supabase
        .from('prds')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (activeProjectId) {
        query = query.eq('project_id', activeProjectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPrds(data || []);
    } catch (error) {
      console.error('Error fetching PRDs:', error);
      toast({
        title: 'Error loading PRDs',
        description: 'Could not load your PRDs. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getLayerProgress = (prd: Prd): PrdLayer[] => {
    const completedLayers: PrdLayer[] = [];
    if (prd.love_signals_summary) completedLayers.push('LOVE');
    if (prd.magic_storyworld) completedLayers.push('MAGIC');
    if (prd.calm_requirements) completedLayers.push('CALM');
    if (prd.open_ontology_and_graph) completedLayers.push('OPEN');
    if (prd.free_first_poem_description) completedLayers.push('FREE');
    return completedLayers;
  };

  const handleDelete = async () => {
    if (!prdToDelete) return;
    
    try {
      const { error } = await supabase
        .from('prds')
        .delete()
        .eq('id', prdToDelete);

      if (error) throw error;

      setPrds(prev => prev.filter(p => p.id !== prdToDelete));
      toast({ title: 'PRD deleted' });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'Could not delete PRD.',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setPrdToDelete(null);
    }
  };

  const filteredPrds = prds.filter(prd => {
    const matchesSearch = prd.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prd.status === statusFilter;
    const matchesBoard = boardFilter === 'all' || prd.main_board === boardFilter;
    return matchesSearch && matchesStatus && matchesBoard;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)] text-foreground">
      {/* Editorial Header */}
      <header className="border-b border-current/10 bg-background/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Button variant="ghost" size="icon" onClick={() => navigate('/calm-magic-board')} className="shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-xl leading-none text-[hsl(15_75%_55%)]">12</span>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[hsl(15_75%_45%)]">
                    Field Notes
                  </p>
                </div>
                <h1 className="font-serif text-xl md:text-2xl leading-tight mt-1 truncate">
                  Calm Magic PRDs
                </h1>
                <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5">
                  {prds.length} PRD{prds.length !== 1 ? 's' : ''} created
                </p>
              </div>
            </div>
            
            <Link to="/calm-magic-board">
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                <Plus className="w-4 h-4 mr-2" />
                New PRD
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search PRDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={boardFilter} onValueChange={setBoardFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              <SelectItem value="LOVE">LOVE</SelectItem>
              <SelectItem value="MAGIC">MAGIC</SelectItem>
              <SelectItem value="CALM">CALM</SelectItem>
              <SelectItem value="OPEN">OPEN</SelectItem>
              <SelectItem value="FREE">FREE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Layer Legend */}
        <div className="flex flex-wrap gap-3 mb-6 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground">Layer Progress:</span>
          {(['LOVE', 'MAGIC', 'CALM', 'OPEN', 'FREE'] as PrdLayer[]).map(layer => {
            const Icon = LAYER_ICONS[layer];
            return (
              <div key={layer} className="flex items-center gap-1 text-xs">
                <div className={`w-3 h-3 rounded-full ${LAYER_COLORS[layer]}`} />
                <Icon className="w-3 h-3" />
                <span>{layer}</span>
              </div>
            );
          })}
        </div>

        {/* PRD Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(j => (
                    <Skeleton key={j} className="w-6 h-6 rounded-full" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : filteredPrds.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || statusFilter !== 'all' || boardFilter !== 'all'
                ? 'No matching PRDs'
                : 'No PRDs yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' || boardFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Complete a 64-tile cycle to generate your first Calm Magic PRD'}
            </p>
            <Link to="/calm-magic-board">
              <Button>Start a Cycle</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrds.map(prd => {
              const layerProgress = getLayerProgress(prd);
              const statusStyle = STATUS_STYLES[prd.status] || STATUS_STYLES.draft;
              
              return (
                <Card 
                  key={prd.id} 
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/calm-magic-board/prds/${prd.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {prd.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${statusStyle.bg} ${statusStyle.text} text-xs`}>
                          {prd.status.replace('_', ' ')}
                        </Badge>
                        {prd.main_board && (
                          <Badge variant="outline" className="text-xs">
                            {prd.main_board}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/calm-magic-board/prds/${prd.id}`);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/calm-magic-board/prds/${prd.id}?edit=true`);
                        }}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrdToDelete(prd.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Layer Progress Indicator */}
                  <div className="flex gap-1 mb-3">
                    {(['LOVE', 'MAGIC', 'CALM', 'OPEN', 'FREE'] as PrdLayer[]).map(layer => {
                      const Icon = LAYER_ICONS[layer];
                      const isComplete = layerProgress.includes(layer);
                      return (
                        <div
                          key={layer}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isComplete 
                              ? LAYER_COLORS[layer] + ' text-white' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                          title={`${layer}: ${isComplete ? 'Complete' : 'Pending'}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 via-purple-500 via-blue-500 via-emerald-500 to-amber-500 transition-all"
                      style={{ width: `${(layerProgress.length / 5) * 100}%` }}
                    />
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Updated {formatDate(prd.updated_at)}</span>
                    <span className="ml-auto">{layerProgress.length}/5 layers</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete PRD?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the PRD and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PrdsDashboard;
