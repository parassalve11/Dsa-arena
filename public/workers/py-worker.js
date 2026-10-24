// Module worker: loads Pyodide (CPython compiled to WebAssembly) from jsDelivr
// once, installs the harness prelude sent by the page, then runs jobs.
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";

let ready = null;

function init(prelude) {
  if (!ready) {
    ready = import(PYODIDE_URL + "pyodide.mjs")
      .then(({ loadPyodide }) => loadPyodide({ indexURL: PYODIDE_URL }))
      .then((py) => {
        py.runPython(prelude);
        return py;
      });
  }
  return ready;
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === "init") {
    try {
      await init(msg.prelude);
      self.postMessage({ type: "ready" });
    } catch (err) {
      ready = null;
      self.postMessage({ type: "error", error: String(err) });
    }
    return;
  }
  if (msg.type === "run") {
    let res;
    try {
      const py = await init(msg.prelude);
      const fn = py.globals.get("_arena_run");
      const out = fn(msg.code, JSON.stringify(msg.harness), JSON.stringify(msg.inputs), !!msg.stopOnError);
      fn.destroy();
      res = JSON.parse(out);
    } catch (err) {
      res = { crash: String(err), results: [] };
    }
    self.postMessage({ type: "result", id: msg.id, ...res });
  }
};
