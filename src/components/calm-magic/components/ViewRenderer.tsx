
import React from 'react';
import { Button } from '@/components/ui/button';
import SpiralNavigator from '../navigation/SpiralNavigator';
import CulturalUnitTests from '../CulturalUnitTests';
import LearningOrganizationDashboard from '../LearningOrganizationDashboard';
import OverviewTab from '@/components/product-development/OverviewTab';
import LandscapeJourney from './LandscapeJourney';
import InteractiveToolsPanel from '../tools/InteractiveToolsPanel';
import DreamMode from '../dream/DreamMode';
import { EmotionalState } from '@/types/journal';

type ViewMode = 'journey' | 'spiral' | 'tests' | 'learning' | 'overview' | 'tools' | 'dream';

interface ViewRendererProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentLandscape: number;
  emotionalState: Partial<EmotionalState>;
  onLandscapeChange: (landscape: number) => void;
  onStateChange: (state: Partial<EmotionalState>) => void;
  onStartJourney?: () => void;
  transformationStages: string[];
  emotionalJourney: string[];
}

const ViewRenderer: React.FC<ViewRendererProps> = ({
  viewMode,
  setViewMode,
  currentLandscape,
  emotionalState,
  onLandscapeChange,
  onStateChange,
  onStartJourney,
  transformationStages,
  emotionalJourney
}) => {
  switch (viewMode) {
    case 'journey':
      return (
        <LandscapeJourney
          currentLandscape={currentLandscape}
          emotionalState={emotionalState}
          onLandscapeChange={onLandscapeChange}
          onStateChange={onStateChange}
        />
      );

    case 'spiral':
      return (
        <div className="space-y-2">
          <SpiralNavigator
            currentLandscape={currentLandscape}
            onLandscapeChange={onLandscapeChange}
            transformationStages={transformationStages}
            emotionalJourney={emotionalJourney}
          />
          <div className="text-center">
            <Button onClick={() => setViewMode('journey')} variant="outline" size="sm">
              Enter Landscape Journey
            </Button>
          </div>
        </div>
      );

    case 'tests':
      return <CulturalUnitTests />;

    case 'learning':
      return <LearningOrganizationDashboard />;

    case 'overview':
      return <OverviewTab onStartJourney={onStartJourney} />;

    case 'tools':
      return (
        <InteractiveToolsPanel
          emotionalState={emotionalState}
          onStateChange={onStateChange}
        />
      );

    default:
      return null;
  }
};

export default ViewRenderer;
