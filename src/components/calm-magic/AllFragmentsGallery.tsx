import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { 
  X, 
  Search, 
  Flower2, 
  Lightbulb, 
  PenTool, 
  Gem, 
  Music,
  Loader2,
  Calendar,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Season, SEASON_LABELS } from '@/utils/prdAccessLevel';

interface FragmentEntry {
  id: string;
  content: string;
  tags: string[] | null;
  tile_id: number | null;
  created_at: string;
  season_context: string | null;
  fragment_type: string;
}

interface AllFragmentsGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

const SEASON_CONFIG: Record<Season, { icon: React.ElementType; color: string; bgColor: string }> = {
  POLLENS: { icon: Flower2, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
  NOEMS: { icon: Lightbulb, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
  POEMS: { icon: PenTool, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
  TOTEMS: { icon: Gem, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  ANTHEMS: { icon: Music, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
};

export const AllFragmentsGallery: React.FC<AllFragmentsGalleryProps> = ({
  isOpen,
  onClose,
  projectId
}) => {
  const [entries, setEntries] = useState<FragmentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (isOpen) {
      fetchAllFragments();
    }
  }, [isOpen, projectId]);

  const fetchAllFragments = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Failed to fetch fragments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEntrySeason = (entry: FragmentEntry): Season | null => {
    if (entry.season_context) return entry.season_context as Season;
    const seasonTag = entry.tags?.find(t => 
      ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'].includes(t)
    );
    return seasonTag as Season || null;
  };

  const filteredEntries = useMemo(() => {
    let filtered = entries;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.content.toLowerCase().includes(query) ||
        entry.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    // Season filter
    if (seasonFilter !== 'all') {
      filtered = filtered.filter(entry => getEntrySeason(entry) === seasonFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [entries, searchQuery, seasonFilter, sortOrder]);

  // Group by season for stats
  const seasonStats = useMemo(() => {
    const stats: Record<Season, number> = {
      POLLENS: 0,
      NOEMS: 0,
      POEMS: 0,
      TOTEMS: 0,
      ANTHEMS: 0,
    };
    
    entries.forEach(entry => {
      const season = getEntrySeason(entry);
      if (season) {
        stats[season]++;
      }
    });
    
    return stats;
  }, [entries]);

  // Group by date for timeline
  const groupedByDate = useMemo(() => {
    const groups: Record<string, FragmentEntry[]> = {};
    
    filteredEntries.forEach(entry => {
      const dateKey = format(parseISO(entry.created_at), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    
    return groups;
  }, [filteredEntries]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-primary" />
              All Fragments Gallery
              <Badge variant="secondary">{entries.length} total</Badge>
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>

          {/* Season Stats */}
          <div className="flex flex-wrap gap-2 mt-3">
            {(Object.entries(SEASON_CONFIG) as [Season, typeof SEASON_CONFIG[Season]][]).map(([season, config]) => {
              const Icon = config.icon;
              const count = seasonStats[season];
              return (
                <Badge 
                  key={season}
                  variant="outline" 
                  className={cn(
                    "cursor-pointer transition-all",
                    seasonFilter === season ? config.bgColor : "hover:bg-muted",
                    config.color
                  )}
                  onClick={() => setSeasonFilter(seasonFilter === season ? 'all' : season)}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {SEASON_LABELS[season]}: {count}
                </Badge>
              );
            })}
          </div>
        </DialogHeader>

        {/* Filters Bar */}
        <div className="px-6 py-3 border-b flex flex-wrap gap-3 items-center shrink-0 bg-muted/30">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fragments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <Select value={seasonFilter} onValueChange={setSeasonFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons</SelectItem>
              {Object.entries(SEASON_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          >
            {sortOrder === 'newest' ? (
              <SortDesc className="w-4 h-4 mr-1" />
            ) : (
              <SortAsc className="w-4 h-4 mr-1" />
            )}
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {entries.length === 0 ? (
                <>
                  <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No fragments captured yet.</p>
                  <p className="text-sm">Start exploring tiles to collect fragments!</p>
                </>
              ) : (
                <>
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No fragments match your search.</p>
                </>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntries.map(entry => {
                const season = getEntrySeason(entry);
                const config = season ? SEASON_CONFIG[season] : null;
                const Icon = config?.icon || Flower2;

                return (
                  <Card 
                    key={entry.id}
                    className={cn(
                      "p-4 hover:shadow-md transition-shadow cursor-pointer",
                      config?.bgColor
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {season && (
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", config?.color)}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {SEASON_LABELS[season]}
                          </Badge>
                        )}
                        {entry.tile_id && (
                          <Badge variant="secondary" className="text-xs">
                            Tile {entry.tile_id}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(entry.created_at), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-4 text-foreground/80">
                      {entry.content}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {entry.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{entry.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Timeline/List View */
            <div className="space-y-6">
              {Object.entries(groupedByDate).map(([dateKey, dateEntries]) => (
                <div key={dateKey}>
                  <div className="flex items-center gap-2 mb-3 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {format(parseISO(dateKey), 'EEEE, MMMM d, yyyy')}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {dateEntries.length}
                    </Badge>
                  </div>
                  <div className="space-y-2 pl-6 border-l border-border">
                    {dateEntries.map(entry => {
                      const season = getEntrySeason(entry);
                      const config = season ? SEASON_CONFIG[season] : null;
                      const Icon = config?.icon || Flower2;

                      return (
                        <div 
                          key={entry.id}
                          className="relative pl-4 pb-3"
                        >
                          <div className={cn(
                            "absolute -left-[9px] w-4 h-4 rounded-full border-2 border-background",
                            config?.bgColor || 'bg-muted'
                          )} />
                          <div className="flex items-start gap-3">
                            <span className="text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                              {format(parseISO(entry.created_at), 'HH:mm')}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {season && (
                                  <Badge 
                                    variant="outline" 
                                    className={cn("text-xs", config?.color)}
                                  >
                                    <Icon className="w-3 h-3 mr-1" />
                                    {SEASON_LABELS[season]}
                                  </Badge>
                                )}
                                {entry.tile_id && (
                                  <Badge variant="secondary" className="text-xs">
                                    Tile {entry.tile_id}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-foreground/80">
                                {entry.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AllFragmentsGallery;
