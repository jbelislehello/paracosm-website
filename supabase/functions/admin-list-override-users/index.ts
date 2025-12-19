import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('[admin-list-override-users] No authorization header');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Create client with user's token to verify identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.log('[admin-list-override-users] User auth failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[admin-list-override-users] User authenticated:', user.id);

    // Use service role client for admin operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user has admin role
    const { data: roleData, error: roleError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.log('[admin-list-override-users] Not an admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[admin-list-override-users] Admin verified, fetching overrides');

    // Fetch all subscription overrides
    const { data: overrides, error: overridesError } = await adminClient
      .from('subscription_overrides')
      .select('*')
      .order('created_at', { ascending: false });

    if (overridesError) {
      console.log('[admin-list-override-users] Error fetching overrides:', overridesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch overrides' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enrich with user emails
    const enrichedOverrides = await Promise.all(
      (overrides || []).map(async (override) => {
        let email = null;
        let grantedByEmail = null;

        try {
          const { data: userData } = await adminClient.auth.admin.getUserById(override.user_id);
          email = userData?.user?.email || null;
        } catch (e) {
          console.log('[admin-list-override-users] Could not fetch user email:', override.user_id);
        }

        if (override.granted_by) {
          try {
            const { data: granterData } = await adminClient.auth.admin.getUserById(override.granted_by);
            grantedByEmail = granterData?.user?.email || null;
          } catch (e) {
            console.log('[admin-list-override-users] Could not fetch granter email:', override.granted_by);
          }
        }

        return {
          ...override,
          email,
          granted_by_email: grantedByEmail,
        };
      })
    );

    console.log('[admin-list-override-users] Returning', enrichedOverrides.length, 'overrides');

    return new Response(
      JSON.stringify({ overrides: enrichedOverrides }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[admin-list-override-users] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
