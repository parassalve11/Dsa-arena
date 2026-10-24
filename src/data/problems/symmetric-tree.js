import { randomTree, symmetricTree } from "../gen.js";

const big = symmetricTree(randomTree(5000, -100, 100, 4));
const bigBroken = big.slice();
bigBroken[bigBroken.length - 1] = bigBroken[bigBroken.length - 1] === 100 ? 99 : bigBroken[bigBroken.length - 1] + 1;

export default {
  slug: "symmetric-tree",
  description: `Given the \`root\` of a binary tree, check whether it is a **mirror of itself**, meaning it is symmetric around its centre.`,
  examples: [
    { input: { root: [1, 2, 2, 3, 4, 4, 3] }, explanation: "The left subtree is the mirror image of the right subtree." },
    { input: { root: [1, 2, 2, null, 3, null, 3] }, explanation: "Both 3s are right children, so the sides are not mirrors." },
    { input: { root: [1] }, explanation: "A single node is symmetric." },
  ],
  constraints: ["The number of nodes is in the range [1, 1000] (tests go higher).", "-100 <= Node.val <= 100"],
  followUp: "Could you solve it both recursively and iteratively?",
  harness: { fn: "isSymmetric", params: { root: "TreeNode" }, returns: "bool" },
  tests: [
    { root: [1, 2] },
    { root: [1, 2, 2] },
    { root: [1, 2, 3] },
    { root: [1, 2, 2, 2, null, 2] },
    { root: [1, 2, 2, null, 3, 3] },
    { root: [5, 4, 4, 3, null, null, 3] },
    { root: [0, -1, -1, 2, null, null, 2] },
    { root: [9, -42, -42, null, 76, 76, null, null, 13, null, 13] },
    { root: [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 8, 7, 6, 5] },
    { root: [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 8, 7, 5, 6] },
    { root: [2, 3, 3, 4, 5, 5] },
    { root: [7, 7, 7, 7, 7, 7, 7] },
    { root: big },
    { root: bigBroken },
  ],
  answer: {
    approach: [
      "A tree is symmetric when its left subtree is a mirror of its right subtree.",
      "Two trees a and b are mirrors if both are null, or both exist with a.val == b.val and a.left mirrors b.right and a.right mirrors b.left.",
      "Check isMirror(root.left, root.right).",
      "Iteratively, push pairs (a, b) onto a queue and check them the same way.",
    ],
    time: "O(n)",
    space: "O(h)",
    javascript: `function isSymmetric(root) {
    const mirror = (a, b) => {
        if (!a && !b) return true;
        if (!a || !b || a.val !== b.val) return false;
        return mirror(a.left, b.right) && mirror(a.right, b.left);
    };
    return mirror(root.left, root.right);
}`,
    python: `class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def mirror(a, b):
            if not a and not b:
                return True
            if not a or not b or a.val != b.val:
                return False
            return mirror(a.left, b.right) and mirror(a.right, b.left)
        return mirror(root.left, root.right)`,
  },
};
