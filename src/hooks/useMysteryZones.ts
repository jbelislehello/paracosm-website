import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TopologyViewMode } from '@/components/calm-magic/topologies/ViewModeSelector';

export interface MysteryZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  zoneType: 'gap' | 'cluster' | 'boundary' | 'attractor' | 'connection' | 'transition';
  label: string;
  fragment?: string;
  isRevealed: boolean;
}

export interface MysteryZoneConfig {
  viewMode: TopologyViewMode;
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  densityMap: Map<string, number>;
  currentUnlockedRing: number;
  containerWidth: number;
  containerHeight: number;
}

const STORAGE_KEY = 'mystery-zones-revealed';

// Calculate mystery zones based on view mode and journey data
function calculateZones(config: MysteryZoneConfig): MysteryZone[] {
  const { viewMode, visitedTiles, journeyPath, densityMap, currentUnlockedRing, containerWidth, containerHeight } = config;
  const zones: MysteryZone[] = [];
  
  const cx = containerWidth / 2;
  const cy = containerHeight / 2;
  const scale = Math.min(containerWidth, containerHeight) / 2;
  
  // Calculate coverage stats
  const totalTiles = 64;
  const coverage = visitedTiles.size / totalTiles;
  
  // Find quadrant coverage
  const quadrantCoverage = {
    SN: 0, IN: 0, IM: 0, SM: 0
  };
  visitedTiles.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    if (r < 4 && c < 4) quadrantCoverage.SN++;
    else if (r < 4 && c >= 4) quadrantCoverage.IN++;
    else if (r >= 4 && c < 4) quadrantCoverage.SM++;
    else quadrantCoverage.IM++;
  });

  // Find max density tile
  let maxDensity = 0;
  let maxDensityKey = '0,0';
  densityMap.forEach((density, key) => {
    if (density > maxDensity) {
      maxDensity = density;
      maxDensityKey = key;
    }
  });

  switch (viewMode) {
    case 'isometric': {
      // Gap zones for unexplored quadrants
      Object.entries(quadrantCoverage).forEach(([quadrant, count]) => {
        if (count < 4) { // Less than 25% of quadrant visited
          const qPos = getQuadrantPosition(quadrant, cx, cy, scale * 0.5);
          zones.push({
            id: `gap-${quadrant.toLowerCase()}`,
            x: qPos.x,
            y: qPos.y,
            radius: 35,
            zoneType: 'gap',
            label: getQuadrantLabel(quadrant),
            isRevealed: false
          });
        }
      });
      
      // Cluster zone for high density area
      if (maxDensity > 2) {
        const [dr, dc] = maxDensityKey.split(',').map(Number);
        zones.push({
          id: 'cluster-deep',
          x: cx + (dc - 3.5) * (scale * 0.12),
          y: cy + (dr - 3.5) * (scale * 0.12),
          radius: 30,
          zoneType: 'cluster',
          label: 'The Deep Well',
          isRevealed: false
        });
      }
      
      // Ring boundary zone
      if (currentUnlockedRing < 4) {
        zones.push({
          id: `boundary-ring${currentUnlockedRing + 1}`,
          x: cx + scale * 0.35,
          y: cy - scale * 0.1,
          radius: 40,
          zoneType: 'boundary',
          label: `The Threshold of ${getRingName(currentUnlockedRing + 1)}`,
          isRevealed: false
        });
      }
      break;
    }
    
    case 'spiral': {
      // Center zone
      zones.push({
        id: 'spiral-center',
        x: cx,
        y: cy,
        radius: 35,
        zoneType: 'attractor',
        label: 'The Origin Point',
        isRevealed: false
      });
      
      // Ring transitions
      for (let ring = 1; ring <= Math.min(currentUnlockedRing, 3); ring++) {
        zones.push({
          id: `spiral-ring-${ring}`,
          x: cx + Math.cos(ring * 1.2) * (scale * ring * 0.2),
          y: cy + Math.sin(ring * 1.2) * (scale * ring * 0.2),
          radius: 30,
          zoneType: 'boundary',
          label: `Ring ${ring} Crossing`,
          isRevealed: false
        });
      }
      
      // Edge zone
      if (coverage > 0.3) {
        zones.push({
          id: 'spiral-edge',
          x: cx + scale * 0.7,
          y: cy + scale * 0.3,
          radius: 35,
          zoneType: 'gap',
          label: 'The Expanding Edge',
          isRevealed: false
        });
      }
      break;
    }
    
    case 'diamond': {
      // Phase transition zones
      const transitions = [
        { id: 'discover-define', x: cx - scale * 0.25, y: cy - scale * 0.1, label: 'The Narrowing' },
        { id: 'define-develop', x: cx, y: cy + scale * 0.15, label: 'The Pivot Point' },
        { id: 'develop-deliver', x: cx + scale * 0.25, y: cy - scale * 0.1, label: 'The Opening' }
      ];
      
      transitions.forEach(t => {
        zones.push({
          id: `transition-${t.id}`,
          x: t.x,
          y: t.y,
          radius: 35,
          zoneType: 'transition',
          label: t.label,
          isRevealed: false
        });
      });
      break;
    }
    
    case 'flow': {
      // Attractor zones (sinks)
      zones.push({
        id: 'flow-sink-primary',
        x: cx + scale * 0.3,
        y: cy - scale * 0.2,
        radius: 40,
        zoneType: 'attractor',
        label: 'The Gathering Pool',
        isRevealed: false
      });
      
      // Source zone
      zones.push({
        id: 'flow-source',
        x: cx - scale * 0.4,
        y: cy + scale * 0.3,
        radius: 35,
        zoneType: 'gap',
        label: 'The Spring',
        isRevealed: false
      });
      
      // Divergence point
      if (journeyPath.length > 5) {
        zones.push({
          id: 'flow-divergence',
          x: cx,
          y: cy - scale * 0.35,
          radius: 30,
          zoneType: 'connection',
          label: 'The Branching',
          isRevealed: false
        });
      }
      break;
    }
    
    case 'projection': {
      // Hidden neighbor zones
      zones.push({
        id: 'projection-fold-1',
        x: cx - scale * 0.5,
        y: cy,
        radius: 35,
        zoneType: 'connection',
        label: 'The Hidden Seam',
        isRevealed: false
      });
      
      zones.push({
        id: 'projection-fold-2',
        x: cx + scale * 0.5,
        y: cy,
        radius: 35,
        zoneType: 'connection',
        label: 'The Edge Connection',
        isRevealed: false
      });
      break;
    }
    
    case 'cycles': {
      // Incomplete loop zones
      zones.push({
        id: 'cycle-incomplete',
        x: cx + scale * 0.2,
        y: cy - scale * 0.3,
        radius: 40,
        zoneType: 'gap',
        label: 'The Unfinished Loop',
        isRevealed: false
      });
      
      // Cycle intersection
      zones.push({
        id: 'cycle-intersection',
        x: cx,
        y: cy,
        radius: 35,
        zoneType: 'attractor',
        label: 'The Crossroads',
        isRevealed: false
      });
      break;
    }
    
    case 'coordinates': {
      // Quadrant boundary zones
      zones.push({
        id: 'coord-origin',
        x: cx,
        y: cy,
        radius: 40,
        zoneType: 'attractor',
        label: 'The Center Point',
        isRevealed: false
      });
      
      zones.push({
        id: 'coord-boundary-x',
        x: cx + scale * 0.6,
        y: cy,
        radius: 30,
        zoneType: 'boundary',
        label: 'The Novelty Horizon',
        isRevealed: false
      });
      
      zones.push({
        id: 'coord-boundary-y',
        x: cx,
        y: cy - scale * 0.5,
        radius: 30,
        zoneType: 'boundary',
        label: 'The Sovereignty Threshold',
        isRevealed: false
      });
      break;
    }
    
    case 'charts': {
      // Uncharted region
      zones.push({
        id: 'chart-uncharted',
        x: cx + scale * 0.4,
        y: cy + scale * 0.3,
        radius: 40,
        zoneType: 'gap',
        label: 'The Uncharted Region',
        isRevealed: false
      });
      
      // Dense chart area
      if (maxDensity > 1) {
        zones.push({
          id: 'chart-dense',
          x: cx - scale * 0.2,
          y: cy - scale * 0.2,
          radius: 35,
          zoneType: 'cluster',
          label: 'The Dense Archive',
          isRevealed: false
        });
      }
      break;
    }
  }
  
  // Limit to 4 zones max per view
  return zones.slice(0, 4);
}

function getQuadrantPosition(quadrant: string, cx: number, cy: number, offset: number) {
  switch (quadrant) {
    case 'SN': return { x: cx - offset, y: cy - offset };
    case 'IN': return { x: cx + offset, y: cy - offset };
    case 'SM': return { x: cx - offset, y: cy + offset };
    case 'IM': return { x: cx + offset, y: cy + offset };
    default: return { x: cx, y: cy };
  }
}

function getQuadrantLabel(quadrant: string) {
  switch (quadrant) {
    case 'SN': return 'The Silent Northwest';
    case 'IN': return 'The Hidden Northeast';
    case 'SM': return 'The Deep Southwest';
    case 'IM': return 'The Distant Southeast';
    default: return 'The Unknown';
  }
}

function getRingName(ring: number) {
  switch (ring) {
    case 1: return 'Calm';
    case 2: return 'Stretch';
    case 3: return 'Edge';
    case 4: return 'Freedom';
    default: return 'Beyond';
  }
}

export function useMysteryZones(config: MysteryZoneConfig | null) {
  const [zones, setZones] = useState<MysteryZone[]>([]);
  const [loadingZoneId, setLoadingZoneId] = useState<string | null>(null);
  const [revealedZones, setRevealedZones] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Calculate zones when config changes
  useEffect(() => {
    if (!config || config.containerWidth === 0) return;
    
    const calculatedZones = calculateZones(config);
    
    // Mark previously revealed zones
    const zonesWithRevealState = calculatedZones.map(zone => ({
      ...zone,
      isRevealed: revealedZones.has(zone.id)
    }));
    
    setZones(zonesWithRevealState);
  }, [config, revealedZones]);

  // Persist revealed zones
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...revealedZones]));
  }, [revealedZones]);

  const revealZone = useCallback(async (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone || zone.isRevealed || loadingZoneId) return;
    
    setLoadingZoneId(zoneId);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-zone-fragment', {
        body: {
          zoneId: zone.id,
          zoneType: zone.zoneType,
          zoneLabel: zone.label,
          viewMode: config?.viewMode,
          coverage: config?.visitedTiles ? config.visitedTiles.size / 64 : 0,
          journeyLength: config?.journeyPath?.length || 0
        }
      });
      
      if (error) throw error;
      
      const fragment = data?.fragment || "A mystery awaits discovery here...";
      
      // Update zone with fragment
      setZones(prev => prev.map(z => 
        z.id === zoneId 
          ? { ...z, fragment, isRevealed: true }
          : z
      ));
      
      // Track as revealed
      setRevealedZones(prev => new Set([...prev, zoneId]));
      
    } catch (err) {
      console.error('Failed to generate zone fragment:', err);
      // Still reveal with fallback
      setZones(prev => prev.map(z => 
        z.id === zoneId 
          ? { ...z, fragment: "The mist clears, but the mystery remains...", isRevealed: true }
          : z
      ));
      setRevealedZones(prev => new Set([...prev, zoneId]));
    } finally {
      setLoadingZoneId(null);
    }
  }, [zones, config, loadingZoneId]);

  const resetRevealedZones = useCallback(() => {
    setRevealedZones(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    zones,
    loadingZoneId,
    revealZone,
    resetRevealedZones,
    revealedCount: revealedZones.size
  };
}
