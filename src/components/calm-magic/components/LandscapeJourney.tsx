
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import TreeLandscape from '../landscapes/TreeLandscape';
import RiverLandscape from '../landscapes/RiverLandscape';
import LakeLandscape from '../landscapes/LakeLandscape';
import ForestLandscape from '../landscapes/ForestLandscape';
import MountainLandscape from '../landscapes/MountainLandscape';
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
  const landscapes = [
    { name: 'Tree', component: TreeLandscape, key: 'love', emoji: '🌳' },
    { name: 'River', component: RiverLandscape, key: 'magic', emoji: '🌊' },
    { name: 'Lake', component: LakeLandscape, key: 'calm', emoji: '🏞️' },
    { name: 'Forest', component: ForestLandscape, key: 'open', emoji: '🌳' },
    { name: 'Mountain', component: MountainLandscape, key: 'free', emoji: '⛰️' }
  ];

  const handleLandscapeNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentLandscape < landscapes.length - 1) {
      onLandscapeChange(currentLandscape + 1);
    } else if (direction === 'prev' && currentLandscape > 0) {
      onLandscapeChange(currentLandscape - 1);
    }
  };

  const CurrentLandscapeComponent = landscapes[currentLandscape]?.component;

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default LandscapeJourney;
