import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Prd, GlitchEvent } from '@/types/glitch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const PrdEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prd, setPrd] = useState<Prd | null>(null);
  const [linkedEvents, setLinkedEvents] = useState<GlitchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrd();
  }, [id]);

  const loadPrd = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: prdData, error: prdError } = await supabase
      .from('prds')
      .select('*')
      .eq('id', id)
      .single();

    if (prdError || !prdData) {
      toast.error('PRD not found');
      navigate('/glitch-compass/drift');
      return;
    }

    setPrd(prdData as Prd);

    const { data: linksData } = await supabase
      .from('prd_links')
      .select('event_id')
      .eq('prd_id', id);

    if (linksData && linksData.length > 0) {
      const eventIds = linksData.map(link => link.event_id);
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds);

      if (eventsData) {
        setLinkedEvents(eventsData as GlitchEvent[]);
      }
    }

    setLoading(false);
  };

  const updateField = (field: keyof Prd, value: any) => {
    setPrd(prev => prev ? { ...prev, [field]: value } : null);
  };

  const savePrd = async () => {
    if (!prd) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('prds')
        .update({
          title: prd.title,
          status: prd.status,
          prototype_stage: prd.prototype_stage,
          love_signals_summary: prd.love_signals_summary,
          love_decision_to_exist: prd.love_decision_to_exist,
          magic_storyworld: prd.magic_storyworld,
          magic_prd_outline: prd.magic_prd_outline,
          magic_hypotheses: prd.magic_hypotheses,
          calm_requirements: prd.calm_requirements,
          calm_risks_and_limits: prd.calm_risks_and_limits,
          open_ontology_and_graph: prd.open_ontology_and_graph,
          open_real_workflow: prd.open_real_workflow,
          open_adjustment_plan: prd.open_adjustment_plan,
          free_first_poem_description: prd.free_first_poem_description,
          free_totem_anthem: prd.free_totem_anthem,
          free_success_criteria: prd.free_success_criteria,
          free_next_cycle_hooks: prd.free_next_cycle_hooks,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('PRD saved successfully');
    } catch (error) {
      console.error('Error saving PRD:', error);
      toast.error('Failed to save PRD');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!prd) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="p-8">
          <p className="text-lg">PRD not found</p>
          <Button onClick={() => navigate('/glitch-compass')} className="mt-4">
            Back to Glitch Compass
          </Button>
        </Card>
      </div>
    );
  }

  const getStageLabel = (stage: string) => {
    const labels = {
      'A_POIETIC': 'A — Poietic Prototype',
      'B_DIEGETIC': 'B — Diegetic Prototype',
      'C_OPERATIONAL': 'C — Operational Prototype',
      'D_MVP': 'D — MVP / Production Ready'
    };
    return labels[stage as keyof typeof labels] || stage;
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'A_POIETIC': 'bg-red-500/10 text-red-500 border-red-500/20',
      'B_DIEGETIC': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'C_OPERATIONAL': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'D_MVP': 'bg-green-500/10 text-green-500 border-green-500/20'
    };
    return colors[stage as keyof typeof colors] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-6xl mx-auto p-6 sm:p-8 lg:p-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/glitch-compass')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">PRD Editor</h1>
                <Badge className={`${getStageColor(prd.prototype_stage)} border`}>
                  {getStageLabel(prd.prototype_stage)}
                </Badge>
              </div>
              <p className="text-muted-foreground">5-Layer Product Requirements Document</p>
            </div>
          </div>
          <Button onClick={savePrd} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>

        {/* Title & Status */}
        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={prd.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="PRD title..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={prd.status} onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Dominant Patterns */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dominant Patterns</h3>
          <div className="flex flex-wrap gap-2">
            {prd.main_dimension && <Badge variant="secondary">{prd.main_dimension}</Badge>}
            {prd.main_quadrant && <Badge variant="secondary">{prd.main_quadrant}</Badge>}
            {prd.main_senge_focus && <Badge variant="secondary">{prd.main_senge_focus}</Badge>}
            {prd.main_board && <Badge variant="secondary">{prd.main_board}</Badge>}
            {prd.main_oscillation && <Badge variant="secondary">{prd.main_oscillation}</Badge>}
          </div>
        </Card>

        {/* PRD Layers */}
        <Card className="p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {/* LAYER 1 - LOVE */}
            <AccordionItem value="love">
              <AccordionTrigger className="text-xl font-semibold">
                LAYER 1 — LOVE (Signals)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Signals Summary</label>
                  <Textarea
                    value={prd.love_signals_summary || ''}
                    onChange={(e) => updateField('love_signals_summary', e.target.value)}
                    placeholder="Synthesized narrative of tensions & incoherences..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Decision to Exist</label>
                  <Textarea
                    value={prd.love_decision_to_exist || ''}
                    onChange={(e) => updateField('love_decision_to_exist', e.target.value)}
                    placeholder="Is this worth existing? Given these tensions, here is why this idea/product/prototype might be worth existing (or not)..."
                    rows={4}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* LAYER 2 - MAGIC */}
            <AccordionItem value="magic">
              <AccordionTrigger className="text-xl font-semibold">
                LAYER 2 — MAGIC (Story & PRD Backbone)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Storyworld</label>
                  <Textarea
                    value={prd.magic_storyworld || ''}
                    onChange={(e) => updateField('magic_storyworld', e.target.value)}
                    placeholder="Short diegetic story tying glitches into a narrative. In this world, users experience..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">PRD Outline</label>
                  <Textarea
                    value={prd.magic_prd_outline || ''}
                    onChange={(e) => updateField('magic_prd_outline', e.target.value)}
                    placeholder="Bullet-like list of potential features/flows derived from recurring patterns..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Hypotheses</label>
                  <Textarea
                    value={prd.magic_hypotheses || ''}
                    onChange={(e) => updateField('magic_hypotheses', e.target.value)}
                    placeholder="List of 'We believe that...' hypotheses using F/E/L/V, quadrant, senge_focus..."
                    rows={6}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* LAYER 3 - CALM */}
            <AccordionItem value="calm">
              <AccordionTrigger className="text-xl font-semibold">
                LAYER 3 — CALM (Rules & Requirements)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Requirements</label>
                  <Textarea
                    value={prd.calm_requirements || ''}
                    onChange={(e) => updateField('calm_requirements', e.target.value)}
                    placeholder="Requirements inferred from constraints, risks, positionality (e.g. compliance/governance, safety, UX rules)..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Risks and Limits</label>
                  <Textarea
                    value={prd.calm_risks_and_limits || ''}
                    onChange={(e) => updateField('calm_risks_and_limits', e.target.value)}
                    placeholder="Explicit risks / non-negotiables from adversity_level & oscillation_state..."
                    rows={6}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* LAYER 4 - OPEN */}
            <AccordionItem value="open">
              <AccordionTrigger className="text-xl font-semibold">
                LAYER 4 — OPEN (Ontology & Workflow)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ontology and Graph</label>
                  <Textarea
                    value={prd.open_ontology_and_graph || ''}
                    onChange={(e) => updateField('open_ontology_and_graph', e.target.value)}
                    placeholder="Description of entities, relationships, edges suggested by glitches..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Real Workflow</label>
                  <Textarea
                    value={prd.open_real_workflow || ''}
                    onChange={(e) => updateField('open_real_workflow', e.target.value)}
                    placeholder="Real-life workflow the app/system must support..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Adjustment Plan</label>
                  <Textarea
                    value={prd.open_adjustment_plan || ''}
                    onChange={(e) => updateField('open_adjustment_plan', e.target.value)}
                    placeholder="How we will tune the prototype to match reality..."
                    rows={4}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* LAYER 5 - FREE */}
            <AccordionItem value="free">
              <AccordionTrigger className="text-xl font-semibold">
                LAYER 5 — FREE (Production & Learning)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First POEM Description</label>
                  <Textarea
                    value={prd.free_first_poem_description || ''}
                    onChange={(e) => updateField('free_first_poem_description', e.target.value)}
                    placeholder="Description of the first POEM in production..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Totem Anthem</label>
                  <Textarea
                    value={prd.free_totem_anthem || ''}
                    onChange={(e) => updateField('free_totem_anthem', e.target.value)}
                    placeholder="How this POEM becomes a ritual/totem in the org..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Success Criteria</label>
                  <Textarea
                    value={prd.free_success_criteria || ''}
                    onChange={(e) => updateField('free_success_criteria', e.target.value)}
                    placeholder="What successful behavior/stories/metrics look like..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Next Cycle Hooks</label>
                  <Textarea
                    value={prd.free_next_cycle_hooks || ''}
                    onChange={(e) => updateField('free_next_cycle_hooks', e.target.value)}
                    placeholder="How learnings will flow back into Glitch Compass (new glitches, new cycles)..."
                    rows={6}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Linked Events */}
        {linkedEvents.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Linked Glitches ({linkedEvents.length})</h3>
            <div className="space-y-2">
              {linkedEvents.map(event => (
                <div key={event.id} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{event.ap_aspect}</Badge>
                      <Badge variant="outline">{event.positionality}</Badge>
                      <Badge variant="outline">{event.quadrant}</Badge>
                    </div>
                  </div>
                  <Badge variant="outline">{event.process_state}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrdEditor;