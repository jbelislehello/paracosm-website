
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface CompassState {
  currentForce: 'love' | 'magic' | 'calm' | 'open';
  arrowLength: number;
  connessorLevel: number;
  magnesorLevel: number;
  isCongruent: boolean;
}

const CalmMagicCompass: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [compassState, setCompassState] = useState<CompassState>({
    currentForce: 'love',
    arrowLength: 40,
    connessorLevel: 1,
    magnesorLevel: 1,
    isCongruent: true
  });

  const forces = [
    { name: 'love', angle: 0, color: '#ec4899', label: 'Love', description: 'Connection & Compassion' },
    { name: 'magic', angle: 90, color: '#8b5cf6', label: 'Magic', description: 'Wonder & Possibility' },
    { name: 'calm', angle: 180, color: '#06b6d4', label: 'Calm', description: 'Peace & Centeredness' },
    { name: 'open', angle: 270, color: '#10b981', label: 'Open', description: 'Receptivity & Growth' }
  ];

  const getCurrentForceIndex = () => {
    return forces.findIndex(f => f.name === compassState.currentForce);
  };

  const nextForce = () => {
    const currentIndex = getCurrentForceIndex();
    const nextIndex = (currentIndex + 1) % forces.length;
    const nextForceData = forces[nextIndex];
    
    setCompassState(prev => ({
      ...prev,
      currentForce: nextForceData.name as 'love' | 'magic' | 'calm' | 'open',
      arrowLength: Math.min(prev.arrowLength + 10, 80),
      connessorLevel: Math.min(prev.connessorLevel + 0.25, 5),
      magnesorLevel: Math.min(prev.magnesorLevel + 0.25, 5),
      isCongruent: Math.random() > 0.3 // 70% chance of congruence
    }));
  };

  const resetCompass = () => {
    setIsAnimating(false);
    setCompassState({
      currentForce: 'love',
      arrowLength: 40,
      connessorLevel: 1,
      magnesorLevel: 1,
      isCongruent: true
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(nextForce, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const currentForce = forces[getCurrentForceIndex()];
  const arrowRotation = currentForce.angle;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Calm Magic Freedom Compass</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Watch how freedom grows as you move through the forces clockwise
          </p>
        </div>

        {/* Compass Visualization */}
        <div className="relative w-80 h-80 mx-auto mb-6">
          {/* Compass Circle */}
          <svg className="w-full h-full" viewBox="0 0 320 320">
            {/* Background Circle */}
            <circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              className="opacity-30"
            />
            
            {/* Force Quadrants */}
            {forces.map((force, index) => {
              const isActive = force.name === compassState.currentForce;
              const x = 160 + Math.cos((force.angle - 90) * Math.PI / 180) * 120;
              const y = 160 + Math.sin((force.angle - 90) * Math.PI / 180) * 120;
              
              return (
                <g key={force.name}>
                  {/* Force Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? "25" : "20"}
                    fill={force.color}
                    className={`transition-all duration-500 ${
                      isActive ? 'opacity-100' : 'opacity-60'
                    }`}
                  />
                  
                  {/* Force Label */}
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    className="fill-white text-sm font-semibold"
                  >
                    {force.label}
                  </text>
                  
                  {/* Congruence Indicator */}
                  {isActive && (
                    <circle
                      cx={x}
                      cy={y}
                      r="30"
                      fill="none"
                      stroke={compassState.isCongruent ? '#10b981' : '#ef4444'}
                      strokeWidth="3"
                      strokeDasharray={compassState.isCongruent ? "0" : "5,5"}
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
            
            {/* Freedom Arrow */}
            <g transform={`translate(160, 160) rotate(${arrowRotation})`}>
              <line
                x1="0"
                y1="0"
                x2={compassState.arrowLength}
                y2="0"
                stroke="#1f2937"
                strokeWidth="4"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <polygon
                points={`${compassState.arrowLength},0 ${compassState.arrowLength - 8},-4 ${compassState.arrowLength - 8},4`}
                fill="#1f2937"
                className="transition-all duration-1000"
              />
            </g>
            
            {/* Center Circle */}
            <circle
              cx="160"
              cy="160"
              r="8"
              fill="#1f2937"
            />
          </svg>
        </div>

        {/* Current State Display */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentForce.color }}
            />
            <span className="font-semibold">{currentForce.label}</span>
            <span className="text-sm text-slate-600">- {currentForce.description}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Connessor</div>
              <div className="text-slate-600">{compassState.connessorLevel.toFixed(1)}</div>
            </div>
            <div>
              <div className="font-medium">Freedom</div>
              <div className="text-slate-600">{Math.round((compassState.arrowLength / 80) * 100)}%</div>
            </div>
            <div>
              <div className="font-medium">Magnesor</div>
              <div className="text-slate-600">{compassState.magnesorLevel.toFixed(1)}</div>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            compassState.isCongruent 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {compassState.isCongruent ? '✓ Congruent' : '⚠ Non-Congruent'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center gap-2"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAnimating ? 'Pause' : 'Start'} Animation
          </Button>
          
          <Button
            onClick={nextForce}
            variant="outline"
            disabled={isAnimating}
          >
            Next Force
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
