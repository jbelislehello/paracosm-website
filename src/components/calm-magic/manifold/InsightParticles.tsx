import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ManifoldEntry } from '@/hooks/useManifoldData';
import { SEASON_HEX_COLORS, ManifoldSeason } from '@/utils/torusManifoldMath';

interface InsightParticlesProps {
  entries: ManifoldEntry[];
  selectedEntry: ManifoldEntry | null;
  onEntryClick: (entry: ManifoldEntry) => void;
  particleSize?: number;
}

export function InsightParticles({
  entries,
  selectedEntry,
  onEntryClick,
  particleSize = 0.08
}: InsightParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(entries.length * 3);
    const colors = new Float32Array(entries.length * 3);
    const sizes = new Float32Array(entries.length);

    entries.forEach((entry, i) => {
      // Add small random offset to prevent z-fighting
      const offset = 0.02;
      positions[i * 3] = entry.x + (Math.random() - 0.5) * offset;
      positions[i * 3 + 1] = entry.y + (Math.random() - 0.5) * offset;
      positions[i * 3 + 2] = entry.z + (Math.random() - 0.5) * offset;

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

  // Animate particles
  useFrame((state) => {
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < entries.length; i++) {
        // Gentle floating motion
        const offset = Math.sin(time * 0.5 + i * 0.1) * 0.01;
        posArray[i * 3 + 2] = entries[i].z + offset;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
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
          opacity={0.9}
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
          size={particleSize * 2}
          vertexColors
          transparent
          opacity={0.3}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Selected entry highlight */}
      {selectedEntry && (
        <mesh position={[selectedEntry.x, selectedEntry.y, selectedEntry.z]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial
            color={SEASON_HEX_COLORS[selectedEntry.season]}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

// Connection lines between related entries
interface ConnectionLinesProps {
  entries: ManifoldEntry[];
  showConnections: boolean;
}

export function ConnectionLines({ entries, showConnections }: ConnectionLinesProps) {
  const connections = useMemo(() => {
    if (!showConnections) return [];

    const lines: Array<{ start: THREE.Vector3; end: THREE.Vector3; color: number }> = [];

    // Connect entries with shared tags
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const sharedTags = entries[i].tags.filter(tag => 
          entries[j].tags.includes(tag)
        );

        if (sharedTags.length > 0) {
          lines.push({
            start: new THREE.Vector3(entries[i].x, entries[i].y, entries[i].z),
            end: new THREE.Vector3(entries[j].x, entries[j].y, entries[j].z),
            color: 0xffffff
          });
        }
      }
    }

    return lines.slice(0, 100); // Limit for performance
  }, [entries, showConnections]);

  if (!showConnections) return null;

  return (
    <group>
      {connections.map((conn, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                conn.start.x, conn.start.y, conn.start.z,
                conn.end.x, conn.end.y, conn.end.z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={conn.color}
            transparent
            opacity={0.2}
          />
        </line>
      ))}
    </group>
  );
}
