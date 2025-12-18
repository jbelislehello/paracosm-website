import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

const SEASON_FIELDS: Record<Season, string[]> = {
  POLLENS: ['pollens_aspirations', 'pollens_team_dynamics', 'pollens_cultural_elements', 'pollens_relational_patterns', 'pollens_constraints', 'pollens_stakes'],
  NOEMS: ['noems_concepts', 'noems_shared_ideas', 'noems_intuitions', 'noems_mental_models'],
  POEMS: ['poems_people', 'poems_objects', 'poems_environments', 'poems_messages', 'poems_systems', 'poems_prototypes'],
  TOTEMS: ['totems_data_architecture', 'totems_security_policies', 'totems_access_controls', 'totems_system_requirements', 'totems_integration_points', 'totems_technical_debt'],
  ANTHEMS: ['anthems_market_positioning', 'anthems_brand_narrative', 'anthems_go_to_market', 'anthems_audience_segments', 'anthems_success_signals', 'anthems_storytelling_assets'],
};

const SEASON_CONFIG: Record<Season, { icon: string; color: string; bgColor: string }> = {
  POLLENS: { icon: '🌸', color: 'bg-rose-500', bgColor: 'bg-rose-500/20' },
  NOEMS: { icon: '💡', color: 'bg-purple-500', bgColor: 'bg-purple-500/20' },
  POEMS: { icon: '📖', color: 'bg-blue-500', bgColor: 'bg-blue-500/20' },
  TOTEMS: { icon: '💎', color: 'bg-emerald-500', bgColor: 'bg-emerald-500/20' },
  ANTHEMS: { icon: '🎵', color: 'bg-amber-500', bgColor: 'bg-amber-500/20' },
};

// Human-readable field names
const FIELD_LABELS: Record<string, string> = {
  pollens_aspirations: 'Aspirations',
  pollens_team_dynamics: 'Team Dynamics',
  pollens_cultural_elements: 'Cultural Elements',
  pollens_relational_patterns: 'Relational Patterns',
  pollens_constraints: 'Constraints',
  pollens_stakes: 'Stakes',
  noems_concepts: 'Concepts',
  noems_shared_ideas: 'Shared Ideas',
  noems_intuitions: 'Intuitions',
  noems_mental_models: 'Mental Models',
  poems_people: 'People',
  poems_objects: 'Objects',
  poems_environments: 'Environments',
  poems_messages: 'Messages',
  poems_systems: 'Systems',
  poems_prototypes: 'Prototypes',
  totems_data_architecture: 'Data Architecture',
  totems_security_policies: 'Security Policies',
  totems_access_controls: 'Access Controls',
  totems_system_requirements: 'System Requirements',
  totems_integration_points: 'Integration Points',
  totems_technical_debt: 'Technical Debt',
  anthems_market_positioning: 'Market Positioning',
  anthems_brand_narrative: 'Brand Narrative',
  anthems_go_to_market: 'Go-to-Market',
  anthems_audience_segments: 'Audience Segments',
  anthems_success_signals: 'Success Signals',
  anthems_storytelling_assets: 'Storytelling Assets',
};

interface PrdFieldsMatrixProps {
  prdData: any;
  className?: string;
}

export const PrdFieldsMatrix = ({ prdData, className }: PrdFieldsMatrixProps) => {
  const { seasonStats, totalFilled, totalFields } = useMemo(() => {
    const stats: Record<Season, { filled: number; total: number; fields: { name: string; hasContent: boolean }[] }> = {} as any;
    let totalFilled = 0;
    let totalFields = 0;

    const seasons: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
    
    seasons.forEach(season => {
      const fields = SEASON_FIELDS[season];
      const fieldStatus = fields.map(field => {
        const value = prdData?.[field];
        const hasContent = value && typeof value === 'string' && value.trim().length > 0;
        return { name: field, hasContent };
      });
      
      const filled = fieldStatus.filter(f => f.hasContent).length;
      stats[season] = {
        filled,
        total: fields.length,
        fields: fieldStatus,
      };
      totalFilled += filled;
      totalFields += fields.length;
    });

    return { seasonStats: stats, totalFilled, totalFields };
  }, [prdData]);

  const completionPercentage = Math.round((totalFilled / totalFields) * 100);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">PRD Fields Matrix</CardTitle>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-semibold',
              completionPercentage === 100 ? 'text-emerald-500' : 'text-muted-foreground'
            )}>
              {totalFilled}/{totalFields}
            </span>
            {completionPercentage === 100 && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <TooltipProvider delayDuration={200}>
          {(['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'] as Season[]).map(season => {
            const config = SEASON_CONFIG[season];
            const stats = seasonStats[season];
            const isComplete = stats.filled === stats.total;

            return (
              <div key={season} className="flex items-center gap-3">
                {/* Season icon and label */}
                <div className="flex items-center gap-2 w-24 shrink-0">
                  <span className="text-sm">{config.icon}</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {season.slice(0, 3)}
                  </span>
                </div>

                {/* Field dots */}
                <div className="flex items-center gap-1.5 flex-1">
                  {stats.fields.map((field, idx) => (
                    <Tooltip key={field.name}>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            'h-3 w-3 rounded-full transition-all duration-200 hover:scale-125',
                            field.hasContent 
                              ? config.color 
                              : 'bg-muted-foreground/20 border border-muted-foreground/30'
                          )}
                          aria-label={`${FIELD_LABELS[field.name]}: ${field.hasContent ? 'filled' : 'empty'}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-medium">{FIELD_LABELS[field.name]}</p>
                        <p className={cn(
                          'text-xs',
                          field.hasContent ? 'text-emerald-400' : 'text-muted-foreground'
                        )}>
                          {field.hasContent ? '✓ Has content' : '○ Empty'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* Season count */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={cn(
                    'text-xs font-medium tabular-nums',
                    isComplete ? 'text-emerald-500' : 'text-muted-foreground'
                  )}>
                    {stats.filled}/{stats.total}
                  </span>
                  {isComplete && (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  )}
                </div>
              </div>
            );
          })}
        </TooltipProvider>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/50 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span>Filled</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20 border border-muted-foreground/30" />
            <span>Empty</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrdFieldsMatrix;
