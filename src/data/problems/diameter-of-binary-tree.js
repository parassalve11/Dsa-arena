import { chainTree, randomTree, range } from "../gen.js";

export default {
  slug: "diameter-of-binary-tree",
  description: `Given the \`root\` of a binary tree, return the length of its **diameter**.

The diameter is the length of the **longest path between any two nodes**, measured in **edges**. The path may or may not pass through the root.`,
  examples: [
    { input: { root: [1, 2, 3, 4, 5] }, explanation: "The path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3) has 3 edges." },
    { input: { root: [1, 2] }, explanation: "One edge between the two nodes." },
    { input: { root: [1] }, explanation: "A single node has no edges." },
  ],
  constraints: ["The number of nodes is in the range [1, 10^4].", "-100 <= Node.val <= 100"],
  harness: { fn: "diameterOfBinaryTree", params: { root: "TreeNode" }, returns: "int" },
  tests: [
    { root: [1, null, 2] },
    { root: [1, 2, 3] },
    { root: [1, 2, null, 3, 4] },
    { root: [1, 2, null, 3, 4, 5, null, null, 6] },
    { root: [4, -7, -3, null, null, -9, -3, 9, -7, -4, null, 6, null, -6, -6, null, null, 0, 6, 5, null, 9, null, null, -1, -4, null, null, null, -2] },
    { root: [1, 2, 3, 4, 5, 6, 7] },
    { root: [2, 3, null, 1] },
    { root: [3, 1, null, null, 2] },
    { root: [1, 2, 3, 4, 5, null, null, 6, null, null, 7] },
    { root: [0, 0, 0, 0, null, null, 0, 0, null, null, 0] },
    { root: [5, 4, null, 3, null, 2, null, 1] },
    { root: [1, 2, 3, null, null, 4, 5, 6, null, null, 7] },
    { root: randomTree(10000, -100, 100, 5) },
    { root: chainTree(range(900), "r") },
  ],
  answer: {
    approach: [
      "The longest path through a node uses the deepest path in its left subtree plus the deepest path in its right subtree.",
      "Write a helper depth(node) that returns the height of the subtree (number of nodes on the longest downward path).",
      "Inside it, after computing left = depth(node.left) and right = depth(node.right), update best = max(best, left + right).",
      "Return 1 + max(left, right). The answer is best, which counts edges.",
    ],
    time: "O(n)",
    space: "O(h)",
    javascript: `function diameterOfBinaryTree(root) {
    let best = 0;
    const depth = (node) => {
        if (!node) return 0;
        const l = depth(node.left), r = depth(node.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
    };
    depth(root);
    return best;
}`,
    python: `class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        best = 0

        def depth(node):
            nonlocal best
            if not node:
                return 0
            l, r = depth(node.left), depth(node.right)
            best = max(best, l + r)
            return 1 + max(l, r)

        depth(root)
        return best`,
  },
};
