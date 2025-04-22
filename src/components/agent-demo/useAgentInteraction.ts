
import { useState, useRef, useEffect, RefObject } from "react";
import { toast } from "@/hooks/use-toast";
import { AGENTS, OPENAI_ASSISTANT_ID } from "./agentConstants";
import type { Agent } from "./ActiveAgentsDisplay";
import type { Message } from "./AgentMessageBubble";
import { supabase } from "@/integrations/supabase/client";

interface UseAgentInteraction {
  userInput: string;
  setUserInput: (val: string) => void;
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
  isProcessing: boolean;
  activeAgents: Agent[];
  handleSubmit: (e: React.FormEvent) => void;
  getAgentColor: (agentName: string) => string;
}

export default function useAgentInteraction(): UseAgentInteraction {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "Welcome to the Agent Interaction Demo. Try asking a question or giving a task to see how agents collaborate.",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userInput,
        timestamp: new Date(),
      },
    ]);
    const currentInput = userInput;
    setUserInput("");
    simulateAgentInteraction(currentInput);
  };

  async function simulateAgentInteraction(input: string) {
    setIsProcessing(true);
    setActiveAgents([AGENTS[0]]);
    await simulateThinking("Coordinator");
    addAgentMessage("Coordinator", "I'll send your question directly to our OpenAI Agent for a response...");

    try {
      // Using Supabase Functions SDK to make the call with proper auth
      const { data, error } = await supabase.functions.invoke("custom-agent", {
        body: {
          messages: [{ role: "user", content: input }],
          agent_id: OPENAI_ASSISTANT_ID,
        },
      });

      if (error) {
        throw new Error(`API request failed: ${error.message}`);
      }

      if (data?.reply) {
        addAgentMessage("OpenAI Agent", data.reply);
      } else {
        addAgentMessage("OpenAI Agent", "No response received from agent.");
      }
    } catch (err: any) {
      console.error("Agent interaction error:", err);
      addAgentMessage("OpenAI Agent", "Error: " + err.message);
      toast({
        title: "Connection Error",
        description:
          "Failed to connect to the OpenAI Agent. Please check your API key and try again.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
    setActiveAgents([]);
  }

  async function simulateThinking(agentName: string) {
    setActiveAgents([{ ...AGENTS.find((a) => a.name === agentName)!, thinking: true }]);
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));
    setActiveAgents([{ ...AGENTS.find((a) => a.name === agentName)!, thinking: false }]);
  }

  function addAgentMessage(agentName: string, content: string) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        agent: agentName,
        content,
        timestamp: new Date(),
      },
    ]);
  }

  const getAgentColor = (agentName: string) => {
    const agent = AGENTS.find((a) => a.name === agentName);
    return agent?.color || "#2563eb";
  };

  return {
    userInput,
    setUserInput,
    messages,
    messagesEndRef,
    isProcessing,
    activeAgents,
    handleSubmit,
    getAgentColor,
  };
}
