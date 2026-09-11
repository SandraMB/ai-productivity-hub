import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SendHorizonal, Bookmark, RotateCcw, User } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateChatReply, suggestedPrompts } from "@/lib/mock-ai";
import { useSavedWork } from "@/lib/saved-work";
import assistantMark from "@/assets/assistant-mark.png";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat | Workplace AI" },
      {
        name: "description",
        content:
          "Talk through meetings, decisions, writing and productivity with a workplace AI assistant.",
      },
      { property: "og:title", content: "AI Workplace Chat" },
      {
        property: "og:description",
        content: "Brainstorm, prepare and decide with a friendly workplace assistant.",
      },
    ],
  }),
  component: ChatPage,
});

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const greeting: Msg = {
  id: "welcome",
  role: "assistant",
  text: "Hi Sandra — I'm your workplace assistant. Ask me about meetings, tricky decisions, writing, or how to get through a heavy week. What is on your plate today?",
};

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { save } = useSavedWork();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [thinking]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content || thinking) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: content }]);
    setInput("");
    setThinking(true);
    setTimeout(
      () => {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", text: generateChatReply(content) },
        ]);
        setThinking(false);
      },
      800 + Math.random() * 600,
    );
  };

  return (
    <AppShell
      title="AI Workplace Chat"
      description="Think out loud, prepare, and decide faster."
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([greeting]);
              toast.success("Conversation cleared.");
            }}
          >
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">New chat</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (messages.length < 2) {
                toast.error("Have a quick chat first, then save it.");
                return;
              }
              save({
                kind: "chat",
                title: messages.find((m) => m.role === "user")?.text.slice(0, 60) ?? "Conversation",
                content: messages
                  .map((m) => `${m.role === "user" ? "You" : "Assistant"}: ${m.text}`)
                  .join("\n\n"),
              });
              toast.success("Conversation saved.");
            }}
          >
            <Bookmark className="size-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </>
      }
    >
      <div className="surface-card flex h-[calc(100vh-13rem)] min-h-[520px] flex-col overflow-hidden">
        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {messages.map((m) =>
            m.role === "assistant" ? (
              <div key={m.id} className="flex gap-3">
                <img
                  src={assistantMark}
                  alt=""
                  className="size-8 shrink-0 rounded-lg object-cover shadow-soft"
                />
                <div className="max-w-[46rem] whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-end gap-3">
                <div className="max-w-[36rem] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-soft">
                  {m.text}
                </div>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <User className="size-4" />
                </span>
              </div>
            ),
          )}

          {thinking ? (
            <div className="flex gap-3">
              <img src={assistantMark} alt="" className="size-8 shrink-0 rounded-lg object-cover" />
              <div className="flex items-center gap-1.5 pt-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-2 animate-bounce rounded-full bg-primary/60"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 ? (
          <div className="border-t border-border px-4 pt-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Try one of these
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 border-t border-border p-4 sm:p-6"
        >
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about a meeting, a decision, or what to prioritise…"
            className="max-h-40 min-h-[52px] flex-1 resize-none"
          />
          <Button type="submit" size="icon" className="size-[52px] shrink-0" disabled={thinking}>
            <SendHorizonal className="size-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
