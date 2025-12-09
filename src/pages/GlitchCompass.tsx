import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Tile } from '@/types/glitch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, TrendingUp, Library } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import MinimalistTileMatrix from '@/components/MinimalistTileMatrix';
import TileDetailPanel from '@/components/TileDetailPanel';
import PolenBrowserPanel from '@/components/PolenBrowserPanel';
import { useTileMatrixPersistence } from '@/hooks/useTileMatrixPersistence';
import { CycleNumber } from '@/types/journal-expansion';

type CompassType = 'narrative' | 'workflow' | 'inquiry' | 'playground' | 'human-dynamics';

const GlitchCompass = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [todayTile, setTodayTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const [activeCompass, setActiveCompass] = useState<CompassType | null>(null);
  const [currentCycleNumber, setCurrentCycleNumber] = useState<CycleNumber>(1);
  const [showPolenBrowser, setShowPolenBrowser] = useState(false);
  const [currentZone, setCurrentZone] = useState<'safe' | 'stretch' | 'edge' | 'unexplored'>('safe');

  const {
    isAuthenticated,
    saving,
    savePolenEntry,
  } = useTileMatrixPersistence(todayTile?.board || 'LOVE');

  useEffect(() => {
    checkAuth();
    loadTodayTile();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
  };

  const getTodayTileId = () => {
    const startDate = new Date('2025-01-01');
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysSince % 260) + 1;
  };

  const loadTodayTile = async () => {
    try {
      const tileId = getTodayTileId();
      const { data, error } = await supabase
        .from('tiles')
        .select('*')
        .eq('id', tileId)
        .single();

      if (error) throw error;
      setTodayTile(data);
    } catch (error) {
      console.error('Error loading today tile:', error);
      toast.error('Failed to load today\'s tile');
    } finally {
      setLoading(false);
    }
  };

  const getBoardColor = (board: string) => {
    switch (board) {
      case 'LOVE': return 'from-rose-500 to-pink-500';
      case 'MAGIC': return 'from-purple-500 to-indigo-500';
      case 'CALM': return 'from-blue-500 to-cyan-500';
      case 'OPEN': return 'from-green-500 to-emerald-500';
      case 'FREE': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSengeDisciplineLabel = (discipline: string) => {
    switch (discipline) {
      case 'PersonalMastery': return 'Personal Mastery';
      case 'MentalModels': return 'Mental Models';
      case 'SharedVision': return 'Shared Vision';
      case 'TeamLearning': return 'Team Learning';
      case 'SystemsThinking': return 'Systems Thinking';
      default: return discipline;
    }
  };

  const handleTileClick = (row: number, col: number) => {
    setSelectedTile({ row, col });
  };

  const handleSavePolen = async (content: string, tileId: number) => {
    await savePolenEntry(content, tileId, 'text', [activeCompass || 'general']);
    toast.success('Polen saved successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border/50">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Glitch Compass
            </h1>
            <p className="text-sm text-muted-foreground">
              Turn "something feels off" moments into gentle next steps
            </p>
          </div>
          
          {/* Today's Tile Summary */}
          {todayTile && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Today
              </Badge>
              <Badge className={`bg-gradient-to-r ${getBoardColor(todayTile.board)} text-white`}>
                {todayTile.board}
              </Badge>
              <span className="text-sm text-muted-foreground max-w-[200px] truncate">
                "{todayTile.short_prompt}"
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                currentZone === 'safe' && "border-green-500/50 text-green-600",
                currentZone === 'stretch' && "border-yellow-500/50 text-yellow-600",
                currentZone === 'edge' && "border-red-500/50 text-red-600",
                currentZone === 'unexplored' && "border-muted-foreground/50 text-muted-foreground"
              )}
            >
              C{currentCycleNumber} · {currentZone}
            </Badge>
            <Button 
              variant={showPolenBrowser ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowPolenBrowser(!showPolenBrowser)}
            >
              <Library className="w-4 h-4 mr-1" />
              Polen
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/glitch-compass/events')}>
              <Calendar className="w-4 h-4 mr-1" />
              Journal
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/glitch-compass/insights')}>
              <TrendingUp className="w-4 h-4 mr-1" />
              Insights
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/glitch-compass/drift')}>
              <Sparkles className="w-4 h-4 mr-1" />
              Drift → PRD
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content: Split Layout */}
      <div className="flex-1 min-h-0 flex">
        {/* Left Panel: Tile Matrix - Always visible, scrollable */}
        <div className={`${selectedTile || showPolenBrowser ? 'flex-1' : 'w-full'} p-8 overflow-auto transition-all duration-300 flex items-center justify-center`}>
          <div className="pl-32">
            <MinimalistTileMatrix 
              board={todayTile?.board || 'LOVE'}
              selectedTile={selectedTile}
              onTileClick={handleTileClick}
              cycleNumber={currentCycleNumber}
              showToleranceOverlay={true}
              onZoneChange={setCurrentZone}
            />
          </div>
        </div>

        {/* Polen Browser Panel */}
        {showPolenBrowser && !selectedTile && (
          <div className="w-[400px] max-w-[40vw] shrink-0 border-l border-border/50 animate-in slide-in-from-right duration-300">
            <PolenBrowserPanel 
              onClose={() => setShowPolenBrowser(false)}
              onTileClick={(row, col) => {
                setSelectedTile({ row, col });
                setShowPolenBrowser(false);
              }}
            />
          </div>
        )}

        {/* Right Panel: Tile Detail - Slides in when tile selected */}
        {selectedTile && (
          <div className="w-[400px] max-w-[40vw] shrink-0 border-l border-border/50 animate-in slide-in-from-right duration-300">
            <TileDetailPanel
              selectedTile={selectedTile}
              activeCompass={activeCompass}
              board={todayTile?.board || 'LOVE'}
              isAuthenticated={isAuthenticated}
              saving={saving}
              onClose={() => setSelectedTile(null)}
              onSavePolen={handleSavePolen}
              onNavigate={(row, col) => setSelectedTile({ row, col })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlitchCompass;
