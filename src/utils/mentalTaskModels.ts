import {
  getPrdObservatoryMapping,
  getCrossLayerDependencies,
  SEASONS,
  TIERS,
  SEASON_TIER_MAP,
  type Season,
  type Tier,
  type RiskLevel,
  type BlueprintMatrix,
} from '@/utils/serviceBlueprintMapping';

// ─── Mental Model ───────────────────────────────────────────────

export interface MentalModelNode {
  id: string;
  season: Season;
  tier: Tier;
  concept: string;
  understanding: string; // what the user should understand
  relationship: string;  // how it connects to adjacent nodes
  filled: boolean;
  content: string | null;
}

export interface MentalModel {
  nodes: MentalModelNode[];
  gaps: MentalModelNode[];       // unfilled nodes = conceptual gaps
  connections: { from: string; to: string; label: string }[];
}

// ─── Task Model ─────────────────────────────────────────────────

export type TaskPhase = 'discovery' | 'design' | 'build' | 'ship';

export interface TaskModelItem {
  id: string;
  season: Season;
  tier: Tier;
  phase: TaskPhase;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  dependsOn: string[];
  fieldKey: string;       // the PRD field this task addresses
  isResolved: boolean;    // true if the PRD field is already filled
}

export interface TaskModel {
  tasks: TaskModelItem[];
  criticalPath: TaskModelItem[];    // ordered sequence of blocking tasks
  completedCount: number;
  totalCount: number;
}

// ─── Mappings ───────────────────────────────────────────────────

const TIER_TO_PHASE: Record<Tier, TaskPhase> = {
  magic: 'discovery',
  calm: 'design',
  free: 'build',
};

const SEASON_TO_PHASE_OVERRIDE: Partial<Record<Season, TaskPhase>> = {
  ANTHEMS: 'ship',
};

const TIER_UNDERSTANDING: Record<Tier, string> = {
  magic: 'Strategic decisions that shape what the AI initiative becomes',
  calm: 'Human experience patterns that determine adoption and trust',
  free: 'Infrastructure choices that constrain what can be built and deployed',
};

const TIER_RELATIONSHIP: Record<Tier, string> = {
  magic: 'Feeds into experience design (CALM) and constrains infrastructure (FREE)',
  calm: 'Translates strategy (MAGIC) into user-facing patterns, depends on infrastructure (FREE)',
  free: 'Enables experience delivery (CALM) and implements strategic decisions (MAGIC)',
};

function getPriority(risk: RiskLevel, tier: Tier): TaskModelItem['priority'] {
  if (risk === 'high' && tier === 'magic') return 'critical';
  if (risk === 'high') return 'high';
  if (risk === 'medium') return 'medium';
  return 'low';
}

function getTaskCategory(season: Season, tier: Tier): string {
  return `${season.toLowerCase()}-${tier}`;
}

// ─── Generators ─────────────────────────────────────────────────

export function generateMentalModel(prdData: Record<string, string | null | undefined> | null): MentalModel {
  const nodes: MentalModelNode[] = [];

  for (const season of SEASONS) {
    for (const tier of TIERS) {
      const mapping = SEASON_TIER_MAP[season][tier];
      for (const field of mapping.fields) {
        const content = prdData?.[field.key] as string | null ?? null;
        const filled = Boolean(content?.trim());
        nodes.push({
          id: `${season}-${tier}-${field.key}`,
          season,
          tier,
          concept: `${mapping.label}: ${field.label}`,
          understanding: TIER_UNDERSTANDING[tier],
          relationship: TIER_RELATIONSHIP[tier],
          filled,
          content: filled ? content : null,
        });
      }
    }
  }

  const gaps = nodes.filter(n => !n.filled);

  // Cross-layer connections from dependency graph
  const deps = getCrossLayerDependencies();
  const connections = deps.map(dep => ({
    from: `${dep.from.season}-${dep.from.tier}`,
    to: `${dep.to.season}-${dep.to.tier}`,
    label: dep.label,
  }));

  return { nodes, gaps, connections };
}

export function generateTaskModel(prdData: Record<string, string | null | undefined> | null): TaskModel {
  const matrix = getPrdObservatoryMapping(prdData);
  const deps = getCrossLayerDependencies();
  const tasks: TaskModelItem[] = [];

  for (const cell of matrix.cells) {
    const mapping = SEASON_TIER_MAP[cell.season][cell.tier];
    const phase = SEASON_TO_PHASE_OVERRIDE[cell.season] ?? TIER_TO_PHASE[cell.tier];

    for (const field of cell.fields) {
      const isResolved = field.filled;

      // Find dependencies: if this cell's tier/season appears as a "to" in deps, its "from" is a dependency
      const dependsOn: string[] = [];
      for (const dep of deps) {
        if (dep.to.season === cell.season && dep.to.tier === cell.tier) {
          dependsOn.push(`${dep.from.season}-${dep.from.tier}`);
        }
      }

      tasks.push({
        id: `task-${cell.season}-${cell.tier}-${field.key}`,
        season: cell.season,
        tier: cell.tier,
        phase,
        title: isResolved
          ? `✅ ${field.label} — completed`
          : `Define ${field.label} for ${mapping.label}`,
        description: isResolved
          ? `${field.label} is populated in your PRD`
          : `${mapping.action} — specifically address the "${field.label}" dimension`,
        priority: isResolved ? 'low' : getPriority(cell.risk, cell.tier),
        category: getTaskCategory(cell.season, cell.tier),
        dependsOn,
        fieldKey: field.key,
        isResolved,
      });
    }
  }

  // Critical path: unresolved tasks sorted by priority, then by season order
  const seasonOrder: Record<Season, number> = { POLLENS: 0, NOEMS: 1, POEMS: 2, TOTEMS: 3, ANTHEMS: 4 };
  const tierOrder: Record<Tier, number> = { magic: 0, calm: 1, free: 2 };
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const criticalPath = tasks
    .filter(t => !t.isResolved)
    .sort((a, b) => {
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      const sDiff = seasonOrder[a.season] - seasonOrder[b.season];
      if (sDiff !== 0) return sDiff;
      return tierOrder[a.tier] - tierOrder[b.tier];
    });

  return {
    tasks,
    criticalPath,
    completedCount: tasks.filter(t => t.isResolved).length,
    totalCount: tasks.length,
  };
}

// Get tasks for a specific cell (season × tier)
export function getCellTasks(taskModel: TaskModel, season: Season, tier: Tier): TaskModelItem[] {
  return taskModel.tasks.filter(t => t.season === season && t.tier === tier);
}

// Get mental model nodes for a specific cell
export function getCellMentalNodes(mentalModel: MentalModel, season: Season, tier: Tier): MentalModelNode[] {
  return mentalModel.nodes.filter(n => n.season === season && n.tier === tier);
}
