
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
          title: 'Welcome to Calm Magic Tools',
          content: 'Explore different tools to analyze and develop your emotional intelligence and creative expression.',
          actionText: 'Start Assessment',
        },
        {
          id: 'tools-assessment',
          title: 'Needs Assessment',
          content: 'Begin with the assessment to receive personalized recommendations tailored to your journey.',
        }
      ],
      journey: [
        {
          id: 'journey-intro',
          title: 'Emotional Landscape Journey',
          content: 'Navigate through different emotional landscapes representing your personal growth and transformation.',
        }
      ],
      spiral: [
        {
          id: 'spiral-intro',
          title: 'Spiral Navigation',
          content: 'Discover your transformation journey through an intuitive spiral navigation system.',
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

  return null;
};

export default ContextualGuide;
