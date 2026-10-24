import { sortedInts } from "../gen.js";

const big = sortedInts(100000, -1000, 1000, 3);

export default {
  slug: "find-first-and-last-position-of-element-in-sorted-array",
  description: `Given an array of integers \`nums\` sorted in non-decreasing order, find the **first and last positions** of a given \`target\` value.

Return \`[first, last]\`, or \`[-1, -1]\` if \`target\` is not in the array.

Your algorithm must run in **O(log n)** time.`,
  examples: [
    { input: { nums: [5, 7, 7, 8, 8, 10], target: 8 }, explanation: "8 appears at indices 3 and 4." },
    { input: { nums: [5, 7, 7, 8, 8, 10], target: 6 }, explanation: "6 is not in the array." },
    { input: { nums: [], target: 0 }, explanation: "The array is empty." },
  ],
  constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i], target <= 10^9", "nums is sorted in non-decreasing order."],
  harness: { fn: "searchRange", params: { nums: "int[]", target: "int" }, returns: "int[]" },
  tests: [
    { nums: [1], target: 1 },
    { nums: [1], target: 2 },
    { nums: [2, 2], target: 2 },
    { nums: [1, 2, 3], target: 2 },
    { nums: [1, 1, 1, 1, 1], target: 1 },
    { nums: [1, 2, 2, 2, 3], target: 2 },
    { nums: [1, 2, 3, 4], target: 1 },
    { nums: [1, 2, 3, 4], target: 4 },
    { nums: [1, 3, 5], target: 4 },
    { nums: [-5, -5, 0, 0, 0, 7], target: 0 },
    { nums: [-1000000000, 1000000000], target: 1000000000 },
    { nums: [3, 3, 3], target: 4 },
    { nums: big, target: big[50000] },
    { nums: big, target: 1001 },
    { nums: new Array(100000).fill(7), target: 7 },
  ],
  answer: {
    approach: [
      "Run two binary searches.",
      "The first finds the lowest index with nums[i] >= target (lower bound).",
      "The second finds the lowest index with nums[i] > target (upper bound). The last position is that index minus 1.",
      "If the lower bound is out of range or nums[lower] != target, return [-1, -1].",
    ],
    time: "O(log n)",
    space: "O(1)",
    javascript: `function searchRange(nums, target) {
    const bound = (strict) => {
        let lo = 0, hi = nums.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (nums[mid] < target || (strict && nums[mid] === target)) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    };
    const first = bound(false);
    if (first === nums.length || nums[first] !== target) return [-1, -1];
    return [first, bound(true) - 1];
}`,
    python: `class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        first = bisect_left(nums, target)
        if first == len(nums) or nums[first] != target:
            return [-1, -1]
        return [first, bisect_right(nums, target) - 1]`,
  },
};
