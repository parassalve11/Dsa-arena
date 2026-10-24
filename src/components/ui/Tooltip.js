/** CSS-only hover tooltip. */
export function Tooltip({ content, children, side = "bottom", className = "" }) {
  if (!content) return children;
  const pos =
    side === "top"
      ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
      : side === "left"
        ? "right-full mr-2 top-1/2 -translate-y-1/2"
        : "top-full mt-2 left-1/2 -translate-x-1/2";
  return (
    <span className={`group/tt relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-40 ${pos} whitespace-nowrap rounded-md border border-border-strong bg-panel-3 px-2.5 py-1.5 text-[0.8rem] font-normal text-text opacity-0 shadow-lg shadow-black/30 transition-opacity delay-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100`}
      >
        {content}
      </span>
    </span>
  );
}
