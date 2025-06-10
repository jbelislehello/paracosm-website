import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, BarChart3, Workflow, Users, Search, Lightbulb, Zap, Rocket } from 'lucide-react';
import OverviewTab from '@/components/product-development/OverviewTab';
import ProcessTab from '@/components/product-development/ProcessTab';
import BridgeTab from '@/components/product-development/BridgeTab';
import ProductDevelopmentSteps from './calm-magic/ProductDevelopmentSteps';
import StakeholderResearchInterface from './calm-magic/StakeholderResearchInterface';
import ProblemAnalysisCanvas from './calm-magic/ProblemAnalysisCanvas';
import DiegeticPrototypeBuilder from './calm-magic/DiegeticPrototypeBuilder';
import CalmMagicProcessDiagram from './calm-magic/CalmMagicProcessDiagram';
import CalmMagicDocumentation from './calm-magic/CalmMagicDocumentation';
import { useJournal } from '@/hooks/useJournal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
const EnhancedInnovationJournal = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [stakeholderData, setStakeholderData] = useState<any>(null);
  const [problemAnalysis, setProblemAnalysis] = useState<any>(null);
  const [prototypeData, setPrototypeData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('framework');
  const [isVisible, setIsVisible] = useState(false);
  const {
    loading
  } = useJournal();
  const {
    toast
  } = useToast();
  useEffect(() => {
    setIsVisible(true);
    const checkAuth = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Demo Mode",
          description: "You're experiencing the Product Development Framework in demo mode. Sign in to save your project progress."
        });
      }
      setUser(user);
    };
    checkAuth();
  }, [toast]);
  const handleStartJourney = () => {
    setActiveTab('innovation');
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
      description: "Problem understanding phase is done. Ready to move to Making It Real."
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
        return <StakeholderResearchInterface selectedContext={selectedContext} onContextSelect={handleContextSelect} onCompleteResearch={handleResearchComplete} />;
      case 2:
        return <ProblemAnalysisCanvas onCompleteAnalysis={handleAnalysisComplete} stakeholderData={stakeholderData} />;
      case 3:
        return <DiegeticPrototypeBuilder onCompletePrototype={handlePrototypeComplete} problemAnalysis={problemAnalysis} />;
      default:
        return <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Understanding Phase Complete!</h2>
            <p className="text-slate-600">
              You've successfully completed the Understanding the Problem phase. Next steps would involve 
              creating technical requirements, systems intelligence documentation, and beginning development.
            </p>
            <Button onClick={() => setCurrentStep(1)}>
              Start New Product Journey
            </Button>
          </div>;
    }
  };
  return <div className={`max-w-7xl mx-auto p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Edgy Header Section */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl blur-3xl" />
        
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <TabsTrigger value="framework" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="innovation" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <Workflow className="w-4 h-4" />
            Calm Innovation
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <Lightbulb className="w-4 h-4" />
            Quality
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <BookOpen className="w-4 h-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="framework" className="space-y-6">
          <div className="transform transition-all duration-500 hover:scale-[1.01]">
            <OverviewTab onStartJourney={handleStartJourney} />
          </div>
        </TabsContent>

        <TabsContent value="innovation" className="space-y-6">
          <div className="transform transition-all duration-500">
            <ProcessTab />
          </div>
          
          {/* Interactive Process Flow with enhanced styling */}
          <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="mb-8">
              <CalmMagicProcessDiagram />
            </div>

            {currentStep > 1 && <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} className="mb-6 flex items-center gap-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50">
                <ArrowLeft className="w-4 h-4" />
                Back to Previous Step
              </Button>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Process Area */}
              <div className="lg:col-span-2">
                {renderCurrentStep()}
              </div>

              {/* Progress Summary Sidebar */}
              <div className="space-y-6">
                {(stakeholderData || problemAnalysis || prototypeData) && <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Product Progress</h3>
                      <div className="space-y-3 text-sm">
                        {stakeholderData && <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span>Context: {stakeholderData.context?.replace('_', ' ')}</span>
                          </div>}
                        {problemAnalysis && <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-purple-600" />
                            <span>Analysis: {Math.round((problemAnalysis.impact_level + problemAnalysis.urgency_level + problemAnalysis.feasibility_level + problemAnalysis.stakeholder_alignment + problemAnalysis.resource_availability) / 5)}% solution opportunity</span>
                          </div>}
                        {prototypeData && <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-green-600" />
                            <span>Prototype Vision: "{prototypeData.title}"</span>
                          </div>}
                      </div>
                    </CardContent>
                  </Card>}
              </div>
            </div>

            {!user && <Card className="mt-8 max-w-2xl mx-auto">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Demo Mode</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    You're experiencing the Product Development Framework in demo mode. 
                    Sign in to save your progress and access team collaboration features.
                  </p>
                </CardContent>
              </Card>}
          </div>
        </TabsContent>

        <TabsContent value="quality">
          <div className="transform transition-all duration-500 hover:scale-[1.005]">
            <BridgeTab />
          </div>
        </TabsContent>

        <TabsContent value="docs">
          <div className="transform transition-all duration-500">
            <CalmMagicDocumentation />
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default EnhancedInnovationJournal;