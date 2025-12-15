import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
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
  Check,
  FileDown,
  Printer,
  Layers,
  Eye,
  Briefcase,
  Zap,
  Lock,
  Copy
} from 'lucide-react';
import { downloadMarkdown, exportPrdAsPdf } from '@/utils/prdExport';
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
import { PrdEducationPanel } from './PrdEducationPanel';
import { PrdDimensionalView } from './PrdDimensionalView';
import CSuiteDashboard from './CSuiteDashboard';
import CompilationTab from '@/components/prd-generator/CompilationTab';
import { useMode } from './context/ModeContext';
import { useSubscription } from '@/hooks/useSubscription';
import { hasFeatureAccess, PremiumFeature } from '@/data/subscriptionTiers';
import FeatureGate from '@/components/FeatureGate';
import PremiumBadge from '@/components/PremiumBadge';

// Human-readable field labels
const FIELD_LABELS: Record<string, string> = {
  love_signals_summary: 'Signals Summary',
  love_decision_to_exist: 'Decision to Exist',
  magic_storyworld: 'Storyworld',
  magic_prd_outline: 'PRD Outline',
  magic_hypotheses: 'Hypotheses',
  magic_patterns: 'Patterns',
  calm_requirements: 'Requirements',
  calm_risks_and_limits: 'Risks & Limits',
  open_ontology_and_graph: 'Ontology & Graph',
  open_real_workflow: 'Real Workflow',
  open_adjustment_plan: 'Adjustment Plan',
  free_first_poem_description: 'First Poem Description',
  free_totem_anthem: 'Totem Anthem',
  free_success_criteria: 'Success Criteria',
  free_next_cycle_hooks: 'Next Cycle Hooks',
};
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
  const { mode } = useMode();
  const [prdData, setPrdData] = useState<Record<string, any> | null>(null);
  const [polenCounts, setPolenCounts] = useState<Record<Season, number>>({} as Record<Season, number>);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<Set<Season>>(new Set([currentSeason]));
  const [generatingLayer, setGeneratingLayer] = useState<Season | null>(null);
  const [activeTab, setActiveTab] = useState<'layers' | 'dimensions' | 'csuite' | 'compilation'>('layers');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  
  const { tier } = useSubscription();
  const canAccessCSuite = hasFeatureAccess(tier, 'csuite_dashboard');
  const canAccessCompilation = hasFeatureAccess(tier, 'compilation_tab');
  const canExportPdf = hasFeatureAccess(tier, 'pdf_export');
  
  const isPersonal = mode === 'personal';
  const documentName = isPersonal ? 'RRD' : 'PRD';
  const documentFullName = isPersonal ? 'Relational Requirements Document' : 'Product Requirements Document';

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
      await fetchPrdData();
      toast.success(`${SEASON_LABELS[season]} layer generated!`);
    } catch (err) {
      toast.error('Failed to generate layer');
    } finally {
      setGeneratingLayer(null);
    }
  };

  const handleGenerateAllLayers = async () => {
    setIsGeneratingAll(true);
    let successCount = 0;
    
    try {
      for (const season of SEASON_ORDER) {
        const tilesVisited = seasonProgress[season]?.size || 0;
        if (tilesVisited >= 8) {
          setGeneratingLayer(season);
          try {
            await onGenerateLayer(season);
            successCount++;
          } catch (err) {
            console.error(`Failed to generate ${season}:`, err);
          }
        }
      }
      
      await fetchPrdData();
      
      if (successCount > 0) {
        toast.success(`Generated ${successCount} PRD layer${successCount > 1 ? 's' : ''}!`);
      } else {
        toast.info('Visit more tiles to unlock PRD generation');
      }
    } finally {
      setGeneratingLayer(null);
      setIsGeneratingAll(false);
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

  // Calculate overall progress
  const progressStats = useMemo(() => {
    let totalFields = 0;
    let filledFields = 0;
    const layerProgress: { season: Season; filled: number; total: number; percentage: number }[] = [];

    SEASON_ORDER.forEach(season => {
      const layerName = SEASON_PRD_LAYER[season];
      const fields = PRD_LAYER_FIELDS[layerName] || [];
      const filled = fields.filter(f => prdData?.[f] && String(prdData[f]).trim().length > 0).length;
      
      totalFields += fields.length;
      filledFields += filled;
      
      layerProgress.push({
        season,
        filled,
        total: fields.length,
        percentage: fields.length > 0 ? Math.round((filled / fields.length) * 100) : 0
      });
    });

    const overallPercentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    const completedLayerCount = layerProgress.filter(l => l.percentage === 100).length;

    return { totalFields, filledFields, overallPercentage, layerProgress, completedLayerCount };
  }, [prdData]);

  // Copy preview as markdown
  const handleCopyPreview = () => {
    if (!prdData) return;

    let markdown = `# ${prdData.title || 'Untitled'} - ${documentName}\n\n`;
    markdown += `**Progress:** ${progressStats.filledFields}/${progressStats.totalFields} fields (${progressStats.overallPercentage}%)\n\n`;
    markdown += `---\n\n`;

    SEASON_ORDER.forEach(season => {
      const layerName = SEASON_PRD_LAYER[season];
      const fields = PRD_LAYER_FIELDS[layerName] || [];
      const layerStat = progressStats.layerProgress.find(l => l.season === season);
      
      markdown += `## ${SEASON_LABELS[season]} (${layerName}) - ${layerStat?.percentage || 0}%\n\n`;
      
      fields.forEach(field => {
        const value = prdData[field];
        const label = FIELD_LABELS[field] || field.replace(/_/g, ' ');
        markdown += `### ${label}\n`;
        markdown += value ? `${value}\n\n` : `*Not generated yet*\n\n`;
      });
    });

    navigator.clipboard.writeText(markdown);
    toast.success('PRD copied to clipboard');
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
              <h2 className="text-lg font-semibold">Living {documentName} Assembly</h2>
              <p className="text-xs text-muted-foreground">
                The {documentName} is an organism, not a document
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={handleGenerateAllLayers}
              disabled={isGeneratingAll || progressStats.overallPercentage === 100}
            >
              {isGeneratingAll ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 mr-1" />
              )}
              {isGeneratingAll ? 'Generating...' : 'Generate PRD'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFullPreview(true)}
              disabled={!prdData}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Preview
            </Button>
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
          {/* Educational Panel */}
          <PrdEducationPanel />

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'layers' | 'dimensions' | 'csuite' | 'compilation')}>
              <TabsList className="w-full justify-start mb-4 flex-wrap">
                <TabsTrigger value="layers" className="text-xs">
                  <Layers className="h-3.5 w-3.5 mr-1" />
                  5 Layers
                </TabsTrigger>
                <TabsTrigger value="dimensions" className="text-xs">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Dimensions
                </TabsTrigger>
                <TabsTrigger value="csuite" className="text-xs relative">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  C-Suite
                  {!canAccessCSuite && <Lock className="h-3 w-3 ml-1 text-amber-500" />}
                </TabsTrigger>
                <TabsTrigger value="compilation" className="text-xs relative">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Compilation
                  {!canAccessCompilation && <Lock className="h-3 w-3 ml-1 text-amber-500" />}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="layers" className="space-y-3">
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
              </TabsContent>

              <TabsContent value="dimensions">
                <PrdDimensionalView
                  seasonProgress={seasonProgress as Record<string, Set<string>>}
                  completedSeasons={completedSeasons}
                  prdData={prdData}
                />
              </TabsContent>

              <TabsContent value="csuite">
                <FeatureGate feature="csuite_dashboard">
                  <CSuiteDashboard
                    seasonProgress={Object.fromEntries(
                      Object.entries(seasonProgress).map(([k, v]) => [k, new Set([...v].map(Number))])
                    ) as Record<string, Set<number>>}
                    prdData={prdData}
                    currentSeason={currentSeason}
                  />
                </FeatureGate>
              </TabsContent>

              <TabsContent value="compilation">
                <FeatureGate feature="compilation_tab">
                  <CompilationTab
                    projectName={prdData?.title || 'Untitled Project'}
                    stackImplications={{
                      stack_implications_pollens: prdData?.stack_implications_pollens || '',
                      stack_implications_noems: prdData?.stack_implications_noems || '',
                      stack_implications_poems: prdData?.stack_implications_poems || '',
                      stack_implications_totems: prdData?.stack_implications_totems || '',
                      stack_implications_anthems: prdData?.stack_implications_anthems || '',
                    }}
                    promptHooks={{
                      prompt_hooks_pollens: prdData?.prompt_hooks_pollens || '',
                      prompt_hooks_noems: prdData?.prompt_hooks_noems || '',
                      prompt_hooks_poems: prdData?.prompt_hooks_poems || '',
                      prompt_hooks_totems: prdData?.prompt_hooks_totems || '',
                      prompt_hooks_anthems: prdData?.prompt_hooks_anthems || '',
                    }}
                    completedLayers={completedSeasons}
                    onNavigateToLayer={(season) => {
                      setActiveTab('layers');
                      setExpandedLayers(prev => new Set([...prev, season]));
                    }}
                  />
                </FeatureGate>
              </TabsContent>
            </Tabs>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border shrink-0 bg-muted/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSeasons.length}/5 layers complete
            </span>
            <div className="flex items-center gap-2">
              {completedSeasons.length >= 5 && prdData && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadMarkdown(prdData as any)}
                    className="text-xs"
                  >
                    <FileDown className="h-3.5 w-3.5 mr-1" />
                    Markdown
                  </Button>
                  {canExportPdf ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportPrdAsPdf(prdData as any)}
                      className="text-xs"
                    >
                      <Printer className="h-3.5 w-3.5 mr-1" />
                      PDF
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs opacity-60"
                      disabled
                    >
                      <Lock className="h-3.5 w-3.5 mr-1" />
                      PDF
                      <PremiumBadge feature="pdf_export" className="ml-1" />
                    </Button>
                  )}
                </>
              )}
              {completedSeasons.length >= 5 && (
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  Ready
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Preview Sheet */}
      <Sheet open={showFullPreview} onOpenChange={setShowFullPreview}>
        <SheetContent side="right" className="w-full max-w-2xl sm:max-w-xl flex flex-col p-0">
          <SheetHeader className="p-4 border-b border-border shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {prdData?.title || 'Untitled'} - Full {documentName}
            </SheetTitle>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {progressStats.filledFields} of {progressStats.totalFields} fields • {progressStats.completedLayerCount} of 5 layers
                </span>
                <Badge 
                  variant="outline" 
                  className={
                    progressStats.overallPercentage >= 100 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                      : progressStats.overallPercentage >= 50 
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }
                >
                  {progressStats.overallPercentage}%
                </Badge>
              </div>
              <Progress 
                value={progressStats.overallPercentage} 
                className={`h-2 ${
                  progressStats.overallPercentage >= 100 
                    ? '[&>div]:bg-emerald-500' 
                    : progressStats.overallPercentage >= 50 
                      ? '[&>div]:bg-blue-500'
                      : '[&>div]:bg-amber-500'
                }`}
              />
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {SEASON_ORDER.map(season => {
                const layerName = SEASON_PRD_LAYER[season];
                const fields = PRD_LAYER_FIELDS[layerName] || [];
                const layerStat = progressStats.layerProgress.find(l => l.season === season);
                
                return (
                  <div key={season} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${SEASON_COLORS[season]}`}>
                          {SEASON_ICONS[season]}
                        </div>
                        <h3 className="font-semibold">{SEASON_LABELS[season]}</h3>
                        <Badge variant="outline" className="text-xs font-normal">
                          {layerName}
                        </Badge>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          layerStat?.percentage === 100 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                            : layerStat?.percentage && layerStat.percentage > 0
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                              : 'bg-muted text-muted-foreground'
                        }
                      >
                        {layerStat?.percentage || 0}%
                      </Badge>
                    </div>

                    <div className="space-y-2 pl-8">
                      {fields.map(field => {
                        const value = prdData?.[field];
                        const label = FIELD_LABELS[field] || field.replace(/_/g, ' ');
                        const hasValue = value && String(value).trim().length > 0;
                        
                        return (
                          <div key={field} className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              {hasValue ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                              )}
                              <p className="text-sm font-medium">{label}</p>
                            </div>
                            {hasValue ? (
                              <p className="text-sm text-muted-foreground pl-5 whitespace-pre-wrap">
                                {String(value)}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground/50 italic pl-5">
                                Not generated yet
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <SheetFooter className="p-4 border-t border-border shrink-0 bg-muted/30">
            <Button variant="outline" onClick={handleCopyPreview} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy as Markdown
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PrdAssemblyPanel;
