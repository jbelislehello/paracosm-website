import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Sparkles, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Waves, 
  Music,
  BookOpen,
  GitBranch,
  HelpCircle,
  Users,
  Heart,
  Briefcase,
  Loader2,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CompassType, JourneyMode } from '@/types/journal-expansion';
import { format } from 'date-fns';

interface PolenEntry {
  id: string;
  content: string;
  tags: string[] | null;
  tile_id: number | null;
  created_at: string;
  source_reference: string | null;
}

interface PolenBrowserProps {
  cycleId?: string;
  projectId?: string | null;
  onEntrySelect?: (entry: PolenEntry) => void;
}

const COMPASS_ICONS: Record<CompassType, React.ReactNode> = {
  'narrative': <BookOpen className="h-3 w-3" />,
  'workflow': <GitBranch className="h-3 w-3" />,
  'inquiry': <HelpCircle className="h-3 w-3" />,
  'playground': <Sparkles className="h-3 w-3" />,
  'human-systems': <Users className="h-3 w-3" />,
};

const STEP_ICONS: Record<string, React.ReactNode> = {
  'glitch': <Zap className="h-3 w-3" />,
  'drift': <Waves className="h-3 w-3" />,
  'tune': <Music className="h-3 w-3" />,
};

const JOURNEY_ICONS: Record<JourneyMode, React.ReactNode> = {
  'relational': <Heart className="h-3 w-3" />,
  'product': <Briefcase className="h-3 w-3" />,
};

export const PolenBrowser: React.FC<PolenBrowserProps> = ({ cycleId, projectId, onEntrySelect }) => {
  const [entries, setEntries] = useState<PolenEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Filters
  const [compassFilter, setCompassFilter] = useState<string>('all');
  const [stepFilter, setStepFilter] = useState<string>('all');
  const [journeyFilter, setJourneyFilter] = useState<string>('all');

  useEffect(() => {
    fetchEntries();
  }, [cycleId, projectId]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      let query = supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', userData.user.id)
        .contains('tags', ['ai-prompt'])
        .order('created_at', { ascending: false });

      // Filter by project_id if provided
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      if (cycleId) {
        query = query.eq('cycle_id', cycleId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Failed to fetch Polen entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const tags = entry.tags || [];
      
      if (compassFilter !== 'all' && !tags.includes(compassFilter)) {
        return false;
      }
      
      if (stepFilter !== 'all' && !tags.includes(stepFilter)) {
        return false;
      }
      
      if (journeyFilter !== 'all' && !tags.includes(journeyFilter)) {
        return false;
      }
      
      return true;
    });
  }, [entries, compassFilter, stepFilter, journeyFilter]);

  const getEntryMeta = (entry: PolenEntry) => {
    const tags = entry.tags || [];
    const compass = tags.find(t => ['narrative', 'workflow', 'inquiry', 'playground', 'human-systems'].includes(t));
    const step = tags.find(t => ['glitch', 'drift', 'tune'].includes(t));
    const journey = tags.find(t => ['relational', 'product'].includes(t));
    return { compass, step, journey };
  };

  const clearFilters = () => {
    setCompassFilter('all');
    setStepFilter('all');
    setJourneyFilter('all');
  };

  const hasActiveFilters = compassFilter !== 'all' || stepFilter !== 'all' || journeyFilter !== 'all';

  return (
    <Card className="bg-background/50 backdrop-blur">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Polen Browser
                {entries.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {filteredEntries.length}/{entries.length}
                  </Badge>
                )}
              </span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={compassFilter} onValueChange={setCompassFilter}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="Compass" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Compasses</SelectItem>
                  <SelectItem value="narrative">Narrative</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="playground">Playground</SelectItem>
                  <SelectItem value="human-systems">Human Systems</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stepFilter} onValueChange={setStepFilter}>
                <SelectTrigger className="w-[110px] h-8 text-xs">
                  <SelectValue placeholder="Step" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Steps</SelectItem>
                  <SelectItem value="glitch">GL!TCH</SelectItem>
                  <SelectItem value="drift">DRIFT</SelectItem>
                  <SelectItem value="tune">TUNE</SelectItem>
                </SelectContent>
              </Select>

              <Select value={journeyFilter} onValueChange={setJourneyFilter}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Journey" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Journeys</SelectItem>
                  <SelectItem value="relational">Relational</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Entries List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {entries.length === 0 
                  ? "No AI prompts saved yet. Generate prompts and click 'Save' to collect them here."
                  : "No entries match your filters."}
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {filteredEntries.map(entry => {
                    const { compass, step, journey } = getEntryMeta(entry);
                    const isExpanded = expandedId === entry.id;
                    
                    return (
                      <div
                        key={entry.id}
                        className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex flex-wrap gap-1">
                            {compass && (
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                {COMPASS_ICONS[compass as CompassType]}
                                {compass}
                              </Badge>
                            )}
                            {step && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs flex items-center gap-1 ${
                                  step === 'glitch' ? 'border-yellow-500/50 text-yellow-500' :
                                  step === 'drift' ? 'border-blue-500/50 text-blue-500' :
                                  'border-purple-500/50 text-purple-500'
                                }`}
                              >
                                {STEP_ICONS[step]}
                                {step.toUpperCase()}
                              </Badge>
                            )}
                            {journey && (
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                {JOURNEY_ICONS[journey as JourneyMode]}
                                {journey}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(entry.created_at), 'MMM d, HH:mm')}
                          </span>
                        </div>
                        
                        {entry.tile_id && (
                          <div className="text-xs text-muted-foreground mb-2">
                            Tile #{entry.tile_id}
                          </div>
                        )}
                        
                        <p className={`text-sm text-foreground/80 ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {entry.content.split('---')[1]?.trim() || entry.content}
                        </p>
                        
                        {onEntrySelect && isExpanded && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEntrySelect(entry);
                            }}
                          >
                            Use this prompt
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchEntries}
              disabled={isLoading}
              className="w-full text-xs"
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              Refresh
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PolenBrowser;
