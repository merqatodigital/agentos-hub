import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ActivityFeed } from "@/components/agent-os/activity-feed";
import { AgentCard } from "@/components/agent-os/agent-card";
import { AppShell } from "@/components/agent-os/app-shell";
import { MetricStack } from "@/components/agent-os/metric-stack";
import { MissionComposer } from "@/components/agent-os/mission-composer";
import { MobileDashboard } from "@/components/agent-os/mobile-dashboard";
import { ModelRouter } from "@/components/agent-os/model-router";
import { SystemOrb } from "@/components/agent-os/system-orb";
import { TaskTable } from "@/components/agent-os/task-table";
import { useAgents, useSystemStatus } from "@/hooks/use-agent-os";
import { api, queryKeys } from "@/lib/api";
import type { Agent } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center | MERQATO Agent OS" },
      {
        name: "description",
        content:
          "Operate your AI workforce from one console: agent status, live tasks, model routing and approvals.",
      },
      { property: "og:title", content: "Command Center | MERQATO Agent OS" },
      {
        property: "og:description",
        content: "Operate your AI workforce from one console: agents, tasks, model routing, approvals.",
      },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  const { data: status } = useSystemStatus();
  const { data: agents } = useAgents();
  const qc = useQueryClient();

  const toggle = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => api.toggleAgent(id, enabled),
    onMutate: ({ id, enabled }) => {
      qc.setQueryData<Agent[]>(queryKeys.agents, (old) =>
        old?.map((a) => (a.id === id ? { ...a, enabled } : a)),
      );
    },
  });

  return (
    <AppShell mobile={<MobileDashboard />}>
      <div className="flex flex-col gap-4">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="flex min-w-0 flex-col gap-4">
              <div>
                <h1 className="font-display text-3xl leading-tight tracking-[0.08em] text-foreground sm:text-4xl">
                  COMMAND CENTER
                </h1>
                <p className="label-caps mt-2">
                  Good evening, {status?.operator.name.split(" ")[0] ?? "operator"}
                </p>
              </div>
              <MetricStack />
            </div>
            <div className="min-w-0">
              <SystemOrb sync={status?.systemSync ?? 100} />
            </div>
          </div>
          <ModelRouter />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {agents?.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggle={(enabled) => toggle.mutate({ id: agent.id, enabled })}
            />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <TaskTable />
          <ActivityFeed limit={6} />
        </section>

        <MissionComposer />
      </div>
    </AppShell>
  );
}
