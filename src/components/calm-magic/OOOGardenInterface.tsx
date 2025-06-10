
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gardens } from '@/data/gardens';
import { Brain, Cog, Sprout, Network, Zap, Eye, EyeOff } from 'lucide-react';

interface GardenState {
  type: string;
  activeConnections: number;
  processingLoad: number;
  withdrawnQualities: string[];
  emergentMethods: string[];
  relationshipCapacity: number;
}

const OOOGardenInterface: React.FC = () => {
  const [gardenStates, setGardenStates] = useState<Record<string, GardenState>>({});
  const [showWithdrawn, setShowWithdrawn] = useState(false);

  useEffect(() => {
    // Initialize garden states with dynamic properties
    const initialStates: Record<string, GardenState> = {};
    gardens.forEach(garden => {
      initialStates[garden.type] = {
        type: garden.type,
        activeConnections: Math.floor(Math.random() * 8) + 2,
        processingLoad: Math.floor(Math.random() * 100),
        withdrawnQualities: [
          'unconscious_patterns',
          'tacit_knowledge',
          'cultural_memory',
          'invisible_constraints'
        ],
        emergentMethods: [
          'pattern_recognition()',
          'adaptive_learning()',
          'relational_mapping()',
          'emergence_detection()'
        ],
        relationshipCapacity: Math.floor(Math.random() * 100) + 50
      };
    });
    setGardenStates(initialStates);

    // Simulate dynamic state changes
    const interval = setInterval(() => {
      setGardenStates(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = {
            ...updated[key],
            activeConnections: Math.max(1, updated[key].activeConnections + (Math.random() - 0.5) * 2),
            processingLoad: Math.max(0, Math.min(100, updated[key].processingLoad + (Math.random() - 0.5) * 20)),
            relationshipCapacity: Math.max(30, Math.min(150, updated[key].relationshipCapacity + (Math.random() - 0.5) * 10))
          };
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getGardenIcon = (type: string) => {
    switch (type) {
      case 'intelligence': return Brain;
      case 'systems': return Cog;
      case 'prototypes': return Sprout;
      default: return Network;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gardens as Living Object Classes</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWithdrawn(!showWithdrawn)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
          >
            {showWithdrawn ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showWithdrawn ? 'Hide' : 'Show'} Withdrawn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {gardens.map(garden => {
          const state = gardenStates[garden.type];
          if (!state) return null;

          const IconComponent = getGardenIcon(garden.type);

          return (
            <Card key={garden.type} className="relative overflow-hidden border-2" style={{ borderColor: garden.color + '40' }}>
              <CardContent className="p-4">
                {/* Object Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: garden.color + '20' }}>
                      <IconComponent className="w-4 h-4" style={{ color: garden.color }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{garden.name}</h4>
                      <code className="text-xs text-slate-500">class {garden.type.charAt(0).toUpperCase() + garden.type.slice(1)}Garden</code>
                    </div>
                  </div>
                  <Badge variant="outline" style={{ color: garden.color, borderColor: garden.color }}>
                    {Math.round(state.relationshipCapacity)}% capacity
                  </Badge>
                </div>

                {/* Object State Visualization */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-600 dark:text-slate-400">Active Relations</div>
                    <div className="flex items-center gap-1">
                      <Network className="w-3 h-3" />
                      <span className="text-sm font-mono">{Math.round(state.activeConnections)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-600 dark:text-slate-400">Processing Load</div>
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000" 
                          style={{ 
                            width: `${state.processingLoad}%`,
                            backgroundColor: garden.color 
                          }} 
                        />
                      </div>
                      <span className="text-xs">{Math.round(state.processingLoad)}%</span>
                    </div>
                  </div>
                </div>

                {/* Emergent Methods */}
                <div className="mb-3">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Available Methods</div>
                  <div className="flex flex-wrap gap-1">
                    {state.emergentMethods.slice(0, 2).map((method, index) => (
                      <code key={index} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                        {method}
                      </code>
                    ))}
                  </div>
                </div>

                {/* Withdrawn Qualities (OOO Core Concept) */}
                {showWithdrawn && (
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-1 mb-2">
                      <EyeOff className="w-3 h-3 text-slate-400" />
                      <div className="text-xs text-slate-600 dark:text-slate-400">Withdrawn Qualities</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {state.withdrawnQualities.map((quality, index) => (
                        <div key={index} className="p-1 bg-slate-50 dark:bg-slate-900 rounded text-slate-500 opacity-60">
                          {quality.replace('_', ' ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relational Network Indicator */}
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, Math.round(state.activeConnections)) }).map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1 h-1 rounded-full animate-pulse" 
                        style={{ 
                          backgroundColor: garden.color,
                          animationDelay: `${i * 200}ms`
                        }} 
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OOOGardenInterface;
