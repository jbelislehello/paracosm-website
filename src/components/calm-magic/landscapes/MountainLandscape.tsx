
import React, { useState, useEffect } from 'react';
import { EmotionalState } from '@/types/journal';

interface MountainLandscapeProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
  isActive: boolean;
}

const MountainLandscape: React.FC<MountainLandscapeProps> = ({ emotionalState, onStateChange, isActive }) => {
  const [visionPoints, setVisionPoints] = useState<Array<{ x: number; y: number; insight: string; clarity: number }>>([]);
  const [integrationPaths, setIntegrationPaths] = useState<Array<{ points: number[][]; strength: number }>>([]);
  const [peakView, setPeakView] = useState(false);
  const freeLevel = emotionalState.free_level || 50;

  useEffect(() => {
    // Initialize vision anchoring points
    const visionInsights = [
      'System Integration',
      'Sovereign Insight',
      'Peak Synthesis',
      'Meta-Pattern Recognition',
      'Transcendent Understanding'
    ];

    const points = visionInsights.map((insight, index) => ({
      x: 100 + index * 80,
      y: 300 - (index * 40) - (freeLevel / 100) * 100,
      insight,
      clarity: (freeLevel / 100) * (index + 1) / 5
    }));

    setVisionPoints(points);

    // Create integration paths
    if (freeLevel > 60) {
      const paths = [
        { points: [[50, 350], [200, 250], [350, 150], [500, 100]], strength: freeLevel / 100 },
        { points: [[100, 300], [300, 200], [450, 120]], strength: (freeLevel - 20) / 100 }
      ];
      setIntegrationPaths(paths);
    }

    // Peak view unlocked at high levels
    setPeakView(freeLevel > 80);
  }, [freeLevel]);

  const handleVisionAnchor = (x: number, y: number) => {
    // Vision anchoring interaction
    const newLevel = Math.min(100, freeLevel + 8);
    onStateChange({ ...emotionalState, free_level: newLevel });

    // Add new vision point
    const newVision = {
      x,
      y,
      insight: 'Emergent Vision',
      clarity: newLevel / 100
    };
    setVisionPoints(prev => [...prev.slice(-4), newVision]);
  };

  const handleIntegrationGesture = () => {
    // Meta-pattern integration
    const integrationBoost = Math.min(100, freeLevel + 12);
    onStateChange({ ...emotionalState, free_level: integrationBoost });
  };

  const handlePeakExperience = () => {
    // Sovereign insight activation
    if (freeLevel > 70) {
      const transcendentLevel = Math.min(100, freeLevel + 20);
      onStateChange({ ...emotionalState, free_level: transcendentLevel });
    }
  };

  return (
    <div className={`relative w-full h-96 overflow-hidden transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
      {/* Mountain Base and Slopes */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        style={{
          background: `linear-gradient(to top, 
            rgba(139, 69, 19, 0.4) 0%, 
            rgba(160, 82, 45, 0.3) 30%, 
            rgba(192, 192, 192, 0.4) 70%, 
            rgba(255, 255, 255, 0.6) 100%)`,
          clipPath: 'polygon(0% 100%, 50% 20%, 100% 100%)'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleVisionAnchor(e.clientX - rect.left, e.clientY - rect.top);
        }}
      />

      {/* Mountain Peak (Sovereign Insight) */}
      <div 
        className="absolute top-16 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={handlePeakExperience}
      >
        <div 
          className={`w-8 h-8 ${peakView ? 'bg-yellow-300' : 'bg-gray-300'} rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform`}
          style={{
            boxShadow: peakView ? '0 0 20px rgba(255, 215, 0, 0.8)' : 'none'
          }}
        />
        {peakView && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-yellow-700 font-bold whitespace-nowrap">
            🏔️ Peak Clarity
          </div>
        )}
      </div>

      {/* Integration Paths */}
      <svg className="absolute inset-0 pointer-events-none">
        {integrationPaths.map((path, index) => (
          <path
            key={index}
            d={`M ${path.points.map(p => p.join(',')).join(' L ')}`}
            stroke={`rgba(255, 215, 0, ${path.strength * 0.8})`}
            strokeWidth={path.strength * 4}
            fill="none"
            strokeDasharray={path.strength > 0.7 ? 'none' : '10,5'}
            style={{
              filter: path.strength > 0.8 ? 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))' : 'none'
            }}
          />
        ))}
      </svg>

      {/* Vision Anchoring Points */}
      {visionPoints.map((point, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`
          }}
        >
          <div 
            className={`w-4 h-4 rounded-full border-2 border-yellow-500 transition-all duration-500`}
            style={{
              backgroundColor: `rgba(255, 215, 0, ${point.clarity})`,
              transform: `scale(${0.5 + point.clarity * 0.8})`,
              boxShadow: point.clarity > 0.7 ? '0 0 10px rgba(255, 215, 0, 0.6)' : 'none'
            }}
          />
          {point.clarity > 0.5 && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-700 font-medium whitespace-nowrap">
              {point.insight}
            </div>
          )}
        </div>
      ))}

      {/* Integration Control */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleIntegrationGesture}
          disabled={freeLevel < 50}
          className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-full hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⚡ Meta-Integration
        </button>
      </div>

      {/* Free Level Indicator */}
      <div className="absolute top-4 left-4 text-yellow-600 text-sm">
        Neurogenesis: {Math.round(freeLevel)}%
      </div>

      {/* Sovereignty Status */}
      <div className="absolute top-4 right-4">
        <div className="text-xs text-yellow-600 mb-1">Sovereign Insight</div>
        <div className={`w-3 h-3 rounded-full ${freeLevel > 85 ? 'bg-yellow-400' : 'bg-gray-400'} animate-pulse`} />
      </div>

      {/* Peak View - All Landscapes Visible */}
      {peakView && (
        <div className="absolute top-16 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <div className="text-xs font-medium mb-2">🏔️ Peak View</div>
          <div className="text-xs space-y-1">
            <div>🌳 Love: {emotionalState.love_level || 50}%</div>
            <div>🌊 Magic: {emotionalState.magic_level || 50}%</div>
            <div>🏞️ Calm: {emotionalState.calm_level || 50}%</div>
            <div>🌳 Open: {emotionalState.open_level || 50}%</div>
            <div>⛰️ Free: {freeLevel}%</div>
          </div>
        </div>
      )}

      {/* Poiesis Indicator */}
      {isActive && freeLevel > 85 && (
        <div className="absolute top-12 right-4 text-yellow-600 text-sm font-medium animate-pulse">
          ⚡ Transcendent Integration
        </div>
      )}
    </div>
  );
};

export default MountainLandscape;
