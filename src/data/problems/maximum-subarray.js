import { ints } from "../gen.js";

export default {
  slug: "maximum-subarray",
  description: `Given an integer array \`nums\`, find the **contiguous subarray** (with at least one element) that has the largest sum, and return that sum.`,
  examples: [
    { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, explanation: "The subarray [4,-1,2,1] has the largest sum, 6." },
    { input: { nums: [1] }, explanation: "The only subarray is [1]." },
    { input: { nums: [5, 4, -1, 7, 8] }, explanation: "Taking the whole array gives 23." },
  ],
  constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
  followUp: "After the O(n) solution, try a divide-and-conquer one.",
  harness: { fn: "maxSubArray", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [-1] },
    { nums: [-3, -2, -5] },
    { nums: [0, 0, 0] },
    { nums: [1, 2, 3, 4] },
    { nums: [-2, -1] },
    { nums: [2, -1, 2] },
    { nums: [8, -19, 5, -4, 20] },
    { nums: [-10000, 10000, -10000] },
    { nums: [1, -1, 1, -1, 1] },
    { nums: [3, -4, 5, -1, 2, -6, 4] },
    { nums: [-2, 3, -1, 3, -2] },
    { nums: [10000, 10000, -1, 10000] },
    { nums: ints(100000, -10000, 10000, 2) },
    { nums: ints(100000, -10000, 9000, 3) },
  ],
  answer: {
    approach: [
      "Kadane's algorithm: walk through the array keeping the best sum of a subarray that ends at the current index.",
      "At each element x, either start fresh at x or extend the previous subarray: cur = max(x, cur + x).",
      "A negative running sum can never help a later subarray, which is why restarting is safe.",
      "Track the largest cur seen. That is the answer.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function maxSubArray(nums) {
    let cur = nums[0], best = nums[0];
    for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
}`,
    python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        cur = best = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)
            best = max(best, cur)
        return best`,
  },
};
