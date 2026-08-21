/**
 * Single frontend service layer for the MERQATO Agent OS.
 *
 * Every network call the UI makes goes through `request()`. Today the calls are
 * resolved with local sample data (USE_SAMPLE_DATA = true) so the interface can
 * be demonstrated without a backend. To connect the FastAPI / Hermes backend:
 *
 *   1. Set VITE_API_BASE_URL (e.g. https://api.merqato.com)
 *   2. Set VITE_USE_SAMPLE_DATA=false
 *
 * No other file in the app performs fetches.
 */
import {
  sampleActivity,
  sampleAgents,
  sampleMetrics,
  sampleModels,
  sampleStatus,
  sampleTasks,
  sampleTelemetry,
} from "./sample-data";
import type {
  ActivityItem,
  Agent,
  Metric,
  ModelOption,
  OnboardingPayload,
  SystemStatus,
  Task,
  Telemetry,
} from "./types";

const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "/api";
const USE_SAMPLE_DATA = import.meta.env["VITE_USE_SAMPLE_DATA"] !== "false";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function request<T>(
  path: string,
  fallback: () => T,
  init?: RequestInit & { body?: unknown },
): Promise<T> {
  if (USE_SAMPLE_DATA) {
    await delay(180);
    return fallback();
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: init?.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  getSystemStatus: () => request<SystemStatus>("/system/status", () => sampleStatus),
  getMetrics: () => request<Metric[]>("/system/metrics", () => sampleMetrics),
  getAgents: () => request<Agent[]>("/agents", () => sampleAgents),
  getTasks: () => request<Task[]>("/tasks", () => sampleTasks),
  getActivity: () => request<ActivityItem[]>("/activity", () => sampleActivity),
  getModels: () => request<ModelOption[]>("/models", () => sampleModels),
  getTelemetry: () => request<Telemetry>("/models/telemetry", () => sampleTelemetry),

  toggleModel: (id: ModelOption["id"], enabled: boolean) =>
    request<{ ok: true }>(`/models/${id}`, () => ({ ok: true }), {
      method: "PATCH",
      body: { enabled },
    }),
  toggleAgent: (id: string, enabled: boolean) =>
    request<{ ok: true }>(`/agents/${id}`, () => ({ ok: true }), {
      method: "PATCH",
      body: { enabled },
    }),
  approveTask: (id: string) =>
    request<{ ok: true }>(`/tasks/${id}/approve`, () => ({ ok: true }), { method: "POST" }),
  rejectTask: (id: string) =>
    request<{ ok: true }>(`/tasks/${id}/reject`, () => ({ ok: true }), { method: "POST" }),
  sendMission: (prompt: string) =>
    request<{ ok: true; id: string }>("/missions", () => ({ ok: true, id: crypto.randomUUID() }), {
      method: "POST",
      body: { prompt },
    }),
  connectTelegram: (handle: string) =>
    request<{ ok: true }>("/integrations/telegram", () => ({ ok: true }), {
      method: "POST",
      body: { handle },
    }),
  uploadDocuments: (files: File[]) =>
    request<{ ok: true; count: number }>(
      "/knowledge/documents",
      () => ({ ok: true, count: files.length }),
      { method: "POST", body: { files: files.map((f) => f.name) } },
    ),
  submitOnboarding: (payload: OnboardingPayload) =>
    request<{ ok: true }>("/onboarding", () => ({ ok: true }), { method: "POST", body: payload }),
};

export const queryKeys = {
  status: ["system", "status"] as const,
  metrics: ["system", "metrics"] as const,
  agents: ["agents"] as const,
  tasks: ["tasks"] as const,
  activity: ["activity"] as const,
  models: ["models"] as const,
  telemetry: ["telemetry"] as const,
};
