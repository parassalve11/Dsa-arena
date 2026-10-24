"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { difficultyColor } from "@/components/ui/Badge";
import { StatusIcon } from "@/components/dashboard/StatusIcon";
import { useProgress } from "@/lib/storage";

/**
 * Slide-over list of problems grouped by topic. `items` is a list of catalog
 * entries; `hrefFor` maps one to its link (marathon mode passes its own).
 */
export function ProblemDrawer({ open, onClose, items, currentSlug, hrefFor, title = "Problem List", statusFor }) {
  const progress = useProgress();
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.querySelector(`[data-drawer-slug="${currentSlug}"]`)?.scrollIntoView({ block: "center" });
  }, [open, currentSlug]);

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const map = new Map();
    for (const p of items) {
      if (term && !p.title.toLowerCase().includes(term) && String(p.id) !== term) continue;
      if (!map.has(p.topic)) map.set(p.topic, []);
      map.get(p.topic).push(p);
    }
    return [...map.entries()];
  }, [items, q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="animate-drawer absolute inset-y-0 left-0 flex w-full max-w-[440px] flex-col border-r border-border bg-panel shadow-2xl shadow-black/50">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <h2 className="font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-panel-2 hover:text-text" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title or number…"
              className="h-10 w-full rounded-md border border-border bg-panel-2 pl-9 pr-3 text-[0.92rem] outline-none focus:border-accent"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {groups.length === 0 && <p className="px-4 py-8 text-center text-[0.9rem] text-muted">No matching problems.</p>}
          {groups.map(([topic, list]) => (
            <section key={topic} className="mb-2">
              <h3 className="sticky top-0 z-10 bg-panel px-4 py-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-muted">
                {topic}
              </h3>
              <ul>
                {list.map((p) => {
                  const active = p.slug === currentSlug;
                  const status = statusFor ? statusFor(p) : progress[p.slug]?.status;
                  return (
                    <li key={p.slug}>
                      <Link
                        href={hrefFor(p)}
                        onClick={onClose}
                        data-drawer-slug={p.slug}
                        className={`flex items-center gap-3 px-4 py-2 text-[0.92rem] ${
                          active ? "bg-accent/12 text-text" : "text-text-soft hover:bg-panel-2 hover:text-text"
                        }`}
                      >
                        <span className="flex w-5 justify-center">
                          <StatusIcon status={status} className="h-4 w-4" />
                        </span>
                        <span className="w-7 shrink-0 text-right tabular-nums text-muted">{p.id}</span>
                        <span className="min-w-0 flex-1 truncate">{p.title}</span>
                        <span className="text-[0.8rem] font-medium" style={{ color: difficultyColor(p.difficulty) }}>
                          {p.difficulty === "Medium" ? "Med." : p.difficulty}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}
