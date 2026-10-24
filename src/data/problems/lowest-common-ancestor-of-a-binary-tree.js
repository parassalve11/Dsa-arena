import { uniqueTree } from "../gen.js";

const big = uniqueTree(10000, 11);
const vals = big.filter((v) => v !== null);

export default {
  slug: "lowest-common-ancestor-of-a-binary-tree",
  description: `Given a binary tree and two of its nodes \`p\` and \`q\`, find their **lowest common ancestor** (LCA).

The LCA is the **deepest** node that has both \`p\` and \`q\` as descendants. A node counts as a descendant of itself.

All node values are unique, and \`p\` and \`q\` are different nodes that both exist in the tree.

**How the input works:** \`p\` and \`q\` are given as values. The judge finds those nodes and passes the **nodes** to your function. The output is the value of the node you return.`,
  examples: [
    { input: { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 }, explanation: "5 and 1 are on different sides of the root, so the LCA is 3." },
    { input: { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 4 }, explanation: "4 is below 5, and a node is its own descendant, so the LCA is 5." },
    { input: { root: [1, 2], p: 1, q: 2 }, explanation: "The root is the LCA." },
  ],
  constraints: ["The number of nodes is in the range [2, 10^5].", "-10^9 <= Node.val <= 10^9", "All Node.val are unique.", "p != q, and both exist in the tree."],
  harness: {
    fn: "lowestCommonAncestor",
    adapter: "lca",
    params: { root: "TreeNode", p: "TreeNode", q: "TreeNode" },
    returns: "TreeNode",
    inputs: ["root", "p", "q"],
  },
  tests: [
    { root: [1, 2], p: 2, q: 1 },
    { root: [1, null, 2], p: 1, q: 2 },
    { root: [1, 2, 3], p: 2, q: 3 },
    { root: [1, 2, 3, 4, 5, 6, 7], p: 4, q: 5 },
    { root: [1, 2, 3, 4, 5, 6, 7], p: 4, q: 7 },
    { root: [1, 2, 3, 4, 5, 6, 7], p: 6, q: 3 },
    { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 7, q: 4 },
    { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 6, q: 4 },
    { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 0, q: 8 },
    { root: [-1, 0, 3, -2, 4, null, null, 8], p: 8, q: 4 },
    { root: [10, 20, null, 30, null, 40], p: 40, q: 20 },
    { root: [1000000000, -1000000000, 0], p: -1000000000, q: 0 },
    { root: big, p: vals[9999], q: vals[9000] },
    { root: big, p: vals[5], q: vals[8000] },
    { root: big, p: vals[7000], q: vals[7001] },
  ],
  answer: {
    approach: [
      "Recursively search both subtrees for p and q.",
      "If the current node is null, p or q, return it.",
      "Otherwise search left and right. If both searches return something, p and q are on different sides, so the current node is the LCA.",
      "If only one side returns something, pass that result up (both nodes are in that subtree, or it is the one found so far).",
    ],
    time: "O(n)",
    space: "O(h)",
    javascript: `function lowestCommonAncestor(root, p, q) {
    if (!root || root === p || root === q) return root;
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    if (left && right) return root;
    return left || right;
}`,
    python: `class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root or root is p or root is q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        if left and right:
            return root
        return left or right`,
  },
};
