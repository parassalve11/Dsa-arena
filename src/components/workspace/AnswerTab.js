"use client";

import { useState } from "react";
import { Check, Clock, Copy, Database, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CodeViewer } from "./CodeEditor";

const LANGS = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python 3" },
];

export function AnswerTab({ problem, revealed, locked, onReveal, defaultLanguage }) {
  const [lang, setLang] = useState(defaultLanguage || "javascript");
  const [copied, setCopied] = useState(false);

  if (locked) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
        <Lock className="mb-3 h-8 w-8 text-muted" />
        <p className="font-medium">Answers are locked during a marathon</p>
        <p className="mt-1 max-w-xs text-[0.92rem] text-muted">Finish or end the marathon to see reference solutions.</p>
      </div>
    );
  }

  if (!revealed) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-panel-2">
          <Lock className="h-6 w-6 text-muted" />
        </div>
        <p className="text-[1.05rem] font-medium">Try it yourself first.</p>
        <p className="mt-1 text-[0.95rem] text-muted">Reveal the answer?</p>
        <Button variant="primary" className="mt-5" onClick={onReveal}>
          Reveal answer
        </Button>
      </div>
    );
  }

  const a = problem.answer;
  const code = a[lang];

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked
    }
  }

  return (
    <div className="animate-in px-5 py-5 sm:px-6">
      <h2 className="mb-3 text-[1.15rem] font-semibold">Approach</h2>
      <ol className="space-y-2.5">
        {a.approach.map((step, i) => (
          <li key={i} className="flex gap-3 text-[0.98rem] leading-relaxed text-text-soft">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[0.8rem] font-semibold text-accent-soft">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-panel-2 px-3.5 py-2.5">
          <Clock className="h-4 w-4 text-w-medium" />
          <span className="text-[0.88rem] text-muted">Time</span>
          <span className="ml-auto font-mono text-[0.9rem] text-text">{a.time}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-panel-2 px-3.5 py-2.5">
          <Database className="h-4 w-4 text-w-high" />
          <span className="text-[0.88rem] text-muted">Space</span>
          <span className="ml-auto font-mono text-[0.9rem] text-text">{a.space}</span>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-1 border-b border-border bg-panel-2 px-2 py-1.5">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLang(l.id)}
              className={`rounded-md px-3 py-1 text-[0.86rem] font-medium ${
                lang === l.id ? "bg-panel-3 text-text" : "text-muted hover:text-text"
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            onClick={copy}
            className="ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[0.84rem] text-muted hover:bg-panel-3 hover:text-text"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <CodeViewer path={`answer/${problem.slug}.${lang === "python" ? "py" : "js"}`} language={lang} value={code} />
      </div>
    </div>
  );
}
