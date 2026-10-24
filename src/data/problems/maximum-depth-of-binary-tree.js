import { randomTree } from "../gen.js";

// A left-leaning chain, 900 nodes deep.
const chain = [1];
for (let i = 2; i <= 900; i++) chain.push(i, null);

export default {
  slug: "maximum-depth-of-binary-tree",
  description: `Given the \`root\` of a binary tree, return its **maximum depth**.

The maximum depth is the number of nodes on the longest path that starts at the root and goes down to a leaf. A leaf is a node with no children. An empty tree has depth 0.`,
  examples: [
    { input: { root: [3, 9, 20, null, null, 15, 7] }, explanation: "The longest path is 3 → 20 → 15 (or 3 → 20 → 7), which has 3 nodes." },
    { input: { root: [1, null, 2] }, explanation: "The path 1 → 2 has 2 nodes." },
    { input: { root: [] }, explanation: "An empty tree has depth 0." },
  ],
  constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
  harness: { fn: "maxDepth", params: { root: "TreeNode" }, returns: "int" },
  tests: [
    { root: [0] },
    { root: [1, 2] },
    { root: [1, 2, 3] },
    { root: [1, 2, 3, 4, 5, 6, 7] },
    { root: [1, 2, null, 3, null, 4, null, 5] },
    { root: [1, null, 2, null, 3, null, 4] },
    { root: [1, 2, 3, 4, null, null, 5, 6, null, null, 7] },
    { root: [-100, -50, 100] },
    { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1] },
    { root: [1, 2, 2, 3, 3, null, null, 4, 4] },
    { root: [2, null, 3, null, 4, null, 5, null, 6] },
    { root: [1, 1, 1, 1, 1, 1, 1, 1] },
    { root: randomTree(10000, -100, 100, 4) },
    { root: chain },
  ],
  answer: {
    approach: [
      "The depth of a tree is 1 (for the root) plus the larger depth of its two subtrees.",
      "An empty tree (null) has depth 0. That is the base case of the recursion.",
      "Recursively compute maxDepth(left) and maxDepth(right) and return 1 + max of them.",
      "For very deep trees you can do a level-order BFS instead and count the levels.",
    ],
    time: "O(n)",
    space: "O(h), where h is the height of the tree",
    javascript: `function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    python: `class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
  },
};
