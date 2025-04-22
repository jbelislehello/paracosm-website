
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AgentInputFormProps {
  userInput: string;
  setUserInput: (val: string) => void;
  isProcessing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const AgentInputForm: React.FC<AgentInputFormProps> = ({
  userInput,
  setUserInput,
  isProcessing,
  handleSubmit,
}) => (
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
);

export default AgentInputForm;
