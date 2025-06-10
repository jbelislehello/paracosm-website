
import React from 'react';
import { EmotionalState } from '@/types/journal';

interface PoiesisIndicatorProps {
  emotionalState: Partial<EmotionalState>;
}

const PoiesisIndicator: React.FC<PoiesisIndicatorProps> = ({ emotionalState }) => {
  const isPoiesisActive = Object.values(emotionalState).some(level => 
    typeof level === 'number' && level > 75
  );

  if (!isPoiesisActive) return null;

  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg border border-green-200 dark:border-green-800">
      <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
        🌟 Poiesis Active
      </div>
      <div className="text-xs text-green-600 dark:text-green-400">
        Natural transformation emerging through expressivity
      </div>
    </div>
  );
};

export default PoiesisIndicator;
