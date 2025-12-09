import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Tile } from '@/types/glitch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Calendar, TrendingUp, Grid3x3 } from 'lucide-react';
import { toast } from 'sonner';
import TileMatrix from '@/components/TileMatrix';
import TileMatrixVisualization from '@/components/TileMatrixVisualization';

const GlitchCompass = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [todayTile, setTodayTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [currentPass, setCurrentPass] = useState<1 | 2 | 3 | 4>(1);
  const [visitedTiles] = useState<Set<string>>(new Set());
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-6xl mx-auto p-6 sm:p-8 lg:p-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Glitch Compass
          </h1>
          <p className="text-muted-foreground text-lg">
            Turn "something feels off" moments into gentle next steps
          </p>
        </div>

        {/* Today's Tile */}
        {todayTile && (
          <Card className="p-8 space-y-6 border-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Today's Tile
                </h2>
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getBoardColor(todayTile.board)} text-white font-medium`}>
                  {todayTile.board}
                </div>
              </div>
              <p className="text-3xl font-light text-muted-foreground italic">
                "{todayTile.short_prompt}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Senge Discipline</p>
                  <p className="text-lg font-medium">{getSengeDisciplineLabel(todayTile.senge_discipline)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mindfulness Focus</p>
                  <p className="text-lg font-medium">
                    {Array.isArray(todayTile.mindfulness_focus) 
                      ? todayTile.mindfulness_focus.join(', ').replace(/-/g, ' ')
                      : ''}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Path Phase</p>
                  <p className="text-lg font-medium">{todayTile.default_process_state}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {todayTile.default_process_state === 'GLITCH' && 'See the tension clearly, without fixing it yet.'}
                    {todayTile.default_process_state === 'DRIFT' && 'Explore, listen, and play with possibilities.'}
                    {todayTile.default_process_state === 'TUNE' && 'Make one small, realistic adjustment.'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Velocity & Longevity</p>
                  <p className="text-lg font-medium">
                    {todayTile.row && todayTile.col ? `${todayTile.row}/8 × ${todayTile.col}/8` : 'FREE tile'}
                  </p>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg"
              onClick={() => navigate('/glitch-compass/log')}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Log a Glitch
            </Button>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/glitch-compass/events')}>
            <div className="space-y-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-lg">My Journal</h3>
              <p className="text-sm text-muted-foreground">View your glitch timeline</p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/glitch-compass/insights')}>
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-lg">Insights</h3>
              <p className="text-sm text-muted-foreground">Patterns in your glitches</p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/glitch-compass/drift')}>
            <div className="space-y-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-lg">Drift → PRD</h3>
              <p className="text-sm text-muted-foreground">Create a 5-layer PRD from glitches</p>
            </div>
          </Card>
        </div>

        {/* Visual Matrix with L.O.V.E. Axes */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                Tile Matrix Visualization
              </h3>
              <p className="text-sm text-muted-foreground">
                Concentric tolerance passes with L.O.V.E. axes (Velocity × Longevity)
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex gap-1">
                {([1, 2, 3, 4] as const).map(pass => (
                  <Button
                    key={pass}
                    size="sm"
                    variant={currentPass >= pass ? "default" : "outline"}
                    onClick={() => setCurrentPass(pass)}
                    className={`w-8 h-8 p-0 ${
                      pass === 1 ? 'bg-emerald-500 hover:bg-emerald-600' :
                      pass === 2 ? 'bg-blue-500 hover:bg-blue-600' :
                      pass === 3 ? 'bg-amber-500 hover:bg-amber-600' :
                      'bg-purple-500 hover:bg-purple-600'
                    } ${currentPass < pass ? 'opacity-40' : ''}`}
                  >
                    {pass}
                  </Button>
                ))}
              </div>
              <Button 
                variant={showVisualization ? "default" : "outline"}
                onClick={() => setShowVisualization(!showVisualization)}
              >
                {showVisualization ? 'Hide' : 'Show'} Visualization
              </Button>
            </div>
          </div>

          {showVisualization && (
            <div className="pt-6 border-t">
              <TileMatrixVisualization 
                board={todayTile?.board as any || 'LOVE'}
                currentPass={currentPass}
                visitedTiles={visitedTiles}
                selectedTile={selectedTile}
                onTileClick={(row, col) => {
                  setSelectedTile({ row, col });
                  toast.info(`Selected tile: Row ${row + 1}, Col ${col + 1}`);
                }}
              />
            </div>
          )}
        </Card>

        {/* Original Matrix Toggle */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                Full Tile Matrix
              </h3>
              <p className="text-sm text-muted-foreground">
                Interactive 8×8 matrix with POLEN capture
              </p>
            </div>
            <Button 
              variant={showMatrix ? "default" : "outline"}
              onClick={() => setShowMatrix(!showMatrix)}
            >
              {showMatrix ? 'Hide Matrix' : 'Show Matrix'}
            </Button>
          </div>

          {showMatrix && (
            <div className="pt-6 border-t">
              <TileMatrix 
                board={todayTile?.board as any || 'LOVE'}
                onTileClick={(row, col) => {
                  toast.info(`Clicked tile at Row ${row + 1}, Column ${col + 1}`);
                }}
              />
            </div>
          )}
        </Card>

        {/* Welcome Message */}
        <Card className="p-6 bg-muted/50">
          <p className="text-center text-muted-foreground">
            When something feels off—in you, with someone else, or in your work—log it here. 
            <br />You don't need answers, just a starting point.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default GlitchCompass;
