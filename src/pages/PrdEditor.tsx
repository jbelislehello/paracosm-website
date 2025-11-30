import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Prd, PrdStatus, GlitchEvent } from '@/types/glitch';
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

    // Load PRD
    const { data: prdData, error: prdError } = await supabase
      .from('prds')
      .select('*')
      .eq('id', id)
      .single();

    if (prdError || !prdData) {
      toast.error('PRD not found');
      navigate('/drift');
      return;
    }

    setPrd(prdData as Prd);

    // Load linked events
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
          love_summary: prd.love_summary,
          love_key_events_overview: prd.love_key_events_overview,
          magic_patterns: prd.magic_patterns,
          magic_hypotheses: prd.magic_hypotheses,
          calm_requirements: prd.calm_requirements,
          calm_constraints: prd.calm_constraints,
          calm_impacted_actors: prd.calm_impacted_actors,
          open_experiments: prd.open_experiments,
          open_flows_or_scenarios: prd.open_flows_or_scenarios,
          free_success_criteria: prd.free_success_criteria,
          free_learning_questions: prd.free_learning_questions,
          free_integration_plan: prd.free_integration_plan,
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

  if (loading || !prd) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-6xl mx-auto p-6 sm:p-8 lg:p-12 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/drift')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex-1">
              <Input 
                value={prd.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="text-2xl font-bold border-none p-0 h-auto"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={prd.status} onValueChange={(v) => updateField('status', v as PrdStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={savePrd} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dominant Patterns</h3>
          <div className="flex flex-wrap gap-2">
            {prd.main_dimension && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{prd.main_dimension}</span>}
            {prd.main_quadrant && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{prd.main_quadrant}</span>}
            {prd.main_senge_focus && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{prd.main_senge_focus}</span>}
            {prd.main_board && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{prd.main_board}</span>}
            {prd.main_oscillation && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{prd.main_oscillation}</span>}
          </div>
        </Card>

        <Accordion type="single" collapsible defaultValue="love" className="space-y-4">
          <AccordionItem value="love">
            <AccordionTrigger className="text-xl font-semibold">
              LOVE – Signals
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Summary</label>
                <Textarea 
                  value={prd.love_summary || ''}
                  onChange={(e) => updateField('love_summary', e.target.value)}
                  rows={6}
                  placeholder="Narrative summary of raw tensions..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Key Events Overview</label>
                <Textarea 
                  value={prd.love_key_events_overview || ''}
                  onChange={(e) => updateField('love_key_events_overview', e.target.value)}
                  rows={8}
                  placeholder="Bullet list of key glitches..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="magic">
            <AccordionTrigger className="text-xl font-semibold">
              MAGIC – Patterns & Hypotheses
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Patterns</label>
                <Textarea 
                  value={prd.magic_patterns || ''}
                  onChange={(e) => updateField('magic_patterns', e.target.value)}
                  rows={6}
                  placeholder="Recurring patterns across dimensions..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hypotheses</label>
                <Textarea 
                  value={prd.magic_hypotheses || ''}
                  onChange={(e) => updateField('magic_hypotheses', e.target.value)}
                  rows={6}
                  placeholder="What we think is happening and why..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="calm">
            <AccordionTrigger className="text-xl font-semibold">
              CALM – Requirements & Constraints
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <Textarea 
                  value={prd.calm_requirements || ''}
                  onChange={(e) => updateField('calm_requirements', e.target.value)}
                  rows={6}
                  placeholder="What must be true..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Constraints</label>
                <Textarea 
                  value={prd.calm_constraints || ''}
                  onChange={(e) => updateField('calm_constraints', e.target.value)}
                  rows={6}
                  placeholder="Limits, risks, non-negotiables..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Impacted Actors</label>
                <Textarea 
                  value={prd.calm_impacted_actors || ''}
                  onChange={(e) => updateField('calm_impacted_actors', e.target.value)}
                  rows={4}
                  placeholder="Roles/personas affected..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="open">
            <AccordionTrigger className="text-xl font-semibold">
              OPEN – Experiments & Prototypes
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Experiments</label>
                <Textarea 
                  value={prd.open_experiments || ''}
                  onChange={(e) => updateField('open_experiments', e.target.value)}
                  rows={8}
                  placeholder="Wu-wei style experiments to try..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Flows & Scenarios</label>
                <Textarea 
                  value={prd.open_flows_or_scenarios || ''}
                  onChange={(e) => updateField('open_flows_or_scenarios', e.target.value)}
                  rows={6}
                  placeholder="Proposed flows/storyboards..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="free">
            <AccordionTrigger className="text-xl font-semibold">
              FREE – Learning & Integration
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Success Criteria</label>
                <Textarea 
                  value={prd.free_success_criteria || ''}
                  onChange={(e) => updateField('free_success_criteria', e.target.value)}
                  rows={6}
                  placeholder="How we'll know it worked..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Learning Questions</label>
                <Textarea 
                  value={prd.free_learning_questions || ''}
                  onChange={(e) => updateField('free_learning_questions', e.target.value)}
                  rows={6}
                  placeholder="Questions we want answered..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Integration Plan</label>
                <Textarea 
                  value={prd.free_integration_plan || ''}
                  onChange={(e) => updateField('free_integration_plan', e.target.value)}
                  rows={6}
                  placeholder="How to feed results back..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {linkedEvents.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Linked Glitches ({linkedEvents.length})</h3>
            <div className="space-y-2">
              {linkedEvents.map(event => (
                <div key={event.id} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-background">{event.ap_aspect}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-background">{event.positionality}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-background">{event.quadrant}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{event.process_state}</span>
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