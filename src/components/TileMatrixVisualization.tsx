import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowRight, Target, Zap, Timer } from 'lucide-react';

type TolerancePass = 1 | 2 | 3 | 4;

interface TileMatrixVisualizationProps {
  board?: 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
  visitedTiles?: Set<string>;
  selectedTile?: { row: number; col: number } | null;
  currentPass?: TolerancePass;
  onTileClick?: (row: number, col: number) => void;
}

const TileMatrixVisualization = ({
  board = 'LOVE',
  visitedTiles = new Set(),
  selectedTile = null,
  currentPass = 1,
  onTileClick
}: TileMatrixVisualizationProps) => {
  const [hoveredTile, setHoveredTile] = useState<{ row: number; col: number } | null>(null);

  // Row labels following MAGIC integration + ABOVE
  const rowLabels = [
    { letter: 'M', name: 'Mindsets', stage: 'AGENDAS' },
    { letter: 'A', name: 'Agilities', stage: 'AGENDAS' },
    { letter: 'G', name: 'Goals', stage: 'AGENDAS' },
    { letter: 'I', name: 'Intuition', stage: 'LENS' },
    { letter: 'C', name: 'Compasses', stage: 'LENS' },
    { letter: 'N', name: 'Norms', stage: 'MAPS' },
    { letter: 'S', name: 'Synergies', stage: 'MAPS' },
    { letter: 'P+A', name: 'Protocols', stage: 'MAPS' },
  ];

  // Column labels: CHORDS + MAPS
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

  // Determine tile's tolerance pass
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
    return getTileTolerancePass(row, col) <= currentPass;
  };

  const getPassColor = (pass: TolerancePass) => {
    switch (pass) {
      case 1: return { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' };
      case 2: return { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' };
      case 3: return { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400' };
      case 4: return { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' };
    }
  };

  const getBoardGradient = () => {
    switch (board) {
      case 'LOVE': return 'from-rose-500/30 to-pink-500/10';
      case 'MAGIC': return 'from-purple-500/30 to-indigo-500/10';
      case 'CALM': return 'from-blue-500/30 to-cyan-500/10';
      case 'OPEN': return 'from-green-500/30 to-emerald-500/10';
      case 'FREE': return 'from-amber-500/30 to-orange-500/10';
    }
  };

  // Calculate if a tile is on the boundary of a specific pass
  const isOnPassBoundary = (row: number, col: number, pass: TolerancePass): boolean => {
    const tilePass = getTileTolerancePass(row, col);
    if (tilePass !== pass) return false;
    
    // Check if any adjacent tile is in a different (inner) pass
    const adjacents = [
      [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
    ];
    
    return adjacents.some(([r, c]) => {
      if (r < 0 || r > 7 || c < 0 || c > 7) return true;
      return getTileTolerancePass(r, c) < pass;
    });
  };

  return (
    <Card className={`p-6 relative overflow-hidden bg-gradient-to-br ${getBoardGradient()}`}>
      {/* L.O.V.E. Axes Labels */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 flex items-center gap-2">
        <ArrowUp className="w-4 h-4 text-rose-400 rotate-90" />
        <span className="text-xs font-bold tracking-wider text-rose-400">VELOCITY</span>
        <Zap className="w-3 h-3 text-rose-400" />
      </div>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <Timer className="w-3 h-3 text-cyan-400" />
        <span className="text-xs font-bold tracking-wider text-cyan-400">LONGEVITY</span>
        <ArrowRight className="w-4 h-4 text-cyan-400" />
      </div>

      {/* Stage Labels - Left Side */}
      <div className="absolute left-10 top-16 flex flex-col h-[calc(100%-8rem)] justify-around text-xs text-muted-foreground">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-amber-400">AGENDAS</span>
          <span className="text-[10px]">M·A·G</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-blue-400">LENS</span>
          <span className="text-[10px]">I·C</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-purple-400">MAPS</span>
          <span className="text-[10px]">N·S·P+A</span>
        </div>
      </div>

      {/* Main Matrix Container */}
      <div className="ml-20 mr-4 mt-8 mb-12 relative">
        {/* SVG Overlay for Concentric Rectangles and Diagonal Lines */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Diagonal Fan Lines from center */}
          <g className="opacity-30">
            {/* Lines radiating from center to corners */}
            <line x1="200" y1="200" x2="0" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="400" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="0" y2="400" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="400" y2="400" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
            
            {/* Additional diagonal lines for fan effect */}
            <line x1="200" y1="200" x2="0" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="100" y2="0" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="400" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="300" y2="0" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="0" y2="300" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="100" y2="400" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="400" y2="300" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <line x1="200" y1="200" x2="300" y2="400" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
          </g>

          {/* Pass 1 - Inner 4×4 Rectangle (tiles 2-5, rows 2-5) */}
          <rect 
            x="100" y="100" width="200" height="200"
            fill="none" 
            stroke="hsl(var(--chart-4))" 
            strokeWidth="2"
            strokeDasharray="4,2"
            className="opacity-60"
          />
          
          {/* Pass 2 - 6×6 Rectangle (tiles 1-6, rows 1-6) */}
          <rect 
            x="50" y="50" width="300" height="300"
            fill="none" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth="2"
            strokeDasharray="6,3"
            className="opacity-50"
          />
          
          {/* Pass 3 - Full 8×8 Rectangle */}
          <rect 
            x="0" y="0" width="400" height="400"
            fill="none" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth="2"
            className="opacity-40"
          />

          {/* Center point marker */}
          <circle cx="200" cy="200" r="4" fill="hsl(var(--primary))" className="opacity-70" />
          <circle cx="200" cy="200" r="8" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" className="opacity-50" />
        </svg>

        {/* Column Labels (CHORDS + MAPS) */}
        <div className="flex mb-2 pl-8">
          {colLabels.map((col, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`text-xs font-bold ${i >= 6 ? 'text-purple-400' : 'text-foreground/70'}`}>
                {col.letter}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">{col.name}</div>
            </div>
          ))}
        </div>

        {/* Grid with Row Labels */}
        <div className="flex flex-col gap-1">
          {rowLabels.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-1">
              {/* Row Label */}
              <div className="w-8 text-right pr-1">
                <span className={`text-xs font-bold ${row.stage === 'MAPS' ? 'text-purple-400' : 'text-foreground/70'}`}>
                  {row.letter}
                </span>
              </div>
              
              {/* Tiles */}
              {colLabels.map((_, colIndex) => {
                const tilePass = getTileTolerancePass(rowIndex, colIndex);
                const isAccessible = isTileAccessible(rowIndex, colIndex);
                const isSelected = selectedTile?.row === rowIndex && selectedTile?.col === colIndex;
                const isHovered = hoveredTile?.row === rowIndex && hoveredTile?.col === colIndex;
                const isVisited = visitedTiles.has(`${rowIndex}-${colIndex}`);
                const passColors = getPassColor(tilePass);
                const isCorner = (rowIndex === 0 || rowIndex === 7) && (colIndex === 0 || colIndex === 7);
                const isMapsBoundary = rowIndex >= 5 || colIndex >= 6;

                return (
                  <button
                    key={colIndex}
                    onClick={() => isAccessible && onTileClick?.(rowIndex, colIndex)}
                    onMouseEnter={() => setHoveredTile({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredTile(null)}
                    disabled={!isAccessible}
                    className={`
                      flex-1 aspect-square rounded-sm relative transition-all duration-200
                      ${passColors.bg}
                      ${isSelected ? `ring-2 ring-primary ${passColors.border} border-2` : 'border border-border/30'}
                      ${isHovered && isAccessible ? 'scale-105 z-20 shadow-lg' : ''}
                      ${isVisited ? 'opacity-100' : 'opacity-60'}
                      ${!isAccessible ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:opacity-100'}
                      ${isCorner ? 'ring-1 ring-purple-500/50' : ''}
                      ${isMapsBoundary ? 'bg-purple-500/10' : ''}
                    `}
                  >
                    {/* Pass indicator dot */}
                    <span className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
                      tilePass === 1 ? 'bg-emerald-500' :
                      tilePass === 2 ? 'bg-blue-500' :
                      tilePass === 3 ? 'bg-amber-500' :
                      'bg-purple-500'
                    } ${isVisited ? 'opacity-100' : 'opacity-30'}`} />
                    
                    {/* Tile number */}
                    <span className="text-[8px] text-muted-foreground/50">
                      {rowIndex * 8 + colIndex + 1}
                    </span>

                    {/* Corner integrator marker */}
                    {isCorner && (
                      <Target className="absolute w-3 h-3 text-purple-400 opacity-50" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom axis label: CHORDS + MAPS */}
        <div className="flex mt-3 pl-8">
          <div className="flex-1 flex items-center justify-center gap-1 border-t border-muted-foreground/20 pt-2">
            <span className="text-[10px] font-semibold text-foreground/60">CHORDS</span>
          </div>
          <div className="w-1/4 flex items-center justify-center gap-1 border-t border-purple-500/30 pt-2">
            <span className="text-[10px] font-semibold text-purple-400">MAPS</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
          Pass 1: Inner 4×4
        </Badge>
        <Badge variant="outline" className="text-[10px] bg-blue-500/10 border-blue-500/30 text-blue-400">
          Pass 2: Stretch 6×6
        </Badge>
        <Badge variant="outline" className="text-[10px] bg-amber-500/10 border-amber-500/30 text-amber-400">
          Pass 3: Edge 8×8
        </Badge>
        <Badge variant="outline" className="text-[10px] bg-purple-500/10 border-purple-500/30 text-purple-400">
          Pass 4: Integrators
        </Badge>
      </div>

      {/* Hovered tile info */}
      {hoveredTile && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur px-3 py-1 rounded-lg border text-xs">
          <span className="font-semibold">{rowLabels[hoveredTile.row].name}</span>
          <span className="text-muted-foreground"> × </span>
          <span className="font-semibold">{colLabels[hoveredTile.col].name}</span>
          <span className="text-muted-foreground ml-2">
            (Pass {getTileTolerancePass(hoveredTile.row, hoveredTile.col)})
          </span>
        </div>
      )}
    </Card>
  );
};

export default TileMatrixVisualization;
