import { balancedBST, range } from "../gen.js";

const bst = balancedBST(range(10000, 1).map((x) => x * 2));

export default {
  slug: "kth-smallest-element-in-a-bst",
  description: `Given the \`root\` of a binary search tree and an integer \`k\`, return the **\`k\`-th smallest value** (1-indexed) among all the node values.`,
  examples: [
    { input: { root: [3, 1, 4, null, 2], k: 1 }, explanation: "The values in order are 1, 2, 3, 4. The smallest is 1." },
    { input: { root: [5, 3, 6, 2, 4, null, null, 1], k: 3 }, explanation: "In order: 1, 2, 3, 4, 5, 6. The 3rd smallest is 3." },
    { input: { root: [2, 1, 3], k: 3 }, explanation: "The largest of three values." },
  ],
  constraints: ["The number of nodes is n.", "1 <= k <= n <= 10^4", "0 <= Node.val <= 10^4 (tests go higher)"],
  followUp: "If the BST is modified often (inserts and deletes) and you need the k-th smallest frequently, how would you optimise it?",
  harness: { fn: "kthSmallest", params: { root: "TreeNode", k: "int" }, returns: "int" },
  tests: [
    { root: [1], k: 1 },
    { root: [2, 1], k: 1 },
    { root: [2, 1], k: 2 },
    { root: [1, null, 2], k: 2 },
    { root: [5, 3, 6, 2, 4, null, null, 1], k: 6 },
    { root: [5, 3, 6, 2, 4, null, null, 1], k: 1 },
    { root: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15], k: 9 },
    { root: [10, 5, 15, 3, 7, 13, 18], k: 4 },
    { root: [4, 2, 6, 1, 3, 5, 7], k: 7 },
    { root: [3, 1, 4, null, 2], k: 4 },
    { root: [50, 30, 70, 20, 40, 60, 80], k: 5 },
    { root: [0, null, 10000], k: 2 },
    { root: bst, k: 1 },
    { root: bst, k: 10000 },
    { root: bst, k: 6789 },
  ],
  answer: {
    approach: [
      "An inorder traversal of a BST visits values in sorted order.",
      "Run an iterative inorder traversal with a stack and count the nodes as you pop them.",
      "When the count reaches k, return that node's value. You can stop early without visiting the rest.",
      "For the follow-up, store the size of each subtree in its node so you can steer left or right in O(h).",
    ],
    time: "O(h + k)",
    space: "O(h)",
    javascript: `function kthSmallest(root, k) {
    const stack = [];
    let cur = root;
    while (cur || stack.length) {
        while (cur) {
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        if (--k === 0) return cur.val;
        cur = cur.right;
    }
    return -1;
}`,
    python: `class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack, cur = [], root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            k -= 1
            if k == 0:
                return cur.val
            cur = cur.right
        return -1`,
  },
};
