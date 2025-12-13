import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import CosmologicalP5Canvas from './CosmologicalP5Canvas';
import CastleWavespellNavigator from './CastleWavespellNavigator';
import CosmologicalContextTab from './CosmologicalContextTab';
import { 
  getTileCosmology, 
  getKinForTile,
  CASTLES,
  PORTAL_DAYS 
} from '@/data/cosmologicalMapping';
import { Sparkles, Grid3X3, Map, Info, X } from 'lucide-react';

interface CosmologicalBoardOverlayProps {
  season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  selectedTile?: { row: number; col: number } | null;
  visitedTiles?: Set<string>;
  onTileClick?: (row: number, col: number) => void;
  onDiagonalMove?: (row: number, col: number) => void;
  onClose?: () => void;
}

const CosmologicalBoardOverlay = ({
  season,
  selectedTile,
  visitedTiles = new Set(),
  onTileClick,
  onDiagonalMove,
  onClose,
}: CosmologicalBoardOverlayProps) => {
  const [showP5Canvas, setShowP5Canvas] = useState(true);
  const [diagonalPathActive, setDiagonalPathActive] = useState<{
    from: { row: number; col: number };
    to: { row: number; col: number };
  } | null>(null);
  const [activeTab, setActiveTab] = useState('canvas');

  const currentCastle = CASTLES.find(c => c.season === season);
  const selectedTileId = selectedTile ? selectedTile.row * 8 + selectedTile.col + 1 : null;
  const selectedCosmology = selectedTileId ? getTileCosmology(selectedTileId, season) : null;

  const handleDiagonalMove = (toRow: number, toCol: number) => {
    if (selectedTile) {
      // Animate the diagonal path
      setDiagonalPathActive({
        from: selectedTile,
        to: { row: toRow, col: toCol },
      });
      
      // After animation, trigger the actual move
      setTimeout(() => {
        onDiagonalMove?.(toRow, toCol);
        setDiagonalPathActive(null);
      }, 500);
    }
  };

  // Count portal days in current season
  const seasonPortals = PORTAL_DAYS.filter(kin => {
    const castle = CASTLES.find(c => c.season === season);
    return castle && kin >= castle.kinRange[0] && kin <= castle.kinRange[1];
  });

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentCastle?.color }}
            />
            <h2 className="font-bold text-lg">Cosmological Navigation</h2>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              {currentCastle?.name}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="p5-canvas"
                checked={showP5Canvas}
                onCheckedChange={setShowP5Canvas}
              />
              <Label htmlFor="p5-canvas" className="text-sm">
                Animated View
              </Label>
            </div>
            
            <Badge variant="outline" className="gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              {seasonPortals.length} Portal Days
            </Badge>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Canvas/Grid */}
          <div className="flex-1 p-4 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="mb-4">
                <TabsTrigger value="canvas" className="gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Board View
                </TabsTrigger>
                <TabsTrigger value="navigator" className="gap-2">
                  <Map className="w-4 h-4" />
                  Castle Navigator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="canvas" className="flex-1">
                {showP5Canvas ? (
                  <CosmologicalP5Canvas
                    season={season}
                    selectedTile={selectedTile}
                    visitedTiles={visitedTiles}
                    onTileClick={onTileClick}
                    diagonalPathActive={diagonalPathActive}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <Grid3X3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enable "Animated View" to see the cosmological canvas</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="navigator" className="flex-1">
                <CastleWavespellNavigator
                  currentSeason={season}
                  currentKin={selectedCosmology?.kin}
                  onKinSelect={(kin) => {
                    // Convert kin to tile position
                    const castle = CASTLES.find(c => c.season === season);
                    if (castle) {
                      const kinInCastle = kin - castle.kinRange[0];
                      const tileIndex = Math.floor(kinInCastle * (64 / 52));
                      const row = Math.floor(tileIndex / 8);
                      const col = tileIndex % 8;
                      onTileClick?.(row, col);
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Tile Context */}
          <div className="w-96 border-l border-border/50 bg-muted/20">
            <ScrollArea className="h-full">
              <div className="p-4">
                {selectedTileId && selectedCosmology ? (
                  <CosmologicalContextTab
                    tileId={selectedTileId}
                    season={season}
                    onDiagonalMove={handleDiagonalMove}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a tile to view its cosmological context</p>
                    <p className="text-xs mt-2">
                      Click on the board to explore I Ching hexagrams and Tzolkin kins
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer - Legend */}
        <div className="p-3 border-t border-border/50 bg-muted/30">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-purple-500" />
              <span>Portal Day (diagonal allowed)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/30" />
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/50" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">☯</span>
              <span>Hexagram number shown on tiles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosmologicalBoardOverlay;
