import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tile } from '@/types/glitch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Play, RotateCcw, FileText, MapPin, Link2, Grid3X3, CircleDot, Layers, Sparkles, X, HelpCircle, Lock, Compass, Menu, RefreshCw, BookOpen, Globe, Eye, EyeOff, Moon, Sun, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { getTerminology } from '@/data/modeAwareTerminology';
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
import { useSubscription } from '@/hooks/useSubscription';
import { hasFeatureAccess } from '@/data/subscriptionTiers';
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
import UpgradePromptModal from '@/components/UpgradePromptModal';
import PremiumBadge from '@/components/PremiumBadge';
import { getPrdAccessLevel, Season as PrdSeason } from '@/utils/prdAccessLevel';
import { parseBoardEntryParams, getAssessmentContextDescription } from '@/utils/parseBoardEntryParams';
import { getGardenByType } from '@/data/gardens';
import ProjectTitleBar from '@/components/calm-magic/ProjectTitleBar';
import PatternJournal from '@/components/calm-magic/PatternJournal';
import { DetectedPattern, PatternHistoryEntry } from '@/utils/patternDetection';
import { TopologiesTab } from '@/components/calm-magic/topologies/TopologiesTab';
import { TopologyInsightIndicator } from '@/components/calm-magic/topologies/TopologyInsightIndicator';
import { useTopologyInsight } from '@/hooks/useTopologyInsight';
import { ManifoldSeason } from '@/utils/torusManifoldMath';
import { getCurrentUnlockedRing } from '@/utils/ringToleranceSystem';
import { getHexagramDataForSummary } from '@/components/calm-magic/topologies/TopologicalMetricsPanel';
import { calculateConsciousnessGeometryFromTiles } from '@/utils/consciousnessGeometry';
import { useWeavingConnections } from '@/hooks/useWeavingConnections';
import { useCosmologicalAudio } from '@/hooks/useCosmologicalAudio';
import { AmbientSoundscapeControl } from '@/components/calm-magic/AmbientSoundscapeControl';
import { cn } from '@/lib/utils';

const ROW_LABELS = ['Mindsets', 'Agilities', 'Goals', 'Intuition', 'Compasses', 'Norms', 'Synergies', 'Protocols & Architectures'];
const COL_LABELS = ['Chances', 'Heart', 'Observer', 'Reversal', 'Design', 'Seeds', 'Methods', 'Systems'];


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

type ViewTab = 'matrix' | 'window-of-tolerance' | 'topologies' | 'prd-assembly';

// Cosmological overlay state


const CalmMagicBoard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode, setMode, sanctuaryMode, toggleSanctuary, ambientEnabled, setAmbientEnabled } = useMode();
  const { 
    startAmbientSoundscape,
    stopAmbientSoundscape,
    changeAmbientSeason,
    setAmbientVolume,
    getAmbientProfile,
    isAmbientPlaying,
    ambientVolume,
    currentAmbientSeason
  } = useCosmologicalAudio();
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<'insight_connections' | null>(null);
  const [showPatternJournal, setShowPatternJournal] = useState(false);
  const [detectedPatterns, setDetectedPatterns] = useState<DetectedPattern[]>([]);
  const [patternHistory, setPatternHistory] = useState<PatternHistoryEntry[]>([]);
  const [highlightedPattern, setHighlightedPattern] = useState<DetectedPattern | null>(null);
  const [cleanMatrixView, setCleanMatrixView] = useState(false);
  const [insightIndicatorDismissed, setInsightIndicatorDismissed] = useState(false);
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Topology insight hook for floating indicator
  const { story: topologyStory, fetchStory: fetchTopologyStory } = useTopologyInsight();
  
  const isMobile = useIsMobile();
  
  // Subscription state for feature gating
  const { tier } = useSubscription();
  const canAccessInsights = hasFeatureAccess(tier, 'insight_connections');

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
    recoverFromPolen,
    isLoading: progressLoading,
  } = useSeasonPersistence(projectContext?.id || null);
  
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Season completion modal state
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [isGeneratingPrd, setIsGeneratingPrd] = useState(false);
  
  // Assistant chat state
  const [showAssistantChat, setShowAssistantChat] = useState(false);
  const [assistantMode, setAssistantMode] = useState<'glitch' | 'drift' | 'idle'>('idle');

  // Convert journeyPath to Set for matrix visualization (within current season)
  // Fallback to empty Set if season data not yet loaded
  const visitedTiles = seasonProgress[currentSeason] || new Set<string>();
  
  // Calculate current unlocked ring based on visited tiles
  const currentUnlockedRing = getCurrentUnlockedRing(visitedTiles);
  // Emotional check-ins hook
  const {
    checkins: emotionalCheckins,
    addCheckin,
    getAllCheckins,
  } = useTileEmotionalCheckins();

  // Get all check-ins for quadrant dynamics
  const allCheckins = getAllCheckins();

  // Quadrant dynamics hook - pass emotional check-ins for 30% influence on shadow
  const {
    seasonQualities,
    shadowPosition,
    shadowQuadrant,
    shadowFactors,
    gaps,
    shadowNudge,
    higherSelfPosition,
    higherSelfQuadrant,
    prophecyReflection,
    trajectoryLog,
    topologicalSignature,
    isAnalyzing,
    setProphecy,
    applyShadowNudge,
    resetShadowNudge,
    logTrajectoryEvent,
    resetTrajectory,
    analyzeTopology,
  } = useQuadrantDynamics(seasonProgress, currentSeason, {}, journeyPath, allCheckins);

  const {
    isAuthenticated,
    saving,
    savePolenEntry,
    polenEntries,
  } = useTileMatrixPersistence(todayTile?.board || SEASON_TO_BOARD[currentSeason]);

  // Weaving connections - semantic threads between tiles
  const { threads: weavingThreads } = useWeavingConnections(user?.id);

  // Extract density map from polen entries per tile (shared across components)
  const densityMap = useMemo(() => {
    const map = new Map<string, number>();
    polenEntries.forEach(entry => {
      if (entry.tile_id !== null && entry.tile_id !== undefined) {
        // Convert 1-indexed tile_id to row,col format
        const row = Math.floor((entry.tile_id - 1) / 8);
        const col = (entry.tile_id - 1) % 8;
        const key = `${row}-${col}`;
        map.set(key, (map.get(key) || 0) + 1);
      }
    });
    return map;
  }, [polenEntries]);

  // Calculate consciousness geometry for the AI oracle
  const consciousnessGeometry = useMemo(() => {
    return calculateConsciousnessGeometryFromTiles(visitedTiles, journeyPath, densityMap);
  }, [visitedTiles, journeyPath, densityMap]);
  // Onboarding tour
  const {
    isOpen: showTour,
    startTour,
    closeTour,
    completeTour,
  } = useOnboardingTour({ projectId: projectContext?.id, autoStart: true });

  // Keyboard shortcut for clean view toggle (C key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      
      if (e.key.toLowerCase() === 'c' && activeView === 'matrix') {
        e.preventDefault();
        setCleanMatrixView(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView]);

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

  // Clean corrupted visitedTiles (like "NaN-NaN") on load - one-time cleanup
  useEffect(() => {
    let hasCorruptedData = false;
    const cleanedProgress = { ...seasonProgress };
    
    Object.keys(cleanedProgress).forEach(season => {
      const tiles = cleanedProgress[season as Season];
      if (tiles && tiles.has('NaN-NaN')) {
        tiles.delete('NaN-NaN');
        hasCorruptedData = true;
        console.warn(`Cleaned corrupted tile entry "NaN-NaN" from ${season}`);
      }
      // Also clean any other malformed entries
      tiles?.forEach(tile => {
        const parts = tile.split('-');
        if (parts.length !== 2) {
          tiles.delete(tile);
          hasCorruptedData = true;
          console.warn(`Cleaned malformed tile entry "${tile}" from ${season}`);
          return;
        }
        const row = parseInt(parts[0], 10);
        const col = parseInt(parts[1], 10);
        if (isNaN(row) || isNaN(col) || row < 0 || row > 7 || col < 0 || col > 7) {
          tiles.delete(tile);
          hasCorruptedData = true;
          console.warn(`Cleaned invalid tile entry "${tile}" from ${season}`);
        }
      });
    });
    
    if (hasCorruptedData) {
      updateProgress({ seasonProgress: cleanedProgress });
      toast.info('Cleaned up corrupted journey data');
    }
  }, []); // Run once on mount

  // Ambient soundscape integration with sanctuary mode and season changes
  useEffect(() => {
    // Auto-start ambient when sanctuary mode is enabled
    if (sanctuaryMode && !isAmbientPlaying) {
      startAmbientSoundscape(currentSeason);
      setAmbientEnabled(true);
    }
  }, [sanctuaryMode]);

  // Change ambient season when current season changes
  useEffect(() => {
    if (isAmbientPlaying && currentAmbientSeason !== currentSeason) {
      changeAmbientSeason(currentSeason);
    }
  }, [currentSeason, isAmbientPlaying, currentAmbientSeason, changeAmbientSeason]);

  // Handle ambient toggle
  const handleAmbientToggle = useCallback(() => {
    if (isAmbientPlaying) {
      stopAmbientSoundscape();
      setAmbientEnabled(false);
    } else {
      startAmbientSoundscape(currentSeason);
      setAmbientEnabled(true);
    }
  }, [isAmbientPlaying, currentSeason, startAmbientSoundscape, stopAmbientSoundscape, setAmbientEnabled]);

  // Fetch topology story for floating indicator (when not on topologies tab)
  useEffect(() => {
    if (activeView !== 'topologies' && visitedTiles.size > 0 && !topologyStory) {
      fetchTopologyStory({
        viewMode: 'isometric',
        journeyPath,
        visitedTiles,
        densityMap,
        shadowPosition,
        higherSelfPosition,
        currentSeason,
        currentUnlockedRing,
        currentTileRow: selectedTile?.row,
        currentTileCol: selectedTile?.col,
        completedSeasons,
        prdId,
        consciousnessGeometry
      });
    }
  }, [visitedTiles.size, activeView, densityMap]); // Only refetch when tiles change or view changes

  // Reset indicator dismissed state when switching to topologies tab
  useEffect(() => {
    if (activeView === 'topologies') {
      setInsightIndicatorDismissed(false);
    }
  }, [activeView]);

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
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTodayTile(data);
      }
      // If no tile found, we just don't set it - not an error
    } catch (error) {
      console.error('Error loading today tile:', error);
      // Don't show error toast for missing tile data - it's expected if tiles aren't seeded
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

  // Get POLEN count for current season
  const currentSeasonPolenCount = useMemo(() => {
    return polenEntries.filter(entry => entry.season_context === currentSeason).length;
  }, [polenEntries, currentSeason]);

  // Check for season completion (32+ tiles AND 5+ fragments OR 64 tiles)
  const checkSeasonCompletion = useCallback((season: Season, tiles: Set<string>, polenCount: number) => {
    const canComplete = tiles.size >= 64 || (tiles.size >= 32 && polenCount >= 5);
    if (canComplete && !completedSeasons.includes(season)) {
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
      
      // Check if season can be completed (32+ tiles AND 5+ fragments OR 64 tiles)
      const canComplete = newSeasonTiles.size >= 64 || (newSeasonTiles.size >= 32 && currentSeasonPolenCount >= 5);
      if (canComplete) {
        setTimeout(() => checkSeasonCompletion(currentSeason, newSeasonTiles, currentSeasonPolenCount), 500);
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
    
    // Check if saving this fragment triggers season completion (count +1 for the just-saved entry)
    const newPolenCount = currentSeasonPolenCount + 1;
    const canComplete = visitedTiles.size >= 64 || (visitedTiles.size >= 32 && newPolenCount >= 5);
    if (canComplete && !completedSeasons.includes(currentSeason)) {
      setTimeout(() => checkSeasonCompletion(currentSeason, visitedTiles, newPolenCount), 500);
    }
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

  // Handle pattern detection
  const handlePatternDetected = useCallback((patterns: DetectedPattern[]) => {
    setDetectedPatterns(patterns);
    
    // Add to pattern history
    const newHistoryEntries: PatternHistoryEntry[] = patterns
      .filter(p => !patternHistory.some(h => h.pattern.id === p.id))
      .map(pattern => ({
        pattern,
        discoveredAt: new Date(),
        tilesAtDiscovery: visitedTiles.size,
        seasonAtDiscovery: currentSeason,
      }));
    
    if (newHistoryEntries.length > 0) {
      setPatternHistory(prev => [...prev, ...newHistoryEntries]);
      logTrajectoryEvent('pattern_discovery', undefined, `Discovered ${newHistoryEntries.map(e => e.pattern.name).join(', ')}`);
    }
  }, [patternHistory, visitedTiles.size, currentSeason, logTrajectoryEvent]);

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

  // Handle journey topology analysis
  const handleAnalyzeJourney = useCallback(async () => {
    if (!user?.id) {
      toast.error('Please sign in to analyze your journey');
      return;
    }
    
    // Fetch ALL POLEN entries for analysis
    const { data: entries, error } = await supabase
      .from('polen_entries')
      .select('id, content, tile_id, season_context, tags')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Failed to fetch POLEN entries:', error);
      toast.error('Failed to load your journey entries');
      return;
    }
    
    // Also include emotional check-in notes as analyzable content
    const checkinEntries = allCheckins
      .filter(c => c.note)
      .map(c => ({
        id: c.id,
        content: `[Emotional Check-in at tile ${c.tile_id}] Felt: ${c.felt_state || 'unspecified'}. ${c.note}`,
        tile_id: c.tile_id,
        season_context: currentSeason,
        tags: ['manifold-note', 'emotional-checkin']
      }));
    
    const combinedEntries = [...(entries || []), ...checkinEntries];
    
    if (combinedEntries.length === 0) {
      toast.warning('No journey entries found. Complete some tiles first!');
      return;
    }
    
    const result = await analyzeTopology(combinedEntries);
    
    if (result) {
      toast.success(`Analysis complete: ${result.inferredQuadrant} tendency detected`, {
        description: result.aiNudge || `Confidence: ${Math.round(result.confidence * 100)}%`,
        duration: 5000,
      });
    }
  }, [user?.id, analyzeTopology, allCheckins, currentSeason]);

  // Apply AI insight to shadow as a special nudge
  const handleApplyInsightToShadow = useCallback((
    position: { x: number; y: number }, 
    insightNote: string
  ) => {
    applyShadowNudge(position, 'breakthrough', `[AI Insight] ${insightNote}`);
    toast.success('Applied AI insight to Shadow position', {
      description: `Position updated based on journey analysis`,
    });
  }, [applyShadowNudge]);

  // Suggest updating prophecy based on where patterns point
  const handleSuggestProphecyFromInsight = useCallback((
    position: { x: number; y: number },
    suggestion: string
  ) => {
    setProphecy(position, `[Pattern-Informed] ${suggestion}`);
    toast.success('Prophecy updated based on journey patterns', {
      description: `Higher Self destination refined`,
    });
  }, [setProphecy]);
  const getCurrentSeasonPolenCount = () => {
    return currentSeasonPolenCount;
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

      <header className="shrink-0 px-4 md:px-6 py-3 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-2 md:gap-4">
          {/* Logo/Title - Single line */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap truncate">
              Calm Magic Board
            </h1>
          </div>
          
          {/* Season Navigation - Center (hidden on mobile, shown in menu) */}
          <div data-tour="seasons" className="hidden md:block">
            <SeasonProgressBar
              currentSeason={currentSeason}
              seasonProgress={seasonProgress}
              completedSeasons={completedSeasons}
            />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Journey Controls - Desktop */}
          <div className="hidden md:flex items-center gap-2">
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
                
                {/* Manual Season Completion Button - appears when 5+ fragments saved */}
                {currentSeasonPolenCount >= 5 && !completedSeasons.includes(currentSeason) && (
                  <AlertDialog>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className={`h-8 w-8 bg-gradient-to-r ${SEASON_COLORS[currentSeason]} text-white border-0 hover:opacity-90`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Complete {currentSeason} Season ({currentSeasonPolenCount} fragments)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Complete {currentSeason} Season?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You've documented {currentSeasonPolenCount} fragments in {currentSeason} ({visitedTiles.size} tiles visited). 
                          Ready to continue to {SEASON_ORDER[SEASON_ORDER.indexOf(currentSeason) + 1] || 'final review'}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Exploring</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSeasonContinue}>
                          Continue to Next Season
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
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
              onClick={() => {
                if (canAccessInsights) {
                  setShowInsightsGraph(true);
                } else {
                  setUpgradeFeature('insight_connections');
                  setShowUpgradeModal(true);
                }
              }}
              title={canAccessInsights ? "Insight Connections" : "Insight Connections (Scale plan)"}
              className="relative"
            >
              <Link2 className="w-4 h-4" />
              {!canAccessInsights && <Lock className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-amber-500" />}
            </Button>
            
            
            {/* Sync Progress */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={async () => {
                setIsSyncing(true);
                await recoverFromPolen();
                setIsSyncing(false);
                toast.success('Progress synced from saved fragments');
              }}
              disabled={isSyncing}
              title="Sync Progress from POLEN entries"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </Button>
            
            {/* Ambient Soundscape Control */}
            <AmbientSoundscapeControl
              isPlaying={isAmbientPlaying}
              volume={ambientVolume}
              currentSeason={currentSeason}
              seasonCharacter={getAmbientProfile(currentSeason).character}
              onToggle={handleAmbientToggle}
              onVolumeChange={setAmbientVolume}
            />
            
            {/* Sanctuary Mode Toggle */}
            <Button 
              variant={sanctuaryMode ? "default" : "ghost"} 
              size="icon"
              onClick={toggleSanctuary}
              title={sanctuaryMode ? "Exit Sanctuary (⌘⇧S)" : "Enter Sanctuary (⌘⇧S)"}
            >
              {sanctuaryMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
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

      {/* Mobile Menu Sheet */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="right" className="w-[300px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Season Progress */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Season Progress</p>
              <SeasonProgressBar
                currentSeason={currentSeason}
                seasonProgress={seasonProgress}
                completedSeasons={completedSeasons}
              />
            </div>

            {/* Journey Actions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Journey</p>
              {!journeyStarted ? (
                <Button 
                  onClick={() => { handleStartJourney(); setShowMobileMenu(false); }} 
                  size="sm" 
                  className={`w-full bg-gradient-to-r ${SEASON_COLORS[currentSeason]}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Innovating
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm px-2 py-0.5">
                      {visitedTiles.size}/64 tiles
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => { handleResetJourney(); setShowMobileMenu(false); }}>
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                  
                  {/* Mobile Complete Season Button */}
                  {currentSeasonPolenCount >= 5 && !completedSeasons.includes(currentSeason) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`w-full bg-gradient-to-r ${SEASON_COLORS[currentSeason]} text-white border-0 hover:opacity-90`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete {currentSeason} Season
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Complete {currentSeason} Season?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You've documented {currentSeasonPolenCount} fragments in {currentSeason} ({visitedTiles.size} tiles visited). 
                            Ready to continue to {SEASON_ORDER[SEASON_ORDER.indexOf(currentSeason) + 1] || 'final review'}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Exploring</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { handleSeasonContinue(); setShowMobileMenu(false); }}>
                            Continue to Next Season
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => { setShowJourneySummary(true); setShowMobileMenu(false); }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Summary
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => { setShowPolenBrowser(!showPolenBrowser); setShowMobileMenu(false); }}
                >
                  <Library className="w-4 h-4 mr-2" />
                  Library
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => { startTour(); setShowMobileMenu(false); }}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Tour
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  disabled={isSyncing}
                  onClick={async () => { 
                    setIsSyncing(true);
                    await recoverFromPolen();
                    setIsSyncing(false);
                    toast.success('Progress synced from saved fragments');
                    setShowMobileMenu(false);
                  }}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => { navigate('/pattern-encyclopedia'); setShowMobileMenu(false); }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Encyclopedia
                </Button>
              </div>
            </div>

            {/* View Navigation */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Views</p>
              <div className="space-y-1">
                <Button 
                  variant={activeView === 'matrix' ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => { setActiveView('matrix'); setShowMobileMenu(false); }}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Matrix
                </Button>
                <Button 
                  variant={activeView === 'window-of-tolerance' ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => { setActiveView('window-of-tolerance'); setShowMobileMenu(false); }}
                >
                  <CircleDot className="w-4 h-4 mr-2" />
                  Window of Tolerance
                </Button>
                <Button 
                  variant={activeView === 'prd-assembly' ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => { setActiveView('prd-assembly'); setShowMobileMenu(false); }}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  PRD Assembly
                </Button>
                <Button 
                  variant={activeView === 'topologies' ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => { setActiveView('topologies'); setShowMobileMenu(false); }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Topologies
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sub Navigation - Desktop only */}
      <div className="hidden md:flex shrink-0 px-6 py-2 border-b border-border/30 bg-background/80 items-center justify-between gap-4">
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
              {visitedTiles.size >= 32 && polenEntries.length >= 5 ? (
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Layers className="w-3.5 h-3.5" />
              )}
              PRD Assembly
            </TabsTrigger>
            <TabsTrigger value="topologies" className="text-xs gap-1.5 px-3 relative">
              {topologyStory && visitedTiles.size > 0 ? (
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )}
              Topologies
              {topologyStory && activeView !== 'topologies' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Clean View Toggle + Encyclopedia */}
        <div className="flex items-center gap-2">
          {activeView === 'matrix' && (
            <Button
              variant={cleanMatrixView ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5 h-8 px-2"
              onClick={() => setCleanMatrixView(!cleanMatrixView)}
              title={cleanMatrixView ? "Show paths & connections (C)" : "Clean view - tiles only (C)"}
            >
              {cleanMatrixView ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              <span className="hidden lg:inline text-xs">
                {cleanMatrixView ? "Show Paths" : "Clean View"}
              </span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8 px-2"
            onClick={() => navigate('/pattern-encyclopedia')}
            title="Pattern Encyclopedia"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden lg:inline text-xs">Encyclopedia</span>
          </Button>
        </div>
      </div>

      {/* Mobile Sub Navigation - Compact tabs */}
      <div className="md:hidden shrink-0 px-3 py-2 border-b border-border/30 bg-background/80 flex items-center justify-between gap-2">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as ViewTab)} className="flex-1">
          <TabsList className="h-8 w-full grid grid-cols-4">
            <TabsTrigger value="matrix" className="text-[10px] gap-1 px-1.5">
              <Grid3X3 className="w-3 h-3" />
              <span className="hidden xs:inline">Matrix</span>
            </TabsTrigger>
            <TabsTrigger value="window-of-tolerance" className="text-[10px] gap-1 px-1.5">
              <CircleDot className="w-3 h-3" />
              <span className="hidden xs:inline">Tolerance</span>
            </TabsTrigger>
            <TabsTrigger value="prd-assembly" className="text-[10px] gap-1 px-1.5">
              {visitedTiles.size >= 32 && polenEntries.length >= 5 ? (
                <Sparkles className="w-3 h-3 text-amber-500" />
              ) : (
                <Layers className="w-3 h-3" />
              )}
              <span className="hidden xs:inline">PRD</span>
            </TabsTrigger>
            <TabsTrigger value="topologies" className="text-[10px] gap-1 px-1.5 relative">
              {topologyStory && visitedTiles.size > 0 ? (
                <Sparkles className="w-3 h-3 text-violet-500" />
              ) : (
                <Globe className="w-3 h-3" />
              )}
              <span className="hidden xs:inline">Torus</span>
              {topologyStory && activeView !== 'topologies' && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Mobile progress indicator - compact */}
        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 shrink-0">
          {visitedTiles.size}/64
        </Badge>
      </div>

      {/* Main Content: Split Layout */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Matrix View */}
        {activeView === 'matrix' && (
          <>
            {/* Tile Matrix - Full width on mobile, split on desktop */}
            <div 
              className={`${(selectedTile || showPolenBrowser) && !isMobile ? 'flex-1' : 'w-full'} p-4 md:p-8 overflow-auto transition-all duration-300 flex flex-col`}
              data-tour="matrix"
            >
              {/* Tile Matrix */}
              <div className="flex-1 flex items-center justify-center">
                <div className="md:pl-32 w-full max-w-full overflow-x-auto">
                  <MinimalistTileMatrix 
                    board={SEASON_TO_BOARD[currentSeason]}
                    selectedTile={selectedTile}
                    visitedTiles={visitedTiles}
                    journeyPath={journeyPath}
                    onTileClick={handleTileClick}
                    cycleNumber={currentCycleNumber}
                    showToleranceOverlay={!cleanMatrixView}
                    onZoneChange={setCurrentZone}
                    completedSeasons={completedSeasons as string[]}
                    highlightedPattern={highlightedPattern}
                    showPatternOverlay={!cleanMatrixView}
                    cleanView={cleanMatrixView}
                    weavingThreads={weavingThreads}
                    showWeaving={!sanctuaryMode}
                  />
                </div>
              </div>
            </div>

        {/* Fragment Browser Panel - Desktop only */}
        {showPolenBrowser && !selectedTile && !isMobile && (
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

            {/* Right Panel: Tile Detail - Desktop side panel */}
            {selectedTile && !isMobile && (
              <div 
                className="w-[400px] max-w-[40vw] h-full shrink-0 border-l border-border/50 animate-in slide-in-from-right duration-300"
                data-tour="detail-panel"
              >
                <div data-tour="navigation" className="h-full">
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
                    onOpenAssistant={() => setShowAssistantChat(true)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Window of Tolerance View */}
        {activeView === 'window-of-tolerance' && (
          <div className="flex-1 overflow-auto p-4 md:p-0">
            <QuadrantDynamicsPanel
              seasonQualities={seasonQualities}
              shadowPosition={shadowPosition}
              shadowQuadrant={shadowQuadrant}
              higherSelfPosition={higherSelfPosition}
              higherSelfQuadrant={higherSelfQuadrant}
              prophecyReflection={prophecyReflection}
              trajectoryLog={trajectoryLog}
              shadowFactors={shadowFactors}
              gaps={gaps}
              shadowNudge={shadowNudge}
              topologicalSignature={topologicalSignature}
              isAnalyzingTopology={isAnalyzing}
              onSetProphecy={setProphecy}
              onResetTrajectory={resetTrajectory}
              onApplyShadowNudge={applyShadowNudge}
              onResetShadowNudge={resetShadowNudge}
              onAnalyzeJourney={handleAnalyzeJourney}
              onApplyInsightToShadow={handleApplyInsightToShadow}
              onSuggestProphecyFromInsight={handleSuggestProphecyFromInsight}
            />
          </div>
        )}

        {/* PRD Assembly View */}
        {activeView === 'prd-assembly' && (
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <PrdAssemblyPanel
              isOpen={true}
              onClose={() => setActiveView('matrix')}
              currentSeason={currentSeason as PrdSeason}
              seasonProgress={seasonProgress as Record<PrdSeason, Set<string>>}
              completedSeasons={completedSeasons as PrdSeason[]}
              prdId={prdId}
              onPrdCreated={(newPrdId) => updateProgress({ prdId: newPrdId })}
              visitedTiles={visitedTiles}
              polenCount={polenEntries.length}
              userId={user?.id}
              currentUnlockedRing={currentUnlockedRing}
              onPatternDetected={handlePatternDetected}
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

        {/* Topologies View */}
        {activeView === 'topologies' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
            <TopologiesTab
              row={selectedTile?.row ?? 0}
              col={selectedTile?.col ?? 0}
              season={(currentSeason as ManifoldSeason) || 'POLLENS'}
              tileName={selectedTile ? `${ROW_LABELS[selectedTile.row]} × ${COL_LABELS[selectedTile.col]}` : 'Overview'}
              rowLabel={ROW_LABELS[selectedTile?.row ?? 0]}
              colLabel={COL_LABELS[selectedTile?.col ?? 0]}
              journeyPath={journeyPath}
              polenDensity={polenEntries.length}
              visitedTiles={visitedTiles}
              densityMap={densityMap}
              onTileSelect={(row, col) => {
                handleNavigate(row, col);
                setActiveView('matrix');
              }}
              shadowPosition={shadowPosition}
              higherSelfPosition={higherSelfPosition}
              currentSeason={currentSeason}
              currentUnlockedRing={currentUnlockedRing}
              completedSeasons={completedSeasons}
              prdId={prdId}
              topologicalSignature={topologicalSignature}
              isAnalyzingTopology={isAnalyzing}
              onAnalyzeTopology={() => analyzeTopology(polenEntries)}
              onApplyInsightToShadow={handleApplyInsightToShadow}
              consciousnessGeometry={consciousnessGeometry}
            />
          </div>
        )}
      </div>

      {/* Mobile Tile Detail Sheet */}
      {isMobile && (
        <Sheet open={!!selectedTile} onOpenChange={(open) => !open && setSelectedTile(null)}>
          <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-xl overflow-hidden">
            <div className="h-full overflow-y-auto">
              {selectedTile && (
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
                  onOpenAssistant={() => setShowAssistantChat(true)}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Fragment Browser Sheet */}
      {isMobile && (
        <Sheet open={showPolenBrowser} onOpenChange={setShowPolenBrowser}>
          <SheetContent side="bottom" className="h-[75vh] p-4 rounded-t-xl">
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
          </SheetContent>
        </Sheet>
      )}

      {/* Season Completion Modal */}
      <SeasonCompletionModal
        isOpen={showSeasonModal}
        onClose={() => setShowSeasonModal(false)}
        onContinue={handleSeasonContinue}
        onGeneratePrdLayer={handleGeneratePrdLayer}
        onGenerateFoundationalPrompt={() => {
          setShowSeasonModal(false);
          setActiveView('prd-assembly');
          toast.success(
            '🎉 Your Foundational Prompt is ready! Navigate to Compilation tab to export.',
            { duration: 5000 }
          );
        }}
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
        hexagramData={getHexagramDataForSummary(visitedTiles)}
        consciousnessGeometry={consciousnessGeometry}
      />

      {/* Insight Connections Graph */}
      <InsightConnectionsGraph
        isOpen={showInsightsGraph}
        onClose={() => setShowInsightsGraph(false)}
      />

      {/* Floating Topology Insight Indicator (when not on Topologies tab) */}
      <TopologyInsightIndicator
        story={topologyStory}
        isVisible={activeView !== 'topologies' && visitedTiles.size > 0 && !insightIndicatorDismissed}
        onNavigateToTopologies={() => {
          setActiveView('topologies');
          setInsightIndicatorDismissed(true);
        }}
        onDismiss={() => setInsightIndicatorDismissed(true)}
      />

      {/* Assistant Chat */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
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
      
      {/* Upgrade Modal for Feature Locks */}
      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          setUpgradeFeature(null);
        }}
        reason="feature_locked"
        feature={upgradeFeature || undefined}
      />

      {/* Pattern Journal */}
      <Sheet open={showPatternJournal} onOpenChange={setShowPatternJournal}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Pattern Journal
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <PatternJournal
              patterns={detectedPatterns}
              patternHistory={patternHistory}
              onPatternClick={(pattern) => {
                setHighlightedPattern(pattern);
                setShowPatternJournal(false);
                toast.info(`${pattern.icon} Highlighting ${pattern.name} on matrix`);
                // Clear highlight after 5 seconds
                setTimeout(() => setHighlightedPattern(null), 5000);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      
    </div>
  );
};

export default CalmMagicBoard;
