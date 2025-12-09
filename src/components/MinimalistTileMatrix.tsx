import { ArrowUp, ArrowRight } from 'lucide-react';
import { WindowOfToleranceOverlay } from '@/components/journal/WindowOfToleranceOverlay';
import { CycleNumber } from '@/types/journal-expansion';

type BoardType = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';

interface MinimalistTileMatrixProps {
  board?: BoardType;
  selectedTile?: { row: number; col: number } | null;
  visitedTiles?: Set<string>;
  onTileClick?: (row: number, col: number) => void;
  cycleNumber?: CycleNumber;
  showToleranceOverlay?: boolean;
  onZoneChange?: (zone: 'safe' | 'stretch' | 'edge' | 'unexplored') => void;
}

// Board color system using HSL values
const getBoardColors = (board: BoardType) => {
  switch (board) {
    case 'LOVE': 
      return { 
        primary: 'hsl(347 77% 50%)', 
        bg: 'hsl(347 77% 50% / 0.1)',
        border: 'hsl(347 77% 50% / 0.4)',
        ring: 'hsl(347 77% 50%)',
        text: 'hsl(347 77% 50%)'
      };
    case 'MAGIC': 
      return { 
        primary: 'hsl(258 90% 66%)', 
        bg: 'hsl(258 90% 66% / 0.1)',
        border: 'hsl(258 90% 66% / 0.4)',
        ring: 'hsl(258 90% 66%)',
        text: 'hsl(258 90% 66%)'
      };
    case 'CALM': 
      return { 
        primary: 'hsl(217 91% 60%)', 
        bg: 'hsl(217 91% 60% / 0.1)',
        border: 'hsl(217 91% 60% / 0.4)',
        ring: 'hsl(217 91% 60%)',
        text: 'hsl(217 91% 60%)'
      };
    case 'OPEN': 
      return { 
        primary: 'hsl(142 71% 45%)', 
        bg: 'hsl(142 71% 45% / 0.1)',
        border: 'hsl(142 71% 45% / 0.4)',
        ring: 'hsl(142 71% 45%)',
        text: 'hsl(142 71% 45%)'
      };
    case 'FREE': 
      return { 
        primary: 'hsl(38 92% 50%)', 
        bg: 'hsl(38 92% 50% / 0.1)',
        border: 'hsl(38 92% 50% / 0.4)',
        ring: 'hsl(38 92% 50%)',
        text: 'hsl(38 92% 50%)'
      };
    default: 
      return { 
        primary: 'hsl(215 16% 47%)', 
        bg: 'hsl(215 16% 47% / 0.1)',
        border: 'hsl(215 16% 47% / 0.4)',
        ring: 'hsl(215 16% 47%)',
        text: 'hsl(215 16% 47%)'
      };
  }
};

const MinimalistTileMatrix = ({ 
  board = 'LOVE',
  selectedTile,
  visitedTiles = new Set(),
  onTileClick,
  cycleNumber = 1,
  showToleranceOverlay = true,
  onZoneChange
}: MinimalistTileMatrixProps) => {
  const colors = getBoardColors(board);
  // Column labels - bottom axis (CHORDS + MAPS)
  const colLabels = [
    { letter: 'C', name: 'CHANCES TAKEN' },
    { letter: 'H', name: 'HEART Based Principles' },
    { letter: 'O', name: 'OBSERVER Ontological Consciousness' },
    { letter: 'R', name: 'REVERSAL Renewal' },
    { letter: 'D', name: 'DESIGN' },
    { letter: 'S', name: 'SEEDS' },
    { letter: 'M', name: 'METHODS' },
    { letter: 'S', name: 'SYSTEMS' },
  ];

  // Row labels - left axis (from top to bottom visually)
  const rowLabels = [
    { letter: 'P', name: 'PROTOCOLS & Architectures' },
    { letter: 'S', name: 'SYNERGIES' },
    { letter: 'N', name: 'NORMS' },
    { letter: 'C', name: 'COMPASSES' },
    { letter: 'I', name: 'INTUITION' },
    { letter: 'G', name: 'GOALS' },
    { letter: 'A', name: 'AGILITIES' },
    { letter: 'M', name: 'MINDSETS' },
  ];

  // Stage groups with their row ranges (visual indices, top to bottom)
  const stageGroups = [
    { name: 'MAPS', startRow: 0, rowCount: 2 },   // P+A, Synergies
    { name: 'LENS', startRow: 2, rowCount: 3 },   // Norms, Compasses, Intuition
    { name: 'AGENDAS', startRow: 5, rowCount: 3 }, // Goals, Agilities, Mindsets
  ];

  const TILE_SIZE = 48;
  const GAP = 2;
  const GRID_SIZE = 8;
  const TOTAL_SIZE = GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * GAP;

  // Calculate actual row index (flip for visual display)
  const getActualRow = (visualRow: number) => 7 - visualRow;

  const handleTileClick = (visualRow: number, col: number) => {
    const actualRow = getActualRow(visualRow);
    onTileClick?.(actualRow, col);
  };

  const isSelected = (visualRow: number, col: number) => {
    const actualRow = getActualRow(visualRow);
    return selectedTile?.row === actualRow && selectedTile?.col === col;
  };

  const isVisited = (visualRow: number, col: number) => {
    const actualRow = getActualRow(visualRow);
    return visitedTiles.has(`${actualRow}-${col}`);
  };

  // Generate diagonal lines with dots at intersections
  const generateDiagonals = () => {
    const lines = [];
    const dots = [];
    
    // Main diagonals from bottom-left corner
    for (let i = 0; i < GRID_SIZE; i++) {
      // Lines going up-right from bottom row
      const startX = i * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const startY = TOTAL_SIZE - TILE_SIZE / 2;
      const endX = TOTAL_SIZE - TILE_SIZE / 2;
      const endY = TOTAL_SIZE - (GRID_SIZE - i) * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      
      if (i > 0) {
        lines.push(
          <line
            key={`diag-bottom-${i}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4,4"
            className="text-muted-foreground/40"
          />
        );
      }

      // Lines going up-right from left column
      const startX2 = TILE_SIZE / 2;
      const startY2 = TOTAL_SIZE - i * (TILE_SIZE + GAP) - TILE_SIZE / 2;
      const endX2 = (GRID_SIZE - i) * (TILE_SIZE + GAP) - GAP + TILE_SIZE / 2 - (TILE_SIZE + GAP);
      const endY2 = TILE_SIZE / 2;
      
      if (i > 0 && i < GRID_SIZE) {
        lines.push(
          <line
            key={`diag-left-${i}`}
            x1={startX2}
            y1={startY2}
            x2={endX2 + (TILE_SIZE + GAP)}
            y2={endY2}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4,4"
            className="text-muted-foreground/40"
          />
        );
      }
    }

    // Add dots at each tile center
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const cx = col * (TILE_SIZE + GAP) + TILE_SIZE / 2;
        const cy = row * (TILE_SIZE + GAP) + TILE_SIZE / 2;
        
        dots.push(
          <circle
            key={`dot-${row}-${col}`}
            cx={cx}
            cy={cy}
            r="3"
            fill="currentColor"
            className="text-foreground/70"
          />
        );
      }
    }

    return { lines, dots };
  };

  const { lines: diagonalLines, dots: tileDots } = generateDiagonals();

  // Generate concentric rectangles for tolerance passes
  const generateConcentricRects = () => {
    const rects = [];
    const passes = [
      { inset: 2, color: 'hsl(142 71% 45%)', label: 'Inner' }, // green
      { inset: 1, color: 'hsl(217 91% 60%)', label: 'Stretch' }, // blue
      { inset: 0, color: 'hsl(38 92% 50%)', label: 'Edge' }, // amber
    ];

    passes.forEach((pass, idx) => {
      const insetPx = pass.inset * (TILE_SIZE + GAP);
      const size = TOTAL_SIZE - 2 * insetPx;
      
      rects.push(
        <rect
          key={`pass-${idx}`}
          x={insetPx}
          y={insetPx}
          width={size}
          height={size}
          fill="none"
          stroke={pass.color}
          strokeWidth="1.5"
          strokeDasharray="6,4"
          opacity="0.5"
        />
      );
    });

    return rects;
  };

  return (
    <div className="relative inline-block">
      {/* VELOCITY Arrow - Left side */}
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
        <ArrowUp className="w-5 h-5 text-foreground" />
        <span 
          className="text-xs font-semibold tracking-widest text-foreground"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          VELOCITY
        </span>
      </div>

      {/* Row Labels - Left side with rotated stage acronyms */}
      <div className="absolute -left-36 top-0 h-full flex" style={{ paddingTop: 16, paddingBottom: 16 }}>
        {/* Stage acronyms column - rotated 90° */}
        <div className="flex flex-col">
          {stageGroups.map((stage) => (
            <div 
              key={stage.name}
              className="flex items-center justify-center border-r border-border/30 pr-2"
              style={{ 
                height: stage.rowCount * (TILE_SIZE + GAP) - GAP,
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)'
              }}
            >
              <span className="text-xs font-bold tracking-widest text-muted-foreground">
                {stage.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* Row names column */}
        <div className="flex flex-col ml-2">
          {rowLabels.map((row, idx) => (
            <div 
              key={`row-label-${idx}`}
              className="flex flex-col items-end justify-center"
              style={{ height: TILE_SIZE + (idx < 7 ? GAP : 0) }}
            >
              <span className="text-xs font-bold">{row.letter}</span>
              <span className="text-[8px] text-muted-foreground leading-tight text-right" style={{ maxWidth: 80 }}>
                {row.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="relative bg-background border border-border/50 rounded-lg p-4">
        {/* Window of Tolerance Overlay */}
        {showToleranceOverlay && (
          <div 
            className="absolute inset-4 pointer-events-none z-5"
            style={{ width: TOTAL_SIZE, height: TOTAL_SIZE }}
          >
            <WindowOfToleranceOverlay
              cycleNumber={cycleNumber}
              currentTile={selectedTile || undefined}
              onZoneChange={onZoneChange}
            />
          </div>
        )}

        {/* SVG Overlay for diagonals and concentric rectangles */}
        <svg 
          className="absolute inset-4 pointer-events-none"
          width={TOTAL_SIZE}
          height={TOTAL_SIZE}
          viewBox={`0 0 ${TOTAL_SIZE} ${TOTAL_SIZE}`}
        >
          {/* Diagonal lines */}
          {diagonalLines}
          
          {/* Dots at intersections */}
          {tileDots}
        </svg>

        {/* Tile Grid */}
        <div 
          className="grid relative z-10"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
            gap: `${GAP}px`,
            width: `${TOTAL_SIZE}px`,
            height: `${TOTAL_SIZE}px`
          }}
        >
          {Array.from({ length: GRID_SIZE }).map((_, visualRow) =>
            Array.from({ length: GRID_SIZE }).map((_, col) => {
              const selected = isSelected(visualRow, col);
              const visited = isVisited(visualRow, col);
              const rowInfo = rowLabels[visualRow];
              const colInfo = colLabels[col];

              return (
                <button
                  key={`tile-${visualRow}-${col}`}
                  onClick={() => handleTileClick(visualRow, col)}
                  className={`
                    relative rounded-sm transition-all duration-200
                    border border-dashed flex items-center justify-center
                    ${selected 
                      ? 'border-solid ring-2 ring-offset-1' 
                      : visited
                        ? 'border-foreground/40 bg-foreground/5'
                        : 'border-muted-foreground/30 hover:border-foreground/50 hover:bg-muted/30'
                    }
                  `}
                  style={{ 
                    width: TILE_SIZE, 
                    height: TILE_SIZE,
                    ...(selected ? {
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                      boxShadow: `0 0 0 2px ${colors.ring}`,
                    } : {})
                  }}
                  title={`${rowInfo.letter} × ${colInfo.letter}: ${rowInfo.name} × ${colInfo.name}`}
                >
                  {/* Tile label */}
                  <span 
                    className="text-[10px] font-medium"
                    style={{ color: selected ? colors.text : undefined }}
                  >
                    {rowInfo.letter}{colInfo.letter}
                  </span>
                  
                  {/* Visited indicator */}
                  {visited && !selected && (
                    <div 
                      className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Column Labels - Bottom */}
      <div className="flex justify-center mt-4" style={{ width: TOTAL_SIZE + 32, marginLeft: 16 }}>
        {colLabels.map((col, idx) => (
          <div 
            key={`col-label-${idx}`}
            className="flex flex-col items-center text-center"
            style={{ width: TILE_SIZE + GAP }}
          >
            <span className="text-xs font-bold">{col.letter}</span>
            <span 
              className="text-[8px] text-muted-foreground leading-tight mt-0.5"
              style={{ maxWidth: TILE_SIZE }}
            >
              {col.name}
            </span>
          </div>
        ))}
      </div>

      {/* LONGEVITY Arrow - Bottom */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="text-xs font-semibold tracking-widest text-foreground">LONGEVITY</span>
        <ArrowRight className="w-5 h-5 text-foreground" />
      </div>
    </div>
  );
};

export default MinimalistTileMatrix;
