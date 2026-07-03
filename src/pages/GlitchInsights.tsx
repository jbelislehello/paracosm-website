import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { EditorialCTA, EditorialPageHero } from '@/components/editorial';
import { ArrowLeft } from 'lucide-react';

const GlitchInsights = () => {
  const navigate = useNavigate();
  const [, setUser] = useState<any>(null);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/auth'); return; }
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)] text-foreground">
      <EditorialPageHero
        numeral="06"
        kicker="GL!TCH · Insights"
        title={<>Patterns in <em className="italic font-light">your</em> glitches.</>}
        subtitle="Not to judge you — just to show the terrain you're walking."
        actions={
          <EditorialCTA onClick={() => navigate('/glitch-compass')} tone="warm" variant="ghost" showArrow={false}>
            <ArrowLeft className="w-4 h-4" /> Back to compass
          </EditorialCTA>
        }
        tone="warm"
      />
      <div className="max-w-4xl mx-auto p-6 sm:p-10">
        <Card className="p-8 space-y-3 border-current/15 bg-background/50">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">Coming online</p>
          <p className="text-base opacity-80 leading-relaxed">
            Start logging glitches to see patterns emerge over time. The app will show you where
            your tensions cluster and what your growth edges might be.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default GlitchInsights;
