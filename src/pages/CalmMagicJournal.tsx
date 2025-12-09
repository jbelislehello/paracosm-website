import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Play, Grid3X3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useExpansionJournal } from '@/hooks/useExpansionJournal';
import { CycleTracker } from '@/components/journal/CycleTracker';
import { TzolkinIntegrator } from '@/components/journal/TzolkinIntegrator';
import { TileWorkflow, TileWorkflowData } from '@/components/journal/TileWorkflow';
import { WindowOfToleranceOverlay } from '@/components/journal/WindowOfToleranceOverlay';
import { CompassNavigator } from '@/components/journal/CompassNavigator';
import { JourneyModeSelector } from '@/components/journal/JourneyModeSelector';
import { SpiralQuadrantVisualizer } from '@/components/journal/SpiralQuadrantVisualizer';
import { FeminineSafePRD } from '@/components/journal/FeminineSafePRD';
import { TorusRelationnel } from '@/components/journal/TorusRelationnel';
import { PolenBrowser } from '@/components/journal/PolenBrowser';
import { PolenPatternAnalytics } from '@/components/journal/PolenPatternAnalytics';
import { JournalPhase, CompassType, JourneyMode, TorusPhase, CycleNumber } from '@/types/journal-expansion';
import { getTileContent, COLUMN_LABELS, ROW_LABELS, getColKey, getRowKey } from '@/data/tileContents';

const CalmMagicJournal = () => {
  const navigate = useNavigate();
  const {
    currentCycle,
    noems,
    loading,
    startNewCycle,
    visitTile,
    updatePhase,
    savePolenEntry
  } = useExpansionJournal();

  const [user, setUser] = useState<any>(null);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number; id: number } | null>(null);
  const [journeyMode, setJourneyMode] = useState<JourneyMode>('relational');
  const [activeCompass, setActiveCompass] = useState<CompassType>('narrative');
  const [torusPhase, setTorusPhase] = useState<TorusPhase>('approche');
  
  const selectedTileContent = selectedTile ? getTileContent(selectedTile.id) : null;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/glitch-auth');
      return;
    }
    setUser(user);
  };

  const handleStartCycle = async () => {
    await startNewCycle('LOVE');
  };

  const handleTileClick = (row: number, col: number) => {
    const tileId = (row - 1) * 8 + col;
    setSelectedTile({ row, col, id: tileId });
    visitTile(tileId);
  };

  const handleTileWorkflowComplete = async (data: TileWorkflowData) => {
    await savePolenEntry({
      content: `GL!TCH: ${data.glitchResponse}\n\nDRIFT OPTIONS:\n${data.driftOptions.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nSELECTED: Option ${data.selectedDrift + 1}\n\nTUNE DELIVERABLE:\n${data.tuneDeliverable}`,
      fragment_type: 'text',
      tile_id: data.tileId
    });
  };

  const renderTileMatrix = () => {
    const gridSize = 8;
    const rows = [];

    for (let row = 1; row <= gridSize; row++) {
      const cells = [];
      for (let col = 1; col <= gridSize; col++) {
        const tileId = (row - 1) * 8 + col;
        const isVisited = currentCycle?.tiles_visited?.includes(tileId);
        const isSelected = selectedTile?.id === tileId;
        const isCurrent = currentCycle?.current_tile_id === tileId;

        cells.push(
          <button
            key={`${row}-${col}`}
            onClick={() => handleTileClick(row, col)}
            className={`
              aspect-square rounded-lg text-xs font-medium transition-all
              ${isSelected ? 'ring-2 ring-primary scale-105' : ''}
              ${isCurrent ? 'bg-primary text-primary-foreground' : ''}
              ${isVisited && !isCurrent ? 'bg-primary/30 text-primary' : ''}
              ${!isVisited && !isCurrent ? 'bg-muted/50 hover:bg-muted text-muted-foreground' : ''}
            `}
          >
            {tileId}
          </button>
        );
      }
      rows.push(
        <div key={row} className="grid grid-cols-8 gap-1">
          {cells}
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="space-y-1">
          {rows}
        </div>
        <WindowOfToleranceOverlay
          cycleNumber={(currentCycle?.cycle_number || 1) as CycleNumber}
          currentTile={selectedTile || undefined}
        />
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/glitch-compass')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Calm Magic Journal</h1>
              <p className="text-sm text-muted-foreground">
                GL!TCH → DRIFT → TUNE
              </p>
            </div>
          </div>
          {!currentCycle && (
            <Button onClick={handleStartCycle} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              Start Journey
            </Button>
          )}
        </div>

        {/* Main Content */}
        {currentCycle ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column: Controls & Tools */}
            <div className="space-y-4">
              {/* Journey Mode Selector */}
              <JourneyModeSelector
                mode={journeyMode}
                onModeChange={setJourneyMode}
              />

              {/* Compass Navigator */}
              <CompassNavigator
                activeCompass={activeCompass}
                journeyMode={journeyMode}
                onCompassChange={setActiveCompass}
              />

              {/* Torus Relationnel */}
              <TorusRelationnel
                currentPhase={torusPhase}
                onPhaseChange={setTorusPhase}
              />

              {/* Spiral Quadrants */}
              <SpiralQuadrantVisualizer
                entries={noems}
              />

              {/* Polen Browser */}
              <PolenBrowser cycleId={currentCycle?.id} />

              {/* Pattern Analytics */}
              <PolenPatternAnalytics />
            </div>

            {/* Center Column: Matrix & Cycle */}
            <div className="space-y-4">
              {/* Cycle Tracker */}
              <CycleTracker
                currentCycle={currentCycle.cycle_number as 1 | 2 | 3 | 4}
                tilesVisited={currentCycle.tiles_visited?.length || 0}
                phase={currentCycle.phase as JournalPhase}
                integratorsUnlocked={currentCycle.integrator_tiles_unlocked}
                onPhaseClick={(phase) => updatePhase(phase)}
              />

              {/* Tile Matrix */}
              <Card className="bg-background/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    64-Tile Board (Cycle {currentCycle.cycle_number}/4)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderTileMatrix()}

                  {/* Axis Labels */}
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>← Chances</span>
                    <span className="font-medium">CHORDSM(S) → Longevity</span>
                    <span>Systems →</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tzolkin Integration */}
              {selectedTile && (
                <TzolkinIntegrator tileId={selectedTile.id} />
              )}
            </div>

            {/* Right Column: Tile Workflow */}
            <div className="lg:col-span-2 space-y-4">
              {selectedTileContent ? (
                <>
                  <TileWorkflow 
                    tile={selectedTileContent}
                    compass={activeCompass}
                    journeyMode={journeyMode}
                    cycleId={currentCycle?.id}
                    onComplete={handleTileWorkflowComplete}
                  />
                  {/* Feminine-Safe PRD Panel */}
                  <FeminineSafePRD showThreats={true} />
                </>
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="py-12 text-center">
                    <Grid3X3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Tile</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on any tile in the 64-tile board to begin the GL!TCH → DRIFT → TUNE workflow.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* No Active Cycle */
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-500 flex items-center justify-center">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Begin Your Journey</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  The Calm Magic Journal guides you through 64 tiles across 4 cycles, 
                  expanding your window of tolerance and crystallizing insights into action.
                </p>
              </div>

              {/* Journey Mode Selection */}
              <div className="max-w-xs mx-auto">
                <JourneyModeSelector
                  mode={journeyMode}
                  onModeChange={setJourneyMode}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleStartCycle} size="lg" disabled={loading}>
                  <Play className="h-5 w-5 mr-2" />
                  Start Cycle 1
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/glitch-compass')}>
                  Back to Compass
                </Button>
              </div>
              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong>GL!TCH</strong> → Capture anomalies as Polen<br />
                  <strong>DRIFT</strong> → Let patterns emerge as Noems<br />
                  <strong>TUNE</strong> → Shape narratives as Poems
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CalmMagicJournal;
