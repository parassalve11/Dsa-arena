import { ints } from "../gen.js";

export default {
  slug: "reorder-list",
  description: `You are given the head of a singly linked list: L0 → L1 → … → Ln-1 → Ln.

Reorder it in place to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …

You may not change the values in the nodes; only the links may change. The function returns nothing. The judge reads the list from \`head\` after your function runs.`,
  examples: [
    { input: { head: [1, 2, 3, 4] }, explanation: "1 → 4 → 2 → 3." },
    { input: { head: [1, 2, 3, 4, 5] }, explanation: "1 → 5 → 2 → 4 → 3." },
    { input: { head: [1] }, explanation: "One node stays as it is." },
  ],
  constraints: ["The number of nodes is in the range [1, 5 * 10^4].", "1 <= Node.val <= 1000"],
  harness: { fn: "reorderList", params: { head: "ListNode" }, inplace: "head" },
  tests: [
    { head: [1, 2] },
    { head: [1, 2, 3] },
    { head: [5, 5, 5, 5] },
    { head: [1, 2, 3, 4, 5, 6] },
    { head: [1, 2, 3, 4, 5, 6, 7] },
    { head: [10, 20] },
    { head: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
    { head: [1000, 1, 1000, 1] },
    { head: [2, 4, 6, 8, 10, 12, 14, 16] },
    { head: [3, 1, 4] },
    { head: [1, 1, 2, 2, 3, 3, 4] },
    { head: [7, 3, 9, 1, 5] },
    { head: ints(50000, 1, 1000, 1) },
    { head: ints(49999, 1, 1000, 2) },
  ],
  answer: {
    approach: [
      "Find the middle of the list with slow and fast pointers, and cut the list into two halves.",
      "Reverse the second half.",
      "Merge the two halves by alternating nodes: one from the first half, then one from the reversed second half.",
      "All three steps are O(n) and use no extra memory.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function reorderList(head) {
    let slow = head, fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    let second = slow.next;
    slow.next = null;
    let prev = null;
    while (second) {
        const next = second.next;
        second.next = prev;
        prev = second;
        second = next;
    }
    let first = head;
    second = prev;
    while (second) {
        const n1 = first.next, n2 = second.next;
        first.next = second;
        second.next = n1;
        first = n1;
        second = n2;
    }
}`,
    python: `class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        slow = fast = head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next
        second, slow.next = slow.next, None
        prev = None
        while second:
            second.next, prev, second = prev, second, second.next
        first, second = head, prev
        while second:
            n1, n2 = first.next, second.next
            first.next = second
            second.next = n1
            first, second = n1, n2`,
  },
};
