import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, ArrowRight, ArrowLeft, Check, Edit3, Save, FileText, Heart, Wand2, Mountain, DoorOpen, Bird } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PrdStageProgress, { PrdLayer } from './PrdStageProgress';
import MasterLensEvaluator, { LensEvaluation, MapsEvaluation, AgendasEvaluation, ChordsEvaluation } from './MasterLensEvaluator';
import PoemStructureBuilder, { PoemStructure } from './PoemStructureBuilder';

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
  // LOVE Layer
  love_vitality_map?: string;
  love_resonance_notes?: string;
  love_score?: string;
  // MAGIC Layer
  magic_compass_map?: string;
  magic_pattern_geometry?: string;
  magic_contradictions?: string;
  // CALM Layer
  calm_lens_evaluation?: string;
  calm_maps_diagram?: string;
  calm_governance?: string;
  // OPEN Layer
  open_emergence_map?: string;
  open_prototype_notes?: string;
  open_ontology_tuning?: string;
  // FREE Layer
  free_insight_synthesis?: string;
  free_expanded_ontology?: string;
  free_integration_blueprint?: string;
}

const LAYER_FIELDS: Record<PrdLayer, (keyof GeneratedContent)[]> = {
  LOVE: ['love_vitality_map', 'love_resonance_notes', 'love_score'],
  MAGIC: ['magic_compass_map', 'magic_pattern_geometry', 'magic_contradictions'],
  CALM: ['calm_lens_evaluation', 'calm_maps_diagram', 'calm_governance'],
  OPEN: ['open_emergence_map', 'open_prototype_notes', 'open_ontology_tuning'],
  FREE: ['free_insight_synthesis', 'free_expanded_ontology', 'free_integration_blueprint']
};

const FIELD_LABELS: Record<string, { label: string; description: string }> = {
  love_vitality_map: { label: 'Vitality Map', description: 'The energy and life force of this idea' },
  love_resonance_notes: { label: 'Resonance Notes', description: 'What resonates deeply' },
  love_score: { label: 'LOVE Score', description: 'Longevity, Oscillations, Velocity, Elasticity' },
  magic_compass_map: { label: '5-Compass Map', description: 'Narratives, Workflows, Inquiry, Playground, Human Dynamics' },
  magic_pattern_geometry: { label: 'Pattern Geometry', description: 'Seasons, Constellations, Transitions' },
  magic_contradictions: { label: 'Early Contradictions', description: 'Tensions and paradoxes to hold' },
  calm_lens_evaluation: { label: 'LENS Evaluation', description: 'Landscape, Energy, Norms, Synergies' },
  calm_maps_diagram: { label: 'MAPS Diagram', description: 'Methods, Architecture, Protocols, Systems' },
  calm_governance: { label: 'Governance Protocol', description: 'Window of Tolerance framework' },
  open_emergence_map: { label: 'Emergence Map', description: 'What wants to be born' },
  open_prototype_notes: { label: 'Prototype Notes', description: 'First rapid prototype insights' },
  open_ontology_tuning: { label: 'Ontological Tuning', description: 'Adjusting categories and relationships' },
  free_insight_synthesis: { label: 'Insight Synthesis', description: 'What has been realized' },
  free_expanded_ontology: { label: 'Expanded Ontology', description: 'New understanding structure' },
  free_integration_blueprint: { label: 'Integration Blueprint', description: 'How to embed in the OS' }
};

const LAYERS: PrdLayer[] = ['LOVE', 'MAGIC', 'CALM', 'OPEN', 'FREE'];

const LAYER_ICONS: Record<PrdLayer, React.ElementType> = {
  LOVE: Heart,
  MAGIC: Wand2,
  CALM: Mountain,
  OPEN: DoorOpen,
  FREE: Bird
};

const PrdGeneratorWizard = ({
  isOpen,
  onClose,
  cycleId,
  polenEntries,
  board,
  onPrdCreated
}: PrdGeneratorWizardProps) => {
  const [currentLayer, setCurrentLayer] = useState<PrdLayer>('LOVE');
  const [completedLayers, setCompletedLayers] = useState<PrdLayer[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(`Calm Magic PRD — ${board} Cycle — ${new Date().toLocaleDateString()}`);
  const [content, setContent] = useState<GeneratedContent>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  
  // Master Lens Evaluations
  const [lens, setLens] = useState<LensEvaluation>({ landscape: '', energy: '', norms: '', synergies: '' });
  const [maps, setMaps] = useState<MapsEvaluation>({ methods: '', architecture: '', protocols: '', systems: '' });
  const [agendas, setAgendas] = useState<AgendasEvaluation>({ analysis: '', guidelines: '', elaboration: '', normalization: '', development: '', adaptation: '', secrets: '' });
  const [chords, setChords] = useState<ChordsEvaluation>({ chances: '', heart: '', observer: '', reversal: '', design: '', seeds: '' });
  
  // POEM Structure
  const [poem, setPoem] = useState<PoemStructure>({ people: '', objects: '', environments: '', messages: '', systems: '' });
  
  // TOTEM & ANTHEM
  const [totem, setTotem] = useState('');
  const [anthem, setAnthem] = useState('');
  
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
          existingContent: content,
          masterLens: { lens, maps, agendas, chords }
        }
      });

      if (error) throw error;

      setContent(prev => ({ ...prev, ...data.content }));
      
      // Auto-fill master lens if provided
      if (data.masterLens) {
        if (data.masterLens.lens) setLens(prev => ({ ...prev, ...data.masterLens.lens }));
        if (data.masterLens.maps) setMaps(prev => ({ ...prev, ...data.masterLens.maps }));
        if (data.masterLens.agendas) setAgendas(prev => ({ ...prev, ...data.masterLens.agendas }));
        if (data.masterLens.chords) setChords(prev => ({ ...prev, ...data.masterLens.chords }));
      }
      
      // Auto-fill POEM if on FREE layer
      if (currentLayer === 'FREE' && data.poem) {
        setPoem(prev => ({ ...prev, ...data.poem }));
      }
      
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

      // Map new layer fields to existing PRD columns
      const prdData = {
        owner_id: user.id,
        title,
        status: 'draft',
        prototype_stage: 'D_MVP',
        main_board: board as any,
        // LOVE layer
        love_signals_summary: content.love_vitality_map,
        love_decision_to_exist: content.love_resonance_notes,
        // MAGIC layer
        magic_storyworld: content.magic_compass_map,
        magic_prd_outline: content.magic_pattern_geometry,
        magic_hypotheses: content.magic_contradictions,
        // CALM layer
        calm_requirements: content.calm_lens_evaluation,
        calm_risks_and_limits: content.calm_governance,
        // OPEN layer
        open_ontology_and_graph: content.open_emergence_map,
        open_real_workflow: content.open_prototype_notes,
        open_adjustment_plan: content.open_ontology_tuning,
        // FREE layer
        free_first_poem_description: JSON.stringify(poem),
        free_totem_anthem: `TOTEM: ${totem}\n\nANTHEM: ${anthem}`,
        free_success_criteria: content.free_insight_synthesis,
        free_next_cycle_hooks: content.free_integration_blueprint
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

  const handleMasterLensUpdate = (type: 'lens' | 'maps' | 'agendas' | 'chords', data: any) => {
    switch (type) {
      case 'lens': setLens(data); break;
      case 'maps': setMaps(data); break;
      case 'agendas': setAgendas(data); break;
      case 'chords': setChords(data); break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <CurrentIcon className="w-5 h-5" />
              Calm Magic PRD Generator
            </DialogTitle>
            <Badge variant="outline" className="ml-2">
              {polenEntries.length} POLEN • 5 Layers
            </Badge>
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
            {/* POLEN Preview (for LOVE layer) */}
            {currentLayer === 'LOVE' && !layerHasContent() && (
              <Card className="p-4 bg-rose-500/10 border-rose-500/30">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  POLEN from your cycle ({polenEntries.length} entries)
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

            {/* Master Lens Evaluator (for CALM layer) */}
            {currentLayer === 'CALM' && (
              <MasterLensEvaluator
                lens={lens}
                maps={maps}
                agendas={agendas}
                chords={chords}
                onUpdate={handleMasterLensUpdate}
              />
            )}

            {/* POEM Structure Builder (for FREE layer) */}
            {currentLayer === 'FREE' && (
              <>
                <PoemStructureBuilder
                  poem={poem}
                  onUpdate={setPoem}
                />
                
                {/* TOTEM & ANTHEM */}
                <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-purple-500/20">
                  <h4 className="font-semibold text-sm mb-4">TOTEM & ANTHEM</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-purple-500/10">TOTEM</Badge>
                        <span className="text-xs text-muted-foreground">How does this become a ritual reference?</span>
                      </div>
                      <Textarea
                        value={totem}
                        onChange={(e) => setTotem(e.target.value)}
                        placeholder="Describe how this system becomes a reference point, a repeatable ritual..."
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-indigo-500/10">ANTHEM</Badge>
                        <span className="text-xs text-muted-foreground">How does this become culture?</span>
                      </div>
                      <Textarea
                        value={anthem}
                        onChange={(e) => setAnthem(e.target.value)}
                        placeholder="Describe how this system becomes cultural practice, collective resonance..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstLayer}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={generateLayerContent}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {generating ? 'Generating...' : 'Generate with AI'}
            </Button>

            {isLastLayer ? (
              <Button
                onClick={handleSavePrd}
                disabled={saving || !layerHasContent()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Calm Magic PRD
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!layerHasContent()}
              >
                Next Layer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrdGeneratorWizard;
