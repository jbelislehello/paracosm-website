import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Circle, AlertTriangle, Zap } from 'lucide-react';
import { COMPILATION_TARGET, COMPILATION_CHECKLIST } from '@/data/prdCompilation';
import TechStackCompiler from './TechStackCompiler';
import FoundationalPromptCompiler from './FoundationalPromptCompiler';

interface CompilationTabProps {
  projectName: string;
  stackImplications: Record<string, string>;
  promptHooks: Record<string, string>;
  completedLayers: string[];
}

export const CompilationTab: React.FC<CompilationTabProps> = ({
  projectName,
  stackImplications,
  promptHooks,
  completedLayers
}) => {
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
  const isReady = completedCount >= totalCount - 2; // Allow 2 incomplete items

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
