import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, ArrowRight, ArrowLeft, Check, Edit3, Save, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PrdStageProgress, { PrdStage } from './PrdStageProgress';

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
  love_signals_summary?: string;
  love_decision_to_exist?: string;
  magic_storyworld?: string;
  magic_prd_outline?: string;
  magic_hypotheses?: string;
  calm_requirements?: string;
  calm_risks_and_limits?: string;
  open_ontology_and_graph?: string;
  open_real_workflow?: string;
  open_adjustment_plan?: string;
  free_first_poem_description?: string;
  free_totem_anthem?: string;
  free_success_criteria?: string;
  free_next_cycle_hooks?: string;
}

const STAGE_FIELDS: Record<PrdStage, (keyof GeneratedContent)[]> = {
  A_POIETIC: ['love_signals_summary', 'love_decision_to_exist'],
  B_DIEGETIC: ['magic_storyworld', 'magic_prd_outline', 'magic_hypotheses'],
  C_OPERATIONAL: ['calm_requirements', 'calm_risks_and_limits', 'open_ontology_and_graph', 'open_real_workflow', 'open_adjustment_plan'],
  D_MVP: ['free_first_poem_description', 'free_totem_anthem', 'free_success_criteria', 'free_next_cycle_hooks']
};

const FIELD_LABELS: Record<string, { label: string; description: string }> = {
  love_signals_summary: { label: 'Signals Summary', description: 'Synthesized narrative of tensions & glitches' },
  love_decision_to_exist: { label: 'Decision to Exist', description: 'Is this worth existing?' },
  magic_storyworld: { label: 'Storyworld', description: 'Diegetic story tying glitches into narrative' },
  magic_prd_outline: { label: 'PRD Outline', description: 'Features/flows from recurring patterns' },
  magic_hypotheses: { label: 'Hypotheses', description: '"We believe that..." statements' },
  calm_requirements: { label: 'Requirements', description: 'Constraints and specifications' },
  calm_risks_and_limits: { label: 'Risks & Limits', description: 'Non-negotiables and potential risks' },
  open_ontology_and_graph: { label: 'Ontology & Graph', description: 'Entities, relationships, and structure' },
  open_real_workflow: { label: 'Real Workflow', description: 'How it works in practice' },
  open_adjustment_plan: { label: 'Adjustment Plan', description: 'How to tune to match reality' },
  free_first_poem_description: { label: 'First POEM', description: 'People, Objects, Environments, Messages, Systems' },
  free_totem_anthem: { label: 'Totem & Anthem', description: 'How it becomes ritual and culture' },
  free_success_criteria: { label: 'Success Criteria', description: 'What success looks like' },
  free_next_cycle_hooks: { label: 'Next Cycle Hooks', description: 'Learnings for next iteration' }
};

const STAGES: PrdStage[] = ['A_POIETIC', 'B_DIEGETIC', 'C_OPERATIONAL', 'D_MVP'];

const PrdGeneratorWizard = ({
  isOpen,
  onClose,
  cycleId,
  polenEntries,
  board,
  onPrdCreated
}: PrdGeneratorWizardProps) => {
  const [currentStage, setCurrentStage] = useState<PrdStage>('A_POIETIC');
  const [completedStages, setCompletedStages] = useState<PrdStage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(`PRD from ${board} Cycle - ${new Date().toLocaleDateString()}`);
  const [content, setContent] = useState<GeneratedContent>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const { toast } = useToast();

  const currentIndex = STAGES.indexOf(currentStage);
  const isFirstStage = currentIndex === 0;
  const isLastStage = currentIndex === STAGES.length - 1;

  // Generate content for current stage
  const generateStageContent = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prd-stage', {
        body: {
          stage: currentStage,
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
        description: `Stage ${currentStage.split('_')[0]} content is ready for review.`
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

  // Check if current stage has content
  const stageHasContent = () => {
    const fields = STAGE_FIELDS[currentStage];
    return fields.some(field => content[field]);
  };

  // Move to next stage
  const handleNext = () => {
    if (!stageHasContent()) {
      toast({
        title: 'Generate content first',
        description: 'Please generate or add content before proceeding.',
        variant: 'destructive'
      });
      return;
    }

    setCompletedStages(prev => [...prev, currentStage]);
    
    if (!isLastStage) {
      setCurrentStage(STAGES[currentIndex + 1]);
    }
  };

  // Move to previous stage
  const handleBack = () => {
    if (!isFirstStage) {
      setCurrentStage(STAGES[currentIndex - 1]);
    }
  };

  // Save the final PRD
  const handleSavePrd = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: prd, error } = await supabase
        .from('prds')
        .insert({
          owner_id: user.id,
          title,
          status: 'draft',
          prototype_stage: 'D_MVP',
          main_board: board as any,
          ...content
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'PRD Created!',
        description: 'Your Product Requirements Document has been saved.'
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

  // Update a field
  const updateField = (field: keyof GeneratedContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">PRD Generator</DialogTitle>
            <Badge variant="outline" className="ml-2">
              {polenEntries.length} POLEN entries
            </Badge>
          </div>
          
          {/* Title Input */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 font-medium"
            placeholder="PRD Title..."
          />
        </DialogHeader>

        {/* Stage Progress */}
        <div className="flex-shrink-0 py-4 border-b">
          <PrdStageProgress currentStage={currentStage} completedStages={completedStages} />
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-4">
            {/* POLEN Preview (for Stage A) */}
            {currentStage === 'A_POIETIC' && !stageHasContent() && (
              <Card className="p-4 bg-amber-500/10 border-amber-500/30">
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

            {/* Stage Fields */}
            {STAGE_FIELDS[currentStage].map(field => {
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
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStage}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={generateStageContent}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {generating ? 'Generating...' : 'Generate with AI'}
            </Button>

            {isLastStage ? (
              <Button
                onClick={handleSavePrd}
                disabled={saving || !stageHasContent()}
                className="bg-gradient-to-r from-purple-500 to-indigo-500"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save PRD
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!stageHasContent()}
              >
                Next Stage
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
