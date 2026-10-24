"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";

function Ring({ value, total }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  return (
    <svg viewBox="0 0 100 100" className="h-[92px] w-[92px] -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--panel-3)" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        style={{ transition: "stroke-dasharray 400ms ease" }}
      />
    </svg>
  );
}

function DifficultyCard({ label, color, solved, total }) {
  const pct = total ? (solved / total) * 100 : 0;
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-panel p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[0.95rem] font-medium" style={{ color }}>
          {label}
        </span>
        <span className="text-[0.9rem] text-muted">
          <span className="text-lg font-semibold text-text">{solved}</span>/{total}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel-3">
        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function StatsRow({ problems, progress, lastSlug }) {
  const router = useRouter();
  const solved = problems.filter((p) => progress[p.slug]?.status === "solved");
  const attempted = problems.filter((p) => progress[p.slug]?.status === "attempted").length;
  const by = (d) => ({
    solved: solved.filter((p) => p.difficulty === d).length,
    total: problems.filter((p) => p.difficulty === d).length,
  });
  const last = problems.find((p) => p.slug === lastSlug);

  function random() {
    const pool = problems.filter((p) => progress[p.slug]?.status !== "solved");
    const list = pool.length ? pool : problems;
    const pick = list[Math.floor(Math.random() * list.length)];
    if (pick) router.push(`/problems/${pick.slug}`);
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1.25fr]">
      <div className="col-span-2 flex items-center gap-4 rounded-lg border border-border bg-panel p-4 md:col-span-4 xl:col-span-1">
        <div className="relative">
          <Ring value={solved.length} total={problems.length} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold leading-none">{solved.length}</span>
            <span className="mt-0.5 text-[0.75rem] text-muted">/{problems.length}</span>
          </div>
        </div>
        <div>
          <div className="text-[0.95rem] font-medium">Solved</div>
          <div className="text-[0.88rem] text-muted">{attempted} attempted</div>
          <div className="text-[0.88rem] text-muted">{problems.length - solved.length - attempted} to go</div>
        </div>
      </div>
      <DifficultyCard label="Easy" color="var(--easy)" {...by("Easy")} />
      <DifficultyCard label="Medium" color="var(--medium)" {...by("Medium")} />
      <DifficultyCard label="Hard" color="var(--hard)" {...by("Hard")} />
      <div className="col-span-2 flex flex-col justify-center gap-2 rounded-lg border border-border bg-panel p-3 md:col-span-1">
        {last ? (
          <Link
            href={`/problems/${last.slug}`}
            className="flex h-10 items-center gap-2 rounded-md bg-accent px-3 text-[0.92rem] font-medium text-white hover:bg-accent-hover"
            title={last.title}
          >
            <Play className="h-4 w-4 shrink-0" />
            <span className="truncate">Continue: {last.title}</span>
          </Link>
        ) : (
          <Link
            href={`/problems/${problems[0]?.slug}`}
            className="flex h-10 items-center gap-2 rounded-md bg-accent px-3 text-[0.92rem] font-medium text-white hover:bg-accent-hover"
          >
            <Play className="h-4 w-4" /> Start with #1
          </Link>
        )}
        <Button onClick={random} className="w-full justify-start">
          <Shuffle className="h-4 w-4" /> Random unsolved
        </Button>
      </div>
    </div>
  );
}
