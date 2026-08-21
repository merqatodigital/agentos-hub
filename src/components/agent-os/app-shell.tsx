import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  Compass,
  Gauge,
  Globe,
  LayoutDashboard,
  Library,
  ListChecks,
  Menu,
  Send,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { StatusPill } from "@/components/agent-os/primitives";
import { useSystemStatus } from "@/hooks/use-agent-os";
import { cn } from "@/lib/utils";

export const navItems = [
  { label: "Command Center", to: "/", icon: LayoutDashboard },
  { label: "Super Agent", to: "/super-agent", icon: ShieldCheck },
  { label: "Bots", to: "/bots", icon: Bot },
  { label: "Tasks", to: "/tasks", icon: ListChecks },
  { label: "Browser", to: "/browser", icon: Globe },
  { label: "Knowledge", to: "/knowledge", icon: Library },
  { label: "Memory", to: "/memory", icon: BrainCircuit },
  { label: "Approvals", to: "/approvals", icon: CheckCircle2, badge: 3 },
  { label: "Usage", to: "/usage", icon: Gauge },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm transition-colors",
              active
                ? "border-border-strong bg-sidebar-accent text-primary"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {"badge" in item && item.badge ? (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning">
                {item.badge}
              </span>
            ) : (
              <span />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-5 py-5">
      <span className="glow grid size-9 shrink-0 place-items-center rounded-full border border-primary/40">
        <Compass className="size-4 text-primary" />
      </span>
      <span className="font-display truncate text-sm font-semibold tracking-[0.16em] text-foreground">
        MERQATO<span className="text-muted-foreground"> / AGENT OS</span>
      </span>
    </Link>
  );
}

function OperatorCard() {
  const { data } = useSystemStatus();
  const op = data?.operator;
  return (
    <div className="mt-auto border-t border-sidebar-border px-4 py-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/40 text-xs text-primary">
          {op?.initials ?? "--"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-sidebar-foreground">{op?.name ?? "Loading"}</p>
          <p className="truncate text-xs text-muted-foreground">{op?.role ?? ""}</p>
        </div>
      </div>
    </div>
  );
}

function HeaderStatus() {
  const { data } = useSystemStatus();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill
        label={data?.hermesOnline ? "Hermes online" : "Hermes offline"}
        tone={data?.hermesOnline ? "success" : "warning"}
      />
      <StatusPill label={`${data?.activeAgents ?? 0} agents active`} />
      <StatusPill label={data?.selectedModel ?? "No model"} tone="muted" />
      <StatusPill
        label={data?.telegramConnected ? "Telegram linked" : "Telegram off"}
        tone={data?.telegramConnected ? "success" : "warning"}
      />
    </div>
  );
}

export function AppShell({
  children,
  mobile,
}: {
  children: ReactNode;
  mobile?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <NavList />
        <OperatorCard />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-full flex-col">
                  <Brand />
                  <NavList onNavigate={() => setOpen(false)} />
                  <OperatorCard />
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden min-w-0 md:block">
              <HeaderStatus />
            </div>
            <span className="font-display truncate text-sm tracking-[0.16em] md:hidden">
              MERQATO AGENT OS
            </span>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 gap-2" asChild>
            <a href="https://t.me" target="_blank" rel="noreferrer">
              <Send className="size-3.5" />
              <span className="hidden sm:inline">Telegram</span>
            </a>
          </Button>
        </header>

        {mobile ? (
          <>
            <main className="hidden min-w-0 flex-1 p-4 md:block lg:p-6">{children}</main>
            <main className="min-w-0 flex-1 p-4 md:hidden">{mobile}</main>
          </>
        ) : (
          <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
        )}
      </div>
    </div>
  );
}
