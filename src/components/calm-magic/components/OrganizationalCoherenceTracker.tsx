
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const OrganizationalCoherenceTracker: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('leadership');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [coherenceLevel, setCoherenceLevel] = useState(72);

  // Sample organizational coherence data
  const organizationalData = {
    leadership: [
      { dimension: 'Love (Authentic)', current: 78, target: 85, description: 'Authentic leadership presence' },
      { dimension: 'Magic (Creative)', current: 65, target: 80, description: 'Creative problem-solving' },
      { dimension: 'Calm (Systems)', current: 82, target: 85, description: 'Systems thinking capacity' },
      { dimension: 'Open (Collaborative)', current: 70, target: 85, description: 'Collaborative innovation' },
      { dimension: 'Free (Visionary)', current: 75, target: 90, description: 'Visionary integration' }
    ],
    product: [
      { dimension: 'Love (Authentic)', current: 68, target: 80, description: 'User-centered design' },
      { dimension: 'Magic (Creative)', current: 85, target: 90, description: 'Innovation velocity' },
      { dimension: 'Calm (Systems)', current: 70, target: 85, description: 'Technical architecture' },
      { dimension: 'Open (Collaborative)', current: 72, target: 85, description: 'Cross-functional flow' },
      { dimension: 'Free (Visionary)', current: 66, target: 85, description: 'Future-oriented thinking' }
    ],
    sales: [
      { dimension: 'Love (Authentic)', current: 75, target: 85, description: 'Customer relationships' },
      { dimension: 'Magic (Creative)', current: 60, target: 75, description: 'Solution creativity' },
      { dimension: 'Calm (Systems)', current: 65, target: 80, description: 'Process optimization' },
      { dimension: 'Open (Collaborative)', current: 80, target: 85, description: 'Internal partnerships' },
      { dimension: 'Free (Visionary)', current: 58, target: 80, description: 'Market foresight' }
    ]
  };

  const currentData = organizationalData[selectedTeam as keyof typeof organizationalData];

  // Calculate overall coherence
  useEffect(() => {
    const avgCurrent = currentData.reduce((sum, item) => sum + item.current, 0) / currentData.length;
    setCoherenceLevel(Math.round(avgCurrent));
  }, [selectedTeam]);

  const getCoherenceStatus = (level: number) => {
    if (level >= 80) return { label: 'Thriving', color: 'bg-green-500', emoji: '🌟' };
    if (level >= 70) return { label: 'Growing', color: 'bg-blue-500', emoji: '🌊' };
    if (level >= 60) return { label: 'Developing', color: 'bg-yellow-500', emoji: '🌱' };
    return { label: 'Emerging', color: 'bg-red-500', emoji: '🔄' };
  };

  const status = getCoherenceStatus(coherenceLevel);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            💫 Organizational Coherence Tracker
            <Badge className={`${status.color} text-white`}>
              {status.emoji} {status.label} ({coherenceLevel}%)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Selector */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(organizationalData).map((team) => (
              <Button
                key={team}
                variant={selectedTeam === team ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTeam(team)}
                className="capitalize"
              >
                {team} Team
              </Button>
            ))}
          </div>

          {/* Coherence Radar Chart */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-center">Current Coherence Pattern</h4>
              <ChartContainer
                config={{
                  current: { label: 'Current', color: '#3b82f6' },
                  target: { label: 'Target', color: '#10b981' }
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={currentData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#10b981"
                      fill="transparent"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Dimension Details */}
            <div className="space-y-3">
              <h4 className="font-semibold">Dimension Analysis</h4>
              {currentData.map((item, index) => {
                const gap = item.target - item.current;
                const gapPercentage = (gap / item.target) * 100;
                
                return (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">{item.dimension}</div>
                        <div className="text-xs text-slate-500">{item.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.current}%</div>
                        <div className="text-xs text-slate-500">Target: {item.target}%</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.current}%` }}
                      />
                    </div>
                    
                    {gap > 0 && (
                      <div className="text-xs text-amber-600 mt-1">
                        Gap: {gap} points ({Math.round(gapPercentage)}% improvement needed)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
            <CardHeader>
              <CardTitle className="text-base">🤖 AI Coherence Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Pattern Recognition:</span> The {selectedTeam} team shows strongest coherence in 
                    {currentData.reduce((max, item) => item.current > max.current ? item : max).dimension.split(' ')[0]} 
                    dynamics, indicating natural strengths in this area.
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Growth Opportunity:</span> Focus on 
                    {currentData.reduce((min, item) => item.current < min.current ? item : min).dimension.split(' ')[0]} 
                    practices for maximum coherence acceleration.
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Recommendation:</span> Implement daily 5-minute calm magic practices 
                    targeting the lowest-scoring dimension for rapid improvement.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationalCoherenceTracker;
