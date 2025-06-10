
import React, { useState, useEffect } from 'react';
import { EmotionalState } from '@/types/journal';

interface LakeLandscapeProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
  isActive: boolean;
}

const LakeLandscape: React.FC<LakeLandscapeProps> = ({ emotionalState, onStateChange, isActive }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; radius: number; opacity: number }>>([]);
  const [reflections, setReflections] = useState<Array<{ text: string; x: number; y: number; alpha: number }>>([]);
  const calmLevel = emotionalState.calm_level || 50;

  const createRipple = (x: number, y: number) => {
    const newRipple = {
      id: Date.now(),
      x,
      y,
      radius: 0,
      opacity: 1
    };
    setRipples(prev => [...prev, newRipple]);

    // Self-awareness reflection appears
    const reflectionTexts = [
      'What am I feeling right now?',
      'How is the team responding?',
      'What patterns do I notice?',
      'Where is my attention?',
      'What wants to emerge?'
    ];
    
    const reflection = {
      text: reflectionTexts[Math.floor(Math.random() * reflectionTexts.length)],
      x: x - 50,
      y: y - 30,
      alpha: 1
    };
    setReflections(prev => [...prev.slice(-2), reflection]);
  };

  useEffect(() => {
    if (!isActive) return;

    const animateRipples = () => {
      setRipples(prev => prev.map(ripple => ({
        ...ripple,
        radius: ripple.radius + 2,
        opacity: Math.max(0, ripple.opacity - 0.02)
      })).filter(ripple => ripple.opacity > 0));

      setReflections(prev => prev.map(reflection => ({
        ...reflection,
        alpha: Math.max(0, reflection.alpha - 0.01)
      })).filter(reflection => reflection.alpha > 0));
    };

    const interval = setInterval(animateRipples, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleLakeInteraction = (x: number, y: number) => {
    createRipple(x, y);
    // Emotional regulation through lake interaction
    const newLevel = Math.min(100, calmLevel + 6);
    onStateChange({ ...emotionalState, calm_level: newLevel });
  };

  const handleBreathingExercise = () => {
    // Coherence practice
    const coherenceBoost = Math.min(100, calmLevel + 15);
    onStateChange({ ...emotionalState, calm_level: coherenceBoost });
    createRipple(200, 150);
  };

  return (
    <div className={`relative w-full h-96 overflow-hidden transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
      {/* Lake Surface */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(135, 206, 250, 0.6) 0%, 
            rgba(70, 130, 180, 0.4) 50%, 
            rgba(25, 25, 112, 0.3) 100%)`,
          borderRadius: '50%',
          transform: 'scaleY(0.6)'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleLakeInteraction(e.clientX - rect.left, (e.clientY - rect.top) / 0.6);
        }}
      />

      {/* Ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute border-2 border-blue-300 rounded-full pointer-events-none"
          style={{
            left: `${ripple.x - ripple.radius}px`,
            top: `${(ripple.y - ripple.radius) * 0.6}px`,
            width: `${ripple.radius * 2}px`,
            height: `${ripple.radius * 2 * 0.6}px`,
            opacity: ripple.opacity,
            borderColor: `rgba(147, 197, 253, ${ripple.opacity})`
          }}
        />
      ))}

      {/* Self-Awareness Reflections */}
      {reflections.map((reflection, index) => (
        <div
          key={index}
          className="absolute text-xs text-slate-600 font-medium pointer-events-none"
          style={{
            left: `${reflection.x}px`,
            top: `${reflection.y}px`,
            opacity: reflection.alpha,
            transform: `translateY(${(1 - reflection.alpha) * -20}px)`
          }}
        >
          {reflection.text}
        </div>
      ))}

      {/* Breathing Exercise Control */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleBreathingExercise}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors"
        >
          🫁 Coherence Practice
        </button>
      </div>

      {/* Calm Level Indicator */}
      <div className="absolute top-4 left-4 text-blue-600 text-sm">
        Wholeness: {Math.round(calmLevel)}%
      </div>

      {/* Reflection State */}
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full ${calmLevel > 70 ? 'bg-blue-400' : 'bg-gray-400'} animate-pulse`} />
        <div className="text-xs text-slate-600 mt-1">
          {calmLevel > 70 ? 'Reflective' : 'Seeking'}
        </div>
      </div>

      {/* Poiesis Indicator */}
      {isActive && calmLevel > 80 && (
        <div className="absolute top-12 right-4 text-blue-600 text-sm font-medium animate-pulse">
          🧘 Deep Coherence
        </div>
      )}
    </div>
  );
};

export default LakeLandscape;
