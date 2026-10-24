"use client";

import { RotateCcw, Search } from "lucide-react";

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-[0.88rem] text-muted">
      <span className="hidden lg:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer rounded-md border border-border bg-panel px-2.5 text-[0.9rem] text-text outline-none hover:border-border-strong focus:border-accent"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export const DEFAULT_FILTERS = { q: "", difficulty: "all", weightage: "all", status: "all", sort: "sheet" };

export function Filters({ value, onChange, shown, total }) {
  const set = (k) => (v) => onChange({ ...value, [k]: v });
  const dirty = JSON.stringify({ ...value }) !== JSON.stringify(DEFAULT_FILTERS);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={value.q}
          onChange={(e) => set("q")(e.target.value)}
          placeholder="Search problems…"
          className="h-9 w-full rounded-md border border-border bg-panel pl-9 pr-3 text-[0.92rem] text-text outline-none placeholder:text-muted/80 hover:border-border-strong focus:border-accent"
        />
      </div>
      <Select
        label="Difficulty"
        value={value.difficulty}
        onChange={set("difficulty")}
        options={[
          { value: "all", label: "All difficulties" },
          { value: "Easy", label: "Easy" },
          { value: "Medium", label: "Medium" },
          { value: "Hard", label: "Hard" },
        ]}
      />
      <Select
        label="Weightage"
        value={value.weightage}
        onChange={set("weightage")}
        options={[
          { value: "all", label: "All weightage" },
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ]}
      />
      <Select
        label="Status"
        value={value.status}
        onChange={set("status")}
        options={[
          { value: "all", label: "Any status" },
          { value: "solved", label: "Solved" },
          { value: "attempted", label: "Attempted" },
          { value: "todo", label: "Todo" },
          { value: "viewed", label: "Answer viewed" },
        ]}
      />
      <Select
        label="Sort"
        value={value.sort}
        onChange={set("sort")}
        options={[
          { value: "sheet", label: "Sheet order" },
          { value: "difficulty", label: "Difficulty" },
          { value: "weightage", label: "Weightage" },
        ]}
      />
      {dirty && (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[0.88rem] text-muted hover:bg-panel-2 hover:text-text"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      )}
      <span className="ml-auto text-[0.86rem] text-muted">
        {shown} of {total}
      </span>
    </div>
  );
}
