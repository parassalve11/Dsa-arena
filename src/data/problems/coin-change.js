export default {
  slug: "coin-change",
  description: `You are given coin denominations \`coins\` and a total \`amount\` of money.

Return the **fewest number of coins** needed to make up exactly \`amount\`. If it can't be done, return \`-1\`.

You have an unlimited number of coins of each kind.`,
  examples: [
    { input: { coins: [1, 2, 5], amount: 11 }, explanation: "11 = 5 + 5 + 1, which is 3 coins." },
    { input: { coins: [2], amount: 3 }, explanation: "With only 2s you can't make an odd amount." },
    { input: { coins: [1], amount: 0 }, explanation: "An amount of 0 needs no coins." },
  ],
  constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
  harness: { fn: "coinChange", params: { coins: "int[]", amount: "int" }, returns: "int" },
  tests: [
    { coins: [1], amount: 1 },
    { coins: [1], amount: 2 },
    { coins: [2], amount: 1 },
    { coins: [5], amount: 0 },
    { coins: [2, 5, 10, 1], amount: 27 },
    { coins: [186, 419, 83, 408], amount: 6249 },
    { coins: [3, 7, 405, 436], amount: 8839 },
    { coins: [1, 3, 4], amount: 6 },
    { coins: [2147483647], amount: 2 },
    { coins: [7, 11], amount: 13 },
    { coins: [9, 6, 5, 1], amount: 11 },
    { coins: [474, 83, 404, 3], amount: 264 },
    { coins: [1, 2, 5], amount: 10000 },
    { coins: [411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422], amount: 9864 },
    { coins: [3, 7], amount: 9998 },
  ],
  answer: {
    approach: [
      "Let dp[x] be the fewest coins that make amount x. dp[0] = 0, and everything else starts at ∞.",
      "For each amount x from 1 to amount, try every coin c <= x: dp[x] = min(dp[x], dp[x - c] + 1).",
      "Greedy (always take the biggest coin) does not work in general, for example coins [1,3,4] and amount 6.",
      "Return dp[amount], or -1 if it is still ∞.",
    ],
    time: "O(amount · coins)",
    space: "O(amount)",
    javascript: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let x = 1; x <= amount; x++) {
        for (const c of coins) {
            if (c <= x && dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1;
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    python: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        INF = amount + 1
        dp = [0] + [INF] * amount
        for c in coins:
            for x in range(c, amount + 1):
                if dp[x - c] + 1 < dp[x]:
                    dp[x] = dp[x - c] + 1
        return -1 if dp[amount] == INF else dp[amount]`,
  },
};
