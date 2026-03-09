
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EmotionalState } from '@/types/journal';
import EmotionalStagesFramework from './EmotionalStagesFramework';
import CalmMagicLensOverlay from './CalmMagicLensOverlay';
import RitualizedJourneyMap from './RitualizedJourneyMap';
import EmotiveCompassWidget from './EmotiveCompassWidget';
import PulseToPatternVisualizer from './PulseToPatternVisualizer';
import ExperienceDotsVisualization from '../components/ExperienceDotsVisualization';
import ClientNeedsAssessment from './ClientNeedsAssessment';
import ClientRecommendations from './ClientRecommendations';
import BoardEntryGate from '../BoardEntryGate';
import { OECDInsightMatcher } from '../OECDInsightMatcher';
import GlitchSessionTimer from './GlitchSessionTimer';
import AIObservatoryModel from './AIObservatoryModel';
import { Compass, ArrowRight } from 'lucide-react';

interface InteractiveToolsPanelProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
  insideBoard?: boolean;
  currentSeason?: string;
  visitedTilesCount?: number;
}

const InteractiveToolsPanel: React.FC<InteractiveToolsPanelProps> = ({
  emotionalState,
  onStateChange,
  insideBoard = false,
  currentSeason,
  visitedTilesCount
}) => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('assessment');
  const [showBoardGate, setShowBoardGate] = useState(false);

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
      'CulturalUnitTests': 'lens',
      'OECDInsightMatcher': 'oecd',
      'GlitchSessionTimer': 'session',
      'AIObservatoryModel': 'observatory'
    };

    const targetTab = toolTabMap[toolName] || 'framework';
    setActiveTab(targetTab);
  };

  return (
    <div className="w-full">
      {/* Boussole Calm Magic Quick Access - hidden when inside the board */}
      {!insideBoard && (
        <div className="mb-4 p-4 bg-gradient-to-r from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Boussole Calm Magic</h3>
                <p className="text-sm text-muted-foreground">
                  Commencez votre voyage d'expansion sur le Calm Magic Board
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowBoardGate(true)}
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
            >
              Ouvrir le Board
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Board context info when inside the board */}
      {insideBoard && (currentSeason || visitedTilesCount !== undefined) && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border/50 flex items-center gap-3 text-sm">
          <Compass className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">
            {currentSeason && <span className="font-medium text-foreground">{currentSeason}</span>}
            {visitedTilesCount !== undefined && <span> · {visitedTilesCount}/64 tiles visited</span>}
          </span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-11">
          <TabsTrigger value="assessment">🎯 Assessment</TabsTrigger>
          <TabsTrigger value="recommendations" disabled={!recommendations}>📋 Recommendations</TabsTrigger>
          <TabsTrigger value="framework">📊 Framework</TabsTrigger>
          <TabsTrigger value="lens">🔍 Lens</TabsTrigger>
          <TabsTrigger value="journey">🗺️ Journey</TabsTrigger>
          <TabsTrigger value="compass">🧭 Compass</TabsTrigger>
          <TabsTrigger value="visualizer">🌌 Visualizer</TabsTrigger>
          <TabsTrigger value="pathways">✨ Pathways</TabsTrigger>
          <TabsTrigger value="oecd">🏛️ OECD</TabsTrigger>
          <TabsTrigger value="session">⏱️ Session</TabsTrigger>
          <TabsTrigger value="observatory">🔭 Observatory</TabsTrigger>
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

        <TabsContent value="oecd" className="space-y-4">
          <OECDInsightMatcher />
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          <GlitchSessionTimer />
        </TabsContent>

        <TabsContent value="observatory" className="space-y-4">
          <AIObservatoryModel />
        </TabsContent>
      </Tabs>

      {/* Board Entry Gate Modal */}
      <BoardEntryGate
        isOpen={showBoardGate}
        onClose={() => setShowBoardGate(false)}
        sourceContext="relational"
        preselectedMode="personal"
      />
    </div>
  );
};

export default InteractiveToolsPanel;
