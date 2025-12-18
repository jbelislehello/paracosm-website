import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, ArrowRight, ArrowLeft, Check, Edit3, FileText, Sprout, Gem, BookOpen, Landmark, Music, CheckCircle2, Circle, Download, Shield, AlertCircle, Eye, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PrdStageProgress, { PrdLayer } from './PrdStageProgress';
import StackFormation from './StackFormation';
import { Progress } from '@/components/ui/progress';
import { FeminineSafePRD } from '@/components/journal/FeminineSafePRD';
import { PRD_STAGES, PrdStage } from '@/types/journal-expansion';

interface PolenEntry {
  id: string;
  content: string;
  tile_id: number | null;
  tags: string[];
  created_at: string;
}

interface PrdGeneratorWizardProps {
  isOpen: boolean;
  onClose: () => void;
  cycleId?: string;
  polenEntries: PolenEntry[];
  board: string;
  projectId?: string | null;
  onPrdCreated?: (prdId: string) => void;
}

interface GeneratedContent {
  // POLLENS Layer - Relational & Cultural Aspirations
  pollens_aspirations?: string;
  pollens_team_dynamics?: string;
  pollens_cultural_elements?: string;
  pollens_relational_patterns?: string;
  pollens_constraints?: string;
  pollens_stakes?: string;
  // NOEMS Layer - Conceptual Ideation
  noems_concepts?: string;
  noems_shared_ideas?: string;
  noems_intuitions?: string;
  noems_mental_models?: string;
  // POEMS Layer - P.O.E.M.S. Experiential Design
  poems_people?: string;
  poems_objects?: string;
  poems_environments?: string;
  poems_messages?: string;
  poems_systems?: string;
  poems_prototypes?: string;
  // TOTEMS Layer - Technical Infrastructure
  totems_data_architecture?: string;
  totems_security_policies?: string;
  totems_access_controls?: string;
  totems_system_requirements?: string;
  totems_integration_points?: string;
  totems_technical_debt?: string;
  // ANTHEMS Layer - Market & Storytelling
  anthems_market_positioning?: string;
  anthems_brand_narrative?: string;
  anthems_go_to_market?: string;
  anthems_audience_segments?: string;
  anthems_success_signals?: string;
  anthems_storytelling_assets?: string;
  // COMPILATION: Stack Implications per layer
  stack_implications_pollens?: string;
  stack_implications_noems?: string;
  stack_implications_poems?: string;
  stack_implications_totems?: string;
  stack_implications_anthems?: string;
  // COMPILATION: Prompt Hooks per layer
  prompt_hooks_pollens?: string;
  prompt_hooks_noems?: string;
  prompt_hooks_poems?: string;
  prompt_hooks_totems?: string;
  prompt_hooks_anthems?: string;
}

const LAYER_FIELDS: Record<PrdLayer, (keyof GeneratedContent)[]> = {
  POLLENS: ['pollens_aspirations', 'pollens_team_dynamics', 'pollens_cultural_elements', 'pollens_relational_patterns', 'pollens_constraints', 'pollens_stakes', 'stack_implications_pollens', 'prompt_hooks_pollens'],
  NOEMS: ['noems_concepts', 'noems_shared_ideas', 'noems_intuitions', 'noems_mental_models', 'stack_implications_noems', 'prompt_hooks_noems'],
  POEMS: ['poems_people', 'poems_objects', 'poems_environments', 'poems_messages', 'poems_systems', 'poems_prototypes', 'stack_implications_poems', 'prompt_hooks_poems'],
  TOTEMS: ['totems_data_architecture', 'totems_security_policies', 'totems_access_controls', 'totems_system_requirements', 'totems_integration_points', 'totems_technical_debt', 'stack_implications_totems', 'prompt_hooks_totems'],
  ANTHEMS: ['anthems_market_positioning', 'anthems_brand_narrative', 'anthems_go_to_market', 'anthems_audience_segments', 'anthems_success_signals', 'anthems_storytelling_assets', 'stack_implications_anthems', 'prompt_hooks_anthems']
};

const FIELD_LABELS: Record<string, { label: string; description: string }> = {
  // POLLENS - Relational & Cultural Aspirations
  pollens_aspirations: { label: 'Aspirations', description: 'Individual, team, and organizational aspirations with emotional texture' },
  pollens_team_dynamics: { label: 'Team Dynamics', description: 'Patterns in collaboration, communication, and conflict resolution' },
  pollens_cultural_elements: { label: 'Cultural Elements', description: 'Values, norms, rituals, and unwritten rules at play' },
  pollens_relational_patterns: { label: 'Relational Patterns', description: 'Key relationships and their dynamics' },
  pollens_constraints: { label: 'Constraints', description: 'Cultural, relational, and organizational barriers' },
  pollens_stakes: { label: 'Stakes', description: 'What happens to relationships and culture if nothing changes' },
  // NOEMS - Conceptual Ideation
  noems_concepts: { label: 'Crystallized Concepts', description: 'Emerging concepts with maturity levels (seed/growing/ripe)' },
  noems_shared_ideas: { label: 'Shared Ideas', description: 'Ideas emerging from multiple tensions' },
  noems_intuitions: { label: 'Intuitions', description: 'Gut feelings worth tracking' },
  noems_mental_models: { label: 'Mental Models', description: 'Assumptions and frameworks shaping problem understanding' },
  // POEMS - P.O.E.M.S. Framework
  poems_people: { label: '👤 People', description: 'User personas, stakeholders, needs, behaviors, contexts' },
  poems_objects: { label: '📦 Objects', description: 'Physical/digital artifacts, products, tools, interfaces' },
  poems_environments: { label: '🌍 Environments', description: 'Physical spaces, digital contexts, social settings' },
  poems_messages: { label: '💬 Messages', description: 'Information flows, notifications, feedback, communications' },
  poems_systems: { label: '⚙️ Systems', description: 'Processes, services, technical components' },
  poems_prototypes: { label: '🎨 Prototypes', description: 'UI mockups, interaction flows, ontological design patterns' },
  // TOTEMS - Technical Infrastructure
  totems_data_architecture: { label: 'Data Architecture', description: 'Data models, storage, processing pipelines' },
  totems_security_policies: { label: 'Security Policies', description: 'Security requirements, encryption, compliance' },
  totems_access_controls: { label: 'Access Controls', description: 'Role-based access, authentication, authorization' },
  totems_system_requirements: { label: 'System Requirements', description: 'Performance, scalability, reliability needs' },
  totems_integration_points: { label: 'Integration Points', description: 'APIs, third-party services, data flows' },
  totems_technical_debt: { label: 'Technical Debt', description: 'Legacy systems, technical risks, migration needs' },
  // ANTHEMS - Market & Storytelling
  anthems_market_positioning: { label: 'Market Positioning', description: 'Competitive landscape, unique value proposition' },
  anthems_brand_narrative: { label: 'Brand Narrative', description: 'The story we tell, emotional resonance, brand voice' },
  anthems_go_to_market: { label: 'Go-to-Market', description: 'Channels, timing, launch strategy' },
  anthems_audience_segments: { label: 'Audience Segments', description: 'Target personas and how to reach them' },
  anthems_success_signals: { label: 'Success Signals', description: 'Qualitative and quantitative indicators' },
  anthems_storytelling_assets: { label: 'Storytelling Assets', description: 'Taglines, elevator pitch, anthem/manifesto' },
  // COMPILATION: Stack Implications
  stack_implications_pollens: { label: '🔧 Stack Implications', description: 'Constraints, integrations, latency requirements' },
  stack_implications_noems: { label: '🔧 Stack Implications', description: 'Data types, capabilities, candidate components' },
  stack_implications_poems: { label: '🔧 Stack Implications', description: 'UX surface, adapters, session model' },
  stack_implications_totems: { label: '🔧 Stack Implications', description: 'Logging, access control, monitoring' },
  stack_implications_anthems: { label: '🔧 Stack Implications', description: 'MVP vs V2/V3, cost tradeoffs, licensing' },
  // COMPILATION: Prompt Hooks
  prompt_hooks_pollens: { label: '🤖 Prompt Hooks', description: 'Purpose, vibe, user archetypes' },
  prompt_hooks_noems: { label: '🤖 Prompt Hooks', description: 'Ontology, entities, relationships' },
  prompt_hooks_poems: { label: '🤖 Prompt Hooks', description: 'Canonical flows, error states, guardrails' },
  prompt_hooks_totems: { label: '🤖 Prompt Hooks', description: 'Rules, never/always constraints' },
  prompt_hooks_anthems: { label: '🤖 Prompt Hooks', description: 'Phase capabilities, feature flags' }
};

const LAYER_CHECKLIST: Record<PrdLayer, { label: string; check: (content: GeneratedContent) => boolean }[]> = {
  POLLENS: [
    { label: 'Aspirations captured with emotional texture', check: (c) => (c.pollens_aspirations?.length || 0) > 100 },
    { label: 'Team dynamics and culture explored', check: (c) => !!(c.pollens_team_dynamics || c.pollens_cultural_elements) }
  ],
  NOEMS: [
    { label: 'Concepts crystallized with maturity', check: (c) => (c.noems_concepts?.length || 0) > 50 },
    { label: 'Mental models surfaced', check: (c) => !!(c.noems_mental_models || c.noems_intuitions) }
  ],
  POEMS: [
    { label: 'P.O.E.M.S. framework addressed', check: (c) => !!(c.poems_people && c.poems_objects) },
    { label: 'Systems and environments mapped', check: (c) => !!(c.poems_systems || c.poems_environments) }
  ],
  TOTEMS: [
    { label: 'Data architecture defined', check: (c) => (c.totems_data_architecture?.length || 0) > 50 },
    { label: 'Security and access controls specified', check: (c) => !!(c.totems_security_policies || c.totems_access_controls) }
  ],
  ANTHEMS: [
    { label: 'Market positioning defined', check: (c) => (c.anthems_market_positioning?.length || 0) > 50 },
    { label: 'Brand narrative crafted', check: (c) => (c.anthems_brand_narrative?.length || 0) > 50 },
    { label: 'Storytelling assets created', check: (c) => (c.anthems_storytelling_assets?.length || 0) > 30 }
  ]
};

const LAYERS: PrdLayer[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const LAYER_ICONS: Record<PrdLayer, React.ElementType> = {
  POLLENS: Sprout,
  NOEMS: Gem,
  POEMS: BookOpen,
  TOTEMS: Landmark,
  ANTHEMS: Music
};

const getStageForLayer = (layer: PrdLayer): PrdStage => {
  if (layer === 'POLLENS' || layer === 'NOEMS') return 'real-intelligence';
  if (layer === 'POEMS') return 'knowledge-objects';
  return 'understanding';
};

const PrdGeneratorWizard = ({
  isOpen,
  onClose,
  cycleId,
  polenEntries,
  board,
  projectId,
  onPrdCreated
}: PrdGeneratorWizardProps) => {
  const [currentLayer, setCurrentLayer] = useState<PrdLayer>('POLLENS');
  const [completedLayers, setCompletedLayers] = useState<PrdLayer[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(`Calm Magic PRD — ${board} Cycle — ${new Date().toLocaleDateString()}`);
  const [content, setContent] = useState<GeneratedContent>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showQualityReview, setShowQualityReview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  const { toast } = useToast();

  const hasAnyContent = LAYERS.some(layer => 
    LAYER_FIELDS[layer].some(field => {
      const value = content[field];
      return typeof value === 'string' && value.trim();
    })
  );

  // Progress calculations
  const contentFields = LAYERS.flatMap(layer => 
    LAYER_FIELDS[layer].filter(f => !f.startsWith('stack_') && !f.startsWith('prompt_'))
  );
  const totalFields = contentFields.length;
  const filledFields = contentFields.filter(field => {
    const value = content[field];
    return typeof value === 'string' && value.trim();
  }).length;
  const progressPercentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  const layerProgress = LAYERS.map(layer => {
    const layerContentFields = LAYER_FIELDS[layer].filter(f => !f.startsWith('stack_') && !f.startsWith('prompt_'));
    const filled = layerContentFields.filter(f => {
      const value = content[f];
      return typeof value === 'string' && value.trim();
    }).length;
    const total = layerContentFields.length;
    return { layer, filled, total, percentage: total > 0 ? Math.round((filled / total) * 100) : 0 };
  });

  const handleCopyPreview = () => {
    const markdown = LAYERS.map(layer => {
      const LayerIcon = LAYER_ICONS[layer];
      const layerContent = LAYER_FIELDS[layer]
        .filter(field => content[field])
        .map(field => `### ${FIELD_LABELS[field].label}\n${content[field]}`)
        .join('\n\n');
      
      return layerContent ? `## ${layer}\n\n${layerContent}` : `## ${layer}\n\n*Not generated yet*`;
    }).join('\n\n---\n\n');

    navigator.clipboard.writeText(`# ${title}\n\n${markdown}`);
    toast({
      title: 'Copied to clipboard',
      description: 'PRD preview copied as markdown.'
    });
  };

  const currentIndex = LAYERS.indexOf(currentLayer);
  const isFirstLayer = currentIndex === 0;
  const isLastLayer = currentIndex === LAYERS.length - 1;
  const CurrentIcon = LAYER_ICONS[currentLayer];
  const currentStage = getStageForLayer(currentLayer);

  const generateLayerContent = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prd-stage', {
        body: {
          layer: currentLayer,
          polenEntries: polenEntries.map(p => ({
            content: p.content,
            tile_id: p.tile_id,
            tags: p.tags
          })),
          board,
          existingContent: content
        }
      });

      if (error) throw error;

      setContent(prev => ({ ...prev, ...data.content }));
      
      toast({
        title: 'Content generated',
        description: `${currentLayer} layer content is ready for review.`
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: 'Could not generate content. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const layerHasContent = () => {
    const fields = LAYER_FIELDS[currentLayer];
    return fields.some(field => content[field]);
  };

  const handleNext = () => {
    if (!layerHasContent()) {
      toast({
        title: 'Generate content first',
        description: 'Please generate or add content before proceeding.',
        variant: 'destructive'
      });
      return;
    }

    setCompletedLayers(prev => [...prev, currentLayer]);
    
    if (!isLastLayer) {
      setCurrentLayer(LAYERS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (!isFirstLayer) {
      setCurrentLayer(LAYERS[currentIndex - 1]);
    }
  };

  const handleSavePrd = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const prdData = {
        owner_id: user.id,
        project_id: projectId || null,
        title,
        status: 'draft',
        prototype_stage: 'B_DIEGETIC',
        main_board: board as any,
        // POLLENS → love fields
        love_signals_summary: content.pollens_aspirations,
        love_decision_to_exist: `Team Dynamics: ${content.pollens_team_dynamics || ''}\n\nCultural: ${content.pollens_cultural_elements || ''}\n\nRelational: ${content.pollens_relational_patterns || ''}\n\nStakes: ${content.pollens_stakes || ''}`,
        // POEMS → magic storyworld and open workflow
        magic_storyworld: content.poems_people,
        open_real_workflow: content.poems_systems,
        // NOEMS → magic fields
        magic_prd_outline: content.noems_concepts,
        magic_hypotheses: content.noems_shared_ideas,
        magic_patterns: content.noems_intuitions,
        // TOTEMS → calm and open fields
        calm_requirements: content.totems_data_architecture,
        calm_risks_and_limits: `Security: ${content.totems_security_policies || ''}\n\nAccess: ${content.totems_access_controls || ''}\n\nRequirements: ${content.totems_system_requirements || ''}`,
        open_ontology_and_graph: content.totems_integration_points,
        // ANTHEMS → free fields
        open_adjustment_plan: content.anthems_storytelling_assets,
        free_first_poem_description: content.anthems_go_to_market,
        free_totem_anthem: content.anthems_market_positioning,
        free_success_criteria: content.anthems_success_signals,
        free_next_cycle_hooks: content.anthems_brand_narrative,
        // Stack implications & prompt hooks
        stack_implications_pollens: content.stack_implications_pollens,
        stack_implications_noems: content.stack_implications_noems,
        stack_implications_poems: content.stack_implications_poems,
        stack_implications_totems: content.stack_implications_totems,
        stack_implications_anthems: content.stack_implications_anthems,
        prompt_hooks_pollens: content.prompt_hooks_pollens,
        prompt_hooks_noems: content.prompt_hooks_noems,
        prompt_hooks_poems: content.prompt_hooks_poems,
        prompt_hooks_totems: content.prompt_hooks_totems,
        prompt_hooks_anthems: content.prompt_hooks_anthems,
      };

      const { data: prd, error } = await supabase
        .from('prds')
        .insert(prdData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Calm Magic PRD Created!',
        description: 'Your 5-layer PRD has been saved.'
      });

      onPrdCreated?.(prd.id);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save PRD. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof GeneratedContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const checklistItems = LAYER_CHECKLIST[currentLayer];
  const checklistComplete = checklistItems.every(item => item.check(content));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <CurrentIcon className="w-5 h-5" />
              Calm Magic PRD Generator
              <Badge 
                variant="outline"
                className={`ml-2 text-xs ${
                  polenEntries.length === 0 
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' 
                    : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                }`}
              >
                <Sprout className="w-3 h-3 mr-1" />
                {polenEntries.length} fragment{polenEntries.length !== 1 ? 's' : ''} available
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFullPreview(true)}
                disabled={!hasAnyContent}
                className="ml-2"
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview PRD
              </Button>
            </DialogTitle>
            
            <div className="flex items-center gap-1">
              {LAYERS.map((layer, idx) => {
                const isCompleted = completedLayers.includes(layer);
                const isCurrent = layer === currentLayer;
                const LayerIcon = LAYER_ICONS[layer];
                const canNavigate = isCompleted || isCurrent || idx <= completedLayers.length;
                
                return (
                  <button
                    key={layer}
                    onClick={() => canNavigate && setCurrentLayer(layer)}
                    disabled={!canNavigate}
                    className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                      isCompleted ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : isCurrent ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' 
                        : canNavigate ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                        : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                    }`}
                    title={layer}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : <LayerIcon className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
          
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 font-medium"
            placeholder="PRD Title..."
          />
        </DialogHeader>

        {polenEntries.length === 0 && (
          <Card className="p-3 bg-amber-500/10 border-amber-500/30 flex-shrink-0 mt-2">
            <p className="text-sm text-amber-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              No POLEN fragments captured yet. Visit tiles and capture insights first for richer PRD generation.
            </p>
          </Card>
        )}

        <div className="flex-shrink-0 py-4 border-b">
          <PrdStageProgress currentLayer={currentLayer} completedLayers={completedLayers} />
        </div>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Main Content */}
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-4 pr-4">
              {currentLayer === 'POLLENS' && !layerHasContent() && (
                <Card className="p-4 bg-amber-500/10 border-amber-500/30">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Raw signals from your cycle ({polenEntries.length} entries)
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {polenEntries.slice(0, 5).map(polen => (
                      <div key={polen.id} className="text-xs p-2 bg-background rounded border">
                        {polen.content.slice(0, 100)}...
                      </div>
                    ))}
                    {polenEntries.length > 5 && (
                      <div className="text-xs text-muted-foreground">+{polenEntries.length - 5} more</div>
                    )}
                  </div>
                </Card>
              )}

              {LAYER_FIELDS[currentLayer].map(field => {
                const fieldInfo = FIELD_LABELS[field];
                const value = content[field] || '';
                const isEditing = editingField === field;

                return (
                  <Card key={field} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{fieldInfo.label}</h4>
                        <p className="text-xs text-muted-foreground">{fieldInfo.description}</p>
                      </div>
                      {value && (
                        <Button size="sm" variant="ghost" onClick={() => setEditingField(isEditing ? null : field)}>
                          {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        </Button>
                      )}
                    </div>
                    
                    {value ? (
                      isEditing ? (
                        <Textarea value={value} onChange={(e) => updateField(field, e.target.value)} className="min-h-[100px]" />
                      ) : (
                        <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{value}</div>
                      )
                    ) : (
                      <div className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded-lg border-2 border-dashed">
                        Content will be generated...
                      </div>
                    )}
                  </Card>
                );
              })}

              <Card className="p-4 border-dashed">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {currentLayer} Checklist
                </h4>
                <div className="space-y-2">
                  {checklistItems.map((item, idx) => {
                    const isChecked = item.check(content);
                    return (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {isChecked ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                        <span className={isChecked ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </ScrollArea>

          {/* Side Panel */}
          <div className="w-72 flex-shrink-0 space-y-4 overflow-y-auto">
            <StackFormation completedLayers={completedLayers} currentLayer={currentLayer} />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowQualityReview(!showQualityReview)}
            >
              <Shield className="w-4 h-4 mr-2" />
              {showQualityReview ? 'Hide' : 'Show'} Quality Review
            </Button>
            
            {showQualityReview && (
              <FeminineSafePRD reviewMode currentStage={currentStage} showAntiPatterns={false} />
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleBack} disabled={isFirstLayer}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button onClick={generateLayerContent} disabled={generating} variant="outline">
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate {currentLayer}
            </Button>

            {isLastLayer && completedLayers.length === LAYERS.length - 1 ? (
              <Button onClick={handleSavePrd} disabled={saving || !layerHasContent()}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save PRD
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!layerHasContent()}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>

      <Sheet open={showFullPreview} onOpenChange={setShowFullPreview}>
        <SheetContent className="w-full max-w-2xl overflow-y-auto">
          <SheetHeader className="space-y-4">
            <SheetTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              PRD Preview (Work in Progress)
            </SheetTitle>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Completion</span>
                <span className={`font-semibold ${
                  progressPercentage === 100 ? 'text-emerald-600' : 
                  progressPercentage >= 50 ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  {progressPercentage}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {filledFields} of {totalFields} fields completed • {completedLayers.length} of {LAYERS.length} layers
              </p>
            </div>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(100vh-150px)] pr-4">
            <div className="space-y-6 py-4">
              {LAYERS.map(layer => {
                const LayerIcon = LAYER_ICONS[layer];
                const isCompleted = completedLayers.includes(layer);
                const layerFields = LAYER_FIELDS[layer].filter(f => !f.startsWith('stack_') && !f.startsWith('prompt_'));
                const hasContent = layerFields.some(f => content[f]);
                
                return (
                  <div key={layer} className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
                      <LayerIcon className="w-5 h-5" />
                      {layer}
                      <span className={`text-xs ml-auto ${
                        layerProgress.find(lp => lp.layer === layer)?.percentage === 100 ? 'text-emerald-600' :
                        (layerProgress.find(lp => lp.layer === layer)?.percentage || 0) > 0 ? 'text-blue-600' : 'text-muted-foreground'
                      }`}>
                        {layerProgress.find(lp => lp.layer === layer)?.percentage || 0}%
                      </span>
                      {isCompleted && <Check className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    
                    {hasContent ? (
                      layerFields.map(field => {
                        const value = content[field];
                        if (!value) return null;
                        const displayValue = typeof value === 'string' 
                          ? value 
                          : JSON.stringify(value, null, 2);
                        return (
                          <div key={field} className="bg-muted/30 p-3 rounded-lg text-sm">
                            <p className="font-medium text-xs text-muted-foreground mb-1">
                              {FIELD_LABELS[field].label}
                            </p>
                            <p className="whitespace-pre-wrap">{displayValue}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground italic py-2">Not generated yet</p>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={handleCopyPreview} className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy as Markdown
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Dialog>
  );
};

export default PrdGeneratorWizard;
