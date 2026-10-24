// Fills src/data/expected/<slug>.json by running the JS reference solution,
// then confirms every output with the Python reference solution.
//
//   npm run gen-expected -- two-sum valid-parentheses
//   npm run gen-expected -- --all
//   npm run gen-expected -- --missing

import { existsSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { judge } from "../src/lib/runner/compare.js";
import { EXPECTED_DIR, PROBLEMS_DIR, loadProblem, pool, runJs, runPy } from "./lib/runners.js";

const args = process.argv.slice(2);
const all = readdirSync(PROBLEMS_DIR)
  .filter((f) => f.endsWith(".js") && f !== "index.js")
  .map((f) => f.replace(/\.js$/, ""));

let slugs = args.filter((a) => !a.startsWith("--"));
if (args.includes("--all")) slugs = all;
if (args.includes("--missing")) slugs = all.filter((s) => !existsSync(path.join(EXPECTED_DIR, `${s}.json`)));
if (!slugs.length) {
  console.log("Nothing to do. Pass slugs, --all or --missing.");
  process.exit(0);
}

let failed = 0;
await pool(slugs, 6, async (slug) => {
  try {
    const { mod, problem } = await loadProblem(slug, { withExpected: false });
    const h = problem.harness;
    const inputs = [...mod.examples.map((e) => e.input), ...mod.tests];
    const js = await runJs(mod.answer.javascript, h, inputs, { timeoutMs: 30000 });
    if (js.timeout || js.crash || js.compileError) {
      throw new Error(`JS reference failed: ${js.timeout ? "timeout" : js.crash || js.compileError.message}`);
    }
    const bad = js.results.findIndex((r) => !r.ok);
    if (bad !== -1) throw new Error(`JS reference error on case ${bad + 1}: ${js.results[bad].error}`);
    const outputs = js.results.map((r) => r.output);

    const py = await runPy(mod.answer.python, h, inputs, { timeoutMs: 60000 });
    if (py.timeout || py.crash || py.compileError) {
      throw new Error(`Python reference failed: ${py.timeout ? "timeout" : py.crash || py.compileError.message}`);
    }
    py.results.forEach((r, i) => {
      if (!r.ok) throw new Error(`Python reference error on case ${i + 1}: ${r.error} (line ${r.line})`);
      if (!judge(h, inputs[i], r.output, outputs[i])) {
        throw new Error(
          `JS and Python disagree on case ${i + 1}: js=${JSON.stringify(outputs[i]).slice(0, 200)} py=${JSON.stringify(r.output).slice(0, 200)}`
        );
      }
    });

    const n = mod.examples.length;
    const data = { examples: outputs.slice(0, n), tests: outputs.slice(n) };
    writeFileSync(path.join(EXPECTED_DIR, `${slug}.json`), JSON.stringify(data) + "\n");
    console.log(`✓ ${slug} (${inputs.length} cases)`);
  } catch (e) {
    failed++;
    console.log(`✗ ${slug}: ${e.message}`);
  }
});

process.exit(failed ? 1 : 0);
