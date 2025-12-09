import React from 'react';
import { 
  getCycleExpansionZone, 
  CycleNumber 
} from '@/types/journal-expansion';

interface WindowOfToleranceOverlayProps {
  cycleNumber?: CycleNumber;
  currentTile?: { row: number; col: number };
  onZoneChange?: (zone: 'safe' | 'stretch' | 'edge' | 'unexplored') => void;
}

export const WindowOfToleranceOverlay: React.FC<WindowOfToleranceOverlayProps> = ({
  cycleNumber = 1,
  currentTile,
  onZoneChange
}) => {
  const gridSize = 8;
  const cellSize = 100 / gridSize;
  const center = 50; // Center of the grid (50%)

  // Calculate ring sizes based on cycle number (each cycle expands)
  const cycles: CycleNumber[] = [1, 2, 3, 4];
  
  const currentZone = currentTile 
    ? getCycleExpansionZone(currentTile.row, currentTile.col, cycleNumber)
    : 'safe';

  React.useEffect(() => {
    if (currentTile && onZoneChange) {
      onZoneChange(currentZone);
    }
  }, [currentTile, currentZone, onZoneChange]);

  const getZoneColor = (cycle: CycleNumber, isCurrentCycle: boolean) => {
    if (cycle > cycleNumber) return 'rgba(100, 100, 100, 0.05)'; // Unexplored
    
    const baseOpacity = isCurrentCycle ? 0.2 : 0.1;
    switch (cycle) {
      case 1: return `rgba(34, 197, 94, ${baseOpacity})`; // green - innermost
      case 2: return `rgba(59, 130, 246, ${baseOpacity})`; // blue
      case 3: return `rgba(234, 179, 8, ${baseOpacity})`; // yellow
      case 4: return `rgba(168, 85, 247, ${baseOpacity})`; // purple - outermost
    }
  };

  const getZoneBorderColor = (cycle: CycleNumber) => {
    if (cycle > cycleNumber) return 'rgba(100, 100, 100, 0.2)';
    
    switch (cycle) {
      case 1: return 'rgba(34, 197, 94, 0.6)';
      case 2: return 'rgba(59, 130, 246, 0.5)';
      case 3: return 'rgba(234, 179, 8, 0.5)';
      case 4: return 'rgba(168, 85, 247, 0.4)';
    }
  };

  const getCycleLabel = (cycle: CycleNumber) => {
    switch (cycle) {
      case 1: return 'C1';
      case 2: return 'C2';
      case 3: return 'C3';
      case 4: return 'C4';
    }
  };

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Draw cycles from outer to inner (4 to 1) */}
      {[...cycles].reverse().map((cycle) => {
        const size = cycle * cellSize * 2;
        const isCurrentCycle = cycle === cycleNumber;
        const isUnlocked = cycle <= cycleNumber;

        return (
          <g key={cycle}>
            <rect
              x={center - size / 2}
              y={center - size / 2}
              width={size}
              height={size}
              fill={getZoneColor(cycle, isCurrentCycle)}
              stroke={getZoneBorderColor(cycle)}
              strokeWidth={isCurrentCycle ? 0.5 : 0.3}
              strokeDasharray={isUnlocked ? 'none' : '2,2'}
              rx="1"
            />
            
            {/* Cycle label in corner */}
            <text
              x={center - size / 2 + 2}
              y={center - size / 2 + 3}
              fontSize="2.5"
              fill={getZoneBorderColor(cycle)}
              opacity={isCurrentCycle ? 1 : 0.6}
              fontWeight={isCurrentCycle ? 'bold' : 'normal'}
            >
              {getCycleLabel(cycle)}
            </text>
          </g>
        );
      })}

      {/* Diagonal fan lines from corners */}
      <line x1="0" y1="0" x2={center} y2={center} stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.2" />
      <line x1="100" y1="0" x2={center} y2={center} stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.2" />
      <line x1="0" y1="100" x2={center} y2={center} stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.2" />
      <line x1="100" y1="100" x2={center} y2={center} stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.2" />

      {/* Current position indicator */}
      {currentTile && (
        <circle
          cx={(currentTile.col - 0.5) * cellSize}
          cy={(currentTile.row - 0.5) * cellSize}
          r="1.5"
          fill="white"
          stroke={
            currentZone === 'safe' ? 'rgba(34, 197, 94, 0.8)' :
            currentZone === 'stretch' ? 'rgba(234, 179, 8, 0.8)' :
            currentZone === 'edge' ? 'rgba(239, 68, 68, 0.8)' :
            'rgba(100, 100, 100, 0.5)'
          }
          strokeWidth="0.5"
          className="animate-pulse"
        />
      )}

      {/* Center marker */}
      <circle
        cx={center}
        cy={center}
        r="1"
        fill="rgba(139, 92, 246, 0.5)"
      />

      {/* Zone state label */}
      {currentTile && (
        <text
          x="5"
          y="97"
          fontSize="2"
          fill={
            currentZone === 'safe' ? 'rgba(34, 197, 94, 0.8)' :
            currentZone === 'stretch' ? 'rgba(234, 179, 8, 0.8)' :
            currentZone === 'edge' ? 'rgba(239, 68, 68, 0.8)' :
            'rgba(100, 100, 100, 0.6)'
          }
          fontWeight="bold"
        >
          {currentZone.toUpperCase()}
        </text>
      )}
    </svg>
  );
};

export default WindowOfToleranceOverlay;
