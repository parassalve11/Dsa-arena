import { ints } from "../gen.js";

export default {
  slug: "min-cost-climbing-stairs",
  description: `You are given an integer array \`cost\` where \`cost[i]\` is what you pay when you step on stair \`i\`. After paying, you can climb **one or two** steps.

You can start on stair \`0\` or stair \`1\`. Return the **minimum cost** to reach the top, which is one step past the last stair.`,
  examples: [
    { input: { cost: [10, 15, 20] }, explanation: "Start on stair 1, pay 15, and jump two steps to the top." },
    { input: { cost: [1, 100, 1, 1, 1, 100, 1, 1, 100, 1] }, explanation: "Step only on the cheap stairs: total 6." },
    { input: { cost: [0, 0] }, explanation: "Both starting stairs are free." },
  ],
  constraints: ["2 <= cost.length <= 1000", "0 <= cost[i] <= 999"],
  harness: { fn: "minCostClimbingStairs", params: { cost: "int[]" }, returns: "int" },
  tests: [
    { cost: [1, 2] },
    { cost: [5, 5] },
    { cost: [0, 1, 1, 0] },
    { cost: [1, 2, 3] },
    { cost: [3, 2, 1] },
    { cost: [10, 15, 20, 5] },
    { cost: [999, 999, 999] },
    { cost: [0, 0, 0, 0, 0] },
    { cost: [1, 100, 1, 100, 1] },
    { cost: [100, 1, 100, 1, 100] },
    { cost: [2, 7, 9, 3, 1, 4, 8] },
    { cost: [6, 5, 4, 3, 2, 1] },
    { cost: ints(1000, 0, 999, 1) },
    { cost: ints(999, 0, 10, 2) },
  ],
  answer: {
    approach: [
      "Let dp[i] be the cheapest cost to stand on stair i (before paying for it). dp[0] = dp[1] = 0.",
      "You reach stair i from i - 1 (paying cost[i-1]) or from i - 2 (paying cost[i-2]): dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]).",
      "The top is index n, so the answer is dp[n].",
      "Only the last two dp values are needed, so O(1) space is enough.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function minCostClimbingStairs(cost) {
    let a = 0, b = 0;
    for (let i = 2; i <= cost.length; i++) {
        [a, b] = [b, Math.min(b + cost[i - 1], a + cost[i - 2])];
    }
    return b;
}`,
    python: `class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        a = b = 0
        for i in range(2, len(cost) + 1):
            a, b = b, min(b + cost[i - 1], a + cost[i - 2])
        return b`,
  },
};
