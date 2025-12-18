/**
 * Torus Preview
 * Compact 3D torus preview showing POLEN density as surface bulges
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Orbit } from 'lucide-react';

interface TorusPreviewProps {
  densityMap: Map<string, number>;
  visitedTiles: Set<string>;
  className?: string;
}

// Distorted torus mesh component
function DistortedTorusMesh({ 
  densityMap, 
  visitedTiles 
}: { 
  densityMap: Map<string, number>; 
  visitedTiles: Set<string>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Auto-rotate
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  // Generate distorted torus geometry
  const geometry = useMemo(() => {
    const R = 1.5; // Major radius
    const r = 0.5; // Base minor radius
    const segments = 48;
    const tubeSegments = 24;
    
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const col = Math.floor((i / segments) * 8) % 8;
      
      for (let j = 0; j <= tubeSegments; j++) {
        const phi = (j / tubeSegments) * Math.PI * 2;
        const row = Math.floor((j / tubeSegments) * 8) % 8;
        
        // Get density for this tile region
        const key = `${row}-${col}`;
        const density = densityMap.get(key) || 0;
        const isVisited = visitedTiles.has(key);
        
        // Distort radius based on density
        const localR = r + (isVisited ? density * 0.15 : 0);
        
        // Torus parametric equations
        const x = (R + localR * Math.cos(phi)) * Math.cos(theta);
        const y = localR * Math.sin(phi);
        const z = (R + localR * Math.cos(phi)) * Math.sin(theta);
        
        positions.push(x, y, z);
        
        // Color based on Gaussian curvature
        const curvature = Math.cos(phi) / (localR * (R + localR * Math.cos(phi)));
        
        // Map curvature to color (blue = positive, red = negative, white = zero)
        let cr, cg, cb;
        if (curvature > 0) {
          // Positive curvature - blue tones
          cr = 0.2;
          cg = 0.4 + curvature * 2;
          cb = 0.8 + curvature * 0.2;
        } else {
          // Negative curvature - red/orange tones
          cr = 0.8 + Math.abs(curvature) * 0.2;
          cg = 0.3 - Math.abs(curvature) * 0.2;
          cb = 0.2;
        }
        
        // Highlight visited tiles
        if (isVisited) {
          cr = Math.min(1, cr + 0.2);
          cg = Math.min(1, cg + 0.2);
          cb = Math.min(1, cb + 0.2);
        }
        
        colors.push(cr, cg, cb);
      }
    }
    
    // Generate indices for triangles
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < tubeSegments; j++) {
        const a = i * (tubeSegments + 1) + j;
        const b = a + tubeSegments + 1;
        const c = a + 1;
        const d = b + 1;
        
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    
    return geom;
  }, [densityMap, visitedTiles]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        vertexColors 
        side={THREE.DoubleSide}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

export function TorusPreview({ densityMap, visitedTiles, className }: TorusPreviewProps) {
  return (
    <Card className={cn("bg-card/60 backdrop-blur-sm border-border/50", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Orbit className="h-4 w-4 text-chart-5" />
          Manifold Preview
          <span className="ml-auto text-xs text-muted-foreground">
            {visitedTiles.size} tiles
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-40 rounded-md overflow-hidden bg-background/50">
          <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, -5, -5]} intensity={0.3} />
            <DistortedTorusMesh densityMap={densityMap} visitedTiles={visitedTiles} />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate={false}
            />
          </Canvas>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Surface bulges show POLEN density • Colors show curvature
        </p>
      </CardContent>
    </Card>
  );
}
