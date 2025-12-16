import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TopologyViewMode } from '@/components/calm-magic/topologies/ViewModeSelector';

export interface MysteryZone {
  id: string;
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
}

const REVEALED_STORAGE_KEY = 'mystery-zones-revealed';
const FRAGMENTS_STORAGE_KEY = 'mystery-zones-fragments';
const SAVED_STORAGE_KEY = 'mystery-zones-saved';

// Calculate mystery zones based on view mode and journey data
function calculateZones(config: MysteryZoneConfig): MysteryZone[] {
  const { viewMode, visitedTiles, journeyPath, densityMap, currentUnlockedRing } = config;
  const zones: MysteryZone[] = [];
  
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

  // Find max density
  let maxDensity = 0;
  densityMap.forEach((density) => {
    if (density > maxDensity) {
      maxDensity = density;
    }
  });

  switch (viewMode) {
    case 'isometric': {
      // Gap zones for unexplored quadrants
      Object.entries(quadrantCoverage).forEach(([quadrant, count]) => {
        if (count < 4) {
          zones.push({
            id: `gap-${quadrant.toLowerCase()}`,
            zoneType: 'gap',
            label: getQuadrantLabel(quadrant),
            isRevealed: false
          });
        }
      });
      
      // Cluster zone for high density area
      if (maxDensity > 2) {
        zones.push({
          id: 'cluster-deep',
          zoneType: 'cluster',
          label: 'The Deep Well',
          isRevealed: false
        });
      }
      
      // Ring boundary zone
      if (currentUnlockedRing < 4) {
        zones.push({
          id: `boundary-ring${currentUnlockedRing + 1}`,
          zoneType: 'boundary',
          label: `The Threshold of ${getRingName(currentUnlockedRing + 1)}`,
          isRevealed: false
        });
      }
      break;
    }
    
    case 'spiral': {
      zones.push({
        id: 'spiral-center',
        zoneType: 'attractor',
        label: 'The Origin Point',
        isRevealed: false
      });
      
      for (let ring = 1; ring <= Math.min(currentUnlockedRing, 3); ring++) {
        zones.push({
          id: `spiral-ring-${ring}`,
          zoneType: 'boundary',
          label: `Ring ${ring} Crossing`,
          isRevealed: false
        });
      }
      
      if (coverage > 0.3) {
        zones.push({
          id: 'spiral-edge',
          zoneType: 'gap',
          label: 'The Expanding Edge',
          isRevealed: false
        });
      }
      break;
    }
    
    case 'diamond': {
      const transitions = [
        { id: 'discover-define', label: 'The Narrowing' },
        { id: 'define-develop', label: 'The Pivot Point' },
        { id: 'develop-deliver', label: 'The Opening' }
      ];
      
      transitions.forEach(t => {
        zones.push({
          id: `transition-${t.id}`,
          zoneType: 'transition',
          label: t.label,
          isRevealed: false
        });
      });
      break;
    }
    
    case 'flow': {
      zones.push({
        id: 'flow-sink-primary',
        zoneType: 'attractor',
        label: 'The Gathering Pool',
        isRevealed: false
      });
      
      zones.push({
        id: 'flow-source',
        zoneType: 'gap',
        label: 'The Spring',
        isRevealed: false
      });
      
      if (journeyPath.length > 5) {
        zones.push({
          id: 'flow-divergence',
          zoneType: 'connection',
          label: 'The Branching',
          isRevealed: false
        });
      }
      break;
    }
    
    case 'projection': {
      zones.push({
        id: 'projection-fold-1',
        zoneType: 'connection',
        label: 'The Hidden Seam',
        isRevealed: false
      });
      
      zones.push({
        id: 'projection-fold-2',
        zoneType: 'connection',
        label: 'The Edge Connection',
        isRevealed: false
      });
      break;
    }
    
    case 'cycles': {
      zones.push({
        id: 'cycle-incomplete',
        zoneType: 'gap',
        label: 'The Unfinished Loop',
        isRevealed: false
      });
      
      zones.push({
        id: 'cycle-intersection',
        zoneType: 'attractor',
        label: 'The Crossroads',
        isRevealed: false
      });
      break;
    }
    
    case 'coordinates': {
      zones.push({
        id: 'coord-origin',
        zoneType: 'attractor',
        label: 'The Center Point',
        isRevealed: false
      });
      
      zones.push({
        id: 'coord-boundary-x',
        zoneType: 'boundary',
        label: 'The Novelty Horizon',
        isRevealed: false
      });
      
      zones.push({
        id: 'coord-boundary-y',
        zoneType: 'boundary',
        label: 'The Sovereignty Threshold',
        isRevealed: false
      });
      break;
    }
    
    case 'charts': {
      zones.push({
        id: 'chart-uncharted',
        zoneType: 'gap',
        label: 'The Uncharted Region',
        isRevealed: false
      });
      
      if (maxDensity > 1) {
        zones.push({
          id: 'chart-dense',
          zoneType: 'cluster',
          label: 'The Dense Archive',
          isRevealed: false
        });
      }
      break;
    }
  }
  
  return zones.slice(0, 4);
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
      const stored = localStorage.getItem(REVEALED_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [fragments, setFragments] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(FRAGMENTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [savedZones, setSavedZones] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Calculate zones when config changes
  useEffect(() => {
    if (!config) return;
    
    const calculatedZones = calculateZones(config);
    
    // Hydrate with revealed state and fragments
    const zonesWithState = calculatedZones.map(zone => ({
      ...zone,
      isRevealed: revealedZones.has(zone.id),
      fragment: fragments[zone.id]
    }));
    
    setZones(zonesWithState);
  }, [config, revealedZones, fragments]);

  // Persist revealed zones
  useEffect(() => {
    localStorage.setItem(REVEALED_STORAGE_KEY, JSON.stringify([...revealedZones]));
  }, [revealedZones]);

  // Persist fragments
  useEffect(() => {
    localStorage.setItem(FRAGMENTS_STORAGE_KEY, JSON.stringify(fragments));
  }, [fragments]);

  // Persist saved zones
  useEffect(() => {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify([...savedZones]));
  }, [savedZones]);

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
      
      // Store fragment
      setFragments(prev => ({ ...prev, [zoneId]: fragment }));
      
      // Update zone state
      setZones(prev => prev.map(z => 
        z.id === zoneId 
          ? { ...z, fragment, isRevealed: true }
          : z
      ));
      
      // Track as revealed
      setRevealedZones(prev => new Set([...prev, zoneId]));
      
    } catch (err) {
      console.error('Failed to generate zone fragment:', err);
      const fallback = "The mist clears, but the mystery remains...";
      setFragments(prev => ({ ...prev, [zoneId]: fallback }));
      setZones(prev => prev.map(z => 
        z.id === zoneId 
          ? { ...z, fragment: fallback, isRevealed: true }
          : z
      ));
      setRevealedZones(prev => new Set([...prev, zoneId]));
    } finally {
      setLoadingZoneId(null);
    }
  }, [zones, config, loadingZoneId]);

  const markZoneAsSaved = useCallback((zoneId: string) => {
    setSavedZones(prev => new Set([...prev, zoneId]));
  }, []);

  const resetRevealedZones = useCallback(() => {
    setRevealedZones(new Set());
    setFragments({});
    setSavedZones(new Set());
    localStorage.removeItem(REVEALED_STORAGE_KEY);
    localStorage.removeItem(FRAGMENTS_STORAGE_KEY);
    localStorage.removeItem(SAVED_STORAGE_KEY);
  }, []);

  return {
    zones,
    loadingZoneId,
    revealZone,
    savedZones,
    markZoneAsSaved,
    resetRevealedZones,
    revealedCount: revealedZones.size
  };
}
