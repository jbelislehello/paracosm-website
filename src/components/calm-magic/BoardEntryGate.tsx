import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Briefcase, 
  Compass, 
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Brain
} from 'lucide-react';
import { MODE_CONTENT, MODE_THEMES, JOURNEY_MODES_DESCRIPTION, ModeType } from '@/data/modeAwareContent';
import { AssessmentResult, generateBoardEntryParams } from '@/utils/assessmentToTolerance';

interface BoardEntryGateProps {
  isOpen: boolean;
  onClose: () => void;
  sourceContext?: 'relational' | 'agentic' | 'direct';
  assessmentResult?: AssessmentResult;
  preselectedMode?: ModeType;
}

const BoardEntryGate: React.FC<BoardEntryGateProps> = ({
  isOpen,
  onClose,
  sourceContext = 'direct',
  assessmentResult,
  preselectedMode
}) => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<ModeType | null>(preselectedMode || null);

  const handleModeSelect = (mode: ModeType) => {
    setSelectedMode(mode);
  };

  const handleStartJourney = () => {
    if (!selectedMode) return;

    let url = '/calm-magic-board';
    
    if (assessmentResult) {
      url += `?${generateBoardEntryParams(assessmentResult, selectedMode)}`;
    } else {
      url += `?mode=${selectedMode}`;
    }

    onClose();
    navigate(url);
  };

  const getSourceDescription = () => {
    switch (sourceContext) {
      case 'relational':
        return 'Your assessment results will be used to personalize your journey starting point.';
      case 'agentic':
        return 'The Imagineering to Engineering framework will guide your PRD generation.';
      default:
        return 'Choose your journey mode to begin exploring the Calm Magic Board.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Compass className="w-6 h-6 text-primary" />
            Enter the Calm Magic Board
          </DialogTitle>
          <DialogDescription>
            {getSourceDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-4">
            {/* Personal Mode */}
            <button
              onClick={() => handleModeSelect('personal')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedMode === 'personal'
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                  : 'border-border hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Personal</h3>
                  <p className="text-xs text-muted-foreground">Relational Design</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {JOURNEY_MODES_DESCRIPTION.personal.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {JOURNEY_MODES_DESCRIPTION.personal.focus.slice(0, 2).map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs bg-rose-100 dark:bg-rose-900/30">
                    {item}
                  </Badge>
                ))}
              </div>
            </button>

            {/* Professional Mode */}
            <button
              onClick={() => handleModeSelect('professional')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedMode === 'professional'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Professional</h3>
                  <p className="text-xs text-muted-foreground">Product Design</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {JOURNEY_MODES_DESCRIPTION.professional.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {JOURNEY_MODES_DESCRIPTION.professional.focus.slice(0, 2).map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30">
                    {item}
                  </Badge>
                ))}
              </div>
            </button>
          </div>

          {/* Selected Mode Preview */}
          {selectedMode && (
            <div className={`p-4 rounded-lg bg-gradient-to-r ${MODE_THEMES[selectedMode].bgGradient}`}>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">
                    {MODE_CONTENT[selectedMode].boardTitle}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {MODE_CONTENT[selectedMode].boardDescription}
                  </p>
                  
                  <div className="mt-3 p-2 bg-background/50 rounded border border-border/50">
                    <p className="text-xs text-muted-foreground italic">
                      "{MODE_CONTENT[selectedMode].journeyPrompt}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Context (if available) */}
          {assessmentResult && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Assessment Context Loaded</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {assessmentResult.dominantAxis.toUpperCase()} axis
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {assessmentResult.primaryGarden} garden
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {assessmentResult.connectorMagnesorType}
                </Badge>
              </div>
            </div>
          )}

          {/* What you'll experience */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-muted/20 rounded-lg">
              <Brain className="w-5 h-5 mx-auto text-primary mb-1" />
              <span className="text-xs text-muted-foreground">5 Seasons</span>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg">
              <Users className="w-5 h-5 mx-auto text-primary mb-1" />
              <span className="text-xs text-muted-foreground">64 Tiles</span>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg">
              <Sparkles className="w-5 h-5 mx-auto text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Living PRD</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleStartJourney} 
            disabled={!selectedMode}
            className={`flex-1 ${
              selectedMode === 'personal' 
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {selectedMode ? MODE_CONTENT[selectedMode].ctaText : 'Select Mode'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardEntryGate;
