
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, Users, FileText, BarChart3 } from 'lucide-react';
import { GardenType, EmotionalState, JournalEntry } from '@/types/journal';
import { gardens } from '@/data/gardens';

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  current: boolean;
  icon: React.ElementType;
}

interface ProcessStatusTrackerProps {
  selectedGarden: GardenType | null;
  emotionalState: EmotionalState | null;
  journalEntry: JournalEntry | null;
  currentStep: 'garden' | 'compass' | 'journal';
  onNavigateToStep?: (step: 'garden' | 'compass' | 'journal') => void;
}

const ProcessStatusTracker: React.FC<ProcessStatusTrackerProps> = ({
  selectedGarden,
  emotionalState,
  journalEntry,
  currentStep,
  onNavigateToStep
}) => {
  const currentGarden = selectedGarden ? gardens.find(g => g.type === selectedGarden) : null;

  const processSteps: ProcessStep[] = [
    {
      id: 'garden',
      name: 'Garden Selection',
      description: 'Choose your exploration context',
      completed: !!selectedGarden,
      current: currentStep === 'garden',
      icon: currentGarden ? () => <span>{currentGarden.icon}</span> : Circle
    },
    {
      id: 'compass',
      name: 'Emotional Mapping',
      description: 'Calibrate your internal state',
      completed: !!emotionalState,
      current: currentStep === 'compass',
      icon: BarChart3
    },
    {
      id: 'journal',
      name: 'Reflection & Documentation',
      description: 'Capture insights and patterns',
      completed: !!journalEntry,
      current: currentStep === 'journal',
      icon: FileText
    }
  ];

  const completedSteps = processSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / processSteps.length) * 100;

  const calculateIntegrationLevel = () => {
    if (!emotionalState) return 0;
    
    const levels = [
      emotionalState.love_level,
      emotionalState.magic_level,
      emotionalState.calm_level,
      emotionalState.open_level,
      emotionalState.free_level
    ];
    
    return Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Process Status & Quality Tracking
        </CardTitle>
        <div className="flex items-center gap-4">
          <Progress value={progressPercentage} className="flex-1" />
          <Badge variant={progressPercentage === 100 ? 'default' : 'outline'}>
            {completedSteps}/{processSteps.length} Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Process Steps */}
        <div className="space-y-4">
          {processSteps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.completed 
                    ? 'bg-green-100 border-green-500 text-green-600' 
                    : step.current
                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium ${step.current ? 'text-blue-600' : ''}`}>
                      {step.name}
                    </h4>
                    {step.current && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>

                {step.completed && onNavigateToStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigateToStep(step.id as any)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Review
                  </Button>
                )}

                {index < processSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 ml-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Context */}
        {selectedGarden && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h4 className="font-medium mb-2">Current Context</h4>
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-full text-xl"
                style={{ backgroundColor: `${currentGarden?.color}20` }}
              >
                {currentGarden?.icon}
              </div>
              <div>
                <p className="font-medium">{currentGarden?.name}</p>
                <p className="text-sm text-slate-600">{currentGarden?.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Integration Metrics */}
        {emotionalState && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {calculateIntegrationLevel()}
              </div>
              <div className="text-sm text-slate-600">Integration Level</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {emotionalState.free_level}
              </div>
              <div className="text-sm text-slate-600">Transformation Readiness</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {progressPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-slate-600">Process Completion</div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Recommended Next Actions</h4>
          <div className="space-y-2">
            {!selectedGarden && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Circle className="w-4 h-4" />
                <span>Select a garden to begin your exploration</span>
              </div>
            )}
            {selectedGarden && !emotionalState && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Circle className="w-4 h-4" />
                <span>Map your emotional state using the Calm Magic Compass</span>
              </div>
            )}
            {emotionalState && !journalEntry && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Circle className="w-4 h-4" />
                <span>Document your insights and reflections</span>
              </div>
            )}
            {journalEntry && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Process complete - ready for team collaboration</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessStatusTracker;
