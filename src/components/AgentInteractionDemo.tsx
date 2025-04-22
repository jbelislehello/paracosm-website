
import React from "react";
import { Card } from "@/components/ui/card";
import ActiveAgentsDisplay from "./agent-demo/ActiveAgentsDisplay";
import AgentMessagesDisplay from "./agent-demo/AgentMessagesDisplay";
import AgentInputForm from "./agent-demo/AgentInputForm";
import useAgentInteraction from "./agent-demo/useAgentInteraction";

const AgentInteractionDemo: React.FC = () => {
  const {
    userInput,
    setUserInput,
    messages,
    messagesEndRef,
    isProcessing,
    activeAgents,
    handleSubmit,
    getAgentColor,
  } = useAgentInteraction();

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
        <AgentInputForm
          userInput={userInput}
          setUserInput={setUserInput}
          isProcessing={isProcessing}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AgentInteractionDemo;
