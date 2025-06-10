
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Settings, X } from 'lucide-react';

interface CompassState {
  currentQuadrant: 'sovereignty' | 'memory' | 'intimacy' | 'novelty';
  currentSubsection: number; // 0-3 for each quadrant subdivision
  freedomLevel: number; // 1-3 representing the concentric circles
  shadowIntegration: number; // 0-100
  higherSelfAlignment: number; // 0-100
  arrowDepth: number; // How deep into the process (affects arrow length)
  isCongruent: boolean;
  connessorStrength: number; // Memory + Intimacy tendency (0-100)
  magnesorStrength: number; // Novelty + Sovereignty tendency (0-100)
  momentum: number; // Current momentum level (0-100)
}

interface FloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  compassState: CompassState;
  onStateChange: (newState: Partial<CompassState>) => void;
  isAnimating: boolean;
  onAnimationToggle: () => void;
  onNextPosition: () => void;
  onReset: () => void;
}

const FloatingControlPanel: React.FC<FloatingPanelProps> = ({
  isOpen,
  onClose,
  compassState,
  onStateChange,
  isAnimating,
  onAnimationToggle,
  onNextPosition,
  onReset
}) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-600 min-w-80 max-w-sm"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <div 
        className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600"
        onMouseDown={handleMouseDown}
      >
        <h3 className="font-semibold text-sm">Freedom Compass Controls</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
        {/* Animation Controls */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Animation</h4>
          <div className="flex gap-2">
            <Button
              onClick={onAnimationToggle}
              size="sm"
              className="flex items-center gap-2 flex-1"
            >
              {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isAnimating ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={onNextPosition} variant="outline" size="sm" disabled={isAnimating}>
              Next
            </Button>
            <Button onClick={onReset} variant="outline" size="sm">
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Connessor/Magnesor Controls */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Relational Dynamics</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-blue-600">Connessor (Memory+Intimacy)</span>
              <span className="font-medium">{compassState.connessorStrength}%</span>
            </div>
            <Slider
              value={[compassState.connessorStrength]}
              onValueChange={([value]) => onStateChange({ connessorStrength: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-purple-600">Magnesor (Novelty+Sovereignty)</span>
              <span className="font-medium">{compassState.magnesorStrength}%</span>
            </div>
            <Slider
              value={[compassState.magnesorStrength]}
              onValueChange={([value]) => onStateChange({ magnesorStrength: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">Current Momentum</span>
              <span className="font-medium">{compassState.momentum}%</span>
            </div>
            <Slider
              value={[compassState.momentum]}
              onValueChange={([value]) => onStateChange({ momentum: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Shadow Integration Controls */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Shadow Integration</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-orange-600">Shadow Integration</span>
              <span className="font-medium">{compassState.shadowIntegration}%</span>
            </div>
            <Slider
              value={[compassState.shadowIntegration]}
              onValueChange={([value]) => onStateChange({ shadowIntegration: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-yellow-600">Higher Self Alignment</span>
              <span className="font-medium">{compassState.higherSelfAlignment}%</span>
            </div>
            <Slider
              value={[compassState.higherSelfAlignment]}
              onValueChange={([value]) => onStateChange({ higherSelfAlignment: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Dynamics Indicator */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
          <h5 className="font-medium text-xs mb-2">Dynamic State</h5>
          <div className="text-xs space-y-1">
            <div className={`${compassState.connessorStrength > compassState.magnesorStrength ? 'text-red-600' : 'text-green-600'}`}>
              {compassState.connessorStrength > compassState.magnesorStrength 
                ? '⚠ Agglutination Detected' 
                : '✓ Flowing Momentum'}
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              Balance: {Math.abs(compassState.connessorStrength - compassState.magnesorStrength)}% difference
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalmMagicCompass: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [compassState, setCompassState] = useState<CompassState>({
    currentQuadrant: 'sovereignty',
    currentSubsection: 0,
    freedomLevel: 1,
    shadowIntegration: 20,
    higherSelfAlignment: 30,
    arrowDepth: 30,
    isCongruent: true,
    connessorStrength: 40,
    magnesorStrength: 60,
    momentum: 50
  });

  // Define the quadrants with correct cardinal positions
  const quadrants = [
    {
      name: 'sovereignty',
      baseAngle: 0, // Top
      color: '#10b981',
      label: 'Sovereignty',
      description: 'Self-Determination & Freedom',
      subsections: [
        { name: 'Personal Autonomy', description: 'Individual self-governance' },
        { name: 'Creative Authority', description: 'Ownership of expression' },
        { name: 'Relational Freedom', description: 'Healthy boundaries' },
        { name: 'Transcendent Will', description: 'Aligned purposefulness' }
      ]
    },
    {
      name: 'memory',
      baseAngle: 90, // Right
      color: '#ec4899',
      label: 'Memory',
      description: 'Connection & Continuity',
      subsections: [
        { name: 'Personal History', description: 'Integrating your past' },
        { name: 'Relational Bonds', description: 'Deepening connections' },
        { name: 'Cultural Wisdom', description: 'Collective knowledge' },
        { name: 'Ancestral Legacy', description: 'Lineage understanding' }
      ]
    },
    {
      name: 'intimacy',
      baseAngle: 180, // Bottom
      color: '#06b6d4',
      label: 'Intimacy',
      description: 'Depth & Vulnerability',
      subsections: [
        { name: 'Self-Intimacy', description: 'Inner emotional awareness' },
        { name: 'Sacred Sharing', description: 'Vulnerable expression' },
        { name: 'Deep Listening', description: 'Profound reception' },
        { name: 'Unity Consciousness', description: 'Dissolution of separation' }
      ]
    },
    {
      name: 'novelty',
      baseAngle: 270, // Left
      color: '#8b5cf6',
      label: 'Novelty',
      description: 'Innovation & Discovery',
      subsections: [
        { name: 'Fresh Perspectives', description: 'New ways of seeing' },
        { name: 'Creative Experimentation', description: 'Trying new approaches' },
        { name: 'Breakthrough Insights', description: 'Paradigm shifts' },
        { name: 'Infinite Possibility', description: 'Embracing the unknown' }
      ]
    }
  ];

  const getCurrentQuadrantIndex = () => {
    return quadrants.findIndex(q => q.name === compassState.currentQuadrant);
  };

  const nextPosition = () => {
    const currentQuadrantIndex = getCurrentQuadrantIndex();
    
    let newQuadrant = compassState.currentQuadrant;
    let newSubsection = compassState.currentSubsection;
    let newFreedomLevel = compassState.freedomLevel;
    let newShadowIntegration = Math.min(compassState.shadowIntegration + 3, 100);
    let newHigherSelfAlignment = Math.min(compassState.higherSelfAlignment + 2, 100);
    let newArrowDepth = compassState.arrowDepth;
    let newMomentum = compassState.momentum;

    // Calculate momentum changes based on Connessor/Magnesor dynamics
    const agglutinationFactor = Math.max(0, compassState.connessorStrength - compassState.magnesorStrength) / 100;
    const momentumReduction = agglutinationFactor * 15;
    
    // Move to next subsection or quadrant
    if (newSubsection < 3) {
      newSubsection += 1;
      newArrowDepth = Math.min(newArrowDepth + (8 - momentumReduction), 120);
      newMomentum = Math.max(newMomentum - momentumReduction, 10);
    } else {
      // Move to next quadrant
      const nextQuadrantIndex = (currentQuadrantIndex + 1) % quadrants.length;
      newQuadrant = quadrants[nextQuadrantIndex].name as CompassState['currentQuadrant'];
      newSubsection = 0;
      
      // Increase freedom level every full cycle
      if (nextQuadrantIndex === 0) {
        newFreedomLevel = Math.min(newFreedomLevel + 1, 3);
      }
      
      newArrowDepth = Math.min(newArrowDepth + (15 - momentumReduction), 120);
      newMomentum = Math.max(newMomentum - momentumReduction, 10);
    }

    setCompassState(prev => ({
      ...prev,
      currentQuadrant: newQuadrant,
      currentSubsection: newSubsection,
      freedomLevel: newFreedomLevel,
      shadowIntegration: newShadowIntegration,
      higherSelfAlignment: newHigherSelfAlignment,
      arrowDepth: newArrowDepth,
      momentum: newMomentum,
      isCongruent: Math.random() > (agglutinationFactor * 0.5) // Less likely to be congruent with agglutination
    }));
  };

  const resetCompass = () => {
    setIsAnimating(false);
    setCompassState({
      currentQuadrant: 'sovereignty',
      currentSubsection: 0,
      freedomLevel: 1,
      shadowIntegration: 20,
      higherSelfAlignment: 30,
      arrowDepth: 30,
      isCongruent: true,
      connessorStrength: 40,
      magnesorStrength: 60,
      momentum: 50
    });
  };

  const handleStateChange = (newState: Partial<CompassState>) => {
    setCompassState(prev => ({ ...prev, ...newState }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(nextPosition, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnimating, compassState.connessorStrength, compassState.magnesorStrength]);

  const currentQuadrant = quadrants[getCurrentQuadrantIndex()];
  const currentSubsection = currentQuadrant.subsections[compassState.currentSubsection];
  
  // Calculate arrow angle based on quadrant and subsection
  const subsectionAngle = (90 / 4) * compassState.currentSubsection; // 22.5 degrees per subsection
  const arrowAngle = currentQuadrant.baseAngle + subsectionAngle;

  const integrationLevel = (compassState.shadowIntegration + compassState.higherSelfAlignment) / 2;
  const agglutinationLevel = Math.max(0, compassState.connessorStrength - compassState.magnesorStrength);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-3">Calm Magic Relational Dynamic Map</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            Integrating Shadow Self with Higher Self through Expansive Leadership
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Navigate the cardinal forces as your freedom expands through Connessor/Magnesor dynamics
          </p>
        </div>

        {/* Compass Visualization */}
        <div className="relative w-96 h-96 mx-auto mb-8">
          <svg className="w-full h-full" viewBox="0 0 384 384">
            {/* Three Concentric Circles for Freedom Levels */}
            {[1, 2, 3].map((level) => (
              <circle
                key={level}
                cx="192"
                cy="192"
                r={50 + (level * 30)}
                fill="none"
                stroke={compassState.freedomLevel >= level ? "#8b5cf6" : "#e2e8f0"}
                strokeWidth={compassState.freedomLevel >= level ? "3" : "1"}
                strokeDasharray={compassState.freedomLevel >= level ? "0" : "5,5"}
                className={`transition-all duration-1000 ${compassState.freedomLevel >= level ? 'opacity-80' : 'opacity-30'}`}
              />
            ))}

            {/* Shadow Elements */}
            <defs>
              <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="70%" stopColor={`rgba(0,0,0,${(100 - compassState.shadowIntegration) / 200})`} />
                <stop offset="100%" stopColor={`rgba(0,0,0,${(100 - compassState.shadowIntegration) / 100})`} />
              </radialGradient>
              <radialGradient id="integrationGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#1f2937" />
              </radialGradient>
            </defs>

            {/* Shadow Overlay */}
            <circle
              cx="192"
              cy="192"
              r="170"
              fill="url(#shadowGradient)"
              className="transition-all duration-1000"
            />
            
            {/* Quadrant Divisions */}
            {quadrants.map((quadrant, qIndex) => {
              const isActiveQuadrant = quadrant.name === compassState.currentQuadrant;
              
              return (
                <g key={quadrant.name}>
                  {/* Main Quadrant Arc */}
                  <path
                    d={`M 192 192 L ${192 + Math.cos((quadrant.baseAngle - 90) * Math.PI / 180) * 170} ${192 + Math.sin((quadrant.baseAngle - 90) * Math.PI / 180) * 170} A 170 170 0 0 1 ${192 + Math.cos((quadrant.baseAngle + 90 - 90) * Math.PI / 180) * 170} ${192 + Math.sin((quadrant.baseAngle + 90 - 90) * Math.PI / 180) * 170} Z`}
                    fill={quadrant.color}
                    className={`transition-all duration-500 ${isActiveQuadrant ? 'opacity-30' : 'opacity-15'}`}
                  />
                  
                  {/* Quadrant Subsections */}
                  {quadrant.subsections.map((subsection, sIndex) => {
                    const isActiveSubsection = isActiveQuadrant && sIndex === compassState.currentSubsection;
                    const subsectionStartAngle = quadrant.baseAngle + (sIndex * 22.5);
                    
                    return (
                      <g key={sIndex}>
                        {/* Subsection Divider */}
                        <line
                          x1="192"
                          y1="192"
                          x2={192 + Math.cos((subsectionStartAngle - 90) * Math.PI / 180) * 170}
                          y2={192 + Math.sin((subsectionStartAngle - 90) * Math.PI / 180) * 170}
                          stroke={isActiveQuadrant ? quadrant.color : "#e2e8f0"}
                          strokeWidth="1"
                          className="opacity-50"
                        />
                        
                        {/* Active Subsection Highlight */}
                        {isActiveSubsection && (
                          <circle
                            cx={192 + Math.cos((subsectionStartAngle + 11.25 - 90) * Math.PI / 180) * 140}
                            cy={192 + Math.sin((subsectionStartAngle + 11.25 - 90) * Math.PI / 180) * 140}
                            r="15"
                            fill={quadrant.color}
                            className="animate-pulse opacity-80"
                          />
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Quadrant Label */}
                  <text
                    x={192 + Math.cos((quadrant.baseAngle + 45 - 90) * Math.PI / 180) * 145}
                    y={192 + Math.sin((quadrant.baseAngle + 45 - 90) * Math.PI / 180) * 145}
                    textAnchor="middle"
                    className={`text-sm font-bold transition-all duration-500 ${
                      isActiveQuadrant ? 'fill-white' : 'fill-gray-600'
                    }`}
                  >
                    {quadrant.label}
                  </text>
                </g>
              );
            })}

            {/* Agglutination Visual Effect */}
            {agglutinationLevel > 10 && (
              <circle
                cx="192"
                cy="192"
                r={100 + (agglutinationLevel / 10)}
                fill="none"
                stroke="#ef4444"
                strokeWidth={agglutinationLevel / 20}
                strokeDasharray="10,5"
                className="animate-pulse opacity-60"
              />
            )}
            
            {/* Freedom Arrow */}
            <g transform={`translate(192, 192) rotate(${arrowAngle})`}>
              <line
                x1="0"
                y1="0"
                x2={compassState.arrowDepth}
                y2="0"
                stroke="#1f2937"
                strokeWidth={Math.max(2, 8 - (agglutinationLevel / 20))}
                strokeLinecap="round"
                className="transition-all duration-1500"
                opacity={Math.max(0.4, 1 - (agglutinationLevel / 200))}
              />
              <polygon
                points={`${compassState.arrowDepth},0 ${compassState.arrowDepth - 12},-6 ${compassState.arrowDepth - 12},6`}
                fill="#1f2937"
                className="transition-all duration-1500"
                opacity={Math.max(0.4, 1 - (agglutinationLevel / 200))}
              />
              
              {/* Arrow momentum indicator */}
              <circle
                cx={compassState.arrowDepth * 0.7}
                cy="0"
                r="3"
                fill={compassState.momentum > 50 ? '#10b981' : compassState.momentum > 25 ? '#f59e0b' : '#ef4444'}
                className="animate-pulse"
              />
            </g>
            
            {/* Center Integration Symbol */}
            <circle
              cx="192"
              cy="192"
              r="12"
              fill="url(#integrationGradient)"
            />
          </svg>

          {/* Floating Settings Button */}
          <Button
            onClick={() => setIsControlsOpen(true)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 shadow-lg"
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Current State Display */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div 
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: currentQuadrant.color }}
            />
            <span className="font-bold text-lg">{currentQuadrant.label}</span>
            <span className="text-sm text-slate-600">→ {currentSubsection.name}</span>
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {currentSubsection.description}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <div>
              <div className="font-medium text-purple-600">Freedom Level</div>
              <div className="text-2xl font-bold">{compassState.freedomLevel}/3</div>
            </div>
            <div>
              <div className="font-medium text-orange-600">Shadow Integration</div>
              <div className="text-2xl font-bold">{compassState.shadowIntegration}%</div>
            </div>
            <div>
              <div className="font-medium text-yellow-600">Higher Self</div>
              <div className="text-2xl font-bold">{compassState.higherSelfAlignment}%</div>
            </div>
            <div>
              <div className="font-medium text-green-600">Momentum</div>
              <div className="text-2xl font-bold">{compassState.momentum}%</div>
            </div>
            <div>
              <div className="font-medium text-blue-600">Integration</div>
              <div className="text-2xl font-bold">{Math.round(integrationLevel)}%</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              compassState.isCongruent 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {compassState.isCongruent ? '✓ Congruent State' : '⚠ Integration Opportunity'}
            </div>
            
            {agglutinationLevel > 10 && (
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                ⚠ Agglutination Detected ({Math.round(agglutinationLevel)}%)
              </div>
            )}
          </div>
        </div>

        {/* Relational Applications */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
          <h4 className="font-bold mb-3 text-center">Relational Dynamic Applications</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-rose-600 mb-1">Self-Relationship</div>
              <p className="text-slate-600 dark:text-slate-300">Shadow integration, authentic self-expression, Connessor/Magnesor balance</p>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600 mb-1">Idea-Relationship</div>
              <p className="text-slate-600 dark:text-slate-300">Creative manifestation, innovative thinking, overcoming mental agglutination</p>
            </div>
            <div className="text-center">
              <div className="font-semibold text-cyan-600 mb-1">Other-Relationship</div>
              <p className="text-slate-600 dark:text-slate-300">Couples dynamics, team collaboration, navigating relational momentum</p>
            </div>
          </div>
        </div>

        {/* Floating Control Panel */}
        <FloatingControlPanel
          isOpen={isControlsOpen}
          onClose={() => setIsControlsOpen(false)}
          compassState={compassState}
          onStateChange={handleStateChange}
          isAnimating={isAnimating}
          onAnimationToggle={() => setIsAnimating(!isAnimating)}
          onNextPosition={nextPosition}
          onReset={resetCompass}
        />
      </CardContent>
    </Card>
  );
};

export default CalmMagicCompass;
