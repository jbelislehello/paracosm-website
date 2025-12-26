/**
 * Kähler Manifold Visualization Layer
 * 
 * Shows prequantization phases as color gradients and 
 * symplectic flow as animated vector field on the torus.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  generateKahlerVisualization,
  phaseToColor,
  generateSymplecticVectors,
  KahlerVisualization
} from '@/utils/kahlerManifoldMath';

interface KahlerManifoldLayerProps {
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  journeyPath: Array<{ row: number; col: number }>;
  torusProjection: (row: number, col: number) => [number, number, number];
  visible: boolean;
}

// Prequantization phase gradient spheres
function PrequantizationPhases({
  visualization,
  torusProjection
}: {
  visualization: KahlerVisualization;
  torusProjection: (row: number, col: number) => [number, number, number];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  const { count, matrices, colors, phases } = useMemo(() => {
    const states = visualization.prequantizationStates;
    const count = states.length;
    const matrices = new Float32Array(count * 16);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    states.forEach((state, i) => {
      const [row, col] = state.tileKey.split('-').map(Number);
      const [x, y, z] = torusProjection(row, col);

      // Create transformation matrix
      const matrix = new THREE.Matrix4();
      const scale = 0.05 + state.amplitude * 0.1;
      matrix.makeScale(scale, scale, scale);
      matrix.setPosition(x, y, z);
      matrix.toArray(matrices, i * 16);

      // Phase to color
      const [r, g, b] = phaseToColor(state.phase);
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;

      phases[i] = state.phase;
    });

    return { count, matrices, colors, phases };
  }, [visualization, torusProjection]);

  useFrame((_, delta) => {
    if (!meshRef.current || count === 0) return;
    timeRef.current += delta;

    // Animate phase cycling
    for (let i = 0; i < count; i++) {
      const animatedPhase = (phases[i] + timeRef.current * 0.5) % (2 * Math.PI);
      const [r, g, b] = phaseToColor(animatedPhase);
      
      const color = new THREE.Color(r, g, b);
      meshRef.current.setColorAt(i, color);
    }
    
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial 
        vertexColors 
        emissive="#ffffff" 
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}

// Symplectic flow vector field with animation
function SymplecticFlowField({
  visitedTiles,
  densityMap,
  torusProjection
}: {
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  torusProjection: (row: number, col: number) => [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const arrowRefs = useRef<THREE.ArrowHelper[]>([]);
  const timeRef = useRef(0);

  const vectors = useMemo(() => {
    return generateSymplecticVectors(visitedTiles, densityMap, torusProjection);
  }, [visitedTiles, densityMap, torusProjection]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    
    // Animate arrow lengths/pulsing
    arrowRefs.current.forEach((arrow, i) => {
      if (arrow && vectors[i]) {
        const pulse = 0.8 + 0.2 * Math.sin(timeRef.current * 2 + i * 0.5);
        const baseLength = Math.min(0.2, vectors[i].magnitude * 0.1);
        arrow.setLength(baseLength * pulse, 0.03, 0.02);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {vectors.map((vec, i) => {
        const dir = new THREE.Vector3(
          vec.end[0] - vec.start[0],
          vec.end[1] - vec.start[1],
          vec.end[2] - vec.start[2]
        ).normalize();

        const origin = new THREE.Vector3(...vec.start);
        const length = Math.min(0.2, vec.magnitude * 0.1);
        
        // Color based on magnitude
        const hue = (vec.magnitude % 1);
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);

        return (
          <arrowHelper
            key={i}
            ref={(el) => { if (el) arrowRefs.current[i] = el; }}
            args={[dir, origin, length, color.getHex(), 0.03, 0.02]}
          />
        );
      })}
    </group>
  );
}

// Chern number display
function ChernNumberIndicator({ chernNumber }: { chernNumber: number }) {
  return (
    <group position={[0, 2.5, 0]}>
      <mesh>
        <torusGeometry args={[0.3, 0.05, 16, 32]} />
        <meshStandardMaterial 
          color={chernNumber >= 0 ? '#4ade80' : '#f87171'}
          emissive={chernNumber >= 0 ? '#22c55e' : '#ef4444'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export function KahlerManifoldLayer({
  visitedTiles,
  densityMap,
  journeyPath,
  torusProjection,
  visible
}: KahlerManifoldLayerProps) {
  const visualization = useMemo(() => {
    if (visitedTiles.size === 0) return null;
    return generateKahlerVisualization(visitedTiles, densityMap, journeyPath);
  }, [visitedTiles, densityMap, journeyPath]);

  if (!visible || !visualization) return null;

  return (
    <group name="kahler-manifold-layer">
      <PrequantizationPhases
        visualization={visualization}
        torusProjection={torusProjection}
      />
      <SymplecticFlowField
        visitedTiles={visitedTiles}
        densityMap={densityMap}
        torusProjection={torusProjection}
      />
      <ChernNumberIndicator chernNumber={visualization.chernNumber} />
    </group>
  );
}

export default KahlerManifoldLayer;
