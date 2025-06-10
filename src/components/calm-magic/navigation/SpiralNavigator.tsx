
import React, { useState, useEffect } from 'react';

interface SpiralNavigatorProps {
  currentLandscape: number;
  onLandscapeChange: (index: number) => void;
  transformationStages: string[];
  emotionalJourney: string[];
}

const SpiralNavigator: React.FC<SpiralNavigatorProps> = ({
  currentLandscape,
  onLandscapeChange,
  transformationStages,
  emotionalJourney
}) => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const spiralCenter = { x: 150, y: 150 };
  const spiralRadius = 80;
  const numStages = transformationStages.length;

  // Calculate spiral positions (nautilus shell pattern)
  const getSpiralPosition = (stageIndex: number) => {
    const angle = (stageIndex / numStages) * Math.PI * 4; // Two full rotations
    const radius = spiralRadius * (1 - stageIndex / numStages); // Decreasing radius toward center
    
    return {
      x: spiralCenter.x + Math.cos(angle) * radius,
      y: spiralCenter.y + Math.sin(angle) * radius,
      angle
    };
  };

  const getStageColor = (stageIndex: number, currentIndex: number) => {
    if (stageIndex === currentIndex) return '#10b981'; // Current stage
    if (stageIndex < currentIndex) return '#6366f1'; // Completed stages
    return '#94a3b8'; // Future stages
  };

  const getEmotionalState = (stageIndex: number) => {
    const states = ['nervousness', 'curiosity', 'excitement', 'calm', 'bravery', 'insight', 'integration'];
    return states[Math.min(stageIndex, states.length - 1)];
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Spiral Path */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        
        {/* Draw spiral path */}
        <path
          d={(() => {
            let path = '';
            for (let i = 0; i <= 100; i++) {
              const angle = (i / 100) * Math.PI * 4;
              const radius = spiralRadius * (1 - i / 100);
              const x = spiralCenter.x + Math.cos(angle) * radius;
              const y = spiralCenter.y + Math.sin(angle) * radius;
              path += (i === 0 ? 'M' : 'L') + ` ${x},${y}`;
            }
            return path;
          })()}
          stroke="url(#spiralGradient)"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Transformation Stages */}
      {transformationStages.map((stage, index) => {
        const position = getSpiralPosition(index);
        const isActive = index === currentLandscape;
        const isHovered = index === hoveredStage;
        
        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: isActive || isHovered ? 10 : 5
            }}
            onClick={() => onLandscapeChange(index)}
            onMouseEnter={() => setHoveredStage(index)}
            onMouseLeave={() => setHoveredStage(null)}
          >
            {/* Stage Circle */}
            <div
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                isActive ? 'scale-125 shadow-lg' : isHovered ? 'scale-110' : 'scale-100'
              }`}
              style={{
                backgroundColor: getStageColor(index, currentLandscape),
                borderColor: isActive ? '#ffffff' : getStageColor(index, currentLandscape),
                boxShadow: isActive ? `0 0 20px ${getStageColor(index, currentLandscape)}80` : 'none'
              }}
            />

            {/* Stage Info on Hover */}
            {(isHovered || isActive) && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                <div className="bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                  <div className="font-medium">{stage}</div>
                  <div className="text-gray-300 mt-1">{getEmotionalState(index)}</div>
                  {emotionalJourney[index] && (
                    <div className="text-gray-400 text-xs mt-1">{emotionalJourney[index]}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Center Integration Point */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{
          left: `${spiralCenter.x}px`,
          top: `${spiralCenter.y}px`
        }}
        onClick={() => onLandscapeChange(numStages)} // Navigate to integration view
      >
        <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-white shadow-lg animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-transparent opacity-30" />
        </div>
        {hoveredStage === numStages && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Integration Core
          </div>
        )}
      </div>

      {/* Journey Progress Indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs text-slate-600 mb-1">Transformation Journey</div>
        <div className="flex gap-1">
          {transformationStages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-1 rounded-full transition-colors duration-300 ${
                index <= currentLandscape ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpiralNavigator;
