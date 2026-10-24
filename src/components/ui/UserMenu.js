"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ALargeSmall, LogOut, User } from "lucide-react";
import { setSettings, useSettings } from "@/lib/storage";

const SIZES = [
  { id: "compact", label: "Small" },
  { id: "comfortable", label: "Medium" },
  { id: "large", label: "Large" },
];

let cachedUser = null;

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(cachedUser);
  const settings = useSettings();
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (cachedUser) return;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.username) {
          cachedUser = d.username;
          setUser(d.username);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function setTextSize(id) {
    setSettings({ textSize: id });
    document.documentElement.dataset.text = id;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    cachedUser = null;
    router.replace("/login");
    router.refresh();
  }

  const initial = (user || "?").slice(0, 1).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-panel-2 text-[0.9rem] font-semibold text-accent-soft hover:border-accent"
        aria-label="User menu"
        aria-expanded={open}
      >
        {user ? initial : <User className="h-4 w-4" />}
      </button>
      {open && (
        <div className="animate-in absolute right-0 top-11 z-50 w-64 rounded-lg border border-border bg-panel p-1.5 shadow-2xl shadow-black/40">
          <div className="px-3 py-2">
            <div className="text-[0.78rem] text-muted">Signed in as</div>
            <div className="font-medium text-text">{user || "…"}</div>
          </div>
          <div className="my-1 h-px bg-border" />
          <div className="px-3 py-2">
            <div className="mb-2 flex items-center gap-2 text-[0.82rem] text-muted">
              <ALargeSmall className="h-4 w-4" /> Text size
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-md bg-panel-2 p-1">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setTextSize(s.id)}
                  className={`rounded px-2 py-1 text-[0.82rem] ${
                    settings.textSize === s.id ? "bg-accent text-white" : "text-muted hover:text-text"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[0.92rem] text-text-soft hover:bg-panel-2 hover:text-danger"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
