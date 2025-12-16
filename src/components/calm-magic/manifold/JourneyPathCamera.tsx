import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { ManifoldEntry } from '@/hooks/useManifoldData';

interface JourneyPathCameraProps {
  entries: ManifoldEntry[];
  isPlaying: boolean;
  speed: number;
  onWaypoint?: (entry: ManifoldEntry, index: number) => void;
  onComplete?: () => void;
  cameraHeight?: number;
  lookAheadDistance?: number;
}

// Catmull-Rom spline interpolation
function catmullRomSpline(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  t: number,
  tension: number = 0.5
): THREE.Vector3 {
  const t2 = t * t;
  const t3 = t2 * t;

  const v0 = p1.clone();
  const v1 = p2.clone().sub(p0).multiplyScalar(tension);
  const v2 = p0.clone().multiplyScalar(2)
    .sub(p1.clone().multiplyScalar(5))
    .add(p2.clone().multiplyScalar(4))
    .sub(p3)
    .multiplyScalar(tension);
  const v3 = p0.clone().multiplyScalar(-1)
    .add(p1.clone().multiplyScalar(3))
    .sub(p2.clone().multiplyScalar(3))
    .add(p3)
    .multiplyScalar(tension);

  return v0.add(v1.multiplyScalar(t))
    .add(v2.multiplyScalar(t2))
    .add(v3.multiplyScalar(t3));
}

// Generate smooth path through journey entries using Catmull-Rom interpolation
function generateJourneyPath(
  entries: ManifoldEntry[],
  pointsPerSegment: number = 20
): THREE.Vector3[] {
  if (entries.length < 2) return [];

  const points: THREE.Vector3[] = [];
  const entryPoints = entries.map(e => new THREE.Vector3(e.x, e.y, e.z));

  // Add virtual points at start and end for smooth spline
  const firstDir = entryPoints[1].clone().sub(entryPoints[0]);
  const lastDir = entryPoints[entryPoints.length - 1].clone()
    .sub(entryPoints[entryPoints.length - 2]);
  
  const virtualStart = entryPoints[0].clone().sub(firstDir);
  const virtualEnd = entryPoints[entryPoints.length - 1].clone().add(lastDir);

  const allPoints = [virtualStart, ...entryPoints, virtualEnd];

  // Generate interpolated points
  for (let i = 1; i < allPoints.length - 2; i++) {
    for (let j = 0; j < pointsPerSegment; j++) {
      const t = j / pointsPerSegment;
      const point = catmullRomSpline(
        allPoints[i - 1],
        allPoints[i],
        allPoints[i + 1],
        allPoints[i + 2],
        t
      );
      points.push(point);
    }
  }

  // Add final point
  points.push(allPoints[allPoints.length - 2].clone());

  return points;
}

// Calculate camera offset position (above and behind the path)
function getCameraOffset(
  pathPoint: THREE.Vector3,
  nextPoint: THREE.Vector3,
  height: number
): THREE.Vector3 {
  const center = new THREE.Vector3(0, 0, 0);
  
  // Direction from center to point (radial outward)
  const radialDir = pathPoint.clone().sub(center).normalize();
  
  // Forward direction along path
  const forwardDir = nextPoint.clone().sub(pathPoint).normalize();
  
  // Up direction (perpendicular to forward and radial)
  const upDir = new THREE.Vector3().crossVectors(forwardDir, radialDir).normalize();
  
  // Camera position: slightly behind and above the path point
  return pathPoint.clone()
    .add(radialDir.multiplyScalar(height * 0.5))
    .add(upDir.multiplyScalar(height * 0.3))
    .sub(forwardDir.multiplyScalar(height * 0.2));
}

export function JourneyPathCamera({
  entries,
  isPlaying,
  speed = 1,
  onWaypoint,
  onComplete,
  cameraHeight = 1.5,
  lookAheadDistance = 0.1
}: JourneyPathCameraProps) {
  const { camera } = useThree();
  const progressRef = useRef(0);
  const lastWaypointRef = useRef(-1);
  const pathRef = useRef<THREE.Vector3[]>([]);

  // Generate smooth path from entries
  const journeyPath = useMemo(() => {
    if (entries.length < 2) return [];
    
    // Sort entries by creation time
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    return generateJourneyPath(sortedEntries, 30);
  }, [entries]);

  useEffect(() => {
    pathRef.current = journeyPath;
  }, [journeyPath]);

  useFrame((state, delta) => {
    if (!isPlaying || journeyPath.length < 2) return;

    // Advance progress
    progressRef.current += delta * speed * 0.02;

    // Loop or complete
    if (progressRef.current >= 1) {
      if (onComplete) {
        onComplete();
      }
      progressRef.current = 0;
      lastWaypointRef.current = -1;
    }

    // Get current position on path
    const pathLength = journeyPath.length - 1;
    const exactIndex = progressRef.current * pathLength;
    const currentIndex = Math.floor(exactIndex);
    const nextIndex = Math.min(currentIndex + 1, pathLength);
    const lookAheadIndex = Math.min(
      currentIndex + Math.ceil(lookAheadDistance * pathLength),
      pathLength
    );

    // Interpolate between path points
    const t = exactIndex - currentIndex;
    const currentPoint = journeyPath[currentIndex];
    const nextPoint = journeyPath[nextIndex];
    const lookAheadPoint = journeyPath[lookAheadIndex];

    if (!currentPoint || !nextPoint) return;

    // Smooth position interpolation
    const position = currentPoint.clone().lerp(nextPoint, t);
    
    // Calculate camera offset
    const cameraPos = getCameraOffset(position, lookAheadPoint || nextPoint, cameraHeight);
    
    // Smooth camera movement
    camera.position.lerp(cameraPos, 0.05);
    
    // Look ahead on the path
    const lookAtTarget = lookAheadPoint || nextPoint;
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.add(camera.position);
    currentLookAt.lerp(lookAtTarget, 0.03);
    camera.lookAt(lookAtTarget);

    // Check for waypoint callback
    const waypointIndex = Math.floor(progressRef.current * entries.length);
    if (waypointIndex !== lastWaypointRef.current && waypointIndex < entries.length) {
      lastWaypointRef.current = waypointIndex;
      if (onWaypoint) {
        onWaypoint(entries[waypointIndex], waypointIndex);
      }
    }
  });

  return null;
}

// Visible path line component
interface JourneyPathLineProps {
  entries: ManifoldEntry[];
  color?: string;
  opacity?: number;
  lineWidth?: number;
}

export function JourneyPathLine({
  entries,
  color = '#fbbf24',
  opacity = 0.6,
  lineWidth = 2
}: JourneyPathLineProps) {
  const points = useMemo(() => {
    if (entries.length < 2) return [];

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return generateJourneyPath(sortedEntries, 20);
  }, [entries]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
    />
  );
}

// Export utility functions for external use
export { catmullRomSpline, generateJourneyPath };
