import { Activity } from "lucide-react";
import { Panel, PanelHeader } from "@/components/agent-os/primitives";
import { Button } from "@/components/ui/button";
import { useActivity, useAgents } from "@/hooks/use-agent-os";

export function ActivityFeed({ limit }: { limit?: number }) {
  const { data: activity } = useActivity();
  const { data: agents } = useAgents();
  const items = limit ? activity?.slice(0, limit) : activity;

  return (
    <Panel className="flex flex-col">
      <PanelHeader
        title="Activity feed"
        icon={<Activity className="size-4" />}
        action={
          <Button variant="ghost" size="sm" className="label-caps h-7 text-primary">
            View all
          </Button>
        }
      />
      <ul className="scroll-slim max-h-[320px] divide-y divide-border overflow-y-auto">
        {items?.map((item) => {
          const agent = agents?.find((a) => a.id === item.agentId);
          return (
            <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3">
              <p className="min-w-0 text-sm text-muted-foreground">
                <span className="font-display mr-2 tracking-widest text-foreground">
                  {agent?.name ?? item.agentId}
                </span>
                {item.message}
              </p>
              <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
