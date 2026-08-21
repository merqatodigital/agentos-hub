import type {
  ActivityItem,
  Agent,
  Metric,
  ModelOption,
  SystemStatus,
  Task,
  Telemetry,
} from "./types";

const wave = (seed: number, n = 24) =>
  Array.from({ length: n }, (_, i) =>
    Math.round(
      50 +
        26 * Math.sin(i / 2.1 + seed) +
        14 * Math.sin(i / 1.2 + seed * 1.7) +
        i * 0.6,
    ),
  );

export const sampleStatus: SystemStatus = {
  hermesOnline: true,
  activeAgents: 5,
  selectedModel: "gpt-4o-mini · OpenRouter Paid",
  telegramConnected: true,
  systemSync: 100,
  operator: { name: "David Reynolds", role: "Owner", initials: "DR" },
};

export const sampleMetrics: Metric[] = [
  { id: "health", label: "System health", value: "98.7%", trend: wave(1) },
  { id: "tasks", label: "Tasks completed", value: "128", trend: wave(3) },
  { id: "latency", label: "Avg response time", value: "1.42s", trend: wave(5) },
  { id: "cost", label: "Cost today", value: "$3.18", trend: wave(7) },
];

export const sampleAgents: Agent[] = [
  {
    id: "hermes",
    name: "HERMES",
    role: "Super Agent",
    kind: "super",
    status: "active",
    enabled: true,
    currentTask: "Reconcile supplier invoices for May 2025",
    progress: 81,
    completedToday: 32,
    slaOnTime: 99,
    trend: wave(2),
  },
  {
    id: "tala",
    name: "TALA",
    role: "Guest Relations",
    kind: "specialist",
    status: "active",
    enabled: true,
    currentTask: "Processing guest inquiry from Emily Carter",
    progress: 72,
    completedToday: 24,
    slaOnTime: 98,
    trend: wave(4),
  },
  {
    id: "nyx",
    name: "NYX",
    role: "Marketing",
    kind: "specialist",
    status: "active",
    enabled: true,
    currentTask: "A/B test: Summer campaign landing page",
    progress: 54,
    completedToday: 18,
    slaOnTime: 96,
    trend: wave(6),
  },
  {
    id: "engineer",
    name: "ENGINEER",
    role: "GitHub",
    kind: "specialist",
    status: "active",
    enabled: true,
    currentTask: "Review PR #482 — billing retry logic",
    progress: 67,
    completedToday: 14,
    slaOnTime: 97,
    trend: wave(8),
  },
  {
    id: "scout",
    name: "SCOUT",
    role: "Research",
    kind: "specialist",
    status: "idle",
    enabled: true,
    currentTask: "Monitor AI industry funding rounds",
    progress: 45,
    completedToday: 26,
    slaOnTime: 95,
    trend: wave(10),
  },
];

export const sampleTasks: Task[] = [
  {
    id: "t1",
    title: "Finalize Q2 budget forecast",
    agentId: "hermes",
    status: "in_progress",
    progress: 68,
    priority: "high",
    approval: "required",
    updated: "2m ago",
  },
  {
    id: "t2",
    title: "Write blog post: Agentic workflows",
    agentId: "nyx",
    status: "review",
    progress: 92,
    priority: "medium",
    approval: "approved",
    updated: "7m ago",
  },
  {
    id: "t3",
    title: "Investigate login error on mobile",
    agentId: "engineer",
    status: "in_progress",
    progress: 33,
    priority: "high",
    approval: "required",
    updated: "11m ago",
  },
  {
    id: "t4",
    title: "Summarize latest funding rounds",
    agentId: "scout",
    status: "completed",
    progress: 100,
    priority: "low",
    approval: "approved",
    updated: "13m ago",
  },
  {
    id: "t5",
    title: "Follow up with enterprise lead",
    agentId: "tala",
    status: "queued",
    progress: 0,
    priority: "medium",
    approval: "none",
    updated: "15m ago",
  },
  {
    id: "t6",
    title: "Refresh supplier knowledge base",
    agentId: "hermes",
    status: "queued",
    progress: 0,
    priority: "medium",
    approval: "required",
    updated: "22m ago",
  },
];

export const sampleActivity: ActivityItem[] = [
  { id: "a1", agentId: "hermes", message: "completed invoice reconciliation", time: "2m ago" },
  { id: "a2", agentId: "nyx", message: "launched A/B test variant B", time: "7m ago" },
  { id: "a3", agentId: "engineer", message: "merged PR #481", time: "12m ago" },
  { id: "a4", agentId: "scout", message: "added 8 new research items", time: "18m ago" },
  { id: "a5", agentId: "tala", message: "resolved guest inquiry #1298", time: "22m ago" },
  { id: "a6", agentId: "hermes", message: "routed 3 tasks to specialists", time: "31m ago" },
];

export const sampleModels: ModelOption[] = [
  {
    id: "openrouter-free",
    name: "OpenRouter Free",
    detail: "gpt-3.5-turbo",
    tier: "Free tier",
    enabled: false,
  },
  {
    id: "openrouter-paid",
    name: "OpenRouter Paid",
    detail: "gpt-4o-mini",
    tier: "Pay as you go",
    enabled: true,
  },
  {
    id: "ollama-local",
    name: "Ollama Local",
    detail: "llama3.1:8b",
    tier: "Local",
    enabled: true,
  },
];

export const sampleTelemetry: Telemetry = {
  totalTokens: "2.4M",
  totalCost: "$18.74",
  successRate: "99.2%",
  series: wave(12, 14),
  labels: ["May 10", "May 11", "May 12", "May 13", "May 14", "May 15", "May 16"],
};
