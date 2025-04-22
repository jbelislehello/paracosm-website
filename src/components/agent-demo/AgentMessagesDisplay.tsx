
import React, { RefObject } from "react";
import AgentMessageBubble, { Message } from "./AgentMessageBubble";

interface Props {
  messages: Message[];
  getAgentColor: (agentName: string) => string;
  messagesEndRef: RefObject<HTMLDivElement>;
}

const AgentMessagesDisplay: React.FC<Props> = ({ messages, getAgentColor, messagesEndRef }) => {
  return (
    <div className="h-96 overflow-y-auto p-4 flex flex-col gap-4">
      {messages.map((message, idx) => (
        <AgentMessageBubble
          key={idx}
          message={message}
          getAgentColor={getAgentColor}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default AgentMessagesDisplay;
