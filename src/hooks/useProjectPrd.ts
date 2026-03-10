import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PrdRecord {
  [key: string]: string | null | undefined;
  id?: string;
  title?: string;
  status?: string;
  prototype_stage?: string;
  pollens_aspirations?: string | null;
  pollens_team_dynamics?: string | null;
  pollens_cultural_elements?: string | null;
  pollens_relational_patterns?: string | null;
  pollens_constraints?: string | null;
  pollens_stakes?: string | null;
  noems_concepts?: string | null;
  noems_shared_ideas?: string | null;
  noems_intuitions?: string | null;
  noems_mental_models?: string | null;
  poems_people?: string | null;
  poems_objects?: string | null;
  poems_environments?: string | null;
  poems_messages?: string | null;
  poems_systems?: string | null;
  poems_prototypes?: string | null;
  totems_data_architecture?: string | null;
  totems_security_policies?: string | null;
  totems_access_controls?: string | null;
  totems_system_requirements?: string | null;
  totems_integration_points?: string | null;
  totems_technical_debt?: string | null;
  anthems_market_positioning?: string | null;
  anthems_brand_narrative?: string | null;
  anthems_go_to_market?: string | null;
  anthems_audience_segments?: string | null;
  anthems_success_signals?: string | null;
  anthems_storytelling_assets?: string | null;
}

export function useProjectPrd(projectId: string | null | undefined) {
  const [prdData, setPrdData] = useState<PrdRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setPrdData(null);
      return;
    }

    let cancelled = false;

    const fetchPrd = async () => {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id || cancelled) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('prds')
        .select('*')
        .eq('project_id', projectId)
        .eq('owner_id', user.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cancelled) {
        setPrdData(error ? null : (data as PrdRecord | null));
        setIsLoading(false);
      }
    };

    fetchPrd();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`prd-${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'prds',
        filter: `project_id=eq.${projectId}`,
      }, () => {
        fetchPrd();
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return { prdData, isLoading };
}
