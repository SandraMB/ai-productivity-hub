import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Copy, Trash2, Mail, CalendarCheck, MessagesSquare } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useSavedWork, type SavedKind } from "@/lib/saved-work";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Work | Workplace AI" },
      {
        name: "description",
        content: "Everything you kept from the email generator, task planner and workplace chat.",
      },
      { property: "og:title", content: "Saved Work" },
      { property: "og:description", content: "Your saved drafts, plans and conversations." },
    ],
  }),
  component: SavedPage,
});

const icons: Record<SavedKind, typeof Mail> = {
  email: Mail,
  plan: CalendarCheck,
  chat: MessagesSquare,
};

const filters = ["all", "email", "plan", "chat"] as const;

function SavedPage() {
  const { items, remove, clear } = useSavedWork();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = filter === "all" ? items : items.filter((i) => i.kind === filter);

  return (
    <AppShell
      title="Saved Work"
      description="Drafts, plans and conversations kept in this browser."
      actions={
        items.length > 0 ? (
          <Button variant="outline" size="sm" onClick={() => clear()}>
            Clear all
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "plan" ? "plans" : f}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-3 p-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Bookmark className="size-6" />
            </span>
            <p className="text-sm font-medium">Nothing saved here yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Use the Save button in the email generator, task planner or chat and it will show up
              on this page.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((item) => {
              const Icon = icons[item.kind];
              const open = openId === item.id;
              return (
                <li key={item.id} className="surface-card p-5">
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setOpenId(open ? null : item.id)}>
                        {open ? "Hide" : "View"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await navigator.clipboard.writeText(item.content);
                          toast.success("Copied.");
                        }}
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(item.id)}>
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  {open ? (
                    <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-secondary/60 p-4 font-sans text-sm leading-relaxed">
                      {item.content}
                    </pre>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
