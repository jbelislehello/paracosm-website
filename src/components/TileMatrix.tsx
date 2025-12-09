import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowRight, ArrowDown, BookOpen, Workflow, Sparkles, Gamepad2, Users, Circle, Target, LogIn, Save, Loader2, Library } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTileMatrixPersistence } from '@/hooks/useTileMatrixPersistence';
import PolenBrowserPanel from './PolenBrowserPanel';

type CompassType = 'narrative' | 'workflow' | 'inquiry' | 'playground' | 'human-dynamics';
type TolerancePass = 1 | 2 | 3 | 4;

const COMPASSES: { id: CompassType; name: string; description: string; icon: React.ElementType; color: string }[] = [
  { id: 'narrative', name: 'Narrative', description: 'Story & diegetic framing', icon: BookOpen, color: 'from-rose-500 to-pink-500' },
  { id: 'workflow', name: 'Workflow', description: 'Process & methods', icon: Workflow, color: 'from-blue-500 to-cyan-500' },
  { id: 'inquiry', name: 'Inquiry & Practices', description: 'Contemplative & ritual', icon: Sparkles, color: 'from-amber-500 to-orange-500' },
  { id: 'playground', name: 'Playground', description: 'Experimentation & play', icon: Gamepad2, color: 'from-green-500 to-emerald-500' },
  { id: 'human-dynamics', name: 'Human Dynamics', description: 'Relational & systemic', icon: Users, color: 'from-purple-500 to-indigo-500' },
];

const TOLERANCE_PASSES: { pass: TolerancePass; name: string; zone: string; description: string; color: string; tiles: number }[] = [
  { pass: 1, name: 'Inner', zone: 'Safe', description: 'Core 4×4 center tiles', color: 'bg-green-500', tiles: 16 },
  { pass: 2, name: 'Stretch', zone: 'Growth', description: 'Expanding to 6×6 ring', color: 'bg-blue-500', tiles: 20 },
  { pass: 3, name: 'Edge', zone: 'Challenge', description: 'Approaching 8×8 boundary', color: 'bg-amber-500', tiles: 16 },
  { pass: 4, name: 'Full Board', zone: 'Integration', description: 'Complete 8×8 + integrators', color: 'bg-purple-500', tiles: 12 },
];

interface TileMatrixProps {
  board?: 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
  onTileClick?: (row: number, col: number) => void;
}

const TileMatrix = ({ board = 'LOVE', onTileClick }: TileMatrixProps) => {
  const {
    user,
    currentCycle,
    loading,
    saving,
    recentlySyncedTiles,
    recentlySyncedPolen,
    startNewCycle,
    visitTile,
    savePolenEntry,
    getVisitedTilesSet,
    isAuthenticated
  } = useTileMatrixPersistence(board);

  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const [activeCompass, setActiveCompass] = useState<CompassType | null>(null);
  const [currentPass, setCurrentPass] = useState<TolerancePass>(1);
  const [localVisitedTiles, setLocalVisitedTiles] = useState<Set<string>>(new Set());
  const [showToleranceView, setShowToleranceView] = useState(false);
  const [polenContent, setPolenContent] = useState('');
  const [showPolenForm, setShowPolenForm] = useState(false);
  const [showPolenBrowser, setShowPolenBrowser] = useState(false);

  // Sync visited tiles from Supabase
  useEffect(() => {
    if (currentCycle) {
      setLocalVisitedTiles(getVisitedTilesSet());
    }
  }, [currentCycle, getVisitedTilesSet]);

  // Merge local and persisted visited tiles
  const visitedTiles = localVisitedTiles;
  
  // Corrected row labels: MAGIC integration (M/A/G/I/C) + N/S/P+A
  const rowLabels = [
    { letter: 'M', name: 'Mindsets', stage: 'AGENDAS', magic: true },
    { letter: 'A', name: 'Agilities', stage: 'AGENDAS', magic: true },
    { letter: 'G', name: 'Goals', stage: 'AGENDAS', magic: true },
    { letter: 'I', name: 'Intuition', stage: 'LENS', magic: true },
    { letter: 'C', name: 'Compasses', stage: 'LENS', magic: true },
    { letter: 'N', name: 'Norms', stage: 'ABOVE', connectsTo: 'Methods' },
    { letter: 'S', name: 'Synergies', stage: 'ABOVE' },
    { letter: 'P+A', name: 'Protocols & Architectures', stage: 'ABOVE', connectsTo: 'Systems' },
  ];
  
  // Corrected column labels: CHORDS + MAPS (Methods & Systems)
  const colLabels = [
    { letter: 'C', name: 'Chances' },
    { letter: 'H', name: 'Heart' },
    { letter: 'O', name: 'Observer' },
    { letter: 'R', name: 'Reversal' },
    { letter: 'D', name: 'Design' },
    { letter: 'S', name: 'Seeds' },
    { letter: 'M', name: 'Methods' },
    { letter: 'S', name: 'Systems' },
  ];
  
  const rowStages = [
    { name: 'AGENDAS', subtitle: 'M/A/G from MAGIC', rows: [0, 1, 2], color: 'from-amber-500/20 to-orange-500/20' },
    { name: 'LENS', subtitle: 'I/C from MAGIC', rows: [3, 4], color: 'from-blue-500/20 to-cyan-500/20' },
    { name: 'ABOVE MAGIC', subtitle: 'N/S/P+A', rows: [5, 6, 7], color: 'from-purple-500/20 to-indigo-500/20' },
  ];

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

  const isMapsBoundary = (row: number, col: number) => {
    return row >= 5 || col >= 6;
  };

  const hasCrossConnection = (row: number, col: number) => {
    // Norms (row 5) connects to Methods (col 6)
    if (row === 5 && col === 6) return 'norms-methods';
    // P+A (row 7) connects to Systems (col 7)
    if (row === 7 && col === 7) return 'pa-systems';
    return null;
  };

  // Determine which tolerance zone a tile belongs to
  const getTileTolerancePass = (row: number, col: number): TolerancePass => {
    // Inner 4×4 (rows 2-5, cols 2-5) = Pass 1
    if (row >= 2 && row <= 5 && col >= 2 && col <= 5) return 1;
    // 6×6 ring (rows 1-6, cols 1-6 minus inner) = Pass 2
    if (row >= 1 && row <= 6 && col >= 1 && col <= 6) return 2;
    // Edge ring (remaining non-corner) = Pass 3
    const isCorner = (row === 0 || row === 7) && (col === 0 || col === 7);
    if (!isCorner) return 3;
    // Corners (integrators) = Pass 4
    return 4;
  };

  const isTileAccessible = (row: number, col: number): boolean => {
    const tilePass = getTileTolerancePass(row, col);
    return tilePass <= currentPass;
  };

  const handleTileClick = async (row: number, col: number) => {
    if (!isTileAccessible(row, col) && showToleranceView) return;
    setSelectedTile({ row, col });
    const tileKey = `${row}-${col}`;
    
    // Update local state
    setLocalVisitedTiles(prev => new Set([...prev, tileKey]));
    
    // Persist to Supabase if authenticated and cycle exists
    if (isAuthenticated && currentCycle) {
      await visitTile(row, col);
    }
    
    onTileClick?.(row, col);
  };

  const handleSavePolen = async () => {
    if (!polenContent.trim() || !selectedTile) return;
    
    const tileId = selectedTile.row * 8 + selectedTile.col + 1;
    await savePolenEntry(polenContent, tileId, 'text', [activeCompass || 'general']);
    setPolenContent('');
    setShowPolenForm(false);
  };

  const handleStartCycle = async () => {
    const cycleNumber = currentCycle ? currentCycle.cycle_number + 1 : 1;
    await startNewCycle(cycleNumber);
  };

  // Progress calculation
  const getTilesInPass = (pass: TolerancePass): string[] => {
    const tiles: string[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (getTileTolerancePass(r, c) === pass) {
          tiles.push(`${r}-${c}`);
        }
      }
    }
    return tiles;
  };

  const getPassProgress = (pass: TolerancePass) => {
    const tilesInPass = getTilesInPass(pass);
    const visited = tilesInPass.filter(t => visitedTiles.has(t)).length;
    return { visited, total: tilesInPass.length, percent: tilesInPass.length > 0 ? (visited / tilesInPass.length) * 100 : 0 };
  };

  // GL!TCH→DRIFT→TUNE movement pattern from selected tile
  const getMovementTiles = () => {
    if (!selectedTile) return null;
    const { row, col } = selectedTile;
    return {
      glitch: row > 0 ? { row: row - 1, col } : null, // UP
      drift: col < 7 ? { row, col: col + 1 } : null,   // RIGHT
      tune: row < 7 ? { row: row + 1, col } : null,    // DOWN (integration)
    };
  };

  const movementTiles = getMovementTiles();

  const isMovementTile = (row: number, col: number) => {
    if (!movementTiles) return null;
    if (movementTiles.glitch?.row === row && movementTiles.glitch?.col === col) return 'glitch';
    if (movementTiles.drift?.row === row && movementTiles.drift?.col === col) return 'drift';
    if (movementTiles.tune?.row === row && movementTiles.tune?.col === col) return 'tune';
    return null;
  };

  // Generate contextual questions based on tile position and compass
  const getContextualQuestions = (row: number, col: number, compass: CompassType | null) => {
    const rowInfo = rowLabels[row];
    const colInfo = colLabels[col];
    const compassName = compass ? COMPASSES.find(c => c.id === compass)?.name : 'General';
    
    const rowContext = rowInfo.name.toLowerCase();
    const colContext = colInfo.name.toLowerCase();
    
    // Compass-specific question framing
    const compassFraming: Record<CompassType, { glitch: string; drift: string; tune: string }> = {
      narrative: {
        glitch: 'What story feels incomplete or stuck',
        drift: 'What narrative possibilities emerge',
        tune: 'How does this story want to be told'
      },
      workflow: {
        glitch: 'What process friction exists',
        drift: 'What workflow alternatives could we try',
        tune: 'What method best integrates here'
      },
      inquiry: {
        glitch: 'What deeper question is arising',
        drift: 'What practices might illuminate this',
        tune: 'What ritual or reflection crystallizes insight'
      },
      playground: {
        glitch: 'What feels rigid or unfun',
        drift: 'What playful experiments could we try',
        tune: 'What game or experiment yields the most learning'
      },
      'human-dynamics': {
        glitch: 'What relational tension is present',
        drift: 'What systemic patterns might be at play',
        tune: 'How do we integrate individual and collective needs'
      }
    };
    
    const frame = compass ? compassFraming[compass] : {
      glitch: 'What feels off or alive',
      drift: 'What options emerge',
      tune: 'What integration is needed'
    };
    
    return {
      glitch: `${frame.glitch} in your ${rowContext} around ${colContext}?`,
      drift: `${frame.drift} when exploring ${colContext} through ${rowContext}?`,
      tune: `${frame.tune} for ${rowContext} × ${colContext}?`,
      deliverable: getDeliverable(row, col)
    };
  };

  // Get expected deliverable for tile
  const getDeliverable = (row: number, col: number) => {
    const deliverables: Record<string, string> = {
      '0-0': 'Reframed belief statement',
      '0-1': 'Emotional anchor phrase',
      '0-2': 'Observer stance description',
      '0-3': 'Inverted assumption',
      '0-4': 'Design principle',
      '0-5': 'Seed conversation script',
      '1-0': 'Quick experiment (< 60 min)',
      '1-1': 'Heart-led action step',
      '1-2': 'Observation practice',
      '1-3': 'Opposite test',
      '1-4': 'Prototype sketch',
      '1-5': 'Movement pattern',
      '2-0': 'Risk-aware goal',
      '2-1': 'Heart-aligned outcome',
      '2-2': 'Measurable indicator',
      '2-3': 'Counter-goal exploration',
      '2-4': 'Designed milestone',
      '2-5': 'Goal seed artifact',
      '3-0': 'Landscape scan',
      '3-1': 'Emotional terrain map',
      '3-2': 'Field observation',
      '3-3': 'Hidden pattern',
      '3-4': 'Designed lens',
      '3-5': 'Fertility assessment',
      '4-0': 'Energy reading',
      '4-1': 'Heart compass calibration',
      '4-2': 'Witness stance',
      '4-3': 'Shadow/light flip',
      '4-4': 'Compass design',
      '4-5': 'Energy seed',
      '5-0': 'Chance-taking norm',
      '5-1': 'Care norm',
      '5-2': 'Observation norm',
      '5-3': 'Challenge norm',
      '5-4': 'Design norm',
      '5-5': 'Seeding norm',
      '5-6': 'Method-norm link',
      '6-0': 'Synergy opportunity',
      '6-1': 'Heart connection',
      '6-2': 'Systemic insight',
      '6-3': 'Tension integration',
      '6-4': 'Design synthesis',
      '6-5': 'Cross-pollination',
      '7-0': 'Risk protocol',
      '7-1': 'Care protocol',
      '7-2': 'Observation protocol',
      '7-3': 'Pivot protocol',
      '7-4': 'Design blueprint',
      '7-5': 'Pilot kit',
      '7-6': 'SOP draft',
      '7-7': 'System architecture'
    };
    return deliverables[`${row}-${col}`] || 'Tile insight';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading your progress...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Auth & Cycle Status Bar */}
      <Card className="p-4 flex items-center justify-between bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                <Save className="w-3 h-3 mr-1" />
                Auto-saving
              </Badge>
              {currentCycle ? (
                <span className="text-sm text-muted-foreground">
                  Cycle {currentCycle.cycle_number} • {currentCycle.tiles_visited?.length || 0}/64 tiles • Phase: {currentCycle.phase}
                </span>
              ) : (
                <Button size="sm" variant="outline" onClick={handleStartCycle} disabled={saving}>
                  {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                  Start New Cycle
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LogIn className="w-4 h-4" />
              <span>Log in to save your progress</span>
              <a href="/glitch-auth" className="text-primary hover:underline">Sign in</a>
            </div>
          )}
        </div>
        {saving && (
          <Badge variant="outline" className="animate-pulse">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Saving...
          </Badge>
        )}
      </Card>

      {/* Board Header */}
      <div className="text-center space-y-2">
        <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getBoardColor(board)} text-white font-bold text-xl`}>
          {board} Board
        </div>
        <p className="text-muted-foreground text-sm">8×8 Tile Matrix • MAGIC Integration • Click a tile to see movement pattern</p>
        <button
          onClick={() => setShowToleranceView(!showToleranceView)}
          className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showToleranceView
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          {showToleranceView ? 'Hide' : 'Show'} Window of Tolerance
        </button>
        <button
          onClick={() => setShowPolenBrowser(!showPolenBrowser)}
          className={`mt-2 ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showPolenBrowser
              ? 'bg-amber-500 text-white'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Library className="w-4 h-4 inline mr-2" />
          {showPolenBrowser ? 'Hide' : 'Browse'} POLEN
        </button>
      </div>

      {/* POLEN Browser */}
      {showPolenBrowser && (
        <PolenBrowserPanel 
          onClose={() => setShowPolenBrowser(false)}
          onTileClick={(row, col) => {
            setSelectedTile({ row, col });
            setShowPolenBrowser(false);
          }}
        />
      )}

      {/* Window of Tolerance Expansion Visualization */}
      {showToleranceView && (
        <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Window of Tolerance Expansion
            </h3>
            <Badge variant="outline" className="text-primary">
              Cycle: 4 passes × 64 tiles = 256 + 4 integrators
            </Badge>
          </div>

          {/* Pass Selector */}
          <div className="flex gap-2 mb-6">
            {TOLERANCE_PASSES.map((passInfo) => (
              <button
                key={passInfo.pass}
                onClick={() => setCurrentPass(passInfo.pass)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  currentPass === passInfo.pass
                    ? `${passInfo.color} text-white border-transparent`
                    : currentPass >= passInfo.pass
                      ? 'bg-muted border-border'
                      : 'bg-muted/50 border-dashed border-border/50 opacity-50'
                }`}
              >
                <div className="text-xs font-bold">Pass {passInfo.pass}</div>
                <div className="text-[10px]">{passInfo.name}</div>
              </button>
            ))}
          </div>

          {/* Concentric Rectangle Visualization */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-64">
              {/* Pass 4 - Full Board (outermost) */}
              <div className={`absolute inset-0 rounded-lg border-4 transition-all ${
                currentPass >= 4 ? 'border-purple-500 bg-purple-500/10' : 'border-dashed border-muted-foreground/30'
              }`}>
                <span className="absolute -top-3 left-2 text-[10px] bg-background px-1 text-purple-500">Pass 4: Full</span>
              </div>
              {/* Pass 3 - Edge */}
              <div className={`absolute inset-4 rounded-lg border-4 transition-all ${
                currentPass >= 3 ? 'border-amber-500 bg-amber-500/10' : 'border-dashed border-muted-foreground/30'
              }`}>
                <span className="absolute -top-3 left-2 text-[10px] bg-background px-1 text-amber-500">Pass 3: Edge</span>
              </div>
              {/* Pass 2 - Stretch */}
              <div className={`absolute inset-10 rounded-lg border-4 transition-all ${
                currentPass >= 2 ? 'border-blue-500 bg-blue-500/10' : 'border-dashed border-muted-foreground/30'
              }`}>
                <span className="absolute -top-3 left-2 text-[10px] bg-background px-1 text-blue-500">Pass 2: Stretch</span>
              </div>
              {/* Pass 1 - Inner (innermost) */}
              <div className={`absolute inset-16 rounded-lg border-4 transition-all ${
                currentPass >= 1 ? 'border-green-500 bg-green-500/20' : 'border-dashed border-muted-foreground/30'
              }`}>
                <span className="absolute -top-3 left-0 text-[10px] bg-background px-1 text-green-500">Pass 1: Inner</span>
                <div className="flex items-center justify-center h-full">
                  <Circle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              {/* Corner integrators */}
              {currentPass >= 4 && (
                <>
                  <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
                </>
              )}
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Progress by Pass</h4>
            {TOLERANCE_PASSES.map((passInfo) => {
              const progress = getPassProgress(passInfo.pass);
              return (
                <div key={passInfo.pass} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={currentPass >= passInfo.pass ? '' : 'opacity-50'}>
                      <span className={`inline-block w-3 h-3 rounded-full ${passInfo.color} mr-2`} />
                      {passInfo.name}: {passInfo.description}
                    </span>
                    <span className="text-muted-foreground">
                      {progress.visited}/{progress.total} tiles
                    </span>
                  </div>
                  <Progress 
                    value={progress.percent} 
                    className={`h-2 ${currentPass >= passInfo.pass ? '' : 'opacity-30'}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Total Progress */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Expansion Progress</span>
              <Badge className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white">
                {visitedTiles.size}/64 tiles visited
              </Badge>
            </div>
            <Progress value={(visitedTiles.size / 64) * 100} className="h-3 mt-2" />
          </div>
        </Card>
      )}

      {/* 5 Compasses Selector */}
      <Card className="p-4 bg-gradient-to-r from-background to-muted/20">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          5 Compasses (Row C - Lens Layer)
        </h4>
        <div className="flex flex-wrap gap-2">
          {COMPASSES.map((compass) => {
            const Icon = compass.icon;
            const isActive = activeCompass === compass.id;
            return (
              <button
                key={compass.id}
                onClick={() => setActiveCompass(isActive ? null : compass.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-r ${compass.color} text-white border-transparent shadow-lg`
                    : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs font-medium">{compass.name}</div>
                  <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {compass.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {activeCompass && (
          <p className="text-xs text-muted-foreground mt-2">
            Active lens: <span className="font-medium text-primary">{COMPASSES.find(c => c.id === activeCompass)?.name}</span> — 
            Row C (Compasses) tiles will use this interpretive frame
          </p>
        )}
      </Card>

      {/* Matrix Container */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[900px] space-y-4">
          {/* Column Labels */}
          <div className="flex items-center justify-start ml-28 gap-1">
            {colLabels.map((col, idx) => (
              <div
                key={`col-${idx}`}
                className={`w-16 h-14 flex flex-col items-center justify-center font-bold text-xs ${
                  idx >= 6 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-green-500/10 border-green-500/30'
                } border-2 rounded`}
                title={col.name}
              >
                <span className="text-sm">{col.letter}</span>
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">{col.name}</span>
              </div>
            ))}
          </div>

          {/* CHORDS/MAPS Dimension Labels */}
          <div className="flex items-center justify-start ml-28 gap-1 mb-2">
            <div className="w-[384px] h-8 flex items-center justify-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded text-xs font-semibold">
              CHORDS (Chances • Heart • Observer • Reversal • Design • Seeds)
            </div>
            <div className="w-[132px] h-8 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30 rounded text-xs font-semibold">
              MAPS (M • S)
            </div>
          </div>

          {/* Matrix Grid */}
          {rowStages.map((stage) => (
            <div key={stage.name} className="space-y-1">
              {/* Stage Label */}
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`w-32 justify-center bg-gradient-to-r ${stage.color} text-xs`}>
                  <div className="flex flex-col items-center leading-tight">
                    <span className="font-bold">{stage.name}</span>
                    <span className="text-[9px] opacity-70">{stage.subtitle}</span>
                  </div>
                </Badge>
              </div>

              {/* Rows in this stage */}
              {stage.rows.map((rowIdx) => {
                const rowInfo = rowLabels[rowIdx];
                return (
                  <div key={`row-${rowIdx}`} className="flex items-center gap-1">
                    {/* Row Label */}
                    <div 
                      className={`w-24 h-16 flex flex-col items-center justify-center font-bold border-2 rounded text-xs transition-all ${
                        rowInfo.magic 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                          : 'bg-amber-500/10 border-amber-500/30'
                      } ${rowIdx === 4 && activeCompass ? 'ring-2 ring-primary ring-offset-1 animate-pulse' : ''}`}
                      title={rowInfo.connectsTo ? `Connects to ${rowInfo.connectsTo}` : undefined}
                    >
                      <span className="text-lg">{rowInfo.letter}</span>
                      <span className="text-[9px] text-muted-foreground text-center leading-tight">{rowInfo.name}</span>
                      {rowInfo.connectsTo && (
                        <span className="text-[8px] text-purple-400">↔ {rowInfo.connectsTo}</span>
                      )}
                      {rowIdx === 4 && activeCompass && (
                        <span className="text-[8px] text-primary font-bold">
                          {COMPASSES.find(c => c.id === activeCompass)?.name}
                        </span>
                      )}
                    </div>

                    {/* Tiles */}
                    {colLabels.map((_, colIdx) => {
                      const isMaps = isMapsBoundary(rowIdx, colIdx);
                      const crossConnection = hasCrossConnection(rowIdx, colIdx);
                      const isSelected = selectedTile?.row === rowIdx && selectedTile?.col === colIdx;
                      const movement = isMovementTile(rowIdx, colIdx);
                      const tilePass = getTileTolerancePass(rowIdx, colIdx);
                      const isAccessible = isTileAccessible(rowIdx, colIdx);
                      const isVisited = visitedTiles.has(`${rowIdx}-${colIdx}`);
                      const isRecentlySynced = recentlySyncedTiles.has(`${rowIdx}-${colIdx}`);
                      
                      // Tolerance zone colors
                      const getToleranceColor = (pass: TolerancePass) => {
                        switch (pass) {
                          case 1: return 'border-green-500';
                          case 2: return 'border-blue-500';
                          case 3: return 'border-amber-500';
                          case 4: return 'border-purple-500';
                        }
                      };
                      
                      return (
                        <button
                          key={`tile-${rowIdx}-${colIdx}`}
                          onClick={() => handleTileClick(rowIdx, colIdx)}
                          disabled={showToleranceView && !isAccessible}
                          className={`w-16 h-16 border-2 rounded transition-all relative ${
                            showToleranceView && !isAccessible
                              ? 'opacity-30 cursor-not-allowed border-dashed'
                              : 'hover:scale-105 hover:shadow-lg'
                          } ${
                            isSelected
                              ? 'ring-2 ring-primary ring-offset-2 bg-primary/20 border-primary'
                              : showToleranceView
                                ? `${getToleranceColor(tilePass)} ${isVisited ? 'bg-primary/20' : 'bg-muted/30'}`
                                : crossConnection
                                  ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-500/50'
                                  : isMaps
                                    ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/40 hover:border-purple-500'
                                    : `bg-gradient-to-br ${getBoardColor(board)}/10 border-primary/20 hover:border-primary`
                          } ${movement ? 'ring-2 ring-offset-1' : ''} ${
                            movement === 'glitch' ? 'ring-red-500' :
                            movement === 'drift' ? 'ring-blue-500' :
                            movement === 'tune' ? 'ring-green-500' : ''
                          } ${isRecentlySynced ? 'animate-pulse ring-2 ring-cyan-400 ring-offset-1' : ''}`}
                        >
                          <div className="text-xs text-muted-foreground">
                            {rowInfo.letter}{colLabels[colIdx].letter}
                          </div>
                          {/* Sync indicator */}
                          {isRecentlySynced && (
                            <div className="absolute -top-1 -right-1 z-10">
                              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                              <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-500" />
                            </div>
                          )}
                          {showToleranceView && isVisited && (
                            <div className="absolute top-0.5 right-0.5">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            </div>
                          )}
                          {crossConnection && !showToleranceView && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[8px] text-yellow-600 font-bold">↔</span>
                            </div>
                          )}
                          {movement === 'glitch' && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                              <ArrowUp className="w-3 h-3 text-red-500" />
                            </div>
                          )}
                          {movement === 'drift' && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                              <ArrowRight className="w-3 h-3 text-blue-500" />
                            </div>
                          )}
                          {movement === 'tune' && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                              <ArrowDown className="w-3 h-3 text-green-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tile Detail Panel */}
      {selectedTile && (
        <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className={`bg-gradient-to-r ${getBoardColor(board)} text-white`}>
                  {rowLabels[selectedTile.row].letter}{colLabels[selectedTile.col].letter}
                </Badge>
                <h3 className="font-bold text-lg">
                  {rowLabels[selectedTile.row].name} × {colLabels[selectedTile.col].name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Stage: {rowLabels[selectedTile.row].stage} | 
                Lens: {activeCompass ? COMPASSES.find(c => c.id === activeCompass)?.name : 'None selected'}
              </p>
            </div>
            <button 
              onClick={() => setSelectedTile(null)}
              className="text-muted-foreground hover:text-foreground text-xl"
            >
              ×
            </button>
          </div>

          {(() => {
            const questions = getContextualQuestions(selectedTile.row, selectedTile.col, activeCompass);
            return (
              <div className="space-y-4">
                {/* GL!TCH Question */}
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUp className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-red-500">GL!TCH</span>
                    <span className="text-xs text-muted-foreground">— What feels off?</span>
                  </div>
                  <p className="text-sm">{questions.glitch}</p>
                </div>

                {/* DRIFT Question */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-blue-500">DRIFT</span>
                    <span className="text-xs text-muted-foreground">— Explore possibilities</span>
                  </div>
                  <p className="text-sm">{questions.drift}</p>
                </div>

                {/* TUNE Question */}
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDown className="w-4 h-4 text-green-500" />
                    <span className="font-bold text-green-500">TUNE</span>
                    <span className="text-xs text-muted-foreground">— Integrate & crystallize</span>
                  </div>
                  <p className="text-sm">{questions.tune}</p>
                </div>

                {/* Expected Deliverable */}
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Expected Deliverable:</span>
                    <Badge variant="outline" className="text-primary border-primary/50">
                      {questions.deliverable}
                    </Badge>
                  </div>
                </div>

                {/* POLEN Entry Form */}
                <div className="pt-4 border-t border-border/50">
                  {showPolenForm ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-medium text-sm">Capture POLEN (raw fragment)</span>
                      </div>
                      <Textarea
                        placeholder="Write your GL!TCH observation, insight, or fragment..."
                        value={polenContent}
                        onChange={(e) => setPolenContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleSavePolen}
                          disabled={!polenContent.trim() || saving || !isAuthenticated}
                        >
                          {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                          Save Polen
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => { setShowPolenForm(false); setPolenContent(''); }}
                        >
                          Cancel
                        </Button>
                      </div>
                      {!isAuthenticated && (
                        <p className="text-xs text-muted-foreground">
                          <LogIn className="w-3 h-3 inline mr-1" />
                          Log in to save your polen entries
                        </p>
                      )}
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowPolenForm(true)}
                      className="w-full"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Capture Polen for this tile
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
        </Card>
      )}

      {/* Movement Legend */}
      <Card className="p-4 bg-gradient-to-r from-background to-muted/20">
        <h4 className="font-semibold text-sm mb-3">GL!TCH → DRIFT → TUNE Movement Pattern</h4>
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-red-500 bg-red-500/20 flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-red-500" />
            </div>
            <span><strong>GL!TCH</strong> - Move UP (what feels off?)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-blue-500" />
            </div>
            <span><strong>DRIFT</strong> - Move RIGHT (explore options)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-green-500 bg-green-500/20 flex items-center justify-center">
              <ArrowDown className="w-3 h-3 text-green-500" />
            </div>
            <span><strong>TUNE</strong> - Move DOWN (integrate)</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Click any tile to see its movement pattern (inverted L shape)</p>
      </Card>

      {/* Legend */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Matrix Structure - MAGIC Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Vertical (Rows) - MAGIC Deployed</h4>
            <div className="space-y-1 text-muted-foreground">
              <p><strong className="text-purple-400">AGENDAS (1-3):</strong> M/A/G → Mindsets, Agilities, Goals</p>
              <p><strong className="text-purple-400">LENS (4-5):</strong> I/C → Intuition, Compasses (5 families)</p>
              <p className="text-xs italic pl-4 text-purple-300">↳ MAGIC fully deployed by row 5</p>
              <p><strong>ABOVE MAGIC (6-8):</strong> N/S/P+A → Norms, Synergies, Protocols & Architectures</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Horizontal (Columns)</h4>
            <div className="space-y-1 text-muted-foreground">
              <p><strong>CHORDS (1-6):</strong> C/H/O/R/D/S → Chances, Heart, Observer, Reversal, Design, Seeds</p>
              <p><strong>MAPS (7-8):</strong> M/S → Methods, Systems</p>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-medium text-primary">Cross-Connections (Row ↔ Column Resonance)</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong className="text-yellow-500">Norms (Row 6) ↔ Methods (Col 7):</strong> Ways of behaving connected to ways of doing</p>
            <p><strong className="text-yellow-500">P+A (Row 8) ↔ Systems (Col 8):</strong> Protocols/Architectures connected to system structures</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TileMatrix;
