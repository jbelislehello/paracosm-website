import { useMemo } from 'react';
import { 
  Activity, 
  Circle, 
  Hexagon, 
  GitBranch, 
  Waves,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface TopologicalMetricsPanelProps {
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  currentUnlockedRing: number;
}

interface TopologicalMetrics {
  // Betti numbers
  beta0: number; // Connected components
  beta1: number; // Holes/loops
  beta2: number; // Voids (always 0 for 2D)
  
  // Derived metrics
  eulerCharacteristic: number;
  genus: number;
  
  // Journey-specific
  pathComplexity: number;
  clusterCount: number;
  gapCount: number;
  densityVariance: number;
}

function calculateTopologicalMetrics(
  visitedTiles: Set<string>,
  journeyPath: Array<{ row: number; col: number }>
): TopologicalMetrics {
  const gridSize = 8;
  const visited = new Set(visitedTiles);
  
  // Create adjacency grid
  const grid: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  visited.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
      grid[r][c] = true;
    }
  });
  
  // Calculate β₀ (connected components) using flood fill
  const componentVisited = new Set<string>();
  let beta0 = 0;
  
  const floodFill = (startR: number, startC: number) => {
    const stack = [[startR, startC]];
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const key = `${r},${c}`;
      if (componentVisited.has(key) || !grid[r]?.[c]) continue;
      componentVisited.add(key);
      // 4-connectivity
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && grid[nr][nc]) {
          stack.push([nr, nc]);
        }
      });
    }
  };
  
  visited.forEach(key => {
    if (!componentVisited.has(key)) {
      const [r, c] = key.split(',').map(Number);
      floodFill(r, c);
      beta0++;
    }
  });
  
  // Calculate β₁ (holes) - count enclosed empty spaces
  // Using Euler characteristic: χ = V - E + F, where β₁ = 1 - χ + β₀
  let vertices = visited.size;
  let edges = 0;
  let faces = 0;
  
  // Count edges (shared boundaries between visited tiles)
  visited.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    // Only count right and down to avoid double counting
    if (visited.has(`${r},${c + 1}`)) edges++;
    if (visited.has(`${r + 1},${c}`)) edges++;
  });
  
  // Count 2x2 faces (complete squares)
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      if (grid[r][c] && grid[r][c + 1] && grid[r + 1][c] && grid[r + 1][c + 1]) {
        faces++;
      }
    }
  }
  
  // Euler characteristic for the visited region
  const eulerCharacteristic = vertices - edges + faces;
  
  // β₁ approximation: holes = connected components - euler + 1 (for connected regions)
  const beta1 = Math.max(0, beta0 - eulerCharacteristic + 1);
  
  // β₂ is always 0 for 2D surfaces
  const beta2 = 0;
  
  // Genus calculation: g = (2 - χ) / 2 for orientable surfaces
  // For our grid, we approximate based on hole count
  const genus = Math.max(0, Math.floor(beta1 / 2));
  
  // Path complexity: how much backtracking/crossing occurred
  let pathComplexity = 0;
  const pathVisitCount = new Map<string, number>();
  journeyPath.forEach(({ row, col }) => {
    const key = `${row},${col}`;
    pathVisitCount.set(key, (pathVisitCount.get(key) || 0) + 1);
  });
  pathVisitCount.forEach(count => {
    if (count > 1) pathComplexity += count - 1;
  });
  
  // Calculate gaps (unvisited tiles surrounded by visited)
  let gapCount = 0;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!grid[r][c]) {
        let neighborCount = 0;
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && grid[nr][nc]) {
            neighborCount++;
          }
        });
        if (neighborCount >= 3) gapCount++;
      }
    }
  }
  
  // Density variance across quadrants
  const quadrantCounts = [0, 0, 0, 0];
  visited.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    const qIdx = (r < 4 ? 0 : 2) + (c < 4 ? 0 : 1);
    quadrantCounts[qIdx]++;
  });
  const avgQuadrant = quadrantCounts.reduce((a, b) => a + b, 0) / 4;
  const densityVariance = Math.sqrt(
    quadrantCounts.reduce((sum, c) => sum + Math.pow(c - avgQuadrant, 2), 0) / 4
  );
  
  return {
    beta0,
    beta1,
    beta2,
    eulerCharacteristic,
    genus,
    pathComplexity,
    clusterCount: beta0,
    gapCount,
    densityVariance
  };
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  description, 
  color,
  maxValue
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number | string; 
  description: string;
  color: string;
  maxValue?: number;
}) {
  const numericValue = typeof value === 'number' ? value : 0;
  const showProgress = maxValue !== undefined && typeof value === 'number';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "p-3 rounded-lg border transition-all hover:scale-[1.02]",
            color
          )}>
            <div className="flex items-center gap-2 mb-1">
              {icon}
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
              <Info className="w-3 h-3 text-muted-foreground/50 ml-auto" />
            </div>
            <div className="text-xl font-bold">{value}</div>
            {showProgress && (
              <Progress 
                value={(numericValue / maxValue) * 100} 
                className="h-1 mt-2" 
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <p className="text-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TopologicalMetricsPanel({ 
  visitedTiles, 
  journeyPath,
  currentUnlockedRing 
}: TopologicalMetricsPanelProps) {
  const metrics = useMemo(() => 
    calculateTopologicalMetrics(visitedTiles, journeyPath),
    [visitedTiles, journeyPath]
  );
  
  if (visitedTiles.size === 0) {
    return null;
  }
  
  // Interpret the metrics
  const getTopologyInterpretation = () => {
    if (metrics.beta0 === 1 && metrics.gapCount === 0) {
      return "Your exploration forms a cohesive, connected region—no fragmentation detected.";
    }
    if (metrics.beta0 > 3) {
      return `Your journey has ${metrics.beta0} separate clusters. Consider bridging these isolated regions.`;
    }
    if (metrics.beta1 > 0) {
      return `Interesting topology: ${metrics.beta1} hole(s) detected—unexplored spaces surrounded by your path.`;
    }
    if (metrics.gapCount > 2) {
      return `${metrics.gapCount} critical gaps identified—tiles nearly surrounded but not yet visited.`;
    }
    return "Building a solid topological foundation. Continue exploring adjacent territories.";
  };
  
  return (
    <div className="bg-gradient-to-br from-indigo-500/5 via-background to-violet-500/5 rounded-lg border border-indigo-500/20 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-indigo-500/10 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <Hexagon className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold">Topological Metrics</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Mathematical analysis of your journey's shape and structure
        </p>
      </div>
      
      {/* Metrics Grid */}
      <div className="p-4 space-y-4">
        {/* Betti Numbers */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            Betti Numbers (Homology)
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <MetricCard
              icon={<Circle className="w-4 h-4 text-blue-500" />}
              label="β₀"
              value={metrics.beta0}
              description="Connected components: the number of separate regions in your exploration. Ideally 1 for a unified journey."
              color="bg-blue-500/10 border-blue-500/20"
              maxValue={5}
            />
            <MetricCard
              icon={<GitBranch className="w-4 h-4 text-purple-500" />}
              label="β₁"
              value={metrics.beta1}
              description="Holes/loops: unexplored spaces completely surrounded by visited tiles. These are 'topology holes' in your exploration."
              color="bg-purple-500/10 border-purple-500/20"
              maxValue={10}
            />
            <MetricCard
              icon={<Waves className="w-4 h-4 text-cyan-500" />}
              label="β₂"
              value={metrics.beta2}
              description="Voids: always 0 for 2D surfaces. Would represent enclosed 3D cavities in higher dimensions."
              color="bg-cyan-500/10 border-cyan-500/20"
            />
          </div>
        </div>
        
        {/* Derived Metrics */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Hexagon className="w-3 h-3" />
            Structural Invariants
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              icon={<span className="text-sm font-bold text-amber-500">χ</span>}
              label="Euler Characteristic"
              value={metrics.eulerCharacteristic}
              description="χ = V - E + F. A fundamental topological invariant. For a disk χ=1, for a torus χ=0."
              color="bg-amber-500/10 border-amber-500/20"
            />
            <MetricCard
              icon={<span className="text-sm font-bold text-rose-500">g</span>}
              label="Genus"
              value={metrics.genus}
              description="Number of 'handles' on the surface. A sphere has g=0, a torus (donut) has g=1. Higher genus = more complex topology."
              color="bg-rose-500/10 border-rose-500/20"
              maxValue={3}
            />
          </div>
        </div>
        
        {/* Journey-specific metrics */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            Journey Analysis
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <MetricCard
              icon={<GitBranch className="w-4 h-4 text-green-500" />}
              label="Clusters"
              value={metrics.clusterCount}
              description="Number of distinct exploration clusters. Ideally 1 for a connected journey."
              color="bg-green-500/10 border-green-500/20"
              maxValue={5}
            />
            <MetricCard
              icon={<Circle className="w-4 h-4 text-orange-500" />}
              label="Gaps"
              value={metrics.gapCount}
              description="Tiles surrounded by 3+ visited neighbors but not yet explored. High-priority candidates."
              color="bg-orange-500/10 border-orange-500/20"
              maxValue={10}
            />
            <MetricCard
              icon={<Waves className="w-4 h-4 text-pink-500" />}
              label="Variance"
              value={metrics.densityVariance.toFixed(1)}
              description="How unevenly distributed your exploration is across quadrants. Lower = more balanced."
              color="bg-pink-500/10 border-pink-500/20"
            />
          </div>
        </div>
        
        {/* Interpretation */}
        <div className="p-3 bg-muted/30 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Interpretation:</span>{' '}
            {getTopologyInterpretation()}
          </p>
        </div>
      </div>
    </div>
  );
}