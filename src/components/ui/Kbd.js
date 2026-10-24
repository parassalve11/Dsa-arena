export function Kbd({ children }) {
  return (
    <kbd className="rounded border border-border-strong bg-panel-3 px-1.5 py-px font-mono text-[0.72rem] text-muted">
      {children}
    </kbd>
  );
}
