import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, Circle, AlertTriangle, Zap, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { COMPILATION_TARGET, COMPILATION_CHECKLIST, validateCompilation, ValidationResult, ValidationIssue, Season } from '@/data/prdCompilation';
import TechStackCompiler from './TechStackCompiler';
import FoundationalPromptCompiler from './FoundationalPromptCompiler';

interface CompilationTabProps {
  projectName: string;
  stackImplications: Record<string, string>;
  promptHooks: Record<string, string>;
  completedLayers: string[];
  onNavigateToLayer?: (season: Season) => void;
}

// Validation Panel Component
const ValidationPanel: React.FC<{ 
  validation: ValidationResult;
  onNavigateToLayer?: (season: Season) => void;
}> = ({ validation, onNavigateToLayer }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Ready to Export';
    if (score >= 50) return 'Needs Attention';
    return 'Incomplete';
  };

  const handleIssueClick = (issue: ValidationIssue) => {
    if (onNavigateToLayer && issue.targetSeason) {
      onNavigateToLayer(issue.targetSeason);
    }
  };

  return (
    <Card className="border-muted">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {validation.isValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            Validation Score
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${getScoreColor(validation.score)}`}>
              {validation.score}%
            </span>
            <Badge 
              variant="outline" 
              className={`text-[10px] ${
                validation.score >= 80 
                  ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                  : validation.score >= 50 
                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                    : 'bg-red-500/10 text-red-500 border-red-500/30'
              }`}
            >
              {getScoreLabel(validation.score)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={validation.score} className="h-2" />
        
        {/* Errors */}
        {validation.errors.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-red-500 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {validation.errors.length} Critical Issue{validation.errors.length > 1 ? 's' : ''}
            </p>
            <div className="space-y-1.5 pl-4">
              {validation.errors.slice(0, 5).map((error, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`flex items-center justify-between text-[10px] text-red-400 ${
                          onNavigateToLayer ? 'hover:bg-red-500/10 rounded px-1 py-0.5 -ml-1 cursor-pointer transition-colors' : ''
                        }`}
                        onClick={() => handleIssueClick(error)}
                      >
                        <span>• {error.message}</span>
                        {onNavigateToLayer && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1.5 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIssueClick(error);
                            }}
                          >
                            Fix <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
                          </Button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs font-medium">Hint: {error.fixHint}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {validation.errors.length > 5 && (
                <p className="text-[10px] text-muted-foreground">
                  +{validation.errors.length - 5} more...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-yellow-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {validation.warnings.length} Suggestion{validation.warnings.length > 1 ? 's' : ''}
            </p>
            <div className="space-y-1.5 pl-4">
              {validation.warnings.slice(0, 3).map((warning, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`flex items-center justify-between text-[10px] text-yellow-400 ${
                          onNavigateToLayer ? 'hover:bg-yellow-500/10 rounded px-1 py-0.5 -ml-1 cursor-pointer transition-colors' : ''
                        }`}
                        onClick={() => handleIssueClick(warning)}
                      >
                        <span>• {warning.message}</span>
                        {onNavigateToLayer && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1.5 text-[10px] text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIssueClick(warning);
                            }}
                          >
                            Fix <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
                          </Button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs font-medium">Hint: {warning.fixHint}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {validation.warnings.length > 3 && (
                <p className="text-[10px] text-muted-foreground">
                  +{validation.warnings.length - 3} more...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Success State */}
        {validation.errors.length === 0 && validation.warnings.length === 0 && (
          <p className="text-xs text-green-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            All validation checks passed
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const CompilationTab: React.FC<CompilationTabProps> = ({
  projectName,
  stackImplications,
  promptHooks,
  completedLayers,
  onNavigateToLayer
}) => {
  // Run validation
  const validation = useMemo(() => {
    return validateCompilation(stackImplications, promptHooks);
  }, [stackImplications, promptHooks]);

  // Calculate checklist status
  const checklistStatus = COMPILATION_CHECKLIST.map(item => {
    if (item.id.startsWith('stack_')) {
      const layer = item.layer;
      const key = `stack_implications_${layer?.toLowerCase()}`;
      return {
        ...item,
        checked: !!(stackImplications[key] && stackImplications[key].length > 20)
      };
    }
    if (item.id.startsWith('prompt_')) {
      const layer = item.layer;
      const key = `prompt_hooks_${layer?.toLowerCase()}`;
      return {
        ...item,
        checked: !!(promptHooks[key] && promptHooks[key].length > 20)
      };
    }
    if (item.id === 'tech_stack') {
      return { ...item, checked: Object.keys(stackImplications).length >= 3 };
    }
    if (item.id === 'prompt') {
      return { ...item, checked: Object.keys(promptHooks).length >= 3 };
    }
    return { ...item, checked: false };
  });

  const completedCount = checklistStatus.filter(item => item.checked).length;
  const totalCount = checklistStatus.length;
  const isReady = validation.score >= 50;

  return (
    <div className="space-y-4">
      {/* Meta-Requirement Alert */}
      <Alert className="border-primary/30 bg-primary/5">
        <Zap className="h-4 w-4 text-primary" />
        <AlertTitle className="text-sm font-semibold">{COMPILATION_TARGET.title}</AlertTitle>
        <AlertDescription className="text-xs mt-2 whitespace-pre-line">
          {COMPILATION_TARGET.requirement}
        </AlertDescription>
      </Alert>

      {/* Validation Panel */}
      <ValidationPanel validation={validation} onNavigateToLayer={onNavigateToLayer} />

      {/* Compilation Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Compilation Progress</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{completedCount}/{totalCount}</span>
          {isReady ? (
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
              Ready to Compile
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              In Progress
            </Badge>
          )}
        </div>
      </div>

      {/* Compiled Outputs */}
      <div className="grid gap-4">
        <TechStackCompiler
          projectName={projectName}
          stackImplications={stackImplications}
          isComplete={completedLayers.length >= 5}
        />

        <FoundationalPromptCompiler
          projectName={projectName}
          promptHooks={promptHooks}
          isComplete={completedLayers.length >= 5}
        />
      </div>

      {/* Compilation Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Compilation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Stack Implications Section */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Stack Implications
              </p>
              {checklistStatus.filter(i => i.id.startsWith('stack_')).map(item => (
                <div key={item.id} className="flex items-center gap-2 text-xs">
                  {item.checked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={item.checked ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Prompt Hooks Section */}
            <div className="space-y-1 pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Prompt Hooks
              </p>
              {checklistStatus.filter(i => i.id.startsWith('prompt_')).map(item => (
                <div key={item.id} className="flex items-center gap-2 text-xs">
                  {item.checked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={item.checked ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Final Checks Section */}
            <div className="space-y-1 pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-2">
                Final Verification
              </p>
              {checklistStatus.filter(i => !i.id.startsWith('stack_') && !i.id.startsWith('prompt_')).map(item => (
                <div key={item.id} className="flex items-center gap-2 text-xs">
                  {item.checked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={item.checked ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompilationTab;
