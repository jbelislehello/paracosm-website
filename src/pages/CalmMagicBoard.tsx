import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tile } from '@/types/glitch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Play, RotateCcw, FileText, MapPin, Link2, Grid3X3, CircleDot, Layers, Sparkles, X, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import MinimalistTileMatrix from '@/components/MinimalistTileMatrix';
import TileDetailPanel from '@/components/TileDetailPanel';
import { FragmentBrowser } from '@/components/calm-magic/FragmentBrowser';
import { useTileMatrixPersistence } from '@/hooks/useTileMatrixPersistence';
import { useSeasonPersistence } from '@/hooks/useSeasonPersistence';
import { useQuadrantDynamics } from '@/hooks/useQuadrantDynamics';
import { useTileEmotionalCheckins } from '@/hooks/useTileEmotionalCheckins';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { useMode } from '@/components/calm-magic/context/ModeContext';
import { useProjects } from '@/context/ProjectsContext';
import { CycleNumber } from '@/types/journal-expansion';
import { FeltState, EmotionalAxes, QuadrantPosition } from '@/types/trajectory';
import SeasonProgressBar from '@/components/prd-generator/SeasonProgressBar';
import SeasonCompletionModal from '@/components/prd-generator/SeasonCompletionModal';
import AssistantChatPanel from '@/components/calm-magic/AssistantChatPanel';
import AssistantChatButton from '@/components/calm-magic/AssistantChatButton';
import { JourneySummary } from '@/components/calm-magic/JourneySummary';
import { InsightConnectionsGraph } from '@/components/calm-magic/InsightConnectionsGraph';
import { QuadrantDynamicsPanel } from '@/components/calm-magic/QuadrantDynamicsPanel';
import { HigherSelfProphecyModal } from '@/components/calm-magic/HigherSelfProphecyModal';
import { PrdAssemblyPanel } from '@/components/calm-magic/PrdAssemblyPanel';
import OnboardingTour from '@/components/calm-magic/OnboardingTour';
import { getPrdAccessLevel, Season as PrdSeason } from '@/utils/prdAccessLevel';
import { parseBoardEntryParams, getAssessmentContextDescription } from '@/utils/parseBoardEntryParams';
import { getGardenByType } from '@/data/gardens';
import ProjectTitleBar from '@/components/calm-magic/ProjectTitleBar';

type CompassType = 'narrative' | 'workflow' | 'inquiry' | 'playground' | 'human-dynamics';
type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
type BoardType = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';

const SEASON_ORDER: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

// Maps seasons to database board types
const SEASON_TO_BOARD: Record<Season, BoardType> = {
  POLLENS: 'LOVE',
  NOEMS: 'MAGIC',
  POEMS: 'CALM',
  TOTEMS: 'OPEN',
  ANTHEMS: 'FREE',
};

const SEASON_TO_PRD_FIELD: Record<Season, string> = {
  POLLENS: 'love',
  NOEMS: 'magic',
  POEMS: 'calm',
  TOTEMS: 'open',
  ANTHEMS: 'free',
};

const SEASON_COLORS: Record<Season, string> = {
  POLLENS: 'from-rose-500 to-pink-500',
  NOEMS: 'from-violet-500 to-purple-500',
  POEMS: 'from-purple-500 to-indigo-500',
  TOTEMS: 'from-blue-500 to-cyan-500',
  ANTHEMS: 'from-emerald-500 to-green-500',
};

const COMPASS_MAP: Record<string, CompassType> = {
  'Narrative': 'narrative',
  'Workflow': 'workflow',
  'Inquiry & Practices': 'inquiry',
  'Playground': 'playground',
  'Human Dynamics & Systems': 'human-dynamics',
};

type ViewTab = 'matrix' | 'window-of-tolerance' | 'prd-assembly';

const CalmMagicBoard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode, setMode } = useMode();
  const { 
    projectContext, 
    setActiveProject, 
    getProjectById,
    updateProject,
    isLoading: projectLoading 
  } = useProjects();
  const hasAppliedUrlParams = useRef(false);
  
  const [user, setUser] = useState<any>(null);
  const [todayTile, setTodayTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const [activeCompass, setActiveCompass] = useState<CompassType | null>(null);
  const [currentCycleNumber, setCurrentCycleNumber] = useState<CycleNumber>(1);
  const [showPolenBrowser, setShowPolenBrowser] = useState(false);
  const [currentZone, setCurrentZone] = useState<'safe' | 'stretch' | 'edge' | 'unexplored'>('safe');
  
  // Assessment context banner
  const [showAssessmentBanner, setShowAssessmentBanner] = useState(false);
  const [assessmentContext, setAssessmentContext] = useState<string | null>(null);
  
  // Sub-navigation state
  const [activeView, setActiveView] = useState<ViewTab>('matrix');

  // New panel states
  const [showJourneySummary, setShowJourneySummary] = useState(false);
  const [showInsightsGraph, setShowInsightsGraph] = useState(false);

  // Persisted season state from localStorage (project-specific)
  const {
    currentSeason,
    seasonProgress,
    completedSeasons,
    prdId,
    journeyStarted,
    journeyPath,
    updateProgress,
    resetProgress,
    isLoading: progressLoading,
  } = useSeasonPersistence(projectContext?.id || null);
  
  // Season completion modal state
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [isGeneratingPrd, setIsGeneratingPrd] = useState(false);
  
  // Assistant chat state
  const [showAssistantChat, setShowAssistantChat] = useState(false);
  const [assistantMode, setAssistantMode] = useState<'glitch' | 'drift' | 'idle'>('idle');

  // Convert journeyPath to Set for matrix visualization (within current season)
  // Fallback to empty Set if season data not yet loaded
  const visitedTiles = seasonProgress[currentSeason] || new Set<string>();

  // Quadrant dynamics hook
  const {
    seasonQualities,
    shadowPosition,
    shadowQuadrant,
    higherSelfPosition,
    higherSelfQuadrant,
    prophecyReflection,
    trajectoryLog,
    setProphecy,
    applyShadowNudge,
    logTrajectoryEvent,
    resetTrajectory,
  } = useQuadrantDynamics(seasonProgress, currentSeason);

  // Emotional check-ins hook
  const {
    checkins: emotionalCheckins,
    addCheckin,
    getAllCheckins,
  } = useTileEmotionalCheckins();

  const {
    isAuthenticated,
    saving,
    savePolenEntry,
  } = useTileMatrixPersistence(todayTile?.board || SEASON_TO_BOARD[currentSeason]);

  // Onboarding tour
  const {
    isOpen: showTour,
    startTour,
    closeTour,
    completeTour,
  } = useOnboardingTour({ projectId: projectContext?.id, autoStart: true });

  // Apply URL parameters on mount (once)
  useEffect(() => {
    if (hasAppliedUrlParams.current || progressLoading || projectLoading) return;
    
    const params = parseBoardEntryParams(searchParams);
    const projectId = searchParams.get('projectId');
    
    // If projectId is provided, set it as active
    if (projectId) {
      const project = getProjectById(projectId);
      if (project) {
        setActiveProject(projectId);
        if (project.mode) {
          setMode(project.mode);
        }
      }
    }
    
    if (params.hasAssessmentContext || projectId) {
      hasAppliedUrlParams.current = true;
      
      // Set mode from URL (fallback if not from project)
      if (params.mode && !projectId) {
        setMode(params.mode);
      }
      
      // Apply initial shadow position
      if (params.shadowPosition) {
        applyShadowNudge(params.shadowPosition, 'flowing', 'Initial position from assessment');
      }
      
      // Set higher self prophecy
      if (params.higherSelfPosition) {
        setProphecy(params.higherSelfPosition, 'Prophesied destination from assessment');
      }
      
      // Set starting season if not already progressed
      if (params.startingSeason && !journeyStarted && visitedTiles.size === 0) {
        updateProgress({ currentSeason: params.startingSeason });
      }
      
      // Set compass
      if (params.compass && COMPASS_MAP[params.compass]) {
        setActiveCompass(COMPASS_MAP[params.compass]);
      }
      
      // Show assessment context banner if there's assessment data
      if (params.hasAssessmentContext) {
        const description = getAssessmentContextDescription(params);
        setAssessmentContext(description);
        setShowAssessmentBanner(true);
      }
      
      // Clear URL params after applying (keeps URL clean)
      setSearchParams({}, { replace: true });
      
      if (projectContext) {
        toast.success(`Project "${projectContext.projectName}" loaded`, {
          duration: 3000,
        });
      }
    }
  }, [searchParams, progressLoading, projectLoading, journeyStarted, visitedTiles.size]);

  useEffect(() => {
    checkAuth();
    loadTodayTile();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
  };

  const getTodayTileId = () => {
    const startDate = new Date('2025-01-01');
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysSince % 260) + 1;
  };

  const loadTodayTile = async () => {
    try {
      const tileId = getTodayTileId();
      const { data, error } = await supabase
        .from('tiles')
        .select('*')
        .eq('id', tileId)
        .single();

      if (error) throw error;
      setTodayTile(data);
    } catch (error) {
      console.error('Error loading today tile:', error);
      toast.error('Failed to load today\'s tile');
    } finally {
      setLoading(false);
    }
  };

  const getBoardColor = (board: string) => {
    switch (board) {
      case 'LOVE': return 'from-rose-500 to-pink-500';
      case 'MAGIC': return 'from-purple-500 to-indigo-500';
      case 'CALM': return 'from-blue-500 to-cyan-500';
      case 'OPEN': return 'from-green-500 to-emerald-500';
      case 'FREE': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSengeDisciplineLabel = (discipline: string) => {
    switch (discipline) {
      case 'PersonalMastery': return 'Personal Mastery';
      case 'MentalModels': return 'Mental Models';
      case 'SharedVision': return 'Shared Vision';
      case 'TeamLearning': return 'Team Learning';
      case 'SystemsThinking': return 'Systems Thinking';
      default: return discipline;
    }
  };

  // Check for season completion
  const checkSeasonCompletion = useCallback((season: Season, tiles: Set<string>) => {
    if (tiles.size >= 64 && !completedSeasons.includes(season)) {
      setShowSeasonModal(true);
    }
  }, [completedSeasons]);

  // Starting point enforcement handler
  const handleStartJourney = () => {
    updateProgress({
      journeyStarted: true,
      journeyPath: [{ row: 0, col: 0 }],
      seasonProgress: {
        ...seasonProgress,
        [currentSeason]: new Set(seasonProgress[currentSeason]).add('0-0')
      }
    });
    setSelectedTile({ row: 0, col: 0 }); // Mindsets × Chances
    logTrajectoryEvent('season_start', 1, `Started ${currentSeason} season`);
    toast.success(`${currentSeason} season started at Mindsets × Chances`);
  };

  // Reset journey (current season only)
  const handleResetJourney = () => {
    updateProgress({
      journeyStarted: false,
      journeyPath: [],
      seasonProgress: {
        ...seasonProgress,
        [currentSeason]: new Set()
      }
    });
    setSelectedTile(null);
    setActiveCompass(null);
    toast.info(`${currentSeason} season reset`);
  };

  // Reset entire cycle (all seasons)
  const handleResetCycle = () => {
    resetProgress();
    setSelectedTile(null);
    setActiveCompass(null);
    toast.info('Full cycle reset');
  };

  // Navigate handler with journey and season tracking
  const handleNavigate = (row: number, col: number) => {
    setSelectedTile({ row, col });
    const tileKey = `${row}-${col}`;
    
    // Add to journey path if not already visited in this season
    if (!visitedTiles.has(tileKey)) {
      const newJourneyPath = [...journeyPath, { row, col }];
      const newSeasonTiles = new Set(seasonProgress[currentSeason]).add(tileKey);
      
      updateProgress({
        journeyPath: newJourneyPath,
        seasonProgress: {
          ...seasonProgress,
          [currentSeason]: newSeasonTiles
        }
      });
      
      // Check if season is complete
      if (newSeasonTiles.size >= 64) {
        setTimeout(() => checkSeasonCompletion(currentSeason, newSeasonTiles), 500);
      }
    }
  };

  // Tile click handler with journey validation
  const handleTileClick = (row: number, col: number) => {
    if (!journeyStarted) {
      toast.info(`Click "Start Innovating" to begin ${currentSeason} season`);
      return;
    }
    
    const tileKey = `${row}-${col}`;
    if (visitedTiles.has(tileKey)) {
      setSelectedTile({ row, col });
    } else {
      toast.info('Use GL!TCH/DRIFT/TUNE buttons to navigate to new tiles');
    }
  };

  const handleSavePolen = async (content: string, tileId?: number) => {
    const tile = tileId ?? (selectedTile ? selectedTile.row * 8 + selectedTile.col + 1 : 1);
    await savePolenEntry(content, tile, 'text', [activeCompass || 'general', currentSeason], currentSeason as 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS');
    toast.success('Fragment saved successfully');
  };
  
  // Handle assistant polen save
  const handleAssistantSavePolen = (content: string) => {
    handleSavePolen(content);
  };

  // Compass change handler
  const handleCompassChange = (compass: CompassType) => {
    setActiveCompass(compass);
  };

  // Convert 5-axis emotional state to quadrant position
  const convertAxesToPosition = (axes: EmotionalAxes): QuadrantPosition => {
    // X axis: Novelty (magic, open, free) vs Memory (love, calm)
    const noveltyWeight = (axes.magic + axes.open + axes.free) / 3;
    const memoryWeight = (axes.love + axes.calm) / 2;
    const x = ((noveltyWeight - memoryWeight) / 100) * 2;
    
    // Y axis: Sovereignty (calm, open) vs Intimacy (love, magic)
    const sovereigntyWeight = (axes.calm + axes.open) / 2;
    const intimacyWeight = (axes.love + axes.magic) / 2;
    const y = ((sovereigntyWeight - intimacyWeight) / 100) * 2;
    
    return {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    };
  };

  // Handle emotional check-in
  const handleEmotionalCheckin = useCallback((
    tileId: number,
    feltState: FeltState,
    axes: EmotionalAxes,
    note?: string
  ) => {
    // Save the check-in
    const checkin = addCheckin(tileId, feltState, axes, note);
    
    // Convert to position and apply as shadow nudge
    const position = convertAxesToPosition(axes);
    applyShadowNudge(position, feltState, note || null);
    
    // Log the trajectory event
    logTrajectoryEvent('emotional_checkin', tileId, `Felt ${feltState || 'neutral'}: ${note || 'No note'}`);
    
    toast.success('Emotional check-in recorded');
  }, [addCheckin, applyShadowNudge, logTrajectoryEvent]);

  // Handle season completion - continue to next season
  const handleSeasonContinue = () => {
    const newCompletedSeasons = [...completedSeasons, currentSeason];
    
    // Log season end event
    logTrajectoryEvent('season_end', undefined, `Completed ${currentSeason} season`);
    
    // Advance to next season
    const currentIndex = SEASON_ORDER.indexOf(currentSeason);
    if (currentIndex < SEASON_ORDER.length - 1) {
      const nextSeason = SEASON_ORDER[currentIndex + 1];
      updateProgress({
        completedSeasons: newCompletedSeasons,
        currentSeason: nextSeason,
        journeyStarted: false,
        journeyPath: [],
      });
      setSelectedTile(null);
      toast.success(`Advanced to ${nextSeason} season!`);
    } else {
      // All 5 seasons complete - PRD ready
      updateProgress({
        completedSeasons: newCompletedSeasons,
      });
      toast.success('All seasons complete! Your PRD is ready for review.');
      navigate('/prds-dashboard');
    }
    
    setShowSeasonModal(false);
  };

  // Handle PRD layer generation
  const handleGeneratePrdLayer = async () => {
    setIsGeneratingPrd(true);
    
    try {
      // Fetch Polen entries for this season
      const { data: polenEntries, error } = await supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user?.id)
        .contains('tags', [currentSeason]);
      
      if (error) throw error;

      // Call edge function to generate PRD layer
      const { data, error: fnError } = await supabase.functions.invoke('generate-prd-stage', {
        body: {
          layer: SEASON_TO_PRD_FIELD[currentSeason],
          polenEntries: polenEntries || [],
          board: currentSeason,
          existingContent: null,
        }
      });

      if (fnError) throw fnError;

      // Create or update PRD
      if (!prdId) {
        const { data: newPrd, error: insertError } = await supabase
          .from('prds')
          .insert({
            owner_id: user.id,
            title: `PRD - ${new Date().toLocaleDateString()}`,
            status: 'draft',
            main_board: SEASON_TO_BOARD[currentSeason],
            [`${SEASON_TO_PRD_FIELD[currentSeason]}_signals_summary`]: data?.content || '',
          } as any)
          .select()
          .single();

        if (insertError) throw insertError;
        updateProgress({ prdId: newPrd.id });
      } else {
        // Update existing PRD with new layer
        await supabase
          .from('prds')
          .update({
            [`${SEASON_TO_PRD_FIELD[currentSeason]}_signals_summary`]: data?.content || '',
          })
          .eq('id', prdId);
      }

      // Log PRD generation event
      logTrajectoryEvent('prd_generated', undefined, `Generated ${currentSeason} PRD layer`);
      toast.success(`${currentSeason} layer generated!`);
    } catch (error) {
      console.error('Error generating PRD layer:', error);
      toast.error('Failed to generate PRD layer');
    } finally {
      setIsGeneratingPrd(false);
    }
  };

  // Get Polen count for current season
  const getCurrentSeasonPolenCount = () => {
    // This would ideally come from the persistence hook
    return 0; // Placeholder - will be populated from actual data
  };

  // Handle project rename
  const handleProjectRename = (newName: string) => {
    if (projectContext) {
      updateProject(projectContext.id, { projectName: newName });
    }
  };

  if (loading || progressLoading || projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-pulse text-foreground">Loading your journey...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted overflow-hidden">
      {/* Project Title Bar - Above everything */}
      {projectContext && (
        <ProjectTitleBar
          project={projectContext}
          onRename={handleProjectRename}
        />
      )}

      {/* Assessment Context Banner */}
      {showAssessmentBanner && assessmentContext && (
        <div className="shrink-0 px-6 py-2 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{assessmentContext}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowAssessmentBanner(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <header className="shrink-0 px-6 py-3 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          {/* Logo/Title - Single line */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
              Calm Magic Board
            </h1>
          </div>
          
          {/* Season Navigation - Center */}
          <div data-tour="seasons">
            <SeasonProgressBar
              currentSeason={currentSeason}
              seasonProgress={seasonProgress}
              completedSeasons={completedSeasons}
            />
          </div>

          {/* Journey Controls */}
          <div className="flex items-center gap-2">
            {!journeyStarted ? (
              <Button 
                onClick={handleStartJourney} 
                size="sm" 
                className={`bg-gradient-to-r ${SEASON_COLORS[currentSeason]}`}
                data-tour="start-button"
              >
                <Play className="w-4 h-4 mr-1" />
                Start Innovating
              </Button>
            ) : (
              <>
                <Badge variant="outline" className="text-sm px-2 py-0.5">
                  {visitedTiles.size}/64
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleResetJourney}>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </>
            )}
            
            {/* Quick Actions */}
            {prdId && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/prds/${prdId}`)}>
                <FileText className="w-4 h-4 mr-1" />
                PRD
              </Button>
            )}
            
            {/* Journey Summary */}
            <Button 
              variant={showJourneySummary ? "default" : "ghost"} 
              size="icon"
              onClick={() => setShowJourneySummary(true)}
              title="Journey Summary"
            >
              <MapPin className="w-4 h-4" />
            </Button>
            
            {/* Insight Connections */}
            <Button 
              variant={showInsightsGraph ? "default" : "ghost"} 
              size="icon"
              onClick={() => setShowInsightsGraph(true)}
              title="Insight Connections"
            >
              <Link2 className="w-4 h-4" />
            </Button>
            
            <Button 
              variant={showPolenBrowser ? "default" : "ghost"} 
              size="icon"
              onClick={() => setShowPolenBrowser(!showPolenBrowser)}
              title="Fragment Library"
              data-tour="fragments"
            >
              <Library className="w-4 h-4" />
            </Button>
            
            {/* PRD Assembly - Show when accessible */}
            {getPrdAccessLevel({
              completedSeasons: completedSeasons as PrdSeason[],
              currentSeason: currentSeason as PrdSeason,
              seasonProgress: seasonProgress as Record<PrdSeason, Set<string>>,
              polenCountBySeason: {} as Record<PrdSeason, number>,
              prdId
            }) !== 'hidden' && (
              <Button 
                variant={activeView === 'prd-assembly' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveView('prd-assembly')}
                title="PRD Assembly"
                data-tour="prd"
              >
                <Layers className="w-4 h-4 mr-1" />
                PRD
              </Button>
            )}
            
            {/* Help / Tour */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={startTour}
              title="Take a Tour"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="shrink-0 px-6 py-2 border-b border-border/30 bg-background/80">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as ViewTab)}>
          <TabsList className="h-8">
            <TabsTrigger value="matrix" className="text-xs gap-1.5 px-3">
              <Grid3X3 className="w-3.5 h-3.5" />
              Matrix
            </TabsTrigger>
            <TabsTrigger value="window-of-tolerance" className="text-xs gap-1.5 px-3" data-tour="wot">
              <CircleDot className="w-3.5 h-3.5" />
              Window of Tolerance
            </TabsTrigger>
            <TabsTrigger value="prd-assembly" className="text-xs gap-1.5 px-3">
              <Layers className="w-3.5 h-3.5" />
              PRD Assembly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content: Split Layout */}
      <div className="flex-1 min-h-0 flex">
        {/* Matrix View */}
        {activeView === 'matrix' && (
          <>
            {/* Left Panel: Tile Matrix - Always visible, scrollable */}
            <div 
              className={`${selectedTile || showPolenBrowser ? 'flex-1' : 'w-full'} p-8 overflow-auto transition-all duration-300 flex items-center justify-center`}
              data-tour="matrix"
            >
              <div className="pl-32">
            <MinimalistTileMatrix 
              board={SEASON_TO_BOARD[currentSeason]}
              selectedTile={selectedTile}
              visitedTiles={visitedTiles}
              journeyPath={journeyPath}
              onTileClick={handleTileClick}
              cycleNumber={currentCycleNumber}
              showToleranceOverlay={true}
              onZoneChange={setCurrentZone}
              completedSeasons={completedSeasons as string[]}
            />
          </div>
        </div>

        {/* Fragment Browser Panel */}
        {showPolenBrowser && !selectedTile && (
          <div className="w-[400px] max-w-[40vw] shrink-0 border-l border-border/50 animate-in slide-in-from-right duration-300 p-4">
            <FragmentBrowser 
              currentSeason={currentSeason as PrdSeason}
              onEntrySelect={(entry) => {
                if (entry.tile_id) {
                  const row = Math.floor((entry.tile_id - 1) / 8);
                  const col = (entry.tile_id - 1) % 8;
                  setSelectedTile({ row, col });
                  setShowPolenBrowser(false);
                }
              }}
            />
          </div>
        )}

            {/* Right Panel: Tile Detail - Slides in when tile selected */}
            {selectedTile && (
              <div 
                className="w-[400px] max-w-[40vw] shrink-0 border-l border-border/50 animate-in slide-in-from-right duration-300"
                data-tour="detail-panel"
              >
                <div data-tour="navigation">
                  <TileDetailPanel
                    selectedTile={selectedTile}
                    activeCompass={activeCompass}
                    board={SEASON_TO_BOARD[currentSeason]}
                    isAuthenticated={isAuthenticated}
                    saving={saving}
                    onClose={() => setSelectedTile(null)}
                    onSavePolen={handleSavePolen}
                    onNavigate={handleNavigate}
                    onCompassChange={handleCompassChange}
                    currentSeason={currentSeason}
                    onEmotionalCheckin={handleEmotionalCheckin}
                    emotionalCheckins={getAllCheckins()}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Window of Tolerance View */}
        {activeView === 'window-of-tolerance' && (
          <div className="flex-1 overflow-hidden">
            <QuadrantDynamicsPanel
              seasonQualities={seasonQualities}
              shadowPosition={shadowPosition}
              shadowQuadrant={shadowQuadrant}
              higherSelfPosition={higherSelfPosition}
              higherSelfQuadrant={higherSelfQuadrant}
              prophecyReflection={prophecyReflection}
              trajectoryLog={trajectoryLog}
              onSetProphecy={setProphecy}
              onResetTrajectory={resetTrajectory}
            />
          </div>
        )}

        {/* PRD Assembly View */}
        {activeView === 'prd-assembly' && (
          <div className="flex-1 overflow-hidden p-6">
            <PrdAssemblyPanel
              isOpen={true}
              onClose={() => setActiveView('matrix')}
              currentSeason={currentSeason as PrdSeason}
              seasonProgress={seasonProgress as Record<PrdSeason, Set<string>>}
              completedSeasons={completedSeasons as PrdSeason[]}
              prdId={prdId}
              onGenerateLayer={async (season) => {
                // Fetch Polen entries for this season
                const { data: polenEntries, error } = await supabase
                  .from('polen_entries')
                  .select('*')
                  .eq('user_id', user?.id)
                  .or(`season_context.eq.${season},tags.cs.{${season}}`);
                
                if (error) throw error;

                // Call edge function to generate PRD layer
                const layerField = SEASON_TO_PRD_FIELD[season as Season];
                const { data, error: fnError } = await supabase.functions.invoke('generate-prd-stage', {
                  body: {
                    layer: layerField,
                    polenEntries: polenEntries || [],
                    board: season,
                    existingContent: null,
                  }
                });

                if (fnError) throw fnError;

                // Create or update PRD
                if (!prdId) {
                  const { data: newPrd, error: insertError } = await supabase
                    .from('prds')
                    .insert({
                      owner_id: user.id,
                      title: `PRD - ${new Date().toLocaleDateString()}`,
                      status: 'draft',
                      main_board: SEASON_TO_BOARD[season as Season],
                      [`${layerField}_signals_summary`]: data?.content || '',
                    } as any)
                    .select()
                    .single();

                  if (insertError) throw insertError;
                  updateProgress({ prdId: newPrd.id });
                } else {
                  await supabase
                    .from('prds')
                    .update({
                      [`${layerField}_signals_summary`]: data?.content || '',
                    })
                    .eq('id', prdId);
                }

                logTrajectoryEvent('prd_generated', undefined, `Generated ${season} PRD layer`);
              }}
            />
          </div>
        )}
      </div>

      {/* Season Completion Modal */}
      <SeasonCompletionModal
        isOpen={showSeasonModal}
        onClose={() => setShowSeasonModal(false)}
        onContinue={handleSeasonContinue}
        onGeneratePrdLayer={handleGeneratePrdLayer}
        season={currentSeason}
        tilesVisited={visitedTiles.size}
        polenCount={getCurrentSeasonPolenCount()}
        isGenerating={isGeneratingPrd}
      />

      {/* Journey Summary Panel */}
      <JourneySummary
        isOpen={showJourneySummary}
        onClose={() => setShowJourneySummary(false)}
        currentSeason={currentSeason}
        seasonProgress={visitedTiles}
        prdId={prdId}
        onGeneratePrdLayer={handleGeneratePrdLayer}
        onViewPrd={prdId ? () => navigate(`/prds/${prdId}`) : undefined}
      />

      {/* Insight Connections Graph */}
      <InsightConnectionsGraph
        isOpen={showInsightsGraph}
        onClose={() => setShowInsightsGraph(false)}
      />

      {/* Assistant Chat */}
      <div className="fixed bottom-6 right-6 z-50">
        <AssistantChatButton
          onClick={() => setShowAssistantChat(true)}
          isOpen={showAssistantChat}
          mode={assistantMode}
        />
      </div>
      
      <AssistantChatPanel
        isOpen={showAssistantChat}
        onClose={() => setShowAssistantChat(false)}
        onSaveAsPolen={handleAssistantSavePolen}
        currentSeason={currentSeason}
        selectedTile={selectedTile}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showTour}
        onClose={closeTour}
        onComplete={completeTour}
      />
    </div>
  );
};

export default CalmMagicBoard;
