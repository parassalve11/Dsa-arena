"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle, Plus, SquareCheck, SquareTerminal, X } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Kbd } from "@/components/ui/Kbd";
import { formatMs, show } from "@/lib/format";

function Field({ label, children, tone }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-[0.82rem] font-medium text-muted">{label}</div>
      <div
        className={`whitespace-pre-wrap break-all rounded-md border px-3 py-2 font-mono text-[0.86rem] leading-6 ${
          tone === "danger"
            ? "border-danger/30 bg-danger/10 text-danger"
            : tone === "success"
              ? "border-success/25 bg-success/5 text-text"
              : "border-border bg-panel-2 text-text"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function InputFields({ input }) {
  return Object.entries(input).map(([k, v]) => (
    <Field key={k} label={`${k} =`}>
      {show(v)}
    </Field>
  ));
}

function ErrorBox({ title = "Runtime Error", error, line }) {
  return (
    <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3">
      <div className="mb-1 text-[1.05rem] font-semibold text-danger">{title}</div>
      <pre className="whitespace-pre-wrap break-words font-mono text-[0.86rem] leading-6 text-danger/90">
        {error}
        {line ? `\nLine ${line} in your code` : ""}
      </pre>
    </div>
  );
}

function PythonLoading({ status }) {
  if (status !== "loading") return null;
  return (
    <div className="mb-3 flex items-center gap-2 rounded-md border border-w-medium/25 bg-w-medium/10 px-3 py-2 text-[0.88rem] text-w-medium">
      <LoaderCircle className="h-4 w-4 animate-spin" /> Loading Python… (first time only)
    </div>
  );
}

function TestcaseTab({ cases, active, setActive, inputKeys, onChangeField, onAdd, onRemove }) {
  const current = cases[active];
  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {cases.map((c, i) => (
          <div key={c.id} className="group relative">
            <button
              type="button"
              onClick={() => setActive(i)}
              className={`h-8 rounded-md px-3 text-[0.86rem] font-medium ${
                i === active ? "bg-panel-3 text-text" : "text-muted hover:bg-panel-2 hover:text-text"
              }`}
            >
              Case {i + 1}
            </button>
            {cases.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute -right-1.5 -top-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-panel-3 text-muted hover:text-text group-hover:flex"
                aria-label={`Remove case ${i + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {cases.length < 10 && (
          <button
            type="button"
            onClick={onAdd}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-panel-2 hover:text-text"
            aria-label="Add a test case"
            title="Add a custom case (copies the current one)"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      {current &&
        inputKeys.map((k) => (
          <label key={k} className="mb-3 block">
            <div className="mb-1.5 text-[0.82rem] font-medium text-muted">{k} =</div>
            <textarea
              value={current.fields[k] ?? ""}
              onChange={(e) => onChangeField(active, k, e.target.value)}
              spellCheck={false}
              rows={Math.min(6, Math.max(1, Math.ceil((current.fields[k] || "").length / 70)))}
              className="w-full resize-y rounded-md border border-border bg-panel-2 px-3 py-2 font-mono text-[0.86rem] leading-6 text-text outline-none focus:border-accent"
            />
          </label>
        ))}
      <p className="text-[0.8rem] text-muted">
        Values are JSON: strings in double quotes, arrays in brackets. Edited or new cases get their expected output from the reference solution.
      </p>
    </div>
  );
}

function RunResult({ result }) {
  const [sel, setSel] = useState(0);
  if (result.compileError) return <ErrorBox error={result.compileError.message} line={result.compileError.line} />;
  const cases = result.cases || [];
  const allPass = cases.length > 0 && cases.every((c) => c.status === "pass");
  const anyTle = cases.some((c) => c.status === "tle");
  const anyErr = cases.find((c) => c.status === "error");
  const c = cases[Math.min(sel, cases.length - 1)];
  const totalMs = cases.reduce((s, x) => s + (x.ms || 0), 0);

  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3">
        <span className={`text-[1.25rem] font-semibold ${allPass ? "text-success" : "text-danger"}`}>
          {allPass ? "Accepted" : anyTle ? "Time Limit Exceeded" : anyErr ? "Runtime Error" : "Wrong Answer"}
        </span>
        {allPass && <span className="text-[0.88rem] text-muted">Runtime: {formatMs(totalMs)}</span>}
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {cases.map((x, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSel(i)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-[0.86rem] font-medium ${
              i === sel ? "bg-panel-3 text-text" : "text-muted hover:bg-panel-2 hover:text-text"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${x.status === "pass" ? "bg-success" : "bg-danger"}`} />
            Case {i + 1}
          </button>
        ))}
      </div>
      {c && (
        <div>
          {c.status === "tle" && <ErrorBox title="Time Limit Exceeded" error="Your code ran for more than 2 seconds on this case and was stopped." />}
          {c.status === "error" && <ErrorBox error={c.error} line={c.line} />}
          {(c.status === "tle" || c.status === "error") && <div className="h-3" />}
          <div className="mb-1 text-[0.85rem] font-semibold text-text-soft">Input</div>
          <InputFields input={c.input} />
          {c.stdout ? <Field label="Stdout">{c.stdout.replace(/\n$/, "")}</Field> : null}
          {c.status !== "tle" && c.status !== "error" && (
            <Field label="Output" tone={c.status === "fail" ? "danger" : undefined}>
              {show(c.output)}
            </Field>
          )}
          <Field label="Expected" tone={c.status === "pass" ? "success" : undefined}>
            {c.expected !== undefined ? show(c.expected) : c.expectedError ? `(${c.expectedError})` : "—"}
          </Field>
        </div>
      )}
    </div>
  );
}

function SubmitResult({ result, onNext }) {
  const ok = result.verdict === "Accepted";
  const f = result.failing;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className={`text-[1.6rem] font-semibold tracking-tight ${ok ? "text-success" : "text-danger"}`}>{result.verdict}</span>
        {result.passed !== null && result.passed !== undefined && (
          <span className="text-[0.95rem] text-text-soft">
            {result.passed} / {result.total} test cases passed
          </span>
        )}
        {ok && <span className="text-[0.9rem] text-muted">Runtime: {formatMs(result.ms)}</span>}
      </div>
      {ok && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[0.95rem] text-text-soft">All hidden tests passed. Nice work!</p>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-3.5 text-[0.9rem] font-medium text-white hover:bg-accent-hover"
            >
              Next question <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      {result.verdict === "Time Limit Exceeded" && (
        <ErrorBox title="Time Limit Exceeded" error="All tests together must finish within 3 seconds. Look for a faster approach." />
      )}
      {result.verdict === "Runtime Error" && !f && <ErrorBox error={result.error} line={result.line} />}
      {f && (
        <div>
          {result.verdict === "Runtime Error" && (
            <div className="mb-3">
              <ErrorBox error={f.error} line={f.line} />
            </div>
          )}
          <div className="mb-1 text-[0.85rem] font-semibold text-text-soft">Failing input</div>
          <InputFields input={f.input} />
          {f.stdout ? <Field label="Stdout">{f.stdout.replace(/\n$/, "")}</Field> : null}
          {result.verdict === "Wrong Answer" && (
            <Field label="Output" tone="danger">
              {show(f.output)}
            </Field>
          )}
          <Field label="Expected">{show(f.expected)}</Field>
        </div>
      )}
    </div>
  );
}

export function Console({ tab, setTab, testcase, result, busy, pythonStatus, language, onNext }) {
  let body;
  if (tab === "testcase") {
    body = <TestcaseTab {...testcase} />;
  } else if (busy) {
    body = (
      <div className="flex items-center gap-2 text-[0.95rem] text-muted">
        <LoaderCircle className="h-4 w-4 animate-spin" /> {busy === "submit" ? "Judging all test cases…" : "Running…"}
      </div>
    );
  } else if (!result) {
    body = (
      <div className="flex h-full flex-col items-center justify-center py-8 text-center text-[0.92rem] text-muted">
        <p>Run your code to see results here.</p>
        <p className="mt-2 flex items-center gap-1.5">
          <Kbd>Ctrl</Kbd> + <Kbd>&apos;</Kbd> Run <span className="mx-2 text-border-strong">|</span>
          <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> Submit
        </p>
      </div>
    );
  } else if (result.fatal) {
    body = <ErrorBox title="Could not run your code" error={result.fatal} />;
  } else if (result.kind === "parse") {
    body = <ErrorBox title="Invalid test case" error={result.message} />;
  } else if (result.kind === "submit") {
    body = <SubmitResult result={result} onNext={onNext} />;
  } else {
    body = <RunResult key={result.at} result={result} />;
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "testcase", label: "Testcase", icon: SquareCheck, iconColor: "var(--easy)" },
          { id: "result", label: "Test Result", icon: SquareTerminal, iconColor: "var(--accent-soft)" },
        ]}
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {language === "python" && <PythonLoading status={pythonStatus} />}
        {tab === "testcase" ? <div className="-mx-4 -my-3">{body}</div> : body}
      </div>
    </div>
  );
}
