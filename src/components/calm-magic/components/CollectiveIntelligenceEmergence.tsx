
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CollectiveIntelligenceEmergence: React.FC = () => {
  const [emergenceLevel, setEmergenceLevel] = useState(0);
  const [activeNodes, setActiveNodes] = useState(12);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Simulate emergence evolution
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
      setEmergenceLevel(prev => {
        const newLevel = 40 + Math.sin(prev * 0.1) * 20 + Math.random() * 10;
        return Math.max(0, Math.min(100, newLevel));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Generate network nodes for visualization
  const generateNetworkNodes = () => {
    const nodes = [];
    const centerX = 200;
    const centerY = 150;
    
    for (let i = 0; i < activeNodes; i++) {
      const angle = (i / activeNodes) * Math.PI * 2;
      const radius = 80 + Math.sin(animationPhase * 0.02 + i) * 20;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      nodes.push({
        id: i,
        x,
        y,
        intensity: Math.random() * 0.5 + 0.5,
        connections: Math.floor(Math.random() * 3) + 1
      });
    }
    return nodes;
  };

  const nodes = generateNetworkNodes();

  const getEmergencePhase = (level: number) => {
    if (level < 25) return { phase: 'Individual', color: '#ef4444', description: 'Isolated silos' };
    if (level < 50) return { phase: 'Connected', color: '#f59e0b', description: 'Basic networking' };
    if (level < 75) return { phase: 'Coordinated', color: '#3b82f6', description: 'Synchronized action' };
    return { phase: 'Emergent', color: '#10b981', description: 'Collective intelligence' };
  };

  const currentPhase = getEmergencePhase(emergenceLevel);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            ✨ Collective Intelligence Emergence
            <Badge style={{ backgroundColor: currentPhase.color, color: 'white' }}>
              {currentPhase.phase} ({Math.round(emergenceLevel)}%)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Network Visualization */}
          <div className="relative">
            <svg
              width="400"
              height="300"
              className="mx-auto border rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20"
            >
              <defs>
                <radialGradient id="emergenceGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={currentPhase.color} stopOpacity="0.3"/>
                  <stop offset="100%" stopColor={currentPhase.color} stopOpacity="0.05"/>
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Emergence Field */}
              <circle
                cx="200"
                cy="150"
                r={emergenceLevel * 1.2}
                fill="url(#emergenceGradient)"
                opacity="0.6"
              />

              {/* Connection Lines */}
              {nodes.map((node, i) => 
                nodes.slice(i + 1).map((otherNode, j) => {
                  const distance = Math.sqrt(
                    Math.pow(node.x - otherNode.x, 2) + 
                    Math.pow(node.y - otherNode.y, 2)
                  );
                  
                  // Only draw connections for nearby nodes
                  if (distance < 120 && Math.random() > 0.7) {
                    return (
                      <line
                        key={`${i}-${j}`}
                        x1={node.x}
                        y1={node.y}
                        x2={otherNode.x}
                        y2={otherNode.y}
                        stroke={currentPhase.color}
                        strokeWidth={Math.max(1, (node.intensity + otherNode.intensity) * 2)}
                        opacity={Math.min(0.8, (node.intensity + otherNode.intensity) / 2)}
                        className="animate-pulse"
                      />
                    );
                  }
                  return null;
                })
              )}

              {/* Network Nodes */}
              {nodes.map((node, i) => (
                <g key={i}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={4 + node.intensity * 6}
                    fill={currentPhase.color}
                    opacity={node.intensity}
                    filter="url(#glow)"
                    className="animate-pulse"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '2s'
                    }}
                  />
                  
                  {/* Node pulse effect */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={8 + node.intensity * 4}
                    fill="none"
                    stroke={currentPhase.color}
                    strokeWidth="1"
                    opacity="0.3"
                    className="animate-ping"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '3s'
                    }}
                  />
                </g>
              ))}

              {/* Central Emergence Point */}
              <circle
                cx="200"
                cy="150"
                r={8 + Math.sin(animationPhase * 0.1) * 3}
                fill={currentPhase.color}
                opacity="0.9"
                filter="url(#glow)"
                className="animate-pulse"
              />
            </svg>

            {/* Phase Description */}
            <div className="text-center mt-4">
              <div className="text-lg font-semibold" style={{ color: currentPhase.color }}>
                {currentPhase.phase} Phase
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {currentPhase.description}
              </div>
            </div>
          </div>

          {/* Emergence Controls */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Network Parameters</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Active Nodes</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveNodes(Math.max(6, activeNodes - 2))}
                    >
                      -
                    </Button>
                    <span className="text-sm w-8 text-center">{activeNodes}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveNodes(Math.min(20, activeNodes + 2))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Emergence Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Coherence Level:</span>
                  <span className="font-medium">{Math.round(emergenceLevel)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Density:</span>
                  <span className="font-medium">{Math.round((activeNodes / 20) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Information Flow:</span>
                  <span className="font-medium" style={{ color: currentPhase.color }}>
                    {currentPhase.phase}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Emergence Phases Explanation */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
            <CardHeader>
              <CardTitle className="text-base">🌱 Collective Intelligence Evolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2" />
                  <div className="font-semibold">Individual</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Separate knowledge silos, limited sharing
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2" />
                  <div className="font-semibold">Connected</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Basic networking, information exchange
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2" />
                  <div className="font-semibold">Coordinated</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Synchronized action, shared goals
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2" />
                  <div className="font-semibold">Emergent</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Collective wisdom, spontaneous innovation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Acceleration Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">🚀 AI Acceleration Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="font-medium">Pattern Amplification:</span> AI identifies successful 
                  collaboration patterns and helps replicate them across the organization.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="font-medium">Connection Facilitation:</span> Smart matching of 
                  complementary skills and perspectives to accelerate innovation.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="font-medium">Emergence Detection:</span> Early identification 
                  of collective intelligence breakthroughs and scaling opportunities.
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectiveIntelligenceEmergence;
