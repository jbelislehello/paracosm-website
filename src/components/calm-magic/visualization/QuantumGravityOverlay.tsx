/**
 * Quantum Gravity Overlay Component
 * 
 * Shows curvature singularities as glowing markers and 
 * geodesic flows as animated curves on the torus.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  generateQuantumGravityOverlay,
  CurvatureSingularity,
  GeodesicFlow,
  MicroDomainProperties,
  QuantumGravityOverlay as QGOverlayData
} from '@/utils/quantumGravityGeometry';

interface QuantumGravityOverlayProps {
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  torusProjection: (row: number, col: number) => [number, number, number];
  visible: boolean;
}

// Curvature singularity glowing markers
function SingularityMarkers({
  singularities
}: {
  singularities: CurvatureSingularity[];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && singularities[i]) {
          // Pulsing glow effect
          const pulse = 1 + 0.4 * Math.sin(timeRef.current * 3 + i * 0.7);
          child.scale.setScalar(singularities[i].radius * pulse);
          
          // Rotate for visual interest
          child.rotation.x += delta * 0.5;
          child.rotation.y += delta * 0.3;
        }
      });
    }
  });

  const singularityColors = {
    conical: '#ff6b6b',
    cusp: '#ffd93d',
    fold: '#6bcb77',
    saddle: '#4d96ff'
  };

  return (
    <group ref={groupRef}>
      {singularities.map((sing, i) => {
        const color = singularityColors[sing.type];
        
        return (
          <group key={i} position={[sing.position.x, sing.position.y, sing.position.z]}>
            {/* Core singularity marker */}
            <mesh scale={sing.radius}>
              {sing.type === 'conical' && <coneGeometry args={[0.5, 1, 8]} />}
              {sing.type === 'cusp' && <octahedronGeometry args={[0.5, 0]} />}
              {sing.type === 'fold' && <boxGeometry args={[0.6, 0.2, 0.6]} />}
              {sing.type === 'saddle' && <torusGeometry args={[0.3, 0.1, 8, 16]} />}
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8 + sing.strength * 0.5}
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Glow halo */}
            <mesh scale={sing.radius * 2}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.2 + sing.strength * 0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Animated geodesic flow curves
function GeodesicFlowCurves({
  geodesics
}: {
  geodesics: GeodesicFlow[];
}) {
  const linesRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Create line geometries
  const lineData = useMemo(() => {
    return geodesics.map(geo => {
      const points = geo.points.map(p => new THREE.Vector3(p.x, p.y, p.z));
      const curve = new THREE.CatmullRomCurve3(points);
      return {
        curve,
        energy: geo.energy,
        curvature: geo.curvatureIntegral
      };
    });
  }, [geodesics]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    
    // Animate by updating line opacity for flowing effect
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const material = child.material as THREE.LineBasicMaterial;
          const pulse = 0.5 + 0.3 * Math.sin(timeRef.current * 2 + i * 0.5);
          material.opacity = pulse;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {lineData.map((data, i) => {
        // Color based on curvature
        const hue = Math.max(0, Math.min(0.7, 0.6 - data.curvature * 0.3));
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        
        const points = data.curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <line key={i}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineDashedMaterial
              color={color}
              linewidth={1}
              dashSize={0.05}
              gapSize={0.02}
              transparent
              opacity={0.7}
            />
          </line>
        );
      })}
    </group>
  );
}

// Micro-domain quantum foam visualization
function QuantumFoamIndicators({
  microDomains,
  torusProjection
}: {
  microDomains: MicroDomainProperties[];
  torusProjection: (row: number, col: number) => [number, number, number];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  const data = useMemo(() => {
    return microDomains.map(domain => {
      const [row, col] = domain.tileKey.split('-').map(Number);
      const [x, y, z] = torusProjection(row, col);
      return { position: [x, y, z] as [number, number, number], domain };
    });
  }, [microDomains, torusProjection]);

  useFrame((_, delta) => {
    if (!meshRef.current || data.length === 0) return;
    timeRef.current += delta;

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    data.forEach((d, i) => {
      const { position, domain } = d;
      
      // Foam fluctuation animation
      const fluctuation = 1 + domain.quantumFoam * 0.3 * Math.sin(timeRef.current * 5 + i);
      const scale = 0.01 * fluctuation * (domain.planckCells / 100);
      
      matrix.makeScale(scale, scale, scale);
      // Offset slightly above surface
      const normal = new THREE.Vector3(...position).normalize();
      matrix.setPosition(
        position[0] + normal.x * 0.03,
        position[1] + normal.y * 0.03,
        position[2] + normal.z * 0.03
      );
      meshRef.current!.setMatrixAt(i, matrix);

      // Color by causal structure
      const causalColors = {
        timelike: '#a78bfa',
        spacelike: '#34d399',
        null: '#fbbf24'
      };
      color.set(causalColors[domain.causalStructure]);
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (data.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, data.length]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.5}
        emissive="#ffffff"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}

// Global curvature indicator
function GlobalCurvatureRing({
  globalCurvature,
  topologicalCharge
}: {
  globalCurvature: number;
  topologicalCharge: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ringRef.current) {
      ringRef.current.rotation.z = timeRef.current * 0.2;
    }
  });

  // Color based on topological charge
  const chargeColor = topologicalCharge > 0 ? '#60a5fa' : 
                      topologicalCharge < 0 ? '#f87171' : '#a3a3a3';

  return (
    <group position={[0, 2.5, 0]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.4 + Math.abs(globalCurvature) * 0.2, 0.02, 8, 64]} />
        <meshStandardMaterial
          color={chargeColor}
          emissive={chargeColor}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Charge indicator spheres */}
      {Array.from({ length: Math.abs(Math.round(topologicalCharge)) }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos((i / Math.max(1, Math.abs(topologicalCharge))) * Math.PI * 2) * 0.5,
            0,
            Math.sin((i / Math.max(1, Math.abs(topologicalCharge))) * Math.PI * 2) * 0.5
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color={topologicalCharge > 0 ? '#22c55e' : '#ef4444'}
            emissive={topologicalCharge > 0 ? '#16a34a' : '#dc2626'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export function QuantumGravityOverlay({
  visitedTiles,
  densityMap,
  torusProjection,
  visible
}: QuantumGravityOverlayProps) {
  const overlayData = useMemo<QGOverlayData | null>(() => {
    if (visitedTiles.size === 0) return null;
    return generateQuantumGravityOverlay(visitedTiles, densityMap, torusProjection);
  }, [visitedTiles, densityMap, torusProjection]);

  if (!visible || !overlayData) return null;

  return (
    <group name="quantum-gravity-overlay">
      <SingularityMarkers singularities={overlayData.singularities} />
      <GeodesicFlowCurves geodesics={overlayData.geodesics} />
      <QuantumFoamIndicators 
        microDomains={overlayData.microDomains} 
        torusProjection={torusProjection}
      />
      <GlobalCurvatureRing
        globalCurvature={overlayData.globalCurvature}
        topologicalCharge={overlayData.topologicalCharge}
      />
    </group>
  );
}

export default QuantumGravityOverlay;
