import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { GlitchEvent } from '@/types/glitch';
import { toast } from 'sonner';

const Drift = () => {
  const navigate = useNavigate();
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
      toast.error('Please select at least one event');
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-prd', {
        body: { eventIds: selectedIds, teamId: null }
      });

      if (error) throw error;

      toast.success('PRD created successfully');
      navigate(`/glitch-compass/prds/${data.prd.id}`);
    } catch (error) {
      console.error('Error creating PRD:', error);
      toast.error('Failed to create PRD');
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
            <Button variant="ghost" onClick={() => navigate('/glitch-compass')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Drift → PRD</h1>
              <p className="text-muted-foreground">
                Select glitches to synthesize into a 5-layer PRD
              </p>
            </div>
          </div>
          <Button 
            onClick={createPrd} 
            disabled={selectedIds.length === 0 || creating}
          >
            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create PRD ({selectedIds.length})
          </Button>
        </div>

        {events.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground">
              No events logged yet. Log some glitches first to create a PRD.
            </p>
            <Button onClick={() => navigate('/glitch-compass')} className="mt-4">
              Go to Glitch Compass
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