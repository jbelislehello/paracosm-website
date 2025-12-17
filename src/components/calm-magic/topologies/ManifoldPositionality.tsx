// Manifold Positionality - Nested ellipse zones with dual manifold visualization
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { QuadrantPosition } from '@/types/trajectory';
import { Badge } from '@/components/ui/badge';
import { EllipseDefinition, ellipsePoint } from '@/utils/manifoldChartMath';
import { ManifoldIntersectionResult, PositionalityState } from '@/hooks/useManifoldIntersection';

// ============ NESTED ELLIPSE ZONES ============

interface NestedEllipseZonesProps {
  ellipses: EllipseDefinition[];
  time: number;
}

export function NestedEllipseZones({ ellipses, time }: NestedEllipseZonesProps) {
  return (
    <group position={[0, 0.01, 0]}>
      {ellipses.map((ellipse, idx) => {
        // Generate points for ellipse
        const points: THREE.Vector3[] = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * Math.PI * 2;
          const p = ellipsePoint(ellipse, t);
          points.push(new THREE.Vector3(p.x * 2, 0, p.y * 2));
        }

        // Breathing animation based on ring
        const breathOffset = Math.sin(time * 0.5 + idx * 0.5) * 0.02;
        const scale = 1 + breathOffset;

        // Style based on ring level
        const opacity = 0.3 + (4 - ellipse.ring) * 0.1;
        const lineWidth = ellipse.ring === 1 ? 3 : 2;
        const dashSize = ellipse.ring === 4 ? 0.1 : undefined;

        return (
          <group key={ellipse.ring} scale={[scale, 1, scale]}>
            <Line
              points={points}
              color={ellipse.color}
              lineWidth={lineWidth}
              transparent
              opacity={opacity}
              dashed={ellipse.ring === 4}
              dashSize={dashSize}
              dashScale={1}
            />
            
            {/* Ring label */}
            <Html
              position={[ellipse.semiMajor * 2 * Math.cos(ellipse.rotation + 0.3), 0.1, ellipse.semiMinor * 2 * Math.sin(ellipse.rotation + 0.3)]}
              center
            >
              <Badge
                variant="outline"
                className="text-[9px] bg-background/60 backdrop-blur-sm border-none"
                style={{ color: ellipse.color }}
              >
                {ellipse.name}
              </Badge>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ============ SHADOW MANIFOLD (CONE) ============

interface ShadowManifoldProps {
  position: QuadrantPosition;
  curvature: number;
  deformation: number;
  time: number;
}

export function ShadowManifold({ position, curvature, deformation, time }: ShadowManifoldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create cone geometry representing shadow manifold
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.25, 0.4 + deformation * 0.3, 32, 1, true);
    return geo;
  }, [deformation]);

  useFrame(() => {
    if (meshRef.current) {
      // Rotate and pulse
      meshRef.current.rotation.y = time * 0.3;
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[position.x * 2, 0.2, position.y * 2]}>
      {/* Cone manifold */}
      <mesh ref={meshRef} geometry={geometry} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>
      
      {/* Curvature indicator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <meshStandardMaterial
          color={curvature < 0 ? "#ef4444" : "#22c55e"}
          emissive={curvature < 0 ? "#ef4444" : "#22c55e"}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Core marker */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Label */}
      <Html position={[0, 0.5, 0]} center>
        <Badge className="bg-indigo-500/80 text-white text-[10px]">
          Shadow φ₁
        </Badge>
      </Html>
    </group>
  );
}

// ============ HIGHER SELF MANIFOLD (DISK/BASIN) ============

interface HigherSelfManifoldProps {
  position: QuadrantPosition;
  attractionRadius: number;
  potential: number;
  time: number;
}

export function HigherSelfManifold({ position, attractionRadius, potential, time }: HigherSelfManifoldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -time * 0.2;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[position.x * 2, 0.15, position.y * 2]}>
      {/* Disk manifold with depression (basin) */}
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[attractionRadius * 0.8, attractionRadius, 0.15, 32, 1, true]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Attraction basin glow */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[attractionRadius, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.5 * potential}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Core octahedron */}
      <mesh rotation={[0, time * 0.3, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Point light for attraction effect */}
      <pointLight color="#f59e0b" intensity={0.8} distance={2} />

      {/* Label */}
      <Html position={[0, 0.4, 0]} center>
        <Badge className="bg-amber-500/80 text-white text-[10px]">
          Higher Self φ₂
        </Badge>
      </Html>
    </group>
  );
}

// ============ BOUNDARY/TRANSITION ZONE ============

interface BoundaryZoneProps {
  points: QuadrantPosition[];
  isActive: boolean;
  time: number;
}

export function BoundaryZone({ points, isActive, time }: BoundaryZoneProps) {
  if (points.length < 2 || !isActive) return null;

  // Create arc points
  const linePoints = points.map(p => new THREE.Vector3(p.x * 2, 0.12, p.y * 2));
  
  // Animated dash offset
  const dashOffset = time * 0.3;

  return (
    <group>
      {/* Main boundary arc */}
      <Line
        points={linePoints}
        color="#a855f7"
        lineWidth={3}
        transparent
        opacity={0.8}
        dashed
        dashSize={0.1}
        dashScale={1}
        dashOffset={dashOffset}
      />
      
      {/* Glow effect */}
      <Line
        points={linePoints}
        color="#a855f7"
        lineWidth={8}
        transparent
        opacity={0.2}
      />

      {/* Midpoint marker */}
      {points.length > 5 && (
        <group position={[points[5].x * 2, 0.2, points[5].y * 2]}>
          <mesh rotation={[0, time, Math.PI / 4]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={0.6}
            />
          </mesh>
          <Html position={[0, 0.15, 0]} center>
            <Badge variant="outline" className="text-[9px] bg-purple-500/20 border-purple-500/50 text-purple-300">
              φ₃ Boundary
            </Badge>
          </Html>
        </group>
      )}
    </group>
  );
}

// ============ PREEMPTIVE INTERSECTION PREDICTION ============

interface PreemptiveIntersectionProps {
  trajectoryPrediction: QuadrantPosition[];
  convergenceSpiral: QuadrantPosition[];
  intersectionPoint: QuadrantPosition | null;
  confidence: number;
  timeToIntersection: number;
  time: number;
}

export function PreemptiveIntersection({
  trajectoryPrediction,
  convergenceSpiral,
  intersectionPoint,
  confidence,
  timeToIntersection,
  time
}: PreemptiveIntersectionProps) {
  // Trajectory prediction line
  const trajectoryPoints = trajectoryPrediction.map(
    p => new THREE.Vector3(p.x * 2, 0.05, p.y * 2)
  );

  // Convergence spiral points
  const spiralPoints = convergenceSpiral.map(
    p => new THREE.Vector3(p.x * 2, 0.08 + Math.sin(time + convergenceSpiral.indexOf(p) * 0.2) * 0.02, p.y * 2)
  );

  return (
    <group>
      {/* Trajectory prediction (fading line) */}
      {trajectoryPoints.length > 1 && (
        <Line
          points={trajectoryPoints}
          color="#64748b"
          lineWidth={1}
          transparent
          opacity={0.4}
          dashed
          dashSize={0.05}
          dashScale={1}
        />
      )}

      {/* Convergence spiral */}
      {spiralPoints.length > 1 && confidence > 0.3 && (
        <group>
          <Line
            points={spiralPoints}
            color="#22c55e"
            lineWidth={2}
            transparent
            opacity={confidence * 0.8}
          />
          
          {/* Animated particles along spiral */}
          {spiralPoints.filter((_, i) => i % 5 === 0).map((point, idx) => (
            <mesh
              key={idx}
              position={point}
              scale={0.03 + Math.sin(time * 3 + idx) * 0.01}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#22c55e" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {/* Intersection point marker */}
      {intersectionPoint && confidence > 0.5 && (
        <group position={[intersectionPoint.x * 2, 0.15, intersectionPoint.y * 2]}>
          {/* Pulsing ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15 + Math.sin(time * 2) * 0.03, 0.02, 8, 32]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.8}
              transparent
              opacity={confidence}
            />
          </mesh>
          
          {/* Trefoil knot at intersection (transformation symbol) */}
          <mesh rotation={[time * 0.5, time * 0.3, 0]} scale={0.08}>
            <torusKnotGeometry args={[1, 0.3, 64, 8, 2, 3]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Time to intersection label */}
          <Html position={[0, 0.3, 0]} center>
            <div className="flex flex-col items-center gap-0.5">
              <Badge className="bg-green-500/80 text-white text-[9px]">
                Preemptive Meeting
              </Badge>
              <span className="text-[8px] text-green-400/80">
                ~{timeToIntersection} steps • {Math.round(confidence * 100)}% conf.
              </span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// ============ MANIFOLD METRICS DISPLAY ============

interface ManifoldMetricsDisplayProps {
  metrics: {
    genus: number;
    eulerCharacteristic: number;
    gaussianCurvature: number;
    isOrientable: boolean;
  };
}

export function ManifoldMetricsDisplay({ metrics }: ManifoldMetricsDisplayProps) {
  return (
    <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
      <div className="font-medium text-foreground/80 mb-2">Manifold Topology</div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Genus:</span>
        <span className="font-mono">{metrics.genus}</span>
        <span className="text-[10px] text-muted-foreground">
          ({metrics.genus === 0 ? 'sphere' : metrics.genus === 1 ? 'torus' : 'complex'})
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">χ:</span>
        <span className="font-mono">{metrics.eulerCharacteristic}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">K:</span>
        <span className={`font-mono ${metrics.gaussianCurvature < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {metrics.gaussianCurvature.toFixed(3)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Orientable:</span>
        <span className={metrics.isOrientable ? 'text-green-400' : 'text-amber-400'}>
          {metrics.isOrientable ? '✓' : '✗'}
        </span>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

interface ManifoldPositionalitySceneProps {
  intersectionResult: ManifoldIntersectionResult;
  positionalityState: PositionalityState;
  shadowPosition: QuadrantPosition | null;
  higherSelfPosition: QuadrantPosition | null;
  time: number;
}

export function ManifoldPositionalityScene({
  intersectionResult,
  positionalityState,
  shadowPosition,
  higherSelfPosition,
  time
}: ManifoldPositionalitySceneProps) {
  return (
    <group>
      {/* Nested ellipse positionality zones */}
      <NestedEllipseZones
        ellipses={positionalityState.ellipses}
        time={time}
      />

      {/* Shadow manifold (cone projection) */}
      {shadowPosition && (
        <ShadowManifold
          position={shadowPosition}
          curvature={intersectionResult.shadowManifold.curvature}
          deformation={intersectionResult.shadowManifold.deformation}
          time={time}
        />
      )}

      {/* Higher Self manifold (disk/basin) */}
      {higherSelfPosition && (
        <HigherSelfManifold
          position={higherSelfPosition}
          attractionRadius={intersectionResult.higherSelfManifold.attractionRadius}
          potential={intersectionResult.higherSelfManifold.potential}
          time={time}
        />
      )}

      {/* Boundary/transition zone between manifolds */}
      <BoundaryZone
        points={intersectionResult.boundaryZone.points}
        isActive={intersectionResult.boundaryZone.isActive}
        time={time}
      />

      {/* Preemptive intersection prediction */}
      <PreemptiveIntersection
        trajectoryPrediction={intersectionResult.trajectoryPrediction}
        convergenceSpiral={intersectionResult.convergenceSpiral}
        intersectionPoint={intersectionResult.intersectionPoint}
        confidence={intersectionResult.confidence}
        timeToIntersection={intersectionResult.timeToIntersection}
        time={time}
      />
    </group>
  );
}
