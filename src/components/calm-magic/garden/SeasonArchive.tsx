import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flower2, Lightbulb, BookOpen, Gem, Music, ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import SearchFilterToolbar, { SearchFilters } from './SearchFilterToolbar';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface PolenEntry {
  id: string;
  content: string;
  season_context: string | null;
  tile_id: number | null;
  created_at: string;
  tags: string[] | null;
  fragment_type: string;
}

interface SeasonArchiveProps {
  seasonCounts: Record<Season, number>;
  className?: string;
  initialDateFilter?: Date;
  initialTagFilter?: string[];
  onFilterChange?: (filters: SearchFilters) => void;
}

const SEASON_CONFIG: Record<Season, {
  icon: typeof Flower2;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}> = {
  POLLENS: {
    icon: Flower2,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    description: 'Raw signals and aspirations gathered from your exploration'
  },
  NOEMS: {
    icon: Lightbulb,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    description: 'Conceptual insights crystallized from patterns'
  },
  POEMS: {
    icon: BookOpen,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    description: 'Experiential designs mapping People, Objects, Environments, Messages, Systems'
  },
  TOTEMS: {
    icon: Gem,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'Technical architecture and system structures'
  },
  ANTHEMS: {
    icon: Music,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Brand narratives and market positioning stories'
  },
};

const SEASON_ORDER: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const SeasonArchive = ({ seasonCounts, className, initialDateFilter, initialTagFilter, onFilterChange }: SeasonArchiveProps) => {
  const navigate = useNavigate();
  const [allEntries, setAllEntries] = useState<PolenEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: initialTagFilter || [],
    dateRange: initialDateFilter ? { from: initialDateFilter, to: initialDateFilter } : undefined
  });

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        const { data: entries, error } = await supabase
          .from('polen_entries')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false });

        if (error || !entries) {
          console.error('Error fetching entries:', error);
          return;
        }

        setAllEntries(entries);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Update date filter when initialDateFilter changes
  useEffect(() => {
    if (initialDateFilter) {
      setFilters(prev => ({
        ...prev,
        dateRange: { from: initialDateFilter, to: initialDateFilter }
      }));
    }
  }, [initialDateFilter]);

  // Update tags when initialTagFilter changes (from TagCloud clicks)
  useEffect(() => {
    if (initialTagFilter && JSON.stringify(initialTagFilter) !== JSON.stringify(filters.tags)) {
      setFilters(prev => ({
        ...prev,
        tags: initialTagFilter
      }));
    }
  }, [initialTagFilter]);

  // Extract all unique tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    allEntries.forEach(entry => {
      entry.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allEntries]);

  // Apply filters
  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      // Content search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (!entry.content.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Tag filter
      if (filters.tags.length > 0) {
        if (!entry.tags || !filters.tags.some(tag => entry.tags?.includes(tag))) {
          return false;
        }
      }

      // Date filter
      if (filters.dateRange?.from) {
        const entryDate = new Date(entry.created_at);
        const start = startOfDay(filters.dateRange.from);
        const end = filters.dateRange.to ? endOfDay(filters.dateRange.to) : endOfDay(filters.dateRange.from);
        if (!isWithinInterval(entryDate, { start, end })) {
          return false;
        }
      }

      return true;
    });
  }, [allEntries, filters]);

  // Group filtered entries by season
  const entriesBySeason = useMemo(() => {
    const grouped: Record<Season, PolenEntry[]> = {
      POLLENS: [],
      NOEMS: [],
      POEMS: [],
      TOTEMS: [],
      ANTHEMS: [],
    };

    filteredEntries.forEach(entry => {
      const season = entry.season_context as Season;
      if (season && grouped[season]) {
        grouped[season].push(entry);
      }
    });

    return grouped;
  }, [filteredEntries]);

  // Get filtered counts
  const filteredCounts = useMemo(() => {
    return SEASON_ORDER.reduce((acc, season) => {
      acc[season] = entriesBySeason[season].length;
      return acc;
    }, {} as Record<Season, number>);
  }, [entriesBySeason]);

  const totalCount = allEntries.length;
  const filteredCount = filteredEntries.length;

  const handleBrowseInBoard = (season: Season) => {
    navigate(`/calm-magic-board?season=${season}`);
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Season Archive</h3>
        <p className="text-sm text-muted-foreground">
          Explore your captured fragments organized by season
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <SearchFilterToolbar
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          onFilterChange?.(newFilters);
        }}
        availableTags={availableTags}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />

      <Accordion type="single" collapsible className="space-y-3">
        {SEASON_ORDER.map((season) => {
          const config = SEASON_CONFIG[season];
          const Icon = config.icon;
          const entries = entriesBySeason[season];
          const originalCount = seasonCounts[season] || 0;
          const count = filteredCounts[season];
          const isFiltered = count !== originalCount;

          return (
            <AccordionItem 
              key={season} 
              value={season}
              className={cn(
                "border rounded-xl overflow-hidden",
                config.borderColor,
                config.bgColor
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    config.bgColor,
                    "border",
                    config.borderColor
                  )}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-semibold", config.color)}>
                        {season}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {isFiltered ? (
                          <span>{count} / {originalCount}</span>
                        ) : (
                          <span>{count} {count === 1 ? 'fragment' : 'fragments'}</span>
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {config.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                {loading ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Loading...
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    {isFiltered ? 'No matching fragments' : 'No fragments captured yet in this season'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Preview of recent entries */}
                    <ScrollArea className="max-h-64">
                      <div className="space-y-2">
                        {entries.slice(0, 5).map((entry) => (
                          <div 
                            key={entry.id}
                            className="p-3 rounded-lg bg-background/50 border border-border/50"
                          >
                            <p className="text-sm leading-relaxed">
                              {truncateContent(entry.content)}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
                              {entry.tile_id && (
                                <span className="text-muted-foreground/60">
                                  • Tile {entry.tile_id}
                                </span>
                              )}
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="flex gap-1 ml-auto">
                                  {entry.tags.slice(0, 2).map(tag => (
                                    <Badge 
                                      key={tag} 
                                      variant="outline" 
                                      className="text-[10px] px-1.5 py-0"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {entries.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{entries.length - 5} more fragments
                      </p>
                    )}

                    {/* Browse in Board button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleBrowseInBoard(season)}
                    >
                      Browse in Board
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default SeasonArchive;
