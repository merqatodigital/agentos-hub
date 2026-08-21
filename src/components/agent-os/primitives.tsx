import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn("panel", className)}>{children}</section>;
}

export function PanelHeader({
  title,
  icon,
  action,
  className,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {icon ? <span className="shrink-0 text-primary">{icon}</span> : null}
        <h2 className="label-caps truncate text-foreground">{title}</h2>
      </div>
      {action}
    </header>
  );
}

export function StatusDot({ tone = "success" }: { tone?: "success" | "warning" | "muted" }) {
  const toneClass =
    tone === "success"
      ? "bg-success shadow-[0_0_8px_var(--success)]"
      : tone === "warning"
        ? "bg-warning"
        : "bg-muted-foreground";
  return <span className={cn("inline-block size-1.5 shrink-0 rounded-full", toneClass)} />;
}

export function StatusPill({
  label,
  tone = "success",
  className,
}: {
  label: string;
  tone?: "success" | "warning" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border bg-panel/70 px-3 py-1.5",
        "label-caps text-foreground",
        className,
      )}
    >
      <StatusDot tone={tone} />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function Sparkline({
  data,
  className,
  variant = "line",
}: {
  data: number[];
  className?: string;
  variant?: "line" | "area" | "bars";
}) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const w = 100;
  const h = 32;
  const step = w / (data.length - 1 || 1);
  const points = data.map((v, i) => [i * step, h - ((v - min) / span) * (h - 4) - 2] as const);
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

  if (variant === "bars") {
    const bw = w / data.length;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-8 w-full", className)}>
        {data.map((v, i) => {
          const bh = ((v - min) / span) * (h - 4) + 2;
          return (
            <rect
              key={i}
              x={i * bw + bw * 0.2}
              y={h - bh}
              width={bw * 0.6}
              height={bh}
              className="fill-primary/70"
            />
          );
        })}
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-8 w-full", className)}>
      {variant === "area" ? (
        <path d={`${d} L${w},${h} L0,${h} Z`} className="fill-primary/12" />
      ) : null}
      <path d={d} fill="none" strokeWidth={1.4} vectorEffect="non-scaling-stroke" className="stroke-primary" />
    </svg>
  );
}

export function Meter({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
