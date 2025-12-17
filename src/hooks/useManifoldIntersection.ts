// Hook for manifold intersection detection and trajectory prediction
import { useMemo, useCallback } from 'react';
import { QuadrantPosition, TrajectoryEvent } from '@/types/trajectory';
import { RingLevel, RingState, RING_QUADRANT_TENDENCY } from '@/utils/ringToleranceSystem';
import {
  calculateTrajectoryVelocity,
  extrapolatePath,
  findManifoldIntersection,
  generateConvergenceSpiralPoints,
  shadowChartProjection,
  higherSelfChartProjection,
  boundaryChartProjection,
  ManifoldMetrics,
  calculateManifoldMetrics,
  EllipseDefinition,
  generatePositionalityEllipses
} from '@/utils/manifoldChartMath';

export interface ManifoldIntersectionResult {
  willIntersect: boolean;
  intersectionPoint: QuadrantPosition | null;
  timeToIntersection: number; // steps until intersection
  confidence: number; // 0-1 confidence in prediction
  convergenceSpiral: QuadrantPosition[];
  shadowManifold: {
    chartPosition: { u: number; v: number };
    curvature: number;
    deformation: number;
  };
  higherSelfManifold: {
    chartPosition: { u: number; v: number };
    potential: number;
    attractionRadius: number;
  };
  boundaryZone: {
    points: QuadrantPosition[];
    tangents: Array<{ x: number; y: number }>;
    isActive: boolean;
  };
  trajectoryPrediction: QuadrantPosition[];
}

export interface PositionalityState {
  currentRing: RingLevel;
  ellipses: EllipseDefinition[];
  ringInfluences: Array<{
    ring: RingLevel;
    pull: QuadrantPosition;
    strength: number;
  }>;
  manifoldMetrics: ManifoldMetrics;
}

interface UseManifoldIntersectionProps {
  shadowPosition: QuadrantPosition | null;
  higherSelfPosition: QuadrantPosition | null;
  trajectoryLog: TrajectoryEvent[];
  ringStates: RingState[];
  visitedTiles: Set<string>;
  weavingConnections: Array<{
    sourceRow: number;
    sourceCol: number;
    targetRow: number;
    targetCol: number;
    strength: number;
  }>;
}

export function useManifoldIntersection({
  shadowPosition,
  higherSelfPosition,
  trajectoryLog,
  ringStates,
  visitedTiles,
  weavingConnections
}: UseManifoldIntersectionProps) {
  
  // Convert trajectory log to position history
  const trajectoryHistory = useMemo(() => {
    return trajectoryLog
      .filter(e => e.shadow_position)
      .map(e => ({
        position: e.shadow_position,
        timestamp: new Date(e.timestamp).getTime()
      }));
  }, [trajectoryLog]);

  // Calculate current velocity from trajectory
  const velocity = useMemo(() => {
    if (trajectoryHistory.length < 2) return { x: 0, y: 0 };
    return calculateTrajectoryVelocity(trajectoryHistory);
  }, [trajectoryHistory]);

  // Shadow manifold chart projection
  const shadowManifold = useMemo(() => {
    if (!shadowPosition) {
      return { chartPosition: { u: 0, v: 0 }, curvature: 0, deformation: 0.5 };
    }
    
    // Deformation based on velocity magnitude (more movement = more deformed)
    const velocityMag = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    const deformation = 0.3 + velocityMag * 2;
    
    const projection = shadowChartProjection(shadowPosition, deformation);
    return {
      chartPosition: { u: projection.u, v: projection.v },
      curvature: projection.curvature,
      deformation
    };
  }, [shadowPosition, velocity]);

  // Higher Self manifold chart projection
  const higherSelfManifold = useMemo(() => {
    if (!higherSelfPosition) {
      return { chartPosition: { u: 0, v: 0 }, potential: 0, attractionRadius: 0.5 };
    }
    
    // Attraction radius based on ring progress (more progress = larger basin)
    const totalProgress = ringStates.reduce((sum, r) => sum + r.progress, 0) / 400;
    const attractionRadius = 0.3 + totalProgress * 0.5;
    
    const projection = higherSelfChartProjection(higherSelfPosition, attractionRadius);
    return {
      chartPosition: { u: projection.u, v: projection.v },
      potential: projection.potential,
      attractionRadius
    };
  }, [higherSelfPosition, ringStates]);

  // Calculate trajectory prediction and intersection
  const intersectionResult = useMemo((): ManifoldIntersectionResult => {
    const defaultResult: ManifoldIntersectionResult = {
      willIntersect: false,
      intersectionPoint: null,
      timeToIntersection: -1,
      confidence: 0,
      convergenceSpiral: [],
      shadowManifold,
      higherSelfManifold,
      boundaryZone: { points: [], tangents: [], isActive: false },
      trajectoryPrediction: []
    };

    if (!shadowPosition) return defaultResult;

    // Extrapolate future trajectory (20 steps)
    const predictedPath = extrapolatePath(shadowPosition, velocity, 20, 0.85);
    
    let intersection = null;
    if (higherSelfPosition) {
      intersection = findManifoldIntersection(
        predictedPath,
        higherSelfPosition,
        higherSelfManifold.attractionRadius
      );
    }

    // Generate convergence spiral if intersection predicted
    let convergenceSpiral: QuadrantPosition[] = [];
    if (intersection && higherSelfPosition) {
      convergenceSpiral = generateConvergenceSpiralPoints(
        shadowPosition,
        intersection.point,
        1.5,
        30
      );
    }

    // Calculate boundary zone between manifolds
    const boundaryPoints: QuadrantPosition[] = [];
    const boundaryTangents: Array<{ x: number; y: number }> = [];
    
    if (shadowPosition && higherSelfPosition) {
      for (let t = 0; t <= 1; t += 0.1) {
        const boundary = boundaryChartProjection(shadowPosition, higherSelfPosition, t);
        boundaryPoints.push(boundary.position);
        boundaryTangents.push(boundary.tangent);
      }
    }

    // Determine if boundary zone is active (manifolds close enough)
    const distance = shadowPosition && higherSelfPosition
      ? Math.sqrt(
          (higherSelfPosition.x - shadowPosition.x) ** 2 +
          (higherSelfPosition.y - shadowPosition.y) ** 2
        )
      : Infinity;
    const isActive = distance < higherSelfManifold.attractionRadius * 2;

    return {
      willIntersect: intersection !== null,
      intersectionPoint: intersection?.point || null,
      timeToIntersection: intersection?.time ?? -1,
      confidence: intersection?.confidence ?? 0,
      convergenceSpiral,
      shadowManifold,
      higherSelfManifold,
      boundaryZone: {
        points: boundaryPoints,
        tangents: boundaryTangents,
        isActive
      },
      trajectoryPrediction: predictedPath
    };
  }, [shadowPosition, higherSelfPosition, velocity, shadowManifold, higherSelfManifold]);

  // Calculate positionality state with ellipses
  const positionalityState = useMemo((): PositionalityState => {
    // Determine current ring based on shadow position
    let currentRing: RingLevel = 1;
    if (shadowPosition) {
      const distFromCenter = Math.sqrt(shadowPosition.x ** 2 + shadowPosition.y ** 2);
      if (distFromCenter > 0.85) currentRing = 4;
      else if (distFromCenter > 0.65) currentRing = 3;
      else if (distFromCenter > 0.4) currentRing = 2;
      else currentRing = 1;
    }

    // Generate ellipses
    const ellipses = generatePositionalityEllipses(
      ringStates,
      shadowPosition,
      higherSelfPosition
    );

    // Calculate ring influences on position
    const ringInfluences = ringStates.map(state => {
      const tendency = RING_QUADRANT_TENDENCY[state.ring];
      const strength = state.patternDetected ? 1 : state.progress / 100;
      return {
        ring: state.ring,
        pull: {
          x: tendency.pull.x * strength,
          y: tendency.pull.y * strength
        },
        strength
      };
    });

    // Calculate manifold metrics
    const connections = weavingConnections.map(c => ({
      source: `${c.sourceRow}-${c.sourceCol}`,
      target: `${c.targetRow}-${c.targetCol}`
    }));
    const manifoldMetrics = calculateManifoldMetrics(visitedTiles, connections);

    return {
      currentRing,
      ellipses,
      ringInfluences,
      manifoldMetrics
    };
  }, [ringStates, shadowPosition, higherSelfPosition, visitedTiles, weavingConnections]);

  // Get combined pull from all ring influences
  const getCombinedPull = useCallback((): QuadrantPosition => {
    return positionalityState.ringInfluences.reduce(
      (acc, influence) => ({
        x: acc.x + influence.pull.x,
        y: acc.y + influence.pull.y
      }),
      { x: 0, y: 0 }
    );
  }, [positionalityState.ringInfluences]);

  return {
    intersectionResult,
    positionalityState,
    velocity,
    getCombinedPull
  };
}
