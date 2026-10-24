import { ints } from "../gen.js";

export default {
  slug: "target-sum",
  description: `You are given an integer array \`nums\` and an integer \`target\`.

Build an expression by putting either a \`+\` or a \`-\` in front of **every** number and then adding them all up. For example, with \`nums = [2, 1]\` you can build \`+2-1\`.

Return the **number of different expressions** that evaluate to \`target\`.`,
  examples: [
    { input: { nums: [1, 1, 1, 1, 1], target: 3 }, explanation: "Choose which one of the five 1s gets a minus sign: 5 ways." },
    { input: { nums: [1], target: 1 }, explanation: "Only +1." },
    { input: { nums: [1, 2, 3], target: 0 }, explanation: "+1+2-3 and -1-2+3." },
  ],
  constraints: ["1 <= nums.length <= 20", "0 <= nums[i] <= 1000", "0 <= sum(nums) <= 1000", "-1000 <= target <= 1000"],
  harness: { fn: "findTargetSumWays", params: { nums: "int[]", target: "int" }, returns: "int" },
  tests: [
    { nums: [1], target: 2 },
    { nums: [0], target: 0 },
    { nums: [0, 0, 0], target: 0 },
    { nums: [1, 0], target: 1 },
    { nums: [2, 3], target: -1 },
    { nums: [1, 2, 1], target: 0 },
    { nums: [7, 9, 3, 8, 0, 2, 4, 8, 3, 9], target: 0 },
    { nums: [1000], target: -1000 },
    { nums: [1, 1, 1, 1, 1], target: 6 },
    { nums: [5, 3, 2, 1, 4], target: 5 },
    { nums: [10, 20, 30], target: 60 },
    { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target: 5 },
    { nums: new Array(20).fill(1), target: 0 },
    { nums: ints(20, 0, 50, 1), target: 12 },
    { nums: [...new Array(10).fill(0), 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target: 15 },
  ],
  answer: {
    approach: [
      "Split the numbers into a plus group P and a minus group N. Then sum(P) - sum(N) = target and sum(P) + sum(N) = total.",
      "Adding the two: sum(P) = (target + total) / 2. If that isn't a non-negative whole number, the answer is 0.",
      "Now count the subsets that sum to that value with a 0/1 knapsack: dp[0] = 1, and for each number update dp[s] += dp[s - num] from high s to low.",
      "Zeros double the count automatically (each zero can be + or -).",
    ],
    time: "O(n · total)",
    space: "O(total)",
    javascript: `function findTargetSumWays(nums, target) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (Math.abs(target) > total || (target + total) % 2) return 0;
    const goal = (target + total) / 2;
    const dp = new Array(goal + 1).fill(0);
    dp[0] = 1;
    for (const x of nums) {
        for (let s = goal; s >= x; s--) dp[s] += dp[s - x];
    }
    return dp[goal];
}`,
    python: `class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        ways = Counter({0: 1})
        for x in nums:
            nxt = Counter()
            for s, c in ways.items():
                nxt[s + x] += c
                nxt[s - x] += c
            ways = nxt
        return ways[target]`,
  },
};
