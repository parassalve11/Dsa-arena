// Deterministic generators for large test inputs. The same seed always gives
// the same data, so problem files stay small and expected outputs stay valid.

export function rng(seed = 1) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(r, lo, hi) {
  return lo + Math.floor(r() * (hi - lo + 1));
}

export function ints(n, lo, hi, seed = 1) {
  const r = rng(seed);
  return Array.from({ length: n }, () => randInt(r, lo, hi));
}

export function sortedInts(n, lo, hi, seed = 1) {
  return ints(n, lo, hi, seed).sort((a, b) => a - b);
}

export function distinctInts(n, lo, hi, seed = 1) {
  const r = rng(seed);
  const set = new Set();
  while (set.size < n) set.add(randInt(r, lo, hi));
  return [...set];
}

export function shuffle(arr, seed = 1) {
  const r = rng(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function range(n, start = 0) {
  return Array.from({ length: n }, (_, i) => start + i);
}

export function str(n, alphabet = "abcdefghijklmnopqrstuvwxyz", seed = 1) {
  const r = rng(seed);
  let s = "";
  for (let i = 0; i < n; i++) s += alphabet[Math.floor(r() * alphabet.length)];
  return s;
}

export function grid(rows, cols, pick, seed = 1) {
  const r = rng(seed);
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => pick(r)));
}

export function intGrid(rows, cols, lo, hi, seed = 1) {
  return grid(rows, cols, (r) => randInt(r, lo, hi), seed);
}

// Level-order array for a random binary tree with `n` nodes.
export function randomTree(n, lo, hi, seed = 1) {
  const r = rng(seed);
  if (n === 0) return [];
  const out = [randInt(r, lo, hi)];
  let count = 1;
  let slots = 2;
  while (count < n) {
    if (r() < 0.75 || slots === 1) {
      out.push(randInt(r, lo, hi));
      count++;
      slots += 1;
    } else {
      out.push(null);
      slots -= 1;
    }
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

// Level-order array for a complete binary tree with values from `values`.
export function completeTree(values) {
  return values.slice();
}

// Level-order array of a balanced BST over the sorted unique values.
export function balancedBST(sortedValues) {
  const nodes = [];
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    return { v: sortedValues[mid], l: build(lo, mid - 1), r: build(mid + 1, hi) };
  }
  const root = build(0, sortedValues.length - 1);
  const q = [root];
  for (let i = 0; i < q.length; i++) {
    const node = q[i];
    if (!node) {
      nodes.push(null);
      continue;
    }
    nodes.push(node.v);
    q.push(node.l, node.r);
  }
  while (nodes.length && nodes[nodes.length - 1] === null) nodes.pop();
  return nodes;
}

// ---- tree helpers (level-order arrays in, plain values out) ----

function buildNodes(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { v: arr[0], l: null, r: null };
  const q = [root];
  let head = 0;
  let i = 1;
  while (head < q.length && i < arr.length) {
    const node = q[head++];
    if (i < arr.length && arr[i] !== null) q.push((node.l = { v: arr[i], l: null, r: null }));
    i++;
    if (i < arr.length && arr[i] !== null) q.push((node.r = { v: arr[i], l: null, r: null }));
    i++;
  }
  return root;
}

function toLevel(root) {
  const out = [];
  const q = [root];
  for (let i = 0; i < q.length; i++) {
    const n = q[i];
    if (!n) {
      out.push(null);
      continue;
    }
    out.push(n.v);
    q.push(n.l, n.r);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

/** Random tree shape with distinct values (a shuffled range). */
export function uniqueTree(n, seed = 1, start = 0) {
  const shape = randomTree(n, 0, 0, seed);
  const vals = shuffle(range(n, start), seed + 7);
  let k = 0;
  return shape.map((x) => (x === null ? null : vals[k++]));
}

export function preorderOf(arr) {
  const out = [];
  const stack = [buildNodes(arr)];
  while (stack.length) {
    const n = stack.pop();
    if (!n) continue;
    out.push(n.v);
    stack.push(n.r, n.l);
  }
  return out;
}

export function inorderOf(arr) {
  const out = [];
  const stack = [];
  let cur = buildNodes(arr);
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.l;
    }
    cur = stack.pop();
    out.push(cur.v);
    cur = cur.r;
  }
  return out;
}

/** Tree whose left half mirrors the right: symmetric by construction. */
export function symmetricTree(halfArr) {
  const half = buildNodes(halfArr);
  const mirror = (n) => (n ? { v: n.v, l: mirror(n.r), r: mirror(n.l) } : null);
  return toLevel({ v: 0, l: half, r: mirror(half) });
}

/** A chain of n nodes going left (dir = "l") or right. */
export function chainTree(values, dir = "l") {
  const out = [values[0]];
  for (let i = 1; i < values.length; i++) out.push(...(dir === "l" ? [values[i], null] : [null, values[i]]));
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
