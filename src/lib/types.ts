export type AgentStatus = "active" | "idle" | "paused" | "error";

export interface Agent {
  id: string;
  name: string;
  role: string;
  kind: "super" | "specialist";
  status: AgentStatus;
  enabled: boolean;
  currentTask: string;
  progress: number;
  completedToday: number;
  slaOnTime: number;
  trend: number[];
}

export type TaskStatus = "queued" | "in_progress" | "review" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type ApprovalState = "required" | "approved" | "none";

export interface Task {
  id: string;
  title: string;
  agentId: string;
  status: TaskStatus;
  progress: number;
  priority: TaskPriority;
  approval: ApprovalState;
  updated: string;
}

export interface ActivityItem {
  id: string;
  agentId: string;
  message: string;
  time: string;
}

export interface ModelOption {
  id: "openrouter-free" | "openrouter-paid" | "ollama-local";
  name: string;
  detail: string;
  tier: string;
  enabled: boolean;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  trend: number[];
}

export interface Telemetry {
  totalTokens: string;
  totalCost: string;
  successRate: string;
  series: number[];
  labels: string[];
}

export interface SystemStatus {
  hermesOnline: boolean;
  activeAgents: number;
  selectedModel: string;
  telegramConnected: boolean;
  systemSync: number;
  operator: { name: string; role: string; initials: string };
}

export interface OnboardingPayload {
  business: {
    name: string;
    industry: string;
    website: string;
    timezone: string;
    description: string;
  };
  documents: { name: string; size: number }[];
  agents: string[];
  model: ModelOption["id"];
  telegram: { handle: string; connected: boolean };
}
