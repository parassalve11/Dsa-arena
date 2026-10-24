import { ints } from "../gen.js";

export default {
  slug: "middle-of-the-linked-list",
  description: `Given the \`head\` of a singly linked list, return the **middle node**.

If there are two middle nodes (the list has an even length), return the **second** one.

The output shows the list starting from the node you return.`,
  examples: [
    { input: { head: [1, 2, 3, 4, 5] }, explanation: "The middle node is 3, so the output is the list from 3 onwards: [3,4,5]." },
    { input: { head: [1, 2, 3, 4, 5, 6] }, explanation: "The middle nodes are 3 and 4. Return the second one: [4,5,6]." },
    { input: { head: [1] }, explanation: "A single node is its own middle." },
  ],
  constraints: ["The number of nodes is in the range [1, 100] (tests go up to 10^4).", "1 <= Node.val <= 100"],
  harness: { fn: "middleNode", params: { head: "ListNode" }, returns: "ListNode" },
  tests: [
    { head: [1, 2] },
    { head: [1, 2, 3] },
    { head: [9, 9, 9, 9] },
    { head: [5, 4, 3, 2, 1] },
    { head: [1, 2, 3, 4, 5, 6, 7] },
    { head: [10, 20, 30, 40, 50, 60, 70, 80] },
    { head: [100] },
    { head: [3, 1] },
    { head: [2, 4, 6, 8, 10, 12, 14, 16, 18] },
    { head: [7, 1, 7, 1] },
    { head: [1, 1, 2, 2, 3, 3] },
    { head: [42, 17, 99] },
    { head: ints(10000, 1, 100, 1) },
    { head: ints(9999, 1, 100, 2) },
  ],
  answer: {
    approach: [
      "Use two pointers starting at head: slow moves one step, fast moves two.",
      "When fast reaches the end (fast is null or fast.next is null), slow has covered half the distance.",
      "For an even length this lands on the second middle node, which is exactly what is asked.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function middleNode(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
    python: `class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow`,
  },
};
