import { distinctInts } from "../gen.js";

const big = distinctInts(10000, -9999, 9999, 2).sort((a, b) => a - b);

export default {
  slug: "binary-search",
  description: `Given an array of integers \`nums\` sorted in ascending order and an integer \`target\`, return the **index** of \`target\` in \`nums\`. If it is not there, return \`-1\`.

Your algorithm must run in **O(log n)** time.`,
  examples: [
    { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, explanation: "9 is at index 4." },
    { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, explanation: "2 is not in the array." },
    { input: { nums: [5], target: 5 }, explanation: "The only element matches." },
  ],
  constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All values in nums are unique.", "nums is sorted in ascending order."],
  harness: { fn: "search", params: { nums: "int[]", target: "int" }, returns: "int" },
  tests: [
    { nums: [5], target: -5 },
    { nums: [1, 2], target: 1 },
    { nums: [1, 2], target: 2 },
    { nums: [1, 2], target: 3 },
    { nums: [1, 3, 5, 7, 9], target: 1 },
    { nums: [1, 3, 5, 7, 9], target: 9 },
    { nums: [1, 3, 5, 7, 9], target: 4 },
    { nums: [-9999, 0, 9999], target: 0 },
    { nums: [-5, -4, -3, -2, -1], target: -3 },
    { nums: [2, 4, 6, 8, 10, 12], target: 13 },
    { nums: [2, 4, 6, 8, 10, 12], target: 0 },
    { nums: [10, 20, 30, 40], target: 30 },
    { nums: big, target: big[7777] },
    { nums: big, target: 10000 },
    { nums: big, target: big[0] },
  ],
  answer: {
    approach: [
      "Keep a search range [lo, hi], starting with the whole array.",
      "Look at the middle element. If it equals target, return its index.",
      "If it is smaller than target, the target can only be to the right: set lo = mid + 1. Otherwise set hi = mid - 1.",
      "If the range becomes empty, the target is not present: return -1.",
    ],
    time: "O(log n)",
    space: "O(1)",
    javascript: `function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1`,
  },
};
