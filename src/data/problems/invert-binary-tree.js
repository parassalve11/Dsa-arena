import { chainTree, randomTree, range } from "../gen.js";

export default {
  slug: "invert-binary-tree",
  description: `Given the \`root\` of a binary tree, **invert** it (mirror it left to right) and return its root.

Inverting swaps the left and right child of **every** node.`,
  examples: [
    { input: { root: [4, 2, 7, 1, 3, 6, 9] }, explanation: "Every level is reversed: [4,7,2,9,6,3,1]." },
    { input: { root: [2, 1, 3] }, explanation: "The two children swap: [2,3,1]." },
    { input: { root: [] }, explanation: "An empty tree stays empty." },
  ],
  constraints: ["The number of nodes is in the range [0, 100] (tests go higher).", "-100 <= Node.val <= 100"],
  harness: { fn: "invertTree", params: { root: "TreeNode" }, returns: "TreeNode" },
  tests: [
    { root: [1] },
    { root: [1, 2] },
    { root: [1, null, 2] },
    { root: [1, 2, 3, 4, 5, 6, 7] },
    { root: [1, 2, null, 3] },
    { root: [5, 5, 5] },
    { root: [-100, 0, 100] },
    { root: [3, 9, 20, null, null, 15, 7] },
    { root: [1, 2, 3, null, 4, null, 5] },
    { root: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15] },
    { root: [0, -1, null, -2, null, -3] },
    { root: [6, null, 7, null, 8, 9] },
    { root: randomTree(5000, -100, 100, 2) },
    { root: chainTree(range(500), "l") },
  ],
  answer: {
    approach: [
      "For each node, swap its left and right children, then invert both subtrees.",
      "Recursion: if root is null return null; swap root.left and root.right; invert each child; return root.",
      "An iterative BFS with a queue works the same way: pop a node, swap its children, push them.",
    ],
    time: "O(n)",
    space: "O(h)",
    javascript: `function invertTree(root) {
    if (!root) return null;
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
    return root;
}`,
    python: `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root`,
  },
};
