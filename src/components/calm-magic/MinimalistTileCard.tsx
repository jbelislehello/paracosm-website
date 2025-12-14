import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Send, Sparkles, ArrowRight, Loader2, Check, ArrowLeft } from 'lucide-react';
import { TILE_CONTENTS } from '@/data/tileContents';
import { useAgentTileConversation } from '@/hooks/useAgentTileConversation';
import { cn } from '@/lib/utils';

interface MinimalistTileCardProps {
  selectedTile: { row: number; col: number };
  board: string;
  currentSeason?: string;
  onClose: () => void;
  onSavePolen: (content: string, tileId: number) => Promise<void>;
  onExpandToFull?: () => void;
}

const POSTURES = [
  { id: 'receptive', label: 'Receptive', desc: 'Listen before acting' },
  { id: 'curious', label: 'Curious', desc: 'Wonder without judgment' },
  { id: 'experimental', label: 'Experimental', desc: 'Try small, learn fast' },
  { id: 'patient', label: 'Patient', desc: 'Let emergence unfold' },
];

const ATTITUDES = [
  { id: 'beginner', label: "Beginner's Mind", icon: '🌱' },
  { id: 'play', label: 'Playful Inquiry', icon: '✨' },
  { id: 'care', label: 'Careful Attention', icon: '💫' },
  { id: 'trust', label: 'Trust the Process', icon: '🌀' },
];

const STEPS = [
  { id: 1, name: 'Ground', instruction: 'How will you approach this?' },
  { id: 2, name: 'Orient', instruction: 'What perspective will you hold?' },
  { id: 3, name: 'Explore', instruction: 'What might help you here?' },
  { id: 4, name: 'Respond', instruction: 'What emerges for you?' },
];

export const MinimalistTileCard: React.FC<MinimalistTileCardProps> = ({
  selectedTile,
  board,
  currentSeason,
  onClose,
  onSavePolen,
  onExpandToFull,
}) => {
  const tileId = selectedTile.row * 8 + selectedTile.col + 1;
  const tileContent = TILE_CONTENTS.find(t => t.id === tileId);
  
  const [response, setResponse] = useState('');
  const [selectedPosture, setSelectedPosture] = useState<string | null>(null);
  const [selectedAttitude, setSelectedAttitude] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [quickMode, setQuickMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { messages, isLoading, sendResponse } = useAgentTileConversation(
    selectedTile,
    currentSeason || 'POLLENS',
    true
  );

  const latestQuestion = messages.filter(m => m.role === 'assistant').pop()?.content || 
    tileContent?.glitchQuestion || 
    "What's alive for you here?";

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setIsSaving(true);
    
    const context = [
      response,
      selectedPosture && `\n[Posture: ${POSTURES.find(p => p.id === selectedPosture)?.label}]`,
      selectedAttitude && `\n[Attitude: ${ATTITUDES.find(a => a.id === selectedAttitude)?.label}]`,
    ].filter(Boolean).join('');
    
    await sendResponse(response);
    await onSavePolen(context, tileId);
    
    setResponse('');
    setIsSaving(false);
  };

  const suggestedActivities = [
    'Pause and notice what arises',
    'Sketch a rough diagram',
    'Speak your thoughts aloud',
    'Write 3 wild possibilities',
    'Ask "what if the opposite?"',
  ];

  const canProceed = (step: number) => {
    if (step === 1) return !!selectedPosture;
    if (step === 2) return !!selectedAttitude;
    if (step === 3) return true; // Activities are optional
    return false;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-3 border-b border-border/50 bg-muted/20">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step.id}>
          <button
            onClick={() => {
              // Allow clicking back to previous steps
              if (step.id < currentStep) setCurrentStep(step.id);
            }}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full transition-all",
              currentStep > step.id && "cursor-pointer hover:bg-primary/10",
              currentStep < step.id && "opacity-50 cursor-not-allowed"
            )}
            disabled={currentStep < step.id}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              currentStep > step.id 
                ? "bg-primary text-primary-foreground" 
                : currentStep === step.id 
                  ? "bg-primary/20 text-primary ring-2 ring-primary" 
                  : "bg-muted text-muted-foreground"
            )}>
              {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
            </div>
            <span className={cn(
              "text-xs hidden sm:block",
              currentStep === step.id ? "font-medium text-foreground" : "text-muted-foreground"
            )}>
              {step.name}
            </span>
          </button>
          {idx < STEPS.length - 1 && (
            <ArrowRight className={cn(
              "w-3 h-3 flex-shrink-0",
              currentStep > step.id ? "text-primary" : "text-muted-foreground/50"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStepContent = () => {
    const currentStepData = STEPS.find(s => s.id === currentStep);
    
    return (
      <div className="space-y-4">
        {/* Step instruction */}
        <div className="text-center">
          <p className="text-sm font-medium text-primary">{currentStepData?.instruction}</p>
        </div>

        {/* Step 1: Ground (Posture) */}
        {currentStep === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {POSTURES.map((posture) => (
              <button
                key={posture.id}
                onClick={() => setSelectedPosture(selectedPosture === posture.id ? null : posture.id)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  selectedPosture === posture.id
                    ? "bg-primary/10 border-primary ring-1 ring-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <p className="font-medium text-sm">{posture.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{posture.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Orient (Attitude) */}
        {currentStep === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {ATTITUDES.map((attitude) => (
              <button
                key={attitude.id}
                onClick={() => setSelectedAttitude(selectedAttitude === attitude.id ? null : attitude.id)}
                className={cn(
                  "p-4 rounded-xl border text-center transition-all",
                  selectedAttitude === attitude.id
                    ? "bg-primary/10 border-primary ring-1 ring-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <span className="text-3xl block mb-2">{attitude.icon}</span>
                <p className="text-sm font-medium">{attitude.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Explore (Activities) */}
        {currentStep === 3 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center italic">(Optional — choose any that resonate)</p>
            <div className="grid gap-2">
              {suggestedActivities.map((activity, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-primary/60 flex-shrink-0" />
                  <span className="text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Respond */}
        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Recap question */}
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <Sparkles className="w-5 h-5 mx-auto text-primary/60 mb-2" />
              <p className="text-base font-medium">{latestQuestion}</p>
            </div>
            
            {/* Selected context badges */}
            <div className="flex justify-center gap-2 flex-wrap">
              {selectedPosture && (
                <Badge variant="secondary" className="text-xs">
                  {POSTURES.find(p => p.id === selectedPosture)?.label}
                </Badge>
              )}
              {selectedAttitude && (
                <Badge variant="secondary" className="text-xs">
                  {ATTITUDES.find(a => a.id === selectedAttitude)?.icon} {ATTITUDES.find(a => a.id === selectedAttitude)?.label}
                </Badge>
              )}
            </div>
            
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="What emerges for you?"
              className="min-h-[120px] resize-none border-border/50 focus:border-primary/50"
              autoFocus
            />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < 4 ? (
            <div className="flex gap-2">
              {currentStep === 3 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentStep(4)}
                >
                  Skip
                </Button>
              )}
              <Button 
                size="sm"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed(currentStep) && currentStep !== 3}
                className="gap-1"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!response.trim() || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Capture
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderQuickMode = () => (
    <div className="space-y-6">
      {/* Core Question */}
      <div className="text-center space-y-2">
        <Sparkles className="w-5 h-5 mx-auto text-primary/60" />
        <p className="text-lg font-medium leading-relaxed">{latestQuestion}</p>
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      {/* Posture Selection */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Choose your posture</p>
        <div className="flex flex-wrap justify-center gap-2">
          {POSTURES.map((posture) => (
            <button
              key={posture.id}
              onClick={() => setSelectedPosture(selectedPosture === posture.id ? null : posture.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs transition-all",
                selectedPosture === posture.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {posture.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attitude Selection */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Adopt an attitude</p>
        <div className="flex justify-center gap-3">
          {ATTITUDES.map((attitude) => (
            <button
              key={attitude.id}
              onClick={() => setSelectedAttitude(selectedAttitude === attitude.id ? null : attitude.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                selectedAttitude === attitude.id
                  ? "bg-primary/10 ring-1 ring-primary"
                  : "hover:bg-muted"
              )}
            >
              <span className="text-xl">{attitude.icon}</span>
              <span className="text-[10px] text-muted-foreground">{attitude.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response Input */}
      <div className="space-y-3">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="What emerges for you?"
          className="min-h-[100px] resize-none border-border/50 focus:border-primary/50"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {selectedPosture && (
              <Badge variant="secondary" className="text-xs">
                {POSTURES.find(p => p.id === selectedPosture)?.label}
              </Badge>
            )}
            {selectedAttitude && (
              <Badge variant="secondary" className="text-xs">
                {ATTITUDES.find(a => a.id === selectedAttitude)?.icon}
              </Badge>
            )}
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={!response.trim() || isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Capture
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold",
              "bg-gradient-to-br from-primary/20 to-primary/5 text-primary"
            )}>
              {tileId}
            </div>
            <div>
              <h2 className="font-semibold text-sm">{tileContent?.name || 'Dialogical Cue'}</h2>
              <p className="text-xs text-muted-foreground">{currentSeason} · Focus Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Quick</span>
              <Switch 
                checked={quickMode} 
                onCheckedChange={setQuickMode}
                className="scale-75"
              />
            </div>
            {onExpandToFull && (
              <Button variant="ghost" size="sm" onClick={onExpandToFull} className="text-xs">
                Full View
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Step Indicator (only in guided mode) */}
        {!quickMode && renderStepIndicator()}

        {/* Content */}
        <div className="p-6">
          {quickMode ? renderQuickMode() : renderStepContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-muted/30 border-t border-border/50">
          <p className="text-[10px] text-center text-muted-foreground italic">
            Transform wild guesses into statistical success through deliberate dialogue
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinimalistTileCard;
