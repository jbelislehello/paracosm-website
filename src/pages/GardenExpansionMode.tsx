import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Sparkles, TreeDeciduous, Download, X, Grid3X3 } from 'lucide-react';
import { useProjects } from '@/context/ProjectsContext';
import { useMode } from '@/components/calm-magic/context/ModeContext';
import EnhancedAnthemTreeP5 from '@/components/calm-magic/garden/EnhancedAnthemTreeP5';
import EcologicalGardenP5 from '@/components/calm-magic/garden/EcologicalGardenP5';
import GardenActivities from '@/components/calm-magic/garden/GardenActivities';
import GardenConnectionHub from '@/components/calm-magic/garden/GardenConnectionHub';
import GardenAmbientParticles from '@/components/calm-magic/garden/GardenAmbientParticles';
import GardenStatsPanel from '@/components/calm-magic/garden/GardenStatsPanel';
import GardenCelebration from '@/components/calm-magic/garden/GardenCelebration';
import GardenFloatingControls from '@/components/calm-magic/garden/GardenFloatingControls';
import GardenPrdPreview from '@/components/calm-magic/garden/GardenPrdPreview';
import { GardenViewModeSelector, GardenViewMode, NatureModeSelector, NatureCognitiveMode } from '@/components/calm-magic/garden/GardenViewModeSelector';
import { GardenLegend } from '@/components/calm-magic/garden/GardenLegend';
import { GARDEN_THEMES, GardenActivity } from '@/data/gardenConnections';
import { extractBluntQuotes, BluntQuote } from '@/utils/bluntQuoteExtraction';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatFoundationalPrompt } from '@/utils/formatFoundationalPrompt';
import { useGardenAudio } from '@/hooks/useGardenAudio';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GardenMetrics {
  polenCount: number;
  noemsCount: number;
  completedSeasons: number;
  tilesVisited: number;
  coherence: number;
  connections: number;
}

const seasonDetails = [
  { name: 'POLLENS', description: 'Raw signals and tensions gathered from your journey', color: 'text-rose-500', highlights: ['87 fragments collected', 'Key themes identified', 'Relational patterns mapped'] },
  { name: 'NOEMS', description: 'Crystallized concepts and mental models', color: 'text-violet-500', highlights: ['23 insights distilled', 'Connections formed', 'Understanding deepened'] },
  { name: 'POEMS', description: 'Narrative frameworks and experiential designs', color: 'text-indigo-500', highlights: ['Story arcs defined', 'User journeys mapped', 'P.O.E.M.S. applied'] },
  { name: 'TOTEMS', description: 'Technical foundations and data structures', color: 'text-cyan-500', highlights: ['Architecture designed', 'Security reviewed', 'Stack selected'] },
  { name: 'ANTHEMS', description: 'Market positioning and living documentation', color: 'text-emerald-500', highlights: ['Brand voice defined', 'Launch ready', 'PRD complete'] },
];

const GardenExpansionMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectContext } = useProjects();
  const { mode } = useMode();
  
  const state = location.state as {
    projectId?: string;
    garden?: 'intelligence' | 'systems' | 'prototypes';
    metrics?: Partial<GardenMetrics>;
  } | null;
  
  const garden = state?.garden || projectContext?.garden as 'intelligence' | 'systems' | 'prototypes' || 'intelligence';
  const theme = GARDEN_THEMES[garden];
  
  const [metrics, setMetrics] = useState<GardenMetrics>({
    polenCount: state?.metrics?.polenCount || 87,
    noemsCount: state?.metrics?.noemsCount || 23,
    completedSeasons: state?.metrics?.completedSeasons || 5,
    tilesVisited: state?.metrics?.tilesVisited || 64,
    coherence: state?.metrics?.coherence || 75,
    connections: 0,
  });
  
  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [compiledPrompt, setCompiledPrompt] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(true);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [fullscreenTree, setFullscreenTree] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [prdData, setPrdData] = useState<any>(null);
  const [isLoadingPrd, setIsLoadingPrd] = useState(true);
  const [viewMode, setViewMode] = useState<GardenViewMode>('ecological');
  const [natureMode, setNatureMode] = useState<NatureCognitiveMode | null>(null);
  const [tileEcologyData, setTileEcologyData] = useState<Map<string, { fragmentCount: number; quotes: BluntQuote[] }>>(new Map());
  const [visitedTiles, setVisitedTiles] = useState<Set<string>>(new Set());

  // Garden audio system
  const {
    isPlaying: audioEnabled,
    volume: audioVolume,
    profile: audioProfile,
    toggle: toggleAudio,
    setVolume: setAudioVolume,
    playConnectionSound,
    playActivitySound,
  } = useGardenAudio({ garden });

  // Fetch PRD data from Supabase
  useEffect(() => {
    const fetchPrdData = async () => {
      if (!projectContext?.id) {
        setIsLoadingPrd(false);
        return;
      }

      try {
        // First check project_season_progress for prd_id
        const { data: progressData } = await supabase
          .from('project_season_progress')
          .select('prd_id')
          .eq('project_id', projectContext.id)
          .maybeSingle();

        let prdId = progressData?.prd_id;

        // If no prd_id in progress, look for PRD by owner
        if (!prdId) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user?.id) {
            const { data: prds } = await supabase
              .from('prds')
              .select('*')
              .eq('owner_id', userData.user.id)
              .order('updated_at', { ascending: false })
              .limit(1);
            
            if (prds && prds.length > 0) {
              setPrdData(prds[0]);
            }
          }
        } else {
          // Fetch the specific PRD
          const { data: prd } = await supabase
            .from('prds')
            .select('*')
            .eq('id', prdId)
            .single();
          
          if (prd) {
            setPrdData(prd);
          }
        }
      } catch (error) {
        console.error('Error fetching PRD:', error);
      } finally {
        setIsLoadingPrd(false);
      }
    };

    fetchPrdData();
  }, [projectContext?.id]);

  // Generate compiled prompt using the rich formatter
  useEffect(() => {
    const prompt = formatFoundationalPrompt(
      prdData,
      metrics,
      projectContext?.projectName || 'Calm Magic Project',
      garden
    );
    setCompiledPrompt(prompt);
  }, [prdData, metrics, projectContext?.projectName, garden]);

  const handleConnect = (connectionId: string) => {
    setActiveConnections(prev => [...prev, connectionId]);
    setMetrics(prev => ({ ...prev, connections: prev.connections + 1 }));
    playConnectionSound();
  };

  const handleDisconnect = (connectionId: string) => {
    setActiveConnections(prev => prev.filter(id => id !== connectionId));
    setMetrics(prev => ({ ...prev, connections: Math.max(0, prev.connections - 1) }));
  };

  const handleActivitySelect = (activity: GardenActivity) => {
    setActiveActivity(activity.id);
    toast.success(`${activity.name} activity activated!`, {
      description: activity.description
    });
    setTimeout(() => setActiveActivity(null), 2000);
  };

  const handleExportPrd = () => {
    const blob = new Blob([compiledPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectContext?.projectName || 'calm-magic'}-foundational-prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Foundational Prompt exported!');
  };

  const handleFruitClick = (seasonIndex: number) => {
    setSelectedSeason(seasonIndex);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient particles */}
      {particlesEnabled && <GardenAmbientParticles garden={garden} intensity={0.8} />}
      
      {/* Celebration effects */}
      <GardenCelebration 
        isActive={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      
      {/* Gradient background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, hsl(var(--primary) / 0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 60%, hsl(var(--secondary) / 0.08) 0%, transparent 40%),
            linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted) / 0.3))
          `
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/calm-magic-board')} className="hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-2xl",
                  "bg-gradient-to-br shadow-lg",
                  theme?.gradient
                )}>
                  {theme?.icon}
                </div>
                <div>
                  <h1 className="text-lg font-bold">{theme?.name}</h1>
                  <p className="text-xs text-muted-foreground">
                    {projectContext?.projectName || 'Your Garden'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/calm-magic-board/prds')} className="backdrop-blur-sm bg-background/50">
                <FileText className="w-4 h-4 mr-1" />
                View Full PRD
              </Button>
              <Button size="sm" onClick={handleExportPrd} className={cn("bg-gradient-to-r shadow-lg", theme?.gradient)}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Celebration Banner */}
          <Card className={cn(
            "p-8 text-center relative overflow-hidden",
            "bg-gradient-to-r shadow-2xl border-0",
            theme?.gradient
          )}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                  radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                animation: 'pulse 4s ease-in-out infinite'
              }} />
            </div>
            
            <div className="relative z-10 text-white">
              <div className="flex items-center justify-center gap-3 mb-3">
                <TreeDeciduous className="w-10 h-10 animate-pulse" />
                <h2 className="text-3xl font-bold tracking-tight">Your Anthem Tree Has Taken Root!</h2>
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                All 5 seasons complete • Your living PRD is ready to grow and connect
              </p>
              <div className="flex items-center justify-center gap-6 mt-4">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 rounded-full bg-white/80 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          </Card>

          {/* Garden Views */}
          <Tabs defaultValue="ecological" className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
                <TabsTrigger value="ecological" className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Ecological</span>
                </TabsTrigger>
                <TabsTrigger value="tree" className="flex items-center gap-2">
                  <TreeDeciduous className="w-4 h-4" />
                  <span className="hidden sm:inline">World Tree</span>
                </TabsTrigger>
                <TabsTrigger value="prd" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">PRD Layers</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Ecological Garden View */}
            <TabsContent value="ecological" className="mt-0">
              <div className="space-y-4">
                {/* Nature Mode Selector */}
                <Card className="p-4 bg-background/60 backdrop-blur-xl border-border/30">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Cognitive Mode</h4>
                      <p className="text-xs text-muted-foreground">Think like nature to navigate your journey</p>
                    </div>
                    <NatureModeSelector value={natureMode} onChange={setNatureMode} />
                  </div>
                </Card>

                <div className="grid lg:grid-cols-5 gap-6">
                  {/* Ecological Garden Canvas */}
                  <Card className={cn(
                    "lg:col-span-3 p-4 relative overflow-hidden",
                    "bg-gradient-to-b from-background/80 to-muted/20",
                    "backdrop-blur-xl border-border/30"
                  )}>
                    <EcologicalGardenP5
                      garden={garden}
                      tileData={tileEcologyData}
                      visitedTiles={visitedTiles}
                      currentNatureMode={natureMode}
                    />
                    {/* Legend overlay */}
                    <div className="absolute bottom-4 left-4">
                      <GardenLegend />
                    </div>
                  </Card>

                  {/* Stats Panel */}
                  <div className="lg:col-span-2">
                    <GardenStatsPanel metrics={metrics} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tree" className="mt-0">
              <div className="grid lg:grid-cols-5 gap-6">
                <Card className={cn(
                  "lg:col-span-3 p-6 flex flex-col items-center relative overflow-hidden",
                  "bg-gradient-to-b from-background/80 to-muted/20",
                  "backdrop-blur-xl border-border/30"
                )}>
                  <EnhancedAnthemTreeP5
                    garden={garden}
                    metrics={metrics}
                    activeConnections={activeConnections}
                    onFruitClick={handleFruitClick}
                  />
                </Card>
                <div className="lg:col-span-2">
                  <GardenStatsPanel metrics={metrics} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prd" className="mt-0">
              <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <GardenPrdPreview 
                    prdData={prdData} 
                    isLoading={isLoadingPrd}
                    onExport={handleExportPrd}
                  />
                </div>
                <div className="lg:col-span-2">
                  <GardenStatsPanel metrics={metrics} />
                </div>
              </div>
            </TabsContent>
          </Tabs>


          {/* Garden Activities */}
          <Card className={cn(
            "p-6 relative overflow-hidden",
            "bg-gradient-to-br from-background/80 to-muted/20",
            "backdrop-blur-xl border-white/10"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 relative z-10">
              <Sparkles className="w-5 h-5" />
              L.O.V.E. Gardening Activities
              <span className="text-sm font-normal text-muted-foreground ml-2">
                Nurture your garden's growth
              </span>
            </h3>
            <GardenActivities
              onActivitySelect={handleActivitySelect}
              activeActivity={activeActivity}
            />
          </Card>

          {/* Connection Hub */}
          <Card className={cn(
            "p-6 relative overflow-hidden",
            "bg-gradient-to-br from-background/80 to-muted/20",
            "backdrop-blur-xl border-white/10"
          )}>
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
            
            <GardenConnectionHub
              activeConnections={activeConnections}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              compiledPrompt={compiledPrompt}
            />
          </Card>
        </div>
      </main>

      {/* Floating Controls */}
      <GardenFloatingControls
        particlesEnabled={particlesEnabled}
        audioEnabled={audioEnabled}
        audioVolume={audioVolume}
        audioProfileName={audioProfile.name}
        onToggleParticles={setParticlesEnabled}
        onToggleAudio={toggleAudio}
        onVolumeChange={setAudioVolume}
        onToggleFullscreen={() => setFullscreenTree(!fullscreenTree)}
        onResetView={() => {
          setShowCelebration(true);
          toast.success('View reset!');
        }}
      />

      {/* Season Details Dialog */}
      <Dialog open={selectedSeason !== null} onOpenChange={() => setSelectedSeason(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={cn(
              "flex items-center gap-2 text-xl",
              selectedSeason !== null && seasonDetails[selectedSeason]?.color
            )}>
              {selectedSeason !== null && (
                <>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                    "bg-gradient-to-br",
                    selectedSeason === 0 && "from-rose-500 to-pink-500",
                    selectedSeason === 1 && "from-violet-500 to-purple-500",
                    selectedSeason === 2 && "from-indigo-500 to-blue-500",
                    selectedSeason === 3 && "from-cyan-500 to-teal-500",
                    selectedSeason === 4 && "from-emerald-500 to-green-500",
                  )}>
                    {selectedSeason + 1}
                  </div>
                  {seasonDetails[selectedSeason].name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSeason !== null && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {seasonDetails[selectedSeason].description}
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Season Highlights:</h4>
                <ul className="space-y-1">
                  {seasonDetails[selectedSeason].highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setSelectedSeason(null)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Tree Modal */}
      {fullscreenTree && (
        <div className="fixed inset-0 z-50 bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50"
            onClick={() => setFullscreenTree(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          <EnhancedAnthemTreeP5
            garden={garden}
            metrics={metrics}
            activeConnections={activeConnections}
            onFruitClick={handleFruitClick}
            fullscreen
          />
        </div>
      )}
    </div>
  );
};

export default GardenExpansionMode;
