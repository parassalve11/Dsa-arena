import { ints } from "../gen.js";

const half = ints(50000, 0, 9, 1);
const pal = [...half, ...half.slice().reverse()];
const notPal = pal.slice();
notPal[30000] = (notPal[30000] + 1) % 10;

export default {
  slug: "palindrome-linked-list",
  description: `Given the \`head\` of a singly linked list, return \`true\` if the values read the same forwards and backwards (a **palindrome**), or \`false\` otherwise.`,
  examples: [
    { input: { head: [1, 2, 2, 1] }, explanation: "1,2,2,1 reads the same in both directions." },
    { input: { head: [1, 2] }, explanation: "1,2 reversed is 2,1." },
    { input: { head: [1, 2, 3, 2, 1] }, explanation: "An odd-length palindrome." },
  ],
  constraints: ["The number of nodes is in the range [1, 10^5].", "0 <= Node.val <= 9"],
  followUp: "Can you do it in O(n) time and O(1) space?",
  harness: { fn: "isPalindrome", params: { head: "ListNode" }, returns: "bool" },
  tests: [
    { head: [1] },
    { head: [1, 1] },
    { head: [1, 0, 1] },
    { head: [1, 0, 0] },
    { head: [1, 2, 3, 3, 2, 1] },
    { head: [1, 2, 3, 4, 2, 1] },
    { head: [9, 9, 9, 9, 9] },
    { head: [1, 1, 2, 1] },
    { head: [0, 0] },
    { head: [3, 4, 5, 4, 3] },
    { head: [1, 2, 1, 2] },
    { head: [8, 0, 8, 0, 8] },
    { head: pal },
    { head: notPal },
  ],
  answer: {
    approach: [
      "Find the middle with slow and fast pointers.",
      "Reverse the second half of the list in place.",
      "Walk the first half and the reversed second half together, comparing values.",
      "(Optionally reverse the second half back to restore the list.)",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function isPalindrome(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    let prev = null;
    while (slow) {
        const next = slow.next;
        slow.next = prev;
        prev = slow;
        slow = next;
    }
    let a = head, b = prev;
    while (b) {
        if (a.val !== b.val) return false;
        a = a.next;
        b = b.next;
    }
    return true;
}`,
    python: `class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        prev = None
        while slow:
            slow.next, prev, slow = prev, slow, slow.next
        a, b = head, prev
        while b:
            if a.val != b.val:
                return False
            a, b = a.next, b.next
        return True`,
  },
};
