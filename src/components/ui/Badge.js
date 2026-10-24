const DIFFICULTY = {
  Easy: "var(--easy)",
  Medium: "var(--medium)",
  Hard: "var(--hard)",
};

const WEIGHT = {
  High: "var(--w-high)",
  Medium: "var(--w-medium)",
  Low: "var(--w-low)",
};

export function Pill({ color, children, className = "", title }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[0.8rem] font-medium leading-5 ${className}`}
      style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ value, className }) {
  return (
    <Pill color={DIFFICULTY[value]} className={className}>
      {value}
    </Pill>
  );
}

export function WeightBadge({ value, className, short = false }) {
  return (
    <Pill color={WEIGHT[value]} className={className} title={`${value} weightage in interviews`}>
      {short ? value : `${value}`}
    </Pill>
  );
}

export function difficultyColor(value) {
  return DIFFICULTY[value];
}
