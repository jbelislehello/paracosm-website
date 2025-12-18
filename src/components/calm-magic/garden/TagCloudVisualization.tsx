import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagCount {
  tag: string;
  count: number;
}

interface TagCloudVisualizationProps {
  onTagSelect: (tags: string[]) => void;
  selectedTags: string[];
  className?: string;
}

// Season tags get special colors
const SEASON_COLORS: Record<string, string> = {
  POLLENS: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 hover:bg-rose-500/30',
  NOEMS: 'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/40 hover:bg-violet-500/30',
  POEMS: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30',
  TOTEMS: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30',
  ANTHEMS: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
};

const TagCloudVisualization = ({ onTagSelect, selectedTags, className }: TagCloudVisualizationProps) => {
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        const { data: entries, error } = await supabase
          .from('polen_entries')
          .select('tags')
          .eq('user_id', userData.user.id);

        if (error || !entries) {
          console.error('Error fetching tags:', error);
          return;
        }

        // Count tag frequencies
        const counts: Record<string, number> = {};
        entries.forEach(entry => {
          entry.tags?.forEach((tag: string) => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        });

        // Convert to array and sort by count
        const tagArray = Object.entries(counts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count);

        setTagCounts(tagArray);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Calculate font size based on frequency (log scale for balance)
  const getFontSize = (count: number, maxCount: number, minCount: number) => {
    if (maxCount === minCount) return 1;
    const normalized = (Math.log(count) - Math.log(minCount)) / (Math.log(maxCount) - Math.log(minCount));
    return 0.75 + normalized * 0.75; // Range from 0.75rem to 1.5rem
  };

  const { maxCount, minCount } = useMemo(() => {
    if (tagCounts.length === 0) return { maxCount: 1, minCount: 1 };
    return {
      maxCount: Math.max(...tagCounts.map(t => t.count)),
      minCount: Math.min(...tagCounts.map(t => t.count))
    };
  }, [tagCounts]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };

  const clearSelection = () => {
    onTagSelect([]);
  };

  const getTagStyle = (tag: string) => {
    const seasonColor = SEASON_COLORS[tag];
    if (seasonColor) return seasonColor;
    return 'bg-muted/50 text-muted-foreground border-border hover:bg-muted';
  };

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Tag Cloud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-muted/30 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (tagCounts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Tag Cloud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No tags found in your fragments yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Tag Cloud
            <Badge variant="secondary" className="text-xs">
              {tagCounts.length} tags
            </Badge>
          </CardTitle>
          {selectedTags.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearSelection}
              className="h-7 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear ({selectedTags.length})
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Click tags to filter the archive • Larger = more frequent
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-center">
          {tagCounts.map(({ tag, count }) => {
            const fontSize = getFontSize(count, maxCount, minCount);
            const isSelected = selectedTags.includes(tag);
            
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-2 py-1 rounded-full border transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  getTagStyle(tag),
                  isSelected && "ring-2 ring-primary shadow-md scale-105"
                )}
                style={{ fontSize: `${fontSize}rem` }}
                title={`${tag}: ${count} fragments`}
              >
                {tag}
                <span className="ml-1 opacity-60 text-[0.7em]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagCloudVisualization;
