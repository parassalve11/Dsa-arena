"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords, ListChecks } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { UserMenu } from "@/components/ui/UserMenu";
import { useActiveMarathon } from "@/lib/storage";

const NAV = [
  { href: "/", label: "Problems", icon: ListChecks },
  { href: "/marathon", label: "Marathon", icon: Swords },
];

export function AppHeader({ children }) {
  const pathname = usePathname();
  const active = useActiveMarathon();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:ml-2">
          {NAV.map((n) => {
            const on = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative flex h-9 items-center gap-2 rounded-md px-3 text-[0.92rem] font-medium transition-colors ${
                  on ? "bg-panel-2 text-text" : "text-muted hover:bg-panel-2 hover:text-text"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{n.label}</span>
                {n.href === "/marathon" && active && !active.finishedAt && (
                  <span className="h-2 w-2 rounded-full bg-medium" title="A marathon is in progress" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {children}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
