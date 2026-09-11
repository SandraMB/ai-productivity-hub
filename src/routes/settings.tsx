import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSavedWork } from "@/lib/saved-work";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Workplace AI" },
      {
        name: "description",
        content: "Set your name, default tone, working hours and appearance for the assistant.",
      },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Personalise your workplace assistant." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Sandra Mbotho");
  const [role, setRole] = useState("Operations Lead");
  const [start, setStart] = useState("08:30");
  const [end, setEnd] = useState("17:00");
  const [dark, setDark] = useState(false);
  const [notify, setNotify] = useState(true);
  const [breaks, setBreaks] = useState(true);
  const { clear } = useSavedWork();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppShell title="Settings" description="Personalise how the assistant works with you.">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-6">
          <h2 className="text-base font-semibold">Your profile</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start">Day starts</Label>
              <Input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">Day ends</Label>
              <Input id="end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <Button onClick={() => toast.success("Preferences updated.")}>Save changes</Button>
        </section>

        <section className="surface-card space-y-5 p-6">
          <h2 className="text-base font-semibold">Preferences</h2>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Dark appearance</p>
              <p className="text-sm text-muted-foreground">Softer contrast for late sessions.</p>
            </div>
            <Switch checked={dark} onCheckedChange={setDark} aria-label="Dark appearance" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Focus reminders</p>
              <p className="text-sm text-muted-foreground">Nudge me before each focus block.</p>
            </div>
            <Switch checked={notify} onCheckedChange={setNotify} aria-label="Focus reminders" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Always schedule breaks</p>
              <p className="text-sm text-muted-foreground">
                Keep breaks in every generated plan, even on busy days.
              </p>
            </div>
            <Switch checked={breaks} onCheckedChange={setBreaks} aria-label="Always schedule breaks" />
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Saved work</p>
            <p className="text-sm text-muted-foreground">
              Everything is stored in this browser only. Clearing it cannot be undone.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                clear();
                toast.success("Saved work cleared.");
              }}
            >
              Clear saved work
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
