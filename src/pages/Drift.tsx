import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { GlitchEvent } from '@/types/glitch';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const Drift = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [events, setEvents] = useState<GlitchEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (!error && data) {
      setEvents(data as GlitchEvent[]);
    }
    setLoading(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const createPrd = async () => {
    if (selectedIds.length === 0) {
      toast.error(isFr ? 'Veuillez sélectionner au moins un événement' : 'Please select at least one event');
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-prd', {
        body: { eventIds: selectedIds, teamId: null }
      });

      if (error) throw error;

      toast.success(isFr ? 'PRD créé avec succès' : 'PRD created successfully');
      navigate(`/calm-magic-board/prds/${data.prd.id}`);
    } catch (error) {
      console.error('Error creating PRD:', error);
      toast.error(isFr ? 'Échec de la création du PRD' : 'Failed to create PRD');
    } finally {
      setCreating(false);
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'GLITCH': return 'text-red-500';
      case 'DRIFT': return 'text-yellow-500';
      case 'TUNE': return 'text-blue-500';
      case 'FREE': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)] text-foreground">
      <div className="max-w-6xl mx-auto p-6 sm:p-8 lg:p-12 space-y-8 pt-10">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-current/10 pb-6">
          <div className="flex items-baseline gap-6">
            <span className="font-serif text-5xl md:text-6xl text-[hsl(15_75%_55%)] leading-none">02</span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-semibold opacity-60">{isFr ? 'Drift · Synthèse' : 'Drift · Synthesis'}</p>
              <h1 className="font-serif text-3xl md:text-4xl mt-1"><em className="italic font-light">Drift</em> → PRD</h1>
              <p className="text-sm opacity-70 mt-1">
                {isFr ? 'Sélectionnez des glitches à synthétiser en un PRD à 5 couches.' : 'Select glitches to synthesize into a 5-layer PRD.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/calm-magic-board')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {isFr ? 'Retour' : 'Back'}
            </Button>
            <Button
              onClick={createPrd}
              disabled={selectedIds.length === 0 || creating}
              className="rounded-full text-xs uppercase tracking-[0.2em]"
            >
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isFr ? 'Créer PRD' : 'Create PRD'} ({selectedIds.length})
            </Button>
          </div>
        </div>


        {events.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground">
              {isFr
                ? 'Aucun événement enregistré. Consignez d\'abord quelques glitches pour créer un PRD.'
                : 'No events logged yet. Log some glitches first to create a PRD.'}
            </p>
            <Button onClick={() => navigate('/calm-magic-board')} className="mt-4">
              {isFr ? 'Aller au Calm Magic Board' : 'Go to Calm Magic Board'}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <Card 
                key={event.id} 
                className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => toggleSelection(event.id!)}
              >
                <div className="flex items-start gap-4">
                  <Checkbox 
                    checked={selectedIds.includes(event.id!)}
                    onCheckedChange={() => toggleSelection(event.id!)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ${getStateColor(event.process_state)}`}>
                        {event.process_state}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-muted">
                        {event.ap_aspect}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-muted">
                        {event.positionality}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-muted">
                        {event.quadrant}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-muted">
                        {event.oscillation_state}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drift;