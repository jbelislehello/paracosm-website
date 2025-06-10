
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SpiralVsLoopComparator: React.FC = () => {
  const [activeView, setActiveView] = useState<'loop' | 'spiral' | 'comparison'>('comparison');
  const [animationPhase, setAnimationPhase] = useState(0);

  // Generate spiral path
  const generateSpiralPath = () => {
    let path = '';
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 80;
    
    for (let angle = 0; angle <= 720; angle += 10) {
      const radian = (angle * Math.PI) / 180;
      const radius = (angle / 720) * maxRadius;
      const x = centerX + Math.cos(radian) * radius;
      const y = centerY + Math.sin(radian) * radius;
      
      if (angle === 0) {
        path += `M ${x},${y}`;
      } else {
        path += ` L ${x},${y}`;
      }
    }
    return path;
  };

  // Generate loop path
  const generateLoopPath = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 60;
    
    return `M ${centerX + radius},${centerY} 
            A ${radius},${radius} 0 1,1 ${centerX + radius - 0.1},${centerY}`;
  };

  const spiralPath = generateSpiralPath();
  const loopPath = generateLoopPath();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🌊 Organizational Patterns: Loops vs Spirals
            <div className="flex gap-2">
              <Button
                variant={activeView === 'loop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('loop')}
              >
                Loop Pattern
              </Button>
              <Button
                variant={activeView === 'spiral' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('spiral')}
              >
                Spiral Pattern
              </Button>
              <Button
                variant={activeView === 'comparison' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('comparison')}
              >
                Compare
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pattern Visualization */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Loop Pattern */}
            <div className={`${activeView !== 'spiral' ? 'opacity-100' : 'opacity-30'} transition-opacity`}>
              <h4 className="font-semibold text-red-600 mb-3 text-center">Organizational Loops</h4>
              <svg width="300" height="300" className="border rounded-lg bg-red-50 dark:bg-red-950/20">
                <defs>
                  <marker id="arrowLoop" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#dc2626" />
                  </marker>
                </defs>
                
                <path
                  d={loopPath}
                  stroke="#dc2626"
                  strokeWidth="4"
                  fill="none"
                  markerEnd="url(#arrowLoop)"
                  className="animate-pulse"
                />
                
                {/* Loop Labels */}
                <text x="150" y="80" textAnchor="middle" fontSize="12" fill="#dc2626" fontWeight="bold">
                  Reactive
                </text>
                <text x="220" y="150" textAnchor="middle" fontSize="12" fill="#dc2626" fontWeight="bold">
                  Blame
                </text>
                <text x="150" y="220" textAnchor="middle" fontSize="12" fill="#dc2626" fontWeight="bold">
                  Fix
                </text>
                <text x="80" y="150" textAnchor="middle" fontSize="12" fill="#dc2626" fontWeight="bold">
                  Crisis
                </text>
                
                {/* Center label */}
                <text x="150" y="155" textAnchor="middle" fontSize="10" fill="#7f1d1d">
                  Stuck Pattern
                </text>
              </svg>
              
              <div className="mt-3 space-y-2 text-sm">
                <Badge variant="destructive" className="w-full justify-center">
                  Characteristics of Loops
                </Badge>
                <ul className="text-red-700 dark:text-red-300 space-y-1">
                  <li>• Reactive to problems</li>
                  <li>• Blame-focused culture</li>
                  <li>• Quick fixes only</li>
                  <li>• No real learning</li>
                  <li>• Energy depletion</li>
                </ul>
              </div>
            </div>

            {/* Spiral Pattern */}
            <div className={`${activeView !== 'loop' ? 'opacity-100' : 'opacity-30'} transition-opacity`}>
              <h4 className="font-semibold text-green-600 mb-3 text-center">Organizational Spirals</h4>
              <svg width="300" height="300" className="border rounded-lg bg-green-50 dark:bg-green-950/20">
                <defs>
                  <marker id="arrowSpiral" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#16a34a" />
                  </marker>
                  <radialGradient id="spiralGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.8"/>
                  </radialGradient>
                </defs>
                
                <circle cx="150" cy="150" r="120" fill="url(#spiralGradient)" opacity="0.2" />
                
                <path
                  d={spiralPath}
                  stroke="#16a34a"
                  strokeWidth="4"
                  fill="none"
                  markerEnd="url(#arrowSpiral)"
                  className="animate-pulse"
                />
                
                {/* Spiral Stage Labels */}
                <text x="150" y="70" textAnchor="middle" fontSize="10" fill="#16a34a" fontWeight="bold">
                  Visionary
                </text>
                <text x="230" y="100" textAnchor="middle" fontSize="10" fill="#16a34a" fontWeight="bold">
                  Creative
                </text>
                <text x="200" y="200" textAnchor="middle" fontSize="10" fill="#16a34a" fontWeight="bold">
                  Learning
                </text>
                <text x="100" y="220" textAnchor="middle" fontSize="10" fill="#16a34a" fontWeight="bold">
                  Integration
                </text>
                <text x="70" y="100" textAnchor="middle" fontSize="10" fill="#16a34a" fontWeight="bold">
                  Growth
                </text>
                
                {/* Center evolution */}
                <circle cx="150" cy="150" r="8" fill="#16a34a" className="animate-ping" />
                <text x="150" y="155" textAnchor="middle" fontSize="10" fill="#15803d">
                  Evolution
                </text>
              </svg>
              
              <div className="mt-3 space-y-2 text-sm">
                <Badge variant="default" className="w-full justify-center bg-green-600">
                  Characteristics of Spirals
                </Badge>
                <ul className="text-green-700 dark:text-green-300 space-y-1">
                  <li>• Proactive visioning</li>
                  <li>• Learning-focused culture</li>
                  <li>• Systematic improvements</li>
                  <li>• Continuous evolution</li>
                  <li>• Energy generation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transformation Framework */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardHeader>
              <CardTitle className="text-lg">AI-Accelerated Transformation Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-2 flex items-center justify-center">
                    🔄
                  </div>
                  <h4 className="font-semibold text-red-600 mb-1">Detect Loops</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    AI pattern recognition identifies stuck organizational cycles
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mx-auto mb-2 flex items-center justify-center">
                    🌊
                  </div>
                  <h4 className="font-semibold text-yellow-600 mb-1">Interrupt & Shift</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Calm magic practices create new neural pathways for change
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-2 flex items-center justify-center">
                    🌀
                  </div>
                  <h4 className="font-semibold text-green-600 mb-1">Establish Spirals</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    AI amplifies learning cycles into evolutionary spirals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpiralVsLoopComparator;
