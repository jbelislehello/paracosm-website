
import React, { useState, useEffect } from 'react';
import { EmotionalState } from '@/types/journal';

interface TreeLandscapeProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
  isActive: boolean;
}

const TreeLandscape: React.FC<TreeLandscapeProps> = ({ emotionalState, onStateChange, isActive }) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const loveLevel = emotionalState.love_level || 50;

  const handleRootClick = (rootType: string) => {
    // Expressivity: clicking roots affects the love level
    const newLevel = Math.min(100, loveLevel + 10);
    onStateChange({ ...emotionalState, love_level: newLevel });
  };

  const handleLeafGesture = (x: number, y: number) => {
    // Creative initiative expression through leaf interaction
    const creativityBoost = Math.min(100, loveLevel + 5);
    onStateChange({ ...emotionalState, love_level: creativityBoost });
  };

  return (
    <div className={`relative w-full h-96 overflow-hidden transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
      {/* Tree Trunk (Team Vitality) */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{ 
          width: `${20 + (loveLevel / 100) * 40}px`,
          height: `${120 + (loveLevel / 100) * 80}px`,
          background: `linear-gradient(to top, #8b4513, #d2691e)`,
          borderRadius: '20px 20px 0 0',
          transition: 'all 0.5s ease'
        }}
        onMouseEnter={() => setHoveredElement('trunk')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        {hoveredElement === 'trunk' && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Team Vitality: {Math.round(loveLevel)}%
          </div>
        )}
      </div>

      {/* Tree Roots (Values) */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4">
        {['core_values', 'trust', 'authenticity'].map((root, index) => (
          <div
            key={root}
            className="cursor-pointer"
            style={{
              width: `${30 + (loveLevel / 100) * 20}px`,
              height: '40px',
              background: '#654321',
              transform: `rotate(${(index - 1) * 30}deg) translateY(20px)`,
              borderRadius: '0 0 15px 15px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handleRootClick(root)}
            onMouseEnter={() => setHoveredElement(root)}
            onMouseLeave={() => setHoveredElement(null)}
          >
            {hoveredElement === root && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 py-1 rounded">
                {root.replace('_', ' ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tree Leaves (Creative Initiatives) */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        {Array.from({ length: Math.floor(loveLevel / 10) + 3 }).map((_, index) => (
          <div
            key={index}
            className="absolute cursor-pointer"
            style={{
              width: '30px',
              height: '20px',
              background: `hsl(${120 + (loveLevel / 100) * 40}, 70%, 50%)`,
              borderRadius: '50%',
              left: `${Math.sin(index * 0.5) * 60 - 15}px`,
              top: `${Math.cos(index * 0.3) * 40 + 20}px`,
              transform: `rotate(${index * 45}deg)`,
              transition: 'all 0.3s ease',
              animation: `sway 3s ease-in-out infinite ${index * 0.2}s`
            }}
            onClick={(e) => handleLeafGesture(e.clientX, e.clientY)}
            onMouseEnter={() => setHoveredElement(`leaf-${index}`)}
            onMouseLeave={() => setHoveredElement(null)}
          >
            {hoveredElement === `leaf-${index}` && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 py-1 rounded whitespace-nowrap">
                Creative Initiative
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Poiesis Indicator */}
      {isActive && loveLevel > 70 && (
        <div className="absolute top-4 right-4 text-green-600 text-sm font-medium animate-pulse">
          🌟 Poiesis Active
        </div>
      )}

      <style jsx>{`
        @keyframes sway {
          0%, 100% { transform: translateX(0) rotate(var(--rotation)); }
          50% { transform: translateX(5px) rotate(calc(var(--rotation) + 5deg)); }
        }
      `}</style>
    </div>
  );
};

export default TreeLandscape;
