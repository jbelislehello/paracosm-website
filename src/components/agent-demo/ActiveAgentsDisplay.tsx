
import React from "react";

export interface Agent {
  name: string;
  role: string;
  color: string;
  thinking?: boolean;
}

interface Props {
  activeAgents: Agent[];
}

const ActiveAgentsDisplay: React.FC<Props> = ({ activeAgents }) => (
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
);

export default ActiveAgentsDisplay;
