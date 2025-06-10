
import React, { useState, useEffect } from 'react';
import { EmotionalState } from '@/types/journal';

interface RiverLandscapeProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
  isActive: boolean;
}

const RiverLandscape: React.FC<RiverLandscapeProps> = ({ emotionalState, onStateChange, isActive }) => {
  const [flowParticles, setFlowParticles] = useState<Array<{ id: number; x: number; y: number; speed: number }>>([]);
  const [emergencePoints, setEmergencePoints] = useState<Array<{ x: number; y: number; intensity: number }>>([]);
  const magicLevel = emotionalState.magic_level || 50;

  useEffect(() => {
    // Initialize flow particles
    const particles = Array.from({ length: Math.floor(magicLevel / 10) + 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: 100 + Math.random() * 50,
      speed: 0.5 + (magicLevel / 100) * 2
    }));
    setFlowParticles(particles);

    // Create emergence points based on magic level
    if (magicLevel > 60) {
      const points = Array.from({ length: 3 }, (_, i) => ({
        x: 100 + i * 120,
        y: 120 + Math.sin(i) * 30,
        intensity: magicLevel / 100
      }));
      setEmergencePoints(points);
    }
  }, [magicLevel]);

  useEffect(() => {
    if (!isActive) return;

    const animateFlow = () => {
      setFlowParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.speed,
        x: particle.x > 450 ? -50 : particle.x
      })));
    };

    const interval = setInterval(animateFlow, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleRiverClick = (x: number, y: number) => {
    // Expressivity: clicking in river creates emergence points
    const newLevel = Math.min(100, magicLevel + 8);
    onStateChange({ ...emotionalState, magic_level: newLevel });
    
    // Add new emergence point
    setEmergencePoints(prev => [...prev.slice(-2), { x, y, intensity: newLevel / 100 }]);
  };

  const handleFlowGesture = (direction: 'upstream' | 'downstream') => {
    const adjustment = direction === 'downstream' ? 5 : -5;
    const newLevel = Math.max(0, Math.min(100, magicLevel + adjustment));
    onStateChange({ ...emotionalState, magic_level: newLevel });
  };

  return (
    <div className={`relative w-full h-96 overflow-hidden transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
      {/* River Base */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        style={{
          background: `linear-gradient(to right, 
            transparent 0%, 
            rgba(64, 164, 223, 0.3) 20%, 
            rgba(64, 164, 223, 0.6) 50%, 
            rgba(64, 164, 223, 0.3) 80%, 
            transparent 100%)`,
          clipPath: 'polygon(0 40%, 100% 30%, 100% 70%, 0 60%)'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleRiverClick(e.clientX - rect.left, e.clientY - rect.top);
        }}
      />

      {/* Flow Particles (Strategic Intuition) */}
      {flowParticles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-70"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transition: 'all 0.05s linear'
          }}
        />
      ))}

      {/* Emergence Points */}
      {emergencePoints.map((point, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            width: `${20 + point.intensity * 30}px`,
            height: `${20 + point.intensity * 30}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${point.intensity * 0.8}) 0%, transparent 70%)`,
            borderRadius: '50%',
            animation: `ripple 2s ease-out infinite ${index * 0.5}s`
          }}
        />
      ))}

      {/* Flow Direction Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => handleFlowGesture('upstream')}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          ← Upstream
        </button>
        <button
          onClick={() => handleFlowGesture('downstream')}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          Downstream →
        </button>
      </div>

      {/* Magic Level Indicator */}
      <div className="absolute top-4 left-4 text-blue-600 text-sm">
        Spaciousness: {Math.round(magicLevel)}%
      </div>

      {/* Poiesis Indicator */}
      {isActive && magicLevel > 75 && (
        <div className="absolute top-4 right-4 text-blue-600 text-sm font-medium animate-pulse">
          🌊 Flow State Active
        </div>
      )}

      <style jsx>{`
        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default RiverLandscape;
