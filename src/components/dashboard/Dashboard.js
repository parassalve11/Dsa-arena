"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Download, Upload } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Tooltip } from "@/components/ui/Tooltip";
import { problems } from "@/data/problems";
import { topics } from "@/data/catalog";
import { exportAll, getLastProblem, importAll, useProgress } from "@/lib/storage";
import { StatsRow } from "./StatsRow";
import { TopicChips } from "./TopicChips";
import { DEFAULT_FILTERS, Filters } from "./Filters";
import { ProblemTable } from "./ProblemTable";

const DIFF_ORDER = { Easy: 0, Medium: 1, Hard: 2 };
const WEIGHT_ORDER = { High: 0, Medium: 1, Low: 2 };

function statusOf(pr) {
  return pr?.status || "todo";
}

function BackupButtons() {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState("");

  function doExport() {
    const blob = new Blob([JSON.stringify(exportAll(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsa-arena-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Backup downloaded");
  }

  function flash(text) {
    setMsg(text);
    setTimeout(() => setMsg(""), 2500);
  }

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const n = importAll(JSON.parse(await file.text()));
      flash(`Restored ${n} saved items`);
    } catch (err) {
      flash(err.message || "Could not read that file");
    }
  }

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-muted hover:border-border-strong hover:text-text";
  return (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Export progress and code">
        <button type="button" className={btn} onClick={doExport} aria-label="Export backup">
          <Download className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip content="Import a backup">
        <button type="button" className={btn} onClick={() => fileRef.current?.click()} aria-label="Import backup">
          <Upload className="h-4 w-4" />
        </button>
      </Tooltip>
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
      {msg && (
        <div className="animate-in absolute right-0 top-11 z-40 whitespace-nowrap rounded-md border border-border bg-panel-3 px-3 py-2 text-[0.85rem] shadow-lg">
          {msg}
        </div>
      )}
    </div>
  );
}

const noop = () => () => {};

export function Dashboard() {
  const progress = useProgress();
  const lastSlug = useSyncExternalStore(noop, getLastProblem, () => null);
  const [topic, setTopic] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const rows = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    let list = problems.filter((p) => {
      const pr = progress[p.slug];
      if (topic && p.topic !== topic) return false;
      if (filters.difficulty !== "all" && p.difficulty !== filters.difficulty) return false;
      if (filters.weightage !== "all" && p.weightage !== filters.weightage) return false;
      if (filters.status === "viewed" ? !pr?.answerViewed : filters.status !== "all" && statusOf(pr) !== filters.status) return false;
      if (q && !p.title.toLowerCase().includes(q) && String(p.id) !== q) return false;
      return true;
    });
    if (filters.sort === "difficulty") list = list.toSorted((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty] || a.id - b.id);
    if (filters.sort === "weightage") list = list.toSorted((a, b) => WEIGHT_ORDER[a.weightage] - WEIGHT_ORDER[b.weightage] || a.id - b.id);
    return list;
  }, [progress, topic, filters]);

  return (
    <>
      <AppHeader>
        <BackupButtons />
      </AppHeader>
      <main className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6">
        <StatsRow problems={problems} progress={progress} lastSlug={lastSlug} />
        <TopicChips topics={topics} problems={problems} progress={progress} value={topic} onChange={setTopic} />
        <Filters value={filters} onChange={setFilters} shown={rows.length} total={problems.length} />
        <ProblemTable rows={rows} progress={progress} />
      </main>
    </>
  );
}
