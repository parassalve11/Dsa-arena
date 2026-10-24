"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { formatClock } from "@/lib/format";
import { Tooltip } from "@/components/ui/Tooltip";

/** Optional stopwatch. Hidden until you click the timer icon. */
export function Stopwatch() {
  const [visible, setVisible] = useState(false);
  const [running, setRunning] = useState(false);
  const [base, setBase] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [, tick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, [running]);

  const elapsed = base + (running && startedAt ? Date.now() - startedAt : 0);

  function start() {
    setStartedAt(Date.now());
    setRunning(true);
  }
  function pause() {
    setBase(elapsed);
    setRunning(false);
  }
  function reset() {
    setBase(0);
    setStartedAt(Date.now());
  }

  if (!visible) {
    return (
      <Tooltip content="Stopwatch">
        <button
          type="button"
          onClick={() => {
            setVisible(true);
            start();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-panel-2 hover:text-text"
          aria-label="Start stopwatch"
        >
          <Timer className="h-[18px] w-[18px]" />
        </button>
      </Tooltip>
    );
  }

  return (
    <div className="flex h-9 items-center gap-0.5 rounded-md border border-border bg-panel-2 pl-1 pr-1">
      <button
        type="button"
        onClick={running ? pause : start}
        className="flex h-7 w-7 items-center justify-center rounded text-muted hover:text-text"
        aria-label={running ? "Pause stopwatch" : "Resume stopwatch"}
      >
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <span className={`min-w-[4.2rem] text-center font-mono text-[0.9rem] tabular-nums ${running ? "text-text" : "text-muted"}`}>
        {formatClock(elapsed / 1000)}
      </span>
      <button
        type="button"
        onClick={reset}
        className="flex h-7 w-7 items-center justify-center rounded text-muted hover:text-text"
        aria-label="Reset stopwatch"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setRunning(false);
          setBase(0);
        }}
        className="flex h-7 w-5 items-center justify-center rounded text-muted hover:text-text"
        aria-label="Hide stopwatch"
      >
        ×
      </button>
    </div>
  );
}
