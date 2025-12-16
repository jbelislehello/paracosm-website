import { useState, useEffect } from 'react';
import { TopologyStory } from '@/hooks/useTopologyInsight';
import { StoryChapter } from './StoryChapter';
import { TopologyViewMode } from './ViewModeSelector';
import { ConcreteInsightCard } from './ConcreteInsightCard';
import { TopologicalInsightsPanel } from '@/components/calm-magic/TopologicalInsightsPanel';
import { TopologicalSignature, QuadrantPosition } from '@/types/trajectory';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Sparkles, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Lightbulb,
  MessageCircleQuestion,
  Save,
  Lock,
  Compass,
  Target,
  Map,
  Layers,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopologyStoryExplorerProps {
  story: TopologyStory | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
  onSaveToJournal?: (content: string) => void;
  viewMode?: TopologyViewMode;
  visitedTiles?: Set<string>;
  currentUnlockedRing?: number;
  journeyPath?: Array<{ row: number; col: number }>;
  // Topological insights props
  topologicalSignature?: TopologicalSignature | null;
  isAnalyzingTopology?: boolean;
  onAnalyzeTopology?: () => void;
  onApplyInsightToShadow?: (position: QuadrantPosition, insightNote: string) => void;
  // Secrets reveal props
  secretsRevealed?: boolean;
  onToggleSecrets?: () => void;
}

// View significance explanations
const VIEW_SIGNIFICANCE: Record<TopologyViewMode, { icon: React.ReactNode; title: string; question: string; description: string }> = {
  isometric: {
    icon: <Layers className="w-4 h-4" />,
    title: "Spatial Territory View",
    question: "Where have I been? What territories remain unexplored?",
    description: "This 3D view shows your journey as conquered territory. Each tile represents a space you've made your own. Gaps reveal unexplored regions waiting for your attention."
  },
  diamond: {
    icon: <Target className="w-4 h-4" />,
    title: "Design Thinking Flow",
    question: "Am I in divergent discovery or convergent definition?",
    description: "The double diamond maps your tiles to the design process: Discover (open exploration), Define (focusing down), Develop (building out), Deliver (completion)."
  },
  spiral: {
    icon: <Compass className="w-4 h-4" />,
    title: "Window of Tolerance Expansion",
    question: "How has my capacity for complexity grown?",
    description: "Starting from the Inner Core (center), each ring represents expanded capacity to hold paradox, tension, and emergence. Your progress spirals outward."
  },
  flow: {
    icon: <TrendingUp className="w-4 h-4" />,
    title: "Attention Flow Field",
    question: "Where is my energy naturally pulled?",
    description: "This view reveals the gravitational pull of your attention. Attractors show where you gather; sources show where new energy emerges."
  },
  cycles: {
    icon: <RefreshCw className="w-4 h-4" />,
    title: "Recurring Pattern View",
    question: "What patterns keep returning in my journey?",
    description: "Cycles reveal the fundamental loops in your exploration—themes you return to, patterns that repeat, and intersections where paths cross."
  },
  projection: {
    icon: <Map className="w-4 h-4" />,
    title: "Hidden Connection Map",
    question: "What unseen relationships exist between tiles?",
    description: "This unfolded projection reveals how distant tiles connect through the torus topology—showing relationships invisible in flat views."
  },
  coordinates: {
    icon: <Target className="w-4 h-4" />,
    title: "Axis Position Reference",
    question: "Where do I stand on the fundamental axes?",
    description: "The coordinate view positions your journey between Memory↔Novelty (horizontal) and Intimacy↔Sovereignty (vertical), revealing your orientation tendencies."
  },
  charts: {
    icon: <BookOpen className="w-4 h-4" />,
    title: "Archive Density View",
    question: "Where is my knowledge deepest?",
    description: "Charts show the density of your engagement—where you've lingered and documented deeply versus where you've only passed through."
  }
};

// Quadrant meanings
const QUADRANT_INFO: Record<string, { name: string; meaning: string; whenLow: string; color: string }> = {
  SN: {
    name: "Sovereignty + Novelty",
    meaning: "Independent exploration, bold experiments",
    whenLow: "Consider bolder solo experiments",
    color: "hsl(var(--chart-1))"
  },
  IN: {
    name: "Intimacy + Novelty", 
    meaning: "Connected experimentation, co-creation",
    whenLow: "Try exploring new ideas with others",
    color: "hsl(var(--chart-2))"
  },
  IM: {
    name: "Intimacy + Memory",
    meaning: "Safe connection, grounded relating",
    whenLow: "Your relational foundation may need attention",
    color: "hsl(var(--chart-3))"
  },
  SM: {
    name: "Sovereignty + Memory",
    meaning: "Grounded independence, anchored knowing",
    whenLow: "Consider anchoring insights before expanding",
    color: "hsl(var(--chart-4))"
  }
};

// Ring names and descriptions
const RING_INFO: Record<number, { name: string; quality: string }> = {
  1: { name: "Inner Core", quality: "Calmness" },
  2: { name: "Stretch Zone", quality: "Spaciousness" },
  3: { name: "Edge Zone", quality: "Openness" },
  4: { name: "Integrator", quality: "Freedom" }
};

function ViewSignificanceSection({ viewMode }: { viewMode: TopologyViewMode }) {
  const info = VIEW_SIGNIFICANCE[viewMode];
  if (!info) return null;
  
  return (
    <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
          {info.icon}
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-primary/80 font-medium">
            {info.title}
          </p>
          <p className="text-sm font-semibold text-foreground">
            "{info.question}"
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {info.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function JourneyInterpretationSection({ 
  visitedTiles, 
  currentUnlockedRing = 1,
  journeyPath = []
}: { 
  visitedTiles: Set<string>; 
  currentUnlockedRing: number;
  journeyPath: Array<{ row: number; col: number }>;
}) {
  const totalTiles = 64;
  const coverage = Math.round((visitedTiles.size / totalTiles) * 100);
  
  // Calculate quadrant distribution
  const quadrants: Record<string, number> = { SN: 0, IN: 0, IM: 0, SM: 0 };
  visitedTiles.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    if (r < 4 && c < 4) quadrants.SM++;
    else if (r < 4 && c >= 4) quadrants.IM++;
    else if (r >= 4 && c < 4) quadrants.SN++;
    else quadrants.IN++;
  });
  
  const maxQuadrant = Math.max(...Object.values(quadrants));
  const minQuadrantEntry = Object.entries(quadrants).reduce((a, b) => a[1] < b[1] ? a : b);
  const hasGap = minQuadrantEntry[1] < maxQuadrant * 0.3;
  
  // Calculate ring progress
  const ringProgress: Record<number, { visited: number; total: number }> = {
    1: { visited: 0, total: 16 },
    2: { visited: 0, total: 20 },
    3: { visited: 0, total: 20 },
    4: { visited: 0, total: 8 }
  };
  
  visitedTiles.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    const distFromCenter = Math.max(Math.abs(r - 3.5), Math.abs(c - 3.5));
    if (distFromCenter <= 1.5) ringProgress[1].visited++;
    else if (distFromCenter <= 2.5) ringProgress[2].visited++;
    else if (distFromCenter <= 3.5) ringProgress[3].visited++;
    else ringProgress[4].visited++;
  });

  const getCoverageInsight = () => {
    if (coverage < 20) return "You're just beginning—every tile is a discovery";
    if (coverage < 40) return "A solid foundation is forming";
    if (coverage < 60) return "You're past the halfway point—patterns are emerging";
    if (coverage < 80) return "Deep exploration achieved—integration approaches";
    return "Near completion—prepare for synthesis";
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Map className="w-4 h-4 text-primary" />
        Your Journey So Far
      </h4>
      
      {/* Exploration Depth */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Exploration Depth</span>
          <span className="font-medium">{visitedTiles.size} of {totalTiles} tiles ({coverage}%)</span>
        </div>
        <Progress value={coverage} className="h-2" />
        <p className="text-xs text-muted-foreground italic">"{getCoverageInsight()}"</p>
      </div>
      
      {/* Capacity Level */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Capacity Level</p>
        <div className="space-y-1">
          {[1, 2, 3, 4].map(ring => {
            const info = RING_INFO[ring];
            const progress = ringProgress[ring];
            const isUnlocked = ring <= currentUnlockedRing;
            const isCurrent = ring === currentUnlockedRing;
            const pct = Math.round((progress.visited / progress.total) * 100);
            
            return (
              <div key={ring} className="flex items-center gap-2 text-xs">
                {isUnlocked ? (
                  pct === 100 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-primary" style={{ fill: `hsl(var(--primary) / ${pct / 100})` }} />
                  )
                ) : (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
                )}
                <span className={cn(
                  "flex-1",
                  !isUnlocked && "text-muted-foreground/50"
                )}>
                  {info.name}: {info.quality}
                </span>
                {isUnlocked && (
                  <span className="text-muted-foreground">{pct}%</span>
                )}
                {isCurrent && <Badge variant="outline" className="h-4 text-[10px] px-1">Current</Badge>}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Quadrant Balance */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Quadrant Balance</p>
        <div className="space-y-1.5">
          {Object.entries(quadrants).map(([q, count]) => {
            const info = QUADRANT_INFO[q];
            const pct = visitedTiles.size > 0 ? Math.round((count / visitedTiles.size) * 100) : 0;
            const isGap = count === minQuadrantEntry[1] && hasGap;
            
            return (
              <div key={q} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <div 
                      className="w-2.5 h-2.5 rounded-sm" 
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="font-medium">{q}</span>
                    <span className="text-muted-foreground">({info.meaning})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    {count} tiles
                    {isGap && <AlertCircle className="w-3 h-3 text-amber-500" />}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${pct}%`,
                      backgroundColor: info.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {hasGap && (
          <div className="flex items-start gap-2 p-2 bg-amber-500/10 rounded border border-amber-500/20 mt-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/90">
              <strong>Insight:</strong> Your journey shows less exploration in the{' '}
              <span className="font-medium">{minQuadrantEntry[0]}</span> quadrant.{' '}
              {QUADRANT_INFO[minQuadrantEntry[0]].whenLow}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SuggestedNextSteps({
  visitedTiles,
  currentUnlockedRing
}: {
  visitedTiles: Set<string>;
  currentUnlockedRing: number;
}) {
  const suggestions: Array<{ icon: React.ReactNode; title: string; description: string }> = [];
  
  // Calculate quadrant coverage
  const quadrants: Record<string, number> = { SN: 0, IN: 0, IM: 0, SM: 0 };
  visitedTiles.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    if (r < 4 && c < 4) quadrants.SM++;
    else if (r < 4 && c >= 4) quadrants.IM++;
    else if (r >= 4 && c < 4) quadrants.SN++;
    else quadrants.IN++;
  });
  
  const minQuadrant = Object.entries(quadrants).reduce((a, b) => a[1] < b[1] ? a : b);
  const maxQuadrant = Math.max(...Object.values(quadrants));
  
  // Balance quadrants
  if (minQuadrant[1] < maxQuadrant * 0.4 && visitedTiles.size > 8) {
    const qInfo = QUADRANT_INFO[minQuadrant[0]];
    suggestions.push({
      icon: <Compass className="w-4 h-4 text-primary" />,
      title: "Balance your exploration",
      description: `The ${minQuadrant[0]} quadrant (${qInfo.meaning}) has fewer visits.`
    });
  }
  
  // Unlock next ring
  if (currentUnlockedRing < 4) {
    const nextRing = RING_INFO[currentUnlockedRing + 1];
    suggestions.push({
      icon: <Layers className="w-4 h-4 text-primary" />,
      title: `Unlock ${nextRing.name}`,
      description: `Complete more tiles to expand into the ${nextRing.quality} zone.`
    });
  }
  
  // Deepen engagement
  if (visitedTiles.size > 16 && visitedTiles.size < 48) {
    suggestions.push({
      icon: <TrendingUp className="w-4 h-4 text-primary" />,
      title: "Deepen your engagement",
      description: "Return to visited tiles with new questions."
    });
  }
  
  if (suggestions.length === 0) return null;
  
  return (
    <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        Suggested Next Steps
      </h4>
      
      <div className="space-y-2">
        {suggestions.slice(0, 3).map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-medium">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopologyStoryExplorer({ 
  story, 
  isLoading, 
  error, 
  onRegenerate,
  onSaveToJournal,
  viewMode = 'isometric',
  visitedTiles = new Set(),
  currentUnlockedRing = 1,
  journeyPath = [],
  topologicalSignature,
  isAnalyzingTopology,
  onAnalyzeTopology,
  onApplyInsightToShadow,
  secretsRevealed = false,
  onToggleSecrets
}: TopologyStoryExplorerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [revealedChapters, setRevealedChapters] = useState<Set<number>>(new Set());
  const [showRevelation, setShowRevelation] = useState(false);

  useEffect(() => {
    setRevealedChapters(new Set());
    setShowRevelation(false);
  }, [story?.viewMode, story?.opening_mystery]);

  const handleRevealChapter = (index: number) => {
    setRevealedChapters(prev => new Set([...prev, index]));
    
    if (story?.chapters && revealedChapters.size + 1 >= story.chapters.length) {
      setTimeout(() => setShowRevelation(true), 600);
    }
  };

  const allChaptersRevealed = story?.chapters 
    ? revealedChapters.size >= story.chapters.length 
    : false;

  const handleSave = () => {
    if (!story || !onSaveToJournal) return;
    
    const content = `## ${story.storyTitle}

**Mystery**: ${story.opening_mystery}

### Discoveries
${story.chapters.map((ch, i) => `**${ch.title}**: ${ch.content}`).join('\n\n')}

### Key Revelation
${story.key_revelation}

### Invitation
${story.invitation}

---
*Coverage: ${story.stats.coverage}% | Ring: ${story.stats.currentRing} | Steps: ${story.stats.pathLength}*`;
    
    onSaveToJournal(content);
  };

  const progress = story?.chapters?.length 
    ? Math.round((revealedChapters.size / story.chapters.length) * 100) 
    : 0;

  return (
    <Collapsible open={secretsRevealed} onOpenChange={onToggleSecrets}>
      {/* Secrets Header - Always Visible */}
      <CollapsibleTrigger asChild>
        <button className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-violet-500/10 via-primary/5 to-accent/10 border border-violet-500/20 rounded-lg hover:from-violet-500/15 hover:to-accent/15 transition-all group">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
              secretsRevealed 
                ? "bg-gradient-to-br from-violet-500 to-primary shadow-lg shadow-violet-500/30" 
                : "bg-violet-500/20"
            )}>
              <Sparkles className={cn(
                "w-5 h-5 transition-all",
                secretsRevealed ? "text-white" : "text-violet-500 group-hover:animate-pulse",
                isLoading && "animate-spin"
              )} />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold block">
                {isLoading ? '🔮 Reading Patterns...' : secretsRevealed ? '✨ Mysteries Revealed' : '🔮 Hidden Secrets'}
              </span>
              <span className="text-xs text-muted-foreground">
                {viewMode === 'isometric' ? 'Spatial Territory' :
                 viewMode === 'diamond' ? 'Design Thinking' :
                 viewMode === 'spiral' ? 'Window of Tolerance' :
                 viewMode === 'flow' ? 'Attention Flow' :
                 viewMode === 'cycles' ? 'Recurring Patterns' :
                 viewMode === 'projection' ? 'Hidden Connections' :
                 viewMode === 'coordinates' ? 'Axis Position' :
                 'Archive Density'} View
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="animate-pulse">
                <Sparkles className="w-4 h-4 text-violet-500 animate-spin" />
              </div>
            )}
            {secretsRevealed ? (
              <Eye className="w-4 h-4 text-violet-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            )}
            {secretsRevealed ? (
              <ChevronUp className="w-4 h-4 text-violet-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      {/* Secrets Content - Collapsible */}
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="mt-4 space-y-4 animate-fade-in">
          
          {/* ERROR STATE - Inside collapsible */}
          {error && (
            <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRegenerate}
                className="mt-2"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </Button>
            </div>
          )}
          
          {/* LOADING STATE - Inside collapsible */}
          {isLoading && !error && (
            <div className="space-y-4">
              <ConcreteInsightCard insight={null} isLoading={true} />
              <div className="px-4 py-5 bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Uncovering hidden patterns...</p>
                    <p className="text-xs text-muted-foreground">Reading the topology of your journey</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted/30 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted/20 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          )}
          
          {/* CONTENT STATE - Show when story is ready */}
          {!isLoading && !error && (
            <>
              {/* CONCRETE INSIGHT CARD - AT THE TOP for immediate practical value */}
              <ConcreteInsightCard insight={story?.concreteInsight || null} isLoading={false} />
              
              {/* TOPOLOGICAL INSIGHTS PANEL - Sentiment analysis and fragment breakdown */}
              {(topologicalSignature || isAnalyzingTopology) && (
                <TopologicalInsightsPanel
                  signature={topologicalSignature || null}
                  isAnalyzing={isAnalyzingTopology}
                  onApplyInsightToShadow={onApplyInsightToShadow}
                />
              )}
          
              {/* AI STORY - Expandable section */}
              <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border rounded-lg overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Map className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-semibold block">Journey Insights</span>
                      <span className="text-xs text-muted-foreground">
                        {visitedTiles.size} tiles • Ring {currentUnlockedRing}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {story && (
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">
                          {revealedChapters.size}/{story.chapters.length} chapters
                        </span>
                        <div className="w-16 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Content */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300",
                  isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="px-4 pb-4 space-y-4">
                    {/* AI STORY FIRST - for surprise and wonder */}
                    {story ? (
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-violet-500" />
                          {story.storyTitle}
                        </h4>
                        
                        {/* Opening Mystery */}
                        <div className="p-4 bg-gradient-to-r from-violet-500/10 to-primary/10 rounded-lg border border-violet-500/20">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs uppercase tracking-wider text-violet-500/80 mb-1">
                                Opening Mystery
                              </p>
                              <p className="text-base font-medium leading-relaxed italic text-foreground">
                                "{story.opening_mystery}"
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Chapters */}
                        <div className="space-y-4">
                          {story.chapters.map((chapter, index) => (
                            <StoryChapter
                              key={index}
                              chapter={chapter}
                              index={index}
                              isRevealed={revealedChapters.has(index)}
                              onReveal={() => handleRevealChapter(index)}
                              isLast={index === story.chapters.length - 1}
                            />
                          ))}
                        </div>

                        {/* Key Revelation */}
                        <div className={cn(
                          "relative p-4 rounded-lg border-2 transition-all duration-500",
                          showRevelation && allChaptersRevealed
                            ? "bg-gradient-to-br from-amber-500/15 to-primary/10 border-amber-500/40"
                            : "bg-muted/20 border-dashed border-muted-foreground/20"
                        )}>
                          {!showRevelation || !allChaptersRevealed ? (
                            <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm">
                                Reveal all chapters to unlock the key revelation
                              </span>
                            </div>
                          ) : (
                            <div className="animate-fade-in">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                  <Lightbulb className="w-4 h-4 text-amber-500" />
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-amber-500/80 mb-1">
                                    Key Revelation
                                  </p>
                                  <p className="text-base font-semibold leading-relaxed text-foreground">
                                    {story.key_revelation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Invitation */}
                        {showRevelation && allChaptersRevealed && (
                          <div className="p-4 bg-muted/30 rounded-lg animate-fade-in">
                            <div className="flex items-start gap-3">
                              <MessageCircleQuestion className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                                  Your Invitation
                                </p>
                                <p className="text-sm text-foreground/90 leading-relaxed">
                                  {story.invitation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Story Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{story.stats.coverage}% explored</span>
                            <span>Ring {story.stats.currentRing}</span>
                            <span>{story.stats.pathLength} steps</span>
                          </div>
                          <div className="flex gap-2">
                            {onSaveToJournal && showRevelation && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSave}
                                className="h-7 text-xs gap-1"
                              >
                                <Save className="w-3 h-3" />
                                Save
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onRegenerate}
                              className="h-7 text-xs gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              New Story
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-5 bg-muted/20 border border-border/50 rounded-lg text-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Begin your journey to unlock hidden stories
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Each topology view reveals different mysteries about your exploration
                        </p>
                      </div>
                    )}

                    {/* Analytics sections below the story */}
                    <div className="pt-4 border-t border-border/50 space-y-4">
                      {/* View Significance */}
                      <ViewSignificanceSection viewMode={viewMode} />
                      
                      {/* Journey Interpretation */}
                      <JourneyInterpretationSection 
                        visitedTiles={visitedTiles}
                        currentUnlockedRing={currentUnlockedRing}
                        journeyPath={journeyPath}
                      />
                      
                      {/* Suggested Next Steps */}
                      <SuggestedNextSteps
                        visitedTiles={visitedTiles}
                        currentUnlockedRing={currentUnlockedRing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}