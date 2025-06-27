
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionalState } from '@/types/journal';
import EmotionalStagesFramework from './EmotionalStagesFramework';
import CalmMagicLensOverlay from './CalmMagicLensOverlay';
import RitualizedJourneyMap from './RitualizedJourneyMap';
import EmotiveCompassWidget from './EmotiveCompassWidget';
import PulseToPatternVisualizer from './PulseToPatternVisualizer';
import ExperienceDotsVisualization from '../components/ExperienceDotsVisualization';
import ClientNeedsAssessment from './ClientNeedsAssessment';
import ClientRecommendations from './ClientRecommendations';

interface InteractiveToolsPanelProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
}

const InteractiveToolsPanel: React.FC<InteractiveToolsPanelProps> = ({
  emotionalState,
  onStateChange
}) => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('assessment');

  const handleRecommendationsReady = (recs: any) => {
    setRecommendations(recs);
    setActiveTab('recommendations');
  };

  const handleStartJourney = (toolName: string) => {
    // Map tool names to tab values
    const toolTabMap: { [key: string]: string } = {
      'CalmMagicCompass': 'compass',
      'EmotionalStagesFramework': 'framework',
      'RitualizedJourneyMap': 'journey',
      'PulseToPatternVisualizer': 'visualizer',
      'EmotiveCompassWidget': 'compass',
      'LearningOrganizationDashboard': 'pathways',
      'CulturalUnitTests': 'lens'
    };

    const targetTab = toolTabMap[toolName] || 'framework';
    setActiveTab(targetTab);
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="assessment">🎯 Évaluation</TabsTrigger>
          <TabsTrigger value="recommendations" disabled={!recommendations}>📋 Recommandations</TabsTrigger>
          <TabsTrigger value="framework">📊 Framework</TabsTrigger>
          <TabsTrigger value="lens">🔍 Lens</TabsTrigger>
          <TabsTrigger value="journey">🗺️ Journey</TabsTrigger>
          <TabsTrigger value="compass">🧭 Compass</TabsTrigger>
          <TabsTrigger value="visualizer">🌌 Visualizer</TabsTrigger>
          <TabsTrigger value="pathways">✨ Pathways</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-4">
          <ClientNeedsAssessment
            emotionalState={emotionalState}
            onStateChange={onStateChange}
            onRecommendationsReady={handleRecommendationsReady}
          />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations && (
            <ClientRecommendations
              recommendations={recommendations}
              onStartJourney={handleStartJourney}
            />
          )}
        </TabsContent>

        <TabsContent value="framework" className="space-y-4">
          <EmotionalStagesFramework
            emotionalState={emotionalState}
            onStateChange={onStateChange}
          />
        </TabsContent>

        <TabsContent value="lens" className="space-y-4">
          <CalmMagicLensOverlay
            emotionalState={emotionalState}
            onStateChange={onStateChange}
          />
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <RitualizedJourneyMap />
        </TabsContent>

        <TabsContent value="compass" className="space-y-4">
          <EmotiveCompassWidget />
        </TabsContent>

        <TabsContent value="visualizer" className="space-y-4">
          <PulseToPatternVisualizer />
        </TabsContent>

        <TabsContent value="pathways" className="space-y-4">
          <ExperienceDotsVisualization mode="personal" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveToolsPanel;
