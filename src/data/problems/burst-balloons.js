import { ints } from "../gen.js";

export default {
  slug: "burst-balloons",
  description: `You have \`n\` balloons in a row, numbered \`0\` to \`n - 1\`. Balloon \`i\` has the number \`nums[i]\` painted on it.

When you burst balloon \`i\`, you earn \`nums[left] × nums[i] × nums[right]\` coins, where \`left\` and \`right\` are its **current** neighbours (the balloons next to it that haven't burst yet). If a neighbour doesn't exist, treat it as a balloon with \`1\` painted on it.

Burst all the balloons and return the **maximum coins** you can collect.`,
  examples: [
    { input: { nums: [3, 1, 5, 8] }, explanation: "Burst 1, 5, 3, 8 in that order: 3·1·5 + 3·5·8 + 1·3·8 + 1·8·1 = 167." },
    { input: { nums: [1, 5] }, explanation: "Burst 1 first (1·1·5 = 5) then 5 (1·5·1 = 5): 10." },
    { input: { nums: [7] }, explanation: "1·7·1 = 7." },
  ],
  constraints: ["n == nums.length", "1 <= n <= 300", "0 <= nums[i] <= 100"],
  harness: { fn: "maxCoins", params: { nums: "int[]" }, returns: "int" },
  tests: [
    { nums: [0] },
    { nums: [2, 3] },
    { nums: [1, 1, 1] },
    { nums: [9, 76, 64, 21] },
    { nums: [0, 0, 0] },
    { nums: [5, 0, 5] },
    { nums: [100, 100, 100] },
    { nums: [1, 2, 3, 4, 5] },
    { nums: [5, 4, 3, 2, 1] },
    { nums: [8, 2, 6, 8, 9, 8, 1, 4, 1, 5, 3, 0, 7, 7, 0, 4, 2, 2, 5] },
    { nums: [35, 16, 83, 87, 84, 59, 48, 41] },
    { nums: [7, 9, 8, 0, 7, 1, 3, 5, 5, 2, 3] },
    { nums: ints(120, 0, 100, 1) },
    { nums: ints(150, 0, 100, 2) },
  ],
  answer: {
    approach: [
      "Thinking about which balloon to burst first is hard, because the neighbours keep changing. Instead think about which balloon in a range is burst **last**.",
      "Pad the array with 1 at both ends. Let dp[l][r] be the best coins from bursting everything strictly between l and r.",
      "If k is the last balloon burst between l and r, its neighbours at that moment are l and r: dp[l][r] = max over k of dp[l][k] + nums[l]·nums[k]·nums[r] + dp[k][r].",
      "Fill dp by increasing range length. The answer is dp[0][n + 1].",
    ],
    time: "O(n³)",
    space: "O(n²)",
    javascript: `function maxCoins(nums) {
    const a = [1, ...nums, 1];
    const n = a.length;
    const dp = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let len = 2; len < n; len++) {
        for (let l = 0; l + len < n; l++) {
            const r = l + len;
            let best = 0;
            for (let k = l + 1; k < r; k++) {
                const v = dp[l][k] + a[l] * a[k] * a[r] + dp[k][r];
                if (v > best) best = v;
            }
            dp[l][r] = best;
        }
    }
    return dp[0][n - 1];
}`,
    python: `class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        a = [1] + nums + [1]
        n = len(a)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n):
            for l in range(n - length):
                r = l + length
                al, ar = a[l], a[r]
                row_l = dp[l]
                best = 0
                for k in range(l + 1, r):
                    v = row_l[k] + al * a[k] * ar + dp[k][r]
                    if v > best:
                        best = v
                row_l[r] = best
        return dp[0][n - 1]`,
  },
};
