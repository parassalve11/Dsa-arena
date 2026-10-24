import { ints } from "../gen.js";

export default {
  slug: "partition-equal-subset-sum",
  description: `Given an integer array \`nums\`, return \`true\` if you can split it into **two subsets with equal sums**, or \`false\` otherwise.`,
  examples: [
    { input: { nums: [1, 5, 11, 5] }, explanation: "[1,5,5] and [11] both sum to 11." },
    { input: { nums: [1, 2, 3, 5] }, explanation: "The total is 11, which is odd, so it can't be split evenly." },
    { input: { nums: [2, 2] }, explanation: "[2] and [2]." },
  ],
  constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
  harness: { fn: "canPartition", params: { nums: "int[]" }, returns: "bool" },
  tests: [
    { nums: [1] },
    { nums: [1, 1] },
    { nums: [1, 2] },
    { nums: [3, 3, 3, 4, 5] },
    { nums: [1, 2, 5] },
    { nums: [2, 2, 3, 5] },
    { nums: [100, 100, 100, 100, 100, 100, 100, 100] },
    { nums: [1, 1, 1, 1, 1, 1, 1] },
    { nums: [14, 9, 8, 4, 3, 2] },
    { nums: [1, 3, 4, 4] },
    { nums: [23, 13, 11, 7, 6, 5, 5] },
    { nums: [99, 1] },
    { nums: ints(200, 1, 100, 1) },
    { nums: [...ints(199, 1, 100, 2).map((x) => x * 2), 1] },
    { nums: [...new Array(199).fill(100), 99] },
  ],
  answer: {
    approach: [
      "If the total sum is odd, return false. Otherwise you need a subset that sums to half = total / 2.",
      "This is a 0/1 knapsack: dp[x] is true if some subset sums to x. Start with dp[0] = true.",
      "For each number, update dp from high to low: dp[x] = dp[x] || dp[x - num]. Going downwards makes sure each number is used at most once.",
      "Answer dp[half]. A bitset (BigInt / Python int) can do the same with shifts: bits |= bits << num.",
    ],
    time: "O(n · sum)",
    space: "O(sum)",
    javascript: `function canPartition(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2) return false;
    const half = total / 2;
    const dp = new Array(half + 1).fill(false);
    dp[0] = true;
    for (const x of nums) {
        for (let s = half; s >= x; s--) if (dp[s - x]) dp[s] = true;
    }
    return dp[half];
}`,
    python: `class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        bits = 1
        for x in nums:
            bits |= bits << x
        return (bits >> (total // 2)) & 1 == 1`,
  },
};
