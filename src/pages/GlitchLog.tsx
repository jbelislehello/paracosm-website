import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { Tile } from '@/types/glitch';

const GlitchLog = () => {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadTiles();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
  };

  const loadTiles = async () => {
    try {
      const { data, error } = await supabase
        .from('tiles')
        .select('*')
        .order('id');

      if (error) throw error;
      setTiles(data || []);
    } catch (error) {
      console.error('Error loading tiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTilesByBoard = (board: string) => {
    return tiles.filter(t => t.board === board && t.row !== null);
  };

  const getBoardColor = (board: string) => {
    switch (board) {
      case 'LOVE': return 'bg-rose-500/20 border-rose-500';
      case 'MAGIC': return 'bg-purple-500/20 border-purple-500';
      case 'CALM': return 'bg-blue-500/20 border-blue-500';
      case 'OPEN': return 'bg-green-500/20 border-green-500';
      case 'FREE': return 'bg-amber-500/20 border-amber-500';
      default: return 'bg-muted border-border';
    }
  };

  const getProcessStateBadgeColor = (state: string) => {
    switch (state) {
      case 'GLITCH': return 'bg-red-500/20 text-red-700 border-red-500';
      case 'DRIFT': return 'bg-purple-500/20 text-purple-700 border-purple-500';
      case 'TUNE': return 'bg-blue-500/20 text-blue-700 border-blue-500';
      case 'FREE': return 'bg-green-500/20 text-green-700 border-green-500';
      default: return 'bg-muted';
    }
  };

  const renderBoard = (board: string) => {
    const boardTiles = getTilesByBoard(board);
    const gridSize = 8;
    
    // Create 8x8 grid
    const grid: (Tile | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    
    // Place tiles in grid
    boardTiles.forEach(tile => {
      if (tile.row !== null && tile.col !== null) {
        grid[tile.row - 1][tile.col - 1] = tile;
      }
    });

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getBoardColor(board).split(' ')[0].replace('/20', '')}`} />
          {board}
        </h3>
        
        <div className="flex gap-4 max-w-2xl">
          {/* Y-axis: Velocity */}
          <div className="flex flex-col justify-between py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <span className="writing-mode-vertical transform rotate-180">Velocity</span>
            </div>
            <div className="text-center text-[10px] space-y-1">
              <div>8</div>
              <div>7</div>
              <div>6</div>
              <div>5</div>
              <div>4</div>
              <div>3</div>
              <div>2</div>
              <div>1</div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-8 gap-1">
              {grid.map((row, rowIdx) => 
                row.map((tile, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => tile && setSelectedTile(tile)}
                    className={`
                      aspect-square border-2 rounded flex items-center justify-center text-xs p-1 cursor-pointer transition-all
                      ${tile ? getBoardColor(board) : 'bg-muted/30 border-muted'}
                      ${selectedTile?.id === tile?.id ? 'ring-2 ring-primary scale-105' : ''}
                      ${tile ? 'hover:scale-110 hover:shadow-md' : ''}
                    `}
                  >
                    {tile && (
                      <div className="text-center">
                        <div className="font-mono text-[10px]">{tile.id}</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* X-axis: Longevity */}
            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
              <div className="text-center text-[10px]">1</div>
              <div className="text-center text-[10px]">2</div>
              <div className="text-center text-[10px]">3</div>
              <div className="text-center text-[10px]">4</div>
              <div className="text-center text-[10px]">5</div>
              <div className="text-center text-[10px]">6</div>
              <div className="text-center text-[10px]">7</div>
              <div className="text-center text-[10px]">8</div>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <span>Longevity</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 max-w-2xl">
          <p className="flex items-center gap-2">
            <ArrowUp className="h-3 w-3" />
            <span><strong>Higher velocity:</strong> More immediate, novel goals & faster systems</span>
          </p>
          <p className="flex items-center gap-2">
            <ArrowRight className="h-3 w-3" />
            <span><strong>Higher longevity:</strong> More memory, sustained patterns & long-term tolerance</span>
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-pulse text-foreground">Loading tiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-12 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/glitch-compass')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Log a Glitch</h1>
            <p className="text-muted-foreground">Select a tile to capture your glitch</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tile Boards */}
          <div className="lg:col-span-2 space-y-8">
            {['LOVE', 'MAGIC', 'CALM', 'OPEN'].map(board => renderBoard(board))}
          </div>

          {/* Process State Flow & Selected Tile Info */}
          <div className="space-y-6">
            {/* Process State Flow Diagram */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Process State Flow</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={getProcessStateBadgeColor('GLITCH')}>GLITCH</Badge>
                  <span className="text-sm text-muted-foreground">See the tension</span>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">move up/right</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getProcessStateBadgeColor('DRIFT')}>DRIFT</Badge>
                  <span className="text-sm text-muted-foreground">Explore possibilities</span>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">move down</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getProcessStateBadgeColor('TUNE')}>TUNE</Badge>
                  <span className="text-sm text-muted-foreground">Make adjustments</span>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">eventually</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getProcessStateBadgeColor('FREE')}>FREE</Badge>
                  <span className="text-sm text-muted-foreground">Learning cycle</span>
                </div>
              </div>
            </Card>

            {/* Selected Tile Details */}
            {selectedTile && (
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Tile #{selectedTile.id}</h3>
                  <Badge className={getProcessStateBadgeColor(selectedTile.default_process_state)}>
                    {selectedTile.default_process_state}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Prompt</p>
                    <p className="text-sm italic">"{selectedTile.short_prompt}"</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Board</p>
                    <p className="text-sm font-medium">{selectedTile.board}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Senge Discipline</p>
                    <p className="text-sm font-medium">{selectedTile.senge_discipline.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                </div>

                <Button className="w-full">
                  Log Glitch on This Tile
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlitchLog;
