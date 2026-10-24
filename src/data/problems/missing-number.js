import { range, shuffle } from "../gen.js";

function big(n, missing, seed) {
  return { nums: shuffle(range(n + 1).filter((x) => x !== missing), seed) };
}

export default {
  slug: "missing-number",
  description: `Given an array \`nums\` containing \`n\` **distinct** numbers taken from the range \`[0, n]\`, return the **only number in that range that is missing** from the array.`,
  examples: [
    { input: { nums: [3, 0, 1] }, explanation: "n = 3, so the range is 0..3. 2 is missing." },
    { input: { nums: [0, 1] }, explanation: "n = 2, range 0..2. 2 is missing." },
    { input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, explanation: "n = 9, range 0..9. 8 is missing." },
  ],
  constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All numbers are unique."],
  followUp: "Could you do it with O(1) extra space and O(n) time?",
  harness: { fn: "missingNumber", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [0] },
    { nums: [1] },
    { nums: [1, 2] },
    { nums: [2, 0] },
    { nums: [0, 2, 3] },
    { nums: [1, 2, 3, 4] },
    { nums: [4, 3, 2, 1, 0] },
    { nums: [5, 3, 0, 1, 2] },
    { nums: [6, 4, 2, 3, 5, 0] },
    { nums: [1, 3, 0] },
    { nums: [0, 1, 2, 3, 5] },
    { nums: [8, 7, 6, 5, 3, 2, 1, 0] },
    big(10000, 0, 1),
    big(10000, 10000, 2),
    big(10000, 4321, 3),
  ],
  answer: {
    approach: [
      "The numbers 0..n add up to n(n + 1) / 2. Subtract the sum of the array: what's left is the missing number.",
      "XOR version (no overflow worries in other languages): XOR every index 0..n with every value. Everything present cancels out, leaving the missing number.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function missingNumber(nums) {
    let x = nums.length;
    for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];
    return x;
}`,
    python: `class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        n = len(nums)
        return n * (n + 1) // 2 - sum(nums)`,
  },
};
