import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Filter, 
  Flower2,
  Lightbulb,
  PenTool,
  Gem,
  Music,
  Loader2,
  X,
  ChevronRight,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
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

interface FragmentBrowserProps {
  currentSeason: Season;
  onEntrySelect?: (entry: FragmentEntry) => void;
  onPushToPrd?: (entry: FragmentEntry) => void;
  showAllSeasons?: boolean;
}

const SEASON_ICONS: Record<Season, React.ReactNode> = {
  POLLENS: <Flower2 className="h-3.5 w-3.5" />,
  NOEMS: <Lightbulb className="h-3.5 w-3.5" />,
  POEMS: <PenTool className="h-3.5 w-3.5" />,
  TOTEMS: <Gem className="h-3.5 w-3.5" />,
  ANTHEMS: <Music className="h-3.5 w-3.5" />,
};

const SEASON_COLORS: Record<Season, string> = {
  POLLENS: 'text-chart-1 border-chart-1/50',
  NOEMS: 'text-chart-2 border-chart-2/50',
  POEMS: 'text-chart-3 border-chart-3/50',
  TOTEMS: 'text-chart-4 border-chart-4/50',
  ANTHEMS: 'text-chart-5 border-chart-5/50',
};

export const FragmentBrowser: React.FC<FragmentBrowserProps> = ({ 
  currentSeason, 
  onEntrySelect,
  onPushToPrd,
  showAllSeasons = false
}) => {
  const [entries, setEntries] = useState<FragmentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'current' | 'all'>(showAllSeasons ? 'all' : 'current');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchEntries();
  }, [currentSeason, viewMode]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      let query = supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      // Filter by current season if not viewing all
      if (viewMode === 'current') {
        query = query.or(`season_context.eq.${currentSeason},tags.cs.{${currentSeason}}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Failed to fetch fragments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      if (seasonFilter !== 'all') {
        const entrySeason = entry.season_context || entry.tags?.find(t => 
          ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'].includes(t)
        );
        if (entrySeason !== seasonFilter) return false;
      }
      
      if (typeFilter !== 'all' && entry.fragment_type !== typeFilter) {
        return false;
      }
      
      return true;
    });
  }, [entries, seasonFilter, typeFilter]);

  const getEntrySeason = (entry: FragmentEntry): Season | null => {
    if (entry.season_context) return entry.season_context as Season;
    const seasonTag = entry.tags?.find(t => 
      ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'].includes(t)
    );
    return seasonTag as Season || null;
  };

  const clearFilters = () => {
    setSeasonFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilters = seasonFilter !== 'all' || typeFilter !== 'all';

  // Dynamic title based on view mode
  const browserTitle = viewMode === 'current' 
    ? `${SEASON_LABELS[currentSeason]} Fragments`
    : 'All Fragments';

  return (
    <Card className="h-full flex flex-col bg-background/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            {viewMode === 'current' ? SEASON_ICONS[currentSeason] : <Sparkles className="h-4 w-4 text-primary" />}
            {browserTitle}
            {entries.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filteredEntries.length}
              </Badge>
            )}
          </span>
        </CardTitle>

        {/* View Mode Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'current' | 'all')} className="mt-2">
          <TabsList className="h-7 w-full">
            <TabsTrigger value="current" className="text-xs flex-1">
              {SEASON_LABELS[currentSeason]}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs flex-1">
              All Seasons
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 space-y-3">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {viewMode === 'all' && (
            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
              <SelectTrigger className="w-[120px] h-7 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                {Object.entries(SEASON_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[100px] h-7 text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="quote">Quote</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="voice">Voice</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Entries List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8 flex-1">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground flex-1 flex items-center justify-center">
            {entries.length === 0 
              ? `No ${SEASON_LABELS[currentSeason].toLowerCase()} captured yet. Start exploring tiles!`
              : "No entries match your filters."}
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-2">
              {filteredEntries.map(entry => {
                const entrySeason = getEntrySeason(entry);
                const isExpanded = expandedId === entry.id;
                
                return (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap gap-1">
                        {entrySeason && viewMode === 'all' && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs flex items-center gap-1 ${SEASON_COLORS[entrySeason]}`}
                          >
                            {SEASON_ICONS[entrySeason]}
                            {SEASON_LABELS[entrySeason]}
                          </Badge>
                        )}
                        {entry.tile_id && (
                          <Badge variant="secondary" className="text-xs">
                            Tile {entry.tile_id}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(entry.created_at), 'MMM d')}
                      </span>
                    </div>
                    
                    <p className={`text-sm text-foreground/80 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {entry.content}
                    </p>
                    
                    {isExpanded && (
                      <div className="flex gap-2 mt-3 pt-2 border-t border-border/30">
                        {onEntrySelect && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEntrySelect(entry);
                            }}
                          >
                            <ChevronRight className="h-3 w-3 mr-1" />
                            Use
                          </Button>
                        )}
                        {onPushToPrd && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPushToPrd(entry);
                            }}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Push to PRD
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchEntries}
          disabled={isLoading}
          className="w-full text-xs h-7 shrink-0"
        >
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};

export default FragmentBrowser;
