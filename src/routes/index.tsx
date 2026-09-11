import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  CalendarCheck,
  MessagesSquare,
  Lightbulb,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useSavedWork } from "@/lib/saved-work";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A friendly AI workspace for drafting emails, planning your day and thinking through work decisions.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, plan your day and get workplace advice in one calm dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Hours saved this week", value: "6.5", icon: Clock, tint: "text-primary" },
  { label: "Tasks completed", value: "18", icon: CheckCircle2, tint: "text-success" },
  { label: "Focus score", value: "82%", icon: TrendingUp, tint: "text-chart-2" },
];

const tools = [
  {
    to: "/email",
    title: "AI Email Generator",
    body: "Turn a few notes into a polished email in a formal, friendly or persuasive tone.",
    icon: Mail,
  },
  {
    to: "/planner",
    title: "AI Task Planner",
    body: "Build a realistic daily or weekly schedule with focus blocks and proper breaks.",
    icon: CalendarCheck,
  },
  {
    to: "/chat",
    title: "AI Workplace Chat",
    body: "Ask about meetings, decisions, writing and productivity — and think out loud.",
    icon: MessagesSquare,
  },
  {
    to: "/insights",
    title: "AI Insights",
    body: "See where your time goes and what to change next week.",
    icon: Lightbulb,
  },
] as const;

function Dashboard() {
  const { items } = useSavedWork();

  return (
    <AppShell
      title="Good day, Sandra"
      description="Here is your workspace at a glance."
      actions={
        <Button asChild className="hidden sm:inline-flex">
          <Link to="/chat">Ask the assistant</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <section className="brand-gradient relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-lift sm:p-9">
          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
              Today&apos;s focus
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Three outcomes, two focus blocks, zero busywork.
            </h2>
            <p className="mt-3 text-sm opacity-90">
              Start by drafting the message you have been putting off, then let the planner shape
              the rest of the day around it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link to="/email">
                  Draft an email <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              >
                <Link to="/planner">Plan my day</Link>
              </Button>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary-foreground/10" />
          <div className="pointer-events-none absolute -bottom-24 right-24 size-56 rounded-full bg-primary-foreground/10" />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="surface-card p-5 transition-shadow hover:shadow-lift">
              <s.icon className={`size-5 ${s.tint}`} />
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="surface-card group flex flex-col gap-3 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-200 group-hover:scale-105">
                <t.icon className="size-5" />
              </span>
              <h3 className="text-base font-semibold">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.body}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>

        <section className="surface-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Recently saved</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/saved">View all</Link>
            </Button>
          </div>
          {items.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing saved yet — anything you keep from the email generator, planner or chat will
              appear here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {items.slice(0, 4).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="truncate text-sm font-medium">{i.title}</span>
                  <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs capitalize text-secondary-foreground">
                    {i.kind}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
