import { chainTree, randomTree, range } from "../gen.js";

export default {
  slug: "serialize-and-deserialize-binary-tree",
  description: `**Serialization** turns a data structure into a string so it can be stored or sent somewhere, and **deserialization** rebuilds the structure from that string.

Design an algorithm to serialize a binary tree into a string and deserialize that string back into the **same** tree. You are free to choose any string format.

**How it is judged:** the judge runs \`deserialize(serialize(root))\` and checks that the rebuilt tree equals the original. In JavaScript write two functions, \`serialize\` and \`deserialize\`. In Python write a \`Codec\` class with those two methods.`,
  examples: [
    { input: { root: [1, 2, 3, null, null, 4, 5] }, explanation: "After a round trip the tree is unchanged." },
    { input: { root: [] }, explanation: "An empty tree must survive the round trip too." },
    { input: { root: [-1, 0, 1] }, explanation: "Negative values and zero must be kept." },
  ],
  constraints: ["The number of nodes is in the range [0, 10^4].", "-1000 <= Node.val <= 1000"],
  harness: { adapter: "codec", params: { root: "TreeNode" }, returns: "TreeNode", inputs: ["root"] },
  starter: {
    javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
function serialize(root) {

}

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
function deserialize(data) {

}
`,
    python: `# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.

        :type root: TreeNode
        :rtype: str
        """


    def deserialize(self, data):
        """Decodes your encoded data to tree.

        :type data: str
        :rtype: TreeNode
        """
        `,
  },
  tests: [
    { root: [1] },
    { root: [1, 2] },
    { root: [1, null, 2] },
    { root: [1, 2, 3, 4, 5, 6, 7] },
    { root: [0, 0, 0, null, 0] },
    { root: [1000, -1000] },
    { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1] },
    { root: [1, 2, null, 3, null, 4, null, 5] },
    { root: [4, -7, -3, null, null, -9, -3, 9, -7, -4, null, 6, null, -6, -6] },
    { root: [10, null, 20, 30] },
    { root: [-1, -2, -3, -4, -5] },
    { root: [3, 2, 4, 3] },
    { root: randomTree(10000, -1000, 1000, 16) },
    { root: chainTree(range(800), "r") },
  ],
  answer: {
    approach: [
      "Serialize with a preorder traversal, writing each value and a marker (like '#') for every null child, separated by commas.",
      "The null markers make the shape unambiguous, so preorder alone is enough to rebuild the tree.",
      "Deserialize by reading the tokens in the same preorder: take a token; if it is '#' return null, otherwise create a node and recursively build its left and then right child.",
      "Level-order (BFS) with null markers works just as well.",
    ],
    time: "O(n) for both",
    space: "O(n)",
    javascript: `function serialize(root) {
    const out = [];
    const walk = (node) => {
        if (!node) { out.push("#"); return; }
        out.push(node.val);
        walk(node.left);
        walk(node.right);
    };
    walk(root);
    return out.join(",");
}

function deserialize(data) {
    const tokens = data.split(",");
    let i = 0;
    const build = () => {
        const t = tokens[i++];
        if (t === "#") return null;
        const node = new TreeNode(Number(t));
        node.left = build();
        node.right = build();
        return node;
    };
    return build();
}`,
    python: `class Codec:
    def serialize(self, root):
        out = []

        def walk(node):
            if not node:
                out.append('#')
                return
            out.append(str(node.val))
            walk(node.left)
            walk(node.right)

        walk(root)
        return ','.join(out)

    def deserialize(self, data):
        tokens = iter(data.split(','))

        def build():
            t = next(tokens)
            if t == '#':
                return None
            node = TreeNode(int(t))
            node.left = build()
            node.right = build()
            return node

        return build()`,
  },
};
