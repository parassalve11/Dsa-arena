import Link from "next/link";

export function LogoMark({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 6 58 32 32 58 6 32Z" fill="var(--accent)" />
      <path d="M32 20 44 32 32 44 20 32Z" fill="var(--bg)" />
    </svg>
  );
}

export function Logo({ href = "/", compact = false }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2 rounded-md px-1 font-semibold tracking-tight text-text hover:opacity-90">
      <LogoMark />
      {!compact && <span className="hidden text-[1.05rem] sm:inline">DSA Arena</span>}
    </Link>
  );
}
