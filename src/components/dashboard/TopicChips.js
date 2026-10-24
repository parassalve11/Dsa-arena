"use client";

export function TopicChips({ topics, problems, progress, value, onChange }) {
  const count = (t) => {
    const list = t ? problems.filter((p) => p.topic === t) : problems;
    return [list.filter((p) => progress[p.slug]?.status === "solved").length, list.length];
  };
  const chip = (t, label) => {
    const [s, n] = count(t);
    const on = value === t;
    return (
      <button
        key={label}
        type="button"
        onClick={() => onChange(t)}
        className={`flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[0.88rem] transition-colors ${
          on
            ? "border-accent bg-accent/15 text-text"
            : "border-border bg-panel text-text-soft hover:border-border-strong hover:text-text"
        }`}
      >
        {label}
        <span className={`text-[0.8rem] ${on ? "text-accent-soft" : "text-muted"}`}>
          {s}/{n}
        </span>
      </button>
    );
  };
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {chip(null, "All topics")}
      {topics.map((t) => chip(t, t))}
    </div>
  );
}
