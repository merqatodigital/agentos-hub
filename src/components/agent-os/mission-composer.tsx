import { useMutation } from "@tanstack/react-query";
import { Paperclip, SendHorizontal, SlidersHorizontal, TerminalSquare } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

export function MissionComposer() {
  const [value, setValue] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const send = useMutation({
    mutationFn: (prompt: string) => api.sendMission(prompt),
    onSuccess: () => {
      toast.success("Mission dispatched to Hermes");
      setValue("");
    },
    onError: () => toast.error("Could not dispatch mission"),
  });

  const submit = () => {
    if (!value.trim()) {
      toast.error("Write a mission first");
      return;
    }
    send.mutate(value.trim());
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="panel grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-3"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border text-primary">
        <TerminalSquare className="size-4" />
      </span>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Give your agents a mission"
          className="min-h-10 resize-none border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
        />
        <div className="flex shrink-0 items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const count = e.target.files?.length ?? 0;
              if (count) toast.success(`${count} file(s) attached`);
            }}
          />
          <Button type="button" variant="ghost" size="icon" aria-label="Attach files" onClick={() => fileRef.current?.click()}>
            <Paperclip className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Mission settings" onClick={() => toast("Mission settings coming from backend")}>
            <SlidersHorizontal className="size-4" />
          </Button>
          <Button type="submit" size="icon" aria-label="Send mission" disabled={send.isPending}>
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
