import { useMemo } from 'react';
import { ManifoldEntry } from '@/hooks/useManifoldData';

// 6 Organizational Visualization Modes
export type ProjectionMode = 
  | 'strategy'    // Spiral Ladder - LOVE→MAGIC→CALM→OPEN→FREE with KPIs
  | 'governance'  // Gate Map - linear gates with approval flow
  | 'operations'  // Dependency Graph - critical path emphasis
  | 'delivery'    // Roadmap/Chronos - timeline with milestones
  | 'adoption'    // Cycle Ring - recurring moments
  | 'sensemaking'; // Constellation/Kairos - center decision with evidence

// Garden types determine default visualization
export type GardenType = 'systems' | 'prototypes' | 'intelligence';

// Get default modes for each garden
export function getDefaultModesForGarden(garden: GardenType): ProjectionMode[] {
  switch (garden) {
    case 'systems':
      return ['operations', 'governance'];
    case 'prototypes':
      return ['delivery', 'strategy'];
    case 'intelligence':
    default:
      return ['sensemaking', 'strategy'];
  }
}

export interface ProjectedEntry extends ManifoldEntry {
  projectedX: number;
  projectedY: number;
  projectedZ: number;
  // For 2D layouts
  screenX?: number;
  screenY?: number;
  // Gate position (for governance)
  gateIndex?: number;
  gateProgress?: number;
  // Spiral position (for strategy)
  spiralStop?: number;
  kpiLabel?: string;
  // Ring position (for adoption)
  ringAngle?: number;
  ringPhase?: string;
  // Critical path (for operations)
  isCriticalPath?: boolean;
  dependencyLevel?: number;
}

interface UseProjectionEngineReturn {
  projectedEntries: ProjectedEntry[];
  mode: ProjectionMode;
}

// Strategy: Spiral Ladder with 5 stops (LOVE→MAGIC→CALM→OPEN→FREE)
function calculateStrategyPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  const KPI_LABELS: Record<string, string> = {
    'POLLENS': 'clarity',
    'NOEMS': 'risk',
    'POEMS': 'adoption',
    'TOTEMS': 'throughput',
    'ANTHEMS': 'trust'
  };
  
  const SPIRAL_STOPS = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
  
  // Group entries by season
  const entriesBySeason = new Map<string, ManifoldEntry[]>();
  SPIRAL_STOPS.forEach(s => entriesBySeason.set(s, []));
  entries.forEach(entry => {
    const season = entry.season || 'POLLENS';
    if (entriesBySeason.has(season)) {
      entriesBySeason.get(season)!.push(entry);
    }
  });
  
  const result: ProjectedEntry[] = [];
  
  SPIRAL_STOPS.forEach((season, stopIndex) => {
    const seasonEntries = entriesBySeason.get(season) || [];
    const stopAngle = (stopIndex / SPIRAL_STOPS.length) * Math.PI * 2;
    const stopRadius = 1 + stopIndex * 0.5;
    const stopHeight = stopIndex * 0.6 - 1.5;
    
    seasonEntries.forEach((entry, i) => {
      const offsetAngle = (i / Math.max(seasonEntries.length, 1)) * 0.3;
      const offsetRadius = (i % 3) * 0.15;
      
      result.push({
        ...entry,
        projectedX: Math.cos(stopAngle + offsetAngle) * (stopRadius + offsetRadius),
        projectedY: stopHeight + (i % 3) * 0.1,
        projectedZ: Math.sin(stopAngle + offsetAngle) * (stopRadius + offsetRadius),
        spiralStop: stopIndex,
        kpiLabel: KPI_LABELS[season]
      });
    });
  });
  
  return result;
}

// Governance: Gate Map - linear flow with gates
function calculateGovernancePositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  const GATES = ['Policy', 'Review', 'Approval', 'Audit', 'Release'];
  
  // Assign entries to gates based on tags or season
  return entries.map((entry, index) => {
    // Determine gate based on tags or fallback to season
    let gateIndex = 0;
    if (entry.tags.some(t => t.toLowerCase().includes('release') || t.toLowerCase().includes('done'))) {
      gateIndex = 4;
    } else if (entry.tags.some(t => t.toLowerCase().includes('audit') || t.toLowerCase().includes('check'))) {
      gateIndex = 3;
    } else if (entry.tags.some(t => t.toLowerCase().includes('approv') || t.toLowerCase().includes('sign'))) {
      gateIndex = 2;
    } else if (entry.tags.some(t => t.toLowerCase().includes('review'))) {
      gateIndex = 1;
    } else {
      // Fallback to season-based assignment
      const seasonGate: Record<string, number> = {
        'POLLENS': 0, 'NOEMS': 1, 'POEMS': 2, 'TOTEMS': 3, 'ANTHEMS': 4
      };
      gateIndex = seasonGate[entry.season] ?? 0;
    }
    
    const gateX = (gateIndex / (GATES.length - 1)) * 6 - 3;
    const laneY = ((index % 5) - 2) * 0.4;
    
    return {
      ...entry,
      projectedX: gateX,
      projectedY: laneY,
      projectedZ: Math.random() * 0.2 - 0.1,
      gateIndex,
      gateProgress: gateIndex / (GATES.length - 1)
    };
  });
}

// Operations: Dependency Graph - critical path emphasis
function calculateOperationsPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  // Build dependency levels based on creation time and shared tags
  const sorted = [...entries].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  // Calculate dependency levels
  const levels = new Map<string, number>();
  sorted.forEach((entry, i) => {
    let maxParentLevel = -1;
    
    // Find entries that share tags (potential dependencies)
    sorted.slice(0, i).forEach(prev => {
      const sharedTags = entry.tags.filter(t => prev.tags.includes(t)).length;
      if (sharedTags > 0) {
        maxParentLevel = Math.max(maxParentLevel, levels.get(prev.id) || 0);
      }
    });
    
    levels.set(entry.id, maxParentLevel + 1);
  });
  
  const maxLevel = Math.max(...Array.from(levels.values()), 1);
  
  // Mark critical path (highest dependency chain)
  const criticalPath = new Set<string>();
  let currentLevel = maxLevel;
  while (currentLevel >= 0) {
    const atLevel = sorted.filter(e => levels.get(e.id) === currentLevel);
    if (atLevel.length > 0) {
      criticalPath.add(atLevel[0].id);
    }
    currentLevel--;
  }
  
  // Position entries
  const levelCounts = new Map<number, number>();
  
  return sorted.map(entry => {
    const level = levels.get(entry.id) || 0;
    const countAtLevel = levelCounts.get(level) || 0;
    levelCounts.set(level, countAtLevel + 1);
    
    const x = (level / maxLevel) * 5 - 2.5;
    const y = (countAtLevel - 2) * 0.6;
    const isCritical = criticalPath.has(entry.id);
    
    return {
      ...entry,
      projectedX: x,
      projectedY: y,
      projectedZ: isCritical ? 0.5 : -0.2,
      isCriticalPath: isCritical,
      dependencyLevel: level
    };
  });
}

// Delivery: Roadmap/Chronos - timeline with milestones
function calculateDeliveryPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  const sorted = [...entries].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  const timeRange = {
    min: new Date(sorted[0].createdAt).getTime(),
    max: new Date(sorted[sorted.length - 1].createdAt).getTime()
  };
  const range = timeRange.max - timeRange.min || 1;
  
  // Identify milestones (entries with milestone-related tags)
  const milestoneKeywords = ['milestone', 'release', 'launch', 'done', 'complete', 'shipped'];
  
  return sorted.map((entry, index) => {
    const t = (new Date(entry.createdAt).getTime() - timeRange.min) / range;
    const isMilestone = entry.tags.some(tag => 
      milestoneKeywords.some(kw => tag.toLowerCase().includes(kw))
    );
    
    // Stack by season for vertical distribution
    const seasonY: Record<string, number> = {
      'POLLENS': -1, 'NOEMS': -0.5, 'POEMS': 0, 'TOTEMS': 0.5, 'ANTHEMS': 1
    };
    
    return {
      ...entry,
      projectedX: (t - 0.5) * 6,
      projectedY: seasonY[entry.season] || 0,
      projectedZ: isMilestone ? 0.8 : Math.sin(index * 0.5) * 0.2
    };
  });
}

// Adoption: Cycle Ring - recurring moments
function calculateAdoptionPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  const CYCLE_PHASES = ['training', 'comms', 'reinforcement', 'measurement'];
  
  // Assign entries to cycle phases based on tags
  return entries.map((entry, index) => {
    let phaseIndex = index % 4; // Default: distribute evenly
    
    // Try to match by tag
    for (let i = 0; i < CYCLE_PHASES.length; i++) {
      if (entry.tags.some(t => t.toLowerCase().includes(CYCLE_PHASES[i].substring(0, 4)))) {
        phaseIndex = i;
        break;
      }
    }
    
    // Season-based fallback
    const seasonPhase: Record<string, number> = {
      'POLLENS': 0, 'NOEMS': 1, 'POEMS': 2, 'TOTEMS': 3, 'ANTHEMS': 0
    };
    if (!entry.tags.length) {
      phaseIndex = seasonPhase[entry.season] ?? 0;
    }
    
    const baseAngle = (phaseIndex / CYCLE_PHASES.length) * Math.PI * 2;
    const entriesInPhase = entries.filter((e, i) => i % 4 === phaseIndex).length;
    const indexInPhase = entries.filter((e, i) => i < index && i % 4 === phaseIndex).length;
    const offsetAngle = (indexInPhase / Math.max(entriesInPhase, 1)) * (Math.PI / 4);
    
    const angle = baseAngle + offsetAngle;
    const radius = 2 + (indexInPhase % 3) * 0.3;
    
    return {
      ...entry,
      projectedX: Math.cos(angle) * radius,
      projectedY: Math.sin(angle) * radius,
      projectedZ: (indexInPhase % 2) * 0.3 - 0.15,
      ringAngle: angle,
      ringPhase: CYCLE_PHASES[phaseIndex]
    };
  });
}

// Sensemaking: Constellation/Kairos - center decision with evidence links
function calculateSensemakingPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  // Sort by relevance (recency + tag count + intensity)
  const scored = entries.map(entry => {
    const age = (now - new Date(entry.createdAt).getTime()) / dayMs;
    const recency = Math.max(0, 1 - age / 30);
    const tagWeight = Math.min(entry.tags.length / 5, 1);
    const score = recency * 0.6 + tagWeight * 0.4;
    return { entry, score };
  }).sort((a, b) => b.score - a.score);
  
  return scored.map(({ entry, score }, index) => {
    // Most relevant entries are near center
    const distance = (1 - score) * 3 + 0.5;
    
    // Spiral distribution
    const angle = (index / entries.length) * Math.PI * 6 + index * 0.5;
    
    // Top 3 get emphasized positioning (for "3 strongest links" requirement)
    const isTopLink = index < 3;
    
    return {
      ...entry,
      projectedX: Math.cos(angle) * distance,
      projectedY: Math.sin(angle) * distance,
      projectedZ: isTopLink ? 0.5 : (1 - score) * 1.5 - 0.75,
      isCriticalPath: isTopLink // Reuse for emphasis
    };
  });
}

export function useProjectionEngine(
  entries: ManifoldEntry[],
  mode: ProjectionMode
): UseProjectionEngineReturn {
  const projectedEntries = useMemo(() => {
    switch (mode) {
      case 'strategy':
        return calculateStrategyPositions(entries);
      case 'governance':
        return calculateGovernancePositions(entries);
      case 'operations':
        return calculateOperationsPositions(entries);
      case 'delivery':
        return calculateDeliveryPositions(entries);
      case 'adoption':
        return calculateAdoptionPositions(entries);
      case 'sensemaking':
        return calculateSensemakingPositions(entries);
      default:
        return calculateSensemakingPositions(entries);
    }
  }, [entries, mode]);

  return {
    projectedEntries,
    mode
  };
}
