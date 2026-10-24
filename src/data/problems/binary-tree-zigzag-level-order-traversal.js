import { randomTree } from "../gen.js";

export default {
  slug: "binary-tree-zigzag-level-order-traversal",
  description: `Given the \`root\` of a binary tree, return the **zigzag level order traversal** of its values.

Read the first level from left to right, the next level from right to left, the one after that left to right again, and so on.`,
  examples: [
    { input: { root: [3, 9, 20, null, null, 15, 7] }, explanation: "[3], then [20,9] (right to left), then [15,7]." },
    { input: { root: [1] }, explanation: "A single level." },
    { input: { root: [] }, explanation: "No levels." },
  ],
  constraints: ["The number of nodes is in the range [0, 2000] (tests go higher).", "-100 <= Node.val <= 100"],
  harness: { fn: "zigzagLevelOrder", params: { root: "TreeNode" }, returns: "int[][]" },
  tests: [
    { root: [1, 2] },
    { root: [1, 2, 3] },
    { root: [1, 2, 3, 4, 5, 6, 7] },
    { root: [1, 2, 3, 4, null, null, 5] },
    { root: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
    { root: [0, 2, 4, 1, null, 3, -1, 5, 1, null, 6, null, 8] },
    { root: [1, null, 2, null, 3, null, 4] },
    { root: [-100, 100, -100] },
    { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1] },
    { root: [1, 2, null, 3, 4, null, null, 5, 6] },
    { root: [9, 9, 9, 9] },
    { root: [3, 1, 4, null, 2] },
    { root: randomTree(10000, -100, 100, 8) },
    { root: randomTree(3000, -100, 100, 9) },
  ],
  answer: {
    approach: [
      "Do a normal level-order BFS, collecting each level's values left to right.",
      "Keep a flag for the direction. On every other level, reverse the collected values before adding them.",
      "Flip the flag after each level.",
    ],
    time: "O(n)",
    space: "O(w)",
    javascript: `function zigzagLevelOrder(root) {
    const out = [];
    let level = root ? [root] : [];
    let leftToRight = true;
    while (level.length) {
        const vals = level.map((n) => n.val);
        out.push(leftToRight ? vals : vals.reverse());
        leftToRight = !leftToRight;
        const next = [];
        for (const n of level) {
            if (n.left) next.push(n.left);
            if (n.right) next.push(n.right);
        }
        level = next;
    }
    return out;
}`,
    python: `class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        out = []
        level = [root] if root else []
        left_to_right = True
        while level:
            vals = [n.val for n in level]
            out.append(vals if left_to_right else vals[::-1])
            left_to_right = not left_to_right
            level = [c for n in level for c in (n.left, n.right) if c]
        return out`,
  },
};
