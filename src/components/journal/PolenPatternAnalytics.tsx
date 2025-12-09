import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Compass, Grid3X3, Sparkles } from 'lucide-react';

const COMPASS_COLORS: Record<string, string> = {
  narrative: 'hsl(var(--chart-1))',
  workflow: 'hsl(var(--chart-2))',
  inquiry: 'hsl(var(--chart-3))',
  playground: 'hsl(var(--chart-4))',
  'human-systems': 'hsl(var(--chart-5))',
};

const STEP_COLORS: Record<string, string> = {
  glitch: 'hsl(340, 82%, 52%)',
  drift: 'hsl(262, 83%, 58%)',
  tune: 'hsl(142, 71%, 45%)',
};

export const PolenPatternAnalytics: React.FC = () => {
  const { data: polenEntries, isLoading } = useQuery({
    queryKey: ['polen-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polen_entries')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const analytics = useMemo(() => {
    if (!polenEntries?.length) return null;

    // Extract tags and analyze patterns
    const compassCounts: Record<string, number> = {};
    const stepCounts: Record<string, number> = {};
    const tileCounts: Record<number, number> = {};
    const journeyModeCounts: Record<string, number> = {};
    const timelineData: Record<string, number> = {};

    polenEntries.forEach((entry) => {
      const tags = entry.tags || [];
      
      // Count compass usage
      ['narrative', 'workflow', 'inquiry', 'playground', 'human-systems'].forEach(compass => {
        if (tags.includes(compass)) {
          compassCounts[compass] = (compassCounts[compass] || 0) + 1;
        }
      });

      // Count step usage
      ['glitch', 'drift', 'tune'].forEach(step => {
        if (tags.includes(step)) {
          stepCounts[step] = (stepCounts[step] || 0) + 1;
        }
      });

      // Count journey modes
      ['relational', 'product'].forEach(mode => {
        if (tags.includes(mode)) {
          journeyModeCounts[mode] = (journeyModeCounts[mode] || 0) + 1;
        }
      });

      // Count tiles
      if (entry.tile_id) {
        tileCounts[entry.tile_id] = (tileCounts[entry.tile_id] || 0) + 1;
      }

      // Timeline aggregation by date
      const date = new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      timelineData[date] = (timelineData[date] || 0) + 1;
    });

    // Format for charts
    const compassData = Object.entries(compassCounts)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, fill: COMPASS_COLORS[name] }))
      .sort((a, b) => b.value - a.value);

    const stepData = Object.entries(stepCounts)
      .map(([name, value]) => ({ name: name.toUpperCase(), value, fill: STEP_COLORS[name] }));

    const topTiles = Object.entries(tileCounts)
      .map(([tile, count]) => ({ tile: `Tile ${tile}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const timeline = Object.entries(timelineData)
      .map(([date, count]) => ({ date, count }))
      .slice(-14); // Last 14 data points

    const journeyData = Object.entries(journeyModeCounts)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

    return {
      compassData,
      stepData,
      topTiles,
      timeline,
      journeyData,
      totalEntries: polenEntries.length,
      aiPromptEntries: polenEntries.filter(e => e.tags?.includes('ai-prompt')).length,
    };
  }, [polenEntries]);

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics || analytics.totalEntries === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Pattern Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            Save some AI prompts as Polen to see pattern insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{analytics.totalEntries}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total Polen</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{analytics.aiPromptEntries}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AI Prompts</p>
          </CardContent>
        </Card>
      </div>

      {/* Compass Usage */}
      {analytics.compassData.length > 0 && (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Compass Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.compassData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {analytics.compassData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Distribution */}
      {analytics.stepData.length > 0 && (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Step Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.stepData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {analytics.stepData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {analytics.stepData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Tiles */}
      {analytics.topTiles.length > 0 && (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Most Active Tiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topTiles}>
                  <XAxis dataKey="tile" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      {analytics.timeline.length > 1 && (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Activity Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.timeline}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
