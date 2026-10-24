import { sortedInts } from "../gen.js";

const many = Array.from({ length: 1000 }, (_, i) => sortedInts(10, -10000, 10000, i + 1));
const few = Array.from({ length: 10 }, (_, i) => sortedInts(1000, -10000, 10000, i + 5000));

export default {
  slug: "merge-k-sorted-lists",
  description: `You are given an array of \`k\` linked lists, \`lists\`. Each list is sorted in ascending order.

Merge all of them into **one sorted linked list** and return it.`,
  examples: [
    { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, explanation: "Merging all three gives [1,1,2,3,4,4,5,6]." },
    { input: { lists: [] }, explanation: "There are no lists." },
    { input: { lists: [[]] }, explanation: "One empty list." },
  ],
  constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4", "Each list is sorted in ascending order.", "The total number of nodes is at most 10^4."],
  harness: { fn: "mergeKLists", params: { lists: "ListNode[]" }, returns: "ListNode" },
  tests: [
    { lists: [[], []] },
    { lists: [[1]] },
    { lists: [[], [1]] },
    { lists: [[2], [1]] },
    { lists: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
    { lists: [[7, 8, 9], [4, 5, 6], [1, 2, 3]] },
    { lists: [[1, 1, 1], [1, 1], [1]] },
    { lists: [[-10000, 10000], [0]] },
    { lists: [[1, 5, 9], [2, 6], [3, 7, 10], [4, 8]] },
    { lists: [[], [], [3], [], [1, 2]] },
    { lists: [[-5, -1], [-3, 0, 2], [-4, 1]] },
    { lists: [[0], [0], [0], [0], [0]] },
    { lists: many },
    { lists: few },
  ],
  answer: {
    approach: [
      "Divide and conquer: merge the lists in pairs, like the merge step of merge sort.",
      "Pair up list 0 with 1, 2 with 3, and so on, merging each pair with the two-list merge. This halves the number of lists.",
      "Repeat until one list remains. Each round touches every node once, and there are log k rounds.",
      "A min-heap holding the current head of each list works too: pop the smallest, push its next.",
    ],
    time: "O(N log k), where N is the total number of nodes",
    space: "O(1) extra (or O(k) for the heap version)",
    javascript: `function mergeKLists(lists) {
    const mergeTwo = (a, b) => {
        const dummy = new ListNode(0);
        let tail = dummy;
        while (a && b) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a || b;
        return dummy.next;
    };
    if (lists.length === 0) return null;
    while (lists.length > 1) {
        const next = [];
        for (let i = 0; i < lists.length; i += 2) {
            next.push(i + 1 < lists.length ? mergeTwo(lists[i], lists[i + 1]) : lists[i]);
        }
        lists = next;
    }
    return lists[0];
}`,
    python: `class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        heap = []
        for i, node in enumerate(lists):
            if node:
                heappush(heap, (node.val, i, node))
        dummy = tail = ListNode(0)
        while heap:
            _, i, node = heappop(heap)
            tail.next = node
            tail = node
            if node.next:
                heappush(heap, (node.next.val, i, node.next))
        return dummy.next`,
  },
};
