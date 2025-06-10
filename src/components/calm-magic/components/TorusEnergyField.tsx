
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ModeType } from '../context/ModeContext';

interface TorusEnergyFieldProps {
  mode: ModeType;
}

const TorusEnergyField: React.FC<TorusEnergyFieldProps> = ({ mode }) => {
  const [fieldIntensity, setFieldIntensity] = useState(50);
  const [activeRings, setActiveRings] = useState(3);
  const [flowDirection, setFlowDirection] = useState<'inward' | 'outward'>('outward');
  const [animationSpeed, setAnimationSpeed] = useState(1);

  // Generate torus ring positions
  const generateTorusRings = () => {
    const rings = [];
    const centerX = 200;
    const centerY = 150;
    
    for (let i = 0; i < activeRings; i++) {
      const radius = 30 + (i * 25);
      const opacity = 1 - (i * 0.2);
      const strokeWidth = 3 - (i * 0.5);
      
      rings.push({
        id: i,
        radius,
        opacity: Math.max(0.2, opacity),
        strokeWidth: Math.max(1, strokeWidth),
        cx: centerX,
        cy: centerY
      });
    }
    return rings;
  };

  const rings = generateTorusRings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌀 Organizational Torus Energy Field
            <Badge variant="outline" className="ml-auto">
              {mode === 'professional' ? 'Professional Mode' : 'Personal Mode'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Interactive Controls */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Field Intensity</label>
              <Slider
                value={[fieldIntensity]}
                onValueChange={([value]) => setFieldIntensity(value)}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-slate-500">
                {fieldIntensity < 30 && "Fragmented - Low organizational coherence"}
                {fieldIntensity >= 30 && fieldIntensity < 70 && "Emerging - Building collective intelligence"}
                {fieldIntensity >= 70 && "Integrated - High-performance learning organization"}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Active Learning Rings</label>
              <Slider
                value={[activeRings]}
                onValueChange={([value]) => setActiveRings(value)}
                min={1}
                max={6}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-slate-500">
                Individual → Team → Department → Organization → Network → Ecosystem
              </div>
            </div>
          </div>

          {/* Torus Visualization */}
          <div className="relative">
            <svg width="400" height="300" className="mx-auto border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              {/* Background Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
                <radialGradient id="fieldGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                </radialGradient>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Central Energy Field */}
              <circle
                cx="200"
                cy="150"
                r={fieldIntensity * 1.5}
                fill="url(#fieldGradient)"
                opacity="0.3"
              />

              {/* Torus Rings */}
              {rings.map((ring, index) => (
                <g key={ring.id}>
                  {/* Main Ring */}
                  <circle
                    cx={ring.cx}
                    cy={ring.cy}
                    r={ring.radius}
                    fill="none"
                    stroke={mode === 'professional' ? '#3b82f6' : '#8b5cf6'}
                    strokeWidth={ring.strokeWidth}
                    opacity={ring.opacity}
                    className="animate-pulse"
                    style={{
                      animationDelay: `${index * 0.5}s`,
                      animationDuration: `${2 / animationSpeed}s`
                    }}
                  />
                  
                  {/* Flow Indicators */}
                  {[0, 90, 180, 270].map(angle => {
                    const radian = (angle * Math.PI) / 180;
                    const x = ring.cx + Math.cos(radian) * ring.radius;
                    const y = ring.cy + Math.sin(radian) * ring.radius;
                    
                    return (
                      <circle
                        key={`${ring.id}-${angle}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill={mode === 'professional' ? '#3b82f6' : '#8b5cf6'}
                        opacity={ring.opacity * 0.8}
                        className="animate-ping"
                        style={{
                          animationDelay: `${(index * 0.5) + (angle / 360)}s`,
                          animationDuration: `${3 / animationSpeed}s`
                        }}
                      />
                    );
                  })}
                </g>
              ))}

              {/* Center Core */}
              <circle
                cx="200"
                cy="150"
                r="8"
                fill={mode === 'professional' ? '#1e40af' : '#7c3aed'}
                className="animate-pulse"
              />
              
              {/* Level Labels */}
              <text x="320" y="30" fontSize="12" fill="#64748b" textAnchor="start">
                Organizational Learning Levels
              </text>
              {['Individual', 'Team', 'Department', 'Organization', 'Network', 'Ecosystem'].slice(0, activeRings).map((level, index) => (
                <text
                  key={level}
                  x="320"
                  y={50 + (index * 20)}
                  fontSize="10"
                  fill="#64748b"
                  textAnchor="start"
                >
                  {index + 1}. {level}
                </text>
              ))}
            </svg>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              variant={flowDirection === 'outward' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFlowDirection('outward')}
            >
              Outward Flow
            </Button>
            <Button
              variant={flowDirection === 'inward' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFlowDirection('inward')}
            >
              Inward Flow
            </Button>
          </div>

          {/* Energy Field Insights */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Current Field Analysis
            </h4>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="font-medium">Coherence Level</div>
                <div className="text-blue-600">{fieldIntensity}%</div>
              </div>
              <div>
                <div className="font-medium">Active Levels</div>
                <div className="text-blue-600">{activeRings} Rings</div>
              </div>
              <div>
                <div className="font-medium">Flow Pattern</div>
                <div className="text-blue-600 capitalize">{flowDirection}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TorusEnergyField;
