
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Trash2, Target } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GeometryHotspot } from '@/components/calm-magic/geometry/GeometryHotspot';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type ActiveRegion = 'sovereignty' | 'memory' | 'intimacy' | 'novelty' | 'freedom' | null;
type ActiveForceRegion = Exclude<ActiveRegion, 'freedom' | null>;

const TWO_PI = Math.PI * 2;
const ARROW_LOCK_TWEEN_MS = 280;
const REGION_TARGET_ANGLE: Record<ActiveForceRegion, number> = {
  sovereignty: 0,
  memory: Math.PI / 2,
  intimacy: Math.PI,
  novelty: (3 * Math.PI) / 2,
};

const REGION_COPY: Record<Exclude<ActiveRegion, null>, { symbol: string; label: string; body: string }> = {
  sovereignty: { symbol: 'S', label: 'Sovereignty', body: 'Your sense of agency and authorship — the pull toward standing in your own ground.' },
  memory:      { symbol: 'M', label: 'Memory',      body: 'Continuity across time. What you carry forward pulls Freedom toward what you already know.' },
  intimacy:    { symbol: 'I', label: 'Intimacy',    body: 'Closeness and relational depth. Pulls Freedom toward connection rather than novelty.' },
  novelty:     { symbol: 'N', label: 'Novelty',     body: 'Openness to the new. Pulls Freedom toward exploration and surprise.' },
  freedom:     { symbol: 'F', label: 'Freedom',     body: 'The rotating arrow is your attention. As it sweeps, it touches forces and lights up paths between them.' },
};

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
  ring: number;
  isUserAdded: boolean;
}

interface ForceConnection {
  id: string;
  fromDot: string;
  toDot: string;
  type: 'connessor' | 'magnesor' | 'integration' | 'balance';
  strength: number;
  isActive: boolean;
  isCrossRing: boolean;
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
  const [arrowLength, setArrowLength] = useState(160);
  const [calmMagicDots, setCalmMagicDots] = useState<CalmMagicDot[]>([]);
  const [connections, setConnections] = useState<ForceConnection[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedForce, setSelectedForce] = useState<CalmMagicDot['force']>('sovereignty');
  const [placementMode, setPlacementMode] = useState(false);
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);
  const [activeRegion, setActiveRegion] = useState<ActiveRegion>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const arrowAngleRef = useRef(0);
  const arrowTweenRef = useRef<number>();
  const compassRegionRef = useRef<HTMLDivElement>(null);
  const latchedRegionRef = useRef<ActiveRegion>(null);
  const focusCompass = () => compassRegionRef.current?.focus({ preventScroll: true });
  const latchRegion = (region: ActiveRegion) => {
    latchedRegionRef.current = region;
    setActiveRegion(region);
  };
  const toggleLatch = (region: Exclude<ActiveRegion, null>) => {
    const next = latchedRegionRef.current === region ? null : region;
    latchRegion(next);
  };
  useEffect(() => { arrowAngleRef.current = arrowAngle; }, [arrowAngle]);

  // Re-assert focus on the compass region when the active region changes via
  // pointer interactions inside it (so arrow keys keep working from there).
  useEffect(() => {
    const root = compassRegionRef.current;
    if (!root) return;
    if (activeRegion && root.contains(document.activeElement)) {
      focusCompass();
    }
  }, [activeRegion]);

  // Outside click clears the active region so highlights don't go stale.
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const root = compassRegionRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) {
        setActiveRegion(null);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);
  const isLocked = activeRegion !== null && activeRegion !== 'freedom';
  const [forceStrength, setForceStrength] = useState({
    sovereignty: 80,
    memory: 70,
    intimacy: 75,
    novelty: 85
  });

  const centerX = 300;
  const centerY = 250;
  const rings = [80, 110, 140];

  // Initialize the 4 default Calm Magic forces on cardinal directions
  useEffect(() => {
    const forceDots: CalmMagicDot[] = [];
    
    const forceConfigs = [
      { force: 'sovereignty' as const, angle: 0, label: 'Sovereignty' },
      { force: 'memory' as const, angle: Math.PI / 2, label: 'Memory' },
      { force: 'intimacy' as const, angle: Math.PI, label: 'Intimacy' },
      { force: 'novelty' as const, angle: 3 * Math.PI / 2, label: 'Novelty' }
    ];

    forceConfigs.forEach((config) => {
      rings.forEach((radius, ringIndex) => {
        forceDots.push({
          id: `${config.force}-ring-${ringIndex}`,
          x: centerX + Math.cos(config.angle) * radius,
          y: centerY + Math.sin(config.angle) * radius,
          radius,
          angle: config.angle,
          force: config.force,
          label: `${config.label} (Level ${ringIndex + 1})`,
          energy: forceStrength[config.force],
          isActive: false,
          ring: ringIndex,
          isUserAdded: false
        });
      });
    });

    setCalmMagicDots(prev => [
      ...prev.filter(dot => dot.isUserAdded),
      ...forceDots
    ]);
  }, [forceStrength]);

  // Initialize Web Audio API
  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [soundEnabled]);

  // Arrow rotation animation
  useEffect(() => {
    if (isRotating && !isLocked) {
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
  }, [isRotating, rotationSpeed, isLocked]);

  // Ease Freedom arrow toward the active force axis
  useEffect(() => {
    if (arrowTweenRef.current) {
      cancelAnimationFrame(arrowTweenRef.current);
    }

    if (!isLocked || activeRegion === null) return;

    const target = REGION_TARGET_ANGLE[activeRegion];
    if (prefersReducedMotion) {
      setArrowAngle(target);
      return;
    }

    const from = arrowAngleRef.current;
    const delta = ((target - from + Math.PI * 3) % TWO_PI) - Math.PI;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ARROW_LOCK_TWEEN_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = ((from + delta * eased) % TWO_PI + TWO_PI) % TWO_PI;
      setArrowAngle(next);
      if (p < 1) arrowTweenRef.current = requestAnimationFrame(tick);
    };
    arrowTweenRef.current = requestAnimationFrame(tick);
    return () => {
      if (arrowTweenRef.current) {
        cancelAnimationFrame(arrowTweenRef.current);
      }
    };
  }, [activeRegion, isLocked, prefersReducedMotion]);

  // Handle SVG clicks for dot placement
  const handleSVGClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!placementMode) return;

    const svgRect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - svgRect.left;
    const clickY = event.clientY - svgRect.top;
    
    const dx = clickX - centerX;
    const dy = clickY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Find which ring this click is closest to
    let targetRing = -1;
    let minDiff = Infinity;
    
    rings.forEach((radius, index) => {
      const diff = Math.abs(distance - radius);
      if (diff < minDiff && diff < 25) { // 25px tolerance
        minDiff = diff;
        targetRing = index;
      }
    });
    
    if (targetRing === -1) return;
    
    const angle = Math.atan2(dy, dx);
    const targetRadius = rings[targetRing];
    const x = centerX + Math.cos(angle) * targetRadius;
    const y = centerY + Math.sin(angle) * targetRadius;
    
    const newDot: CalmMagicDot = {
      id: `user-${Date.now()}-${Math.random()}`,
      x,
      y,
      radius: targetRadius,
      angle,
      force: selectedForce,
      label: `${selectedForce.charAt(0).toUpperCase() + selectedForce.slice(1)} (Custom)`,
      energy: forceStrength[selectedForce],
      isActive: false,
      ring: targetRing,
      isUserAdded: true
    };
    
    setCalmMagicDots(prev => [...prev, newDot]);
  };

  // Handle ring hover
  const handleRingHover = (ringIndex: number | null) => {
    if (placementMode) {
      setHoveredRing(ringIndex);
    }
  };

  // Play calm eery sound for force collisions
  const playForceSound = (force: CalmMagicDot['force']) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    const frequencies = {
      sovereignty: 440,
      memory: 330,
      intimacy: 261.63,
      novelty: 196
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
    const arrowTipX = centerX + Math.cos(arrowAngle) * arrowLength;
    const arrowTipY = centerY + Math.sin(arrowAngle) * arrowLength;

    setCalmMagicDots(prev => prev.map(dot => {
      const distance = Math.sqrt((dot.x - arrowTipX) ** 2 + (dot.y - arrowTipY) ** 2);
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
  }, [arrowAngle, arrowLength, soundEnabled]);

  const createForceConnections = (sourceDot: CalmMagicDot) => {
    const newConnections: ForceConnection[] = [];
    
    calmMagicDots.forEach(targetDot => {
      if (targetDot.id !== sourceDot.id) {
        const connectionType = determineConnectionType(sourceDot.force, targetDot.force);
        const strength = calculateForceCompatibility(sourceDot, targetDot);
        const isCrossRing = sourceDot.ring !== targetDot.ring;
        
        // Prioritize cross-ring connections and different forces
        let adjustedStrength = strength;
        if (isCrossRing) adjustedStrength += 0.3;
        if (sourceDot.force !== targetDot.force) adjustedStrength += 0.2;
        
        if (adjustedStrength > 0.3) {
          newConnections.push({
            id: `connection-${sourceDot.id}-${targetDot.id}`,
            fromDot: sourceDot.id,
            toDot: targetDot.id,
            type: connectionType,
            strength: Math.min(adjustedStrength, 1),
            isActive: true,
            isCrossRing
          });
        }
      }
    });

    setConnections(prev => [
      ...prev.filter(c => c.fromDot !== sourceDot.id),
      ...newConnections
    ]);

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
      sovereignty: '#fbbf24',
      memory: '#3b82f6',
      intimacy: '#10b981',
      novelty: '#8b5cf6'
    };
    return colors[force];
  };

  const getConnectionColor = (type: ForceConnection['type']) => {
    const colors = {
      connessor: '#06b6d4',
      magnesor: '#f59e0b',
      integration: '#ec4899',
      balance: '#84cc16'
    };
    return colors[type];
  };

  const deleteUserDot = (dotId: string) => {
    setCalmMagicDots(prev => prev.filter(dot => dot.id !== dotId));
    setConnections(prev => prev.filter(c => c.fromDot !== dotId && c.toDot !== dotId));
  };

  const clearAllUserDots = () => {
    setCalmMagicDots(prev => prev.filter(dot => !dot.isUserAdded));
    setConnections([]);
  };

  const resetToDefault = () => {
    setCalmMagicDots(prev => prev.filter(dot => !dot.isUserAdded));
    setConnections([]);
    setArrowAngle(0);
    setArrowLength(160);
  };

  const userDots = calmMagicDots.filter(dot => dot.isUserAdded);

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🌟 Interactive Calm Magic Forces Explorer</span>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant={isRotating ? "default" : "outline"}
              size="sm"
              onClick={() => setIsRotating(!isRotating)}
            >
              {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRotating ? 'Pause' : 'Start'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setArrowAngle(0)}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>

            <Button
              variant={placementMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPlacementMode(!placementMode)}
            >
              {placementMode ? <Target className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {placementMode ? 'Placing' : 'Add Dots'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearAllUserDots}
              disabled={userDots.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              Clear Custom
            </Button>
          </div>

          {/* Placement Mode Controls */}
          {placementMode && (
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Select Force:</span>
                <Select value={selectedForce} onValueChange={(value: CalmMagicDot['force']) => setSelectedForce(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sovereignty">Sovereignty</SelectItem>
                    <SelectItem value="memory">Memory</SelectItem>
                    <SelectItem value="intimacy">Intimacy</SelectItem>
                    <SelectItem value="novelty">Novelty</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  Click on any concentric circle to place a {selectedForce} dot
                </span>
              </div>
            </div>
          )}

          {/* Speed and Arrow Length Controls */}
          <div className="grid md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Arrow Length (Reach): {arrowLength}px</label>
              <Slider
                value={[arrowLength]}
                onValueChange={([value]) => setArrowLength(value)}
                min={60}
                max={200}
                step={5}
                className="w-full"
              />
            </div>
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

          {/* User Dots Management */}
          {userDots.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Custom Dots ({userDots.length})</h4>
              <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                {userDots.map(dot => (
                  <div key={dot.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                    <span className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getForceColor(dot.force) }}
                      />
                      {dot.force} L{dot.ring + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUserDot(dot.id)}
                      className="h-4 w-4 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visualization */}
          <div
            ref={compassRegionRef}
            className="relative outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
            tabIndex={0}
            role="group"
            aria-label="Freedom compass. Use arrow keys to focus axes, Enter or Space for Freedom, Escape to clear."
            data-testid="compass-keyboard-region"
            onMouseDown={() => focusCompass()}
            onKeyDown={(e) => {
              const map: Record<string, ActiveRegion> = {
                ArrowRight: 'sovereignty',
                ArrowDown: 'memory',
                ArrowLeft: 'intimacy',
                ArrowUp: 'novelty',
                Enter: 'freedom',
                ' ': 'freedom',
                Escape: null,
              };
              if (!(e.key in map)) return;
              e.preventDefault();
              setActiveRegion(map[e.key]);
              if (e.key === 'Escape') focusCompass();
            }}
          >
            <svg
              ref={svgRef}
              width="600"
              height="500"
              tabIndex={-1}
              focusable="false"
              className="mx-auto border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 cursor-pointer focus:outline-none"
              onClick={handleSVGClick}
            >
              {/* Background concentric circles */}
              {rings.map((radius, index) => (
                <circle
                  key={radius}
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={hoveredRing === index ? "#8b5cf6" : "#e2e8f0"}
                  strokeWidth={hoveredRing === index ? "3" : index === 0 ? "2" : index === 1 ? "1.5" : "1"}
                  opacity={hoveredRing === index ? "0.8" : index === 0 ? "0.6" : index === 1 ? "0.5" : "0.4"}
                  className={placementMode ? "hover:stroke-purple-400" : ""}
                  onMouseEnter={() => handleRingHover(index)}
                  onMouseLeave={() => handleRingHover(null)}
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
                      strokeWidth={connection.isCrossRing ? connection.strength * 6 : connection.strength * 3}
                      opacity={connection.isCrossRing ? "1" : "0.6"}
                      strokeDasharray={connection.isCrossRing ? "none" : "5,5"}
                      className="animate-pulse"
                    />
                    {/* Enhanced flow particles for cross-ring connections */}
                    {connection.isCrossRing && (
                      <>
                        <circle
                          cx={fromDot.x + (toDot.x - fromDot.x) * 0.2}
                          cy={fromDot.y + (toDot.y - fromDot.y) * 0.2}
                          r="5"
                          fill={getConnectionColor(connection.type)}
                          className="animate-ping"
                        />
                        <circle
                          cx={fromDot.x + (toDot.x - fromDot.x) * 0.5}
                          cy={fromDot.y + (toDot.y - fromDot.y) * 0.5}
                          r="4"
                          fill={getConnectionColor(connection.type)}
                          className="animate-ping"
                          style={{ animationDelay: '0.3s' }}
                        />
                        <circle
                          cx={fromDot.x + (toDot.x - fromDot.x) * 0.8}
                          cy={fromDot.y + (toDot.y - fromDot.y) * 0.8}
                          r="3"
                          fill={getConnectionColor(connection.type)}
                          className="animate-ping"
                          style={{ animationDelay: '0.6s' }}
                        />
                      </>
                    )}
                  </g>
                );
              })}

              {/* Active-region radial spoke */}
              {activeRegion && activeRegion !== 'freedom' && (() => {
                const angles: Record<Exclude<ActiveRegion, null | 'freedom'>, number> = {
                  sovereignty: 0,
                  memory: Math.PI / 2,
                  intimacy: Math.PI,
                  novelty: 3 * Math.PI / 2,
                };
                const a = angles[activeRegion];
                return (
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + Math.cos(a) * (rings[2] + 30)}
                    y2={centerY + Math.sin(a) * (rings[2] + 30)}
                    stroke={getForceColor(activeRegion)}
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    opacity="0.55"
                    style={{ transition: 'opacity 220ms ease-out' }}
                  />
                );
              })()}

              {/* Calm Magic Force dots */}
              {calmMagicDots.map(dot => {
                const isActiveRegion = activeRegion === dot.force;
                const baseR = dot.isActive ? 12 : dot.isUserAdded ? 10 : 8;
                const r = isActiveRegion && !prefersReducedMotion ? baseR * 1.18 : baseR;
                return (
                <g key={dot.id} style={{ transition: 'opacity 220ms ease-out' }}>
                  {isActiveRegion && !prefersReducedMotion && (
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={r * 1.8}
                      fill={getForceColor(dot.force)}
                      opacity={0.25}
                      style={{ filter: 'blur(6px)' }}
                    />
                  )}
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={r}
                    fill={getForceColor(dot.force)}
                    opacity={isActiveRegion ? 1 : dot.isActive ? 1 : 0.9}
                    stroke={dot.isUserAdded ? "#fff" : "none"}
                    strokeWidth={dot.isUserAdded ? "2" : "0"}
                    className={dot.isActive ? "animate-pulse" : ""}
                    style={{ transition: 'r 220ms ease-out, opacity 220ms ease-out' }}
                  />
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.isActive ? 18 : 12}
                    fill="none"
                    stroke={getForceColor(dot.force)}
                    strokeWidth={isActiveRegion ? "2.5" : "2"}
                    opacity={isActiveRegion ? 0.85 : dot.isActive ? 0.7 : 0.4}
                    style={{ transition: 'opacity 220ms ease-out, stroke-width 220ms ease-out' }}
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
                      {dot.force.charAt(0).toUpperCase() + dot.force.slice(1)}
                      {dot.isUserAdded && " (Custom)"}
                    </text>
                  )}
                </g>
                );
              })}

              {/* Freedom Arrow with variable length */}
              <g transform={`translate(${centerX}, ${centerY}) rotate(${arrowAngle * 180 / Math.PI})`}>
                <line
                  x1="0"
                  y1="0"
                  x2={arrowLength}
                  y2="0"
                  stroke="#ff6b6b"
                  strokeWidth="3"
                  opacity="0.9"
                />
                <polygon
                  points={`${arrowLength},0 ${arrowLength - 10},-5 ${arrowLength - 10},5`}
                  fill="#ff6b6b"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={activeRegion === 'freedom' && !prefersReducedMotion ? 11 : 8}
                  fill="#ff6b6b"
                  style={{ transition: 'r 220ms ease-out' }}
                />
                {activeRegion === 'freedom' && !prefersReducedMotion && (
                  <circle cx="0" cy="0" r="20" fill="#ff6b6b" opacity="0.3" style={{ filter: 'blur(6px)' }} />
                )}
              </g>

              {/* Center label */}
              <text
                x={centerX}
                y={centerY + 3}
                textAnchor="middle"
                fontSize="11"
                fill={activeRegion === 'freedom' ? '#ff6b6b' : '#666'}
                className="font-bold"
                style={{ transition: 'fill 220ms ease-out' }}
              >
                Freedom
              </text>

              {/* Cardinal direction labels for forces */}
              <text x={centerX + 180} y={centerY + 5} fontSize={activeRegion === 'sovereignty' ? 13 : 12} fill={activeRegion === 'sovereignty' ? getForceColor('sovereignty') : '#666'} textAnchor="start" className={activeRegion === 'sovereignty' ? 'font-semibold' : 'font-medium'} style={{ transition: 'fill 220ms ease-out' }}>Sovereignty</text>
              <text x={centerX} y={centerY + 180} fontSize={activeRegion === 'memory' ? 13 : 12} fill={activeRegion === 'memory' ? getForceColor('memory') : '#666'} textAnchor="middle" className={activeRegion === 'memory' ? 'font-semibold' : 'font-medium'} style={{ transition: 'fill 220ms ease-out' }}>Memory</text>
              <text x={centerX - 180} y={centerY + 5} fontSize={activeRegion === 'intimacy' ? 13 : 12} fill={activeRegion === 'intimacy' ? getForceColor('intimacy') : '#666'} textAnchor="end" className={activeRegion === 'intimacy' ? 'font-semibold' : 'font-medium'} style={{ transition: 'fill 220ms ease-out' }}>Intimacy</text>
              <text x={centerX} y={centerY - 160} fontSize={activeRegion === 'novelty' ? 13 : 12} fill={activeRegion === 'novelty' ? getForceColor('novelty') : '#666'} textAnchor="middle" className={activeRegion === 'novelty' ? 'font-semibold' : 'font-medium'} style={{ transition: 'fill 220ms ease-out' }}>Novelty</text>

              {/* Ring level indicators */}
              <text x={centerX + 85} y={centerY - 5} fontSize="9" fill="#999" textAnchor="middle">L1</text>
              <text x={centerX + 115} y={centerY - 5} fontSize="9" fill="#999" textAnchor="middle">L2</text>
              <text x={centerX + 145} y={centerY - 5} fontSize="9" fill="#999" textAnchor="middle">L3</text>
              
              {/* Arrow reach indicator */}
              <circle
                cx={centerX}
                cy={centerY}
                r={arrowLength}
                fill="none"
                stroke="#ff6b6b"
                strokeWidth={activeRegion === 'freedom' ? '1.5' : '1'}
                opacity={activeRegion === 'freedom' ? '0.55' : '0.2'}
                strokeDasharray="3,3"
                style={{ transition: 'opacity 220ms ease-out, stroke-width 220ms ease-out' }}
              />
            </svg>

            {/* Synchronized hotspots — positions match SVG coords (600×500). */}
            {(['sovereignty','memory','intimacy','novelty','freedom'] as const).map((key) => {
              const positions: Record<typeof key, { left: string; top: string; w: number; h: number; side: 'top'|'bottom'|'left'|'right' }> = {
                sovereignty: { left: `${((centerX + 180) / 600) * 100}%`, top: `${((centerY - 5) / 500) * 100}%`, w: 96, h: 28, side: 'left' },
                memory:      { left: `${((centerX - 40) / 600) * 100}%`, top: `${((centerY + 168) / 500) * 100}%`, w: 80, h: 24, side: 'top' },
                intimacy:    { left: `${((centerX - 250) / 600) * 100}%`, top: `${((centerY - 5) / 500) * 100}%`, w: 96, h: 28, side: 'right' },
                novelty:     { left: `${((centerX - 40) / 600) * 100}%`, top: `${((centerY - 178) / 500) * 100}%`, w: 80, h: 24, side: 'bottom' },
                freedom:     { left: `${((centerX - 22) / 600) * 100}%`, top: `${((centerY - 14) / 500) * 100}%`, w: 44, h: 28, side: 'top' },
              };
              const p = positions[key];
              const copy = REGION_COPY[key];
              return (
                <GeometryHotspot
                  key={key}
                  style={{ left: p.left, top: p.top, width: p.w, height: p.h }}
                  symbol={copy.symbol}
                  label={copy.label}
                  body={copy.body}
                  side={p.side}
                  onActiveChange={(a) => {
                    setActiveRegion((prev) => (a ? key : prev === key ? null : prev));
                    if (a) focusCompass();
                  }}
                />
              );
            })}

            {/* Contextual info panel for the active force axis */}
            <div
              aria-live="polite"
              className="pointer-events-none absolute top-3 right-3 max-w-[60%] sm:max-w-[220px]"
            >
              {activeRegion && (() => {
                const copy = REGION_COPY[activeRegion];
                const accent = activeRegion === 'freedom' ? '#ff6b6b' : getForceColor(activeRegion);
                return (
                  <div
                    role="status"
                    className="rounded-md border bg-background/90 backdrop-blur-sm p-3 shadow-sm"
                    style={{
                      borderColor: `${accent}66`,
                      transition: prefersReducedMotion ? 'opacity 150ms ease-out' : 'opacity 200ms ease-out, transform 200ms ease-out',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: accent }}
                      >
                        {copy.symbol}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: accent }}>{copy.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{copy.body}</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Enhanced Legend & Connection Types */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Calm Magic Forces</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['sovereignty', 'memory', 'intimacy', 'novelty'] as const).map(force => {
                  const isActive = activeRegion === force;
                  return (
                    <button
                      key={force}
                      type="button"
                      onMouseEnter={() => setActiveRegion(force)}
                      onMouseLeave={() => setActiveRegion((prev) => (prev === force ? null : prev))}
                      onFocus={() => setActiveRegion(force)}
                      onBlur={() => setActiveRegion((prev) => (prev === force ? null : prev))}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-left transition-all duration-200 ${
                        isActive ? 'ring-2 ring-offset-1 ring-purple-400 bg-purple-50/60 dark:bg-purple-950/30' : ''
                      }`}
                      style={isActive ? { boxShadow: `0 0 0 1px ${getForceColor(force)}40` } : undefined}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getForceColor(force) }}
                      />
                      <span className={`capitalize ${isActive ? 'font-semibold' : ''}`}>{force}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Connection Types</h4>
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

          {/* Enhanced Instructions */}
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 text-sm">
            <p className="font-medium text-purple-700 dark:text-purple-300 mb-1">Interactive Freedom Compass:</p>
            <ul className="text-purple-600 dark:text-purple-400 space-y-1 text-xs">
              <li>• Click "Add Dots" to enter placement mode, then click on circles to add custom force dots</li>
              <li>• Adjust arrow length to reach different freedom levels (inner/outer circles)</li>
              <li>• Cross-ring connections (between different levels) are stronger and more prominent</li>
              <li>• Custom dots have white borders to distinguish from default cardinal positions</li>
              <li>• Watch how different force placements create unique connection pathways</li>
              <li>• Experiment with different arrow lengths to explore specific freedom levels</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ExperienceDotsVisualization;
