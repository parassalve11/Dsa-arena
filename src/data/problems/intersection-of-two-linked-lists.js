import { ints } from "../gen.js";

const a = ints(20000, 1, 100000, 1);
const b = [...ints(7000, 1, 100000, 2), ...a.slice(15000)];

export default {
  slug: "intersection-of-two-linked-lists",
  description: `Given the heads of two singly linked lists \`headA\` and \`headB\`, return the **node where the two lists join**. If they never join, return \`null\`.

"Joining" means the lists **share the same node object** from that point on, not just equal values. The lists contain no cycles, and you must not change their structure.

**How the input works:** \`listA\` and \`listB\` are the values of each list. \`skipA\` and \`skipB\` say how many nodes come before the shared part in each list, and \`intersectVal\` is the value of the first shared node (\`0\` if they don't join). Your function only receives \`headA\` and \`headB\`. The output is the value of the node you return, or \`null\`.`,
  examples: [
    { input: { intersectVal: 8, listA: [4, 1, 8, 4, 5], listB: [5, 6, 1, 8, 4, 5], skipA: 2, skipB: 3 }, explanation: "The lists share the nodes 8 → 4 → 5. Note the two 1s are different nodes." },
    { input: { intersectVal: 2, listA: [1, 9, 1, 2, 4], listB: [3, 2, 4], skipA: 3, skipB: 1 }, explanation: "They join at the node with value 2." },
    { input: { intersectVal: 0, listA: [2, 6, 4], listB: [1, 5], skipA: 3, skipB: 2 }, explanation: "The lists never join, so return null." },
  ],
  constraints: ["The lists have m and n nodes, 1 <= m, n <= 3 * 10^4.", "1 <= Node.val <= 10^5", "0 <= skipA <= m, 0 <= skipB <= n"],
  followUp: "Can you do it in O(m + n) time with O(1) memory?",
  harness: {
    fn: "getIntersectionNode",
    adapter: "intersection",
    params: { headA: "ListNode", headB: "ListNode" },
    returns: "ListNode",
    inputs: ["intersectVal", "listA", "listB", "skipA", "skipB"],
  },
  tests: [
    { intersectVal: 1, listA: [1], listB: [1], skipA: 0, skipB: 0 },
    { intersectVal: 0, listA: [1], listB: [1], skipA: 1, skipB: 1 },
    { intersectVal: 3, listA: [3], listB: [2, 3], skipA: 0, skipB: 1 },
    { intersectVal: 7, listA: [1, 2, 7], listB: [7], skipA: 2, skipB: 0 },
    { intersectVal: 5, listA: [1, 2, 3, 4, 5], listB: [5], skipA: 4, skipB: 0 },
    { intersectVal: 0, listA: [1, 2, 3], listB: [4, 5, 6], skipA: 3, skipB: 3 },
    { intersectVal: 9, listA: [9, 8, 7], listB: [1, 1, 1, 1, 9, 8, 7], skipA: 0, skipB: 4 },
    { intersectVal: 4, listA: [2, 2, 4, 4], listB: [2, 2, 4, 4], skipA: 2, skipB: 2 },
    { intersectVal: 6, listA: [10, 6], listB: [20, 30, 40, 6], skipA: 1, skipB: 3 },
    { intersectVal: 0, listA: [2, 4, 6, 8], listB: [2, 4, 6, 8], skipA: 4, skipB: 4 },
    { intersectVal: 3, listA: [1, 3, 5, 7, 9], listB: [3, 5, 7, 9], skipA: 1, skipB: 0 },
    { intersectVal: 1, listA: [5, 1, 2], listB: [9, 9, 9, 9, 9, 1, 2], skipA: 1, skipB: 5 },
    { intersectVal: a[15000], listA: a, listB: b, skipA: 15000, skipB: 7000 },
    { intersectVal: 0, listA: a, listB: b, skipA: 20000, skipB: 12000 },
  ],
  answer: {
    approach: [
      "Walk pointer pA through list A and then through list B; walk pB through B and then through A.",
      "Both pointers travel the same total distance (m + n), so they line up and meet at the first shared node.",
      "If the lists never join, both reach null at the same time, and null is returned.",
      "This uses O(1) memory, unlike storing all nodes of one list in a set.",
    ],
    time: "O(m + n)",
    space: "O(1)",
    javascript: `function getIntersectionNode(headA, headB) {
    let a = headA, b = headB;
    while (a !== b) {
        a = a ? a.next : headB;
        b = b ? b.next : headA;
    }
    return a;
}`,
    python: `class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        a, b = headA, headB
        while a is not b:
            a = a.next if a else headB
            b = b.next if b else headA
        return a`,
  },
};
