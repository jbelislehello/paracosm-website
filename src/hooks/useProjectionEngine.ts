import { useMemo } from 'react';
import { ManifoldEntry } from '@/hooks/useManifoldData';

export type ProjectionMode = 'chronos' | 'kairos' | 'mythos' | 'causality';

interface ProjectedEntry extends ManifoldEntry {
  projectedX: number;
  projectedY: number;
  projectedZ: number;
}

interface UseProjectionEngineReturn {
  projectedEntries: ProjectedEntry[];
  mode: ProjectionMode;
}

// Chronos: Timeline-based layout (sequence by creation date)
function calculateChronosPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  // Sort by creation date
  const sorted = [...entries].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  const timeRange = {
    min: new Date(sorted[0].createdAt).getTime(),
    max: new Date(sorted[sorted.length - 1].createdAt).getTime()
  };
  const range = timeRange.max - timeRange.min || 1;
  
  return sorted.map((entry, index) => {
    const t = (new Date(entry.createdAt).getTime() - timeRange.min) / range;
    
    // Create a flowing timeline with slight vertical offset per season
    const seasonOffset = {
      'POLLENS': 0,
      'NOEMS': 0.5,
      'POEMS': 1,
      'TOTEMS': 1.5,
      'ANTHEMS': 2
    };
    
    return {
      ...entry,
      projectedX: (t - 0.5) * 6, // Spread along X axis (-3 to 3)
      projectedY: (seasonOffset[entry.season] || 0) - 1, // Stack by season
      projectedZ: Math.sin(index * 0.3) * 0.3 // Slight wave for depth
    };
  });
}

// Kairos: Now-gravity layout (unresolved + high intensity → center)
function calculateKairosPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  return entries.map((entry, index) => {
    const age = (now - new Date(entry.createdAt).getTime()) / dayMs;
    const recency = Math.max(0, 1 - age / 30); // Decay over 30 days
    
    // Calculate "gravity" toward center based on:
    // - Recency (newer = closer)
    // - Tags count (more tags = more relevant = closer)
    const tagWeight = Math.min(entry.tags.length / 5, 1);
    const gravity = recency * 0.6 + tagWeight * 0.4;
    
    // Distance from center (inverse of gravity)
    const distance = (1 - gravity) * 3 + 0.5;
    
    // Distribute in a spiral pattern around center
    const angle = (index / entries.length) * Math.PI * 6 + index * 0.5;
    
    return {
      ...entry,
      projectedX: Math.cos(angle) * distance,
      projectedY: Math.sin(angle) * distance,
      projectedZ: (1 - gravity) * 1.5 - 0.75 // High gravity = closer to z=0
    };
  });
}

// Mythos: Spiral by recurrence/pattern
function calculateMythosPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  // Group entries by tags to find recurring themes
  const tagFrequency = new Map<string, number>();
  entries.forEach(entry => {
    entry.tags.forEach(tag => {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    });
  });
  
  // Calculate "recurrence score" for each entry
  const entriesWithRecurrence = entries.map(entry => {
    const recurrence = entry.tags.reduce((sum, tag) => 
      sum + (tagFrequency.get(tag) || 0), 0
    );
    return { entry, recurrence };
  });
  
  // Sort by recurrence (most recurring = center of spiral)
  const sorted = entriesWithRecurrence.sort((a, b) => b.recurrence - a.recurrence);
  const maxRecurrence = Math.max(...sorted.map(e => e.recurrence), 1);
  
  return sorted.map(({ entry, recurrence }, index) => {
    // Spiral parameters
    const t = index / entries.length;
    const spiralRadius = 0.5 + t * 2.5; // Expand outward
    const spiralAngle = t * Math.PI * 8; // Multiple rotations
    const heightFactor = recurrence / maxRecurrence;
    
    return {
      ...entry,
      projectedX: Math.cos(spiralAngle) * spiralRadius,
      projectedY: Math.sin(spiralAngle) * spiralRadius,
      projectedZ: heightFactor * 2 - 1 // High recurrence = higher
    };
  });
}

// Causality: Force-directed graph by dependencies (shared tags)
function calculateCausalityPositions(entries: ManifoldEntry[]): ProjectedEntry[] {
  if (entries.length === 0) return [];
  
  // Initialize positions randomly
  const positions = entries.map((_, i) => ({
    x: (Math.random() - 0.5) * 4,
    y: (Math.random() - 0.5) * 4,
    z: (Math.random() - 0.5) * 2
  }));
  
  // Calculate connections (shared tags)
  const connections: Array<{ i: number; j: number; strength: number }> = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const shared = entries[i].tags.filter(t => entries[j].tags.includes(t)).length;
      if (shared > 0) {
        connections.push({ i, j, strength: shared });
      }
    }
  }
  
  // Simple force-directed simulation (few iterations for performance)
  const iterations = 50;
  const repulsion = 0.5;
  const attraction = 0.1;
  
  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion between all nodes
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dz = positions[j].z - positions[i].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;
        const force = repulsion / (dist * dist);
        
        positions[i].x -= (dx / dist) * force;
        positions[i].y -= (dy / dist) * force;
        positions[i].z -= (dz / dist) * force * 0.5;
        positions[j].x += (dx / dist) * force;
        positions[j].y += (dy / dist) * force;
        positions[j].z += (dz / dist) * force * 0.5;
      }
    }
    
    // Attraction for connected nodes
    for (const conn of connections) {
      const { i, j, strength } = conn;
      const dx = positions[j].x - positions[i].x;
      const dy = positions[j].y - positions[i].y;
      const dz = positions[j].z - positions[i].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;
      const force = attraction * strength;
      
      positions[i].x += (dx / dist) * force;
      positions[i].y += (dy / dist) * force;
      positions[i].z += (dz / dist) * force * 0.5;
      positions[j].x -= (dx / dist) * force;
      positions[j].y -= (dy / dist) * force;
      positions[j].z -= (dz / dist) * force * 0.5;
    }
  }
  
  // Normalize positions to fit in view
  const maxDist = Math.max(
    ...positions.map(p => Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z))
  ) || 1;
  const scale = 3 / maxDist;
  
  return entries.map((entry, i) => ({
    ...entry,
    projectedX: positions[i].x * scale,
    projectedY: positions[i].y * scale,
    projectedZ: positions[i].z * scale
  }));
}

export function useProjectionEngine(
  entries: ManifoldEntry[],
  mode: ProjectionMode
): UseProjectionEngineReturn {
  const projectedEntries = useMemo(() => {
    switch (mode) {
      case 'chronos':
        return calculateChronosPositions(entries);
      case 'kairos':
        return calculateKairosPositions(entries);
      case 'mythos':
        return calculateMythosPositions(entries);
      case 'causality':
        return calculateCausalityPositions(entries);
      default:
        return calculateChronosPositions(entries);
    }
  }, [entries, mode]);

  return {
    projectedEntries,
    mode
  };
}
