import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, ArrowRight, ArrowLeft, Check, Edit3, FileText, Sprout, BookOpen, Shapes, Flag, Rocket, CheckCircle2, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PrdStageProgress, { PrdLayer } from './PrdStageProgress';

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
  cycleId: string;
  polenEntries: PolenEntry[];
  board: string;
  onPrdCreated: (prdId: string) => void;
}

interface GeneratedContent {
  // POLLEN Layer
  pollen_observations?: string;
  pollen_constraints?: string;
  pollen_emotional_climate?: string;
  // POEM Layer
  poem_user_journeys?: string;
  poem_hypotheses?: string;
  poem_thematic_anchors?: string;
  // TOTEM Layer
  totem_core_flows?: string;
  totem_ontology?: string;
  totem_system_boundaries?: string;
  // ANTHEM Layer
  anthem_success_metrics?: string;
  anthem_guardrails?: string;
  anthem_strategic_alignment?: string;
  // EXECUTION Layer
  exec_milestones?: string;
  exec_responsibility_map?: string;
  exec_learning_cadence?: string;
}

const LAYER_FIELDS: Record<PrdLayer, (keyof GeneratedContent)[]> = {
  POLLEN: ['pollen_observations', 'pollen_constraints', 'pollen_emotional_climate'],
  POEM: ['poem_user_journeys', 'poem_hypotheses', 'poem_thematic_anchors'],
  TOTEM: ['totem_core_flows', 'totem_ontology', 'totem_system_boundaries'],
  ANTHEM: ['anthem_success_metrics', 'anthem_guardrails', 'anthem_strategic_alignment'],
  EXECUTION: ['exec_milestones', 'exec_responsibility_map', 'exec_learning_cadence']
};

const FIELD_LABELS: Record<string, { label: string; description: string }> = {
  // POLLEN
  pollen_observations: { label: 'Raw Observations & Glitches', description: 'Tensions, complaints, weird use cases, quotes from users/stakeholders' },
  pollen_constraints: { label: 'Constraints', description: 'Legal, ethical, financial, technical constraints' },
  pollen_emotional_climate: { label: 'Emotional Climate', description: 'Fears, hopes, invisible stakes, what hurts/excites people now' },
  // POEM
  poem_user_journeys: { label: 'User Journeys', description: 'Short stories: before → during → after interactions' },
  poem_hypotheses: { label: 'Hypotheses', description: '"We believe that..." statements about behavior/emotion/cognition shifts' },
  poem_thematic_anchors: { label: 'Thematic Anchors', description: 'Core themes: curiosity, confidence, play, trust, etc.' },
  // TOTEM
  totem_core_flows: { label: 'Core Flows & Screens', description: 'Service blueprints, information architecture, what people touch/see/feel' },
  totem_ontology: { label: 'Ontological Backbone', description: 'Entities, concepts, relationships that define this product' },
  totem_system_boundaries: { label: 'System Boundaries', description: 'What this product explicitly does NOT do' },
  // ANTHEM
  anthem_success_metrics: { label: 'Success Metrics', description: 'Qualitative and quantitative signals of success' },
  anthem_guardrails: { label: 'Guardrails', description: 'Ethics, compliance, well-being, ecological and social impact' },
  anthem_strategic_alignment: { label: 'Strategic Alignment', description: 'How this supports the organization\'s story and your paracosm' },
  // EXECUTION
  exec_milestones: { label: 'Milestones & Releases', description: 'Now / Next / Later roadmap, sprints, releases' },
  exec_responsibility_map: { label: 'Responsibility Map', description: 'RACI, roles, circles, who needs to be in the room' },
  exec_learning_cadence: { label: 'Learning Cadence', description: 'Demos, retros, drift sessions, time for reflection' }
};

// Checklist requirements per layer
const LAYER_CHECKLIST: Record<PrdLayer, { label: string; check: (content: GeneratedContent) => boolean }[]> = {
  POLLEN: [
    { label: '5–15 tensions/glitches captured', check: (c) => (c.pollen_observations?.length || 0) > 100 },
    { label: 'Constraints & stakes named', check: (c) => !!(c.pollen_constraints && c.pollen_emotional_climate) }
  ],
  POEM: [
    { label: '1–3 narrative arcs described', check: (c) => (c.poem_user_journeys?.length || 0) > 100 },
    { label: 'Emotions & symbolic roles identified', check: (c) => !!(c.poem_thematic_anchors) }
  ],
  TOTEM: [
    { label: 'Minimal ontology defined', check: (c) => (c.totem_ontology?.length || 0) > 50 },
    { label: 'Smallest coherent experience defined', check: (c) => (c.totem_core_flows?.length || 0) > 50 }
  ],
  ANTHEM: [
    { label: '3–5 success signals defined', check: (c) => (c.anthem_success_metrics?.length || 0) > 50 },
    { label: '3–5 guardrails defined', check: (c) => (c.anthem_guardrails?.length || 0) > 50 },
    { label: 'Strategic alignment articulated', check: (c) => (c.anthem_strategic_alignment?.length || 0) > 50 }
  ],
  EXECUTION: [
    { label: 'Simple roadmap (now/next/later)', check: (c) => (c.exec_milestones?.length || 0) > 50 },
    { label: 'Named owner(s) and rituals', check: (c) => !!(c.exec_responsibility_map && c.exec_learning_cadence) }
  ]
};

const LAYERS: PrdLayer[] = ['POLLEN', 'POEM', 'TOTEM', 'ANTHEM', 'EXECUTION'];

const LAYER_ICONS: Record<PrdLayer, React.ElementType> = {
  POLLEN: Sprout,
  POEM: BookOpen,
  TOTEM: Shapes,
  ANTHEM: Flag,
  EXECUTION: Rocket
};

const PrdGeneratorWizard = ({
  isOpen,
  onClose,
  cycleId,
  polenEntries,
  board,
  onPrdCreated
}: PrdGeneratorWizardProps) => {
  const [currentLayer, setCurrentLayer] = useState<PrdLayer>('POLLEN');
  const [completedLayers, setCompletedLayers] = useState<PrdLayer[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(`Calm Magic PRD — ${board} Cycle — ${new Date().toLocaleDateString()}`);
  const [content, setContent] = useState<GeneratedContent>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  
  const { toast } = useToast();

  const currentIndex = LAYERS.indexOf(currentLayer);
  const isFirstLayer = currentIndex === 0;
  const isLastLayer = currentIndex === LAYERS.length - 1;
  const CurrentIcon = LAYER_ICONS[currentLayer];

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

      // Map new layer fields to existing PRD database columns
      const prdData = {
        owner_id: user.id,
        title,
        status: 'draft',
        prototype_stage: 'B_DIEGETIC',
        main_board: board as any,
        // POLLEN → LOVE columns
        love_signals_summary: content.pollen_observations,
        love_decision_to_exist: `Constraints: ${content.pollen_constraints || ''}\n\nEmotional Climate: ${content.pollen_emotional_climate || ''}`,
        // POEM → MAGIC columns
        magic_storyworld: content.poem_user_journeys,
        magic_prd_outline: content.poem_thematic_anchors,
        magic_hypotheses: content.poem_hypotheses,
        // TOTEM → CALM columns
        calm_requirements: content.totem_core_flows,
        calm_risks_and_limits: `Ontology: ${content.totem_ontology || ''}\n\nBoundaries: ${content.totem_system_boundaries || ''}`,
        // ANTHEM → OPEN columns
        open_ontology_and_graph: content.anthem_strategic_alignment,
        open_real_workflow: content.anthem_success_metrics,
        open_adjustment_plan: content.anthem_guardrails,
        // EXECUTION → FREE columns
        free_first_poem_description: content.exec_milestones,
        free_totem_anthem: content.exec_responsibility_map,
        free_success_criteria: content.exec_learning_cadence,
        free_next_cycle_hooks: 'Learnings flow back into POLLEN for the next cycle.'
      };

      const { data: prd, error } = await supabase
        .from('prds')
        .insert(prdData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Calm Magic PRD Created!',
        description: 'Your 5-layer PRD has been saved and is ready for use.'
      });

      onPrdCreated(prd.id);
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <CurrentIcon className="w-5 h-5" />
              Calm Magic PRD Generator
            </DialogTitle>
            
            {/* Layer Progress Dots */}
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
                    className={`
                      flex items-center justify-center w-7 h-7 rounded-full transition-all
                      ${isCompleted 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : isCurrent 
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' 
                          : canNavigate
                            ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                            : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                      }
                      ${canNavigate && !isCurrent ? 'cursor-pointer' : ''}
                    `}
                    title={`${layer}${!canNavigate ? ' (complete previous layers first)' : ''}`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <LayerIcon className="w-3.5 h-3.5" />
                    )}
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

        {/* Layer Progress */}
        <div className="flex-shrink-0 py-4 border-b">
          <PrdStageProgress currentLayer={currentLayer} completedLayers={completedLayers} />
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-4">
            {/* POLLEN Preview (for POLLEN layer) */}
            {currentLayer === 'POLLEN' && !layerHasContent() && (
              <Card className="p-4 bg-amber-500/10 border-amber-500/30">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Raw POLLEN from your cycle ({polenEntries.length} entries)
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {polenEntries.slice(0, 5).map(polen => (
                    <div key={polen.id} className="text-xs p-2 bg-background rounded border">
                      {polen.content.slice(0, 100)}...
                    </div>
                  ))}
                  {polenEntries.length > 5 && (
                    <div className="text-xs text-muted-foreground">
                      +{polenEntries.length - 5} more entries
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Layer Fields */}
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingField(isEditing ? null : field)}
                      >
                        {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  
                  {value ? (
                    isEditing ? (
                      <Textarea
                        value={value}
                        onChange={(e) => updateField(field, e.target.value)}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">
                        {value}
                      </div>
                    )
                  ) : (
                    <div className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded-lg border-2 border-dashed">
                      Content will be generated...
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Checklist */}
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
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={isChecked ? 'text-foreground' : 'text-muted-foreground'}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstLayer}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={generateLayerContent}
              disabled={generating}
              variant="outline"
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate {currentLayer}
            </Button>

            {isLastLayer && completedLayers.length === LAYERS.length - 1 ? (
              <Button
                onClick={handleSavePrd}
                disabled={saving || !layerHasContent()}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save PRD
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!layerHasContent()}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrdGeneratorWizard;
