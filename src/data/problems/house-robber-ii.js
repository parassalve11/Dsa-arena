import { ints } from "../gen.js";

export default {
  slug: "house-robber-ii",
  description: `Same as House Robber, but now the houses are arranged in a **circle**: the first house and the last house are neighbours.

\`nums[i]\` is the money in house \`i\`. You cannot rob two adjacent houses. Return the **maximum amount** you can rob.`,
  examples: [
    { input: { nums: [2, 3, 2] }, explanation: "Houses 0 and 2 are neighbours in the circle, so the best is just house 1: 3." },
    { input: { nums: [1, 2, 3, 1] }, explanation: "Rob houses 0 and 2: 1 + 3 = 4." },
    { input: { nums: [1, 2, 3] }, explanation: "Any two houses are neighbours here, so take the single best: 3." },
  ],
  constraints: ["1 <= nums.length <= 100 (tests go higher)", "0 <= nums[i] <= 1000"],
  harness: { fn: "rob", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [7] },
    { nums: [1, 2] },
    { nums: [0, 0] },
    { nums: [200, 3, 140, 20, 10] },
    { nums: [1, 3, 1, 3, 100] },
    { nums: [4, 1, 2, 7, 5, 3, 1] },
    { nums: [1000, 1, 1, 1000] },
    { nums: [2, 2, 4, 3, 2, 5] },
    { nums: [6, 6, 4, 8, 4, 3, 3, 10] },
    { nums: [5, 1, 1, 5] },
    { nums: [1, 1, 1] },
    { nums: [94, 40, 49, 65, 21, 21, 106, 80, 92, 81, 679, 4, 61, 6, 237, 12, 72, 74, 29, 95, 265, 35, 47, 1, 61, 397, 52, 72, 37, 51, 1, 81, 45, 435, 7, 36, 57, 86, 81, 72] },
    { nums: ints(10000, 0, 1000, 1) },
    { nums: [1000, ...ints(9998, 0, 10, 2), 1000] },
  ],
  answer: {
    approach: [
      "Because of the circle, you can't rob both the first and the last house.",
      "So solve the straight-line House Robber twice: once on houses 0..n-2 (skip the last) and once on houses 1..n-1 (skip the first).",
      "The answer is the larger of the two. With only one house, just return it.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function rob(nums) {
    if (nums.length === 1) return nums[0];
    const line = (lo, hi) => {
        let prev = 0, cur = 0;
        for (let i = lo; i <= hi; i++) [prev, cur] = [cur, Math.max(cur, prev + nums[i])];
        return cur;
    };
    return Math.max(line(0, nums.length - 2), line(1, nums.length - 1));
}`,
    python: `class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]

        def line(houses):
            prev = cur = 0
            for x in houses:
                prev, cur = cur, max(cur, prev + x)
            return cur

        return max(line(nums[:-1]), line(nums[1:]))`,
  },
};
