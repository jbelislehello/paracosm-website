import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Eye, Unlock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { 
  FrameworkValidationInput, 
  FrameworkValidationResult,
  getFrameworkValidationAccess,
  getAccessLevelDescription
} from '@/utils/frameworkValidationAccess';

interface FrameworkAccessGateProps {
  garden: string;
  prdAccessLevel: 'hidden' | 'preview' | 'draft' | 'ready' | 'complete';
  completedSeasons: string[];
  fragmentsByLayer: Record<string, number>;
  wasForced?: boolean;
  totalTilesExplored?: number;
  children: ReactNode;
  showLockedExplanation?: boolean;
}

const LEVEL_ICONS = {
  locked: Lock,
  preview: Eye,
  partial: Unlock,
  full: CheckCircle
};

const LEVEL_COLORS = {
  locked: 'text-muted-foreground',
  preview: 'text-amber-500',
  partial: 'text-blue-500',
  full: 'text-emerald-500'
};

const LEVEL_BG_COLORS = {
  locked: 'bg-muted/50',
  preview: 'bg-amber-500/10',
  partial: 'bg-blue-500/10',
  full: 'bg-emerald-500/10'
};

export function FrameworkAccessGate({
  garden,
  prdAccessLevel,
  completedSeasons,
  fragmentsByLayer,
  wasForced = false,
  totalTilesExplored = 0,
  children,
  showLockedExplanation = true
}: FrameworkAccessGateProps) {
  // Build the input for validation
  const validationInput: FrameworkValidationInput = {
    garden,
    prdAccessLevel,
    completedSeasons: completedSeasons as any[],
    fragmentsByLayer: fragmentsByLayer as any,
    wasForced,
    totalTilesExplored
  };

  const result = getFrameworkValidationAccess(validationInput);

  // If locked, show explanation
  if (result.level === 'locked') {
    if (!showLockedExplanation) {
      return null;
    }

    return (
      <FrameworkLockedCard 
        result={result} 
        garden={garden}
        wasForced={wasForced}
      />
    );
  }

  // Otherwise, render children with optional status indicator
  return (
    <div className="space-y-4">
      <FrameworkStatusBadge result={result} />
      {children}
    </div>
  );
}

interface FrameworkLockedCardProps {
  result: FrameworkValidationResult;
  garden: string;
  wasForced: boolean;
}

function FrameworkLockedCard({ result, garden, wasForced }: FrameworkLockedCardProps) {
  const Icon = LEVEL_ICONS[result.level];

  return (
    <Card className="p-6 border-dashed border-2 border-muted-foreground/30 bg-muted/20">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-muted">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Framework Validation Locked
              <Badge variant="outline" className="text-xs">
                {result.level.toUpperCase()}
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {result.lockReason}
            </p>
          </div>

          {/* How to unlock */}
          <div className="space-y-3">
            <p className="text-sm font-medium">How to unlock:</p>
            
            <div className="space-y-2">
              {garden !== 'systems' && (
                <UnlockStep 
                  completed={false}
                  text="Switch to the Garden of Systems"
                  hint="Framework validation requires the systems-focused garden"
                />
              )}
              
              {wasForced && (
                <UnlockStep 
                  completed={false}
                  text="Generate PRD through organic journey"
                  hint="Force-generated PRDs don't support framework validation"
                  isWarning
                />
              )}
              
              {garden === 'systems' && !wasForced && (
                <>
                  <UnlockStep 
                    completed={result.progressToNextLevel >= 25}
                    text="Explore at least 4 tiles"
                    hint="Continue your journey through the topology"
                  />
                  <UnlockStep 
                    completed={result.progressToNextLevel >= 50}
                    text="Collect 2+ fragments"
                    hint="Capture insights as you explore"
                  />
                  <UnlockStep 
                    completed={result.progressToNextLevel >= 75}
                    text="Complete at least one season"
                    hint="Full validation requires seasonal completion"
                  />
                </>
              )}
            </div>

            {result.progressToNextLevel > 0 && result.progressToNextLevel < 100 && (
              <div className="pt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress to next level</span>
                  <span>{Math.round(result.progressToNextLevel)}%</span>
                </div>
                <Progress value={result.progressToNextLevel} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface UnlockStepProps {
  completed: boolean;
  text: string;
  hint: string;
  isWarning?: boolean;
}

function UnlockStep({ completed, text, hint, isWarning }: UnlockStepProps) {
  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg ${
      completed ? 'bg-emerald-500/10' : isWarning ? 'bg-amber-500/10' : 'bg-muted/50'
    }`}>
      {completed ? (
        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
      ) : isWarning ? (
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
      ) : (
        <ArrowRight className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      )}
      <div>
        <p className={`text-sm ${completed ? 'text-emerald-600' : isWarning ? 'text-amber-600' : ''}`}>
          {text}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

interface FrameworkStatusBadgeProps {
  result: FrameworkValidationResult;
}

function FrameworkStatusBadge({ result }: FrameworkStatusBadgeProps) {
  const Icon = LEVEL_ICONS[result.level];
  const colorClass = LEVEL_COLORS[result.level];
  const bgClass = LEVEL_BG_COLORS[result.level];

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${bgClass}`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className="text-sm font-medium">
          {result.level === 'full' ? 'Full Access' : 
           result.level === 'partial' ? 'Partial Access' : 
           result.level === 'preview' ? 'Preview Mode' : 'Locked'}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {result.canAccessOECD && (
          <Badge variant="outline" className="text-[10px]">OECD</Badge>
        )}
        {result.canAccessGovernanceLayers && (
          <Badge variant="outline" className="text-[10px]">Gov Layers</Badge>
        )}
        {result.canGeneratePlaybooks && (
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">
            Playbooks
          </Badge>
        )}
      </div>
    </div>
  );
}

export default FrameworkAccessGate;
