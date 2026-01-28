
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Users, 
  ChevronRight,
  Search,
  Waves,
  Sparkles,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SESSION_PHASES,
  TOTAL_SESSION_DURATION,
  PROMPT_ROTATION_INTERVAL,
  GROUP_SIZE_RANGES,
  type SessionStatus,
  type GroupSize,
  type SessionPhase
} from '@/data/glitchSessionConfig';

const PhaseIcon: React.FC<{ icon: SessionPhase['icon']; className?: string }> = ({ icon, className }) => {
  switch (icon) {
    case 'Search':
      return <Search className={className} />;
    case 'Waves':
      return <Waves className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const GlitchSessionTimer: React.FC = () => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(SESSION_PHASES[0].duration);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(TOTAL_SESSION_DURATION);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [groupSize, setGroupSize] = useState<GroupSize>('medium');
  const [sessionNotes, setSessionNotes] = useState('');
  const [promptTimer, setPromptTimer] = useState(0);

  const currentPhase = SESSION_PHASES[currentPhaseIndex];
  const phaseProgress = ((currentPhase.duration - phaseTimeRemaining) / currentPhase.duration) * 100;
  const totalProgress = ((TOTAL_SESSION_DURATION - totalTimeRemaining) / TOTAL_SESSION_DURATION) * 100;

  // Timer logic
  useEffect(() => {
    if (sessionStatus !== 'running') return;

    const interval = setInterval(() => {
      setPhaseTimeRemaining(prev => {
        if (prev <= 1) {
          // Phase complete - move to next
          if (currentPhaseIndex < SESSION_PHASES.length - 1) {
            setCurrentPhaseIndex(i => i + 1);
            setCurrentPromptIndex(0);
            setPromptTimer(0);
            return SESSION_PHASES[currentPhaseIndex + 1].duration;
          } else {
            // Session complete
            setSessionStatus('complete');
            return 0;
          }
        }
        return prev - 1;
      });

      setTotalTimeRemaining(prev => Math.max(0, prev - 1));

      // Rotate prompts
      setPromptTimer(prev => {
        if (prev >= PROMPT_ROTATION_INTERVAL) {
          setCurrentPromptIndex(i => (i + 1) % currentPhase.facilitatorPrompts.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStatus, currentPhaseIndex, currentPhase.facilitatorPrompts.length]);

  const handleStart = useCallback(() => {
    setSessionStatus('running');
  }, []);

  const handlePause = useCallback(() => {
    setSessionStatus('paused');
  }, []);

  const handleResume = useCallback(() => {
    setSessionStatus('running');
  }, []);

  const handleReset = useCallback(() => {
    setSessionStatus('idle');
    setCurrentPhaseIndex(0);
    setPhaseTimeRemaining(SESSION_PHASES[0].duration);
    setTotalTimeRemaining(TOTAL_SESSION_DURATION);
    setCurrentPromptIndex(0);
    setPromptTimer(0);
  }, []);

  const handleSkipPhase = useCallback(() => {
    if (currentPhaseIndex < SESSION_PHASES.length - 1) {
      const nextIndex = currentPhaseIndex + 1;
      const skippedTime = phaseTimeRemaining;
      setCurrentPhaseIndex(nextIndex);
      setPhaseTimeRemaining(SESSION_PHASES[nextIndex].duration);
      setTotalTimeRemaining(prev => prev - skippedTime);
      setCurrentPromptIndex(0);
      setPromptTimer(0);
    } else {
      setSessionStatus('complete');
    }
  }, [currentPhaseIndex, phaseTimeRemaining]);

  const handleNextPrompt = useCallback(() => {
    setCurrentPromptIndex(i => (i + 1) % currentPhase.facilitatorPrompts.length);
    setPromptTimer(0);
  }, [currentPhase.facilitatorPrompts.length]);

  const cycleGroupSize = useCallback(() => {
    const sizes: GroupSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(groupSize);
    setGroupSize(sizes[(currentIndex + 1) % sizes.length]);
  }, [groupSize]);

  const filteredAmplificationTechniques = currentPhase.amplificationTechniques.filter(
    tech => tech.minGroupSize <= GROUP_SIZE_RANGES[groupSize].max
  );

  return (
    <div className="space-y-6">
      {/* Header with total progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Glitch Session Timer</h2>
          <p className="text-muted-foreground">25-minute facilitated breath cycle</p>
        </div>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-accent"
          onClick={cycleGroupSize}
        >
          <Users className="w-3 h-3 mr-1" />
          {GROUP_SIZE_RANGES[groupSize].label}
        </Badge>
      </div>

      {/* Phase Navigation Bar */}
      <div className="flex gap-2">
        {SESSION_PHASES.map((phase, index) => (
          <div
            key={phase.id}
            className={cn(
              "flex-1 p-3 rounded-lg border-2 transition-all duration-300",
              index === currentPhaseIndex && sessionStatus !== 'idle'
                ? "border-primary shadow-lg scale-[1.02]"
                : index < currentPhaseIndex
                  ? "border-muted-foreground/30 opacity-60"
                  : "border-border opacity-50"
            )}
            style={{
              background: index === currentPhaseIndex && sessionStatus !== 'idle'
                ? `linear-gradient(135deg, ${phase.colorFrom}20, ${phase.colorTo}20)`
                : undefined
            }}
          >
            <div className="flex items-center gap-2">
              <PhaseIcon 
                icon={phase.icon} 
                className={cn(
                  "w-4 h-4",
                  index === currentPhaseIndex && sessionStatus !== 'idle'
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span className={cn(
                "font-semibold text-sm",
                index === currentPhaseIndex && sessionStatus !== 'idle'
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}>
                {phase.name}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {Math.floor(phase.duration / 60)}m
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Timer Display */}
      <Card className="overflow-hidden">
        <div 
          className="h-2 transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, ${currentPhase.colorFrom}, ${currentPhase.colorTo})`
          }}
        />
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Circular Progress with Pulse */}
            <div className="relative">
              <div 
                className={cn(
                  "w-48 h-48 rounded-full flex items-center justify-center relative",
                  sessionStatus === 'running' && "animate-pulse"
                )}
                style={{
                  background: `conic-gradient(${currentPhase.colorFrom} ${phaseProgress}%, transparent ${phaseProgress}%)`,
                  animation: sessionStatus === 'running' ? 'pulse 4s ease-in-out infinite' : undefined
                }}
              >
                <div className="w-40 h-40 rounded-full bg-background flex flex-col items-center justify-center">
                  <PhaseIcon icon={currentPhase.icon} className="w-8 h-8 text-primary mb-2" />
                  <span className="text-4xl font-mono font-bold text-foreground">
                    {formatTime(phaseTimeRemaining)}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {currentPhase.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Time Remaining */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total remaining</p>
              <p className="text-lg font-mono text-foreground">{formatTime(totalTimeRemaining)}</p>
              <Progress value={totalProgress} className="w-64 mt-2 h-1" />
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              {sessionStatus === 'idle' && (
                <Button onClick={handleStart} size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Start Session
                </Button>
              )}
              
              {sessionStatus === 'running' && (
                <Button onClick={handlePause} variant="outline" size="lg" className="gap-2">
                  <Pause className="w-5 h-5" />
                  Pause
                </Button>
              )}
              
              {sessionStatus === 'paused' && (
                <Button onClick={handleResume} size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Resume
                </Button>
              )}

              {sessionStatus !== 'idle' && sessionStatus !== 'complete' && (
                <>
                  <Button onClick={handleSkipPhase} variant="outline" size="lg" className="gap-2">
                    <SkipForward className="w-5 h-5" />
                    Skip Phase
                  </Button>
                  <Button onClick={handleReset} variant="ghost" size="lg" className="gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </Button>
                </>
              )}

              {sessionStatus === 'complete' && (
                <Button onClick={handleReset} size="lg" className="gap-2">
                  <RotateCcw className="w-5 h-5" />
                  New Session
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facilitator Panel */}
      {sessionStatus !== 'idle' && sessionStatus !== 'complete' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Prompt */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Facilitator Prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-foreground leading-relaxed">
                "{currentPhase.facilitatorPrompts[currentPromptIndex]}"
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted-foreground">
                  Prompt {currentPromptIndex + 1} of {currentPhase.facilitatorPrompts.length}
                </span>
                <Button variant="ghost" size="sm" onClick={handleNextPrompt} className="gap-1">
                  Next <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Amplification Techniques */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Amplification Techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAmplificationTechniques.map((tech, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-3">
                    <p className="font-medium text-sm text-foreground">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session Complete */}
      {sessionStatus === 'complete' && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Session Complete!</h3>
            <p className="text-muted-foreground">
              You've completed the full GL!TCH → DRIFT → TUNE cycle.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notes Area */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Session Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Capture key insights, commitments, or follow-ups from this session..."
            className="w-full h-24 p-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GlitchSessionTimer;
