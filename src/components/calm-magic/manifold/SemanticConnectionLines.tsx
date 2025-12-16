import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ManifoldEntry } from '@/hooks/useManifoldData';
import { SemanticConnection } from '@/hooks/useSemanticConnections';

interface SemanticConnectionLinesProps {
  entries: ManifoldEntry[];
  connections: SemanticConnection[];
  showConnections: boolean;
  minStrength?: number;
  hoveredConnection?: SemanticConnection | null;
  onConnectionHover?: (connection: SemanticConnection | null) => void;
}

// Generate quadratic Bezier curve points that arc above the torus surface
function generateBezierArc(
  start: THREE.Vector3,
  end: THREE.Vector3,
  arcHeight: number,
  numPoints: number = 20
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  
  // Midpoint
  const mid = start.clone().add(end).multiplyScalar(0.5);
  
  // Direction from center to midpoint (for arcing outward)
  const centerToMid = mid.clone().normalize();
  
  // Control point: midpoint pushed outward
  const control = mid.clone().add(centerToMid.multiplyScalar(arcHeight));
  
  // Generate quadratic Bezier points
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const oneMinusT = 1 - t;
    
    // Quadratic Bezier: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
    const point = new THREE.Vector3()
      .addScaledVector(start, oneMinusT * oneMinusT)
      .addScaledVector(control, 2 * oneMinusT * t)
      .addScaledVector(end, t * t);
    
    points.push(point);
  }
  
  return points;
}

// Get color based on relationship type
function getConnectionColor(type: SemanticConnection['relationshipType']): THREE.Color {
  switch (type) {
    case 'tag_overlap':
      return new THREE.Color(0xf59e0b); // Amber
    case 'semantic_similarity':
      return new THREE.Color(0xa855f7); // Purple
    case 'temporal_proximity':
      return new THREE.Color(0x3b82f6); // Blue
    case 'tile_adjacency':
      return new THREE.Color(0x22c55e); // Green
    default:
      return new THREE.Color(0x888888);
  }
}

// Single connection line component
function ConnectionLine({
  connection,
  sourceEntry,
  targetEntry,
  isHovered,
  onHover
}: {
  connection: SemanticConnection;
  sourceEntry: ManifoldEntry;
  targetEntry: ManifoldEntry;
  isHovered: boolean;
  onHover: (conn: SemanticConnection | null) => void;
}) {
  const [localHovered, setLocalHovered] = useState(false);

  // Generate curved path
  const { points, arcMidpoint } = useMemo(() => {
    const start = new THREE.Vector3(sourceEntry.x, sourceEntry.y, sourceEntry.z);
    const end = new THREE.Vector3(targetEntry.x, targetEntry.y, targetEntry.z);
    
    // Arc height based on distance and strength
    const distance = start.distanceTo(end);
    const arcHeight = Math.min(distance * 0.3, 1) * (0.5 + connection.strength * 0.5);
    
    const pathPoints = generateBezierArc(start, end, arcHeight);
    
    // Get midpoint for tooltip
    const midIdx = Math.floor(pathPoints.length / 2);
    const arcMidpoint = pathPoints[midIdx];
    
    return { points: pathPoints, arcMidpoint };
  }, [sourceEntry, targetEntry, connection.strength]);

  const color = getConnectionColor(connection.relationshipType);
  const opacity = isHovered || localHovered ? 1 : 0.3 + connection.strength * 0.5;
  const lineWidth = isHovered || localHovered ? 3 : 1 + connection.strength * 2;

  return (
    <group
      onPointerEnter={() => {
        setLocalHovered(true);
        onHover(connection);
      }}
      onPointerLeave={() => {
        setLocalHovered(false);
        onHover(null);
      }}
    >
      <Line
        points={points}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
      />
      
      {/* Hover tooltip */}
      {isHovered && (
        <Html position={[arcMidpoint.x, arcMidpoint.y + 0.2, arcMidpoint.z]} center>
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg pointer-events-none">
            <p className="text-xs font-medium capitalize">
              {connection.relationshipType.replace('_', ' ')}
            </p>
            <p className="text-xs text-muted-foreground">
              Strength: {Math.round(connection.strength * 100)}%
            </p>
            {connection.sharedTags && connection.sharedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {connection.sharedTags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-amber-500/20 text-amber-500 px-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export function SemanticConnectionLines({
  entries,
  connections,
  showConnections,
  minStrength = 0.3,
  hoveredConnection,
  onConnectionHover
}: SemanticConnectionLinesProps) {
  // Create entry lookup map
  const entryMap = useMemo(() => {
    const map = new Map<string, ManifoldEntry>();
    entries.forEach(e => map.set(e.id, e));
    return map;
  }, [entries]);

  // Filter connections by minimum strength
  const filteredConnections = useMemo(() => {
    return connections
      .filter(c => c.strength >= minStrength)
      .slice(0, 100); // Performance limit
  }, [connections, minStrength]);

  if (!showConnections || filteredConnections.length === 0) return null;

  return (
    <group>
      {filteredConnections.map((connection, idx) => {
        const sourceEntry = entryMap.get(connection.sourceId);
        const targetEntry = entryMap.get(connection.targetId);
        
        if (!sourceEntry || !targetEntry) return null;
        
        const isHovered = hoveredConnection?.sourceId === connection.sourceId &&
                          hoveredConnection?.targetId === connection.targetId;
        
        return (
          <ConnectionLine
            key={`${connection.sourceId}-${connection.targetId}-${idx}`}
            connection={connection}
            sourceEntry={sourceEntry}
            targetEntry={targetEntry}
            isHovered={isHovered}
            onHover={onConnectionHover || (() => {})}
          />
        );
      })}
    </group>
  );
}

// Connection type legend component
export function ConnectionLegend() {
  const types: Array<{ type: SemanticConnection['relationshipType']; label: string; color: string }> = [
    { type: 'tag_overlap', label: 'Shared Tags', color: '#f59e0b' },
    { type: 'semantic_similarity', label: 'Similar Content', color: '#a855f7' },
    { type: 'temporal_proximity', label: 'Close in Time', color: '#3b82f6' },
    { type: 'tile_adjacency', label: 'Adjacent Tiles', color: '#22c55e' }
  ];

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium mb-2">Connection Types</p>
      {types.map(({ type, label, color }) => (
        <div key={type} className="flex items-center gap-2 text-xs">
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: color }} />
          <span className="text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
