/**
 * Holographic Entropy Visualization
 * 
 * Shows Bekenstein bound indicators, entropy gradient arrows,
 * and information density heatmap across the manifold.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  calculateAllBekensteinBounds,
  generateEntropyGradientField,
  calculateHolographicMetrics,
  BekensteinBound,
  EntropyGradient,
  HolographicMetrics
} from '@/utils/holographicEntropy';

interface HolographicEntropyVizProps {
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  journeyPath: Array<{ row: number; col: number }>;
  torusProjection: (row: number, col: number) => [number, number, number];
  visible: boolean;
}

// Bekenstein bound spheres - glow when approaching saturation
function BekensteinBoundIndicators({
  bounds,
  torusProjection
}: {
  bounds: Map<string, BekensteinBound>;
  torusProjection: (row: number, col: number) => [number, number, number];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  const { count, data } = useMemo(() => {
    const entries = Array.from(bounds.entries());
    const data = entries.map(([tileKey, bound]) => {
      const [row, col] = tileKey.split('-').map(Number);
      const [x, y, z] = torusProjection(row, col);
      return { position: [x, y, z] as [number, number, number], bound };
    });
    return { count: data.length, data };
  }, [bounds, torusProjection]);

  useFrame((_, delta) => {
    if (!meshRef.current || count === 0) return;
    timeRef.current += delta;

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    data.forEach((d, i) => {
      const { position, bound } = d;
      
      // Pulsing effect for saturated bounds
      const pulse = bound.isSaturated 
        ? 1 + 0.3 * Math.sin(timeRef.current * 4)
        : 1;
      
      // Size based on max entropy capacity
      const baseScale = 0.02 + (bound.maxEntropy / 1000) * 0.05;
      const scale = baseScale * pulse;
      
      matrix.makeScale(scale, scale, scale);
      matrix.setPosition(...position);
      meshRef.current!.setMatrixAt(i, matrix);

      // Color: green (low utilization) -> yellow -> red (saturated)
      const hue = (1 - bound.utilizationRatio) * 0.33; // 0.33 = green, 0 = red
      color.setHSL(hue, 0.9, 0.5 + bound.utilizationRatio * 0.3);
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        vertexColors
        emissive="#ffffff"
        emissiveIntensity={0.2}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}

// Entropy gradient arrows
function EntropyGradientArrows({
  gradients,
  torusProjection
}: {
  gradients: EntropyGradient[];
  torusProjection: (row: number, col: number) => [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const arrowData = useMemo(() => {
    return gradients.map(g => {
      const [r1, c1] = g.fromTile.split('-').map(Number);
      const [r2, c2] = g.toTile.split('-').map(Number);
      const [x1, y1, z1] = torusProjection(r1, c1);
      const [x2, y2, z2] = torusProjection(r2, c2);
      
      const midpoint: [number, number, number] = [
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        (z1 + z2) / 2
      ];
      
      const direction = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1).normalize();
      
      // Entropy flows from high to low
      if (g.gradient < 0) {
        direction.negate();
      }
      
      return { midpoint, direction, strength: g.flowStrength };
    });
  }, [gradients, torusProjection]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.ArrowHelper && arrowData[i]) {
          const pulse = 0.7 + 0.3 * Math.sin(timeRef.current * 3 + i * 0.3);
          const length = 0.05 + arrowData[i].strength * 0.1 * pulse;
          child.setLength(length, 0.02, 0.015);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {arrowData.map((data, i) => {
        const origin = new THREE.Vector3(...data.midpoint);
        const length = 0.05 + data.strength * 0.1;
        
        // Color based on flow strength
        const intensity = Math.min(1, data.strength);
        const color = new THREE.Color().setHSL(0.6 - intensity * 0.3, 0.8, 0.5);
        
        return (
          <arrowHelper
            key={i}
            args={[data.direction, origin, length, color.getHex(), 0.02, 0.015]}
          />
        );
      })}
    </group>
  );
}

// Information density heatmap (rendered as colored plane segments)
function InformationDensityHeatmap({
  bounds,
  torusProjection
}: {
  bounds: Map<string, BekensteinBound>;
  torusProjection: (row: number, col: number) => [number, number, number];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { count, positions, colors } = useMemo(() => {
    const entries = Array.from(bounds.entries());
    const positions: number[] = [];
    const colors: number[] = [];
    
    // Find max for normalization
    const maxDensity = Math.max(...entries.map(([, b]) => b.currentEntropy));
    
    entries.forEach(([tileKey, bound]) => {
      const [row, col] = tileKey.split('-').map(Number);
      const [x, y, z] = torusProjection(row, col);
      
      // Offset slightly above the torus surface
      const normal = new THREE.Vector3(x, y, z).normalize();
      positions.push(
        x + normal.x * 0.02,
        y + normal.y * 0.02,
        z + normal.z * 0.02
      );
      
      // Heat map color
      const normalized = maxDensity > 0 ? bound.currentEntropy / maxDensity : 0;
      // Blue (cold/low) -> Cyan -> Yellow -> Red (hot/high)
      const r = normalized > 0.5 ? 1 : normalized * 2;
      const g = normalized < 0.5 ? normalized * 2 : 2 - normalized * 2;
      const b = normalized < 0.5 ? 1 - normalized * 2 : 0;
      colors.push(r, g, b);
    });
    
    return { count: entries.length, positions, colors };
  }, [bounds, torusProjection]);

  // Set up instances
  useMemo(() => {
    if (!meshRef.current) return;
    
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      matrix.makeScale(0.04, 0.04, 0.002);
      matrix.setPosition(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      meshRef.current.setMatrixAt(i, matrix);
      
      color.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
      meshRef.current.setColorAt(i, color);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count, positions, colors]);

  if (count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.6}
        emissive="#ffffff"
        emissiveIntensity={0.1}
      />
    </instancedMesh>
  );
}

// Metrics display HUD
function HolographicMetricsHUD({ metrics }: { metrics: HolographicMetrics }) {
  return (
    <group position={[0, 2.8, 0]}>
      {/* Information horizon ring */}
      <mesh>
        <torusGeometry args={[metrics.informationHorizon * 0.2, 0.01, 8, 32]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Capacity indicator */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={metrics.totalEntropy > metrics.holographicCapacity * 0.8 ? '#ef4444' : '#22c55e'}
          emissive={metrics.totalEntropy > metrics.holographicCapacity * 0.8 ? '#dc2626' : '#16a34a'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export function HolographicEntropyViz({
  visitedTiles,
  densityMap,
  journeyPath,
  torusProjection,
  visible
}: HolographicEntropyVizProps) {
  const { bounds, gradients, metrics } = useMemo(() => {
    if (visitedTiles.size === 0) {
      return { bounds: new Map(), gradients: [], metrics: null };
    }
    
    const bounds = calculateAllBekensteinBounds(visitedTiles, densityMap);
    const gradients = generateEntropyGradientField(visitedTiles, densityMap);
    const metrics = calculateHolographicMetrics(visitedTiles, densityMap, journeyPath);
    
    return { bounds, gradients, metrics };
  }, [visitedTiles, densityMap, journeyPath]);

  if (!visible || !metrics) return null;

  return (
    <group name="holographic-entropy-viz">
      <InformationDensityHeatmap bounds={bounds} torusProjection={torusProjection} />
      <BekensteinBoundIndicators bounds={bounds} torusProjection={torusProjection} />
      <EntropyGradientArrows gradients={gradients} torusProjection={torusProjection} />
      <HolographicMetricsHUD metrics={metrics} />
    </group>
  );
}

export default HolographicEntropyViz;
