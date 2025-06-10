
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import TreeLandscape from '../landscapes/TreeLandscape';
import RiverLandscape from '../landscapes/RiverLandscape';
import LakeLandscape from '../landscapes/LakeLandscape';
import ForestLandscape from '../landscapes/ForestLandscape';
import MountainLandscape from '../landscapes/MountainLandscape';
import ModeSwitcher from './ModeSwitcher';
import CompetencyMapping from './CompetencyMapping';
import CoherenceTracker from './CoherenceTracker';
import { useMode } from '../context/ModeContext';
import { EmotionalState } from '@/types/journal';

interface LandscapeJourneyProps {
  currentLandscape: number;
  emotionalState: Partial<EmotionalState>;
  onLandscapeChange: (index: number) => void;
  onStateChange: (state: Partial<EmotionalState>) => void;
}

const LandscapeJourney: React.FC<LandscapeJourneyProps> = ({
  currentLandscape,
  emotionalState,
  onLandscapeChange,
  onStateChange
}) => {
  const { mode } = useMode();
  
  const landscapes = [
    { 
      name: 'Tree', 
      component: TreeLandscape, 
      key: 'love',
      emoji: '🌳',
      personal: 'Love & Connection',
      professional: 'Authentic Leadership' 
    },
    { 
      name: 'River', 
      component: RiverLandscape, 
      key: 'magic', 
      emoji: '🌊',
      personal: 'Creative Flow',
      professional: 'Intuitive Innovation'
    },
    { 
      name: 'Lake', 
      component: LakeLandscape, 
      key: 'calm', 
      emoji: '🏞️',
      personal: 'Calm & Wholeness',
      professional: 'Systems Thinking'
    },
    { 
      name: 'Forest', 
      component: ForestLandscape, 
      key: 'open', 
      emoji: '🌳',
      personal: 'Openness & Play',
      professional: 'Collaborative Co-Creation'
    },
    { 
      name: 'Mountain', 
      component: MountainLandscape, 
      key: 'free', 
      emoji: '⛰️',
      personal: 'Freedom & Integration',
      professional: 'Visionary Leadership'
    }
  ];

  const handleLandscapeNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentLandscape < landscapes.length - 1) {
      onLandscapeChange(currentLandscape + 1);
    } else if (direction === 'prev' && currentLandscape > 0) {
      onLandscapeChange(currentLandscape - 1);
    }
  };

  const CurrentLandscapeComponent = landscapes[currentLandscape]?.component;
  const currentLandscapeType = landscapes[currentLandscape]?.name.toLowerCase() as 
    'tree' | 'river' | 'lake' | 'forest' | 'mountain';

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <ModeSwitcher />
      
      {/* Current Landscape Context */}
      <div className="text-center mb-2">
        <Badge variant="outline" className="mb-2 px-4">
          {mode === 'personal' 
            ? landscapes[currentLandscape]?.personal
            : landscapes[currentLandscape]?.professional
          }
        </Badge>
      </div>
      
      {/* Current Landscape */}
      <div className="relative">
        {CurrentLandscapeComponent && (
          <CurrentLandscapeComponent
            emotionalState={emotionalState}
            onStateChange={onStateChange}
            isActive={true}
          />
        )}
        
        {/* Navigation Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Button
            onClick={() => handleLandscapeNavigation('prev')}
            disabled={currentLandscape === 0}
            size="sm"
            variant="outline"
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <Badge variant="outline" className="px-3">
            {landscapes[currentLandscape]?.emoji} {landscapes[currentLandscape]?.name}
          </Badge>
          <Button
            onClick={() => handleLandscapeNavigation('next')}
            disabled={currentLandscape === landscapes.length - 1}
            size="sm"
            variant="outline"
          >
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Professional Leadership Competency Mapping */}
      <CompetencyMapping landscapeType={currentLandscapeType} />
      
      {/* Coherence Tracker */}
      <CoherenceTracker emotionalState={emotionalState} />
    </div>
  );
};

export default LandscapeJourney;
