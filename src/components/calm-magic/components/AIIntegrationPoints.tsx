
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIIntegrationPoints: React.FC = () => {
  const [activeIntegration, setActiveIntegration] = useState('detection');

  const integrationPoints = [
    {
      id: 'detection',
      title: 'Pattern Detection',
      icon: '🔍',
      description: 'AI identifies organizational loops and spiral opportunities',
      capabilities: [
        'Real-time communication pattern analysis',
        'Meeting dynamics assessment',
        'Decision-making loop detection',
        'Energy flow tracking across teams',
        'Stress pattern recognition'
      ],
      implementation: 'Slack/Teams integration with sentiment analysis',
      impact: 'Early intervention prevents organizational loops'
    },
    {
      id: 'amplification',
      title: 'Wisdom Amplification',
      icon: '🔊',
      description: 'AI amplifies human wisdom rather than replacing it',
      capabilities: [
        'Collective intelligence synthesis',
        'Best practice pattern matching',
        'Cross-team learning acceleration',
        'Innovation idea clustering',
        'Success pattern replication'
      ],
      implementation: 'Knowledge graph with ML-powered insights',
      impact: 'Organizational learning velocity increases 3-5x'
    },
    {
      id: 'feedback',
      title: 'Coherence Feedback',
      icon: '📊',
      description: 'Real-time organizational coherence monitoring',
      capabilities: [
        'Team emotional state tracking',
        'Collaboration quality metrics',
        'Innovation pipeline health',
        'Leadership presence indicators',
        'Collective flow state detection'
      ],
      implementation: 'Dashboard with predictive analytics',
      impact: 'Proactive organizational health management'
    },
    {
      id: 'guidance',
      title: 'Transformation Guidance',
      icon: '🧭',
      description: 'AI-guided spiral transformation pathways',
      capabilities: [
        'Personalized development recommendations',
        'Team dynamic optimization',
        'Intervention timing suggestions',
        'Practice effectiveness tracking',
        'Spiral progression mapping'
      ],
      implementation: 'AI coach with calm magic principles',
      impact: 'Accelerated individual and collective growth'
    }
  ];

  const currentIntegration = integrationPoints.find(point => point.id === activeIntegration) || integrationPoints[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI Integration Points for Organizational Transformation
            <Badge variant="outline">Human + AI Wisdom</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Integration Point Selector */}
          <div className="grid md:grid-cols-4 gap-3">
            {integrationPoints.map((point) => (
              <Button
                key={point.id}
                variant={activeIntegration === point.id ? 'default' : 'outline'}
                className="h-auto p-3 flex flex-col gap-2"
                onClick={() => setActiveIntegration(point.id)}
              >
                <div className="text-2xl">{point.icon}</div>
                <div className="text-sm font-medium">{point.title}</div>
              </Button>
            ))}
          </div>

          {/* Detailed Integration View */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-3xl">{currentIntegration.icon}</span>
                <div>
                  <div>{currentIntegration.title}</div>
                  <div className="text-sm font-normal text-slate-600 dark:text-slate-300">
                    {currentIntegration.description}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="capabilities" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  <TabsTrigger value="implementation">Implementation</TabsTrigger>
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                </TabsList>

                <TabsContent value="capabilities" className="space-y-3">
                  <h4 className="font-semibold">AI Capabilities</h4>
                  <ul className="space-y-2">
                    {currentIntegration.capabilities.map((capability, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="implementation" className="space-y-3">
                  <h4 className="font-semibold">Technical Implementation</h4>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border">
                    <code className="text-sm text-slate-700 dark:text-slate-300">
                      {currentIntegration.implementation}
                    </code>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Integration leverages existing organizational tools and data streams
                    to provide seamless AI enhancement without disrupting current workflows.
                  </div>
                </TabsContent>

                <TabsContent value="impact" className="space-y-3">
                  <h4 className="font-semibold">Organizational Impact</h4>
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                    <div className="font-medium text-green-700 dark:text-green-300 mb-2">
                      Primary Outcome
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      {currentIntegration.impact}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Ethics & Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">🌊 Calm Magic AI Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-purple-600">Human Wisdom First</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      AI amplifies rather than replaces human intuition and wisdom
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-600">Transparent Operations</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      All AI insights include explanation and reasoning paths
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-green-600">Privacy Protection</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Individual data anonymized, focus on collective patterns
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-600">Evolutionary Intent</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Technology serves human flourishing and consciousness growth
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIIntegrationPoints;
