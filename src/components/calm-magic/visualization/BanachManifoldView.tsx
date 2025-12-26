/**
 * Banach Manifold Projection View
 * 
 * React Three Fiber visualization for higher-dimensional consciousness states
 * with mystical trajectory rendering and experience type color coding.
 */

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  generateMysticalTrajectory,
  projectTo3D,
  calculateTrajectoryCurvature,
  detectStateTransitions,
  generateBanachManifoldMesh,
  calculateExperienceSpaceDensity,
  MysticalTrajectoryPoint,
  ProjectedManifoldPoint
} from '@/utils/banachManifoldMath';

interface BanachManifoldViewProps {
  journeyPath: Array<{ row: number; col: number; timestamp?: number }>;
  densityMap: Map<string, number>;
  visible: boolean;
}

// Experience type colors
const EXPERIENCE_COLORS = {
  ordinary: new THREE.Color('#6366f1'),
  liminal: new THREE.Color('#8b5cf6'),
  peak: new THREE.Color('#f59e0b'),
  unity: new THREE.Color('#eab308'),
  void: new THREE.Color('#1e1b4b')
};

// Main trajectory tube with experience coloring
function TrajectoryTube({
  trajectory,
  time
}: {
  trajectory: MysticalTrajectoryPoint[];
  time: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, colors } = useMemo(() => {
    if (trajectory.length < 2) return { geometry: null, colors: null };

    // Project all points to 3D
    const points = trajectory.map(t => {
      const p = projectTo3D(t.position, 0);
      return new THREE.Vector3(p.x, p.y, p.z);
    });

    // Create tube curve
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    const geometry = new THREE.TubeGeometry(curve, trajectory.length * 4, 0.05, 8, false);

    // Color based on experience type
    const colors = new Float32Array(geometry.attributes.position.count * 3);
    const positionAttr = geometry.attributes.position;
    
    for (let i = 0; i < positionAttr.count; i++) {
      // Find closest trajectory point
      const vertexPos = new THREE.Vector3().fromBufferAttribute(positionAttr, i);
      let minDist = Infinity;
      let closestIdx = 0;
      
      points.forEach((p, idx) => {
        const dist = vertexPos.distanceTo(p);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });

      const expType = trajectory[closestIdx]?.experienceType || 'ordinary';
      const color = EXPERIENCE_COLORS[expType];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return { geometry, colors };
  }, [trajectory]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Subtle rotation
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        emissive="#ffffff"
        emissiveIntensity={0.1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// State transition markers
function StateTransitionMarkers({
  trajectory,
  time
}: {
  trajectory: MysticalTrajectoryPoint[];
  time: number;
}) {
  const transitions = useMemo(() => {
    return detectStateTransitions(trajectory);
  }, [trajectory]);

  const transitionData = useMemo(() => {
    return transitions.map(t => {
      const point = trajectory[t.index];
      const projected = projectTo3D(point.position, 0);
      return { ...t, position: projected };
    });
  }, [transitions, trajectory]);

  return (
    <group>
      {transitionData.map((t, i) => (
        <group key={i} position={[t.position.x, t.position.y, t.position.z]}>
          {/* Transition ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1 + t.intensity * 0.2, 0.02, 8, 32]} />
            <meshStandardMaterial
              color={EXPERIENCE_COLORS[t.toState as keyof typeof EXPERIENCE_COLORS] || EXPERIENCE_COLORS.ordinary}
              emissive="#ffffff"
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
          
          {/* Direction indicator */}
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.03, 0.06, 6]} />
            <meshStandardMaterial
              color={EXPERIENCE_COLORS[t.toState as keyof typeof EXPERIENCE_COLORS] || EXPERIENCE_COLORS.ordinary}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Curvature visualization along trajectory
function CurvatureIndicators({
  trajectory,
  time
}: {
  trajectory: MysticalTrajectoryPoint[];
  time: number;
}) {
  const curvatures = useMemo(() => {
    return calculateTrajectoryCurvature(trajectory);
  }, [trajectory]);

  const indicatorData = useMemo(() => {
    return curvatures.map((c, i) => {
      const point = trajectory[i + 1]; // Curvature is at midpoints
      if (!point) return null;
      const projected = projectTo3D(point.position, 0);
      return { curvature: c, position: projected };
    }).filter(Boolean) as Array<{ curvature: number; position: ProjectedManifoldPoint }>;
  }, [curvatures, trajectory]);

  return (
    <group>
      {indicatorData.map((d, i) => (
        <mesh
          key={i}
          position={[d.position.x, d.position.y, d.position.z]}
          scale={0.02 + d.curvature * 0.05}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(0.1 + d.curvature * 0.3, 0.8, 0.5)}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Consciousness level particles
function ConsciousnessParticles({
  trajectory,
  time
}: {
  trajectory: MysticalTrajectoryPoint[];
  time: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const { positions, colors, sizes } = useMemo(() => {
    const count = trajectory.length;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    trajectory.forEach((t, i) => {
      const p = projectTo3D(t.position, 0);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;

      const color = EXPERIENCE_COLORS[t.experienceType];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.05 + t.consciousnessLevel * 0.1;
    });

    return { positions, colors, sizes };
  }, [trajectory]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (particlesRef.current) {
      particlesRef.current.rotation.y = timeRef.current * 0.1;
    }
  });

  if (trajectory.length === 0) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Experience space density clouds
function ExperienceDensityClouds({
  trajectory
}: {
  trajectory: MysticalTrajectoryPoint[];
}) {
  const density = useMemo(() => {
    return calculateExperienceSpaceDensity(trajectory, 8);
  }, [trajectory]);

  const cloudData = useMemo(() => {
    const data: Array<{ position: [number, number, number]; intensity: number }> = [];
    const maxDensity = Math.max(...Array.from(density.values()), 1);
    
    density.forEach((value, key) => {
      const [gx, gy, gz] = key.split('-').map(Number);
      const x = (gx / 8) * 10 - 5;
      const y = (gy / 8) * 10 - 5;
      const z = (gz / 8) * 10 - 5;
      data.push({
        position: [x, y, z],
        intensity: value / maxDensity
      });
    });
    
    return data;
  }, [density]);

  return (
    <group>
      {cloudData.map((cloud, i) => (
        <mesh key={i} position={cloud.position} scale={0.3 + cloud.intensity * 0.5}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#8b5cf6"
            transparent
            opacity={0.1 + cloud.intensity * 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Legend component
function ExperienceLegend() {
  const labels = [
    { type: 'ordinary', label: 'Ordinary' },
    { type: 'liminal', label: 'Liminal' },
    { type: 'peak', label: 'Peak' },
    { type: 'unity', label: 'Unity' },
    { type: 'void', label: 'Void' }
  ];

  return (
    <group position={[-3, 2, 0]}>
      {labels.map((l, i) => (
        <group key={l.type} position={[0, -i * 0.3, 0]}>
          <mesh position={[-0.15, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={EXPERIENCE_COLORS[l.type as keyof typeof EXPERIENCE_COLORS]}
              emissive={EXPERIENCE_COLORS[l.type as keyof typeof EXPERIENCE_COLORS]}
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text
            position={[0.1, 0, 0]}
            fontSize={0.12}
            color="#a1a1aa"
            anchorX="left"
          >
            {l.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

// Main scene content
function BanachScene({
  trajectory
}: {
  trajectory: MysticalTrajectoryPoint[];
}) {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />

      <TrajectoryTube trajectory={trajectory} time={timeRef.current} />
      <ConsciousnessParticles trajectory={trajectory} time={timeRef.current} />
      <StateTransitionMarkers trajectory={trajectory} time={timeRef.current} />
      <CurvatureIndicators trajectory={trajectory} time={timeRef.current} />
      <ExperienceDensityClouds trajectory={trajectory} />
      <ExperienceLegend />

      {/* Coordinate axes */}
      <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(-4, -3, 0), 2, 0xff4444]} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(-4, -3, 0), 2, 0x44ff44]} />
      <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(-4, -3, 0), 2, 0x4444ff]} />

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </>
  );
}

export function BanachManifoldView({
  journeyPath,
  densityMap,
  visible
}: BanachManifoldViewProps) {
  const [trajectory, setTrajectory] = useState<MysticalTrajectoryPoint[]>([]);

  useEffect(() => {
    if (journeyPath.length > 0) {
      const traj = generateMysticalTrajectory(journeyPath, densityMap, {
        dimensions: 8,
        temporalSmoothing: 0.3
      });
      setTrajectory(traj);
    }
  }, [journeyPath, densityMap]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-background/95">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0f0f23']} />
        <fog attach="fog" args={['#0f0f23', 8, 20]} />
        <BanachScene trajectory={trajectory} />
      </Canvas>
      
      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 text-sm text-muted-foreground space-y-1">
        <div>Banach Manifold Projection</div>
        <div className="text-xs">
          {trajectory.length} trajectory points • 
          {trajectory.filter(t => t.experienceType !== 'ordinary').length} non-ordinary states
        </div>
      </div>
    </div>
  );
}

export default BanachManifoldView;
