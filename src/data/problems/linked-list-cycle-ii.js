import { ints } from "../gen.js";

const big = ints(10000, -100000, 100000, 2);

export default {
  slug: "linked-list-cycle-ii",
  description: `Given the \`head\` of a linked list, return the **node where the cycle begins**. If there is no cycle, return \`null\`.

Do not modify the list.

**How the input works:** \`head\` lists the node values and \`pos\` is the index the tail's \`next\` points to (\`-1\` for no cycle). Only \`head\` is passed to your function. The output is the **index** of the node you return (\`-1\` for \`null\`).`,
  examples: [
    { input: { head: [3, 2, 0, -4], pos: 1 }, explanation: "The tail connects back to index 1, so the cycle begins there." },
    { input: { head: [1, 2], pos: 0 }, explanation: "The cycle begins at the head (index 0)." },
    { input: { head: [1], pos: -1 }, explanation: "No cycle, so return null (shown as -1)." },
  ],
  constraints: ["The number of nodes is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5", "pos is -1 or a valid index."],
  followUp: "Can you solve it using O(1) memory?",
  harness: { fn: "detectCycle", adapter: "listCycleIndex", params: { head: "ListNode" }, returns: "ListNode", inputs: ["head", "pos"] },
  tests: [
    { head: [], pos: -1 },
    { head: [1], pos: 0 },
    { head: [1, 2], pos: 1 },
    { head: [1, 2], pos: -1 },
    { head: [1, 2, 3], pos: 0 },
    { head: [1, 2, 3, 4, 5], pos: 2 },
    { head: [1, 2, 3, 4, 5], pos: 4 },
    { head: [7, 7, 7, 7, 7, 7], pos: 3 },
    { head: [-1, -7, 7, -4, 19, 6, -9, -5, -2, -5], pos: 9 },
    { head: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], pos: 5 },
    { head: [1, 2, 3, 4], pos: -1 },
    { head: [2, 1], pos: 0 },
    { head: big, pos: 1234 },
    { head: big, pos: 0 },
    { head: big, pos: -1 },
  ],
  answer: {
    approach: [
      "First use Floyd's slow/fast pointers to detect a cycle. If fast hits null, return null.",
      "When they meet inside the cycle, start a new pointer at head and keep one at the meeting point.",
      "Move both one step at a time. They meet exactly at the node where the cycle begins.",
      "Why: if the cycle starts F steps from head, the meeting point is F steps (mod cycle length) before the cycle start.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function detectCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            let p = head;
            while (p !== slow) {
                p = p.next;
                slow = slow.next;
            }
            return p;
        }
    }
    return null;
}`,
    python: `class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                p = head
                while p is not slow:
                    p = p.next
                    slow = slow.next
                return p
        return None`,
  },
};
