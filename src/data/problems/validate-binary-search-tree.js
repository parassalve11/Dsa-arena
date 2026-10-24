import { balancedBST, range } from "../gen.js";

const bst = balancedBST(range(10000, -5000).map((x) => x * 3));
const broken = bst.slice();
broken[broken.length - 1] = broken[broken.length - 1] + 2000;

export default {
  slug: "validate-binary-search-tree",
  description: `Given the \`root\` of a binary tree, decide whether it is a **valid binary search tree** (BST).

A valid BST follows these rules:

- Every value in a node's **left** subtree is **strictly less** than the node's value.
- Every value in a node's **right** subtree is **strictly greater** than the node's value.
- Both subtrees are themselves valid BSTs.`,
  examples: [
    { input: { root: [2, 1, 3] }, explanation: "1 < 2 < 3." },
    { input: { root: [5, 1, 4, null, null, 3, 6] }, explanation: "4 is in the right subtree of 5 but is smaller than 5." },
    { input: { root: [5, 4, 6, null, null, 3, 7] }, explanation: "3 is in the right subtree of 5. It is fine for its parent 6, but it must also be greater than 5." },
  ],
  constraints: ["The number of nodes is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"],
  harness: { fn: "isValidBST", params: { root: "TreeNode" }, returns: "bool" },
  tests: [
    { root: [1] },
    { root: [1, 1] },
    { root: [2, 2, 2] },
    { root: [1, null, 1] },
    { root: [2, 1] },
    { root: [2, null, 1] },
    { root: [10, 5, 15, null, null, 6, 20] },
    { root: [3, 1, 5, 0, 2, 4, 6] },
    { root: [3, 1, 5, 0, 4, 2, 6] },
    { root: [-2147483648, null, 2147483647] },
    { root: [2147483647] },
    { root: [32, 26, 47, 19, null, null, 56, null, 27] },
    { root: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15] },
    { root: bst },
    { root: broken },
  ],
  answer: {
    approach: [
      "Checking each node only against its direct children is not enough: a node deep in the right subtree must still be greater than the root.",
      "Pass down a valid range (low, high). The root may be anything. Going left sets high = node.val; going right sets low = node.val.",
      "Each node must satisfy low < val < high, otherwise the tree is not a BST.",
      "Another way: an inorder traversal of a BST is strictly increasing.",
    ],
    time: "O(n)",
    space: "O(h)",
    javascript: `function isValidBST(root) {
    const check = (node, low, high) => {
        if (!node) return true;
        if (node.val <= low || node.val >= high) return false;
        return check(node.left, low, node.val) && check(node.right, node.val, high);
    };
    return check(root, -Infinity, Infinity);
}`,
    python: `class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def check(node, low, high):
            if not node:
                return True
            if not (low < node.val < high):
                return False
            return check(node.left, low, node.val) and check(node.right, node.val, high)
        return check(root, float('-inf'), float('inf'))`,
  },
};
