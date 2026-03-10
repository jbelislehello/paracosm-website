import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Telescope, Eye, ArrowDown, Orbit,
  Sparkles, Users, Server, Layout, CheckCircle2, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getPrdObservatoryMapping,
  getCrossLayerDependencies,
  SEASONS,
  TIERS,
  type Season,
  type Tier,
} from '@/utils/serviceBlueprintMapping';
import type { PrdRecord } from '@/hooks/useProjectPrd';

interface AIObservatoryModelProps {
  onNavigateToBlueprint?: () => void;
  prdData?: PrdRecord | null;
}

const LAYER_CONFIG: Record<Tier, {
  title: string;
  tag: string;
  icon: React.ElementType;
  gradient: string;
  border: string;
  badgeClass: string;
  barClass: string;
  dotColor: string;
  nodes: string[];
}> = {
  magic: {
    title: 'Layer 1 — Strategic Intelligence',
    tag: 'MAGIC',
    icon: Sparkles,
    gradient: 'from-purple-600/20 to-indigo-600/20 dark:from-purple-900/30 dark:to-indigo-900/30',
    border: 'border-purple-400/30',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    barClass: '[&>div]:bg-purple-500',
    dotColor: 'bg-purple-500',
    nodes: ['Vision & Intent', 'Cultural Maturity', 'Org Alignment', 'AI Literacy', 'Capability Readiness', 'Governance'],
  },
  calm: {
    title: 'Layer 2 — Human Experience Intelligence',
    tag: 'CALM',
    icon: Users,
    gradient: 'from-teal-600/20 to-emerald-600/20 dark:from-teal-900/30 dark:to-emerald-900/30',
    border: 'border-teal-400/30',
    badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    barClass: '[&>div]:bg-teal-500',
    dotColor: 'bg-teal-500',
    nodes: ['Journey Mapping', 'Mental Models', 'UX/IXD', 'Interface Patterns', 'Trust & Explainability', 'Feedback Loops'],
  },
  free: {
    title: 'Layer 3 — Technical Infrastructure Intelligence',
    tag: 'FREE',
    icon: Server,
    gradient: 'from-slate-600/20 to-blue-600/20 dark:from-slate-900/30 dark:to-blue-900/30',
    border: 'border-slate-400/30',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300',
    barClass: '[&>div]:bg-slate-500',
    dotColor: 'bg-slate-500',
    nodes: ['Data Pipelines', 'Model Evaluation', 'Deployment', 'Release Cadence', 'Monitoring', 'Drift Detection'],
  },
};

const crossLayerLabels = [
  { from: 'Strategic Vision', to: 'Product Experience', colors: 'from-purple-400 to-teal-400' },
  { from: 'Cultural Readiness', to: 'Adoption Rate', colors: 'from-purple-400 to-emerald-400' },
  { from: 'Infrastructure Reliability', to: 'User Trust', colors: 'from-slate-400 to-teal-400' },
];

const AIObservatoryModel: React.FC<AIObservatoryModelProps> = ({ onNavigateToBlueprint, prdData = null }) => {
  const matrix = getPrdObservatoryMapping(prdData);
  const dependencies = getCrossLayerDependencies();

  // Compute per-tier readiness from real PRD data
  const getTierReadiness = (tier: Tier) => {
    const tierCells = matrix.cells.filter(c => c.tier === tier);
    if (tierCells.length === 0) return 0;
    return Math.round(tierCells.reduce((sum, c) => sum + c.readiness, 0) / tierCells.length);
  };

  // Derive telemetry signals from real PRD field completion per tier
  const getTierTelemetry = (tier: Tier) => {
    const tierCells = matrix.cells.filter(c => c.tier === tier);
    return tierCells.map(cell => ({
      label: `${cell.season} — ${cell.label}`,
      value: cell.readiness,
      risk: cell.risk,
      filledFields: cell.fields.filter(f => f.filled).length,
      totalFields: cell.fields.length,
    }));
  };

  const noPrd = !prdData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-teal-500 to-slate-500 flex items-center justify-center">
          <Telescope className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Observatory Model</h2>
          <p className="text-sm text-muted-foreground">
            {noPrd ? 'No PRD data — compile fragments to activate telemetry' : 'Live telemetry from PRD field completion'}
          </p>
        </div>
        <Badge variant="outline" className="ml-auto text-xs">
          {matrix.overallReadiness}% readiness
        </Badge>
      </div>

      {/* Layers */}
      {TIERS.map((tier, idx) => {
        const cfg = LAYER_CONFIG[tier];
        const Icon = cfg.icon;
        const tierReadiness = getTierReadiness(tier);
        const telemetry = getTierTelemetry(tier);

        return (
          <div key={tier}>
            <Card className={cn(`bg-gradient-to-br ${cfg.gradient} ${cfg.border} overflow-hidden`)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="w-5 h-5" />
                  {cfg.title}
                  <Badge variant="outline" className="ml-auto text-xs">{cfg.tag} · {tierReadiness}%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nodes */}
                <div className="flex flex-wrap gap-2">
                  {cfg.nodes.map(node => (
                    <Badge key={node} className={cfg.badgeClass}>{node}</Badge>
                  ))}
                </div>

                {/* Telemetry from real PRD data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {telemetry.map(t => (
                    <div key={t.label} className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="truncate">{t.label}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {t.risk === 'low' ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          ) : t.risk === 'high' ? (
                            <XCircle className="w-3 h-3 text-red-500" />
                          ) : null}
                          <span className="font-mono">{t.filledFields}/{t.totalFields}</span>
                        </div>
                      </div>
                      <Progress value={t.value} className={cn('h-2', cfg.barClass)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cross-layer connector */}
            {idx < 2 && (
              <div className="flex items-center justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn('h-6 w-px bg-gradient-to-b opacity-60', crossLayerLabels[idx].colors)} />
                  <ArrowDown className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    {crossLayerLabels[idx].from} → {crossLayerLabels[idx].to}
                  </span>
                  <div className={cn('h-6 w-px bg-gradient-to-b opacity-60', crossLayerLabels[idx].colors)} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Cross-Layer Dynamics */}
      <Card className="border-dashed border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Cross-Layer Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dependencies.map((dep, i) => {
              const fromCell = matrix.cells.find(c => c.season === dep.from.season && c.tier === dep.from.tier);
              const toCell = matrix.cells.find(c => c.season === dep.to.season && c.tier === dep.to.tier);
              return (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-md bg-muted/50">
                  <div className={cn('w-2 h-2 rounded-full bg-gradient-to-r', dep.color,
                    fromCell?.risk === 'high' || toCell?.risk === 'high' ? 'animate-pulse' : ''
                  )} />
                  <span className="leading-tight">{dep.label}</span>
                  <span className="ml-auto font-mono text-[10px]">
                    {fromCell?.readiness ?? 0}→{toCell?.readiness ?? 0}%
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* PRD Integration */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Orbit className="w-4 h-4" />
            PRD Season Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {SEASONS.map(season => {
              const seasonCells = matrix.cells.filter(c => c.season === season);
              const seasonReadiness = seasonCells.length > 0
                ? Math.round(seasonCells.reduce((sum, c) => sum + c.readiness, 0) / seasonCells.length)
                : 0;
              return (
                <div key={season} className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-border/50 bg-muted/30">
                  <p className="text-xs font-medium text-foreground">{season}</p>
                  <div className="flex gap-0.5">
                    {TIERS.map(tier => {
                      const cell = matrix.cells.find(c => c.season === season && c.tier === tier)!;
                      return (
                        <div
                          key={tier}
                          className={cn(
                            'w-2.5 h-2.5 rounded-full',
                            LAYER_CONFIG[tier].dotColor,
                            cell.readiness === 0 && 'opacity-20',
                            cell.readiness > 0 && cell.readiness < 75 && 'opacity-60',
                          )}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{seasonReadiness}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigate to Blueprint */}
      {onNavigateToBlueprint && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onNavigateToBlueprint} className="gap-2">
            <Layout className="w-4 h-4" />
            View Service Blueprint
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIObservatoryModel;
