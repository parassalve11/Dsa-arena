"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, CloudUpload, List, Play, Shuffle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { Kbd } from "@/components/ui/Kbd";
import { UserMenu } from "@/components/ui/UserMenu";
import { Stopwatch } from "./Stopwatch";

function NavIcon({ href, label, children, onClick }) {
  const cls = "flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-panel-2 hover:text-text";
  if (!href && !onClick) {
    return (
      <span className={`${cls} cursor-not-allowed opacity-40`} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <Tooltip content={label}>
      {href ? (
        <Link href={href} className={cls} aria-label={label}>
          {children}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={cls} aria-label={label}>
          {children}
        </button>
      )}
    </Tooltip>
  );
}

export function TopBar({ onOpenDrawer, prevHref, nextHref, onRandom, onRun, onSubmit, busy, left = null, right = null, drawerLabel = "Problem List" }) {
  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-1 border-b border-border bg-bg px-2 sm:px-3">
      <Logo compact />
      <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
      <button
        type="button"
        onClick={onOpenDrawer}
        className="flex h-9 items-center gap-2 rounded-md px-2.5 text-[0.92rem] font-medium text-text-soft hover:bg-panel-2 hover:text-text"
      >
        <List className="h-[18px] w-[18px]" />
        <span className="hidden md:inline">{drawerLabel}</span>
      </button>
      <div className="hidden items-center sm:flex">
        <NavIcon href={prevHref} label="Previous problem">
          <ChevronLeft className="h-5 w-5" />
        </NavIcon>
        <NavIcon href={nextHref} label="Next problem">
          <ChevronRight className="h-5 w-5" />
        </NavIcon>
        {onRandom && (
          <NavIcon onClick={onRandom} label="Random problem">
            <Shuffle className="h-[18px] w-[18px]" />
          </NavIcon>
        )}
      </div>
      {left}

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 max-lg:static max-lg:ml-auto max-lg:translate-x-0">
        <Tooltip content={<span className="flex items-center gap-1">Run <Kbd>Ctrl</Kbd>+<Kbd>&apos;</Kbd></span>}>
          <Button onClick={onRun} loading={busy === "run"} disabled={!!busy}>
            {busy !== "run" && <Play className="h-4 w-4" />} <span className="hidden min-[480px]:inline">Run</span>
          </Button>
        </Tooltip>
        <Tooltip content={<span className="flex items-center gap-1">Submit <Kbd>Ctrl</Kbd>+<Kbd>Enter</Kbd></span>}>
          <Button variant="primary" onClick={onSubmit} loading={busy === "submit"} disabled={!!busy}>
            {busy !== "submit" && <CloudUpload className="h-4 w-4" />} <span className="hidden min-[480px]:inline">Submit</span>
          </Button>
        </Tooltip>
      </div>

      <div className="ml-auto flex items-center gap-1.5 max-lg:ml-2">
        {right ?? (
          <div className="hidden sm:flex">
            <Stopwatch />
          </div>
        )}
        <UserMenu />
      </div>
    </header>
  );
}
