import { balancedBST, chainTree, range } from "../gen.js";

const bal = balancedBST(range(4095));

export default {
  slug: "balanced-binary-tree",
  description: `Given a binary tree, decide whether it is **height-balanced**.

A tree is height-balanced if, for **every node**, the heights of its left and right subtrees differ by **at most 1**.`,
  examples: [
    { input: { root: [3, 9, 20, null, null, 15, 7] }, explanation: "At every node the two subtree heights differ by at most 1." },
    { input: { root: [1, 2, 2, 3, 3, null, null, 4, 4] }, explanation: "At the root the left subtree has height 3 and the right has height 1." },
    { input: { root: [] }, explanation: "An empty tree is balanced." },
  ],
  constraints: ["The number of nodes is in the range [0, 5000].", "-10^4 <= Node.val <= 10^4"],
  harness: { fn: "isBalanced", params: { root: "TreeNode" }, returns: "bool" },
  tests: [
    { root: [1] },
    { root: [1, 2] },
    { root: [1, 2, null, 3] },
    { root: [1, null, 2, null, 3] },
    { root: [1, 2, 3, 4] },
    { root: [1, 2, 3, 4, null, null, null, 5] },
    { root: [1, 2, 2, 3, null, null, 3, 4, null, null, 4] },
    { root: [1, 2, 3, 4, 5, 6, null, 8] },
    { root: [5, 3, 8, 1, 4, 7, 9, 0] },
    { root: [1, 2, 3, 4, 5, null, 6, 7] },
    { root: [0, -1, 1, -2, null, null, 2] },
    { root: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
    { root: bal },
    { root: chainTree(range(700), "l") },
    { root: [...bal.slice(0, 2047), 1, ...new Array(2047).fill(null), 2] },
  ],
  answer: {
    approach: [
      "Compute heights bottom-up and detect imbalance in the same pass.",
      "Write height(node) that returns the subtree height, or -1 if the subtree is already unbalanced.",
      "For a node, get the left and right heights. If either is -1 or they differ by more than 1, return -1.",
      "Otherwise return 1 + max(left, right). The tree is balanced if height(root) != -1. This avoids recomputing heights (O(n) instead of O(n²)).",
    ],
    time: "O(n)",
    space: "O(h)",
    javascript: `function isBalanced(root) {
    const height = (node) => {
        if (!node) return 0;
        const l = height(node.left);
        if (l === -1) return -1;
        const r = height(node.right);
        if (r === -1 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    };
    return height(root) !== -1;
}`,
    python: `class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def height(node):
            if not node:
                return 0
            l = height(node.left)
            if l == -1:
                return -1
            r = height(node.right)
            if r == -1 or abs(l - r) > 1:
                return -1
            return 1 + max(l, r)
        return height(root) != -1`,
  },
};
