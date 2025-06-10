import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { energeticAxes } from '@/data/gardens';
import { EmotionalState } from '@/types/journal';
import { Compass, Zap, MapPin, Users, Brain } from 'lucide-react';

interface LeadershipTerritory {
  key: string;
  emergentSkills: string[];
  relationalCapacity: number;
  transformationPotential: number;
  activeExperiments: string[];
}

interface ExpansiveLeadershipLabProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
}

const ExpansiveLeadershipLab: React.FC<ExpansiveLeadershipLabProps> = ({
  emotionalState,
  onStateChange
}) => {
  const [territories, setTerritories] = useState<Record<string, LeadershipTerritory>>({});
  const [activeTerritory, setActiveTerritory] = useState<string | null>(null);

  useEffect(() => {
    // Initialize leadership territories
    const initialTerritories: Record<string, LeadershipTerritory> = {};
    energeticAxes.forEach(axis => {
      const level = emotionalState[`${axis.key}_level` as keyof EmotionalState] as number || 50;
      initialTerritories[axis.key] = {
        key: axis.key,
        emergentSkills: getSkillsForAxis(axis.key, level),
        relationalCapacity: level * 1.5,
        transformationPotential: Math.max(20, 100 - Math.abs(level - 75)),
        activeExperiments: getExperimentsForAxis(axis.key, level)
      };
    });
    setTerritories(initialTerritories);
  }, [emotionalState]);

  const getSkillsForAxis = (axisKey: string, level: number): string[] => {
    const skillMap: Record<string, string[]> = {
      love: ['embodied_presence', 'authentic_expression', 'vulnerability_leadership', 'heart_intelligence'],
      magic: ['intuitive_navigation', 'possibility_sensing', 'creative_emergence', 'spacious_awareness'],
      calm: ['systems_thinking', 'grounded_presence', 'regenerative_practices', 'stability_creation'],
      open: ['adaptive_capacity', 'change_leadership', 'innovation_catalyst', 'risk_navigation'],
      free: ['integration_mastery', 'pattern_transcendence', 'conscious_evolution', 'meta_learning']
    };

    const skills = skillMap[axisKey] || [];
    const availableSkills = Math.floor((level / 100) * skills.length) + 1;
    return skills.slice(0, availableSkills);
  };

  const getExperimentsForAxis = (axisKey: string, level: number): string[] => {
    const experimentMap: Record<string, string[]> = {
      love: ['authentic_dialogue_circles', 'somatic_leadership_practice', 'heart_coherence_training'],
      magic: ['collective_visioning_sessions', 'creative_constraint_experiments', 'emergence_tracking'],
      calm: ['systems_mapping_workshops', 'regenerative_culture_design', 'stability_stress_testing'],
      open: ['rapid_prototyping_labs', 'change_resilience_building', 'innovation_tournaments'],
      free: ['integration_ceremonies', 'pattern_breaking_challenges', 'meta_skill_development']
    };

    const experiments = experimentMap[axisKey] || [];
    if (level > 70) return experiments;
    if (level > 40) return experiments.slice(0, 2);
    return experiments.slice(0, 1);
  };

  const handleAxisChange = (axis: string, value: number[]) => {
    onStateChange({
      ...emotionalState,
      [`${axis}_level`]: value[0]
    });
  };

  const getTerritoryStatus = (level: number): { status: string; color: string } => {
    if (level > 80) return { status: 'Expansive', color: '#10b981' };
    if (level > 60) return { status: 'Developing', color: '#f59e0b' };
    if (level > 40) return { status: 'Emerging', color: '#6366f1' };
    return { status: 'Dormant', color: '#64748b' };
  };

  return (
    <div className="space-y-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600" />
          Expansive Leadership Laboratory
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Ontological territories where new relational capacities emerge
        </p>
      </CardHeader>

      <div className="grid grid-cols-1 gap-4">
        {energeticAxes.map((axis) => {
          const currentValue = emotionalState[`${axis.key}_level` as keyof EmotionalState] as number || 50;
          const territory = territories[axis.key];
          const { status, color } = getTerritoryStatus(currentValue);

          return (
            <Card 
              key={axis.key} 
              className={`cursor-pointer transition-all duration-300 ${
                activeTerritory === axis.key ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{ 
                borderColor: currentValue > 60 ? axis.color + '60' : undefined,
                '--ring-color': axis.color
              } as React.CSSProperties}
              onClick={() => setActiveTerritory(activeTerritory === axis.key ? null : axis.key)}
            >
              <CardContent className="p-4">
                {/* Territory Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold" style={{ color: axis.color }}>
                        {axis.name} Territory
                      </h4>
                      <Badge style={{ backgroundColor: color + '20', color: color }}>
                        {status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{axis.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: axis.color }}>
                      {currentValue}
                    </div>
                    <div className="text-xs text-slate-400">capacity</div>
                  </div>
                </div>

                {/* Territory Slider */}
                <div className="mb-4">
                  <Slider
                    value={[currentValue]}
                    onValueChange={(value) => handleAxisChange(axis.key, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Dormant</span>
                    <span>Emergent</span>
                    <span>Developing</span>
                    <span>Expansive</span>
                  </div>
                </div>

                {/* Emergent Skills */}
                {territory && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Brain className="w-3 h-3 text-slate-400" />
                        <div className="text-xs text-slate-600 dark:text-slate-400">Emergent Skills</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {territory.emergentSkills.map((skill, index) => (
                          <code key={index} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                            {skill.replace('_', ' ')}
                          </code>
                        ))}
                      </div>
                    </div>

                    {/* Expanded Territory View */}
                    {activeTerritory === axis.key && (
                      <div className="border-t pt-3 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Relational Capacity</div>
                            <div className="flex items-center gap-2">
                              <Users className="w-3 h-3" />
                              <span>{Math.round(territory.relationalCapacity)}%</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Transform Potential</div>
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3" />
                              <span>{Math.round(territory.transformationPotential)}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <div className="text-xs text-slate-600 dark:text-slate-400">Active Experiments</div>
                          </div>
                          <div className="space-y-1">
                            {territory.activeExperiments.map((experiment, index) => (
                              <div key={index} className="text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                {experiment.replace('_', ' ')}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExpansiveLeadershipLab;
