import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  Clock,
  Target,
  Lightbulb,
  FileText,
  MessageSquare,
  BarChart3,
  X,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Playbook, 
  PlaybookAction, 
  PLAYBOOK_TEMPLATES, 
  getPlaybooksForContext,
  getSuggestedPlaybook,
  PlaybookCategory
} from '@/types/playbook';
import { ProjectionMode, GardenType } from '@/hooks/useProjectionEngine';

interface PlaybookPanelProps {
  garden: GardenType;
  mode: ProjectionMode;
  kpiScores?: Record<string, number>;
  onClose?: () => void;
  onTileNavigate?: (tileId: number) => void;
}

const ACTION_ICONS: Record<string, React.ElementType> = {
  reflect: Lightbulb,
  document: FileText,
  decide: Target,
  communicate: MessageSquare,
  measure: BarChart3
};

const CATEGORY_COLORS: Record<PlaybookCategory, string> = {
  decision: 'hsl(var(--chart-1))',
  governance: 'hsl(var(--chart-2))',
  delivery: 'hsl(var(--chart-3))',
  change: 'hsl(var(--chart-4))',
  integration: 'hsl(var(--chart-5))'
};

export function PlaybookPanel({ 
  garden, 
  mode, 
  kpiScores,
  onClose,
  onTileNavigate 
}: PlaybookPanelProps) {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepOutputs, setStepOutputs] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  
  const contextPlaybooks = getPlaybooksForContext(garden, mode);
  const suggestedPlaybook = getSuggestedPlaybook(garden, mode, kpiScores);
  
  const startPlaybook = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setActiveStepIndex(0);
    setStepOutputs({});
    setCompletedSteps(new Set());
  };
  
  const completeStep = (actionId: string) => {
    setCompletedSteps(prev => new Set([...prev, actionId]));
    if (selectedPlaybook && activeStepIndex < selectedPlaybook.actions.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };
  
  const updateStepOutput = (actionId: string, value: string) => {
    setStepOutputs(prev => ({ ...prev, [actionId]: value }));
  };
  
  const progress = selectedPlaybook 
    ? (completedSteps.size / selectedPlaybook.actions.length) * 100 
    : 0;
    
  const isPlaybookComplete = selectedPlaybook && completedSteps.size === selectedPlaybook.actions.length;
  
  // Playbook selection view
  if (!selectedPlaybook) {
    return (
      <Card className="w-full max-w-md animate-in slide-in-from-right-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Playbooks
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Contextual action sequences for {mode} in {garden}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Suggested Playbook */}
          {suggestedPlaybook && (
            <div className="space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Suggested
              </div>
              <button
                onClick={() => startPlaybook(suggestedPlaybook)}
                className={cn(
                  "w-full p-3 rounded-lg border-2 border-primary/50 bg-primary/5",
                  "text-left transition-colors hover:bg-primary/10",
                  "ring-2 ring-primary/20"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{suggestedPlaybook.name}</span>
                      <Badge 
                        variant="outline" 
                        className="text-[9px]"
                        style={{ borderColor: CATEGORY_COLORS[suggestedPlaybook.category] }}
                      >
                        {suggestedPlaybook.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {suggestedPlaybook.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {suggestedPlaybook.estimatedMinutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {suggestedPlaybook.actions.length} steps
                      </span>
                    </div>
                  </div>
                  <Play className="w-5 h-5 text-primary shrink-0" />
                </div>
              </button>
            </div>
          )}
          
          {/* All Playbooks */}
          <div className="space-y-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              All Playbooks
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-2">
                {contextPlaybooks
                  .filter(p => p.id !== suggestedPlaybook?.id)
                  .map(playbook => (
                    <button
                      key={playbook.id}
                      onClick={() => startPlaybook(playbook)}
                      className={cn(
                        "w-full p-2.5 rounded-lg border bg-card",
                        "text-left transition-colors hover:bg-accent/50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{playbook.name}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                            <Badge 
                              variant="outline" 
                              className="text-[9px] h-4"
                              style={{ borderColor: CATEGORY_COLORS[playbook.category] }}
                            >
                              {playbook.category}
                            </Badge>
                            <span>{playbook.estimatedMinutes}m</span>
                            <span>{playbook.actions.length} steps</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </button>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Active playbook view
  const activeAction = selectedPlaybook.actions[activeStepIndex];
  const ActionIcon = ACTION_ICONS[activeAction.actionType] || Circle;
  
  return (
    <Card className="w-full max-w-md animate-in slide-in-from-right-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setSelectedPlaybook(null)}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Button>
            <CardTitle className="text-sm">{selectedPlaybook.name}</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-1.5" />
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{completedSteps.size} of {selectedPlaybook.actions.length} steps</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Step Navigator */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {selectedPlaybook.actions.map((action, index) => {
            const isCompleted = completedSteps.has(action.id);
            const isActive = index === activeStepIndex;
            const StepIcon = ACTION_ICONS[action.actionType] || Circle;
            
            return (
              <React.Fragment key={action.id}>
                <button
                  onClick={() => setActiveStepIndex(index)}
                  className={cn(
                    "shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all",
                    isCompleted && "bg-primary text-primary-foreground",
                    isActive && !isCompleted && "bg-primary/20 ring-2 ring-primary",
                    !isActive && !isCompleted && "bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" />
                  )}
                </button>
                {index < selectedPlaybook.actions.length - 1 && (
                  <div className={cn(
                    "shrink-0 w-4 h-0.5 rounded-full",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Active Step */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              "bg-primary/10"
            )}>
              <ActionIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{activeAction.label}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeAction.description}
              </p>
              {onTileNavigate && (
                <button 
                  onClick={() => onTileNavigate(activeAction.tileId)}
                  className="text-[10px] text-primary hover:underline mt-1 flex items-center gap-1"
                >
                  Go to Tile #{activeAction.tileId}
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          
          {/* Prompts */}
          <div className="space-y-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Reflection Prompts
            </div>
            <ul className="space-y-1.5">
              {activeAction.prompts.map((prompt, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Output */}
          <div className="space-y-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Your Notes
            </div>
            <Textarea
              placeholder="Document your thoughts..."
              value={stepOutputs[activeAction.id] || ''}
              onChange={(e) => updateStepOutput(activeAction.id, e.target.value)}
              className="min-h-[80px] text-sm resize-none"
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              className="flex-1 gap-1.5"
              onClick={() => completeStep(activeAction.id)}
              disabled={completedSteps.has(activeAction.id)}
            >
              {completedSteps.has(activeAction.id) ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Step
                </>
              )}
            </Button>
            {activeStepIndex < selectedPlaybook.actions.length - 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setActiveStepIndex(activeStepIndex + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Completion */}
        {isPlaybookComplete && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Playbook Complete!</p>
            <p className="text-xs text-muted-foreground mt-1">
              All {selectedPlaybook.actions.length} steps completed
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
