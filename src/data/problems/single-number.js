import { distinctInts, shuffle } from "../gen.js";

function big(pairs, seed) {
  const vals = distinctInts(pairs + 1, -30000, 30000, seed);
  return { nums: shuffle([...vals.slice(0, pairs), ...vals.slice(0, pairs), vals[pairs]], seed + 1) };
}

export default {
  slug: "single-number",
  description: `You are given a non-empty array of integers \`nums\`. **Every element appears twice except for one.** Find that single one.

Your solution must run in **linear time** and use only **constant extra space**.`,
  examples: [
    { input: { nums: [2, 2, 1] }, explanation: "2 appears twice, 1 appears once." },
    { input: { nums: [4, 1, 2, 1, 2] }, explanation: "Only 4 appears once." },
    { input: { nums: [1] }, explanation: "The only element." },
  ],
  constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Every element appears twice except one, which appears once."],
  harness: { fn: "singleNumber", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [0] },
    { nums: [-1] },
    { nums: [1, 0, 1] },
    { nums: [-1, -1, -2] },
    { nums: [7, 3, 5, 3, 7] },
    { nums: [30000, -30000, 30000] },
    { nums: [0, 1, 0] },
    { nums: [9, 8, 7, 9, 8] },
    { nums: [2, 2, 3, 3, 4] },
    { nums: [-5, 5, -5] },
    { nums: [12, 1, 12] },
    { nums: [6, 4, 6, 8, 8, 4, 10] },
    big(14999, 1),
    big(10000, 2),
  ],
  answer: {
    approach: [
      "XOR has two useful properties: x ^ x = 0 and x ^ 0 = x. It is also order-independent.",
      "XOR all the numbers together. Every pair cancels to 0.",
      "Only the single number is left.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function singleNumber(nums) {
    let x = 0;
    for (const n of nums) x ^= n;
    return x;
}`,
    python: `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        return reduce(lambda a, b: a ^ b, nums)`,
  },
};
