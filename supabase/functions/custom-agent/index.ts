
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory per-user rate limit (10 requests / 60s)
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (rateBuckets.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_LIMIT) {
    rateBuckets.set(key, arr);
    return true;
  }
  arr.push(now);
  rateBuckets.set(key, arr);
  return false;
}

const MAX_MESSAGES = 30;
const MAX_CONTENT_LEN = 4000;

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth: require a valid Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    if (isRateLimited(userId)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, agent_id } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages must be a non-empty array.");
    }
    if (messages.length > MAX_MESSAGES) {
      throw new Error(`Too many messages (max ${MAX_MESSAGES}).`);
    }
    const allowedRoles = new Set(["user", "assistant", "system"]);
    for (const m of messages) {
      if (!m || typeof m.content !== "string" || !allowedRoles.has(m.role)) {
        throw new Error("Each message needs a valid role and string content.");
      }
      if (m.content.length > MAX_CONTENT_LEN) {
        throw new Error(`Message content exceeds ${MAX_CONTENT_LEN} chars.`);
      }
    }

    // Prefer a pre-created Assistant ID from env to avoid accumulation.
    const envAssistantId = Deno.env.get("OPENAI_ASSISTANT_ID");
    if (!agent_id && envAssistantId) {
      // fall through with envAssistantId
    }

    // If no agent_id is provided or it's empty, create a new assistant
    let assistantId = agent_id;
    
    if (!assistantId) {
      console.log("No assistant ID provided, creating a new assistant...");
      
      // Create a new assistant
      const assistantResponse = await fetch(
        "https://api.openai.com/v1/assistants",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2"
          },
          body: JSON.stringify({
            name: "Paracosm Agent",
            description: "A helpful AI assistant that specializes in providing information about AI agents and their interactions.",
            model: "gpt-4o-mini",
            instructions: "You are a helpful and knowledgeable assistant that specializes in explaining concepts related to AI agents, their interactions, and how they work together. Provide clear, concise, and informative responses. Be friendly and approachable."
          })
        }
      );

      if (!assistantResponse.ok) {
        const assistantError = await assistantResponse.text();
        console.error("Assistant creation failed:", assistantError);
        throw new Error(`Assistant creation failed: ${assistantError}`);
      }

      const assistant = await assistantResponse.json();
      assistantId = assistant.id;
      console.log(`Created new assistant with ID: ${assistantId}`);
    } else {
      console.log(`Using provided assistant ID: ${assistantId}`);
    }

    console.log(`Creating thread with assistant ${assistantId}...`);
    
    // Create a thread with the initial messages
    const threadResponse = await fetch(
      "https://api.openai.com/v1/threads",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      }
    );

    if (!threadResponse.ok) {
      const threadError = await threadResponse.text();
      console.error("Thread creation failed:", threadError);
      throw new Error(`Thread creation failed: ${threadError}`);
    }

    const thread = await threadResponse.json();
    const threadId = thread.id;
    console.log(`Thread created with ID: ${threadId}`);

    // Run the assistant on the thread
    const runResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({
          assistant_id: assistantId
        })
      }
    );

    if (!runResponse.ok) {
      const runError = await runResponse.text();
      console.error("Run creation failed:", runError);
      throw new Error(`Run creation failed: ${runError}`);
    }

    const run = await runResponse.json();
    console.log(`Run created with ID: ${run.id}`);

    // Poll for run completion
    let runStatus = run.status;
    let attempts = 0;
    let runDetails;
    
    while (runStatus !== "completed" && runStatus !== "failed" && runStatus !== "expired") {
      // Wait a bit before polling again (0.5s initially, increasing with backoff)
      await new Promise(resolve => setTimeout(resolve, 500 + attempts * 300));
      
      const statusResponse = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/runs/${run.id}`,
        {
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2"
          }
        }
      );

      if (!statusResponse.ok) {
        const statusError = await statusResponse.text();
        console.error("Status check failed:", statusError);
        throw new Error(`Status check failed: ${statusError}`);
      }

      runDetails = await statusResponse.json();
      runStatus = runDetails.status;
      attempts++;
      
      console.log(`Run status: ${runStatus}, attempt: ${attempts}`);
      
      // Prevent infinite polling
      if (attempts > 30) {
        throw new Error("Timeout waiting for assistant response");
      }
    }

    if (runStatus !== "completed") {
      throw new Error(`Run finished with status: ${runStatus}`);
    }

    // Get the messages from the thread
    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        }
      }
    );

    if (!messagesResponse.ok) {
      const messagesError = await messagesResponse.text();
      console.error("Messages retrieval failed:", messagesError);
      throw new Error(`Messages retrieval failed: ${messagesError}`);
    }

    const messagesData = await messagesResponse.json();
    
    // Get the last assistant message
    const assistantMessages = messagesData.data.filter(msg => msg.role === "assistant");
    const lastAssistantMessage = assistantMessages[0];
    
    if (!lastAssistantMessage) {
      throw new Error("No assistant message found in the thread");
    }

    // Extract the content
    let content = "";
    if (lastAssistantMessage.content && lastAssistantMessage.content.length > 0) {
      content = lastAssistantMessage.content[0].text?.value || "";
    }

    // Return both the reply and the assistant ID for future use
    return new Response(JSON.stringify({ 
      reply: content,
      assistant_id: assistantId
    }), {
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
