import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TileMatrixProps {
  board?: 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
  onTileClick?: (row: number, col: number) => void;
}

const TileMatrix = ({ board = 'LOVE', onTileClick }: TileMatrixProps) => {
  const rowLabels = ['M', 'A', 'G', 'L', 'E', 'S', 'M', 'A'];
  const colLabels = ['C', 'H', 'O', 'R', 'D', 'S', 'P', 'S'];
  
  const rowStages = [
    { name: 'AGENDAS', rows: [0, 1, 2], color: 'from-amber-500/20 to-orange-500/20' },
    { name: 'LENS', rows: [3, 4, 5], color: 'from-blue-500/20 to-cyan-500/20' },
    { name: 'MAPS', rows: [6, 7], color: 'from-purple-500/20 to-indigo-500/20' }
  ];

  const colDimensions = [
    { name: 'CHORDS', cols: [0, 1, 2, 3, 4, 5], color: 'from-green-500/20 to-emerald-500/20' },
    { name: 'MAPS', cols: [6, 7], color: 'from-purple-500/20 to-indigo-500/20' }
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
    return row >= 6 || col >= 6;
  };

  const getRowStageName = (row: number) => {
    if (row <= 2) return 'AGENDAS';
    if (row <= 5) return 'LENS';
    return 'MAPS';
  };

  const getColDimensionName = (col: number) => {
    return col <= 5 ? 'CHORDS' : 'MAPS';
  };

  return (
    <div className="space-y-8">
      {/* Board Header */}
      <div className="text-center space-y-2">
        <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getBoardColor(board)} text-white font-bold text-xl`}>
          {board} Board
        </div>
        <p className="text-muted-foreground text-sm">8×8 Tile Matrix with MAPS Boundary Frame</p>
      </div>

      {/* Matrix Container */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[800px] space-y-4">
          {/* Column Labels */}
          <div className="flex items-center justify-start ml-24 gap-1">
            {colLabels.map((label, idx) => (
              <div
                key={`col-${idx}`}
                className={`w-16 h-12 flex items-center justify-center font-bold text-sm ${
                  idx >= 6 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-green-500/10 border-green-500/30'
                } border-2 rounded`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* CHORDS/MAPS Dimension Labels */}
          <div className="flex items-center justify-start ml-24 gap-1 mb-2">
            <div className="w-[384px] h-8 flex items-center justify-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded text-xs font-semibold">
              CHORDS
            </div>
            <div className="w-[128px] h-8 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30 rounded text-xs font-semibold">
              MAPS
            </div>
          </div>

          {/* Matrix Grid */}
          {rowStages.map((stage) => (
            <div key={stage.name} className="space-y-1">
              {/* Stage Label */}
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`w-20 justify-center bg-gradient-to-r ${stage.color}`}>
                  {stage.name}
                </Badge>
              </div>

              {/* Rows in this stage */}
              {stage.rows.map((rowIdx) => (
                <div key={`row-${rowIdx}`} className="flex items-center gap-1">
                  {/* Row Label */}
                  <div className={`w-20 h-16 flex items-center justify-center font-bold border-2 rounded ${
                    rowIdx >= 6 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    {rowLabels[rowIdx]}
                  </div>

                  {/* Tiles */}
                  {colLabels.map((_, colIdx) => {
                    const isMaps = isMapsBoundary(rowIdx, colIdx);
                    return (
                      <button
                        key={`tile-${rowIdx}-${colIdx}`}
                        onClick={() => onTileClick?.(rowIdx, colIdx)}
                        className={`w-16 h-16 border-2 rounded transition-all hover:scale-105 hover:shadow-lg ${
                          isMaps
                            ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/40 hover:border-purple-500'
                            : `bg-gradient-to-br ${getBoardColor(board)}/10 border-primary/20 hover:border-primary`
                        }`}
                      >
                        <div className="text-xs text-muted-foreground">
                          {rowLabels[rowIdx]}{colLabels[colIdx]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Matrix Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Vertical (Rows)</h4>
            <div className="space-y-1 text-muted-foreground">
              <p><strong>AGENDAS (1-3):</strong> M/A/G → Mindsets, Agilities, Goals</p>
              <p><strong>LENS (4-6):</strong> L/E/S → Landscape, Energy, Synergies</p>
              <p className="text-xs italic pl-4">↳ MAGIC fully deployed by row 5, then Synergies (row 6) moves above</p>
              <p><strong>MAPS (7-8):</strong> M/A → Methodology, Architecture</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Horizontal (Columns)</h4>
            <div className="space-y-1 text-muted-foreground">
              <p><strong>CHORDS (1-6):</strong> C/H/O/R/D/S → Chances, Heart, Observer, Reversal, Design, Seeds</p>
              <p><strong>MAPS (7-8):</strong> P/S → Protocols, Systems</p>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-medium text-primary">MAGIC Integration & Progression</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>MAGIC deployed (rows 1-5):</strong> M (row 1), A (row 2), G (row 3), I (within L at row 4), C (within E at row 5)</p>
            <p><strong>Above MAGIC (row 6):</strong> Synergies - integration and sovereignty</p>
            <p><strong>MAPS tools (rows 7-8):</strong> Methodology, Architecture for execution</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TileMatrix;