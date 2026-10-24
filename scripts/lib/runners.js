// Node-side runners used by validate-problems and gen-expected. They reuse the
// exact engine code the browser workers use.

import { Worker } from "node:worker_threads";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PY_PRELUDE, PY_CLI } from "../../src/lib/runner/py-prelude.js";
import { buildProblem } from "../../src/lib/problem.js";
import { bySlug } from "../../src/data/catalog.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, "../..");
export const PROBLEMS_DIR = path.join(ROOT, "src/data/problems");
export const EXPECTED_DIR = path.join(ROOT, "src/data/expected");

export async function loadProblem(slug, { withExpected = true } = {}) {
  const file = path.join(PROBLEMS_DIR, `${slug}.js`);
  const mod = (await import(pathToFileURL(file).href)).default;
  const expFile = path.join(EXPECTED_DIR, `${slug}.json`);
  const expected = withExpected && existsSync(expFile) ? JSON.parse(readFileSync(expFile, "utf8")) : null;
  return { mod, expected, problem: buildProblem(bySlug[slug], mod, expected) };
}

export function runJs(code, harness, inputs, { timeoutMs = 10000, stopOnError = false } = {}) {
  return new Promise((resolve) => {
    const w = new Worker(path.join(here, "js-thread.js"), {
      workerData: { code, harness, inputs, stopOnError },
      resourceLimits: { stackSizeMb: 64 },
    });
    const timer = setTimeout(() => {
      w.terminate();
      resolve({ timeout: true, results: [] });
    }, timeoutMs);
    w.once("message", (m) => {
      clearTimeout(timer);
      w.terminate();
      resolve(m);
    });
    w.once("error", (e) => {
      clearTimeout(timer);
      resolve({ crash: String(e && e.stack || e), results: [] });
    });
  });
}

let pythonCmd = null;
function python() {
  if (pythonCmd) return pythonCmd;
  for (const cmd of ["python3", "python"]) {
    const r = spawnSync(cmd, ["--version"], { encoding: "utf8" });
    if (r.status === 0) return (pythonCmd = cmd);
  }
  throw new Error("python3 was not found on PATH");
}

let preludeFile = null;
function prelude() {
  if (preludeFile) return preludeFile;
  preludeFile = path.join(tmpdir(), `dsa-arena-harness-${process.pid}.py`);
  writeFileSync(preludeFile, PY_PRELUDE + "\n" + PY_CLI);
  return preludeFile;
}

export function runPy(code, harness, inputs, { timeoutMs = 10000, stopOnError = false } = {}) {
  return new Promise((resolve) => {
    const child = spawn(python(), [prelude()], { stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      resolve({ timeout: true, results: [] });
    }, timeoutMs);
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", () => {
      clearTimeout(timer);
      try {
        resolve(JSON.parse(out));
      } catch {
        resolve({ crash: (err || out || "no output").slice(0, 2000), results: [] });
      }
    });
    child.stdin.end(JSON.stringify({ code, harness, cases: inputs, stopOnError }));
  });
}

export async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return out;
}
