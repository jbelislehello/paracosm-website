/**
 * Fisher Information Graph
 * Live line chart showing Fisher Information evolution over journey progress
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity } from 'lucide-react';

interface FisherInformationGraphProps {
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  densityMap?: Map<string, number>;
}

export function FisherInformationGraph({
  visitedTiles,
  journeyPath,
  densityMap = new Map()
}: FisherInformationGraphProps) {
  // Calculate Fisher Information at each journey step
  const data = useMemo(() => {
    const points: Array<{ step: number; fisherInfo: number; label: string }> = [];
    
    // Build incremental Fisher Information
    let cumulativeInfo = 0;
    journeyPath.forEach((pos, idx) => {
      const key = `${pos.row}-${pos.col}`;
      const density = densityMap.get(key) || 1;
      
      // Fisher Information approximation: gradient of log-likelihood
      // Higher density = more information
      const localInfo = Math.log(1 + density) * (1 + idx * 0.1);
      cumulativeInfo += localInfo / Math.max(1, journeyPath.length);
      
      points.push({
        step: idx + 1,
        fisherInfo: Math.round(cumulativeInfo * 100) / 100,
        label: `Tile ${pos.row},${pos.col}`
      });
    });
    
    // Ensure at least some data points
    if (points.length === 0) {
      return [{ step: 0, fisherInfo: 0, label: 'Start' }];
    }
    
    return points;
  }, [journeyPath, densityMap]);

  const currentValue = data[data.length - 1]?.fisherInfo || 0;

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Activity className="h-4 w-4 text-chart-1" />
          Fisher Information
          <span className="ml-auto text-lg font-bold text-chart-1">
            {currentValue.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fisherGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="step" 
                tick={{ fontSize: 10 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [value.toFixed(2), 'Fisher Info']}
                labelFormatter={(label) => `Step ${label}`}
              />
              <Area
                type="monotone"
                dataKey="fisherInfo"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#fisherGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Information accumulates as you explore — higher = richer ontology
        </p>
      </CardContent>
    </Card>
  );
}
