
import React from "react";

export interface Message {
  role: string;
  content: string;
  agent?: string;
  timestamp: Date;
}

interface BubbleProps {
  message: Message;
  getAgentColor: (agentName: string) => string;
}

const AgentMessageBubble: React.FC<BubbleProps> = ({ message, getAgentColor }) => {
  return (
    <div 
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
  );
};

export default AgentMessageBubble;
