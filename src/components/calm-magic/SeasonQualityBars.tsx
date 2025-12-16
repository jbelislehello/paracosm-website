import React from 'react';
import { SeasonQualities, QUALITY_LABELS } from '@/types/trajectory';

interface SeasonQualityBarsProps {
  qualities: SeasonQualities;
  compact?: boolean;
}

// Explicit colors for each quality (matching Ring → Quality mapping)
const QUALITY_COLORS: Record<keyof SeasonQualities, string> = {
  vitality: 'hsl(346, 77%, 49%)',      // Rose/Love (foundational)
  calmness: 'hsl(210, 70%, 50%)',      // Blue - Ring 1: Inner Core
  spaciousness: 'hsl(270, 60%, 50%)',  // Purple - Ring 2: Stretch Zone
  openness: 'hsl(142, 71%, 45%)',      // Green - Ring 3: Edge Zone
  freedom: 'hsl(45, 93%, 47%)',        // Amber - Ring 4: Integrator
};

export const SeasonQualityBars: React.FC<SeasonQualityBarsProps> = ({ 
  qualities,
  compact = false 
}) => {
  const qualityEntries = Object.entries(QUALITY_LABELS) as [keyof SeasonQualities, typeof QUALITY_LABELS[keyof SeasonQualities]][];
  
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {qualityEntries.map(([key, config]) => (
        <div key={key} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span>{config.icon}</span>
              <span className="font-medium text-foreground">{config.label}</span>
              <span className="text-muted-foreground text-[10px]">({config.season})</span>
            </span>
            <span className="text-foreground font-mono font-medium">
              {qualities[key]}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${qualities[key]}%`,
                backgroundColor: QUALITY_COLORS[key],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeasonQualityBars;
