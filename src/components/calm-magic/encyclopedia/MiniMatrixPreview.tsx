// Mini Matrix Preview - Small 8x8 grid visualization for pattern display

import React from 'react';
import { cn } from '@/lib/utils';

interface MiniMatrixPreviewProps {
  highlightPattern: string[]; // e.g., ['0-0', '1-0', '2-0']
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  patternColor?: string;
}

const MiniMatrixPreview: React.FC<MiniMatrixPreviewProps> = ({
  highlightPattern,
  showLabels = false,
  size = 'sm',
  className,
  patternColor = 'hsl(var(--primary))',
}) => {
  const tileSize = size === 'sm' ? 10 : size === 'md' ? 14 : 18;
  const gap = size === 'sm' ? 1 : 2;
  const totalSize = tileSize * 8 + gap * 7;

  // Calculate centroid for pattern icon
  const getCentroid = () => {
    if (highlightPattern.length === 0) return { x: totalSize / 2, y: totalSize / 2 };
    
    let sumX = 0, sumY = 0;
    highlightPattern.forEach(key => {
      const [row, col] = key.split('-').map(Number);
      sumX += col * (tileSize + gap) + tileSize / 2;
      sumY += row * (tileSize + gap) + tileSize / 2;
    });
    
    return {
      x: sumX / highlightPattern.length,
      y: sumY / highlightPattern.length,
    };
  };

  const centroid = getCentroid();

  return (
    <div 
      className={cn("relative", className)}
      style={{ 
        width: totalSize,
        height: totalSize,
      }}
    >
      {/* Grid of tiles */}
      {Array.from({ length: 64 }).map((_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const key = `${row}-${col}`;
        const isHighlighted = highlightPattern.includes(key);

        return (
          <div
            key={key}
            className={cn(
              "absolute rounded-[2px] transition-all duration-300",
              isHighlighted 
                ? "animate-pulse" 
                : "bg-muted/50"
            )}
            style={{
              width: tileSize,
              height: tileSize,
              left: col * (tileSize + gap),
              top: row * (tileSize + gap),
              backgroundColor: isHighlighted ? patternColor : undefined,
              boxShadow: isHighlighted ? `0 0 ${size === 'sm' ? 4 : 8}px ${patternColor}` : undefined,
            }}
          />
        );
      })}

      {/* Connecting lines SVG */}
      <svg 
        className="absolute inset-0 pointer-events-none"
        style={{ width: totalSize, height: totalSize }}
      >
        {highlightPattern.length > 1 && highlightPattern.slice(1).map((key, i) => {
          const [prevRow, prevCol] = highlightPattern[i].split('-').map(Number);
          const [row, col] = key.split('-').map(Number);
          
          const x1 = prevCol * (tileSize + gap) + tileSize / 2;
          const y1 = prevRow * (tileSize + gap) + tileSize / 2;
          const x2 = col * (tileSize + gap) + tileSize / 2;
          const y2 = row * (tileSize + gap) + tileSize / 2;

          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={patternColor}
              strokeWidth={size === 'sm' ? 1 : 2}
              opacity={0.6}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Labels */}
      {showLabels && size !== 'sm' && (
        <>
          {/* Column labels */}
          <div 
            className="absolute flex justify-between text-[8px] text-muted-foreground"
            style={{ 
              top: totalSize + 2, 
              left: 0, 
              width: totalSize 
            }}
          >
            {['C', 'H', 'O', 'R', 'D', 'S', 'M', 'S'].map((l, i) => (
              <span key={i} style={{ width: tileSize, textAlign: 'center' }}>{l}</span>
            ))}
          </div>
          {/* Row labels */}
          <div 
            className="absolute flex flex-col justify-between text-[8px] text-muted-foreground"
            style={{ 
              left: -12, 
              top: 0, 
              height: totalSize 
            }}
          >
            {['P', 'S', 'N', 'C', 'I', 'G', 'A', 'M'].map((l, i) => (
              <span key={i} style={{ height: tileSize, lineHeight: `${tileSize}px` }}>{l}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MiniMatrixPreview;
