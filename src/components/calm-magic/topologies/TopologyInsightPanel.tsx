import { useState } from 'react';
import { TopologyInsight } from '@/hooks/useTopologyInsight';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopologyInsightPanelProps {
  insight: TopologyInsight | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

export function TopologyInsightPanel({ 
  insight, 
  isLoading, 
  error, 
  onRegenerate 
}: TopologyInsightPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (error) {
    return (
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
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-4 bg-muted/30 border border-border rounded-lg animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Interpreting your journey...</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="px-4 py-3 bg-muted/20 border border-border/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Start your journey to unlock insights about your exploration patterns
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Journey Insight</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 space-y-4">
          {/* Metaphor - Most prominent */}
          <div className="relative">
            <p className="text-base font-medium leading-relaxed text-foreground italic">
              "{insight.metaphor}"
            </p>
          </div>

          {/* Insight */}
          <div className="pl-3 border-l-2 border-primary/30">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.insight}
            </p>
          </div>

          {/* Question */}
          <div className="flex gap-2 p-3 bg-muted/30 rounded-lg">
            <MessageCircleQuestion className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80">
              {insight.question}
            </p>
          </div>

          {/* Recommendation (if present) */}
          {insight.recommendation && (
            <p className="text-xs text-muted-foreground pl-3">
              💡 {insight.recommendation}
            </p>
          )}

          {/* Stats summary */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{insight.stats.coverage}% explored</span>
              <span>Ring {insight.stats.currentRing}</span>
              <span>{insight.stats.pathLength} steps</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="h-7 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
