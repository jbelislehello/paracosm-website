import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Grid3X3, 
  Compass, 
  Layers, 
  FileText,
  Target,
  Play,
  Library,
  CircleDot,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // CSS selector or element ID to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Calm Magic Board',
    description: 'This is your space for relational intelligence and living PRDs. Let\'s take a quick tour of the key features.',
    icon: <Sparkles className="w-6 h-6" />,
    position: 'center',
  },
  {
    id: 'seasons',
    title: '5 Seasons Journey',
    description: 'Your journey progresses through 5 seasons: Pollens → Noems → Poems → Totems → Anthems. Each season generates a layer of your PRD.',
    icon: <Layers className="w-6 h-6" />,
    highlight: '[data-tour="seasons"]',
    position: 'bottom',
  },
  {
    id: 'matrix',
    title: 'The Tile Matrix',
    description: 'An 8×8 grid of 64 tiles per season. Each tile represents a unique intersection of concepts. Navigate through them to build your understanding.',
    icon: <Grid3X3 className="w-6 h-6" />,
    highlight: '[data-tour="matrix"]',
    position: 'right',
  },
  {
    id: 'start',
    title: 'Start Your Journey',
    description: 'Click "Start Innovating" to begin at the origin tile (Mindsets × Chances). This is where every season starts.',
    icon: <Play className="w-6 h-6" />,
    highlight: '[data-tour="start-button"]',
    position: 'bottom',
  },
  {
    id: 'navigation',
    title: 'GL!TCH / DRIFT / TUNE',
    description: 'Navigate using three movements: GL!TCH (up), DRIFT (left/right), TUNE (down). These map to your creative process phases.',
    icon: <Compass className="w-6 h-6" />,
    highlight: '[data-tour="navigation"]',
    position: 'left',
  },
  {
    id: 'detail-panel',
    title: 'Tile Detail Panel',
    description: 'When you select a tile, the detail panel opens with contextual AI questions, a space to capture fragments, and emotional check-ins.',
    icon: <FileText className="w-6 h-6" />,
    highlight: '[data-tour="detail-panel"]',
    position: 'left',
  },
  {
    id: 'fragments',
    title: 'Capture Fragments',
    description: 'Save your insights, quotes, ideas as "fragments" (Polen entries). These feed into your PRD generation at the end of each season.',
    icon: <Library className="w-6 h-6" />,
    highlight: '[data-tour="fragments"]',
    position: 'bottom',
  },
  {
    id: 'window-of-tolerance',
    title: 'Window of Tolerance',
    description: 'Track your emotional state and trajectory. The Shadow Self shows where you are; the Higher Self marks where you\'re heading.',
    icon: <Target className="w-6 h-6" />,
    highlight: '[data-tour="wot"]',
    position: 'bottom',
  },
  {
    id: 'prd',
    title: 'PRD Assembly',
    description: 'As you complete seasons, PRD layers are automatically generated. View and edit your living PRD anytime.',
    icon: <CircleDot className="w-6 h-6" />,
    highlight: '[data-tour="prd"]',
    position: 'bottom',
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    description: 'Start with "Start Innovating" and explore at your own pace. The AI assistant is always available to help. Enjoy your journey!',
    icon: <CheckCircle2 className="w-6 h-6" />,
    position: 'center',
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  useEffect(() => {
    if (!isOpen) return;

    // Find and highlight the target element
    if (step.highlight) {
      const element = document.querySelector(step.highlight);
      setHighlightedElement(element);
      
      // Scroll element into view
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightedElement(null);
    }
  }, [isOpen, currentStep, step.highlight]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const getPositionClasses = () => {
    if (!highlightedElement || step.position === 'center') {
      return 'fixed inset-0 flex items-center justify-center';
    }

    const rect = highlightedElement.getBoundingClientRect();
    const padding = 16;

    switch (step.position) {
      case 'top':
        return `fixed`;
      case 'bottom':
        return `fixed`;
      case 'left':
        return `fixed`;
      case 'right':
        return `fixed`;
      default:
        return 'fixed inset-0 flex items-center justify-center';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
        onClick={handleSkip}
      />

      {/* Highlight cutout */}
      {highlightedElement && (
        <div
          className="fixed z-[101] ring-4 ring-primary ring-offset-4 ring-offset-background rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 8,
            left: highlightedElement.getBoundingClientRect().left - 8,
            width: highlightedElement.getBoundingClientRect().width + 16,
            height: highlightedElement.getBoundingClientRect().height + 16,
          }}
        />
      )}

      {/* Tour Card */}
      <div className={cn(
        "fixed z-[102] p-4",
        step.position === 'center' || !highlightedElement
          ? "inset-0 flex items-center justify-center"
          : ""
      )}>
        <Card 
          className={cn(
            "w-full max-w-md shadow-2xl border-primary/20",
            highlightedElement && step.position !== 'center' && "absolute"
          )}
          style={highlightedElement && step.position !== 'center' ? (() => {
            const rect = highlightedElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            
            switch (step.position) {
              case 'bottom':
                return {
                  top: Math.min(rect.bottom + 16, viewportHeight - 300),
                  left: Math.max(16, Math.min(rect.left, viewportWidth - 420)),
                };
              case 'top':
                return {
                  bottom: viewportHeight - rect.top + 16,
                  left: Math.max(16, Math.min(rect.left, viewportWidth - 420)),
                };
              case 'left':
                return {
                  top: Math.max(16, rect.top),
                  right: viewportWidth - rect.left + 16,
                };
              case 'right':
                return {
                  top: Math.max(16, rect.top),
                  left: rect.right + 16,
                };
              default:
                return {};
            }
          })() : undefined}
        >
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">
              {step.description}
            </p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentStep
                      ? "bg-primary"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip Tour
              </Button>

              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-purple-600">
                  {isLastStep ? (
                    <>
                      Get Started
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OnboardingTour;
