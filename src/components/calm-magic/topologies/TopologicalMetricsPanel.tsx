import { useMemo } from 'react';
import { 
  Sparkles,
  Circle, 
  Hexagon, 
  GitBranch, 
  Waves,
  Eye,
  Compass,
  Orbit,
  Zap,
  Heart,
  Infinity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TopologicalMetricsPanelProps {
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  currentUnlockedRing: number;
}

interface TopologicalMetrics {
  beta0: number;
  beta1: number;
  beta2: number;
  eulerCharacteristic: number;
  genus: number;
  pathComplexity: number;
  clusterCount: number;
  gapCount: number;
  densityVariance: number;
  coverage: number;
  // New narrative metrics
  symmetryScore: number;
  spiralAlignment: number;
  diagonalDensity: number;
}

function calculateTopologicalMetrics(
  visitedTiles: Set<string>,
  journeyPath: Array<{ row: number; col: number }>
): TopologicalMetrics {
  const gridSize = 8;
  const visited = new Set(visitedTiles);
  
  const grid: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  visited.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
      grid[r][c] = true;
    }
  });
  
  // β₀ calculation
  const componentVisited = new Set<string>();
  let beta0 = 0;
  
  const floodFill = (startR: number, startC: number) => {
    const stack = [[startR, startC]];
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const key = `${r},${c}`;
      if (componentVisited.has(key) || !grid[r]?.[c]) continue;
      componentVisited.add(key);
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
  
  // Euler calculation
  let vertices = visited.size;
  let edges = 0;
  let faces = 0;
  
  visited.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    if (visited.has(`${r},${c + 1}`)) edges++;
    if (visited.has(`${r + 1},${c}`)) edges++;
  });
  
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      if (grid[r][c] && grid[r][c + 1] && grid[r + 1][c] && grid[r + 1][c + 1]) {
        faces++;
      }
    }
  }
  
  const eulerCharacteristic = vertices - edges + faces;
  const beta1 = Math.max(0, beta0 - eulerCharacteristic + 1);
  const beta2 = 0;
  const genus = Math.max(0, Math.floor(beta1 / 2));
  
  // Path complexity
  let pathComplexity = 0;
  const pathVisitCount = new Map<string, number>();
  journeyPath.forEach(({ row, col }) => {
    const key = `${row},${col}`;
    pathVisitCount.set(key, (pathVisitCount.get(key) || 0) + 1);
  });
  pathVisitCount.forEach(count => {
    if (count > 1) pathComplexity += count - 1;
  });
  
  // Gaps
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
  
  // Quadrant distribution
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
  
  // Symmetry score (how symmetric is the exploration?)
  let symmetryMatches = 0;
  let symmetryTotal = 0;
  visited.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    // Check point symmetry around center (3.5, 3.5)
    const mirrorR = 7 - r;
    const mirrorC = 7 - c;
    symmetryTotal++;
    if (visited.has(`${mirrorR},${mirrorC}`)) symmetryMatches++;
  });
  const symmetryScore = symmetryTotal > 0 ? symmetryMatches / symmetryTotal : 0;
  
  // Spiral alignment (how much does the path follow a spiral pattern?)
  let spiralScore = 0;
  journeyPath.forEach(({ row, col }, i) => {
    if (i === 0) return;
    const prev = journeyPath[i - 1];
    const distFromCenter = Math.sqrt(Math.pow(row - 3.5, 2) + Math.pow(col - 3.5, 2));
    const prevDist = Math.sqrt(Math.pow(prev.row - 3.5, 2) + Math.pow(prev.col - 3.5, 2));
    // Reward outward movement from center
    if (distFromCenter > prevDist) spiralScore += 0.5;
    // Reward circular movement
    const angle = Math.atan2(row - 3.5, col - 3.5);
    const prevAngle = Math.atan2(prev.row - 3.5, prev.col - 3.5);
    const angleDiff = Math.abs(angle - prevAngle);
    if (angleDiff > 0.1 && angleDiff < Math.PI) spiralScore += 0.5;
  });
  const spiralAlignment = journeyPath.length > 1 ? Math.min(1, spiralScore / (journeyPath.length - 1)) : 0;
  
  // Diagonal density (how many tiles on diagonals?)
  let diagonalCount = 0;
  visited.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    if (r === c || r + c === 7) diagonalCount++;
  });
  const diagonalDensity = visited.size > 0 ? diagonalCount / visited.size : 0;
  
  return {
    beta0,
    beta1,
    beta2,
    eulerCharacteristic,
    genus,
    pathComplexity,
    clusterCount: beta0,
    gapCount,
    densityVariance,
    coverage: visited.size / 64,
    symmetryScore,
    spiralAlignment,
    diagonalDensity
  };
}

// Narrative interpretations based on metrics
function getTorusMetaphor(genus: number): { title: string; story: string; icon: React.ReactNode } {
  if (genus === 0) {
    return {
      title: "The Sphere",
      story: "Your journey maps onto a sphere—a topology of wholeness without holes. Like a planet, every point connects to every other. You're building a complete world.",
      icon: <Circle className="w-5 h-5 text-blue-500" />
    };
  }
  if (genus === 1) {
    return {
      title: "The Torus",
      story: "A single handle emerges—your journey now has the topology of a donut or coffee cup. This hole isn't absence; it's a portal. Something can pass through without breaking the surface.",
      icon: <Orbit className="w-5 h-5 text-purple-500" />
    };
  }
  return {
    title: "The Multi-Holed Surface",
    story: `${genus} handles have formed. Your exploration creates a surface of extraordinary complexity—like a pretzel or the topology of higher consciousness. Multiple pathways loop back on themselves.`,
    icon: <Infinity className="w-5 h-5 text-violet-500" />
  };
}

function getEulerCoincidence(chi: number, visitedCount: number): string | null {
  // Check for numerological coincidences
  if (chi === 1 && visitedCount === 8) {
    return "χ=1 with 8 tiles: The octave of unity—you've found the musical ratio of completion.";
  }
  if (chi === 0) {
    return "χ=0: The Euler characteristic of a torus. Your exploration has achieved topological balance—births equal deaths, holes equal handles.";
  }
  if (chi === -1 && visitedCount >= 13) {
    return "χ=-1: The characteristic of a double torus emerges. Two cycles intertwine in your journey.";
  }
  if (chi === 2 && visitedCount < 10) {
    return "χ=2: The Euler characteristic of a sphere. Pure wholeness without complexity—a beginning.";
  }
  if (visitedCount === 64 && chi === 1) {
    return "64 tiles, χ=1: The I Ching's completeness meets topological unity. All hexagrams visited, all changes honored.";
  }
  return null;
}

function getBettiInterpretation(beta0: number, beta1: number): { insight: string; quality: string } {
  if (beta0 === 1 && beta1 === 0) {
    return {
      insight: "Your journey forms a simply connected region—no islands, no holes. A pristine territory of continuous exploration.",
      quality: "Cohesion"
    };
  }
  if (beta0 > 1 && beta1 === 0) {
    return {
      insight: `${beta0} separate archipelagos in your exploration. Like scattered islands awaiting bridges, these clusters hold independent wisdom that hasn't yet merged.`,
      quality: "Multiplicity"
    };
  }
  if (beta0 === 1 && beta1 > 0) {
    return {
      insight: `A unified territory with ${beta1} mysterious void${beta1 > 1 ? 's' : ''}—unexplored spaces completely surrounded by your path. These aren't gaps; they're sacred centers you've circled but not entered.`,
      quality: "Mystery"
    };
  }
  return {
    insight: `${beta0} clusters, ${beta1} holes: A complex topology emerges. Your journey creates both separation and encirclement—some truths approached from multiple angles, others deliberately circled.`,
    quality: "Complexity"
  };
}

function getPathNarrative(pathComplexity: number, spiralAlignment: number, coverage: number): string {
  if (spiralAlignment > 0.6 && coverage > 0.3) {
    return "Your path spirals outward like a nautilus shell—the golden ratio of exploration, expanding capacity with each revolution.";
  }
  if (pathComplexity > 5 && coverage > 0.4) {
    return "A weaving path that returns and crosses itself. Like a labyrinth walker, you understand that revisiting transforms—each return brings new eyes.";
  }
  if (pathComplexity === 0 && coverage > 0.2) {
    return "A pure, non-repeating journey. Each step ventures into new territory. You're writing a story without looking back.";
  }
  if (coverage < 0.15) {
    return "The first brushstrokes on a vast canvas. The topology is still forming, full of potential paths not yet taken.";
  }
  return "Your path weaves between the known and unknown, building a topology that is uniquely yours.";
}

function getSymmetryReading(symmetryScore: number, diagonalDensity: number): string | null {
  if (symmetryScore > 0.7) {
    return "Remarkable symmetry detected: your journey mirrors itself across the center. Like a mandala, you're building wholeness through reflection.";
  }
  if (diagonalDensity > 0.4) {
    return "The diagonals glow with your presence. You're walking the paths of greatest change—where row and column transform together.";
  }
  if (symmetryScore > 0.4 && diagonalDensity > 0.25) {
    return "A hidden order emerges: partial symmetry and diagonal resonance. Your unconscious guides you toward balance.";
  }
  return null;
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
  
  const torusMetaphor = getTorusMetaphor(metrics.genus);
  const eulerCoincidence = getEulerCoincidence(metrics.eulerCharacteristic, visitedTiles.size);
  const bettiInterpretation = getBettiInterpretation(metrics.beta0, metrics.beta1);
  const pathNarrative = getPathNarrative(metrics.pathComplexity, metrics.spiralAlignment, metrics.coverage);
  const symmetryReading = getSymmetryReading(metrics.symmetryScore, metrics.diagonalDensity);
  
  return (
    <div className="bg-gradient-to-br from-indigo-500/5 via-background to-violet-500/5 rounded-lg border border-indigo-500/20 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-indigo-500/10 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <Hexagon className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold">Topological Mysteries</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          The hidden geometry of your journey reveals itself
        </p>
      </div>
      
      <div className="p-4 space-y-5">
        {/* Primary Metaphor - Surface Type */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              {torusMetaphor.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{torusMetaphor.title}</span>
                <Badge variant="outline" className="text-[10px] h-4">
                  genus = {metrics.genus}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {torusMetaphor.story}
              </p>
            </div>
          </div>
        </div>
        
        {/* Betti Numbers Interpretation */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-500" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Homological Signature
            </span>
            <Badge variant="secondary" className="text-[10px] h-4 ml-auto">
              {bettiInterpretation.quality}
            </Badge>
          </div>
          
          {/* Visual Betti representation */}
          <div className="flex items-center gap-4 py-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{metrics.beta0}</div>
              <div className="text-[10px] text-muted-foreground">β₀ islands</div>
            </div>
            <div className="text-muted-foreground">·</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{metrics.beta1}</div>
              <div className="text-[10px] text-muted-foreground">β₁ holes</div>
            </div>
            <div className="text-muted-foreground">·</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{metrics.eulerCharacteristic}</div>
              <div className="text-[10px] text-muted-foreground">χ euler</div>
            </div>
          </div>
          
          <p className="text-sm text-foreground/90 leading-relaxed">
            {bettiInterpretation.insight}
          </p>
        </div>
        
        {/* Euler Coincidence - if exists */}
        {eulerCoincidence && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-medium">
                  Numerical Coincidence
                </span>
                <p className="text-sm text-foreground/90 mt-1">
                  {eulerCoincidence}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Path Narrative */}
        <div className="p-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-lg border border-green-500/20">
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs uppercase tracking-wider text-green-600 dark:text-green-400 font-medium">
                Path Topology
              </span>
              <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
                {pathNarrative}
              </p>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span>{journeyPath.length} steps</span>
                <span>·</span>
                <span>{metrics.pathComplexity} revisits</span>
                <span>·</span>
                <span>{Math.round(metrics.coverage * 100)}% coverage</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Symmetry Reading - if significant */}
        {symmetryReading && (
          <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Eye className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400 font-medium">
                  Hidden Pattern
                </span>
                <p className="text-sm text-foreground/90 mt-1">
                  {symmetryReading}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Gaps as Sacred Spaces */}
        {metrics.gapCount > 0 && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 font-medium">
                  {metrics.gapCount} Sacred Void{metrics.gapCount > 1 ? 's' : ''}
                </span>
                <p className="text-sm text-foreground/90 mt-1">
                  {metrics.gapCount === 1 
                    ? "One tile sits surrounded but unvisited—a deliberate mystery at the heart of your exploration. What are you circling?"
                    : `${metrics.gapCount} tiles await within your territory. These almost-entered spaces hold special significance—the questions you've approached but not yet answered.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Ring Correlation */}
        {currentUnlockedRing >= 3 && metrics.spiralAlignment > 0.3 && (
          <div className="text-center py-2 text-xs text-muted-foreground italic border-t border-border/50">
            "Ring {currentUnlockedRing} unlocked. Your window of tolerance expands with each topological revelation."
          </div>
        )}
      </div>
    </div>
  );
}