import { ArrowUp, ArrowRight, Lock } from 'lucide-react';
import { WindowOfToleranceOverlay } from '@/components/journal/WindowOfToleranceOverlay';
import { CycleNumber } from '@/types/journal-expansion';
import { DetectedPattern, getPatternColor } from '@/utils/patternDetection';
import { 
  RING_DEFINITIONS, 
  getTileRing, 
  canAccessTile, 
  calculateRingStates,
  getCurrentUnlockedRing,
  RingLevel,
  RingState
} from '@/utils/ringToleranceSystem';

type BoardType = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';

interface MinimalistTileMatrixProps {
  board?: BoardType;
  selectedTile?: { row: number; col: number } | null;
  visitedTiles?: Set<string>;
  journeyPath?: Array<{ row: number; col: number }>;
  onTileClick?: (row: number, col: number) => void;
  cycleNumber?: CycleNumber;
  showToleranceOverlay?: boolean;
  onZoneChange?: (zone: 'safe' | 'stretch' | 'edge' | 'unexplored') => void;
  completedSeasons?: string[];
  highlightedPattern?: DetectedPattern | null;
  showPatternOverlay?: boolean;
  unlockedRing?: RingLevel;
  onRingUnlock?: (ring: RingLevel, pattern: DetectedPattern) => void;
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
  journeyPath = [],
  onTileClick,
  cycleNumber = 1,
  showToleranceOverlay = true,
  onZoneChange,
  completedSeasons = [],
  highlightedPattern = null,
  showPatternOverlay = true,
  unlockedRing,
  onRingUnlock,
}: MinimalistTileMatrixProps) => {
  // Calculate current unlocked ring from visited tiles if not provided
  const currentUnlockedRing = unlockedRing ?? getCurrentUnlockedRing(visitedTiles);
  
  // Calculate ring states for visual feedback
  const ringStates = calculateRingStates(visitedTiles, currentUnlockedRing);
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
    { letter: 'A + P', name: 'Architectures & Protocols' },
    { letter: 'S', name: 'SYNERGIES' },
    { letter: 'N', name: 'NORMS' },
    { letter: 'C', name: 'Compasses and Energies' },
    { letter: 'I', name: 'Intuitions & Landscapes' },
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

  // Calculate visual row from actual row
  const getVisualRow = (actualRow: number) => 7 - actualRow;

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

  // Get the step number for a visited tile
  const getStepNumber = (visualRow: number, col: number) => {
    const actualRow = getActualRow(visualRow);
    const index = journeyPath.findIndex(t => t.row === actualRow && t.col === col);
    return index >= 0 ? index + 1 : null;
  };

  // Generate journey path lines
  const generateJourneyPathLines = () => {
    if (journeyPath.length < 2) return null;
    
    return journeyPath.map((tile, idx) => {
      if (idx === 0) return null;
      const prev = journeyPath[idx - 1];
      
      // Convert actual rows to visual positions
      const prevVisualRow = getVisualRow(prev.row);
      const currVisualRow = getVisualRow(tile.row);
      
      const x1 = prev.col * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const y1 = prevVisualRow * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const x2 = tile.col * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const y2 = currVisualRow * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      
      return (
        <line
          key={`path-${idx}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      );
    });
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

  // Generate concentric rectangles for tolerance passes + 4th integrator ring
  const generateConcentricRects = () => {
    const elements: JSX.Element[] = [];
    
    // Get ring states for visual opacity based on unlock status
    const getRingOpacity = (ring: number) => {
      const state = ringStates.find(s => s.ring === ring);
      if (!state) return 0.3;
      if (state.patternDetected || state.status === 'unlocked') return 0.9;
      if (state.status === 'in-progress') return 0.6;
      return 0.3;
    };
    
    // Ring rectangles (3 concentric)
    const rectPasses = [
      { inset: 2, ring: 1 }, // Inner Core (green)
      { inset: 1, ring: 2 }, // Stretch Zone (blue)
      { inset: 0, ring: 3 }, // Edge Zone (amber)
    ];

    rectPasses.forEach((pass) => {
      const ringDef = RING_DEFINITIONS.find(r => r.ring === pass.ring);
      if (!ringDef) return;
      
      const insetPx = pass.inset * (TILE_SIZE + GAP);
      const size = TOTAL_SIZE - 2 * insetPx;
      const opacity = getRingOpacity(pass.ring);
      
      elements.push(
        <rect
          key={`ring-${pass.ring}`}
          x={insetPx}
          y={insetPx}
          width={size}
          height={size}
          fill="none"
          stroke={ringDef.color}
          strokeWidth="2.5"
          strokeDasharray="8,4"
          opacity={opacity}
        />
      );
    });
    
    // Ring 4: Corner integrators (purple circles at corners)
    const ring4Def = RING_DEFINITIONS.find(r => r.ring === 4);
    const ring4Opacity = getRingOpacity(4);
    if (ring4Def) {
      const cornerPositions = [
        { x: TILE_SIZE / 2, y: TILE_SIZE / 2 }, // top-left (0-0)
        { x: TOTAL_SIZE - TILE_SIZE / 2, y: TILE_SIZE / 2 }, // top-right (0-7)
        { x: TILE_SIZE / 2, y: TOTAL_SIZE - TILE_SIZE / 2 }, // bottom-left (7-0)
        { x: TOTAL_SIZE - TILE_SIZE / 2, y: TOTAL_SIZE - TILE_SIZE / 2 }, // bottom-right (7-7)
      ];
      
      cornerPositions.forEach((pos, idx) => {
        elements.push(
          <circle
            key={`integrator-${idx}`}
            cx={pos.x}
            cy={pos.y}
            r={TILE_SIZE / 2 + 6}
            fill="none"
            stroke={ring4Def.color}
            strokeWidth="3"
            strokeDasharray="6,3"
            opacity={ring4Opacity}
          />
        );
      });
      
      // Add diagonal lines connecting corners if ring 4 is in progress
      if (ring4Opacity > 0.3) {
        elements.push(
          <line
            key="integrator-diag-1"
            x1={TILE_SIZE / 2}
            y1={TILE_SIZE / 2}
            x2={TOTAL_SIZE - TILE_SIZE / 2}
            y2={TOTAL_SIZE - TILE_SIZE / 2}
            stroke={ring4Def.color}
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity={ring4Opacity * 0.5}
          />,
          <line
            key="integrator-diag-2"
            x1={TOTAL_SIZE - TILE_SIZE / 2}
            y1={TILE_SIZE / 2}
            x2={TILE_SIZE / 2}
            y2={TOTAL_SIZE - TILE_SIZE / 2}
            stroke={ring4Def.color}
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity={ring4Opacity * 0.5}
          />
        );
      }
    }

    return elements;
  };

  // Generate pattern overlay (glow circles and connecting lines)
  const generatePatternOverlay = () => {
    if (!highlightedPattern || !showPatternOverlay) return null;
    
    const patternColor = getPatternColor(highlightedPattern.type);
    const elements: JSX.Element[] = [];
    
    // Parse tile keys to coordinates
    const tileCoords = highlightedPattern.tiles.map(key => {
      const [row, col] = key.split('-').map(Number);
      return { row, col, key };
    });

    // Draw connecting lines between pattern tiles
    for (let i = 0; i < tileCoords.length - 1; i++) {
      const from = tileCoords[i];
      const to = tileCoords[i + 1];
      
      // Convert to visual coordinates (flip rows)
      const fromVisualRow = getVisualRow(from.row);
      const toVisualRow = getVisualRow(to.row);
      
      const x1 = from.col * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const y1 = fromVisualRow * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const x2 = to.col * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const y2 = toVisualRow * (TILE_SIZE + GAP) + TILE_SIZE / 2;

      elements.push(
        <line
          key={`pattern-line-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={patternColor}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pattern-draw"
          style={{
            strokeDasharray: '100',
            strokeDashoffset: '100',
            animation: 'pattern-draw 0.5s ease-out forwards',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      );
    }

    // Draw glow circles behind each pattern tile
    tileCoords.forEach((coord, idx) => {
      const visualRow = getVisualRow(coord.row);
      const cx = coord.col * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const cy = visualRow * (TILE_SIZE + GAP) + TILE_SIZE / 2;

      elements.push(
        <circle
          key={`pattern-glow-${idx}`}
          cx={cx}
          cy={cy}
          r={TILE_SIZE / 2 + 4}
          fill="none"
          stroke={patternColor}
          strokeWidth="2"
          opacity="0.6"
          className="animate-pattern-pulse"
          style={{
            animation: 'pattern-pulse 2s ease-in-out infinite',
            animationDelay: `${idx * 0.15}s`,
          }}
        />
      );
    });

    // Add pattern icon at centroid
    if (tileCoords.length > 0) {
      const avgRow = tileCoords.reduce((sum, t) => sum + getVisualRow(t.row), 0) / tileCoords.length;
      const avgCol = tileCoords.reduce((sum, t) => sum + t.col, 0) / tileCoords.length;
      const cx = avgCol * (TILE_SIZE + GAP) + TILE_SIZE / 2;
      const cy = avgRow * (TILE_SIZE + GAP) + TILE_SIZE / 2;

      elements.push(
        <g key="pattern-icon" className="pointer-events-none">
          <circle
            cx={cx}
            cy={cy}
            r="16"
            fill={patternColor}
            opacity="0.9"
            className="animate-pattern-pulse"
          />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fill="white"
          >
            {highlightedPattern.icon}
          </text>
        </g>
      );
    }

    return elements;
  };

  return (
    <div className="relative inline-block">
      {/* VELOCITY Arrow - Far left side */}
      <div className="absolute -left-48 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
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

        {/* SVG Overlay for diagonals, concentric rectangles, journey path, and pattern overlay */}
        <svg 
          className="absolute inset-4 pointer-events-none"
          width={TOTAL_SIZE}
          height={TOTAL_SIZE}
          viewBox={`0 0 ${TOTAL_SIZE} ${TOTAL_SIZE}`}
        >
          {/* Concentric tolerance expansion rings */}
          {generateConcentricRects()}
          
          {/* Diagonal lines */}
          {diagonalLines}
          
          {/* Journey path lines - drawn above diagonals */}
          {generateJourneyPathLines()}
          
          {/* Pattern overlay - glow and connecting lines */}
          {generatePatternOverlay()}
          
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
              const actualRow = getActualRow(visualRow);
              const selected = isSelected(visualRow, col);
              const visited = isVisited(visualRow, col);
              const stepNumber = getStepNumber(visualRow, col);
              const rowInfo = rowLabels[visualRow];
              const colInfo = colLabels[col];
              
              // Check if tile is accessible based on current unlocked ring
              const tileRing = getTileRing(actualRow, col);
              const isAccessible = canAccessTile(actualRow, col, currentUnlockedRing);
              const isLocked = !isAccessible && !visited;

              return (
                <button
                  key={`tile-${visualRow}-${col}`}
                  onClick={() => {
                    if (isAccessible || visited) {
                      handleTileClick(visualRow, col);
                    }
                  }}
                  disabled={isLocked}
                  className={`
                    relative rounded-sm transition-all duration-200
                    border border-dashed flex items-center justify-center
                    ${isLocked
                      ? 'border-muted-foreground/20 bg-muted/20 cursor-not-allowed opacity-50'
                      : selected 
                        ? 'border-solid ring-2 ring-offset-1' 
                        : visited
                          ? 'border-solid border-foreground/50 bg-foreground/10'
                          : 'border-muted-foreground/30 hover:border-foreground/50 hover:bg-muted/30'
                    }
                  `}
                  style={{ 
                    width: TILE_SIZE, 
                    height: TILE_SIZE,
                    ...(isLocked ? {} : selected ? {
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                      boxShadow: `0 0 0 2px ${colors.ring}`,
                    } : visited ? {
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                    } : {})
                  }}
                  title={isLocked 
                    ? `🔒 Expand your window of tolerance to access Ring ${tileRing}` 
                    : `${rowInfo.letter} × ${colInfo.letter}: ${rowInfo.name} × ${colInfo.name}`
                  }
                >
                  {/* Lock icon for locked tiles */}
                  {isLocked ? (
                    <Lock className="w-3 h-3 text-muted-foreground/50" />
                  ) : (
                    /* Tile label */
                    <span 
                      className="text-[10px] font-medium"
                      style={{ color: selected || visited ? colors.text : undefined }}
                    >
                      {rowInfo.letter}{colInfo.letter}
                    </span>
                  )}
                  
                  {/* Step number badge for visited tiles */}
                  {stepNumber && !isLocked && (
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {stepNumber}
                    </div>
                  )}
                  
                  {/* Ring indicator for corner tiles (Ring 4) */}
                  {tileRing === 4 && !isLocked && (
                    <div 
                      className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-[8px]"
                      style={{ backgroundColor: 'hsl(280 70% 50%)', color: 'white' }}
                    >
                      ✧
                    </div>
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