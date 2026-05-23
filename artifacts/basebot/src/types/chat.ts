import type { AgentAction } from "@/lib/agent";

export type MessageRole = "user" | "agent" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
  action?: AgentAction;
  isThinking?: boolean;
  thinkingSteps?: string[];
}
