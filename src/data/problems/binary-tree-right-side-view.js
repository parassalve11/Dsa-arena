import { chainTree, randomTree, range } from "../gen.js";

export default {
  slug: "binary-tree-right-side-view",
  description: `Imagine standing on the **right side** of a binary tree. Given its \`root\`, return the values of the nodes you can see, ordered from top to bottom.

On each level you see the **rightmost** node of that level.`,
  examples: [
    { input: { root: [1, 2, 3, null, 5, null, 4] }, explanation: "From the right you see 1, then 3, then 4." },
    { input: { root: [1, 2, 3, 4, null, null, null, 5] }, explanation: "The deepest node 5 is on the left, but nothing blocks it on its level: [1,3,4,5]." },
    { input: { root: [] }, explanation: "Nothing to see." },
  ],
  constraints: ["The number of nodes is in the range [0, 100] (tests go higher).", "-100 <= Node.val <= 100"],
  harness: { fn: "rightSideView", params: { root: "TreeNode" }, returns: "int[]" },
  tests: [
    { root: [1] },
    { root: [1, null, 3] },
    { root: [1, 2] },
    { root: [1, 2, 3] },
    { root: [1, 2, 3, 4] },
    { root: [1, 2, 3, 4, 5, 6, 7] },
    { root: [1, 2, 3, null, 5, 6] },
    { root: [5, 4, null, 3, null, 2] },
    { root: [0, -1, null, null, -2, -3] },
    { root: [1, 2, 3, 4, null, null, null, null, 5, 6] },
    { root: [10, 20, 30, 40, 50, null, 60, null, 70] },
    { root: [-100, 100] },
    { root: randomTree(10000, -100, 100, 10) },
    { root: chainTree(range(600), "l") },
  ],
  answer: {
    approach: [
      "Do a level-order BFS and take the last node of each level.",
      "Or do a DFS that visits the right child before the left, passing the depth.",
      "In the DFS, the first node reached at a new depth (when depth == result length) is the rightmost one, so append it.",
    ],
    time: "O(n)",
    space: "O(h) for the DFS",
    javascript: `function rightSideView(root) {
    const out = [];
    const dfs = (node, depth) => {
        if (!node) return;
        if (depth === out.length) out.push(node.val);
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    };
    dfs(root, 0);
    return out;
}`,
    python: `class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        out = []
        level = [root] if root else []
        while level:
            out.append(level[-1].val)
            level = [c for n in level for c in (n.left, n.right) if c]
        return out`,
  },
};
