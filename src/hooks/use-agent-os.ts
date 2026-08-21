import { useQuery } from "@tanstack/react-query";
import { api, queryKeys } from "@/lib/api";

export const useSystemStatus = () =>
  useQuery({ queryKey: queryKeys.status, queryFn: api.getSystemStatus });

export const useMetrics = () =>
  useQuery({ queryKey: queryKeys.metrics, queryFn: api.getMetrics });

export const useAgents = () => useQuery({ queryKey: queryKeys.agents, queryFn: api.getAgents });

export const useTasks = () => useQuery({ queryKey: queryKeys.tasks, queryFn: api.getTasks });

export const useActivity = () =>
  useQuery({ queryKey: queryKeys.activity, queryFn: api.getActivity });

export const useModels = () => useQuery({ queryKey: queryKeys.models, queryFn: api.getModels });

export const useTelemetry = () =>
  useQuery({ queryKey: queryKeys.telemetry, queryFn: api.getTelemetry });
