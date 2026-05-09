import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getPipelineProgress,
  ONTOLOGY_PIPELINE_STAGES,
  type OntologyContent,
  type OntologyPrdLayer,
} from '@/utils/ontologyPipeline';

interface OntologyPipelinePanelProps {
  content: OntologyContent;
  className?: string;
  compact?: boolean;
}

const LAYER_TONE: Record<OntologyPrdLayer, string> = {
  POLLENS: 'bg-chart-1/10 border-chart-1/30 text-chart-1',
  NOEMS: 'bg-chart-2/10 border-chart-2/30 text-chart-2',
  POEMS: 'bg-chart-3/10 border-chart-3/30 text-chart-3',
  TOTEMS: 'bg-chart-4/10 border-chart-4/30 text-chart-4',
};

const OntologyPipelinePanel: React.FC<OntologyPipelinePanelProps> = ({
  content,
  className,
  compact = false,
}) => {
  const { results, completed, total, percent } = getPipelineProgress(content);

  return (
    <Card className={cn('border-border/60', className)}>
      <CardHeader className={cn(compact ? 'pb-2' : 'pb-3')}>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Network className="h-4 w-4 text-primary" />
            Ontology Pipeline
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {completed} / {total} stages
          </Badge>
        </div>
        <Progress value={percent} className="mt-2 h-1.5" />
      </CardHeader>
      <CardContent className={cn('space-y-2', compact && 'pt-0')}>
        <ol className="relative space-y-2">
          {results.map(({ stage, satisfied }, idx) => (
            <li key={stage.id} className="relative">
              {idx < ONTOLOGY_PIPELINE_STAGES.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-[11px] top-7 h-[calc(100%-0.25rem)] w-px',
                    satisfied ? 'bg-primary/40' : 'bg-border'
                  )}
                />
              )}
              <div
                className={cn(
                  'flex items-start gap-3 rounded-md border p-2.5 transition-colors',
                  satisfied
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border/60 bg-muted/30'
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {satisfied ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/60" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      {stage.index}.
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        satisfied ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {stage.label}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn('text-[10px]', LAYER_TONE[stage.layer])}
                    >
                      {stage.layer}
                    </Badge>
                  </div>
                  {!compact && (
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default OntologyPipelinePanel;
