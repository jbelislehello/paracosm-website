
import React, { useState, useEffect } from 'react';
import { EmotionalState } from '@/types/journal';

interface ForestLandscapeProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
  isActive: boolean;
}

interface Species {
  id: number;
  type: 'tree' | 'bird' | 'mushroom' | 'flower';
  x: number;
  y: number;
  size: number;
  connections: number[];
}

const ForestLandscape: React.FC<ForestLandscapeProps> = ({ emotionalState, onStateChange, isActive }) => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [connections, setConnections] = useState<Array<{ from: number; to: number; strength: number }>>([]);
  const [playfields, setPlayfields] = useState<Array<{ x: number; y: number; activity: string }>>([]);
  const openLevel = emotionalState.open_level || 50;

  useEffect(() => {
    // Initialize multi-species ecosystem
    const initialSpecies: Species[] = [
      // Trees (Innovation anchors)
      { id: 1, type: 'tree', x: 100, y: 250, size: 40, connections: [2, 4] },
      { id: 2, type: 'tree', x: 300, y: 200, size: 35, connections: [1, 3] },
      { id: 3, type: 'tree', x: 500, y: 280, size: 45, connections: [2, 5] },
      
      // Birds (Ideas in flight)
      { id: 4, type: 'bird', x: 150, y: 100, size: 15, connections: [1, 5] },
      { id: 5, type: 'bird', x: 350, y: 80, size: 12, connections: [3, 4] },
      
      // Mushrooms (Network connectors)
      { id: 6, type: 'mushroom', x: 200, y: 320, size: 20, connections: [1, 2] },
      { id: 7, type: 'mushroom', x: 400, y: 340, size: 25, connections: [2, 3] },
      
      // Flowers (Creative expressions)
      { id: 8, type: 'flower', x: 120, y: 180, size: 18, connections: [1] },
      { id: 9, type: 'flower', x: 320, y: 160, size: 16, connections: [2] },
      { id: 10, type: 'flower', x: 480, y: 190, size: 20, connections: [3] }
    ];

    setSpecies(initialSpecies);

    // Create inter-relational connections
    const speciesConnections = initialSpecies.flatMap(s => 
      s.connections.map(targetId => ({
        from: s.id,
        to: targetId,
        strength: (openLevel / 100) * 0.8 + 0.2
      }))
    );
    setConnections(speciesConnections);

    // Innovation playfields
    if (openLevel > 50) {
      setPlayfields([
        { x: 180, y: 220, activity: 'Co-design Session' },
        { x: 380, y: 260, activity: 'Innovation Lab' },
        { x: 280, y: 300, activity: 'Creative Synthesis' }
      ]);
    }
  }, [openLevel]);

  const handleSpeciesInteraction = (speciesId: number) => {
    // Multi-species co-design interaction
    const newLevel = Math.min(100, openLevel + 7);
    onStateChange({ ...emotionalState, open_level: newLevel });

    // Strengthen connections from this species
    setConnections(prev => prev.map(conn => 
      conn.from === speciesId || conn.to === speciesId
        ? { ...conn, strength: Math.min(1, conn.strength + 0.1) }
        : conn
    ));
  };

  const handlePlayfieldClick = (x: number, y: number) => {
    // Create new innovation playfield
    const newPlayfield = {
      x,
      y,
      activity: ['Emergence Space', 'Co-creation Hub', 'Synthesis Lab'][Math.floor(Math.random() * 3)]
    };
    setPlayfields(prev => [...prev.slice(-2), newPlayfield]);
    
    const newLevel = Math.min(100, openLevel + 10);
    onStateChange({ ...emotionalState, open_level: newLevel });
  };

  const getSpeciesEmoji = (type: string) => {
    switch (type) {
      case 'tree': return '🌳';
      case 'bird': return '🐦';
      case 'mushroom': return '🍄';
      case 'flower': return '🌸';
      default: return '🌱';
    }
  };

  return (
    <div className={`relative w-full h-96 overflow-hidden transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
      {/* Forest Ground */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(34, 139, 34, 0.1) 0%, 
            rgba(34, 139, 34, 0.3) 60%, 
            rgba(101, 67, 33, 0.4) 100%)`
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handlePlayfieldClick(e.clientX - rect.left, e.clientY - rect.top);
        }}
      />

      {/* Inter-species Connections */}
      <svg className="absolute inset-0 pointer-events-none">
        {connections.map((conn, index) => {
          const fromSpecies = species.find(s => s.id === conn.from);
          const toSpecies = species.find(s => s.id === conn.to);
          
          if (!fromSpecies || !toSpecies) return null;
          
          return (
            <line
              key={index}
              x1={fromSpecies.x}
              y1={fromSpecies.y}
              x2={toSpecies.x}
              y2={toSpecies.y}
              stroke={`rgba(34, 139, 34, ${conn.strength * 0.6})`}
              strokeWidth={conn.strength * 3}
              strokeDasharray={conn.strength > 0.7 ? 'none' : '5,5'}
            />
          );
        })}
      </svg>

      {/* Species */}
      {species.map(s => (
        <div
          key={s.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            fontSize: `${s.size}px`
          }}
          onClick={() => handleSpeciesInteraction(s.id)}
          title={`${s.type} - ${s.connections.length} connections`}
        >
          {getSpeciesEmoji(s.type)}
        </div>
      ))}

      {/* Innovation Playfields */}
      {playfields.map((playfield, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${playfield.x}px`,
            top: `${playfield.y}px`
          }}
        >
          <div className="w-16 h-16 bg-yellow-200 bg-opacity-50 rounded-full border-2 border-yellow-400 border-dashed animate-pulse" />
          <div className="absolute top-18 left-1/2 transform -translate-x-1/2 text-xs text-yellow-700 font-medium whitespace-nowrap">
            {playfield.activity}
          </div>
        </div>
      ))}

      {/* Open Level Indicator */}
      <div className="absolute top-4 left-4 text-green-600 text-sm">
        Poiesis: {Math.round(openLevel)}%
      </div>

      {/* Ecosystem Health */}
      <div className="absolute top-4 right-4">
        <div className="text-xs text-green-600 mb-1">Ecosystem Health</div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < Math.floor(openLevel / 20) ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Poiesis Indicator */}
      {isActive && openLevel > 75 && (
        <div className="absolute top-12 right-4 text-green-600 text-sm font-medium animate-pulse">
          🌳 Co-creation Active
        </div>
      )}
    </div>
  );
};

export default ForestLandscape;
