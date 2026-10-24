import { rng, randInt } from "../gen.js";

function big(n, seed) {
  const r = rng(seed);
  return { head: Array.from({ length: n }, () => [randInt(r, -10000, 10000), r() < 0.2 ? null : randInt(r, 0, n - 1)]) };
}

export default {
  slug: "copy-list-with-random-pointer",
  description: `A linked list of length \`n\` is given where each node has a \`next\` pointer and an extra **\`random\` pointer**, which can point to any node in the list or be \`null\`.

Build a **deep copy** of the list: \`n\` brand-new nodes, where each new node has the same value as its original, and the new \`next\` and \`random\` pointers point to **new** nodes so the copy has the same shape. **No pointer in the copy may point to a node of the original list.**

Return the head of the copied list.

**How the input works:** each node is written as \`[val, random_index]\`, where \`random_index\` is the index of the node \`random\` points to, or \`null\`. The output uses the same format.`,
  examples: [
    { input: { head: [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]] }, explanation: "Each copied node points (via random) to the copy of the matching node." },
    { input: { head: [[1, 1], [2, 1]] }, explanation: "Both random pointers go to the second node." },
    { input: { head: [[3, null], [3, 0], [3, null]] }, explanation: "Equal values are fine. The copy must have the same structure." },
  ],
  constraints: ["0 <= n <= 1000 (tests go up to 10^4)", "-10^4 <= Node.val <= 10^4", "random is null or points to a node in the list."],
  harness: { fn: "copyRandomList", adapter: "randomList", params: { head: "Node" }, returns: "Node" },
  starter: {
    javascript: `/**
 * // Definition for a _Node.
 * function _Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {_Node} head
 * @return {_Node}
 */
function copyRandomList(head) {

}
`,
    python: `"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""

class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        `,
  },
  tests: [
    { head: [] },
    { head: [[1, null]] },
    { head: [[1, 0]] },
    { head: [[-1, null], [-2, null]] },
    { head: [[5, 1], [6, 0]] },
    { head: [[1, 2], [2, 2], [3, 2]] },
    { head: [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]] },
    { head: [[10000, null], [-10000, 0], [0, 1]] },
    { head: [[7, 0], [7, 1], [7, 2], [7, 3]] },
    { head: [[1, null], [2, null], [3, null], [4, null]] },
    { head: [[9, 3], [8, null], [7, 0], [6, 1], [5, 4]] },
    { head: [[2, 1], [3, 0], [4, 5], [5, 4], [6, 3], [7, 2]] },
    big(10000, 1),
    big(5000, 2),
  ],
  answer: {
    approach: [
      "Walk the original list and create a copy of every node, storing original → copy in a hash map.",
      "Walk it a second time and wire up the copies: copy.next = map(orig.next) and copy.random = map(orig.random).",
      "Return map(head).",
      "O(1) extra space version: interleave copies right after their originals, set randoms with orig.random.next, then unweave the two lists.",
    ],
    time: "O(n)",
    space: "O(n) for the map (O(1) with the interleaving trick)",
    javascript: `function copyRandomList(head) {
    const map = new Map([[null, null]]);
    for (let cur = head; cur; cur = cur.next) map.set(cur, new _Node(cur.val, null, null));
    for (let cur = head; cur; cur = cur.next) {
        const copy = map.get(cur);
        copy.next = map.get(cur.next);
        copy.random = map.get(cur.random);
    }
    return map.get(head);
}`,
    python: `class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        copies = {None: None}
        cur = head
        while cur:
            copies[cur] = Node(cur.val)
            cur = cur.next
        cur = head
        while cur:
            copies[cur].next = copies[cur.next]
            copies[cur].random = copies[cur.random]
            cur = cur.next
        return copies[head]`,
  },
};
