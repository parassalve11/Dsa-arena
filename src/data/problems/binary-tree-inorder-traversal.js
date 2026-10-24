import { chainTree, randomTree, range } from "../gen.js";

export default {
  slug: "binary-tree-inorder-traversal",
  description: `Given the \`root\` of a binary tree, return the **inorder traversal** of its node values.

Inorder means: visit the left subtree, then the node itself, then the right subtree.`,
  examples: [
    { input: { root: [1, null, 2, 3] }, explanation: "1 has no left child, so visit 1, then its right subtree (3 then 2): [1,3,2]." },
    { input: { root: [] }, explanation: "An empty tree gives an empty list." },
    { input: { root: [1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9] }, explanation: "Result: [4,2,6,5,7,1,3,9,8]." },
  ],
  constraints: ["The number of nodes is in the range [0, 100] (tests go higher).", "-100 <= Node.val <= 100"],
  followUp: "The recursive solution is easy. Can you do it iteratively?",
  harness: { fn: "inorderTraversal", params: { root: "TreeNode" }, returns: "int[]" },
  tests: [
    { root: [1] },
    { root: [1, 2] },
    { root: [1, null, 2] },
    { root: [2, 1, 3] },
    { root: [1, 2, 3, 4, 5, 6, 7] },
    { root: [5, 3, 8, 1, 4, 7, 9] },
    { root: [-100, null, 100] },
    { root: [3, 1, null, null, 2] },
    { root: [1, 2, null, 3, null, 4] },
    { root: [0, 0, 0, 0, 0] },
    { root: [4, 2, 6, 1, 3, 5, 7] },
    { root: [10, 5, 15, null, null, 6, 20] },
    { root: randomTree(10000, -100, 100, 1) },
    { root: chainTree(range(800), "l") },
    { root: chainTree(range(800), "r") },
  ],
  answer: {
    approach: [
      "Iterative version with a stack: start at root and go as far left as possible, pushing each node.",
      "Pop a node, record its value, then move to its right child and repeat the 'go left' step.",
      "Stop when both the current pointer and the stack are empty.",
      "Recursive version: inorder(left), visit node, inorder(right).",
    ],
    time: "O(n)",
    space: "O(h), where h is the tree height",
    javascript: `function inorderTraversal(root) {
    const out = [], stack = [];
    let cur = root;
    while (cur || stack.length) {
        while (cur) {
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        out.push(cur.val);
        cur = cur.right;
    }
    return out;
}`,
    python: `class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out, stack, cur = [], [], root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            out.append(cur.val)
            cur = cur.right
        return out`,
  },
};
