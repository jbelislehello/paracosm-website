import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { EditorialCTA, EditorialPageHero } from '@/components/editorial';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const GlitchEvents = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isFr = language === 'fr';
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
        kicker={isFr ? 'GL!TCH · Journal' : 'GL!TCH · Journal'}
        title={isFr
          ? <>Mon journal de <em className="italic font-light">Glitch</em>.</>
          : <>My <em className="italic font-light">Glitch</em> Journal.</>}
        subtitle={isFr
          ? "Quand quelque chose cloche — en vous, avec quelqu'un ou dans votre travail — notez-le ici. Pas besoin de réponses, juste un point de départ."
          : "When something feels off — in you, with someone else, or in your work — log it here. You don't need answers, just a starting point."}
        actions={
          <EditorialCTA onClick={() => navigate('/glitch-compass')} tone="night" variant="ghost" showArrow={false}>
            <ArrowLeft className="w-4 h-4" /> {isFr ? 'Retour au compas' : 'Back to compass'}
          </EditorialCTA>
        }
        tone="night"
      />
      <div className="max-w-4xl mx-auto p-6 sm:p-10">
        <Card className="p-10 text-center space-y-6 border-white/15 bg-white/5 text-[hsl(35_20%_92%)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
            {isFr ? 'Page vide' : 'Empty page'}
          </p>
          <p className="font-serif text-2xl md:text-3xl leading-tight italic">
            {isFr
              ? <>&ldquo;Aucun glitch consigné pour l'instant. La page blanche est aussi un commencement.&rdquo;</>
              : <>&ldquo;No glitches logged yet. The blank page is also a beginning.&rdquo;</>}
          </p>
          <div className="flex justify-center">
            <EditorialCTA onClick={() => navigate('/glitch-compass')} tone="night">
              {isFr ? 'Consigner votre premier glitch' : 'Log your first glitch'} <ArrowRight className="w-4 h-4" />
            </EditorialCTA>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GlitchEvents;
