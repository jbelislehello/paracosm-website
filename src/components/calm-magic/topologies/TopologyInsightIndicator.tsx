import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TopologyStory } from '@/hooks/useTopologyInsight';

interface TopologyInsightIndicatorProps {
  story: TopologyStory | null;
  isVisible: boolean;
  onNavigateToTopologies: () => void;
  onDismiss: () => void;
}

export function TopologyInsightIndicator({
  story,
  isVisible,
  onNavigateToTopologies,
  onDismiss
}: TopologyInsightIndicatorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when new story arrives
  useEffect(() => {
    if (story) {
      setDismissed(false);
    }
  }, [story?.storyTitle]);

  if (!isVisible || !story || dismissed) return null;

  const insightCount = (story.chapters?.length || 0) + 
    (story.concreteInsight ? 1 : 0) + 
    (story.wonderInsight ? 1 : 0);

  const previewText = story.wonderInsight?.opening_wonder || 
    story.concreteInsight?.actionableInsight || 
    story.opening_mystery || 
    'Your topology secrets are ready';

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    onDismiss();
  };

  return (
    <div 
      className={cn(
        "fixed bottom-24 right-6 z-50 max-w-sm transition-all duration-300",
        isHovered ? "scale-105" : "scale-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-primary/30 blur-xl rounded-lg" />
        
        {/* Main card */}
        <div 
          className={cn(
            "relative bg-background/95 backdrop-blur border border-primary/30 rounded-lg shadow-lg overflow-hidden cursor-pointer",
            "hover:border-primary/50 transition-colors"
          )}
          onClick={onNavigateToTopologies}
        >
          {/* Dismiss button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 z-10 opacity-60 hover:opacity-100"
            onClick={handleDismiss}
          >
            <X className="w-3 h-3" />
          </Button>

          {/* Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-violet-600/20 to-primary/20 border-b border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Topology Insights Ready
              </span>
              <Badge variant="secondary" className="text-xs h-5 px-1.5">
                {insightCount}
              </Badge>
            </div>
          </div>

          {/* Preview content */}
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {previewText.length > 100 ? previewText.slice(0, 100) + '...' : previewText}
            </p>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <span>View in Topologies</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
