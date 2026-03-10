import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  getPrdObservatoryMapping,
  getCrossLayerDependencies,
  getDeRiskingActions,
  SEASONS,
  TIERS,
  type Season,
  type Tier,
  type RiskLevel,
} from '@/utils/serviceBlueprintMapping';
import {
  Layout, CheckCircle2, AlertTriangle, XCircle,
  ChevronRight, Sparkles, Users, Server, ArrowRight,
  Layers, Target, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PrdRecord } from '@/hooks/useProjectPrd';

interface ServiceBlueprintObservatoryProps {
  prdData?: PrdRecord | null;
  isLoading?: boolean;
}

const TIER_CONFIG: Record<Tier, { label: string; lane: string; laneDesc: string; icon: React.ElementType; accentClass: string; barClass: string; dotClass: string }> = {
  magic: {
    label: 'Strategic Intelligence',
    lane: 'Backstage',
    laneDesc: 'Organizational decisions & governance',
    icon: Sparkles,
    accentClass: 'border-purple-500/30 bg-purple-500/5',
    barClass: '[&>div]:bg-purple-500',
    dotClass: 'bg-purple-500',
  },
  calm: {
    label: 'Human Experience',
    lane: 'Frontstage',
    laneDesc: 'User-facing touchpoints & interactions',
    icon: Users,
    accentClass: 'border-teal-500/30 bg-teal-500/5',
    barClass: '[&>div]:bg-teal-500',
    dotClass: 'bg-teal-500',
  },
  free: {
    label: 'Infrastructure',
    lane: 'Support',
    laneDesc: 'Technical systems & deployment',
    icon: Server,
    accentClass: 'border-slate-500/30 bg-slate-500/5',
    barClass: '[&>div]:bg-slate-500',
    dotClass: 'bg-slate-500',
  },
};

const SEASON_META: Record<Season, { emoji: string; color: string }> = {
  POLLENS: { emoji: '🌸', color: 'text-rose-500' },
  NOEMS: { emoji: '💡', color: 'text-violet-500' },
  POEMS: { emoji: '📖', color: 'text-blue-500' },
  TOTEMS: { emoji: '💎', color: 'text-emerald-500' },
  ANTHEMS: { emoji: '🎵', color: 'text-amber-500' },
};

const RiskIcon: React.FC<{ risk: RiskLevel; className?: string }> = ({ risk, className }) => {
  if (risk === 'low') return <CheckCircle2 className={cn('w-3.5 h-3.5 text-green-500', className)} />;
  if (risk === 'medium') return <AlertTriangle className={cn('w-3.5 h-3.5 text-amber-500', className)} />;
  return <XCircle className={cn('w-3.5 h-3.5 text-red-500', className)} />;
};

const ServiceBlueprintObservatory: React.FC<ServiceBlueprintObservatoryProps> = ({ prdData = null, isLoading = false }) => {
  const matrix = getPrdObservatoryMapping(prdData);
  const dependencies = getCrossLayerDependencies();
  const [expandedCell, setExpandedCell] = useState<string | null>(null);

  const getCell = (season: Season, tier: Tier) =>
    matrix.cells.find(c => c.season === season && c.tier === tier)!;

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-16 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-40 bg-muted rounded mt-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const noPrd = !prdData;
  const highRiskCount = matrix.cells.filter(c => c.risk === 'high').length;
  const readyCellCount = matrix.cells.filter(c => c.risk === 'low').length;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with overall metrics */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 via-teal-500 to-slate-500 flex items-center justify-center shadow-md">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Service Blueprint</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI initiative readiness across strategy, experience & infrastructure
            </p>
          </div>
        </div>

        {/* KPI Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
            <Target className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Overall</p>
              <p className="text-lg font-bold text-foreground">{matrix.overallReadiness}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
            <Shield className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Ready</p>
              <p className="text-lg font-bold text-foreground">{readyCellCount}/15</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">At Risk</p>
              <p className="text-lg font-bold text-foreground">{highRiskCount}</p>
            </div>
          </div>
        </div>

        {noPrd && (
          <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 text-sm text-amber-700 dark:text-amber-300">
            No PRD data available. Complete your season journey and compile fragments to populate this blueprint.
          </div>
        )}

        {/* Swimlane Blueprint Matrix */}
        {TIERS.map(tier => {
          const cfg = TIER_CONFIG[tier];
          const Icon = cfg.icon;
          const tierCells = SEASONS.map(s => getCell(s, tier));
          const tierReadiness = tierCells.length > 0
            ? Math.round(tierCells.reduce((sum, c) => sum + c.readiness, 0) / tierCells.length)
            : 0;

          return (
            <Card key={tier} className={cn('overflow-hidden border', cfg.accentClass)}>
              {/* Lane Header */}
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', cfg.accentClass)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{cfg.lane}</CardTitle>
                      <p className="text-[10px] text-muted-foreground">{cfg.laneDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={tierReadiness} className={cn('w-20 h-1.5', cfg.barClass)} />
                    <span className="text-xs font-mono text-muted-foreground w-8 text-right">{tierReadiness}%</span>
                  </div>
                </div>
              </CardHeader>

              {/* Season Touchpoints Row */}
              <CardContent className="pt-0 pb-3 px-4">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {SEASONS.map((season, idx) => {
                    const cell = getCell(season, tier);
                    const meta = SEASON_META[season];
                    const cellKey = `${season}-${tier}`;
                    const isExpanded = expandedCell === cellKey;
                    const actionText = getDeRiskingActions(season, tier, cell.readiness);

                    return (
                      <React.Fragment key={season}>
                        <div
                          className={cn(
                            'flex-1 min-w-[140px] rounded-lg border p-3 cursor-pointer transition-all',
                            'hover:shadow-md hover:border-primary/30',
                            isExpanded ? 'border-primary/40 shadow-sm bg-background' : 'border-border/30 bg-background/50',
                            cell.risk === 'high' && 'border-red-500/20',
                          )}
                          onClick={() => setExpandedCell(isExpanded ? null : cellKey)}
                        >
                          {/* Touchpoint Header */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">{meta.emoji}</span>
                            <RiskIcon risk={cell.risk} />
                          </div>

                          {/* Label */}
                          <p className="text-xs font-medium text-foreground leading-tight mb-1.5">
                            {cell.label}
                          </p>

                          {/* Readiness Bar */}
                          <Progress value={cell.readiness} className={cn('h-1', cfg.barClass)} />
                          <p className="text-[10px] text-muted-foreground mt-1 font-mono">{cell.readiness}%</p>

                          {/* De-risking Action */}
                          <p className="text-[10px] text-muted-foreground mt-2 leading-tight line-clamp-2">
                            {actionText}
                          </p>

                          {/* Expanded Fields */}
                          {isExpanded && (
                            <div className="mt-3 pt-2 border-t border-border/30 space-y-1.5">
                              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">PRD Fields</p>
                              {cell.fields.map(f => (
                                <div key={f.key} className="flex items-center gap-1.5 text-[11px]">
                                  {f.filled ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-muted-foreground/30 flex-shrink-0" />
                                  )}
                                  <span className={cn(
                                    f.filled ? 'text-foreground' : 'text-muted-foreground/50'
                                  )}>
                                    {f.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Flow connector between touchpoints */}
                        {idx < SEASONS.length - 1 && (
                          <div className="flex items-center justify-center flex-shrink-0 pt-6">
                            <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Cross-Layer Dependencies */}
        <Card className="border-dashed border-primary/20">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs flex items-center gap-2 text-muted-foreground">
              <Layers className="w-3.5 h-3.5" />
              Cross-Layer Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dependencies.map((dep, i) => {
                const fromCell = getCell(dep.from.season, dep.from.tier);
                const toCell = getCell(dep.to.season, dep.to.tier);
                const bothReady = fromCell.risk === 'low' && toCell.risk === 'low';
                const hasRisk = fromCell.risk === 'high' || toCell.risk === 'high';

                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        'flex items-center gap-2 text-xs p-2.5 rounded-md border transition-colors',
                        bothReady ? 'border-green-500/20 bg-green-500/5' :
                        hasRisk ? 'border-red-500/20 bg-red-500/5' :
                        'border-border/30 bg-muted/30'
                      )}>
                        <div className={cn('w-2 h-2 rounded-full flex-shrink-0',
                          bothReady ? 'bg-green-500' : hasRisk ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                        )} />
                        <span className="text-muted-foreground leading-tight">{dep.label}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {dep.from.season}/{dep.from.tier} ({fromCell.readiness}%) →{' '}
                        {dep.to.season}/{dep.to.tier} ({toCell.readiness}%)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ServiceBlueprintObservatory;
