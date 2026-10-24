import { randomTree } from "../gen.js";

const big = randomTree(10000, -10000, 10000, 3);
const bigChanged = big.slice();
bigChanged[bigChanged.length - 1] = bigChanged[bigChanged.length - 1] + 1;

export default {
  slug: "same-tree",
  description: `Given the roots of two binary trees \`p\` and \`q\`, return \`true\` if they are **the same**.

Two trees are the same if they have exactly the same shape and every pair of matching nodes has the same value.`,
  examples: [
    { input: { p: [1, 2, 3], q: [1, 2, 3] }, explanation: "Same shape, same values." },
    { input: { p: [1, 2], q: [1, null, 2] }, explanation: "The 2 is a left child in one tree and a right child in the other." },
    { input: { p: [1, 2, 1], q: [1, 1, 2] }, explanation: "Same shape but the children's values are swapped." },
  ],
  constraints: ["The number of nodes in both trees is in the range [0, 100] (tests go higher).", "-10^4 <= Node.val <= 10^4"],
  harness: { fn: "isSameTree", params: { p: "TreeNode", q: "TreeNode" }, returns: "bool" },
  tests: [
    { p: [], q: [] },
    { p: [1], q: [] },
    { p: [], q: [1] },
    { p: [1], q: [1] },
    { p: [1], q: [2] },
    { p: [1, null, 2], q: [1, null, 2] },
    { p: [1, 2, 3, 4], q: [1, 2, 3, null, 4] },
    { p: [10, 5, 15], q: [10, 5, null, null, 15] },
    { p: [0, -5], q: [0, -5] },
    { p: [3, 4, 5, 1, 2], q: [3, 4, 5, 1, 2] },
    { p: [3, 4, 5, 1, 2], q: [3, 4, 5, 1] },
    { p: [1, 1], q: [1, null, 1] },
    { p: big, q: big },
    { p: big, q: bigChanged },
  ],
  answer: {
    approach: [
      "Compare the trees recursively, node by node.",
      "If both nodes are null, they match. If only one is null, or their values differ, they don't.",
      "Otherwise both left subtrees must match and both right subtrees must match.",
    ],
    time: "O(n)",
    space: "O(h)",
    javascript: `function isSameTree(p, q) {
    if (!p && !q) return true;
    if (!p || !q || p.val !== q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    python: `class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)`,
  },
};
