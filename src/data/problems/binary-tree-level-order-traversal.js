import { chainTree, randomTree, range } from "../gen.js";

export default {
  slug: "binary-tree-level-order-traversal",
  description: `Given the \`root\` of a binary tree, return the **level order traversal** of its values: level by level from top to bottom, and left to right inside each level.

Return one list per level.`,
  examples: [
    { input: { root: [3, 9, 20, null, null, 15, 7] }, explanation: "Level 0: [3]. Level 1: [9,20]. Level 2: [15,7]." },
    { input: { root: [1] }, explanation: "A single level." },
    { input: { root: [] }, explanation: "No levels at all." },
  ],
  constraints: ["The number of nodes is in the range [0, 2000] (tests go higher).", "-1000 <= Node.val <= 1000"],
  harness: { fn: "levelOrder", params: { root: "TreeNode" }, returns: "int[][]" },
  tests: [
    { root: [1, 2] },
    { root: [1, null, 2] },
    { root: [1, 2, 3, 4, 5, 6, 7] },
    { root: [1, 2, 3, 4, null, null, 5] },
    { root: [1, 2, null, 3, null, 4, null, 5] },
    { root: [0, -1, 1] },
    { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1] },
    { root: [1, 2, 3, null, 4, 5] },
    { root: [1000, -1000] },
    { root: [7, 7, 7, 7, 7, 7, 7, 7] },
    { root: [2, null, 3, null, 4, null, 5, null, 6] },
    { root: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
    { root: randomTree(10000, -1000, 1000, 7) },
    { root: chainTree(range(600), "r") },
  ],
  answer: {
    approach: [
      "Do a breadth-first search with a queue, starting from root.",
      "At the start of each level, the queue holds exactly that level's nodes. Note how many there are.",
      "Pop that many nodes, record their values in a list, and push their children.",
      "Add the list to the result and repeat until the queue is empty.",
    ],
    time: "O(n)",
    space: "O(w), where w is the widest level",
    javascript: `function levelOrder(root) {
    const out = [];
    let level = root ? [root] : [];
    while (level.length) {
        out.push(level.map((n) => n.val));
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
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        out = []
        q = deque([root] if root else [])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            out.append(level)
        return out`,
  },
};
