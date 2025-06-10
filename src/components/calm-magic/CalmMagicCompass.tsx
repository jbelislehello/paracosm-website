
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface CompassState {
  currentQuadrant: 'love' | 'magic' | 'calm' | 'open';
  currentSubsection: number; // 0-3 for each quadrant subdivision
  freedomLevel: number; // 1-3 representing the concentric circles
  shadowIntegration: number; // 0-100
  higherSelfAlignment: number; // 0-100
  arrowDepth: number; // How deep into the process (affects arrow length)
  isCongruent: boolean;
}

const CalmMagicCompass: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [compassState, setCompassState] = useState<CompassState>({
    currentQuadrant: 'love',
    currentSubsection: 0,
    freedomLevel: 1,
    shadowIntegration: 20,
    higherSelfAlignment: 30,
    arrowDepth: 30,
    isCongruent: true
  });

  // Define the expanded quadrants with 4 subsections each
  const quadrants = [
    {
      name: 'love',
      baseAngle: 0,
      color: '#ec4899',
      label: 'Love',
      description: 'Connection & Compassion',
      subsections: [
        { name: 'Self-Love', description: 'Accepting your authentic self' },
        { name: 'Intimate Love', description: 'Deep personal connections' },
        { name: 'Universal Love', description: 'Compassion for all beings' },
        { name: 'Sacred Love', description: 'Transcendent connection' }
      ]
    },
    {
      name: 'magic',
      baseAngle: 90,
      color: '#8b5cf6',
      label: 'Magic',
      description: 'Wonder & Possibility',
      subsections: [
        { name: 'Personal Magic', description: 'Discovering your unique gifts' },
        { name: 'Creative Magic', description: 'Manifesting new realities' },
        { name: 'Relational Magic', description: 'Co-creating with others' },
        { name: 'Cosmic Magic', description: 'Aligning with universal flow' }
      ]
    },
    {
      name: 'calm',
      baseAngle: 180,
      color: '#06b6d4',
      label: 'Calm',
      description: 'Peace & Centeredness',
      subsections: [
        { name: 'Inner Calm', description: 'Finding peace within' },
        { name: 'Relational Calm', description: 'Peaceful interactions' },
        { name: 'Situational Calm', description: 'Grace under pressure' },
        { name: 'Transcendent Calm', description: 'Unity consciousness' }
      ]
    },
    {
      name: 'open',
      baseAngle: 270,
      color: '#10b981',
      label: 'Open',
      description: 'Receptivity & Growth',
      subsections: [
        { name: 'Open Mind', description: 'Embracing new perspectives' },
        { name: 'Open Heart', description: 'Vulnerable authenticity' },
        { name: 'Open Spirit', description: 'Surrendering to mystery' },
        { name: 'Open Being', description: 'Integrated wholeness' }
      ]
    }
  ];

  const getCurrentQuadrantIndex = () => {
    return quadrants.findIndex(q => q.name === compassState.currentQuadrant);
  };

  const nextPosition = () => {
    const currentQuadrantIndex = getCurrentQuadrantIndex();
    const currentQuadrant = quadrants[currentQuadrantIndex];
    
    let newQuadrant = compassState.currentQuadrant;
    let newSubsection = compassState.currentSubsection;
    let newFreedomLevel = compassState.freedomLevel;
    let newShadowIntegration = Math.min(compassState.shadowIntegration + 3, 100);
    let newHigherSelfAlignment = Math.min(compassState.higherSelfAlignment + 2, 100);
    let newArrowDepth = compassState.arrowDepth;

    // Move to next subsection or quadrant
    if (newSubsection < 3) {
      newSubsection += 1;
      newArrowDepth = Math.min(newArrowDepth + 8, 120);
    } else {
      // Move to next quadrant
      const nextQuadrantIndex = (currentQuadrantIndex + 1) % quadrants.length;
      newQuadrant = quadrants[nextQuadrantIndex].name as 'love' | 'magic' | 'calm' | 'open';
      newSubsection = 0;
      
      // Increase freedom level every full cycle
      if (nextQuadrantIndex === 0) {
        newFreedomLevel = Math.min(newFreedomLevel + 1, 3);
      }
      
      newArrowDepth = Math.min(newArrowDepth + 15, 120);
    }

    setCompassState(prev => ({
      ...prev,
      currentQuadrant: newQuadrant,
      currentSubsection: newSubsection,
      freedomLevel: newFreedomLevel,
      shadowIntegration: newShadowIntegration,
      higherSelfAlignment: newHigherSelfAlignment,
      arrowDepth: newArrowDepth,
      isCongruent: Math.random() > 0.25 // 75% chance of congruence as we progress
    }));
  };

  const resetCompass = () => {
    setIsAnimating(false);
    setCompassState({
      currentQuadrant: 'love',
      currentSubsection: 0,
      freedomLevel: 1,
      shadowIntegration: 20,
      higherSelfAlignment: 30,
      arrowDepth: 30,
      isCongruent: true
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(nextPosition, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const currentQuadrant = quadrants[getCurrentQuadrantIndex()];
  const currentSubsection = currentQuadrant.subsections[compassState.currentSubsection];
  
  // Calculate arrow angle based on quadrant and subsection
  const subsectionAngle = (360 / 16) * compassState.currentSubsection; // 22.5 degrees per subsection
  const arrowAngle = currentQuadrant.baseAngle + subsectionAngle;

  const integrationLevel = (compassState.shadowIntegration + compassState.higherSelfAlignment) / 2;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-3">Calm Magic Relational Dynamic Map</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            Integrating Shadow Self with Higher Self through Expansive Leadership
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Watch the freedom arrow explore deeper levels as you journey through relationships with self, ideas, and others
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
                    const subsectionEndAngle = quadrant.baseAngle + ((sIndex + 1) * 22.5);
                    
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
            
            {/* Freedom Arrow */}
            <g transform={`translate(192, 192) rotate(${arrowAngle})`}>
              <line
                x1="0"
                y1="0"
                x2={compassState.arrowDepth}
                y2="0"
                stroke="#1f2937"
                strokeWidth="6"
                strokeLinecap="round"
                className="transition-all duration-1500"
              />
              <polygon
                points={`${compassState.arrowDepth},0 ${compassState.arrowDepth - 12},-6 ${compassState.arrowDepth - 12},6`}
                fill="#1f2937"
                className="transition-all duration-1500"
              />
              
              {/* Arrow depth indicator */}
              <circle
                cx={compassState.arrowDepth * 0.7}
                cy="0"
                r="3"
                fill={compassState.isCongruent ? '#10b981' : '#ef4444'}
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
            
            <defs>
              <radialGradient id="integrationGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#1f2937" />
              </radialGradient>
            </defs>
          </svg>
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
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
              <div className="font-medium text-green-600">Integration</div>
              <div className="text-2xl font-bold">{Math.round(integrationLevel)}%</div>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            compassState.isCongruent 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {compassState.isCongruent ? '✓ Congruent State' : '⚠ Integration Opportunity'}
          </div>
        </div>

        {/* Relational Applications */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6">
          <h4 className="font-bold mb-3 text-center">Relational Dynamic Applications</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-rose-600 mb-1">Self-Relationship</div>
              <p className="text-slate-600 dark:text-slate-300">Shadow integration, authentic self-expression, inner harmony</p>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600 mb-1">Idea-Relationship</div>
              <p className="text-slate-600 dark:text-slate-300">Creative manifestation, innovative thinking, conceptual clarity</p>
            </div>
            <div className="text-center">
              <div className="font-semibold text-cyan-600 mb-1">Other-Relationship</div>
              <p className="text-slate-600 dark:text-slate-300">Couples dynamics, team collaboration, community building</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center gap-2"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAnimating ? 'Pause' : 'Start'} Journey
          </Button>
          
          <Button
            onClick={nextPosition}
            variant="outline"
            disabled={isAnimating}
          >
            Next Level
          </Button>
          
          <Button
            onClick={resetCompass}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalmMagicCompass;
