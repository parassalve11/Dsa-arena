// Browser runner: owns one worker per language, enforces time limits by killing
// the worker, and turns raw results into Run / Submit verdicts.

import { PY_PRELUDE } from "./py-prelude.js";
import { judge } from "./compare.js";
import { submitCases } from "../problem.js";

export const RUN_CASE_TIMEOUT = 2000;
export const SUBMIT_TIMEOUT = 3000;

class Engine {
  constructor(language) {
    this.language = language;
    this.worker = null;
    this.ready = null;
    this.pending = new Map();
    this.seq = 0;
    this.queue = Promise.resolve();
    this.status = "idle";
    this.listeners = new Set();
  }

  setStatus(s) {
    this.status = s;
    for (const fn of this.listeners) fn(s);
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  spawn() {
    if (this.worker) return this.ready;
    const worker =
      this.language === "python"
        ? new Worker("/workers/py-worker.js", { type: "module" })
        : new Worker(new URL("./js-worker.js", import.meta.url), { type: "module" });
    this.worker = worker;
    this.setStatus("loading");
    this.ready = new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        const msg = e.data;
        if (msg.type === "ready") {
          this.setStatus("ready");
          resolve();
        } else if (msg.type === "error") {
          this.setStatus("error");
          this.kill();
          reject(new Error(msg.error));
        } else if (msg.type === "result") {
          const job = this.pending.get(msg.id);
          if (!job) return;
          clearTimeout(job.timer);
          this.pending.delete(msg.id);
          job.resolve(msg);
        }
      };
      worker.onerror = (e) => {
        e.preventDefault?.();
        this.setStatus("error");
        this.kill();
        reject(new Error(e.message || "Worker failed to start"));
      };
    });
    if (this.language === "python") worker.postMessage({ type: "init", prelude: PY_PRELUDE });
    this.ready.catch(() => {});
    return this.ready;
  }

  kill() {
    if (this.worker) this.worker.terminate();
    this.worker = null;
    this.ready = null;
    for (const job of this.pending.values()) {
      clearTimeout(job.timer);
      job.resolve({ crash: "Worker stopped", results: [] });
    }
    this.pending.clear();
    if (this.status !== "error") this.setStatus("idle");
  }

  // Jobs run one at a time. The timer only starts once the runtime is loaded,
  // so the first Pyodide download never counts as a time limit.
  exec(payload, timeoutMs) {
    const job = this.queue.then(async () => {
      await this.spawn();
      return new Promise((resolve) => {
        const id = ++this.seq;
        const timer = setTimeout(() => {
          this.pending.delete(id);
          this.kill();
          if (this.language === "python") this.spawn();
          resolve({ timeout: true, results: [] });
        }, timeoutMs);
        this.pending.set(id, { resolve, timer });
        this.worker.postMessage({ type: "run", id, prelude: PY_PRELUDE, ...payload });
      });
    });
    this.queue = job.catch(() => {});
    return job;
  }
}

const engines = {};

export function engine(language) {
  if (!engines[language]) engines[language] = new Engine(language);
  return engines[language];
}

export function preload(language) {
  return engine(language).spawn();
}

export function subscribeStatus(language, fn) {
  return engine(language).subscribe(fn);
}

function errorOf(r) {
  return { error: r.error, line: r.line ?? null };
}

/**
 * Run: each case on its own with a 2s limit. Cases without an expected value
 * (custom ones) get it from the reference solution in the same language.
 */
export async function runCases({ problem, language, code, cases }) {
  const h = problem.harness;
  const eng = engine(language);
  const out = [];
  for (const c of cases) {
    const res = await eng.exec({ code, harness: h, inputs: [c.input] }, RUN_CASE_TIMEOUT);
    if (res.compileError) {
      return { compileError: res.compileError };
    }
    let expected = c.expected;
    let expectedError = null;
    if (expected === undefined) {
      const ref = await eng.exec({ code: problem.answer[language], harness: h, inputs: [c.input] }, RUN_CASE_TIMEOUT * 2);
      const r0 = ref.results && ref.results[0];
      if (r0 && r0.ok) expected = r0.output;
      else expectedError = r0 ? r0.error : ref.timeout ? "Reference solution timed out" : "Could not compute expected output";
    }
    const r = res.results[0];
    if (res.timeout) {
      out.push({ input: c.input, expected, expectedError, status: "tle", stdout: "" });
    } else if (res.crash || !r) {
      out.push({ input: c.input, expected, expectedError, status: "error", error: res.crash || "Unknown error", stdout: "" });
    } else if (!r.ok) {
      out.push({ input: c.input, expected, expectedError, status: "error", ...errorOf(r), stdout: r.stdout, ms: r.ms });
    } else {
      const passed = expected !== undefined && judge(h, c.input, r.output, expected);
      out.push({ input: c.input, output: r.output, expected, expectedError, status: passed ? "pass" : "fail", stdout: r.stdout, ms: r.ms });
    }
  }
  return { cases: out };
}

/** Submit: every case in one batch with a 3s limit, stopping at the first failure. */
export async function submitCode({ problem, language, code }) {
  const h = problem.harness;
  const cases = submitCases(problem);
  const total = cases.length;
  const res = await engine(language).exec(
    { code, harness: h, inputs: cases.map((c) => c.input), stopOnError: true },
    SUBMIT_TIMEOUT
  );
  if (res.timeout) return { verdict: "Time Limit Exceeded", passed: null, total };
  if (res.compileError) {
    return { verdict: "Runtime Error", passed: 0, total, error: res.compileError.message, line: res.compileError.line };
  }
  if (res.crash) return { verdict: "Runtime Error", passed: 0, total, error: res.crash };

  let ms = 0;
  for (let i = 0; i < cases.length; i++) {
    const r = res.results[i];
    const c = cases[i];
    if (!r) break;
    ms += r.ms || 0;
    if (!r.ok) {
      return { verdict: "Runtime Error", passed: i, total, ms, failing: { input: c.input, expected: c.expected, stdout: r.stdout, ...errorOf(r) }, error: r.error, line: r.line };
    }
    if (!judge(h, c.input, r.output, c.expected)) {
      return { verdict: "Wrong Answer", passed: i, total, ms, failing: { input: c.input, output: r.output, expected: c.expected, stdout: r.stdout } };
    }
  }
  return { verdict: "Accepted", passed: total, total, ms };
}
