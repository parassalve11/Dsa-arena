// Normalises the compact harness written in problem files into the full shape
// the engines and the judge use.
//
// Authoring shape:
//   { fn: "twoSum", params: { nums: "int[]", target: "int" }, returns: "int[]",
//     type?: "function" | "inplace" | "design", inplace?: "nums",
//     adapter?: "...", inputs?: [...], compare?: "...", validator?: "..." }

export function normalizeHarness(h) {
  const type = h.type || (h.inplace ? "inplace" : "function");
  const params = Array.isArray(h.params)
    ? h.params
    : Object.entries(h.params || {}).map(([name, t]) => ({ name, type: t }));
  const inputs =
    h.inputs || (type === "design" ? ["ops", "args"] : params.map((p) => p.name));
  return {
    type,
    functionName: h.fn || h.functionName || null,
    className: h.className || null,
    params,
    inputs,
    returns: h.returns || (type === "inplace" ? "void" : "any"),
    inplaceParam: h.inplace || h.inplaceParam || null,
    adapter: h.adapter || null,
    compare: h.compare || (h.validator ? "custom" : "exact"),
    validator: h.validator || null,
    tolerance: h.tolerance ?? 1e-5,
  };
}

// How a case input is shown, e.g. `nums = [2,7,11,15]`.
export function formatValue(v) {
  return JSON.stringify(v);
}

export function inputEntries(harness, input) {
  const keys = harness.inputs.filter((k) => k in input);
  for (const k of Object.keys(input)) if (!keys.includes(k)) keys.push(k);
  return keys.map((k) => [k, input[k]]);
}
