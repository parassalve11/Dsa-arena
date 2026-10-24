import { uniqueTree } from "../gen.js";

const big = uniqueTree(500, 14);
const vals = big.filter((v) => v !== null);

export default {
  slug: "all-nodes-distance-k-in-binary-tree",
  description: `Given the \`root\` of a binary tree, a \`target\` node and an integer \`k\`, return the values of **all nodes that are exactly \`k\` edges away** from the target. Paths may go up through parents as well as down through children.

Return the values in **any order**.

**How the input works:** \`target\` is given as a value; the judge passes the matching **node** to your function. All values are unique.`,
  examples: [
    { input: { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], target: 5, k: 2 }, explanation: "Two edges from 5: down to 7 and 4, and up through 3 to 1." },
    { input: { root: [1], target: 1, k: 3 }, explanation: "No node is 3 edges away." },
    { input: { root: [0, 1, null, 3, 2], target: 2, k: 1 }, explanation: "2's only neighbour is its parent 1." },
  ],
  constraints: ["The number of nodes is in the range [1, 500].", "0 <= Node.val <= 500", "All values are unique.", "target is a node in the tree.", "0 <= k <= 1000"],
  harness: {
    fn: "distanceK",
    adapter: "distanceK",
    params: { root: "TreeNode", target: "TreeNode", k: "int" },
    returns: "int[]",
    inputs: ["root", "target", "k"],
    compare: "unordered",
  },
  tests: [
    { root: [1], target: 1, k: 0 },
    { root: [1, 2], target: 2, k: 1 },
    { root: [1, 2, 3], target: 2, k: 2 },
    { root: [1, 2, 3, 4, 5, 6, 7], target: 1, k: 2 },
    { root: [1, 2, 3, 4, 5, 6, 7], target: 4, k: 3 },
    { root: [1, 2, 3, 4, 5, 6, 7], target: 4, k: 4 },
    { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], target: 3, k: 0 },
    { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], target: 7, k: 3 },
    { root: [0, 2, 1, null, null, 3], target: 3, k: 3 },
    { root: [0, 1, null, null, 2, null, 3, null, 4], target: 3, k: 0 },
    { root: [0, 1, null, null, 2, null, 3, null, 4], target: 0, k: 4 },
    { root: [5, 4, 8, 11, null, 13, 9, 7, 2], target: 8, k: 1000 },
    { root: big, target: vals[0], k: 4 },
    { root: big, target: vals[499], k: 6 },
    { root: big, target: vals[250], k: 3 },
  ],
  answer: {
    approach: [
      "A tree only has child pointers, so first record each node's parent with a DFS. Now the tree is an undirected graph.",
      "Run a BFS from the target, moving to left child, right child and parent, and marking nodes as visited.",
      "After k levels of BFS, the nodes in the queue are exactly the ones k edges away.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function distanceK(root, target, k) {
    const parent = new Map();
    const stack = [root];
    while (stack.length) {
        const n = stack.pop();
        for (const c of [n.left, n.right]) {
            if (c) { parent.set(c, n); stack.push(c); }
        }
    }
    let level = [target];
    const seen = new Set([target]);
    for (let d = 0; d < k && level.length; d++) {
        const next = [];
        for (const n of level) {
            for (const nb of [n.left, n.right, parent.get(n)]) {
                if (nb && !seen.has(nb)) { seen.add(nb); next.push(nb); }
            }
        }
        level = next;
    }
    return level.map((n) => n.val);
}`,
    python: `class Solution:
    def distanceK(self, root: TreeNode, target: TreeNode, k: int) -> List[int]:
        parent = {}
        stack = [root]
        while stack:
            n = stack.pop()
            for c in (n.left, n.right):
                if c:
                    parent[c] = n
                    stack.append(c)
        level = [target]
        seen = {target}
        for _ in range(k):
            nxt = []
            for n in level:
                for nb in (n.left, n.right, parent.get(n)):
                    if nb and nb not in seen:
                        seen.add(nb)
                        nxt.append(nb)
            level = nxt
        return [n.val for n in level]`,
  },
};
