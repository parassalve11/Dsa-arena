import { chainTree, randomTree, range } from "../gen.js";

export default {
  slug: "binary-tree-maximum-path-sum",
  description: `A **path** in a binary tree is a sequence of nodes where each pair of neighbouring nodes is connected by an edge. A node can appear in the path **at most once**, and the path does not have to pass through the root.

The **path sum** is the sum of the node values on the path.

Given the \`root\` of a binary tree, return the **maximum path sum** of any **non-empty** path.`,
  examples: [
    { input: { root: [1, 2, 3] }, explanation: "The path 2 → 1 → 3 has sum 6." },
    { input: { root: [-10, 9, 20, null, null, 15, 7] }, explanation: "The best path is 15 → 20 → 7, with sum 42." },
    { input: { root: [-3] }, explanation: "The path must contain at least one node." },
  ],
  constraints: ["The number of nodes is in the range [1, 3 * 10^4].", "-1000 <= Node.val <= 1000"],
  harness: { fn: "maxPathSum", params: { root: "TreeNode" }, returns: "int" },
  tests: [
    { root: [5] },
    { root: [-1, -2, -3] },
    { root: [2, -1] },
    { root: [-2, 1] },
    { root: [1, -2, 3] },
    { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1] },
    { root: [1, 2, null, 3, null, 4, null, 5] },
    { root: [-1, 5, null, 4, null, null, 2, -4] },
    { root: [9, 6, -3, null, null, -6, 2, null, null, 2, null, -6, -6, -6] },
    { root: [10, -1000, -1000, 1000, 1000, 1000, 1000] },
    { root: [0, 0, 0] },
    { root: [-1000, -1000, -1000, -1000] },
    { root: randomTree(30000, -1000, 1000, 15) },
    { root: chainTree(range(800).map((i) => (i % 3) - 1), "r") },
  ],
  answer: {
    approach: [
      "For each node, compute gain(node): the best sum of a downward path that starts at that node. It is node.val + max(0, gain(left), gain(right)). Negative branches are dropped.",
      "A path that 'bends' at a node uses both sides: node.val + max(0, gain(left)) + max(0, gain(right)). Compare this with the best answer so far.",
      "Return only the single best branch upwards, since a parent can extend just one side of the path.",
      "Initialise the answer to -∞ so all-negative trees work.",
    ],
    time: "O(n)",
    space: "O(h)",
    javascript: `function maxPathSum(root) {
    let best = -Infinity;
    const gain = (node) => {
        if (!node) return 0;
        const l = Math.max(0, gain(node.left));
        const r = Math.max(0, gain(node.right));
        best = Math.max(best, node.val + l + r);
        return node.val + Math.max(l, r);
    };
    gain(root);
    return best;
}`,
    python: `class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        best = float('-inf')

        def gain(node):
            nonlocal best
            if not node:
                return 0
            l = max(0, gain(node.left))
            r = max(0, gain(node.right))
            best = max(best, node.val + l + r)
            return node.val + max(l, r)

        gain(root)
        return best`,
  },
};
