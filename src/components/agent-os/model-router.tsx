import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cloud, Cpu, Radio, Router } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeader, Sparkline } from "@/components/agent-os/primitives";
import { Switch } from "@/components/ui/switch";
import { useModels, useTelemetry } from "@/hooks/use-agent-os";
import { api, queryKeys } from "@/lib/api";
import type { ModelOption } from "@/lib/types";

const icons: Record<ModelOption["id"], typeof Cloud> = {
  "openrouter-free": Radio,
  "openrouter-paid": Cloud,
  "ollama-local": Cpu,
};

export function ModelRouter() {
  const { data: models } = useModels();
  const { data: telemetry } = useTelemetry();
  const qc = useQueryClient();

  const toggle = useMutation({
    mutationFn: ({ id, enabled }: { id: ModelOption["id"]; enabled: boolean }) =>
      api.toggleModel(id, enabled),
    onMutate: async ({ id, enabled }) => {
      await qc.cancelQueries({ queryKey: queryKeys.models });
      const prev = qc.getQueryData<ModelOption[]>(queryKeys.models);
      qc.setQueryData<ModelOption[]>(queryKeys.models, (old) =>
        old?.map((m) => (m.id === id ? { ...m, enabled } : m)),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(queryKeys.models, ctx?.prev),
    onSuccess: (_d, v) => toast.success(`${v.id} ${v.enabled ? "enabled" : "disabled"}`),
  });

  return (
    <Panel className="flex flex-col">
      <PanelHeader title="Model router" icon={<Router className="size-4" />} />
      <div className="flex flex-col gap-2 p-3">
        {models?.map((model) => {
          const Icon = icons[model.id];
          return (
            <div
              key={model.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5"
            >
              <Icon className="size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{model.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {model.detail} · {model.tier}
                </p>
              </div>
              <Switch
                checked={model.enabled}
                aria-label={`Toggle ${model.name}`}
                onCheckedChange={(enabled) => toggle.mutate({ id: model.id, enabled })}
              />
            </div>
          );
        })}
      </div>

      <div className="border-t border-border px-4 py-3">
        <p className="label-caps">Router telemetry · 7d</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <p className="label-caps">Tokens</p>
            <p className="font-display text-sm text-foreground">{telemetry?.totalTokens ?? "—"}</p>
          </div>
          <div>
            <p className="label-caps">Cost</p>
            <p className="font-display text-sm text-foreground">{telemetry?.totalCost ?? "—"}</p>
          </div>
          <div>
            <p className="label-caps">Success</p>
            <p className="font-display text-sm text-primary">{telemetry?.successRate ?? "—"}</p>
          </div>
        </div>
        <Sparkline data={telemetry?.series ?? []} variant="area" className="mt-3 h-14" />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          {telemetry?.labels.map((l) => <span key={l}>{l}</span>)}
        </div>
      </div>
    </Panel>
  );
}
