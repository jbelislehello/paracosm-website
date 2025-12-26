import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Info, Eye, EyeOff, Link2, X } from 'lucide-react';
import { useManifoldData, ManifoldEntry } from '@/hooks/useManifoldData';
import { useManifoldEdges, EdgeType } from '@/hooks/useManifoldEdges';
import { useProjectionEngine, ProjectionMode } from '@/hooks/useProjectionEngine';
import { ProjectionToggle } from './ProjectionToggle';
import { ConstellationParticles } from './ConstellationParticles';
import { EdgeCreator } from './EdgeCreator';
import { SEASON_HEX_COLORS, ManifoldSeason } from '@/utils/torusManifoldMath';
import { cn } from '@/lib/utils';

interface ConstellationTabProps {
  projectId?: string | null;
  currentSeason?: ManifoldSeason;
}

export function ConstellationTab({ projectId, currentSeason = 'POLLENS' }: ConstellationTabProps) {
  const [projectionMode, setProjectionMode] = useState<ProjectionMode>('kairos');
  const [selectedEntry, setSelectedEntry] = useState<ManifoldEntry | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  
  // Edge creation mode
  const [isEdgeMode, setIsEdgeMode] = useState(false);
  const [edgeSource, setEdgeSource] = useState<ManifoldEntry | null>(null);
  const [edgeTarget, setEdgeTarget] = useState<ManifoldEntry | null>(null);
  
  const { entries, isLoading, seasonBreakdown, totalEntries, refetch } = useManifoldData(projectId);
  const { edges, isCreating, createEdge, refetch: refetchEdges } = useManifoldEdges(projectId);
  const { projectedEntries } = useProjectionEngine(entries, projectionMode);

  // Fetch edges on mount
  useEffect(() => {
    refetchEdges();
  }, [projectId]);

  const handleEntryClick = (entry: ManifoldEntry) => {
    if (isEdgeMode) {
      // Edge creation mode
      if (!edgeSource) {
        setEdgeSource(entry);
      } else if (entry.id === edgeSource.id) {
        // Clicked same entry, deselect
        setEdgeSource(null);
      } else {
        setEdgeTarget(entry);
      }
    } else {
      // Normal selection mode
      setSelectedEntry(entry.id === selectedEntry?.id ? null : entry);
    }
  };

  const handleCreateEdge = async (edgeType: EdgeType) => {
    if (!edgeSource || !edgeTarget) return;
    
    const success = await createEdge(edgeSource.id, edgeTarget.id, edgeType);
    if (success) {
      setEdgeSource(null);
      setEdgeTarget(null);
      // Stay in edge mode for creating more connections
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
              Your constellation will appear here as you create fragments in the Matrix. 
              Each insight becomes a star in your personal event field.
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
              {edges.length} connections
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
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
            <span className="hidden sm:inline">Lines</span>
          </Button>
          <ProjectionToggle 
            value={projectionMode} 
            onChange={setProjectionMode} 
          />
        </div>
      </div>

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

      {/* 3D Canvas */}
      <div className={cn(
        "flex-1 min-h-[400px] bg-background/30 backdrop-blur-sm rounded-xl border overflow-hidden transition-colors",
        isEdgeMode ? "border-primary/50" : "border-border/50"
      )}>
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {/* Ambient lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            
            {/* Background stars */}
            <Stars 
              radius={50} 
              depth={50} 
              count={1000} 
              factor={2} 
              saturation={0} 
              fade 
              speed={0.5}
            />
            
            {/* Main constellation particles */}
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
            
            {/* Camera controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={projectionMode !== 'chronos' && !isEdgeMode}
              autoRotateSpeed={0.3}
              minDistance={3}
              maxDistance={20}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Edge Creator Panel (when in edge mode) */}
      {isEdgeMode && (
        <EdgeCreator
          sourceEntry={edgeSource}
          targetEntry={edgeTarget}
          isCreating={isCreating}
          onCreateEdge={handleCreateEdge}
          onCancel={handleCancelEdgeMode}
        />
      )}

      {/* Selected Entry Detail (when not in edge mode) */}
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

      {/* Projection Mode Description */}
      <div className="text-xs text-muted-foreground text-center">
        {isEdgeMode 
          ? 'Edge Mode: Click two events to create a connection between them'
          : projectionMode === 'chronos' && 'Timeline: Events flow left to right by creation date'
        }
        {!isEdgeMode && projectionMode === 'kairos' && 'Now-Gravity: Recent and relevant events pull toward center'}
        {!isEdgeMode && projectionMode === 'mythos' && 'Spiral: Recurring patterns form an outward spiral'}
        {!isEdgeMode && projectionMode === 'causality' && 'Graph: Connected events cluster together by shared themes'}
      </div>
    </div>
  );
}
