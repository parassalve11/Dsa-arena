import { randomTree } from "../gen.js";

const big = randomTree(2000, 1, 3, 6);

export default {
  slug: "subtree-of-another-tree",
  description: `Given the roots of two binary trees \`root\` and \`subRoot\`, return \`true\` if \`root\` contains a subtree with **exactly the same structure and values** as \`subRoot\`.

A subtree of a tree is a node of that tree together with **all** of its descendants. The tree itself also counts as one of its subtrees.`,
  examples: [
    { input: { root: [3, 4, 5, 1, 2], subRoot: [4, 1, 2] }, explanation: "The subtree rooted at 4 is exactly [4,1,2]." },
    { input: { root: [3, 4, 5, 1, 2, null, null, null, null, 0], subRoot: [4, 1, 2] }, explanation: "The node 4 has an extra 0 below 2, so it is not an exact match." },
    { input: { root: [1, 1], subRoot: [1] }, explanation: "The leaf 1 matches subRoot." },
  ],
  constraints: ["root has between 1 and 2000 nodes.", "subRoot has between 1 and 1000 nodes.", "-10^4 <= Node.val <= 10^4"],
  harness: { fn: "isSubtree", params: { root: "TreeNode", subRoot: "TreeNode" }, returns: "bool" },
  tests: [
    { root: [1], subRoot: [1] },
    { root: [1], subRoot: [2] },
    { root: [1, 2, 3], subRoot: [1, 2, 3] },
    { root: [1, 2, 3], subRoot: [1, 2] },
    { root: [1, 2, 3], subRoot: [3] },
    { root: [3, 4, 5, 1, null, 2], subRoot: [3, 1, 2] },
    { root: [1, null, 1, null, 1, null, 1, null, 1, null, 1, 2], subRoot: [1, null, 1, 2] },
    { root: [12], subRoot: [2] },
    { root: [2, 2, 2, 2, 2], subRoot: [2, 2] },
    { root: [4, 1, 2, 4, null, null, null, 1, 2], subRoot: [4, 1, 2] },
    { root: [-1, -4, 8, -6, -2, 3, 9], subRoot: [8, 3, 9] },
    { root: [5, 4, 6], subRoot: [4, null, 6] },
    { root: big, subRoot: [1, 2, 3] },
    { root: big, subRoot: [9, 9] },
    { root: big, subRoot: big },
  ],
  answer: {
    approach: [
      "Write sameTree(a, b), which checks two trees for exact equality (same shape and values).",
      "For every node of root, check whether the tree starting there is the same as subRoot.",
      "Recursively: isSubtree(root, sub) = sameTree(root, sub) || isSubtree(root.left, sub) || isSubtree(root.right, sub).",
      "An O(m + n) alternative serializes both trees and uses string matching (KMP).",
    ],
    time: "O(m · n) worst case",
    space: "O(h)",
    javascript: `function isSubtree(root, subRoot) {
    const same = (a, b) => {
        if (!a && !b) return true;
        if (!a || !b || a.val !== b.val) return false;
        return same(a.left, b.left) && same(a.right, b.right);
    };
    if (!root) return false;
    return same(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}`,
    python: `class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        def same(a, b):
            if not a and not b:
                return True
            if not a or not b or a.val != b.val:
                return False
            return same(a.left, b.left) and same(a.right, b.right)

        if not root:
            return False
        return same(root, subRoot) or self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)`,
  },
};
