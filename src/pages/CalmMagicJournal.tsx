import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Zap, Waves, Music, Play, Grid3X3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useExpansionJournal } from '@/hooks/useExpansionJournal';
import { CycleTracker } from '@/components/journal/CycleTracker';
import { TzolkinIntegrator } from '@/components/journal/TzolkinIntegrator';
import { PolenCollector } from '@/components/journal/PolenCollector';
import { DriftWorkspace } from '@/components/journal/DriftWorkspace';
import { TuneWorkshop } from '@/components/journal/TuneWorkshop';
import { WindowOfToleranceOverlay } from '@/components/journal/WindowOfToleranceOverlay';
import { 
  JournalPhase, 
  getChordsPosition, 
  getAgendasLevel, 
  generateContextualQuestion,
  CHORDS_LABELS,
  AGENDAS_LABELS 
} from '@/types/journal-expansion';

const CalmMagicJournal = () => {
  const navigate = useNavigate();
  const {
    currentCycle,
    loading,
    startNewCycle,
    visitTile,
    updatePhase
  } = useExpansionJournal();

  const [user, setUser] = useState<any>(null);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number; id: number } | null>(null);
  const [activeTab, setActiveTab] = useState<JournalPhase>('glitch');

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

  const handlePhaseChange = (phase: JournalPhase) => {
    setActiveTab(phase);
    updatePhase(phase);
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
          innerRadius={currentCycle?.inner_radius || 1.5}
          stretchRadius={currentCycle?.stretch_radius || 2.5}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Matrix & Cycle */}
            <div className="space-y-4">
              {/* Cycle Tracker */}
              <CycleTracker
                currentCycle={currentCycle.cycle_number as 1 | 2 | 3 | 4}
                tilesVisited={currentCycle.tiles_visited?.length || 0}
                phase={currentCycle.phase as JournalPhase}
                integratorsUnlocked={currentCycle.integrator_tiles_unlocked}
                onPhaseClick={handlePhaseChange}
              />

              {/* Tile Matrix */}
              <Card className="bg-background/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    64-Tile Board
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

            {/* Center Column: Contextual Question & Phase Workspace */}
            <div className="lg:col-span-2 space-y-4">
              {/* Contextual Question */}
              {selectedTile && (
                <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/30">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
                        {selectedTile.id}
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">
                            {CHORDS_LABELS[getChordsPosition(selectedTile.col)]}
                          </Badge>
                          <Badge variant="outline">
                            {AGENDAS_LABELS[getAgendasLevel(selectedTile.row)]}
                          </Badge>
                        </div>
                        <p className="text-sm italic text-foreground/90">
                          "{generateContextualQuestion(
                            getChordsPosition(selectedTile.col),
                            getAgendasLevel(selectedTile.row)
                          )}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Phase Workspaces */}
              <Tabs value={activeTab} onValueChange={(v) => handlePhaseChange(v as JournalPhase)}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="glitch" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    GL!TCH
                  </TabsTrigger>
                  <TabsTrigger value="drift" className="flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    DRIFT
                  </TabsTrigger>
                  <TabsTrigger value="tune" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    TUNE
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="glitch" className="mt-4">
                  <PolenCollector selectedTileId={selectedTile?.id} />
                </TabsContent>

                <TabsContent value="drift" className="mt-4">
                  <DriftWorkspace />
                </TabsContent>

                <TabsContent value="tune" className="mt-4">
                  <TuneWorkshop />
                </TabsContent>
              </Tabs>
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
