"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flag, Hourglass } from "lucide-react";
import { Workspace, WorkspaceSkeleton } from "@/components/workspace/Workspace";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { Tooltip } from "@/components/ui/Tooltip";
import { bySlug } from "@/data/catalog";
import { finishMarathon, recordAttempt, recordSolved } from "@/lib/marathon";
import { useActiveMarathon } from "@/lib/storage";
import { formatClock } from "@/lib/format";

function Countdown({ endsAt, onExpire }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);
  const left = Math.max(0, (endsAt - now) / 1000);
  useEffect(() => {
    if (left <= 0) onExpire();
  }, [left, onExpire]);
  const tone = left < 60 ? "text-danger border-danger/40 bg-danger/10" : left < 300 ? "text-medium border-medium/40 bg-medium/10" : "text-text border-border bg-panel-2";
  return (
    <div className={`flex h-9 items-center gap-1.5 rounded-md border px-2.5 font-mono text-[0.95rem] tabular-nums ${tone}`} title="Time left">
      <Hourglass className="h-4 w-4" />
      {formatClock(left)}
    </div>
  );
}

function QuestionPills({ questions, current }) {
  return (
    <div className="ml-1 hidden items-center gap-1 xl:flex">
      {questions.map((q, i) => {
        const p = bySlug[q.slug];
        const on = q.slug === current;
        const color =
          q.status === "solved" ? "bg-success/20 text-success border-success/40" : q.status === "attempted" ? "bg-medium/15 text-medium border-medium/40" : "bg-panel-2 text-muted border-border";
        return (
          <Tooltip key={q.slug} content={`${p.title} · ${p.difficulty}`}>
            <Link
              href={`/marathon/play/${q.slug}`}
              className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-1.5 text-[0.8rem] font-semibold ${color} ${on ? "ring-2 ring-accent ring-offset-1 ring-offset-bg" : ""}`}
            >
              Q{i + 1}
            </Link>
          </Tooltip>
        );
      })}
    </div>
  );
}

export function MarathonPlay({ slug }) {
  const router = useRouter();
  const active = useActiveMarathon();
  const [hydrated, setHydrated] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  useEffect(() => setHydrated(true), []);

  const inMarathon = active && !active.finishedAt && active.questions.some((q) => q.slug === slug);

  const marathon = useMemo(() => {
    if (!inMarathon) return null;
    const qs = active.questions;
    const i = qs.findIndex((q) => q.slug === slug);
    const statusOf = (s) => {
      const q = qs.find((x) => x.slug === s);
      return q && q.status !== "todo" ? q.status : undefined;
    };
    const nextUnsolved = qs.slice(i + 1).concat(qs.slice(0, i)).find((q) => q.status !== "solved");
    return {
      scope: active.id,
      items: qs.map((q) => bySlug[q.slug]),
      hrefFor: (p) => `/marathon/play/${p.slug}`,
      prevHref: i > 0 ? `/marathon/play/${qs[i - 1].slug}` : null,
      nextHref: i < qs.length - 1 ? `/marathon/play/${qs[i + 1].slug}` : null,
      statusOf,
      onAttempt: recordAttempt,
      onSolved: recordSolved,
      onNext: nextUnsolved ? () => router.push(`/marathon/play/${nextUnsolved.slug}`) : null,
    };
  }, [inMarathon, active, slug, router]);

  // Finished (time up, all solved, or ended) -> results page.
  const [finishedId, setFinishedId] = useState(null);
  const [lastId, setLastId] = useState(null);
  useEffect(() => {
    if (active && !active.finishedAt) setLastId(active.id);
    else if (lastId && !finishedId) {
      // Solving the last question finishes the marathon: let the confetti play first.
      const t = setTimeout(() => setFinishedId(lastId), 1500);
      return () => clearTimeout(t);
    }
  }, [active, lastId, finishedId]);
  useEffect(() => {
    if (finishedId) router.replace(`/marathon/results/${finishedId}`);
  }, [finishedId, router]);

  if (!hydrated) return <WorkspaceSkeleton />;

  if (!inMarathon) {
    if (finishedId || lastId) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-2 text-center">
          <Hourglass className="h-8 w-8 text-accent-soft" />
          <p className="text-lg font-semibold">Marathon finished</p>
          <p className="text-muted">Loading your results…</p>
        </div>
      );
    }
    return (
      <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
        <Hourglass className="mb-4 h-10 w-10 text-muted" />
        <h1 className="text-xl font-semibold">No marathon is running for this question</h1>
        <p className="mt-2 text-muted">Start a new marathon, or open the problem in normal practice mode.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/marathon" className="inline-flex h-10 items-center rounded-md bg-accent px-4 font-medium text-white hover:bg-accent-hover">
            Go to Marathon
          </Link>
          {bySlug[slug] && (
            <Link href={`/problems/${slug}`} className="inline-flex h-10 items-center rounded-md border border-border bg-panel-2 px-4 font-medium hover:bg-panel-3">
              Practice this problem
            </Link>
          )}
        </div>
      </div>
    );
  }

  const solved = active.questions.filter((q) => q.status === "solved").length;

  const expire = () => {
    const m = finishMarathon("time");
    if (m) setFinishedId(m.id);
  };

  const full = {
    ...marathon,
    topLeft: <QuestionPills questions={active.questions} current={slug} />,
    topRight: (
      <>
        <span className="hidden text-[0.88rem] text-muted md:inline">
          <span className="font-semibold text-text">{solved}</span>/{active.questions.length} solved
        </span>
        <Countdown endsAt={active.endsAt} onExpire={expire} />
        <Tooltip content="End marathon">
          <button
            type="button"
            onClick={() => setConfirmEnd(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-danger/15 hover:text-danger"
            aria-label="End marathon"
          >
            <Flag className="h-[18px] w-[18px]" />
          </button>
        </Tooltip>
      </>
    ),
  };

  return (
    <>
      <Workspace slug={slug} marathon={full} />
      <ConfirmDialog
        open={confirmEnd}
        title="End this marathon?"
        message={`You have solved ${solved} of ${active.questions.length}. Your result will be saved.`}
        confirmLabel="End marathon"
        danger
        onCancel={() => setConfirmEnd(false)}
        onConfirm={() => {
          setConfirmEnd(false);
          const m = finishMarathon("ended");
          if (m) setFinishedId(m.id);
        }}
      />
    </>
  );
}
