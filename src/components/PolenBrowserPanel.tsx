import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, Workflow, Sparkles, Gamepad2, Users, Search, 
  Filter, Calendar, MapPin, Tag, Loader2, FileText, Quote,
  Image, Mic, Link, Monitor, X
} from 'lucide-react';

type CompassType = 'narrative' | 'workflow' | 'inquiry' | 'playground' | 'human-dynamics' | 'general';
type FragmentType = 'text' | 'quote' | 'image' | 'voice' | 'screenshot' | 'link';

interface PolenEntry {
  id: string;
  content: string;
  tile_id: number | null;
  cycle_id: string | null;
  fragment_type: FragmentType;
  tags: string[];
  created_at: string;
  source_reference: string | null;
}

const COMPASS_OPTIONS: { id: CompassType; name: string; icon: React.ElementType; color: string }[] = [
  { id: 'narrative', name: 'Narrative', icon: BookOpen, color: 'bg-rose-500' },
  { id: 'workflow', name: 'Workflow', icon: Workflow, color: 'bg-blue-500' },
  { id: 'inquiry', name: 'Inquiry', icon: Sparkles, color: 'bg-amber-500' },
  { id: 'playground', name: 'Playground', icon: Gamepad2, color: 'bg-green-500' },
  { id: 'human-dynamics', name: 'Human Dynamics', icon: Users, color: 'bg-purple-500' },
  { id: 'general', name: 'General', icon: FileText, color: 'bg-gray-500' },
];

const FRAGMENT_ICONS: Record<FragmentType, React.ElementType> = {
  text: FileText,
  quote: Quote,
  image: Image,
  voice: Mic,
  screenshot: Monitor,
  link: Link,
};

const ROW_LABELS = ['M', 'A', 'G', 'I', 'C', 'N', 'S', 'P+A'];
const COL_LABELS = ['C', 'H', 'O', 'R', 'D', 'S', 'M', 'S'];

const getTileLabel = (tileId: number): string => {
  const row = Math.floor((tileId - 1) / 8);
  const col = (tileId - 1) % 8;
  return `${ROW_LABELS[row]}${COL_LABELS[col]}`;
};

const getTilePosition = (tileId: number): { row: number; col: number } => {
  const row = Math.floor((tileId - 1) / 8);
  const col = (tileId - 1) % 8;
  return { row, col };
};

interface PolenBrowserPanelProps {
  onClose?: () => void;
  onTileClick?: (row: number, col: number) => void;
}

const PolenBrowserPanel = ({ onClose, onTileClick }: PolenBrowserPanelProps) => {
  const [polenEntries, setPolenEntries] = useState<PolenEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompass, setSelectedCompass] = useState<CompassType | null>(null);
  const [selectedFragmentType, setSelectedFragmentType] = useState<FragmentType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        fetchPolenEntries();
      } else {
        setLoading(false);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        fetchPolenEntries();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPolenEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('polen_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolenEntries(data?.map(entry => ({
        ...entry,
        tags: entry.tags || [],
        fragment_type: entry.fragment_type as FragmentType
      })) || []);
    } catch (error) {
      console.error('Error fetching polen:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter entries
  const filteredEntries = polenEntries.filter(entry => {
    // Search filter
    if (searchQuery && !entry.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Compass filter (check tags)
    if (selectedCompass && !entry.tags.includes(selectedCompass)) {
      return false;
    }
    // Fragment type filter
    if (selectedFragmentType && entry.fragment_type !== selectedFragmentType) {
      return false;
    }
    return true;
  });

  // Group by tile
  const entriesByTile = filteredEntries.reduce((acc, entry) => {
    const tileKey = entry.tile_id ? getTileLabel(entry.tile_id) : 'Unassigned';
    if (!acc[tileKey]) acc[tileKey] = [];
    acc[tileKey].push(entry);
    return acc;
  }, {} as Record<string, PolenEntry[]>);

  // Get unique compasses used
  const usedCompasses = new Set<string>();
  polenEntries.forEach(entry => {
    entry.tags.forEach(tag => {
      if (COMPASS_OPTIONS.some(c => c.id === tag)) {
        usedCompasses.add(tag);
      }
    });
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCompass(null);
    setSelectedFragmentType(null);
  };

  const hasActiveFilters = searchQuery || selectedCompass || selectedFragmentType;

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">POLEN Browser</h3>
          <p className="text-muted-foreground text-sm">
            Log in to view your captured fragments across tiles.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-amber-500/30 bg-gradient-to-br from-background to-amber-500/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-lg">POLEN Browser</h3>
          <Badge variant="outline" className="text-amber-600 border-amber-500/30">
            {filteredEntries.length} fragments
          </Badge>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search fragments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Compass Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Compass:</span>
          {COMPASS_OPTIONS.map((compass) => {
            const Icon = compass.icon;
            const isActive = selectedCompass === compass.id;
            const hasEntries = usedCompasses.has(compass.id);
            return (
              <button
                key={compass.id}
                onClick={() => setSelectedCompass(isActive ? null : compass.id)}
                disabled={!hasEntries && !isActive}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                  isActive
                    ? `${compass.color} text-white`
                    : hasEntries
                      ? 'bg-muted hover:bg-muted/80'
                      : 'bg-muted/50 opacity-50 cursor-not-allowed'
                }`}
              >
                <Icon className="w-3 h-3" />
                {compass.name}
              </button>
            );
          })}
        </div>

        {/* Fragment Type Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Type:</span>
          {(Object.keys(FRAGMENT_ICONS) as FragmentType[]).map((type) => {
            const Icon = FRAGMENT_ICONS[type];
            const isActive = selectedFragmentType === type;
            const count = polenEntries.filter(e => e.fragment_type === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedFragmentType(isActive ? null : type)}
                disabled={count === 0 && !isActive}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : count > 0
                      ? 'bg-muted hover:bg-muted/80'
                      : 'bg-muted/50 opacity-50 cursor-not-allowed'
                }`}
              >
                <Icon className="w-3 h-3" />
                {type}
                {count > 0 && <span className="text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            <X className="w-3 h-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground text-sm">
            {hasActiveFilters 
              ? 'No fragments match your filters' 
              : 'No POLEN fragments captured yet'}
          </p>
          <p className="text-muted-foreground/70 text-xs mt-1">
            Visit tiles and capture your observations
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {Object.entries(entriesByTile).map(([tileLabel, entries]) => (
              <div key={tileLabel} className="space-y-2">
                {/* Tile Header */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (tileLabel !== 'Unassigned' && entries[0].tile_id) {
                        const pos = getTilePosition(entries[0].tile_id);
                        onTileClick?.(pos.row, pos.col);
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
                    disabled={tileLabel === 'Unassigned'}
                  >
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-xs font-bold">{tileLabel}</span>
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {entries.length} fragment{entries.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Entries */}
                <div className="space-y-2 pl-4 border-l-2 border-amber-500/20">
                  {entries.map((entry) => {
                    const FragmentIcon = FRAGMENT_ICONS[entry.fragment_type];
                    const compassTag = entry.tags.find(t => COMPASS_OPTIONS.some(c => c.id === t));
                    const compass = compassTag ? COMPASS_OPTIONS.find(c => c.id === compassTag) : null;
                    
                    return (
                      <div 
                        key={entry.id}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <FragmentIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{entry.content}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(entry.created_at).toLocaleDateString()}
                              </span>
                              {compass && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-[10px] ${compass.color} text-white border-transparent`}
                                >
                                  {compass.name}
                                </Badge>
                              )}
                              {entry.tags
                                .filter(t => !COMPASS_OPTIONS.some(c => c.id === t))
                                .map(tag => (
                                  <Badge 
                                    key={tag}
                                    variant="outline" 
                                    className="text-[10px]"
                                  >
                                    {tag}
                                  </Badge>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Stats Footer */}
      {filteredEntries.length > 0 && (
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {Object.keys(entriesByTile).length} tiles with fragments
          </span>
          <span>
            Total: {polenEntries.length} fragments collected
          </span>
        </div>
      )}
    </Card>
  );
};

export default PolenBrowserPanel;
