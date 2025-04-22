
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ActiveAgentsDisplay, { Agent } from "./agent-demo/ActiveAgentsDisplay";
import AgentMessagesDisplay from "./agent-demo/AgentMessagesDisplay";

interface Message {
  role: string;
  content: string;
  agent?: string;
  timestamp: Date;
}

const OPENAI_ASSISTANT_ID = "asst_LFYl9jFQgXGrTOlcnAaWO4gS";

const AgentInteractionDemo: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome to the Agent Interaction Demo. Try asking a question or giving a task to see how agents collaborate.',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents: Agent[] = [
    { name: "Coordinator", role: "Manages the workflow and delegates tasks", color: "#2563eb" },
    { name: "Researcher", role: "Collects and analyzes information", color: "#7c3aed" },
    { name: "Writer", role: "Formulates coherent responses", color: "#db2777" },
    { name: "Validator", role: "Verifies information and checks quality", color: "#16a34a" }
  ];

  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    }]);
    const currentInput = userInput;
    setUserInput("");
    simulateAgentInteraction(currentInput);
  };

  const simulateAgentInteraction = async (input: string) => {
    setIsProcessing(true);
    setActiveAgents([agents[0]]);
    await simulateThinking("Coordinator");
    addAgentMessage("Coordinator", "I'll send your question directly to our OpenAI Agent for a response...");

    try {
      const threadMessages = [
        { role: "user", content: input }
      ];

      const resp = await fetch(
        `https://qeqfbywgcokyxvubjlhy.supabase.co/functions/v1/custom-agent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: threadMessages,
            agent_id: OPENAI_ASSISTANT_ID,
          }),
        }
      );

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`API request failed with status ${resp.status}: ${errorText}`);
      }

      const data = await resp.json();

      if (data.reply) {
        addAgentMessage("OpenAI Agent", data.reply);
      } else if (data.error) {
        addAgentMessage("OpenAI Agent", "There was an error fetching a reply: " + data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      } else {
        addAgentMessage("OpenAI Agent", "No response received from agent.");
      }
    } catch (err: any) {
      addAgentMessage("OpenAI Agent", "Error: " + err.message);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the OpenAI Agent. Please check your API key and try again.",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
    setActiveAgents([]);
  };

  const simulateThinking = async (agentName: string) => {
    setActiveAgents(prev => 
      prev.map(agent => 
        agent.name === agentName ? { ...agent, thinking: true } : agent
      )
    );
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    setActiveAgents(prev => 
      prev.map(agent => 
        agent.name === agentName ? { ...agent, thinking: false } : agent
      )
    );
  };

  const addAgentMessage = (agentName: string, content: string) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      agent: agentName,
      content: content,
      timestamp: new Date()
    }]);
  };

  const getAgentColor = (agentName: string) => {
    const agent = agents.find(a => a.name === agentName);
    return agent?.color || "#2563eb";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 md:p-6">
        <ActiveAgentsDisplay activeAgents={activeAgents} />
        <Card className="mb-4 overflow-hidden">
          <AgentMessagesDisplay
            messages={messages}
            getAgentColor={getAgentColor}
            messagesEndRef={messagesEndRef}
          />
        </Card>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question or give a task..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !userInput.trim()}
            className="bg-agent-blue hover:bg-agent-blue/90"
          >
            {isProcessing ? "Processing..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AgentInteractionDemo;
