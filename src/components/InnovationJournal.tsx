
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, BarChart3, Workflow } from 'lucide-react';
import GardenSelector from './journal/GardenSelector';
import CalmMagicCompass from './journal/CalmMagicCompass';
import JournalInterface from './journal/JournalInterface';
import CalmMagicProcessDiagram from './calm-magic/CalmMagicProcessDiagram';
import EngineeringQualityFramework from './calm-magic/EngineeringQualityFramework';
import ProcessStatusTracker from './calm-magic/ProcessStatusTracker';
import CalmMagicDocumentation from './calm-magic/CalmMagicDocumentation';
import { useJournal } from '@/hooks/useJournal';
import { GardenType, EmotionalState } from '@/types/journal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const InnovationJournal = () => {
  const [currentStep, setCurrentStep] = useState<'garden' | 'compass' | 'journal'>('garden');
  const [selectedGarden, setSelectedGarden] = useState<GardenType | null>(null);
  const [emotionalState, setEmotionalState] = useState<Partial<EmotionalState>>({
    love_level: 50,
    magic_level: 50,
    calm_level: 50,
    open_level: 50,
    free_level: 50
  });
  const [savedEmotionalState, setSavedEmotionalState] = useState<EmotionalState | null>(null);
  const [savedJournalEntry, setSavedJournalEntry] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('process');

  const { saveEmotionalState, saveJournalEntry, loading } = useJournal();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the Innovation Journal. The demo will show the interface without saving data.",
          variant: "destructive",
        });
      }
      setUser(user);
    };

    checkAuth();
  }, [toast]);

  const handleGardenSelect = (garden: GardenType) => {
    setSelectedGarden(garden);
    setEmotionalState(prev => ({ ...prev, garden }));
    setCurrentStep('compass');
  };

  const handleEmotionalStateComplete = async () => {
    if (!selectedGarden) return;

    const stateToSave = {
      garden: selectedGarden,
      love_level: emotionalState.love_level || 50,
      magic_level: emotionalState.magic_level || 50,
      calm_level: emotionalState.calm_level || 50,
      open_level: emotionalState.open_level || 50,
      free_level: emotionalState.free_level || 50,
      shadow_self_notes: emotionalState.shadow_self_notes,
      higher_self_notes: emotionalState.higher_self_notes
    };

    if (user) {
      const saved = await saveEmotionalState(stateToSave);
      if (saved) {
        setSavedEmotionalState(saved);
      }
    } else {
      // Demo mode - just proceed without saving
      setSavedEmotionalState({
        id: 'demo',
        user_id: 'demo',
        ...stateToSave,
        created_at: new Date().toISOString()
      });
    }
    
    setCurrentStep('journal');
  };

  const handleJournalSave = async (entry: any) => {
    if (user) {
      const saved = await saveJournalEntry(entry);
      if (saved) {
        setSavedJournalEntry(saved);
      }
    } else {
      toast({
        title: "Demo Mode",
        description: "Entry saved in demo mode. Sign in to persist your reflections.",
      });
      setSavedJournalEntry(entry);
    }
    
    // Reset to garden selection for next entry
    setCurrentStep('garden');
    setSelectedGarden(null);
    setSavedEmotionalState(null);
    setSavedJournalEntry(null);
    setEmotionalState({
      love_level: 50,
      magic_level: 50,
      calm_level: 50,
      open_level: 50,
      free_level: 50
    });
  };

  const handleBack = () => {
    if (currentStep === 'compass') {
      setCurrentStep('garden');
      setSelectedGarden(null);
    } else if (currentStep === 'journal') {
      setCurrentStep('compass');
    }
  };

  const handleNavigateToStep = (step: 'garden' | 'compass' | 'journal') => {
    setCurrentStep(step);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="process" className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            Process
          </TabsTrigger>
          <TabsTrigger value="diagram" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Diagram
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

        <TabsContent value="process" className="space-y-6">
          {currentStep !== 'garden' && (
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Process Area */}
            <div className="lg:col-span-2">
              {currentStep === 'garden' && (
                <GardenSelector
                  selectedGarden={selectedGarden}
                  onSelectGarden={handleGardenSelect}
                />
              )}

              {currentStep === 'compass' && selectedGarden && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                      Entering the {selectedGarden.charAt(0).toUpperCase() + selectedGarden.slice(1)} Garden
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      Take a moment to read your internal territory before beginning your reflection.
                    </p>
                  </div>
                  
                  <CalmMagicCompass
                    emotionalState={emotionalState}
                    onStateChange={setEmotionalState}
                  />
                  
                  <Button 
                    onClick={handleEmotionalStateComplete}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Saving State...' : 'Begin Reflection'}
                  </Button>
                </div>
              )}

              {currentStep === 'journal' && selectedGarden && (
                <JournalInterface
                  garden={selectedGarden}
                  emotionalState={savedEmotionalState}
                  onSaveEntry={handleJournalSave}
                  loading={loading}
                />
              )}
            </div>

            {/* Process Status Sidebar */}
            <div className="space-y-6">
              <ProcessStatusTracker
                selectedGarden={selectedGarden}
                emotionalState={savedEmotionalState}
                journalEntry={savedJournalEntry}
                currentStep={currentStep}
                onNavigateToStep={handleNavigateToStep}
              />

              {savedEmotionalState && (
                <EngineeringQualityFramework
                  emotionalState={savedEmotionalState}
                  journalEntry={savedJournalEntry}
                />
              )}
            </div>
          </div>

          {!user && (
            <Card className="mt-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Demo Mode</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You're experiencing the Innovation Journal in demo mode. 
                  Sign in to save your reflections and access team collaboration features.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="diagram">
          <CalmMagicProcessDiagram />
        </TabsContent>

        <TabsContent value="quality">
          <EngineeringQualityFramework
            emotionalState={savedEmotionalState}
            journalEntry={savedJournalEntry}
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
