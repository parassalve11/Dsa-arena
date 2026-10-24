"use client";

import Link from "next/link";
import { ExternalLink, Hourglass, RotateCcw, Trophy } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { DifficultyBadge } from "@/components/ui/Badge";
import { StatusIcon } from "@/components/dashboard/StatusIcon";
import { bySlug } from "@/data/catalog";
import { summary } from "@/lib/marathon";
import { useMarathons } from "@/lib/storage";
import { formatClock } from "@/lib/format";
import { useHydrated } from "@/lib/useMediaQuery";

const REASON = {
  completed: "You solved every question.",
  time: "Time ran out.",
  ended: "You ended the marathon early.",
};

export function MarathonResults({ id }) {
  const list = useMarathons();
  const hydrated = useHydrated();
  const m = list.find((x) => x.id === id);

  if (!hydrated) return <AppHeader />;
  if (!m) {
    return (
      <>
        <AppHeader />
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-xl font-semibold">Result not found</h1>
          <p className="mt-2 text-muted">It may have been deleted, or it was saved in another browser.</p>
          <Link href="/marathon" className="mt-6 inline-flex h-10 items-center rounded-md bg-accent px-4 font-medium text-white">
            Back to Marathon
          </Link>
        </main>
      </>
    );
  }

  const s = summary(m);
  const pct = s.total ? Math.round((s.solved / s.total) * 100) : 0;
  const perfect = s.solved === s.total;

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-[900px] space-y-5 px-4 py-8 sm:px-6">
        <div className="animate-in rounded-xl border border-border bg-panel p-6 text-center sm:p-8">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${perfect ? "bg-success/15 text-success" : "bg-accent/15 text-accent-soft"}`}>
            {perfect ? <Trophy className="h-8 w-8" /> : <Hourglass className="h-8 w-8" />}
          </div>
          <h1 className="text-[1.6rem] font-semibold tracking-tight">
            {s.solved} of {s.total} solved
          </h1>
          <p className="mt-1 text-muted">{REASON[m.reason] || "Marathon finished."}</p>
          <div className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-3">
            <div className="rounded-lg bg-panel-2 p-3">
              <div className="text-[1.3rem] font-semibold">{pct}%</div>
              <div className="text-[0.82rem] text-muted">score</div>
            </div>
            <div className="rounded-lg bg-panel-2 p-3">
              <div className="font-mono text-[1.3rem] font-semibold">{formatClock(s.used / 1000)}</div>
              <div className="text-[0.82rem] text-muted">time used</div>
            </div>
            <div className="rounded-lg bg-panel-2 p-3">
              <div className="font-mono text-[1.3rem] font-semibold">{formatClock(m.durationMs / 1000)}</div>
              <div className="text-[0.82rem] text-muted">time limit</div>
            </div>
          </div>
          <p className="mt-5 text-[0.88rem] text-muted">
            {m.topics.length ? m.topics.join(", ") : "All topics"} · {m.difficulties.length ? m.difficulties.join(", ") : "Any difficulty"} ·{" "}
            {new Date(m.startedAt).toLocaleString()}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-panel">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[0.8rem] uppercase tracking-wide text-muted">
                <th className="w-12 py-3 pl-4 font-medium">#</th>
                <th className="py-3 font-medium">Question</th>
                <th className="w-28 py-3 font-medium">Difficulty</th>
                <th className="w-28 py-3 font-medium">Solved at</th>
                <th className="w-24 py-3 pr-4 text-right font-medium">Tries</th>
              </tr>
            </thead>
            <tbody>
              {m.questions.map((q, i) => {
                const p = bySlug[q.slug];
                return (
                  <tr key={q.slug} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pl-4">
                      <StatusIcon status={q.status === "todo" ? undefined : q.status} />
                    </td>
                    <td className="py-3 pr-3">
                      <Link href={`/problems/${q.slug}`} className="font-medium hover:text-accent-soft">
                        Q{i + 1}. {p.title}
                      </Link>
                      <a
                        href={p.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex translate-y-0.5 text-muted hover:text-accent-soft"
                        aria-label="Open on LeetCode"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <div className="text-[0.8rem] text-muted">{p.topic}</div>
                    </td>
                    <td className="py-3">
                      <DifficultyBadge value={p.difficulty} />
                    </td>
                    <td className="py-3 font-mono text-[0.9rem] text-text-soft">{q.solvedAt !== null ? formatClock(q.solvedAt / 1000) : "—"}</td>
                    <td className="py-3 pr-4 text-right text-[0.9rem] text-muted">{q.attempts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/marathon" className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 font-medium text-white hover:bg-accent-hover">
            <RotateCcw className="h-4 w-4" /> New marathon
          </Link>
          <Link href="/" className="inline-flex h-10 items-center rounded-md border border-border bg-panel-2 px-4 font-medium hover:bg-panel-3">
            Back to problems
          </Link>
        </div>
        <p className="text-center text-[0.85rem] text-muted">Unsolved questions are a great review list: open them in practice mode, where answers are unlocked.</p>
      </main>
    </>
  );
}
