import { ints, range } from "../gen.js";

export default {
  slug: "best-time-to-buy-and-sell-stock",
  description: `You are given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`.

You may make **one** trade: pick one day to buy, then a **later** day to sell. Return the largest profit you can make. If no trade makes money, return \`0\`.`,
  examples: [
    { input: { prices: [7, 1, 5, 3, 6, 4] }, explanation: "Buy on day 1 at price 1 and sell on day 4 at price 6, for a profit of 5." },
    { input: { prices: [7, 6, 4, 3, 1] }, explanation: "Prices only fall, so the best choice is not to trade. Profit 0." },
    { input: { prices: [2, 4, 1] }, explanation: "Buy at 2 and sell at 4. Buying at 1 is too late, since no day comes after it." },
  ],
  constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
  harness: { fn: "maxProfit", params: { prices: "int[]" }, returns: "int" },
  tests: [
    { prices: [1] },
    { prices: [1, 2] },
    { prices: [2, 1] },
    { prices: [3, 3, 3, 3] },
    { prices: [1, 2, 3, 4, 5] },
    { prices: [3, 2, 6, 5, 0, 3] },
    { prices: [2, 1, 2, 1, 0, 1, 2] },
    { prices: [0, 10000] },
    { prices: [10000, 0, 9999] },
    { prices: [4, 7, 1, 2] },
    { prices: [1, 4, 2, 11, 1, 20] },
    { prices: [9, 8, 7, 1, 2] },
    { prices: ints(100000, 0, 10000, 3) },
    { prices: range(100000).map((i) => 100000 - i) },
  ],
  answer: {
    approach: [
      "Scan the prices from left to right and remember the cheapest price seen so far.",
      "On each day, pretend you sell today: the profit would be today's price minus that cheapest earlier price.",
      "Keep the best such profit. It starts at 0, which covers the case where no trade is worth doing.",
    ],
    time: "O(n)",
    space: "O(1)",
    javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let best = 0;
    for (const p of prices) {
        minPrice = Math.min(minPrice, p);
        best = Math.max(best, p - minPrice);
    }
    return best;
}`,
    python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float('inf')
        best = 0
        for p in prices:
            min_price = min(min_price, p)
            best = max(best, p - min_price)
        return best`,
  },
};
