/**
 * Betti Number Evolution Graph
 * Dual line graph showing β₀ (connected components) and β₁ (topological handles)
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GitBranch } from 'lucide-react';

interface BettiEvolutionGraphProps {
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
}

// Calculate Betti numbers from visited tiles
function calculateBettiNumbers(tiles: Set<string>): { beta0: number; beta1: number } {
  if (tiles.size === 0) return { beta0: 0, beta1: 0 };
  
  // Build adjacency for connected components
  const visited = new Set<string>();
  let components = 0;
  
  const getNeighbors = (key: string): string[] => {
    const [row, col] = key.split('-').map(Number);
    return [
      `${row - 1}-${col}`,
      `${row + 1}-${col}`,
      `${row}-${col - 1}`,
      `${row}-${col + 1}`
    ].filter(k => tiles.has(k));
  };
  
  const dfs = (start: string) => {
    const stack = [start];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (visited.has(node)) continue;
      visited.add(node);
      getNeighbors(node).forEach(n => {
        if (!visited.has(n)) stack.push(n);
      });
    }
  };
  
  tiles.forEach(tile => {
    if (!visited.has(tile)) {
      dfs(tile);
      components++;
    }
  });
  
  // β₀ = connected components
  const beta0 = components;
  
  // β₁ = approximate loops/handles (Euler characteristic approach)
  // For a planar graph: β₁ = edges - vertices + β₀
  let edges = 0;
  tiles.forEach(tile => {
    const neighbors = getNeighbors(tile);
    edges += neighbors.length;
  });
  edges = edges / 2; // Each edge counted twice
  
  const beta1 = Math.max(0, edges - tiles.size + beta0);
  
  return { beta0, beta1 };
}

export function BettiEvolutionGraph({
  visitedTiles,
  journeyPath
}: BettiEvolutionGraphProps) {
  // Calculate Betti numbers at each journey step
  const data = useMemo(() => {
    const points: Array<{ step: number; beta0: number; beta1: number }> = [];
    const incrementalTiles = new Set<string>();
    
    journeyPath.forEach((pos, idx) => {
      incrementalTiles.add(`${pos.row}-${pos.col}`);
      const { beta0, beta1 } = calculateBettiNumbers(incrementalTiles);
      
      points.push({
        step: idx + 1,
        beta0,
        beta1
      });
    });
    
    if (points.length === 0) {
      return [{ step: 0, beta0: 0, beta1: 0 }];
    }
    
    return points;
  }, [journeyPath]);

  const current = data[data.length - 1] || { beta0: 0, beta1: 0 };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <GitBranch className="h-4 w-4 text-chart-2" />
          Betti Numbers
          <div className="ml-auto flex gap-3 text-sm">
            <span className="text-chart-2">β₀: {current.beta0}</span>
            <span className="text-chart-3">β₁: {current.beta1}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
                formatter={(value: number, name: string) => [
                  value,
                  name === 'beta0' ? 'β₀ (Components)' : 'β₁ (Loops)'
                ]}
                labelFormatter={(label) => `Step ${label}`}
              />
              <Line
                type="stepAfter"
                dataKey="beta0"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                name="beta0"
              />
              <Line
                type="stepAfter"
                dataKey="beta1"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
                name="beta1"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
          <span>β₀ → 1 = unified consciousness</span>
          <span>β₁ ↑ = self-referential loops</span>
        </div>
      </CardContent>
    </Card>
  );
}
