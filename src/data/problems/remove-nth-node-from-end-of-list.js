import { ints } from "../gen.js";

const big = ints(10000, 0, 100, 1);

export default {
  slug: "remove-nth-node-from-end-of-list",
  description: `Given the \`head\` of a linked list, remove the \`n\`-th node **from the end** of the list and return the head of the changed list.`,
  examples: [
    { input: { head: [1, 2, 3, 4, 5], n: 2 }, explanation: "The 2nd node from the end is 4. Removing it gives [1,2,3,5]." },
    { input: { head: [1], n: 1 }, explanation: "Removing the only node leaves an empty list." },
    { input: { head: [1, 2], n: 1 }, explanation: "Remove the last node." },
  ],
  constraints: ["The number of nodes is sz, 1 <= sz <= 30 (tests go up to 10^4).", "0 <= Node.val <= 100", "1 <= n <= sz"],
  followUp: "Could you do it in one pass?",
  harness: { fn: "removeNthFromEnd", params: { head: "ListNode", n: "int" }, returns: "ListNode" },
  tests: [
    { head: [1, 2], n: 2 },
    { head: [1, 2, 3], n: 3 },
    { head: [1, 2, 3], n: 1 },
    { head: [1, 2, 3], n: 2 },
    { head: [5, 5, 5, 5], n: 4 },
    { head: [10, 20, 30, 40, 50, 60], n: 3 },
    { head: [0, 0], n: 1 },
    { head: [1, 2, 3, 4, 5, 6, 7, 8, 9], n: 9 },
    { head: [1, 2, 3, 4, 5, 6, 7, 8, 9], n: 1 },
    { head: [100, 99], n: 2 },
    { head: [7, 8, 9, 10], n: 2 },
    { head: [3, 1, 4, 1, 5], n: 4 },
    { head: big, n: 10000 },
    { head: big, n: 1 },
    { head: big, n: 4321 },
  ],
  answer: {
    approach: [
      "Put a dummy node before head, so removing the first node needs no special case.",
      "Move a fast pointer n + 1 steps ahead of a slow pointer (both start at dummy).",
      "Move both together until fast reaches null. Now slow sits just before the node to delete.",
      "Unlink it with slow.next = slow.next.next and return dummy.next.",
    ],
    time: "O(sz), one pass",
    space: "O(1)",
    javascript: `function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0, head);
    let fast = dummy, slow = dummy;
    for (let i = 0; i <= n; i++) fast = fast.next;
    while (fast) {
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}`,
    python: `class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n + 1):
            fast = fast.next
        while fast:
            fast, slow = fast.next, slow.next
        slow.next = slow.next.next
        return dummy.next`,
  },
};
