import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { TopologicalSignature, PolenSentiment, QuadrantThemes, QuadrantPosition } from '@/types/trajectory';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { 
  Brain, 
  X, 
  Sparkles, 
  Hash, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Minus,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Target,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TopologicalInsightsPanelProps {
  signature: TopologicalSignature | null;
  isAnalyzing?: boolean;
  onClose?: () => void;
  onApplyInsightToShadow?: (position: QuadrantPosition, insightNote: string) => void;
  onSuggestProphecy?: (position: QuadrantPosition, suggestion: string) => void;
}

// Helper to get quadrant label from position
const getQuadrantFromPosition = (pos: QuadrantPosition): 'SN' | 'IN' | 'IM' | 'SM' => {
  if (pos.x >= 0 && pos.y >= 0) return 'SN';
  if (pos.x < 0 && pos.y >= 0) return 'IN';
  if (pos.x < 0 && pos.y < 0) return 'IM';
  return 'SM';
};

// Theme colors matching quadrant philosophy
const THEME_COLORS: Record<keyof QuadrantThemes, string> = {
  intimacy: 'hsl(340, 82%, 52%)',      // Rose/Pink
  sovereignty: 'hsl(45, 93%, 47%)',    // Amber/Gold
  memory: 'hsl(210, 70%, 50%)',        // Blue
  novelty: 'hsl(142, 71%, 45%)',       // Green
};

const VALENCE_COLORS: Record<string, string> = {
  positive: 'hsl(142, 71%, 45%)',   // Green
  negative: 'hsl(0, 84%, 60%)',     // Red
  neutral: 'hsl(var(--muted-foreground))',
  ambivalent: 'hsl(270, 60%, 50%)', // Purple
};

// Valence icon component
const ValenceIcon: React.FC<{ valence: string; className?: string }> = ({ valence, className }) => {
  switch (valence) {
    case 'positive':
      return <ThumbsUp className={cn("w-3 h-3 text-green-500", className)} />;
    case 'negative':
      return <ThumbsDown className={cn("w-3 h-3 text-red-500", className)} />;
    case 'ambivalent':
      return <HelpCircle className={cn("w-3 h-3 text-purple-500", className)} />;
    default:
      return <Minus className={cn("w-3 h-3 text-muted-foreground", className)} />;
  }
};

// Dissonance icon component
const DissonanceIcon: React.FC<{ type: string | null }> = ({ type }) => {
  switch (type) {
    case 'aligned':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'divergent':
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case 'contradictory':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

// Loading skeleton
const AnalyzingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-5 w-40" />
    </div>
    <Skeleton className="h-24 w-full" />
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

// Empty state
const EmptyState: React.FC = () => (
  <div className="text-center py-8 px-4">
    <Brain className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
    <p className="text-sm text-muted-foreground">
      No analysis available yet
    </p>
    <p className="text-xs text-muted-foreground/70 mt-1">
      Capture POLEN entries to enable topological insights
    </p>
  </div>
);

// Transform 4 themes to 2 bipolar axes
const transformThemesToAxes = (themes: QuadrantThemes) => ({
  // X-axis: -1 (Memory) to +1 (Novelty)
  horizontal: themes.novelty - themes.memory,
  // Y-axis: -1 (Intimacy) to +1 (Sovereignty)  
  vertical: themes.sovereignty - themes.intimacy,
});

// Get quadrant from axis position
const getQuadrantFromAxes = (horizontal: number, vertical: number): string => {
  if (horizontal >= 0 && vertical >= 0) return 'SN'; // Sovereignty-Novelty
  if (horizontal < 0 && vertical >= 0) return 'SM';  // Sovereignty-Memory
  if (horizontal < 0 && vertical < 0) return 'IM';   // Intimacy-Memory
  return 'IN'; // Intimacy-Novelty
};

// Bipolar axis position chart
const AxisPositionChart: React.FC<{ themes: QuadrantThemes }> = ({ themes }) => {
  const axes = transformThemesToAxes(themes);
  const quadrant = getQuadrantFromAxes(axes.horizontal, axes.vertical);
  
  return (
    <div className="space-y-4">
      {/* SVG Quadrant Visualization */}
      <div className="relative aspect-square max-w-[200px] mx-auto">
        <svg viewBox="-1.3 -1.3 2.6 2.6" className="w-full h-full">
          {/* Quadrant backgrounds */}
          <rect x="0" y="-1" width="1" height="1" fill="hsl(45 93% 47% / 0.08)" /> {/* SN - top right */}
          <rect x="-1" y="-1" width="1" height="1" fill="hsl(45 93% 47% / 0.05)" /> {/* SM - top left */}
          <rect x="-1" y="0" width="1" height="1" fill="hsl(340 82% 52% / 0.08)" /> {/* IM - bottom left */}
          <rect x="0" y="0" width="1" height="1" fill="hsl(340 82% 52% / 0.05)" /> {/* IN - bottom right */}
          
          {/* Grid border */}
          <rect x="-1" y="-1" width="2" height="2" fill="none" stroke="hsl(var(--border))" strokeWidth="0.02" />
          
          {/* Axis lines */}
          <line x1="-1" y1="0" x2="1" y2="0" stroke="hsl(var(--border))" strokeWidth="0.02" />
          <line x1="0" y1="-1" x2="0" y2="1" stroke="hsl(var(--border))" strokeWidth="0.02" />
          
          {/* Quadrant labels */}
          <text x="0.5" y="-0.5" fontSize="0.15" textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--muted-foreground))" opacity="0.5">SN</text>
          <text x="-0.5" y="-0.5" fontSize="0.15" textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--muted-foreground))" opacity="0.5">SM</text>
          <text x="-0.5" y="0.5" fontSize="0.15" textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--muted-foreground))" opacity="0.5">IM</text>
          <text x="0.5" y="0.5" fontSize="0.15" textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--muted-foreground))" opacity="0.5">IN</text>
          
          {/* Axis labels */}
          <text x="0" y="-1.15" fontSize="0.11" textAnchor="middle" fill="hsl(45 93% 47%)">Sovereignty ↑</text>
          <text x="0" y="1.2" fontSize="0.11" textAnchor="middle" fill="hsl(340 82% 52%)">↓ Intimacy</text>
          <text x="-1.15" y="0" fontSize="0.11" textAnchor="middle" fill="hsl(210 70% 50%)" transform="rotate(-90 -1.15 0)">Memory ←</text>
          <text x="1.15" y="0" fontSize="0.11" textAnchor="middle" fill="hsl(142 71% 45%)" transform="rotate(90 1.15 0)">→ Novelty</text>
          
          {/* Position marker */}
          <circle 
            cx={axes.horizontal} 
            cy={-axes.vertical} 
            r="0.08" 
            fill="hsl(var(--primary))" 
            stroke="hsl(var(--background))"
            strokeWidth="0.02"
          />
          {/* Glow effect */}
          <circle 
            cx={axes.horizontal} 
            cy={-axes.vertical} 
            r="0.12" 
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.02"
            opacity="0.4"
          />
        </svg>
      </div>
      
      {/* Axis Sliders */}
      <div className="space-y-3 px-2">
        {/* Memory ↔ Novelty axis */}
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span style={{ color: THEME_COLORS.memory }}>Memory</span>
            <span className="font-mono text-muted-foreground">{axes.horizontal.toFixed(2)}</span>
            <span style={{ color: THEME_COLORS.novelty }}>Novelty</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-blue-500/20 via-muted to-green-500/20 rounded-full relative">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm"
              style={{ left: `calc(${((axes.horizontal + 1) / 2) * 100}% - 6px)` }}
            />
          </div>
        </div>
        
        {/* Intimacy ↔ Sovereignty axis */}
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span style={{ color: THEME_COLORS.intimacy }}>Intimacy</span>
            <span className="font-mono text-muted-foreground">{axes.vertical.toFixed(2)}</span>
            <span style={{ color: THEME_COLORS.sovereignty }}>Sovereignty</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-rose-500/20 via-muted to-amber-500/20 rounded-full relative">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm"
              style={{ left: `calc(${((axes.vertical + 1) / 2) * 100}% - 6px)` }}
            />
          </div>
        </div>
      </div>
      
      {/* Current quadrant badge */}
      <div className="text-center">
        <Badge variant="secondary" className="text-xs">
          Journey tends toward <span className="font-bold ml-1">{quadrant}</span>
        </Badge>
      </div>
    </div>
  );
};

// Keyword cloud
const KeywordCloud: React.FC<{ sentiments?: PolenSentiment[] }> = ({ sentiments }) => {
  const keywordCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sentiments?.forEach(s => {
      s.keywords.forEach(kw => {
        counts[kw] = (counts[kw] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [sentiments]);

  if (keywordCounts.length === 0) {
    return <p className="text-xs text-muted-foreground">No keywords extracted</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {keywordCounts.map(({ word, count }) => (
        <Badge 
          key={word}
          variant="secondary"
          className={cn(
            "transition-all",
            count >= 3 && "text-sm font-semibold bg-primary/20 text-primary",
            count === 2 && "text-xs",
            count === 1 && "text-[10px] opacity-70"
          )}
        >
          {word}
          {count > 1 && <span className="ml-1 opacity-60">×{count}</span>}
        </Badge>
      ))}
    </div>
  );
};

// Valence pie chart
const ValencePieChart: React.FC<{ sentiments?: PolenSentiment[] }> = ({ sentiments }) => {
  const valenceData = useMemo(() => {
    const counts: Record<string, number> = { positive: 0, negative: 0, neutral: 0, ambivalent: 0 };
    sentiments?.forEach(s => {
      counts[s.emotionalValence]++;
    });
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        fill: VALENCE_COLORS[name]
      }));
  }, [sentiments]);

  if (valenceData.length === 0) {
    return <p className="text-xs text-muted-foreground">No valence data</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={120}>
      <PieChart>
        <Pie
          data={valenceData}
          cx="50%"
          cy="50%"
          innerRadius={25}
          outerRadius={45}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {valenceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Individual sentiment accordion with axis display
const SentimentAccordion: React.FC<{ sentiments?: PolenSentiment[] }> = ({ sentiments }) => {
  if (!sentiments || sentiments.length === 0) {
    return <p className="text-xs text-muted-foreground">No entries analyzed</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {sentiments.map((sentiment, index) => {
        const axes = transformThemesToAxes(sentiment.themes);
        const quadrant = getQuadrantFromAxes(axes.horizontal, axes.vertical);
        
        return (
          <AccordionItem key={sentiment.polenId} value={sentiment.polenId}>
            <AccordionTrigger className="text-sm py-2 hover:no-underline">
              <div className="flex items-center gap-2 flex-1">
                <Badge variant="outline" className="font-mono text-[10px] px-1.5">
                  #{index + 1}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="font-mono text-[10px] px-1.5"
                >
                  {quadrant}
                </Badge>
                <ValenceIcon valence={sentiment.emotionalValence} />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {/* Axis position mini-display */}
                <div className="space-y-2">
                  {/* Memory ↔ Novelty */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span style={{ color: THEME_COLORS.memory }} className="w-14">Memory</span>
                    <div className="flex-1 h-1.5 bg-gradient-to-r from-blue-500/20 via-muted to-green-500/20 rounded-full relative">
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"
                        style={{ left: `calc(${((axes.horizontal + 1) / 2) * 100}% - 4px)` }}
                      />
                    </div>
                    <span style={{ color: THEME_COLORS.novelty }} className="w-14 text-right">Novelty</span>
                  </div>
                  
                  {/* Intimacy ↔ Sovereignty */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span style={{ color: THEME_COLORS.intimacy }} className="w-14">Intimacy</span>
                    <div className="flex-1 h-1.5 bg-gradient-to-r from-rose-500/20 via-muted to-amber-500/20 rounded-full relative">
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"
                        style={{ left: `calc(${((axes.vertical + 1) / 2) * 100}% - 4px)` }}
                      />
                    </div>
                    <span style={{ color: THEME_COLORS.sovereignty }} className="w-14 text-right">Sovereignty</span>
                  </div>
                </div>
                
                {/* Keywords */}
                {sentiment.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sentiment.keywords.map(kw => (
                      <Badge key={kw} variant="secondary" className="text-[10px] py-0">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

// Main component
export const TopologicalInsightsPanel: React.FC<TopologicalInsightsPanelProps> = ({
  signature,
  isAnalyzing,
  onClose,
  onApplyInsightToShadow,
  onSuggestProphecy
}) => {
  // Loading state
  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Analyzing journey...</span>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <AnalyzingSkeleton />
      </div>
    );
  }
  
  // Empty state
  if (!signature || signature.polenCount === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-muted-foreground" />
            Topological Insights
          </h3>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Topological Insights
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {signature.polenCount} entries • {formatDistanceToNow(new Date(signature.analyzedAt))} ago
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Pattern Insight */}
      {signature.patternInsight && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-medium text-primary mb-1">AI Pattern Insight</p>
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  "{signature.patternInsight}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confidence & Dissonance Summary */}
      <div className="grid grid-cols-2 gap-2">
        {/* Confidence */}
        <div className="p-2.5 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium">Confidence</span>
            <span className="text-sm font-bold font-mono">
              {Math.round(signature.confidence * 100)}%
            </span>
          </div>
          <Progress value={signature.confidence * 100} className="h-1" />
        </div>
        
        {/* Dissonance */}
        <div className={cn(
          "p-2.5 rounded-lg",
          signature.dissonanceType === 'aligned' && "bg-green-500/10",
          signature.dissonanceType === 'divergent' && "bg-amber-500/10",
          signature.dissonanceType === 'contradictory' && "bg-red-500/10",
          !signature.dissonanceType && "bg-muted/50"
        )}>
          <span className="text-[10px] font-medium block mb-1">Alignment</span>
          <div className="flex items-center gap-1.5">
            <DissonanceIcon type={signature.dissonanceType} />
            <span className="text-xs capitalize font-medium">
              {signature.dissonanceType || 'Not assessed'}
            </span>
          </div>
        </div>
      </div>

      {/* Apply Insight Actions */}
      {signature.inferredPosition && (onApplyInsightToShadow || onSuggestProphecy) && (
        <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-3 space-y-2">
            <p className="text-[10px] font-medium text-muted-foreground">Apply Insight</p>
            
            {/* Apply to Shadow */}
            {onApplyInsightToShadow && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-8 text-xs"
                onClick={() => onApplyInsightToShadow(
                  signature.inferredPosition!,
                  signature.aiNudge || `AI detected ${signature.inferredQuadrant} tendency`
                )}
              >
                <Target className="w-3 h-3 mr-2" />
                Apply to Shadow
                <Badge variant="secondary" className="ml-auto font-mono text-[10px]">
                  {signature.inferredQuadrant || getQuadrantFromPosition(signature.inferredPosition!)}
                </Badge>
              </Button>
            )}
            
            {/* Suggest as Prophecy (only if divergent/contradictory) */}
            {onSuggestProphecy && 
             (signature.dissonanceType === 'divergent' || signature.dissonanceType === 'contradictory') && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 text-xs text-primary hover:text-primary"
                onClick={() => onSuggestProphecy(
                  signature.inferredPosition!,
                  signature.aiNudge || 'Journey patterns suggest this direction'
                )}
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Update Prophecy to Match Patterns
                <ArrowRight className="w-3 h-3 ml-auto" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Axis Position Chart */}
      <Card>
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs">Memory ↔ Novelty · Intimacy ↔ Sovereignty</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <AxisPositionChart themes={signature.semantic} />
        </CardContent>
      </Card>

      {/* Keyword Cloud */}
      <Card>
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Hash className="w-3 h-3" />
            Keyword Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <KeywordCloud sentiments={signature.sentiments} />
        </CardContent>
      </Card>

      {/* Valence Distribution */}
      {signature.sentiments && signature.sentiments.length > 0 && (
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs">Emotional Valence</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <ValencePieChart sentiments={signature.sentiments} />
          </CardContent>
        </Card>
      )}

      {/* Individual Entry Breakdown */}
      {signature.sentiments && signature.sentiments.length > 0 && (
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs flex items-center justify-between">
              <span>Entry Analysis</span>
              <Badge variant="secondary" className="text-[10px]">
                {signature.sentiments.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <SentimentAccordion sentiments={signature.sentiments} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopologicalInsightsPanel;
