import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface WeavingThread {
  sourceRow: number;
  sourceCol: number;
  targetRow: number;
  targetCol: number;
  strength: number; // 0-1
  isNew?: boolean; // For animation
}

interface WeavingVisualizationProps {
  threads: WeavingThread[];
  tileSize: number;
  gridGap: number;
  className?: string;
  seasonColor?: string;
}

// Calculate center position of a tile
function getTileCenter(row: number, col: number, tileSize: number, gridGap: number) {
  // Account for visual row flip (row 0 at bottom)
  const visualRow = 7 - row;
  const x = col * (tileSize + gridGap) + tileSize / 2;
  const y = visualRow * (tileSize + gridGap) + tileSize / 2;
  return { x, y };
}

// Generate curved path between two points
function generateCurvedPath(
  x1: number, y1: number, 
  x2: number, y2: number
): string {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Create a gentle curve by offsetting the control point
  const dx = x2 - x1;
  const dy = y2 - y1;
  const perpX = -dy * 0.15;
  const perpY = dx * 0.15;
  
  const ctrlX = midX + perpX;
  const ctrlY = midY + perpY;
  
  return `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`;
}

export const WeavingVisualization: React.FC<WeavingVisualizationProps> = ({
  threads,
  tileSize,
  gridGap,
  className,
  seasonColor = 'hsl(var(--primary))',
}) => {
  const paths = useMemo(() => {
    return threads.map((thread, index) => {
      const source = getTileCenter(thread.sourceRow, thread.sourceCol, tileSize, gridGap);
      const target = getTileCenter(thread.targetRow, thread.targetCol, tileSize, gridGap);
      const path = generateCurvedPath(source.x, source.y, target.x, target.y);
      
      return {
        ...thread,
        path,
        id: `thread-${thread.sourceRow}-${thread.sourceCol}-${thread.targetRow}-${thread.targetCol}-${index}`,
      };
    });
  }, [threads, tileSize, gridGap]);

  if (threads.length === 0) return null;

  const gridSize = 8 * tileSize + 7 * gridGap;

  return (
    <svg 
      className={cn(
        "absolute inset-0 pointer-events-none overflow-visible",
        className
      )}
      width={gridSize}
      height={gridSize}
      style={{ zIndex: 5 }}
    >
      <defs>
        {/* Glow filter for threads */}
        <filter id="weave-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Gradient for thread color */}
        <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={seasonColor} stopOpacity="0.3" />
          <stop offset="50%" stopColor={seasonColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={seasonColor} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Render threads */}
      {paths.map((thread) => (
        <g key={thread.id}>
          {/* Background glow path */}
          <path
            d={thread.path}
            fill="none"
            stroke={seasonColor}
            strokeWidth={2 + thread.strength * 2}
            strokeOpacity={0.15}
            filter="url(#weave-glow)"
            className={thread.isNew ? 'animate-weave-emerge' : ''}
          />
          
          {/* Main thread path */}
          <path
            d={thread.path}
            fill="none"
            stroke="url(#thread-gradient)"
            strokeWidth={1 + thread.strength}
            strokeLinecap="round"
            strokeOpacity={0.3 + thread.strength * 0.4}
            className={cn(
              thread.isNew ? 'animate-weave-emerge' : 'animate-weave-pulse'
            )}
            style={{
              strokeDasharray: thread.isNew ? '200' : 'none',
              strokeDashoffset: thread.isNew ? '200' : '0',
            }}
          />
          
          {/* Connection dots at endpoints */}
          <circle
            cx={getTileCenter(thread.sourceRow, thread.sourceCol, tileSize, gridGap).x}
            cy={getTileCenter(thread.sourceRow, thread.sourceCol, tileSize, gridGap).y}
            r={2 + thread.strength}
            fill={seasonColor}
            fillOpacity={0.4 + thread.strength * 0.3}
            className={thread.isNew ? 'animate-weave-emerge' : ''}
          />
          <circle
            cx={getTileCenter(thread.targetRow, thread.targetCol, tileSize, gridGap).x}
            cy={getTileCenter(thread.targetRow, thread.targetCol, tileSize, gridGap).y}
            r={2 + thread.strength}
            fill={seasonColor}
            fillOpacity={0.4 + thread.strength * 0.3}
            className={thread.isNew ? 'animate-weave-emerge' : ''}
          />
        </g>
      ))}
    </svg>
  );
};

export default WeavingVisualization;
