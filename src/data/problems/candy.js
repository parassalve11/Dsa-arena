import { ints } from "../gen.js";

export default {
  slug: "candy",
  description: `\`n\` children stand in a line, and each has a rating in \`ratings\`.

Give candies to the children so that:

- every child gets **at least one** candy, and
- a child with a **higher rating than a neighbour** gets **more candies than that neighbour**.

Return the **minimum total** number of candies.`,
  examples: [
    { input: { ratings: [1, 0, 2] }, explanation: "Give 2, 1 and 2 candies: 5 in total." },
    { input: { ratings: [1, 2, 2] }, explanation: "Give 1, 2 and 1. The third child has the same rating as the second, so it may get fewer." },
    { input: { ratings: [5] }, explanation: "One child gets one candy." },
  ],
  constraints: ["n == ratings.length", "1 <= n <= 2 * 10^4", "0 <= ratings[i] <= 2 * 10^4"],
  harness: { fn: "candy", params: { ratings: "int[]" }, returns: "int" },
  tests: [
    { ratings: [1, 1] },
    { ratings: [1, 2] },
    { ratings: [2, 1] },
    { ratings: [1, 2, 3, 4, 5] },
    { ratings: [5, 4, 3, 2, 1] },
    { ratings: [1, 3, 2, 2, 1] },
    { ratings: [1, 2, 87, 87, 87, 2, 1] },
    { ratings: [1, 3, 4, 5, 2] },
    { ratings: [1, 0, 1, 0, 1] },
    { ratings: [3, 3, 3, 3] },
    { ratings: [1, 6, 10, 8, 7, 3, 2] },
    { ratings: [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 4, 3] },
    { ratings: ints(20000, 0, 20000, 1) },
    { ratings: Array.from({ length: 20000 }, (_, i) => 20000 - i) },
    { ratings: Array.from({ length: 20000 }, (_, i) => Math.abs(10000 - i)) },
  ],
  answer: {
    approach: [
      "Give everyone 1 candy to start.",
      "Left to right: if ratings[i] > ratings[i - 1], set candies[i] = candies[i - 1] + 1. Now every child beats a lower-rated left neighbour.",
      "Right to left: if ratings[i] > ratings[i + 1], set candies[i] = max(candies[i], candies[i + 1] + 1). Taking the max keeps the left-neighbour rule satisfied too.",
      "Sum the candies.",
    ],
    time: "O(n)",
    space: "O(n)",
    javascript: `function candy(ratings) {
    const n = ratings.length;
    const c = new Array(n).fill(1);
    for (let i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
    for (let i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
    return c.reduce((a, b) => a + b, 0);
}`,
    python: `class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        c = [1] * n
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                c[i] = c[i - 1] + 1
        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                c[i] = max(c[i], c[i + 1] + 1)
        return sum(c)`,
  },
};
