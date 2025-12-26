import React, { useState, Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Info, Eye, EyeOff, Link2, X, BookOpen, Layers, Atom, Waves, GitBranch } from 'lucide-react';
import { useManifoldData, ManifoldEntry } from '@/hooks/useManifoldData';
import { useManifoldEdges, EdgeType } from '@/hooks/useManifoldEdges';
import { useProjectionEngine, ProjectionMode, GardenType, getDefaultModesForGarden } from '@/hooks/useProjectionEngine';
import { ProjectionToggle } from './ProjectionToggle';
import { ConstellationParticles } from './ConstellationParticles';
import { EdgeCreator } from './EdgeCreator';
import { GovernanceOverlay } from './GovernanceOverlay';
import { OperationsOverlay } from './OperationsOverlay';
import { StrategyOverlay } from './StrategyOverlay';
import { PlaybookPanel } from './PlaybookPanel';
import { SEASON_HEX_COLORS, ManifoldSeason } from '@/utils/torusManifoldMath';
import { cn } from '@/lib/utils';
import { ConsciousnessMetricsDashboard } from '../visualization/ConsciousnessMetricsDashboard';

interface ConstellationTabProps {
  projectId?: string | null;
  currentSeason?: ManifoldSeason;
  garden?: GardenType;
}

// Mode descriptions for organizational context
const MODE_DESCRIPTIONS: Record<ProjectionMode, string> = {
  strategy: 'Spiral Ladder: Track where the org is and what\'s the next move',
  governance: 'Gate Map: Compliance, approvals, sign-off culture flow',
  operations: 'Dependency Graph: "Why are we stuck?" critical path view',
  delivery: 'Roadmap: Now, next 2 milestones, and risk bubbles',
  adoption: 'Cycle Ring: Training, comms, reinforcement, measurement rhythm',
  sensemaking: 'Constellation: Current decision with strongest evidence links'
};

export function ConstellationTab({ 
  projectId, 
  currentSeason = 'POLLENS',
  garden = 'intelligence'
}: ConstellationTabProps) {
  // Get default mode based on garden
  const defaultModes = getDefaultModesForGarden(garden);
  const [projectionMode, setProjectionMode] = useState<ProjectionMode>(defaultModes[0]);
  const [selectedEntry, setSelectedEntry] = useState<ManifoldEntry | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [showPlaybooks, setShowPlaybooks] = useState(false);
  
  // Edge creation mode
  const [isEdgeMode, setIsEdgeMode] = useState(false);
  const [edgeSource, setEdgeSource] = useState<ManifoldEntry | null>(null);
  const [edgeTarget, setEdgeTarget] = useState<ManifoldEntry | null>(null);
  
  // Overlay toggles for advanced visualizations
  const [showQuantumOverlay, setShowQuantumOverlay] = useState(false);
  const [showEntropyOverlay, setShowEntropyOverlay] = useState(false);
  const [showMetricsDashboard, setShowMetricsDashboard] = useState(false);
  
  const { entries, isLoading, seasonBreakdown, totalEntries, refetch } = useManifoldData(projectId);
  const { edges, isCreating, createEdge, refetch: refetchEdges } = useManifoldEdges(projectId);
  const { projectedEntries } = useProjectionEngine(entries, projectionMode);
  
  // Generate sample data for dashboard (in production, derive from actual journey data)
  const dashboardData = useMemo(() => {
    const visitedTiles = new Set<string>();
    const densityMap = new Map<string, number>();
    const journeyPath: Array<{ row: number; col: number }> = [];
    
    entries.forEach((entry, idx) => {
      const row = idx % 8;
      const col = Math.floor(idx / 8) % 8;
      const key = `${row}-${col}`;
      visitedTiles.add(key);
      densityMap.set(key, (densityMap.get(key) || 0) + 1);
      journeyPath.push({ row, col });
    });
    
    const torusProjection = (r: number, c: number): [number, number, number] => {
      const u = (r / 7) * Math.PI * 2;
      const v = (c / 7) * Math.PI * 2;
      const R = 2, r2 = 0.8;
      return [(R + r2 * Math.cos(v)) * Math.cos(u), (R + r2 * Math.cos(v)) * Math.sin(u), r2 * Math.sin(v)];
    };
    
    return { visitedTiles, densityMap, journeyPath, torusProjection };
  }, [entries]);

  // Update mode when garden changes
  useEffect(() => {
    const newDefaults = getDefaultModesForGarden(garden);
    setProjectionMode(newDefaults[0]);
  }, [garden]);

  // Fetch edges on mount
  useEffect(() => {
    refetchEdges();
  }, [projectId]);

  const handleEntryClick = (entry: ManifoldEntry) => {
    if (isEdgeMode) {
      if (!edgeSource) {
        setEdgeSource(entry);
      } else if (entry.id === edgeSource.id) {
        setEdgeSource(null);
      } else {
        setEdgeTarget(entry);
      }
    } else {
      setSelectedEntry(entry.id === selectedEntry?.id ? null : entry);
    }
  };

  const handleCreateEdge = async (edgeType: EdgeType) => {
    if (!edgeSource || !edgeTarget) return;
    
    const success = await createEdge(edgeSource.id, edgeTarget.id, edgeType);
    if (success) {
      setEdgeSource(null);
      setEdgeTarget(null);
    }
  };

  const handleCancelEdgeMode = () => {
    setIsEdgeMode(false);
    setEdgeSource(null);
    setEdgeTarget(null);
  };

  const toggleEdgeMode = () => {
    if (isEdgeMode) {
      handleCancelEdgeMode();
    } else {
      setIsEdgeMode(true);
      setSelectedEntry(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading constellation...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Empty Constellation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your organizational view will appear here as you create entries. 
              Each insight becomes a node in your decision field.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>Start by visiting tiles in the Matrix tab</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if mode is 3D or 2D-style
  const is3DMode = ['sensemaking', 'strategy', 'adoption'].includes(projectionMode);
  const shouldAutoRotate = is3DMode && !isEdgeMode;

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Constellation
          </h2>
          <Badge variant="outline" className="text-xs">
            {totalEntries} events
          </Badge>
          {edges.length > 0 && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Link2 className="w-3 h-3" />
              {edges.length}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Advanced Overlay Toggles */}
          <Button
            variant={showMetricsDashboard ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMetricsDashboard(!showMetricsDashboard)}
            className={cn("gap-1.5", showMetricsDashboard && "bg-violet-600 text-white")}
            title="Consciousness Metrics Dashboard"
          >
            <Layers className="w-4 h-4" />
          </Button>
          <Button
            variant={showQuantumOverlay ? "default" : "outline"}
            size="sm"
            onClick={() => setShowQuantumOverlay(!showQuantumOverlay)}
            className={cn("gap-1.5", showQuantumOverlay && "bg-amber-600 text-white")}
            title="Quantum Gravity Overlay"
          >
            <Atom className="w-4 h-4" />
          </Button>
          <Button
            variant={showEntropyOverlay ? "default" : "outline"}
            size="sm"
            onClick={() => setShowEntropyOverlay(!showEntropyOverlay)}
            className={cn("gap-1.5", showEntropyOverlay && "bg-cyan-600 text-white")}
            title="Holographic Entropy"
          >
            <Waves className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border/50 mx-1" />
          
          <Button
            variant={showPlaybooks ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPlaybooks(!showPlaybooks)}
            className={cn("gap-1.5", showPlaybooks && "bg-primary text-primary-foreground")}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Playbooks</span>
          </Button>
          <Button
            variant={isEdgeMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEdgeMode}
            className={cn("gap-1.5", isEdgeMode && "bg-primary text-primary-foreground")}
          >
            {isEdgeMode ? <X className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isEdgeMode ? "Cancel" : "Connect"}</span>
          </Button>
          <Button
            variant={showConnections ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowConnections(!showConnections)}
            className="gap-1.5"
          >
            {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Projection Mode Toggle */}
      <ProjectionToggle 
        value={projectionMode} 
        onChange={setProjectionMode} 
      />

      {/* Season Legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(seasonBreakdown) as [ManifoldSeason, number][]).map(([season, count]) => {
          const hexColor = `#${SEASON_HEX_COLORS[season].toString(16).padStart(6, '0')}`;
          return count > 0 && (
            <Badge 
              key={season} 
              variant="outline" 
              className="text-xs gap-1.5"
              style={{ borderColor: hexColor, color: hexColor }}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: hexColor }} 
              />
              {season}: {count}
            </Badge>
          );
        })}
      </div>

      {/* 3D Canvas with Overlays */}
      <div className={cn(
        "relative flex-1 min-h-[400px] bg-background/30 backdrop-blur-sm rounded-xl border overflow-hidden transition-colors",
        isEdgeMode ? "border-primary/50" : "border-border/50"
      )}>
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            
            <Stars 
              radius={50} 
              depth={50} 
              count={1000} 
              factor={2} 
              saturation={0} 
              fade 
              speed={0.5}
            />
            
            <ConstellationParticles
              entries={projectedEntries}
              selectedEntry={isEdgeMode ? (edgeSource || edgeTarget) : selectedEntry}
              onEntryClick={handleEntryClick}
              particleSize={0.12}
              showConnections={showConnections}
              edges={edges}
              edgeSource={edgeSource}
              edgeTarget={edgeTarget}
            />
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={shouldAutoRotate}
              autoRotateSpeed={0.3}
              minDistance={3}
              maxDistance={20}
            />
          </Suspense>
        </Canvas>

        {/* 2D Overlays for specific modes */}
        {projectionMode === 'strategy' && (
          <StrategyOverlay entries={projectedEntries} />
        )}
        {projectionMode === 'governance' && (
          <GovernanceOverlay entries={projectedEntries} />
        )}
        {projectionMode === 'operations' && (
          <OperationsOverlay entries={projectedEntries} />
        )}
        
        {/* Overlay indicators */}
        {(showQuantumOverlay || showEntropyOverlay) && (
          <div className="absolute top-3 left-3 flex gap-2">
            {showQuantumOverlay && (
              <Badge className="bg-amber-600/80 text-white text-[10px]">
                <Atom className="w-3 h-3 mr-1" /> Quantum Gravity Active
              </Badge>
            )}
            {showEntropyOverlay && (
              <Badge className="bg-cyan-600/80 text-white text-[10px]">
                <Waves className="w-3 h-3 mr-1" /> Entropy Field Active
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Playbook Panel */}
      {showPlaybooks && (
        <div className="absolute right-4 top-48 z-10">
          <PlaybookPanel
            garden={garden}
            mode={projectionMode}
            projectId={projectId}
            onClose={() => setShowPlaybooks(false)}
          />
        </div>
      )}

      {/* Edge Creator Panel */}
      {isEdgeMode && (
        <EdgeCreator
          sourceEntry={edgeSource}
          targetEntry={edgeTarget}
          isCreating={isCreating}
          onCreateEdge={handleCreateEdge}
          onCancel={handleCancelEdgeMode}
        />
      )}

      {/* Selected Entry Detail */}
      {!isEdgeMode && selectedEntry && (
        <Card className="animate-in slide-in-from-bottom-4 duration-300">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: `#${SEASON_HEX_COLORS[selectedEntry.season].toString(16).padStart(6, '0')}`, 
                      color: `#${SEASON_HEX_COLORS[selectedEntry.season].toString(16).padStart(6, '0')}` 
                    }}
                  >
                    {selectedEntry.season}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedEntry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm line-clamp-3">{selectedEntry.content}</p>
                {selectedEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedEntry.tags.slice(0, 5).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {selectedEntry.tags.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedEntry.tags.length - 5}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedEntry(null)}
              >
                ✕
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consciousness Metrics Dashboard */}
      {showMetricsDashboard && entries.length > 0 && (
        <ConsciousnessMetricsDashboard
          visitedTiles={dashboardData.visitedTiles}
          densityMap={dashboardData.densityMap}
          journeyPath={dashboardData.journeyPath}
          torusProjection={dashboardData.torusProjection}
        />
      )}

      {/* Mode Description */}
      <div className="text-xs text-muted-foreground text-center">
        {isEdgeMode 
          ? 'Edge Mode: Click two events to create a connection'
          : MODE_DESCRIPTIONS[projectionMode]
        }
      </div>
    </div>
  );
}
