"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid username or password");
        setLoading(false);
        return;
      }
      const next = params.get("next");
      router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  const input =
    "h-11 w-full rounded-md border border-border bg-panel-2 px-3.5 text-[0.98rem] text-text placeholder:text-muted/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

  return (
    <form
      onSubmit={onSubmit}
      className="animate-in relative w-full max-w-[400px] rounded-xl border border-border bg-panel/95 p-8 shadow-2xl shadow-black/40"
    >
      <div className="mb-7 flex flex-col items-center text-center">
        <LogoMark className="mb-3 h-12 w-12" />
        <h1 className="text-2xl font-semibold tracking-tight">DSA Arena</h1>
        <p className="mt-1 text-[0.95rem] text-muted">Sign in to continue practising</p>
      </div>

      <label className="mb-1.5 block text-[0.88rem] font-medium text-text-soft" htmlFor="username">
        Username
      </label>
      <input
        id="username"
        className={input}
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label className="mb-1.5 mt-4 block text-[0.88rem] font-medium text-text-soft" htmlFor="password">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          type={show ? "text" : "password"}
          className={`${input} pr-11`}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded text-muted hover:text-text"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[0.9rem] text-danger">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-6 w-full justify-center">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
