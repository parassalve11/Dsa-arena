"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, ExternalLink, SearchX } from "lucide-react";
import { DifficultyBadge, WeightBadge } from "@/components/ui/Badge";
import { StatusIcon } from "./StatusIcon";

export function ProblemTable({ rows, progress }) {
  const router = useRouter();

  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-panel/50 py-16 text-center">
        <SearchX className="mb-3 h-8 w-8 text-muted" />
        <p className="font-medium">No problems match these filters</p>
        <p className="mt-1 text-[0.9rem] text-muted">Try a different topic, status or search term.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-panel">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-[0.82rem] uppercase tracking-wide text-muted">
              <th className="w-14 py-3 pl-4 font-medium">Status</th>
              <th className="w-12 py-3 font-medium">#</th>
              <th className="py-3 font-medium">Title</th>
              <th className="w-44 py-3 font-medium">Topic</th>
              <th className="w-28 py-3 font-medium">Difficulty</th>
              <th className="w-28 py-3 font-medium">Weightage</th>
              <th className="w-12 py-3 text-center font-medium" title="Answer viewed">
                <Eye className="mx-auto h-4 w-4" />
              </th>
              <th className="w-24 py-3 pr-4 text-right font-medium">LeetCode</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const pr = progress[p.slug] || {};
              const href = `/problems/${p.slug}`;
              return (
                <tr
                  key={p.slug}
                  onClick={(e) => {
                    if (e.target.closest("a")) return;
                    router.push(href);
                  }}
                  className={`group cursor-pointer border-b border-border/60 last:border-0 transition-colors hover:bg-panel-3/70 ${
                    i % 2 ? "bg-panel-2/40" : ""
                  }`}
                >
                  <td className="py-3 pl-4">
                    <StatusIcon status={pr.status} />
                  </td>
                  <td className="py-3 text-[0.9rem] tabular-nums text-muted">{p.id}</td>
                  <td className="py-3 pr-4">
                    <Link href={href} className="font-medium text-text group-hover:text-accent-soft">
                      {p.title}
                    </Link>
                    <div className="mt-0.5 text-[0.8rem] text-muted">{p.companies.join(" · ")}</div>
                  </td>
                  <td className="py-3 text-[0.9rem] text-text-soft">{p.topic}</td>
                  <td className="py-3">
                    <DifficultyBadge value={p.difficulty} />
                  </td>
                  <td className="py-3">
                    <WeightBadge value={p.weightage} />
                  </td>
                  <td className="py-3 text-center">
                    {pr.answerViewed && <Eye className="mx-auto h-4 w-4 text-medium" aria-label="Answer viewed" />}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <a
                      href={p.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[0.85rem] text-muted hover:bg-panel-2 hover:text-accent-soft"
                      title={`Open "${p.title}" on LeetCode`}
                    >
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
