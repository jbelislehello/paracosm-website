import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GlitchEvents = () => {
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
          <h1 className="text-3xl font-bold">My Glitch Journal</h1>
        </div>

        <Card className="p-8 text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            No glitches logged yet.
          </p>
          <p className="text-muted-foreground">
            When something feels off—in you, with someone else, or in your work—log it here.
            <br />
            You don't need answers, just a starting point.
          </p>
          <Button onClick={() => navigate('/glitch-compass')}>
            Log Your First Glitch
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default GlitchEvents;
