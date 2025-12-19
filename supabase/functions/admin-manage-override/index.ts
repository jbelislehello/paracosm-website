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
      console.log('[admin-manage-override] No authorization header');
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
      console.log('[admin-manage-override] User auth failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[admin-manage-override] User authenticated:', user.id);

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
      console.log('[admin-manage-override] Not an admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { action, user_id, tier, reason, expires_at, override_id } = body;

    console.log('[admin-manage-override] Action:', action, 'User ID:', user_id);

    switch (action) {
      case 'create': {
        if (!user_id || !tier) {
          return new Response(
            JSON.stringify({ error: 'user_id and tier are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if user exists
        const { data: targetUser, error: targetError } = await adminClient.auth.admin.getUserById(user_id);
        if (targetError || !targetUser) {
          console.log('[admin-manage-override] Target user not found:', user_id);
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if override already exists
        const { data: existing } = await adminClient
          .from('subscription_overrides')
          .select('id')
          .eq('user_id', user_id)
          .maybeSingle();

        if (existing) {
          console.log('[admin-manage-override] Override already exists for user:', user_id);
          return new Response(
            JSON.stringify({ error: 'Override already exists for this user. Use update instead.' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: newOverride, error: insertError } = await adminClient
          .from('subscription_overrides')
          .insert({
            user_id,
            tier,
            reason: reason || null,
            expires_at: expires_at || null,
            granted_by: user.id,
          })
          .select()
          .single();

        if (insertError) {
          console.log('[admin-manage-override] Insert error:', insertError);
          return new Response(
            JSON.stringify({ error: 'Failed to create override' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('[admin-manage-override] Created override:', newOverride.id);

        return new Response(
          JSON.stringify({ success: true, override: newOverride }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        if (!override_id) {
          return new Response(
            JSON.stringify({ error: 'override_id is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const updateData: Record<string, any> = {};
        if (tier !== undefined) updateData.tier = tier;
        if (reason !== undefined) updateData.reason = reason;
        if (expires_at !== undefined) updateData.expires_at = expires_at;

        const { data: updated, error: updateError } = await adminClient
          .from('subscription_overrides')
          .update(updateData)
          .eq('id', override_id)
          .select()
          .single();

        if (updateError) {
          console.log('[admin-manage-override] Update error:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update override' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('[admin-manage-override] Updated override:', override_id);

        return new Response(
          JSON.stringify({ success: true, override: updated }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        if (!override_id) {
          return new Response(
            JSON.stringify({ error: 'override_id is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await adminClient
          .from('subscription_overrides')
          .delete()
          .eq('id', override_id);

        if (deleteError) {
          console.log('[admin-manage-override] Delete error:', deleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to delete override' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('[admin-manage-override] Deleted override:', override_id);

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use create, update, or delete.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('[admin-manage-override] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
