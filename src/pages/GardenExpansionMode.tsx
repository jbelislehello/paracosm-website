import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileText, Download, Copy, CheckCircle2 } from 'lucide-react';
import { useProjects } from '@/context/ProjectsContext';
import { useMode } from '@/components/calm-magic/context/ModeContext';
import SeasonFlowVisualization from '@/components/calm-magic/garden/SeasonFlowVisualization';
import OntologySummary from '@/components/calm-magic/garden/OntologySummary';
import SeasonArchive from '@/components/calm-magic/garden/SeasonArchive';
import HexagramGallery from '@/components/calm-magic/garden/HexagramGallery';
import IntegrationPathways from '@/components/calm-magic/garden/IntegrationPathways';
import JourneyTimeline from '@/components/calm-magic/garden/JourneyTimeline';
import JourneySummaryExport from '@/components/calm-magic/garden/JourneySummaryExport';
import { PrdCompilationCard } from '@/components/calm-magic/garden/PrdCompilationCard';
import { GARDEN_THEMES } from '@/data/gardenConnections';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatFoundationalPrompt } from '@/utils/formatFoundationalPrompt';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

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
  
  const state = location.state as {
    projectId?: string;
    garden?: 'intelligence' | 'systems' | 'prototypes';
    metrics?: Partial<GardenMetrics>;
  } | null;
  
  const garden = state?.garden || projectContext?.garden as 'intelligence' | 'systems' | 'prototypes' || 'intelligence';
  const theme = GARDEN_THEMES[garden];
  
  const [metrics, setMetrics] = useState<GardenMetrics>({
    polenCount: state?.metrics?.polenCount || 0,
    noemsCount: state?.metrics?.noemsCount || 0,
    completedSeasons: state?.metrics?.completedSeasons || 5,
    tilesVisited: state?.metrics?.tilesVisited || 0,
    coherence: state?.metrics?.coherence || 75,
    connections: 0,
  });
  
  const [compiledPrompt, setCompiledPrompt] = useState<string>('');
  const [prdData, setPrdData] = useState<any>(null);
  const [prdId, setPrdId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingPrd, setIsLoadingPrd] = useState(true);
  const [copied, setCopied] = useState(false);
  const [prdRefreshKey, setPrdRefreshKey] = useState(0);
  
  // Real season counts from database
  const [seasonCounts, setSeasonCounts] = useState<Record<Season, number>>({
    POLLENS: 0,
    NOEMS: 0,
    POEMS: 0,
    TOTEMS: 0,
    ANTHEMS: 0,
  });
  const [hexagramCount, setHexagramCount] = useState(0);
  
  // Selected date from timeline
  const [selectedTimelineDate, setSelectedTimelineDate] = useState<Date | undefined>(undefined);

  // Season data for visualization - using real counts
  const seasonData = [
    { name: 'POLLENS', label: 'fragments', count: seasonCounts.POLLENS, description: 'Raw signals gathered' },
    { name: 'NOEMS', label: 'concepts', count: seasonCounts.NOEMS, description: 'Ideas crystallized' },
    { name: 'POEMS', label: 'designs', count: seasonCounts.POEMS, description: 'Experiences mapped' },
    { name: 'TOTEMS', label: 'systems', count: seasonCounts.TOTEMS, description: 'Architecture defined' },
    { name: 'ANTHEMS', label: 'stories', count: seasonCounts.ANTHEMS, description: 'Voice established' },
  ];

  // Fetch PRD data from Supabase
  useEffect(() => {
    const fetchPrdData = async () => {
      if (!projectContext?.id) {
        setIsLoadingPrd(false);
        return;
      }

      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.id) {
          setUserId(userData.user.id);
        }

        const { data: progressData } = await supabase
          .from('project_season_progress')
          .select('prd_id')
          .eq('project_id', projectContext.id)
          .maybeSingle();

        let foundPrdId = progressData?.prd_id;

        if (!foundPrdId) {
          if (userData?.user?.id) {
            const { data: prds } = await supabase
              .from('prds')
              .select('*')
              .eq('owner_id', userData.user.id)
              .order('updated_at', { ascending: false })
              .limit(1);
            
            if (prds && prds.length > 0) {
              setPrdData(prds[0]);
              setPrdId(prds[0].id);
            }
          }
        } else {
          setPrdId(foundPrdId);
          const { data: prd } = await supabase
            .from('prds')
            .select('*')
            .eq('id', foundPrdId)
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
  }, [projectContext?.id, prdRefreshKey]);

  // Callback when PRD compilation completes
  const handleCompilationComplete = () => {
    setPrdRefreshKey(prev => prev + 1);
  };

  // Fetch POLEN counts per season and hexagram readings count
  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        // Fetch all POLEN entries with season_context
        const { data: polenEntries, error } = await supabase
          .from('polen_entries')
          .select('id, tile_id, season_context')
          .eq('user_id', userData.user.id);

        if (error || !polenEntries) return;

        // Count per season
        const counts: Record<Season, number> = {
          POLLENS: 0,
          NOEMS: 0,
          POEMS: 0,
          TOTEMS: 0,
          ANTHEMS: 0,
        };

        polenEntries.forEach(entry => {
          const season = entry.season_context as Season;
          if (season && counts[season] !== undefined) {
            counts[season]++;
          }
        });

        setSeasonCounts(counts);

        // Update metrics with total count
        const uniqueTiles = new Set(polenEntries.map(e => e.tile_id).filter(Boolean));
        const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
        
        setMetrics(prev => ({
          ...prev,
          polenCount: totalCount,
          tilesVisited: uniqueTiles.size
        }));

        // Fetch hexagram readings count
        const { count: hexCount } = await supabase
          .from('hexagram_readings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userData.user.id);

        setHexagramCount(hexCount || 0);
        
      } catch (error) {
        console.error('Error fetching season data:', error);
      }
    };

    fetchSeasonData();
  }, [projectContext?.id]);

  // Generate compiled prompt
  useEffect(() => {
    const prompt = formatFoundationalPrompt(
      prdData,
      metrics,
      projectContext?.projectName || 'Calm Magic Project',
      garden
    );
    setCompiledPrompt(prompt);
  }, [prdData, metrics, projectContext?.projectName, garden]);

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
    toast.success('Foundational Prompt exported');
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTimelineDateSelect = (date: Date) => {
    setSelectedTimelineDate(date);
  };

  return (
    <div className="min-h-screen relative">
      {/* Subtle ambient gradient background */}
      <div 
        className="fixed inset-0 -z-10 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 100% 100%, hsl(var(--primary) / 0.05) 0%, transparent 50%),
            hsl(var(--background))
          `
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/calm-magic-board')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  {projectContext?.projectName || 'Your Living Ontology'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Consecration • {theme?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <JourneySummaryExport
                projectName={projectContext?.projectName || 'Calm Magic Project'}
                gardenName={theme?.name || 'Intelligence'}
                seasonCounts={seasonCounts}
                foundationalPrompt={compiledPrompt}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/calm-magic-board/prds')}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Full PRD
              </Button>
              <Button size="sm" onClick={handleExportPrd}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-16">
          
          {/* Hero Section - Typography-led */}
          <section className="text-center space-y-6 py-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Your Living Ontology Has Emerged
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {metrics.polenCount} fragments crystallized across 5 seasons into a unified intelligence ready to serve
            </p>
          </section>

          {/* Season Flow Visualization */}
          <section className="py-8">
            <SeasonFlowVisualization seasons={seasonData} />
          </section>

          {/* PRD Compilation Status */}
          {userId && (
            <section className="py-4">
              <PrdCompilationCard
                prdData={prdData}
                prdId={prdId}
                userId={userId}
                onCompilationComplete={handleCompilationComplete}
              />
            </section>
          )}

          {/* Journey Timeline */}
          <section className="py-8">
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
              <JourneyTimeline onDateSelect={handleTimelineDateSelect} />
            </Card>
          </section>

          {/* Ontology Summary */}
          <section className="py-8">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <OntologySummary 
                prdData={prdData} 
                projectName={projectContext?.projectName || 'Project'} 
              />
            </Card>
          </section>

          {/* Season Archive - Expandable with real entries and filtering */}
          <section className="py-8">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <SeasonArchive 
                seasonCounts={seasonCounts} 
                initialDateFilter={selectedTimelineDate}
              />
            </Card>
          </section>

          {/* Hexagram Gallery */}
          {hexagramCount > 0 && (
            <section className="py-8">
              <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
                <HexagramGallery />
              </Card>
            </section>
          )}

          {/* Foundational Prompt Preview */}
          <section className="py-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">The Foundational Prompt</h3>
              <p className="text-sm text-muted-foreground">
                Your compiled intelligence, ready for AI systems
              </p>
            </div>
            
            <Card className="relative overflow-hidden border-border/50">
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCopyPrompt}
                  className="h-8"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleExportPrd}
                  className="h-8"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
              
              <ScrollArea className="h-80">
                <Textarea
                  value={compiledPrompt}
                  readOnly
                  className={cn(
                    "min-h-80 resize-none border-0 bg-muted/30",
                    "font-mono text-xs leading-relaxed p-4 pt-12",
                    "focus-visible:ring-0"
                  )}
                />
              </ScrollArea>
            </Card>
          </section>

          {/* Integration Pathways */}
          <section className="py-8">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <IntegrationPathways 
                compiledPrompt={compiledPrompt}
                onExport={handleExportPrd}
              />
            </Card>
          </section>

          {/* Closing */}
          <section className="text-center py-12 space-y-4">
            <p className="text-muted-foreground max-w-xl mx-auto">
              This living ontology continues to evolve. Return to the board to deepen 
              your exploration, or take these insights into the world.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/calm-magic-board')}
            >
              Return to Board
            </Button>
          </section>

        </div>
      </main>
    </div>
  );
};

export default GardenExpansionMode;
