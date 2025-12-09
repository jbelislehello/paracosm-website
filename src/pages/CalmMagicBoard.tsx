import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Tile } from '@/types/glitch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, TrendingUp, Library, Play, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import MinimalistTileMatrix from '@/components/MinimalistTileMatrix';
import TileDetailPanel from '@/components/TileDetailPanel';
import PolenBrowserPanel from '@/components/PolenBrowserPanel';
import { useTileMatrixPersistence } from '@/hooks/useTileMatrixPersistence';
import { CycleNumber } from '@/types/journal-expansion';
import SeasonProgressBar from '@/components/prd-generator/SeasonProgressBar';
import SeasonCompletionModal from '@/components/prd-generator/SeasonCompletionModal';

type CompassType = 'narrative' | 'workflow' | 'inquiry' | 'playground' | 'human-dynamics';
type Season = 'POLLEN' | 'POEM' | 'TOTEM' | 'ANTHEM';
type BoardType = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';

const SEASON_ORDER: Season[] = ['POLLEN', 'POEM', 'TOTEM', 'ANTHEM'];

// Maps seasons to database board types
const SEASON_TO_BOARD: Record<Season, BoardType> = {
  POLLEN: 'LOVE',
  POEM: 'MAGIC',
  TOTEM: 'CALM',
  ANTHEM: 'OPEN',
};

const SEASON_TO_PRD_FIELD: Record<Season, string> = {
  POLLEN: 'love',
  POEM: 'magic',
  TOTEM: 'calm',
  ANTHEM: 'open',
};

const SEASON_COLORS: Record<Season, string> = {
  POLLEN: 'from-rose-500 to-pink-500',
  POEM: 'from-purple-500 to-indigo-500',
  TOTEM: 'from-blue-500 to-cyan-500',
  ANTHEM: 'from-emerald-500 to-green-500',
};

const CalmMagicBoard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [todayTile, setTodayTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const [activeCompass, setActiveCompass] = useState<CompassType | null>(null);
  const [currentCycleNumber, setCurrentCycleNumber] = useState<CycleNumber>(1);
  const [showPolenBrowser, setShowPolenBrowser] = useState(false);
  const [currentZone, setCurrentZone] = useState<'safe' | 'stretch' | 'edge' | 'unexplored'>('safe');

  // Journey tracking state
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [journeyPath, setJourneyPath] = useState<Array<{ row: number; col: number }>>([]);

  // Season tracking state
  const [currentSeason, setCurrentSeason] = useState<Season>('POLLEN');
  const [seasonProgress, setSeasonProgress] = useState<Record<Season, Set<string>>>({
    POLLEN: new Set(),
    POEM: new Set(),
    TOTEM: new Set(),
    ANTHEM: new Set(),
  });
  const [completedSeasons, setCompletedSeasons] = useState<Season[]>([]);
  const [freeTilesUnlocked, setFreeTilesUnlocked] = useState(false);
  const [prdId, setPrdId] = useState<string | null>(null);
  
  // Season completion modal state
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [isGeneratingPrd, setIsGeneratingPrd] = useState(false);

  // Convert journeyPath to Set for matrix visualization (within current season)
  const visitedTiles = seasonProgress[currentSeason];

  const {
    isAuthenticated,
    saving,
    savePolenEntry,
  } = useTileMatrixPersistence(todayTile?.board || SEASON_TO_BOARD[currentSeason]);

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
    setJourneyStarted(true);
    setSelectedTile({ row: 0, col: 0 }); // Mindsets × Chances
    setJourneyPath([{ row: 0, col: 0 }]);
    
    // Add to current season progress
    setSeasonProgress(prev => ({
      ...prev,
      [currentSeason]: new Set(prev[currentSeason]).add('0-0')
    }));
    
    toast.success(`${currentSeason} season started at Mindsets × Chances`);
  };

  // Reset journey (current season only)
  const handleResetJourney = () => {
    setJourneyStarted(false);
    setJourneyPath([]);
    setSelectedTile(null);
    setActiveCompass(null);
    
    // Reset current season progress
    setSeasonProgress(prev => ({
      ...prev,
      [currentSeason]: new Set()
    }));
    
    toast.info(`${currentSeason} season reset`);
  };

  // Reset entire cycle (all seasons)
  const handleResetCycle = () => {
    setJourneyStarted(false);
    setJourneyPath([]);
    setSelectedTile(null);
    setActiveCompass(null);
    setCurrentSeason('POLLEN');
    setSeasonProgress({
      POLLEN: new Set(),
      POEM: new Set(),
      TOTEM: new Set(),
      ANTHEM: new Set(),
    });
    setCompletedSeasons([]);
    setFreeTilesUnlocked(false);
    setPrdId(null);
    toast.info('Full cycle reset');
  };

  // Navigate handler with journey and season tracking
  const handleNavigate = (row: number, col: number) => {
    setSelectedTile({ row, col });
    const tileKey = `${row}-${col}`;
    
    // Add to journey path if not already visited in this season
    if (!visitedTiles.has(tileKey)) {
      setJourneyPath(prev => [...prev, { row, col }]);
      
      // Update season progress
      setSeasonProgress(prev => {
        const newSeasonTiles = new Set(prev[currentSeason]).add(tileKey);
        
        // Check if season is complete
        if (newSeasonTiles.size >= 64) {
          setTimeout(() => checkSeasonCompletion(currentSeason, newSeasonTiles), 500);
        }
        
        return {
          ...prev,
          [currentSeason]: newSeasonTiles
        };
      });
    }
  };

  // Tile click handler with journey validation
  const handleTileClick = (row: number, col: number) => {
    if (!journeyStarted) {
      toast.info(`Click "Start Journey" to begin ${currentSeason} season`);
      return;
    }
    
    const tileKey = `${row}-${col}`;
    if (visitedTiles.has(tileKey)) {
      setSelectedTile({ row, col });
    } else {
      toast.info('Use GL!TCH/DRIFT/TUNE buttons to navigate to new tiles');
    }
  };

  const handleSavePolen = async (content: string, tileId: number) => {
    await savePolenEntry(content, tileId, 'text', [activeCompass || 'general', currentSeason]);
    toast.success('Polen saved successfully');
  };

  // Compass change handler
  const handleCompassChange = (compass: CompassType) => {
    setActiveCompass(compass);
  };

  // Handle season completion - continue to next season
  const handleSeasonContinue = () => {
    // Mark current season as completed
    setCompletedSeasons(prev => [...prev, currentSeason]);
    
    // Advance to next season
    const currentIndex = SEASON_ORDER.indexOf(currentSeason);
    if (currentIndex < SEASON_ORDER.length - 1) {
      const nextSeason = SEASON_ORDER[currentIndex + 1];
      setCurrentSeason(nextSeason);
      setJourneyStarted(false);
      setJourneyPath([]);
      setSelectedTile(null);
      toast.success(`Advanced to ${nextSeason} season!`);
    } else {
      // All seasons complete - unlock FREE
      setFreeTilesUnlocked(true);
      toast.success('All seasons complete! FREE tiles unlocked!');
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
        setPrdId(newPrd.id);
      } else {
        // Update existing PRD with new layer
        await supabase
          .from('prds')
          .update({
            [`${SEASON_TO_PRD_FIELD[currentSeason]}_signals_summary`]: data?.content || '',
          })
          .eq('id', prdId);
      }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border/50">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Calm Magic Board
            </h1>
            <p className="text-sm text-muted-foreground">
              Turn "something feels off" moments into gentle next steps
            </p>
          </div>
          
          {/* Season Progress Bar */}
          <SeasonProgressBar
            currentSeason={currentSeason}
            seasonProgress={seasonProgress}
            completedSeasons={completedSeasons}
            freeTilesUnlocked={freeTilesUnlocked}
          />

          {/* Journey Controls */}
          <div className="flex items-center gap-2">
            {!journeyStarted ? (
              <Button onClick={handleStartJourney} size="sm" className={`bg-gradient-to-r ${SEASON_COLORS[currentSeason]}`}>
                <Play className="w-4 h-4 mr-1" />
                Start {currentSeason}
              </Button>
            ) : (
              <>
                <Badge variant="outline" className="text-sm px-2 py-0.5">
                  {visitedTiles.size}/64
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleResetJourney}>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset Season
                </Button>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {prdId && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/prds/${prdId}`)}>
                <FileText className="w-4 h-4 mr-1" />
                View PRD
              </Button>
            )}
            <Button 
              variant={showPolenBrowser ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowPolenBrowser(!showPolenBrowser)}
            >
              <Library className="w-4 h-4 mr-1" />
              Polen
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/calm-magic-board/events')}>
              <Calendar className="w-4 h-4 mr-1" />
              Journal
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/calm-magic-board/drift')}>
              <Sparkles className="w-4 h-4 mr-1" />
              Drift → PRD
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content: Split Layout */}
      <div className="flex-1 min-h-0 flex">
        {/* Left Panel: Tile Matrix - Always visible, scrollable */}
        <div className={`${selectedTile || showPolenBrowser ? 'flex-1' : 'w-full'} p-8 overflow-auto transition-all duration-300 flex items-center justify-center`}>
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
              freeTilesUnlocked={freeTilesUnlocked}
            />
          </div>
        </div>

        {/* Polen Browser Panel */}
        {showPolenBrowser && !selectedTile && (
          <div className="w-[400px] max-w-[40vw] shrink-0 border-l border-border/50 animate-in slide-in-from-right duration-300">
            <PolenBrowserPanel 
              onClose={() => setShowPolenBrowser(false)}
              onTileClick={(row, col) => {
                setSelectedTile({ row, col });
                setShowPolenBrowser(false);
              }}
            />
          </div>
        )}

        {/* Right Panel: Tile Detail - Slides in when tile selected */}
        {selectedTile && (
          <div className="w-[400px] max-w-[40vw] shrink-0 border-l border-border/50 animate-in slide-in-from-right duration-300">
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
    </div>
  );
};

export default CalmMagicBoard;