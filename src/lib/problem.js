// Turns a problem module (src/data/problems/<slug>.js) plus its generated
// expected outputs (src/data/expected/<slug>.json) into the full problem object.

import { normalizeHarness } from "./runner/harness.js";

const JS_TYPES = {
  int: "number",
  float: "number",
  bool: "boolean",
  string: "string",
  char: "character",
  "int[]": "number[]",
  "int[][]": "number[][]",
  "float[]": "number[]",
  "bool[]": "boolean[]",
  "string[]": "string[]",
  "string[][]": "string[][]",
  "char[]": "character[]",
  "char[][]": "character[][]",
  ListNode: "ListNode",
  "ListNode[]": "ListNode[]",
  TreeNode: "TreeNode",
  void: "void",
};

const PY_TYPES = {
  int: "int",
  float: "float",
  bool: "bool",
  string: "str",
  char: "str",
  "int[]": "List[int]",
  "int[][]": "List[List[int]]",
  "float[]": "List[float]",
  "bool[]": "List[bool]",
  "string[]": "List[str]",
  "string[][]": "List[List[str]]",
  "char[]": "List[str]",
  "char[][]": "List[List[str]]",
  ListNode: "Optional[ListNode]",
  "ListNode[]": "List[Optional[ListNode]]",
  TreeNode: "Optional[TreeNode]",
  void: "None",
};

const JS_LIST_DEF = `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
`;

const JS_TREE_DEF = `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
`;

const PY_LIST_DEF = `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
`;

const PY_TREE_DEF = `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
`;

function usesType(h, prefix) {
  return [...h.params.map((p) => p.type), h.returns].some((t) => t && t.startsWith(prefix));
}

export function jsStarter(h) {
  let out = "";
  if (usesType(h, "ListNode")) out += JS_LIST_DEF;
  if (usesType(h, "TreeNode")) out += JS_TREE_DEF;
  const doc = ["/**"];
  for (const p of h.params) doc.push(` * @param {${JS_TYPES[p.type] || p.type}} ${p.name}`);
  if (h.type === "inplace" || h.returns === "void") {
    doc.push(` * @return {void} Do not return anything, modify ${h.inplaceParam} in-place instead.`, " */");
  } else {
    doc.push(` * @return {${JS_TYPES[h.returns] || h.returns}}`, " */");
  }
  out += doc.join("\n") + "\n";
  out += `function ${h.functionName}(${h.params.map((p) => p.name).join(", ")}) {\n    \n}\n`;
  return out;
}

export function pyStarter(h) {
  let out = "";
  if (usesType(h, "ListNode")) out += PY_LIST_DEF;
  if (usesType(h, "TreeNode")) out += PY_TREE_DEF;
  const args = ["self", ...h.params.map((p) => `${p.name}: ${PY_TYPES[p.type] || p.type}`)].join(", ");
  const inplace = h.type === "inplace" || h.returns === "void";
  const ret = inplace ? "None" : PY_TYPES[h.returns] || h.returns;
  out += `class Solution:\n    def ${h.functionName}(${args}) -> ${ret}:\n`;
  if (inplace) out += `        """\n        Do not return anything, modify ${h.inplaceParam} in-place instead.\n        """\n`;
  out += "        ";
  return out;
}

export function buildProblem(meta, mod, expected) {
  const harness = normalizeHarness(mod.harness);
  const exOut = (expected && expected.examples) || [];
  const testOut = (expected && expected.tests) || [];
  return {
    ...meta,
    description: mod.description,
    constraints: mod.constraints || [],
    followUp: mod.followUp || null,
    harness,
    examples: mod.examples.map((e, i) => ({
      input: e.input,
      output: exOut[i],
      explanation: e.explanation || null,
    })),
    tests: mod.tests.map((input, i) => ({ input, expected: testOut[i] })),
    starterCode: {
      javascript: (mod.starter && mod.starter.javascript) || jsStarter(harness),
      python: (mod.starter && mod.starter.python) || pyStarter(harness),
    },
    answer: mod.answer,
  };
}

// Every case Submit runs: the examples first, then the hidden tests.
export function submitCases(problem) {
  return [
    ...problem.examples.map((e) => ({ input: e.input, expected: e.output })),
    ...problem.tests,
  ];
}
