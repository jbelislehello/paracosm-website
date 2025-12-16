import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Demo data timestamp from seed-demo-data function
    const demoTimestamp = '2025-12-11 15:21:19.537915+00';

    // Delete demo POLEN entries
    const { data: deletedPolen, error: polenError } = await supabase
      .from('polen_entries')
      .delete()
      .eq('created_at', demoTimestamp)
      .select('id');

    if (polenError) {
      throw new Error(`Failed to delete demo polen: ${polenError.message}`);
    }

    // Delete demo PRDs (also seeded at same time)
    const { data: deletedPrds, error: prdError } = await supabase
      .from('prds')
      .delete()
      .eq('created_at', demoTimestamp)
      .select('id');

    // Delete demo trajectory states
    const { data: deletedTrajectory, error: trajError } = await supabase
      .from('trajectory_states')
      .delete()
      .eq('created_at', demoTimestamp)
      .select('id');

    return new Response(
      JSON.stringify({
        success: true,
        deleted: {
          polen_entries: deletedPolen?.length || 0,
          prds: deletedPrds?.length || 0,
          trajectory_states: deletedTrajectory?.length || 0
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Cleanup error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
