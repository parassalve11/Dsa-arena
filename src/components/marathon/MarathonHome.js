"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Flag, Hourglass, Play, Swords, Trash, Trophy } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { difficultyColor } from "@/components/ui/Badge";
import { problems } from "@/data/problems";
import { topics } from "@/data/catalog";
import { candidates, createMarathon, finishMarathon, MAX_QUESTIONS, summary } from "@/lib/marathon";
import { deleteMarathonResult, useActiveMarathon, useMarathons, useProgress } from "@/lib/storage";
import { formatClock } from "@/lib/format";

const DURATIONS = [15, 30, 45, 60, 90, 120];
const DIFFS = ["Easy", "Medium", "Hard"];

function useNow(interval = 1000) {
  return useSyncExternalStore(
    (cb) => {
      const id = setInterval(cb, interval);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / interval) * interval,
    () => 0
  );
}

function Section({ title, step, children, hint }) {
  return (
    <section className="rounded-lg border border-border bg-panel p-5">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-[0.8rem] font-semibold text-accent-soft">{step}</span>
        <h2 className="font-semibold">{title}</h2>
        {hint && <span className="text-[0.85rem] text-muted">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Toggle({ on, onClick, children, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.88rem] transition-colors ${
        on ? "border-accent bg-accent/15 text-text" : "border-border bg-panel-2 text-text-soft hover:border-border-strong hover:text-text"
      }`}
      style={on && color ? { borderColor: color, background: `color-mix(in srgb, ${color} 15%, transparent)` } : undefined}
    >
      {on && <Check className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

function ActiveBanner({ active }) {
  const router = useRouter();
  const now = useNow();
  const [confirm, setConfirm] = useState(false);
  const s = summary(active);
  const left = Math.max(0, (active.endsAt - (now || Date.now())) / 1000);
  const first = active.questions.find((q) => q.status !== "solved") || active.questions[0];
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-medium/30 bg-medium/10 p-5">
      <Hourglass className="h-6 w-6 text-medium" />
      <div className="min-w-0 flex-1">
        <div className="font-semibold">Marathon in progress</div>
        <div className="text-[0.92rem] text-text-soft">
          {s.solved}/{s.total} solved · <span className="font-mono">{formatClock(left)}</span> left
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={() => setConfirm(true)}
      >
        <Flag className="h-4 w-4" /> End now
      </Button>
      <Button variant="primary" onClick={() => router.push(`/marathon/play/${first.slug}`)}>
        <Play className="h-4 w-4" /> Resume
      </Button>
      <ConfirmDialog
        open={confirm}
        title="End this marathon?"
        message="Your result will be saved with the questions you solved so far."
        confirmLabel="End marathon"
        danger
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          const m = finishMarathon("ended");
          setConfirm(false);
          if (m) router.push(`/marathon/results/${m.id}`);
        }}
      />
    </div>
  );
}

function History() {
  const list = useMarathons();
  if (!list.length) {
    return <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-[0.92rem] text-muted">Finished marathons will show up here.</p>;
  }
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-panel">
      {list.map((m) => {
        const s = summary(m);
        const pct = s.total ? Math.round((s.solved / s.total) * 100) : 0;
        return (
          <li key={m.id} className="group flex items-center gap-4 px-4 py-3 hover:bg-panel-2">
            <Link href={`/marathon/results/${m.id}`} className="flex min-w-0 flex-1 items-center gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${pct === 100 ? "bg-success/15 text-success" : "bg-panel-3 text-text-soft"}`}>
                {pct === 100 ? <Trophy className="h-5 w-5" /> : <span className="text-[0.85rem] font-semibold">{pct}%</span>}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium">{m.topics.length ? m.topics.join(", ") : "All topics"}</div>
                <div className="text-[0.85rem] text-muted">
                  {new Date(m.startedAt).toLocaleString()} · {s.solved}/{s.total} solved · {formatClock(s.used / 1000)} used
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => deleteMarathonResult(m.id)}
              className="rounded-md p-2 text-muted opacity-0 hover:bg-panel-3 hover:text-danger group-hover:opacity-100"
              aria-label="Delete this result"
            >
              <Trash className="h-4 w-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function MarathonHome() {
  const router = useRouter();
  const active = useActiveMarathon();
  const progress = useProgress();
  const [selTopics, setSelTopics] = useState([]);
  const [diffs, setDiffs] = useState(["Easy", "Medium"]);
  const [count, setCount] = useState(5);
  const [minutes, setMinutes] = useState(60);
  const [order, setOrder] = useState("random");
  const [includeSolved, setIncludeSolved] = useState(false);

  const opts = { topics: selTopics, difficulties: diffs, includeSolved };
  const pool = useMemo(
    () => candidates(problems, opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selTopics, diffs, includeSolved, progress]
  );
  const realCount = Math.min(count, pool.length, MAX_QUESTIONS);
  const running = active && !active.finishedAt;

  function toggle(list, setList, v) {
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  function start() {
    const m = createMarathon(problems, { ...opts, count: realCount, minutes, order });
    if (m.questions.length) router.push(`/marathon/play/${m.questions[0].slug}`);
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-[1100px] space-y-5 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15">
            <Swords className="h-6 w-6 text-accent-soft" />
          </div>
          <div>
            <h1 className="text-[1.5rem] font-semibold tracking-tight">Marathon</h1>
            <p className="text-[0.95rem] text-muted">Pick topics, set a timer, and solve as many questions as you can before it runs out.</p>
          </div>
        </div>

        {running && <ActiveBanner active={active} />}

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <Section step={1} title="Topics" hint={selTopics.length ? `${selTopics.length} selected` : "none selected = all topics"}>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => {
                  const n = problems.filter((p) => p.topic === t).length;
                  return (
                    <Toggle key={t} on={selTopics.includes(t)} onClick={() => toggle(selTopics, setSelTopics, t)}>
                      {t} <span className="text-[0.8rem] text-muted">{n}</span>
                    </Toggle>
                  );
                })}
              </div>
              {selTopics.length > 0 && (
                <button type="button" onClick={() => setSelTopics([])} className="mt-3 text-[0.85rem] text-muted hover:text-text">
                  Clear selection
                </button>
              )}
            </Section>

            <Section step={2} title="Difficulty">
              <div className="flex flex-wrap gap-2">
                {DIFFS.map((d) => (
                  <Toggle key={d} on={diffs.includes(d)} color={difficultyColor(d)} onClick={() => toggle(diffs, setDiffs, d)}>
                    {d}
                  </Toggle>
                ))}
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-[0.92rem] text-text-soft">
                <input type="checkbox" checked={includeSolved} onChange={(e) => setIncludeSolved(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
                Include problems I have already solved
              </label>
            </Section>

            <Section step={3} title="Questions and time">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-[0.9rem] text-text-soft">
                    Number of questions: <span className="font-semibold text-text">{realCount}</span>
                    {pool.length < count && <span className="text-muted"> (only {pool.length} available)</span>}
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={MAX_QUESTIONS}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </label>
                <div>
                  <div className="mb-2 text-[0.9rem] text-text-soft">Time limit</div>
                  <div className="flex flex-wrap gap-1.5">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setMinutes(d)}
                        className={`h-8 rounded-md px-2.5 text-[0.86rem] font-medium ${
                          minutes === d ? "bg-accent text-white" : "bg-panel-2 text-text-soft hover:bg-panel-3"
                        }`}
                      >
                        {d < 60 ? `${d}m` : `${d / 60}h`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-2 text-[0.9rem] text-text-soft">Order</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ["random", "Random"],
                    ["easy-first", "Easy → Hard"],
                    ["sheet", "Sheet order"],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setOrder(id)}
                      className={`h-8 rounded-md px-3 text-[0.86rem] font-medium ${order === id ? "bg-accent text-white" : "bg-panel-2 text-text-soft hover:bg-panel-3"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </Section>
          </div>

          <aside className="h-fit space-y-4 rounded-lg border border-border bg-panel p-5 lg:sticky lg:top-24">
            <h2 className="font-semibold">Summary</h2>
            <dl className="space-y-2 text-[0.92rem]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Topics</dt>
                <dd className="text-right">{selTopics.length ? selTopics.join(", ") : "All"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Difficulty</dt>
                <dd>{diffs.length ? diffs.join(", ") : "Any"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Matching problems</dt>
                <dd>{pool.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Questions</dt>
                <dd className="font-semibold">{realCount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Time</dt>
                <dd className="font-semibold">{minutes} minutes</dd>
              </div>
            </dl>
            <p className="text-[0.84rem] leading-relaxed text-muted">
              Answers are locked during the marathon, and code is kept separately from your normal practice code.
            </p>
            <Button variant="primary" size="lg" className="w-full justify-center" disabled={!realCount || running} onClick={start}>
              <Play className="h-4 w-4" /> {running ? "Finish the current one first" : "Start marathon"}
            </Button>
          </aside>
        </div>

        <div>
          <h2 className="mb-3 mt-4 font-semibold">Past marathons</h2>
          <History />
        </div>
      </main>
    </>
  );
}
