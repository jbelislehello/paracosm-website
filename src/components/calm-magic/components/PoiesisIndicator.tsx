
import React from 'react';
import { EmotionalState } from '@/types/journal';
import { useMode } from '../context/ModeContext';
import { calculateCoherenceLevel, calculateInnovationCapacity, calculateResonance } from '../utils/coherenceUtils';

interface PoiesisIndicatorProps {
  emotionalState: Partial<EmotionalState>;
}

const PoiesisIndicator: React.FC<PoiesisIndicatorProps> = ({ emotionalState }) => {
  const { mode, competencyFocus } = useMode();
  
  // Check if poiesis is active by checking high emotional levels
  const isPoiesisActive = Object.values(emotionalState).some(level => 
    typeof level === 'number' && level > 75
  );
  
  // Calculate coherence and resonance
  const coherenceLevel = calculateCoherenceLevel(emotionalState, mode);
  const innovationCapacity = calculateInnovationCapacity(emotionalState);
  const resonanceLevel = calculateResonance(emotionalState, competencyFocus);
  
  // Only show poiesis indicator when coherence is high or emotional states are high
  const showPoiesis = isPoiesisActive || coherenceLevel > 70;
  
  if (!showPoiesis) return null;

  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg border border-green-200 dark:border-green-800">
      <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
        🌟 Poiesis Active
      </div>
      
      {mode === 'professional' ? (
        <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
          <div>Innovation Capacity: {Math.round(innovationCapacity)}%</div>
          <div>Leadership Coherence: {Math.round(coherenceLevel)}%</div>
          {competencyFocus && (
            <div>Competency Resonance: {Math.round(resonanceLevel)}%</div>
          )}
        </div>
      ) : (
        <div className="text-xs text-green-600 dark:text-green-400">
          Natural transformation emerging through expressivity
        </div>
      )}
    </div>
  );
};

export default PoiesisIndicator;
