
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

    console.log(`Creating thread with assistant ${agent_id}...`);
    
    // Create a thread with the initial messages
    const threadResponse = await fetch(
      "https://api.openai.com/v1/threads",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"  // Added required OpenAI-Beta header
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
          "OpenAI-Beta": "assistants=v2"  // Added required OpenAI-Beta header
        },
        body: JSON.stringify({
          assistant_id: agent_id
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
            "OpenAI-Beta": "assistants=v2"  // Added required OpenAI-Beta header
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
          "OpenAI-Beta": "assistants=v2"  // Added required OpenAI-Beta header
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

    return new Response(JSON.stringify({ reply: content }), {
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
