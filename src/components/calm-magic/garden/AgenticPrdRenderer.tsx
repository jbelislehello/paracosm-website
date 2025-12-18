import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, 
  Hexagon, 
  Building2, 
  FileCode,
  Sparkles,
  Download,
  Copy,
  Check,
  AlertCircle,
  Flower2,
  Lightbulb,
  PenTool,
  Gem,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PRD_DIMENSIONS, QUALITY_LENS_CATEGORIES } from '@/data/prdDimensions';
import { AGENTIC_LAYERS, LAYER_ORDER, PRD_TO_AGENTIC_MAPPING, getOrderedAgenticLayers } from '@/data/agenticLayers';
import SeasonLayerCard from './SeasonLayerCard';
import DimensionalAnalysisPanel from './DimensionalAnalysisPanel';
import AgenticArchitectureView from './AgenticArchitectureView';
import CompiledOutputsPanel from './CompiledOutputsPanel';
import CSuiteDashboard from '../CSuiteDashboard';

export interface PrdSeasonData {
  // POLLENS
  pollens_aspirations?: string | null;
  pollens_team_dynamics?: string | null;
  pollens_cultural_elements?: string | null;
  pollens_relational_patterns?: string | null;
  pollens_constraints?: string | null;
  pollens_stakes?: string | null;
  // NOEMS
  noems_concepts?: string | null;
  noems_shared_ideas?: string | null;
  noems_intuitions?: string | null;
  noems_mental_models?: string | null;
  // POEMS
  poems_people?: string | null;
  poems_objects?: string | null;
  poems_environments?: string | null;
  poems_messages?: string | null;
  poems_systems?: string | null;
  poems_prototypes?: string | null;
  // TOTEMS
  totems_data_architecture?: string | null;
  totems_security_policies?: string | null;
  totems_access_controls?: string | null;
  totems_system_requirements?: string | null;
  totems_integration_points?: string | null;
  totems_technical_debt?: string | null;
  // ANTHEMS
  anthems_market_positioning?: string | null;
  anthems_brand_narrative?: string | null;
  anthems_go_to_market?: string | null;
  anthems_audience_segments?: string | null;
  anthems_success_signals?: string | null;
  anthems_storytelling_assets?: string | null;
  // Stack implications
  stack_implications_pollens?: string | null;
  stack_implications_noems?: string | null;
  stack_implications_poems?: string | null;
  stack_implications_totems?: string | null;
  stack_implications_anthems?: string | null;
  // Prompt hooks
  prompt_hooks_pollens?: string | null;
  prompt_hooks_noems?: string | null;
  prompt_hooks_poems?: string | null;
  prompt_hooks_totems?: string | null;
  prompt_hooks_anthems?: string | null;
  // Compiled
  compiled_prompt?: string | null;
  compiled_tech_stack?: any;
  // Legacy fields for backwards compat
  love_signals_summary?: string | null;
  love_decision_to_exist?: string | null;
  magic_patterns?: string | null;
  magic_hypotheses?: string | null;
  magic_storyworld?: string | null;
  magic_prd_outline?: string | null;
  calm_requirements?: string | null;
  calm_risks_and_limits?: string | null;
  open_ontology_and_graph?: string | null;
  open_real_workflow?: string | null;
  open_adjustment_plan?: string | null;
  free_first_poem_description?: string | null;
  free_success_criteria?: string | null;
  free_totem_anthem?: string | null;
  free_next_cycle_hooks?: string | null;
  // Meta
  id?: string;
  title?: string;
}

export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

export const SEASONS: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

export const SEASON_CONFIG: Record<Season, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  fields: string[];
  qualityLenses: string[];
  agenticLayers: string[];
}> = {
  POLLENS: {
    label: 'Pollens',
    icon: Flower2,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    description: 'Relational & Cultural Aspirations — What we sense and desire',
    fields: ['pollens_aspirations', 'pollens_team_dynamics', 'pollens_cultural_elements', 'pollens_relational_patterns', 'pollens_constraints', 'pollens_stakes'],
    qualityLenses: ['Empathy', 'Sympathy', 'Social Skills', 'Emotional Intelligence'],
    agenticLayers: ['INFRASTRUCTURE', 'GOVERNANCE']
  },
  NOEMS: {
    label: 'Noems',
    icon: Lightbulb,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    description: 'Conceptual Ideation — Crystallized insights and mental models',
    fields: ['noems_concepts', 'noems_shared_ideas', 'noems_intuitions', 'noems_mental_models'],
    qualityLenses: ['Positionality', 'Compositionality', 'Inference Rules', 'Mathematical Creativity'],
    agenticLayers: ['MEMORY', 'COGNITION', 'AGENT_INTERNET']
  },
  POEMS: {
    label: 'Poems',
    icon: PenTool,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    description: 'P.O.E.M.S. Framework — People, Objects, Environments, Messages, Systems',
    fields: ['poems_people', 'poems_objects', 'poems_environments', 'poems_messages', 'poems_systems', 'poems_prototypes'],
    qualityLenses: ['Aesthetics', 'Poetic Engineering', 'Spontaneity', 'Expressivity'],
    agenticLayers: ['APPLICATION', 'TOOLING', 'MEMORY']
  },
  TOTEMS: {
    label: 'Totems',
    icon: Gem,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'Technical Infrastructure — Data architecture, security, and systems',
    fields: ['totems_data_architecture', 'totems_security_policies', 'totems_access_controls', 'totems_system_requirements', 'totems_integration_points', 'totems_technical_debt'],
    qualityLenses: ['Self Awareness', 'Self Regulation', 'Noetic Sciences', 'Vectors'],
    agenticLayers: ['PROTOCOL', 'GOVERNANCE', 'INFRASTRUCTURE']
  },
  ANTHEMS: {
    label: 'Anthems',
    icon: Music,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Market & Storytelling — Brand narrative, positioning, and success signals',
    fields: ['anthems_market_positioning', 'anthems_brand_narrative', 'anthems_go_to_market', 'anthems_audience_segments', 'anthems_success_signals', 'anthems_storytelling_assets'],
    qualityLenses: ['Ecology', 'Somatic Creativity', 'Manifestation', 'Ontological Shift'],
    agenticLayers: ['APPLICATION', 'GOVERNANCE']
  }
};

interface AgenticPrdRendererProps {
  prdData: PrdSeasonData | null;
  isLoading?: boolean;
  onExport?: () => void;
  projectName?: string;
}

const AgenticPrdRenderer: React.FC<AgenticPrdRendererProps> = ({
  prdData,
  isLoading = false,
  onExport,
  projectName = 'Untitled Project'
}) => {
  const [activeTab, setActiveTab] = useState('seasons');
  const [copiedAll, setCopiedAll] = useState(false);

  // Calculate completion metrics
  const seasonCompletionStats = useMemo(() => {
    if (!prdData) return { completed: 0, total: SEASONS.length, percentage: 0 };
    
    let completedSeasons = 0;
    SEASONS.forEach(season => {
      const config = SEASON_CONFIG[season];
      const hasContent = config.fields.some(field => {
        const value = prdData[field as keyof PrdSeasonData];
        return value && typeof value === 'string' && value.trim().length > 0;
      });
      if (hasContent) completedSeasons++;
    });
    
    return {
      completed: completedSeasons,
      total: SEASONS.length,
      percentage: Math.round((completedSeasons / SEASONS.length) * 100)
    };
  }, [prdData]);

  // Get content for a season (handles both new and legacy fields)
  const getSeasonContent = (season: Season): Record<string, string> => {
    if (!prdData) return {};
    
    const result: Record<string, string> = {};
    const config = SEASON_CONFIG[season];
    
    config.fields.forEach(field => {
      const value = prdData[field as keyof PrdSeasonData];
      if (value && typeof value === 'string') {
        result[field] = value;
      }
    });
    
    // Also get stack implications and prompt hooks
    const stackKey = `stack_implications_${season.toLowerCase()}` as keyof PrdSeasonData;
    const promptKey = `prompt_hooks_${season.toLowerCase()}` as keyof PrdSeasonData;
    
    if (prdData[stackKey]) result[stackKey] = prdData[stackKey] as string;
    if (prdData[promptKey]) result[promptKey] = prdData[promptKey] as string;
    
    return result;
  };

  const copyAllContent = async () => {
    if (!prdData) return;
    
    let fullContent = `# ${projectName} — Agentic Era PRD\n\n`;
    
    SEASONS.forEach(season => {
      const config = SEASON_CONFIG[season];
      const content = getSeasonContent(season);
      
      fullContent += `## ${config.label}\n`;
      fullContent += `${config.description}\n\n`;
      
      Object.entries(content).forEach(([key, value]) => {
        if (value) {
          fullContent += `### ${key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}\n`;
          fullContent += `${value}\n\n`;
        }
      });
    });
    
    try {
      await navigator.clipboard.writeText(fullContent);
      setCopiedAll(true);
      toast.success('Full PRD copied to clipboard');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Agentic PRD...</p>
        </CardContent>
      </Card>
    );
  }

  if (!prdData || seasonCompletionStats.completed === 0) {
    return (
      <Card className="border-dashed border-amber-500/50 bg-amber-500/5">
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No PRD Content Generated Yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Complete your journey through the seasons to generate your Holy Grail Agentic Era PRD.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Return to Board
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20">
      {/* Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Holy Grail Agentic PRD</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{projectName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-background/50">
              {seasonCompletionStats.completed}/{seasonCompletionStats.total} Seasons
            </Badge>
            <Badge 
              variant={seasonCompletionStats.percentage >= 80 ? "default" : "secondary"}
              className={cn(
                seasonCompletionStats.percentage >= 80 && "bg-emerald-500"
              )}
            >
              {seasonCompletionStats.percentage}% Complete
            </Badge>
            <Button variant="outline" size="sm" onClick={copyAllContent}>
              {copiedAll ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copiedAll ? 'Copied!' : 'Copy All'}
            </Button>
            {onExport && (
              <Button variant="default" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Tabbed Content */}
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border/50 px-4">
            <TabsList className="h-12 bg-transparent gap-1">
              <TabsTrigger 
                value="seasons" 
                className="data-[state=active]:bg-primary/10 gap-2"
              >
                <Layers className="w-4 h-4" />
                Seasons
              </TabsTrigger>
              <TabsTrigger 
                value="dimensions" 
                className="data-[state=active]:bg-primary/10 gap-2"
              >
                <Hexagon className="w-4 h-4" />
                Dimensions
              </TabsTrigger>
              <TabsTrigger 
                value="architecture" 
                className="data-[state=active]:bg-primary/10 gap-2"
              >
                <Building2 className="w-4 h-4" />
                8-Layer
              </TabsTrigger>
              <TabsTrigger 
                value="csuite" 
                className="data-[state=active]:bg-primary/10 gap-2"
              >
                <Building2 className="w-4 h-4" />
                C-Suite
              </TabsTrigger>
              <TabsTrigger 
                value="compiled" 
                className="data-[state=active]:bg-primary/10 gap-2"
              >
                <FileCode className="w-4 h-4" />
                Compiled
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[600px]">
            {/* Seasons Tab */}
            <TabsContent value="seasons" className="m-0 p-4 space-y-4">
              {SEASONS.map(season => (
                <SeasonLayerCard 
                  key={season}
                  season={season}
                  content={getSeasonContent(season)}
                  config={SEASON_CONFIG[season]}
                />
              ))}
            </TabsContent>

            {/* Dimensions Tab */}
            <TabsContent value="dimensions" className="m-0 p-4">
              <DimensionalAnalysisPanel prdData={prdData} />
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="m-0 p-4">
              <AgenticArchitectureView prdData={prdData} />
            </TabsContent>

            {/* C-Suite Tab */}
            <TabsContent value="csuite" className="m-0 p-4">
              <CSuiteDashboard 
                prdData={prdData as any}
                polenEntries={[]}
                seasonProgress={{
                  currentSeason: 'ANTHEMS',
                  completedSeasons: new Set(),
                  seasonProgress: new Set(),
                  journeyStarted: new Set(),
                  journeyPath: []
                } as any}
              />
            </TabsContent>

            {/* Compiled Tab */}
            <TabsContent value="compiled" className="m-0 p-4">
              <CompiledOutputsPanel 
                prdData={prdData} 
                projectName={projectName}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgenticPrdRenderer;
