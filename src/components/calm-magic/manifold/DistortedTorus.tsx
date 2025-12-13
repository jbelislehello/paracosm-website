import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  generateDistortedTorusMesh,
  SEASON_HEX_COLORS,
  ManifoldSeason
} from '@/utils/torusManifoldMath';

interface DistortedTorusProps {
  densityMap: Map<string, number>;
  showCurvature: boolean;
  showSeasonColors: boolean;
  opacity?: number;
  wireframe?: boolean;
}

export function DistortedTorus({
  densityMap,
  showCurvature,
  showSeasonColors,
  opacity = 0.6,
  wireframe = false
}: DistortedTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const { positions, normals, uvs, indices, colors } = generateDistortedTorusMesh(
      densityMap,
      64,
      40
    );

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));

    if (showCurvature) {
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    } else if (showSeasonColors) {
      // Apply season colors based on UV v-coordinate
      const seasonColors = new Float32Array(positions.length);
      const seasons: ManifoldSeason[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
      
      for (let i = 0; i < uvs.length / 2; i++) {
        const v = uvs[i * 2 + 1]; // v-coordinate maps to phi/seasons
        const seasonIndex = Math.floor(v * 5) % 5;
        const color = new THREE.Color(SEASON_HEX_COLORS[seasons[seasonIndex]]);
        
        seasonColors[i * 3] = color.r;
        seasonColors[i * 3 + 1] = color.g;
        seasonColors[i * 3 + 2] = color.b;
      }
      
      geo.setAttribute('color', new THREE.BufferAttribute(seasonColors, 3));
    }

    geo.computeVertexNormals();
    return geo;
  }, [densityMap, showCurvature, showSeasonColors]);

  // Gentle rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhongMaterial
        vertexColors={showCurvature || showSeasonColors}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        wireframe={wireframe}
        shininess={30}
      />
    </mesh>
  );
}
