
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, BarChart3, Workflow, Users, Search, Lightbulb } from 'lucide-react';
import ProductDevelopmentSteps from './calm-magic/ProductDevelopmentSteps';
import StakeholderResearchInterface from './calm-magic/StakeholderResearchInterface';
import ProblemAnalysisCanvas from './calm-magic/ProblemAnalysisCanvas';
import DiegeticPrototypeBuilder from './calm-magic/DiegeticPrototypeBuilder';
import CalmMagicProcessDiagram from './calm-magic/CalmMagicProcessDiagram';
import EngineeringQualityFramework from './calm-magic/EngineeringQualityFramework';
import ProcessStatusTracker from './calm-magic/ProcessStatusTracker';
import CalmMagicDocumentation from './calm-magic/CalmMagicDocumentation';
import { useJournal } from '@/hooks/useJournal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const InnovationJournal = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [stakeholderData, setStakeholderData] = useState<any>(null);
  const [problemAnalysis, setProblemAnalysis] = useState<any>(null);
  const [prototypeData, setPrototypeData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('framework');

  const { loading } = useJournal();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Demo Mode",
          description: "You're experiencing the Healing Framework in demo mode. Sign in to save your healing journey progress.",
        });
      }
      setUser(user);
    };

    checkAuth();
  }, [toast]);

  const handleContextSelect = (context: string) => {
    setSelectedContext(context);
    setCurrentStep(1);
  };

  const handleResearchComplete = (data: any) => {
    setStakeholderData(data);
    setCompletedSteps([...completedSteps, 1]);
    setCurrentStep(2);
    setSelectedContext(null); // Reset for next step
  };

  const handleAnalysisComplete = (analysis: any) => {
    setProblemAnalysis(analysis);
    setCompletedSteps([...completedSteps, 2]);
    setCurrentStep(3);
  };

  const handlePrototypeComplete = (prototype: any) => {
    setPrototypeData(prototype);
    setCompletedSteps([...completedSteps, 3]);
    setCurrentStep(4);
    
    toast({
      title: "Awareness Phase Complete!",
      description: "Understanding the Healing phase is done. Ready to move to Creating Transformation.",
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Remove the current step from completed steps
      setCompletedSteps(completedSteps.filter(step => step !== currentStep));
    }
  };

  const handleNavigateToStep = (step: number) => {
    setCurrentStep(step);
  };

  const healingContexts = [
    {
      type: 'healing_assessment',
      name: 'Healing Assessment Context',
      description: 'Explore your emotional patterns and what blocks healing in your relationships',
      icon: '💜',
      color: '#db2777',
      prompts: [
        'What emotional patterns keep repeating in your relationships?',
        'What healing do you most need in your connections with others?'
      ]
    },
    {
      type: 'relationship_dynamics',
      name: 'Relationship Dynamics Analysis',
      description: 'Understand the dynamics, triggers, and communication patterns in your relationships',
      icon: '🤝',
      color: '#7c3aed',
      prompts: [
        'What relationship dynamics cause the most stress or conflict?',
        'Where do you feel disconnected or misunderstood?'
      ]
    },
    {
      type: 'healing_vision',
      name: 'Healing Vision Exploration',
      description: 'Imagine transformed relationships and breakthrough emotional possibilities',
      icon: '✨',
      color: '#2563eb',
      prompts: [
        'What would your ideal healed relationships look like?',
        'What new ways of being could emerge from this healing?'
      ]
    }
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StakeholderResearchInterface
            selectedContext={selectedContext}
            onContextSelect={handleContextSelect}
            onCompleteResearch={handleResearchComplete}
          />
        );
      case 2:
        return (
          <ProblemAnalysisCanvas
            onCompleteAnalysis={handleAnalysisComplete}
            stakeholderData={stakeholderData}
          />
        );
      case 3:
        return (
          <DiegeticPrototypeBuilder
            onCompletePrototype={handlePrototypeComplete}
            problemAnalysis={problemAnalysis}
          />
        );
      default:
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Awareness Phase Complete!</h2>
            <p className="text-slate-600">
              You've successfully completed the Understanding phase. Next steps would involve 
              creating healing practices, designing transformation rituals, and preparing for deep healing work.
            </p>
            <Button onClick={() => setCurrentStep(1)}>
              Start New Healing Journey
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="framework" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Framework
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            Healing Journey
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Quality
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="framework" className="space-y-6">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Step 1: Healing Assessment & Emotional Mapping</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Choose your healing context to begin understanding your emotional and relational landscape
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healingContexts.map((context) => (
                <Card 
                  key={context.type}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <CardContent className="p-6 text-center">
                    <div 
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4"
                      style={{ backgroundColor: `${context.color}20` }}
                    >
                      {context.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{context.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                      {context.description}
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-slate-500">Key Questions:</div>
                      <ul className="text-xs text-slate-500 space-y-1">
                        {context.prompts.map((prompt, idx) => (
                          <li key={idx}>• {prompt}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <ProductDevelopmentSteps
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          {/* Process Overview Diagram */}
          <div className="mb-8">
            <CalmMagicProcessDiagram />
          </div>

          {currentStep > 1 && (
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Previous Step
            </Button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Process Area */}
            <div className="lg:col-span-2">
              {renderCurrentStep()}
            </div>

            {/* Progress Summary Sidebar */}
            <div className="space-y-6">
              {(stakeholderData || problemAnalysis || prototypeData) && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Healing Progress</h3>
                    <div className="space-y-3 text-sm">
                      {stakeholderData && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>Context: {stakeholderData.context?.replace('_', ' ')}</span>
                        </div>
                      )}
                      {problemAnalysis && (
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-purple-600" />
                          <span>Pattern Analysis: {Math.round((problemAnalysis.impact_level + problemAnalysis.urgency_level + problemAnalysis.feasibility_level + problemAnalysis.stakeholder_alignment + problemAnalysis.resource_availability) / 5)}% healing opportunity</span>
                        </div>
                      )}
                      {prototypeData && (
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-green-600" />
                          <span>Healing Vision: "{prototypeData.title}"</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {!user && (
            <Card className="mt-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Demo Mode</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You're experiencing the Healing Framework in demo mode. 
                  Sign in to save your progress and access community healing features.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quality">
          <EngineeringQualityFramework
            emotionalState={null}
            journalEntry={null}
          />
        </TabsContent>

        <TabsContent value="docs">
          <CalmMagicDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InnovationJournal;
