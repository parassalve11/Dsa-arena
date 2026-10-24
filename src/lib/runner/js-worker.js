import { executeJs } from "./js-engine.js";

self.onmessage = (e) => {
  const { id, code, harness, inputs, stopOnError } = e.data;
  let res;
  try {
    res = executeJs(code, harness, inputs, { stopOnError });
  } catch (err) {
    res = { crash: String((err && err.stack) || err), results: [] };
  }
  self.postMessage({ type: "result", id, ...res });
};

self.postMessage({ type: "ready" });
