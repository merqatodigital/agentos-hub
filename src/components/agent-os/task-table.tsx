import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CircleDot,
  Clock,
  Minus,
  MoreHorizontal,
  Radar,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Meter, Panel, PanelHeader, StatusDot } from "@/components/agent-os/primitives";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAgents, useTasks } from "@/hooks/use-agent-os";
import { api, queryKeys } from "@/lib/api";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<Task["status"], string> = {
  queued: "Queued",
  in_progress: "In progress",
  review: "Review",
  completed: "Completed",
};

function PriorityTag({ priority }: { priority: Task["priority"] }) {
  const Icon = priority === "high" ? ArrowUp : priority === "low" ? ArrowDown : Minus;
  const tone =
    priority === "high" ? "text-destructive" : priority === "low" ? "text-muted-foreground" : "text-warning";
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs capitalize", tone)}>
      <Icon className="size-3.5" />
      {priority}
    </span>
  );
}

export function TaskTable({
  filter,
  title = "Live operations",
  approvalsOnly = false,
}: {
  filter?: Task["status"][];
  title?: string;
  approvalsOnly?: boolean;
}) {
  const { data: tasks } = useTasks();
  const { data: agents } = useAgents();
  const [selected, setSelected] = useState<Task | null>(null);
  const qc = useQueryClient();

  const decide = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      approve ? api.approveTask(id) : api.rejectTask(id),
    onMutate: async ({ id, approve }) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasks });
      const prev = qc.getQueryData<Task[]>(queryKeys.tasks);
      qc.setQueryData<Task[]>(queryKeys.tasks, (old) =>
        old?.map((t) => (t.id === id ? { ...t, approval: approve ? "approved" : "none" } : t)),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(queryKeys.tasks, ctx?.prev),
    onSuccess: (_d, v) => toast.success(v.approve ? "Task approved" : "Task rejected"),
  });

  const rows = (tasks ?? [])
    .filter((t) => (filter ? filter.includes(t.status) : true))
    .filter((t) => (approvalsOnly ? t.approval === "required" : true));

  return (
    <>
      <Panel className="flex min-w-0 flex-col">
        <PanelHeader title={title} icon={<Radar className="size-4" />} />
        <div className="scroll-slim min-w-0 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Task", "Agent", "Status", "Priority", "Approval", "Updated", ""].map((h) => (
                  <th key={h} className="label-caps px-4 py-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((task) => {
                const agent = agents?.find((a) => a.id === task.agentId);
                return (
                  <tr
                    key={task.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40"
                  >
                    <td className="max-w-[280px] px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(task)}
                        className="flex min-w-0 items-center gap-2 text-left text-foreground hover:text-primary"
                      >
                        <CircleDot className="size-3.5 shrink-0 text-primary/70" />
                        <span className="truncate">{task.title}</span>
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-display tracking-widest">{agent?.name}</span>
                      <span className="text-muted-foreground"> · {agent?.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <StatusDot tone={task.status === "completed" ? "success" : "muted"} />
                        {statusLabel[task.status]}
                        <span className="text-foreground">{task.progress}%</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PriorityTag priority={task.priority} />
                    </td>
                    <td className="px-4 py-3">
                      {task.approval === "required" ? (
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-7"
                            aria-label="Approve"
                            onClick={() => decide.mutate({ id: task.id, approve: true })}
                          >
                            <Check className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            aria-label="Reject"
                            onClick={() => decide.mutate({ id: task.id, approve: false })}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      ) : task.approval === "approved" ? (
                        <span className="flex items-center gap-1.5 text-xs text-success">
                          <Check className="size-3.5" /> Approved
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {task.updated}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        aria-label="Task details"
                        onClick={() => setSelected(task)}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    Nothing here right now.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full border-border bg-panel sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display tracking-wide">{selected?.title}</SheetTitle>
            <SheetDescription>
              Assigned to {agents?.find((a) => a.id === selected?.agentId)?.name ?? "—"} · updated{" "}
              {selected?.updated}
            </SheetDescription>
          </SheetHeader>
          {selected ? (
            <div className="flex flex-col gap-5 px-4 pb-6">
              <div>
                <p className="label-caps">Progress</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-display text-sm text-primary">{selected.progress}%</span>
                  <Meter value={selected.progress} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="label-caps">Status</p>
                  <p className="text-sm">{statusLabel[selected.status]}</p>
                </div>
                <div>
                  <p className="label-caps">Priority</p>
                  <PriorityTag priority={selected.priority} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    decide.mutate({ id: selected.id, approve: true });
                    setSelected(null);
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    decide.mutate({ id: selected.id, approve: false });
                    setSelected(null);
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
