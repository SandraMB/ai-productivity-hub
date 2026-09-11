import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Sparkles, Bookmark, Pencil, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateEmail, improveEmail, type Tone } from "@/lib/mock-ai";
import { useSavedWork } from "@/lib/saved-work";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "AI Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Turn a few notes into a polished workplace email in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "AI Email Generator" },
      {
        property: "og:description",
        content: "Draft, improve and save professional emails in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const tones: Tone[] = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [seed, setSeed] = useState(0);
  const { save } = useSavedWork();

  const run = (nextSeed: number) => {
    if (!context.trim()) {
      toast.error("Add a little context first so the draft has something to work with.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setOutput(generateEmail(context, tone, nextSeed));
      setSeed(nextSeed);
      setEditing(false);
      setBusy(false);
    }, 700);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Email copied to your clipboard.");
  };

  return (
    <AppShell
      title="AI Email Generator"
      description="Describe the situation and get a ready-to-send draft."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="surface-card h-fit space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="context">What is this email about?</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. following up with the finance team about the delayed Q3 report and asking for a new date"
              className="min-h-36 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="grid grid-cols-3 gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    tone === t
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={() => run(seed)} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {busy ? "Writing your email…" : "Generate email"}
          </Button>
        </section>

        <section className="surface-card flex min-h-[420px] flex-col p-6">
          {output ? (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Button size="sm" variant={editing ? "default" : "outline"} onClick={() => setEditing((e) => !e)}>
                  {editing ? <Check className="size-4" /> : <Pencil className="size-4" />}
                  {editing ? "Done" : "Edit"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setOutput(improveEmail(output));
                    toast.success("Draft improved.");
                  }}
                >
                  <Sparkles className="size-4" /> Improve
                </Button>
                <Button size="sm" variant="outline" onClick={() => run(seed + 1)} disabled={busy}>
                  <RefreshCw className={cn("size-4", busy && "animate-spin")} /> Regenerate
                </Button>
                <Button size="sm" variant="outline" onClick={copy}>
                  <Copy className="size-4" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    save({
                      kind: "email",
                      title: output.split("\n")[0].replace(/^Subject:\s*/, "") || "Untitled email",
                      content: output,
                    });
                    toast.success("Saved to Saved Work.");
                  }}
                >
                  <Bookmark className="size-4" /> Save
                </Button>
              </div>

              {editing ? (
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="min-h-[420px] flex-1 resize-none font-mono text-sm leading-relaxed"
                />
              ) : (
                <article className="flex-1 whitespace-pre-wrap rounded-2xl bg-secondary/60 p-5 text-sm leading-relaxed">
                  {output}
                </article>
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Sparkles className="size-6" />
              </span>
              <p className="text-sm font-medium">Your draft will appear here</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Add the context on the left, pick a tone, and generate. You can edit every word
                afterwards.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
