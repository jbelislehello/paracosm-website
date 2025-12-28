import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Globe2, 
  Lightbulb,
  Loader2,
  RefreshCw,
  ChevronRight,
  Shield,
  Scale,
  Eye,
  Lock,
  Users,
  Sparkles
} from 'lucide-react';
import { useOECDAnalysis } from '@/hooks/useOECDAnalysis';
import { 
  type CompiledPrdContent, 
  type PrincipleMatch, 
  type GapAnalysis,
  type FrameworkAlignment,
  compilePrdContent 
} from '@/utils/frameworkMatcher';
import { AI_GOVERNANCE_FRAMEWORKS, getFrameworkStatusColor } from '@/data/aiGovernanceFrameworks';
import { cn } from '@/lib/utils';

interface OECDInsightMatcherProps {
  prdData?: Record<string, unknown>;
  className?: string;
}

const PRINCIPLE_ICONS: Record<string, React.ReactNode> = {
  'inclusive-growth': <Users className="h-4 w-4" />,
  'human-centered': <Users className="h-4 w-4" />,
  'transparency': <Eye className="h-4 w-4" />,
  'safety': <Shield className="h-4 w-4" />,
  'accountability': <Scale className="h-4 w-4" />,
  'fairness': <Scale className="h-4 w-4" />,
  'security': <Lock className="h-4 w-4" />,
  'innovation': <Sparkles className="h-4 w-4" />,
  'international': <Globe2 className="h-4 w-4" />,
  'stewardship': <Shield className="h-4 w-4" />,
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500/20 border-green-500/30';
  if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
  if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
  return 'bg-red-500/20 border-red-500/30';
}

function getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  return colors[severity];
}

function getAlignmentColor(alignment: 'high' | 'medium' | 'low' | 'none'): string {
  const colors = {
    high: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    none: 'bg-muted text-muted-foreground border-border'
  };
  return colors[alignment];
}

export function OECDInsightMatcher({ prdData, className }: OECDInsightMatcherProps) {
  const [useAI, setUseAI] = useState(false);
  const [activeTab, setActiveTab] = useState('matches');
  
  const {
    isAnalyzing,
    results,
    error,
    analyzeWithAI,
    analyzeQuick,
    clearResults,
    analysisMode
  } = useOECDAnalysis();

  const compiledContent = useMemo(() => {
    if (!prdData) return null;
    return compilePrdContent(prdData);
  }, [prdData]);

  const handleAnalyze = async () => {
    if (!compiledContent) return;
    
    if (useAI) {
      await analyzeWithAI(compiledContent, prdData?.title as string);
    } else {
      analyzeQuick(compiledContent);
    }
  };

  const hasContent = compiledContent && Object.values(compiledContent).some(
    layer => Object.values(layer).some(v => v && typeof v === 'string' && v.trim())
  );

  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">OECD Insight Matcher</CardTitle>
              <p className="text-sm text-muted-foreground">
                Analyze PRD alignment with AI governance principles
              </p>
            </div>
          </div>
          
          {results && (
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border",
              getScoreBg(results.overallScore)
            )}>
              <span className="text-xs font-medium text-muted-foreground">Score</span>
              <span className={cn("text-lg font-bold", getScoreColor(results.overallScore))}>
                {results.overallScore}%
              </span>
            </div>
          )}
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Quick Mode</span>
          </div>
          <Switch
            checked={useAI}
            onCheckedChange={setUseAI}
            aria-label="Toggle AI mode"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm">AI Mode</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !hasContent}
            className="flex-1"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                {useAI ? <Brain className="h-4 w-4 mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                {useAI ? 'Analyze with AI' : 'Quick Analysis'}
              </>
            )}
          </Button>
          {results && (
            <Button variant="outline" size="icon" onClick={clearResults}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!hasContent && (
          <p className="text-sm text-muted-foreground mt-2">
            Add content to your PRD layers to enable analysis.
          </p>
        )}

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardHeader>

      {results && (
        <CardContent className="pt-0">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-xs text-muted-foreground">Matched</span>
              </div>
              <span className="text-xl font-bold text-green-400">
                {results.matches.length}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-muted-foreground">Gaps</span>
              </div>
              <span className="text-xl font-bold text-orange-400">
                {results.gaps.length}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Globe2 className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">Frameworks</span>
              </div>
              <span className="text-xl font-bold text-blue-400">
                {results.frameworkAlignment.filter(f => f.alignment !== 'none').length}
              </span>
            </div>
          </div>

          {/* Analysis Mode Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className={cn(
              analysisMode === 'ai' 
                ? 'bg-primary/10 text-primary border-primary/30' 
                : 'bg-muted'
            )}>
              {analysisMode === 'ai' ? '🤖 AI Analysis' : '⚡ Quick Analysis'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(results.analyzedAt).toLocaleString()}
            </span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="matches" className="text-xs">
                Matched ({results.matches.length})
              </TabsTrigger>
              <TabsTrigger value="gaps" className="text-xs">
                Gaps ({results.gaps.length})
              </TabsTrigger>
              <TabsTrigger value="frameworks" className="text-xs">
                Frameworks
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">
                Insights
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4">
              <TabsContent value="matches" className="mt-0 space-y-3">
                {results.matches.map((match, idx) => (
                  <MatchedPrincipleCard key={match.principleId || idx} match={match} />
                ))}
                {results.matches.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No strong principle matches found.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="gaps" className="mt-0 space-y-3">
                {results.gaps.map((gap, idx) => (
                  <GapCard key={gap.principleId || idx} gap={gap} />
                ))}
                {results.gaps.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-400" />
                    <p>No significant gaps identified!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="frameworks" className="mt-0 space-y-3">
                {results.frameworkAlignment.map((fa, idx) => (
                  <FrameworkAlignmentCard key={fa.framework?.id || idx} alignment={fa} />
                ))}
              </TabsContent>

              <TabsContent value="insights" className="mt-0 space-y-3">
                {results.insights.map((insight, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}

function MatchedPrincipleCard({ match }: { match: PrincipleMatch }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="rounded-lg border border-border/50 bg-card/30 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-muted">
            {PRINCIPLE_ICONS[match.principleId] || <CheckCircle2 className="h-4 w-4" />}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">
              {match.principle?.name || match.principleId}
            </p>
            <p className="text-xs text-muted-foreground">
              {match.matchedConcepts?.slice(0, 3).join(', ')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "px-2 py-0.5 rounded-full text-sm font-bold",
            getScoreBg(match.score)
          )}>
            <span className={getScoreColor(match.score)}>{match.score}%</span>
          </div>
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            expanded && "rotate-90"
          )} />
        </div>
      </button>
      
      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          <Separator />
          <p className="text-sm text-muted-foreground">{match.reasoning}</p>
          
          <div className="flex flex-wrap gap-1.5">
            {match.suggestedLayers?.map(layer => (
              <Badge key={layer} variant="outline" className="text-xs">
                Layer {layer}
              </Badge>
            ))}
          </div>
          
          {match.relatedFrameworks && match.relatedFrameworks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {match.relatedFrameworks.slice(0, 3).map((rf, idx) => (
                <Badge 
                  key={idx}
                  variant="secondary"
                  className="text-xs"
                >
                  {rf.framework?.shortName || rf.framework?.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GapCard({ gap }: { gap: GapAnalysis }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/30 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {PRINCIPLE_ICONS[gap.principleId] || <AlertTriangle className="h-4 w-4" />}
          <span className="text-sm font-medium">
            {gap.principle?.name || gap.principleId}
          </span>
        </div>
        <Badge className={getSeverityColor(gap.severity)}>
          {gap.severity}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
      
      {gap.suggestedContent && (
        <div className="p-2 rounded bg-muted/30 text-xs text-muted-foreground">
          💡 {gap.suggestedContent}
        </div>
      )}
    </div>
  );
}

function FrameworkAlignmentCard({ alignment }: { alignment: FrameworkAlignment }) {
  const framework = alignment.framework || 
    AI_GOVERNANCE_FRAMEWORKS.find(f => f.id === (alignment as unknown as { frameworkId: string }).frameworkId);
  
  if (!framework) return null;
  
  return (
    <div className="rounded-lg border border-border/50 bg-card/30 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{framework.emoji}</span>
          <div>
            <p className="text-sm font-medium">{framework.shortName}</p>
            <p className="text-xs text-muted-foreground">{framework.organization}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getAlignmentColor(alignment.alignment)}>
            {alignment.alignment}
          </Badge>
          <span className={cn("text-sm font-bold", getScoreColor(alignment.score))}>
            {alignment.score}%
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={getFrameworkStatusColor(framework.status)}>
          {framework.status}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {framework.region.toUpperCase()} • {framework.type}
        </span>
      </div>
      
      {alignment.relevantArticles && alignment.relevantArticles.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {alignment.relevantArticles.slice(0, 4).map((article, idx) => (
            <span key={idx} className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              {article}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default OECDInsightMatcher;
