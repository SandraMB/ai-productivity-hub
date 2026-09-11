export type Tone = "Formal" | "Friendly" | "Persuasive";

const clean = (s: string) => s.trim().replace(/\s+/g, " ");

function subjectFrom(context: string, tone: Tone) {
  const words = clean(context).split(" ").slice(0, 7).join(" ");
  const base = words || "Quick update";
  const prefix =
    tone === "Formal" ? "Regarding" : tone === "Persuasive" ? "An opportunity:" : "Quick note:";
  return `${prefix} ${base.charAt(0).toUpperCase()}${base.slice(1)}`;
}

const variants = [0, 1, 2];

export function generateEmail(context: string, tone: Tone, seed = 0): string {
  const ctx = clean(context) || "the topic we discussed";
  const v = variants[seed % variants.length];
  const subject = subjectFrom(ctx, tone);

  const openings: Record<Tone, string[]> = {
    Formal: [
      "I hope this message finds you well.",
      "Thank you for your time earlier this week.",
      "I am writing to follow up on our recent discussion.",
    ],
    Friendly: [
      "Hope your week is going well!",
      "Great catching up with you recently.",
      "Hi there — quick one from my side.",
    ],
    Persuasive: [
      "I wanted to share something I think will genuinely move the needle for your team.",
      "There is a short window here that I would hate for us to miss.",
      "I have been thinking about how we can get you results faster.",
    ],
  };

  const bodies: Record<Tone, string[]> = {
    Formal: [
      `I would like to provide an update on ${ctx}. We have reviewed the relevant details and believe the proposed approach is both practical and aligned with the objectives previously agreed.`,
      `With reference to ${ctx}, please find a summary of the current position below. The work is progressing to plan and no material risks have been identified at this stage.`,
      `Further to ${ctx}, I have consolidated the key points so that a decision can be taken efficiently at the next available opportunity.`,
    ],
    Friendly: [
      `Just wanted to touch base about ${ctx}. Things are moving along nicely and I thought you would like a quick snapshot before we go further.`,
      `Quick update on ${ctx} — we have made good progress and I would love your thoughts before the next step.`,
      `Circling back on ${ctx}. Nothing urgent, but a couple of small decisions would help us keep the momentum going.`,
    ],
    Persuasive: [
      `On ${ctx}: the opportunity here is clear. Teams that act early typically see faster turnaround, fewer handovers, and a noticeably lighter admin load within the first month.`,
      `Regarding ${ctx}, the case is straightforward — a small commitment now unlocks a disproportionate return later, and the setup effort is minimal.`,
      `About ${ctx}: I believe this is the highest-leverage change available to us this quarter, and it costs very little to try.`,
    ],
  };

  const points = [
    "Current status and what has already been completed",
    "The two decisions that need your input",
    "Proposed timeline with owners for each step",
  ];

  const closings: Record<Tone, string[]> = {
    Formal: [
      "Please let me know if you require any further information. I would be pleased to arrange a call at your convenience.",
      "I would welcome your feedback and remain available should you wish to discuss this in more detail.",
      "Kindly advise on your preferred next step and I will proceed accordingly.",
    ],
    Friendly: [
      "Let me know what you think — happy to jump on a quick call if that is easier.",
      "Give me a shout if anything is unclear and I will sort it out.",
      "Would love your take whenever you have a moment.",
    ],
    Persuasive: [
      "Can we lock in twenty minutes this week to get this moving?",
      "If you are open to it, I will send a short plan today and we can start on Monday.",
      "Shall I go ahead and reserve the slot so we do not lose the window?",
    ],
  };

  const signoff = tone === "Formal" ? "Kind regards," : tone === "Friendly" ? "Cheers," : "Best,";

  return [
    `Subject: ${subject}`,
    "",
    tone === "Formal" ? "Dear colleague," : "Hi,",
    "",
    openings[tone][v],
    "",
    bodies[tone][v],
    "",
    ...points.map((p, i) => `${i + 1}. ${p}`),
    "",
    closings[tone][v],
    "",
    signoff,
    "Sandra",
  ].join("\n");
}

export function improveEmail(current: string): string {
  const improved = current
    .replace(/\bvery\s+/gi, "")
    .replace(/\bjust\s+/gi, "")
    .replace(/\bI think\b/gi, "I recommend")
    .replace(/\bASAP\b/gi, "by end of day");
  return `${improved}\n\nP.S. Tightened the wording, removed filler, and made the requested next step explicit.`;
}

export type Priority = "High" | "Medium" | "Low";

export interface TaskInput {
  id: string;
  title: string;
  priority: Priority;
  deadline: string;
}

export interface PlanBlock {
  id: string;
  time: string;
  label: string;
  kind: "focus" | "task" | "break" | "admin" | "review";
  note: string;
}

const order: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

export function generatePlan(tasks: TaskInput[], range: "Daily" | "Weekly", seed = 0): PlanBlock[] {
  const sorted = [...tasks].sort(
    (a, b) => order[a.priority] - order[b.priority] || a.deadline.localeCompare(b.deadline),
  );
  const uid = (i: number) => `${Date.now().toString(36)}-${seed}-${i}`;

  if (range === "Daily") {
    const slots = [
      "08:30 – 09:00",
      "09:00 – 10:30",
      "10:30 – 10:45",
      "10:45 – 12:15",
      "12:15 – 13:00",
      "13:00 – 14:30",
      "14:30 – 14:45",
      "14:45 – 16:00",
      "16:00 – 16:30",
    ];
    const blocks: PlanBlock[] = [];
    let t = 0;
    blocks.push({
      id: uid(t),
      time: slots[0],
      label: "Plan the day & clear inbox",
      kind: "admin",
      note: "Triage messages, confirm today's top three outcomes.",
    });
    const deep = [slots[1], slots[3], slots[5], slots[7]];
    let di = 0;
    sorted.forEach((task, i) => {
      if (di < deep.length) {
        blocks.push({
          id: uid(++t),
          time: deep[di],
          label: `${task.priority === "High" ? "Deep focus" : "Work block"}: ${task.title}`,
          kind: "focus",
          note:
            task.priority === "High"
              ? `Protected focus time. Deadline ${task.deadline || "not set"} — no meetings, notifications off.`
              : `Steady progress block. Deadline ${task.deadline || "not set"}.`,
        });
        di += 1;
        if (i === 0)
          blocks.push({
            id: uid(++t),
            time: slots[2],
            label: "Short break — stretch & water",
            kind: "break",
            note: "15 minutes away from the screen to reset attention.",
          });
        if (i === 1)
          blocks.push({
            id: uid(++t),
            time: slots[4],
            label: "Lunch & walk",
            kind: "break",
            note: "Step outside if you can — it protects afternoon energy.",
          });
        if (i === 2)
          blocks.push({
            id: uid(++t),
            time: slots[6],
            label: "Coffee break",
            kind: "break",
            note: "Reset before the final stretch.",
          });
      }
    });
    blocks.push({
      id: uid(++t),
      time: slots[8],
      label: "Wrap-up & tomorrow's shortlist",
      kind: "review",
      note: "Log progress, park loose ends, pick tomorrow's top three.",
    });
    return blocks;
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return days.map((day, i) => {
    const task = sorted[i % Math.max(sorted.length, 1)];
    return {
      id: uid(i),
      time: day,
      label: task
        ? `${task.priority} priority: ${task.title}`
        : `${day} — buffer & catch-up`,
      kind: i === 4 ? "review" : task && task.priority === "High" ? "focus" : "task",
      note: task
        ? `Morning: 2h protected focus. Midday: 45m break. Afternoon: collaboration and review. Deadline ${task.deadline || "flexible"}.`
        : "Keep this open for overflow, admin and unplanned requests.",
    };
  });
}

const chatCanned: { match: RegExp; reply: string }[] = [
  {
    match: /meeting|agenda|prep/i,
    reply:
      "Here is a tight 30-minute agenda you can send as-is:\n\n1. Context (3 min) — why we are here, decision needed\n2. Status snapshot (5 min) — one slide, no narration\n3. Open risks (7 min) — top three only\n4. Decision (10 min) — options A/B with trade-offs\n5. Actions (5 min) — owner and date for each\n\nTwo things that make this work: send the pre-read 24 hours ahead, and start with the decision you need rather than the history.",
  },
  {
    match: /brainstorm|idea|ideas/i,
    reply:
      "Let's open it up. Six angles to pull on:\n\n• Remove a step — what part of the process would nobody miss?\n• Borrow — which team already solved a version of this?\n• Invert — what would guarantee failure, and how do we avoid it?\n• Extreme constraint — how would you do it with one afternoon and no budget?\n• Audience shift — how would this look for a brand-new joiner?\n• Automate the boring — where does the same information get retyped?\n\nPick the two that feel uncomfortable; those usually hold the good ideas.",
  },
  {
    match: /decide|decision|choose|option/i,
    reply:
      "Try a quick weighted call rather than a long debate:\n\n1. Write the decision as a single sentence.\n2. List no more than three options.\n3. Score each 1–5 on impact, effort, risk and reversibility.\n4. Double the weight on reversibility — cheap-to-undo choices deserve speed.\n5. Name one owner and a review date.\n\nIf two options score within a point of each other, pick the faster one. The difference is smaller than the delay.",
  },
  {
    match: /write|draft|email|message|copy/i,
    reply:
      "A reliable structure for workplace writing:\n\n• Line 1: the ask or the headline\n• Line 2–4: the minimum context needed to act\n• Bullets: only the facts that change the decision\n• Last line: the specific next step and date\n\nThen delete the first sentence you wrote — it is almost always a warm-up. If you paste your draft here I will tighten it.",
  },
  {
    match: /productiv|focus|time|busy|overwhelm/i,
    reply:
      "When the day feels full, shrink the unit of work:\n\n• Choose three outcomes, not a list of twelve\n• Book two 90-minute focus blocks before 13:00 and defend them\n• Batch messages into two windows instead of a constant trickle\n• Take a real 15-minute break between blocks — it is what makes the second block work\n• End the day by writing tomorrow's first task, so you start without deciding\n\nWant me to turn that into a schedule in the Task Planner?",
  },
  {
    match: /recommend|tool|suggest|advice/i,
    reply:
      "A few recommendations, ordered by payoff:\n\n1. One shared source of truth per project — scattered docs cost more than any tool\n2. A written weekly update (five lines) instead of a status meeting\n3. Templates for your three most repeated messages\n4. A visible decision log — it ends the same conversation happening twice\n\nStart with the decision log. It is the cheapest and the one people thank you for.",
  },
];

export function generateChatReply(input: string): string {
  const found = chatCanned.find((c) => c.match.test(input));
  if (found) return found.reply;
  const topic = clean(input).replace(/\?+$/, "");
  return `Good question. Here is how I would approach "${topic}":\n\n1. Define the outcome — what does done actually look like, and who notices?\n2. Find the constraint — time, information, or a decision waiting on someone else.\n3. Take the smallest useful step today, even if it is only a message asking for the missing piece.\n4. Set a review point so this does not quietly drift.\n\nIf you tell me a bit more about the context — the people involved and your deadline — I can turn this into a concrete plan or a draft you can send.`;
}

export const suggestedPrompts = [
  "Help me prepare for a quarterly review meeting",
  "Brainstorm ways to cut our reporting time in half",
  "I need to decide between two suppliers — how do I choose?",
  "Rewrite this update so it is shorter and clearer",
  "My week is overloaded. How should I prioritise?",
  "Recommend habits for a more focused team",
];
