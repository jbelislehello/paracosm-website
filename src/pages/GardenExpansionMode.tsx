import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Sparkles, TreeDeciduous, Download } from 'lucide-react';
import { useProjects } from '@/context/ProjectsContext';
import { useMode } from '@/components/calm-magic/context/ModeContext';
import AnthemTreeP5 from '@/components/calm-magic/garden/AnthemTreeP5';
import GardenActivities from '@/components/calm-magic/garden/GardenActivities';
import GardenConnectionHub from '@/components/calm-magic/garden/GardenConnectionHub';
import { GARDEN_THEMES, GardenActivity } from '@/data/gardenConnections';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface GardenMetrics {
  polenCount: number;
  noemsCount: number;
  completedSeasons: number;
  tilesVisited: number;
  coherence: number;
  connections: number;
}

const GardenExpansionMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectContext } = useProjects();
  const { mode } = useMode();
  
  // Get state from navigation
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

  // Generate a sample compiled prompt
  useEffect(() => {
    const prompt = `# Foundational Prompt - ${projectContext?.projectName || 'Calm Magic Project'}

## Garden: ${theme?.name || 'Garden of Intelligence'}

## Journey Metrics
- Polen Collected: ${metrics.polenCount}
- Noems Crystallized: ${metrics.noemsCount}
- Seasons Completed: ${metrics.completedSeasons}/5
- Tiles Explored: ${metrics.tilesVisited}/64
- Coherence Score: ${metrics.coherence}%

## Agentic Configuration
This prompt was generated through the Calm Magic Board journey.
Use this as your foundational context for AI-assisted development.

## Active Connections
${activeConnections.length > 0 ? activeConnections.join(', ') : 'None yet'}
`;
    setCompiledPrompt(prompt);
  }, [projectContext, theme, metrics, activeConnections]);

  const handleConnect = (connectionId: string) => {
    setActiveConnections(prev => [...prev, connectionId]);
    setMetrics(prev => ({ ...prev, connections: prev.connections + 1 }));
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
    
    // Reset after animation
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

  return (
    <div className={cn(
      "min-h-screen",
      "bg-gradient-to-b from-background via-background to-muted/30"
    )}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/calm-magic-board')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{theme?.icon}</span>
                <div>
                  <h1 className="text-lg font-bold">{theme?.name}</h1>
                  <p className="text-xs text-muted-foreground">
                    {projectContext?.projectName || 'Your Garden'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/calm-magic-board/prds')}>
                <FileText className="w-4 h-4 mr-1" />
                View Full PRD
              </Button>
              <Button size="sm" onClick={handleExportPrd} className={cn("bg-gradient-to-r", theme?.gradient)}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Celebration Banner */}
          <Card className={cn(
            "p-6 text-center relative overflow-hidden",
            "bg-gradient-to-r",
            theme?.gradient
          )}>
            <div className="relative z-10 text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TreeDeciduous className="w-8 h-8" />
                <h2 className="text-2xl font-bold">🎉 Your Anthem Tree Has Taken Root!</h2>
                <Sparkles className="w-8 h-8" />
              </div>
              <p className="opacity-90">
                All 5 seasons complete • Your living PRD is ready to grow
              </p>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          </Card>

          {/* Tree Visualization + Stats */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tree Canvas */}
            <Card className="lg:col-span-2 p-6 flex flex-col items-center bg-gradient-to-b from-background to-muted/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TreeDeciduous className="w-5 h-5" />
                Anthem Tree
              </h3>
              <AnthemTreeP5
                garden={garden}
                metrics={metrics}
                activeConnections={activeConnections}
              />
            </Card>

            {/* Stats Panel */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Journey Harvest</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-rose-500/10 rounded-lg">
                  <span className="text-sm">🍃 Polen Leaves</span>
                  <Badge variant="outline" className="text-rose-500">{metrics.polenCount}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-violet-500/10 rounded-lg">
                  <span className="text-sm">🌸 Noems Flowers</span>
                  <Badge variant="outline" className="text-violet-500">{metrics.noemsCount}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
                  <span className="text-sm">🍎 Season Fruits</span>
                  <Badge variant="outline" className="text-emerald-500">{metrics.completedSeasons}/5</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                  <span className="text-sm">🗺️ Tiles Explored</span>
                  <Badge variant="outline" className="text-blue-500">{metrics.tilesVisited}/64</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-lg">
                  <span className="text-sm">💫 Coherence</span>
                  <Badge variant="outline" className="text-amber-500">{metrics.coherence}%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-cyan-500/10 rounded-lg">
                  <span className="text-sm">🌿 Root Connections</span>
                  <Badge variant="outline" className="text-cyan-500">{activeConnections.length}</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Garden Activities */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              L.O.V.E. Gardening Activities
            </h3>
            <GardenActivities
              onActivitySelect={handleActivitySelect}
              activeActivity={activeActivity}
            />
          </Card>

          {/* Connection Hub */}
          <Card className="p-6">
            <GardenConnectionHub
              activeConnections={activeConnections}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              compiledPrompt={compiledPrompt}
            />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GardenExpansionMode;
