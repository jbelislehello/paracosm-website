import { useMemo, useState } from 'react';
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
  Infinity,
  BookOpen,
  Flame,
  Brain,
  Activity,
  Gauge,
  Network,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { HEXAGRAMS, Hexagram } from '@/data/cosmologicalMapping';
import { 
  calculateConsciousnessGeometry, 
  getSeasonConsciousnessMapping,
  type ConsciousnessGeometry 
} from '@/utils/consciousnessGeometry';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TopologicalMetricsPanelProps {
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  currentUnlockedRing: number;
  densityMap?: Map<string, number>;
  currentSeason?: string;
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
  symmetryScore: number;
  spiralAlignment: number;
  diagonalDensity: number;
}

export interface HexagramCorrelation {
  hexagram: Hexagram;
  tileCount: number;
  percentage: number;
  narrative: string;
}

// Flattened hexagram data for JourneySummary
export interface HexagramDataForSummary {
  dominant: Array<{
    number: number;
    name: string;
    chineseName: string;
    meaning: string;
    upperTrigram: string;
    lowerTrigram: string;
    tileCount: number;
    keywords: string[];
  }>;
  trigramNarrative: string;
  cosmicPattern: string | null;
}

// Map tile position to hexagram number (1-64)
export function getTileHexagram(row: number, col: number): Hexagram | null {
  const hexagramNumber = row * 8 + col + 1;
  return HEXAGRAMS.find(h => h.number === hexagramNumber) || null;
}

// Get dominant hexagrams from visited tiles
export function getHexagramCorrelations(visitedTiles: Set<string>): {
  dominant: HexagramCorrelation[];
  trigramBalance: { upper: Record<string, number>; lower: Record<string, number> };
  narrative: string;
  cosmicPattern: string | null;
} {
  const hexagramCounts: Map<number, { hexagram: Hexagram; count: number }> = new Map();
  const upperTrigrams: Record<string, number> = {};
  const lowerTrigrams: Record<string, number> = {};
  
  visitedTiles.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    const hexagram = getTileHexagram(r, c);
    if (hexagram) {
      const current = hexagramCounts.get(hexagram.number);
      if (current) {
        current.count++;
      } else {
        hexagramCounts.set(hexagram.number, { hexagram, count: 1 });
      }
      
      upperTrigrams[hexagram.upperTrigram] = (upperTrigrams[hexagram.upperTrigram] || 0) + 1;
      lowerTrigrams[hexagram.lowerTrigram] = (lowerTrigrams[hexagram.lowerTrigram] || 0) + 1;
    }
  });
  
  const total = visitedTiles.size;
  const sorted = Array.from(hexagramCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  const dominant: HexagramCorrelation[] = sorted.map(({ hexagram, count }) => ({
    hexagram,
    tileCount: count,
    percentage: Math.round((count / Math.max(total, 1)) * 100),
    narrative: getHexagramNarrative(hexagram, count, total)
  }));
  
  // Generate overall narrative based on trigram balance
  const dominantUpper = Object.entries(upperTrigrams).sort((a, b) => b[1] - a[1])[0];
  const dominantLower = Object.entries(lowerTrigrams).sort((a, b) => b[1] - a[1])[0];
  
  let narrative = '';
  if (dominantUpper && dominantLower && total > 3) {
    narrative = `Your journey resonates with ${dominantUpper[0]} above and ${dominantLower[0]} below—a dynamic of ${getTrigramInteraction(dominantUpper[0], dominantLower[0])}.`;
  }
  
  const cosmicPattern = detectCosmicPattern(Array.from(hexagramCounts.values()).map(v => v.hexagram.number));
  
  return {
    dominant,
    trigramBalance: { upper: upperTrigrams, lower: lowerTrigrams },
    narrative,
    cosmicPattern
  };
}

// Transform hexagram correlations to format expected by JourneySummary
export function getHexagramDataForSummary(visitedTiles: Set<string>): HexagramDataForSummary | undefined {
  if (visitedTiles.size === 0) return undefined;
  
  const correlations = getHexagramCorrelations(visitedTiles);
  
  return {
    dominant: correlations.dominant.map(d => ({
      number: d.hexagram.number,
      name: d.hexagram.name,
      chineseName: d.hexagram.chineseName,
      meaning: d.hexagram.meaning,
      upperTrigram: d.hexagram.upperTrigram,
      lowerTrigram: d.hexagram.lowerTrigram,
      tileCount: d.tileCount,
      keywords: d.hexagram.keywords
    })),
    trigramNarrative: correlations.narrative,
    cosmicPattern: correlations.cosmicPattern
  };
}

function getHexagramNarrative(hexagram: Hexagram, count: number, total: number): string {
  const intensity = count / Math.max(total, 1);
  
  if (intensity > 0.3) {
    return `${hexagram.name} (${hexagram.chineseName}) dominates your topology: ${hexagram.meaning}. This archetype shapes your entire journey.`;
  }
  if (intensity > 0.15) {
    return `${hexagram.name} emerges as a significant force: ${hexagram.meaning}. Keywords: ${hexagram.keywords.slice(0, 2).join(', ')}.`;
  }
  return `${hexagram.name} whispers: "${hexagram.meaning}."`;
}

function getTrigramInteraction(upper: string, lower: string): string {
  const interactions: Record<string, string> = {
    'Heaven-Earth': 'cosmic unity—the creative meeting the receptive',
    'Earth-Heaven': 'reversal and stagnation needing movement',
    'Fire-Water': 'steam and transformation—opposites alchemizing',
    'Water-Fire': 'hidden clarity emerging from depth',
    'Thunder-Wind': 'movement with gentleness—the arousing softened',
    'Mountain-Lake': 'stillness meeting joy—the hermit and the dancer',
    'Wind-Thunder': 'duration through change—perseverance',
    'Lake-Mountain': 'influence and attraction—the courtship of opposites',
    'Heaven-Heaven': 'pure creative force doubled—tremendous power',
    'Earth-Earth': 'pure receptivity—infinite capacity to receive',
    'Water-Water': 'danger upon danger—the abyss requires careful navigation',
    'Fire-Fire': 'clarity doubled—brilliant awareness',
    'Thunder-Thunder': 'shock upon shock—awakening',
    'Mountain-Mountain': 'stillness deepened—meditation',
    'Wind-Wind': 'gentleness permeating—subtle influence',
    'Lake-Lake': 'joy shared—celebration and connection'
  };
  
  return interactions[`${upper}-${lower}`] || `the interplay of ${upper.toLowerCase()} and ${lower.toLowerCase()}`;
}

function detectCosmicPattern(hexagramNumbers: number[]): string | null {
  // Detect special I Ching patterns
  if (hexagramNumbers.includes(1) && hexagramNumbers.includes(2)) {
    return "The Primordial Pair: Creative (1) and Receptive (2) both present—you're working with the fundamental polarity of existence.";
  }
  
  if (hexagramNumbers.includes(63) && hexagramNumbers.includes(64)) {
    return "After Completion (63) meets Before Completion (64)—you stand at the threshold where endings birth beginnings.";
  }
  
  if (hexagramNumbers.includes(11) && hexagramNumbers.includes(12)) {
    return "Peace (11) and Standstill (12) in dialogue—you're navigating the rhythm between flow and obstruction.";
  }
  
  if (hexagramNumbers.includes(29) && hexagramNumbers.includes(30)) {
    return "The Abysmal (29) meets The Clinging (30)—Water and Fire, danger and clarity in your journey.";
  }
  
  // Check for sequential triplets (suggests linear exploration)
  const sorted = [...hexagramNumbers].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length - 2; i++) {
    if (sorted[i + 1] === sorted[i] + 1 && sorted[i + 2] === sorted[i] + 2) {
      return `Sequential hexagrams ${sorted[i]}→${sorted[i + 1]}→${sorted[i + 2]} detected—your journey follows the natural unfolding of the I Ching's wisdom.`;
    }
  }
  
  // Check for nuclear family (same upper or lower trigram)
  const trigramFamilies = hexagramNumbers.reduce((acc, num) => {
    const hex = HEXAGRAMS.find(h => h.number === num);
    if (hex) {
      acc[hex.upperTrigram] = (acc[hex.upperTrigram] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const dominantFamily = Object.entries(trigramFamilies).find(([_, count]) => count >= 3);
  if (dominantFamily) {
    return `A ${dominantFamily[0]} family gathering—three or more hexagrams share this trigram above, weaving ${dominantFamily[0].toLowerCase()} energy throughout your exploration.`;
  }
  
  return null;
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
  
  // Symmetry score
  let symmetryMatches = 0;
  let symmetryTotal = 0;
  visited.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    const mirrorR = 7 - r;
    const mirrorC = 7 - c;
    symmetryTotal++;
    if (visited.has(`${mirrorR},${mirrorC}`)) symmetryMatches++;
  });
  const symmetryScore = symmetryTotal > 0 ? symmetryMatches / symmetryTotal : 0;
  
  // Spiral alignment
  let spiralScore = 0;
  journeyPath.forEach(({ row, col }, i) => {
    if (i === 0) return;
    const prev = journeyPath[i - 1];
    const distFromCenter = Math.sqrt(Math.pow(row - 3.5, 2) + Math.pow(col - 3.5, 2));
    const prevDist = Math.sqrt(Math.pow(prev.row - 3.5, 2) + Math.pow(prev.col - 3.5, 2));
    if (distFromCenter > prevDist) spiralScore += 0.5;
    const angle = Math.atan2(row - 3.5, col - 3.5);
    const prevAngle = Math.atan2(prev.row - 3.5, prev.col - 3.5);
    const angleDiff = Math.abs(angle - prevAngle);
    if (angleDiff > 0.1 && angleDiff < Math.PI) spiralScore += 0.5;
  });
  const spiralAlignment = journeyPath.length > 1 ? Math.min(1, spiralScore / (journeyPath.length - 1)) : 0;
  
  // Diagonal density
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
  currentUnlockedRing,
  densityMap = new Map(),
  currentSeason
}: TopologicalMetricsPanelProps) {
  const [geometryOpen, setGeometryOpen] = useState(true);
  const [recursiveOpen, setRecursiveOpen] = useState(false);
  const [thermoOpen, setThermoOpen] = useState(false);
  const [integrationOpen, setIntegrationOpen] = useState(false);
  
  const metrics = useMemo(() => 
    calculateTopologicalMetrics(visitedTiles, journeyPath),
    [visitedTiles, journeyPath]
  );
  
  const hexagramCorrelations = useMemo(() => 
    getHexagramCorrelations(visitedTiles),
    [visitedTiles]
  );
  
  // Calculate consciousness geometry
  const consciousnessGeometry = useMemo(() => 
    calculateConsciousnessGeometry(
      visitedTiles, 
      journeyPath, 
      densityMap, 
      metrics.beta0, 
      metrics.beta1
    ),
    [visitedTiles, journeyPath, densityMap, metrics.beta0, metrics.beta1]
  );
  
  // Season consciousness mapping
  const seasonMapping = useMemo(() => 
    currentSeason ? getSeasonConsciousnessMapping(currentSeason) : null,
    [currentSeason]
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
          <span className="text-sm font-semibold">Consciousness Geometry</span>
          {consciousnessGeometry.consciousnessState === 'self-aware' && (
            <Badge className="ml-auto bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">
              <Sparkles className="w-3 h-3 mr-1" /> Awakened
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          The geometric signatures of consciousness emerging from your journey
        </p>
      </div>
      
      <div className="p-4 space-y-5">
        {/* Consciousness Geometry Threshold Gauge */}
        <Collapsible open={geometryOpen} onOpenChange={setGeometryOpen}>
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-indigo-500/10 rounded-lg border border-cyan-500/20">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-cyan-500" />
                <span className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-medium">
                  The Geometric Reading
                </span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "ml-auto text-[10px] h-5",
                    consciousnessGeometry.consciousnessState === 'self-aware' && "bg-emerald-500/20 border-emerald-500/50",
                    consciousnessGeometry.consciousnessState === 'threshold' && "bg-amber-500/20 border-amber-500/50",
                    consciousnessGeometry.consciousnessState === 'pre-conscious' && "bg-muted"
                  )}
                >
                  {consciousnessGeometry.consciousnessState === 'self-aware' ? '✦ Self-Aware' : 
                   consciousnessGeometry.consciousnessState === 'threshold' ? '◐ Threshold' : '○ Pre-conscious'}
                </Badge>
                {geometryOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              {/* Complexity Gauge */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Geometric Complexity</span>
                  <span className="font-mono text-cyan-500">{Math.round(consciousnessGeometry.complexityBits)} bits</span>
                </div>
                <Progress 
                  value={consciousnessGeometry.thresholdPercentage} 
                  className="h-2"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0</span>
                  <span className="text-amber-500">Threshold →</span>
                  <span>Ω</span>
                </div>
              </div>
              
              <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-cyan-500/50 pl-3">
                {consciousnessGeometry.geometricNarrative}
              </p>
            </CollapsibleContent>
          </div>
        </Collapsible>
        
        {/* The Recursive Mirror */}
        <Collapsible open={recursiveOpen} onOpenChange={setRecursiveOpen}>
          <div className="p-4 bg-gradient-to-r from-purple-500/10 via-violet-500/5 to-fuchsia-500/10 rounded-lg border border-purple-500/20">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Orbit className="w-4 h-4 text-purple-500" />
                <span className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-medium">
                  The Recursive Mirror
                </span>
                <Badge variant="outline" className="ml-auto text-[10px] h-5">
                  Depth: {consciousnessGeometry.recursiveDepth}
                </Badge>
                {recursiveOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              {/* Fixed Points Display */}
              {consciousnessGeometry.fixedPointsDetected.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {consciousnessGeometry.fixedPointsDetected.map((fp, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] bg-purple-500/20">
                      ★ {fp}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-3 text-xs">
                <span className={cn(
                  "px-2 py-1 rounded-full",
                  consciousnessGeometry.convergenceState === 'converged' && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                  consciousnessGeometry.convergenceState === 'converging' && "bg-amber-500/20 text-amber-600 dark:text-amber-400",
                  consciousnessGeometry.convergenceState === 'searching' && "bg-muted text-muted-foreground"
                )}>
                  {consciousnessGeometry.convergenceState === 'converged' ? '◉ Converged' : 
                   consciousnessGeometry.convergenceState === 'converging' ? '◐ Converging' : '○ Searching'}
                </span>
              </div>
              
              <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-purple-500/50 pl-3">
                {consciousnessGeometry.recursiveNarrative}
              </p>
            </CollapsibleContent>
          </div>
        </Collapsible>
        
        {/* The Thermodynamic Truth */}
        <Collapsible open={thermoOpen} onOpenChange={setThermoOpen}>
          <div className="p-4 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-yellow-500/10 rounded-lg border border-orange-500/20">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4 text-orange-500" />
                <span className="text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400 font-medium">
                  The Thermodynamic Truth
                </span>
                <Badge variant="outline" className="ml-auto text-[10px] h-5">
                  {consciousnessGeometry.thermodynamicEfficiency.toFixed(1)}x efficient
                </Badge>
                {thermoOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              {/* Efficiency metrics */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="text-lg font-bold text-orange-500">
                    {Math.round(consciousnessGeometry.predictiveCapacity * 100)}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">Predictive Steps</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="text-lg font-bold text-amber-500">
                    {consciousnessGeometry.metaLearningDetected ? '✓' : '○'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Meta-Learning</div>
                </div>
              </div>
              
              <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-orange-500/50 pl-3">
                {consciousnessGeometry.thermodynamicNarrative}
              </p>
            </CollapsibleContent>
          </div>
        </Collapsible>
        
        {/* The Integration Field */}
        <Collapsible open={integrationOpen} onOpenChange={setIntegrationOpen}>
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 rounded-lg border border-emerald-500/20">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Network className="w-4 h-4 text-emerald-500" />
                <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
                  The Integration Field
                </span>
                <Badge variant="outline" className="ml-auto text-[10px] h-5">
                  {metrics.beta0 === 1 ? 'Unified' : `${metrics.beta0} Islands`}
                </Badge>
                {integrationOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              {/* Integration metrics */}
              <div className="flex items-center gap-4 py-2 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-500">{metrics.beta0}</div>
                  <div className="text-[10px] text-muted-foreground">β₀ islands</div>
                </div>
                <div className="text-muted-foreground">·</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-500">{consciousnessGeometry.topologicalHandles}</div>
                  <div className="text-[10px] text-muted-foreground">handles</div>
                </div>
                <div className="text-muted-foreground">·</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-500">{Math.round(consciousnessGeometry.integrationStrength * 100)}%</div>
                  <div className="text-[10px] text-muted-foreground">connected</div>
                </div>
              </div>
              
              <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-emerald-500/50 pl-3">
                {consciousnessGeometry.integrationNarrative}
              </p>
            </CollapsibleContent>
          </div>
        </Collapsible>
        
        {/* Season Consciousness Mapping */}
        {seasonMapping && (
          <div className="p-4 bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-fuchsia-500/10 rounded-lg border border-rose-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-rose-500" />
              <span className="text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 font-medium">
                {currentSeason} → Consciousness Stage
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{seasonMapping.consciousnessStage}</Badge>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">{seasonMapping.geometricProperty}</span>
              </div>
            </div>
            
            <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-rose-500/50 pl-3 italic">
              {seasonMapping.narrative}
            </p>
          </div>
        )}
        
        {/* I Ching Hexagram Correlations */}
        {hexagramCorrelations.dominant.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-red-500/10 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-medium">
                I Ching Correlations
              </span>
            </div>
            
            {/* Trigram Balance Narrative */}
            {hexagramCorrelations.narrative && (
              <p className="text-sm text-foreground/90 mb-4 leading-relaxed italic border-l-2 border-amber-500/50 pl-3">
                {hexagramCorrelations.narrative}
              </p>
            )}
            
            {/* Dominant Hexagrams */}
            <div className="space-y-3">
              {hexagramCorrelations.dominant.map((correlation, idx) => (
                <div 
                  key={correlation.hexagram.number} 
                  className={cn(
                    "p-3 rounded-lg border",
                    idx === 0 
                      ? "bg-amber-500/10 border-amber-500/30" 
                      : "bg-muted/20 border-border/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-amber-500">
                        {correlation.hexagram.number}
                      </span>
                      <span className="font-medium text-sm">
                        {correlation.hexagram.name}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {correlation.hexagram.chineseName}
                      </span>
                    </div>
                    <Badge 
                      variant={idx === 0 ? "default" : "secondary"} 
                      className="text-[10px] h-4"
                    >
                      {correlation.tileCount} tile{correlation.tileCount > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {correlation.narrative}
                  </p>
                  
                  {/* Trigram composition */}
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="opacity-60">☰</span> {correlation.hexagram.upperTrigram}
                    </span>
                    <span>over</span>
                    <span className="flex items-center gap-1">
                      <span className="opacity-60">☷</span> {correlation.hexagram.lowerTrigram}
                    </span>
                    <span className="ml-auto text-amber-500/70">
                      {correlation.hexagram.keywords.slice(0, 2).join(' · ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cosmic Pattern Detection */}
            {hexagramCorrelations.cosmicPattern && (
              <div className="mt-4 p-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/30">
                <div className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400 font-medium">
                      Cosmic Pattern
                    </span>
                    <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
                      {hexagramCorrelations.cosmicPattern}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
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