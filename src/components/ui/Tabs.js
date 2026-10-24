"use client";

/**
 * Small underline tab bar. `tabs` is [{ id, label, icon?: Component, badge? }].
 */
export function Tabs({ tabs, value, onChange, className = "", right = null }) {
  return (
    <div className={`flex h-11 shrink-0 items-center gap-1 border-b border-border bg-panel-2/60 px-2 ${className}`} role="tablist">
      {tabs.map((t) => {
        const active = t.id === value;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`relative flex h-9 items-center gap-1.5 rounded-md px-3 text-[0.9rem] font-medium transition-colors ${
              active ? "text-text" : "text-muted hover:bg-panel-2 hover:text-text"
            }`}
          >
            {Icon && <Icon className="h-4 w-4" style={t.iconColor ? { color: t.iconColor } : undefined} />}
            {t.label}
            {t.badge}
            {active && <span className="absolute inset-x-2 -bottom-[5px] h-0.5 rounded-full bg-accent" />}
          </button>
        );
      })}
      {right && <div className="ml-auto flex items-center gap-1">{right}</div>}
    </div>
  );
}
