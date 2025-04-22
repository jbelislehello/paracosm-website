import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  role: string;
  content: string;
  agent?: string;
  timestamp: Date;
}

interface Agent {
  name: string;
  role: string;
  color: string;
  thinking?: boolean;
}

const OPENAI_ASSISTANT_ID = "asst_LFYl9jFQgXGrTOlcnAaWO4gS"; // Updated with your specific Assistant ID

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
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    }]);
    
    // Clear input
    setUserInput("");
    
    // Start processing
    simulateAgentInteraction(userInput);
  };

  const simulateAgentInteraction = async (input: string) => {
    setIsProcessing(true);
    // Activate coordinator first
    setActiveAgents([agents[0]]);
    await simulateThinking("Coordinator");
    addAgentMessage("Coordinator", "I'll send your question directly to our OpenAI Agent for a response...");
    
    // Send request to Supabase Edge Function
    try {
      // Build message array as OpenAI expects
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
      const data = await resp.json();
      if (data.reply) {
        // Unpack/reformat data as appropriate for reply (you may want different logic if your Assistant API response format is different)
        const content = typeof data.reply === "string"
          ? data.reply
          : data.reply.choices?.[0]?.message?.content || JSON.stringify(data.reply);
        addAgentMessage("OpenAI Agent", content);
      } else if (data.error) {
        addAgentMessage("OpenAI Agent", "There was an error fetching a reply: " + data.error);
      } else {
        addAgentMessage("OpenAI Agent", "No response received from agent.");
      }
    } catch (err: any) {
      addAgentMessage("OpenAI Agent", "Error: " + err.message);
    }

    setIsProcessing(false);
    setActiveAgents([]);
  };

  const simulateThinking = async (agentName: string) => {
    // Show thinking state for the agent
    setActiveAgents(prev => 
      prev.map(agent => 
        agent.name === agentName ? { ...agent, thinking: true } : agent
      )
    );
    
    // Wait for random time between 1-2.5 seconds
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    // Remove thinking state
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
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Active Agents</h3>
          <div className="flex flex-wrap gap-2">
            {activeAgents.length === 0 ? (
              <span className="text-sm text-slate-500">No agents currently active</span>
            ) : (
              activeAgents.map((agent, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                  style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                >
                  <span className="relative flex h-2 w-2">
                    <span 
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}
                      style={{ backgroundColor: agent.color }}
                    ></span>
                    <span 
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: agent.color }}
                    ></span>
                  </span>
                  {agent.name}
                  {agent.thinking && <span className="text-xs">(thinking...)</span>}
                </div>
              ))
            )}
          </div>
        </div>

        <Card className="mb-4 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user' 
                      ? 'bg-agent-blue text-white' 
                      : message.role === 'system'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {message.agent && (
                    <div 
                      className="text-xs font-semibold mb-1"
                      style={{ color: getAgentColor(message.agent) }}
                    >
                      {message.agent}
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
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
