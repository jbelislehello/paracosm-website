
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Layout, ArrowDown, CheckCircle2, AlertTriangle, XCircle,
  ChevronDown, Sparkles, Users, Server, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrdData {
  [key: string]: string | null | undefined;
}

interface ServiceBlueprintObservatoryProps {
  prdData?: PrdData | null;
}

const TIER_CONFIG: Record<Tier, { label: string; lane: string; icon: React.ElementType; badgeCls: string; barCls: string }> = {
  magic: {
    label: 'MAGIC — Strategy',
    lane: 'Backstage',
    icon: Sparkles,
    badgeCls: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    barCls: '[&>div]:bg-purple-500',
  },
  calm: {
    label: 'CALM — Experience',
    lane: 'Frontstage',
    icon: Users,
    badgeCls: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    barCls: '[&>div]:bg-teal-500',
  },
  free: {
    label: 'FREE — Infrastructure',
    lane: 'Support',
    icon: Server,
    badgeCls: 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300',
    barCls: '[&>div]:bg-slate-500',
  },
};

const SEASON_EMOJI: Record<Season, string> = {
  POLLENS: '🌸',
  NOEMS: '💡',
  POEMS: '📖',
  TOTEMS: '💎',
  ANTHEMS: '🎵',
};

const RiskBadge: React.FC<{ risk: RiskLevel }> = ({ risk }) => {
  if (risk === 'low') return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" />Low</Badge>;
  if (risk === 'medium') return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px]"><AlertTriangle className="w-3 h-3 mr-1" />Med</Badge>;
  return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 text-[10px]"><XCircle className="w-3 h-3 mr-1" />High</Badge>;
};

const ServiceBlueprintObservatory: React.FC<ServiceBlueprintObservatoryProps> = ({ prdData = null }) => {
  const matrix = getPrdObservatoryMapping(prdData);
  const dependencies = getCrossLayerDependencies();
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());

  const toggleCell = (key: string) => {
    setExpandedCells(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const getCell = (season: Season, tier: Tier) =>
    matrix.cells.find(c => c.season === season && c.tier === tier)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-teal-500 to-slate-500 flex items-center justify-center">
          <Layout className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Service Blueprint Observatory</h2>
          <p className="text-sm text-muted-foreground">
            PRD seasons × Observatory tiers — readiness, risk & de-risking actions
          </p>
        </div>
        <Badge variant="outline" className="ml-auto text-xs">
          {matrix.overallReadiness}% overall
        </Badge>
      </div>

      {/* Swimlane Legend */}
      <div className="flex flex-wrap gap-2">
        {TIERS.map(tier => {
          const cfg = TIER_CONFIG[tier];
          const Icon = cfg.icon;
          return (
            <div key={tier} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="w-3.5 h-3.5" />
              <span className="font-medium">{cfg.lane}</span>
              <span className="opacity-60">({cfg.label})</span>
            </div>
          );
        })}
      </div>

      {/* Matrix */}
      {SEASONS.map(season => (
        <Card key={season} className="border-border/50 overflow-hidden">
          <CardHeader className="py-3 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">{SEASON_EMOJI[season]}</span>
              {season}
              {/* Tier readiness dots */}
              <div className="flex gap-1 ml-auto">
                {TIERS.map(tier => {
                  const cell = getCell(season, tier);
                  return (
                    <div
                      key={tier}
                      className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        tier === 'magic' && 'bg-purple-500',
                        tier === 'calm' && 'bg-teal-500',
                        tier === 'free' && 'bg-slate-500',
                        cell.readiness === 0 && 'opacity-20',
                        cell.readiness > 0 && cell.readiness < 75 && 'opacity-60',
                      )}
                      title={`${TIER_CONFIG[tier].label}: ${cell.readiness}%`}
                    />
                  );
                })}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TIERS.map(tier => {
                const cell = getCell(season, tier);
                const cfg = TIER_CONFIG[tier];
                const cellKey = `${season}-${tier}`;
                const isOpen = expandedCells.has(cellKey);
                const actionText = getDeRiskingActions(season, tier, cell.readiness);

                return (
                  <Collapsible key={tier} open={isOpen} onOpenChange={() => toggleCell(cellKey)}>
                    <div className="rounded-lg border border-border/40 bg-muted/20 p-3 space-y-2">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Badge className={cn(cfg.badgeCls, 'text-[10px] px-1.5 py-0')}>{cfg.lane}</Badge>
                            <RiskBadge risk={cell.risk} />
                          </div>
                          <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                        </div>
                      </CollapsibleTrigger>

                      <p className="text-xs font-medium text-foreground">{cell.label}</p>

                      <Progress value={cell.readiness} className={cn('h-1.5', cfg.barCls)} />

                      <p className="text-[10px] text-muted-foreground leading-tight">{actionText}</p>

                      <CollapsibleContent>
                        <div className="mt-2 pt-2 border-t border-border/30 space-y-1">
                          {cell.fields.map(f => (
                            <div key={f.key} className="flex items-center gap-1.5 text-[10px]">
                              {f.filled ? (
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-muted-foreground/40" />
                              )}
                              <span className={cn(f.filled ? 'text-foreground' : 'text-muted-foreground/60')}>
                                {f.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Cross-Layer Dependencies */}
      <Card className="border-dashed border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Cross-Layer Dependencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dependencies.map((dep, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-md bg-muted/50">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${dep.color} animate-pulse`} />
                <span className="leading-tight">{dep.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceBlueprintObservatory;
