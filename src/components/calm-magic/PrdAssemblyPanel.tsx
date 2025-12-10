import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  X, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Flower2,
  Lightbulb,
  PenTool,
  Gem,
  Music,
  Sparkles,
  ExternalLink,
  Loader2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  Season, 
  SEASON_ORDER, 
  SEASON_LABELS, 
  SEASON_PRD_LAYER, 
  PRD_LAYER_FIELDS,
  getLayerReadiness 
} from '@/utils/prdAccessLevel';

interface PrdAssemblyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  completedSeasons: Season[];
  prdId: string | null;
  onGenerateLayer: (season: Season) => Promise<void>;
}

interface LayerData {
  season: Season;
  layerName: string;
  fields: string[];
  readiness: number;
  isComplete: boolean;
  content: Record<string, string | null>;
}

const SEASON_ICONS: Record<Season, React.ReactNode> = {
  POLLENS: <Flower2 className="h-4 w-4" />,
  NOEMS: <Lightbulb className="h-4 w-4" />,
  POEMS: <PenTool className="h-4 w-4" />,
  TOTEMS: <Gem className="h-4 w-4" />,
  ANTHEMS: <Music className="h-4 w-4" />,
};

const SEASON_COLORS: Record<Season, string> = {
  POLLENS: 'bg-chart-1/10 border-chart-1/30 text-chart-1',
  NOEMS: 'bg-chart-2/10 border-chart-2/30 text-chart-2',
  POEMS: 'bg-chart-3/10 border-chart-3/30 text-chart-3',
  TOTEMS: 'bg-chart-4/10 border-chart-4/30 text-chart-4',
  ANTHEMS: 'bg-chart-5/10 border-chart-5/30 text-chart-5',
};

export const PrdAssemblyPanel: React.FC<PrdAssemblyPanelProps> = ({
  isOpen,
  onClose,
  currentSeason,
  seasonProgress,
  completedSeasons,
  prdId,
  onGenerateLayer
}) => {
  const navigate = useNavigate();
  const [prdData, setPrdData] = useState<Record<string, any> | null>(null);
  const [polenCounts, setPolenCounts] = useState<Record<Season, number>>({} as Record<Season, number>);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<Set<Season>>(new Set([currentSeason]));
  const [generatingLayer, setGeneratingLayer] = useState<Season | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPrdData();
      fetchPolenCounts();
    }
  }, [isOpen, prdId]);

  const fetchPrdData = async () => {
    if (!prdId) {
      setPrdData(null);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('prds')
        .select('*')
        .eq('id', prdId)
        .single();

      if (error) throw error;
      setPrdData(data);
    } catch (err) {
      console.error('Failed to fetch PRD:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPolenCounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('polen_entries')
        .select('season_context, tags')
        .eq('user_id', user.id);

      if (error) throw error;

      // Count by season
      const counts: Record<Season, number> = {
        POLLENS: 0,
        NOEMS: 0,
        POEMS: 0,
        TOTEMS: 0,
        ANTHEMS: 0,
      };

      data?.forEach(entry => {
        const season = entry.season_context as Season || 
          entry.tags?.find((t: string) => SEASON_ORDER.includes(t as Season)) as Season;
        if (season && counts[season] !== undefined) {
          counts[season]++;
        }
      });

      setPolenCounts(counts);
    } catch (err) {
      console.error('Failed to fetch polen counts:', err);
    }
  };

  const handleGenerateLayer = async (season: Season) => {
    setGeneratingLayer(season);
    try {
      await onGenerateLayer(season);
      await fetchPrdData(); // Refresh PRD data after generation
      toast.success(`${SEASON_LABELS[season]} layer generated!`);
    } catch (err) {
      toast.error('Failed to generate layer');
    } finally {
      setGeneratingLayer(null);
    }
  };

  const toggleLayer = (season: Season) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(season)) {
        next.delete(season);
      } else {
        next.add(season);
      }
      return next;
    });
  };

  const getLayerData = (season: Season): LayerData => {
    const layerName = SEASON_PRD_LAYER[season];
    const fields = PRD_LAYER_FIELDS[layerName] || [];
    const tilesVisited = seasonProgress[season]?.size || 0;
    const polenCount = polenCounts[season] || 0;
    const isComplete = completedSeasons.includes(season);
    const readiness = getLayerReadiness(season, tilesVisited, polenCount, isComplete);

    const content: Record<string, string | null> = {};
    fields.forEach(field => {
      content[field] = prdData?.[field] || null;
    });

    return {
      season,
      layerName,
      fields,
      readiness,
      isComplete,
      content,
    };
  };

  const hasContent = (layer: LayerData): boolean => {
    return Object.values(layer.content).some(v => v && v.trim().length > 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">PRD Assembly</h2>
              <p className="text-xs text-muted-foreground">
                {prdId ? 'Editing PRD' : 'PRD will be created on first layer generation'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {prdId && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/prds/${prdId}`)}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Open Editor
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {SEASON_ORDER.map(season => {
                const layer = getLayerData(season);
                const isExpanded = expandedLayers.has(season);
                const isCurrent = season === currentSeason;
                const isGenerating = generatingLayer === season;
                
                return (
                  <Card 
                    key={season}
                    className={`border ${isCurrent ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50'}`}
                  >
                    <Collapsible open={isExpanded} onOpenChange={() => toggleLayer(season)}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="py-3 px-4 cursor-pointer hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded ${SEASON_COLORS[season]}`}>
                                {SEASON_ICONS[season]}
                              </div>
                              <div>
                                <CardTitle className="text-sm flex items-center gap-2">
                                  {SEASON_LABELS[season]}
                                  <Badge variant="outline" className="text-xs font-normal">
                                    {layer.layerName}
                                  </Badge>
                                  {layer.isComplete && (
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                  )}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Progress value={layer.readiness} className="h-1.5 w-20" />
                                  <span className="text-xs text-muted-foreground">
                                    {layer.readiness}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-4 px-4 space-y-3">
                          {/* Stats */}
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{seasonProgress[season]?.size || 0}/64 tiles</span>
                            <span>{polenCounts[season] || 0} fragments</span>
                          </div>

                          {/* Content Preview */}
                          {hasContent(layer) ? (
                            <div className="space-y-2">
                              {layer.fields.map(field => {
                                const value = layer.content[field];
                                if (!value) return null;
                                
                                return (
                                  <div key={field} className="bg-muted/30 rounded p-2">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                      {field.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                                    </p>
                                    <p className="text-sm line-clamp-3">{value}</p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              No content generated yet
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant={hasContent(layer) ? "outline" : "default"}
                              onClick={() => handleGenerateLayer(season)}
                              disabled={isGenerating || (seasonProgress[season]?.size || 0) < 8}
                              className="text-xs"
                            >
                              {isGenerating ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Sparkles className="h-3 w-3 mr-1" />
                              )}
                              {hasContent(layer) ? 'Regenerate' : 'Generate'} Layer
                            </Button>
                            {prdId && hasContent(layer) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`/prds/${prdId}`)}
                                className="text-xs"
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border shrink-0 bg-muted/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSeasons.length}/5 layers complete
            </span>
            {completedSeasons.length >= 5 && (
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                PRD Ready for Export
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrdAssemblyPanel;
