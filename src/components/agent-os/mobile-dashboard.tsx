import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Meter, Panel, PanelHeader, StatusPill } from "@/components/agent-os/primitives";
import { Button } from "@/components/ui/button";
import { useAgents, useMetrics, useSystemStatus, useTasks } from "@/hooks/use-agent-os";
import { api, queryKeys } from "@/lib/api";
import type { Task } from "@/lib/types";

export function MobileDashboard() {
  const { data: status } = useSystemStatus();
  const { data: metrics } = useMetrics();
  const { data: tasks } = useTasks();
  const { data: agents } = useAgents();
  const qc = useQueryClient();

  const decide = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      approve ? api.approveTask(id) : api.rejectTask(id),
    onMutate: async ({ id, approve }) => {
      const prev = qc.getQueryData<Task[]>(queryKeys.tasks);
      qc.setQueryData<Task[]>(queryKeys.tasks, (old) =>
        old?.map((t) => (t.id === id ? { ...t, approval: approve ? "approved" : "none" } : t)),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(queryKeys.tasks, ctx?.prev),
    onSuccess: () => toast.success("Decision recorded"),
  });

  const approvals = (tasks ?? []).filter((t) => t.approval === "required");
  const live = (tasks ?? []).filter((t) => t.status !== "completed").slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <StatusPill
          label={status?.hermesOnline ? "Hermes online" : "Hermes offline"}
          tone={status?.hermesOnline ? "success" : "warning"}
        />
        <StatusPill label={`${status?.activeAgents ?? 0} agents`} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metrics?.map((m) => (
          <div key={m.id} className="panel px-3 py-3">
            <p className="label-caps truncate">{m.label}</p>
            <p className="font-display text-lg text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      <Panel>
        <PanelHeader title="Live tasks" />
        <ul className="divide-y divide-border">
          {live.map((t) => (
            <li key={t.id} className="px-4 py-3">
              <p className="text-sm text-foreground">{t.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {agents?.find((a) => a.id === t.agentId)?.name} · {t.updated}
              </p>
              <Meter value={t.progress} className="mt-2" />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <PanelHeader title={`Approvals (${approvals.length})`} />
        <ul className="divide-y divide-border">
          {approvals.map((t) => (
            <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
              <p className="min-w-0 truncate text-sm">{t.title}</p>
              <div className="flex shrink-0 gap-1">
                <Button size="icon" variant="outline" className="size-8" aria-label="Approve" onClick={() => decide.mutate({ id: t.id, approve: true })}>
                  <Check className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" className="size-8" aria-label="Reject" onClick={() => decide.mutate({ id: t.id, approve: false })}>
                  <X className="size-4" />
                </Button>
              </div>
            </li>
          ))}
          {approvals.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">All clear.</li>
          ) : null}
        </ul>
      </Panel>

      <Button size="lg" className="h-14 w-full gap-2 text-base" asChild>
        <a href="https://t.me" target="_blank" rel="noreferrer">
          <Send className="size-5" />
          Continue in Telegram
        </a>
      </Button>
    </div>
  );
}
