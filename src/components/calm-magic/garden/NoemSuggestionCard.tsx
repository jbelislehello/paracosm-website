import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, ChevronDown, Check, Loader2 } from 'lucide-react';
import { ClusterSuggestion, Fragment } from '@/hooks/useSemanticClustering';
import { cn } from '@/lib/utils';

interface NoemSuggestionCardProps {
  cluster: ClusterSuggestion;
  fragments: Fragment[];
  onCrystallize: (cluster: ClusterSuggestion) => Promise<boolean>;
  isCrystallized: boolean;
}

export function NoemSuggestionCard({ 
  cluster, 
  fragments, 
  onCrystallize,
  isCrystallized 
}: NoemSuggestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const clusterFragments = fragments.filter(f => cluster.fragmentIds.includes(f.id));
  const confidencePercent = Math.round(cluster.confidence * 100);

  const handleCrystallize = async () => {
    setIsLoading(true);
    const success = await onCrystallize(cluster);
    setIsLoading(false);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300",
      isCrystallized && "border-primary/50 bg-primary/5",
      showSuccess && "animate-pulse border-primary"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {cluster.theme}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {clusterFragments.length} fragments
            </p>
          </div>
          
          {isCrystallized ? (
            <Badge variant="secondary" className="shrink-0 bg-primary/20 text-primary">
              <Check className="h-3 w-3 mr-1" />
              Crystallized
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={handleCrystallize}
              disabled={isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Crystallize
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Insight */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          {cluster.insight}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1">
          {cluster.keywords.map((keyword, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>

        {/* Confidence */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Confidence</span>
            <span>{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className="h-1.5" />
        </div>

        {/* Expandable fragments preview */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between px-0 h-7">
              <span className="text-xs text-muted-foreground">
                Preview fragments
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {clusterFragments.slice(0, 5).map((fragment) => (
              <div 
                key={fragment.id}
                className="text-xs p-2 rounded bg-muted/50 border border-border/50"
              >
                <p className="line-clamp-2 text-foreground/70">
                  {fragment.content}
                </p>
                {fragment.season_context && (
                  <Badge variant="secondary" className="mt-1 text-[10px] h-4">
                    {fragment.season_context}
                  </Badge>
                )}
              </div>
            ))}
            {clusterFragments.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                +{clusterFragments.length - 5} more fragments
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
