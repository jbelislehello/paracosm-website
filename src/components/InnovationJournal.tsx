
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, BarChart3, Workflow, Users, Search, Lightbulb } from 'lucide-react';
import OverviewTab from '@/components/product-development/OverviewTab';
import ProcessTab from '@/components/product-development/ProcessTab';
import BridgeTab from '@/components/product-development/BridgeTab';
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
          description: "You're experiencing the Product Development Framework in demo mode. Sign in to save your project progress.",
        });
      }
      setUser(user);
    };

    checkAuth();
  }, [toast]);

  const handleStartJourney = () => {
    setActiveTab('process');
    setCurrentStep(1);
  };

  const handleContextSelect = (context: string) => {
    setSelectedContext(context);
    setCurrentStep(1);
  };

  const handleResearchComplete = (data: any) => {
    setStakeholderData(data);
    setCompletedSteps([...completedSteps, 1]);
    setCurrentStep(2);
    setSelectedContext(null);
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
      title: "Understanding Phase Complete!",
      description: "Problem understanding phase is done. Ready to move to Making It Real.",
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCompletedSteps(completedSteps.filter(step => step !== currentStep));
    }
  };

  const handleNavigateToStep = (step: number) => {
    setCurrentStep(step);
  };

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
            <h2 className="text-2xl font-bold">Understanding Phase Complete!</h2>
            <p className="text-slate-600">
              You've successfully completed the Understanding the Problem phase. Next steps would involve 
              creating technical requirements, systems intelligence documentation, and beginning development.
            </p>
            <Button onClick={() => setCurrentStep(1)}>
              Start New Product Journey
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
            Overview
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            7-Step Process
          </TabsTrigger>
          <TabsTrigger value="bridge" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Bridge Elements
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="framework" className="space-y-6">
          <OverviewTab onStartJourney={handleStartJourney} />
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <ProcessTab />
          
          {/* Interactive Process Flow */}
          <div className="mt-8">
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
                      <h3 className="font-semibold mb-3">Product Progress</h3>
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
                            <span>Analysis: {Math.round((problemAnalysis.impact_level + problemAnalysis.urgency_level + problemAnalysis.feasibility_level + problemAnalysis.stakeholder_alignment + problemAnalysis.resource_availability) / 5)}% solution opportunity</span>
                          </div>
                        )}
                        {prototypeData && (
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-green-600" />
                            <span>Prototype Vision: "{prototypeData.title}"</span>
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
                    You're experiencing the Product Development Framework in demo mode. 
                    Sign in to save your progress and access team collaboration features.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bridge">
          <BridgeTab />
        </TabsContent>

        <TabsContent value="docs">
          <CalmMagicDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InnovationJournal;
