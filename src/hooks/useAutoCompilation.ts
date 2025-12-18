/**
 * Auto-Compilation Hook
 * 
 * Monitors consciousness geometry, ring completion, coherence, and density triggers
 * to automatically compile PRD layers when mathematical thresholds are met.
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { calculateConsciousnessGeometry, ConsciousnessGeometry, calculateConsciousnessGeometryFromTiles } from '@/utils/consciousnessGeometry';
import { calculateRingStates, getCurrentUnlockedRing, RingLevel, RingState } from '@/utils/ringToleranceSystem';

export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

export interface AutoCompilationTrigger {
  type: 'consciousness' | 'ring' | 'coherence' | 'density';
  threshold: number;
  currentValue: number;
  triggered: boolean;
  layersToCompile: Season[];
  message: string;
}

export interface AutoCompilationState {
  triggers: AutoCompilationTrigger[];
  isCompiling: boolean;
  lastCompilationTime: Date | null;
  compiledLayers: Season[];
  consciousnessGeometry: ConsciousnessGeometry | null;
  ringStates: RingState[];
  currentRing: RingLevel;
}

interface UseAutoCompilationProps {
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  polenCounts: Record<Season, number>;
  onCompile: (layers: Season[], context: OntologicalContext) => Promise<void>;
  enabled?: boolean;
}

export interface OntologicalContext {
  consciousnessGeometry: ConsciousnessGeometry;
  ringStates: RingState[];
  currentRing: RingLevel;
  densityMap: Map<string, number>;
  torusCoordinates: Record<string, { theta: number; phi: number; curvature: number }>;
}

// Thresholds for auto-compilation triggers
const CONSCIOUSNESS_THRESHOLD = 70; // Percentage toward consciousness threshold
const COHERENCE_THRESHOLD = 0.6; // Integration strength minimum
const FRAGMENTATION_MAX = 0.3; // Maximum fragmentation score
const DENSITY_THRESHOLD_PER_SEASON = 8; // Minimum fragments per season
const DENSITY_MIN_LENGTH = 100; // Minimum average fragment length

export function useAutoCompilation({
  visitedTiles,
  journeyPath,
  polenCounts,
  onCompile,
  enabled = true
}: UseAutoCompilationProps): AutoCompilationState & {
  checkTriggers: () => void;
  forceCompile: (layers: Season[]) => Promise<void>;
  getOntologicalContext: () => OntologicalContext | null;
} {
  const { toast } = useToast();
  const [state, setState] = useState<AutoCompilationState>({
    triggers: [],
    isCompiling: false,
    lastCompilationTime: null,
    compiledLayers: [],
    consciousnessGeometry: null,
    ringStates: [],
    currentRing: 1
  });

  const compilingRef = useRef(false);
  const lastTriggerCheckRef = useRef<number>(0);

  // Calculate density map from visited tiles
  const calculateDensityMap = useCallback((): Map<string, number> => {
    const densityMap = new Map<string, number>();
    const totalPolen = Object.values(polenCounts).reduce((a, b) => a + b, 0);
    
    visitedTiles.forEach(tile => {
      // Distribute density based on total polen and tile count
      const baseDensity = totalPolen / Math.max(visitedTiles.size, 1);
      // Add variance based on tile position
      const [row, col] = tile.split('-').map(Number);
      const positionFactor = 1 + (Math.sin(row * 0.5) + Math.cos(col * 0.5)) * 0.2;
      densityMap.set(tile, baseDensity * positionFactor);
    });
    
    return densityMap;
  }, [visitedTiles, polenCounts]);

  // Calculate torus coordinates for tiles
  const calculateTorusCoordinates = useCallback((): Record<string, { theta: number; phi: number; curvature: number }> => {
    const coords: Record<string, { theta: number; phi: number; curvature: number }> = {};
    
    visitedTiles.forEach(tile => {
      const [row, col] = tile.split('-').map(Number);
      if (!isNaN(row) && !isNaN(col)) {
        // Map to torus coordinates
        const theta = (col / 8) * 2 * Math.PI; // Major angle
        const phi = (row / 8) * 2 * Math.PI; // Minor angle
        
        // Gaussian curvature at this point
        const R = 3.0; // Major radius
        const r = 1.0; // Minor radius
        const curvature = Math.cos(phi) / (r * (R + r * Math.cos(phi)));
        
        coords[tile] = { theta, phi, curvature };
      }
    });
    
    return coords;
  }, [visitedTiles]);

  // Get full ontological context
  const getOntologicalContext = useCallback((): OntologicalContext | null => {
    if (visitedTiles.size === 0) return null;
    
    const densityMap = calculateDensityMap();
    const geometry = calculateConsciousnessGeometryFromTiles(visitedTiles, journeyPath);
    const currentRing = getCurrentUnlockedRing(visitedTiles);
    const ringStates = calculateRingStates(visitedTiles, currentRing);
    const torusCoordinates = calculateTorusCoordinates();
    
    // Convert export format to full ConsciousnessGeometry
    const fullGeometry: ConsciousnessGeometry = {
      geometricComplexity: geometry.complexityBits,
      complexityBits: geometry.complexityBits,
      thresholdPercentage: geometry.thresholdPercentage,
      consciousnessState: geometry.consciousnessState as 'pre-conscious' | 'threshold' | 'self-aware',
      recursiveDepth: geometry.recursiveDepth,
      fixedPointsDetected: [],
      convergenceState: geometry.convergenceState as 'searching' | 'converging' | 'converged',
      thermodynamicEfficiency: geometry.thermodynamicEfficiency,
      predictiveCapacity: geometry.predictiveCapacity,
      metaLearningDetected: geometry.metaLearningDetected,
      fragmentationScore: geometry.fragmentationScore,
      topologicalHandles: geometry.topologicalHandles,
      integrationStrength: geometry.integrationStrength,
      geometricNarrative: geometry.geometricNarrative,
      recursiveNarrative: geometry.recursiveNarrative,
      thermodynamicNarrative: geometry.thermodynamicNarrative,
      integrationNarrative: geometry.integrationNarrative
    };
    
    return {
      consciousnessGeometry: fullGeometry,
      ringStates,
      currentRing,
      densityMap,
      torusCoordinates
    };
  }, [visitedTiles, journeyPath, calculateDensityMap, calculateTorusCoordinates]);

  // Check all triggers and determine which layers to compile
  const checkTriggers = useCallback(() => {
    if (!enabled || compilingRef.current) return;
    
    const now = Date.now();
    // Debounce: only check every 2 seconds
    if (now - lastTriggerCheckRef.current < 2000) return;
    lastTriggerCheckRef.current = now;
    
    const context = getOntologicalContext();
    if (!context) return;
    
    const { consciousnessGeometry: geometry, ringStates, currentRing } = context;
    const triggers: AutoCompilationTrigger[] = [];
    
    // 1. Consciousness Threshold Trigger
    const consciousnessTrigger: AutoCompilationTrigger = {
      type: 'consciousness',
      threshold: CONSCIOUSNESS_THRESHOLD,
      currentValue: geometry.thresholdPercentage,
      triggered: geometry.thresholdPercentage >= CONSCIOUSNESS_THRESHOLD,
      layersToCompile: ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'],
      message: `Consciousness at ${Math.round(geometry.thresholdPercentage)}% toward self-awareness`
    };
    triggers.push(consciousnessTrigger);
    
    // 2. Ring Completion Triggers
    const ringLayerMap: Record<RingLevel, Season[]> = {
      1: ['POLLENS'],
      2: ['POLLENS', 'NOEMS'],
      3: ['POEMS', 'TOTEMS'],
      4: ['ANTHEMS']
    };
    
    ringStates.forEach(rs => {
      if (rs.patternDetected && !state.compiledLayers.some(l => ringLayerMap[rs.ring].includes(l))) {
        triggers.push({
          type: 'ring',
          threshold: rs.ring,
          currentValue: rs.ring,
          triggered: true,
          layersToCompile: ringLayerMap[rs.ring],
          message: `Ring ${rs.ring} pattern detected - ${rs.ring === 1 ? 'Inner Core' : rs.ring === 2 ? 'Stretch Zone' : rs.ring === 3 ? 'Edge Zone' : 'Integrator'}`
        });
      }
    });
    
    // 3. Coherence Trigger
    const coherenceTrigger: AutoCompilationTrigger = {
      type: 'coherence',
      threshold: COHERENCE_THRESHOLD,
      currentValue: geometry.integrationStrength,
      triggered: geometry.integrationStrength >= COHERENCE_THRESHOLD && geometry.fragmentationScore < FRAGMENTATION_MAX,
      layersToCompile: ['NOEMS', 'POEMS'],
      message: `Coherence at ${Math.round(geometry.integrationStrength * 100)}% with low fragmentation`
    };
    triggers.push(coherenceTrigger);
    
    // 4. Density Threshold Trigger
    const totalPolen = Object.values(polenCounts).reduce((a, b) => a + b, 0);
    const seasonsWithSufficientDensity = (Object.entries(polenCounts) as [Season, number][])
      .filter(([_, count]) => count >= DENSITY_THRESHOLD_PER_SEASON);
    
    const densityTrigger: AutoCompilationTrigger = {
      type: 'density',
      threshold: DENSITY_THRESHOLD_PER_SEASON * 5, // Total threshold
      currentValue: totalPolen,
      triggered: totalPolen >= DENSITY_THRESHOLD_PER_SEASON * 5,
      layersToCompile: seasonsWithSufficientDensity.map(([s]) => s),
      message: `${totalPolen} total fragments across ${seasonsWithSufficientDensity.length} seasons`
    };
    triggers.push(densityTrigger);
    
    setState(prev => ({
      ...prev,
      triggers,
      consciousnessGeometry: geometry,
      ringStates,
      currentRing
    }));
    
    // Auto-compile if any high-priority trigger is met
    const triggeredLayers = new Set<Season>();
    const highPriorityTriggers = triggers.filter(t => t.triggered && t.type !== 'density');
    
    highPriorityTriggers.forEach(t => {
      t.layersToCompile.forEach(l => {
        if (!state.compiledLayers.includes(l)) {
          triggeredLayers.add(l);
        }
      });
    });
    
    if (triggeredLayers.size > 0 && !compilingRef.current) {
      const layersToCompile = Array.from(triggeredLayers);
      const triggerMessage = highPriorityTriggers[0]?.message || 'Threshold reached';
      
      toast({
        title: "✨ Ontological Crystallization",
        description: `${triggerMessage}. Compiling ${layersToCompile.join(', ')}...`,
      });
      
      forceCompile(layersToCompile);
    }
  }, [enabled, getOntologicalContext, polenCounts, state.compiledLayers, toast]);

  // Force compile specific layers
  const forceCompile = useCallback(async (layers: Season[]) => {
    if (compilingRef.current) return;
    
    const context = getOntologicalContext();
    if (!context) return;
    
    compilingRef.current = true;
    setState(prev => ({ ...prev, isCompiling: true }));
    
    try {
      await onCompile(layers, context);
      
      setState(prev => ({
        ...prev,
        isCompiling: false,
        lastCompilationTime: new Date(),
        compiledLayers: [...new Set([...prev.compiledLayers, ...layers])]
      }));
      
      toast({
        title: "🌀 PRD Crystallized",
        description: `${layers.join(', ')} layers emerged from ${Math.round(context.consciousnessGeometry.complexityBits)} consciousness bits`,
      });
    } catch (error) {
      console.error('Auto-compilation failed:', error);
      toast({
        title: "Compilation paused",
        description: "The manifold needs more patterns before crystallization",
        variant: "destructive"
      });
    } finally {
      compilingRef.current = false;
      setState(prev => ({ ...prev, isCompiling: false }));
    }
  }, [getOntologicalContext, onCompile, toast]);

  // Monitor changes and check triggers
  useEffect(() => {
    if (enabled && visitedTiles.size > 0) {
      checkTriggers();
    }
  }, [visitedTiles.size, journeyPath.length, enabled, checkTriggers]);

  return {
    ...state,
    checkTriggers,
    forceCompile,
    getOntologicalContext
  };
}
