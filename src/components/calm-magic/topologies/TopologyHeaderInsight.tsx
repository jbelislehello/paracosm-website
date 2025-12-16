import { TopologyStory } from '@/hooks/useTopologyInsight';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronDown, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopologyHeaderInsightProps {
  story: TopologyStory | null;
  isLoading: boolean;
  onScrollToDetails: () => void;
}

export function TopologyHeaderInsight({
  story,
  isLoading,
  onScrollToDetails
}: TopologyHeaderInsightProps) {
  if (isLoading) {
    return (
      <div className="p-4 bg-gradient-to-r from-primary/5 via-violet-500/5 to-pink-500/5 rounded-lg border border-primary/20 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-primary/20 rounded w-3/4" />
            <div className="h-3 bg-primary/10 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!story) return null;

  // Get the most important insight to show
  const concreteAction = story.concreteInsight?.actionableInsight;
  const wonderOpening = story.wonderInsight?.opening_wonder;
  const tileInsight = story.wonderInsight?.tile_position_meaning;

  const primaryInsight = concreteAction || wonderOpening || story.opening_mystery;
  const secondaryInsight = tileInsight || story.concreteInsight?.dailyQuestion;

  if (!primaryInsight) return null;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-primary/10 via-violet-500/10 to-pink-500/10 rounded-lg border border-primary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            concreteAction 
              ? "bg-gradient-to-br from-amber-500/30 to-orange-500/30 text-amber-500" 
              : "bg-gradient-to-br from-violet-500/30 to-primary/30 text-primary"
          )}>
            {concreteAction ? (
              <Target className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-primary/10 border-primary/30">
              {concreteAction ? "Today's Action" : "✨ Insight"}
            </Badge>
            {story.stats && (
              <span className="text-[10px] text-muted-foreground">
                {story.stats.coverage}% explored • Ring {story.stats.currentRing}
              </span>
            )}
          </div>
          
          <p className="text-sm font-medium text-foreground leading-relaxed mb-1">
            {primaryInsight}
          </p>
          
          {secondaryInsight && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {secondaryInsight}
            </p>
          )}
        </div>

        {/* CTA */}
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1 text-xs"
          onClick={onScrollToDetails}
        >
          <span className="hidden sm:inline">More</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
