import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GlitchInsights = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-6xl mx-auto p-6 sm:p-8 lg:p-12 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/glitch-compass')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Patterns in Your Glitches</h1>
        </div>

        <Card className="p-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Not to judge you—just to show the terrain you're walking</h2>
            <p className="text-muted-foreground">
              Start logging glitches to see patterns emerge over time. The app will show you where your tensions cluster 
              and what your growth edges might be.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GlitchInsights;
