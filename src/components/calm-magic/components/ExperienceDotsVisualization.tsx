
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface CalmMagicDot {
  id: string;
  x: number;
  y: number;
  radius: number;
  angle: number;
  force: 'sovereignty' | 'memory' | 'intimacy' | 'novelty';
  label: string;
  energy: number;
  isActive: boolean;
  ring: number; // which concentric ring it's on
}

interface ForceConnection {
  id: string;
  fromDot: string;
  toDot: string;
  type: 'connessor' | 'magnesor' | 'integration' | 'balance';
  strength: number;
  isActive: boolean;
}

interface ExperienceDotsVisualizationProps {
  mode: 'personal' | 'professional';
}

const ExperienceDotsVisualization: React.FC<ExperienceDotsVisualizationProps> = ({ mode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [arrowAngle, setArrowAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [calmMagicDots, setCalmMagicDots] = useState<CalmMagicDot[]>([]);
  const [connections, setConnections] = useState<ForceConnection[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [forceStrength, setForceStrength] = useState({
    sovereignty: 80,
    memory: 70,
    intimacy: 75,
    novelty: 85
  });

  const centerX = 300;
  const centerY = 250;
  const rings = [80, 120, 160, 200]; // Concentric circle radii

  // Initialize the 4 Calm Magic forces on concentric circles
  useEffect(() => {
    const forceDots: CalmMagicDot[] = [];
    
    // Define force positions (quadrants) and their appearances on different rings
    const forceConfigs = [
      { force: 'sovereignty' as const, baseAngle: Math.PI / 4, label: 'Sovereignty', quadrant: 'upper-right' },
      { force: 'memory' as const, baseAngle: 3 * Math.PI / 4, label: 'Memory', quadrant: 'upper-left' },
      { force: 'intimacy' as const, baseAngle: 5 * Math.PI / 4, label: 'Intimacy', quadrant: 'lower-left' },
      { force: 'novelty' as const, baseAngle: 7 * Math.PI / 4, label: 'Novelty', quadrant: 'lower-right' }
    ];

    forceConfigs.forEach((config, forceIndex) => {
      // Place each force on 2-3 rings with slight angle variations
      [0, 1, 2].forEach((ringIndex) => {
        const radius = rings[ringIndex];
        const angleVariation = (ringIndex - 1) * 0.3; // Slight angle offset for variety
        const angle = config.baseAngle + angleVariation;
        
        forceDots.push({
          id: `${config.force}-ring-${ringIndex}`,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          radius,
          angle,
          force: config.force,
          label: `${config.label} (Ring ${ringIndex + 1})`,
          energy: forceStrength[config.force],
          isActive: false,
          ring: ringIndex
        });
      });
    });

    setCalmMagicDots(forceDots);
  }, [forceStrength]);

  // Initialize Web Audio API
  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [soundEnabled]);

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

  // Play calm eery sound for force collisions
  const playForceSound = (force: CalmMagicDot['force']) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Different frequencies for each force creating harmonious tones
    const frequencies = {
      sovereignty: 440, // A4 - higher, representing elevation
      memory: 330,     // E4 - mid-high, representing reflection
      intimacy: 261.63, // C4 - mid-low, representing grounding
      novelty: 196     // G3 - lower, representing exploration
    };

    oscillator.frequency.setValueAtTime(frequencies[force], audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
  };

  // Check for arrow-dot collisions and create force connections
  useEffect(() => {
    const arrowX = centerX + Math.cos(arrowAngle) * 220;
    const arrowY = centerY + Math.sin(arrowAngle) * 220;

    setCalmMagicDots(prev => prev.map(dot => {
      const distance = Math.sqrt((dot.x - arrowX) ** 2 + (dot.y - arrowY) ** 2);
      const isNearArrow = distance < 25;
      
      if (isNearArrow && !dot.isActive) {
        playForceSound(dot.force);
        createForceConnections(dot);
      }
      
      return {
        ...dot,
        isActive: isNearArrow
      };
    }));
  }, [arrowAngle, soundEnabled]);

  const createForceConnections = (sourceDot: CalmMagicDot) => {
    const newConnections: ForceConnection[] = [];
    
    calmMagicDots.forEach(targetDot => {
      if (targetDot.id !== sourceDot.id) {
        const connectionType = determineConnectionType(sourceDot.force, targetDot.force);
        const strength = calculateForceCompatibility(sourceDot, targetDot);
        
        if (strength > 0.3) {
          newConnections.push({
            id: `connection-${sourceDot.id}-${targetDot.id}`,
            fromDot: sourceDot.id,
            toDot: targetDot.id,
            type: connectionType,
            strength,
            isActive: true
          });
        }
      }
    });

    setConnections(prev => [
      ...prev.filter(c => c.fromDot !== sourceDot.id),
      ...newConnections
    ]);

    // Auto-fade connections after 4 seconds
    setTimeout(() => {
      setConnections(prev => prev.map(c => 
        newConnections.some(nc => nc.id === c.id) 
          ? { ...c, isActive: false }
          : c
      ));
    }, 4000);
  };

  const determineConnectionType = (force1: CalmMagicDot['force'], force2: CalmMagicDot['force']): ForceConnection['type'] => {
    const connessors = ['memory', 'intimacy'];
    const magnesors = ['sovereignty', 'novelty'];
    
    if (connessors.includes(force1) && connessors.includes(force2)) {
      return 'connessor';
    }
    if (magnesors.includes(force1) && magnesors.includes(force2)) {
      return 'magnesor';
    }
    if ((connessors.includes(force1) && magnesors.includes(force2)) || 
        (magnesors.includes(force1) && connessors.includes(force2))) {
      return 'integration';
    }
    return 'balance';
  };

  const calculateForceCompatibility = (dot1: CalmMagicDot, dot2: CalmMagicDot): number => {
    // Higher compatibility for same force type and complementary forces
    const forceCompatibility = {
      sovereignty: { sovereignty: 0.9, memory: 0.6, intimacy: 0.7, novelty: 0.8 },
      memory: { sovereignty: 0.6, memory: 0.9, intimacy: 0.8, novelty: 0.5 },
      intimacy: { sovereignty: 0.7, memory: 0.8, intimacy: 0.9, novelty: 0.6 },
      novelty: { sovereignty: 0.8, memory: 0.5, intimacy: 0.6, novelty: 0.9 }
    };
    
    const baseCompatibility = forceCompatibility[dot1.force][dot2.force];
    const energyBalance = Math.min(dot1.energy, dot2.energy) / 100;
    
    return baseCompatibility * energyBalance;
  };

  const getForceColor = (force: CalmMagicDot['force']) => {
    const colors = {
      sovereignty: '#fbbf24', // Gold/yellow
      memory: '#3b82f6',      // Blue
      intimacy: '#10b981',    // Green
      novelty: '#8b5cf6'      // Purple
    };
    return colors[force];
  };

  const getConnectionColor = (type: ForceConnection['type']) => {
    const colors = {
      connessor: '#06b6d4',   // Cyan - Memory + Intimacy
      magnesor: '#f59e0b',    // Amber - Sovereignty + Novelty
      integration: '#ec4899', // Pink - Cross-connections
      balance: '#84cc16'      // Lime - All forces balanced
    };
    return colors[type];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🌟 Calm Magic Forces Explorer</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{mode} Mode</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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

          <div className="text-xs text-center self-center">
            Sound: {soundEnabled ? 'ON' : 'OFF'}
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Freedom Arrow Speed</label>
          <Slider
            value={[rotationSpeed]}
            onValueChange={([value]) => setRotationSpeed(value)}
            min={0.1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Force Strength Controls */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(forceStrength).map(([force, strength]) => (
            <div key={force} className="space-y-2">
              <label className="text-sm font-medium capitalize flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getForceColor(force as CalmMagicDot['force']) }}
                />
                {force}: {strength}%
              </label>
              <Slider
                value={[strength]}
                onValueChange={([value]) => setForceStrength(prev => ({ ...prev, [force]: value }))}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="relative">
          <svg
            ref={svgRef}
            width="600"
            height="500"
            className="mx-auto border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
          >
            {/* Background concentric circles */}
            {rings.map(radius => (
              <circle
                key={radius}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                opacity="0.4"
              />
            ))}

            {/* Force connections */}
            {connections.filter(c => c.isActive).map(connection => {
              const fromDot = calmMagicDots.find(d => d.id === connection.fromDot);
              const toDot = calmMagicDots.find(d => d.id === connection.toDot);
              if (!fromDot || !toDot) return null;

              return (
                <g key={connection.id}>
                  <line
                    x1={fromDot.x}
                    y1={fromDot.y}
                    x2={toDot.x}
                    y2={toDot.y}
                    stroke={getConnectionColor(connection.type)}
                    strokeWidth={connection.strength * 5}
                    opacity="0.8"
                    className="animate-pulse"
                  />
                  {/* Flow particles */}
                  <circle
                    cx={fromDot.x + (toDot.x - fromDot.x) * 0.3}
                    cy={fromDot.y + (toDot.y - fromDot.y) * 0.3}
                    r="4"
                    fill={getConnectionColor(connection.type)}
                    className="animate-ping"
                  />
                  <circle
                    cx={fromDot.x + (toDot.x - fromDot.x) * 0.7}
                    cy={fromDot.y + (toDot.y - fromDot.y) * 0.7}
                    r="3"
                    fill={getConnectionColor(connection.type)}
                    className="animate-ping"
                    style={{ animationDelay: '0.5s' }}
                  />
                </g>
              );
            })}

            {/* Calm Magic Force dots */}
            {calmMagicDots.map(dot => (
              <g key={dot.id}>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.isActive ? 14 : 10}
                  fill={getForceColor(dot.force)}
                  opacity={dot.isActive ? 1 : 0.8}
                  className={dot.isActive ? "animate-pulse" : ""}
                />
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.isActive ? 20 : 15}
                  fill="none"
                  stroke={getForceColor(dot.force)}
                  strokeWidth="2"
                  opacity={dot.isActive ? 0.6 : 0.3}
                />
                {dot.isActive && (
                  <text
                    x={dot.x}
                    y={dot.y - 28}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#333"
                    className="font-medium"
                  >
                    {dot.force.charAt(0).toUpperCase() + dot.force.slice(1)}
                  </text>
                )}
              </g>
            ))}

            {/* Freedom Arrow */}
            <g transform={`translate(${centerX}, ${centerY}) rotate(${arrowAngle * 180 / Math.PI})`}>
              <line
                x1="0"
                y1="0"
                x2="220"
                y2="0"
                stroke="#ff6b6b"
                strokeWidth="4"
                opacity="0.9"
              />
              <polygon
                points="220,0 210,-6 210,6"
                fill="#ff6b6b"
              />
              <circle
                cx="0"
                cy="0"
                r="10"
                fill="#ff6b6b"
              />
            </g>

            {/* Center label */}
            <text
              x={centerX}
              y={centerY + 4}
              textAnchor="middle"
              fontSize="12"
              fill="#666"
              className="font-bold"
            >
              Freedom
            </text>

            {/* Quadrant labels */}
            <text x={380} y={100} fontSize="11" fill="#666" textAnchor="middle" className="font-medium">Sovereignty</text>
            <text x={220} y={100} fontSize="11" fill="#666" textAnchor="middle" className="font-medium">Memory</text>
            <text x={220} y={400} fontSize="11" fill="#666" textAnchor="middle" className="font-medium">Intimacy</text>
            <text x={380} y={400} fontSize="11" fill="#666" textAnchor="middle" className="font-medium">Novelty</text>
          </svg>
        </div>

        {/* Force Legend & Connection Types */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Calm Magic Forces</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['sovereignty', 'memory', 'intimacy', 'novelty'] as const).map(force => (
                <div key={force} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getForceColor(force) }}
                  />
                  <span className="capitalize">{force}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Connection Pathways</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['connessor', 'magnesor', 'integration', 'balance'] as const).map(type => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getConnectionColor(type) }}
                  />
                  <span className="capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 text-sm">
          <p className="font-medium text-purple-700 dark:text-purple-300 mb-1">Calm Magic Forces Explorer:</p>
          <ul className="text-purple-600 dark:text-purple-400 space-y-1 text-xs">
            <li>• Start the freedom arrow to watch it move through your consciousness</li>
            <li>• When it touches force dots, hear calm eery sounds and see connections emerge</li>
            <li>• Connessor pathways (Memory + Intimacy) create grounding and reflection</li>
            <li>• Magnesor pathways (Sovereignty + Novelty) create expansion and exploration</li>
            <li>• Integration pathways bridge different forces for balanced growth</li>
            <li>• Adjust force strengths to see how it affects connection patterns</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceDotsVisualization;
