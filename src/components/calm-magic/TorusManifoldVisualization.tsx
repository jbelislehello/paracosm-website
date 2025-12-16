import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { X, Maximize2, Minimize2, Info, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useManifoldData, ManifoldEntry } from '@/hooks/useManifoldData';
import { DistortedTorus } from './manifold/DistortedTorus';
import { InsightParticles, ConnectionLines } from './manifold/InsightParticles';
import { ManifoldControls } from './manifold/ManifoldControls';
import { JourneyPathCamera, JourneyPathLine } from './manifold/JourneyPathCamera';
import { SemanticConnectionLines } from './manifold/SemanticConnectionLines';
import { useSemanticConnections, SemanticConnection } from '@/hooks/useSemanticConnections';
import { ManifoldSeason, SEASON_COLORS } from '@/utils/torusManifoldMath';
import { useCosmologicalAudio } from '@/hooks/useCosmologicalAudio';
import { useMode } from './context/ModeContext';
import { getTerminology } from '@/data/modeAwareTerminology';

interface TorusManifoldVisualizationProps {
  onClose: () => void;
}

// Animated camera for fly-through
function FlyThroughCamera({ isAnimating }: { isAnimating: boolean }) {
  const { camera } = useThree();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!isAnimating) return;

    timeRef.current += delta * 0.1;
    const t = timeRef.current;

    // Orbit around the torus
    const radius = 8;
    camera.position.x = Math.cos(t) * radius;
    camera.position.y = Math.sin(t * 0.3) * 3;
    camera.position.z = Math.sin(t) * radius;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Ambient lighting setup
function ManifoldLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#8888ff" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ff8844" />
    </>
  );
}

// Info tooltip for selected entry
function EntryTooltip({ entry, onClose }: { entry: ManifoldEntry; onClose: () => void }) {
  return (
    <Html position={[entry.x, entry.y + 0.3, entry.z]} center>
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 max-w-xs shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: SEASON_COLORS[entry.season], color: 'white' }}
          >
            {entry.season}
          </span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </div>
        <p className="text-sm line-clamp-3">{entry.content}</p>
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {entry.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Tile: Row {entry.row}, Col {entry.col}
        </p>
      </div>
    </Html>
  );
}

// Main 3D scene
function ManifoldScene({
  densityMap,
  entries,
  showCurvature,
  showSeasonColors,
  showWireframe,
  showParticles,
  showConnections,
  showSemanticConnections,
  showJourneyPath,
  isJourneyPlaying,
  journeySpeed,
  opacity,
  isAnimating,
  selectedEntry,
  setSelectedEntry,
  audioEnabled,
  semanticConnections,
  hoveredConnection,
  setHoveredConnection,
  onJourneyWaypoint,
  onJourneyComplete
}: {
  densityMap: Map<string, number>;
  entries: ManifoldEntry[];
  showCurvature: boolean;
  showSeasonColors: boolean;
  showWireframe: boolean;
  showParticles: boolean;
  showConnections: boolean;
  showSemanticConnections: boolean;
  showJourneyPath: boolean;
  isJourneyPlaying: boolean;
  journeySpeed: number;
  opacity: number;
  isAnimating: boolean;
  selectedEntry: ManifoldEntry | null;
  setSelectedEntry: (entry: ManifoldEntry | null) => void;
  audioEnabled: boolean;
  semanticConnections: SemanticConnection[];
  hoveredConnection: SemanticConnection | null;
  setHoveredConnection: (conn: SemanticConnection | null) => void;
  onJourneyWaypoint?: (entry: ManifoldEntry, index: number) => void;
  onJourneyComplete?: () => void;
}) {
  return (
    <>
      <ManifoldLighting />
      
      {/* Journey path camera (replaces orbit fly-through when playing) */}
      {isJourneyPlaying ? (
        <JourneyPathCamera
          entries={entries}
          isPlaying={isJourneyPlaying}
          speed={journeySpeed}
          onWaypoint={onJourneyWaypoint}
          onComplete={onJourneyComplete}
        />
      ) : (
        <FlyThroughCamera isAnimating={isAnimating} />
      )}

      {/* The distorted torus surface */}
      <DistortedTorus
        densityMap={densityMap}
        showCurvature={showCurvature}
        showSeasonColors={showSeasonColors}
        opacity={opacity}
        wireframe={showWireframe}
      />

      {/* Journey path visualization */}
      {showJourneyPath && entries.length >= 2 && (
        <JourneyPathLine entries={entries} color="#fbbf24" opacity={0.7} lineWidth={2} />
      )}

      {/* Insight particles */}
      {showParticles && (
        <InsightParticles
          entries={entries}
          selectedEntry={selectedEntry}
          onEntryClick={setSelectedEntry}
        />
      )}

      {/* Tag-based connection lines */}
      <ConnectionLines entries={entries} showConnections={showConnections} />

      {/* Semantic similarity connections */}
      {showSemanticConnections && (
        <SemanticConnectionLines
          entries={entries}
          connections={semanticConnections}
          showConnections={showSemanticConnections}
          hoveredConnection={hoveredConnection}
          onConnectionHover={setHoveredConnection}
        />
      )}

      {/* Selected entry tooltip */}
      {selectedEntry && (
        <EntryTooltip entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}

      {/* Background stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />

      {/* Orbit controls when not animating or journey playing */}
      {!isAnimating && !isJourneyPlaying && (
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={20}
        />
      )}
    </>
  );
}

export function TorusManifoldVisualization({ onClose }: TorusManifoldVisualizationProps) {
  const {
    dataPoints,
    entries,
    densityMap,
    isLoading,
    totalEntries,
    seasonBreakdown,
    maxDensity
  } = useManifoldData();

  const { mode } = useMode();
  const terms = getTerminology(mode);

  // Visualization state
  const [showCurvature, setShowCurvature] = useState(false);
  const [showSeasonColors, setShowSeasonColors] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [showConnections, setShowConnections] = useState(false);
  const [showSemanticConnections, setShowSemanticConnections] = useState(false);
  const [showJourneyPath, setShowJourneyPath] = useState(true);
  const [isJourneyPlaying, setIsJourneyPlaying] = useState(false);
  const [journeySpeed, setJourneySpeed] = useState(1);
  const [opacity, setOpacity] = useState(0.6);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ManifoldEntry | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<SemanticConnection | null>(null);

  // Semantic connections
  const { connections: semanticConnections } = useSemanticConnections(entries, 0.3);

  const { playTileSound } = useCosmologicalAudio();

  const handleJourneyWaypoint = (entry: ManifoldEntry, index: number) => {
    // Audio feedback disabled for journey waypoints as playTileSound expects Season type
    setSelectedEntry(entry);
  };

  const handleJourneyComplete = () => {
    setIsJourneyPlaying(false);
    setSelectedEntry(null);
  };

  const handleReset = () => {
    setShowCurvature(false);
    setShowSeasonColors(true);
    setShowWireframe(false);
    setShowParticles(true);
    setShowConnections(false);
    setShowSemanticConnections(false);
    setShowJourneyPath(true);
    setIsJourneyPlaying(false);
    setJourneySpeed(1);
    setOpacity(0.6);
    setIsAnimating(false);
    setSelectedEntry(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`fixed inset-0 bg-background z-50 flex flex-col ${
        isFullscreen ? '' : 'p-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">{terms.torusManifold} Visualization</h2>
          {isLoading && (
            <span className="text-sm text-muted-foreground animate-pulse">
              Loading manifold data...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="absolute right-4 top-20 w-80 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 z-10">
          <h3 className="font-semibold mb-2">About the Manifold</h3>
          <p className="text-sm text-muted-foreground mb-3">
            This torus represents your entire journey across all tiles and seasons.
            Each point of light is an insight you've captured.
          </p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">θ (around the hole):</strong> Maps the 8 columns
            </li>
            <li>
              <strong className="text-foreground">φ (around the tube):</strong> Maps 5 seasons × 8 rows
            </li>
            <li>
              <strong className="text-foreground">Bulges:</strong> Areas with high insight density
            </li>
            <li>
              <strong className="text-foreground">Curvature:</strong> Blue=convex, Red=saddle points
            </li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Max density: {maxDensity} insights on a single tile
          </p>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [8, 4, 8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <ManifoldScene
              densityMap={densityMap}
              entries={entries}
              showCurvature={showCurvature}
              showSeasonColors={showSeasonColors}
              showWireframe={showWireframe}
              showParticles={showParticles}
              showConnections={showConnections}
              showSemanticConnections={showSemanticConnections}
              showJourneyPath={showJourneyPath}
              isJourneyPlaying={isJourneyPlaying}
              journeySpeed={journeySpeed}
              opacity={opacity}
              isAnimating={isAnimating}
              selectedEntry={selectedEntry}
              setSelectedEntry={setSelectedEntry}
              audioEnabled={audioEnabled}
              semanticConnections={semanticConnections}
              hoveredConnection={hoveredConnection}
              setHoveredConnection={setHoveredConnection}
              onJourneyWaypoint={handleJourneyWaypoint}
              onJourneyComplete={handleJourneyComplete}
            />
          </Suspense>
        </Canvas>

        {/* Controls panel */}
        <ManifoldControls
          showCurvature={showCurvature}
          setShowCurvature={setShowCurvature}
          showSeasonColors={showSeasonColors}
          setShowSeasonColors={setShowSeasonColors}
          showWireframe={showWireframe}
          setShowWireframe={setShowWireframe}
          showParticles={showParticles}
          setShowParticles={setShowParticles}
          showConnections={showConnections}
          setShowConnections={setShowConnections}
          showSemanticConnections={showSemanticConnections}
          setShowSemanticConnections={setShowSemanticConnections}
          showJourneyPath={showJourneyPath}
          setShowJourneyPath={setShowJourneyPath}
          isJourneyPlaying={isJourneyPlaying}
          setIsJourneyPlaying={setIsJourneyPlaying}
          journeySpeed={journeySpeed}
          setJourneySpeed={setJourneySpeed}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          opacity={opacity}
          setOpacity={setOpacity}
          seasonBreakdown={seasonBreakdown}
          totalEntries={totalEntries}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
