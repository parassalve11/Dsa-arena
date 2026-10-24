import { ints } from "../gen.js";

export default {
  slug: "kth-largest-element-in-an-array",
  description: `Given an integer array \`nums\` and an integer \`k\`, return the **\`k\`-th largest element** in the array.

This means the \`k\`-th largest in sorted order, not the \`k\`-th distinct value: in \`[3,3,2]\` the 2nd largest is 3.

Can you solve it without fully sorting the array?`,
  examples: [
    { input: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, explanation: "Sorted descending: 6, 5, 4, … The 2nd largest is 5." },
    { input: { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 }, explanation: "Sorted descending: 6, 5, 5, 4, … The 4th is 4." },
    { input: { nums: [1], k: 1 }, explanation: "Only one element." },
  ],
  constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
  harness: { fn: "findKthLargest", params: { nums: "int[]", k: "int" }, returns: "int" },
  tests: [
    { nums: [2, 1], k: 1 },
    { nums: [2, 1], k: 2 },
    { nums: [5, 5, 5], k: 2 },
    { nums: [-1, -1], k: 2 },
    { nums: [7, 6, 5, 4, 3, 2, 1], k: 5 },
    { nums: [1, 2, 3, 4, 5, 6, 7], k: 1 },
    { nums: [3, 1, 2, 4], k: 2 },
    { nums: [99, 99], k: 1 },
    { nums: [-10000, 10000, 0], k: 3 },
    { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6, 7, 7, 8, 2, 3, 1, 1, 1, 10, 11, 5, 6, 2, 4, 7, 8, 5, 6], k: 20 },
    { nums: [2, 2, 2, 1, 1, 1], k: 4 },
    { nums: [0, 0, 0, 0, 1], k: 1 },
    { nums: ints(100000, -10000, 10000, 1), k: 50000 },
    { nums: new Array(100000).fill(1), k: 77777 },
    { nums: Array.from({ length: 100000 }, (_, i) => i - 50000).map((x) => Math.max(-10000, Math.min(10000, x))), k: 1 },
  ],
  answer: {
    approach: [
      "Keep a min-heap of size k holding the k largest values seen so far.",
      "Push each number. If the heap grows past k, pop its smallest element.",
      "After all numbers, the heap's top (its smallest) is the k-th largest overall.",
      "Quickselect gives O(n) average time; counting sort works too since values are bounded.",
    ],
    time: "O(n log k)",
    space: "O(k)",
    javascript: `function findKthLargest(nums, k) {
    // Values are in [-10^4, 10^4], so counting is simple and O(n).
    const OFFSET = 10000;
    const count = new Array(20001).fill(0);
    for (const x of nums) count[x + OFFSET]++;
    for (let v = 20000; v >= 0; v--) {
        k -= count[v];
        if (k <= 0) return v - OFFSET;
    }
    return -1;
}`,
    python: `class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = []
        for x in nums:
            heappush(heap, x)
            if len(heap) > k:
                heappop(heap)
        return heap[0]`,
  },
};
