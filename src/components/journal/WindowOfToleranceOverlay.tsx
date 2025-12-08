import React from 'react';
import { 
  getToleranceZone, 
  getChordsPosition, 
  getAgendasLevel,
  CHORDS_LABELS,
  AGENDAS_LABELS,
  ToleranceZone 
} from '@/types/journal-expansion';

interface WindowOfToleranceOverlayProps {
  innerRadius?: number;
  stretchRadius?: number;
  currentTile?: { row: number; col: number };
  onZoneChange?: (zone: ToleranceZone) => void;
}

export const WindowOfToleranceOverlay: React.FC<WindowOfToleranceOverlayProps> = ({
  innerRadius = 1.5,
  stretchRadius = 2.5,
  currentTile,
  onZoneChange
}) => {
  const gridSize = 8;
  const cellSize = 100 / gridSize;
  const center = 50; // Center of the grid (50%)

  // Calculate ring sizes based on radii
  const innerSize = (innerRadius * 2) * cellSize;
  const stretchSize = (stretchRadius * 2) * cellSize;

  const currentZone = currentTile 
    ? getToleranceZone(currentTile.row, currentTile.col)
    : 'inner';

  React.useEffect(() => {
    if (currentTile && onZoneChange) {
      onZoneChange(currentZone);
    }
  }, [currentTile, currentZone, onZoneChange]);

  const getZoneColor = (zone: ToleranceZone) => {
    switch (zone) {
      case 'inner': return 'rgba(34, 197, 94, 0.15)'; // green
      case 'stretch': return 'rgba(234, 179, 8, 0.12)'; // yellow
      case 'outer': return 'rgba(239, 68, 68, 0.1)'; // red
    }
  };

  const getZoneBorderColor = (zone: ToleranceZone) => {
    switch (zone) {
      case 'inner': return 'rgba(34, 197, 94, 0.6)';
      case 'stretch': return 'rgba(234, 179, 8, 0.5)';
      case 'outer': return 'rgba(239, 68, 68, 0.4)';
    }
  };

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Outer zone (full grid - implied) */}
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill={getZoneColor('outer')}
        stroke={getZoneBorderColor('outer')}
        strokeWidth="0.3"
        strokeDasharray="2,2"
      />

      {/* Stretch zone ring */}
      <rect
        x={center - stretchSize / 2}
        y={center - stretchSize / 2}
        width={stretchSize}
        height={stretchSize}
        fill={getZoneColor('stretch')}
        stroke={getZoneBorderColor('stretch')}
        strokeWidth="0.4"
        rx="1"
      />

      {/* Inner zone (safe center) */}
      <rect
        x={center - innerSize / 2}
        y={center - innerSize / 2}
        width={innerSize}
        height={innerSize}
        fill={getZoneColor('inner')}
        stroke={getZoneBorderColor('inner')}
        strokeWidth="0.5"
        rx="0.5"
      />

      {/* Diagonal fan lines from corners */}
      <line x1="0" y1="0" x2={center} y2={center} stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.2" />
      <line x1="100" y1="0" x2={center} y2={center} stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.2" />
      <line x1="0" y1="100" x2={center} y2={center} stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.2" />
      <line x1="100" y1="100" x2={center} y2={center} stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.2" />

      {/* Current position indicator */}
      {currentTile && (
        <circle
          cx={(currentTile.col - 0.5) * cellSize}
          cy={(currentTile.row - 0.5) * cellSize}
          r="1.5"
          fill="white"
          stroke={getZoneBorderColor(currentZone)}
          strokeWidth="0.5"
          className="animate-pulse"
        />
      )}

      {/* Zone labels */}
      <text x={center} y={center - 2} textAnchor="middle" fontSize="2" fill="rgba(34, 197, 94, 0.8)" fontWeight="bold">
        SAFE
      </text>
      <text x={center} y={center - stretchSize/2 + 3} textAnchor="middle" fontSize="1.8" fill="rgba(234, 179, 8, 0.7)">
        STRETCH
      </text>
      <text x="5" y="5" textAnchor="start" fontSize="1.5" fill="rgba(239, 68, 68, 0.6)">
        EDGE
      </text>
    </svg>
  );
};

export default WindowOfToleranceOverlay;
