import { Activity, CircleDollarSign, CheckCircle2, Timer } from "lucide-react";
import { Sparkline } from "@/components/agent-os/primitives";
import { useMetrics } from "@/hooks/use-agent-os";

const icons = [Activity, CheckCircle2, Timer, CircleDollarSign];

export function MetricStack() {
  const { data } = useMetrics();
  return (
    <div className="flex flex-col gap-2">
      {data?.map((metric, i) => {
        const Icon = icons[i % icons.length]!;
        return (
          <div
            key={metric.id}
            className="grid grid-cols-[auto_minmax(0,1fr)_5.5rem] items-center gap-3 rounded-md border border-border bg-panel/50 px-3 py-2.5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-primary">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="label-caps truncate">{metric.label}</p>
              <p className="font-display text-lg text-foreground">{metric.value}</p>
            </div>
            <Sparkline data={metric.trend} variant={i === 1 ? "bars" : "line"} />
          </div>
        );
      })}
    </div>
  );
}
