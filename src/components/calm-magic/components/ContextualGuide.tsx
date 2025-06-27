
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, X, ChevronRight, BookOpen } from 'lucide-react';
import { useUserPreferences } from '../hooks/useUserPreferences';

interface GuideStep {
  id: string;
  title: string;
  content: string;
  actionText?: string;
  onAction?: () => void;
}

interface ContextualGuideProps {
  viewMode: string;
  isFirstTime?: boolean;
  onGuideComplete?: () => void;
}

const ContextualGuide: React.FC<ContextualGuideProps> = ({
  viewMode,
  isFirstTime = false,
  onGuideComplete
}) => {
  const { preferences } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const getGuideSteps = (mode: string): GuideStep[] => {
    const guides: { [key: string]: GuideStep[] } = {
      tools: [
        {
          id: 'tools-intro',
          title: 'Bienvenue dans les Outils Calm Magic',
          content: 'Ici vous pouvez explorer différents outils pour analyser et développer votre intelligence émotionnelle.',
          actionText: 'Commencer l\'évaluation',
        },
        {
          id: 'tools-assessment',
          title: 'Évaluation des Besoins',
          content: 'Commencez par l\'évaluation pour recevoir des recommandations personnalisées.',
        }
      ],
      journey: [
        {
          id: 'journey-intro',
          title: 'Voyage dans les Paysages Émotionnels',
          content: 'Explorez différents paysages qui représentent vos états émotionnels et votre croissance personnelle.',
        }
      ],
      spiral: [
        {
          id: 'spiral-intro',
          title: 'Navigation Spirale',
          content: 'Découvrez votre parcours de transformation à travers une navigation en spirale intuitive.',
        }
      ]
    };
    
    return guides[mode] || [];
  };

  const steps = getGuideSteps(viewMode);

  useEffect(() => {
    if (preferences.interfaceSettings.showGuides && (isFirstTime || steps.length > 0)) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [viewMode, isFirstTime, preferences.interfaceSettings.showGuides]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onGuideComplete) {
      onGuideComplete();
    }
  };

  const handleAction = () => {
    const step = steps[currentStep];
    if (step.onAction) {
      step.onAction();
    }
    handleNext();
  };

  if (!isVisible || !preferences.interfaceSettings.showGuides || steps.length === 0) {
    return null;
  }

  const currentGuide = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto animate-scale-in border-2 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Guide Contexte
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-lg mb-2">{currentGuide.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {currentGuide.content}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentGuide.actionText && (
                <Button onClick={handleAction} size="sm" variant="outline">
                  {currentGuide.actionText}
                </Button>
              )}
              <Button onClick={handleNext} size="sm">
                {currentStep < steps.length - 1 ? (
                  <>
                    Suivant <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  'Terminer'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextualGuide;
