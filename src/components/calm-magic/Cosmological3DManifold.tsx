import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useCosmologicalAudio } from '@/hooks/useCosmologicalAudio';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface TileData {
  id: number;
  row: number;
  col: number;
  visited: boolean;
  isPortal: boolean;
}

interface BoardTilesProps {
  season: Season;
  visitedTiles: number[];
  selectedTile: number | null;
  onTileClick: (id: number) => void;
}

const SEASON_COLORS: Record<Season, string> = {
  POLLENS: '#f43f5e',
  NOEMS: '#a855f7',
  POEMS: '#3b82f6',
  TOTEMS: '#22c55e',
  ANTHEMS: '#f59e0b',
};

const PORTAL_DAYS = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61];

const SEASON_ANATOMY: Record<Season, { kappa: string; sub: string }> = {
  POLLENS: { kappa: 'κ onset',   sub: 'first contact' },
  NOEMS:   { kappa: 'κ rising',  sub: 'meaning bends in' },
  POEMS:   { kappa: 'κ peak',    sub: 'maximum curvature' },
  TOTEMS:  { kappa: 'κ steady',  sub: 'form holds' },
  ANTHEMS: { kappa: 'κ release', sub: 'tangent re-aligns' },
};

// Shared scene-wide breath, sampled inside <Canvas> via useFrame.
function useSceneBreath() {
  const ref = useRef(0.5);
  useFrame((state) => {
    ref.current = Math.sin(state.clock.elapsedTime * 0.65) * 0.5 + 0.5;
  });
  return ref;
}

// 2.5D Board Tiles Component
function BoardTiles({ season, visitedTiles, selectedTile, onTileClick }: BoardTilesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tilesRef = useRef<THREE.Mesh[]>([]);
  const breath = useSceneBreath();

  useFrame((state) => {
    tilesRef.current.forEach((tile, i) => {
      if (tile) {
        const isVisited = visitedTiles.includes(i + 1);
        const isSelected = selectedTile === i + 1;
        const breathLift = breath.current * 0.04;
        const targetY = isSelected ? 0.3 : isVisited ? 0.1 + breathLift : breathLift;
        tile.position.y = THREE.MathUtils.lerp(tile.position.y, targetY, 0.1);

        // Pulse effect for selected tile
        if (isSelected) {
          tile.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
        } else {
          tile.scale.setScalar(1);
        }

        // Breath the emissive on portal tiles via material
        const mat = (tile.material as THREE.MeshStandardMaterial);
        if (mat && PORTAL_DAYS.includes(i + 1)) {
          mat.emissiveIntensity = 0.35 + breath.current * 0.45;
        }
      }
    });
  });

  const tiles = useMemo(() => {
    const result: TileData[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const id = row * 8 + col + 1;
        result.push({
          id,
          row,
          col,
          visited: visitedTiles.includes(id),
          isPortal: PORTAL_DAYS.includes(id),
        });
      }
    }
    return result;
  }, [visitedTiles]);

  const seasonColor = new THREE.Color(SEASON_COLORS[season]);

  return (
    <group ref={groupRef} position={[0, -2, 0]} rotation={[-Math.PI / 6, 0, 0]}>
      {tiles.map((tile, index) => {
        const x = (tile.col - 3.5) * 0.6;
        const z = (tile.row - 3.5) * 0.6;
        const isSelected = selectedTile === tile.id;
        
        return (
          <mesh
            key={tile.id}
            ref={(el) => { if (el) tilesRef.current[index] = el; }}
            position={[x, 0, z]}
            onClick={(e) => {
              e.stopPropagation();
              onTileClick(tile.id);
            }}
          >
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            <meshStandardMaterial
              color={isSelected ? '#ffffff' : tile.visited ? seasonColor : '#1a1a2e'}
              emissive={tile.isPortal ? seasonColor : '#000000'}
              emissiveIntensity={tile.isPortal ? 0.5 : 0}
              metalness={0.3}
              roughness={0.7}
            />
            {tile.isPortal && (
              <pointLight
                position={[0, 0.2, 0]}
                color={seasonColor}
                intensity={0.5}
                distance={1}
              />
            )}
          </mesh>
        );
      })}
      

      {/* Osculating plane on selected tile — the plane the curve fits into */}
      {selectedTile !== null && (() => {
        const idx = selectedTile - 1;
        const row = Math.floor(idx / 8);
        const col = idx % 8;
        const x = (col - 3.5) * 0.6;
        const z = (row - 3.5) * 0.6;
        return (
          <mesh position={[x, 0.4, z]} rotation={[-Math.PI / 2.4, 0, Math.PI / 6]}>
            <planeGeometry args={[1.6, 1.6]} />
            <meshBasicMaterial
              color={SEASON_COLORS[season]}
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })()}

      {/* Board base */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[5.5, 0.1, 5.5]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Manifold Spiral Component
function ManifoldSpiral({ season }: { season: Season }) {
  const spiralRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (spiralRef.current) {
      spiralRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -state.clock.elapsedTime * 0.2;
    }
  });

  const spiralPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const turns = 5;
    const height = 8;
    const segments = 200;
    
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns;
      const radius = 2 + t * 1.5;
      const y = t * height - height / 2;
      
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ));
    }
    
    return points;
  }, []);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 4;
      const y = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  const seasonColor = new THREE.Color(SEASON_COLORS[season]);

  return (
    <group ref={spiralRef}>
      {/* Main spiral line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={spiralPoints.length}
            array={new Float32Array(spiralPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={seasonColor} linewidth={2} transparent opacity={0.8} />
      </line>
      
      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={seasonColor}
          size={0.05}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {/* Season orbs */}
      {Object.entries(SEASON_COLORS).map(([s, color], index) => {
        const angle = (index / 5) * Math.PI * 2;
        const radius = 3;
        const y = (index - 2) * 1.5;
        
        return (
          <Float key={s} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={s === season ? 1 : 0.2}
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
            <Text
              position={[Math.cos(angle) * radius, y + 0.55, Math.sin(angle) * radius]}
              fontSize={0.18}
              color={color}
              anchorX="center"
              anchorY="middle"
            >
              {s}
            </Text>
            <Text
              position={[Math.cos(angle) * radius, y + 0.36, Math.sin(angle) * radius]}
              fontSize={0.1}
              color={color}
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.7}
              fontStyle="italic"
            >
              {SEASON_ANATOMY[s as Season].kappa} · {SEASON_ANATOMY[s as Season].sub}
            </Text>
          </Float>
        );
      })}
    </group>
  );
}

// Central Torus Energy Field
function TorusEnergyField({ season }: { season: Season }) {
  const torusRef = useRef<THREE.Mesh>(null);
  const innerTorusRef = useRef<THREE.Mesh>(null);
  const breath = useSceneBreath();

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      const s = 0.96 + breath.current * 0.08;
      torusRef.current.scale.set(s, s, s);
      const mat = torusRef.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.opacity = 0.45 + breath.current * 0.35;
    }
    if (innerTorusRef.current) {
      innerTorusRef.current.rotation.x = -state.clock.elapsedTime * 0.5;
      innerTorusRef.current.rotation.z = state.clock.elapsedTime * 0.4;
      const s = 0.92 + breath.current * 0.14;
      innerTorusRef.current.scale.set(s, s, s);
      const mat = innerTorusRef.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.opacity = 0.25 + breath.current * 0.45;
    }
  });

  const seasonColor = SEASON_COLORS[season];

  return (
    <group position={[0, 2, 0]}>
      <mesh ref={torusRef}>
        <torusGeometry args={[1.5, 0.3, 32, 100]} />
        <meshStandardMaterial
          color={seasonColor}
          emissive={seasonColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={innerTorusRef}>
        <torusGeometry args={[0.8, 0.15, 16, 50]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Central light */}
      <pointLight color={seasonColor} intensity={2} distance={10} />
    </group>
  );
}

// Hexagram Pillars
function HexagramPillars({ season }: { season: Season }) {
  const pillarsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (pillarsRef.current) {
      pillarsRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.2;
      });
    }
  });

  const seasonColor = SEASON_COLORS[season];
  const pillars = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 5;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        height: 1 + Math.random() * 2,
      };
    });
  }, []);

  return (
    <group ref={pillarsRef}>
      {pillars.map((pillar, i) => (
        <mesh key={i} position={[pillar.x, -3 + pillar.height / 2, pillar.z]}>
          <cylinderGeometry args={[0.15, 0.2, pillar.height, 6]} />
          <meshStandardMaterial
            color={seasonColor}
            emissive={seasonColor}
            emissiveIntensity={0.2}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main Scene Component
function CosmologicalScene({ 
  season, 
  visitedTiles, 
  selectedTile, 
  onTileClick 
}: {
  season: Season;
  visitedTiles: number[];
  selectedTile: number | null;
  onTileClick: (id: number) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      <TorusEnergyField season={season} />
      <ManifoldSpiral season={season} />
      <BoardTiles
        season={season}
        visitedTiles={visitedTiles}
        selectedTile={selectedTile}
        onTileClick={onTileClick}
      />
      <HexagramPillars season={season} />
      
      {/* Background stars */}
      <Stars />
      
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Stars background
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const radius = 30 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.1} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

interface Cosmological3DManifoldProps {
  season: Season;
  visitedTiles: number[];
  selectedTile: number | null;
  onTileClick: (id: number) => void;
  onClose: () => void;
}

const Cosmological3DManifold: React.FC<Cosmological3DManifoldProps> = ({
  season,
  visitedTiles,
  selectedTile,
  onTileClick,
  onClose,
}) => {
  const { playTileSound, initAudio } = useCosmologicalAudio();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [paperMode, setPaperMode] = useState(false);
  const lastSelectedTile = useRef<number | null>(null);

  // Initialize audio on user interaction
  const handleEnableAudio = () => {
    initAudio();
    setAudioEnabled(true);
  };

  // Play sound when tile changes
  useEffect(() => {
    if (audioEnabled && selectedTile && selectedTile !== lastSelectedTile.current) {
      playTileSound(selectedTile, season);
      lastSelectedTile.current = selectedTile;
    }
  }, [selectedTile, audioEnabled, playTileSound, season]);

  const handleTileClick = (id: number) => {
    if (audioEnabled) {
      playTileSound(id, season);
    }
    onTileClick(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-background via-background/80 to-transparent">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">Cosmological Manifold</h2>
          <span 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${SEASON_COLORS[season]}20`,
              color: SEASON_COLORS[season]
            }}
          >
            {season}
          </span>
          {!audioEnabled ? (
            <button
              onClick={handleEnableAudio}
              className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 hover:bg-primary/30 text-primary transition-colors flex items-center gap-1"
            >
              🔇 Enable Audio
            </button>
          ) : (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
              🔊 Audio On
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        >
          Exit Full Screen
        </button>
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 5, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(to bottom, #0a0a1a, #1a1a2e)' }}
      >
        <CosmologicalScene
          season={season}
          visitedTiles={visitedTiles}
          selectedTile={selectedTile}
          onTileClick={handleTileClick}
        />
      </Canvas>
      
      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end pointer-events-none">
        <div className="p-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 max-w-xs pointer-events-auto">
          <h3 className="text-sm font-semibold text-foreground mb-2">Controls</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Drag to rotate view</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Click tiles to select & hear tone</li>
            <li>• Each seal has a unique harmonic</li>
          </ul>
        </div>
        
        {selectedTile && (
          <div className="p-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 max-w-xs pointer-events-auto">
            <h3 className="text-sm font-semibold text-foreground mb-1">Selected Tile</h3>
            <p className="text-2xl font-bold" style={{ color: SEASON_COLORS[season] }}>
              #{selectedTile}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Row {Math.floor((selectedTile - 1) / 8) + 1}, Col {((selectedTile - 1) % 8) + 1}
            </p>
            {audioEnabled && (
              <p className="text-xs text-primary mt-2">♪ Playing harmonic tone</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cosmological3DManifold;
