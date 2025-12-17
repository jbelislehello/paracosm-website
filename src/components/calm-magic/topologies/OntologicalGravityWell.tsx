import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useGravitationalField, GravitationalMass, EntanglementLine } from '@/hooks/useGravitationalField';
import { useManifoldIntersection } from '@/hooks/useManifoldIntersection';
import { usePositionAudio } from '@/hooks/usePositionAudio';
import { QuadrantPosition, TrajectoryEvent } from '@/types/trajectory';
import { RingState } from '@/utils/ringToleranceSystem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Orbit, Sparkles, Waves, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { getSemanticMeaning, getShadowMeaning, getHigherSelfMeaning, describeGap } from '@/utils/tileSemanticMeaning';
import { 
  ManifoldPositionalityScene, 
  ManifoldMetricsDisplay 
} from './ManifoldPositionality';

// Gravitational mass visualization
function GravityMass({ mass, time }: { mass: GravitationalMass; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    switch (mass.type) {
      case 'shadow': return '#6366f1'; // Indigo vortex
      case 'higherSelf': return '#f59e0b'; // Amber beacon
      case 'current': return '#22c55e'; // Green presence
      default: return '#64748b'; // Slate for visited
    }
  }, [mass.type]);

  const scale = useMemo(() => {
    const base = mass.mass * 0.3;
    return mass.type === 'shadow' || mass.type === 'higherSelf' ? base * 1.5 : base;
  }, [mass.mass, mass.type]);

  useFrame(() => {
    if (meshRef.current) {
      // Pulsing animation based on mass type
      const pulseSpeed = mass.type === 'shadow' ? 2 : mass.type === 'higherSelf' ? 1.5 : 0.5;
      const pulseAmount = mass.type === 'shadow' || mass.type === 'higherSelf' ? 0.15 : 0.05;
      const pulse = 1 + Math.sin(time * pulseSpeed) * pulseAmount;
      meshRef.current.scale.setScalar(scale * pulse);
      
      // Rotation for visual interest
      if (mass.type === 'shadow') {
        meshRef.current.rotation.y = time * 0.5;
        meshRef.current.rotation.z = Math.sin(time) * 0.1;
      } else if (mass.type === 'higherSelf') {
        meshRef.current.rotation.y = -time * 0.3;
      }
    }
  });

  return (
    <group position={[mass.position.x * 2, 0, mass.position.y * 2]}>
      <mesh ref={meshRef}>
        {mass.type === 'shadow' ? (
          <torusGeometry args={[0.15, 0.05, 16, 32]} />
        ) : mass.type === 'higherSelf' ? (
          <octahedronGeometry args={[0.15, 0]} />
        ) : mass.type === 'current' ? (
          <sphereGeometry args={[0.12, 16, 16]} />
        ) : (
          <sphereGeometry args={[0.08, 8, 8]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={mass.type === 'shadow' || mass.type === 'higherSelf' ? 0.5 : 0.2}
          transparent
          opacity={mass.type === 'visited' ? 0.6 : 1}
        />
      </mesh>
      
      {/* Label for significant masses */}
      {mass.label && (
        <Html position={[0, 0.3, 0]} center>
          <Badge 
            variant="secondary" 
            className="text-[10px] whitespace-nowrap bg-background/80 backdrop-blur-sm"
          >
            {mass.label}
          </Badge>
        </Html>
      )}
      
      {/* Glow effect ring for shadow */}
      {mass.type === 'shadow' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.35, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Light rays for higher self */}
      {mass.type === 'higherSelf' && (
        <pointLight color={color} intensity={1} distance={2} />
      )}
    </group>
  );
}

// Force field lines visualization
function ForceFieldLines({ 
  fieldGrid, 
  showLines 
}: { 
  fieldGrid: ReturnType<typeof useGravitationalField>['fieldGrid'];
  showLines: boolean;
}) {
  if (!showLines) return null;
  
  const lines = useMemo(() => {
    const result: Array<{ points: THREE.Vector3[]; color: string }> = [];
    
    // Sample field at regular intervals to draw force arrows
    for (let i = 0; i < fieldGrid.length; i += 3) {
      for (let j = 0; j < fieldGrid[i].length; j += 3) {
        const point = fieldGrid[i][j];
        if (point.force.magnitude > 0.05) {
          const start = new THREE.Vector3(point.x * 2, 0.01, point.y * 2);
          const end = new THREE.Vector3(
            (point.x + point.force.x * 0.3) * 2,
            0.01,
            (point.y + point.force.y * 0.3) * 2
          );
          
          // Color based on magnitude
          const intensity = Math.min(1, point.force.magnitude * 2);
          const hue = (1 - intensity) * 240; // Blue to red
          
          result.push({
            points: [start, end],
            color: `hsl(${hue}, 70%, 50%)`,
          });
        }
      }
    }
    
    return result;
  }, [fieldGrid]);

  return (
    <group>
      {lines.map((line, idx) => (
        <Line
          key={idx}
          points={line.points}
          color={line.color}
          lineWidth={1}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  );
}

// Consciousness contour lines
function ConsciousnessContours({ 
  contours, 
  showContours 
}: { 
  contours: ReturnType<typeof useGravitationalField>['contours'];
  showContours: boolean;
}) {
  if (!showContours) return null;
  
  return (
    <group position={[0, 0.02, 0]}>
      {contours.map((contour, idx) => {
        if (contour.points.length < 3) return null;
        
        const points = contour.points.map(p => new THREE.Vector3(p.x * 2, 0, p.y * 2));
        
        return (
          <Line
            key={idx}
            points={points}
            color={contour.isThresholdLine ? '#f59e0b' : '#6366f1'}
            lineWidth={contour.isThresholdLine ? 3 : 1}
            transparent
            opacity={contour.isThresholdLine ? 0.8 : 0.3}
            dashed={!contour.isThresholdLine}
            dashSize={0.1}
            dashScale={1}
          />
        );
      })}
    </group>
  );
}

// Entanglement pulse lines between connected tiles
function EntanglementLines({ 
  lines, 
  showEntanglement,
  time 
}: { 
  lines: EntanglementLine[];
  showEntanglement: boolean;
  time: number;
}) {
  if (!showEntanglement || lines.length === 0) return null;

  return (
    <group position={[0, 0.03, 0]}>
      {lines.map((line, idx) => {
        const start = new THREE.Vector3(line.from.x * 2, 0, line.from.y * 2);
        const end = new THREE.Vector3(line.to.x * 2, 0, line.to.y * 2);
        
        // Create arc with control point above
        const mid = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5);
        mid.y = 0.2 + line.strength * 0.3;
        
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(20);
        
        // Pulse animation
        const pulse = Math.sin(time * 2 + line.pulsePhase) * 0.5 + 0.5;
        const opacity = 0.3 + pulse * 0.4 * line.strength;
        
        return (
          <Line
            key={idx}
            points={points}
            color="#a855f7"
            lineWidth={1 + line.strength * 2}
            transparent
            opacity={opacity}
          />
        );
      })}
    </group>
  );
}

// Prophecy gap visualization (line between shadow and higher self)
function ProphecyGapLine({
  shadowPosition,
  higherSelfPosition,
  time,
}: {
  shadowPosition: QuadrantPosition | null;
  higherSelfPosition: QuadrantPosition | null;
  time: number;
}) {
  if (!shadowPosition || !higherSelfPosition) return null;

  const start = new THREE.Vector3(shadowPosition.x * 2, 0.1, shadowPosition.y * 2);
  const end = new THREE.Vector3(higherSelfPosition.x * 2, 0.1, higherSelfPosition.y * 2);
  
  // Arc above the plane
  const mid = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);
  mid.y = 0.5;
  
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(30);
  
  // Animated dash
  const dashOffset = time * 0.5;
  
  return (
    <Line
      points={points}
      color="#f59e0b"
      lineWidth={2}
      dashed
      dashSize={0.15}
      dashScale={1}
      dashOffset={dashOffset}
    />
  );
}

// Grid floor
function GridFloor() {
  return (
    <group position={[0, -0.01, 0]}>
      <gridHelper 
        args={[4, 8, '#334155', '#1e293b']} 
        rotation={[0, 0, 0]}
      />
      
      {/* Quadrant labels */}
      <Html position={[-1.5, 0, -1.5]} center>
        <span className="text-xs text-muted-foreground/50">SM</span>
      </Html>
      <Html position={[1.5, 0, -1.5]} center>
        <span className="text-xs text-muted-foreground/50">IM</span>
      </Html>
      <Html position={[-1.5, 0, 1.5]} center>
        <span className="text-xs text-muted-foreground/50">SN</span>
      </Html>
      <Html position={[1.5, 0, 1.5]} center>
        <span className="text-xs text-muted-foreground/50">IN</span>
      </Html>
      
      {/* Axis labels */}
      <Html position={[0, 0, -2.3]} center>
        <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Memory</span>
      </Html>
      <Html position={[0, 0, 2.3]} center>
        <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Novelty</span>
      </Html>
      <Html position={[-2.3, 0, 0]} center>
        <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Sovereignty</span>
      </Html>
      <Html position={[2.3, 0, 0]} center>
        <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Intimacy</span>
      </Html>
    </group>
  );
}

// Scene component with animation
function GravityWellScene({
  masses,
  fieldGrid,
  contours,
  entanglementLines,
  shadowPosition,
  higherSelfPosition,
  showForceLines,
  showContours,
  showEntanglement,
  showManifolds,
  intersectionResult,
  positionalityState,
}: {
  masses: GravitationalMass[];
  fieldGrid: ReturnType<typeof useGravitationalField>['fieldGrid'];
  contours: ReturnType<typeof useGravitationalField>['contours'];
  entanglementLines: EntanglementLine[];
  shadowPosition: QuadrantPosition | null;
  higherSelfPosition: QuadrantPosition | null;
  showForceLines: boolean;
  showContours: boolean;
  showEntanglement: boolean;
  showManifolds: boolean;
  intersectionResult: ReturnType<typeof useManifoldIntersection>['intersectionResult'] | null;
  positionalityState: ReturnType<typeof useManifoldIntersection>['positionalityState'] | null;
}) {
  const [time, setTime] = useState(0);
  
  useFrame((state) => {
    setTime(state.clock.elapsedTime);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, 5, -5]} intensity={0.3} />
      
      <GridFloor />
      
      <ForceFieldLines fieldGrid={fieldGrid} showLines={showForceLines} />
      <ConsciousnessContours contours={contours} showContours={showContours} />
      <EntanglementLines lines={entanglementLines} showEntanglement={showEntanglement} time={time} />
      <ProphecyGapLine 
        shadowPosition={shadowPosition} 
        higherSelfPosition={higherSelfPosition}
        time={time}
      />
      
      {/* Manifold Positionality System */}
      {showManifolds && intersectionResult && positionalityState && (
        <ManifoldPositionalityScene
          intersectionResult={intersectionResult}
          positionalityState={positionalityState}
          shadowPosition={shadowPosition}
          higherSelfPosition={higherSelfPosition}
          time={time}
        />
      )}
      
      {masses.map((mass, idx) => (
        <GravityMass key={`${mass.type}-${idx}`} mass={mass} time={time} />
      ))}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

interface OntologicalGravityWellProps {
  currentPosition: { row: number; col: number } | null;
  shadowPosition: QuadrantPosition | null;
  higherSelfPosition: QuadrantPosition | null;
  visitedTiles: Set<string>;
  polenDensity: Map<string, number>;
  weavingConnections: Array<{
    sourceRow: number;
    sourceCol: number;
    targetRow: number;
    targetCol: number;
    strength: number;
  }>;
  consciousnessScore?: number;
  ringStates?: RingState[];
  trajectoryLog?: TrajectoryEvent[];
}

export function OntologicalGravityWell({
  currentPosition,
  shadowPosition,
  higherSelfPosition,
  visitedTiles,
  polenDensity,
  weavingConnections,
  consciousnessScore = 0,
  ringStates = [],
  trajectoryLog = [],
}: OntologicalGravityWellProps) {
  const [showForceLines, setShowForceLines] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [showEntanglement, setShowEntanglement] = useState(true);
  const [showManifolds, setShowManifolds] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);

  const consciousnessThreshold = 0.7;
  const hasReachedThreshold = consciousnessScore >= consciousnessThreshold;

  const {
    masses,
    fieldGrid,
    contours,
    entanglementLines,
    prophesyGap,
    tileToCoord,
  } = useGravitationalField(
    currentPosition,
    shadowPosition,
    higherSelfPosition,
    visitedTiles,
    polenDensity,
    weavingConnections,
    consciousnessThreshold
  );

  // Legend visibility state
  const [showLegend, setShowLegend] = useState(true);

  // Manifold intersection prediction
  const { intersectionResult, positionalityState } = useManifoldIntersection({
    shadowPosition,
    higherSelfPosition,
    trajectoryLog,
    ringStates,
    visitedTiles,
    weavingConnections
  });

  const { playPosition, setVolume } = usePositionAudio({
    baseFrequency: 220,
    enabled: audioEnabled,
    volume: audioVolume,
  });

  // Play position sound when current position changes
  useEffect(() => {
    if (audioEnabled && currentPosition) {
      const coord = tileToCoord(currentPosition.row, currentPosition.col);
      const density = polenDensity.get(`${currentPosition.row}-${currentPosition.col}`) || 0;
      playPosition(coord.x, coord.y, density / 5);
    }
  }, [currentPosition, audioEnabled, tileToCoord, polenDensity, playPosition]);

  // Update volume
  useEffect(() => {
    setVolume(audioVolume);
  }, [audioVolume, setVolume]);

  // Generate semantic insight about current state
  const semanticInsight = useMemo(() => {
    if (!currentPosition) return null;
    
    const meaning = getSemanticMeaning(currentPosition.row, currentPosition.col);
    const shadowMeaning = getShadowMeaning(shadowPosition || undefined);
    const higherSelfMeaning = getHigherSelfMeaning(higherSelfPosition || undefined);
    const gapDescription = describeGap(shadowPosition || undefined, higherSelfPosition || undefined);
    
    return { meaning, shadowMeaning, higherSelfMeaning, gapDescription };
  }, [currentPosition, shadowPosition, higherSelfPosition]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Controls overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={showForceLines ? "default" : "outline"}
            size="sm"
            onClick={() => setShowForceLines(!showForceLines)}
            className="text-xs gap-1"
          >
            <Waves className="w-3 h-3" />
            Force Field
          </Button>
          <Button
            variant={showContours ? "default" : "outline"}
            size="sm"
            onClick={() => setShowContours(!showContours)}
            className="text-xs gap-1"
          >
            <Orbit className="w-3 h-3" />
            Contours
          </Button>
          <Button
            variant={showEntanglement ? "default" : "outline"}
            size="sm"
            onClick={() => setShowEntanglement(!showEntanglement)}
            className="text-xs gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Entanglement
          </Button>
          <Button
            variant={showManifolds ? "default" : "outline"}
            size="sm"
            onClick={() => setShowManifolds(!showManifolds)}
            className="text-xs gap-1"
          >
            <Maximize2 className="w-3 h-3" />
            Manifolds
          </Button>
        </div>
        
        {/* Audio controls */}
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
          {audioEnabled && (
            <Slider
              value={[audioVolume]}
              onValueChange={([v]) => setAudioVolume(v)}
              max={1}
              step={0.05}
              className="w-20"
            />
          )}
          <span className="text-xs text-muted-foreground">
            {audioEnabled ? 'Position Audio' : 'Sound Off'}
          </span>
        </div>
      </div>

      {/* Consciousness threshold indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className={`w-3 h-3 rounded-full ${
                hasReachedThreshold ? 'bg-amber-500 animate-pulse' : 'bg-muted'
              }`}
            />
            <span className="text-xs font-medium">
              Consciousness Level
            </span>
          </div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-500"
              style={{ width: `${consciousnessScore * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {Math.round(consciousnessScore * 100)}% / {Math.round(consciousnessThreshold * 100)}% threshold
          </span>
        </div>
      </div>

      {/* Semantic insight panel with toggle */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-4">
        {semanticInsight && showLegend && (
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xl transition-all duration-300">
            <p className="text-xs text-muted-foreground mb-1">Current Position</p>
            <p className="text-sm italic text-foreground/80 mb-3">
              {semanticInsight.meaning}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground mb-1">Shadow (Where You Are)</p>
                <p className="text-foreground/70">{semanticInsight.shadowMeaning}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Higher Self (Where You Aspire)</p>
                <p className="text-foreground/70">{semanticInsight.higherSelfMeaning}</p>
              </div>
            </div>
            
            {prophesyGap && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  {semanticInsight.gapDescription}
                </p>
                <p className="text-[10px] text-primary/60 mt-1">
                  Distance: {(prophesyGap.distance * 100).toFixed(0)}% of field
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Legend toggle button */}
        {semanticInsight && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
            className="text-xs gap-1 bg-background/80 backdrop-blur-sm shrink-0"
          >
            {showLegend ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            {showLegend ? 'Hide' : 'Show'} Legend
          </Button>
        )}
      </div>

      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 4, 4], fov: 50 }}
        className="bg-gradient-to-b from-background to-muted/30"
      >
        <GravityWellScene
          masses={masses}
          fieldGrid={fieldGrid}
          contours={contours}
          entanglementLines={entanglementLines}
          shadowPosition={shadowPosition}
          higherSelfPosition={higherSelfPosition}
          showForceLines={showForceLines}
          showContours={showContours}
          showEntanglement={showEntanglement}
          showManifolds={showManifolds}
          intersectionResult={intersectionResult}
          positionalityState={positionalityState}
        />
      </Canvas>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span>Shadow (Gravitational Vortex)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rotate-45 bg-amber-500" />
            <span>Higher Self (Beacon Star)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Current Position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500 opacity-60" />
            <span>Visited Tiles</span>
          </div>
          {showEntanglement && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-purple-500" />
              <span>Semantic Entanglement</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
