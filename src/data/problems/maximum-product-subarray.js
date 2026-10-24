import { ints } from "../gen.js";

// Values in {-2,-1,0,1,2} with zeros sprinkled in keep every product small.
function big(n, seed) {
  return ints(n, -2, 2, seed).map((x, i) => (i % 25 === 0 ? 0 : x));
}

export default {
  slug: "maximum-product-subarray",
  description: `Given an integer array \`nums\`, find a **contiguous subarray** (at least one element) with the **largest product**, and return that product.

The answer fits in a 32-bit integer.`,
  examples: [
    { input: { nums: [2, 3, -2, 4] }, explanation: "[2,3] has the largest product, 6." },
    { input: { nums: [-2, 0, -1] }, explanation: "The best is 0. [-2,-1] isn't contiguous, because 0 sits between them." },
    { input: { nums: [-2, 3, -4] }, explanation: "Two negatives make a positive: -2 × 3 × -4 = 24." },
  ],
  constraints: ["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10", "Every prefix or suffix product fits in a 32-bit integer."],
  harness: { fn: "maxProduct", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [-2] },
    { nums: [0] },
    { nums: [3] },
    { nums: [-2, -3] },
    { nums: [0, 2] },
    { nums: [-1, -1, -1] },
    { nums: [2, -5, -2, -4, 3] },
    { nums: [-4, -3, -2] },
    { nums: [1, 0, -1, 2, 3, -5, -2] },
    { nums: [6, -3, -10, 0, 2] },
    { nums: [-2, 0, -1, 0, -3] },
    { nums: [10, -10, 10, -10, 10] },
    { nums: big(20000, 1) },
    { nums: big(20000, 2) },
  ],
  answer: {
    approach: [
      "A negative number turns the smallest product into the largest, so track both the max and the min product of a subarray ending at the current index.",
      "For each x: newMax = max(x, maxSoFar × x, minSoFar × x) and newMin = min(x, maxSoFar × x, minSoFar × x).",
      "Starting fresh at x handles zeros, which reset everything.",
      "Keep the best max seen overall.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function maxProduct(nums) {
    let hi = nums[0], lo = nums[0], best = nums[0];
    for (let i = 1; i < nums.length; i++) {
        const x = nums[i];
        const a = hi * x, b = lo * x;
        hi = Math.max(x, a, b);
        lo = Math.min(x, a, b);
        best = Math.max(best, hi);
    }
    return best + 0;
}`,
    python: `class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        hi = lo = best = nums[0]
        for x in nums[1:]:
            a, b = hi * x, lo * x
            hi, lo = max(x, a, b), min(x, a, b)
            best = max(best, hi)
        return best`,
  },
};
