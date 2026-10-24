import { LoaderCircle } from "lucide-react";

const VARIANTS = {
  primary: "bg-accent text-white hover:bg-accent-hover disabled:hover:bg-accent",
  secondary: "bg-panel-2 text-text border border-border hover:bg-panel-3 hover:border-border-strong",
  ghost: "text-muted hover:text-text hover:bg-panel-2",
  danger: "bg-danger/15 text-danger hover:bg-danger/25",
  success: "bg-success text-[#06210f] hover:brightness-110",
};

const SIZES = {
  sm: "h-8 px-2.5 text-[0.85rem] gap-1.5",
  md: "h-9 px-3.5 text-[0.92rem] gap-2",
  lg: "h-11 px-5 text-base gap-2",
  icon: "h-9 w-9 justify-center",
  iconSm: "h-8 w-8 justify-center",
};

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...rest
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex shrink-0 items-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
