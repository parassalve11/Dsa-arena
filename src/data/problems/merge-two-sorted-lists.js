import { sortedInts } from "../gen.js";

export default {
  slug: "merge-two-sorted-lists",
  description: `You are given the heads of two sorted linked lists, \`list1\` and \`list2\`.

Merge them into **one sorted list** by splicing together the nodes of the two lists, and return the head of the merged list.`,
  examples: [
    { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, explanation: "Taking the smaller head each time gives 1,1,2,3,4,4." },
    { input: { list1: [], list2: [] }, explanation: "Both lists are empty." },
    { input: { list1: [], list2: [0] }, explanation: "The result is just list2." },
  ],
  constraints: ["The number of nodes in both lists is in the range [0, 50] (tests go up to 5000).", "-100 <= Node.val <= 100", "Both lists are sorted in non-decreasing order."],
  harness: { fn: "mergeTwoLists", params: { list1: "ListNode", list2: "ListNode" }, returns: "ListNode" },
  tests: [
    { list1: [1], list2: [] },
    { list1: [2], list2: [1] },
    { list1: [1, 1, 1], list2: [1, 1] },
    { list1: [1, 3, 5], list2: [2, 4, 6] },
    { list1: [1, 2, 3], list2: [4, 5, 6] },
    { list1: [4, 5, 6], list2: [1, 2, 3] },
    { list1: [-100, 0, 100], list2: [-50, 50] },
    { list1: [5], list2: [1, 2, 3, 4] },
    { list1: [-3, -1], list2: [-2, -2, 0] },
    { list1: [0, 0, 0], list2: [0] },
    { list1: [1, 10, 20], list2: [2, 3, 4, 30] },
    { list1: [7], list2: [7] },
    { list1: sortedInts(5000, -100, 100, 1), list2: sortedInts(5000, -100, 100, 2) },
    { list1: sortedInts(4000, -100, 0, 3), list2: sortedInts(10, 0, 100, 4) },
  ],
  answer: {
    approach: [
      "Create a dummy node so the merged list always has a node to attach to.",
      "While both lists have nodes, attach the smaller head to the tail and advance that list.",
      "When one list runs out, attach the rest of the other list, which is already sorted.",
      "Return dummy.next.",
    ],
    time: "O(n + m)",
    space: "O(1)",
    javascript: `function mergeTwoLists(list1, list2) {
    const dummy = new ListNode(0);
    let tail = dummy;
    while (list1 && list2) {
        if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
        else { tail.next = list2; list2 = list2.next; }
        tail = tail.next;
    }
    tail.next = list1 || list2;
    return dummy.next;
}`,
    python: `class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = tail = ListNode(0)
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next`,
  },
};
