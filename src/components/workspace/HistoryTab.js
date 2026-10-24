"use client";

import { FileClock } from "lucide-react";
import { useHistory } from "@/lib/storage";
import { formatMs, timeAgo } from "@/lib/format";

const LANG = { javascript: "JavaScript", python: "Python 3" };

export function HistoryTab({ slug, onLoad }) {
  const history = useHistory(slug);

  if (!history.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
        <FileClock className="mb-3 h-8 w-8 text-muted" />
        <p className="font-medium">No submissions yet</p>
        <p className="mt-1 text-[0.92rem] text-muted">Every Submit is saved here, so you can load older code back.</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-3">
      <p className="px-2 pb-2 text-[0.85rem] text-muted">Click a submission to load its code into the editor.</p>
      <ul className="space-y-1">
        {history.map((h, i) => {
          const ok = h.verdict === "Accepted";
          return (
            <li key={`${h.at}-${i}`}>
              <button
                type="button"
                onClick={() => onLoad(h)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-x-3 rounded-md border border-transparent px-3 py-2.5 text-left hover:border-border hover:bg-panel-2"
              >
                <span className={`font-medium ${ok ? "text-success" : "text-danger"}`}>{h.verdict}</span>
                <span className="text-right text-[0.84rem] text-muted">{timeAgo(h.at)}</span>
                <span className="text-[0.85rem] text-text-soft">
                  {LANG[h.language] || h.language}
                  {h.passed !== null && h.passed !== undefined && ` · ${h.passed}/${h.total} passed`}
                </span>
                <span className="text-right text-[0.84rem] text-muted">{ok ? formatMs(h.ms) : ""}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
