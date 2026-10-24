import { parentPort, workerData } from "node:worker_threads";
import { executeJs } from "../../src/lib/runner/js-engine.js";

const { code, harness, inputs, stopOnError } = workerData;
parentPort.postMessage(executeJs(code, harness, inputs, { stopOnError }));
