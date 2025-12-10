import React from 'react';
import { SeasonQualities, QUALITY_LABELS } from '@/types/trajectory';
import { Progress } from '@/components/ui/progress';

interface SeasonQualityBarsProps {
  qualities: SeasonQualities;
  compact?: boolean;
}

export const SeasonQualityBars: React.FC<SeasonQualityBarsProps> = ({ 
  qualities,
  compact = false 
}) => {
  const qualityEntries = Object.entries(QUALITY_LABELS) as [keyof SeasonQualities, typeof QUALITY_LABELS[keyof SeasonQualities]][];
  
  return (
    <div className={`space-y-${compact ? '2' : '3'}`}>
      {qualityEntries.map(([key, config]) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span>{config.icon}</span>
              <span className="font-medium">{config.label}</span>
              <span className="text-muted-foreground">({config.season})</span>
            </span>
            <span className="text-muted-foreground font-mono">
              {qualities[key]}%
            </span>
          </div>
          <Progress 
            value={qualities[key]} 
            className="h-2"
            style={{
              '--progress-background': config.color,
            } as React.CSSProperties}
          />
        </div>
      ))}
    </div>
  );
};

export default SeasonQualityBars;
