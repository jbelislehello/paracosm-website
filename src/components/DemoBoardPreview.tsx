import React from 'react';
import { Badge } from '@/components/ui/badge';

const SEASONS = [
  { name: 'POLLENS', color: 'bg-rose-500', short: 'P' },
  { name: 'NOEMS', color: 'bg-purple-500', short: 'N' },
  { name: 'POEMS', color: 'bg-blue-500', short: 'P' },
  { name: 'TOTEMS', color: 'bg-green-500', short: 'T' },
  { name: 'ANTHEMS', color: 'bg-amber-500', short: 'A' },
];

const TOLERANCE_ZONES = {
  inner: 'from-rose-400 to-purple-400',
  stretch: 'from-purple-400 to-blue-400',
  edge: 'from-blue-400 to-indigo-400',
};

interface DemoBoardPreviewProps {
  className?: string;
  showSeasons?: boolean;
  showLegend?: boolean;
  interactive?: boolean;
}

const DemoBoardPreview: React.FC<DemoBoardPreviewProps> = ({
  className = '',
  showSeasons = true,
  showLegend = true,
  interactive = true,
}) => {
  const getTileZone = (index: number): keyof typeof TOLERANCE_ZONES => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    
    // Inner zone: center 4x4
    if (row >= 2 && row <= 5 && col >= 2 && col <= 5) {
      return 'inner';
    }
    // Stretch zone: surrounding ring
    if (row >= 1 && row <= 6 && col >= 1 && col <= 6) {
      return 'stretch';
    }
    // Edge zone: outer ring
    return 'edge';
  };

  return (
    <div className={`bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800 ${className}`}>
      {/* Season Progress Indicator */}
      {showSeasons && (
        <div className="flex justify-between mb-4 px-2">
          {SEASONS.map((season, i) => (
            <div key={season.name} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${season.color}`}>
                {i + 1}
              </div>
              <span className="text-[8px] mt-1 text-muted-foreground">{season.name}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* 8x8 Tile Matrix with Window of Tolerance Zones */}
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 64 }).map((_, i) => {
          const zone = getTileZone(i);
          return (
            <div
              key={i}
              className={`aspect-square rounded transition-all duration-300 ${
                interactive ? 'hover:scale-110 cursor-pointer' : ''
              } bg-gradient-to-br ${TOLERANCE_ZONES[zone]} ${
                zone === 'inner' ? 'opacity-90' :
                zone === 'stretch' ? 'opacity-70' :
                'opacity-50'
              }`}
            />
          );
        })}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded bg-gradient-to-br ${TOLERANCE_ZONES.inner}`} />
            Inner
          </span>
          <span className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded bg-gradient-to-br ${TOLERANCE_ZONES.stretch}`} />
            Stretch
          </span>
          <span className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded bg-gradient-to-br ${TOLERANCE_ZONES.edge}`} />
            Edge
          </span>
        </div>
      )}
    </div>
  );
};

export default DemoBoardPreview;
