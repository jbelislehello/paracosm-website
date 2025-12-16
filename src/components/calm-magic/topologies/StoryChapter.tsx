import { useState } from 'react';
import { StoryChapter as StoryChapterType } from '@/hooks/useTopologyInsight';
import { Button } from '@/components/ui/button';
import { Eye, Sparkles, AlertTriangle, TrendingUp, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoryChapterProps {
  chapter: StoryChapterType;
  index: number;
  isRevealed: boolean;
  onReveal: () => void;
  isLast?: boolean;
}

const DISCOVERY_ICONS = {
  pattern: Compass,
  strength: TrendingUp,
  shadow: AlertTriangle,
  gap: Eye
};

const DISCOVERY_COLORS = {
  pattern: 'from-primary/20 to-primary/5 border-primary/30',
  strength: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
  shadow: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  gap: 'from-violet-500/20 to-violet-500/5 border-violet-500/30'
};

export function StoryChapter({ 
  chapter, 
  index, 
  isRevealed, 
  onReveal,
  isLast = false 
}: StoryChapterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const Icon = DISCOVERY_ICONS[chapter.discovery_type] || Sparkles;
  const colorClass = DISCOVERY_COLORS[chapter.discovery_type] || DISCOVERY_COLORS.pattern;

  const handleReveal = () => {
    setIsAnimating(true);
    onReveal();
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!isRevealed) {
    return (
      <div className="relative">
        <div className={cn(
          "p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10",
          "flex items-center justify-between gap-3",
          "hover:bg-muted/20 transition-colors"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-xs font-medium text-muted-foreground">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {chapter.title}
              </p>
              <p className="text-xs text-muted-foreground/60">
                Hidden discovery awaits...
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReveal}
            className="gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Reveal
          </Button>
        </div>
        {!isLast && (
          <div className="absolute left-[23px] top-full h-4 w-px bg-border" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={cn(
        "p-4 rounded-lg border bg-gradient-to-br",
        colorClass,
        isAnimating && "animate-scale-in"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
            "bg-background/80 shadow-sm"
          )}>
            <Icon className="w-3.5 h-3.5 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="text-sm font-semibold text-foreground">
                {chapter.title}
              </h4>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {chapter.discovery_type}
              </span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {chapter.content}
            </p>
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="absolute left-[23px] top-full h-4 w-px bg-primary/30" />
      )}
    </div>
  );
}
