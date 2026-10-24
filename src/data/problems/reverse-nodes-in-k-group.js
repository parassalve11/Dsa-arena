import { ints } from "../gen.js";

export default {
  slug: "reverse-nodes-in-k-group",
  description: `Given the \`head\` of a linked list, reverse the nodes of the list **\`k\` at a time** and return the changed list.

If the number of nodes left at the end is less than \`k\`, leave those nodes in their original order.

You may not change the node values, only the links between nodes.`,
  examples: [
    { input: { head: [1, 2, 3, 4, 5], k: 2 }, explanation: "Reverse [1,2] and [3,4]. 5 is left alone: [2,1,4,3,5]." },
    { input: { head: [1, 2, 3, 4, 5], k: 3 }, explanation: "Reverse [1,2,3]. Only 2 nodes remain, so they stay: [3,2,1,4,5]." },
    { input: { head: [1, 2, 3, 4], k: 4 }, explanation: "The whole list is one group: [4,3,2,1]." },
  ],
  constraints: ["The number of nodes is n.", "1 <= k <= n <= 5000", "0 <= Node.val <= 1000"],
  followUp: "Can you solve it with O(1) extra memory?",
  harness: { fn: "reverseKGroup", params: { head: "ListNode", k: "int" }, returns: "ListNode" },
  tests: [
    { head: [1], k: 1 },
    { head: [1, 2], k: 1 },
    { head: [1, 2], k: 2 },
    { head: [1, 2, 3], k: 2 },
    { head: [1, 2, 3, 4, 5, 6], k: 3 },
    { head: [1, 2, 3, 4, 5, 6, 7], k: 3 },
    { head: [1, 2, 3, 4, 5, 6, 7, 8], k: 4 },
    { head: [1, 2, 3, 4, 5], k: 5 },
    { head: [5, 4, 3, 2, 1], k: 2 },
    { head: [0, 0, 1, 1], k: 2 },
    { head: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], k: 7 },
    { head: [1000, 1, 1000, 1, 1000], k: 3 },
    { head: ints(5000, 0, 1000, 1), k: 7 },
    { head: ints(5000, 0, 1000, 2), k: 5000 },
    { head: ints(4999, 0, 1000, 3), k: 2 },
  ],
  answer: {
    approach: [
      "Use a dummy node before head and a pointer groupPrev to the node before the current group.",
      "From groupPrev, walk k steps to find the k-th node. If you run out of nodes, stop: the rest stays as it is.",
      "Reverse the k nodes of the group, then connect groupPrev to the new group head and the old group head (now the tail) to the node after the group.",
      "Move groupPrev to the group's new tail and repeat.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function reverseKGroup(head, k) {
    const dummy = new ListNode(0, head);
    let groupPrev = dummy;
    while (true) {
        let kth = groupPrev;
        for (let i = 0; i < k && kth; i++) kth = kth.next;
        if (!kth) break;
        const groupNext = kth.next;
        let prev = groupNext, cur = groupPrev.next;
        while (cur !== groupNext) {
            const next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        const oldHead = groupPrev.next;
        groupPrev.next = kth;
        groupPrev = oldHead;
    }
    return dummy.next;
}`,
    python: `class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next
            group_next = kth.next
            prev, cur = group_next, group_prev.next
            while cur is not group_next:
                cur.next, prev, cur = prev, cur, cur.next
            old_head = group_prev.next
            group_prev.next = kth
            group_prev = old_head`,
  },
};
