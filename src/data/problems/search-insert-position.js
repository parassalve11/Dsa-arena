import { distinctInts } from "../gen.js";

const big = distinctInts(10000, -10000, 10000, 5).sort((a, b) => a - b);

export default {
  slug: "search-insert-position",
  description: `Given a sorted array of **distinct** integers \`nums\` and a \`target\` value, return the index of \`target\` if it is found.

If it is not found, return the index where it **would be inserted** to keep the array sorted.

Your algorithm must run in **O(log n)** time.`,
  examples: [
    { input: { nums: [1, 3, 5, 6], target: 5 }, explanation: "5 is found at index 2." },
    { input: { nums: [1, 3, 5, 6], target: 2 }, explanation: "2 would go between 1 and 3, at index 1." },
    { input: { nums: [1, 3, 5, 6], target: 7 }, explanation: "7 is larger than everything, so it goes at the end, index 4." },
  ],
  constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i], target <= 10^4", "nums contains distinct values sorted in ascending order."],
  harness: { fn: "searchInsert", params: { nums: "int[]", target: "int" }, returns: "int" },
  tests: [
    { nums: [1], target: 0 },
    { nums: [1], target: 1 },
    { nums: [1], target: 2 },
    { nums: [1, 3, 5, 6], target: 0 },
    { nums: [1, 3, 5, 6], target: 6 },
    { nums: [1, 3, 5, 6], target: 4 },
    { nums: [1, 3], target: 2 },
    { nums: [-10000, 10000], target: 0 },
    { nums: [-3, -1, 4, 8, 12], target: -2 },
    { nums: [2, 4, 6, 8], target: 9 },
    { nums: [2, 4, 6, 8], target: 1 },
    { nums: [10, 20, 30, 40, 50], target: 35 },
    { nums: big, target: big[5000] },
    { nums: big, target: big[5000] + 1 },
    { nums: big, target: 10001 },
  ],
  answer: {
    approach: [
      "This is a 'lower bound' search: find the first index whose value is >= target.",
      "Keep lo = 0 and hi = n (one past the end).",
      "While lo < hi, take mid. If nums[mid] < target, the answer is to the right (lo = mid + 1). Otherwise mid could be the answer (hi = mid).",
      "When the loop ends, lo is the answer: either the target's index or where it should be inserted.",
    ],
    time: "O(log n)",
    space: "O(1)",
    javascript: `function searchInsert(nums, target) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    python: `class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo`,
  },
};
