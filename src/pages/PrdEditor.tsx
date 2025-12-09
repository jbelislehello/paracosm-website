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
import { ArrowLeft, Loader2, Save, Sprout, BookOpen, Shapes, Flag, Rocket } from 'lucide-react';
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
              <p className="text-muted-foreground">Calm Magic PRD — Gl!tch → Drift → Tune</p>
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
            {/* LAYER 1 - POLLEN */}
            <AccordionItem value="pollen">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-amber-500" />
                  POLLEN — Signals & Context (Gl!tch)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Raw Observations & Glitches</label>
                  <Textarea
                    value={prd.love_signals_summary || ''}
                    onChange={(e) => updateField('love_signals_summary', e.target.value)}
                    placeholder="Tensions, complaints, weird use cases, quotes from users/stakeholders..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Constraints & Emotional Climate</label>
                  <Textarea
                    value={prd.love_decision_to_exist || ''}
                    onChange={(e) => updateField('love_decision_to_exist', e.target.value)}
                    placeholder="Legal, ethical, financial, technical constraints. Fears, hopes, invisible stakes..."
                    rows={4}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* LAYER 2 - POEM */}
            <AccordionItem value="poem">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  POEM — Narrative & Meaning (Drift)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">User Journeys</label>
                  <Textarea
                    value={prd.magic_storyworld || ''}
                    onChange={(e) => updateField('magic_storyworld', e.target.value)}
                    placeholder="Short stories: before → during → after. Day-in-the-life vignettes..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Thematic Anchors</label>
                  <Textarea
                    value={prd.magic_prd_outline || ''}
                    onChange={(e) => updateField('magic_prd_outline', e.target.value)}
                    placeholder="Core themes: curiosity, confidence, play, trust, care..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Hypotheses</label>
                  <Textarea
                    value={prd.magic_hypotheses || ''}
                    onChange={(e) => updateField('magic_hypotheses', e.target.value)}
                    placeholder="'We believe that...' statements about behavior/emotion/cognition shifts..."
                    rows={6}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* LAYER 3 - TOTEM */}
            <AccordionItem value="totem">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Shapes className="w-5 h-5 text-blue-500" />
                  TOTEM — Form & Interfaces (Tune)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Core Flows & Screens</label>
                  <Textarea
                    value={prd.calm_requirements || ''}
                    onChange={(e) => updateField('calm_requirements', e.target.value)}
                    placeholder="Service blueprints, information architecture, what people touch/see/feel..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ontology & Boundaries</label>
                  <Textarea
                    value={prd.calm_risks_and_limits || ''}
                    onChange={(e) => updateField('calm_risks_and_limits', e.target.value)}
                    placeholder="Ontological backbone (entities, relationships). System boundaries (what this does NOT do)..."
                    rows={6}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* LAYER 4 - ANTHEM */}
            <AccordionItem value="anthem">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-emerald-500" />
                  ANTHEM — Alignment & Impact (Tune)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Strategic Alignment</label>
                  <Textarea
                    value={prd.open_ontology_and_graph || ''}
                    onChange={(e) => updateField('open_ontology_and_graph', e.target.value)}
                    placeholder="How this supports the organization's story and your paracosm..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Success Metrics</label>
                  <Textarea
                    value={prd.open_real_workflow || ''}
                    onChange={(e) => updateField('open_real_workflow', e.target.value)}
                    placeholder="3-5 success signals, qualitative and quantitative..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Guardrails</label>
                  <Textarea
                    value={prd.open_adjustment_plan || ''}
                    onChange={(e) => updateField('open_adjustment_plan', e.target.value)}
                    placeholder="Ethics, compliance, well-being, ecological and social impact..."
                    rows={4}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* LAYER 5 - EXECUTION */}
            <AccordionItem value="execution">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-rose-500" />
                  EXECUTION — Roadmap & Operations (FREE → LOVE)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Milestones & Releases</label>
                  <Textarea
                    value={prd.free_first_poem_description || ''}
                    onChange={(e) => updateField('free_first_poem_description', e.target.value)}
                    placeholder="Now / Next / Later roadmap. What's the smallest high-leverage slice?"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Responsibility Map</label>
                  <Textarea
                    value={prd.free_totem_anthem || ''}
                    onChange={(e) => updateField('free_totem_anthem', e.target.value)}
                    placeholder="RACI, roles, circles. Who needs to be in the room?"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Learning Cadence</label>
                  <Textarea
                    value={prd.free_success_criteria || ''}
                    onChange={(e) => updateField('free_success_criteria', e.target.value)}
                    placeholder="Demos, retros, drift sessions. Time for reflection..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Next Cycle Hooks</label>
                  <Textarea
                    value={prd.free_next_cycle_hooks || ''}
                    onChange={(e) => updateField('free_next_cycle_hooks', e.target.value)}
                    placeholder="How learnings flow back into POLLEN (new glitches, new cycles)..."
                    rows={4}
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
