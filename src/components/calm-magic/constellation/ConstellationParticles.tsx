import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { ManifoldEntry } from '@/hooks/useManifoldData';
import { ManifoldEdge } from '@/hooks/useManifoldEdges';
import { SEASON_HEX_COLORS } from '@/utils/torusManifoldMath';

interface ProjectedEntry extends ManifoldEntry {
  projectedX: number;
  projectedY: number;
  projectedZ: number;
}

interface ConstellationParticlesProps {
  entries: ProjectedEntry[];
  selectedEntry: ManifoldEntry | null;
  onEntryClick: (entry: ManifoldEntry) => void;
  particleSize?: number;
  showConnections?: boolean;
  edges?: ManifoldEdge[];
  edgeSource?: ManifoldEntry | null;
  edgeTarget?: ManifoldEntry | null;
}

// Edge type colors
const EDGE_COLORS = {
  resonance: 0xa855f7, // violet
  causality: 0xf59e0b, // amber
  echo: 0x06b6d4      // cyan
};

export function ConstellationParticles({
  entries,
  selectedEntry,
  onEntryClick,
  particleSize = 0.1,
  showConnections = true,
  edges = [],
  edgeSource = null,
  edgeTarget = null
}: ConstellationParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(entries.length * 3);
    const colors = new Float32Array(entries.length * 3);
    const sizes = new Float32Array(entries.length);

    entries.forEach((entry, i) => {
      // Use projected positions instead of torus positions
      positions[i * 3] = entry.projectedX;
      positions[i * 3 + 1] = entry.projectedY;
      positions[i * 3 + 2] = entry.projectedZ;

      // Color by season
      const color = new THREE.Color(SEASON_HEX_COLORS[entry.season]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Size varies slightly
      sizes[i] = particleSize * (0.8 + Math.random() * 0.4);
    });

    return { positions, colors, sizes };
  }, [entries, particleSize]);

  // Tag-based connections (implicit connections)
  const tagConnections = useMemo(() => {
    if (!showConnections) return [];
    
    const lines: Array<{ start: THREE.Vector3; end: THREE.Vector3; opacity: number; color: number }> = [];
    
    for (let i = 0; i < entries.length && lines.length < 100; i++) {
      for (let j = i + 1; j < entries.length && lines.length < 100; j++) {
        const shared = entries[i].tags.filter(t => entries[j].tags.includes(t)).length;
        if (shared > 0) {
          lines.push({
            start: new THREE.Vector3(entries[i].projectedX, entries[i].projectedY, entries[i].projectedZ),
            end: new THREE.Vector3(entries[j].projectedX, entries[j].projectedY, entries[j].projectedZ),
            opacity: Math.min(shared * 0.1, 0.3),
            color: 0xffffff
          });
        }
      }
    }
    
    return lines;
  }, [entries, showConnections]);

  // Explicit manifold edges (user-created)
  const explicitEdges = useMemo(() => {
    if (!showConnections || edges.length === 0) return [];
    
    const lines: Array<{ start: THREE.Vector3; end: THREE.Vector3; opacity: number; color: number }> = [];
    
    edges.forEach(edge => {
      const fromEntry = entries.find(e => e.id === edge.fromEntryId);
      const toEntry = entries.find(e => e.id === edge.toEntryId);
      
      if (fromEntry && toEntry) {
        lines.push({
          start: new THREE.Vector3(fromEntry.projectedX, fromEntry.projectedY, fromEntry.projectedZ),
          end: new THREE.Vector3(toEntry.projectedX, toEntry.projectedY, toEntry.projectedZ),
          opacity: 0.6 + edge.weight * 0.3,
          color: EDGE_COLORS[edge.edgeType] || 0xffffff
        });
      }
    });
    
    return lines;
  }, [entries, edges, showConnections]);

  // Animate particles with gentle floating
  useFrame((state) => {
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < entries.length; i++) {
        // Gentle floating motion
        const offset = Math.sin(time * 0.3 + i * 0.2) * 0.02;
        posArray[i * 3 + 2] = entries[i].projectedZ + offset;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Tag-based connection lines (subtle) */}
      {tagConnections.map((conn, i) => (
        <Line
          key={`tag-${i}`}
          points={[
            [conn.start.x, conn.start.y, conn.start.z],
            [conn.end.x, conn.end.y, conn.end.z]
          ]}
          color={conn.color}
          transparent
          opacity={conn.opacity}
          lineWidth={1}
        />
      ))}

      {/* Explicit manifold edges (prominent) */}
      {explicitEdges.map((conn, i) => (
        <Line
          key={`edge-${i}`}
          points={[
            [conn.start.x, conn.start.y, conn.start.z],
            [conn.end.x, conn.end.y, conn.end.z]
          ]}
          color={conn.color}
          transparent
          opacity={conn.opacity}
          lineWidth={2}
        />
      ))}

      {/* Main particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={entries.length}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={entries.length}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={particleSize}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Glow layer */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={entries.length}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={entries.length}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={particleSize * 2.5}
          vertexColors
          transparent
          opacity={0.25}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Edge source highlight (when creating edge) */}
      {edgeSource && (() => {
        const projectedEntry = entries.find(e => e.id === edgeSource.id);
        if (!projectedEntry) return null;
        
        return (
          <mesh position={[projectedEntry.projectedX, projectedEntry.projectedY, projectedEntry.projectedZ]}>
            <ringGeometry args={[0.2, 0.25, 32]} />
            <meshBasicMaterial
              color={0xa855f7}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })()}

      {/* Edge target highlight (when creating edge) */}
      {edgeTarget && (() => {
        const projectedEntry = entries.find(e => e.id === edgeTarget.id);
        if (!projectedEntry) return null;
        
        return (
          <mesh position={[projectedEntry.projectedX, projectedEntry.projectedY, projectedEntry.projectedZ]}>
            <ringGeometry args={[0.2, 0.25, 32]} />
            <meshBasicMaterial
              color={0x22c55e}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })()}

      {/* Preview line between source and target */}
      {edgeSource && edgeTarget && (() => {
        const sourceEntry = entries.find(e => e.id === edgeSource.id);
        const targetEntry = entries.find(e => e.id === edgeTarget.id);
        if (!sourceEntry || !targetEntry) return null;
        
        return (
          <Line
            points={[
              [sourceEntry.projectedX, sourceEntry.projectedY, sourceEntry.projectedZ],
              [targetEntry.projectedX, targetEntry.projectedY, targetEntry.projectedZ]
            ]}
            color={0xa855f7}
            transparent
            opacity={0.8}
            lineWidth={2}
          />
        );
      })()}

      {/* Selected entry highlight (normal mode) */}
      {selectedEntry && !edgeSource && !edgeTarget && (() => {
        const projectedEntry = entries.find(e => e.id === selectedEntry.id);
        if (!projectedEntry) return null;
        
        return (
          <mesh position={[projectedEntry.projectedX, projectedEntry.projectedY, projectedEntry.projectedZ]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial
              color={SEASON_HEX_COLORS[selectedEntry.season]}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })()}
    </group>
  );
}
