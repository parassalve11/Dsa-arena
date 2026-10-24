// Validates every problem: schema, both reference solutions against the stored
// expected outputs, and that the starter code fails cleanly.
//
//   npm run validate            # all problems
//   npm run validate -- two-sum # just some

import { existsSync } from "node:fs";
import path from "node:path";
import { catalog } from "../src/data/catalog.js";
import { judge } from "../src/lib/runner/compare.js";
import { submitCases } from "../src/lib/problem.js";
import { EXPECTED_DIR, PROBLEMS_DIR, loadProblem, pool, runJs, runPy } from "./lib/runners.js";

const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const targets = only.length ? catalog.filter((p) => only.includes(p.slug)) : catalog;

function schemaErrors(meta, mod, problem, expected) {
  const errs = [];
  if (mod.slug !== meta.slug) errs.push(`slug "${mod.slug}" should be "${meta.slug}"`);
  if (typeof mod.description !== "string" || mod.description.trim().length < 40) errs.push("description missing or too short");
  if (!Array.isArray(mod.examples) || mod.examples.length < 3) errs.push("needs at least 3 examples");
  if (!Array.isArray(mod.tests) || mod.tests.length < 12) errs.push(`needs at least 12 tests (has ${mod.tests?.length ?? 0})`);
  if (!Array.isArray(mod.constraints) || !mod.constraints.length) errs.push("constraints missing");
  const a = mod.answer || {};
  if (!Array.isArray(a.approach) || a.approach.length < 2) errs.push("answer.approach needs points");
  if (!a.time || !a.space) errs.push("answer complexity missing");
  if (!a.javascript || !a.python) errs.push("answer code missing");
  const h = problem.harness;
  const needsFn = !["codec", "firstBadVersion"].includes(h.adapter);
  if (h.type === "design" ? !h.className : needsFn && !h.functionName) errs.push("harness needs fn or className");
  for (const [i, c] of submitCases(problem).entries()) {
    const missing = h.inputs.filter((k) => !(k in c.input));
    if (missing.length) {
      errs.push(`case ${i + 1} is missing input(s): ${missing.join(", ")}`);
      break;
    }
  }
  if (!expected) errs.push("expected outputs missing (run gen-expected)");
  else if (expected.examples.length !== mod.examples.length || expected.tests.length !== mod.tests.length) {
    errs.push("expected outputs are stale (run gen-expected)");
  }
  return errs;
}

async function checkReference(lang, code, problem) {
  const cases = submitCases(problem);
  const run = lang === "js" ? runJs : runPy;
  const res = await run(code, problem.harness, cases.map((c) => c.input), { timeoutMs: 60000 });
  if (res.timeout) return `${lang}: timed out`;
  if (res.crash) return `${lang}: harness crash ${res.crash.slice(0, 300)}`;
  if (res.compileError) return `${lang}: ${res.compileError.message} (line ${res.compileError.line})`;
  for (let i = 0; i < cases.length; i++) {
    const r = res.results[i];
    if (!r) return `${lang}: missing result for case ${i + 1}`;
    if (!r.ok) return `${lang}: case ${i + 1} ${r.error} (line ${r.line})`;
    if (!judge(problem.harness, cases[i].input, r.output, cases[i].expected)) {
      return `${lang}: case ${i + 1} wrong, got ${JSON.stringify(r.output).slice(0, 120)} expected ${JSON.stringify(cases[i].expected).slice(0, 120)}`;
    }
  }
  return { ms: res.results.reduce((s, r) => s + r.ms, 0) };
}

async function checkStarter(lang, code, problem) {
  const run = lang === "js" ? runJs : runPy;
  const res = await run(code, problem.harness, problem.examples.map((e) => e.input), { timeoutMs: 20000 });
  if (res.timeout) return `${lang} starter: timed out`;
  if (res.crash) return `${lang} starter: harness crash ${res.crash.slice(0, 300)}`;
  if (!res.compileError && res.results.length !== problem.examples.length) return `${lang} starter: missing results`;
  return null;
}

const rows = await pool(targets, 6, async (meta) => {
  const file = path.join(PROBLEMS_DIR, `${meta.slug}.js`);
  if (!existsSync(file)) return { meta, errors: ["problem file missing"] };
  try {
    const { mod, expected, problem } = await loadProblem(meta.slug);
    const errors = schemaErrors(meta, mod, problem, expected);
    if (!existsSync(path.join(EXPECTED_DIR, `${meta.slug}.json`))) return { meta, errors };
    const [js, py] = await Promise.all([
      checkReference("js", mod.answer.javascript, problem),
      checkReference("py", mod.answer.python, problem),
    ]);
    if (typeof js === "string") errors.push(js);
    if (typeof py === "string") errors.push(py);
    for (const [lang, code] of [["js", problem.starterCode.javascript], ["py", problem.starterCode.python]]) {
      const e = await checkStarter(lang, code, problem);
      if (e) errors.push(e);
    }
    return { meta, errors, jsMs: js.ms, pyMs: py.ms };
  } catch (e) {
    return { meta, errors: [`load error: ${e.message}`] };
  }
});

let pass = 0;
const fmt = (ms) => (ms === undefined ? "    -" : `${Math.round(ms)}`.padStart(5));
console.log(`\n ok    #  ${"slug".padEnd(58)} js ms  py ms`);
for (const r of rows) {
  const ok = r.errors.length === 0;
  if (ok) pass++;
  console.log(` ${ok ? "✓" : "✗"}  ${String(r.meta.id).padStart(3)}  ${r.meta.slug.padEnd(58)} ${fmt(r.jsMs)}  ${fmt(r.pyMs)}`);
  for (const e of r.errors) console.log(`        - ${e}`);
}
console.log(`\n${pass}/${rows.length} ✓`);
process.exit(pass === rows.length ? 0 : 1);
