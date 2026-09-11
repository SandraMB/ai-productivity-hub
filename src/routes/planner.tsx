import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Bookmark,
  Loader2,
  Coffee,
  Brain,
  ClipboardList,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generatePlan, type PlanBlock, type Priority, type TaskInput } from "@/lib/mock-ai";
import { useSavedWork } from "@/lib/saved-work";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      {
        name: "description",
        content:
          "Turn your task list into a realistic daily or weekly schedule with focus blocks and breaks.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritised schedules with protected focus time and proper breaks.",
      },
    ],
  }),
  component: PlannerPage,
});

const priorities: Priority[] = ["High", "Medium", "Low"];

const kindStyles: Record<PlanBlock["kind"], { icon: typeof Brain; chip: string; label: string }> = {
  focus: { icon: Brain, chip: "bg-primary/10 text-primary", label: "Focus" },
  task: { icon: ListChecks, chip: "bg-chart-2/15 text-chart-2", label: "Task" },
  break: { icon: Coffee, chip: "bg-success/15 text-success", label: "Break" },
  admin: { icon: ClipboardList, chip: "bg-secondary text-secondary-foreground", label: "Admin" },
  review: { icon: ClipboardList, chip: "bg-warning/20 text-warning-foreground", label: "Review" },
};

function PlannerPage() {
  const [tasks, setTasks] = useState<TaskInput[]>([
    { id: "t1", title: "Finish the Q3 report", priority: "High", deadline: "Today" },
  ]);
  const [range, setRange] = useState<"Daily" | "Weekly">("Daily");
  const [plan, setPlan] = useState<PlanBlock[]>([]);
  const [busy, setBusy] = useState(false);
  const [seed, setSeed] = useState(0);
  const { save } = useSavedWork();

  const update = (id: string, patch: Partial<TaskInput>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const run = (nextSeed: number) => {
    const valid = tasks.filter((t) => t.title.trim());
    if (valid.length === 0) {
      toast.error("Add at least one task to plan around.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setPlan(generatePlan(valid, range, nextSeed));
      setSeed(nextSeed);
      setBusy(false);
    }, 700);
  };

  return (
    <AppShell
      title="AI Task Planner"
      description="List what needs doing and get a schedule that actually fits."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section className="surface-card h-fit space-y-5 p-6">
          <div className="space-y-2">
            <Label>Plan range</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["Daily", "Weekly"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    range === r
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tasks</Label>
            {tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={task.title}
                    onChange={(e) => update(task.id, { title: e.target.value })}
                    placeholder="What needs doing?"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove task"
                    onClick={() => setTasks((p) => p.filter((t) => t.id !== task.id))}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update(task.id, { priority: p })}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        task.priority === p
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <Input
                    value={task.deadline}
                    onChange={(e) => update(task.id, { deadline: e.target.value })}
                    placeholder="Deadline"
                    className="h-8 w-32 text-xs"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                setTasks((p) => [
                  ...p,
                  {
                    id: crypto.randomUUID(),
                    title: "",
                    priority: "Medium",
                    deadline: "",
                  },
                ])
              }
            >
              <Plus className="size-4" /> Add task
            </Button>
          </div>

          <Button className="w-full" onClick={() => run(seed)} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {busy ? "Building your schedule…" : "Generate plan"}
          </Button>
        </section>

        <section className="surface-card flex min-h-[420px] flex-col p-6">
          {plan.length > 0 ? (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold">
                  {range === "Daily" ? "Your day, block by block" : "Your week ahead"}
                </h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => run(seed + 1)} disabled={busy}>
                    <RefreshCw className={cn("size-4", busy && "animate-spin")} /> Regenerate
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      save({
                        kind: "plan",
                        title: `${range} plan — ${new Date().toLocaleDateString()}`,
                        content: plan.map((b) => `${b.time} — ${b.label}\n${b.note}`).join("\n\n"),
                      });
                      toast.success("Plan saved to Saved Work.");
                    }}
                  >
                    <Bookmark className="size-4" /> Save
                  </Button>
                </div>
              </div>

              <ol className="space-y-3">
                {plan.map((block) => {
                  const style = kindStyles[block.kind];
                  const Icon = style.icon;
                  return (
                    <li
                      key={block.id}
                      className="rounded-2xl border border-border p-4 transition-shadow hover:shadow-soft"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{block.time}</span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            style.chip,
                          )}
                        >
                          <Icon className="size-3" />
                          {style.label}
                        </span>
                      </div>
                      <input
                        value={block.label}
                        onChange={(e) =>
                          setPlan((prev) =>
                            prev.map((b) =>
                              b.id === block.id ? { ...b, label: e.target.value } : b,
                            ),
                          )
                        }
                        className="mt-2 w-full rounded-md bg-transparent text-sm font-medium outline-none focus:bg-secondary/60 focus:px-2 focus:py-1"
                      />
                      <p className="mt-1 text-sm text-muted-foreground">{block.note}</p>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <ListChecks className="size-6" />
              </span>
              <p className="text-sm font-medium">No plan yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Add your tasks with priorities and deadlines, then generate a schedule with focus
                time and breaks built in.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
