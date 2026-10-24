"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Group, Panel, Separator, useDefaultLayout } from "react-resizable-panels";
import { BookOpen, Code, FileClock, Lightbulb, LoaderCircle, Lock, RotateCcw, Settings } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { Tooltip } from "@/components/ui/Tooltip";
import { getProblem, problems } from "@/data/problems";
import { engine, preload, runCases, submitCode, subscribeStatus } from "@/lib/runner";
import {
  addHistory,
  clearCode,
  getCode,
  layoutStorage,
  markAnswerViewed,
  markAttempted,
  markOpened,
  markSolved,
  setCode,
  setSettings,
  useProgress,
  useSettings,
} from "@/lib/storage";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { TopBar } from "./TopBar";
import { ProblemDrawer } from "./ProblemDrawer";
import { DescriptionTab } from "./DescriptionTab";
import { AnswerTab } from "./AnswerTab";
import { HistoryTab } from "./HistoryTab";
import { CodeEditor } from "./CodeEditor";
import { Console } from "./Console";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript (Node.js)", ext: "js" },
  { id: "python", label: "Python 3", ext: "py" },
];

function usePythonStatus() {
  return useSyncExternalStore(
    (cb) => subscribeStatus("python", cb),
    () => engine("python").status,
    () => "idle"
  );
}

function celebrate() {
  import("canvas-confetti")
    .then(({ default: confetti }) => {
      const end = Date.now() + 900;
      (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: ["#6366f1", "#22c55e", "#f59e0b"] });
        confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: ["#6366f1", "#22c55e", "#f59e0b"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    })
    .catch(() => {});
}

export function WorkspaceSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      <div className="h-14 border-b border-border bg-bg" />
      <div className="flex flex-1 items-center justify-center gap-2 text-muted">
        <LoaderCircle className="h-5 w-5 animate-spin" /> Loading problem…
      </div>
    </div>
  );
}

export function Workspace({ slug, marathon = null }) {
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    getProblem(slug)
      .then((p) => {
        if (!alive) return;
        if (!p) setError("This problem does not exist.");
        else setProblem(p);
      })
      .catch((e) => alive && setError(e.message || "Could not load the problem."));
    if (!marathon) markOpened(slug);
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-muted">
        <p>{error}</p>
      </div>
    );
  }
  if (!problem || problem.slug !== slug) return <WorkspaceSkeleton />;
  return <WorkspaceInner key={slug} problem={problem} marathon={marathon} />;
}

function toFields(harness, input) {
  return Object.fromEntries(harness.inputs.map((k) => [k, JSON.stringify(input[k])]));
}

function SettingsPopover({ settings }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <Tooltip content="Editor settings">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-panel-3 hover:text-text"
          aria-label="Editor settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </Tooltip>
      {open && (
        <div className="animate-in absolute right-0 top-10 z-40 w-60 rounded-lg border border-border bg-panel p-4 shadow-2xl shadow-black/40">
          <label className="block text-[0.85rem] text-muted">
            Font size: <span className="text-text">{settings.fontSize}px</span>
            <input
              type="range"
              min={12}
              max={22}
              value={settings.fontSize}
              onChange={(e) => setSettings({ fontSize: Number(e.target.value) })}
              className="mt-2 w-full accent-[var(--accent)]"
            />
          </label>
          <div className="mt-4 text-[0.85rem] text-muted">Tab size</div>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-md bg-panel-2 p-1">
            {[2, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSettings({ tabSize: n })}
                className={`rounded px-2 py-1 text-[0.85rem] ${settings.tabSize === n ? "bg-accent text-white" : "text-muted hover:text-text"}`}
              >
                {n} spaces
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkspaceInner({ problem, marathon }) {
  const router = useRouter();
  const slug = problem.slug;
  const scope = marathon?.scope;
  const settings = useSettings();
  const progress = useProgress();
  const pr = progress[slug] || {};
  const pythonStatus = usePythonStatus();
  const desktop = useMediaQuery("(min-width: 1024px)");

  const [language, setLanguage] = useState(settings.language);
  const [codes, setCodes] = useState(() => ({
    javascript: getCode(slug, "javascript", scope) ?? problem.starterCode.javascript,
    python: getCode(slug, "python", scope) ?? problem.starterCode.python,
  }));
  const code = codes[language];
  const codesRef = useRef(codes);
  useEffect(() => {
    codesRef.current = codes;
  }, [codes]);
  const saveTimer = useRef(null);

  const [leftTab, setLeftTab] = useState("description");
  const [mobileTab, setMobileTab] = useState("question");
  const [consoleTab, setConsoleTab] = useState("testcase");
  const [cases, setCases] = useState(() =>
    problem.examples.map((e, i) => ({ id: i, origin: i, fields: toFields(problem.harness, e.input) }))
  );
  const [activeCase, setActiveCase] = useState(0);
  const [busy, setBusyState] = useState(null);
  const busyRef = useRef(null);
  const [result, setResult] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const answerLocked = !!marathon;
  const revealed = !!pr.answerViewed;

  const hLayout = useDefaultLayout({ id: "workspace-h", storage: layoutStorage });
  const vLayout = useDefaultLayout({ id: "workspace-v", storage: layoutStorage });

  function setBusy(v) {
    busyRef.current = v;
    setBusyState(v);
  }

  useEffect(() => {
    if (language === "python") preload("python").catch(() => {});
  }, [language]);

  const flushSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    const c = codesRef.current;
    for (const l of ["javascript", "python"]) {
      const starter = problem.starterCode[l];
      if (c[l] === starter) clearCode(slug, l, scope);
      else setCode(slug, l, c[l], scope);
    }
  }, [problem, slug, scope]);

  useEffect(() => () => flushSave(), [flushSave]);

  function updateCode(v) {
    codesRef.current = { ...codesRef.current, [language]: v };
    setCodes((c) => ({ ...c, [language]: v }));
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flushSave, 500);
  }

  function changeLanguage(l) {
    flushSave();
    setLanguage(l);
    setSettings({ language: l });
  }

  function parseCases() {
    return cases.map((c, i) => {
      const input = {};
      for (const k of problem.harness.inputs) {
        try {
          input[k] = JSON.parse(c.fields[k]);
        } catch {
          throw new Error(`Case ${i + 1}: the value of "${k}" is not valid JSON.`);
        }
      }
      const unchanged =
        c.origin !== null && problem.harness.inputs.every((k) => c.fields[k] === toFields(problem.harness, problem.examples[c.origin].input)[k]);
      return { input, expected: unchanged ? problem.examples[c.origin].output : undefined };
    });
  }

  const run = useCallback(async () => {
    if (busyRef.current) return;
    let parsed;
    try {
      parsed = parseCases();
    } catch (e) {
      setResult({ kind: "parse", message: e.message });
      setConsoleTab("result");
      if (!desktop) setMobileTab("result");
      return;
    }
    flushSave();
    setBusy("run");
    setConsoleTab("result");
    if (!desktop) setMobileTab("result");
    markAttempted(slug);
    marathon?.onAttempt?.(slug);
    try {
      const r = await runCases({ problem, language, code: codesRef.current[language], cases: parsed });
      setResult({ kind: "run", at: Date.now(), ...r });
    } catch (e) {
      setResult({ fatal: e.message || String(e) });
    } finally {
      setBusy(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases, language, problem, desktop, marathon]);

  const submit = useCallback(async () => {
    if (busyRef.current) return;
    flushSave();
    setBusy("submit");
    setConsoleTab("result");
    if (!desktop) setMobileTab("result");
    const src = codesRef.current[language];
    try {
      const r = await submitCode({ problem, language, code: src });
      addHistory(slug, { language, verdict: r.verdict, passed: r.passed, total: r.total, ms: r.ms ?? null, code: src });
      if (r.verdict === "Accepted") {
        const first = markSolved(slug);
        if (first) celebrate();
        marathon?.onSolved?.(slug);
      } else {
        markAttempted(slug);
        marathon?.onAttempt?.(slug);
      }
      setResult({ kind: "submit", at: Date.now(), ...r });
    } catch (e) {
      setResult({ fatal: e.message || String(e) });
    } finally {
      setBusy(null);
    }
  }, [language, problem, slug, desktop, marathon, flushSave]);

  const commands = useMemo(() => ({ run, submit, save: flushSave }), [run, submit, flushSave]);

  // Shortcuts when focus is outside the editor (Monaco handles its own).
  useEffect(() => {
    function onKey(e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.target.closest?.(".monaco-editor")) return;
      if (e.key === "'") {
        e.preventDefault();
        run();
      } else if (e.key === "Enter") {
        e.preventDefault();
        submit();
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        flushSave();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, submit, flushSave]);

  // ----- navigation -----
  const idx = problems.findIndex((p) => p.slug === slug);
  const prevHref = marathon ? marathon.prevHref : idx > 0 ? `/problems/${problems[idx - 1].slug}` : null;
  const nextHref = marathon ? marathon.nextHref : idx < problems.length - 1 ? `/problems/${problems[idx + 1].slug}` : null;
  const onRandom = marathon
    ? null
    : () => {
        const pool = problems.filter((p) => p.slug !== slug && progress[p.slug]?.status !== "solved");
        const list = pool.length ? pool : problems.filter((p) => p.slug !== slug);
        const pick = list[Math.floor(Math.random() * list.length)];
        if (pick) router.push(`/problems/${pick.slug}`);
      };

  // ----- testcase editing -----
  const testcase = {
    cases,
    active: Math.min(activeCase, cases.length - 1),
    setActive: setActiveCase,
    inputKeys: problem.harness.inputs,
    onChangeField: (i, k, v) => setCases((cs) => cs.map((c, j) => (j === i ? { ...c, fields: { ...c.fields, [k]: v } } : c))),
    onAdd: () =>
      setCases((cs) => {
        const base = cs[Math.min(activeCase, cs.length - 1)] || cs[cs.length - 1];
        const next = [...cs, { id: Date.now(), origin: null, fields: { ...base.fields } }];
        setActiveCase(next.length - 1);
        return next;
      }),
    onRemove: (i) => {
      setCases((cs) => cs.filter((_, j) => j !== i));
      setActiveCase((a) => Math.max(0, a >= i ? a - 1 : a));
    },
  };

  // ----- panels -----
  const leftTabs = [
    { id: "description", label: "Description", icon: BookOpen, iconColor: "var(--accent-soft)" },
    {
      id: "answer",
      label: "Answer",
      icon: revealed && !answerLocked ? Lightbulb : Lock,
      iconColor: revealed && !answerLocked ? "var(--medium)" : undefined,
    },
    { id: "history", label: "History", icon: FileClock },
  ];

  const leftPanel = (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-panel">
      <Tabs tabs={leftTabs} value={leftTab} onChange={setLeftTab} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {leftTab === "description" && (
          <DescriptionTab
            problem={problem}
            status={marathon ? marathon.statusOf(slug) : pr.status}
            answerLocked={answerLocked}
            onShowAnswer={() => setLeftTab("answer")}
          />
        )}
        {leftTab === "answer" && (
          <AnswerTab
            problem={problem}
            revealed={revealed}
            locked={answerLocked}
            defaultLanguage={language}
            onReveal={() => setConfirmReveal(true)}
          />
        )}
        {leftTab === "history" && (
          <HistoryTab
            slug={slug}
            onLoad={(h) => {
              setLanguage(h.language);
              setCodes((c) => ({ ...c, [h.language]: h.code }));
              clearTimeout(saveTimer.current);
              saveTimer.current = setTimeout(flushSave, 500);
              if (!desktop) setMobileTab("code");
            }}
          />
        )}
      </div>
    </div>
  );

  const editorPanel = (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-panel">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-panel-2/60 px-3">
        <span className="flex items-center gap-1.5 text-[0.9rem] font-medium text-text">
          <Code className="h-4 w-4 text-easy" /> Code
        </span>
        <div className="mx-1 h-4 w-px bg-border" />
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="h-8 cursor-pointer rounded-md border border-transparent bg-transparent px-1.5 text-[0.88rem] text-text-soft outline-none hover:border-border hover:bg-panel-3 focus:border-accent"
          aria-label="Language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-0.5">
          <Tooltip content="Reset to starter code">
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-panel-3 hover:text-text"
              aria-label="Reset to starter code"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </Tooltip>
          <SettingsPopover settings={settings} />
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor
          path={`${scope ? `m-${scope}/` : ""}${slug}.${language === "python" ? "py" : "js"}`}
          language={language}
          value={code}
          onChange={updateCode}
          fontSize={settings.fontSize}
          tabSize={settings.tabSize}
          commands={commands}
        />
      </div>
    </div>
  );

  const consolePanel = (
    <div className="h-full overflow-hidden rounded-lg border border-border bg-panel">
      <Console
        tab={consoleTab}
        setTab={setConsoleTab}
        testcase={testcase}
        result={result}
        busy={busy}
        pythonStatus={pythonStatus}
        language={language}
        onNext={marathon && result?.kind === "submit" && result.verdict === "Accepted" ? marathon.onNext : null}
      />
    </div>
  );

  const drawerItems = marathon ? marathon.items : problems;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg">
      <TopBar
        onOpenDrawer={() => setDrawer(true)}
        prevHref={prevHref}
        nextHref={nextHref}
        onRandom={onRandom}
        onRun={run}
        onSubmit={submit}
        busy={busy}
        left={marathon?.topLeft}
        right={marathon?.topRight}
        drawerLabel={marathon ? "Questions" : "Problem List"}
      />

      {desktop ? (
        <div className="min-h-0 flex-1 p-2">
          <Group orientation="horizontal" defaultLayout={hLayout.defaultLayout} onLayoutChanged={hLayout.onLayoutChanged}>
            <Panel id="left" defaultSize="45" minSize="22">
              {leftPanel}
            </Panel>
            <Separator className="handle" />
            <Panel id="right" defaultSize="55" minSize="28">
              <Group orientation="vertical" defaultLayout={vLayout.defaultLayout} onLayoutChanged={vLayout.onLayoutChanged}>
                <Panel id="editor" defaultSize="65" minSize="20">
                  {editorPanel}
                </Panel>
                <Separator className="handle" />
                <Panel id="console" defaultSize="35" minSize="12">
                  {consolePanel}
                </Panel>
              </Group>
            </Panel>
          </Group>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="grid shrink-0 grid-cols-3 border-b border-border bg-panel">
            {[
              ["question", "Question"],
              ["code", "Code"],
              ["result", "Result"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobileTab(id)}
                className={`h-11 text-[0.92rem] font-medium ${mobileTab === id ? "border-b-2 border-accent text-text" : "text-muted"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 p-2">
            {mobileTab === "question" && leftPanel}
            {mobileTab === "code" && editorPanel}
            {mobileTab === "result" && consolePanel}
          </div>
        </div>
      )}

      <ProblemDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        items={drawerItems}
        currentSlug={slug}
        hrefFor={marathon ? marathon.hrefFor : (p) => `/problems/${p.slug}`}
        statusFor={marathon ? (p) => marathon.statusOf(p.slug) : undefined}
        title={marathon ? "Marathon questions" : "Problem List"}
      />

      <ConfirmDialog
        open={confirmReveal}
        title="Reveal the answer?"
        message={
          <>
            Revealing the answer will mark this problem as <em className="text-text">answer viewed</em>. Continue?
          </>
        }
        confirmLabel="Reveal answer"
        onCancel={() => setConfirmReveal(false)}
        onConfirm={() => {
          markAnswerViewed(slug);
          setConfirmReveal(false);
        }}
      />
      <ConfirmDialog
        open={confirmReset}
        title="Reset code?"
        message={`Your ${language === "python" ? "Python" : "JavaScript"} code for this problem will be replaced with the starter code.`}
        confirmLabel="Reset"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setCodes((c) => ({ ...c, [language]: problem.starterCode[language] }));
          clearCode(slug, language, scope);
          setConfirmReset(false);
        }}
      />
    </div>
  );
}
