// Runs user JavaScript against a list of case inputs. Used by the browser worker
// and by the Node validator, so both judge code the same way.

import { parse } from "acorn";
import {
  ListNode,
  TreeNode,
  RandomNode,
  GraphNode,
  arrayToList,
  arrayToTree,
  findTreeNode,
  fromRet,
  listToArray,
  toArg,
  treeToArray,
} from "./structures.js";

const STDOUT_LIMIT = 20000;
const INJECTED = ["ListNode", "TreeNode", "Node", "_Node", "console", "isBadVersion"];

let baseLine = null;
function getBaseLine() {
  if (baseLine !== null) return baseLine;
  try {
    new Function(...INJECTED, "throw new Error('probe')")();
  } catch (e) {
    baseLine = parseLine(e) ?? 3;
  }
  return baseLine;
}

function parseLine(err) {
  const stack = String((err && err.stack) || "");
  const m = stack.match(/<anonymous>:(\d+):\d+/) || stack.match(/> Function:(\d+):\d+/);
  return m ? Number(m[1]) : null;
}

function userLine(err) {
  const raw = parseLine(err);
  if (raw === null) return null;
  const line = raw - getBaseLine() + 1;
  return line > 0 ? line : null;
}

function errorText(err) {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return `Error: ${String(err)}`;
}

function formatLogArg(a) {
  if (typeof a === "string") return a;
  if (a === undefined) return "undefined";
  if (typeof a === "function") return `[Function ${a.name || "anonymous"}]`;
  if (a instanceof Map) return JSON.stringify([...a.entries()]);
  if (a instanceof Set) return JSON.stringify([...a]);
  try {
    const s = JSON.stringify(a);
    return s === undefined ? String(a) : s;
  } catch {
    return String(a);
  }
}

function makeConsole(buf) {
  const write = (...args) => {
    if (buf.size > STDOUT_LIMIT) return;
    const line = args.map(formatLogArg).join(" ") + "\n";
    buf.text += line;
    buf.size += line.length;
  };
  return { log: write, info: write, warn: write, error: write, debug: write, table: write };
}

function jsonSafe(v) {
  if (v === undefined) return null;
  return JSON.parse(JSON.stringify(v, (k, x) => {
    if (x instanceof Set) return [...x];
    if (x instanceof Map) return [...x.entries()];
    if (typeof x === "bigint") return Number(x);
    return x;
  }) ?? "null");
}

export function checkSyntax(code) {
  try {
    parse(code, { ecmaVersion: "latest", sourceType: "script", allowReturnOutsideFunction: true });
    return null;
  } catch (e) {
    return { message: `SyntaxError: ${e.message.replace(/\s*\(\d+:\d+\)$/, "")}`, line: e.loc ? e.loc.line : null };
  }
}

function exportsFor(h) {
  const names = [];
  if (h.type === "design") names.push(h.className);
  else if (h.adapter === "codec") names.push("serialize", "deserialize");
  else if (h.adapter === "firstBadVersion") names.push("solution");
  else names.push(h.functionName);
  return names;
}

function compile(code, h) {
  const names = exportsFor(h);
  const ret = names.map((n) => `${JSON.stringify(n)}: typeof ${n} !== "undefined" ? ${n} : undefined`).join(", ");
  return new Function(...INJECTED, `${code}\n;return { ${ret} };`);
}

// ---- adapters for special problems ----

function buildCycleList(values, pos) {
  const nodes = values.map((v) => new ListNode(v));
  for (let i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && pos < nodes.length) nodes[nodes.length - 1].next = nodes[pos];
  return nodes;
}

function buildIntersection({ intersectVal, listA, listB, skipA, skipB }) {
  const a = listA.map((v) => new ListNode(v));
  for (let i = 0; i + 1 < a.length; i++) a[i].next = a[i + 1];
  const bOwn = listB.slice(0, intersectVal === 0 ? listB.length : skipB).map((v) => new ListNode(v));
  for (let i = 0; i + 1 < bOwn.length; i++) bOwn[i].next = bOwn[i + 1];
  if (intersectVal !== 0 && bOwn.length) bOwn[bOwn.length - 1].next = a[skipA];
  const headB = bOwn.length ? bOwn[0] : intersectVal !== 0 ? a[skipA] : null;
  return [a.length ? a[0] : null, headB];
}

function buildRandomList(pairs) {
  const nodes = pairs.map(([v]) => new RandomNode(v));
  nodes.forEach((n, i) => {
    n.next = nodes[i + 1] || null;
    const r = pairs[i][1];
    n.random = r === null || r === undefined ? null : nodes[r];
  });
  return nodes;
}

function serializeRandomList(head, original) {
  const orig = new Set(original);
  const index = new Map();
  const order = [];
  for (let cur = head; cur; cur = cur.next) {
    if (order.length > 200000) throw new Error("Returned list is too long or contains a cycle");
    if (orig.has(cur)) return "Invalid: the copy shares nodes with the original list";
    index.set(cur, order.length);
    order.push(cur);
  }
  return order.map((n) => {
    if (n.random && orig.has(n.random)) return [n.val, "original node"];
    return [n.val, n.random ? (index.has(n.random) ? index.get(n.random) : "?") : null];
  });
}

function buildGraph(adj) {
  if (!adj.length) return [];
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((nbrs, i) => {
    nodes[i].neighbors = nbrs.map((v) => nodes[v - 1]);
  });
  return nodes;
}

function serializeGraph(start, original) {
  if (!start) return [];
  const orig = new Set(original);
  const seen = new Map();
  const queue = [start];
  seen.set(start.val, start);
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    if (orig.has(node)) return "Invalid: the clone shares nodes with the original graph";
    for (const nb of node.neighbors || []) {
      if (!seen.has(nb.val)) {
        seen.set(nb.val, nb);
        queue.push(nb);
      } else if (seen.get(nb.val) !== nb) {
        return "Invalid: two different nodes have the same value";
      }
    }
  }
  const n = Math.max(...seen.keys());
  const out = [];
  for (let v = 1; v <= n; v++) {
    const node = seen.get(v);
    out.push(node ? node.neighbors.map((x) => x.val) : []);
  }
  return out;
}

function runOne(factory, h, input, con) {
  const ctx = { bad: input.bad };
  const isBadVersion = (v) => v >= ctx.bad;
  const NodeClass = h.adapter === "cloneGraph" ? GraphNode : RandomNode;
  const exp = factory(ListNode, TreeNode, NodeClass, NodeClass, con, isBadVersion);

  if (h.type === "design") {
    const Cls = exp[h.className];
    if (typeof Cls !== "function") throw new Error(`class ${h.className} is not defined`);
    const { ops, args } = input;
    const obj = new Cls(...(args[0] || []));
    const out = [null];
    for (let i = 1; i < ops.length; i++) {
      if (typeof obj[ops[i]] !== "function") throw new Error(`${h.className}.${ops[i]} is not a function`);
      const r = obj[ops[i]](...(args[i] || []));
      out.push(r === undefined ? null : r);
    }
    return out;
  }

  if (h.adapter === "codec") {
    if (typeof exp.serialize !== "function") throw new Error("function serialize is not defined");
    if (typeof exp.deserialize !== "function") throw new Error("function deserialize is not defined");
    const data = exp.serialize(arrayToTree(input.root));
    if (typeof data !== "string") throw new Error("serialize must return a string");
    return treeToArray(exp.deserialize(data));
  }

  if (h.adapter === "firstBadVersion") {
    if (typeof exp.solution !== "function") throw new Error("solution is not defined");
    return fromRet("int", exp.solution(isBadVersion)(input.n));
  }

  const fn = exp[h.functionName];
  if (typeof fn !== "function") throw new Error(`function ${h.functionName} is not defined`);

  switch (h.adapter) {
    case "listCycle": {
      const nodes = buildCycleList(input.head, input.pos);
      return fromRet("bool", fn(nodes[0] || null));
    }
    case "listCycleIndex": {
      const nodes = buildCycleList(input.head, input.pos);
      const r = fn(nodes[0] || null);
      if (!r) return -1;
      const idx = nodes.indexOf(r);
      return idx === -1 ? "Invalid: returned node is not in the list" : idx;
    }
    case "intersection": {
      const [a, b] = buildIntersection(input);
      const r = fn(a, b);
      return r ? r.val : null;
    }
    case "randomList": {
      const nodes = buildRandomList(input.head);
      return serializeRandomList(fn(nodes[0] || null), nodes);
    }
    case "cloneGraph": {
      const nodes = buildGraph(input.adjList);
      return serializeGraph(fn(nodes[0] || null), nodes);
    }
    case "lca": {
      const root = arrayToTree(input.root);
      const r = fn(root, findTreeNode(root, input.p), findTreeNode(root, input.q));
      return r ? r.val : null;
    }
    case "distanceK": {
      const root = arrayToTree(input.root);
      return fromRet("int[]", fn(root, findTreeNode(root, input.target), input.k));
    }
    default:
      break;
  }

  const args = h.params.map((p) => toArg(p.type, input[p.name]));
  const ret = fn(...args);

  if (h.adapter === "firstK") {
    const k = ret;
    if (typeof k !== "number" || k < 0 || k > args[0].length) return `Invalid k: ${formatLogArg(k)}`;
    return args[0].slice(0, k);
  }
  if (h.type === "inplace") {
    const idx = h.params.findIndex((p) => p.name === h.inplaceParam);
    return fromRet(h.params[idx].type, args[idx]);
  }
  return fromRet(h.returns, ret);
}

/**
 * @returns {{ compileError?: {message, line}, results: Array<{ok, output, stdout, error, line, ms}> }}
 */
export function executeJs(code, harness, inputs, { stopOnError = false } = {}) {
  const syntax = checkSyntax(code);
  if (syntax) return { compileError: syntax, results: [] };

  let factory;
  try {
    factory = compile(code, harness);
  } catch (e) {
    return { compileError: { message: errorText(e), line: userLine(e) }, results: [] };
  }

  const results = [];
  for (const raw of inputs) {
    const input = structuredClone(raw);
    const buf = { text: "", size: 0 };
    const con = makeConsole(buf);
    const t0 = performance.now();
    try {
      const output = jsonSafe(runOne(factory, harness, input, con));
      results.push({ ok: true, output, stdout: buf.text, ms: performance.now() - t0 });
    } catch (e) {
      results.push({ ok: false, error: errorText(e), line: userLine(e), stdout: buf.text, ms: performance.now() - t0 });
      if (stopOnError) break;
    }
  }
  return { results };
}

export { arrayToList, listToArray };
