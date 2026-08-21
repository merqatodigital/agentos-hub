import { Bot, ShieldCheck } from "lucide-react";
import { Meter, Sparkline, StatusDot } from "@/components/agent-os/primitives";
import { Switch } from "@/components/ui/switch";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AgentCard({
  agent,
  onToggle,
  onSelect,
  className,
}: {
  agent: Agent;
  onToggle?: (enabled: boolean) => void;
  onSelect?: () => void;
  className?: string;
}) {
  const Icon = agent.kind === "super" ? ShieldCheck : Bot;
  return (
    <article
      className={cn(
        "panel flex flex-col gap-4 p-4 transition-colors hover:border-border-strong",
        agent.kind === "super" && "border-primary/35",
        className,
      )}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/35 text-primary">
          <Icon className="size-4" />
        </span>
        <button type="button" onClick={onSelect} className="min-w-0 text-left">
          <p className="font-display truncate text-sm tracking-widest text-foreground">
            {agent.name}
            <span className="text-muted-foreground"> · {agent.role}</span>
          </p>
          <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <StatusDot tone={agent.status === "active" ? "success" : "muted"} />
            {agent.status.toUpperCase()}
          </span>
        </button>
        {onToggle ? (
          <Switch checked={agent.enabled} onCheckedChange={onToggle} aria-label={`Toggle ${agent.name}`} />
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="label-caps">Current task</p>
        <p className="mt-1 line-clamp-2 text-sm text-foreground">{agent.currentTask}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-display text-sm text-primary">{agent.progress}%</span>
        <Meter value={agent.progress} />
      </div>

      <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-end gap-4 border-t border-border pt-3">
        <div>
          <p className="label-caps">Today</p>
          <p className="text-sm text-foreground">{agent.completedToday}</p>
        </div>
        <div>
          <p className="label-caps">SLA</p>
          <p className="text-sm text-foreground">{agent.slaOnTime}%</p>
        </div>
        <Sparkline data={agent.trend} variant="area" />
      </div>
    </article>
  );
}
