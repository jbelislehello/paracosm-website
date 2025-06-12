
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';

interface ExperienceDot {
  id: string;
  x: number;
  y: number;
  radius: number;
  angle: number;
  type: 'creative' | 'healing' | 'learning' | 'relationship' | 'challenge';
  label: string;
  energy: number;
  connections: string[];
  isActive: boolean;
}

interface Connection {
  id: string;
  fromDot: string;
  toDot: string;
  type: 'healing' | 'creative' | 'learning' | 'integration';
  strength: number;
  isActive: boolean;
}

interface ExperienceDotsVisualizationProps {
  mode: 'personal' | 'professional';
}

const ExperienceDotsVisualization: React.FC<ExperienceDotsVisualizationProps> = ({ mode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();
  
  const [arrowAngle, setArrowAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [experienceDots, setExperienceDots] = useState<ExperienceDot[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedDotType, setSelectedDotType] = useState<ExperienceDot['type']>('creative');

  const centerX = 300;
  const centerY = 250;
  const maxRadius = 180;

  // Initialize default experience dots
  useEffect(() => {
    const defaultDots: ExperienceDot[] = [
      {
        id: 'dot-1',
        x: centerX + Math.cos(0) * 60,
        y: centerY + Math.sin(0) * 60,
        radius: 60,
        angle: 0,
        type: 'creative',
        label: 'Artistic Expression',
        energy: 80,
        connections: [],
        isActive: false
      },
      {
        id: 'dot-2',
        x: centerX + Math.cos(Math.PI / 2) * 100,
        y: centerY + Math.sin(Math.PI / 2) * 100,
        radius: 100,
        angle: Math.PI / 2,
        type: 'healing',
        label: 'Inner Peace',
        energy: 70,
        connections: [],
        isActive: false
      },
      {
        id: 'dot-3',
        x: centerX + Math.cos(Math.PI) * 140,
        y: centerY + Math.sin(Math.PI) * 140,
        radius: 140,
        angle: Math.PI,
        type: 'learning',
        label: 'Knowledge Growth',
        energy: 90,
        connections: [],
        isActive: false
      },
      {
        id: 'dot-4',
        x: centerX + Math.cos(3 * Math.PI / 2) * 80,
        y: centerY + Math.sin(3 * Math.PI / 2) * 80,
        radius: 80,
        angle: 3 * Math.PI / 2,
        type: 'relationship',
        label: 'Deep Connection',
        energy: 85,
        connections: [],
        isActive: false
      },
      {
        id: 'dot-5',
        x: centerX + Math.cos(Math.PI / 4) * 120,
        y: centerY + Math.sin(Math.PI / 4) * 120,
        radius: 120,
        angle: Math.PI / 4,
        type: 'challenge',
        label: 'Overcome Fears',
        energy: 60,
        connections: [],
        isActive: false
      }
    ];
    setExperienceDots(defaultDots);
  }, []);

  // Arrow rotation animation
  useEffect(() => {
    if (isRotating) {
      const animate = () => {
        setArrowAngle(prev => (prev + rotationSpeed * 0.02) % (2 * Math.PI));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRotating, rotationSpeed]);

  // Check for arrow-dot collisions
  useEffect(() => {
    const arrowX = centerX + Math.cos(arrowAngle) * 200;
    const arrowY = centerY + Math.sin(arrowAngle) * 200;

    setExperienceDots(prev => prev.map(dot => {
      const distance = Math.sqrt((dot.x - arrowX) ** 2 + (dot.y - arrowY) ** 2);
      const isNearArrow = distance < 25;
      
      if (isNearArrow && !dot.isActive) {
        // Create connections when arrow hits dot
        createConnections(dot.id);
      }
      
      return {
        ...dot,
        isActive: isNearArrow
      };
    }));
  }, [arrowAngle]);

  const createConnections = (dotId: string) => {
    const sourceDot = experienceDots.find(d => d.id === dotId);
    if (!sourceDot) return;

    const newConnections: Connection[] = [];
    
    // Find compatible dots to connect to
    experienceDots.forEach(targetDot => {
      if (targetDot.id !== dotId) {
        const compatibility = calculateCompatibility(sourceDot, targetDot);
        if (compatibility > 0.5) {
          const connectionType = determineConnectionType(sourceDot.type, targetDot.type);
          newConnections.push({
            id: `connection-${dotId}-${targetDot.id}`,
            fromDot: dotId,
            toDot: targetDot.id,
            type: connectionType,
            strength: compatibility,
            isActive: true
          });
        }
      }
    });

    setConnections(prev => [
      ...prev.filter(c => c.fromDot !== dotId),
      ...newConnections
    ]);

    // Auto-fade connections after 3 seconds
    setTimeout(() => {
      setConnections(prev => prev.map(c => 
        newConnections.some(nc => nc.id === c.id) 
          ? { ...c, isActive: false }
          : c
      ));
    }, 3000);
  };

  const calculateCompatibility = (dot1: ExperienceDot, dot2: ExperienceDot): number => {
    const typeCompatibility = {
      creative: { healing: 0.8, learning: 0.9, relationship: 0.7, challenge: 0.6 },
      healing: { creative: 0.8, learning: 0.7, relationship: 0.9, challenge: 0.8 },
      learning: { creative: 0.9, healing: 0.7, relationship: 0.6, challenge: 0.7 },
      relationship: { creative: 0.7, healing: 0.9, learning: 0.6, challenge: 0.5 },
      challenge: { creative: 0.6, healing: 0.8, learning: 0.7, relationship: 0.5 }
    };
    
    return typeCompatibility[dot1.type]?.[dot2.type] || 0.5;
  };

  const determineConnectionType = (type1: ExperienceDot['type'], type2: ExperienceDot['type']): Connection['type'] => {
    if (type1 === 'healing' || type2 === 'healing') return 'healing';
    if (type1 === 'creative' || type2 === 'creative') return 'creative';
    if (type1 === 'learning' || type2 === 'learning') return 'learning';
    return 'integration';
  };

  const addExperienceDot = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    
    if (distance > 40 && distance < maxRadius) {
      const angle = Math.atan2(y - centerY, x - centerX);
      const newDot: ExperienceDot = {
        id: `dot-${Date.now()}`,
        x,
        y,
        radius: distance,
        angle,
        type: selectedDotType,
        label: `New ${selectedDotType} experience`,
        energy: 50,
        connections: [],
        isActive: false
      };
      
      setExperienceDots(prev => [...prev, newDot]);
    }
  };

  const getTypeColor = (type: ExperienceDot['type']) => {
    const colors = {
      creative: '#8b5cf6',
      healing: '#10b981',
      learning: '#3b82f6',
      relationship: '#f59e0b',
      challenge: '#ef4444'
    };
    return colors[type];
  };

  const getConnectionColor = (type: Connection['type']) => {
    const colors = {
      healing: '#10b981',
      creative: '#8b5cf6',
      learning: '#3b82f6',
      integration: '#f59e0b'
    };
    return colors[type];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🌟 Experience Pathways Explorer</span>
          <Badge variant="outline">{mode} Mode</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant={isRotating ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRotating(!isRotating)}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRotating ? 'Pause' : 'Start'} Arrow
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setArrowAngle(0)}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>

          <select
            value={selectedDotType}
            onChange={(e) => setSelectedDotType(e.target.value as ExperienceDot['type'])}
            className="px-2 py-1 text-sm border rounded"
          >
            <option value="creative">Creative</option>
            <option value="healing">Healing</option>
            <option value="learning">Learning</option>
            <option value="relationship">Relationship</option>
            <option value="challenge">Challenge</option>
          </select>

          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="text-xs">Click to add</span>
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Arrow Speed</label>
          <Slider
            value={[rotationSpeed]}
            onValueChange={([value]) => setRotationSpeed(value)}
            min={0.1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Visualization */}
        <div className="relative">
          <svg
            ref={svgRef}
            width="600"
            height="500"
            className="mx-auto border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 cursor-crosshair"
            onClick={addExperienceDot}
          >
            {/* Background concentric circles */}
            {[60, 100, 140, 180].map(radius => (
              <circle
                key={radius}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}

            {/* Connections */}
            {connections.filter(c => c.isActive).map(connection => {
              const fromDot = experienceDots.find(d => d.id === connection.fromDot);
              const toDot = experienceDots.find(d => d.id === connection.toDot);
              if (!fromDot || !toDot) return null;

              return (
                <g key={connection.id}>
                  <line
                    x1={fromDot.x}
                    y1={fromDot.y}
                    x2={toDot.x}
                    y2={toDot.y}
                    stroke={getConnectionColor(connection.type)}
                    strokeWidth={connection.strength * 4}
                    opacity="0.7"
                    className="animate-pulse"
                  />
                  {/* Flow particles */}
                  <circle
                    cx={fromDot.x + (toDot.x - fromDot.x) * 0.5}
                    cy={fromDot.y + (toDot.y - fromDot.y) * 0.5}
                    r="3"
                    fill={getConnectionColor(connection.type)}
                    className="animate-ping"
                  />
                </g>
              );
            })}

            {/* Experience dots */}
            {experienceDots.map(dot => (
              <g key={dot.id}>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.isActive ? 12 : 8}
                  fill={getTypeColor(dot.type)}
                  opacity={dot.isActive ? 1 : 0.7}
                  className={dot.isActive ? "animate-pulse" : ""}
                />
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.isActive ? 18 : 12}
                  fill="none"
                  stroke={getTypeColor(dot.type)}
                  strokeWidth="2"
                  opacity={dot.isActive ? 0.5 : 0.3}
                />
                {dot.isActive && (
                  <text
                    x={dot.x}
                    y={dot.y - 25}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#333"
                    className="font-medium"
                  >
                    {dot.label}
                  </text>
                )}
              </g>
            ))}

            {/* Freedom Arrow */}
            <g transform={`translate(${centerX}, ${centerY}) rotate(${arrowAngle * 180 / Math.PI})`}>
              <line
                x1="0"
                y1="0"
                x2="200"
                y2="0"
                stroke="#ff6b6b"
                strokeWidth="3"
                opacity="0.8"
              />
              <polygon
                points="200,0 190,-5 190,5"
                fill="#ff6b6b"
              />
              <circle
                cx="0"
                cy="0"
                r="8"
                fill="#ff6b6b"
              />
            </g>

            {/* Center label */}
            <text
              x={centerX}
              y={centerY + 4}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
              className="font-semibold"
            >
              Freedom
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-5 gap-2 text-xs">
          {(['creative', 'healing', 'learning', 'relationship', 'challenge'] as const).map(type => (
            <div key={type} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getTypeColor(type) }}
              />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-sm">
          <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">How to use:</p>
          <ul className="text-blue-600 dark:text-blue-400 space-y-1 text-xs">
            <li>• Start the freedom arrow to watch it rotate around your experiences</li>
            <li>• When the arrow touches experience dots, it reveals hidden connections</li>
            <li>• Click anywhere on the circles to add new experience dots</li>
            <li>• Different colors represent different types of life experiences</li>
            <li>• Watch how creative, healing, and learning pathways emerge!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceDotsVisualization;
