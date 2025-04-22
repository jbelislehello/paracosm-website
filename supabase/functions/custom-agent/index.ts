
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, agent_id } = await req.json();

    if (!agent_id) {
      throw new Error("Missing OpenAI agent (assistant) ID.");
    }
    if (!Array.isArray(messages)) {
      throw new Error("Messages must be sent as an array.");
    }
    // OpenAI Assistant v2 API (Beta - May need to adjust for the endpoint if it changes).
    const response = await fetch(
      "https://api.openai.com/v1/threads/runs",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2", // enable v2
        },
        body: JSON.stringify({
          assistant_id: agent_id,
          thread: {
            messages
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "OpenAI API error");
    }

    const data = await response.json();
    return new Response(JSON.stringify({ reply: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("custom-agent error", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
