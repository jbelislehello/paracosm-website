
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionalState } from '@/types/journal';
import EmotionalStagesFramework from './EmotionalStagesFramework';
import CalmMagicLensOverlay from './CalmMagicLensOverlay';
import RitualizedJourneyMap from './RitualizedJourneyMap';
import EmotiveCompassWidget from './EmotiveCompassWidget';
import PulseToPatternVisualizer from './PulseToPatternVisualizer';

interface InteractiveToolsPanelProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
}

const InteractiveToolsPanel: React.FC<InteractiveToolsPanelProps> = ({
  emotionalState,
  onStateChange
}) => {
  return (
    <div className="w-full">
      <Tabs defaultValue="framework" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="framework">📊 Framework</TabsTrigger>
          <TabsTrigger value="lens">🔍 Lens</TabsTrigger>
          <TabsTrigger value="journey">🗺️ Journey</TabsTrigger>
          <TabsTrigger value="compass">🧭 Compass</TabsTrigger>
          <TabsTrigger value="visualizer">🌌 Visualizer</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};

export default InteractiveToolsPanel;
