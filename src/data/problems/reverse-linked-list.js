import { ints } from "../gen.js";

export default {
  slug: "reverse-linked-list",
  description: `You are given the \`head\` of a singly linked list.

Reverse the list so that the last node becomes the first, and every \`next\` pointer points the other way. Return the **new head** of the reversed list.`,
  examples: [
    { input: { head: [1, 2, 3, 4, 5] }, explanation: "The list 1→2→3→4→5 becomes 5→4→3→2→1." },
    { input: { head: [1, 2] }, explanation: "Two nodes simply swap their order." },
    { input: { head: [] }, explanation: "An empty list stays empty." },
  ],
  constraints: ["The number of nodes in the list is in the range [0, 5000].", "-5000 <= Node.val <= 5000"],
  followUp: "A linked list can be reversed either iteratively or recursively. Can you write both?",
  harness: { fn: "reverseList", params: { head: "ListNode" }, returns: "ListNode" },
  tests: [
    { head: [1] },
    { head: [7, 7] },
    { head: [1, 2, 3] },
    { head: [-1, 0, 1] },
    { head: [5, 4, 3, 2, 1] },
    { head: [0, 0, 0, 1] },
    { head: [-5000, 5000] },
    { head: [3, 1, 4, 1, 5, 9, 2, 6] },
    { head: [10, 20, 30, 40, 50, 60] },
    { head: [2, 2, 1, 1] },
    { head: [9, 8] },
    { head: [100, -100, 100] },
    { head: ints(5000, -5000, 5000, 5) },
    { head: ints(4999, -5000, 5000, 9) },
  ],
  answer: {
    approach: [
      "Walk the list with two pointers: prev (starts as null) and cur (starts at head).",
      "At each node, save cur.next, point cur.next back to prev, then move prev and cur one step forward.",
      "When cur becomes null, prev is the old tail, which is the new head.",
      "Recursive version: reverse the rest of the list, then hook the current node onto its end.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function reverseList(head) {
    let prev = null;
    let cur = head;
    while (cur) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
    python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev, cur = None, head
        while cur:
            cur.next, prev, cur = prev, cur, cur.next
        return prev`,
  },
};
