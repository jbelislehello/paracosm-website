
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EnhancedTorusEnergyField from './EnhancedTorusEnergyField';
import SpiralVsLoopComparator from './SpiralVsLoopComparator';
import OrganizationalCoherenceTracker from './OrganizationalCoherenceTracker';
import AIIntegrationPoints from './AIIntegrationPoints';
import CollectiveIntelligenceEmergence from './CollectiveIntelligenceEmergence';
import { useMode } from '../context/ModeContext';

const SpiralLearningOrganization: React.FC = () => {
  const { mode } = useMode();
  const [activeVisualization, setActiveVisualization] = useState<string>('torus');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Spiral Organizational Transformation
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Transform organizational loops into evolutionary spirals using AI-amplified calm magic principles. 
          Watch how individual consciousness shifts create collective intelligence emergence.
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Badge variant="outline">Torus Dynamics</Badge>
          <Badge variant="outline">Sacred Geometry</Badge>
          <Badge variant="outline">Collective Coherence</Badge>
          <Badge variant="outline">AI Integration</Badge>
          <Badge variant="outline">Experience Pathways</Badge>
        </div>
      </div>

      {/* Main Visualization Tabs */}
      <Tabs value={activeVisualization} onValueChange={setActiveVisualization} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="torus">🌀 Torus Field</TabsTrigger>
          <TabsTrigger value="spiral">🌊 Spiral vs Loop</TabsTrigger>
          <TabsTrigger value="coherence">💫 Coherence</TabsTrigger>
          <TabsTrigger value="ai">🤖 AI Integration</TabsTrigger>
          <TabsTrigger value="emergence">✨ Emergence</TabsTrigger>
        </TabsList>

        <TabsContent value="torus" className="space-y-4">
          <EnhancedTorusEnergyField mode={mode} />
        </TabsContent>

        <TabsContent value="spiral" className="space-y-4">
          <SpiralVsLoopComparator />
        </TabsContent>

        <TabsContent value="coherence" className="space-y-4">
          <OrganizationalCoherenceTracker />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <AIIntegrationPoints />
        </TabsContent>

        <TabsContent value="emergence" className="space-y-4">
          <CollectiveIntelligenceEmergence />
        </TabsContent>
      </Tabs>

      {/* Transformation Principles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📚 Organizational Transformation Principles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-600">From Loops to Spirals</h4>
              <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Reactive patterns → Evolutionary growth</li>
                <li>• Closed systems → Open learning cycles</li>
                <li>• Individual silos → Collective intelligence</li>
                <li>• Problem-focused → Solution-generative</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">AI as Amplifier</h4>
              <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Pattern recognition at scale</li>
                <li>• Real-time coherence feedback</li>
                <li>• Predictive transformation insights</li>
                <li>• Collective wisdom synthesis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpiralLearningOrganization;
