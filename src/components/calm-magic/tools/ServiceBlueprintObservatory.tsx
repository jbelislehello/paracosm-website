import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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
  generateMentalModel,
  generateTaskModel,
  getCellTasks,
  getCellMentalNodes,
  type TaskModelItem,
  type MentalModelNode,
} from '@/utils/mentalTaskModels';
import { useBlueprintTasks, type BlueprintTask } from '@/hooks/useBlueprintTasks';
import {
  Layout, CheckCircle2, AlertTriangle, XCircle,
  Sparkles, Users, Server, ArrowRight,
  Layers, Target, Shield, Brain, ListTodo,
  Save, Check, Circle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PrdRecord } from '@/hooks/useProjectPrd';

interface ServiceBlueprintObservatoryProps {
  prdData?: PrdRecord | null;
  isLoading?: boolean;
  projectId?: string | null;
}

const TIER_CONFIG: Record<Tier, { label: string; lane: string; laneDesc: string; icon: React.ElementType; accentClass: string; barClass: string }> = {
  magic: {
    label: 'Strategic Intelligence',
    lane: 'Backstage',
    laneDesc: 'Organizational decisions & governance',
    icon: Sparkles,
    accentClass: 'border-purple-500/30 bg-purple-500/5',
    barClass: '[&>div]:bg-purple-500',
  },
  calm: {
    label: 'Human Experience',
    lane: 'Frontstage',
    laneDesc: 'User-facing touchpoints & interactions',
    icon: Users,
    accentClass: 'border-teal-500/30 bg-teal-500/5',
    barClass: '[&>div]:bg-teal-500',
  },
  free: {
    label: 'Infrastructure',
    lane: 'Support',
    laneDesc: 'Technical systems & deployment',
    icon: Server,
    accentClass: 'border-slate-500/30 bg-slate-500/5',
    barClass: '[&>div]:bg-slate-500',
  },
};

const SEASON_META: Record<Season, { emoji: string }> = {
  POLLENS: { emoji: '🌸' },
  NOEMS: { emoji: '💡' },
  POEMS: { emoji: '📖' },
  TOTEMS: { emoji: '💎' },
  ANTHEMS: { emoji: '🎵' },
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500 text-white',
  high: 'bg-amber-500 text-white',
  medium: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  low: 'bg-muted text-muted-foreground',
};

const STATUS_ICON: Record<string, React.ElementType> = {
  todo: Circle,
  in_progress: Loader2,
  done: Check,
};

const RiskIcon: React.FC<{ risk: RiskLevel }> = ({ risk }) => {
  if (risk === 'low') return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
  if (risk === 'medium') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
  return <XCircle className="w-3.5 h-3.5 text-red-500" />;
};

// ─── Cell Detail Panel ──────────────────────────────────────────

interface CellDetailProps {
  season: Season;
  tier: Tier;
  mentalNodes: MentalModelNode[];
  taskItems: TaskModelItem[];
  savedTasks: BlueprintTask[];
  onSaveTasks: (tasks: TaskModelItem[]) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
  isSaving: boolean;
}

const CellDetailPanel: React.FC<CellDetailProps> = ({
  season, tier, mentalNodes, taskItems, savedTasks, onSaveTasks, onUpdateStatus, isSaving
}) => {
  const unresolvedTasks = taskItems.filter(t => !t.isResolved);
  const resolvedTasks = taskItems.filter(t => t.isResolved);

  return (
    <div className="mt-3 pt-3 border-t border-border/30 space-y-4">
      {/* Mental Model Section */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Brain className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Mental Model</span>
        </div>
        <div className="space-y-1.5">
          {mentalNodes.map(node => (
            <div key={node.id} className="text-[11px] space-y-0.5">
              <div className="flex items-start gap-1.5">
                {node.filled ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-3 h-3 text-muted-foreground/30 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className={cn('font-medium', node.filled ? 'text-foreground' : 'text-muted-foreground/60')}>
                    {node.concept}
                  </span>
                  {node.filled && node.content && (
                    <p className="text-muted-foreground mt-0.5 line-clamp-2">{node.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {mentalNodes.length > 0 && (
            <p className="text-[10px] text-muted-foreground/60 italic mt-1">
              {mentalNodes[0].understanding}
            </p>
          )}
        </div>
      </div>

      {/* Task Model Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ListTodo className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tasks</span>
          </div>
          {unresolvedTasks.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-5 text-[10px] px-1.5 gap-1"
              onClick={() => onSaveTasks(unresolvedTasks)}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Save {unresolvedTasks.length}
            </Button>
          )}
        </div>

        <div className="space-y-1">
          {/* Saved tasks from Supabase */}
          {savedTasks.map(task => {
            const StatusIcon = STATUS_ICON[task.status] || Circle;
            return (
              <div key={task.id} className="flex items-center gap-1.5 text-[11px] group">
                <button
                  onClick={() => {
                    const next = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo';
                    onUpdateStatus(task.id, next);
                  }}
                  className="flex-shrink-0"
                >
                  <StatusIcon className={cn(
                    'w-3 h-3',
                    task.status === 'done' ? 'text-green-500' :
                    task.status === 'in_progress' ? 'text-blue-500 animate-spin' :
                    'text-muted-foreground/40 group-hover:text-primary'
                  )} />
                </button>
                <span className={cn(
                  task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'
                )}>
                  {task.title}
                </span>
                {task.priority && (
                  <Badge className={cn('text-[8px] px-1 py-0 ml-auto', PRIORITY_COLORS[task.priority] || '')}>
                    {task.priority}
                  </Badge>
                )}
              </div>
            );
          })}

          {/* Unresolved tasks not yet saved */}
          {unresolvedTasks.filter(t => !savedTasks.some(st => st.title === t.title)).map(task => (
            <div key={task.id} className="flex items-center gap-1.5 text-[11px] opacity-60">
              <Circle className="w-3 h-3 text-muted-foreground/30 flex-shrink-0" />
              <span className="text-muted-foreground">{task.title}</span>
              <Badge className={cn('text-[8px] px-1 py-0 ml-auto', PRIORITY_COLORS[task.priority] || '')}>
                {task.priority}
              </Badge>
            </div>
          ))}

          {/* Resolved items */}
          {resolvedTasks.map(task => (
            <div key={task.id} className="flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground/60 line-through">{task.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────

const ServiceBlueprintObservatory: React.FC<ServiceBlueprintObservatoryProps> = ({
  prdData = null,
  isLoading = false,
  projectId = null,
}) => {
  const matrix = getPrdObservatoryMapping(prdData);
  const dependencies = getCrossLayerDependencies();
  const [expandedCell, setExpandedCell] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const mentalModel = useMemo(() => generateMentalModel(prdData), [prdData]);
  const taskModel = useMemo(() => generateTaskModel(prdData), [prdData]);

  const {
    tasks: savedTasks,
    saveBulkTasks,
    updateTaskStatus,
    getTasksForCell,
    isLoading: tasksLoading,
  } = useBlueprintTasks(projectId);

  const getCell = (season: Season, tier: Tier) =>
    matrix.cells.find(c => c.season === season && c.tier === tier)!;

  const handleSaveTasks = async (taskItems: TaskModelItem[]) => {
    setIsSaving(true);
    await saveBulkTasks(taskItems.map(t => ({
      title: t.title,
      category: t.category,
      priority: t.priority,
      notes: t.description,
      goal: `De-risk ${t.season} ${t.tier} layer`,
    })));
    setIsSaving(false);
  };

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
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 via-teal-500 to-slate-500 flex items-center justify-center shadow-md">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Service Blueprint</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mental models, tasks & readiness across strategy, experience & infrastructure
            </p>
          </div>
        </div>

        {/* KPI Bar */}
        <div className="grid grid-cols-4 gap-2">
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/30">
            <Target className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">Readiness</p>
              <p className="text-base font-bold text-foreground">{matrix.overallReadiness}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/30">
            <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">Ready</p>
              <p className="text-base font-bold text-foreground">{readyCellCount}/15</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/30">
            <Brain className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">Concepts</p>
              <p className="text-base font-bold text-foreground">
                {mentalModel.nodes.filter(n => n.filled).length}/{mentalModel.nodes.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/30">
            <ListTodo className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">Tasks</p>
              <p className="text-base font-bold text-foreground">
                {taskModel.completedCount}/{taskModel.totalCount}
              </p>
            </div>
          </div>
        </div>

        {/* Critical Path */}
        {taskModel.criticalPath.length > 0 && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="py-2.5 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  Critical Path — {taskModel.criticalPath.filter(t => t.priority === 'critical').length} blocking
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] px-2 gap-1"
                  onClick={() => handleSaveTasks(taskModel.criticalPath.slice(0, 10))}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save top 10
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3 px-4">
              <div className="space-y-1">
                {taskModel.criticalPath.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-2 text-xs">
                    <Badge className={cn('text-[8px] px-1 py-0', PRIORITY_COLORS[task.priority])}>
                      {task.priority}
                    </Badge>
                    <span className="text-foreground">{task.title}</span>
                    <span className="text-muted-foreground/50 text-[10px] ml-auto">{task.season}</span>
                  </div>
                ))}
                {taskModel.criticalPath.length > 5 && (
                  <p className="text-[10px] text-muted-foreground">
                    +{taskModel.criticalPath.length - 5} more tasks
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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

              <CardContent className="pt-0 pb-3 px-4">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {SEASONS.map((season, idx) => {
                    const cell = getCell(season, tier);
                    const meta = SEASON_META[season];
                    const cellKey = `${season}-${tier}`;
                    const isExpanded = expandedCell === cellKey;
                    const actionText = getDeRiskingActions(season, tier, cell.readiness);

                    // Get mental model + task model data for this cell
                    const cellMentalNodes = getCellMentalNodes(mentalModel, season, tier);
                    const cellTaskItems = getCellTasks(taskModel, season, tier);
                    const cellSavedTasks = getTasksForCell(season, tier);

                    return (
                      <React.Fragment key={season}>
                        <div
                          className={cn(
                            'flex-1 min-w-[160px] rounded-lg border p-3 cursor-pointer transition-all',
                            'hover:shadow-md hover:border-primary/30',
                            isExpanded ? 'border-primary/40 shadow-sm bg-background min-w-[220px]' : 'border-border/30 bg-background/50',
                            cell.risk === 'high' && 'border-red-500/20',
                          )}
                          onClick={() => setExpandedCell(isExpanded ? null : cellKey)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">{meta.emoji}</span>
                            <div className="flex items-center gap-1">
                              {cellSavedTasks.length > 0 && (
                                <Badge variant="outline" className="text-[8px] px-1 py-0">
                                  {cellSavedTasks.filter(t => t.status === 'done').length}/{cellSavedTasks.length}
                                </Badge>
                              )}
                              <RiskIcon risk={cell.risk} />
                            </div>
                          </div>

                          <p className="text-xs font-medium text-foreground leading-tight mb-1.5">
                            {cell.label}
                          </p>

                          <Progress value={cell.readiness} className={cn('h-1', cfg.barClass)} />
                          <p className="text-[10px] text-muted-foreground mt-1 font-mono">{cell.readiness}%</p>

                          <p className="text-[10px] text-muted-foreground mt-2 leading-tight line-clamp-2">
                            {actionText}
                          </p>

                          {/* Expanded: Mental Model + Task Model */}
                          {isExpanded && (
                            <CellDetailPanel
                              season={season}
                              tier={tier}
                              mentalNodes={cellMentalNodes}
                              taskItems={cellTaskItems}
                              savedTasks={cellSavedTasks}
                              onSaveTasks={handleSaveTasks}
                              onUpdateStatus={updateTaskStatus}
                              isSaving={isSaving}
                            />
                          )}
                        </div>

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
