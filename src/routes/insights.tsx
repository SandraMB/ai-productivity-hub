import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, TrendingUp, TriangleAlert, Target } from "lucide-react";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "AI Insights | Workplace AI" },
      {
        name: "description",
        content: "See where your working time goes and what to change next week.",
      },
      { property: "og:title", content: "AI Insights" },
      {
        property: "og:description",
        content: "Weekly patterns, focus quality and practical suggestions.",
      },
    ],
  }),
  component: InsightsPage,
});

const breakdown = [
  { label: "Deep focus", value: 34, tone: "bg-primary" },
  { label: "Meetings", value: 28, tone: "bg-chart-2" },
  { label: "Email & messages", value: 21, tone: "bg-chart-3" },
  { label: "Admin", value: 17, tone: "bg-warning" },
];

const week = [
  { day: "Mon", focus: 68 },
  { day: "Tue", focus: 82 },
  { day: "Wed", focus: 54 },
  { day: "Thu", focus: 91 },
  { day: "Fri", focus: 73 },
];

const insights = [
  {
    icon: TrendingUp,
    tone: "text-success",
    title: "Thursday is your strongest day",
    body: "You complete 40% more focused work on Thursdays. Consider moving your hardest task there instead of Monday.",
  },
  {
    icon: TriangleAlert,
    tone: "text-warning",
    title: "Wednesday is fragmented",
    body: "Six meetings with gaps under 30 minutes left almost no usable focus time. Try clustering them into one afternoon block.",
  },
  {
    icon: Target,
    tone: "text-primary",
    title: "Email is creeping up",
    body: "You spent 4h 20m in your inbox this week, mostly in short bursts. Two fixed windows would recover roughly 90 minutes.",
  },
  {
    icon: Lightbulb,
    tone: "text-chart-2",
    title: "Your drafts are getting shorter",
    body: "Average email length dropped 22% since you started using the generator, and reply times improved alongside it.",
  },
];

function InsightsPage() {
  return (
    <AppShell title="AI Insights" description="Patterns from your simulated working week.">
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="text-base font-semibold">Where your time went</h2>
            <div className="mt-5 space-y-4">
              {breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{b.label}</span>
                    <span className="text-muted-foreground">{b.value}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${b.tone} transition-all duration-700`}
                      style={{ width: `${b.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-base font-semibold">Daily focus score</h2>
            <div className="mt-6 flex h-52 items-end justify-between gap-3">
              {week.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{d.focus}</span>
                  <div
                    className="brand-gradient w-full rounded-t-xl transition-all duration-700 hover:opacity-90"
                    style={{ height: `${d.focus}%` }}
                  />
                  <span className="text-xs font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {insights.map((i) => (
            <article
              key={i.title}
              className="surface-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <i.icon className={`size-5 ${i.tone}`} />
              <h3 className="mt-3 text-base font-semibold">{i.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{i.body}</p>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
