import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { EditorialCTA, EditorialPageHero } from '@/components/editorial';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const GlitchEvents = () => {
  const navigate = useNavigate();
  const [, setUser] = useState<any>(null);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/auth'); return; }
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-[hsl(230_35%_10%)] text-[hsl(35_20%_92%)]">
      <EditorialPageHero
        numeral="05"
        kicker="GL!TCH · Journal"
        title={<>My <em className="italic font-light">Glitch</em> Journal.</>}
        subtitle="When something feels off — in you, with someone else, or in your work — log it here. You don't need answers, just a starting point."
        actions={
          <EditorialCTA onClick={() => navigate('/glitch-compass')} tone="night" variant="ghost" showArrow={false}>
            <ArrowLeft className="w-4 h-4" /> Back to compass
          </EditorialCTA>
        }
        tone="night"
      />
      <div className="max-w-4xl mx-auto p-6 sm:p-10">
        <Card className="p-10 text-center space-y-6 border-white/15 bg-white/5 text-[hsl(35_20%_92%)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">Empty page</p>
          <p className="font-serif text-2xl md:text-3xl leading-tight italic">
            &ldquo;No glitches logged yet. The blank page is also a beginning.&rdquo;
          </p>
          <div className="flex justify-center">
            <EditorialCTA onClick={() => navigate('/glitch-compass')} tone="night">
              Log your first glitch <ArrowRight className="w-4 h-4" />
            </EditorialCTA>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GlitchEvents;
