import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Zap, Waves, Music, ChevronRight, Check, Sparkles } from 'lucide-react';
import { TileContent, getPhaseColor, COLUMN_LABELS, ROW_LABELS } from '@/data/tileContents';
import { CompassType, JourneyMode } from '@/types/journal-expansion';
import { useCompassPrompt } from '@/hooks/useCompassPrompt';
import { AICompassPrompt } from './AICompassPrompt';
import { COMPASS_CONTENT } from '@/data/compassContent';

interface TileWorkflowProps {
  tile: TileContent;
  compass?: CompassType;
  journeyMode?: JourneyMode;
  cycleId?: string;
  onComplete?: (data: TileWorkflowData) => void;
}

export interface TileWorkflowData {
  tileId: number;
  glitchResponse: string;
  driftOptions: string[];
  selectedDrift: number;
  tuneDeliverable: string;
}

type WorkflowStep = 'glitch' | 'drift' | 'tune' | 'complete';

export const TileWorkflow: React.FC<TileWorkflowProps> = ({ 
  tile, 
  compass = 'narrative',
  journeyMode = 'relational',
  cycleId,
  onComplete 
}) => {
  const [step, setStep] = useState<WorkflowStep>('glitch');
  const [glitchResponse, setGlitchResponse] = useState('');
  const [driftOptions, setDriftOptions] = useState(['', '', '']);
  const [selectedDrift, setSelectedDrift] = useState<number | null>(null);
  const [tuneDeliverable, setTuneDeliverable] = useState('');

  const { prompt, isLoading, isSaving, isSaved, generatePrompt, savePromptAsPolen } = useCompassPrompt({
    compass,
    journeyMode,
    tile,
    cycleId,
  });

  const compassName = COMPASS_CONTENT[compass]?.name || 'Compass';

  // Auto-generate prompt when step changes
  useEffect(() => {
    if (step !== 'complete') {
      generatePrompt(step, step === 'drift' || step === 'tune' ? glitchResponse : undefined);
    }
  }, [step, tile.id]);

  const handleDriftOptionChange = (index: number, value: string) => {
    const newOptions = [...driftOptions];
    newOptions[index] = value;
    setDriftOptions(newOptions);
  };

  const canProceedFromGlitch = glitchResponse.trim().length > 0;
  const canProceedFromDrift = driftOptions.filter(o => o.trim()).length >= 1 && selectedDrift !== null;
  const canComplete = tuneDeliverable.trim().length > 0;

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        tileId: tile.id,
        glitchResponse,
        driftOptions: driftOptions.filter(o => o.trim()),
        selectedDrift: selectedDrift || 0,
        tuneDeliverable
      });
    }
    setStep('complete');
  };

  const handleStepChange = (newStep: WorkflowStep) => {
    setStep(newStep);
    if (newStep !== 'complete') {
      generatePrompt(newStep, newStep === 'drift' || newStep === 'tune' ? glitchResponse : undefined);
    }
  };

  const phaseGradient = getPhaseColor(tile.phase);

  return (
    <div className="space-y-4">
      {/* Tile Header */}
      <Card className={`bg-gradient-to-r ${phaseGradient} text-white`}>
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center text-2xl font-bold">
              {tile.id}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {COLUMN_LABELS[tile.colKey].full}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {ROW_LABELS[tile.rowKey].full}
                </Badge>
              </div>
              <h3 className="text-xl font-bold">{tile.name}</h3>
              <p className="text-sm text-white/80">{tile.phase} Phase</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        {(['glitch', 'drift', 'tune'] as const).map((s, i) => (
          <React.Fragment key={s}>
            <button
              onClick={() => {
                if (s === 'glitch') handleStepChange(s);
                if (s === 'drift' && canProceedFromGlitch) handleStepChange(s);
                if (s === 'tune' && canProceedFromDrift) handleStepChange(s);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                step === s 
                  ? 'bg-primary text-primary-foreground' 
                  : step === 'complete' || (s === 'glitch' && canProceedFromGlitch) || (s === 'drift' && canProceedFromDrift)
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s === 'glitch' && <Zap className="h-4 w-4" />}
              {s === 'drift' && <Waves className="h-4 w-4" />}
              {s === 'tune' && <Music className="h-4 w-4" />}
              <span className="text-sm font-medium capitalize">{s}</span>
            </button>
            {i < 2 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </React.Fragment>
        ))}
        {step === 'complete' && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Done</span>
            </div>
          </>
        )}
      </div>

      {/* GLITCH Step */}
      {step === 'glitch' && (
        <Card className="bg-gradient-to-br from-yellow-950/30 to-orange-950/30 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-yellow-300">
              <Zap className="h-5 w-5" />
              GL!TCH – What feels off / alive / weird?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-200 font-medium italic">
                "{tile.glitchQuestion}"
              </p>
            </div>
            
            {/* AI Compass Prompt */}
            <AICompassPrompt
              prompt={prompt}
              isLoading={isLoading}
              isSaving={isSaving}
              isSaved={isSaved}
              onGenerate={() => generatePrompt('glitch')}
              onSave={savePromptAsPolen}
              compassName={compassName}
            />

            <Textarea
              placeholder="Capture the glitch in one sentence..."
              value={glitchResponse}
              onChange={(e) => setGlitchResponse(e.target.value)}
              className="min-h-[80px] bg-background/50 border-yellow-500/30 focus:border-yellow-400"
            />
            <Button 
              onClick={() => handleStepChange('drift')}
              disabled={!canProceedFromGlitch}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              Continue to Drift
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* DRIFT Step */}
      {step === 'drift' && (
        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-300">
              <Waves className="h-5 w-5" />
              DRIFT – Brainstorm 3 ways to move
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-blue-200/70">
              Given your glitch: <span className="italic">"{glitchResponse}"</span>
            </p>
            
            {/* AI Compass Prompt */}
            <AICompassPrompt
              prompt={prompt}
              isLoading={isLoading}
              isSaving={isSaving}
              isSaved={isSaved}
              onGenerate={() => generatePrompt('drift', glitchResponse)}
              onSave={savePromptAsPolen}
              compassName={compassName}
            />

            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex gap-2">
                  <button
                    onClick={() => setSelectedDrift(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                      selectedDrift === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-blue-500/20'
                    }`}
                  >
                    {index + 1}
                  </button>
                  <Textarea
                    placeholder={`Option ${index + 1}: How could you move?`}
                    value={driftOptions[index]}
                    onChange={(e) => handleDriftOptionChange(index, e.target.value)}
                    className="flex-1 min-h-[60px] bg-background/50 border-blue-500/30"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-300/60">
              Select the option you want to pursue by clicking its number
            </p>
            <Button 
              onClick={() => handleStepChange('tune')}
              disabled={!canProceedFromDrift}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue to Tune
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* TUNE Step */}
      {step === 'tune' && (
        <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-purple-300">
              <Music className="h-5 w-5" />
              TUNE – Create the deliverable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-purple-200/70 mb-2">Focus question:</p>
              <p className="text-purple-200 font-medium italic">
                "{tile.tuneQuestion}"
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-purple-200/70 mb-2">Required deliverable:</p>
              <p className="text-purple-200 font-medium">
                {tile.deliverable}
              </p>
            </div>
            
            {/* AI Compass Prompt */}
            <AICompassPrompt
              prompt={prompt}
              isLoading={isLoading}
              isSaving={isSaving}
              isSaved={isSaved}
              onGenerate={() => generatePrompt('tune', glitchResponse)}
              onSave={savePromptAsPolen}
              compassName={compassName}
            />

            <Textarea
              placeholder="Create your deliverable here..."
              value={tuneDeliverable}
              onChange={(e) => setTuneDeliverable(e.target.value)}
              className="min-h-[120px] bg-background/50 border-purple-500/30 focus:border-purple-400"
            />
            <Button 
              onClick={handleComplete}
              disabled={!canComplete}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Complete Tile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-300">
              <Check className="h-5 w-5" />
              Tile Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-300/70 mb-1">GL!TCH</p>
                <p className="text-sm text-foreground">{glitchResponse}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-300/70 mb-1">DRIFT (selected)</p>
                <p className="text-sm text-foreground">{driftOptions[selectedDrift || 0]}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-300/70 mb-1">TUNE</p>
                <p className="text-sm text-foreground">{tuneDeliverable}</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                setStep('glitch');
                setGlitchResponse('');
                setDriftOptions(['', '', '']);
                setSelectedDrift(null);
                setTuneDeliverable('');
              }}
              className="w-full"
            >
              Work on this tile again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TileWorkflow;
