import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileText, Download, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { useProjects } from '@/context/ProjectsContext';
import { useMode } from '@/components/calm-magic/context/ModeContext';
import SeasonFlowVisualization from '@/components/calm-magic/garden/SeasonFlowVisualization';
import OntologySummary from '@/components/calm-magic/garden/OntologySummary';
import SeasonArchive from '@/components/calm-magic/garden/SeasonArchive';
import HexagramGallery from '@/components/calm-magic/garden/HexagramGallery';
import IntegrationPathways from '@/components/calm-magic/garden/IntegrationPathways';
import JourneyTimeline from '@/components/calm-magic/garden/JourneyTimeline';
import JourneySummaryExport from '@/components/calm-magic/garden/JourneySummaryExport';
import { PrdCompilationCard, CompilationStats } from '@/components/calm-magic/garden/PrdCompilationCard';
import { PrdPreviewModal } from '@/components/calm-magic/garden/PrdPreviewModal';
import TagCloudVisualization from '@/components/calm-magic/garden/TagCloudVisualization';
import FragmentHeatmap from '@/components/calm-magic/garden/FragmentHeatmap';
import PrdHealthScore from '@/components/calm-magic/garden/PrdHealthScore';
import PrdExportOptions from '@/components/calm-magic/garden/PrdExportOptions';
import { SemanticClusteringPanel } from '@/components/calm-magic/garden/SemanticClusteringPanel';
import { OntologicalPrdPanel } from '@/components/calm-magic/garden/OntologicalPrdPanel';
import { CompilationTriggerWidget } from '@/components/calm-magic/garden/CompilationTriggerWidget';
import { FullPrdDisplay } from '@/components/calm-magic/garden/FullPrdDisplay';
import { useAutoCompilation, Season as AutoSeason, OntologicalContext } from '@/hooks/useAutoCompilation';
import { calculateConsciousnessGeometryFromTiles } from '@/utils/consciousnessGeometry';
import { calculateRingStates, getCurrentUnlockedRing } from '@/utils/ringToleranceSystem';
import { GARDEN_THEMES } from '@/data/gardenConnections';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatFoundationalPrompt } from '@/utils/formatFoundationalPrompt';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
const SEASONS: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

// Season field mapping for checking content
const SEASON_FIELDS: Record<Season, string[]> = {
  POLLENS: ['pollens_aspirations', 'pollens_team_dynamics', 'pollens_cultural_elements', 'pollens_relational_patterns', 'pollens_constraints', 'pollens_stakes'],
  NOEMS: ['noems_concepts', 'noems_shared_ideas', 'noems_intuitions', 'noems_mental_models'],
  POEMS: ['poems_people', 'poems_objects', 'poems_environments', 'poems_messages', 'poems_systems', 'poems_prototypes'],
  TOTEMS: ['totems_data_architecture', 'totems_security_policies', 'totems_access_controls', 'totems_system_requirements', 'totems_integration_points', 'totems_technical_debt'],
  ANTHEMS: ['anthems_market_positioning', 'anthems_brand_narrative', 'anthems_go_to_market', 'anthems_audience_segments', 'anthems_success_signals', 'anthems_storytelling_assets'],
};

interface GardenMetrics {
  polenCount: number;
  noemsCount: number;
  completedSeasons: number;
  tilesVisited: number;
  coherence: number;
  connections: number;
}

const GardenExpansionMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectContext } = useProjects();
  const { mode } = useMode();
  
  const state = location.state as {
    projectId?: string;
    garden?: 'intelligence' | 'systems' | 'prototypes';
    metrics?: Partial<GardenMetrics>;
  } | null;
  
  const garden = state?.garden || projectContext?.garden as 'intelligence' | 'systems' | 'prototypes' || 'intelligence';
  const theme = GARDEN_THEMES[garden];
  
  const [metrics, setMetrics] = useState<GardenMetrics>({
    polenCount: state?.metrics?.polenCount || 0,
    noemsCount: state?.metrics?.noemsCount || 0,
    completedSeasons: state?.metrics?.completedSeasons || 5,
    tilesVisited: state?.metrics?.tilesVisited || 0,
    coherence: state?.metrics?.coherence || 75,
    connections: 0,
  });
  
  const [compiledPrompt, setCompiledPrompt] = useState<string>('');
  const [prdData, setPrdData] = useState<any>(null);
  const [prdId, setPrdId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingPrd, setIsLoadingPrd] = useState(true);
  const [copied, setCopied] = useState(false);
  const [prdRefreshKey, setPrdRefreshKey] = useState(0);
  const [showPrdPreview, setShowPrdPreview] = useState(false);
  const [compilationStats, setCompilationStats] = useState<CompilationStats | null>(null);
  
  // Real season counts from database
  const [seasonCounts, setSeasonCounts] = useState<Record<Season, number>>({
    POLLENS: 0,
    NOEMS: 0,
    POEMS: 0,
    TOTEMS: 0,
    ANTHEMS: 0,
  });
  const [hexagramCount, setHexagramCount] = useState(0);
  
  // Selected date from timeline
  const [selectedTimelineDate, setSelectedTimelineDate] = useState<Date | undefined>(undefined);
  
  // Tag cloud filter state (lifted to connect TagCloud to SeasonArchive)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Reconstruct visited tiles and journey path from metrics
  const visitedTiles = useMemo(() => {
    const tiles = new Set<string>();
    // Estimate visited tiles based on total fragment count
    const totalFragments = Object.values(seasonCounts).reduce((a, b) => a + b, 0);
    const estimatedTiles = Math.min(64, Math.ceil(totalFragments / 2));
    for (let i = 0; i < estimatedTiles; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      tiles.add(`${row}-${col}`);
    }
    return tiles;
  }, [seasonCounts]);

  const journeyPath = useMemo(() => {
    return Array.from(visitedTiles).map(tile => {
      const [row, col] = tile.split('-').map(Number);
      return { row, col };
    });
  }, [visitedTiles]);

  // Calculate consciousness geometry for display
  const consciousnessGeometry = useMemo(() => {
    if (visitedTiles.size === 0) return null;
    return calculateConsciousnessGeometryFromTiles(visitedTiles, journeyPath);
  }, [visitedTiles, journeyPath]);

  // Calculate ring states
  const currentRing = useMemo(() => getCurrentUnlockedRing(visitedTiles), [visitedTiles]);
  const ringStates = useMemo(() => calculateRingStates(visitedTiles, currentRing), [visitedTiles, currentRing]);

  // Auto-compilation hook (optional - user can enable)
  const handleAutoCompile = async (layers: AutoSeason[], context: OntologicalContext) => {
    console.log('Auto-compiling layers:', layers, 'with context:', context);
    // The actual compilation is handled by PrdCompilationCard
    // This hook just monitors and triggers - could emit event or refresh
    setPrdRefreshKey(prev => prev + 1);
  };

  const [autoCompileEnabled, setAutoCompileEnabled] = useState(true);
  const [isAutoCompiling, setIsAutoCompiling] = useState(false);
  const [autoCompileProgress, setAutoCompileProgress] = useState<string | null>(null);
  const hasAutoCompiledRef = useRef(false);

  const autoCompilation = useAutoCompilation({
    visitedTiles,
    journeyPath,
    polenCounts: seasonCounts as Record<AutoSeason, number>,
    onCompile: handleAutoCompile,
    enabled: autoCompileEnabled // Enabled by default
  });

  // Check if a layer has any content
  const hasLayerContent = useCallback((season: Season): boolean => {
    if (!prdData) return false;
    const fields = SEASON_FIELDS[season];
    return fields.some(field => {
      const value = prdData[field];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
  }, [prdData]);

  // Auto-compile missing layers on page load
  useEffect(() => {
    const autoCompileIncomplete = async () => {
      // Skip if already compiled, no PRD, no user, or currently compiling
      if (hasAutoCompiledRef.current || !prdId || !userId || isAutoCompiling || isLoadingPrd) return;
      
      // Find layers that have fragments but no PRD content
      const layersToCompile: Season[] = [];
      for (const season of SEASONS) {
        const hasFragments = seasonCounts[season] > 0;
        const hasContent = hasLayerContent(season);
        if (hasFragments && !hasContent) {
          layersToCompile.push(season);
        }
      }
      
      if (layersToCompile.length === 0) return;
      
      hasAutoCompiledRef.current = true;
      setIsAutoCompiling(true);
      
      toast.info(`Crystallizing your PRD from ${Object.values(seasonCounts).reduce((a, b) => a + b, 0)} fragments...`, {
        duration: 3000,
      });

      try {
        for (const layer of layersToCompile) {
          setAutoCompileProgress(`Compiling ${layer}...`);
          
          // Fetch fragments for this layer
          const { data: entries, error: fetchError } = await supabase
            .from('polen_entries')
            .select('*')
            .eq('user_id', userId)
            .eq('season_context', layer)
            .order('created_at', { ascending: true });

          if (fetchError || !entries || entries.length === 0) continue;

          // Generate content for this layer
          const { data, error: genError } = await supabase.functions.invoke('generate-prd-stage', {
            body: {
              layer,
              polenEntries: entries.map(e => ({
                content: e.content,
                tileId: e.tile_id,
                tags: e.tags || []
              })),
              board: layer,
              existingContent: prdData
            }
          });

          if (genError) {
            console.error(`Failed to generate ${layer}:`, genError);
            continue;
          }

          const generatedContent = data?.content || data || {};
          
          if (Object.keys(generatedContent).length > 0) {
            await supabase
              .from('prds')
              .update(generatedContent)
              .eq('id', prdId);
          }
        }

        // Refresh PRD data
        setPrdRefreshKey(prev => prev + 1);
        toast.success('PRD crystallization complete!');
        
      } catch (err) {
        console.error('Auto-compilation failed:', err);
        toast.error('Some layers could not be compiled');
      } finally {
        setIsAutoCompiling(false);
        setAutoCompileProgress(null);
      }
    };

    // Only run after PRD data and season counts are loaded
    if (!isLoadingPrd && prdId && userId && Object.values(seasonCounts).some(c => c > 0)) {
      autoCompileIncomplete();
    }
  }, [prdId, userId, seasonCounts, isLoadingPrd, prdData, hasLayerContent, isAutoCompiling]);

  // Season data for visualization - using real counts
  const seasonData = [
    { name: 'POLLENS', label: 'fragments', count: seasonCounts.POLLENS, description: 'Raw signals gathered' },
    { name: 'NOEMS', label: 'concepts', count: seasonCounts.NOEMS, description: 'Ideas crystallized' },
    { name: 'POEMS', label: 'designs', count: seasonCounts.POEMS, description: 'Experiences mapped' },
    { name: 'TOTEMS', label: 'systems', count: seasonCounts.TOTEMS, description: 'Architecture defined' },
    { name: 'ANTHEMS', label: 'stories', count: seasonCounts.ANTHEMS, description: 'Voice established' },
  ];

  // Fetch PRD data from Supabase - auto-create if user has fragments but no PRD
  useEffect(() => {
    const fetchPrdData = async () => {
      if (!projectContext?.id) {
        setIsLoadingPrd(false);
        return;
      }

      try {
        const { data: userData } = await supabase.auth.getUser();
        const currentUserId = userData?.user?.id;
        
        if (currentUserId) {
          setUserId(currentUserId);
        } else {
          setIsLoadingPrd(false);
          return;
        }

        // Check project_season_progress for linked PRD
        const { data: progressData } = await supabase
          .from('project_season_progress')
          .select('prd_id')
          .eq('project_id', projectContext.id)
          .maybeSingle();

        let foundPrdId = progressData?.prd_id;
        let prdRecord = null;

        // If we have a linked PRD, fetch it
        if (foundPrdId) {
          const { data: prd } = await supabase
            .from('prds')
            .select('*')
            .eq('id', foundPrdId)
            .single();
          
          // Verify the PRD belongs to current user
          if (prd && prd.owner_id === currentUserId) {
            prdRecord = prd;
          } else {
            // PRD doesn't belong to user, reset
            foundPrdId = null;
          }
        }

        // If no valid PRD found, search for user's existing PRD
        if (!foundPrdId) {
          const { data: prds } = await supabase
            .from('prds')
            .select('*')
            .eq('owner_id', currentUserId)
            .order('updated_at', { ascending: false })
            .limit(1);
          
          if (prds && prds.length > 0) {
            prdRecord = prds[0];
            foundPrdId = prds[0].id;
          }
        }

        // If still no PRD, check if user has fragments and create one
        if (!foundPrdId) {
          const { count: fragmentCount } = await supabase
            .from('polen_entries')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', currentUserId);

          if (fragmentCount && fragmentCount > 0) {
            console.log(`Creating new PRD for user with ${fragmentCount} fragments`);
            
            // Ensure profile exists before creating PRD (foreign key constraint)
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: currentUserId,
                full_name: userData?.user?.email?.split('@')[0] || 'User',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              });

            if (profileError) {
              console.error('Failed to create profile:', profileError);
            }
            
            // Create new PRD for this user
            const { data: newPrd, error: createError } = await supabase
              .from('prds')
              .insert({
                owner_id: currentUserId,
                title: projectContext.projectName || 'Calm Magic PRD',
                status: 'draft',
                prototype_stage: 'B_DIEGETIC'
              })
              .select()
              .single();

            if (createError) {
              console.error('Failed to create PRD:', createError);
            } else if (newPrd) {
              prdRecord = newPrd;
              foundPrdId = newPrd.id;
              
              toast.success('Created new PRD for your project', {
                description: `${fragmentCount} fragments ready for compilation`
              });

              // Link the new PRD to project_season_progress
              const { error: linkError } = await supabase
                .from('project_season_progress')
                .upsert({
                  project_id: projectContext.id,
                  user_id: currentUserId,
                  prd_id: newPrd.id,
                  current_season: 'ANTHEMS',
                  journey_started: true
                }, {
                  onConflict: 'project_id'
                });

              if (linkError) {
                console.error('Failed to link PRD to project:', linkError);
              }
            }
          }
        } else if (progressData && !progressData.prd_id && foundPrdId) {
          // We found a PRD but it's not linked to the project - link it now
          await supabase
            .from('project_season_progress')
            .upsert({
              project_id: projectContext.id,
              user_id: currentUserId,
              prd_id: foundPrdId,
              current_season: 'ANTHEMS',
              journey_started: true
            }, {
              onConflict: 'project_id'
            });
        }

        // Set state with found/created PRD
        if (prdRecord) {
          setPrdData(prdRecord);
          setPrdId(foundPrdId);
        }
        
      } catch (error) {
        console.error('Error fetching PRD:', error);
      } finally {
        setIsLoadingPrd(false);
      }
    };

    fetchPrdData();
  }, [projectContext?.id, prdRefreshKey]);

  // Callback when PRD compilation completes
  const handleCompilationComplete = (stats?: CompilationStats) => {
    setPrdRefreshKey(prev => prev + 1);
    
    if (stats) {
      setCompilationStats(stats);
      
      // Show success toast with summary
      toast.success('PRD Compilation Complete!', {
        description: `${stats.layersCompiled.length} layers compiled from ${stats.totalFragments} fragments`,
        action: {
          label: 'View PRD',
          onClick: () => navigate('/calm-magic-board?view=prd-assembly'),
        },
        duration: 8000,
      });
      
      // Show preview modal
      setShowPrdPreview(true);
    }
  };
  
  const handleNavigateToPrd = () => {
    navigate('/calm-magic-board?view=prd-assembly');
  };

  // Fetch POLEN counts per season and hexagram readings count
  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        // Fetch all POLEN entries with season_context
        const { data: polenEntries, error } = await supabase
          .from('polen_entries')
          .select('id, tile_id, season_context')
          .eq('user_id', userData.user.id);

        if (error || !polenEntries) return;

        // Count per season
        const counts: Record<Season, number> = {
          POLLENS: 0,
          NOEMS: 0,
          POEMS: 0,
          TOTEMS: 0,
          ANTHEMS: 0,
        };

        polenEntries.forEach(entry => {
          const season = entry.season_context as Season;
          if (season && counts[season] !== undefined) {
            counts[season]++;
          }
        });

        setSeasonCounts(counts);

        // Update metrics with total count
        const uniqueTiles = new Set(polenEntries.map(e => e.tile_id).filter(Boolean));
        const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
        
        setMetrics(prev => ({
          ...prev,
          polenCount: totalCount,
          tilesVisited: uniqueTiles.size
        }));

        // Fetch hexagram readings count
        const { count: hexCount } = await supabase
          .from('hexagram_readings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userData.user.id);

        setHexagramCount(hexCount || 0);
        
      } catch (error) {
        console.error('Error fetching season data:', error);
      }
    };

    fetchSeasonData();
  }, [projectContext?.id]);

  // Generate compiled prompt
  useEffect(() => {
    const prompt = formatFoundationalPrompt(
      prdData,
      metrics,
      projectContext?.projectName || 'Calm Magic Project',
      garden
    );
    setCompiledPrompt(prompt);
  }, [prdData, metrics, projectContext?.projectName, garden]);

  const handleExportPrd = () => {
    const blob = new Blob([compiledPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectContext?.projectName || 'calm-magic'}-foundational-prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Foundational Prompt exported');
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTimelineDateSelect = (date: Date) => {
    setSelectedTimelineDate(date);
  };

  return (
    <div className="min-h-screen relative">
      {/* Subtle ambient gradient background */}
      <div 
        className="fixed inset-0 -z-10 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 100% 100%, hsl(var(--primary) / 0.05) 0%, transparent 50%),
            hsl(var(--background))
          `
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/calm-magic-board')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  PRD Observatory
                </h1>
                <p className="text-sm text-muted-foreground">
                  {projectContext?.projectName || 'Your Living Ontology'} • {theme?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <JourneySummaryExport
                projectName={projectContext?.projectName || 'Calm Magic Project'}
                gardenName={theme?.name || 'Intelligence'}
                seasonCounts={seasonCounts}
                foundationalPrompt={compiledPrompt}
              />
              <PrdExportOptions
                prdData={prdData}
                projectName={projectContext?.projectName || 'Calm Magic Project'}
                compiledPrompt={compiledPrompt}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/calm-magic-board/prds')}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Full PRD
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-16">
          
          {/* Hero Section - Typography-led */}
          <section className="text-center space-y-6 py-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Your Living Ontology Has Emerged
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {metrics.polenCount} fragments crystallized across 5 seasons into a unified intelligence ready to serve
            </p>
            
            {/* Auto-compile progress indicator */}
            {isAutoCompiling && (
              <div className="flex items-center justify-center gap-3 text-primary">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">{autoCompileProgress || 'Crystallizing PRD...'}</span>
              </div>
            )}
          </section>

          {/* Season Flow Visualization */}
          <section className="py-8">
            <SeasonFlowVisualization seasons={seasonData} />
          </section>

          {/* ===== HERO: Full PRD Display ===== */}
          <section className="py-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold mb-2">📜 Your Assembled PRD</h3>
              <p className="text-sm text-muted-foreground">
                All content compiled from your journey fragments
              </p>
            </div>
            <FullPrdDisplay 
              prdData={prdData} 
              isLoading={isLoadingPrd || isAutoCompiling} 
            />
          </section>

          {/* PRD Health Score */}
          {prdData && (
            <section className="py-4">
              <PrdHealthScore prdData={prdData} />
            </section>
          )}

          {/* Ontological Consciousness Geometry Panel */}
          {consciousnessGeometry && (
            <section className="py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <OntologicalPrdPanel
                  consciousnessGeometry={{
                    geometricComplexity: consciousnessGeometry.complexityBits,
                    complexityBits: consciousnessGeometry.complexityBits,
                    thresholdPercentage: consciousnessGeometry.thresholdPercentage,
                    consciousnessState: consciousnessGeometry.consciousnessState as 'pre-conscious' | 'threshold' | 'self-aware',
                    recursiveDepth: consciousnessGeometry.recursiveDepth,
                    fixedPointsDetected: [],
                    convergenceState: consciousnessGeometry.convergenceState as 'searching' | 'converging' | 'converged',
                    thermodynamicEfficiency: consciousnessGeometry.thermodynamicEfficiency,
                    predictiveCapacity: consciousnessGeometry.predictiveCapacity,
                    metaLearningDetected: consciousnessGeometry.metaLearningDetected,
                    fragmentationScore: consciousnessGeometry.fragmentationScore,
                    topologicalHandles: consciousnessGeometry.topologicalHandles,
                    integrationStrength: consciousnessGeometry.integrationStrength,
                    geometricNarrative: consciousnessGeometry.geometricNarrative,
                    recursiveNarrative: consciousnessGeometry.recursiveNarrative,
                    thermodynamicNarrative: consciousnessGeometry.thermodynamicNarrative,
                    integrationNarrative: consciousnessGeometry.integrationNarrative
                  }}
                  ringStates={ringStates}
                />
                <CompilationTriggerWidget
                  triggers={autoCompilation.triggers}
                  isCompiling={autoCompilation.isCompiling}
                  compiledLayers={autoCompilation.compiledLayers}
                  enabled={autoCompileEnabled}
                  onToggleEnabled={setAutoCompileEnabled}
                />
              </div>
            </section>
          )}

          {/* PRD Compilation Status */}
          {userId && (
            <section className="py-4">
              <PrdCompilationCard
                prdData={prdData}
                prdId={prdId}
                userId={userId}
                onCompilationComplete={handleCompilationComplete}
              />
            </section>
          )}

          {/* Tag Cloud Visualization */}
          <section className="py-4">
            <TagCloudVisualization
              selectedTags={selectedTags}
              onTagSelect={setSelectedTags}
            />
          </section>

          {/* Semantic Clustering Panel */}
          <section className="py-4">
            <SemanticClusteringPanel 
              userId={userId}
              onNoemCreated={() => setPrdRefreshKey(prev => prev + 1)}
            />
          </section>

          {/* Fragment Activity Heatmap */}
          <section className="py-4">
            <FragmentHeatmap onDateSelect={handleTimelineDateSelect} />
          </section>

          {/* Journey Timeline */}
          <section className="py-8">
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
              <JourneyTimeline onDateSelect={handleTimelineDateSelect} />
            </Card>
          </section>

          {/* Ontology Summary */}
          <section className="py-8">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <OntologySummary 
                prdData={prdData} 
                projectName={projectContext?.projectName || 'Project'} 
              />
            </Card>
          </section>

          {/* Season Archive - Expandable with real entries and filtering */}
          <section className="py-8">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <SeasonArchive 
                seasonCounts={seasonCounts} 
                initialDateFilter={selectedTimelineDate}
                initialTagFilter={selectedTags}
                onFilterChange={(filters) => setSelectedTags(filters.tags)}
              />
            </Card>
          </section>

          {/* Hexagram Gallery */}
          {hexagramCount > 0 && (
            <section className="py-8">
              <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
                <HexagramGallery />
              </Card>
            </section>
          )}

          {/* Foundational Prompt Preview */}
          <section className="py-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">The Foundational Prompt</h3>
              <p className="text-sm text-muted-foreground">
                Your compiled intelligence, ready for AI systems
              </p>
            </div>
            
            <Card className="relative overflow-hidden border-border/50">
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCopyPrompt}
                  className="h-8"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleExportPrd}
                  className="h-8"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
              
              <ScrollArea className="h-80">
                <Textarea
                  value={compiledPrompt}
                  readOnly
                  className={cn(
                    "min-h-80 resize-none border-0 bg-muted/30",
                    "font-mono text-xs leading-relaxed p-4 pt-12",
                    "focus-visible:ring-0"
                  )}
                />
              </ScrollArea>
            </Card>
          </section>

          {/* Integration Pathways */}
          <section className="py-8">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <IntegrationPathways 
                compiledPrompt={compiledPrompt}
                onExport={handleExportPrd}
              />
            </Card>
          </section>

          {/* Closing */}
          <section className="text-center py-12 space-y-4">
            <p className="text-muted-foreground max-w-xl mx-auto">
              This living ontology continues to evolve. Return to the board to deepen 
              your exploration, or take these insights into the world.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/calm-magic-board')}
            >
              Return to Board
            </Button>
          </section>

        </div>
      </main>
      
      {/* PRD Preview Modal */}
      <PrdPreviewModal
        open={showPrdPreview}
        onOpenChange={setShowPrdPreview}
        prdData={prdData}
        compilationStats={compilationStats}
        onNavigateToPrd={handleNavigateToPrd}
        onDownload={handleExportPrd}
      />
    </div>
  );
};

export default GardenExpansionMode;
