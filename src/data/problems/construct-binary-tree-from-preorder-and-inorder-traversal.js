import { inorderOf, preorderOf, uniqueTree, chainTree, range } from "../gen.js";

function fromTree(arr) {
  return { preorder: preorderOf(arr), inorder: inorderOf(arr) };
}

export default {
  slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
  description: `You are given two integer arrays \`preorder\` and \`inorder\`. \`preorder\` is the preorder traversal of a binary tree (node, left, right) and \`inorder\` is the inorder traversal of the same tree (left, node, right).

Rebuild the tree and return its root. All values are unique.`,
  examples: [
    { input: { preorder: [3, 9, 20, 15, 7], inorder: [9, 3, 15, 20, 7] }, explanation: "3 is the root (first in preorder). In inorder, 9 is to its left and 15,20,7 to its right." },
    { input: { preorder: [-1], inorder: [-1] }, explanation: "A single node." },
    { input: { preorder: [1, 2], inorder: [2, 1] }, explanation: "2 comes before 1 in inorder, so it is the left child." },
  ],
  constraints: ["1 <= preorder.length <= 3000", "inorder.length == preorder.length", "-3000 <= values <= 3000", "All values are unique.", "The arrays come from the same valid tree."],
  harness: { fn: "buildTree", params: { preorder: "int[]", inorder: "int[]" }, returns: "TreeNode" },
  tests: [
    { preorder: [1, 2], inorder: [1, 2] },
    { preorder: [1, 2, 3], inorder: [2, 1, 3] },
    { preorder: [1, 2, 3], inorder: [3, 2, 1] },
    { preorder: [1, 2, 3], inorder: [1, 2, 3] },
    fromTree([1, 2, 3, 4, 5, 6, 7]),
    fromTree([3, 9, 20, null, null, 15, 7, 1, 2]),
    fromTree([5, 4, 8, 11, null, 13, 6, 7, 2, null, null, null, 1]),
    fromTree([0, -1, 1, -2, null, null, 2]),
    fromTree([10, 20, null, 30, null, 40, null, 50]),
    fromTree([10, null, 20, null, 30, null, 40]),
    fromTree([3000, -3000]),
    fromTree([4, 2, 6, 1, 3, 5, 7]),
    fromTree(uniqueTree(3000, 12, -1500)),
    fromTree(chainTree(range(900), "l")),
    fromTree(uniqueTree(1000, 13)),
  ],
  answer: {
    approach: [
      "The first value in preorder is always the root of the current subtree.",
      "Find that value's position in inorder. Everything to its left in inorder is the left subtree, everything to its right is the right subtree.",
      "Keep an index into preorder: build the root, then recursively build the left subtree, then the right subtree (the same order as preorder).",
      "Store inorder positions in a hash map so each lookup is O(1).",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function buildTree(preorder, inorder) {
    const pos = new Map(inorder.map((v, i) => [v, i]));
    let p = 0;
    const build = (lo, hi) => {
        if (lo > hi) return null;
        const val = preorder[p++];
        const node = new TreeNode(val);
        const mid = pos.get(val);
        node.left = build(lo, mid - 1);
        node.right = build(mid + 1, hi);
        return node;
    };
    return build(0, inorder.length - 1);
}`,
    python: `class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        pos = {v: i for i, v in enumerate(inorder)}
        it = iter(preorder)

        def build(lo, hi):
            if lo > hi:
                return None
            val = next(it)
            node = TreeNode(val)
            mid = pos[val]
            node.left = build(lo, mid - 1)
            node.right = build(mid + 1, hi)
            return node

        return build(0, len(inorder) - 1)`,
  },
};
