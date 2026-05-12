// Shared Lovable AI Gateway helper for edge functions.
// Uses fetch directly (OpenAI-compatible) so we don't ship the AI SDK in Deno.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiCallOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callLovableAi(
  messages: ChatMessage[],
  options: AiCallOptions = {},
): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({
      model: options.model ?? "google/gemini-3-flash-preview",
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4000,
    }),
  });

  if (res.status === 429) {
    throw new Error("AI gateway rate limit (429). Please retry shortly.");
  }
  if (res.status === 402) {
    throw new Error(
      "AI gateway credits exhausted (402). Add credits in Lovable workspace settings.",
    );
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI gateway error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("AI gateway returned no text content");
  }
  return content;
}
