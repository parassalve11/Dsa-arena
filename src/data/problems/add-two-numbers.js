import { ints } from "../gen.js";

export default {
  slug: "add-two-numbers",
  description: `You are given two non-empty linked lists that represent two non-negative integers. The digits are stored in **reverse order** (the ones digit first), and each node holds a single digit.

Add the two numbers and return the sum as a linked list in the same reverse-order format.

Neither number has leading zeros, except the number 0 itself.`,
  examples: [
    { input: { l1: [2, 4, 3], l2: [5, 6, 4] }, explanation: "342 + 465 = 807, stored as [7,0,8]." },
    { input: { l1: [0], l2: [0] }, explanation: "0 + 0 = 0." },
    { input: { l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9] }, explanation: "9999999 + 9999 = 10009998, stored as [8,9,9,9,0,0,0,1]." },
  ],
  constraints: ["Each list has between 1 and 100 nodes (tests go higher).", "0 <= Node.val <= 9", "No leading zeros, except the number 0."],
  harness: { fn: "addTwoNumbers", params: { l1: "ListNode", l2: "ListNode" }, returns: "ListNode" },
  tests: [
    { l1: [1], l2: [9] },
    { l1: [5], l2: [5] },
    { l1: [9], l2: [1, 9, 9] },
    { l1: [1, 8], l2: [0] },
    { l1: [0], l2: [7, 3] },
    { l1: [9, 9], l2: [9, 9] },
    { l1: [2, 4, 9], l2: [5, 6, 4, 9] },
    { l1: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], l2: [5, 6, 4] },
    { l1: [3, 2, 1], l2: [6, 7, 8] },
    { l1: [0, 1], l2: [0, 1] },
    { l1: [8, 9, 9, 9], l2: [2] },
    { l1: [4], l2: [5] },
    { l1: [...ints(3000, 0, 9, 1), 9], l2: [...ints(2999, 0, 9, 2), 8] },
    { l1: new Array(3000).fill(9), l2: [1] },
  ],
  answer: {
    approach: [
      "Walk both lists at the same time, like adding numbers by hand from the ones digit.",
      "At each step add the two digits (0 if a list has ended) plus the carry.",
      "Create a node with sum % 10 and carry floor(sum / 10) to the next step.",
      "Continue while either list has nodes or the carry is non-zero, so a final carry becomes a new node.",
    ],
    time: "O(max(m, n))",
    space: "O(max(m, n)) for the result",
    javascript: `function addTwoNumbers(l1, l2) {
    const dummy = new ListNode(0);
    let tail = dummy, carry = 0;
    while (l1 || l2 || carry) {
        const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
        carry = Math.floor(sum / 10);
        tail.next = new ListNode(sum % 10);
        tail = tail.next;
        l1 = l1 && l1.next;
        l2 = l2 && l2.next;
    }
    return dummy.next;
}`,
    python: `class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = tail = ListNode(0)
        carry = 0
        while l1 or l2 or carry:
            s = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
            carry, digit = divmod(s, 10)
            tail.next = ListNode(digit)
            tail = tail.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next`,
  },
};
