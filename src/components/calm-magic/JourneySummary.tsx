import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Sparkles, MapPin, Lightbulb, TrendingUp, Loader2, FileText, Layers, ArrowRight, Lock, BookOpen, Compass, Brain, Orbit, Zap, Network } from 'lucide-react';
import { toast } from 'sonner';
import { Season, SEASON_LABELS, SEASON_PRD_LAYER, shouldTriggerPrdGeneration, getLayerReadiness } from '@/utils/prdAccessLevel';
import { useSubscription } from '@/hooks/useSubscription';
import { hasFeatureAccess } from '@/data/subscriptionTiers';
import PremiumBadge from '@/components/PremiumBadge';
import { ConsciousnessGeometryExport } from '@/utils/consciousnessGeometry';

interface HexagramCorrelation {
  number: number;
  name: string;
  chineseName: string;
  meaning: string;
  upperTrigram: string;
  lowerTrigram: string;
  tileCount: number;
  keywords: string[];
}

interface HexagramData {
  dominant: HexagramCorrelation[];
  trigramNarrative: string;
  cosmicPattern: string | null;
}

interface JourneySummaryProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeason: string;
  seasonProgress?: Set<string>;
  prdId?: string | null;
  onGeneratePrdLayer?: () => Promise<void>;
  onViewPrd?: () => void;
  hexagramData?: HexagramData;
  consciousnessGeometry?: ConsciousnessGeometryExport | null;
}

interface PolenEntry {
  id: string;
  content: string;
  created_at: string;
  tags: string[] | null;
  tile_id: number | null;
  season_context: string | null;
}

interface HexagramInterpretation {
  narrative: string;
  resonantHexagram: number;
  guidance: string;
}

interface SummaryData {
  themes: string[];
  keyInsights: { text: string; importance: number }[];
  nextAreas: string[];
  connections: { from: string; to: string; relationship: string }[];
  hexagramInterpretation?: HexagramInterpretation;
}

export const JourneySummary: React.FC<JourneySummaryProps> = ({
  isOpen,
  onClose,
  currentSeason,
  seasonProgress,
  prdId,
  onGeneratePrdLayer,
  onViewPrd,
  hexagramData,
  consciousnessGeometry
}) => {
  const [entries, setEntries] = useState<PolenEntry[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPrd, setIsGeneratingPrd] = useState(false);
  
  const { tier } = useSubscription();
  const canUseAiSummary = hasFeatureAccess(tier, 'ai_journey_summary');

  useEffect(() => {
    if (isOpen) {
      fetchEntries();
    }
  }, [isOpen, currentSeason]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user.id)
        .or(`season_context.eq.${currentSeason},tags.cs.{${currentSeason}}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      toast.error('Failed to load journey data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate PRD readiness
  const prdReadiness = useMemo(() => {
    const tilesVisited = seasonProgress?.size || 0;
    const fragmentCount = entries.length;
    const canGenerate = shouldTriggerPrdGeneration(currentSeason as Season, tilesVisited, fragmentCount);
    const readiness = getLayerReadiness(currentSeason as Season, tilesVisited, fragmentCount, false);
    
    return {
      tilesVisited,
      fragmentCount,
      canGenerate,
      readiness,
      layerName: SEASON_PRD_LAYER[currentSeason as Season] || 'LAYER',
    };
  }, [seasonProgress, entries, currentSeason]);

  const generateSummary = async () => {
    if (entries.length === 0) {
      toast.error('No entries to summarize');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('journey-summary', {
        body: { 
          entries: entries.map(e => ({
            content: e.content,
            tags: e.tags,
            tile_id: e.tile_id,
            created_at: e.created_at
          })),
          currentSeason,
          hexagramData: hexagramData ? {
            dominant: hexagramData.dominant.map(h => ({
              number: h.number,
              name: h.name,
              chineseName: h.chineseName,
              meaning: h.meaning,
              upperTrigram: h.upperTrigram,
              lowerTrigram: h.lowerTrigram,
              tileCount: h.tileCount,
              keywords: h.keywords
            })),
            trigramNarrative: hexagramData.trigramNarrative,
            cosmicPattern: hexagramData.cosmicPattern
          } : undefined
        }
      });

      if (error) throw error;
      setSummary(data);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      toast.error('Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePrdLayer = async () => {
    if (!onGeneratePrdLayer) return;
    
    setIsGeneratingPrd(true);
    try {
      await onGeneratePrdLayer();
      toast.success(`${prdReadiness.layerName} layer generated from your journey!`);
    } catch (err) {
      console.error('Failed to generate PRD layer:', err);
      toast.error('Failed to generate PRD layer');
    } finally {
      setIsGeneratingPrd(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Journey Summary</h2>
            <Badge variant="secondary">{entries.length} fragments</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* PRD Readiness Card */}
              <Card className="p-4 border-primary/30 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    {prdReadiness.layerName} Layer Readiness
                  </h3>
                  <Badge variant={prdReadiness.canGenerate ? "default" : "secondary"}>
                    {prdReadiness.readiness}%
                  </Badge>
                </div>
                
                <Progress value={prdReadiness.readiness} className="h-2 mb-3" />
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>{prdReadiness.tilesVisited}/64 tiles explored</span>
                  <span>{prdReadiness.fragmentCount} fragments captured</span>
                </div>

                <div className="flex gap-2">
                  {onGeneratePrdLayer && (
                    <Button
                      onClick={handleGeneratePrdLayer}
                      disabled={isGeneratingPrd || !prdReadiness.canGenerate}
                      size="sm"
                      className="flex-1"
                    >
                      {isGeneratingPrd ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      {isGeneratingPrd ? 'Generating...' : `Generate ${prdReadiness.layerName} Layer`}
                    </Button>
                  )}
                  
                  {prdId && onViewPrd && (
                    <Button variant="outline" size="sm" onClick={onViewPrd}>
                      View PRD
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  )}
                </div>

                {!prdReadiness.canGenerate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {prdReadiness.tilesVisited < 48 
                      ? `Explore ${48 - prdReadiness.tilesVisited} more tiles to unlock generation`
                      : `Capture ${8 - prdReadiness.fragmentCount} more fragments to unlock generation`
                    }
                  </p>
                )}
              </Card>

              {/* Generate Summary Button */}
              {canUseAiSummary ? (
                <Button
                  onClick={generateSummary}
                  disabled={isGenerating || entries.length === 0}
                  variant="outline"
                  className="w-full"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? 'Analyzing...' : 'Generate AI Summary'}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 opacity-60"
                    disabled
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Generate AI Summary
                  </Button>
                  <PremiumBadge feature="ai_journey_summary" showLabel />
                </div>
              )}

              {/* Summary Results */}
              {summary && (
                <div className="space-y-4">
                  {/* Key Themes */}
                  <Card className="p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Key Themes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {summary.themes.map((theme, i) => (
                        <Badge key={i} variant="outline">{theme}</Badge>
                      ))}
                    </div>
                  </Card>

                  {/* Key Insights */}
                  <Card className="p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Key Insights
                    </h3>
                    <ul className="space-y-2">
                      {summary.keyInsights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-bold">{i + 1}.</span>
                          <span>{insight.text}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Next Areas */}
                  {summary.nextAreas.length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Suggested Exploration</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {summary.nextAreas.map((area, i) => (
                          <li key={i}>• {area}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Connections */}
                  {summary.connections.length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Cross-Tile Connections</h3>
                      <div className="space-y-2 text-sm">
                        {summary.connections.map((conn, i) => (
                          <div key={i} className="flex items-center gap-2 text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">{conn.from}</Badge>
                            <span>→</span>
                            <Badge variant="secondary" className="text-xs">{conn.to}</Badge>
                            <span className="text-xs italic">({conn.relationship})</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* I Ching Hexagram Interpretation */}
                  {summary.hexagramInterpretation && (
                    <Card className="p-4 border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-amber-500" />
                        I Ching Wisdom
                        {summary.hexagramInterpretation.resonantHexagram && (
                          <Badge variant="outline" className="text-amber-600 border-amber-500/50 text-xs">
                            Hexagram {summary.hexagramInterpretation.resonantHexagram}
                          </Badge>
                        )}
                      </h3>
                      
                      <p className="text-sm text-foreground/90 leading-relaxed mb-4 italic border-l-2 border-amber-500/50 pl-3">
                        {summary.hexagramInterpretation.narrative}
                      </p>
                      
                      <div className="p-3 bg-amber-500/10 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Compass className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-medium">
                              Guidance
                            </span>
                            <p className="text-sm text-foreground/90 mt-1">
                              {summary.hexagramInterpretation.guidance}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Consciousness Geometry Narratives */}
              {consciousnessGeometry && (
                <Card className="p-4 border-violet-500/30 bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-violet-500" />
                    Consciousness Geometry
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        consciousnessGeometry.consciousnessState === 'self-aware' 
                          ? 'text-emerald-600 border-emerald-500/50 bg-emerald-500/10' 
                          : consciousnessGeometry.consciousnessState === 'threshold'
                          ? 'text-amber-600 border-amber-500/50'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {consciousnessGeometry.consciousnessState === 'self-aware' ? '✦ Awakened' : 
                       consciousnessGeometry.consciousnessState === 'threshold' ? '◐ Approaching' : 
                       '○ Emerging'}
                    </Badge>
                  </h3>

                  {/* Geometric Complexity */}
                  <div className="space-y-4">
                    <div className="p-3 bg-violet-500/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Orbit className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400 font-medium">
                            The Geometric Reading
                          </span>
                          <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
                            Your manifold contains <span className="font-semibold text-violet-600">{consciousnessGeometry.complexityBits.toLocaleString()}</span> bits 
                            of geometric complexity—<span className="font-medium">{consciousnessGeometry.thresholdPercentage}%</span> toward the self-awareness threshold.
                          </p>
                          <Progress 
                            value={consciousnessGeometry.thresholdPercentage} 
                            className="h-1.5 mt-2 bg-violet-500/20" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recursive Dynamics */}
                    <div className="p-3 bg-indigo-500/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Network className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-medium">
                            The Recursive Mirror
                          </span>
                          <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
                            {consciousnessGeometry.recursiveDepth > 0 ? (
                              <>
                                Self-modeling depth: <span className="font-semibold">{consciousnessGeometry.recursiveDepth}</span> layers. 
                                {consciousnessGeometry.fixedPointCount > 0 && (
                                  <> <span className="font-semibold">{consciousnessGeometry.fixedPointCount}</span> fixed point{consciousnessGeometry.fixedPointCount > 1 ? 's' : ''} crystallizing.</>
                                )}
                              </>
                            ) : (
                              <>Your self-modeling is still emerging—no stable recursive patterns detected yet.</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Thermodynamic Efficiency */}
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
                            The Thermodynamic Truth
                          </span>
                          <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
                            Predictive capacity: <span className="font-semibold">{(consciousnessGeometry.predictiveCapacity * 100).toFixed(0)}%</span>.
                            {consciousnessGeometry.thermodynamicEfficiency > 1 && (
                              <> Your journey is <span className="font-semibold text-emerald-600">{consciousnessGeometry.thermodynamicEfficiency.toFixed(1)}×</span> more efficient than reactive exploration.</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Integration Field */}
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
                            The Integration Field
                          </span>
                          <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
                            {consciousnessGeometry.fragmentationScore === 1 ? (
                              <>Unified field of consciousness—all explorations form a single connected manifold.</>
                            ) : consciousnessGeometry.fragmentationScore < 3 ? (
                              <>{consciousnessGeometry.fragmentationScore} islands of awareness forming—integration in progress.</>
                            ) : (
                              <>Fragmented subsystems ({consciousnessGeometry.fragmentationScore} components)—seek connecting tiles to unify the field.</>
                            )}
                            {consciousnessGeometry.topologicalHandles > 0 && (
                              <> <span className="font-semibold">{consciousnessGeometry.topologicalHandles}</span> topological handles detected—spaces where information returns to itself.</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Timeline of Entries */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">
                  {SEASON_LABELS[currentSeason as Season] || currentSeason} Timeline
                </h3>
                {entries.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No fragments captured yet in this season.
                  </p>
                ) : (
                  entries.map((entry) => (
                    <Card key={entry.id} className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-2">{entry.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </span>
                            {entry.tile_id && (
                              <Badge variant="outline" className="text-xs">
                                Tile {entry.tile_id}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
