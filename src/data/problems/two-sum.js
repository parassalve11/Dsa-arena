import { distinctInts } from "../gen.js";

// All values are multiples of 4 except a (≡ 1 mod 4) and b (≡ 2 mod 4), and
// target ≡ 3 mod 4, so a + b is the only pair that can reach it.
function bigCase(n, seed) {
  const nums = distinctInts(n, -2.4e8, 2.4e8, seed).map((x) => x * 4);
  const a = 4 * 12345 + 1;
  const b = -4 * 6789 + 2;
  nums[Math.floor(n * 0.37)] = a;
  nums[n - 3] = b;
  return { nums, target: a + b };
}

export default {
  slug: "two-sum",
  description: `You are given an array of integers \`nums\` and an integer \`target\`.

Find the **two different positions** in the array whose values add up to exactly \`target\`, and return those two indices.

Every input is built so that **exactly one pair** works, and you may not use the same element twice. The two indices can be returned in any order.`,
  examples: [
    { input: { nums: [2, 7, 11, 15], target: 9 }, explanation: "nums[0] + nums[1] = 2 + 7 = 9, so the answer is [0, 1]." },
    { input: { nums: [3, 2, 4], target: 6 }, explanation: "nums[1] + nums[2] = 2 + 4 = 6." },
    { input: { nums: [3, 3], target: 6 }, explanation: "Both 3s are used. They sit at different indices, so that is allowed." },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Exactly one valid answer exists.",
  ],
  followUp: "Can you do better than O(n²) time?",
  harness: { fn: "twoSum", params: { nums: "int[]", target: "int" }, returns: "int[]", compare: "unordered" },
  tests: [
    { nums: [1, 5], target: 6 },
    { nums: [0, 4, 3, 0], target: 0 },
    { nums: [-1, -2, -3, -4, -5], target: -8 },
    { nums: [-3, 4, 3, 90], target: 0 },
    { nums: [5, 75, 25], target: 100 },
    { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target: 19 },
    { nums: [10, 1, 2, 3, 4, 5, 6, 7, 8, 9], target: 19 },
    { nums: [1000000000, -1000000000, 7], target: 0 },
    { nums: [2, 5, 5, 11], target: 10 },
    { nums: [0, 0], target: 0 },
    { nums: [-10, 7, 19, 15], target: 9 },
    { nums: [1, 3, 4, 2], target: 6 },
    { nums: [3, 2, 95, 4, -3], target: 92 },
    bigCase(10000, 7),
    bigCase(10000, 11),
  ],
  answer: {
    approach: [
      "Walk through the array once, keeping a hash map from each value seen so far to its index.",
      "For the current number x, the partner it needs is target - x.",
      "If that partner is already in the map, you have found the pair: return [map[partner], i].",
      "Otherwise store x → i and move on. Checking before storing stops an element from pairing with itself.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(nums[i], i);
    }
    return [];
}`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []`,
  },
};
