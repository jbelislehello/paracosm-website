
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useMode } from '../context/ModeContext';
import { EmotionalState } from '@/types/journal';
import { calculateCoherenceLevel, getCoherenceStatus } from '../utils/coherenceUtils';

interface CoherenceTrackerProps {
  emotionalState: Partial<EmotionalState>;
}

const CoherenceTracker: React.FC<CoherenceTrackerProps> = ({ emotionalState }) => {
  const { mode } = useMode();
  
  // Calculate coherence based on emotional state and mode
  const calculatedCoherence = calculateCoherenceLevel(emotionalState, mode);
  const status = getCoherenceStatus(calculatedCoherence);
  
  // Get the appropriate color class for the progress bar
  const getProgressColorClass = (level: number) => {
    if (level > 80) return 'bg-green-500';
    if (level > 60) return 'bg-blue-500';
    if (level > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
          {mode === 'personal' ? '🧠 Internal Coherence' : '🌐 Leadership Coherence'}
        </div>
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
          {Math.round(calculatedCoherence)}%
        </span>
      </div>
      
      <div className="relative">
        <Progress value={calculatedCoherence} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColorClass(calculatedCoherence)}`}
          style={{ width: `${calculatedCoherence}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {status.label}
        </span>
        <span className="text-xs text-purple-600 dark:text-purple-400">
          {status.emoji} {status.description}
        </span>
      </div>
    </div>
  );
};

export default CoherenceTracker;
