import { ints } from "../gen.js";

const big = ints(10000, -100000, 100000, 1);

export default {
  slug: "linked-list-cycle",
  description: `Given \`head\`, the head of a linked list, decide whether the list has a **cycle**: some node whose \`next\` pointer leads back to an earlier node, so following \`next\` would loop forever.

Return \`true\` if there is a cycle, otherwise \`false\`.

**How the input works:** \`head\` lists the node values, and \`pos\` is the index of the node that the tail's \`next\` points to (\`-1\` means no cycle). \`pos\` is **not** passed to your function; only \`head\` is.`,
  examples: [
    { input: { head: [3, 2, 0, -4], pos: 1 }, explanation: "The tail (-4) points back to the node at index 1 (value 2)." },
    { input: { head: [1, 2], pos: 0 }, explanation: "The tail points back to the head." },
    { input: { head: [1], pos: -1 }, explanation: "There is no cycle." },
  ],
  constraints: ["The number of nodes is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5", "pos is -1 or a valid index."],
  followUp: "Can you solve it with O(1) memory?",
  harness: { fn: "hasCycle", adapter: "listCycle", params: { head: "ListNode" }, returns: "bool", inputs: ["head", "pos"] },
  tests: [
    { head: [], pos: -1 },
    { head: [1], pos: 0 },
    { head: [1, 2], pos: -1 },
    { head: [1, 2], pos: 1 },
    { head: [1, 2, 3], pos: -1 },
    { head: [1, 2, 3], pos: 2 },
    { head: [1, 2, 3, 4, 5], pos: 0 },
    { head: [5, 5, 5, 5], pos: -1 },
    { head: [5, 5, 5, 5], pos: 2 },
    { head: [-1, -7, 7, -4, 19, 6, -9, -5, -2, -5], pos: 6 },
    { head: [0, 0], pos: 0 },
    { head: [1, 2, 3, 4, 5, 6, 7, 8], pos: 7 },
    { head: big, pos: -1 },
    { head: big, pos: 0 },
    { head: big, pos: 9999 },
  ],
  answer: {
    approach: [
      "Use Floyd's tortoise and hare: a slow pointer moves one step at a time, a fast pointer moves two.",
      "If there is no cycle, the fast pointer reaches the end (null).",
      "If there is a cycle, the fast pointer eventually laps the slow one inside the loop and they land on the same node.",
      "This uses O(1) memory, unlike storing visited nodes in a set.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}`,
    python: `class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False`,
  },
};
