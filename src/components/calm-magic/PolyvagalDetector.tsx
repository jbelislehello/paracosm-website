import React from 'react';
import { inferPolyvagalState, POLYVAGAL_STORIES, type PolyvagalState } from '@/types/polyvagal';
import type { EmotionalAxes } from '@/types/trajectory';

interface PolyvagalDetectorProps {
  axes?: EmotionalAxes;
  className?: string;
  compact?: boolean;
}

const PolyvagalDetector: React.FC<PolyvagalDetectorProps> = ({ 
  axes, 
  className = '',
  compact = false 
}) => {
  const state: PolyvagalState = axes 
    ? inferPolyvagalState(axes)
    : 'ventral_vagal';
  
  const story = POLYVAGAL_STORIES[state];

  if (compact) {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
        style={{ 
          backgroundColor: `${story.color}15`,
          color: story.color,
          borderColor: `${story.color}30`,
          borderWidth: 1,
        }}
        title={story.description}
      >
        <span>{story.icon}</span>
        <span>{story.story}</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${className}`} style={{ borderColor: `${story.color}30` }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{story.icon}</span>
        <div>
          <h4 className="text-sm font-semibold" style={{ color: story.color }}>{story.story}</h4>
          <p className="text-xs text-muted-foreground">{story.label}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{story.description}</p>
      <div className="flex flex-wrap gap-1">
        {story.qualities.map(q => (
          <span 
            key={q} 
            className="px-2 py-0.5 rounded-full text-[10px]"
            style={{ backgroundColor: `${story.color}10`, color: story.color }}
          >
            {q}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PolyvagalDetector;
