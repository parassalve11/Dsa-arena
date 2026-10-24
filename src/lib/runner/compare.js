import { validators } from "./validators.js";

export function deepEqual(a, b, tol = 0) {
  if (typeof a === "number" && typeof b === "number") {
    if (tol > 0) return Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
    return a === b;
  }
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i], tol)) return false;
    return true;
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k], tol));
}

function cmpValues(x, y) {
  if (typeof x === "number" && typeof y === "number") return x - y;
  const sx = typeof x === "string" ? x : JSON.stringify(x);
  const sy = typeof y === "string" ? y : JSON.stringify(y);
  return sx < sy ? -1 : sx > sy ? 1 : 0;
}

function sortOuter(arr) {
  return arr.slice().sort(cmpValues);
}

function sortNested(arr) {
  return arr.map((x) => (Array.isArray(x) ? x.slice().sort(cmpValues) : x)).sort(cmpValues);
}

export function judge(harness, input, output, expected) {
  switch (harness.compare) {
    case "float":
      return deepEqual(output, expected, harness.tolerance || 1e-5);
    case "unordered":
      if (!Array.isArray(output) || !Array.isArray(expected)) return false;
      return deepEqual(sortOuter(output), sortOuter(expected));
    case "unorderedNested":
      if (!Array.isArray(output) || !Array.isArray(expected)) return false;
      if (!output.every(Array.isArray)) return false;
      return deepEqual(sortNested(output), sortNested(expected));
    case "custom": {
      const v = validators[harness.validator];
      if (!v) throw new Error(`Unknown validator: ${harness.validator}`);
      try {
        return !!v(input, output, expected);
      } catch {
        return false;
      }
    }
    default:
      return deepEqual(output, expected);
  }
}
