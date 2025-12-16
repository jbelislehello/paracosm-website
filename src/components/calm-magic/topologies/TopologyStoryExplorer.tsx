import { useState, useEffect } from 'react';
import { TopologyStory } from '@/hooks/useTopologyInsight';
import { StoryChapter } from './StoryChapter';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Lightbulb,
  MessageCircleQuestion,
  Save,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopologyStoryExplorerProps {
  story: TopologyStory | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
  onSaveToJournal?: (content: string) => void;
}

export function TopologyStoryExplorer({ 
  story, 
  isLoading, 
  error, 
  onRegenerate,
  onSaveToJournal
}: TopologyStoryExplorerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [revealedChapters, setRevealedChapters] = useState<Set<number>>(new Set());
  const [showRevelation, setShowRevelation] = useState(false);

  // Reset revealed chapters when story changes
  useEffect(() => {
    setRevealedChapters(new Set());
    setShowRevelation(false);
  }, [story?.viewMode, story?.opening_mystery]);

  const handleRevealChapter = (index: number) => {
    setRevealedChapters(prev => new Set([...prev, index]));
    
    // If all chapters revealed, unlock the key revelation
    if (story && revealedChapters.size + 1 >= story.chapters.length) {
      setTimeout(() => setShowRevelation(true), 600);
    }
  };

  const allChaptersRevealed = story ? revealedChapters.size >= story.chapters.length : false;

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
      <div className="px-4 py-5 bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium">Uncovering hidden mysteries...</p>
            <p className="text-xs text-muted-foreground">Reading the patterns of your journey</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
          <div className="h-4 bg-muted/30 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted/20 rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="px-4 py-5 bg-muted/20 border border-border/50 rounded-lg text-center">
        <BookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm font-medium text-muted-foreground">
          Begin your journey to unlock hidden stories
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Each topology view reveals different mysteries about your exploration
        </p>
      </div>
    );
  }

  const progress = story.chapters.length > 0 
    ? Math.round((revealedChapters.size / story.chapters.length) * 100) 
    : 0;

  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold block">{story.storyTitle}</span>
            <span className="text-xs text-muted-foreground">{story.mysteryType}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">
              {revealedChapters.size}/{story.chapters.length} discovered
            </span>
            <div className="w-16 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
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
        isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 space-y-4">
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

          {/* Key Revelation (locked until all chapters revealed) */}
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

          {/* Stats & Actions */}
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
      </div>
    </div>
  );
}
