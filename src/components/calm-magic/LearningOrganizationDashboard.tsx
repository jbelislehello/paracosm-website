
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Network, Brain, Zap, RefreshCw, Target, TrendingUp, Users, Lightbulb } from 'lucide-react';

interface LearningMetrics {
  ontological_mapping: number;
  intelligence_integration: number;
  dissolve_capacity: number;
  integrate_ability: number;
  reinvent_readiness: number;
  relational_network_health: number;
  emergence_detection: number;
  cultural_plasticity: number;
}

const LearningOrganizationDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<LearningMetrics>({
    ontological_mapping: 0,
    intelligence_integration: 0,
    dissolve_capacity: 0,
    integrate_ability: 0,
    reinvent_readiness: 0,
    relational_network_health: 0,
    emergence_detection: 0,
    cultural_plasticity: 0
  });

  const [overallReadiness, setOverallReadiness] = useState(0);
  const [learningVelocity, setLearningVelocity] = useState(0);

  useEffect(() => {
    // Initialize with realistic organizational learning metrics
    const initialMetrics: LearningMetrics = {
      ontological_mapping: 45 + Math.random() * 30,
      intelligence_integration: 35 + Math.random() * 25,
      dissolve_capacity: 40 + Math.random() * 35,
      integrate_ability: 55 + Math.random() * 25,
      reinvent_readiness: 30 + Math.random() * 40,
      relational_network_health: 60 + Math.random() * 30,
      emergence_detection: 25 + Math.random() * 35,
      cultural_plasticity: 50 + Math.random() * 30
    };

    setMetrics(initialMetrics);

    // Calculate overall readiness
    const avgReadiness = Object.values(initialMetrics).reduce((a, b) => a + b, 0) / Object.keys(initialMetrics).length;
    setOverallReadiness(avgReadiness);
    setLearningVelocity(20 + Math.random() * 60);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          const currentValue = updated[key as keyof LearningMetrics];
          const change = (Math.random() - 0.5) * 5; // ±2.5 change
          updated[key as keyof LearningMetrics] = Math.max(0, Math.min(100, currentValue + change));
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const avgReadiness = Object.values(metrics).reduce((a, b) => a + b, 0) / Object.keys(metrics).length;
    setOverallReadiness(avgReadiness);
  }, [metrics]);

  const getMetricInfo = (key: string) => {
    const info: Record<string, { label: string; icon: any; description: string; color: string }> = {
      ontological_mapping: {
        label: 'Ontological Mapping',
        icon: Network,
        description: 'Capacity to see and navigate relational networks',
        color: '#2563eb'
      },
      intelligence_integration: {
        label: 'Intelligence Integration',
        icon: Brain,
        description: 'Ability to integrate AI and collective intelligence',
        color: '#7c3aed'
      },
      dissolve_capacity: {
        label: 'Dissolve Capacity',
        icon: RefreshCw,
        description: 'Readiness to dissolve outdated structures',
        color: '#ef4444'
      },
      integrate_ability: {
        label: 'Integration Ability',
        icon: Users,
        description: 'Skill in integrating diverse elements',
        color: '#8b5cf6'
      },
      reinvent_readiness: {
        label: 'Reinvention Readiness',
        icon: Lightbulb,
        description: 'Capacity for continuous cultural evolution',
        color: '#10b981'
      },
      relational_network_health: {
        label: 'Network Health',
        icon: Target,
        description: 'Quality of organizational relationships',
        color: '#06b6d4'
      },
      emergence_detection: {
        label: 'Emergence Detection',
        icon: Zap,
        description: 'Ability to sense and respond to emergence',
        color: '#f59e0b'
      },
      cultural_plasticity: {
        label: 'Cultural Plasticity',
        icon: TrendingUp,
        description: 'Organizational adaptability and learning rate',
        color: '#db2777'
      }
    };

    return info[key] || { label: key, icon: Network, description: '', color: '#64748b' };
  };

  const getReadinessLevel = (score: number): { level: string; color: string } => {
    if (score >= 80) return { level: 'Transformational', color: '#10b981' };
    if (score >= 65) return { level: 'Adaptive', color: '#f59e0b' };
    if (score >= 50) return { level: 'Developing', color: '#6366f1' };
    if (score >= 35) return { level: 'Emerging', color: '#8b5cf6' };
    return { level: 'Traditional', color: '#64748b' };
  };

  const readinessLevel = getReadinessLevel(overallReadiness);

  return (
    <div className="space-y-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-600" />
          Learning Organization Readiness
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Real-time assessment of organizational learning capacity
        </p>
      </CardHeader>

      {/* Overall Readiness */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{Math.round(overallReadiness)}%</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Overall Learning Readiness</p>
            </div>
            <Badge 
              style={{ 
                backgroundColor: readinessLevel.color + '20',
                color: readinessLevel.color,
                border: `1px solid ${readinessLevel.color}40`
              }}
            >
              {readinessLevel.level}
            </Badge>
          </div>
          
          <Progress value={overallReadiness} className="mb-3" />
          
          <div className="flex justify-between text-xs text-slate-500">
            <span>Traditional</span>
            <span>Emerging</span>
            <span>Developing</span>
            <span>Adaptive</span>
            <span>Transformational</span>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Learning Velocity: {Math.round(learningVelocity)}%</span>
            </div>
            <div className="text-slate-500">
              Updated {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(metrics).map(([key, value]) => {
          const info = getMetricInfo(key);
          const IconComponent = info.icon;
          const level = getReadinessLevel(value);

          return (
            <Card key={key} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: info.color + '20' }}>
                      <IconComponent className="w-4 h-4" style={{ color: info.color }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{info.label}</h4>
                      <p className="text-xs text-slate-500">{info.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: info.color }}>
                      {Math.round(value)}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        color: level.color,
                        borderColor: level.color + '40'
                      }}
                    >
                      {level.level}
                    </Badge>
                  </div>
                </div>

                <Progress value={value} className="h-2" />

                {/* Capacity Indicator */}
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Low Capacity</span>
                  <span>High Capacity</span>
                </div>

                {/* Real-time indicator */}
                <div className="absolute top-2 right-2">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: value > 60 ? '#10b981' : value > 40 ? '#f59e0b' : '#ef4444' }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* OOO Insights */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            Object-Oriented Ontology Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-slate-700 dark:text-slate-300">
                Relational Network Status
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {metrics.relational_network_health > 70 
                  ? "Organization demonstrates strong flat ontology - objects (teams, processes, ideas) relate as equals rather than hierarchically."
                  : "Hierarchical thinking still dominates. Objects (departments, roles) remain trapped in rigid relations."
                }
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-slate-700 dark:text-slate-300">
                Withdrawal Recognition
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {metrics.emergence_detection > 60
                  ? "Organization recognizes that objects (processes, knowledge, culture) have withdrawn qualities that resist full access."
                  : "Organization still believes in total transparency and control - missing the reality of object withdrawal."
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningOrganizationDashboard;
